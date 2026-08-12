import { ParsedInvoiceItem } from './types';
import { extractTextWithPdfJs } from './parsers/pdf-extractor';
import { parseWithGemini } from './parsers/gemini-parser';
import { fallbackProximityParser } from './parsers/local-parser';
import { detectBankFromText } from './parsers/utils';

export type { ParsedInvoiceItem };
export { detectBankFromText };

export async function parsePdfInvoice(
  pdfBuffer: Buffer,
  availableCategories?: { id: string; name: string }[]
): Promise<ParsedInvoiceItem[]> {
  const rawText = await extractTextWithPdfJs(pdfBuffer);
  const detectedBank = detectBankFromText(rawText);

  let invoiceYear = new Date().getFullYear();
  let invoiceMonth = new Date().getMonth() + 1; // 1-12

  const headerDateMatch = rawText.match(/(?:vencimento|vence em|emitida em|fatura de)[\s\:]*(\d{2})\/(\d{2})\/(\d{4})/i);
  if (headerDateMatch) {
    const dueDay = parseInt(headerDateMatch[1], 10);
    let dueMonth = parseInt(headerDateMatch[2], 10);
    let dueYear = parseInt(headerDateMatch[3], 10);

    if (dueDay <= 10) {
      dueMonth = dueMonth - 1;
      if (dueMonth === 0) {
        dueMonth = 12;
        dueYear = dueYear - 1;
      }
    }
    invoiceMonth = dueMonth;
    invoiceYear = dueYear;
  }

  const defaultInvoiceDate = `${invoiceYear}-${String(invoiceMonth).padStart(2, '0')}-01`;

  console.log(`[PDF Parser] Texto extraído (${rawText.length} chars). Banco: ${detectedBank}, Mês de Referência da Fatura: ${defaultInvoiceDate}`);

  const geminiItems = await parseWithGemini(
    rawText,
    pdfBuffer,
    detectedBank,
    invoiceYear,
    invoiceMonth,
    defaultInvoiceDate,
    availableCategories
  );

  if (geminiItems && geminiItems.length > 0) {
    console.log('[PDF Parser] --- ITENS EXTRAÍDOS VIA GEMINI (Total:', geminiItems.length, ') ---');
    let totalSum = 0;
    geminiItems.forEach((i, idx) => {
      totalSum += i.amount;
      console.log(`${idx + 1}. [${i.date}] ${i.description} | R$ ${i.amount.toFixed(2)} | Parcela: ${i.installment}`);
    });
    console.log(`[PDF Parser] 💵 SOMA TOTAL DOS LANÇAMENTOS: R$ ${totalSum.toFixed(2)}`);
    return geminiItems;
  }

  // Fallback
  const localItems = fallbackProximityParser(rawText, detectedBank);
  console.log('[PDF Parser] ✅ Extraído via Parser Local:', localItems.length, 'itens');
  return localItems;
}
