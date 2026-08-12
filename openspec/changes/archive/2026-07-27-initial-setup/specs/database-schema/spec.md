## ADDED Requirements

### Requirement: Database Schema Definition
The database layer SHALL define Drizzle ORM schemas for Users, Categories, and Transactions with foreign key relationships and timestamp tracking.

#### Scenario: User registration schema constraint
- **WHEN** a new user record is inserted into the `users` table
- **THEN** it SHALL generate a random UUID primary key, require a unique email, and set `created_at` to the current timestamp

#### Scenario: Category assignment schema constraint
- **WHEN** a category is created
- **THEN** it SHALL belong to a user (or be null for default system categories) and define a transaction type of either `INCOME` or `EXPENSE`

#### Scenario: Transaction insertion schema constraint
- **WHEN** a transaction is recorded
- **THEN** it SHALL store the exact decimal amount, transaction type (`INCOME` or `EXPENSE`), status (`PAID` or `PENDING`), associated category, and timestamp

### Requirement: Database Migration Execution
The application tooling SHALL generate SQL migrations and apply them to the target PostgreSQL database via `drizzle-kit`.

#### Scenario: Executing database migrations
- **WHEN** the command `npx drizzle-kit push` or `npx drizzle-kit generate` is run
- **THEN** all tables (`users`, `categories`, `transactions`) and enums SHALL be created in PostgreSQL without schema conflicts
