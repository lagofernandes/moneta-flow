## 1. Setup and Testing Framework

- [x] 1.1 Install Vitest and testing dependencies
- [x] 1.2 Create `vitest.config.ts`
- [x] 1.3 Add test scripts to `package.json`

## 2. Refactoring PDF Parser

- [x] 2.1 Create `src/lib/invoices/parsers/local-parser.ts` and move fallback regex logic
- [x] 2.2 Create `src/lib/invoices/parsers/gemini-parser.ts` and move AI extraction logic
- [x] 2.3 Create `src/lib/invoices/parsers/pdf-extractor.ts` and move pdfjs-dist logic
- [x] 2.4 Update `parsePdfInvoice` in `pdf-parser.ts` to orchestrate these specific modules
- [x] 2.5 Write unit tests for `local-parser.ts`

## 3. Service Layer Extraction

- [x] 3.1 Create `src/services/invoiceService.ts`
- [x] 3.2 Move file parsing orchestration and DB insertions from `invoices.ts` server action to `invoiceService.ts`
- [x] 3.3 Update `invoices.ts` server action to strictly handle FormData and call the service

## 4. UI Component Extraction

- [x] 4.1 Create `src/components/dashboard/SummaryCards.tsx` and move dashboard cards
- [x] 4.2 Create `src/components/dashboard/DashboardFilters.tsx` and move filter selectors
- [x] 4.3 Create `src/components/dashboard/RecentTransactionsTable.tsx` and move transactions list
- [x] 4.4 Update `src/app/page.tsx` to render these subcomponents instead of raw HTML

## 5. UI/UX Polish

- [x] 5.1 Install `framer-motion`
- [x] 5.2 Add hover and layout animations to `SummaryCards.tsx`
- [x] 5.3 Enhance `RecentTransactionsTable.tsx` with list-item staggered entry animations
- [x] 5.4 Implement skeleton loader UI for invoice import staging table
