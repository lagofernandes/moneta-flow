## MODIFIED Requirements

### Requirement: Perfil do Usuário
O sistema MUST apresentar uma seção de configurações focada nos dados do usuário e preferências, sem poluir com funcionalidades de relatórios.

#### Scenario: Visualização do Perfil
- **WHEN** o usuário abre as configurações da conta (SettingsModal) na aba "Perfil"
- **THEN** a opção "Baixar Relatório (CSV)" não é mais exibida nesta tela
