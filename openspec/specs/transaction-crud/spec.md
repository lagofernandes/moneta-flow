# transaction-crud Specification

## Purpose
TBD - created by archiving change postgres-transaction-crud. Update Purpose after archive.
## Requirements
### Requirement: Listar transações do banco de dados
O sistema MUST fornecer o endpoint `GET /api/transactions` para retornar a lista de transações cadastradas no PostgreSQL, ordenadas pela data mais recente.

#### Scenario: Listagem bem-sucedida de transações
- **WHEN** uma requisição GET é feita para `/api/transactions`
- **THEN** o sistema responde com status 200 e uma lista JSON contendo todas as transações com id, descrição, valor, tipo, status, nome da categoria e cor.

### Requirement: Criar nova transação no PostgreSQL
O sistema MUST fornecer o endpoint `POST /api/transactions` para criar e salvar uma nova transação no banco de dados.

#### Scenario: Criação de transação válida
- **WHEN** uma requisição POST é enviada com os dados da transação (descrição, valor, tipo, categoria, data, status)
- **THEN** o sistema salva o registro no PostgreSQL e retorna status 201 com o objeto da transação criada.

### Requirement: Atualizar transação existente
O sistema MUST fornecer o endpoint `PUT /api/transactions/[id]` para alterar os dados de uma transação cadastrada.

#### Scenario: Edição bem-sucedida
- **WHEN** uma requisição PUT é feita em `/api/transactions/[id]` com novos dados de transação
- **THEN** o sistema atualiza o registro correspondente no PostgreSQL e retorna status 200 com os dados atualizados.

### Requirement: Excluir transação do PostgreSQL
O sistema MUST fornecer o endpoint `DELETE /api/transactions/[id]` para remover permanentemente uma transação.

#### Scenario: Remoção bem-sucedida
- **WHEN** uma requisição DELETE é enviada para `/api/transactions/[id]`
- **THEN** o sistema deleta a transação do banco de dados e retorna status 200 indicando o sucesso.

