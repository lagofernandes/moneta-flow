## 1. Estrutura da Nova Página

- [x] 1.1 Criar a pasta e arquivo `src/app/relatorios/page.tsx`
- [x] 1.2 Implementar o layout base da página usando os componentes `Card`, `Button` e `Download` (Lucide)
- [x] 1.3 Adicionar o título "Relatórios" e uma breve descrição
- [x] 1.4 Adicionar cards de placeholders visuais para "Fluxo de Caixa", "Gastos por Categoria" e "Ranking de Estabelecimentos" com o status "Em breve"
- [x] 1.5 Escrever testes unitários básicos para garantir a renderização correta da página `page.tsx` e de seus placeholders

## 2. Migração da Exportação CSV

- [x] 2.1 Criar componente `ExportCard` dentro de `src/app/relatorios/` (ou em `src/components/reports/`)
- [x] 2.2 Migrar a função `handleExportCSV` de `SettingsModal.tsx` para o novo componente `ExportCard`
- [x] 2.3 Implementar o botão "Baixar Relatório (CSV)" com o estado de _loading_ (`isExporting`)
- [x] 2.4 Remover a seção "Meus Dados" (botão de exportação e lógicas) de `src/components/modals/SettingsModal.tsx`
- [x] 2.5 Escrever testes unitários para a função de migração do clique no botão "Baixar Relatório" mockando o fetch da API `/api/export`

## 3. Navegação e Limpeza

- [x] 3.1 Garantir que o link "Relatórios" em `Sidebar.tsx` esteja apontando para a nova rota correta `/relatorios`
- [x] 3.2 Verificar manualmente que clicar na Sidebar e no botão de exportação funcionam como esperado
