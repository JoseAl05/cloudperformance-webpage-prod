# Manual de Usuario — Cloud Performance

## Módulo Comparación Internube

> **Versión del documento:** 1.0 · **Módulo:** Comparación Internube
> **Dirigido a:** usuarios finales de Cloud Performance que quieren saber cuánto costarían sus máquinas virtuales actuales si las llevaran a otra nube (Azure, AWS o GCP).

---

## Índice

1. [Introducción](#1-introducción)
2. [Antes de comenzar](#2-antes-de-comenzar)
   - 2.1 [Requisitos para usar el módulo](#21-requisitos-para-usar-el-módulo)
   - 2.2 [Cómo ingresar al módulo](#22-cómo-ingresar-al-módulo)
3. [Configurar una comparación](#3-configurar-una-comparación)
   - 3.1 [Paso 1: Selector de Nube](#31-paso-1-selector-de-nube)
   - 3.2 [Paso 2: Selección de la cuenta de origen](#32-paso-2-selección-de-la-cuenta-de-origen)
   - 3.3 [Paso 3: Selector de Servicio](#33-paso-3-selector-de-servicio)
   - 3.4 [Volver a la configuración](#34-volver-a-la-configuración)
4. [Reporte de Máquinas Virtuales](#4-reporte-de-máquinas-virtuales)
   - 4.1 [Configuración del Reporte (filtros)](#41-configuración-del-reporte-filtros)
   - 4.2 [Resumen general](#42-resumen-general)
   - 4.3 [Lista de instancias](#43-lista-de-instancias)
   - 4.4 [Detalle de la instancia](#44-detalle-de-la-instancia)
   - 4.5 [Coincidencias por nube de destino](#45-coincidencias-por-nube-de-destino)
   - 4.6 [Proyección de costos](#46-proyección-de-costos)
5. [Cómo leer los resultados](#5-cómo-leer-los-resultados)
6. [Mensajes que puedes encontrar](#6-mensajes-que-puedes-encontrar)
7. [Preguntas frecuentes](#7-preguntas-frecuentes)
8. [Glosario](#8-glosario)

---

## 1. Introducción

El módulo **Comparación Internube** toma las **máquinas virtuales** de una de tus nubes (la **nube de origen**) y busca, para cada una, **instancias equivalentes en las otras dos nubes** (las **nubes de destino**). Por ejemplo, si eliges AWS como origen, verás qué instancias de Azure y de GCP se parecen a cada una de tus instancias EC2 y cuánto costarían.

Con él puedes:

- Conocer el **costo de catálogo** (por hora y mensual) de tu infraestructura actual y de la **mejor alternativa** en otra nube.
- Ver, por cada máquina virtual, las **instancias equivalentes** en cada nube de destino, con su nivel de **precisión**.
- **Proyectar** cuánto habrías pagado en la otra nube con las **mismas horas de uso reales** de los últimos 30 días.
- Simular el efecto de un **compromiso de 1 o 3 años** (reserva) en la nube de destino.
- Evaluar el **riesgo** de cada alternativa según el uso de CPU de tu instancia actual.

> ℹ️ **Nota:** Los precios de las nubes de destino son **precios públicos de catálogo**. El módulo no considera acuerdos comerciales particulares que tu organización pueda tener con un proveedor.

> 🖼️ **Captura pendiente:** Pantalla "Módulos de comparación cloud" con la tarjeta Comparación Internube destacada.
> *Archivo sugerido:* `img/internube/00-modulos-comparacion.png`

---

## 2. Antes de comenzar

### 2.1 Requisitos para usar el módulo

- Tu organización debe tener **al menos una nube** habilitada en Cloud Performance (Azure, AWS o GCP). Esa será la nube de origen.
- En el **Selector de Nube** solo verás las nubes habilitadas para tu organización.
- El módulo está disponible para los roles **Usuario**, **Administrador de empresa** y **Administrador global**. Con otro rol verás el aviso **🚫 Acceso Denegado**.

### 2.2 Cómo ingresar al módulo

1. Inicia sesión en Cloud Performance con tu usuario y contraseña.
2. Abre el menú de usuario (tu nombre, en la esquina superior derecha) y selecciona **Perfil**.
3. Haz clic en **Comparación Nubes**. Puedes hacerlo desde la tarjeta de la página de inicio del perfil o desde el menú lateral.
4. En la pantalla **Módulos de comparación cloud**, haz clic en la tarjeta **Comparacion Internube**.
5. Se abrirá el asistente de configuración (ver [sección 3](#3-configurar-una-comparación)).

> 🖼️ **Captura pendiente:** Perfil con la opción "Comparación Nubes" en el menú lateral.
> *Archivo sugerido:* `img/internube/01-perfil-comparacion-nubes.png`

---

## 3. Configurar una comparación

El asistente tiene hasta tres pasos numerados, que aparecen uno debajo del otro a medida que avanzas.

> 🖼️ **Captura pendiente:** Asistente con los pasos 1, 2 y 3 visibles.
> *Archivo sugerido:* `img/internube/02-asistente-completo.png`

### 3.1 Paso 1: Selector de Nube

1. Abre la lista **Seleccione Proveedor de Nube...**.
2. Elige la **nube de origen**: **Azure (Tenants)**, **AWS (Cuentas)** o **GCP (Proyectos)**.

Las nubes que no elijas serán las **nubes de destino** de la comparación.

Una vez elegida la nube, aparece el ícono **↺ (Reiniciar todo)** en la esquina del paso 1. Úsalo para borrar la configuración y empezar de nuevo.

### 3.2 Paso 2: Selección de la cuenta de origen

Este paso aparece **solo si tu organización tiene varias cuentas** en la nube elegida. Si tiene una sola, el asistente pasa directamente al paso 3.

El título del paso cambia según la nube: **Selección de Tenant** (Azure), **Selección de Cuenta** (AWS) o **Selección de Proyecto** (GCP).

1. Haz clic en la tarjeta de la cuenta cuyas máquinas virtuales quieres analizar. Solo puedes elegir **una**.
2. Debajo se muestra la cuenta **seleccionada**.
3. Para cambiarla, haz clic en otra tarjeta. Para desmarcarla, vuelve a hacer clic en ella o usa **Limpiar Selección**.

> 🖼️ **Captura pendiente:** Paso 2 con una cuenta seleccionada.
> *Archivo sugerido:* `img/internube/03-paso2-cuenta.png`

### 3.3 Paso 3: Selector de Servicio

1. Haz clic en la tarjeta **Máquinas Virtuales** (EC2, Virtual Machines, Compute Instances).
2. Presiona **Ir a comparación**. El botón cambia a *Generando Reporte...* mientras se abre el reporte.

> 🖼️ **Captura pendiente:** Paso 3 con la tarjeta "Máquinas Virtuales" seleccionada y el botón "Ir a comparación".
> *Archivo sugerido:* `img/internube/04-paso3-servicio.png`

### 3.4 Volver a la configuración

En la parte superior del reporte está el botón **↺ Volver a la configuración**. Te devuelve al asistente con la misma nube elegida; si tu organización tiene varias cuentas, debes volver a elegir la cuenta de origen.

> ⚠️ **Importante:** Si recargas la página del navegador, la comparación se pierde y vuelves al paso 1 del asistente.

---

## 4. Reporte de Máquinas Virtuales

**Para qué sirve:** comparar el costo de cada máquina virtual de tu nube de origen con sus equivalentes en las otras nubes.

El encabezado muestra el título **Reporte de Maquinas Virtuales** y la nube de origen. Debajo están el panel de filtros y el contenido del reporte, organizado así:

1. **Resumen general** de toda tu infraestructura (arriba).
2. **Lista de instancias** (columna izquierda).
3. **Detalle de la instancia** seleccionada (columna derecha): datos de la instancia, mejor opción entre nubes, coincidencias por nube y proyección de costos.

> 🖼️ **Captura pendiente:** Reporte completo con el resumen general, la lista de instancias y el detalle.
> *Archivo sugerido:* `img/internube/05-reporte-completo.png`

### 4.1 Configuración del Reporte (filtros)

| Filtro | Cómo se usa |
|---|---|
| **Región de Nube** (AWS y GCP) / **Región** (Azure) | Lista con buscador. Opción inicial *Todas las Regiones*. |

1. Elige la región.
2. Presiona **Aplicar Filtros**.
3. Para volver a *Todas las Regiones*, presiona **Limpiar**.

> ℹ️ **Nota:** Este reporte no tiene filtro de fechas. Los costos de catálogo son los vigentes, y la proyección de costos usa siempre los **últimos 30 días**.

### 4.2 Resumen general

Muestra la cantidad de **instancias** analizadas y la fecha de la última actualización de la información (*Información actualizada a la fecha de ...*, en hora UTC). Tiene dos recuadros:

**Infraestructura actual** (con el color de tu nube de origen)

- **Por hora:** suma de los costos por hora de catálogo de todas tus instancias.
- **Mensual (730h):** suma de los costos mensuales teóricos (costo por hora × 730 horas).
- **Tipos de instancia:** una etiqueta por cada tipo de instancia, con la cantidad de máquinas de ese tipo (por ejemplo, *t3.medium × 4*).

**Mejor alternativa entre nubes** (en verde)

- **Por hora** y **Mensual (730h):** suma de los costos de la alternativa más económica de cada instancia, eligiendo entre todas las nubes de destino. Debajo se indica la diferencia con tu infraestructura actual: en **verde**, más barata; en **rojo**, más cara.
- **Mezcla óptima:** los tipos de instancia de destino que forman esa alternativa, con su nube y cuántas veces se eligieron.
- Si alguna instancia no tiene equivalente, verás la etiqueta **N sin alternativa**. Esas instancias no se suman.

> 💡 **Consejo:** Los valores del resumen son **teóricos**: suponen que las máquinas funcionan todo el mes y no consideran descuentos. Para una comparación basada en tu uso real, revisa la [Proyección de costos](#46-proyección-de-costos) de cada instancia.

> 🖼️ **Captura pendiente:** Recuadros "Infraestructura actual" y "Mejor alternativa entre nubes".
> *Archivo sugerido:* `img/internube/06-resumen-general.png`

### 4.3 Lista de instancias

En la columna izquierda verás todas las máquinas virtuales de la nube de origen.

- **Buscar:** escribe en *Buscar por nombre, ID o tipo...* para filtrar la lista. Debajo se indica cuántas instancias coinciden.
- Cada elemento muestra el **nombre**, el **ID**, el **tipo**, la cantidad de **vCPU** y la **memoria (GB)**.
- También muestra una etiqueta por cada **nube de destino** con el **costo mensual** de su alternativa más económica. Si una nube no tiene equivalente, la etiqueta dice *sin datos*.
- Haz clic en una instancia para ver su detalle a la derecha. Al abrir el reporte, queda seleccionada la primera.

> 🖼️ **Captura pendiente:** Lista de instancias con el buscador y una instancia seleccionada.
> *Archivo sugerido:* `img/internube/07-lista-instancias.png`

### 4.4 Detalle de la instancia

**Datos de la instancia**

Nombre, ID, nube de origen y los datos **Tipo**, **Recursos** (vCPU y memoria), **Región** y **SO** (sistema operativo). También muestra:

- **Por hora:** precio público on-demand de ese tipo de instancia en su región.
- **Mensual (730h):** costo por hora × 730.

**Mejor opción entre nubes**

Recuadro verde con la alternativa de **menor costo mensual** entre todas las nubes de destino: tipo de instancia, nube y región. A la derecha se muestra su costo mensual y cuánto más barata (**menos costoso**, en verde) o más cara (**más costoso**, en rojo) es respecto de tu instancia.

> ℹ️ **Nota:** La mejor opción se elige **solo por precio de catálogo**, sin considerar el uso real. Antes de decidir, revisa la *Proyección de costos* y el nivel de **Confianza**.

> 🖼️ **Captura pendiente:** Detalle de una instancia con el recuadro "Mejor opción entre nubes".
> *Archivo sugerido:* `img/internube/08-detalle-instancia.png`

### 4.5 Coincidencias por nube de destino

Debajo del detalle hay una pestaña por cada **nube de destino**, con la cantidad de coincidencias entre paréntesis (por ejemplo, *Azure (5)*). Cada pestaña tiene una tabla ordenada **de menor a mayor costo mensual**. La primera fila lleva la etiqueta **Mejor**.

| Columna | Qué indica |
|---|---|
| **Instance type** | Tipo de instancia equivalente en la nube de destino. |
| **Región** | Región de la instancia equivalente. |
| **vCPU** / **RAM** | Recursos de la instancia equivalente. |
| **Precisión** | **Alta:** coincide exactamente en vCPU, memoria, región y sistema operativo. **Baja:** aproximación con una proporción de recursos similar, sin coincidencia exacta en alguna de esas dimensiones. Pasa el cursor sobre la etiqueta para ver el detalle. |
| **Por hora** | Precio público on-demand por hora. Debajo, la diferencia con tu instancia actual. |
| **Mensual (730h)** | Costo mensual teórico. Debajo, la diferencia con tu instancia actual. |

Las diferencias se muestran en **verde** con flecha hacia abajo cuando la alternativa es más barata, en **rojo** con flecha hacia arriba cuando es más cara, o como **Igual** cuando no hay diferencia.

Si una nube no tiene equivalentes, verás *No hay coincidencias disponibles en <nube>*.

> 🖼️ **Captura pendiente:** Pestañas de nubes de destino con la tabla de coincidencias.
> *Archivo sugerido:* `img/internube/09-coincidencias.png`

### 4.6 Proyección de costos

Esta sección calcula cuánto habría costado cada alternativa con las **mismas horas facturadas reales** de tu instancia en los **últimos 30 días**. Es la comparación más cercana a tu uso real.

**Estado de los datos**

En la esquina superior derecha se indica si la proyección tiene datos suficientes:

| Estado | Significado |
|---|---|
| **Datos completos** | Hay datos de facturación y de métricas de los últimos 30 días. |
| **Sin métricas** | Hay facturación, pero no métricas de uso. La proyección se calcula, pero la confianza es desconocida. |
| **Sin facturación** | No hay datos de facturación. No se puede proyectar. |
| **Sin datos** | No hay facturación ni métricas. No se puede proyectar. |
| **Error** | Ocurrió un problema al calcular la proyección. |

**Indicadores de la instancia actual**

| Indicador | Qué indica |
|---|---|
| **Horas facturadas (30d)** | Horas que tu nube de origen facturó por la instancia en los últimos 30 días. Debajo, cuántos días tienen datos (por ejemplo, *30/30 días*). Si hay menos de 28 días, el valor aparece en ámbar y la proyección podría estar subestimada. |
| **Costo real (30d)** | Lo que efectivamente pagaste por la instancia, incluidos los descuentos por reservas o planes de ahorro. |
| **On-demand equivalente** | Lo que habrías pagado por las mismas horas a precio de lista, sin descuentos. |
| **CPU máx / prom** | Uso máximo y promedio de CPU en los últimos 30 días. Se usa para calcular la confianza de cada alternativa. |

**Simulación de compromiso**

Usa los botones **On-demand**, **1 año reservado** y **3 años reservado** para ver la proyección con distintos tipos de compra en la nube de destino. Las opciones de 1 y 3 años llevan la marca *est.* porque aplican un **descuento estimado** por compromiso, que varía según la nube (aproximadamente 28 % a 37 % a 1 año y 52 % a 62 % a 3 años). Los descuentos reales pueden variar por tipo de instancia y región.

**Pestañas por nube de destino**

Cada pestaña muestra:

- Un recuadro **Original (<nube>)** con el tipo de instancia, sus recursos, la región, el **Costo real (30d)** y el **On-demand equivalente**. Si tu instancia ya tiene un descuento relevante, verás la etiqueta **X% bajo on-demand (RI/SP)**, que sugiere que está cubierta por una reserva, un Savings Plan o un CUD.
- La tabla de proyección, ordenada de menor a mayor costo proyectado:

| Columna | Qué indica |
|---|---|
| **Instance type** | Instancia equivalente. La más económica lleva la etiqueta **Mejor**. |
| **Región** / **Recursos** | Región, vCPU y memoria de la alternativa. |
| **Proyección 30d** | Costo de la alternativa durante tus mismas horas facturadas. Con 1 o 3 años, incluye el descuento estimado. |
| **Ahorro vs actual** | Diferencia con lo que **realmente pagaste**. En **verde**, ahorro; en **rojo**, aumento de costo. |
| **Ahorro vs on-demand** | Diferencia con tu **on-demand equivalente**, con el porcentaje debajo. Sirve para comparar en igualdad de condiciones cuando tu instancia actual tiene descuentos. |
| **Confianza** | Qué tan bien podría la alternativa absorber tu carga, según el uso de CPU de tu instancia (ver tabla siguiente). |

| Confianza | Criterio |
|---|---|
| **Alta** | El uso máximo de CPU se mantuvo bajo el 80 %. |
| **Media** | El uso máximo de CPU estuvo entre 80 % y 95 %, o la instancia es de rendimiento variable (*burstable*) y agotó sus créditos. La migración es viable, pero con menos margen. |
| **Baja** | El uso máximo de CPU superó el 95 %. La alternativa podría quedarse corta. |
| **Sin datos** | No hay métricas suficientes para evaluarla. |

> ⚠️ **Importante:** Si eliges **1 año** o **3 años** y una alternativa tiene confianza **Baja**, la fila se marca con la etiqueta roja **Riesgo**: comprometerte por ese plazo con una instancia que podría quedarse corta es arriesgado.

> 🖼️ **Captura pendiente:** Sección "Proyección de costos" con los indicadores, la simulación de compromiso y la tabla.
> *Archivo sugerido:* `img/internube/10-proyeccion.png`

> 🖼️ **Captura pendiente:** Tabla de proyección en "3 años reservado" con una fila marcada como "Riesgo".
> *Archivo sugerido:* `img/internube/11-proyeccion-riesgo.png`

---

## 5. Cómo leer los resultados

Para evaluar si conviene mover una máquina virtual a otra nube:

1. Empieza por el **Resumen general** para ver la diferencia teórica de toda tu infraestructura.
2. Selecciona una instancia y revisa la **Mejor opción entre nubes**.
3. En **Coincidencias**, prefiere alternativas con precisión **Alta**. Una precisión *Baja* indica que la instancia no es exactamente igual (por ejemplo, otra región o sistema operativo).
4. En **Proyección de costos**, compara con **Ahorro vs actual**: es lo que ahorrarías respecto de lo que hoy pagas realmente.
5. Si tu instancia actual tiene reservas o planes de ahorro (etiqueta *bajo on-demand*), usa también **Ahorro vs on-demand** y prueba la simulación de **1 año** o **3 años**, para comparar compromiso contra compromiso.
6. Revisa la **Confianza**. Evita las alternativas con confianza *Baja*, sobre todo si piensas comprometerte por 1 o 3 años.

> 💡 **Consejo:** Un ahorro en precio de catálogo no siempre se traduce en ahorro real. Si tu instancia actual ya tiene un descuento importante, la alternativa puede resultar más cara en **Ahorro vs actual** aunque sea más barata en catálogo.

---

## 6. Mensajes que puedes encontrar

| Mensaje | Significado y qué hacer |
|---|---|
| **Analizando datos de <nube>...** | La información se está obteniendo. Espera unos segundos. |
| **Ocurrió un error al cargar el reporte.** | Hubo un problema al obtener la información. Intenta nuevamente. Si persiste, contacta a soporte. |
| **No hay instancias para comparar** | No hay máquinas virtuales en la nube de origen para la región elegida. Elige *Todas las Regiones* o revisa otra cuenta. |
| **Sin resultados** | Ninguna instancia coincide con tu búsqueda. Cambia el texto buscado. |
| **<nube> · sin datos** | No se encontró un equivalente en esa nube de destino para la instancia. |
| **No hay coincidencias disponibles en <nube>** / **No hay coincidencias en <nube> para proyectar.** | La nube de destino no tiene instancias equivalentes. |
| **No se encontraron alternativas en otras nubes para esta infraestructura.** | Ninguna instancia tiene equivalentes en las nubes de destino. |
| **No se pueden calcular proyecciones para esta instancia en el período.** | Falta información de facturación de los últimos 30 días. |

---

## 7. Preguntas frecuentes

**No veo la opción "Comparación Nubes" en mi perfil.**
Consulta al administrador de tu organización para revisar los permisos de tu cuenta.

**No aparece el paso 2 del asistente.**
Tu organización tiene una sola cuenta en la nube elegida, por lo que el asistente pasa directamente al Selector de Servicio.

**¿Puedo comparar dos nubes de origen al mismo tiempo?**
No. Cada comparación usa una sola nube y una sola cuenta de origen, y las compara con las otras dos nubes.

**¿Los precios incluyen mis descuentos con el proveedor?**
Los precios de las nubes de destino son **públicos de catálogo**. El **Costo real (30d)** de tu instancia actual sí incluye tus descuentos.

**¿Qué significa "730h"?**
Es el promedio de horas de un mes (8.760 horas al año / 12). El costo mensual teórico supone que la máquina funciona todo el mes.

**¿Por qué la "Mejor opción" no coincide con la fila "Mejor" de la proyección?**
La *Mejor opción entre nubes* se elige por **precio de catálogo mensual**. La proyección ordena según el **costo con tus horas reales** y el tipo de compromiso elegido.

**¿Qué tan exactos son los descuentos de 1 y 3 años?**
Son **estimaciones** representativas por nube. Los descuentos reales pueden variar algunos puntos porcentuales según el tipo de instancia y la región.

**Recargué la página y perdí la comparación.**
La configuración no se guarda al recargar. Vuelve a elegir la nube, la cuenta y el servicio.

---

## 8. Glosario

| Término | Definición |
|---|---|
| **730h** | Promedio de horas de un mes, usado para calcular el costo mensual teórico. |
| **Burstable** | Tipo de instancia de rendimiento variable que acumula y gasta créditos de CPU. |
| **Confianza** | Indicador de qué tan bien una alternativa podría absorber la carga de tu instancia, según su uso de CPU. |
| **CUD** | Committed Use Discount: descuento por compromiso de uso en Google Cloud. |
| **Costo real (30d)** | Lo que efectivamente pagaste por la instancia en los últimos 30 días, con descuentos incluidos. |
| **Horas facturadas** | Horas que la nube cobró por la instancia; reflejan el uso real (incluyen apagados y reinicios). |
| **Instancia / Máquina virtual** | Servidor virtual en la nube: EC2 en AWS, Virtual Machine en Azure, Compute Engine en GCP. |
| **Internube** | Comparación entre **distintas** nubes. |
| **Nube de destino** | Nube en la que se buscan instancias equivalentes. |
| **Nube de origen** | Nube donde están tus máquinas virtuales actuales. |
| **On-demand** | Compra sin compromiso, al precio público por hora. |
| **On-demand equivalente** | Lo que habrías pagado por las mismas horas a precio de lista, sin descuentos. |
| **Precisión** | Qué tan exacta es la equivalencia entre tu instancia y la alternativa (Alta o Baja). |
| **Reserva (RI)** | Compra anticipada de capacidad por 1 o 3 años a cambio de un descuento. |
| **Savings Plan (SP)** | Compromiso de gasto por hora en AWS a cambio de un descuento. |
| **SKU** | Código que identifica un tipo de instancia y su precio. |
| **Throttling** | Limitación del rendimiento cuando una instancia no tiene capacidad suficiente. |
| **vCPU** | CPU virtual asignada a una máquina virtual. |
