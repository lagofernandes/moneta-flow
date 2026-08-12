# Capability: Dashboard Interactivity

## Purpose
Defines requirements for interactive financial transactions management, modal dialog triggers, dynamic client state, balance recalculation, and table search/filter controls.

## Requirements

### Requirement: Transaction Modal Creation and Submission
The application SHALL provide a modal dialog triggered by the "Nova Transação" button to allow users to create new financial transactions.

#### Scenario: Submitting a valid new transaction
- **WHEN** the user fills out the description, amount, category, type (Receita or Despesa), status (Pago or Pendente), date and clicks "Salvar Transação"
- **THEN** the modal SHALL close, the transaction SHALL be added to the local state, and total balance metrics SHALL recalculate immediately

#### Scenario: Canceling or closing modal
- **WHEN** the user clicks the "Cancelar" or close icon in the modal
- **THEN** the modal SHALL dismiss without persisting any draft input changes

### Requirement: Client-Side Transaction State and Calculation
The application SHALL manage transactions dynamically using client-side state with initial mock data.

#### Scenario: Dynamic summary metrics update
- **WHEN** a new transaction is added or an existing transaction is deleted from local state
- **THEN** total income (Entradas), saídas (saídas/expensas), and total balance (Saldo Total) cards SHALL update instantly

### Requirement: Transaction Filtering and Actions
The application SHALL provide filtering and action triggers on the main transaction table.

#### Scenario: Filtering transactions by search or type
- **WHEN** the user enters text in the search input or selects a status/category filter
- **THEN** the transaction list SHALL update to show only items matching the active filter criteria
