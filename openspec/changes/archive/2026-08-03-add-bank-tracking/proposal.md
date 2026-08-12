# Proposal: Add Bank & Financial Institution Tracking to Transactions and Invoices

## What & Why
Users manage multiple credit cards and bank accounts (e.g. Itaú, Mercado Pago, Nubank, Bradesco, Inter, C6 Bank). Currently, imported transactions do not track which bank or credit card invoice they originated from, making it difficult to analyze spending per financial institution or filter transactions by card/bank.

This change introduces:
1. Automatic detection of the source bank/card during PDF/OFX/CSV invoice parsing.
2. A Bank badge in the invoice Staging Area allowing manual override before import.
3. Persistence of the `bank` attribute in the `transactions` table.
4. A "Filtrar por Banco" filter on the main dashboard alongside existing Month, Type, and Category filters.
5. Visual Bank badges on transaction list rows and inside transaction details.

## Impact & Scope
- **Database**: Add nullable `bank` column to `transactions` table in PostgreSQL.
- **Parsers**: Update `pdf-parser.ts` (Gemini Flash & local fallback) and `ofx-csv-parser.ts` to detect bank names.
- **UI Components**:
  - `InvoiceStagingTable.tsx`: Display and allow editing bank source.
  - `TransactionContext.tsx`: Store `bank` in Transaction type and provide `bankFilter` state.
  - `page.tsx`: Add Bank filter dropdown and display Bank badges on transaction rows.
  - `TransactionDetailModal.tsx`: Show bank source.
