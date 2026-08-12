## ADDED Requirements

### Requirement: 3-Tier Hybrid Categorization Engine
The system SHALL categorize transaction descriptions using a 3-tier hybrid strategy: Level 1 (Local `merchant_rules`), Level 2 (Gemini Flash LLM), and Level 3 (Google Search Grounding).

#### Scenario: Level 1 Local Rule Match
- **WHEN** a transaction description matches a pattern in the user's `merchant_rules` table
- **THEN** the system assigns the mapped category with 100% confidence without calling external APIs

#### Scenario: Level 2 Batch LLM Classification
- **WHEN** a transaction description has no matching local rule
- **THEN** the system sends the unique unmatched merchant names to Gemini Flash LLM to match against the user's active categories

#### Scenario: Level 3 Google Search Grounding for Obscure Merchant Names
- **WHEN** LLM classification returns low confidence or an unrecognized CNPJ / acquirer legal name (e.g. "COMPASSION MEAT EIRELI")
- **THEN** the system triggers Google Search Grounding to research the business activity on the web and assign the correct category

### Requirement: Categorization Provenance Tracking
The system SHALL label each suggested category with a provenance indicator ("Histórico", "IA", "Busca Web") in the UI.

#### Scenario: Displaying category origin badges
- **WHEN** the staging area is rendered
- **THEN** each transaction row displays a visual badge indicating whether its category came from local history, LLM classification, or web search grounding
