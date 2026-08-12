import Papa from 'papaparse';
import { ParsedInvoiceItem, detectBankFromText } from './pdf-parser';

/**
 * Parses an OFX file content string into transaction items.
 * OFX is a standard SGML/XML-like financial format.
 */
export function parseOfxInvoice(ofxContent: string): ParsedInvoiceItem[] {
  const items: ParsedInvoiceItem[] = [];
  const detectedBank = detectBankFromText(ofxContent);

  // Match all <STMTTRN>...</STMTTRN> blocks
  const transactionBlocks = ofxContent.split(/<\/STMTTRN>/i);

  let count = 0;
  for (const block of transactionBlocks) {
    if (!block.includes('<STMTTRN>') && !block.includes('<stmttrn>')) continue;

    // Extract DTPOSTED (Format: YYYYMMDD...)
    const dateMatch = block.match(/<DTPOSTED>(\d{8})/i);
    // Extract TRNAMT
    const amountMatch = block.match(/<TRNAMT>([\-\+]?\d+(?:\.\d+)?)/i);
    // Extract MEMO or NAME
    const memoMatch = block.match(/<MEMO>([^<\r\n]+)/i) || block.match(/<NAME>([^<\r\n]+)/i);

    if (dateMatch && amountMatch && memoMatch) {
      const rawDate = dateMatch[1]; // YYYYMMDD
      const year = rawDate.slice(0, 4);
      const month = rawDate.slice(4, 6);
      const day = rawDate.slice(6, 8);

      const rawAmount = parseFloat(amountMatch[1]);
      // OFX expenses are usually negative numbers, convert to positive amount
      const amount = Math.abs(rawAmount);

      const description = memoMatch[1].trim();

      // Check for installment pattern like (01/10) or 01/10 in description
      const installmentMatch = description.match(/(\d{2}\/\d{2})/);

      items.push({
        id: `ofx-${count++}-${Date.now()}`,
        date: `${year}-${month}-${day}`,
        description,
        amount,
        bank: detectedBank,
        installment: installmentMatch ? installmentMatch[1] : null,
      });
    }
  }

  return items;
}

/**
 * Parses a CSV file content string into transaction items.
 * Handles auto-detection of column headers (data/date, descricao/description, valor/amount, banco/bank).
 */
export function parseCsvInvoice(csvContent: string): ParsedInvoiceItem[] {
  const detectedBank = detectBankFromText(csvContent);

  const parsed = Papa.parse<Record<string, string>>(csvContent, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false,
  });

  const items: ParsedInvoiceItem[] = [];
  let count = 0;

  if (!parsed.data || parsed.data.length === 0) return items;

  // Identify column names by searching for keywords
  const firstRow = parsed.data[0];
  const keys = Object.keys(firstRow);

  const dateKey = keys.find((k) => /data|date/i.test(k)) || keys[0];
  const descKey = keys.find((k) => /descri|memo|historico|title|description|estabelecimento/i.test(k)) || keys[1];
  const amountKey = keys.find((k) => /valor|amount|price|val/i.test(k)) || keys[2];
  const installmentKey = keys.find((k) => /parcela|installment/i.test(k));
  const bankKey = keys.find((k) => /banco|bank|instituic/i.test(k));

  for (const row of parsed.data) {
    const rawDate = row[dateKey];
    const rawDesc = row[descKey];
    const rawAmount = row[amountKey];
    const rawInstallment = installmentKey ? row[installmentKey] : null;
    const rowBank = bankKey ? row[bankKey] : null;

    if (!rawDate || !rawDesc || !rawAmount) continue;

    // Normalize date to YYYY-MM-DD
    let formattedDate = new Date().toISOString().split('T')[0];
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(rawDate.trim())) {
      const [d, m, y] = rawDate.trim().split('/');
      formattedDate = `${y}-${m}-${d}`;
    } else if (/^\d{4}-\d{2}-\d{2}$/.test(rawDate.trim())) {
      formattedDate = rawDate.trim();
    }

    // Parse amount (handles Brazilian "45,90" or "1.250,90")
    const cleanAmount = rawAmount.replace('R$', '').replace(/\s/g, '');
    let numAmount = 0;
    if (cleanAmount.includes(',')) {
      numAmount = Math.abs(parseFloat(cleanAmount.replace(/\./g, '').replace(',', '.')));
    } else {
      numAmount = Math.abs(parseFloat(cleanAmount));
    }

    if (isNaN(numAmount) || numAmount === 0) continue;

    items.push({
      id: `csv-${count++}-${Date.now()}`,
      date: formattedDate,
      description: rawDesc.trim(),
      amount: numAmount,
      bank: rowBank ? rowBank.trim() : detectedBank,
      installment: rawInstallment ? rawInstallment.trim() : null,
    });
  }

  return items;
}
