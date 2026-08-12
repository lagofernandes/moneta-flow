## ADDED Requirements

### Requirement: Invoice File Upload
The system SHALL provide a file upload mechanism allowing users to submit credit card invoice files in PDF, OFX, and CSV formats.

#### Scenario: User uploads a valid PDF invoice
- **WHEN** the user selects or drops a valid credit card invoice PDF file
- **THEN** the system validates the file format and initiates the parsing process

#### Scenario: User uploads an invalid file format
- **WHEN** the user attempts to upload a file with an unsupported extension (e.g., .exe, .png)
- **THEN** the system rejects the file and displays an informative error message

### Requirement: Invoice Parsing and Data Extraction
The system SHALL extract transaction date, original description, amount, and installment details from uploaded PDF, OFX, and CSV invoices.

#### Scenario: Extraction from PDF invoice via Gemini Multimodal API
- **WHEN** a PDF invoice is processed
- **THEN** the system calls the Gemini Multimodal API to parse the document into a structured JSON array containing date, description, amount, and installment tag (e.g. "01/10")

#### Scenario: Extraction from OFX or CSV invoice
- **WHEN** an OFX or CSV invoice is uploaded
- **THEN** the system uses deterministic local parsers to extract all transaction records into the standard transaction format

### Requirement: Import Staging and Preview UI
The system SHALL display all extracted transactions in an interactive staging preview area before persisting them to the database.

#### Scenario: Reviewing extracted transactions
- **WHEN** invoice parsing completes
- **THEN** the system renders a staging table showing Date, Description, Amount, Installments, Suggested Category, and Confidence Badge for each item

#### Scenario: User modifies category or deselects items in staging
- **WHEN** the user changes a transaction category dropdown or unchecks a transaction row
- **THEN** the staging state updates immediately and only selected transactions are marked for final import
