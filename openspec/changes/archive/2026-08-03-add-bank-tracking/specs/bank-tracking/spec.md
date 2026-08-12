# Bank Tracking Capability Specification

## ADDED Requirements

### Requirement: Bank & Institution Extraction
The system SHALL extract and assign the bank/financial institution name (e.g. Itaú, Mercado Pago, Nubank, Bradesco, Inter, C6 Bank) during invoice parsing.

#### Scenario: Automatic detection of bank name from PDF invoice header
- **WHEN** a credit card invoice PDF is parsed
- **THEN** the system identifies the institution name from the header text or Gemini AI response and assigns it to `item.bank`

#### Scenario: Extraction of bank from OFX or CSV files
- **WHEN** an OFX or CSV file is processed
- **THEN** the system extracts the bank name from file headers or metadata tags

### Requirement: Bank Selection & Editing in Staging UI
The system SHALL display the detected bank for each item in the staging preview table and allow the user to modify or set the bank manually.

#### Scenario: User modifies bank in staging table
- **WHEN** the user selects a different bank from the dropdown in the staging table
- **THEN** the transaction row updates its bank property before final import

### Requirement: Dashboard Filtering by Bank
The system SHALL provide a "Filtrar por Banco" filter dropdown on the main dashboard to filter transactions by institution.

#### Scenario: Filtering transactions by specific bank
- **WHEN** the user selects "Itaú" in the Bank filter dropdown
- **THEN** the transactions list and financial summary cards adjust to display only transactions associated with Itaú
