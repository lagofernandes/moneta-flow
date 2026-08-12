# 💰 Moneta Flow

**Moneta Flow** é uma aplicação inteligente de gestão de finanças pessoais construída com Next.js. Possui uma engine de processamento de faturas com IA que analisa automaticamente extratos de cartão de crédito e categoriza transações usando uma arquitetura híbrida de 4 níveis alimentada pelo Google Gemini.

---

## ✨ Funcionalidades

### 📊 Dashboard Financeiro
- **Cards Resumo** — Visão geral em tempo real de receita total, despesas, saldo e taxa de economia.
- **Gráficos Interativos** — Distribuição visual de gastos por categoria e subcategoria usando Recharts, com alternância entre visões pai/filho.
- **Filtros Avançados** — Filtre transações por termo de busca, categoria, subcategoria, tipo (receita/despesa), mês e banco.
- **Tabela de Transações Recentes** — Lista paginada com exibição inline de categorias e modais de detalhes.
- **Modo Escuro** — Suporte completo a tema escuro/claro via ThemeContext.

### 📄 Engine de Importação de Faturas
- **Suporte Multi-formato** — Upload e parsing de extratos bancários em **PDF**, **OFX** e **CSV/TXT**.
- **Extração de PDF com IA** — Utiliza **Gemini Flash** para extrair dados estruturados de transações (data, descrição, valor, informações de parcelas) de textos não estruturados em PDF.
- **Parser Local de Fallback** — Se o Gemini estiver indisponível, um parser baseado em regex por proximidade extrai os dados localmente sem chamadas de API.
- **Detecção Automática de Banco** — Identifica automaticamente o banco emissor (Itaú, Nubank, Bradesco, etc.) a partir do conteúdo do documento.
- **Inteligência de Data da Fatura** — Infere o período de cobrança a partir do cabeçalho de vencimento, ajustando o mês de referência adequadamente.

### 🧠 Engine de Categorização Inteligente (IA Híbrida de 4 Níveis)

A inteligência central do Moneta Flow. Toda transação importada passa por até 4 níveis de categorização:

| Nível | Nome | Fonte | Velocidade | Confiança |
|-------|------|-------|------------|-----------|
| **1** | Regras Locais | Tabela `merchant_rules` (por usuário) | ⚡ Instantâneo | ALTA |
| **1.5** | Cache Global | Tabela `global_merchant_cache` (compartilhado) | ⚡ Instantâneo | ALTA |
| **2** | Gemini LLM | Classificação em lote via Gemini Flash | 🔄 ~2-5s | ALTA / MÉDIA |
| **3** | Busca Web | Google Search Grounding para nomes obscuros | 🌐 ~5-10s | ALTA |

**Como funciona:**
1. **Nível 1** — Verifica se o usuário já categorizou esse estabelecimento anteriormente. Se sim, aplica a mesma categoria instantaneamente.
2. **Nível 1.5** — Consulta uma base de conhecimento global (populada automaticamente pelos resultados do Nível 3) para estabelecimentos conhecidos.
3. **Nível 2** — Envia todos os estabelecimentos não categorizados restantes ao Gemini Flash em um único lote. A IA retorna um nome de categoria e um nível de confiança (`HIGH`, `MEDIUM` ou `LOW`). Apenas resultados `HIGH` e `MEDIUM` são aceitos; itens `LOW` passam para o próximo nível.
4. **Nível 3** — Usa o Google Search Grounding para pesquisar nomes obscuros, CNPJs e processadores de pagamento (ex: `MP*`, `PAG*`) na web. Os resultados são automaticamente salvos no `global_merchant_cache` para uso futuro.

Itens que permanecem sem resolução após os 4 níveis são marcados como **Pendentes** para revisão manual na Tabela de Staging.

### 📋 Tabela de Staging (Revisão e Confirmação)
- **Revisão Pré-importação** — Após o upload, todos os itens aparecem em uma tabela de staging com suas categorias atribuídas pela IA e níveis de confiança.
- **Edição Inline** — Altere a categoria de qualquer item via dropdown antes de confirmar.
- **Seleção em Lote** — Selecione/desmarque itens individuais ou todos de uma vez.
- **Toggle de Aprendizado Contínuo** — Quando "Salvar escolhas para aprender nas próximas faturas" está ativado, cada transação confirmada cria uma entrada em `merchant_rule`. Nas importações futuras, o Nível 1 categorizará instantaneamente esse estabelecimento sem chamar a IA.

### 🗂️ Categorias Hierárquicas
- **Estrutura Pai > Filho** — Categorias são organizadas em árvore (ex: `Transporte > Transporte Coletivo`, `Alimentação > Supermercado`).
- **Totalmente Customizável** — Usuários podem criar, renomear, reordenar e deletar categorias. O prompt da IA é construído dinamicamente a partir do banco de dados, então não existem nomes de categorias hardcoded.
- **Seed Padrão** — Um conjunto curado de categorias de despesas brasileiras é semeado na primeira execução (Transporte, Moradia, Alimentação, Pessoal & Saúde, Lazer, Educação, Serviços Financeiros, etc).

---

## 🏗️ Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **Linguagem** | TypeScript |
| **UI** | React 19, Tailwind CSS, Lucide Icons, Framer Motion |
| **Gráficos** | Recharts |
| **Banco de Dados** | PostgreSQL 16 (via Docker) |
| **ORM** | Drizzle ORM + Drizzle Kit |
| **IA** | Google Gemini Flash (`@google/genai`) |
| **Parsing de PDF** | pdf.js (`pdfjs-dist`) + Gemini Vision |
| **Parsing de Arquivos** | PapaParse (CSV), parser OFX customizado |
| **Validação** | Zod |
| **Testes** | Vitest |

---

## 🗄️ Esquema do Banco de Dados

```
┌─────────────┐     ┌──────────────┐     ┌──────────────────┐
│    users    │────<│  categories  │────<│   transactions   │
│             │     │  (árvore via │     │                  │
│  id (PK)    │     │   parentId)  │     │  userId (FK)     │
│  name       │     │              │     │  categoryId (FK) │
│  email      │     │  userId (FK) │     │  type            │
│ passwordHash│     │  parentId    │     │  amount          │
│             │     │  name        │     │  description     │
│             │     │  type        │     │  bank            │
│             │     │  color       │     │  date            │
│             │     │  icon        │     │  status          │
└─────────────┘     └──────────────┘     └──────────────────┘
                           │
               ┌───────────┼───────────────┐
               ▼                           ▼
    ┌──────────────────┐      ┌─────────────────────────┐
    │  merchant_rules  │      │ global_merchant_cache   │
    │  (por usuário L1)│      │ (compartilhado L1.5)    │
    │                  │      │                         │
    │  userId (FK)     │      │ pattern (único)         │
    │  pattern         │      │ categoryId (FK)         │
    │  categoryId (FK) │      └─────────────────────────┘
    └──────────────────┘
```

---

## 🚀 Como Começar

### Pré-requisitos
- **Node.js** 18+
- **Docker** (para o PostgreSQL)
- **Chave de API do Google AI Studio** ([Obtenha aqui](https://aistudio.google.com/apikey))

### 1. Clone e Instale

```bash
git clone https://github.com/lagofernandes/moneta-flow.git
cd moneta-flow
npm install
```

### 2. Inicie o Banco de Dados

```bash
docker compose up -d
```

### 3. Configure o Ambiente

```bash
cp .env.example .env.local
```

Edite o `.env.local` e defina seus valores:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/moneta_flow
GEMINI_API_KEY=sua_chave_api_gemini_aqui
```

### 4. Aplique o Schema e Popule os Dados

```bash
npm run db:push
npm run db:seed
```

### 5. Execute a Aplicação

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 📜 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Build para produção |
| `npm run start` | Inicia o servidor de produção |
| `npm run test` | Executa testes com Vitest |
| `npm run test:watch` | Executa testes em modo watch |
| `npm run db:generate` | Gera migrações do Drizzle |
| `npm run db:push` | Aplica o schema no banco de dados |
| `npm run db:studio` | Abre o Drizzle Studio (interface visual do banco) |
| `npm run db:seed` | Popula o banco com categorias padrão e dados de exemplo |

---

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── actions/           # Server Actions do Next.js
│   │   └── invoices.ts    # processInvoiceFileAction, confirmInvoiceImportAction
│   ├── api/               # Rotas de API
│   ├── globals.css        # Estilos globais e configuração Tailwind
│   ├── layout.tsx         # Layout raiz com providers
│   └── page.tsx           # Página principal (dashboard)
├── components/
│   ├── dashboard/         # Widgets do dashboard
│   │   ├── DashboardFilters.tsx
│   │   ├── FinancialChart.tsx
│   │   ├── RecentTransactionsTable.tsx
│   │   └── SummaryCards.tsx
│   ├── invoices/          # Fluxo de importação de faturas
│   │   ├── InvoiceUploadModal.tsx
│   │   └── InvoiceStagingTable.tsx
│   ├── layout/            # Shell da aplicação (sidebar, header)
│   ├── modals/            # Modal de detalhes da transação
│   └── ui/                # Componentes UI reutilizáveis (Button, Card, etc.)
├── context/
│   ├── ThemeContext.tsx    # Toggle de modo escuro/claro
│   └── TransactionContext.tsx  # Estado global de transações, filtros e categorias
├── db/
│   ├── index.ts           # Cliente Drizzle do banco
│   ├── schema.ts          # Todas as tabelas, relações e tipos
│   └── seed.ts            # Categorias padrão e transações de exemplo
├── lib/
│   ├── invoices/
│   │   ├── categorizer.ts      # Engine de Categorização IA de 4 Níveis
│   │   ├── pdf-parser.ts       # Orquestrador de PDF (Gemini + fallback local)
│   │   ├── ofx-csv-parser.ts   # Parsers de OFX e CSV
│   │   ├── types.ts            # Tipo ParsedInvoiceItem
│   │   └── parsers/
│   │       ├── gemini-parser.ts   # Extração de PDF via Gemini Flash
│   │       ├── local-parser.ts    # Parser de fallback baseado em regex
│   │       ├── pdf-extractor.ts   # Extração de texto via pdf.js
│   │       └── utils.ts          # Utilitários de detecção de banco
│   └── utils.ts           # Helpers de formatação (moeda, datas, cn)
└── services/
    └── invoiceService.ts  # Lógica de negócio: processar arquivo → categorizar → confirmar importação
```

---

## 🔄 Fluxo de Importação de Faturas

```
┌──────────────┐    ┌───────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Upload do   │───>│  Parsing do   │───>│  Categorização   │───>│  Tabela de      │
│  Usuário     │    │  Arquivo      │    │  IA de 4 Níveis  │    │  Staging        │
│  (PDF/OFX/   │    │  (Gemini ou   │    │                  │    │  (Revisão e     │
│   CSV)       │    │   local)      │    │                  │    │   Edição)       │
└──────────────┘    └───────────────┘    └──────────────────┘    └────────┬────────┘
                                                                          │
                                                                    Usuário Confirma
                                                                          │
                                                                          ▼
                                                                 ┌─────────────────┐
                                                                 │  Salvar no BD   │
                                                                 │  (transactions  │
                                                                 │  + merchant     │
                                                                 │    rules)       │
                                                                 └─────────────────┘
```

---

## 📝 Licença

Este projeto é privado e não está licenciado para distribuição pública.