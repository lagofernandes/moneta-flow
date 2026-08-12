## Context

O aplicativo Moneta Flow possui uma interface Next.js completa com gráficos e tabelas de transações. No entanto, o `TransactionContext.tsx` mantinha as transações exclusivamente em estado local (`useState`). A infraestrutura com PostgreSQL (Docker) e Drizzle ORM já possui os esquemas de tabelas (`users`, `categories`, `transactions`) definidos em `src/db/schema.ts`, mas faltava a camada de API do servidor para conectar o front-end ao banco de dados.

## Goals / Non-Goals

**Goals:**
- Criar endpoints da API Next.js (`/api/transactions` e `/api/transactions/[id]`) usando Drizzle ORM.
- Conectar o `TransactionContext` para sincronizar as chamadas de busca, criação, edição e exclusão de transações via HTTP.
- Popular o banco PostgreSQL no Docker com usuário padrão e categorias iniciais caso esteja vazio.

**Non-Goals:**
- Implementar fluxo completo de autenticação multilogin (OAuth/JWT) nesta fase; será utilizado um usuário de sistema padrão para simplificar o desenvolvimento.
- Modificar componentes de UI ou alterar o visual do dashboard.

## Decisions

- **Decisão 1: Utilizar Next.js API Routes (App Router)**
  - *Rationale*: Mantém o código do servidor no mesmo projeto TypeScript, eliminando a necessidade de um backend dedicado em separado.
  - *Alternativa considerada*: Criar um servidor Express separado. (Rejeitada por adicionar complexidade desnecessária de deploy e manutenção).

- **Decisão 2: Mapeamento de Categorias dinâmico no Drizzle**
  - *Rationale*: A tabela `transactions` armazena `categoryId` como chave estrangeira. As APIs irão resolver o nome da categoria enviada no front-end buscando ou criando a categoria correspondente no banco.

- **Decisão 3: Usuário padrão para desenvolvimento local**
  - *Rationale*: Como a tabela `transactions` exige um `userId`, a API garantirá que exista um usuário padrão (`demo@monetaflow.com`) no banco para associar todas as transações criadas.

## Risks / Trade-offs

- **[Risco] Mismatch de tipos entre a API e a Interface Transaction** → *Mitigação*: Formatar a resposta JSON da API para bater exatamente com a interface `Transaction` (com campos `id`, `description`, `amount` numérico, `type`, `status`, `category`, `color`, `date`).
- **[Risco] Erro de conexão com o banco se o Docker estiver desligado** → *Mitigação*: Exibir mensagens claras de erro no console e retornar status HTTP 500 informando falha de conexão.
