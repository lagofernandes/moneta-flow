# Global Merchant Cache Capability Specification

## Purpose
TBD

## Requirements

### Requirement: Global Merchant Cache (Level 1.5)
The system SHALL consult a global, cross-user cache of known merchants before falling back to LLM categorization. This global cache SHALL map common merchant patterns directly to system default categories.

#### Scenario: Transaction matches a global merchant
- **WHEN** a transaction's description matches a pattern in the global merchant cache
- **THEN** the system SHALL assign the corresponding category with a provenance of `AI` or `WEB_SEARCH` and confidence `HIGH`, bypassing Level 2 and Level 3 completely.

### Requirement: Auto-populate Global Cache
The system SHALL populate the global cache automatically when high-confidence matches are found via the Google Search Grounding mechanism.

#### Scenario: Level 3 returns a high-confidence match
- **WHEN** the Google Search Grounding (Level 3) resolves a merchant to a category with high confidence
- **THEN** the system SHALL insert this merchant and its category ID into the `global_merchant_cache` table.
