## Context

O projeto atual (Moneta Flow) sofre de componentes altamente acoplados, um parser de PDF extenso e monolítico, lógica de banco de dados diretamente em funções que recebem FormData e ausência de testes unitários. Este débito técnico impede a adição de novas lógicas ou a manutenção segura. A UI, embora já tenha um bom design base (Tailwind, Lucide), precisa de aprimoramentos dinâmicos (framer-motion) para um toque mais premium.

## Goals / Non-Goals

**Goals:**
- Configurar o Vitest para rodar testes na pasta `src/__tests__` ou junto aos arquivos `*.test.ts`.
- Desacoplar a UI gigante (`page.tsx`) em 3-4 componentes focados (`components/dashboard/*`).
- Criar o `src/services/invoiceService.ts` e isolar todo o Drizzle ORM que hoje está nas Server Actions.
- Refatorar o `pdf-parser.ts`, dividindo o parse local, a extração de texto em PDF (pdfjs) e a lógica de LLM.

**Non-Goals:**
- Não migrar o banco de dados (esquema continua o mesmo).
- Não trocar o framework de estilos (continuamos com Tailwind).
- Não criar rotas novas na aplicação, focar apenas na reestruturação e testes.

## Decisions

- **Vitest como framework de testes:** Mais leve, rápido e aderente ao ecossistema moderno do que o Jest para um projeto TypeScript.
- **Injeção de dependências leve (Serviços):** Criaremos arquivos de serviço em `src/services` exportando funções ou classes para lidar com a orquestração do Parser e DB, enquanto a Server Action apenas faz proxy entre HTTP e o serviço.
- **Framer Motion para UI:** Escolhido por se integrar de maneira nativa com React e ser fácil de colocar animações de layout (`layout` prop).

## Risks / Trade-offs

- **Risco:** Quebrar o funcionamento da página de Dashboard durante a quebra de componentes.
  **Mitigação:** Fazer o refatoramento de forma gradual e testar o funcionamento (visualização local) a cada quebra.
- **Risco:** O `pdfjs-dist` e o `pdf-parse` podem ser difíceis de testar em ambiente Node.
  **Mitigação:** Vamos focar os testes unitários nas funções puras (como a regex do LocalParser ou o parser do OFX) injetando strings brutas ao invés de buffers reais de PDF.
