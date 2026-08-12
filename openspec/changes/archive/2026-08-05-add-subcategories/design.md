## Context

Atualmente o sistema possui categorias chatas/simples, armazenadas na tabela `categories`. O usuário deseja ter categorias em dois níveis: Categoria Mãe e Subcategorias (ex: Transporte > Combustível).

## Goals / Non-Goals

**Goals:**
- Modificar o banco de dados (`schema.ts`) para suportar auto-relacionamento nas categorias (um campo `parentId`).
- Reescrever a lógica do arquivo de seed (`seed.ts`) para injetar a hierarquia de categorias primárias e filhas corretamente, respeitando a lista providenciada pelo usuário.
- Atualizar o script que passa o contexto de IA no `categorizer.ts` para agrupar nomes no formato "Mãe > Filha" e melhorar a precisão da IA.

**Non-Goals:**
- Não pretendemos criar sub-subcategorias (mais de 2 níveis) agora, a hierarquia é fixa em Nível 1 (Mãe) e Nível 2 (Filha).
- Não faremos refatoração massiva da UI (como accordion expansível no dashboard), que pode ser tratada como um incremento futuro.

## Decisions

**Decisão 1: Abordagem do Schema Drizzle**
Ao invés de criar duas tabelas (`parent_categories` e `sub_categories`), decidi adotar a abordagem de `Adjacency List` usando a mesma tabela `categories` com o campo `parentId` que referencia o próprio id.
*Por que?* É o padrão mais flexível, requer menos joins pesados pra buscar a lista toda (Drizzle permite buscar tudo no select), evita refatorar o resto do app inteiro que já aponta para a tabela `categories`.

**Decisão 2: Formato do Contexto para IA**
Em `categorizer.ts`, o Gemini precisa saber dos novos nomes. Se passássemos apenas "Combustível", perderíamos contexto. Passaremos a string interpolada `Mãe > Filha` se existir `parentId`. Na volta da IA (para realizar o match final), usaremos o `resolveCategory` que aceita strings parciais para casar novamente o nome.

## Risks / Trade-offs

**Risco:** Se usuários antigos já têm categorias cadastradas ou transações ativas e rodarem o push, a tabela será modificada.
*Mitigação:* O `parentId` será anulável, portanto não quebra quem já tem.

**Risco:** Duplicate Categories
*Mitigação:* Como vimos no passado, o script de seed precisa checar nomes de subcategorias, porém com a mesma subcategoria podendo ter nomes iguais em nós diferentes (ex "Outros"), é bom checar a combinatória `name` + `parentId`. Para simplificar no seed inicial, faremos uma exclusão lógica ou verificação estrita para injetar uma vez.
