## ADDED Requirements

### Requirement: Continuous Learning via Merchant Rules
The system SHALL save new or updated merchant pattern to category mappings when a user confirms an invoice import.

#### Scenario: Learning from user confirmation and overrides
- **WHEN** the user confirms an import with assigned or modified categories
- **THEN** the system upserts entries into the `merchant_rules` table mapping each merchant pattern to the chosen category ID

#### Scenario: Rule-based auto-categorization on future uploads
- **WHEN** a subsequent invoice contains a merchant pattern stored in `merchant_rules`
- **THEN** the system automatically applies the learned category during Level 1 matching
