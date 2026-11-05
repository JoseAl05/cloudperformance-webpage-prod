# Componentes `components/azure/cards/`

[← Índice](../../README.md)

Tarjeta de mensaje (avisos) de las vistas Azure.

Archivos:

- [`components/azure/cards/MessageCards.tsx`](#components-azure-cards-messagecards-tsx)

<a id="components-azure-cards-messagecards-tsx"></a>
## `components/azure/cards/MessageCards.tsx`

**Componente**

Exporta:

- componente `MessageCard` `({ icon: Icon, title, description, tone = 'info', className, }: MessageCardProps)`

Interfaz `MessageCardProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `icon` | `React.ElementType` | no | — |
| `title` | `string` | no | — |
| `description` | `string` | sí | — |
| `tone` | `'info' \| 'error' \| 'warn'` | sí | — |
| `className` | `string` | sí | — |

- Usa: [`utils.ts`](../../lib.md#lib-utils-ts)
- Usado por: [`BMComparisonComponent.tsx`](../amazon-bedrock.md#components-amazon-bedrock-comparacion-bmcomparisoncomponent-tsx), [`BMPromptOptComponent.tsx`](../amazon-bedrock.md#components-amazon-bedrock-prompt-opt-bmpromptoptcomponent-tsx), [`BMPromptOptComparisonComponent.tsx`](../amazon-bedrock.md#components-amazon-bedrock-prompt-opt-info-bmpromptoptcomparisoncomponent-tsx), [`AdvisorViewComponent.tsx`](vista-advisor.md#components-azure-vista-advisor-advisorviewcomponent-tsx), [`VXPromptOptComponent.tsx`](../google-vertex.md#components-google-vertex-prompt-opt-vxpromptoptcomponent-tsx), [`VXPromptOptComparisonComponent.tsx`](../google-vertex.md#components-google-vertex-prompt-opt-info-vxpromptoptcomparisoncomponent-tsx), [`AFComparisonComponent.tsx`](../microsoft-foundry.md#components-microsoft-foundry-comparacion-afcomparisoncomponent-tsx), [`AFComparisonViewComponent.tsx`](../microsoft-foundry.md#components-microsoft-foundry-comparacion-info-afcomparisonviewcomponent-tsx), [`FMPromptOptComponent.tsx`](../microsoft-foundry.md#components-microsoft-foundry-prompt-opt-fmpromptoptcomponent-tsx), [`FMPromptOptComparisonComponent.tsx`](../microsoft-foundry.md#components-microsoft-foundry-prompt-opt-info-fmpromptoptcomparisoncomponent-tsx)

