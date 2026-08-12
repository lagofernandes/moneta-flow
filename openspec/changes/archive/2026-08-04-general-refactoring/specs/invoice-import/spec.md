## MODIFIED Requirements

### Requirement: Invoice Parsing and Data Extraction
The system SHALL extract transaction date, original description, amount, and installment details from uploaded PDF, OFX, and CSV invoices using highly decoupled and specific parser modules.

#### Scenario: Extraction from PDF invoice via Gemini Multimodal API
- **WHEN** a PDF invoice is processed
- **THEN** the system calls the Gemini Multimodal API (with pdfjs-dist text extraction fallback) to parse the document into a structured JSON array containing date, description, amount, and installment tag (e.g. "01/10"). This operation MUST be isolated in its own dedicated module/function rather than a 400-line monolithic function.

#### Scenario: Extraction from OFX or CSV invoice
- **WHEN** an OFX or CSV invoice is uploaded
- **THEN** the system uses deterministic local parsers to extract all transaction records into the standard transaction format

## ADDED Requirements

### Requirement: Secure TypeScript Typings in Parsing
The parsers SHALL NOT use `any` types for error handling or response objects, enforcing strict schema typing.

#### Scenario: Handing API failures
- **WHEN** the Gemini API returns an error
- **THEN** the catch block receives an `unknown` error type and safely parses it before falling back to local extraction
