export const isNonExpensePhrase = (desc: string) => {
  const lower = desc.toLowerCase().trim();
  if (!lower || lower.length < 3) return true;
  const nonExpenseKeywords = [
    'pagamento efetuado', 'pagto debito', 'pagamento de fatura', 'pagamento recibo',
    'pagamento titulo', 'pagamento efetuad', 'subtotal', 'total da fatura',
    'total de compras', 'soma dos lançamentos', 'resumo da fatura',
    'saldo anterior', 'total do cartão', 'total cartao',
    'compras parceladas - próximas faturas', 'próxima fatura', 'demais faturas',
    'total para próximas faturas', 'próximas faturas',
  ];
  return nonExpenseKeywords.some((kw) => lower.includes(kw));
};

export function detectBankFromText(text: string): string {
  if (!text) return 'Outros';
  const lower = text.toLowerCase();
  if (lower.includes('mercado pago') || lower.includes('mercadopago')) return 'Mercado Pago';
  if (lower.includes('itaú') || lower.includes('itau')) return 'Itaú';
  if (lower.includes('nubank') || lower.includes('nu pagamentos')) return 'Nubank';
  if (lower.includes('bradesco') || lower.includes('bradescard')) return 'Bradesco';
  if (lower.includes('c6 bank') || lower.includes('c6bank')) return 'C6 Bank';
  if (lower.includes('banco inter') || lower.includes('inter ') || lower.includes('inter ')) return 'Inter';
  if (lower.includes('santander')) return 'Santander';
  if (lower.includes('banco do brasil') || lower.includes('bb.com.br')) return 'Banco do Brasil';
  if (lower.includes('caixa')) return 'Caixa';
  return 'Outros';
}

export function resolveCategory(
  itemCatValue: string | null | undefined,
  categoriesList?: { id: string; name: string }[]
): { id: string; name: string } | null {
  if (!itemCatValue || !categoriesList || categoriesList.length === 0) return null;

  const cleanVal = String(itemCatValue).trim().toLowerCase();

  const byId = categoriesList.find((c) => c.id === itemCatValue);
  if (byId) return byId;

  const byName = categoriesList.find((c) => c.name.toLowerCase().trim() === cleanVal);
  if (byName) return byName;

  const byPartial = categoriesList.find(
    (c) => cleanVal.includes(c.name.toLowerCase().trim()) || c.name.toLowerCase().trim().includes(cleanVal)
  );

  return byPartial || null;
}
