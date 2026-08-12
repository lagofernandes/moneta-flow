## Context

The taxonomy of categories and subcategories (names, parent-child relationships, icons/emojis, and colors) is currently stored as hardcoded constants in `src/components/dashboard/DashboardFilters.tsx`, `src/context/TransactionContext.tsx`, and `src/lib/utils.ts`. 
While this is performant, it means the categories cannot be modified or expanded without changing the codebase. Although the user does not want end-users to create their own custom categories (the taxonomy remains fixed for the user), they want the list to be managed at the database level so that administrators can add or adjust categories without redeploying the code. 
We already have a `categories` table in the database that tracks the hierarchy (via `parentId`). We need to wire the application to use this table as a "Lookup Table" for the taxonomy.

## Goals / Non-Goals

**Goals:**
- Replace hardcoded `MOTHER_CATEGORIES` and `SUBCATEGORIES_MAP` with data fetched from the `categories` database table.
- Make the `DashboardFilters` dropdowns and `TransactionContext` dynamically read from a shared source of truth.
- Update the AI categorizer (`categorizer.ts`) to query the database for the active list of categories and subcategories instead of relying on a hardcoded string.

**Non-Goals:**
- Building a UI for users to create, update, or delete categories. The taxonomy remains "locked" for the user.
- Changing the database schema (the `categories` table already supports hierarchy via `parentId`).

## Decisions

1. **Centralized Taxonomy Context vs. Individual Queries**
   Instead of having each component (DashboardFilters, TransactionContext) fetch the categories, we will introduce a `CategoryContext` or fetch the categories once during the initial app load (e.g., in a Server Component layout or passing down to `TransactionContext`).
   *Decision:* We will fetch the categories inside `TransactionContext` (or alongside it) since the app is mostly a single-page dashboard. This prevents prop drilling and ensures all components share the exact same taxonomy state.

2. **AI Categorizer Integration**
   The AI categorizer runs server-side in an API route. It currently uses a hardcoded list of categories. 
   *Decision:* The `categorizer.ts` will perform a `db.select().from(categories)` to fetch all categories, build the "Mother > Child" strings dynamically, and inject them into the Gemini prompt. This guarantees the AI only classifies into categories that actually exist in the DB.

3. **Fallback and Caching**
   *Decision:* Since the categories rarely change, we should cache the database query in memory for the AI categorizer to prevent querying the database for every single transaction being parsed in a batch.

## Risks / Trade-offs

- **Risk:** Initial load latency for fetching categories on the frontend.
  **Mitigation:** The `categories` table is extremely small (<50 rows). The query will be negligible. We can fetch it in parallel with the `transactions` fetch.
- **Risk:** Missing colors or emojis in the database. Currently, `utils.ts` maps strings to Emojis.
  **Mitigation:** The database table may not have `emoji` or `color` columns. We will need to either add these columns to the `categories` table or keep a fallback mapping in `utils.ts` for visual representation. *Decision:* We will add `emoji` and `color` columns to the `categories` table via a migration so it is 100% data-driven.
