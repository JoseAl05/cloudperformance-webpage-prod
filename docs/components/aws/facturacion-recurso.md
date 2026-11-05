# Componentes `components/aws/facturacion-recurso/`

[← Índice](../../README.md)

Modal de facturación de un recurso AWS (gráfico y estadísticas).

Archivos:

- [`components/aws/facturacion-recurso/ModalResourceBillingComponent.tsx`](#components-aws-facturacion-recurso-modalresourcebillingcomponent-tsx)
- [`components/aws/facturacion-recurso/ResourceBillingWrapper.tsx`](#components-aws-facturacion-recurso-resourcebillingwrapper-tsx)
- [`components/aws/facturacion-recurso/grafico/ResourceBillingChart.tsx`](#components-aws-facturacion-recurso-grafico-resourcebillingchart-tsx)
- [`components/aws/facturacion-recurso/info/ResourceBillingStats.tsx`](#components-aws-facturacion-recurso-info-resourcebillingstats-tsx)
- [`components/aws/facturacion-recurso/table/ResourceBillingActionCell.tsx`](#components-aws-facturacion-recurso-table-resourcebillingactioncell-tsx)

<a id="components-aws-facturacion-recurso-modalresourcebillingcomponent-tsx"></a>
## `components/aws/facturacion-recurso/ModalResourceBillingComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `ModalResourceBillingComponent` `({ isOpen, onClose, resourceId, startDateHistory }: ModalResourceBillingProps)`

Interfaz `BillingItem` — Tipos de respuesta del Backend:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `start_date` | `string` | no | — |
| `end_date` | `string` | no | — |
| `unblendedcost` | `number` | no | — |
| `netamortizedcost` | `number` | no | — |

Interfaz `ResourceBillingResponse`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `service` | `string` | no | — |
| `resource` | `string` | no | — |
| `billing` | `BillingItem[]` | no | — |

Interfaz `ModalResourceBillingProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `isOpen` | `boolean` | no | — |
| `onClose` | `() => void` | no | — |
| `resourceId` | `string \| null` | no | — |
| `startDateHistory` | `string` | sí | — |

Internos:

- función `fetcher` `(url: string)`

- API: `/api/aws/bridge/facturacion/get_resource_billing`
- Hooks: `useSWR`, `useSearchParams`
- Usa: [`ResourceBillingWrapper.tsx`](#components-aws-facturacion-recurso-resourcebillingwrapper-tsx), [`ResourceBillingStats.tsx`](#components-aws-facturacion-recurso-info-resourcebillingstats-tsx), [`ResourceBillingChart.tsx`](#components-aws-facturacion-recurso-grafico-resourcebillingchart-tsx), [`filters.ts`](../../lib.md#lib-filters-ts)
- Usado por: [`ResourceBillingActionCell.tsx`](#components-aws-facturacion-recurso-table-resourcebillingactioncell-tsx)

Notas de implementación:

- 1. Gestión de Fechas
- 2. Fetch Data
- 3. Generar URL para redirección completa
- Render Content
- JSX — Componente de KPIs (Cards)
- JSX — Componente de Gráfico ECharts

---

<a id="components-aws-facturacion-recurso-resourcebillingwrapper-tsx"></a>
## `components/aws/facturacion-recurso/ResourceBillingWrapper.tsx`

**Componente (cliente)**

Exporta:

- componente `ResourceBillingWrapper` `({ isOpen, onClose, children, title = "Detalle de Facturación", fullViewPath }: ResourceBillingWrapperProps)`

Interfaz `ResourceBillingWrapperProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `isOpen` | `boolean` | no | Si es true, renderiza el Dialog. Si es false, renderiza los hijos directamente (o nada) |
| `onClose` | `() => void` | no | Función para cerrar el modal |
| `children` | `React.ReactNode` | no | El contenido principal (tu gráfico/tabla existente) |
| `title` | `string` | sí | Título del modal |
| `fullViewPath` | `string` | no | La ruta a la que redirigir si el usuario quiere ver la vista completa |

- Hooks: `useRouter`
- Usa: [`button.tsx`](../ui.md#components-ui-button-tsx), [`dialog.tsx`](../ui.md#components-ui-dialog-tsx)
- Usado por: [`ModalResourceBillingComponent.tsx`](#components-aws-facturacion-recurso-modalresourcebillingcomponent-tsx)

Notas de implementación:

- Cerramos el modal antes de redirigir para evitar parpadeos o estados residuales
- Si no está abierto, no renderizamos nada (controlado por el padre)
- JSX — max-w-7xl para que el gráfico tenga espacio suficiente
- JSX — Área de contenido scrollable
- JSX — Footer con acciones

---

<a id="components-aws-facturacion-recurso-grafico-resourcebillingchart-tsx"></a>
## `components/aws/facturacion-recurso/grafico/ResourceBillingChart.tsx`

**Componente (cliente)**

Exporta:

- componente `ResourceBillingChart` `({ data, className }: ResourceBillingChartProps)`

Interfaz `BillingItem`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `start_date` | `string` | no | — |
| `end_date` | `string` | no | — |
| `unblendedcost` | `number` | no | — |

Interfaz `ResourceBillingData`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `service` | `string` | no | — |
| `resource` | `string` | no | — |
| `billing` | `BillingItem[]` | no | — |

Interfaz `ResourceBillingChartProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `ResourceBillingData[]` | no | — |
| `className` | `string` | sí | — |

- Hooks: `useECharts`, `useTheme`
- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`echartsGlobalConfig.ts`](../../lib.md#lib-echartsglobalconfig-ts)
- Usado por: [`ModalResourceBillingComponent.tsx`](#components-aws-facturacion-recurso-modalresourcebillingcomponent-tsx)

Notas de implementación:

- Paleta de colores para diferenciar servicios apilados
- 1. Unificar todas las fechas posibles y ordenarlas
- 2. Crear las series para ECharts (Stacked Bar)
- Mapear los datos de este servicio al eje X unificado Si falta un día, rellenar con 0 para mantener alineación
- Guardamos fecha para tooltip
- Convertir a formato [date, value] o simplemente value si usas category axis
- `kind: 'stackedBar',` — Usamos el tipo definido en tu global config
- `stack: 'total',` — Clave mágica para apilar
- `itemStyle: { borderRadius: [0, 0, 0, 0] }` — Barras cuadradas al apilar
- 3. Configuración Base
- 4. Crear opciones finales mezclando
- `xAxisType: 'time',` — Eje X de tiempo maneja mejor los huecos y formateo
- `axisPointer: { label: { show: true } }` — Muestra la fecha al hacer hover
- Formateador personalizado para sumar el total en el tooltip

---

<a id="components-aws-facturacion-recurso-info-resourcebillingstats-tsx"></a>
## `components/aws/facturacion-recurso/info/ResourceBillingStats.tsx`

**Componente (cliente)**

Exporta:

- componente `ResourceBillingStats` `({ data }: ResourceBillingStatsProps)`

Interfaz `BillingItem` — Tipos basados en tu JSON:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `start_date` | `string` | no | — |
| `end_date` | `string` | no | — |
| `unblendedcost` | `number` | no | — |
| `netamortizedcost` | `number` | no | — |

Interfaz `ResourceBillingData`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `service` | `string` | no | — |
| `resource` | `string` | no | — |
| `billing` | `BillingItem[]` | no | — |

Interfaz `ResourceBillingStatsProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `ResourceBillingData[]` | no | — |

- Tipo interno `CardVariant` = `'default' | 'destructive' | 'warning' | 'info' | 'success'`
Internos:

- función `getVariantStyles` `(variant: CardVariant)` — Reutilizando tu lógica de diseño de StatCard
- componente `StatCard` `({ title, value, description, icon: Icon, variant = 'default', footer }: { title: string; value: string; description: s…`

- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx)
- Usado por: [`ModalResourceBillingComponent.tsx`](#components-aws-facturacion-recurso-modalresourcebillingcomponent-tsx)

Notas de implementación:

- Iterar sobre todos los servicios (ej: Compute, EC2-Other)
- Agrupar por fecha para encontrar el peak real del recurso completo
- `variant="warning"` — Warning visual para peaks altos

---

<a id="components-aws-facturacion-recurso-table-resourcebillingactioncell-tsx"></a>
## `components/aws/facturacion-recurso/table/ResourceBillingActionCell.tsx`

**Componente (cliente)**

Exporta:

- componente `ResourceBillingActionCell` `({ resourceId, startDateHistory }: { resourceId: string, startDateHistory?:string })`

- Usa: [`ModalResourceBillingComponent.tsx`](#components-aws-facturacion-recurso-modalresourcebillingcomponent-tsx), [`button.tsx`](../ui.md#components-ui-button-tsx)
- Usado por: [`ec2ResourceInfraUsedTableColumns.tsx`](vista-recursos.md#components-aws-vista-recursos-infrautilizadas-ec2-table-ec2resourceinfrausedtablecolumns-tsx)

