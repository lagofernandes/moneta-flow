## 1. Database Schema & Migration

- [x] 1.1 Update `categories` schema in `src/db/schema.ts` to include an nullable `parentId` referencing `categories.id`.
- [x] 1.2 Update `categoriesRelations` in `src/db/schema.ts` to expose `parent` and `children` properties via `relationName: 'parentChild'`.
- [x] 1.3 Generate a new database migration (`npm run db:generate`).
- [x] 1.4 Push the migration to the database (`npm run db:push`).

## 2. Seed Script Redesign

- [x] 2.1 Refactor `src/db/seed.ts` to clear or handle existing default categories logic cleanly (e.g. mapping parents before inserting children).
- [x] 2.2 Define the new hierarchical categories data structure in `seed.ts` based on user input (Mãe: Transporte -> Filhas: Combustível, Aplicativos, etc.).
- [x] 2.3 Implement the insertion logic to insert Mother categories first, capture their IDs, and then insert Child categories with the respective `parentId`.
- [x] 2.4 Test the seed script (`npm run db:seed`) to ensure no duplication and correct relationships.

## 3. AI Categorizer Enhancements

- [x] 3.1 Update `categorizer.ts` to query categories and resolve their parent relationships.
- [x] 3.2 Modify the logic that builds `categoryNames` for the Gemini prompt to output the path format `"Mother Category > Child Category"` when a `parentId` exists.
- [x] 3.3 Ensure the `resolveCategory` function in `categorizer.ts` correctly parses and matches the string returned by Gemini, even if it returns the full path.

## 4. UI Adjustments

- [x] 4.1 Update `CATEGORY_EMOJIS` in `src/lib/utils.ts` to match the exact names of the new Mother and Child categories for proper dashboard rendering.
- [x] 4.2 Verify that the UI dashboard correctly renders the fallback categories and doesn't break due to the schema change.
