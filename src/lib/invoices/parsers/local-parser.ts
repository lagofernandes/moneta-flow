import { ParsedInvoiceItem } from '../types';
import { isNonExpensePhrase } from './utils';

/**
 * Ultra-robust proximity-based parser for Brazilian bank invoices.
 * Only matches transaction-line patterns: DD/MM  MERCHANT_NAME  R$ XX,YY
 * Skips dates that are part of DD/MM/YYYY (header dates like vencimento, emissão, etc.)
 */
export function fallbackProximityParser(text: string, bankName = 'Outros'): ParsedInvoiceItem[] {
  const items: ParsedInvoiceItem[] = [];
  if (!text) return items;

  let invoiceYear = new Date().getFullYear();
  let invoiceMonth = new Date().getMonth() + 1; // 1-12

  // Detect invoice reference due date from header text (e.g. Vencimento: 01/07/2026)
  const headerDateMatch = text.match(/(?:vencimento|vence em|emitida em|fatura de)[\s\:]*(\d{2})\/(\d{2})\/(\d{4})/i);
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

  const dateRegex = /\b(\d{2}\/\d{2})(?!\/\d{2,4})\b/g;
  let dateMatch: RegExpExecArray | null;

  let count = 0;
  const processedMatches = new Set<string>();

  while ((dateMatch = dateRegex.exec(text)) !== null) {
    const dateStr = dateMatch[1];
    const startIndex = dateMatch.index + dateMatch[0].length;
    const restOfText = text.slice(startIndex, startIndex + 150);
    const lineEndMatch = restOfText.match(/[\r\n]/);
    const snippet = lineEndMatch ? restOfText.slice(0, lineEndMatch.index) : restOfText;

    const amountRegex = /(?:R\$\s*)?([\-\+]?\d{1,3}(?:\.\d{3})*,\d{2})/;
    const amountMatch = amountRegex.exec(snippet);

    if (amountMatch) {
      const rawAmount = amountMatch[1];
      const amountStartPos = amountMatch.index;

      let rawDesc = snippet.slice(0, amountStartPos).replace(/[\r\n]+/g, ' ').trim();
      rawDesc = rawDesc.replace(/^\/\d{4}\s*/, '').trim();

      // Check for installment pattern e.g. 01/10, 03/12, (02/06)
      let installment: string | null = null;
      const instMatch = rawDesc.match(/\b(\d{2}\/\d{2,})\b/);
      if (instMatch) {
        const parts = instMatch[1].split('/');
        if (parts.length === 2 && parseInt(parts[0], 10) <= parseInt(parts[1], 10)) {
          installment = instMatch[1];
          rawDesc = rawDesc.replace(instMatch[0], '').trim();
        }
      }

      let cleanDesc = rawDesc
        .replace(/^[\s\:\-\.\_\,\;\+]+/, '')
        .replace(/[\s\:\-\.\_\,\;\+]+$/, '')
        .replace(/(?:\b|^)([a-z])(?:\s+([a-z]))+(?:\b|$)/gi, (match) => match.replace(/\s+/g, '')) // Remove weird PDF kerning spaces like U B E R
        .replace(/\s+/g, ' ')
        .trim();

      if (isNonExpensePhrase(cleanDesc)) continue;

      let numStr = rawAmount.replace('-', '').replace(/\./g, '').replace(',', '.');
      let numAmount = Math.abs(parseFloat(numStr)); // Default to positive for all expenses

      const isRefund = cleanDesc.toLowerCase().includes('cancelamento') || cleanDesc.toLowerCase().includes('estorno') || cleanDesc.toLowerCase().includes('crédito');
      if (isRefund) {
        numAmount = -numAmount;
      }

      const itemKey = `${cleanDesc.toUpperCase()}-${numAmount}`;
      if (processedMatches.has(itemKey)) continue;
      processedMatches.add(itemKey);

      if (!isNaN(numAmount) && numAmount !== 0) {
        const [dayStr, monthStr] = dateStr.split('/');
        const dayNum = parseInt(dayStr, 10);
        const monthNum = parseInt(monthStr, 10);

        let itemYear = invoiceYear;
        if (monthNum > invoiceMonth && monthNum === 12 && invoiceMonth === 1) {
          itemYear = invoiceYear - 1;
        }

        let itemDate = `${itemYear}-${String(monthNum).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
        if (installment && installment.includes('/')) {
          itemDate = defaultInvoiceDate;
        }

        items.push({
          id: `local-${count++}-${Date.now()}`,
          date: itemDate,
          description: cleanDesc,
          amount: numAmount,
          bank: bankName,
          installment,
        });
      }
    }
  }

  return items;
}
