## ADDED Requirements

### Requirement: User authentication for dashboard access
The system SHALL require a valid, active session for any user attempting to access the `/dashboard` route and its sub-routes.

#### Scenario: Unauthenticated access attempt
- **WHEN** an unauthenticated user accesses `/dashboard`
- **THEN** the system redirects the user to the `/login` page

#### Scenario: Authenticated access
- **WHEN** an authenticated user accesses `/dashboard`
- **THEN** the system renders the requested dashboard page

### Requirement: Email and password login
The system SHALL allow users to authenticate using an email and password combination via Auth.js Credentials Provider.

#### Scenario: Successful login
- **WHEN** a user submits valid email and password credentials
- **THEN** the system creates a new session in the database and redirects the user to `/dashboard`

#### Scenario: Invalid credentials
- **WHEN** a user submits an invalid email or password
- **THEN** the system displays an error message on the login form

### Requirement: User logout
The system SHALL allow authenticated users to invalidate their active session.

#### Scenario: Successful logout
- **WHEN** an authenticated user triggers the logout action
- **THEN** the system invalidates the session in the database, clears the session cookie, and redirects to the `/login` page
