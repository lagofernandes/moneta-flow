## ADDED Requirements

### Requirement: Página de Relatórios e Exportação
O sistema MUST disponibilizar uma página base em `/relatorios` acessível via menu lateral, onde será centralizado o botão de exportação CSV.

#### Scenario: Acesso à Página de Relatórios
- **WHEN** o usuário clica em "Relatórios" na barra lateral
- **THEN** a página base de relatórios é carregada sem erro 404, exibindo o botão "Baixar Relatório (CSV)"
