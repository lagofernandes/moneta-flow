## ADDED Requirements

### Requirement: Service Layer Separation
The system SHALL separate database access and complex business logic into dedicated service files located in `src/services`, decoupled from Next.js Server Actions.

#### Scenario: Orchestrating an invoice import
- **WHEN** a user uploads an invoice via Server Action
- **THEN** the Server Action calls `invoiceService.processInvoiceFile` instead of executing raw database ORM code and file parsing directly

### Requirement: Modular Dashboard Components
The dashboard UI SHALL be composed of specific, smaller components rather than a single monolithic file.

#### Scenario: Rendering dashboard layout
- **WHEN** the dashboard page loads
- **THEN** it aggregates smaller, pure React components like `<SummaryCards />`, `<DashboardFilters />` and `<RecentTransactionsTable />`
