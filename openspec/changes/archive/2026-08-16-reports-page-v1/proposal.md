## Why

O aplicativo possui uma página "Relatórios" referenciada na barra lateral que atualmente retorna um erro 404, causando uma experiência ruim para o usuário. Além disso, a funcionalidade de "Exportar CSV" está escondida dentro do modal de "Configurações da Conta", o que não é o local mais intuitivo para buscar relatórios financeiros. 

## What Changes

- Criação da página base de Relatórios no roteamento da aplicação (`/relatorios`).
- Migração da funcionalidade de "Baixar Relatório (CSV)" do modal de configurações para a nova página de Relatórios.
- Adição de placeholders visuais (cards) na página de Relatórios para futuras implementações, como:
  - Fluxo de Caixa (Receitas vs Despesas)
  - Gastos por Categoria
  - Ranking de Estabelecimentos
- Remoção da exportação CSV da aba "Perfil" nas configurações da conta.

## Capabilities

### New Capabilities
- `reports-page`: Nova página base para hospedar visualizações, listagens e exportações de relatórios financeiros, acessível via barra lateral.

### Modified Capabilities
- `account-settings`: A funcionalidade de "Exportar CSV" não fará mais parte das configurações da conta, limpando a aba de Perfil para focar apenas nos dados do usuário.

## Impact

- `src/components/modals/SettingsModal.tsx`: Remoção de funcionalidades e interface gráfica relacionadas à exportação.
- `src/app/relatorios/page.tsx`: Criação de nova rota.
- `src/components/layout/Sidebar.tsx`: O link para "Relatórios" passará a apontar para uma página válida.
