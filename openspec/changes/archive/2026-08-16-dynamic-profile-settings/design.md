## Context

O sistema atual tem o modal de configurações e o menu do perfil construídos apenas com componentes de UI visuais, sem a integração real com dados dinâmicos do banco ou persistência das alterações do usuário. É preciso tornar essa interface interativa, integrando com o banco de dados via Drizzle e o Auth.js (NextAuth).

## Goals / Non-Goals

**Goals:**
- Atualizar a tabela de usuários com os campos `currency` e `timezone`.
- Criar a API para leitura e escrita das configurações de perfil (`PATCH /api/users/me`).
- Criar a API para exportação das informações para o usuário (`GET /api/export`).
- Atualizar componentes visuais para ler da API / sessão.

**Non-Goals:**
- Implementação de um painel de administração completo.
- Exportação de dados complexa em múltiplos formatos (apenas CSV inicial).
- Autenticação via SMS ou biometria.

## Decisions

- **Armazenamento:** Preferências de moeda e fuso horário salvas na tabela `users` do banco de dados (postgreSQL/Neon) utilizando Drizzle. Porquê? Para garantir persistência e experiência cross-device sem "resetar" em cada navegador como ocorreria com Local Storage.
- **Sincronização:** Para acesso imediato, as iniciais e o nome/e-mail no cabeçalho virão através de `useSession()` do NextAuth no Client Component `Header.tsx`.
- **Exportação:** Exportar via stream CSV simplificado na rota do Next.js App Router para evitar timeout em queries pesadas.

## Risks / Trade-offs

- **Cache de Sessão do NextAuth:** As vezes, a edição do nome do usuário pode não refletir na sessão imediatamente devido a cache de JWT.
  *Mitigação*: Após a edição (PATCH com sucesso na API), usaremos `update()` fornecido por `useSession` ou recarregaremos a página.
