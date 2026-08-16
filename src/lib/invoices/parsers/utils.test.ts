import { describe, it, expect } from 'vitest';
import { isNonExpensePhrase, detectBankFromText, resolveCategory } from './utils';

describe('Invoice Parsers Utils', () => {
  describe('isNonExpensePhrase', () => {
    it('deve retornar true para palavras-chave de pagamento e totais', () => {
      expect(isNonExpensePhrase('PAGAMENTO EFETUADO')).toBe(true);
      expect(isNonExpensePhrase('Subtotal das compras')).toBe(true);
      expect(isNonExpensePhrase('Saldo anterior da fatura')).toBe(true);
    });

    it('deve retornar false para descrições de compras normais', () => {
      expect(isNonExpensePhrase('Uber *Uber *Trip')).toBe(false);
      expect(isNonExpensePhrase('McDonalds')).toBe(false);
      expect(isNonExpensePhrase('Amazon Prime')).toBe(false);
    });

    it('deve retornar true para strings muito curtas ou vazias', () => {
      expect(isNonExpensePhrase('')).toBe(true);
      expect(isNonExpensePhrase('A')).toBe(true);
    });
  });

  describe('detectBankFromText', () => {
    it('deve identificar os bancos corretamente a partir de textos', () => {
      expect(detectBankFromText('Fatura do seu cartão Nubank')).toBe('Nubank');
      expect(detectBankFromText('Itaú cartões')).toBe('Itaú');
      expect(detectBankFromText('mercadopago')).toBe('Mercado Pago');
      expect(detectBankFromText('C6 Bank SA')).toBe('C6 Bank');
      expect(detectBankFromText('Banco Inter S.A')).toBe('Inter');
      expect(detectBankFromText('Santander')).toBe('Santander');
      expect(detectBankFromText('Caixa Economica')).toBe('Caixa');
      expect(detectBankFromText('Desconhecido Bank')).toBe('Outros');
    });

    it('deve retornar Outros para texto vazio', () => {
      expect(detectBankFromText('')).toBe('Outros');
    });
  });

  describe('resolveCategory', () => {
    const categories = [
      { id: '1', name: 'Alimentação' },
      { id: '2', name: 'Transporte' },
      { id: '3', name: 'Educação' }
    ];

    it('deve resolver por ID exato', () => {
      expect(resolveCategory('1', categories)).toEqual({ id: '1', name: 'Alimentação' });
    });

    it('deve resolver por Nome exato ignorando case', () => {
      expect(resolveCategory(' ALIMENTAÇÃO ', categories)).toEqual({ id: '1', name: 'Alimentação' });
    });

    it('deve resolver por correspondência parcial (partial match)', () => {
      expect(resolveCategory('Transp', categories)).toEqual({ id: '2', name: 'Transporte' });
    });

    it('deve retornar null se não encontrar', () => {
      expect(resolveCategory('Saúde', categories)).toBeNull();
      expect(resolveCategory('', categories)).toBeNull();
    });

    it('deve retornar null se lista for vazia ou invalida', () => {
      expect(resolveCategory('1', [])).toBeNull();
      expect(resolveCategory('1', undefined)).toBeNull();
    });
  });
});
