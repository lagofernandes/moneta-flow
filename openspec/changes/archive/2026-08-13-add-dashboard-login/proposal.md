## Why

O projeto precisa proteger a área interna (dashboard) contra acessos não autorizados. Implementar a tela de login é fundamental para garantir a segurança dos dados e permitir a gestão individual de sessões no Moneta Flow, preenchendo uma lacuna de segurança pendente.

## What Changes

- Adição de uma tela de login moderna, vibrante e estilizada (Tailwind + Framer Motion) na rota `/login`.
- Proteção da rota `/dashboard` e suas sub-rotas usando Next.js Middleware, redirecionando usuários não autenticados.
- Expansão do schema do banco de dados (Drizzle ORM / PostgreSQL) para suportar tabelas padrão de autenticação (users, sessions, accounts).
- Implementação do Auth.js (NextAuth.js v5) com Drizzle Adapter para o gerenciamento robusto das sessões via Edge Runtime, suportando login por credenciais.

## Capabilities

### New Capabilities
- `dashboard-auth`: Especifica os requisitos de autenticação para acessar o sistema, incluindo fluxo de login, proteção de rotas (middleware), gerenciamento de sessão e fluxo de logout.

### Modified Capabilities
Nenhuma capacidade existente modificada no nível de requisitos (nova funcionalidade independente).

## Impact

- **Banco de Dados**: O schema atual em `src/db/schema.ts` será modificado e uma migração será necessária para as novas tabelas de autenticação.
- **Roteamento (App Router)**: Adição de `src/middleware.ts` afetará a interceptação de requisições globais da aplicação.
- **Dependências**: Inclusão de `next-auth` (v5) e `@auth/drizzle-adapter`.
- **UI**: Novos componentes de UI compartilhados podem ser gerados no fluxo de autenticação.
