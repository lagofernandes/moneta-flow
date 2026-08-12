export interface ParsedInvoiceItem {
  id?: string;
  date: string; // YYYY-MM-DD
  description: string;
  amount: number;
  bank?: string | null;
  installment?: string | null;
  categoryId?: string | null;
  categoryName?: string | null;
  provenance?: 'HISTORIC' | 'AI' | 'WEB_SEARCH';
  confidence?: 'HIGH' | 'MEDIUM' | 'LOW';
}
