# Dynamic Categories Capability Specification

## Requirements

### Requirement: Database-driven Taxonomy Lookup
The system SHALL use the `categories` database table as the single source of truth for the financial taxonomy, meaning all available categories, subcategories, emojis, and colors must be fetched from the database rather than from hardcoded arrays in the source code.

#### Scenario: Rendering dashboard filters
- **WHEN** the dashboard page loads and renders the category and subcategory filter dropdowns
- **THEN** it SHALL display the options retrieved from the database, organizing them by the `parentId` relationship

#### Scenario: Injecting categories into the LLM context
- **WHEN** the batch AI categorization process is triggered
- **THEN** the system SHALL fetch the active categories from the database and pass the hierarchical strings (e.g., "Transporte > Combustível") to the LLM prompt
