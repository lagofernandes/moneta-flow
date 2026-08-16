## Context

O projeto atual (Moneta Flow) não possui um sistema de autenticação, deixando a rota do dashboard exposta. A stack do projeto é Next.js 15, Tailwind, Framer Motion e Drizzle ORM com Postgres. Precisamos de uma solução nativa, segura e escalável para gerenciar o login, proteger as rotas restritas e manter o alinhamento com a arquitetura server-first do Next.js.

## Goals / Non-Goals

**Goals:**
- Proteger rotas sob `/dashboard` usando interceptação na Edge (Next.js Middleware).
- Permitir login via Email e Senha (Credentials Provider) como primeira entrega.
- Preparar a estrutura de tabelas do banco de dados para suportar múltiplos métodos de autenticação no futuro (OAuth2).
- Garantir uma interface visual premium (Tailwind + animações) para a tela de login.

**Non-Goals:**
- Implementar fluxo de "Esqueci minha senha" nesta iteração inicial.
- Adicionar provedores de login social (Google,etc) imediatamente (apenas preparar a infraestrutura).
- Utilizar serviços externos de BaaS (como Firebase Auth ou Clerk). Toda a autenticação será hospedada na própria aplicação.

## Decisions

- **Auth Provider**: Utilizaremos **Auth.js (antigo NextAuth.js v5)**.
  - *Rationale*: Padrão estabelecido para Next.js 15, suporta nativamente o App Router, Server Actions e possui execução otimizada na Edge (essencial para o Middleware não pesar no tempo de carregamento da página).
  - *Alternatives*: Lucia Auth (exige mais abstração e código boilerplate) ou Supabase Auth (adiciona dependência de serviço externo não requisitado).
- **Session Strategy**: Database Sessions (via **@auth/drizzle-adapter**).
  - *Rationale*: Armazenar sessões no banco permite revogação de sessão remota e alinha o gerenciamento de usuários perfeitamente com as tabelas do sistema através do Drizzle.
- **Form Validation**: Validação via **Zod** com Server Actions.
  - *Rationale*: O projeto já conta com o Zod instalado (`package.json`). Garantiremos segurança ponta a ponta validando o payload de login tanto no cliente quanto no servidor antes de chamar o Auth.js.

## Risks / Trade-offs

- **Risk**: Auth.js (v5) ainda carrega o status de Beta oficial para o framework, o que pode trazer pequenas mudanças em APIs secundárias.
  - *Mitigation*: Utilizaremos as APIs fundamentais documentadas que já estão estáveis no ecossistema (configuração centralizada em `auth.ts` e exportação do middleware/handlers).
- **Trade-off**: Usar Database Sessions em vez de JWT puros (JWE) cria uma query adicional no banco para cada rota protegida validada no middleware (caso o check seja feito estritamente no DB).
  - *Mitigation*: O middleware do Auth.js utiliza estratégias híbridas eficientes e o banco (PostgreSQL) lidará tranquilamente com essa validação para a escala do Moneta Flow.
