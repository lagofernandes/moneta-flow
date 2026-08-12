## 1. Database Adjustments

- [x] 1.1 Add `emoji` (text) and `color` (text) columns to the `categories` table in `src/db/schema.ts` to fully represent the visual taxonomy.
- [x] 1.2 Generate and push the database migration (`npm run db:generate` & `npm run db:push`).
- [x] 1.3 Update `src/db/seed.ts` to insert the fixed list of categories with their respective emojis and colors. Run `npm run db:seed`.

## 2. API & Data Fetching

- [x] 2.1 Create an API endpoint (`GET /api/categories`) to fetch all categories from the database, including their hierarchy (parent/children relationships).
- [x] 2.2 In `TransactionContext.tsx`, fetch the categories from `/api/categories` on mount and store them in the context state alongside transactions.

## 3. UI Refactoring

- [x] 3.1 Update `src/components/dashboard/DashboardFilters.tsx` to read the category list from the context instead of the hardcoded `MOTHER_CATEGORIES` and `SUBCATEGORIES` constants.
- [x] 3.2 Update `src/lib/utils.ts` (specifically `getCategoryEmoji` and `getMotherCategory`) to use the dynamically fetched category lists, or move this logic into `TransactionContext` where the DB data lives.
- [x] 3.3 Ensure the `InvoiceStagingTable` dropdowns dynamically render subcategories from the context state.

## 4. AI Categorizer Update

- [x] 4.1 Update `src/lib/invoices/categorizer.ts` to query the `categories` table (or receive it from the frontend context) to construct the "Mother > Child" string mapping dynamically.
- [x] 4.2 Validate that the LLM correctly categorizes transactions using the dynamic list instead of the hardcoded string.
