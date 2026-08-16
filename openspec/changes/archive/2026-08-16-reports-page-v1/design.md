## Context

Atualmente a aplicação possui um item "Relatórios" na barra lateral que leva a uma página 404 (`/relatorios`). A funcionalidade de "Exportar CSV" que seria melhor classificada como um relatório está escondida na aba de perfil das configurações da conta (`SettingsModal.tsx`). Esta proposta visa corrigir o 404 criando a nova rota no App Router do Next.js e organizar a funcionalidade de exportação em seu devido lugar.

## Goals / Non-Goals

**Goals:**
- Criar a página de `/relatorios`.
- Migrar o botão de exportação CSV para essa nova página.
- Deixar placeholders de interface (cards) preparados para futuros relatórios visuais (ex: Fluxo de Caixa).
- Limpar as responsabilidades do Modal de Configurações, focando apenas em perfil e preferências.

**Non-Goals:**
- Implementar gráficos complexos (Recharts) ou consultas avançadas no banco de dados para relatórios visuais nesta fase (V1). Isso ficará para a V2.

## Decisions

1. **Abordagem UI:**
   A página `app/relatorios/page.tsx` utilizará o mesmo layout base de `app/page.tsx` (Dashboard), mas com uma estrutura de cards. Vamos reaproveitar os componentes de UI (`Card`, `Button`, `Download`) já existentes no projeto.
   
2. **Reuso de Código:**
   A função que chama `/api/export` será movida de `SettingsModal.tsx` para o novo componente da página de Relatórios. Nenhuma alteração no backend da exportação CSV será necessária.

## Risks / Trade-offs

- **[Risco] O usuário se perder ao procurar o botão CSV:** 
  - *Mitigação*: Será colocado um aviso ou tooltips nas configurações antigas? Provavelmente não é necessário pois "Relatórios" é um local muito mais óbvio. Manteremos uma interface clara e autoexplicativa na nova aba.
