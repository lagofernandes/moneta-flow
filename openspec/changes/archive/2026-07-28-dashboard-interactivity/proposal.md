## Why

The current Moneta Flow application interface provides a visual shell, but key interactive controls—such as creating transactions via modals, filtering transactions, managing local financial state, and toggling dark mode in settings—are non-functional placeholders. Adding these features delivers an end-to-end interactive dashboard experience where users can add/manage transactions and switch themes seamlessly using client-side state.

## What Changes

- **Add Transaction Modal**: Interactive dialog triggered by the "Nova Transação" button, allowing users to enter description, amount, category, type (Receita/Despesa), status (Pago/Pendente), and date.
- **Local Transaction State Management**: React local state hook (`useState` / context) pre-populated with initial mock transactions, updating summary balances (Receitas, Despesas, Saldo Total) dynamically upon additions or deletions.
- **Transaction Details / Actions**: Modals or confirmation dialogs for viewing, filtering, or deleting transactions from the main table.
- **Dark Mode Toggle**: Functional theme switcher switch/button inside the Settings ("Configurações") tab/modal that toggles the `dark` class on the `<html>` root element and persists user preference in `localStorage`.

## Capabilities

### New Capabilities
- `dashboard-interactivity`: Defines requirements for transaction creation modals, transaction filters, dynamic summary updates, and client-side financial state handling.
- `theme-management`: Defines requirements for light/dark theme switching, root DOM class toggling, and theme preference persistence in settings.

### Modified Capabilities
- None

## Impact

- **UI Components**: Updates `src/app/page.tsx` and adds component dialogs in `src/components/` (e.g. `TransactionModal`, `ThemeToggle`, `SettingsTab`).
- **State Management**: Introduces local React state/context (`useTransactions` or state lifting) for reactivity without requiring backend API connectivity at this stage.
- **Theme Support**: Ensures Tailwind CSS dark mode (`class` strategy) is properly configured and toggled across all UI components.
