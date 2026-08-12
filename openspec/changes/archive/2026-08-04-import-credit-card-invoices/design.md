## Context

O Moneta Flow é um sistema de controle financeiro pessoal construído com Next.js 15, React 19, Tailwind CSS e Drizzle ORM sobre PostgreSQL. Atualmente, os usuários precisam inserir transações manualmente. Esta mudança adiciona a capacidade de importar faturas de cartão de crédito em arquivos PDF, OFX ou CSV, utilizando inteligência artificial multimodal (Gemini Flash) e busca web para categorização automática.

## Goals / Non-Goals

**Goals:**
- Ingestão e parsing de faturas de cartão de crédito em PDF, OFX e CSV.
- Motor de categorização em 3 níveis (Nível 1: `merchant_rules` local, Nível 2: Gemini Flash LLM em lote, Nível 3: Google Search Grounding para nomes obscuros/CNPJs).
- Interface de Staging (modal/área de revisão) para confirmação ou ajuste manual das categorias antes de persistir no banco de dados.
- Mecanismo de aprendizado contínuo atualizando `merchant_rules` com base nas confirmações do usuário.

**Non-Goals:**
- Conexão direta via APIs bancárias do Open Finance (o escopo é estritamente via upload de arquivos de fatura).
- Conciliação bancária automática com transações manuais existentes (as transações importadas entram como novas transações).

## Decisions

### Decisão 1: Schema do Banco de Dados (`merchant_rules`)
Adicionar a tabela `merchant_rules` no Drizzle Schema (`src/db/schema.ts`):
```typescript
export const merchantRules = pgTable('merchant_rules', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  pattern: text('pattern').notNull(),
  categoryId: uuid('category_id').notNull().references(() => categories.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

### Decisão 2: Ingestão de PDF com Gemini Multimodal
Para PDF, utilizaremos a capacidade de visão/documentos do Gemini Flash enviando o buffer do PDF diretamente com prompt instruindo o retorno em JSON estrito. Para OFX e CSV, usaremos parsers locais leves.

### Decisão 3: Categorização em 3 Níveis
1. **Cache Local**: Busca por regex/substring na tabela `merchant_rules` do usuário.
2. **LLM Batch**: Deduplica os nomes restantes de estabelecimentos e envia um lote para a API do Gemini.
3. **Google Search Grounding**: Se o Gemini retornar nível de confiança baixo ou se a descrição parecer um CNPJ / razão social atípica (ex: "COMPASSION MEAT EIRELI"), acionar chamada com Search Grounding ativado.

### Decisão 4: Interface de Staging
Criar um componente React (`InvoiceStagingModal` / `InvoiceImportSection`) que mantém o estado da fatura extraída no cliente até que o usuário clique em "Confirmar Importação", acionando uma Server Action que salva as transações em lote.

## Risks / Trade-offs

- **[Risco]** Ausência da chave de API do Gemini (`GEMINI_API_KEY`) no ambiente.
  - *Mitigação*: Caso a chave não esteja configurada ou ocorra erro de API, o sistema realiza o parsing básico do arquivo e preenche a staging área com categorias padrão/pendentes para que o usuário categorize manualmente sem quebrar a importação.
- **[Risco]** PDFs de faturas com formatos não padronizados ou protegidos por senha.
  - *Mitigação*: Tratar exceções de validação no upload informando o usuário sobre arquivos protegidos e instruindo a remoção de senha antes do upload.
