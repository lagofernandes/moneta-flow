# Implementation Tasks: Add Bank Tracking & Filtering

## 1. Database & API Layer
- [x] 1.1 Add `bank: text('bank')` column to `transactions` table in `src/db/schema.ts`
- [x] 1.2 Update `/api/transactions` (GET and POST) routes in `src/app/api/transactions/route.ts` to include `bank`
- [x] 1.3 Push schema changes to database via `npx drizzle-kit push`

## 2. Parser & Extractor Layer
- [x] 2.1 Update `ParsedInvoiceItem` interface in `src/lib/invoices/pdf-parser.ts` to include `bank?: string | null`
- [x] 2.2 Add bank detection heuristics (Itaú, Mercado Pago, Nubank, Bradesco, C6, Inter) in `pdf-parser.ts` and Gemini prompt schema
- [x] 2.3 Update `ofx-csv-parser.ts` to extract bank names from OFX/CSV files
- [x] 2.4 Update `confirmInvoiceImportAction` in `src/app/actions/invoices.ts` to persist `bank` to DB

## 3. UI Components & State Management
- [x] 3.1 Update `Transaction` interface and `TransactionContext.tsx` to support `bank`, `bankFilter`, and `availableBanks`
- [x] 3.2 Add Bank column / badge and dropdown selector to `InvoiceStagingTable.tsx`
- [x] 3.3 Add "Filtrar por Banco" dropdown filter to main dashboard header in `src/app/page.tsx`
- [x] 3.4 Render sleek Bank badges (e.g. `🏦 Itaú`, `🏦 Mercado Pago`) on transaction rows in `src/app/page.tsx`
- [x] 3.5 Display Bank field inside `TransactionDetailModal.tsx`

## 4. Verification & Build
- [x] 4.1 Run `npm run build` to verify TypeScript types and compilation
- [x] 4.2 Perform manual verification by importing an invoice and filtering by bank
