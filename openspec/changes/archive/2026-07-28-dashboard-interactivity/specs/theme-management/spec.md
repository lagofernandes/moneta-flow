## ADDED Requirements

### Requirement: Dark Mode Theme Toggle in Settings
The application SHALL provide a theme toggle switch inside the Settings dialog or tab to switch between Light and Dark themes.

#### Scenario: Toggling dark mode theme
- **WHEN** the user flips the dark mode switch in Settings
- **THEN** the root HTML document element SHALL toggle the `dark` class instantly, updating the CSS design system tokens across all UI elements

#### Scenario: Persisting theme preference
- **WHEN** the user switches themes
- **THEN** the preferred theme mode SHALL be stored in `localStorage` and re-applied automatically on application reload
