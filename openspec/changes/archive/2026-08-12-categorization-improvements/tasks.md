## 1. Database Schema Updates

- [x] 1.1 Add `globalMerchantCache` table in `src/db/schema.ts` with columns: `id`, `pattern`, `categoryId`, `createdAt`, `updatedAt`.
- [x] 1.2 Setup relations for `globalMerchantCache` to link to the `categories` table.
- [x] 1.3 Generate and push migrations (`npm run db:generate` and `npm run db:push`).

## 2. Categorization Engine - Level 1.5 Global Cache

- [x] 2.1 Update `src/lib/invoices/categorizer.ts` to fetch rules from `globalMerchantCache` alongside `merchantRules`.
- [x] 2.2 Implement the Level 1.5 check loop: if an item is not matched by local rules, check against the global cache.
- [x] 2.3 Ensure items matched via global cache are assigned provenance `AI` or `WEB_SEARCH` and confidence `HIGH`.

## 3. Categorization Engine - LLM Chunking

- [x] 3.1 Refactor the Level 2 Gemini LLM call to slice `uncategorizedIndexes` into batches (e.g., maximum 30 items per batch).
- [x] 3.2 Implement a `Promise.all` or sequential loop to process these batches, aggregating the results before applying them to the items.

## 4. Categorization Engine - Level 3 Auto-Caching

- [x] 4.1 Update the Level 3 (Google Search Grounding) processing block in `categorizer.ts`.
- [x] 4.2 After successfully matching an obscure merchant to a category with high confidence via Search, insert a new record into `globalMerchantCache` mapping the merchant description to the resolved category ID.
