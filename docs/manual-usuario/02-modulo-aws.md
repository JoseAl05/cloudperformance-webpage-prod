# Manual de Usuario — Cloud Performance

## Módulo Amazon Web Services (AWS)

> **Versión del documento:** 1.0 · **Módulo:** Amazon Web Services (AWS)
> **Dirigido a:** usuarios finales de Cloud Performance que analizan costos, consumo y oportunidades de ahorro en AWS.

---

## Índice

1. [Introducción](#1-introducción)
2. [Antes de comenzar](#2-antes-de-comenzar)
   - 2.1 [Cómo ingresar al módulo AWS](#21-cómo-ingresar-al-módulo-aws)
   - 2.2 [Acceso según tu plan](#22-acceso-según-tu-plan)
   - 2.3 [Elementos de la pantalla](#23-elementos-de-la-pantalla)
3. [Uso general de las vistas](#3-uso-general-de-las-vistas)
   - 3.1 [Panel de filtros](#31-panel-de-filtros)
   - 3.2 [Gráficos](#32-gráficos)
   - 3.3 [Tablas](#33-tablas)
   - 3.4 [Mensajes que puedes encontrar](#34-mensajes-que-puedes-encontrar)
4. [Página de Inicio de AWS](#4-página-de-inicio-de-aws)
5. [Vistas principales](#5-vistas-principales)
   - 5.1 [Tendencia Facturación](#51-tendencia-facturación)
   - 5.2 [Quotas](#52-quotas)
   - 5.3 [Eventos](#53-eventos)
   - 5.4 [Vista Advisor](#54-vista-advisor)
   - 5.5 [Vista Ejecuciones de Recomendaciones](#55-vista-ejecuciones-de-recomendaciones)
   - 5.6 [Vista Saving Plans](#56-vista-saving-plans)
   - 5.7 [Presupuestos](#57-presupuestos)
   - 5.8 [Métricas FinOps](#58-métricas-finops)
   - 5.9 [Mantenedor de Etiquetas (Tags)](#59-mantenedor-de-etiquetas-tags)
6. [Consumos](#6-consumos)
7. [Funciones](#7-funciones)
8. [Recursos](#8-recursos)
9. [Preguntas frecuentes](#9-preguntas-frecuentes)
10. [Glosario](#10-glosario)

---

## 1. Introducción

El módulo **Amazon Web Services (AWS)** de Cloud Performance reúne en un solo lugar la información de costos, consumo y configuración de tu infraestructura en AWS. Con él puedes:

- Revisar la **evolución de tu facturación** y detectar alzas o bajas por servicio.
- Identificar **qué regiones, sistemas operativos, tipos de instancia o recursos** concentran tu gasto.
- Analizar el **consumo real** de instancias EC2, Auto Scaling Groups, nodos EKS, bases de datos RDS, NAT Gateways y Load Balancers.
- Encontrar **recursos infrautilizados o sin uso** (EC2, volúmenes EBS, NAT Gateways, Load Balancers, zonas de Route 53) que generan gasto innecesario.
- Consultar las recomendaciones de **AWS Trusted Advisor** y las **recomendaciones generadas por IA**, y registrar su seguimiento.
- Evaluar la eficiencia de tus **Savings Plans**.
- Administrar **presupuestos y centros de costo**, y compararlos con el gasto real.
- Gestionar **etiquetas (tags)** para mejorar la visibilidad financiera de tus recursos.

Este manual explica, vista por vista, qué información encontrarás y cómo usar los filtros y controles de cada pantalla.

> 🖼️ **Captura pendiente:** Vista general del módulo AWS con el menú lateral abierto.
> *Archivo sugerido:* `img/aws/00-vista-general.png`

---

## 2. Antes de comenzar

### 2.1 Cómo ingresar al módulo AWS

1. Inicia sesión en Cloud Performance con tu usuario y contraseña.
2. Abre el menú de usuario (tu nombre, en la esquina superior derecha) y selecciona **Perfil**.
3. En el menú lateral del perfil, haz clic en **Nubes**. Verás la pantalla **Nubes registradas**.
4. Haz clic en la tarjeta **Amazon Web Services**.
   - Si tu organización tiene **más de una cuenta de AWS**, la tarjeta muestra un selector **Cuenta:**. Primero elige la cuenta que quieres revisar (opción *Seleccione una cuenta...*) y luego haz clic en la tarjeta. Mientras no elijas una cuenta, la tarjeta se ve en gris y no permite ingresar.
5. Se abrirá la **página de Inicio** del módulo AWS.

> 🖼️ **Captura pendiente:** Pantalla "Nubes registradas" con la tarjeta Amazon Web Services y el selector de cuenta.
> *Archivo sugerido:* `img/aws/01-nubes-registradas.png`

> 💡 **Consejo:** Para cambiar de cuenta de AWS, vuelve a **Perfil → Nubes** y selecciona otra cuenta en la tarjeta de Amazon Web Services.

### 2.2 Acceso según tu plan

Lo que puedes ver en el módulo depende del plan contratado por tu organización:

| Plan | Acceso al módulo AWS |
|---|---|
| **Starter (Freemium)** / **Starter** | Solo el **Reporte de Uso Básico de AWS** en PDF (botón *Ver / Descargar Reporte PDF*). |
| **Pro** | Dashboard completo, **excepto** *Vista Advisor* y *Vista Ejecuciones de Recomendaciones*. |
| **Business** / **Global Access** | Dashboard completo, incluidas *Vista Advisor* y *Vista Ejecuciones de Recomendaciones*. |

Si intentas abrir una vista que tu plan no incluye, verás un aviso **"Función Exclusiva"** o **"Acceso Denegado a Amazon Web Services"** con el nombre de tu plan actual. Para ampliar tu acceso, contacta al administrador de tu organización.

### 2.3 Elementos de la pantalla

> 🖼️ **Captura pendiente:** Pantalla del módulo con los elementos numerados (barra superior, botón de menú, menú lateral, área de contenido).
> *Archivo sugerido:* `img/aws/02-elementos-pantalla.png`

**Barra superior**

- **Logo Cloud Performance:** te lleva a la página principal.
- **Botón de tema (☀️ / 🌙):** cambia entre modo claro y modo oscuro.
- **Menú de usuario** (tus iniciales y nombre):
  - **Perfil:** abre tu perfil (desde ahí accedes a *Nubes*, *Conectores*, etc.).
  - **Cerrar sesión:** finaliza tu sesión.

**Botón de menú lateral**

Ubicado a la izquierda de la barra superior. El menú lateral viene **contraído** al ingresar; haz clic en este botón para abrirlo o cerrarlo. Contraído, el menú muestra solo íconos; si haces clic en el ícono de un grupo (por ejemplo *Consumos*), el menú se expande.

**Menú lateral**

Contiene todas las vistas del módulo AWS:

| Entrada del menú | Descripción breve |
|---|---|
| Inicio | Página de bienvenida con accesos rápidos. |
| Tendencia Facturación | Evolución del gasto por servicio. |
| Quotas | Mapa de calor del uso de cuotas de servicio. |
| Eventos | Actividad registrada en tu cuenta (quién hizo qué y cuándo). |
| Vista Advisor | Recomendaciones de AWS Trusted Advisor y recomendaciones con IA. |
| Vista Ejecuciones de Recomendaciones | Seguimiento del estado de las recomendaciones. |
| Vista Saving Plans | Eficiencia y cobertura de tus Savings Plans. |
| Presupuestos | Centros de costo, presupuestos y comparación con el gasto real. |
| Métricas Finops | Indicadores FinOps generados con IA. |
| Mantenedor de Etiquetas (Tags) | Cobertura de etiquetas y asignación de tags locales y centros de costo. |
| **Consumos** (grupo) | Instancias EC2, Auto Scaling Groups, nodos EKS, RDS (PostgreSQL, MySQL, Oracle, SQL Server, MariaDB), NAT Gateways y Load Balancers V2. |
| **Funciones** (grupo) | Análisis especializados: Top Facturaciones, horario hábil vs no hábil, consumo por localización, recursos no utilizados, Spot vs VM, Top S3 Buckets y variación de consumo. |
| **Recursos** (grupo) | Detalle individual de instancias EC2, Auto Scaling Groups e instancias RDS. |

- Los **grupos** (Consumos, Funciones, Recursos) y sus subgrupos (por ejemplo *Top Facturaciones* o *Recursos no utilizados*) se abren y cierran con un clic. Un punto azul junto a un grupo cerrado indica que la vista actual está dentro de ese grupo.
- La vista en la que te encuentras aparece **resaltada en azul**.
- **Buscar en el menú:** escribe parte del nombre de una vista (por ejemplo, *rds*) para filtrar el menú. No importa si usas mayúsculas o tildes. Presiona **Esc** o la **✕** para limpiar la búsqueda.

---

## 3. Uso general de las vistas

La mayoría de las vistas comparten la misma estructura: un **título**, un **panel de filtros** y, debajo, el **contenido** (tarjetas de resumen, gráficos y tablas).

### 3.1 Panel de filtros

> 🖼️ **Captura pendiente:** Panel de filtros con Período, Región, Tags e Instancia.
> *Archivo sugerido:* `img/aws/03-panel-filtros.png`

**Cómo usarlo**

1. Ajusta los filtros que necesites.
2. Presiona **Aplicar Filtros** (botón azul). La información se actualiza solo al presionar este botón.
3. Para volver a los valores iniciales, presiona **Limpiar Filtros** (botón gris).

**Filtros disponibles**

Cada vista muestra solo los filtros que le corresponden. Estos son todos los que puedes encontrar:

| Filtro | Cómo se usa |
|---|---|
| **Período** | Calendario para elegir un rango de fechas: haz clic en la fecha de inicio y luego en la fecha de término. Por defecto, desde **ayer hasta hoy**. En *Variación consumo de recursos* se elige un **mes y año** completos. |
| **Región** | Lista con buscador. Según la vista, permite elegir una o varias regiones. Opción *Todas las Regiones*. |
| **Tags** | Dos listas: primero elige la **clave** (key) y luego el **valor** (value). Opciones *Todas las claves* / *Todos los valores*. Al cambiar el tag, se limpia la selección de instancias. |
| **Instancia** | Lista con buscador para elegir uno o varios recursos. Opción *Todas las Instancias*. La lista depende del período, la región y el tag elegidos. |
| **Autoscaling** | Primero elige el **Auto Scaling Group** y luego sus **instancias**. Opción *Todos los Autoscaling*. |
| **Cluster EKS** | Tres niveles: **Cluster EKS** → **Auto Scaling Group** del cluster → **Instancia**. Opción *Todos los Clusters*. |
| **Servicio** | Uno o varios servicios de AWS. Opción *Todos los Servicios*. |
| **Eventos** | Uno o varios tipos de evento. Opción *Todos los eventos*. |
| **Categorías** / **Status** | Filtros de la *Vista Advisor*. Opciones *Todas las categorías* / *Todos los status*. |
| **Métrica** / **Métrica RDS** | Grupos de métricas a analizar (vistas de consumo por localización). Opción *Todos los Grupos de Métricas*. |
| **S3 Buckets** | Uno o varios buckets. Opción *Todos los Buckets*. |
| **Nat Gateways**, **Nat Gateways Infrautilizados**, **Loadbalancers**, **Hosted Zones** | Selección de los recursos específicos que quieres analizar (una o varias opciones, o *Todos*). |
| **Servicio** / **Metrica** / **Recurso** | Filtros encadenados de *Variación consumo de recursos*: el servicio define las métricas disponibles, y la métrica define los recursos. |

> 💡 **Consejo:** Los filtros aplicados quedan guardados en la dirección (URL) de la página. Puedes guardarla en favoritos o compartirla con un colega que tenga acceso, y la vista se abrirá con los mismos filtros.

> ⚠️ **Importante:** Muchas vistas necesitan que selecciones al menos un recurso (o la opción *Todos*) para mostrar información. Si no lo haces, verás un mensaje del tipo *"No se ha seleccionado ninguna instancia."*. Si un filtro muestra *"Sin instancias en la región/criterios seleccionados"*, amplía el período o cambia la región o el tag.

### 3.2 Gráficos

- **Pasa el cursor** sobre un punto, barra o área para ver el detalle (tooltip).
- **Haz clic en un elemento de la leyenda** para ocultar o mostrar esa serie.
- En algunos gráficos puedes **acercar (zoom)** con la rueda del mouse o con la barra deslizante.
- Algunos gráficos incluyen íconos en la esquina superior derecha para **restaurar** la vista o **guardar como imagen**.
- Las horas de los gráficos de métricas se muestran en **UTC**, como se indica debajo de cada uno.

### 3.3 Tablas

- **Buscar:** usa el cuadro de búsqueda sobre la tabla para filtrar filas.
- **Ordenar:** haz clic en el encabezado de una columna (cuando muestra flechas) para ordenar de forma ascendente o descendente.
- **Paginación:** usa **Anterior** / **Siguiente** y el selector **Items por página**.
- **Tablas agrupadas:** algunas tablas agrupan filas (por fecha o por servicio). Usa la flecha de cada grupo para expandirlo o contraerlo.
- **Ver detalle (👁):** en varias tablas, el ícono de ojo abre una ventana con pestañas de información adicional (por ejemplo, *Información*, *Métricas*, *Tags*, *Recomendación*).
- **Copiar / Ver en consola:** algunas filas tienen un menú de acciones para copiar un identificador o abrir el recurso en la consola de AWS.

### 3.4 Mensajes que puedes encontrar

| Mensaje | Significado y qué hacer |
|---|---|
| **Cargando...** | La información se está obteniendo. Espera unos segundos. |
| **Sin datos para mostrar** | No hay información para los filtros elegidos. Amplía el período o cambia los filtros. |
| **Error al cargar datos** | Hubo un problema al obtener la información. Intenta nuevamente o ajusta el rango de fechas. Si persiste, contacta a soporte. |
| **No se ha seleccionado ningún/ninguna ...** | La vista necesita que elijas un recurso en los filtros. |
| **Selecciona al menos una métrica para visualizar los datos** | Elige uno o más grupos de métricas en el filtro *Métrica*. |

---

## 4. Página de Inicio de AWS

**Menú:** Inicio

Es la primera pantalla al ingresar al módulo (**Dashboard AWS**). Tiene dos secciones:

- **Módulos Recomendados:** accesos rápidos a las vistas más útiles para analizar el consumo y buscar ahorros:
  - **Tendencia de Facturación:** botón *Ver Tendencias*.
  - **Recomendaciones:** botón *Ver Recomendaciones* (Vista Advisor).
  - **Ahorro y Optimización:** botones *Cobertura (Saving Plans)* y *Spot vs VM*.
  - **Storage:** botones *TOP S3 Buckets* y *EBS No utilizados*.
- **Todos los Módulos:** accesos agrupados en:
  - **Costos & Actividad:** Tendencia de Facturación, Cuotas de Servicio, Eventos, Recomendaciones y Saving Plans.
  - **Funciones de Análisis:** Top de Facturación, Consumo hábil vs no hábil, Consumo por región, Storage y Posibilidad de ahorro.
  - **Recursos por Tipo:** Instancias EC2, Auto Scaling Groups y las instancias RDS de cada motor.

Haz clic en cualquier botón para ir directamente a la vista correspondiente.

> 🖼️ **Captura pendiente:** Página de Inicio de AWS con "Módulos Recomendados" y "Todos los Módulos".
> *Archivo sugerido:* `img/aws/04-inicio.png`

---

## 5. Vistas principales

### 5.1 Tendencia Facturación

**Menú:** Tendencia Facturación
**Para qué sirve:** analizar cómo evoluciona tu gasto en el tiempo, por servicio, y detectar los servicios que más subieron o bajaron mes a mes.

**Filtros:** Período · Región (varias) · Servicio · Tags.

**Qué muestra**

1. **Top Servicios:** selector en la parte superior para elegir cuántos servicios mostrar (Top 5, 8, 10, 15, 20 o *Todos*, que es la opción inicial).
2. **Tarjetas de resumen:**
   - **Costo Acumulado** de los servicios visibles.
   - **Servicios** mostrados. El ícono junto al número abre la lista de servicios.
   - **Regiones** involucradas. El ícono junto al número abre la lista de regiones.
3. **Distribución de Costos por Servicio:** gráfico con la evolución de los costos de cada servicio. Incluye el total del período y un botón **Exportar** para descargar el gráfico como imagen.
4. **Información del Período:** fechas desde/hasta, cantidad de regiones y de servicios.
5. **Análisis Histórico y Desviaciones:** desglose mes a mes del consumo por servicio, con la **desviación** frente al período anterior. Al final incluye el **Resumen Desviaciones Mensuales**:
   - **T10-Alzas:** suma de los incrementos de costo de los servicios que subieron.
   - **T10-Bajas:** suma de las reducciones de costo de los servicios que bajaron.
   - **Neto:** balance del mes (Alzas + Bajas). Un valor negativo (en verde) indica ahorro real global.
   - Botón **Exportar a Excel** para descargar la tabla.

**Cómo usarla**

1. Elige un **Período** de varios meses para ver la tendencia y las desviaciones mensuales.
2. Si quieres, limita el análisis a ciertas **Regiones**, **Servicios** o a un **Tag**.
3. Presiona **Aplicar Filtros**.
4. Usa **Top Servicios** para concentrarte en los servicios de mayor costo.
5. Revisa en la tabla qué servicios explican las alzas del mes y exporta a Excel si necesitas compartir el análisis.

> 🖼️ **Captura pendiente:** Tarjetas de resumen y gráfico "Distribución de Costos por Servicio" con el selector Top Servicios.
> *Archivo sugerido:* `img/aws/05-tendencia-grafico.png`

> 🖼️ **Captura pendiente:** Tabla "Análisis Histórico y Desviaciones" con el resumen de desviaciones y el botón Exportar a Excel.
> *Archivo sugerido:* `img/aws/06-tendencia-tabla.png`

---

### 5.2 Quotas

**Menú:** Quotas
**Para qué sirve:** visualizar en un **mapa de calor** (heatmap) el uso de las cuotas de servicio de AWS y detectar las que están cerca de su límite.

**Filtros:** Período.

**Qué muestra**

Un mapa de rectángulos agrupados. El **color** indica el porcentaje de uso: mientras más cálido, más cerca del límite (*alto uso*).

**Controles del gráfico**

- **Area por:** define el tamaño de cada rectángulo:
  - *Max. % de uso* (opción inicial)
  - *Numero de quotas*
- **Solo quotas con uso:** viene activada; desmárcala para ver también las cuotas sin consumo.
- Al pasar el cursor sobre una cuota verás: **Servicio**, **Uso**, **Valor cuota** y **Recursos**.
- Haz clic en un bloque para acercarte a ese nivel; usa los íconos superiores para **restaurar** la vista o **guardar como imagen**.

> 🖼️ **Captura pendiente:** Heatmap de quotas con el selector "Area por" y la casilla "Solo quotas con uso".
> *Archivo sugerido:* `img/aws/07-quotas.png`

---

### 5.3 Eventos

**Menú:** Eventos
**Para qué sirve:** revisar la actividad registrada en tu cuenta de AWS: qué eventos ocurrieron, cuándo, en qué servicio, quién los realizó y qué recursos afectaron.

**Filtros:** Período · Región · Eventos (uno o varios tipos, o *Todos los eventos*).

> ⚠️ Debes elegir al menos un tipo de evento. Si no lo haces, verás el mensaje *"No se ha seleccionado ningun evento."*.

**Qué muestra**

1. **Tarjetas:** **Cantidad de Eventos** del período y la cantidad de eventos de cada tipo seleccionado.
2. **Eventos AWS — Eventos por tipo (distribución):** gráfico con la proporción de cada tipo de evento.
3. **Detalle Instancias — Detalle recursos desplegados por Eventos de AWS:** tabla con las columnas **Evento**, **Fecha/Hora**, **Servicio**, **Usuario** y **Recursos**.
   - En **Recursos**, haz clic en **Ver recursos** para abrir la ventana **Recursos asociados al evento**. Desde ahí puedes **copiar** el nombre de cada recurso o **abrir en AWS**.
   - Si un evento no tiene recursos asociados, verás la etiqueta *Sin Recursos*.

> 🖼️ **Captura pendiente:** Tarjetas de eventos, gráfico de distribución y tabla de detalle.
> *Archivo sugerido:* `img/aws/08-eventos.png`

---

### 5.4 Vista Advisor

**Menú:** Vista Advisor
**Plan requerido:** Business o Global Access.
**Para qué sirve:** revisar las verificaciones de **AWS Trusted Advisor** y las **recomendaciones generadas por IA** de Cloud Performance, con su ahorro estimado, y registrar el estado de ejecución de cada una.

**Filtros:** Período · Región · Categorías (una o varias) · Status (uno o varios: *OK*, *WARNING*, *ERROR*, *NOT_AVAILABLE*).

> ⚠️ Para ver la sección *Recomendaciones* debes elegir **al menos una categoría y un status**. Elige primero las **Categorías** y después el **Status**: al cambiar de categoría, la selección de status se limpia.

#### Sección "Recomendaciones" (AWS Trusted Advisor)

1. **Gráfico circular doble:** el anillo **interior** agrupa las verificaciones por **estado** (*OK*, *Warning*, *Error*, *No disponible*) y el **exterior** por **categoría**. El total aparece al centro.
2. **Buscador:** *Buscar por categoría o nombre…* (resalta las coincidencias).
3. **Contadores:** cantidad de categorías y de recomendaciones visibles. Botones **Expandir todo** / **Colapsar todo**.
4. **Panel izquierdo:** categorías con sus recomendaciones y la fecha de la última sincronización de cada una.
5. **Panel derecho:** al hacer clic en una recomendación verás:
   - La **descripción** de la verificación y la fecha de **Última sincronización**.
   - **Detalle Recomendación:** **Estado** (*OK*, *Warning* o *Error*), **Ahorro mensual estimado** y **% ahorro estimado**.
   - **Resumen de recursos:** cantidad de recursos **Procesados**, **Marcados**, **Ignorados** y **Suprimidos**.
   - **Recursos marcados:** tabla con **Región**, **Estado**, **ResourceId**, **Suprimido** y **Metadata**.
   - Botón **Ver historial (N)** (si hay más de una sincronización): abre el **Historial de sincronización**, con el estado, el ahorro y los recursos marcados en cada fecha. La más reciente aparece como *Último*.

> 🖼️ **Captura pendiente:** Gráfico circular de estados y categorías, y panel de recomendaciones con el detalle a la derecha.
> *Archivo sugerido:* `img/aws/09-advisor-recomendaciones.png`

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

> 💡 La sección *Recomendaciones IA* solo depende del **Período**; los filtros de región, categoría y status no la afectan.

> 🖼️ **Captura pendiente:** Resumen Ejecutivo IA con los escenarios de ahorro.
> *Archivo sugerido:* `img/aws/10-advisor-ia-resumen.png`

> 🖼️ **Captura pendiente:** Hallazgo expandido con "Estado de ejecución" y "Matriz de Impacto".
> *Archivo sugerido:* `img/aws/11-advisor-ia-hallazgo.png`

---

### 5.5 Vista Ejecuciones de Recomendaciones

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

- Formulario para **cambiar el estado** (igual que en la Vista Advisor).
- **Tickets:** si tu organización configuró conectores en **Perfil → Conectores**, verás los botones **Crear ticket en Jira** y/o **Crear ticket en ServiceNow**.
  - Los botones aparecen solo cuando el estado actual es **En ejecución**.
  - Una vez creado, verás la clave del ticket con el enlace **Ver en Jira** / **Ver en ServiceNow**.
  - Si el ticket fue eliminado en la herramienta externa, se te avisará y podrás crear uno nuevo.
  - Si no hay conectores, verás el aviso *"No hay conectores disponibles para crear tickets."*
- Resumen de la recomendación, recurso, plan de acción y referencias.
- **Línea de Tiempo de Estados:** todos los cambios con su fecha y comentario.

> 🖼️ **Captura pendiente:** Resumen de gestión y tarjeta "Costo de Inacción".
> *Archivo sugerido:* `img/aws/12-ejecuciones-resumen.png`

> 🖼️ **Captura pendiente:** Recomendación expandida con botones de ticket y línea de tiempo.
> *Archivo sugerido:* `img/aws/13-ejecuciones-detalle.png`

---

### 5.6 Vista Saving Plans

**Menú:** Vista Saving Plans
**Para qué sirve:** monitorear la eficiencia, el uso real y el desperdicio de tus **Savings Plans** para optimizar tus costos de cómputo.

**Filtros:** Período.

**Qué muestra**

1. **Resumen Global de la Cuenta (Todos los planes):** **Planes Retirados**, **Planes Registrados** y **Planes Activos**.
2. **Inspeccionar Savings Plan Específico:** dos selectores que cambian toda la información inferior:
   - **Tipo de Plan:** *Todos los tipos* o un tipo específico (por ejemplo *Compute*, *EC2 Instance*, *SageMaker*).
   - **Savings Plan:** el plan activo que quieres revisar. Al abrir la vista se selecciona automáticamente el primero.
3. **Estado del Plan Seleccionado:**
   - **Óptimo:** aprovechas casi todo tu compromiso y el gasto extra está bajo control.
   - **Excesivo / Subutilizado:** pagas por capacidad que no usas; se muestra el **Dinero Desperdiciado en el período**.
   - **Baja Cobertura:** tu consumo supera ampliamente el plan; conviene evaluar un Savings Plan adicional.
   - **Sin Datos:** no hay información suficiente para el período.
   - Haz clic en la tarjeta (**Ver análisis detallado**) para abrir el **Análisis de Eficiencia del Plan**: Compromiso Total, Uso Real Aprovechado y, según el caso, Dinero Desperdiciado, Gasto fuera del plan o Capacidad no utilizada.
4. **Resumen de Inversión del Plan:** gráfico con el compromiso del plan frente a la capacidad no utilizada, el uso cubierto y el gasto extra (On-Demand). Presiona **Ver Servicios** para ver el **Desglose de Consumo por Servicio**, y **Volver al Resumen** para regresar.
5. **Tarjetas de costo:** **Compromiso** (por hora), **Costo Diario** (promedio por día) y **Costo Mensual** (estimado).
6. **Consumo Diario por Servicio vs Compromiso:** gráfico diario con la línea del límite del plan.
7. **Detalle instancias EC2 cubiertas** (solo en planes de cómputo): tabla con InstanceId, Precio Unitario, Unidad de Medida, Tipo de Instancia y Servicio, junto con las tarjetas **Instancias EC2** (registradas en el plan) y **Costo EC2** (gasto por hora cubierto).

Si no tienes planes activos en el período, verás el aviso **"No hay Savings Plans disponibles"** con el período consultado.

> 🖼️ **Captura pendiente:** Resumen global, selectores de plan y tarjeta "Estado del Plan Seleccionado".
> *Archivo sugerido:* `img/aws/14-saving-plan-estado.png`

> 🖼️ **Captura pendiente:** Gráficos "Resumen de Inversión del Plan" y "Consumo Diario por Servicio vs Compromiso".
> *Archivo sugerido:* `img/aws/15-saving-plan-graficos.png`

---

### 5.7 Presupuestos

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
> *Archivo sugerido:* `img/aws/16-presupuestos-menu.png`

#### 5.7.1 Centros de Costo

**Crear un centro de costo**

1. Presiona **+ Nuevo Centro**.
2. Completa el formulario:
   - **ID Centro** *(obligatorio)*: número identificador, por ejemplo `1001`. No se puede modificar después.
   - **Nombre Centro** *(obligatorio)*: por ejemplo *Departamento de IT*.
   - **Responsable**: por ejemplo *Juan Pérez*.
   - **Localización**: por ejemplo *Santiago, Piso 3*.
3. Presiona **✓ Crear Centro**.

**Importar centros de costo desde la nube**

Si ya usas etiquetas de centro de costo en tus recursos de AWS, puedes importarlas:

1. Presiona **Importar desde la nube**.
2. En **Llaves de Tags (separadas por coma)** escribe los nombres de etiqueta que usa tu organización (por defecto: `CentroCosto, CostCenter`).
3. Presiona **Escanear Nube**.
4. Revisa la lista de valores encontrados (puedes filtrarla con *Filtrar resultados por nombre...*) y marca los que quieres importar, o usa **Seleccionar todos**.
5. Presiona **Agregar Seleccionados**. Un mensaje te indicará cuántos se importaron y cuántos se omitieron porque ya existían.

**Editar o eliminar:** en la tabla, usa los íconos **Editar** o **Eliminar** de cada fila. La eliminación pide confirmación y **no se puede deshacer**. La tabla permite buscar por ID, nombre, responsable o localización.

> 🖼️ **Captura pendiente:** Ventana "Importar Centros de Costo" con resultados del escaneo.
> *Archivo sugerido:* `img/aws/17-centros-costo-importar.png`

#### 5.7.2 Presupuestos Anuales

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
> *Archivo sugerido:* `img/aws/18-presupuesto-anual.png`

#### 5.7.3 Presupuestos Mensuales

**Crear un presupuesto mensual**

1. Presiona **+ Nuevo Presupuesto**.
2. Elige el **Presupuesto Anual** (centro de costo – año).
3. Elige el **Mes**. Solo aparecen los meses que aún no tienen presupuesto; si todos lo tienen, verás *"Todos los meses ya tienen presupuesto asignado"*.
4. Ingresa **Monto Asociado**, **Monto Real** y **Monto Forecast** *(todos obligatorios)*.
5. Revisa el recuadro con el monto anual total, la **Suma de Montos Mensuales**, la **Diferencia Disponible** (o *Excedido*) y el **Porcentaje Asignado**.
6. Presiona **✓ Crear Presupuesto**.

Al editar no se pueden cambiar el presupuesto anual ni el mes. La tabla permite buscar por centro de costo, mes, año o montos.

#### 5.7.4 Costos vs Presupuesto

**Filtros:** Año.

**Qué muestra**

1. **Tarjetas globales:** **Facturación Anual (Global)** (consumo total de la cuenta AWS), **Total Presupuesto Anual**, **Total Presupuesto Mensual**, **Total Real Asignado** y **Total Forecast**.
2. **Gráfico Costos vs Presupuesto:** presupuesto mensual, costo real, forecast y facturación real de AWS.
3. **Tabla comparativa mensual** con la fila **TOTAL**.
4. **Detalle por centro de costo:** para cada centro, su **Presupuesto Anual Asignado** y los totales **Ppto. Mensual Total**, **Real Manual Total**, **Forecast Total**, **Recursos Vinculados** y **Facturación AWS Asignada** (de los recursos vinculados a ese centro).
   - **Ver Desglose Mensual:** muestra el **Rendimiento Mes a Mes (Recursos Asignados)**: Ppto. Asignado, Facturación Asignada y **Diferencia** (en rojo si el gasto supera el presupuesto). Presiona **Ocultar Detalle** para cerrarlo.

> 🖼️ **Captura pendiente:** Vista Costos vs Presupuesto con tarjetas, gráfico y desglose de un centro de costo.
> *Archivo sugerido:* `img/aws/19-costos-vs-presupuesto.png`

---

### 5.8 Métricas FinOps

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
> *Archivo sugerido:* `img/aws/20-metricas-finops.png`

---

### 5.9 Mantenedor de Etiquetas (Tags)

**Menú:** Mantenedor de Etiquetas (Tags)
**Para qué sirve:** medir qué parte de tu infraestructura está etiquetada, agregar **tags locales** (solo en Cloud Performance, sin modificar AWS) y **vincular recursos a centros de costo**.

**Filtros:** Período · Servicio.

**Qué muestra**

1. **Estado de cobertura:** mensaje con el porcentaje de recursos etiquetados:
   - **Excelente** (90% o más), **Requiere Atención** (50% a 89%) o **Crítico (Falta de visibilidad)** (menos de 50%).
2. **Tarjetas:** Total Recursos, **Recursos Tageados**, **Huérfanos (Sin Tags)** y **Cobertura**. El ícono ⓘ abre el **Detalle de Origen de Etiquetas**: *Solo en AWS*, *Solo Local* y *Mixtos*.
3. **Tabla de inventario:** agrupada por servicio, con las columnas Servicio AWS, ID del Recurso, Etiquetas y Acción. Puedes buscar con *Buscar por ID de recurso...*

**Colores de las etiquetas**

| Color | Origen |
|---|---|
| ☁️ Azul — **Nube** | Tag nativo de AWS (solo lectura). |
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

En la ventana **Vincular Presupuesto(s) AWS**:

1. Marca uno o varios centros de costo (puedes elegir más de uno si el gasto es compartido).
2. Presiona **Aplicar**.

Si no tienes centros de costo creados, la ventana te indicará que primero debes crearlos en el **módulo de presupuesto** (ver [5.7.1](#571-centros-de-costo)).

> 💡 Eliminar el tag `centro_costo` de un recurso quita **todos** los centros de costo asignados. Para quitar solo uno, usa el lápiz y desmárcalo.

> ℹ️ Si ves el aviso **"Configuración Requerida en AWS"**, tu cuenta de AWS necesita un ajuste para que Cloud Performance pueda leer las etiquetas. Sigue la indicación del mensaje o contacta al administrador de tu organización.

> 🖼️ **Captura pendiente:** Tarjetas de cobertura y tabla de inventario con etiquetas de colores.
> *Archivo sugerido:* `img/aws/21-tags-inventario.png`

> 🖼️ **Captura pendiente:** Ventana "Vincular Presupuesto(s) AWS" con centros de costo seleccionados.
> *Archivo sugerido:* `img/aws/22-tags-asignar-cc.png`

---

## 6. Consumos

Las vistas de **Consumos** muestran el uso real de tus recursos y su costo asociado, para detectar recursos inactivos o sobredimensionados. Todas comparten la misma estructura: **tarjetas de resumen**, **gráficos por métrica** (Promedio, Máximo y Mínimo) y una **tabla de detalle** con clasificación.

**Clasificación de los recursos en las tablas**

| Etiqueta | Significado |
|---|---|
| 🟥 **Idle** | Recurso encendido sin actividad. |
| 🟧 **Infrautilizada** | Recurso con sobre-provisionamiento (usa mucho menos de lo que tiene asignado). |
| 🟨 **Storage ineficiente** | *(Solo RDS)* almacenamiento asignado muy por encima del usado. |
| 🟩 **Óptimo** | Recurso dentro de parámetros normales de eficiencia. |

**Leyenda de las tablas**

- **Barras:** porcentaje relativo al máximo visible en la tabla.
- **Costo:** rojo > $50, ámbar > $20, verde ≤ $20 USD/mes (en RDS: rojo > $20, ámbar > $10, verde ≤ $10 USD).
- La columna **Historial** (ícono 👁) abre el detalle del recurso con las pestañas **Información**, **Métricas**, **Tags** (o **Target Groups** en Load Balancers) y **Recomendación**.

### 6.1 Instancias EC2, Auto Scaling Groups y Nodos EKS

**Menú:** Consumos → *Instancias EC2* / *Instancias EC2 AutoscalingGroups* / *Instancias EC2 Nodos EKS*

**Filtros**

| Vista | Filtros |
|---|---|
| Instancias EC2 | Período · Región · Tags · Instancia (varias) |
| Instancias EC2 AutoscalingGroups | Período · Región · Tags · Autoscaling (grupos e instancias, varios) |
| Instancias EC2 Nodos EKS | Período · Región · Tags · Cluster EKS (cluster, Auto Scaling Group e instancias, varios) |

**Qué muestra**

1. **Tarjetas:** Eficiencia Global, Total Instancias, **Instancias Idle**, **Infrautilizadas**, Costo Total, Promedio CPU, Promedio Créditos CPU Usados y Disponibles, y Promedio Entrada/Salida de Red.
2. **Gráficos:** Créditos Disponibles, Créditos Usados, Uso de CPU, Red: Tráfico Entrante, Red: Tráfico Saliente y Check de Estado Fallido.
3. **Detalle de Instancias EC2:** tabla con Instancia, Estado, Región, CPU Promedio, Red (In/Out), Clasificación, Costo Mes, Sync Time e Historial.

> 🖼️ **Captura pendiente:** Consumo de instancias EC2: tarjetas, gráficos y tabla con clasificación.
> *Archivo sugerido:* `img/aws/23-consumo-ec2.png`

### 6.2 Instancias RDS

**Menú:** Consumos → *Instancias RDS Postgresql* / *Mysql* / *Oracle* / *SQL Server* / *MariaDB*

**Filtros:** Período · Región · Tags · Instancia (varias).

1. **Tarjetas:** Eficiencia Global, Total Instancias, **Instancias Idle** (sin conexiones activas promedio), **Infrautilizadas** (CPU promedio < 5% y máximo < 15%), Costo Total, Promedio CPU, Promedio Conexiones, Storage Utilizado y Promedio Memoria Libre.
2. **Gráficos:** Uso de CPU, Uso y Saldo de Créditos de CPU, Memoria Disponible, Conexiones a la Base de Datos, Storage Libre, Lectura IOPS y Escritura IOPS.
3. **Detalle de Instancias RDS:** tabla con Instancia, Engine, Región, CPU Promedio, Conexiones, Storage %, Costo y Sync Time.

> 🖼️ **Captura pendiente:** Consumo de instancias RDS.
> *Archivo sugerido:* `img/aws/24-consumo-rds.png`

### 6.3 Nat Gateways

**Menú:** Consumos → Nat Gateways
**Filtros:** Período · Región · Tags · Instancia (varias).

1. **Tarjetas:** Eficiencia Global, Total Nat Gateways, Nat Gateways Idle, Infrautilizadas, Costo Total, Promedio Conexiones Activas y flujo promedio de datos.
2. **Gráficos:** Conexiones Activas, Datos Enviados a Internet, Datos Entregados al Destino y Error de asignación de puertos.
3. **Tabla:** Nat Gateway, Región, Tipo de Conexión, Conexiones Activas Promedio, Datos Enviados / Datos Entregados, Errores de asignación de puertos, Clasificación, Costo Mes y Sync Time. La pestaña **Recomendación** del detalle sugiere, por ejemplo, **eliminar el recurso** o **evaluar VPC Endpoints** cuando el tráfico es mínimo.

> 🖼️ **Captura pendiente:** Consumo de Nat Gateways.
> *Archivo sugerido:* `img/aws/25-consumo-nat.png`

### 6.4 Loadbalancers V2

**Menú:** Consumos → Loadbalancers V2
**Filtros:** Período · Región · Instancia (varias).

1. **Tarjetas:** Eficiencia Global (basada en LCUs consumidos), Total Load Balancers, Load Balancers Idle, Infrautilizadas, Costo Total y promedios de conexiones activas, nuevas conexiones, datos procesados, LCUs, requests, errores HTTP 5XX, TCP Client Resets y evaluaciones de reglas.
2. **Gráficos** por cada una de esas métricas.
3. **Tabla:** Load Balancer, Región, Conexiones Activas Promedio, LCUs Consumidos Promedio, Datos Procesados, Errores HTTP 5XX Promedio, Clasificación, Costo Mes y Sync Time. El detalle incluye la pestaña **Target Groups** y recomendaciones como **Eliminar Recurso** o **Evaluar Consolidación**.

> 🖼️ **Captura pendiente:** Consumo de Load Balancers V2.
> *Archivo sugerido:* `img/aws/26-consumo-elb.png`

---

## 7. Funciones

Las **Funciones** son análisis especializados para entender tu gasto y encontrar oportunidades de ahorro.

### 7.1 Top Facturaciones

**Menú:** Funciones → Top Facturaciones → *por Región* / *por SO* / *por Tipo de Instancia* / *por Familia de Instancias* / *por Tipo de Compra* / *por Tipo de Cobro* / *por Recursos*
**Para qué sirve:** descubrir qué regiones, sistemas operativos, tipos o familias de instancia, modalidades de compra, tipos de cobro o recursos impulsan tu gasto.

**Filtros:** Período.

**Qué muestra** (todas las vistas tienen la misma estructura)

1. **Gráfico de barras** con el costo de cada categoría, desglosado por servicio.
   - **Mostrar Top:** 3, 5, 10 (opción inicial) o *Ver todo*.
   - **Tipo de Costo:** *Costo Neto* (opción inicial) o *Costo Bruto*.
   - **Haz clic en una barra** para ver el detalle de esa categoría por servicio. Presiona **← Volver** para regresar a la vista general.
2. **Tarjetas:** **Costo Neto/Bruto Total (USD)**, la categoría **con mayor costo** y la categoría **con menor costo** de facturación.
3. **Tabla de detalle** agrupada por fecha, con la categoría, el **Servicio**, el **Costo Bruto** y el **Costo Neto**. Los consumos sin costo aparecen como *Gratis*.

> 🖼️ **Captura pendiente:** Facturación por Región con el gráfico, los selectores y las tarjetas.
> *Archivo sugerido:* `img/aws/27-top-facturacion.png`

### 7.2 Top Recursos

**Menú:** Funciones → Top Facturaciones → Top Recursos
**Filtros:** esta vista no tiene filtros; muestra la **última captura de datos registrada**.

1. Tres gráficos con la distribución de recursos únicos activos: **Top por Región**, **Top por Tipo de Recurso** y **Top por Servicio de AWS**. Cada uno tiene un selector **Top 5 / Top 10 / Todos** y el **Total de elementos activos**.
2. **Historial de facturación por Recurso:** tabla con el detalle de facturación de servicios agrupados por recurso (Servicio, Recurso, Fecha, Costo Bruto y Costo Neto).

> 🖼️ **Captura pendiente:** Top Recursos con los tres gráficos.
> *Archivo sugerido:* `img/aws/28-top-recursos.png`

### 7.3 Consumo horario hábil vs no hábil

**Menú:** Funciones → Consumo horario hábil vs no hábil → *Instancias EC2* / *AutoscalingGroups* / *Nodos EKS* / *RDS Postgresql* / *Mysql* / *SQL Server* / *Oracle* / *MariaDB*
**Para qué sirve:** comparar el uso de tus recursos en **horario hábil** y **no hábil**, para identificar recursos que podrían apagarse o reducirse fuera del horario laboral.

**Filtros:** Período · Región (varias) · Tags · Instancia (varias).

**Qué muestra**

1. **Tarjetas** con el uso promedio y máximo por métrica.
2. **Gráfico comparativo** *Horario Hábil* vs *Horario No Hábil* por métrica.
3. **Tabla de detalle** con Recurso, Fecha Observación y **Tendencia Global**:
   - ☀️ *Mayor uso general en horario hábil*
   - 🌙 *Mayor uso general en horario no hábil*
   - ⚖️ *Balanceado*
   - El detalle de cada recurso tiene las pestañas **Resumen** y **Detalle Métricas**, e indica si es *Posible Infrautilizado*, *Candidato Ahorro* o *Estándar*.

> 🖼️ **Captura pendiente:** Comparativa horario hábil vs no hábil para instancias EC2.
> *Archivo sugerido:* `img/aws/29-horario-habil.png`

### 7.4 Consumo por Localización

**Menú:** Funciones → Consumo por Localización → *Instancias EC2* / *RDS Postgresql* / *Mysql* / *SQL Server* / *Oracle* / *MariaDB*
**Filtros:** Período · Región (varias) · Tags · Instancia (varias) · Métrica (EC2) o Métrica RDS (grupos de métricas).

1. Elige al menos un **grupo de métricas** y presiona **Aplicar Filtros**. Si no lo haces, verás *"Selecciona al menos una métrica para visualizar los datos"*.
2. La vista muestra los **promedios por métrica y región** en el rango seleccionado.
3. Haz clic en el botón de una celda (*Click para ver detalle*) para abrir su detalle: **Promedio**, **Muestras**, **Desde** y **Hasta**.

> 🖼️ **Captura pendiente:** Promedios por región con el detalle de una métrica abierto.
> *Archivo sugerido:* `img/aws/30-consumo-localizacion.png`

### 7.5 Recursos no utilizados

**Menú:** Funciones → Recursos no utilizados

En todas estas vistas **debes seleccionar al menos un recurso** (o la opción *Todos*) en el filtro correspondiente y presionar **Aplicar Filtros**.

| Vista | Filtros | Qué muestra |
|---|---|---|
| **Instancias EC2** / **AutoscalingGroups** / **Nodos EKS** | Período, Región (varias), Tags, Instancia | Tarjetas (**Total costo instancias infrautilizadas**, instancias con CPU < 10%, CPU promedio global, Status Check Failed, créditos de CPU y red) y tabla **Métricas Comparativas** con Gasto Periodo, CPU, Net (I/O), créditos y Status Check. El detalle tiene las pestañas **Diagnóstico**, **Recursos** e **Historial**. |
| **Vólumenes EBS** | Período, Región, Tags, Instancia (volúmenes) | Tarjetas (**Total costo volúmenes no utilizados**, cantidad de volúmenes, Idle Time, operaciones y bytes de lectura/escritura, Burst Balance y Queue Length) y tabla **Métricas Comparativas** por volumen. El detalle incluye la información del volumen y sus **Attachments**. |
| **Nat Gateways** | Período, Región, Tags, Nat Gateways Infrautilizados | Tarjetas (NAT Gateways Infrautilizados, Conexiones Promedio, Total MBs Out) y tabla con Conexiones (vs Global), Tráfico (vs Total) y Diagnóstico. En **Acciones** se abre el detalle con las pestañas **Diagnóstico**, **Dependencias** (instancias EC2 y RDS que podrían verse afectadas) e **Historial**, incluido el **Análisis de Impacto si se elimina**. |
| **Loadbalancers V2** | Período, Región, Loadbalancers | Tarjetas (Estado del Diagnóstico, Total Loadbalancers, Application ELBs, Network ELBs, Consumo LCU, peticiones y conexiones) y tabla **Load Balancers Infrautilizados** comparada con el promedio del grupo. El detalle tiene las pestañas **Historial Métricas** e **Historial Recursos**. |
| **Route 53** | Período, Región, Hosted Zones | Tarjetas (Hosted Zones Sin Uso, **Ahorro Mensual Estimado**, Zonas Infrautilizadas: solo con registros NS y SOA) y tabla con Nombre de Zona, Hosted Zone ID, **Ahorro Potencial** y Estado. El detalle tiene las pestañas **Detalle Actual y Registros** e **Historial**. |

> 💡 En las tarjetas de resumen, el ícono **Ver lista** (o *Ver lista de recursos*) abre la lista de recursos detectados.

> 🖼️ **Captura pendiente:** Instancias EC2 infrautilizadas con tarjetas de costo y tabla comparativa.
> *Archivo sugerido:* `img/aws/31-no-utilizados-ec2.png`

> 🖼️ **Captura pendiente:** Detalle de un NAT Gateway infrautilizado con la pestaña "Dependencias".
> *Archivo sugerido:* `img/aws/32-no-utilizados-nat.png`

### 7.6 Spot vs Vm

**Menú:** Funciones → Spot vs Vm
**Filtros:** Período.

1. **Tarjetas:** Cantidad Total VMs, Cantidad Total Spot VMs, **Porcentaje de Spot VMs** y relación Spot vs Total (según la última captura registrada).
2. **Gráfico** de evolución *Total Instancias EC2* vs *Total Instancias Spot*.
3. **Historial Spot vs Máquinas Virtuales:** tabla agrupada por fecha de sincronización (Instance ID, Tipo, ASG, EKS, AutoScaling Group y Cluster).

> 🖼️ **Captura pendiente:** Spot vs VM.
> *Archivo sugerido:* `img/aws/33-spot-vs-vm.png`

### 7.7 Top S3 Buckets

**Menú:** Funciones → Top S3 Buckets
**Filtros:** Período · Región · S3 Buckets (uno o varios, o *Todos los Buckets*).

Selecciona al menos un bucket para ver la información; si no, verás *"Selecciona un bucket en el filtro superior para visualizar las métricas y gráficos."*

1. **Tarjetas:** Total Tamaño Objetos (GB), Total S3 Buckets, Total S3 Objetos y Clases de Almacenamiento.
2. **Gráficos:** *Top Buckets por Número de Objetos*, *Top Buckets por Tamaño* y *Top Buckets por Clase de Almacenamiento* (cada uno con selector Top 5 / Top 10 / Todos), y las tendencias de **cantidad de objetos** y **tamaño**.
3. **Versionamiento de S3 Buckets:** estado de versionamiento y **MFA Delete** por bucket, e **Historial de Versionamiento** con los cambios detectados.
4. **Reglas de Ciclo de Vida:** transiciones, expiraciones y limpieza de cargas multiparte por bucket, e **Historial de Ciclo de Vida**. Usa el selector **Sincronización** para elegir la fecha a revisar.

> 🖼️ **Captura pendiente:** Top S3 Buckets con tarjetas y gráficos.
> *Archivo sugerido:* `img/aws/34-top-s3.png`

### 7.8 Variación consumo de recursos

**Menú:** Funciones → Variación consumo de recursos
**Filtros:** Período (mes y año) · Región · Servicio · Metrica · Recurso.

1. Elige el **mes y año**, la **Región** y el **Servicio**.
2. Elige la **Metrica** (las opciones dependen del servicio) y el **Recurso** (depende de la métrica).
3. Presiona **Aplicar Filtros**. Mientras falten datos verás *"Debe seleccionar recurso y aplicar filtros."*
4. La vista muestra las tarjetas **Mes anterior**, **Mes actual** y **Variación**, y el gráfico **Comparación de Métricas** entre ambos meses.

> 🖼️ **Captura pendiente:** Variación de consumo de un recurso entre el mes anterior y el actual.
> *Archivo sugerido:* `img/aws/35-variacion-consumo.png`

---

## 8. Recursos

Las vistas de **Recursos** muestran el detalle completo de **un recurso individual**: sus datos, su rendimiento y su actividad.

**Cómo usarlas**

1. Ajusta **Período**, **Región** y, si quieres, **Tags**.
2. Elige el recurso que quieres revisar (**Instancia** o **Autoscaling**).
3. Presiona **Aplicar Filtros**.

Mientras no elijas un recurso verás un mensaje como *"No se ha seleccionado ninguna instancia."*

### 8.1 Instancias EC2

**Menú:** Recursos → Instancias EC2

1. **Información de la instancia:** tipo, **Volumenes Attached**, **Interfaces**, **IPs Públicas**, e información de EBS e interfaces. Presiona **Ver Historial** para ver cómo cambió la instancia en cada fecha de observación.
2. **Resumen de métricas:** Créditos Disponibles, Créditos Utilizados, Porcentaje Créditos Utilizados, **Eficiencia Instancia**, Promedio Uso de CPU y Promedio Entrada/Salida de Red.
3. **Métricas de la Instancia:** gráficos de **Consumo y Balance de Créditos**, **% Uso de CPU** y **Entrada y Salida de Red** (valores Max, Min y Último).
4. **Eventos de la Instancia:** tabla con Nombre Evento, Fuente del Evento, Fecha Evento, Usuario, Recursos Asociados y **Acciones** (*Copiar ID de Evento*, *Ver en consola de AWS*).

> 🖼️ **Captura pendiente:** Detalle de una instancia EC2 (información, métricas y eventos).
> *Archivo sugerido:* `img/aws/36-recurso-ec2.png`

### 8.2 Auto Scaling groups

**Menú:** Recursos → Auto Scaling groups

1. **Información del grupo:** capacidad total, **Max Instancias**, **Capacidad**, **Tags** y la información del **Launch Template**. Presiona **Ver Historial** para ver los cambios por fecha.
2. **Resumen:** **Fecha de Creación** y **Días Funcionamiento**.
3. **Historial de instancias del grupo:** tabla con Instance ID, Tipo de Instancia, Estado del Ciclo de Vida, Estado de Salud, Fecha Observación y datos del Launch Template. En **Acciones**: *Copiar Instance ID* o *Ver en consola EC2*.
4. **Gráficos:** **Estados Instancias** (en espera, en servicio, totales y pendientes) y **Configuración vs Límites** (capacidad deseada frente al tamaño máximo y mínimo del grupo).
5. **Actividad reciente del grupo:** tabla de eventos del Auto Scaling Group.

> 🖼️ **Captura pendiente:** Detalle de un Auto Scaling Group con gráficos de estados y límites.
> *Archivo sugerido:* `img/aws/37-recurso-asg.png`

### 8.3 Instancias RDS

**Menú:** Recursos → *Instancias RDS Postgresql* / *Mysql* / *SQL Server* / *Oracle* / *MariaDB*

1. **Información de la instancia:** clase, **Storage**, **Zonas AZ**, **Engine**, tags y subnets. Presiona **Ver Historial** para ver los cambios por fecha.
2. **Resumen de métricas:** Créditos Disponibles, Créditos Utilizados, Porcentaje de Uso Créditos y **Eficiencia Instancia**.
3. **Gráficos:** Consumo y Balance de Créditos de CPU (Burstable), % Uso de CPU (o Uso vs No Uso de Cores de CPU), Conexiones a Base de Datos, Memoria Disponible, Operaciones Lectura/Escritura (IOPS/seg) y Storage Disponible.
4. **Actividad reciente de la instancia:** tabla de eventos con Nombre Evento, Fuente del Evento, Fecha Evento, Usuario, Recursos RDS y **Acciones** (*Copiar ID de Evento*, *Ver en consola RDS*).

> 🖼️ **Captura pendiente:** Detalle de una instancia RDS PostgreSQL.
> *Archivo sugerido:* `img/aws/38-recurso-rds.png`

---

## 9. Preguntas frecuentes

**No veo información después de cambiar los filtros.**
Recuerda presionar **Aplicar Filtros**. Los cambios no se aplican automáticamente.

**Aparece "Sin datos para mostrar".**
Amplía el **Período** o revisa que la región, el tag y los demás filtros correspondan a recursos existentes.

**El filtro de instancias dice "Sin instancias en la región/criterios seleccionados".**
No hay recursos que cumplan el período, la región y el tag elegidos. Amplía el período, elige *Todas las Regiones* o cambia el tag.

**En la Vista Advisor no aparecen recomendaciones de Trusted Advisor.**
Debes seleccionar **al menos una categoría y un status**. Elige primero las categorías y después el status.

**No puedo abrir la Vista Advisor ni la Vista Ejecuciones de Recomendaciones.**
Estas vistas requieren el plan **Business** o **Global Access**. Consulta con el administrador de tu organización.

**No veo los botones para crear tickets en Jira o ServiceNow.**
Los botones aparecen solo si hay conectores configurados en **Perfil → Conectores** y el estado actual de la recomendación es **En ejecución**.

**¿Los tags locales modifican mis recursos en AWS?**
No. Los tags locales se guardan solo en Cloud Performance y sirven para mejorar tus reportes FinOps.

**¿Qué diferencia hay entre Costo Neto y Costo Bruto?**
El **Costo Bruto** es el monto antes de descuentos y créditos; el **Costo Neto** es lo que efectivamente se factura después de aplicarlos.

**¿Por qué las horas de los gráficos no coinciden con mi hora local?**
Los gráficos de métricas muestran las horas en **UTC**.

**¿Cómo comparto una vista con los mismos filtros?**
Copia la dirección (URL) del navegador después de aplicar los filtros y compártela con un usuario que tenga acceso.

---

## 10. Glosario

| Término | Definición |
|---|---|
| **ALB / NLB** | Application Load Balancer (HTTP/HTTPS, capa 7) y Network Load Balancer (TCP/UDP, capa 4). |
| **Auto Scaling Group (ASG)** | Grupo de instancias EC2 que aumenta o disminuye automáticamente según la demanda. |
| **Centro de costo** | Unidad de tu organización a la que se asigna presupuesto y gasto. |
| **Costo de inacción** | Ahorro no capturado por recomendaciones rechazadas o pospuestas. |
| **Créditos de CPU** | Saldo que acumulan las instancias *burstable* (familias T) para superar temporalmente su rendimiento base. |
| **EBS** | Elastic Block Store: volúmenes de disco que se conectan a instancias EC2. |
| **EC2** | Elastic Compute Cloud: servicio de máquinas virtuales de AWS. |
| **EKS** | Elastic Kubernetes Service; sus *nodos* son las instancias EC2 que ejecutan los clústeres. |
| **Forecast** | Proyección estimada de gasto. |
| **Hosted Zone** | Zona DNS administrada en Route 53. |
| **Huérfano** | Recurso sin etiquetas. |
| **Idle** | Recurso encendido prácticamente sin uso. |
| **Infrautilizado** | Recurso con uso muy por debajo de su capacidad. |
| **IOPS** | Operaciones de entrada/salida por segundo de un disco. |
| **LCU** | Load Balancer Capacity Unit: unidad con la que AWS cobra el uso variable de un Load Balancer. |
| **NAT Gateway** | Servicio que permite a recursos privados salir a Internet. |
| **On-Demand** | Consumo facturado sin descuentos por compromiso. |
| **Quota** | Límite de uso de un servicio de AWS en una región. |
| **RDS** | Relational Database Service: bases de datos administradas (PostgreSQL, MySQL, Oracle, SQL Server, MariaDB). |
| **Route 53** | Servicio DNS de AWS. |
| **S3 / Bucket** | Servicio de almacenamiento de objetos de AWS; un *bucket* es un contenedor de objetos. |
| **Savings Plan** | Compromiso de gasto por hora con AWS a cambio de un descuento. |
| **Spot** | Instancia de bajo costo que AWS puede interrumpir. |
| **Tag local** | Etiqueta creada en Cloud Performance, sin modificar el recurso en AWS. |
| **Trusted Advisor** | Servicio de AWS que revisa tu cuenta y sugiere mejoras de costo, seguridad, rendimiento y tolerancia a fallos. |
| **UTC** | Tiempo Universal Coordinado, la referencia horaria de los gráficos. |
