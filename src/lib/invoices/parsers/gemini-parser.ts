import { GoogleGenAI, Type } from '@google/genai';
import { ParsedInvoiceItem } from '../types';
import { isNonExpensePhrase, resolveCategory } from './utils';

export async function parseWithGemini(
  rawText: string,
  pdfBuffer: Buffer,
  detectedBank: string,
  invoiceYear: number,
  invoiceMonth: number,
  defaultInvoiceDate: string,
  availableCategories?: { id: string; name: string }[]
): Promise<ParsedInvoiceItem[] | null> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey || apiKey.trim().length <= 10) {
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
    const promptText = `Você é um extrator especialista de faturas de cartão de crédito brasileiras.
Analise a fatura abaixo e extraia TODOS os lançamentos da seção "Lançamentos atuais / Lançamentos: compras e saques" desta fatura.

Regras Estritas de Extração:
- Retorne um array JSON com cada lançamento individual da fatura.
- EXTRAIA APENAS a seção de lançamentos atuais cobrados nesta fatura.
- NÃO TENTE CATEGORIZAR os lançamentos. Apenas extraia os dados brutos.
- DESCONSIDERE E IGNORE TOTALMENTE (NÃO INCLUA NO JSON):
  * A tabela/seção "Compras parceladas - próximas faturas" (parcelas a vencer nos próximos meses/próximas faturas).
  * Pagamentos da fatura anterior (ex: "PAGAMENTO EFETUADO", "PAGTO DEBITO AUTOMATICO").
  * Linhas de totais, subtotais ou resumos por cartão (ex: "TOTAL DA FATURA", "TOTAL DOS LANÇAMENTOS ATUAIS").
  * Resumos de limites, saldos anteriores ou encargos.
- Cancelamentos e Estornos: Se um lançamento for um cancelamento, estorno ou devolução (ex: "CANCELAMENTO PARCIAL", "ESTORNO"), RETORNE O VALOR NEGATIVO em Reais (ex: -104.31, -72.26).
- Compras: Para compras normais, retorne o valor positivo em Reais (ex: 45.90).
- Banco: Identifique a instituição emissora (ex: "Itaú", "Mercado Pago", "Nubank", "Bradesco", "C6 Bank", "Inter").
- Parcela: Extraia a parcela no formato "XX/YY" se houver (ex: "01/10", "05/06", "03/12").
- REGRAS ESTREITAS DE DATA DE FLUXO DE CAIXA:
  1. COMPRAS PARCELADAS (quando houver parcela XX/YY ex: "05/06", "04/07", "02/03"):
     - A data DEVE SER O MÊS DE REFERÊNCIA DA FATURA ("${defaultInvoiceDate}"). NUNCA use a data de meses atrás em que a compra foi realizada (ex: "27/01").
  2. COMPRAS À VISTA DO CICLO (quando NÃO houver parcela):
     - A data DEVE SER A DATA REAL EM QUE A COMPRA FOI REALIZADA como impressa na linha da fatura (ex: "18/06" -> "${invoiceYear}-06-18", "30/05" -> "${invoiceYear}-05-30").
- Descrição: Nome limpo do estabelecimento (ex: "CANCELAMENTO PARCIAL DE", "CLICKBUS", "VANS").

Conteúdo da fatura (texto):
${rawText ? rawText.slice(0, 15000) : 'Analise o arquivo PDF anexo.'}`;

    const contents: any[] = [{ text: promptText }];

    // Only attach base64 PDF if text extraction yielded empty/minimal text
    if (!rawText || rawText.trim().length < 50) {
      contents.push({
        inlineData: {
          mimeType: 'application/pdf',
          data: pdfBuffer.toString('base64'),
        },
      });
    }

    const propertiesSchema: Record<string, any> = {
      date: { type: Type.STRING, description: 'Data YYYY-MM-DD (mês de referência para parcelas, data real para compras à vista)' },
      description: { type: Type.STRING, description: 'Descrição da compra' },
      amount: { type: Type.NUMBER, description: 'Valor em reais. Use valor positivo para compras e NEGATIVO para cancelamentos/estornos (ex: -104.31).' },
      bank: { type: Type.STRING, description: 'Nome do banco emissor (ex: Itaú, Mercado Pago, Nubank)', nullable: true },
      installment: { type: Type.STRING, description: 'Parcela XX/YY ou null', nullable: true },
    };

    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          description: 'Lista de compras da fatura com parcelas, bancos e categorias',
          items: {
            type: Type.OBJECT,
            properties: propertiesSchema,
            required: ['date', 'description', 'amount'],
          },
        },
      },
    });

    if (response.text) {
      const parsed = JSON.parse(response.text);
      if (Array.isArray(parsed) && parsed.length > 0) {
        console.log('[PDF Parser] ✅ Extraído via Gemini Flash:', parsed.length, 'itens (antes do filtro)');

        const filtered = parsed
          .filter((item: any) => {
            const desc = String(item.description || '');
            const numAmt = Number(item.amount) || 0;
            if (numAmt === 0) return false;
            if (isNonExpensePhrase(desc)) return false;
            return true;
          })
          .map((item: any, index: number) => {
            const inst = item.installment ? String(item.installment).trim() : null;

            let itemDate = item.date || defaultInvoiceDate;
            if (inst && inst.includes('/')) {
              itemDate = defaultInvoiceDate;
            }

            return {
              id: `pdf-${index}-${Date.now()}`,
              date: itemDate,
              description: String(item.description || 'Compra sem descrição').trim(),
              amount: Number(item.amount),
              bank: item.bank ? String(item.bank).trim() : detectedBank,
              installment: inst,
              categoryId: null,
              categoryName: null,
              provenance: undefined,
              confidence: undefined,
            };
          });

        return filtered;
      }
    }
  } catch (err: unknown) {
    const errorMsg = (err as Error).message || String(err);
    if (errorMsg.includes('429') || errorMsg.includes('RESOURCE_EXHAUSTED')) {
      console.log('[PDF Parser] ℹ️ Cota da API do Gemini atingida. Utilizando parser local.');
    } else {
      console.log('[PDF Parser] ℹ️ Erro na API Gemini, utilizando parser local. Detalhes:', errorMsg);
    }
  }
  return null;
}
