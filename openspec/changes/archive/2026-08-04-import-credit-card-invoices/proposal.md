## Why

Os usuários do Moneta Flow precisam de uma forma automatizada e inteligente de importar suas faturas de cartão de crédito (PDF, OFX e CSV). A inclusão manual de cada transação de fatura gera alto atrito e perda de tempo. Com esta funcionalidade, o sistema interpretará e categorizará cada lançamento automaticamente, aprendendo com os ajustes do usuário e consultando o Google para identificar razões sociais e nomes obscuros de estabelecimentos.

## What Changes

- **Upload de Faturas**: Suporte para drag & drop e upload de faturas nos formatos PDF, OFX e CSV.
- **Extração Inteligente (Parsing)**: Leitura de tabelas e metadados de faturas em PDF utilizando a API Multimodal do Gemini Flash (extraindo data, descrição, valor e parcela).
- **Motor Híbrido de Categorização (3 Níveis)**:
  1. *Nível 1 (Cache Local)*: Verificação na tabela `merchant_rules`.
  2. *Nível 2 (LLM Gemini Flash)*: Categorização em lote de nomes inéditos.
  3. *Nível 3 (Google Search Grounding)*: Busca no Google para pesquisar estabelecimentos com razões sociais ou nomes obscuros (ex: CNPJ / máquina de cartão) e determinar a categoria correta.
- **Área de Staging / Pré-visualização**: Tabela interativa para revisão dos lançamentos extraídos com alteração de categorias, ajuste de descrições e seleção de quais itens efetivamente importar.
- **Aprendizado Contínuo**: Salvamento de novos padrões em `merchant_rules` a cada confirmação de importação do usuário.
- **Schema Drizzle**: Adição da tabela `merchant_rules`.

## Capabilities

### New Capabilities
- `invoice-import`: Upload, validação e extração estruturada de lançamentos de faturas em PDF, OFX e CSV.
- `auto-categorization`: Motor híbrido de classificação em 3 níveis (Regras Locais, Gemini Flash e Google Search Grounding).
- `merchant-rules`: Armazenamento e aprendizado contínuo dos padrões de estabelecimentos associados às categorias do usuário.

### Modified Capabilities
- Nenhuma alteração em requisitos de funcionalidades existentes.

## Impact

- **Banco de Dados**: Criação da tabela `merchant_rules` com relacionamentos para `users` e `categories`.
- **Dependências**: Instalação do SDK do Gemini, `pdf-parse` (ou extração multimodal Gemini), `ofx-parser`, `papaparse`.
- **Backend/API**: Rotas/Server Actions para ingestão da fatura, pipeline de categorização e persistência das transações.
- **Frontend**: Componentes UI de Upload, Tabela de Staging com badges de origem ("Histórico", "IA", "Busca Web"), seletor em lote e diálogos de confirmação.
