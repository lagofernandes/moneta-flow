## Why

Para permitir relatórios financeiros mais granulares e precisos, o sistema precisa suportar um modelo de subcategorias. O usuário deseja saber não apenas o valor total gasto em "Transporte", mas também detalhar os custos em "Combustível", "Manutenção", "Aplicativos", etc. Este modelo hierárquico é padrão em gerenciadores financeiros e aumenta imensamente o valor dos relatórios para os usuários.

## What Changes

- Adição do campo de hierarquia (`parentId`) na tabela de categorias do banco de dados para criar um auto-relacionamento (Categoria Mãe -> Subcategoria).
- A tabela `categories` deixará de ser preenchida com categorias planas e passará a ser populada (via seed) com os agrupamentos de Mães e Subcategorias detalhadas.
- O motor de Inteligência Artificial (Gemini) passará a receber a lista de categorias contextuais (ex: "Transporte > Combustível") para classificar faturas com mais precisão.
- Atualização do mapeamento visual de emojis (`utils.ts`) para suportar perfeitamente as novas subcategorias.
- **BREAKING**: Categorias antigas cadastradas por usuários que não mapeiam para a nova estrutura de subcategorias precisarão ser revistas, mas o script de seed garantirá suporte limpo na inicialização do sistema.

## Capabilities

### New Capabilities
- `hierarchical-categories`: Suporte a estrutura de duas camadas (Mãe e Filha) para categorização de lançamentos e faturas.

### Modified Capabilities
- `ai-categorizer`: O motor de IA precisará ler a estrutura de árvore e enviar o caminho hierárquico ao LLM.

## Impact

- **Banco de Dados (Drizzle)**: Modificação da tabela `categories` e arquivo `seed.ts`. Requer uma nova migração.
- **Backend (Categorizer)**: O algoritmo de parsing de categorias e chamadas ao Gemini Flash precisará cruzar os IDs das categorias pais para compor o array enviado ao prompt.
- **UI (Relatórios)**: A UI (Dashboards) não sofrerá quebras imediatas pois as transações ainda terão um `categoryId`, mas as legendas (emojis) precisarão mapear corretamente. A UI se beneficiará no futuro, permitindo drill-down nos gráficos (embora o drill-down em si não seja o foco deste PR inicial, apenas o suporte dos dados).
