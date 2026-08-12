## ADDED Requirements

### Requirement: Support hierarchical categories (Parent/Child)
The system SHALL support a two-tier hierarchy of categories to allow for granular financial reporting, where a subcategory (Child) belongs to exactly one parent category (Mother).

#### Scenario: Subcategory creation
- **WHEN** a new subcategory is inserted into the database
- **THEN** it SHALL reference a valid parent category via the `parentId` field

#### Scenario: Mother category grouping
- **WHEN** transactions are grouped by their main category in the dashboard
- **THEN** the system SHALL aggregate all transactions belonging to its child subcategories

### Requirement: Initialization of default hierarchical categories
The system SHALL seed the database with a predefined set of mother categories and their respective subcategories (e.g., "Transporte > Combustível").

#### Scenario: Seeding database on fresh install
- **WHEN** the `db:seed` script is executed
- **THEN** it SHALL insert mother categories first, followed by child categories mapped to their corresponding parent IDs, without creating duplicates.
