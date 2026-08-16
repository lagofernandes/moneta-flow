## 1. Banco de Dados & Auth

- [x] 1.1 Atualizar `src/db/schema.ts` para adicionar as colunas `currency` (default: "BRL") e `timezone` (default: "America/Sao_Paulo") na tabela `users`.
- [x] 1.2 Gerar e rodar migrações do Drizzle para aplicar no banco de dados.
- [x] 1.3 Atualizar os tipos do NextAuth em `auth.ts` para garantir acesso rápido se necessário ou criar queries Drizzle otimizadas.

## 2. API Routes

- [x] 2.1 Criar endpoint `PATCH /api/users/me` para atualizar preferências (moeda, fuso) e nome com Zod validation.
- [x] 2.2 Criar endpoint `POST /api/users/me/password` para permitir alteração de senha de forma segura (hasheando com bcrypt/sha256).
- [x] 2.3 Criar endpoint `GET /api/export` para gerar e retornar o stream do arquivo CSV de transações do usuário logado.

## 3. Testes Unitários e Integração

- [x] 3.1 Escrever testes para a rota `PATCH /api/users/me` garantindo que rejeita payloads inválidos e atualiza o banco com sucesso.
- [x] 3.2 Escrever testes para `POST /api/users/me/password` garantindo a criptografia e bloqueio se a senha antiga não bater (se aplicável).
- [x] 3.3 Escrever testes unitários para a rota de exportação CSV (`/api/export`).

## 4. Frontend: Header e Sessão

- [x] 4.1 Modificar `Header.tsx` para consumir e exibir iniciais e primeiro nome via `useSession()`.

## 5. Frontend: Modal de Configurações e Perfil

- [x] 5.1 Atualizar `SettingsModal.tsx` para ler as preferências do banco (via fetch ou session) e exibi-las em dropdowns controlados.
- [x] 5.2 Adicionar formulário de "Editar Perfil" (nome e senha) dentro de uma aba ou expansão no `SettingsModal.tsx`.
- [x] 5.3 Criar botão de "Exportar meus dados (CSV)" e implementar a lógica de download.
- [x] 5.4 Testar componentes UI (ex: modal renderizando com dados da API mockada).
