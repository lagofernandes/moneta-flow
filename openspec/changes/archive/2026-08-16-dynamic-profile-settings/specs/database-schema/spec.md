## MODIFIED Requirements

### Requirement: Estrutura da Tabela de Usuários
O schema do banco de dados para a entidade `users` MUST armazenar as preferências de regionalização.

#### Scenario: Novas colunas persistidas
- **WHEN** a migração do banco é executada
- **THEN** as colunas `currency` (padrão: BRL) e `timezone` (padrão: America/Sao_Paulo) são integradas à tabela `users`.
