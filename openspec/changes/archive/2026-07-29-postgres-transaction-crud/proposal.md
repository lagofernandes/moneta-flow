## Why

Atualmente, o gerenciamento de transações do Moneta Flow armazena dados apenas na memória temporária do React (`useState`), o que faz com que as alterações (criação, edição e exclusão) sejam perdidas sempre que o usuário atualiza a página (F5). Para tornar o aplicativo funcional e persistente, é necessário conectar a interface visual ao banco de dados PostgreSQL rodando no Docker via Drizzle ORM.

## What Changes

- **Integração do Front-end com API Routes**: Conectar o `TransactionContext` para consumir rotas de API em vez de depender apenas de estado local em memória.
- **Rotas de API no Next.js (`/api/transactions`)**:
  - `GET /api/transactions`: Buscar transações do banco PostgreSQL ordenadas por data.
  - `POST /api/transactions`: Inserir nova transação associada ao usuário padrão.
- **Rotas de API por ID (`/api/transactions/[id]`)**:
  - `PUT /api/transactions/[id]`: Atualizar dados de uma transação existente.
  - `DELETE /api/transactions/[id]`: Remover uma transação do banco de dados.
- **Seeding Automático de Dados**: Atualizar a rotina de seed para cadastrar um usuário padrão (`demo@monetaflow.com`), categorias padrão e dados fictícios iniciais no PostgreSQL.

## Capabilities

### New Capabilities
- `transaction-crud`: Persistência completa (CRUD) de transações financeiras no banco de dados PostgreSQL utilizando Drizzle ORM e Next.js API Routes.

### Modified Capabilities
*(Nenhuma capacidade existente modificada)*

## Impact

- **Back-end / APIs**: Criação de `src/app/api/transactions/route.ts` e `src/app/api/transactions/[id]/route.ts`.
- **Front-end / Context**: Modificação em `src/context/TransactionContext.tsx` para realizar chamadas HTTP assíncronas (`fetch`).
- **Banco de Dados**: Atualização de `src/db/seed.ts` e inserção de dados na tabela `transactions`.
