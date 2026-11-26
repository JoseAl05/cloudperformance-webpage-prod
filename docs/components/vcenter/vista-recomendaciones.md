# Componentes `components/vcenter/vista-recomendaciones/`

[← Índice](../../README.md)

Recomendaciones IA de vCenter. vCenter no tiene un recomendador nativo (como Trusted Advisor, Azure Advisor o GCP Recommender), por lo que la vista muestra solo el reporte de recomendaciones IA con el mismo contrato `AiRecommendationReport` que AWS, Azure y GCP, renderizado con [`AiRecommendationsComponent.tsx`](../generales.md#components-airecommendationscomponent-tsx) (`cloud='vcenter'`).

Archivos:

- [`components/vcenter/vista-recomendaciones/MainViewRecommendationsComponent.tsx`](#components-vcenter-vista-recomendaciones-mainviewrecommendationscomponent-tsx)
- [`components/vcenter/vista-recomendaciones/RecommendationsComponent.tsx`](#components-vcenter-vista-recomendaciones-recommendationscomponent-tsx)

<a id="components-vcenter-vista-recomendaciones-mainviewrecommendationscomponent-tsx"></a>
## `components/vcenter/vista-recomendaciones/MainViewRecommendationsComponent.tsx`

**Componente**

Exporta:

- componente `MainViewRecommendationsComponent` `()`

- Usa: `FiltersComponent.tsx` (`components/general_vcenter/filters`, con `cloud='vcenter'` y `dateFilter`), [`RecommendationsComponent.tsx`](#components-vcenter-vista-recomendaciones-recommendationscomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-vcenter-recomendaciones-page-tsx)

---

<a id="components-vcenter-vista-recomendaciones-recommendationscomponent-tsx"></a>
## `components/vcenter/vista-recomendaciones/RecommendationsComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `RecommendationsComponent` `({ startDate, endDate }: RecommendationsComponentProps)`

Interfaz `RecommendationsComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | sí | Inicio del período (filtro de fechas). |
| `endDate` | `Date` | sí | Fin del período (filtro de fechas). |

Internos:

- constante `AI_RECOMMENDATIONS_ENDPOINT`
- función `isNonEmptyArray` `(value: unknown): value is T[]`

- API: `/api/vcenter/bridge/vcenter/ai_recommendations/get_ai_recommendations`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), `toApiDate` (`lib/consumption.ts`), [`MessageCards.tsx`](../aws/cards.md#components-aws-cards-messagecards-tsx), [`LoaderComponent.tsx`](../general_gcp.md#components-general-gcp-loadercomponent-tsx), [`aiRecommendations.ts`](../../tipos.md#interfaces-ai-recommendations-airecommendations-ts), [`AiRecommendationsComponent.tsx`](../generales.md#components-airecommendationscomponent-tsx)
- Usado por: [`MainViewRecommendationsComponent.tsx`](#components-vcenter-vista-recomendaciones-mainviewrecommendationscomponent-tsx)

Notas de implementación:

- Sin período seleccionado muestra un aviso; con error de la API, un mensaje de error; sin reportes en el rango, "Sin datos para mostrar".
- La API devuelve el reporte más reciente cuyo `timestamp` cae en el rango (colección `vcenter_ai_recommendations`), igual que en las otras nubes.
- Los montos se muestran en la moneda del reporte (`impact_matrix.currency`, COP en vCenter).
