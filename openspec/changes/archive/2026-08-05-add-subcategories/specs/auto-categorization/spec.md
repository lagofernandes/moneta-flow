## MODIFIED Requirements

### Requirement: 3-Tier Hybrid Categorization Engine
The system SHALL categorize transaction descriptions using a 3-tier hybrid strategy: Level 1 (Local `merchant_rules`), Level 2 (Gemini Flash LLM), and Level 3 (Google Search Grounding). The AI and search agents SHALL be provided with the full hierarchical path of available categories (e.g. "Transporte > Combustível") instead of just the leaf name to improve classification accuracy.

#### Scenario: Level 1 Local Rule Match
- **WHEN** a transaction description matches a pattern in the user's `merchant_rules` table
- **THEN** the system assigns the mapped category with 100% confidence without calling external APIs

#### Scenario: Level 2 Batch LLM Classification
- **WHEN** a transaction description has no matching local rule
- **THEN** the system sends the unique unmatched merchant names to Gemini Flash LLM to match against the user's active categories, formatted as "Parent > Child" (or just "Parent" if it has no children)

#### Scenario: Level 3 Google Search Grounding for Obscure Merchant Names
- **WHEN** LLM classification returns low confidence or an unrecognized CNPJ / acquirer legal name (e.g. "COMPASSION MEAT EIRELI")
- **THEN** the system triggers Google Search Grounding to research the business activity on the web and assign the correct category, selecting from the hierarchical list of categories
