## 1. Local State & Context Provider Setup

- [x] 1.1 Create `TransactionContext` and provider to manage transactions, mock seed data, and filter criteria
- [x] 1.2 Implement state methods for adding transactions, deleting transactions, and calculating total metrics (Saídas, Entradas, Saldo Total)

## 2. Modals & Dialogs Implementation

- [x] 2.1 Build `NewTransactionModal` component with form validation (description, amount, category, type, status, date) using Shadcn Dialog primitives
- [x] 2.2 Wire "Nova Transação" header button to trigger `NewTransactionModal` and submit new transactions into local state
- [x] 2.3 Add transaction detail / deletion confirmation modal on transaction table rows

## 3. Dashboard Filtering & Interactivity

- [x] 3.1 Implement live search filter and category/status select filters for the transaction table
- [x] 3.2 Connect balance summary cards to live calculation state from `TransactionContext`

## 4. Theme Management & Settings Toggle

- [x] 4.1 Create `ThemeToggle` component and theme context/hook managing `dark` class on `document.documentElement` with `localStorage` persistence
- [x] 4.2 Build Settings tab / modal with functional Dark Mode toggle switch
