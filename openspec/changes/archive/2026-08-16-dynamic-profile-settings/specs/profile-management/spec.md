## ADDED Requirements

### Requirement: Atualização de Perfil de Usuário
O sistema MUST permitir que um usuário logado altere seu nome de exibição e suas preferências financeiras.

#### Scenario: Edição de preferências bem sucedida
- **WHEN** o usuário altera a moeda ou o fuso horário no painel de configurações
- **THEN** a API `PATCH /api/users/me` salva a informação no banco e atualiza a interface.

#### Scenario: Alteração de nome bem sucedida
- **WHEN** o usuário envia um novo nome no painel de perfil
- **THEN** a API salva a alteração e a sessão do NextAuth é atualizada para refletir o novo nome globalmente no app.
