# Manual de Usuario — Cloud Performance

## Módulo Google Cloud Platform (GCP)

> **Versión del documento:** 1.0 · **Módulo:** Google Cloud Platform (GCP)
> **Dirigido a:** usuarios finales de Cloud Performance que analizan costos, consumo y oportunidades de ahorro en Google Cloud.

---

## Índice

1. [Introducción](#1-introducción)
2. [Antes de comenzar](#2-antes-de-comenzar)
   - 2.1 [Cómo ingresar al módulo GCP](#21-cómo-ingresar-al-módulo-gcp)
   - 2.2 [Acceso según tu plan](#22-acceso-según-tu-plan)
   - 2.3 [Elementos de la pantalla](#23-elementos-de-la-pantalla)
3. [Uso general de las vistas](#3-uso-general-de-las-vistas)
   - 3.1 [Panel de filtros](#31-panel-de-filtros)
   - 3.2 [Gráficos](#32-gráficos)
   - 3.3 [Tablas](#33-tablas)
   - 3.4 [Mensajes que puedes encontrar](#34-mensajes-que-puedes-encontrar)
4. [Página de Inicio de GCP](#4-página-de-inicio-de-gcp)
5. [Vistas principales](#5-vistas-principales)
   - 5.1 [Tendencia Facturación](#51-tendencia-facturación)
   - 5.2 [Quotas](#52-quotas)
   - 5.3 [Recommender](#53-recommender)
   - 5.4 [Vista Ejecuciones de Recomendaciones](#54-vista-ejecuciones-de-recomendaciones)
   - 5.5 [Métricas FinOps](#55-métricas-finops)
   - 5.6 [Reservations](#56-reservations)
   - 5.7 [Committed Use Discounts](#57-committed-use-discounts)
   - 5.8 [Presupuestos](#58-presupuestos)
   - 5.9 [Mantenedor de Etiquetas (Tags)](#59-mantenedor-de-etiquetas-tags)
6. [Consumos](#6-consumos)
7. [Funciones](#7-funciones)
8. [Recursos](#8-recursos)
9. [Preguntas frecuentes](#9-preguntas-frecuentes)
10. [Glosario](#10-glosario)

---

## 1. Introducción

El módulo **Google Cloud Platform (GCP)** de Cloud Performance reúne en un solo lugar la información de costos, consumo y configuración de tu infraestructura en Google Cloud. Con él puedes:

- Revisar la **evolución de tu facturación** por servicio y detectar alzas o bajas mes a mes.
- Identificar **qué regiones** concentran tu gasto.
- Analizar el **consumo real** de instancias Compute Engine, Instance Groups, nodos de clústeres GKE, bases de datos Cloud SQL, zonas DNS, Load Balancers y Cloud Filestore.
- Encontrar **recursos sin uso o infrautilizados** (instancias, discos persistentes, Filestore, IPs externas y subnets) que generan gasto innecesario.
- Consultar las recomendaciones de **GCP Recommender** y las **recomendaciones generadas por IA**, y registrar su seguimiento.
- Evaluar tus **Committed Use Discounts (CUDs)** y tus **reservas de capacidad**.
- Administrar **presupuestos y centros de costo**, y compararlos con el gasto real.
- Gestionar **etiquetas (tags)** para mejorar la visibilidad financiera de tus recursos.

Este manual explica, vista por vista, qué información encontrarás y cómo usar los filtros y controles de cada pantalla.

> 🖼️ **Captura pendiente:** Vista general del módulo GCP con el menú lateral abierto.
> *Archivo sugerido:* `img/gcp/00-vista-general.png`

---

## 2. Antes de comenzar

### 2.1 Cómo ingresar al módulo GCP

1. Inicia sesión en Cloud Performance con tu usuario y contraseña.
2. Abre el menú de usuario (tu nombre, en la esquina superior derecha) y selecciona **Perfil**.
3. En el menú lateral del perfil, haz clic en **Nubes**. Verás la pantalla **Nubes registradas**.
4. Haz clic en la tarjeta **Google Cloud Platform**.
   - Si tu organización tiene **más de una cuenta de GCP**, la tarjeta muestra un selector **Proyecto:**. Primero elige la cuenta que quieres revisar (opción *Seleccione una cuenta...*) y luego haz clic en la tarjeta. Mientras no elijas una cuenta, la tarjeta se ve en gris y no permite ingresar.
5. Se abrirá la **página de Inicio** del módulo GCP.

> 🖼️ **Captura pendiente:** Pantalla "Nubes registradas" con la tarjeta Google Cloud Platform y el selector de proyecto.
> *Archivo sugerido:* `img/gcp/01-nubes-registradas.png`

> 💡 **Consejo:** Para cambiar de cuenta de GCP, vuelve a **Perfil → Nubes** y selecciona otra en la tarjeta de Google Cloud Platform.

### 2.2 Acceso según tu plan

Lo que puedes ver en el módulo depende del plan contratado por tu organización:

| Plan | Acceso al módulo GCP |
|---|---|
| **Starter (Freemium)** / **Starter** | Sin acceso al módulo GCP. |
| **Pro** | Solo el **reporte de uso básico** en PDF (botón *Ver / Descargar Reporte PDF*). |
| **Business** / **Global Access** | Dashboard completo, incluida la *Vista Ejecuciones de Recomendaciones*. |

Si intentas abrir una vista que tu plan no incluye, verás un aviso de **acceso denegado** o **"Función Exclusiva"** con el nombre de tu plan actual. Para ampliar tu acceso, contacta al administrador de tu organización.

### 2.3 Elementos de la pantalla

> 🖼️ **Captura pendiente:** Pantalla del módulo con los elementos numerados (barra superior, botón de menú, menú lateral, área de contenido).
> *Archivo sugerido:* `img/gcp/02-elementos-pantalla.png`

**Barra superior**

- **Logo Cloud Performance:** te lleva a la página principal.
- **Botón de tema (☀️ / 🌙):** cambia entre modo claro y modo oscuro.
- **Menú de usuario** (tus iniciales y nombre):
  - **Perfil:** abre tu perfil (desde ahí accedes a *Nubes*, *Conectores*, etc.).
  - **Cerrar sesión:** finaliza tu sesión.

**Botón de menú lateral**

Ubicado a la izquierda de la barra superior. El menú lateral viene **contraído** al ingresar; haz clic en este botón para abrirlo o cerrarlo. Contraído, el menú muestra solo íconos; si haces clic en el ícono de un grupo (por ejemplo *Consumos*), el menú se expande.

**Menú lateral**

Contiene todas las vistas del módulo GCP:

| Entrada del menú | Descripción breve |
|---|---|
| Inicio | Página de bienvenida con accesos rápidos. |
| Tendencia Facturación | Evolución del gasto por servicio. |
| Quotas | Mapa de calor del uso de cuotas de servicio. |
| Recommender | Recomendaciones de GCP Recommender y recomendaciones con IA. |
| Vista Ejecuciones de Recomendaciones | Seguimiento del estado de las recomendaciones. |
| Métricas Finops | Indicadores FinOps generados con IA. |
| Reservations | Uso e inactividad de tus reservas de capacidad. |
| Committed Use Discounts | Rentabilidad de tus CUDs basados en gasto (Spend-Based). |
| Presupuestos | Centros de costo, presupuestos y comparación con el gasto real. |
| Mantenedor de Etiquetas (Tags) | Cobertura de etiquetas y asignación de tags locales y centros de costo. |
| **Consumos** (grupo) | Compute Engine, Instances Group, Clusters GKE, Cloud SQL / Spanner, Zonas DNS, Load Balancers y Cloud Filestore. |
| **Funciones** (grupo) | Análisis especializados: horario hábil vs no hábil, recursos no utilizados, networking, Top Cloud Storage Buckets, Top Filestore Sub-Utilizados, Spot vs Standard VMs, promedio de uso por región y Top Facturación por Región. |
| **Recursos** (grupo) | Detalle individual de instancias Compute Engine, Instance Groups, Clusters GKE e instancias Cloud SQL. |

- Los **grupos** (Consumos, Funciones, Recursos) y sus subgrupos (por ejemplo *Recursos no utilizados* o *Networking*) se abren y cierran con un clic. Un punto azul junto a un grupo cerrado indica que la vista actual está dentro de ese grupo.
- La vista en la que te encuentras aparece **resaltada en azul**.
- **Buscar en el menú:** escribe parte del nombre de una vista (por ejemplo, *sql*) para filtrar el menú. No importa si usas mayúsculas o tildes. Presiona **Esc** o la **✕** para limpiar la búsqueda.

---

## 3. Uso general de las vistas

La mayoría de las vistas comparten la misma estructura: un **título**, un **panel de filtros** y, debajo, el **contenido** (tarjetas de resumen, gráficos y tablas).

### 3.1 Panel de filtros

> 🖼️ **Captura pendiente:** Panel de filtros con Período, Proyectos, Regiones, Tags y Recurso.
> *Archivo sugerido:* `img/gcp/03-panel-filtros.png`

**Cómo usarlo**

1. Ajusta los filtros que necesites.
2. Presiona **Aplicar** (botón azul). La información se actualiza solo al presionar este botón.
3. Para volver a los valores iniciales, presiona **Limpiar** (botón gris).

**Filtros disponibles**

Cada vista muestra solo los filtros que le corresponden. Estos son todos los que puedes encontrar:

| Filtro | Cómo se usa |
|---|---|
| **Período** | Calendario para elegir un rango de fechas: haz clic en la fecha de inicio y luego en la fecha de término. Por defecto, desde **ayer hasta hoy**. |
| **Proyectos** | Lista con buscador para elegir uno o varios proyectos de GCP. Opción inicial *Todos los Proyectos*. |
| **Regiones** | Lista con buscador para elegir una o varias regiones. Opción inicial *Todas las Regiones*. |
| **Tags** | Dos listas: primero elige la **clave** (key) y luego el **valor** (value). Opciones iniciales *Todas las claves* / *Todos los valores*. La segunda lista aparece solo cuando eliges una clave específica. |
| **Recurso** | Lista con buscador de los recursos disponibles (instancias, clústeres, discos, etc.). En las vistas de análisis permite elegir varios y viene con **todos seleccionados** (*Todos los Recursos*); usa *Seleccionar todos* / *Deseleccionar todos* o marca uno por uno. En las vistas de **Recursos** eliges uno solo. La lista depende del período, el proyecto, la región y el tag elegidos. |
| **Tipo BD** | Motor de base de datos: *Todas las BD*, *PostgreSQL*, *MySQL* o *SQL Server*. |
| **Estado de Uso** | *Todos*, *Solo Sin Uso* o *Solo Con Consumo*. |
| **Tier Filestore** | *Todos los Tiers*, *Basic HDD*, *Basic SSD*, *Zonal*, *Regional* o *Enterprise*. |
| **Esquema** | Esquema del balanceador: *Todos los Esquemas*, *Externo (EXTERNAL)*, *Interno (INTERNAL)* o *Interno Gestionado*. |
| **Clase de Storage** | *Todas las Clases*, *STANDARD*, *NEARLINE*, *COLDLINE* o *ARCHIVE*. |
| **Servicio** | Uno o varios servicios de GCP. Opción *Todos los Servicios*. |
| **Categorías** / **Prioridades** | Filtros de la vista *Recommender*. Ver [5.3](#53-recommender). |

> 💡 **Consejo:** Los filtros aplicados quedan guardados en la dirección (URL) de la página. Puedes guardarla en favoritos o compartirla con un colega que tenga acceso, y la vista se abrirá con los mismos filtros.

> ⚠️ **Importante:** Algunas vistas necesitan que haya al menos un recurso seleccionado para mostrar información. Si deseleccionas todos, verás un mensaje del tipo *"No se ha seleccionado ninguna instancia."*. Si el filtro **Recurso** muestra *"Sin recursos"*, amplía el período o cambia el proyecto, la región o el tag.

### 3.2 Gráficos

- **Pasa el cursor** sobre un punto, barra o área para ver el detalle (tooltip).
- **Haz clic en un elemento de la leyenda** para ocultar o mostrar esa serie.
- En algunos gráficos puedes **acercar (zoom)** con la rueda del mouse o con la barra deslizante.
- Algunos gráficos incluyen un botón **Exportar** (o íconos en la esquina superior derecha) para **guardar como imagen** o **restaurar** la vista.
- Las horas de los gráficos de métricas se muestran en **UTC**, como se indica debajo de cada uno.

### 3.3 Tablas

- **Buscar:** usa el cuadro de búsqueda sobre la tabla para filtrar filas.
- **Ordenar:** haz clic en el encabezado de una columna (cuando muestra flechas) para ordenar de forma ascendente o descendente.
- **Paginación:** usa **Anterior** / **Siguiente** y el selector **Items por página**.
- **Tablas agrupadas:** varias tablas agrupan filas (por fecha de sincronización o por servicio). Usa la flecha de cada grupo para expandirlo o contraerlo.
- **Ver detalle:** en varias tablas, el ícono de detalle (👁) abre una ventana con pestañas de información adicional (por ejemplo, *Información*, *Métricas*, *Labels* y *Recomendación*).

### 3.4 Mensajes que puedes encontrar

| Mensaje | Significado y qué hacer |
|---|---|
| **Cargando...** / **Cargando datos...** | La información se está obteniendo. Espera unos segundos. |
| **Sin datos para mostrar** / **No hay datos disponibles** | No hay información para los filtros elegidos. Amplía el período o cambia los filtros. |
| **Error al cargar datos** | Hubo un problema al obtener la información. Intenta nuevamente o ajusta el rango de fechas. Si persiste, contacta a soporte. |
| **No se ha seleccionado ningún proyecto / ninguna instancia / ningún cluster** | La vista necesita que elijas un proyecto o un recurso en los filtros. |
| **Sin detalle de facturación** — *Active export billing en GCP para ver costos* | Tu cuenta de GCP no está exportando la facturación, por lo que la vista no puede mostrar costos. Consulta al administrador de tu organización. |

---

## 4. Página de Inicio de GCP

**Menú:** Inicio

Es la primera pantalla al ingresar al módulo (**Dashboard GCP**). Tiene dos secciones:

- **Módulos Recomendados:** accesos rápidos a las vistas más útiles para analizar el consumo y buscar ahorros:
  - **Facturación GCP:** botón *Ver Tendencias*.
  - **Recommender:** botón *Ver Recomendaciones*.
  - **Ahorro y Optimización:** botones *CUDs Analysis* y *Spot vs Standard VMs*.
  - **Cloud Storage & Discos:** botón *Storage Classes* (Top Cloud Storage Buckets).
- **Todos los Módulos GCP:** accesos agrupados en:
  - **Costos & Actividad:** Tendencia de Facturación, Cuotas (Quotas), Recommender (Advisor) y CUDs.
  - **Funciones de Análisis:** Top de Facturación por Región, Consumo hábil vs no hábil (Compute Engine, Instance Groups, Cloud SQL, GKE Clusters y Cloud Filestore) y Comparativa Spot vs Standard.
  - **Recursos por Tipo:** Compute Engine (VMs), Instance Groups (MIGs), Cloud SQL (PostgreSQL, MySQL y SQL Server) y Clusters GKE (Nodos).

Haz clic en cualquier botón para ir directamente a la vista correspondiente.

> 🖼️ **Captura pendiente:** Página de Inicio de GCP con "Módulos Recomendados" y "Todos los Módulos GCP".
> *Archivo sugerido:* `img/gcp/04-inicio.png`

---

## 5. Vistas principales

### 5.1 Tendencia Facturación

**Menú:** Tendencia Facturación
**Para qué sirve:** analizar cómo evoluciona tu gasto en el tiempo, por servicio, y detectar los servicios que más subieron o bajaron mes a mes.

**Filtros:** Período · Proyectos · Regiones · Tags · Servicio (varios).

**Qué muestra**

1. **Top Servicios:** selector en la parte superior para elegir cuántos servicios mostrar (Top 5, 8, 10, 15, 20 o *Todos*, que es la opción inicial). Junto a él se indica la **Divisa** (USD).
2. **Tarjetas de resumen:**
   - **Costo Acumulado** de los servicios visibles. Indica si corresponde a un **Costo Neto (Cargo)** o a un **Costo Neto (Saldo a Favor)**, cuando los créditos superan al uso.
   - **Servicios** mostrados. El ícono junto al número abre la lista de servicios.
3. **Distribución de Costos por Servicio:** gráfico con la evolución de los costos de cada servicio. Incluye el total del período y un botón **Exportar** para descargar el gráfico como imagen.
4. **Información del Período:** fechas desde/hasta y cantidad de servicios.
5. **Análisis Histórico y Desviaciones:** desglose mes a mes del consumo por servicio (USD), con la **desviación** frente al período anterior. Al final incluye el **Resumen Desviaciones Mensuales**:
   - **T10-Alzas:** suma de los incrementos de costo de los servicios que subieron.
   - **T10-Bajas:** suma de las reducciones de costo de los servicios que bajaron.
   - **Neto:** balance del mes (Alzas + Bajas). Un valor negativo (en verde) indica ahorro real global.
   - Botón **Exportar a Excel** para descargar la tabla.

**Cómo usarla**

1. Elige un **Período** de varios meses para ver la tendencia y las desviaciones mensuales.
2. Si quieres, limita el análisis a ciertos **Proyectos**, **Regiones**, **Servicios** o a un **Tag**.
3. Presiona **Aplicar**.
4. Usa **Top Servicios** para concentrarte en los servicios de mayor costo.
5. Revisa en la tabla qué servicios explican las alzas del mes y exporta a Excel si necesitas compartir el análisis.

> 🖼️ **Captura pendiente:** Tarjetas de resumen y gráfico "Distribución de Costos por Servicio" con el selector Top Servicios.
> *Archivo sugerido:* `img/gcp/05-tendencia-grafico.png`

> 🖼️ **Captura pendiente:** Tabla "Análisis Histórico y Desviaciones" con el resumen de desviaciones y el botón Exportar a Excel.
> *Archivo sugerido:* `img/gcp/06-tendencia-tabla.png`

---

### 5.2 Quotas

**Menú:** Quotas
**Para qué sirve:** visualizar en un **mapa de calor** (heatmap) el uso de las cuotas de servicio de GCP y detectar las que están cerca de su límite.

**Filtros:** Período · Proyectos.

**Qué muestra**

Un mapa de rectángulos agrupados (**GCP Quotas Heatmap**). El **color** indica el porcentaje máximo de uso: mientras más cálido, más cerca del límite (*alto uso*).

**Controles del gráfico**

- **Area por:** define el tamaño de cada rectángulo:
  - *Max. % de uso* (opción inicial)
  - *Numero de quotas*
- **Solo quotas con uso:** viene activada; desmárcala para ver también las cuotas sin consumo.
- Al pasar el cursor sobre una cuota verás: **Consumo máx.**, **Uso**, **Límite**, **Service** y **Project**.
- Haz clic en un bloque para acercarte a ese nivel; usa los íconos superiores para **restaurar** la vista o **guardar como imagen**.

> 🖼️ **Captura pendiente:** Heatmap de quotas con el selector "Area por" y la casilla "Solo quotas con uso".
> *Archivo sugerido:* `img/gcp/07-quotas.png`

---

### 5.3 Recommender

**Menú:** Recommender
**Para qué sirve:** revisar las recomendaciones de **GCP Recommender** (Active Assist) y las **recomendaciones generadas por IA** de Cloud Performance, con su ahorro estimado, y registrar el estado de ejecución de cada una.

**Filtros:** Período · Proyectos · Regiones · Categorías (una o varias) · Prioridades (una o varias).

| Categorías | Prioridades |
|---|---|
| *Todas las Categorías*, Costo, Seguridad, Rendimiento, Fiabilidad, Gestión, Sostenibilidad | *Todas las Prioridades*, P1 (Crítica), P2 (Alta), P3 (Media), P4 (Baja), No especificada |

> ⚠️ Para ver información debes elegir **al menos una categoría y una prioridad** (o las opciones *Todas*) y presionar **Aplicar**. Si falta alguna, verás *"No se ha seleccionado categoría."* o *"No se ha seleccionado prioridad."*.

#### Sección "Recomendaciones" (GCP Recommender)

1. **Gráfico circular doble:** el anillo **interior** agrupa las recomendaciones por **categoría** y el **exterior** por **prioridad**. El total aparece al centro.
2. **Buscador:** *Buscar por categoría, descripción...* (resalta las coincidencias).
3. **Contadores:** cantidad de **Categorías** y de **Tipos** de recomendación visibles. Botones **Expandir** / **Colapsar**.
4. **Panel izquierdo:** categorías con sus recomendaciones. Cada una muestra su prioridad (**P1 Crítico**, **P2 Alto**, **P3 Medio** o **Bajo**) y, en las de costo, el ahorro estimado.
5. **Panel derecho:** al hacer clic en una recomendación verás:
   - La categoría, el tipo de recomendación y la descripción.
   - **Ahorro mensual estimado** (en recomendaciones de costo) o **Tipo de Mejora** (*Operacional / Fiabilidad*, en las demás).
   - **Recursos Afectados** y **Última Actualización**.
   - **Detalle de la recomendación:** tabla con el **Proyecto**, la **Ubicación** y, en recomendaciones de costo, el **Ahorro mensual** de cada caso.

> 🖼️ **Captura pendiente:** Gráfico circular de categorías y prioridades, y panel de recomendaciones con el detalle a la derecha.
> *Archivo sugerido:* `img/gcp/08-recommender.png`

#### Sección "Recomendaciones IA"

Cada reporte de IA incluye:

- **Resumen Ejecutivo IA** y **Estrategias de Priorización**.
- **Escenarios de ahorro mensual:**
  - **Conservador:** ahorro demostrado con datos.
  - **Optimista:** valoración alternativa de la misma acción, con su nivel de **Confianza** (Alta, Media, Baja, No aplica).
  - ⚠️ Ambas cifras **no se suman**: el escenario optimista ya incluye el conservador.
- **Hallazgos detallados:** lista de hallazgos (10 por página).

**Controles de la lista de hallazgos**

- Pestañas **Todos (N)** y **Top 10** (los 10 hallazgos de mayor ahorro).
- Botones para ordenar por **Riesgo**, **Ahorro** u **Optimista** (clic de nuevo para invertir el orden).
- Filtro **Estado:** activa o desactiva *En ejecución*, *Finalizada*, *Rechazada*, *Pospuesta* y *Sin estado*.
- Los hallazgos con el logo de Cloud Performance fueron detectados por el motor propio de Cloud Performance.

**Detalle de un hallazgo** (haz clic sobre él para expandirlo):

- **Estado de ejecución:** estado actual y formulario para cambiarlo.
- **Recursos Afectados** (si hay más de uno).
- **Diagnóstico y Justificación:** Resumen, Justificación Técnica y Contraste de Contexto.
- **Análisis de Facturación.**
- **Matriz de Impacto:** Ahorro conservador, Ahorro optimista, Riesgo, Impacto operativo, Reversibilidad y Tiempo de ejecución.
- **Plan de Acción:** Prerrequisitos, Pasos de Remediación y Referencias Técnicas (enlaces a documentación).

**Cómo registrar el estado de una recomendación**

1. Expande el hallazgo.
2. En **Estado de ejecución**, abre **Asignar estado** (o **Cambiar a**, si ya tiene uno) y elige: *En ejecución*, *Finalizada*, *Rechazada* o *Pospuesta*.
3. Opcionalmente, escribe un **Comentario** con el contexto o la justificación.
4. Presiona **Guardar estado**.
5. Aparecerá una notificación en la esquina superior derecha:
   - **Cambio de estado completado:** se actualizó la recomendación y se registró el evento en el histórico.
   - **Cambio de estado parcial** o **Error al cambiar el estado:** revisa el detalle indicado e inténtalo nuevamente.
6. Usa el botón **Seguimiento recomendación** para ver el historial de estados de ese hallazgo.

> 💡 La sección *Recomendaciones IA* solo depende del **Período**; los filtros de proyecto, región, categoría y prioridad no la afectan (aunque debes elegir una categoría y una prioridad para que la vista se muestre).

> 🖼️ **Captura pendiente:** Resumen Ejecutivo IA con los escenarios de ahorro.
> *Archivo sugerido:* `img/gcp/09-recommender-ia-resumen.png`

> 🖼️ **Captura pendiente:** Hallazgo expandido con "Estado de ejecución" y "Matriz de Impacto".
> *Archivo sugerido:* `img/gcp/10-recommender-ia-hallazgo.png`

---

### 5.4 Vista Ejecuciones de Recomendaciones

**Menú:** Vista Ejecuciones de Recomendaciones
**Plan requerido:** Business o Global Access.
**Para qué sirve:** hacer seguimiento a las recomendaciones que ya tienen un estado asignado, ver su historial, calcular el ahorro no capturado y crear tickets en tus herramientas de gestión.

**Filtros:** Período.

**Qué muestra** (título de la vista: *Historial de ejecución de recomendaciones*)

1. **Resumen de Gestión de Recomendaciones:** Total de recomendaciones gestionadas, cantidad de **Eventos** (cambios de estado) y el conteo por estado (*En ejecución*, *Finalizada*, *Rechazada*, *Pospuesta*).
2. **Costo de Inacción:** monto de **Ahorro no capturado**, compuesto por las recomendaciones cuyo último estado es *Rechazada* o *Pospuesta*. Haz clic en una de ellas para ir directamente a su tarjeta.
3. **Recomendaciones Gestionadas:** lista (10 por página) con:
   - Buscador *Buscar por nombre, tipo o resumen...*
   - Orden por **Última actualización** o **Más cambios**.
   - Filtro **Estado** por chips.
   - En cada tarjeta: los últimos estados, **Cambios**, **Estado actual**, **Última actualización** y **Ahorro Est.**

**Detalle de una recomendación gestionada** (clic para expandir):

- Formulario para **cambiar el estado** (igual que en *Recommender*).
- **Tickets:** si tu organización configuró conectores en **Perfil → Conectores**, verás los botones **Crear ticket en Jira** y/o **Crear ticket en ServiceNow**.
  - Los botones aparecen solo cuando el estado actual es **En ejecución**.
  - Una vez creado, verás la clave del ticket con el enlace **Ver en Jira** / **Ver en ServiceNow**.
  - Si el ticket fue eliminado en la herramienta externa, se te avisará y podrás crear uno nuevo.
  - Si no hay conectores, verás el aviso *"No hay conectores disponibles para crear tickets."*
- Resumen de la recomendación, recurso, plan de acción y referencias.
- **Línea de Tiempo de Estados:** todos los cambios con su fecha y comentario.

> 🖼️ **Captura pendiente:** Resumen de gestión y tarjeta "Costo de Inacción".
> *Archivo sugerido:* `img/gcp/11-ejecuciones-resumen.png`

> 🖼️ **Captura pendiente:** Recomendación expandida con botones de ticket y línea de tiempo.
> *Archivo sugerido:* `img/gcp/12-ejecuciones-detalle.png`

---

### 5.5 Métricas FinOps

**Menú:** Métricas Finops
**Para qué sirve:** obtener un diagnóstico FinOps de tu cuenta generado con IA, con puntaje global, ahorro estimado y análisis por métrica.

**Filtros:** Período.

**Secciones**

1. **Resumen Financiero.**
2. **Resumen Técnico.**
3. **Status General:** **FinOps Global Score** y **Ahorro Mensual Total Estimado**.
4. **Resumen Métricas Analizadas:** acciones recomendadas con sus criterios de evaluación:
   - **Rol Objetivo** (DevOps/SRE, Finance, Cloud Architect, Software Engineer).
   - **Nivel de Riesgo** (Low, Medium, High).
   - **Impacto Operacional.**
   - **Reversibilidad** (Easy, Hard, Not Reversible).
5. **Detalle Métricas Analizadas (Explorador de Métricas):** elige una métrica en *Seleccionar métrica...* para ver su análisis de causa raíz, evidencia técnica, recomendación y acción sugerida:
   - Costo de Oportunidad
   - Volatilidad de Costos
   - Eficiencia de CPU
   - Elasticidad
   - Evaluación de Madurez
   - Proyección de Gasto (Forecast)
   - Recursos Inactivos

> 🖼️ **Captura pendiente:** Status General y Explorador de Métricas con una métrica seleccionada.
> *Archivo sugerido:* `img/gcp/13-metricas-finops.png`

---

### 5.6 Reservations

**Menú:** Reservations
**Para qué sirve:** monitorear la inactividad, la eficiencia y los costos del hardware que tienes **reservado** en Google Cloud (reservas de capacidad), para detectar reservas que no estás aprovechando.

**Filtros:** Período · Proyectos.

**Qué muestra** (título: *Análisis: Reservas de Capacidad*)

1. **Diagnóstico:** un mensaje con el estado general de tus reservas:
   - 🟩 **Óptimo:** tus reservas se usan al 100%.
   - 🟨 **Con inactividad (Sin impacto):** hay horas en que el hardware reservado no se usa, pero no te genera cobros extra.
   - 🟥 **Crítico (Fuga de capital):** la inactividad ya te generó un costo en el período, que se indica en el mensaje.
2. **Tarjetas:** **Reservas Activas** (zonas), **Capacidad Apartada** (VMs), **Horas Inactivas** y **Dinero Perdido** (con la indicación *Sin penalizaciones* o *Costos por recursos ociosos*).
3. **Top Reservas con Mayor Desperdicio:** gráfico con la penalización por reserva. Incluye un botón **Exportar**. Si no hay penalizaciones, verás un mensaje de confirmación.
4. **Detalle de Hardware Reservado:** tabla con **Nombre de la Reserva**, **Zona**, **Capacidad (Hardware)**, **Estado**, **Inactividad** (horas) y **Dinero Perdido** (o *Cubierto por Free Tier*), junto con el total de **Penalizaciones Totales**.

Si no tienes reservas en el período, verás el aviso **"Sin reservas activas"**.

> 🖼️ **Captura pendiente:** Diagnóstico, tarjetas y tabla de reservas.
> *Archivo sugerido:* `img/gcp/14-reservations.png`

---

### 5.7 Committed Use Discounts

**Menú:** Committed Use Discounts
**Para qué sirve:** evaluar si tu **CUD flexible basado en gasto (Spend-Based CUD)** está generando valor real, es decir, si el ahorro que obtienes supera el costo fijo del compromiso.

**Filtros:** Período.

**Qué muestra** (título: *Análisis: Spend-Based CUDs*)

1. **Diagnóstico (Estado):**
   - 🟩 **Rentable:** el ahorro total supera el costo fijo del plan.
   - 🟧 Cualquier otro estado: pagaste más por el descuento de lo que tus máquinas lograron aprovechar; tienes capacidad sobrante.
2. **Tarjetas:**
   - **Compromiso:** monto comprometido por hora.
   - **Costo Fijo Acumulado del CUD** en el período.
   - **Total Ahorro (Cobertura):** descuento aplicado a tu consumo.
   - **Impacto Neto:** cuánto te ahorraste (en verde) o cuánto pagaste de más (en rojo) en el período.
3. **Gráfico de tendencia:** *Costo Fijo del CUD* frente al *Ahorro Logrado* por día. Al pasar el cursor verás también el **Impacto Neto** del día; haz clic en un punto para fijar el detalle. Botón **Exportar PNG** para descargar el gráfico.
4. **Análisis de Eficiencia por Recurso:** tabla con la **Instancia Beneficiada**, el **Costo OnDemand**, el **Costo Neto** (*CUBIERTO POR CUD* si no tuvo costo adicional, o *CUD INSUFICIENTE* si hubo costo), la **Cobertura CUD** y los **SKU Beneficiados**, junto con el **Total Ahorrado**.

> 🖼️ **Captura pendiente:** Diagnóstico, tarjetas y gráfico de tendencia del CUD.
> *Archivo sugerido:* `img/gcp/15-cuds.png`

---

### 5.8 Presupuestos

**Menú:** Presupuestos

La página principal muestra cuatro tarjetas. Haz clic en la que necesites:

| Tarjeta | Descripción |
|---|---|
| 📊 **Costos vs Presupuesto** | Visualiza y compara el presupuesto con los costos reales. |
| 🏷️ **Centros de Costo** | Carga y gestiona los centros de costo. |
| 💰 **Presupuestos Anuales** | Carga y administra los presupuestos anuales. |
| 💰 **Presupuestos Mensuales** | Carga y administra los presupuestos mensuales. |

> 💡 **Orden recomendado:** 1) crea tus **Centros de Costo**, 2) crea sus **Presupuestos Anuales** (con o sin desglose mensual), 3) ajusta los **Presupuestos Mensuales** si lo necesitas, 4) vincula recursos a los centros de costo desde el **Mantenedor de Etiquetas** y 5) revisa **Costos vs Presupuesto**.

> 🖼️ **Captura pendiente:** Menú principal de Presupuestos con las cuatro tarjetas.
> *Archivo sugerido:* `img/gcp/16-presupuestos-menu.png`

#### 5.8.1 Centros de Costo

**Crear un centro de costo**

1. Presiona **+ Nuevo Centro**.
2. Completa el formulario:
   - **ID Centro** *(obligatorio)*: número identificador, por ejemplo `1001`. No se puede modificar después.
   - **Nombre Centro** *(obligatorio)*: por ejemplo *Departamento de IT*.
   - **Responsable**: por ejemplo *Juan Pérez*.
   - **Localización**: por ejemplo *Santiago, Piso 3*.
3. Presiona **✓ Crear Centro**.

**Importar centros de costo desde la nube**

Si ya usas etiquetas de centro de costo en tus recursos de GCP, puedes importarlas:

1. Presiona **Importar desde la nube**.
2. En **Llaves de Tags (separadas por coma)** escribe los nombres de etiqueta que usa tu organización (por defecto: `CentroCosto, CostCenter`).
3. Presiona **Escanear Nube**.
4. Revisa la lista de valores encontrados (puedes filtrarla con *Filtrar resultados por nombre...*) y marca los que quieres importar, o usa **Seleccionar todos**.
5. Presiona **Agregar Seleccionados**. Un mensaje te indicará cuántos se importaron y cuántos se omitieron porque ya existían.

**Editar o eliminar:** en la tabla, usa los íconos **Editar** o **Eliminar** de cada fila. La eliminación pide confirmación y **no se puede deshacer**. La tabla permite buscar por ID, nombre, responsable o localización.

> 🖼️ **Captura pendiente:** Ventana "Importar Centros de Costo" con resultados del escaneo.
> *Archivo sugerido:* `img/gcp/17-centros-costo-importar.png`

#### 5.8.2 Presupuestos Anuales

**Crear un presupuesto anual**

1. Presiona **+ Nuevo Presupuesto**.
2. Completa:
   - **Centro de Costo** *(obligatorio)*.
   - **Año** *(obligatorio)*.
   - **Monto Anual** *(obligatorio)*.
3. *(Opcional)* Presiona **Ver desglose mensual** para repartir el monto por mes:
   1. Elige un mes en la lista (*Seleccione un mes*) y agrégalo.
   2. En la tarjeta de cada mes ingresa **Presupuestado** *(obligatorio)* y, si corresponde, **Real** y **Forecast**.
   3. Revisa el indicador **Porcentaje Asignado**: en verde cuando la suma de meses coincide con el monto anual; se muestra una advertencia si no coincide o si lo **excede**.
4. Presiona **✓ Crear Presupuesto**.

**Editar o eliminar:** desde la tabla (búsqueda por ID de presupuesto, centro de costo, año o monto). Al editar no se pueden cambiar el centro de costo ni el año. Eliminar un presupuesto anual también elimina **todos sus datos mensuales** y **no se puede deshacer**.

> 🖼️ **Captura pendiente:** Formulario de presupuesto anual con el desglose mensual abierto.
> *Archivo sugerido:* `img/gcp/18-presupuesto-anual.png`

#### 5.8.3 Presupuestos Mensuales

**Crear un presupuesto mensual**

1. Presiona **+ Nuevo Presupuesto**.
2. Elige el **Presupuesto Anual** (centro de costo – año).
3. Elige el **Mes**. Solo aparecen los meses que aún no tienen presupuesto; si todos lo tienen, verás *"Todos los meses ya tienen presupuesto asignado"*.
4. Ingresa **Monto Asociado**, **Monto Real** y **Monto Forecast** *(todos obligatorios)*.
5. Revisa el recuadro con el monto anual total, la **Suma de Montos Mensuales**, la **Diferencia Disponible** (o *Excedido*) y el **Porcentaje Asignado**.
6. Presiona **✓ Crear Presupuesto**.

Al editar no se pueden cambiar el presupuesto anual ni el mes. La tabla permite buscar por centro de costo, mes, año o montos.

#### 5.8.4 Costos vs Presupuesto

**Filtros:** Año.

**Qué muestra**

1. **Tarjetas globales:** **Facturación Anual (Global)** (consumo total de la cuenta GCP), **Total Presupuesto Anual**, **Total Presupuesto Mensual**, **Total Real Asignado** y **Total Forecast**.
2. **Gráfico Costos vs Presupuesto GCP:** presupuesto mensual, costo real, forecast y facturación real de GCP.
3. **Tabla comparativa mensual** con la fila **TOTAL**.
4. **Detalle por centro de costo:** para cada centro, su **Presupuesto Anual Asignado** y los totales **Ppto. Mensual Total**, **Real Manual Total**, **Forecast Total**, **Recursos Vinculados** y **Facturación GCP Asignada** (de los recursos vinculados a ese centro).
   - **Ver Desglose Mensual:** muestra el rendimiento mes a mes de los recursos asignados: Ppto. Asignado, Facturación Asignada y **Diferencia** (en rojo si el gasto supera el presupuesto). Presiona **Ocultar Detalle** para cerrarlo.

> 🖼️ **Captura pendiente:** Vista Costos vs Presupuesto con tarjetas, gráfico y desglose de un centro de costo.
> *Archivo sugerido:* `img/gcp/19-costos-vs-presupuesto.png`

---

### 5.9 Mantenedor de Etiquetas (Tags)

**Menú:** Mantenedor de Etiquetas (Tags)
**Para qué sirve:** medir qué parte de tu infraestructura está etiquetada, agregar **tags locales** (solo en Cloud Performance, sin modificar GCP) y **vincular recursos a centros de costo**.

**Filtros:** Período · Proyectos.

**Qué muestra** (título: *Análisis de Cobertura de Etiquetas*)

1. **Estado de cobertura:** mensaje con el porcentaje de recursos etiquetados:
   - **Excelente** (90% o más), **Requiere Atención** (50% a 89%) o **Crítico (Falta de visibilidad)** (menos de 50%).
2. **Tarjetas:** Total Recursos, **Recursos Tageados**, **Huérfanos (Sin Tags)** y **Cobertura**. El ícono ⓘ abre el **Detalle de Origen de Etiquetas**: *Solo en GCP*, *Solo Local* y *Mixtos*.
3. **Detalle de Inventario y Etiquetas:** tabla agrupada por servicio, con las columnas Servicio GCP, Instancia / Recurso, Proyecto, Región, Etiquetas y Acción. Puedes buscar con *Buscar por ID de recurso...*

**Colores de las etiquetas**

| Color | Origen |
|---|---|
| ☁️ Azul — **Nube** | Label nativo de GCP (solo lectura). |
| 💻 Morado — **Local** | Tag creado en Cloud Performance (editable). |
| 💲 Verde — **Finanzas** | Centro de costo asignado (`centro_costo`). |

**Agregar o editar un tag local**

1. En la fila del recurso, presiona **+ Tag Local**.
2. Escribe la **Etiqueta (Key)** (por ejemplo, `owner`) y el **Valor (Value)** (por ejemplo, `cloudperformance`). Si la clave ya existe en ese recurso, su valor se actualizará.
3. Presiona **Guardar Cambios**.
4. Para editar un tag local existente, usa el ícono de lápiz junto a él; para eliminarlo, usa la **✕** (se pedirá confirmación).

> ⚠️ La clave `centro_costo` está reservada. Para asignar centros de costo usa el botón **$ Asignar CC**.

**Asignar centros de costo (presupuestos)**

- **A un recurso:** presiona **$ Asignar CC** en su fila.
- **A varios recursos:** marca sus casillas (o la casilla del encabezado para todos) y presiona **Asignación Masiva** en la barra inferior.

En la ventana **Vincular Presupuesto(s) GCP**:

1. Marca uno o varios centros de costo (puedes elegir más de uno si el gasto es compartido).
2. Presiona **Aplicar**.

Si no tienes centros de costo creados, la ventana te indicará que primero debes crearlos en el **módulo de presupuesto** (ver [5.8.1](#581-centros-de-costo)).

> 💡 Eliminar el tag `centro_costo` de un recurso quita **todos** los centros de costo asignados. Para quitar solo uno, usa el lápiz y desmárcalo.

> 🖼️ **Captura pendiente:** Tarjetas de cobertura y tabla de inventario con etiquetas de colores.
> *Archivo sugerido:* `img/gcp/20-tags-inventario.png`

> 🖼️ **Captura pendiente:** Ventana "Vincular Presupuesto(s) GCP" con centros de costo seleccionados.
> *Archivo sugerido:* `img/gcp/21-tags-asignar-cc.png`

---

## 6. Consumos

Las vistas de **Consumos** muestran el uso real de tus recursos y su costo asociado, para detectar recursos inactivos o sobredimensionados. En general comparten la misma estructura: **tarjetas de resumen**, **gráficos por métrica** (Promedio, Máximo y Mínimo) y una **tabla de detalle** con clasificación.

**Clasificación de los recursos en las tablas**

| Etiqueta | Significado |
|---|---|
| 🟥 **Idle** / **Zombi** | Recurso encendido sin actividad (en Filestore, sin uso de capacidad). |
| 🟧 **Infrautilizada** | Recurso con sobre-provisionamiento (usa mucho menos de lo que tiene asignado). |
| 🟨 **Storage ineficiente** | *(Solo Cloud SQL)* almacenamiento asignado muy por encima del usado. |
| 🟩 **Óptimo** | Recurso dentro de parámetros normales de eficiencia. |

**Leyenda de las tablas**

- **Barras:** porcentaje relativo al máximo visible en la tabla.
- **Costo:** rojo > $50, ámbar > $20, verde ≤ $20 USD/mes (en Cloud SQL: rojo > $20, ámbar > $10, verde ≤ $10 USD/mes).
- Si una fila muestra **Sin billing**, no hay información de facturación para ese recurso.
- El ícono de detalle de cada fila abre la información del recurso con las pestañas **Información**, **Métricas**, **Labels** y **Recomendación**.

### 6.1 Compute Engine, Instances Group y Clusters GKE

**Menú:** Consumos → *Compute Engine* / *Instances Group* / *Clusters GKE*

**Filtros**

| Vista | Filtros |
|---|---|
| Compute Engine | Período · Regiones · Tags · Recurso (instancias, varias) |
| Instances Group | Período · Regiones |
| Clusters GKE | Período · Regiones · Tags · Recurso (clústeres, varios) |

**Qué muestra**

1. **Tarjetas:**
   - **Eficiencia Global:** puntaje unificado de eficiencia, con el detalle de *CPU Promedio*, *Memoria Promedio*, *Disco IOPS/Uso* y *Red / Conexiones*.
   - **Total Instancias**, **Instancias Idle** (encendidas sin actividad), **Infrautilizadas** (con sobre-provisionamiento) y **Costo Total**.
2. **Gráficos:** Uso de CPU, Lectura y Escritura en Disco (IOPS y Throughput), y Red (paquetes y tráfico entrante y saliente).
3. **Detalle de Instancias Compute Engine:** tabla con Instancia, Estado, Ubicación, CPU Promedio, IOPS (R/W), Red (In/Out), Clasificación, Costo Mes y Sync Time. La pestaña **Recomendación** del detalle sugiere, por ejemplo, detener la instancia si no es crítica o ajustar su tipo de máquina.

> 🖼️ **Captura pendiente:** Consumo de Compute Engine: tarjetas, gráficos y tabla con clasificación.
> *Archivo sugerido:* `img/gcp/22-consumo-compute-engine.png`

### 6.2 Cloud SQL / Spanner

**Menú:** Consumos → Cloud SQL / Spanner
**Filtros:** Período · Regiones · Tipo BD · Tags.

1. **Tarjetas:** Eficiencia Global (CPU y memoria), Total Instancias, **Instancias Idle** (CPU < 5% y conexiones < 2), **Infrautilizadas** (CPU < 20% o conexiones < 5 en promedio), Costo Total, Promedio CPU, Promedio Conexiones, Storage Utilizado y Promedio Memoria.
2. **Gráficos:** Uso de CPU, Utilización de Memoria, Conexiones a la Base de Datos y Utilización de Storage.
3. **Detalle de Instancias Cloud SQL:** tabla con Instancia, Tipo BD, Región, CPU %, Conexiones, Storage %, Clasificación, Costo Mensual y Sync Time. La pestaña **Recomendación** sugiere, por ejemplo, reducir vCPU y RAM, reducir el almacenamiento aprovisionado o crear un snapshot antes de eliminar.

> 🖼️ **Captura pendiente:** Consumo de Cloud SQL.
> *Archivo sugerido:* `img/gcp/23-consumo-cloud-sql.png`

### 6.3 Zonas DNS: Consumo y Estado

**Menú:** Consumos → Zonas DNS: Consumo y Estado
**Para qué sirve:** distinguir las zonas DNS activas de las zonas **zombie** (sin consultas), que generan costo innecesario.

**Filtros:** Período · Estado de Uso · Tags.

1. **Tarjetas:** **Total Zonas DNS** (activas y zombies), **Zonas Sin Uso** (0 queries), **Costo Total** y **Ahorro Potencial** (eliminando las zonas sin uso).
2. **Gráficos:** *Top Zonas por Queries/Segundo* y *Distribución por Clasificación*.
3. **Detalle de Zonas DNS:** tabla agrupada por fecha con Nombre de Zona, DNS Name, Visibilidad, DNSSEC, Queries/seg, Clasificación, Costo USD, Ahorro Potencial y Acción Recomendada.

> 🖼️ **Captura pendiente:** Zonas DNS con tarjetas, gráficos y tabla.
> *Archivo sugerido:* `img/gcp/24-consumo-dns.png`

### 6.4 Load Balancers: Consumo y Uso

**Menú:** Consumos → Load Balancers: Consumo y Uso
**Para qué sirve:** analizar el tráfico de tus balanceadores y detectar los que están configurados pero no procesan tráfico.

**Filtros:** Período · Regiones · Esquema · Estado de Uso.

1. **Tarjetas:** **Total Load Balancers** (activos y zombies), **Tráfico Procesado** (requests totales), **Zombies / Sin Tráfico**, **Costo Total** y **Ahorro Potencial** (eliminando los que no tienen tráfico).
2. **Gráficos:** *Top Load Balancers por Requests* y *Distribución por Esquema*.
3. **Detalle de Load Balancers:** tabla agrupada por fecha con Nombre, Región, Esquema, Protocolo, Requests, Costo Mensual, Ahorro Potencial, Estado (*ACTIVO* o *SIN TRÁFICO*) y Acción Recomendada.

> 🖼️ **Captura pendiente:** Load Balancers con tarjetas, gráficos y tabla.
> *Archivo sugerido:* `img/gcp/25-consumo-load-balancers.png`

### 6.5 Cloud Filestore

**Menú:** Consumos → Cloud Filestore
**Para qué sirve:** comparar la capacidad aprovisionada de tus sistemas de archivos (NFS) con su uso real y su costo.

**Filtros:** Período · Proyectos · Regiones · Tags · Recurso (varios).

1. **Tarjetas:** **Eficiencia de Almacenamiento** (uso real frente a capacidad aprovisionada), Total Filestores, Capacidad Total, **Instancias Zombis** (0% de uso), **Infrautilizadas** (menos de 10% de uso) y Costo Acumulado.
2. **Gráficos:** Capacidad Usada, Capacidad Libre, Operaciones de Lectura y Escritura, y Throughput de Lectura y Escritura.
3. **Detalle de Instancias Filestore:** tabla con Instancia Filestore, Estado, Tier / Ubicación, Uso de Capacidad, Clasificación, Costo y Sync Time. El detalle muestra el último rendimiento observado y sus labels.

> 🖼️ **Captura pendiente:** Consumo de Cloud Filestore.
> *Archivo sugerido:* `img/gcp/26-consumo-filestore.png`

---

## 7. Funciones

Las **Funciones** son análisis especializados para entender tu gasto y encontrar oportunidades de ahorro.

### 7.1 Consumo horario hábil vs no hábil

**Menú:** Funciones → Consumo horario hábil vs no hábil → *Compute Engine* / *Instance Groups* / *Clusters GKE* / *Cloud SQL Postgres* / *Cloud SQL Mysql* / *Cloud SQL Sql Server* / *Cloud Filestore*
**Para qué sirve:** comparar el uso de tus recursos en **horario hábil** y **no hábil**, para identificar recursos que podrían apagarse o reducirse fuera del horario laboral.

**Filtros:** Período · Proyectos · Regiones · Tags (excepto en *Instance Groups*) · Recurso (varios).

**Qué muestra**

1. **Tarjetas** con el uso promedio y máximo por métrica.
2. **Gráfico comparativo** *Horario Hábil* vs *Horario No Hábil* por métrica.
3. **Tabla de detalle** con Recurso, Fecha Observación y **Tendencia Global**:
   - ☀️ *Mayor uso general en horario hábil*
   - 🌙 *Mayor uso general en horario no hábil*
   - ⚖️ *Balanceado*
   - El detalle de cada recurso tiene las pestañas **Resumen** y **Detalle Métricas**, e indica si es *Posible Infrautilizado*, *Candidato Ahorro* o *Estándar*.

> 🖼️ **Captura pendiente:** Comparativa horario hábil vs no hábil para Compute Engine.
> *Archivo sugerido:* `img/gcp/27-horario-habil.png`

### 7.2 Recursos no utilizados

**Menú:** Funciones → Recursos no utilizados

| Vista | Filtros | Qué muestra |
|---|---|---|
| **Compute Engine** / **Instance Groups** / **Clusters GKE** | Período, Proyectos, Regiones, Tags (excepto en *Instance Groups*), Recurso | Tarjetas (**Total costo instancias infrautilizadas**, instancias con CPU < 10%, CPU promedio global, y promedios de red y disco) y tabla con Instancia, ID Instancia, **Gasto Periodo**, CPU, Net (I/O) y Disk (I/O). El detalle tiene las pestañas **Diagnóstico** (*Recurso Saludable*, *Bajo Uso* o *Recurso Infrautilizado*), **Recursos** (discos y red) e **Historial**. |
| **Discos Persistentes** | Período, Regiones, Tags, Recurso (discos) | Tarjetas (**Discos Sin Uso**, **Espacio Desperdiciado** y **Ahorro Estimado**) y tabla con Disco, Proyecto, Región, Tipo, Tamaño, Costo Mensual y Estado. La pestaña **Recomendación** sugiere crear un snapshot y eliminar el disco, conectarlo a una instancia activa o eliminarlo directamente. |
| **Filestore – Sin Uso** | Período, Proyectos, Regiones, Tier Filestore, Tags | Tarjetas (Total Instancias, **Sin Actividad (IOPS = 0)**, **Capacidad Sin Actividad** y **Ahorro Potencial**) y tabla **Detalle de Instancias Filestore** con la actividad (*SIN ACTIVIDAD*, *ACTIVIDAD BAJA* o *EN USO*) y la recomendación (*ELIMINAR* o *MONITOREAR*). Las instancias sin métricas aparecen en una tabla aparte. |

> 🖼️ **Captura pendiente:** Compute Engine infrautilizadas con tarjetas de costo y tabla comparativa.
> *Archivo sugerido:* `img/gcp/28-no-utilizados-compute-engine.png`

> 🖼️ **Captura pendiente:** Discos persistentes sin uso con la pestaña "Recomendación".
> *Archivo sugerido:* `img/gcp/29-no-utilizados-discos.png`

### 7.3 Networking

**Menú:** Funciones → Networking → *IPs Externas sin Uso* / *Subnets sin Recursos Asociados*

**Filtros:** Período · Regiones · Tags.

**IPs Externas sin Uso:** IPs reservadas que no están asociadas a ningún recurso y generan costo.

1. **Tarjetas:** **IPs sin Uso** (incluye las *orphaned*, sin recurso asociado), **Días Promedio Reservadas**, **Costo Total Período** y **Ahorro Potencial** (liberando todas las IPs sin uso).
2. **Gráficos:** *Distribución por Región* e *IPs por Días Reservadas* (0-7, 8-30, 31-90 y 90+ días).
3. **Detalle de IPs sin Uso:** tabla con Nombre IP, Dirección IP, Región, Network Tier, Días Reservada, Estado, Costo Mensual y Ahorro Potencial.

**Subnets sin Recursos Asociados:** higiene de red y reducción de superficie de ataque innecesaria.

1. **Tarjetas:** **Subnets Huérfanas**, **IPs Privadas Bloqueadas**, **Regiones Expuestas** (con conectividad activa pero sin recursos productivos) y **Configuración de Red** (indica si se recomienda usar una VPC personalizada).
2. **Gráficos:** *Top Regiones con IPs Desperdiciadas* y *Distribución por Purpose*.
3. **Detalle de Subnets sin Recursos:** tabla con Subnet Name, Región, Red, CIDR Range, IPs Disponibles, Purpose, Días sin Uso, Flow Logs (*Habilitado* / *Deshabilitado*) y Acción Recomendada (*Considerar Eliminación*, *Revisar y Migrar* o *Monitorear*).

> 🖼️ **Captura pendiente:** IPs externas sin uso con tarjetas y gráficos.
> *Archivo sugerido:* `img/gcp/30-networking-ips.png`

### 7.4 Top Cloud Storage Buckets

**Menú:** Funciones → Top Cloud Storage Buckets
**Filtros:** Período · Regiones · Clase de Storage · Tags.

1. **Tarjetas:** Tamaño Total, Total Buckets, Total Objetos y Costo Total (mensual estimado).
2. **Gráficos:** *Top Buckets por Número de Objetos* y *Top Buckets por Tamaño* (cada uno con selector Top 3 / Top 5 / Top 10), y las tendencias de **cantidad de objetos** y **tamaño**.
3. **Historial de Buckets GCP:** tabla agrupada por fecha de sincronización con Bucket, Clase, Tamaño, Objetos, Uso (*En uso* / *Sin uso*), Lifecycle (*Configurado* / *Sin reglas*), Costo, Ahorro Potencial, Recomendación y Ubicación.

> 🖼️ **Captura pendiente:** Top Cloud Storage Buckets con tarjetas y gráficos.
> *Archivo sugerido:* `img/gcp/31-top-storage-buckets.png`

### 7.5 Top Filestore Sub-Utilizados

**Menú:** Funciones → Top Filestore Sub-Utilizados
**Filtros:** Período · Proyectos · Regiones · Tier Filestore · Tags.

1. **Tarjetas:** Instancias Analizadas, Capacidad Provisionada (con el % de uso promedio), Costo Mensual Total y **Costo Desperdiciado** (con los GB sin uso).
2. **Gráficos:** *Top Filestore por GB Desperdiciado* y *Top Filestore por Costo Desperdiciado* (selector Top 3 / Top 5 / Top 10), y las tendencias de **GB utilizado** y **GB desperdiciado**.
3. **Instancias sin datos de métricas:** instancias excluidas del análisis (por ejemplo, recién creadas, en reparación o con facturación suspendida).

> 🖼️ **Captura pendiente:** Top Filestore Sub-Utilizados.
> *Archivo sugerido:* `img/gcp/32-top-filestore.png`

### 7.6 Spot vs Standard VMs

**Menú:** Funciones → Spot vs Standard VMs
**Filtros:** Período · Regiones · Tags.

1. **Tarjetas:** **Total VMs** (Standard y Spot/Preemptible), **% Spot VMs**, **Costo Estimado Total** y **Ahorro Potencial** (convirtiendo VMs Standard en Spot/Preemptible).
2. **Gráfico:** *Evolución Spot vs Standard VMs*.
3. **Historial Spot vs Standard VMs:** tabla agrupada por fecha de sincronización con VM Name, Tipo (*SPOT*, *PREEMPTIBLE* o *STANDARD*), **Oportunidad** (*Candidata Spot*), Costo/Hora, Ahorro Potencial, Machine Type, Zona y GKE Cluster.

> 🖼️ **Captura pendiente:** Spot vs Standard VMs.
> *Archivo sugerido:* `img/gcp/33-spot-vs-standard.png`

### 7.7 Promedio de uso por región

**Menú:** Funciones → Promedio de uso por región
**Filtros:** Período · Proyectos · Regiones · Servicio.

1. **Tarjetas:** Regiones Activas, Total Recursos, Total Muestras y Costo Total.
2. **Métricas por Región:** promedios por métrica y región en el rango seleccionado. Haz clic en una celda para abrir su detalle estadístico (**Promedio**, **Muestras**, etc.) y presiona **Cerrar** para volver.
3. **Promedios por localización:** tarjetas de detalle por región, con el total de recursos analizados, métricas analizadas y muestras recolectadas.

> 🖼️ **Captura pendiente:** Promedio de uso por región con el detalle de una métrica abierto.
> *Archivo sugerido:* `img/gcp/34-uso-por-region.png`

### 7.8 Top Facturación por Región

**Menú:** Funciones → Top Facturación por Región
**Filtros:** Período · Proyectos · Tags.

1. **Tablero de Costos Regionales:** el enlace **¿Qué significan estos costos?** muestra la diferencia entre **Costo Bruto** (precio de lista, sin descuentos) y **Costo Neto** (monto final tras descuentos como CUDs o Free Tier).
2. **Tarjetas:** **Costo Neto Total** (o **Costo Bruto Total**), la región de **Mayor consumo** y la de **Menor consumo**.
3. **Configuración de Vista:**
   - **Ranking:** Top 3, Top 5, Top 10 Regiones (opción inicial) o *Ver Todas*.
   - **Moneda:** *Costo Neto (Real)* (opción inicial) o *Costo Bruto (Lista)*.
4. **Distribución Geográfica:** gráfico de costo por región. Haz clic en una región para ver su detalle; presiona **Limpiar filtro** para volver a la vista general.
5. **Detalle de Registros:** tabla con Región, Servicio, Fecha de Uso, Costo Bruto y Costo Neto (los consumos sin costo aparecen como *Gratis*). Botón **Actualizar** para recargar.

> 🖼️ **Captura pendiente:** Top Facturación por Región con tarjetas, selectores y gráfico.
> *Archivo sugerido:* `img/gcp/35-top-facturacion-region.png`

---

## 8. Recursos

Las vistas de **Recursos** muestran el detalle completo de **un recurso individual**: sus datos, su rendimiento y su facturación.

**Cómo usarlas**

1. Ajusta **Período**, **Proyectos**, **Regiones** y, si quieres, **Tags**.
2. En **Recurso**, elige el recurso que quieres revisar.
3. Presiona **Aplicar**.

Mientras no haya un recurso elegido verás un mensaje como *"No se ha seleccionado ninguna instancia."*

**Elementos comunes**

- **Información del recurso** con el botón **Ver Historial**, que muestra cómo cambió el recurso en cada fecha de observación.
- **Tarjetas de métricas** con el valor **Promedio** y el **Peak** (máximo) de cada métrica.
- **Gráficos** por métrica.
- **Facturación:** tabla con el costo por **SKU**. Según la vista, incluye **Bruto**, **Desc.** y **Neto** en USD y CLP, junto con el **Total Neto USD** y el **Total Neto CLP**.

### 8.1 Compute Engine

**Menú:** Recursos → Compute Engine

1. **Información de la instancia:** Tipo, CPU Platform, Despliegue, Zona, Uptime, **Discos**, **Adjuntos**, **Interfaces** e **IPs Públicas**, con la información de discos e interfaces.
2. **Métricas de la Instancia:** tarjetas y gráficos por métrica.
3. **Facturación de la Instancia:** costos por SKU (Bruto, Desc. y Neto en USD y CLP).

> 🖼️ **Captura pendiente:** Detalle de una instancia Compute Engine.
> *Archivo sugerido:* `img/gcp/36-recurso-compute-engine.png`

### 8.2 Instance Groups y Clusters GKE

**Menú:** Recursos → *Instance Groups* / *Clusters GKE*

1. **Información del grupo o clúster:**
   - *Instance Groups:* ID, **Zonas**, **Acciones** y **Versiones**, con el detalle de **Zonas de distribución** y **Acciones en curso**.
   - *Clusters GKE:* ID, **Pools**, **IP Pub.** y **Shielded**, con el detalle de sus **Node Pools**.
   - En **Ver Historial** verás además datos como el template (Instance Groups) o la versión y la VPC (Clusters GKE) en cada fecha de observación.
2. **Instancias del Instance Group** / **Nodos:** tabla con Nombre de Instancia, ID Instancia, Tipo Máquina, Zona, IP Interna, Fecha Creación y Última Sincronización. En **Acciones** se abre el **Historial de Instancia** (fechas de sincronización, estado, IP interna, zona y máquina).
3. **Métricas Instancias** / **Métricas nodos del Cluster:** tarjetas y gráficos por métrica.
4. **Facturación del Instance Group** / **Facturación Nodos:** costos agrupados por recurso (Costo Total en USD y CLP). Haz clic en el ícono de ojo (**Ver detalles**) para ver el desglose por SKU.

> 🖼️ **Captura pendiente:** Detalle de un cluster GKE con nodos, métricas y facturación.
> *Archivo sugerido:* `img/gcp/37-recurso-gke.png`

### 8.3 Cloud SQL

**Menú:** Recursos → *Cloud SQL Postgres* / *Cloud SQL Mysql* / *Cloud SQL Sql Server*

1. **Información de la instancia:** Tier, **Backups**, **HA Type**, **IPs**, información de almacenamiento (tipo de disco) y de conectividad (dirección IP y SSL Mode).
2. **Métricas de la Instancia:** tarjetas y gráficos por métrica.
3. **Facturación de la Instancia:** costos por SKU (Bruto, Desc. y Neto en USD y CLP).

> 🖼️ **Captura pendiente:** Detalle de una instancia Cloud SQL PostgreSQL.
> *Archivo sugerido:* `img/gcp/38-recurso-cloud-sql.png`

---

## 9. Preguntas frecuentes

**No veo información después de cambiar los filtros.**
Recuerda presionar **Aplicar**. Los cambios no se aplican automáticamente.

**Aparece "Sin datos para mostrar".**
Amplía el **Período** o revisa que el proyecto, la región, el tag y los demás filtros correspondan a recursos existentes.

**El filtro Recurso dice "Sin recursos".**
No hay recursos que cumplan el período, el proyecto, la región y el tag elegidos. Amplía el período, elige *Todas las Regiones* o cambia el tag.

**En Recommender no aparece ninguna recomendación.**
Debes seleccionar **al menos una categoría y una prioridad** (o las opciones *Todas*) y presionar **Aplicar**.

**No puedo abrir la Vista Ejecuciones de Recomendaciones.**
Esta vista requiere el plan **Business** o **Global Access**. Consulta con el administrador de tu organización.

**No veo los botones para crear tickets en Jira o ServiceNow.**
Los botones aparecen solo si hay conectores configurados en **Perfil → Conectores** y el estado actual de la recomendación es **En ejecución**.

**Veo el aviso "Active export billing en GCP para ver costos".**
Tu cuenta de GCP no exporta la facturación, por lo que no se pueden calcular los costos de los recursos. Consulta al administrador de tu organización.

**¿Los tags locales modifican mis recursos en GCP?**
No. Los tags locales se guardan solo en Cloud Performance y sirven para mejorar tus reportes FinOps.

**¿Qué diferencia hay entre Costo Neto y Costo Bruto?**
El **Costo Bruto** es el precio de lista, antes de descuentos y créditos; el **Costo Neto** es lo que efectivamente se factura después de aplicarlos (por ejemplo, CUDs o Free Tier).

**¿Por qué las horas de los gráficos no coinciden con mi hora local?**
Los gráficos de métricas muestran las horas en **UTC**.

**¿Cómo comparto una vista con los mismos filtros?**
Copia la dirección (URL) del navegador después de aplicar los filtros y compártela con un usuario que tenga acceso.

---

## 10. Glosario

| Término | Definición |
|---|---|
| **Centro de costo** | Unidad de tu organización a la que se asigna presupuesto y gasto. |
| **CIDR Range** | Rango de direcciones IP asignado a una subnet. |
| **Cloud DNS / Zona DNS** | Servicio DNS de Google Cloud; una *zona* agrupa los registros de un dominio. |
| **Cloud Filestore** | Servicio de almacenamiento de archivos compartidos (NFS) de Google Cloud. |
| **Cloud SQL** | Bases de datos relacionales administradas (PostgreSQL, MySQL, SQL Server). |
| **Cloud Storage / Bucket** | Servicio de almacenamiento de objetos de Google Cloud; un *bucket* es un contenedor de objetos. |
| **Clase de Storage** | Nivel de almacenamiento de un bucket (STANDARD, NEARLINE, COLDLINE, ARCHIVE), de acceso más frecuente a menos frecuente. |
| **Compute Engine** | Servicio de máquinas virtuales de Google Cloud. |
| **Costo de inacción** | Ahorro no capturado por recomendaciones rechazadas o pospuestas. |
| **CUD (Committed Use Discount)** | Descuento que Google Cloud otorga a cambio de comprometer un gasto o un uso durante un período. |
| **Forecast** | Proyección estimada de gasto. |
| **GKE** | Google Kubernetes Engine; sus *nodos* son las máquinas virtuales que ejecutan los clústeres. |
| **Huérfano** | Recurso sin etiquetas, o IP/subnet sin recurso asociado. |
| **Idle** | Recurso encendido prácticamente sin uso. |
| **Infrautilizado** | Recurso con uso muy por debajo de su capacidad. |
| **Instance Group (MIG)** | Grupo de instancias Compute Engine que se administran y escalan en conjunto. |
| **IOPS** | Operaciones de entrada/salida por segundo de un disco. |
| **Label** | Etiqueta nativa de un recurso en Google Cloud (clave y valor). |
| **On-Demand** | Consumo facturado sin descuentos por compromiso. |
| **Proyecto** | Contenedor de recursos y facturación en Google Cloud. |
| **Quota** | Límite de uso de un servicio de Google Cloud. |
| **Recommender** | Servicio de Google Cloud (Active Assist) que sugiere mejoras de costo, seguridad, rendimiento, fiabilidad, gestión y sostenibilidad. |
| **Reserva de capacidad** | Hardware apartado en una zona para garantizar su disponibilidad. |
| **SKU** | Código que identifica cada concepto facturable en Google Cloud. |
| **Spot / Preemptible** | Máquina virtual de bajo costo que Google Cloud puede interrumpir. |
| **Tag local** | Etiqueta creada en Cloud Performance, sin modificar el recurso en GCP. |
| **Throughput** | Volumen de datos transferidos por segundo. |
| **UTC** | Tiempo Universal Coordinado, la referencia horaria de los gráficos. |
| **Zombie / Zombi** | Recurso que genera costo sin tener actividad. |
