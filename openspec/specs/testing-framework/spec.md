## ADDED Requirements

### Requirement: Test Suite Configuration
The system SHALL integrate Vitest as the primary test runner for unit tests.

#### Scenario: Running test suite
- **WHEN** a developer runs the test command
- **THEN** Vitest executes all `*.test.ts` files in the project and reports the coverage metrics

### Requirement: PDF Parser Unit Tests
The system SHALL have unit tests covering all core parser logic for financial documents.

#### Scenario: Testing local fallback regex parser
- **WHEN** the `fallbackProximityParser` is tested with a mocked raw text string
- **THEN** it correctly returns parsed invoice items regardless of external API state
