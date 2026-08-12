## 1. Banco de Dados & Seeding

- [x] 1.1 Atualizar `src/db/seed.ts` para criar um usuário padrão (`demo@monetaflow.com`), categorias padrão e dados de transações de teste no PostgreSQL.
- [x] 1.2 Executar o seed no banco de dados com `npm run db:seed`.

## 2. Rotas de API no Next.js

- [x] 2.1 Criar a rota `src/app/api/transactions/route.ts` com suporte para `GET` (listar transações) e `POST` (criar transação).
- [x] 2.2 Criar a rota `src/app/api/transactions/[id]/route.ts` com suporte para `PUT` (editar transação) e `DELETE` (remover transação).

## 3. Integração com o Front-end

- [x] 3.1 Atualizar `src/context/TransactionContext.tsx` para carregar as transações via `GET /api/transactions` ao iniciar a aplicação.
- [x] 3.2 Atualizar as funções `addTransaction`, `updateTransaction` e `deleteTransaction` no `TransactionContext.tsx` para realizar chamadas HTTP assíncronas (`POST`, `PUT`, `DELETE`).

## 4. Validação & Verificação

- [x] 4.1 Executar a compilação do Next.js (`npm run build`) para verificar integridade de tipos TypeScript.
- [x] 4.2 Testar o fluxo de persistência no navegador adicionando, editando, excluindo transações e recarregando com F5.
