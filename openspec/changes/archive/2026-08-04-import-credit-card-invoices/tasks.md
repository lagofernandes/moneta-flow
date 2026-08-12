## 1. Schema do Banco de Dados e Migração

- [x] 1.1 Adicionar a tabela `merchant_rules` em `src/db/schema.ts` com relacionamentos para `users` e `categories`
- [x] 1.2 Executar a migração do banco de dados com Drizzle Kit (`npm run db:push` ou `drizzle-kit generate`)

## 2. Serviços de Ingestão e Parsers de Fatura

- [x] 2.1 Instalar dependências necessárias (`@google/genai` ou SDK Gemini, `pdf-parse`, `ofx-parser`, `papaparse`)
- [x] 2.2 Criar serviço de parsing multimodal de PDFs de fatura utilizando a API do Gemini Flash (`src/lib/invoices/pdf-parser.ts`)
- [x] 2.3 Criar serviço de parsing determinístico para arquivos OFX e CSV (`src/lib/invoices/ofx-csv-parser.ts`)

## 3. Motor Híbrido de Categorização

- [x] 3.1 Implementar busca local no banco de dados na tabela `merchant_rules` (Nível 1)
- [x] 3.2 Implementar serviço de classificação em lote via Gemini Flash LLM para estabelecimentos inéditos (Nível 2)
- [x] 3.3 Implementar integração de Google Search Grounding para estabelecimentos obscuros/CNPJs (Nível 3)
- [x] 3.4 Unificar a pipeline de categorização híbrida e marcação de origem/badges (`src/lib/invoices/categorizer.ts`)

## 4. Frontend e Interface de Staging (Revisão)

- [x] 4.1 Criar componente modal/drag-and-drop de Upload de Faturas (`src/components/invoices/InvoiceUploadModal.tsx`)
- [x] 4.2 Criar tabela interativa de Staging (`src/components/invoices/InvoiceStagingTable.tsx`) com seletores de categoria, ajuste de descrição e badges de origem
- [x] 4.3 Criar Server Action em `src/app/actions/invoices.ts` para persistir as transações confirmadas em `transactions` e gravar as regras de aprendizado em `merchant_rules`

## 5. Validação e Testes

- [x] 5.1 Realizar teste de importação de fatura em PDF, validando a exibição correta dos lançamentos na Staging Area
- [x] 5.2 Realizar teste de aprendizado importando uma segunda fatura com estabelecimentos repetidos e verificar se a resolução ocorre via Nível 1 (regras locais)
