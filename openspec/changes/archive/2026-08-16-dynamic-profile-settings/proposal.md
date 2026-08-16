## Why

Atualmente, o modal de configurações e o cabeçalho apresentam dados "hardcoded" (estáticos), não refletindo a real sessão do usuário. Para um aplicativo financeiro de qualidade, é essencial que a experiência seja personalizada. Precisamos sincronizar os dados da conta (nome, e-mail), permitir a edição desses dados, gerenciar preferências (moeda, fuso horário) persistidas no banco de dados, e oferecer exportação de dados.

## What Changes

- Sincronização do cabeçalho e modal de configurações com os dados reais do `useSession` do NextAuth.
- Adição de colunas `currency` e `timezone` na tabela `users` do banco de dados (Drizzle).
- Criação de interface para alterar Moeda e Fuso Horário, e salvar no banco de dados via API.
- Criação de interface para Editar Perfil (alterar Nome e Senha).
- Criação de endpoint para Exportação de Dados em formato CSV.

## Capabilities

### New Capabilities
- `profile-management`: Funcionalidades de alteração de nome, senha e preferências (moeda, fuso horário).
- `data-export`: Funcionalidade de baixar relatórios/dados em formato CSV.

### Modified Capabilities
- `dashboard-auth`: A sessão de autenticação agora precisa atualizar o estado do cliente e alimentar o cabeçalho com os dados do perfil.
- `database-schema`: A tabela de usuários necessita de novos campos (`currency`, `timezone`).

## Impact

- **Banco de Dados (schema.ts):** Nova migração necessária para as novas colunas.
- **APIs:** Novos endpoints de `PATCH /api/users/me` (preferências e perfil), `POST /api/users/me/password` (alterar senha), e `GET /api/export` (gerar CSV).
- **Componentes React:** Atualização do `Header.tsx` e `SettingsModal.tsx`.
- **Autenticação:** O JWT gerado precisa possivelmente carregar ou atualizar essas novas informações se quisermos acesso rápido via `useSession`, ou faremos fetch do DB.
