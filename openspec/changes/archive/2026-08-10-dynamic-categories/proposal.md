## Why

Currently, the categories and subcategories in Moneta Flow are hardcoded directly into the frontend source code. This makes the UI very fast but introduces an architectural limitation: any change, addition, or renaming of a category requires modifying the code and redeploying the app. Moving this static taxonomy into the existing `categories` database table as a "Lookup Table" allows system administrators to add new categories at the database level instantly, without code changes, while still maintaining a locked, standardized list for the users.

## What Changes

- Fetch categories and subcategories from the PostgreSQL database instead of hardcoded constants (`MOTHER_CATEGORIES`, `SUBCATEGORIES_MAP`).
- Create a global Category Context or use an API route to provide the dynamic list of categories to the dashboard filters and transaction forms.
- Update the AI Categorizer engine (`categorizer.ts`) to fetch the active list of categories from the database to inject into the Gemini prompt, ensuring it always has the most up-to-date taxonomy.
- Maintain the business rule that end-users cannot create new categories via the UI (the list remains fixed from the user's perspective).

## Capabilities

### New Capabilities
- `dynamic-categories`: Centralize category management using the database as the source of truth for the application taxonomy.

### Modified Capabilities
- `auto-categorization`: Modify the categorizer engine to fetch the taxonomy from the database before prompting the LLM instead of using hardcoded constants.

## Impact

- **Affected Code**: `src/components/dashboard/DashboardFilters.tsx`, `src/lib/utils.ts`, `src/lib/invoices/categorizer.ts`.
- **Database**: The `categories` table will become the single source of truth for taxonomy. The `db:seed` script should ensure all emojis, colors, and names are properly seeded.
- **Performance**: A slight increase in latency on initial load to fetch the categories from the database, which can be mitigated using a React Context or server-side rendering.
