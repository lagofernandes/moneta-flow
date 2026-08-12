import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fallbackProximityParser } from '../lib/invoices/parsers/local-parser';

describe('Local Proximity Parser', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-04T00:00:00Z'));
  });

  it('should parse a standard transaction correctly', () => {
    const rawText = `Vencimento: 05/08/2026
15/07 SUPERMERCADO BRETAS R$ 150,50
    `;
    const items = fallbackProximityParser(rawText, 'Nubank');

    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      description: 'SUPERMERCADO BRETAS',
      amount: 150.50,
      date: '2026-07-15',
      bank: 'Nubank',
    });
  });

  it('should handle installments and default date for them', () => {
    const rawText = `Fatura de: 10/08/2026
20/07 COMPRA PARCELADA 02/05 R$ 50,00
    `;
    const items = fallbackProximityParser(rawText, 'Itaú');

    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      description: 'COMPRA PARCELADA',
      amount: 50.00,
      installment: '02/05',
      date: '2026-07-01', // Billing month for installments (venc 10/08 = ref 07)
      bank: 'Itaú',
    });
  });

  it('should handle negative values (cancelamentos)', () => {
    const rawText = `
10/07 ESTORNO UBER R$ -15,90
    `;
    const items = fallbackProximityParser(rawText, 'Outros');

    expect(items).toHaveLength(1);
    expect(items[0].amount).toBe(-15.9);
  });

  it('should skip non-expense phrases', () => {
    const rawText = `
15/07 PAGAMENTO EFETUADO R$ -500,00
16/07 TOTAL DA FATURA R$ 150,50
17/07 MERCADO R$ 30,00
    `;
    const items = fallbackProximityParser(rawText, 'Nubank');

    // Only MERCADO should be captured
    expect(items).toHaveLength(1);
    expect(items[0].description).toBe('MERCADO');
  });
});
