## MODIFIED Requirements

### Requirement: Integração da Sessão na Interface do Dashboard
O cabeçalho e modais do dashboard MUST exibir os dados validados extraídos diretamente do token/sessão JWT gerido pelo NextAuth.

#### Scenario: Renderização do avatar e nome no Header
- **WHEN** o dashboard é carregado
- **THEN** o sistema exibe as iniciais baseadas em `session.user.name` e o primeiro nome do usuário, em vez de dados estáticos.
