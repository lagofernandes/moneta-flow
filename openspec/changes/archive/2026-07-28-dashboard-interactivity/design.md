## Context

The Moneta Flow dashboard UI components are currently static UI blocks. To turn the dashboard into a fully functional demo without requiring a database backend connection immediately, client-side state management is needed. Additionally, a settings modal or drawer with a theme toggle is required to allow real-time dark mode switching.

## Goals / Non-Goals

**Goals:**
- Implement a functional modal (`NewTransactionModal`) for adding new income or expense transactions.
- Implement dynamic React state (`TransactionContext` or local state in page) populated with mock initial data.
- Automatically recompute balance cards (Saldo Total, Entradas, Saídas) when transactions change.
- Add search and category/type filtering for the transaction table.
- Implement a Settings modal/tab containing a functional Dark Mode toggle that updates the document root `dark` class and persists choice in `localStorage`.

**Non-Goals:**
- Persistence to a live PostgreSQL database via Drizzle ORM in this change (will be integrated in a subsequent backend integration change).
- Full user authentication flow.

## Decisions

- **Decision 1: React Context / Custom Hook for Client State**:
  - *Rationale*: A simple React Context (`TransactionContext`) cleanly shares transaction state, add/delete methods, and filter criteria between the header ("Nova Transação" button), balance cards, search bar, and transaction table without prop-drilling.
  - *Alternatives Considered*: Component state lifting in `page.tsx` (more cluttered) or Redux/Zustand (over-engineering for current scope).

- **Decision 2: Shadcn UI Dialog Primitives for Modals**:
  - *Rationale*: Reuses Shadcn `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogFooter` primitives to maintain consistent UI styling.

- **Decision 3: Dark Mode via Class Strategy**:
  - *Rationale*: Tailwind CSS is configured with `darkMode: 'class'`. Toggling `.dark` on `document.documentElement` dynamically changes CSS variables and dark variant classes. `localStorage.getItem('theme')` initializes state on load.

## Risks / Trade-offs

- [Risk] Page hydration mismatch when reading `localStorage` for dark mode theme.
  → *Mitigation*: Use a `useEffect` hook to sync theme state after mounting on the client.
