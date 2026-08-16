## ADDED Requirements

### Requirement: Exportação de Dados do Usuário
O sistema MUST fornecer uma funcionalidade para o usuário extrair suas transações em formato estruturado.

#### Scenario: Geração de CSV
- **WHEN** o usuário clica no botão "Exportar meus dados (CSV)"
- **THEN** a API `GET /api/export` responde com um stream de arquivo CSV contendo os dados do banco, disparando o download no navegador.
