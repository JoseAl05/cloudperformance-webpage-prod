# Manual de Usuario — Cloud Performance

## Módulo Microsoft Azure

> **Versión del documento:** 1.0 · **Módulo:** Microsoft Azure
> **Dirigido a:** usuarios finales de Cloud Performance que analizan costos, consumo y oportunidades de ahorro en Microsoft Azure.

---

## Índice

1. [Introducción](#1-introducción)
2. [Antes de comenzar](#2-antes-de-comenzar)
   - 2.1 [Cómo ingresar al módulo Azure](#21-cómo-ingresar-al-módulo-azure)
   - 2.2 [Acceso según tu plan](#22-acceso-según-tu-plan)
   - 2.3 [Elementos de la pantalla](#23-elementos-de-la-pantalla)
3. [Uso general de las vistas](#3-uso-general-de-las-vistas)
   - 3.1 [Panel de filtros](#31-panel-de-filtros)
   - 3.2 [Gráficos](#32-gráficos)
   - 3.3 [Tablas](#33-tablas)
   - 3.4 [Mensajes que puedes encontrar](#34-mensajes-que-puedes-encontrar)
4. [Página de Inicio de Azure](#4-página-de-inicio-de-azure)
5. [Vistas principales](#5-vistas-principales)
   - 5.1 [Tendencia Facturación](#51-tendencia-facturación)
   - 5.2 [Quotas](#52-quotas)
   - 5.3 [Deployments](#53-deployments)
   - 5.4 [Items Azure](#54-items-azure)
   - 5.5 [Vista Advisor](#55-vista-advisor)
   - 5.6 [Vista Ejecuciones de Recomendaciones](#56-vista-ejecuciones-de-recomendaciones)
   - 5.7 [Vista Saving Plans](#57-vista-saving-plans)
   - 5.8 [Presupuestos](#58-presupuestos)
   - 5.9 [Métricas FinOps](#59-métricas-finops)
   - 5.10 [Mantenedor de Etiquetas (Tags)](#510-mantenedor-de-etiquetas-tags)
6. [Consumos](#6-consumos)
7. [Funciones](#7-funciones)
8. [Recursos](#8-recursos)
9. [Preguntas frecuentes](#9-preguntas-frecuentes)
10. [Glosario](#10-glosario)

---

## 1. Introducción

El módulo **Microsoft Azure** de Cloud Performance reúne en un solo lugar la información de costos, consumo y configuración de tu infraestructura en Azure. Con él puedes:

- Revisar la **evolución de tu facturación** y detectar alzas o bajas por servicio.
- Analizar el **consumo real** de máquinas virtuales, bases de datos, nodos de Kubernetes y Application Gateways.
- Encontrar **recursos infrautilizados o sin uso** que generan gasto innecesario.
- Consultar **recomendaciones** de Azure Advisor y **recomendaciones generadas por IA**, y registrar su seguimiento.
- Administrar **presupuestos y centros de costo**, y compararlos con el gasto real.
- Gestionar **etiquetas (tags)** para mejorar la visibilidad financiera de tus recursos.

Este manual explica, vista por vista, qué información encontrarás y cómo usar los filtros y controles de cada pantalla.

> 🖼️ **Captura pendiente:** Vista general del módulo Azure con el menú lateral abierto.
> *Archivo sugerido:* `img/azure/00-vista-general.png`

---

## 2. Antes de comenzar

### 2.1 Cómo ingresar al módulo Azure

1. Inicia sesión en Cloud Performance con tu usuario y contraseña.
2. Abre el menú de usuario (tu nombre, en la esquina superior derecha) y selecciona **Perfil**.
3. En el menú lateral del perfil, haz clic en **Nubes**. Verás la pantalla **Nubes registradas**.
4. Haz clic en la tarjeta **Microsoft Azure**.
   - Si tu organización tiene **más de una cuenta de Azure**, la tarjeta muestra un selector **Cuenta:**. Primero elige la cuenta que quieres revisar (opción *Seleccione una cuenta...*) y luego haz clic en la tarjeta. Mientras no elijas una cuenta, la tarjeta se ve en gris y no permite ingresar.
5. Se abrirá la **página de Inicio** del módulo Azure.

> 🖼️ **Captura pendiente:** Pantalla "Nubes registradas" con la tarjeta Microsoft Azure y el selector de cuenta.
> *Archivo sugerido:* `img/azure/01-nubes-registradas.png`

> 💡 **Consejo:** Para cambiar de cuenta de Azure, vuelve a **Perfil → Nubes** y selecciona otra cuenta en la tarjeta de Microsoft Azure.

### 2.2 Acceso según tu plan

Lo que puedes ver en el módulo depende del plan contratado por tu organización:

| Plan | Acceso al módulo Azure |
|---|---|
| **Starter (Freemium)** / **Starter** | Solo el **Reporte de Uso Básico de Azure** en PDF (botón *Ver / Descargar Reporte PDF*). |
| **Pro** | Dashboard completo, **excepto** *Vista Advisor* y *Vista Ejecuciones de Recomendaciones*. |
| **Business** / **Global Access** | Dashboard completo, incluidas *Vista Advisor* y *Vista Ejecuciones de Recomendaciones*. |

Si intentas abrir una vista que tu plan no incluye, verás un aviso **"Función Exclusiva"** o **"Acceso Denegado"** con el nombre de tu plan actual. Para ampliar tu acceso, contacta al administrador de tu organización.

### 2.3 Elementos de la pantalla

> 🖼️ **Captura pendiente:** Pantalla del módulo con los elementos numerados (barra superior, botón de menú, menú lateral, área de contenido).
> *Archivo sugerido:* `img/azure/02-elementos-pantalla.png`

**Barra superior**

- **Logo Cloud Performance:** te lleva a la página principal.
- **Botón de tema (☀️ / 🌙):** cambia entre modo claro y modo oscuro.
- **Menú de usuario** (tus iniciales y nombre):
  - **Perfil:** abre tu perfil (desde ahí accedes a *Nubes*, *Conectores*, etc.).
  - **Cerrar sesión:** finaliza tu sesión.

**Botón de menú lateral**

Ubicado a la izquierda de la barra superior. El menú lateral viene **contraído** al ingresar; haz clic en este botón para abrirlo o cerrarlo. Contraído, el menú muestra solo íconos; si haces clic en el ícono de un grupo (por ejemplo *Consumos*), el menú se expande.

**Menú lateral**

Contiene todas las vistas del módulo Azure:

| Entrada del menú | Descripción breve |
|---|---|
| Inicio | Página de bienvenida con accesos rápidos. |
| Tendencia Facturación | Evolución del gasto de pago por uso. |
| Quotas | Mapa de calor del uso de cuotas de servicio. |
| Deployments | Historial de despliegues. |
| Items Azure | Listado de servicios, grupos de recursos y cuentas de facturación. |
| Vista Advisor | Recomendaciones de Azure Advisor y recomendaciones con IA. |
| Vista Ejecuciones de Recomendaciones | Seguimiento del estado de las recomendaciones. |
| Vista Saving Plans | Cobertura y exceso de tu Savings Plan. |
| Presupuestos | Centros de costo, presupuestos y comparación con el gasto real. |
| Métricas Finops | Indicadores FinOps generados con IA. |
| Mantenedor de Etiquetas (Tags) | Cobertura de etiquetas y asignación de tags locales y centros de costo. |
| **Consumos** (grupo) | Máquinas Virtuales, Base de Datos, Nodos, Applications Gateway. |
| **Funciones** (grupo) | Análisis especializados: horario hábil, recursos no utilizados, storage, uso de recursos, Spot, localización. |
| **Recursos** (grupo) | Detalle individual de Máquinas Virtuales, Nodos, bases de datos MySQL/PostgreSQL y Traffic Managers. |

- Los **grupos** (Consumos, Funciones, Recursos) se abren y cierran con un clic. Un punto azul junto a un grupo cerrado indica que la vista actual está dentro de ese grupo.
- La vista en la que te encuentras aparece **resaltada en azul**.
- **Buscar en el menú:** escribe parte del nombre de una vista (por ejemplo, *storage*) para filtrar el menú. No importa si usas mayúsculas o tildes. Presiona **Esc** o la **✕** para limpiar la búsqueda.

---

## 3. Uso general de las vistas

La mayoría de las vistas comparten la misma estructura: un **título**, un **panel de filtros** y, debajo, el **contenido** (tarjetas de resumen, gráficos y tablas).

### 3.1 Panel de filtros

> 🖼️ **Captura pendiente:** Panel de filtros con Periodo, Región, Suscripción, Tags, Grupo de Recursos e Instancias.
> *Archivo sugerido:* `img/azure/03-panel-filtros.png`

**Cómo usarlo**

1. Ajusta los filtros que necesites.
2. Presiona **Aplicar Filtros** (botón azul). La información se actualiza solo al presionar este botón.
3. Para volver a los valores iniciales, presiona **Limpiar Filtros** (botón gris).

**Filtros disponibles**

Cada vista muestra solo los filtros que le corresponden. Estos son todos los que puedes encontrar:

| Filtro | Cómo se usa |
|---|---|
| **Periodo** | Calendario para elegir un rango de fechas: haz clic en la fecha de inicio y luego en la fecha de término. Por defecto, desde **ayer hasta hoy**. |
| **Mes y Año** | Selector de un mes completo (se usa en vistas mensuales como *Saving Plans* y *Variación Storage*). |
| **Región** | Lista con buscador. Según la vista, permite elegir una o varias regiones. Opción *Todas las Regiones*. |
| **Suscripción** | Lista con buscador. Opción *Todas las Suscripciones*. |
| **Tags** | Dos listas: primero elige la **clave** (key) y luego el **valor** (value). Opciones *Todas las claves* / *Todos los valores*. |
| **Grupo de Recursos** | Lista con buscador. Opción *Todos los grupos*. Requiere que Región y Suscripción tengan un valor. |
| **Instancias** | Lista con buscador para elegir un recurso específico. Opción *Todas las instancias*. Requiere Región y Suscripción. En *Tendencia Facturación* se elige primero una **categoría** y luego la instancia. |
| **Métricas** | Métrica a analizar (por ejemplo, uso de CPU). |
| **Tipo de Recurso** | Tipo de recurso a analizar. |
| **Recursos** | Recurso específico (depende de la métrica y el tipo de recurso elegidos). |
| **Impacto** / **Categoría** | Filtros de la *Vista Advisor*. Opción *Ver todos*. |
| **Operaciones** | Tipo de operación de despliegue. Opción *Todas las Operaciones*. |
| **Servicios** | Servicio de Azure a analizar. Opción *Todos los Servicios*. |
| **Storage Accounts** | Una o varias cuentas de almacenamiento. Opción *Todos los Storage Accounts*. |
| **VMs**, **Loadbalancers**, **Applications Gateway**, **Traffic Managers** | Selección de los recursos específicos que quieres analizar (una o varias opciones, o *Todos*). |

> 💡 **Consejo:** Los filtros aplicados quedan guardados en la dirección (URL) de la página. Puedes guardarla en favoritos o compartirla con un colega que tenga acceso, y la vista se abrirá con los mismos filtros.

> ⚠️ **Importante:** Algunas vistas necesitan que selecciones un recurso para mostrar información (por ejemplo, *Recursos → Máquinas Virtuales* o *Recursos no utilizados*). Si no lo haces, verás un mensaje del tipo *"VM no seleccionada — Seleccione una VM..."*.

### 3.2 Gráficos

- **Pasa el cursor** sobre un punto, barra o área para ver el detalle (tooltip).
- **Haz clic en un elemento de la leyenda** para ocultar o mostrar esa serie.
- En algunos gráficos puedes **acercar (zoom)** con la rueda del mouse o con la barra deslizante inferior.
- Algunos gráficos incluyen íconos en la esquina superior derecha para **restaurar** la vista o **guardar como imagen**.
- Las horas de los gráficos se muestran en **UTC**, como se indica debajo de cada uno.

### 3.3 Tablas

- **Buscar:** usa el cuadro de búsqueda sobre la tabla para filtrar filas.
- **Ordenar:** haz clic en el encabezado de una columna (cuando muestra flechas) para ordenar de forma ascendente o descendente.
- **Paginación:** usa **Anterior** / **Siguiente** y el selector **Items por página**.
- **Tablas agrupadas:** algunas tablas agrupan filas (por fecha o por servicio). Usa la flecha de cada grupo para expandirlo o contraerlo, y el selector **Grupos por página** / **Items/grupo**.
- **Ver detalle (👁):** en varias tablas, el ícono de ojo abre una ventana con pestañas de información adicional (por ejemplo, *Información*, *Tags*, *Recomendación*).
- **Copiar:** algunos identificadores tienen un botón para copiarlos al portapapeles.

### 3.4 Mensajes que puedes encontrar

| Mensaje | Significado y qué hacer |
|---|---|
| **Cargando...** | La información se está obteniendo. Espera unos segundos. |
| **Sin datos para mostrar** | No hay información para los filtros elegidos. Amplía el periodo o cambia los filtros. |
| **Error al cargar datos** | Hubo un problema al obtener la información. Intenta nuevamente o ajusta el rango de fechas. Si persiste, contacta a soporte. |
| **... no seleccionado** | La vista necesita que elijas un recurso en los filtros. |
| **Seleccione período y presione Aplicar Filtros** | Completa los filtros y presiona *Aplicar Filtros*. |

---

## 4. Página de Inicio de Azure

**Menú:** Inicio

Es la primera pantalla al ingresar al módulo. Tiene dos secciones:

- **Módulos Recomendados:** accesos rápidos a las vistas más útiles para analizar el consumo y buscar ahorros:
  - **Recomendaciones:** botón *Ver Recomendaciones* (Vista Advisor).
  - **Facturaciones:** botones *Tendencia de Facturación* y *Cobertura (Saving Plans)*.
  - **Storage:** botones *Blob vs Storage General* y *Variación de Storage*.
  - **Spot vs Regular VMs:** botón *Comparativa Spot vs Regular*.
- **Todos los Módulos:** accesos agrupados en *Costos & Operación* y *Funciones de Análisis* (Storage, Uso de Recursos, Máquinas Virtuales y Recursos no utilizados).

Haz clic en cualquier botón para ir directamente a la vista correspondiente.

> 🖼️ **Captura pendiente:** Página de Inicio de Azure con "Módulos Recomendados" y "Todos los Módulos".
> *Archivo sugerido:* `img/azure/04-inicio.png`

---

## 5. Vistas principales

### 5.1 Tendencia Facturación

**Menú:** Tendencia Facturación
**Para qué sirve:** analizar cómo evoluciona tu gasto de pago por uso (pay-as-you-go) en el tiempo, por servicio, y detectar los servicios que más subieron o bajaron mes a mes.

**Filtros:** Periodo · Región (varias) · Suscripción · Tags · Grupo de Recursos · Instancias (categoría e instancia).

**Qué muestra**

1. **Tarjetas de resumen:**
   - **Costo Acumulado** del período seleccionado.
   - **Categorías de Servicio** con costos registrados.
   - **Ubicaciones** diferentes con datos.
2. **Gráfico de área apilada** con la evolución de los costos por servicio.
   - **Top N:** elige cuántos servicios mostrar (5, 8, 10, 15, 20 o *Todos*).
   - **Exportar:** descarga el gráfico como imagen (PNG).
3. **Información del Período:** fechas desde/hasta del análisis.
4. **Tabla de consumo histórico:** desglose mes a mes del consumo por servicio, con la **desviación** frente al período anterior. Al final incluye el **Resumen Desviaciones Mensuales**:
   - **T10-Alzas:** suma de los incrementos de costo de los servicios que subieron.
   - **T10-Bajas:** suma de las reducciones de costo de los servicios que bajaron.
   - **Neto:** balance del mes (Alzas + Bajas). Un valor negativo (en verde) indica ahorro real global.
   - Botón **Exportar a Excel** para descargar la tabla.

**Cómo usarla**

1. Elige un **Periodo** de varios meses para ver la tendencia y las desviaciones mensuales.
2. Presiona **Aplicar Filtros**.
3. Usa **Top N** para concentrarte en los servicios de mayor costo.
4. Revisa en la tabla qué servicios explican las alzas del mes y exporta a Excel si necesitas compartir el análisis.

> 🖼️ **Captura pendiente:** Tarjetas de resumen y gráfico de área apilada con el selector Top N.
> *Archivo sugerido:* `img/azure/05-tendencia-grafico.png`

> 🖼️ **Captura pendiente:** Tabla de consumo histórico con el resumen de desviaciones y el botón Exportar a Excel.
> *Archivo sugerido:* `img/azure/06-tendencia-tabla.png`

---

### 5.2 Quotas

**Menú:** Quotas
**Para qué sirve:** visualizar en un **mapa de calor** (heatmap) el uso de las cuotas de servicio de Azure y detectar las que están cerca de su límite.

**Filtros:** Periodo · Región (varias) · Suscripción.

**Qué muestra**

Un mapa de rectángulos agrupados por fecha y región. El **color** indica el porcentaje de uso: mientras más cálido (ámbar → rojo), más cerca del límite.

**Controles del gráfico**

- **Área por:** define el tamaño de cada rectángulo:
  - *Número de quotas*
  - *Max. % de uso*
- **Solo quotas con uso:** oculta las cuotas sin consumo.
- Al pasar el cursor sobre una cuota verás: **Consumo máx.**, **Uso**, **Límite**, **Región** y **Subscription**.
- Haz clic en un bloque para acercarte a ese nivel; usa los íconos superiores para **restaurar** la vista o **guardar como imagen**.

> 🖼️ **Captura pendiente:** Heatmap de quotas con el selector "Área por" y la casilla "Solo quotas con uso".
> *Archivo sugerido:* `img/azure/07-quotas.png`

---

### 5.3 Deployments

**Menú:** Deployments
**Para qué sirve:** revisar la actividad de despliegues (deployments) en tus suscripciones.

**Filtros:** Periodo · Suscripción · Grupo de Recursos · Operaciones.

**Qué muestra**

1. **Evolución de Deployments:** gráfico de línea con la cantidad de deployments únicos por fecha.
2. **Todos los deployments:** tabla agrupada por fecha con las columnas **Fecha**, **Hora**, **Operación**, **Estado**, **Grupo de Recursos**, **Resource ID** y **Usuario**.
   - Los estados posibles son: **Exitoso**, **Fallido**, **Iniciado** y **Aceptado**.

**Cómo usarla:** filtra por **Operaciones** para ver un tipo específico de despliegue y usa la tabla para identificar quién realizó cada cambio y su resultado.

> 🖼️ **Captura pendiente:** Gráfico "Evolución de Deployments" y tabla de deployments agrupada por fecha.
> *Archivo sugerido:* `img/azure/08-deployments.png`

---

### 5.4 Items Azure

**Menú:** Items Azure
**Para qué sirve:** consultar el inventario de elementos registrados en tu cuenta de Azure.

**Filtros:** esta vista no tiene filtros.

**Qué muestra** (tres tablas, cada una con su total):

1. **Lista de Servicios Registrados:** búsqueda *Filtrar por nombre recurso...*
2. **Lista de Grupos de Recursos:** búsqueda *Filtrar por nombre de grupo...*
3. **Lista de Cuentas de Facturación:** búsqueda *Filtrar por cuenta a nombre de...*

Todas las tablas permiten ordenar columnas y cambiar la cantidad de ítems por página.

> 🖼️ **Captura pendiente:** Vista Items Azure con las tres tablas.
> *Archivo sugerido:* `img/azure/09-items-azure.png`

---

### 5.5 Vista Advisor

**Menú:** Vista Advisor
**Plan requerido:** Business o Global Access.
**Para qué sirve:** revisar las recomendaciones de **Azure Advisor** y las **recomendaciones generadas por IA** de Cloud Performance, con su ahorro estimado, y registrar el estado de ejecución de cada una.

**Filtros:** Periodo · Impacto · Categoría (ambos con la opción *Ver todos*).

#### Sección "Recomendaciones" (Azure Advisor)

1. **Gráfico circular:** recomendaciones agrupadas por nivel de impacto (**Alto**, **Medio**, **Bajo**) y el total al centro.
2. **Buscador:** *Buscar por categoría o nombre...* (resalta las coincidencias).
3. **Contadores:** cantidad de categorías y de recomendaciones visibles. Botones **Expandir todo** / **Colapsar todo**.
4. **Panel izquierdo:** categorías con sus recomendaciones. Cada recomendación muestra su impacto (🟥 Alto, 🟨 Medio, 🟩 Bajo).
5. **Panel derecho:** al hacer clic en una recomendación verás su **Categoría**, **Impacto**, **Tipo de Recurso**, **Última Actualización** y la cantidad de **Recursos Afectados**.
   - Botón **Ver Detalle de Recursos:** abre una ventana con cada recurso afectado y la acción recomendada.

> 🖼️ **Captura pendiente:** Gráfico de impacto y panel de recomendaciones con el detalle a la derecha.
> *Archivo sugerido:* `img/azure/10-advisor-recomendaciones.png`

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

> 🖼️ **Captura pendiente:** Resumen Ejecutivo IA con los escenarios de ahorro.
> *Archivo sugerido:* `img/azure/11-advisor-ia-resumen.png`

> 🖼️ **Captura pendiente:** Hallazgo expandido con "Estado de ejecución" y "Matriz de Impacto".
> *Archivo sugerido:* `img/azure/12-advisor-ia-hallazgo.png`

---

### 5.6 Vista Ejecuciones de Recomendaciones

**Menú:** Vista Ejecuciones de Recomendaciones
**Plan requerido:** Business o Global Access.
**Para qué sirve:** hacer seguimiento a las recomendaciones que ya tienen un estado asignado, ver su historial, calcular el ahorro no capturado y crear tickets en tus herramientas de gestión.

**Filtros:** Periodo.

**Qué muestra**

1. **Resumen de Gestión de Recomendaciones:** Total de recomendaciones gestionadas, cantidad de **Eventos** (cambios de estado) y el conteo por estado (*En ejecución*, *Finalizada*, *Rechazada*, *Pospuesta*).
2. **Costo de Inacción:** monto de **Ahorro no capturado**, compuesto por las recomendaciones cuyo último estado es *Rechazada* o *Pospuesta*. Haz clic en una de ellas para ir directamente a su tarjeta.
3. **Recomendaciones Gestionadas:** lista (10 por página) con:
   - Buscador *Buscar por nombre, tipo o resumen...*
   - Orden por **Última actualización** o **Más cambios**.
   - Filtro **Estado** por chips.
   - En cada tarjeta: los últimos estados, **Cambios**, **Estado actual**, **Última actualización** y **Ahorro Est.**

**Detalle de una recomendación gestionada** (clic para expandir):

- Formulario para **cambiar el estado** (igual que en la Vista Advisor).
- **Tickets:** si tu organización configuró conectores en **Perfil → Conectores**, verás los botones **Crear ticket en Jira** y/o **Crear ticket en ServiceNow**.
  - Los botones aparecen solo cuando el estado actual es **En ejecución**.
  - Una vez creado, verás la clave del ticket con el enlace **Ver en Jira** / **Ver en ServiceNow**.
  - Si el ticket fue eliminado en la herramienta externa, se te avisará y podrás crear uno nuevo.
  - Si no hay conectores, verás el aviso *"No hay conectores disponibles para crear tickets."*
- Resumen de la recomendación, recurso, plan de acción y referencias.
- **Línea de Tiempo de Estados:** todos los cambios con su fecha y comentario.

> 🖼️ **Captura pendiente:** Resumen de gestión y tarjeta "Costo de Inacción".
> *Archivo sugerido:* `img/azure/13-ejecuciones-resumen.png`

> 🖼️ **Captura pendiente:** Recomendación expandida con botones de ticket y línea de tiempo.
> *Archivo sugerido:* `img/azure/14-ejecuciones-detalle.png`

---

### 5.7 Vista Saving Plans

**Menú:** Vista Saving Plans
**Para qué sirve:** evaluar si tu **Savings Plan** está bien dimensionado: cuánto cubre, cuánto consumo queda fuera (on-demand) y qué instancias generan exceso.

**Filtros:** Mes y Año.

**Qué muestra**

1. **Datos del plan:** Valor Fijo Mensual, **Compromiso por Hora** y **Moneda**.
2. **Treemap "Exceso de Consumo On-Demand por Instancia":** cada rectángulo es una instancia; pasa el cursor para ver costos, horas, cobertura y días con datos.
3. **Estado Saving Plan:** indicador **Excesivo**, **Insuficiente** o **Adecuado**. Haz clic en la tarjeta para ver el detalle: compromiso por hora, uso real por hora y diferencia.
4. **Costos:** Costo Cubierto por Saving Plan, Costo Exceso del Plan y Costo Total.
5. **Consumo:** cantidad de **Instancias** con Savings Plan, **Horas SavingsPlan** (cubiertas) y **Horas OnDemand** (exceso no cubierto).
6. **Gráfico de consumo:** compara horas cubiertas por Savings Plan y horas facturadas on-demand. Usa el selector **Instancia** para ver una sola instancia o *Todas las instancias*.
7. **Detalle de Instancias con SavingsPlan:** tabla con Categoría, Nombre Recurso, Producto, Meter Name, Unidad y Precio Unitario.

> 🖼️ **Captura pendiente:** Tarjetas del plan, treemap y tarjeta "Estado Saving Plan".
> *Archivo sugerido:* `img/azure/15-saving-plan.png`

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
> *Archivo sugerido:* `img/azure/16-presupuestos-menu.png`

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

Si ya usas etiquetas de centro de costo en tus recursos de Azure, puedes importarlas:

1. Presiona **Importar desde la nube**.
2. En **Llaves de Tags (separadas por coma)** escribe los nombres de etiqueta que usa tu organización (por defecto: `CentroCosto, CostCenter`).
3. Presiona **Escanear Nube**.
4. Revisa la lista de valores encontrados (puedes filtrarla con *Filtrar resultados por nombre...*) y marca los que quieres importar, o usa **Seleccionar todos**.
5. Presiona **Agregar Seleccionados**. Un mensaje te indicará cuántos se importaron y cuántos se omitieron porque ya existían.

**Editar o eliminar:** en la tabla, usa los íconos **Editar** o **Eliminar** de cada fila. La eliminación pide confirmación y **no se puede deshacer**. La tabla permite buscar por ID, nombre, responsable o localización.

> 🖼️ **Captura pendiente:** Ventana "Importar Centros de Costo" con resultados del escaneo.
> *Archivo sugerido:* `img/azure/17-centros-costo-importar.png`

#### 5.8.2 Presupuestos Anuales

**Crear un presupuesto anual**

1. Presiona **+ Nuevo Presupuesto**.
2. Completa:
   - **Centro de Costo** *(obligatorio)*.
   - **Año** *(obligatorio)*.
   - **Monto Anual** *(obligatorio)*.
3. *(Opcional)* Presiona **Ver desglose mensual** para repartir el monto por mes:
   1. En **Agregar mes**, elige un mes y presiona **Agregar**.
   2. En la tarjeta de cada mes ingresa **Presupuestado** *(obligatorio)* y, si corresponde, **Real** y **Forecast**.
   3. Revisa el indicador **Porcentaje Asignado**: en verde cuando la suma de meses coincide con el monto anual; se muestra una advertencia si no coincide o si lo **excede**.
4. Presiona **✓ Crear Presupuesto**.

**Editar o eliminar:** desde la tabla (búsqueda por ID, centro de costo, año o monto). Al editar no se pueden cambiar el centro de costo ni el año. Eliminar un presupuesto anual también elimina **todos sus datos mensuales** y **no se puede deshacer**.

> 🖼️ **Captura pendiente:** Formulario de presupuesto anual con el desglose mensual abierto.
> *Archivo sugerido:* `img/azure/18-presupuesto-anual.png`

#### 5.8.3 Presupuestos Mensuales

**Crear un presupuesto mensual**

1. Presiona **+ Nuevo Presupuesto**.
2. Elige el **Presupuesto Anual** (centro de costo – año).
3. Elige el **Mes**. Solo aparecen los meses que aún no tienen presupuesto.
4. Ingresa **Monto Asociado**, **Monto Real** y **Monto Forecast** *(todos obligatorios)*.
5. Revisa el recuadro **Información del Presupuesto Anual**: monto anual total, suma de montos mensuales, **diferencia disponible** (o *Excedido*) y porcentaje asignado.
6. Presiona **✓ Crear Presupuesto**.

Al editar no se pueden cambiar el presupuesto anual ni el mes.

#### 5.8.4 Costos vs Presupuesto

**Filtros:** Año.

**Qué muestra**

1. **Tarjetas globales:** Facturación Anual (Global) de la cuenta Azure, Total Presupuesto Anual, Total Presupuesto Mensual, Total Real Asignado y Total Forecast.
2. **Gráfico Costos vs Presupuesto:** presupuesto mensual, costo real, forecast y facturación real de Azure.
3. **Tabla comparativa mensual.**
4. **Detalle por centro de costo:** para cada centro, su presupuesto anual, totales mensuales, forecast y **Facturación Azure Asignada** (de los recursos vinculados a ese centro).
   - **Ver Desglose Mensual:** muestra mes a mes el presupuesto asignado, la facturación asignada y la **Diferencia** (en rojo si el gasto supera el presupuesto).

> 🖼️ **Captura pendiente:** Vista Costos vs Presupuesto con tarjetas, gráfico y desglose de un centro de costo.
> *Archivo sugerido:* `img/azure/19-costos-vs-presupuesto.png`

---

### 5.9 Métricas FinOps

**Menú:** Métricas Finops
**Para qué sirve:** obtener un diagnóstico FinOps de tu cuenta generado con IA, con puntaje global, ahorro estimado y análisis por métrica.

**Filtros:** Periodo.

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
> *Archivo sugerido:* `img/azure/20-metricas-finops.png`

---

### 5.10 Mantenedor de Etiquetas (Tags)

**Menú:** Mantenedor de Etiquetas (Tags)
**Para qué sirve:** medir qué parte de tu infraestructura está etiquetada, agregar **tags locales** (solo en Cloud Performance, sin modificar Azure) y **vincular recursos a centros de costo**.

**Filtros:** Periodo · Suscripción · Región.

**Qué muestra**

1. **Estado de cobertura:** mensaje con el porcentaje de recursos etiquetados:
   - **Excelente** (90% o más), **Requiere Atención** (50% a 89%) o **Crítico (Falta de visibilidad)** (menos de 50%).
2. **Tarjetas:** Total Recursos, **Recursos Tageados**, **Huérfanos** (sin tags) y **Cobertura**. El ícono ⓘ abre el **Detalle de Origen de Etiquetas**: *Solo en Azure*, *Solo Local* y *Mixtos*.
3. **Detalle de Inventario y Etiquetas:** tabla agrupada por servicio con las columnas Servicio Azure, Instancia / Recurso, Suscripción, Región, Etiquetas y Acciones. Puedes buscar por ID de recurso.

**Colores de las etiquetas**

| Color | Origen |
|---|---|
| ☁️ Azul — **Nube** | Tag nativo de Azure (solo lectura). |
| 💻 Morado — **Local** | Tag creado en Cloud Performance (editable). |
| 💲 Verde — **Finanzas** | Centro de costo asignado (`centro_costo`). |

**Agregar o editar un tag local**

1. En la fila del recurso, presiona **+ Tag Local**.
2. Escribe la **Etiqueta (Key)** (por ejemplo, `owner`) y el **Valor (Value)** (por ejemplo, `cloudperformance`).
3. Presiona **Guardar Cambios**.
4. Para editar un tag local existente, usa el ícono de lápiz junto a él; para eliminarlo, usa la **✕** (se pedirá confirmación).

> ⚠️ La clave `centro_costo` está reservada. Para asignar centros de costo usa el botón **$ Asignar CC**.

**Asignar centros de costo (presupuestos)**

- **A un recurso:** presiona **$ Asignar CC** en su fila.
- **A varios recursos:** marca sus casillas (o la casilla del encabezado para todos) y presiona **Asignación Masiva** en la barra inferior.

En la ventana **Vincular Presupuesto(s)**:

1. Marca uno o varios centros de costo (puedes elegir más de uno si el gasto es compartido).
2. Presiona **Aplicar**.

Si no tienes centros de costo creados, la ventana te indicará que primero debes crearlos en el **Módulo de Presupuestos** (ver [5.8.1](#581-centros-de-costo)).

> 💡 Eliminar el tag `centro_costo` de un recurso quita **todos** los centros de costo asignados. Para quitar solo uno, usa el lápiz y desmárcalo.

> 🖼️ **Captura pendiente:** Tarjetas de cobertura y tabla de inventario con etiquetas de colores.
> *Archivo sugerido:* `img/azure/21-tags-inventario.png`

> 🖼️ **Captura pendiente:** Ventana "Vincular Presupuesto(s)" con centros de costo seleccionados.
> *Archivo sugerido:* `img/azure/22-tags-asignar-cc.png`

---

## 6. Consumos

Las vistas de **Consumos** muestran el uso real de tus recursos y su costo asociado, para detectar recursos inactivos o sobredimensionados.

**Filtros comunes:** Periodo · Región (varias) · Suscripción · Tags · Grupo de Recursos · Instancias (o *Applications Gateway* en su vista).

### 6.1 Máquinas Virtuales

**Menú:** Consumos → Maquinas Virtuales

**Qué muestra**

1. **Tarjetas:** Eficiencia Global, Total VMs, **VMs Idle / Detenidas** (CPU < 4% o apagadas), **Infrautilizadas** (CPU < 10%), Costo Estimado y promedios de CPU usado, memoria usada y disco (IOPS).
2. **Gráficos** de Uso de CPU, Memoria Disponible y Disco (IOPS), con valores Promedio, Máximo y Mínimo.
3. **Tabla** con Instancia, Estado, Ubicación, CPU Promedio, IOPS (Promedio), **Clasificación** (*Idle*, *Infrautilizada* u *Óptimo*) y Costo Mes.
   - **Barras:** porcentaje relativo al máximo visible.
   - **Costo:** rojo > $50, ámbar > $20, verde ≤ $20 USD/mes.
   - El ícono 👁 abre el detalle de la VM con las pestañas **Información**, **Tags** y **Recomendación**.

> 🖼️ **Captura pendiente:** Consumo de VMs: tarjetas, gráficos y tabla con clasificación.
> *Archivo sugerido:* `img/azure/23-consumo-vm.png`

### 6.2 Base de Datos

**Menú:** Consumos → Base de Datos

1. **Tarjetas:** Eficiencia Global, Total Instancias, Instancias Idle, Infrautilizadas, Costo Total, Promedio CPU, Storage Utilizado y Promedio Memoria.
2. **Gráficos:** Uso de CPU, Utilización de Memoria y Storage Utilizado.
3. **Tabla:** Base de Datos, Región, CPU %, Memoria %, Storage % y Costo Mensual. El detalle tiene las pestañas **Información**, **Métricas** y **Recomendación**.

> 🖼️ **Captura pendiente:** Consumo de bases de datos.
> *Archivo sugerido:* `img/azure/24-consumo-bd.png`

### 6.3 Nodos

**Menú:** Consumos → Nodos

Muestra el consumo de los nodos de Kubernetes (AKS):

- Gráficos de **Uso de Cores de CPU**, **Uso de Memoria** y **Uso de IOPS de Almacenamiento**.
- Gráfico **Nodos Encendidos vs Apagados**.

> 🖼️ **Captura pendiente:** Consumo de nodos AKS.
> *Archivo sugerido:* `img/azure/25-consumo-nodos.png`

### 6.4 Applications Gateway

**Menú:** Consumos → Applications Gateway

1. **Resumen estado Application Gateway:** tarjetas de **Eficiencia Global**, **Tráfico Total Procesado** y **Conexiones Concurrentes** de los recursos seleccionados.
2. **Gráficos por métrica** (máximo y mínimo).
3. **Tabla:** Nombre Gateway, Ubicación, **Costo fijo no utilizado**, Eficiencia, Tráfico Procesado y Conexiones.

> 🖼️ **Captura pendiente:** Consumo de Application Gateways.
> *Archivo sugerido:* `img/azure/26-consumo-appgw.png`

---

## 7. Funciones

Las **Funciones** son análisis especializados para encontrar oportunidades de ahorro.

### 7.1 Consumo horario hábil vs no hábil

**Menú:** Funciones → Consumo horario hábil vs no hábil → *Maquinas Virtuales* / *Base de Datos* / *Nodos*
**Para qué sirve:** comparar el uso de tus recursos en **horario hábil** y **no hábil**, para identificar recursos que podrían apagarse o reducirse fuera del horario laboral.

**Filtros:** Periodo · Región (varias) · Suscripción · Tags · Grupo de Recursos · Instancias.

**Qué muestra**

1. **Tarjetas** con el uso promedio y máximo por métrica.
2. **Métricas ... horario hábil vs no hábil:** gráfico comparativo (*Horario Hábil* vs *Horario No Hábil*).
3. **Detalle ... horario hábil vs no hábil:** tabla con Recurso, Fecha Observación y **Tendencia Global**:
   - ☀️ *Mayor uso general en horario hábil*
   - 🌙 *Mayor uso general en horario no hábil*
   - ⚖️ *Balanceado*
   - El detalle de cada recurso tiene las pestañas **Resumen** y **Detalle Métricas**, e indica si es *Posible Infrautilizado*, *Candidato Ahorro* o *Estándar*.

> 🖼️ **Captura pendiente:** Comparativa horario hábil vs no hábil para máquinas virtuales.
> *Archivo sugerido:* `img/azure/27-horario-habil.png`

### 7.2 Recursos no utilizados

**Menú:** Funciones → Recursos no utilizados

En todas estas vistas **debes seleccionar al menos un recurso** (o la opción *Todos*) en el filtro correspondiente y presionar **Aplicar Filtros**.

| Vista | Filtros | Qué muestra |
|---|---|---|
| **VM** | Periodo, Región, Suscripción, VMs | Tarjetas (CPU y memoria promedio global, **Costo Estimado Total**, cantidad de CPUs, memoria e IPs públicas), gráficos (CPU, memoria, IOPS de disco, créditos) y tabla **Historial de VMs Infrautilizadas** con discos, interfaces de red, uso de CPU y memoria y costo estimado. |
| **VMSS** | Periodo, Región, Suscripción, VMs | Igual que VM, para conjuntos de escalado (**Historial de VMSS Infrautilizadas**). |
| **Extensiones VM** | Periodo, Región, Suscripción, VMs | Gráfico **Histórico Extensiones por tipo** y tabla de extensiones no utilizadas por VM. |
| **Loadbalancers** | Periodo, Región, Suscripción, Loadbalancers | Resumen (inutilizados, **huérfanos** e **inactivos**) y tabla histórica con backend pools, reglas de balanceo y reglas NAT. |
| **Applications Gateway** | Periodo, Región, Suscripción, Tags, Grupo de Recursos, Applications Gateway | Tarjetas (Total Infrautilizados, WAF Desactivado, WAF en Detección, Recursos Legacy V1 y detalle por SKU) y tabla con Nombre, Ubicación, SKU Actual y Estado. En **Acciones** se abre el **Diagnóstico y Ahorro**. |
| **Traffic Managers** | Periodo, Región, Suscripción, Tags, Grupo de Recursos, Traffic Managers | Tarjetas (Total Infrautilizados, Traffic View Activado/Desactivado) y tabla con acceso al **Diagnóstico y Ahorro**. |

> 💡 Los SKU **Standard V1** y **WAF V1** de Application Gateway aparecen marcados como *Legacy*: la vista recomienda planificar su migración a V2.

> 🖼️ **Captura pendiente:** Historial de VMs infrautilizadas con tarjetas de costo estimado.
> *Archivo sugerido:* `img/azure/28-no-utilizados-vm.png`

> 🖼️ **Captura pendiente:** Ventana "Diagnóstico y Ahorro" de un Application Gateway.
> *Archivo sugerido:* `img/azure/29-no-utilizados-appgw.png`

### 7.3 Blob Storage vs Storage General

**Menú:** Funciones → Blob Storage vs Storage General
**Filtros:** Periodo · Región (varias) · Suscripción · Storage Accounts (varios) · Tags.

Compara la **capacidad utilizada del Storage Account** con la de sus servicios (**File**, **Queue**, **Table** y **Blob**) mediante tarjetas y el gráfico **Capacidad: Storage Account vs Servicios**.

> 🖼️ **Captura pendiente:** Blob Storage vs Storage General.
> *Archivo sugerido:* `img/azure/30-blob-vs-storage.png`

### 7.4 Variación Storage

**Menú:** Funciones → Variación Storage
**Filtros:** Mes y Año · Región · Storage Accounts (varios).

Compara el **Mes Anterior** con el **Mes Actual**, destacando la **variación detectada** por cuenta, e incluye el gráfico **Capacidad (GB) por Servicio vs Storage Account** (Blob, Table, Queue, File).

> 🖼️ **Captura pendiente:** Variación Storage con la comparación mensual.
> *Archivo sugerido:* `img/azure/31-variacion-storage.png`

### 7.5 Top 10 uso de recursos

**Menú:** Funciones → Top 10 uso de recursos
**Filtros:** Periodo · Métricas · Tipo de Recurso.

1. **Tarjetas:** recursos Analizados, **Requieren atención**, **Muy Infrautilizados** y Promedio Uso del período.
2. **Gráficos:** *Top 10 de los Recursos más utilizados* (% Uso) y *Top 10 de los Recursos menos utilizados* (% Disponible).

> 🖼️ **Captura pendiente:** Top 10 recursos más y menos utilizados.
> *Archivo sugerido:* `img/azure/32-top10-uso.png`

### 7.6 Incremento Uso de Recursos

**Menú:** Funciones → Incremento Uso de Recursos
**Filtros:** Periodo · Métricas · Tipo de Recurso · Recursos.

Muestra el incremento (%) en el uso de un recurso respecto del mes anterior:

- **Tarjetas:** Uso Mes Anterior, Uso Mes Actual, **Variación Mensual**, Uso Fecha Anterior, Uso Última Fecha e **Incremento Diario**.
- **Gráfico:** *Evolución del Porcentaje de Uso*.

> 💡 Elige primero la **métrica** y el **tipo de recurso**: la lista de **Recursos** muestra las opciones que corresponden a esa combinación.

> 🖼️ **Captura pendiente:** Incremento de uso de un recurso.
> *Archivo sugerido:* `img/azure/33-incremento-uso.png`

### 7.7 Spot vs Regular VMs

**Menú:** Funciones → Spot vs Regular VMs
**Filtros:** Periodo · Región (varias) · Suscripción.

1. **Tarjetas:** Cantidad Total VMs, Cantidad Total Spot VMs, **Porcentaje de Spot VMs** y relación Spot vs Total.
2. **Gráfico** de evolución *Total VMs* vs *Total Spot VMs*.
3. **Historial Spot vs Máquinas Virtuales:** tabla agrupada por fecha de observación (Nombre VM, Localización, Tipo VM).

> 🖼️ **Captura pendiente:** Spot vs Regular VMs.
> *Archivo sugerido:* `img/azure/34-spot-vs-regular.png`

### 7.8 Promedio de uso por localización

**Menú:** Funciones → Promedio de uso por localización
**Filtros:** Periodo · Región (varias) · Suscripción · Servicios.

1. Selecciona un **Servicio** (obligatorio) y presiona **Aplicar Filtros**.
2. **Información General:** total de recursos, métricas y marcas de tiempo analizadas, y **Promedios por localización**.
3. **Métricas por Región:** promedios por métrica y región. Haz clic en el botón ⓘ de una celda para abrir su detalle (promedio y rango de fechas).

> 🖼️ **Captura pendiente:** Métricas por región con el detalle abierto.
> *Archivo sugerido:* `img/azure/35-promedio-localizacion.png`

---

## 8. Recursos

Las vistas de **Recursos** muestran el detalle completo de **un recurso individual**: sus datos, su rendimiento y su facturación.

**Cómo usarlas**

1. Ajusta **Periodo**, **Suscripción**, **Región** y, si quieres, **Grupo de Recursos**.
2. En **Instancias**, elige el recurso que quieres revisar.
3. Presiona **Aplicar Filtros**.

Mientras no elijas un recurso verás un mensaje como *"Selecciona una máquina virtual en los filtros para ver su detalle."*

### 8.1 Máquinas Virtuales y Nodos

**Menú:** Recursos → Maquinas Virtuales / Nodos

1. **Información del recurso:** Ubicación, Fecha Creación, Grupo de Recursos, ID de Suscripción, tamaño y **Discos asignados**. Puedes abrir las **observaciones de metadatos a lo largo del tiempo**.
2. **Evolución de Rendimiento:** gráficos de Consumo CPU, Memoria Disponible e IOPS Disco (Total, Usado, No Usado, Máx, Mín, Último), y **Deployments** del recurso.
3. **Facturación del Recurso:**
   - Gráfico de **costo acumulado** (pago por uso y fijo).
   - Propiedades de facturación: Tipo de Cargo, Proveedor, Servicio Consumido, Centro de Costos, Identificador de Producto, Localización y Nombre del Recurso.
   - **Costos medidas no cuantificables.**
   - Tabla por **SKU** con montos **Bruto**, **Descuento** y **Neto (USD)**, y el **Total Neto USD**.

> 🖼️ **Captura pendiente:** Detalle de una máquina virtual (información, rendimiento y facturación).
> *Archivo sugerido:* `img/azure/36-recurso-vm.png`

### 8.2 Base de Datos MySQL y PostgreSQL

**Menú:** Recursos → Base de Datos MySQL / Base de Datos PostgreSQL

1. **Información** de la base de datos.
2. **Evolución de Rendimiento:** métricas en el tiempo.
3. **Desglose de Costos:** tabla de facturación por **Fecha** y **SKU**, con buscador *Buscar por SKU o fecha...*

> 🖼️ **Captura pendiente:** Detalle de una base de datos PostgreSQL.
> *Archivo sugerido:* `img/azure/37-recurso-bd.png`

### 8.3 Traffic Managers

**Menú:** Recursos → Traffic Managers
**Filtros:** Periodo · Región · Suscripción · Traffic Managers (uno) · Tags · Grupo de Recursos.

1. **Estado del Perfil** y alertas como **Recurso Infrautilizado** o **Riesgo de Disponibilidad**.
2. **Tabla histórica:** Fecha de Sincronización, Estado Perfil, Estado Monitor, Endpoints Activos, Método Enrutamiento y Consultas Promedio.
3. **Ver endpoints:** abre la lista de endpoints con Nombre, Destino (Target), Ubicación, Estado Config, Estado Monitor y Peso.

> 🖼️ **Captura pendiente:** Detalle de un Traffic Manager con la ventana de endpoints.
> *Archivo sugerido:* `img/azure/38-recurso-traffic-manager.png`

---

## 9. Preguntas frecuentes

**No veo información después de cambiar los filtros.**
Recuerda presionar **Aplicar Filtros**. Los cambios no se aplican automáticamente.

**Aparece "Sin datos para mostrar".**
Amplía el **Periodo** o revisa que la región, la suscripción y los demás filtros correspondan a recursos existentes.

**El filtro "Grupo de Recursos" o "Instancias" aparece deshabilitado.**
Estos filtros dependen de **Región** y **Suscripción**. Asegúrate de que ambos tengan un valor (puede ser *Todas*).

**No puedo abrir la Vista Advisor ni la Vista Ejecuciones de Recomendaciones.**
Estas vistas requieren el plan **Business** o **Global Access**. Consulta con el administrador de tu organización.

**No veo los botones para crear tickets en Jira o ServiceNow.**
Los botones aparecen solo si hay conectores configurados en **Perfil → Conectores** y el estado actual de la recomendación es **En ejecución**.

**¿Los tags locales modifican mis recursos en Azure?**
No. Los tags locales se guardan solo en Cloud Performance y sirven para mejorar tus reportes FinOps.

**¿Por qué las horas de los gráficos no coinciden con mi hora local?**
Los gráficos muestran las horas en **UTC**.

**¿Cómo comparto una vista con los mismos filtros?**
Copia la dirección (URL) del navegador después de aplicar los filtros y compártela con un usuario que tenga acceso.

---

## 10. Glosario

| Término | Definición |
|---|---|
| **AKS** | Azure Kubernetes Service; los *Nodos* son las máquinas que ejecutan tus clústeres. |
| **Centro de costo** | Unidad de tu organización a la que se asigna presupuesto y gasto. |
| **Costo de inacción** | Ahorro no capturado por recomendaciones rechazadas o pospuestas. |
| **Forecast** | Proyección estimada de gasto. |
| **Huérfano** | Recurso sin etiquetas, o sin asociación útil (por ejemplo, un balanceador sin backend). |
| **Idle** | Recurso encendido prácticamente sin uso. |
| **Infrautilizado** | Recurso con uso muy por debajo de su capacidad. |
| **IOPS** | Operaciones de entrada/salida por segundo de un disco. |
| **On-Demand / Pago por uso** | Consumo facturado sin descuentos por compromiso. |
| **Quota** | Límite de uso de un servicio de Azure en una región y suscripción. |
| **Savings Plan** | Compromiso de gasto por hora con Azure a cambio de un descuento. |
| **SKU** | Variante o nivel de precio de un servicio de Azure. |
| **Spot VM** | Máquina virtual de bajo costo que Azure puede interrumpir. |
| **Tag local** | Etiqueta creada en Cloud Performance, sin modificar el recurso en Azure. |
| **UTC** | Tiempo Universal Coordinado, la referencia horaria de los gráficos. |
| **VMSS** | Virtual Machine Scale Set: conjunto de máquinas virtuales que escala automáticamente. |
| **WAF** | Web Application Firewall de un Application Gateway. |
