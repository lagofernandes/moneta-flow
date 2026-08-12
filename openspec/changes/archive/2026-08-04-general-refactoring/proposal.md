## Why

O projeto necessita de uma refatoração geral com base no code review recente para melhorar a testabilidade (atualmente com 0% de cobertura), desacoplar lógicas de negócios das Server Actions do Next.js, aplicar o Princípio de Responsabilidade Única nos parsers e aprimorar as micro-interações da UI.

## What Changes

- Adição do framework de testes Vitest e criação de testes unitários cruciais para os parsers de faturas.
- Refatoração do dashboard principal (`src/app/page.tsx`), extraindo blocos para componentes menores (`<SummaryCards />`, `<DashboardFilters />`, etc.).
- Desacoplamento da lógica de banco de dados e arquivos da Server Action `invoices.ts` para um serviço dedicado (`invoiceService.ts`).
- Divisão do `pdf-parser.ts` em módulos específicos (Extração, IA, Local).
- Aprimoramento da estética (UI/UX) com estados de loading elegantes (skeletons) e animações sutis (`framer-motion`).

## Capabilities

### New Capabilities
- `testing-framework`: Configuração do Vitest e criação de suítes de testes.
- `code-architecture`: Separação de camadas (Serviços vs Server Actions) e extração de componentes limpos.

### Modified Capabilities
- `invoice-import`: A lógica do parser de faturas e o tratamento de upload serão refatorados.
- `ui-foundation`: Adição de bibliotecas de animação e quebra de componentes monolíticos.

## Impact

- **Código Afetado:** `src/app/page.tsx`, `src/app/actions/invoices.ts`, `src/lib/invoices/pdf-parser.ts`
- **Dependências:** Adição de `vitest`, `framer-motion` e afins no `package.json`.
