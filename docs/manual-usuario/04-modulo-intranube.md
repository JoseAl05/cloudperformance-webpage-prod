# Manual de Usuario — Cloud Performance

## Módulo Comparación Intranube

> **Versión del documento:** 1.0 · **Módulo:** Comparación Intranube
> **Dirigido a:** usuarios finales de Cloud Performance cuya organización tiene varios tenants de Azure, varias cuentas de AWS o varios proyectos de GCP, y que necesitan compararlos entre sí.

---

## Índice

1. [Introducción](#1-introducción)
2. [Antes de comenzar](#2-antes-de-comenzar)
   - 2.1 [Requisitos para usar el módulo](#21-requisitos-para-usar-el-módulo)
   - 2.2 [Cómo ingresar al módulo](#22-cómo-ingresar-al-módulo)
3. [Configurar una comparación](#3-configurar-una-comparación)
   - 3.1 [Paso 1: Selector de Origen](#31-paso-1-selector-de-origen)
   - 3.2 [Paso 2: Selección de entornos](#32-paso-2-selección-de-entornos)
   - 3.3 [Paso 3: Selector de Servicio](#33-paso-3-selector-de-servicio)
   - 3.4 [Volver a la configuración](#34-volver-a-la-configuración)
4. [Uso general de los reportes](#4-uso-general-de-los-reportes)
   - 4.1 [Configuración del Reporte (filtros)](#41-configuración-del-reporte-filtros)
   - 4.2 [Cómo se identifica cada entorno](#42-cómo-se-identifica-cada-entorno)
   - 4.3 [Gráficos](#43-gráficos)
   - 4.4 [Tablas](#44-tablas)
   - 4.5 [Mensajes que puedes encontrar](#45-mensajes-que-puedes-encontrar)
5. [Reporte de Facturación](#5-reporte-de-facturación)
6. [Reporte de Cómputo](#6-reporte-de-cómputo)
7. [Reporte de Storage y Discos](#7-reporte-de-storage-y-discos)
8. [Preguntas frecuentes](#8-preguntas-frecuentes)
9. [Glosario](#9-glosario)

---

## 1. Introducción

El módulo **Comparación Intranube** de Cloud Performance te permite comparar, lado a lado, **dos o más entornos de una misma nube**:

- **Azure:** dos o más **tenants**.
- **AWS:** dos o más **cuentas**.
- **GCP:** dos o más **proyectos**.

Con él puedes:

- Comparar el **costo acumulado** y la **tendencia mensual de facturación** de cada entorno.
- Ver qué **servicios, regiones o conceptos** explican las diferencias de costo entre entornos.
- Revisar el **presupuesto, el gasto real, la proyección y lo facturado** mes a mes, por entorno y en total.
- Comparar el **uso de cómputo** (máquinas virtuales, bases de datos, Kubernetes) e identificar entornos **infrautilizados** o **sobreutilizados**.
- Comparar el **uso y el costo del almacenamiento** (cuentas de almacenamiento, buckets y discos).

> ℹ️ **Nota:** La pantalla **Comparación Nubes** también ofrece los módulos *Comparación Internube* y *Consolidado Multinube*. Cada uno tiene su propio manual.

> 🖼️ **Captura pendiente:** Pantalla "Módulos de comparación cloud" con la tarjeta Comparación Intranube destacada.
> *Archivo sugerido:* `img/intranube/00-modulos-comparacion.png`

---

## 2. Antes de comenzar

### 2.1 Requisitos para usar el módulo

- Tu organización debe tener habilitadas **varias cuentas en al menos una nube** (Azure, AWS o GCP). Si no es así, la opción **Comparación Nubes** no aparece en tu perfil.
- En el **Selector de Origen** solo verás las nubes en las que tu organización tiene varias cuentas habilitadas.
- El módulo está disponible para los roles **Usuario**, **Administrador de empresa** y **Administrador global**. Con otro rol verás el aviso **🚫 Acceso Denegado**.

Si necesitas habilitar más cuentas o cambiar tu rol, contacta al administrador de tu organización.

### 2.2 Cómo ingresar al módulo

1. Inicia sesión en Cloud Performance con tu usuario y contraseña.
2. Abre el menú de usuario (tu nombre, en la esquina superior derecha) y selecciona **Perfil**.
3. Haz clic en **Comparación Nubes**. Puedes hacerlo desde la tarjeta de la página de inicio del perfil o desde el menú lateral.
4. En la pantalla **Módulos de comparación cloud**, haz clic en la tarjeta **Comparacion Intranube**.
5. Se abrirá el asistente de configuración de la comparación (ver [sección 3](#3-configurar-una-comparación)).

> 🖼️ **Captura pendiente:** Perfil con la opción "Comparación Nubes" en el menú lateral y en las tarjetas de inicio.
> *Archivo sugerido:* `img/intranube/01-perfil-comparacion-nubes.png`

---

## 3. Configurar una comparación

Antes de ver un reporte, debes indicar **qué nube**, **qué entornos** y **qué tipo de análisis** quieres comparar. El asistente tiene tres pasos numerados, que aparecen uno debajo del otro a medida que avanzas.

> 🖼️ **Captura pendiente:** Asistente completo con los pasos 1, 2 y 3 visibles.
> *Archivo sugerido:* `img/intranube/02-asistente-completo.png`

### 3.1 Paso 1: Selector de Origen

1. Abre la lista **Seleccione Proveedor de Nube...**.
2. Elige una de las opciones disponibles:
   - **Azure (Tenants)**
   - **AWS (Cuentas)**
   - **GCP (Proyectos)**

Una vez elegida la nube, aparece el ícono **↺ (Reiniciar todo)** en la esquina del paso 1. Úsalo para borrar toda la configuración y empezar de nuevo.

> 🖼️ **Captura pendiente:** Paso 1 con la lista de proveedores abierta.
> *Archivo sugerido:* `img/intranube/03-paso1-origen.png`

### 3.2 Paso 2: Selección de entornos

El título del paso cambia según la nube: **Selección de Tenants** (Azure), **Selección de Cuentas** (AWS) o **Selección de Proyectos** (GCP).

1. Verás una tarjeta por cada entorno, con su nombre (alias) y una casilla.
2. Haz clic en una tarjeta para **marcarla** o **desmarcarla**. Las tarjetas marcadas se ven resaltadas en azul.
3. Debajo aparece la lista de **seleccionados** con el nombre de cada entorno.
4. Debes marcar **al menos dos** entornos. Mientras tengas uno solo, verás el aviso *"Selecciona al menos dos para habilitar los servicios"*.
5. Para desmarcar todo de una vez, usa **Limpiar Selección (n)**, en la esquina del paso.

> 💡 **Consejo:** Puedes comparar más de dos entornos a la vez. Con muchos entornos, las tarjetas y las tablas de los reportes se vuelven más anchas; si buscas una lectura rápida, compara de dos a cuatro.

> 🖼️ **Captura pendiente:** Paso 2 con dos tenants marcados y la lista de seleccionados.
> *Archivo sugerido:* `img/intranube/04-paso2-entornos.png`

### 3.3 Paso 3: Selector de Servicio

Este paso aparece cuando tienes al menos dos entornos marcados.

1. Elige el tipo de análisis haciendo clic en una de las tarjetas:

   | Tarjeta | Qué compara |
   |---|---|
   | **Facturación y Tendencias** | Análisis de costos y proyecciones. Ver [sección 5](#5-reporte-de-facturación). |
   | **Cómputo** | VMs, bases de datos, Kubernetes y escalado. Ver [sección 6](#6-reporte-de-cómputo). |
   | **Storage y Discos** | Volúmenes, buckets y retención. Ver [sección 7](#7-reporte-de-storage-y-discos). |

2. Presiona **Ir a comparación**. El botón cambia a *Generando Reporte...* mientras se abre el reporte.

> 🖼️ **Captura pendiente:** Paso 3 con la tarjeta "Facturación y Tendencias" seleccionada y el botón "Ir a comparación".
> *Archivo sugerido:* `img/intranube/05-paso3-servicio.png`

### 3.4 Volver a la configuración

En la parte superior de cada reporte está el botón **↺ Volver a la configuración**. Al presionarlo:

- Regresas al asistente con la **misma nube** elegida.
- Debes **volver a marcar los entornos** y elegir el tipo de análisis.

> ⚠️ **Importante:** Si recargas la página del navegador, la comparación se pierde y vuelves al paso 1 del asistente.

---

## 4. Uso general de los reportes

Todos los reportes tienen la misma estructura:

1. **Encabezado:** título del reporte (*Reporte de Facturación*, *Reporte de Cómputo* o *Reporte de Storage y Discos*) y la leyenda **Comparando N entornos en <nube>**.
2. **Configuración del Reporte:** panel de filtros.
3. **Contenido:** tarjetas, gráficos y tablas comparativas.

### 4.1 Configuración del Reporte (filtros)

> 🖼️ **Captura pendiente:** Panel "Configuración del Reporte" de Azure con los bloques de filtros unidos por flechas.
> *Archivo sugerido:* `img/intranube/06-panel-filtros.png`

**Cómo usarlo**

1. Ajusta los filtros que necesites.
2. Presiona **Aplicar Filtros** (botón azul). La información se actualiza solo al presionar este botón.
3. Para volver a los valores iniciales, presiona **Limpiar**.

**Filtros en cascada**

Los filtros se ordenan en bloques unidos por **flechas hacia abajo**. Lo que eliges en un bloque superior cambia las opciones disponibles en los bloques de abajo. Por ejemplo, en Azure las **Suscripciones** determinan qué **Tags** puedes elegir, y los Tags determinan qué **Grupos de Recursos** aparecen. Por eso, conviene completar los filtros **de arriba hacia abajo**.

**Filtros generales** (se aplican a todos los entornos)

| Filtro | Cómo se usa |
|---|---|
| **Año** | Solo en *Facturación*. Selector de año; el reporte abarca de enero a diciembre del año elegido. Por defecto, el **año actual**. |
| **Período** | En *Cómputo* y *Storage y Discos*. Calendario para elegir un rango: haz clic en la fecha de inicio y luego en la de término. Por defecto, desde **ayer hasta hoy**. |
| **Región de Nube** (AWS y GCP) / **Región** (Azure) | Lista con buscador. Opción inicial *Todas las Regiones*. |
| **Servicios** | En *Cómputo* y *Storage y Discos*. Elige **un** servicio de la lista. Las opciones dependen de la nube y del reporte (ver secciones [6](#6-reporte-de-cómputo) y [7](#7-reporte-de-storage-y-discos)). |

**Filtros por entorno** (un selector para cada entorno comparado)

Estos filtros muestran **un selector por cada entorno**, con etiquetas como *Tenant 1*, *Tenant 2*, etc. Así puedes, por ejemplo, comparar una suscripción del primer tenant con dos suscripciones del segundo.

| Filtro | Nube | Cómo se usa |
|---|---|---|
| **Suscripciones** | Azure | Selectores *Subs Tenant 1*, *Subs Tenant 2*, ... Elige una o varias suscripciones, o *Todas*. |
| **Proyectos** | GCP | Selectores *Proyectos Tenant 1*, ... Elige uno o varios proyectos, o *Todas*. |
| **Tags** | Azure | Selectores *Tags Tenant 1*, ... Primero elige la **clave** (*Todas las Claves* por defecto) y luego el **valor** (*Todos los Valores*). La lista de valores aparece al elegir una clave. Usa **Limpiar filtro** para volver a *Todas las Claves*. |
| **Grupos de Recursos** | Azure | Selectores *Tenant 1*, *Tenant 2*, ... Elige uno o varios grupos, o *Todos*. |
| **Recursos** | Todas (*Cómputo* y *Storage y Discos*) | Selectores *Recursos Tenant 1*, ... Usa **(Seleccionar Todos)** o marca recursos uno por uno. Si no marcas ninguno (*Seleccionar*), se consideran **todos** los recursos de ese entorno. |

> 💡 **Consejo:** Si un selector muestra **Sin datos** y aparece deshabilitado, ese entorno no tiene información para el período y los filtros superiores elegidos. Amplía el período o cambia los filtros de arriba.

> ℹ️ **Nota:** Al cambiar el **Servicio**, la selección de **Recursos** se reinicia, porque cada servicio tiene su propia lista de recursos.

**Filtros de cada reporte**

| Reporte | Azure | AWS | GCP |
|---|---|---|---|
| **Facturación** | Año · Suscripciones · Región · Tags · Grupos de Recursos | Año · Región de Nube | Año · Región de Nube · Proyectos |
| **Cómputo** | Período · Servicios · Suscripciones · Región · Tags · Grupos de Recursos · Recursos | Período · Región de Nube · Servicios · Recursos | Período · Región de Nube · Servicios · Recursos |
| **Storage y Discos** | Período · Servicios · Suscripciones · Región · Tags · Grupos de Recursos · Recursos | Período · Región de Nube · Servicios · Recursos | Período · Región de Nube · Servicios · Recursos |

### 4.2 Cómo se identifica cada entorno

- En el **Reporte de Facturación**, cada entorno aparece con su **nombre (alias)** en tarjetas, gráficos y tablas.
- En los reportes de **Cómputo** y **Storage y Discos**, los entornos aparecen como **Tenant 1**, **Tenant 2**, etc. (o **T1**, **T2** en las barras comparativas), aunque se trate de cuentas de AWS o proyectos de GCP.

### 4.3 Gráficos

- **Pasa el cursor** sobre la línea para ver el valor de cada entorno en ese punto.
- **Haz clic en un elemento de la leyenda** para ocultar o mostrar un entorno.
- Los íconos de la esquina superior derecha permiten **guardar el gráfico como imagen** y otras acciones de visualización.
- Las fechas y horas se muestran en **UTC**.

### 4.4 Tablas

- **Buscar:** usa el cuadro de búsqueda sobre la tabla para filtrar filas.
- **Ordenar:** haz clic en el encabezado de una columna (cuando muestra flechas).
- **Paginación:** usa **Anterior** / **Siguiente** y el selector de filas por página.
- **Tooltips:** pasa el cursor sobre las barras de distribución o sobre la etiqueta **Diff** para ver más detalle.

### 4.5 Mensajes que puedes encontrar

| Mensaje | Significado y qué hacer |
|---|---|
| **Analizando datos de <nube>...** | La información se está obteniendo. Espera unos segundos. |
| **Ocurrió un error al cargar el reporte.** | Hubo un problema al obtener la información. Intenta nuevamente o ajusta los filtros. Si persiste, contacta a soporte. |
| **Seleccione Servicio** / **Selecciona un Servicio** | El reporte necesita que elijas un servicio en el filtro **Servicios**. |
| **Sin datos** (en un selector de filtro) | Ese entorno no tiene opciones para los filtros elegidos. |
| **No hay datos de cómputo / de almacenamiento para mostrar** | No hay métricas para el período y los filtros elegidos. Amplía el período o cambia el servicio. |
| **No hay métricas de facturación disponibles para los filtros seleccionados.** | No hay costos para el año y los filtros elegidos. |
| **No hay datos para esta selección.** / **No hay datos disponibles para la dimensión seleccionada.** | La tabla no tiene filas para la dimensión elegida. Prueba otra dimensión o cambia los filtros. |

---

## 5. Reporte de Facturación

**Asistente:** Selector de Servicio → **Facturación y Tendencias**
**Para qué sirve:** comparar cuánto cuesta cada entorno, cómo evoluciona su gasto mes a mes y cómo se compara con su presupuesto.

**Filtros:** ver [tabla de filtros por reporte](#41-configuración-del-reporte-filtros). En este reporte el período se elige por **Año**.

**Qué muestra**

1. **Tarjetas de costo acumulado:** una tarjeta por entorno, titulada **Costo real acumulado** con el nombre del entorno. Incluye:
   - El **costo real** acumulado en el año (USD).
   - El **Costo Retail**, es decir, el costo a precio de lista, sin descuentos.
   - El **rango de fechas** con datos usado para el cálculo.

2. **Tendencia Facturación Comparativa Costo Real:** gráfico de líneas con el costo mensual (USD) de cada entorno. Debajo del título se indica cuántos entornos se comparan.

3. **Análisis por Dimensión:** tabla que compara los costos de los entornos agrupados por la **dimensión** que elijas en el selector de la derecha.
   - **Columnas:**
     - **Dimensión:** el valor de la dimensión (por ejemplo, el nombre de un servicio).
     - Una columna de **costo por entorno**.
     - **Análisis Comparativo:** el **Total** de la fila; la **Distribución Porcentual**, una barra con el porcentaje de cada entorno; y el **Ratio Mayor/Menor**, que indica cuántas veces más gasta el entorno más costoso (etiqueta roja) que el más económico (etiqueta gris). Si solo un entorno tiene costo en esa fila, verás *Solo 1 tenant con costo*.
   - **Dimensiones disponibles:**

     | Nube | Grupos y dimensiones | Dimensión inicial |
     |---|---|---|
     | **Azure** | *Infraestructura:* Servicio Contratado, Proveedor de Servicio, Región, Grupo de Recursos, Familia de Servicios. *Detalle de Consumo:* Tipo de Servicio, Subtipo de Recursos, Ítem Facturable, Unidad de Cobro. *Financiero:* Modelo de Compra, Tipo de Transacción, Cuenta de Facturación. *Organización:* Cliente / Titular, Centro de Costos. | Familia de Servicios |
     | **AWS** | *General y Ubicación:* Servicio AWS, Cuenta del Proyecto, Región Geográfica, Zona de Disponibilidad. *Detalle Técnico:* Detalle de Uso (SKU), Acción / Operación, Tamaño de Instancia, Familia de Instancia, Plataforma (OS), Motor de Base de Datos. *Facturación y Contratos:* Modalidad de Compra, Naturaleza del Cargo, Entidad de Facturación. *Ahorros y Reservas:* Tipo de Plan de Ahorro, ID de Reserva. | Servicio AWS |
     | **GCP** | *General y Ubicación:* Servicio GCP, Ubicación, ID del Proyecto. *Detalle Técnico:* Detalle de Uso (SKU), Unidad de Uso, Unidad Facturada. *Organización:* Nombre del Proyecto. | Servicio GCP |

4. **Tabla de presupuesto y facturación mensual:** columnas **Apertura**, un mes por columna (formato *MM-AAAA*) y **Total**. Tiene un bloque **Presupuesto (Total)** con la suma de todos los entornos y luego un bloque **Ppto <nombre del entorno>** por cada entorno. Cada bloque contiene:

   | Fila | Qué indica |
   |---|---|
   | **Presupuesto (Total)** / **Ppto <entorno>** | Presupuesto asignado para cada mes. |
   | **Real** | Gasto real registrado para el presupuesto en el mes. |
   | **Proyectado** | Proyección (forecast) del gasto del mes. |
   | **Facturado** | Costo facturado en el mes. |
   | **↕ Var. vs mes anterior ($)** y **(%)** | Diferencia del monto facturado respecto del mes anterior. El primer mes muestra *-*. |
   | **Total** | Total facturado del mes. |
   | **Desviación Ppto vs Facturado ($)** y **(%)** | Presupuesto menos facturado. En **verde**, el gasto quedó bajo el presupuesto; en **amarillo**, lo superó. |

   Sobre la tabla están los botones **Export CSV** y **Export Excel** para descargarla.

**Cómo usarlo**

1. Elige el **Año** que quieres analizar.
2. Si lo necesitas, ajusta los filtros por entorno (por ejemplo, ciertas **Suscripciones** en Azure o ciertos **Proyectos** en GCP).
3. Presiona **Aplicar Filtros**.
4. Compara las **tarjetas** para ver qué entorno gasta más en el año.
5. En el gráfico de tendencia, identifica en qué meses se separan los costos.
6. En **Análisis por Dimensión**, cambia la dimensión (por ejemplo, a *Región* o *Detalle de Uso (SKU)*) para encontrar qué explica la diferencia. Revisa el **Ratio Mayor/Menor** para detectar los conceptos con mayor brecha.
7. Revisa la tabla mensual para controlar el **cumplimiento del presupuesto** y exporta a Excel si necesitas compartirla.

> 🖼️ **Captura pendiente:** Tarjetas "Costo real acumulado" y gráfico "Tendencia Facturación Comparativa Costo Real".
> *Archivo sugerido:* `img/intranube/07-facturacion-tarjetas-grafico.png`

> 🖼️ **Captura pendiente:** Tabla "Análisis por Dimensión" con el selector de dimensión abierto.
> *Archivo sugerido:* `img/intranube/08-facturacion-dimension.png`

> 🖼️ **Captura pendiente:** Tabla de presupuesto y facturación mensual con los botones Export CSV y Export Excel.
> *Archivo sugerido:* `img/intranube/09-facturacion-presupuesto.png`

---

## 6. Reporte de Cómputo

**Asistente:** Selector de Servicio → **Cómputo**
**Para qué sirve:** comparar el uso de los recursos de cómputo de cada entorno, detectar entornos infrautilizados o sobreutilizados y comparar sus costos.

**Filtros:** ver [tabla de filtros por reporte](#41-configuración-del-reporte-filtros).

**Servicios disponibles** (filtro **Servicios**)

| Nube | Servicios | Servicio inicial |
|---|---|---|
| **Azure** | Virtual Machines, VM Scale Sets, Nodos K8S, PostgreSQL Flexible, Mysql Flexible, Storage Account | Virtual Machines |
| **AWS** | Elastic Compute Cloud (EC2), RDS Mysql, RDS Postgresql, RDS Oracle, RDS Mariadb, RDS Sql Server | Elastic Compute Cloud (EC2) |
| **GCP** | Compute Engine, Cloud SQL PG, Cloud SQL MySQL, Instances Group, Google Kubernetes Engine (GKE) | Compute Engine |

**Qué muestra**

1. **Criterios de Análisis:** leyenda que explica el estado asignado a cada entorno:

   | Estado | Criterio |
   |---|---|
   | **Sin Datos** | Métricas en 0. |
   | **Infrautilizado** | CPU promedio menor a 10 % y RAM bajo 30 % (o más de 4 GB de memoria disponible). |
   | **Sobreutilizado** | CPU promedio mayor a 85 %, o memoria crítica (uso sobre 90 % o menos de 0,2 GB disponibles). |
   | **Saludable** | Valores normales. |

2. **Tarjetas por entorno** (*Tenant 1*, *Tenant 2*, ...). Cada tarjeta muestra:
   - Una etiqueta con el **estado** (Sin Datos, Infrautilizado, Sobreutilizado o Saludable).
   - Si el estado es Infrautilizado o Sobreutilizado, un recuadro (**Posible Sobredimensionamiento** o **Sobrecarga de Recursos**) con los valores que lo explican y el umbral superado.
   - La lista de **Métricas** del servicio con su **valor promedio** en el período (por ejemplo, porcentaje de CPU, memoria disponible, IOPS o tráfico de red).

3. **Gráficos por métrica:** un gráfico de líneas por cada métrica, con una línea por entorno, para comparar su evolución en el período.

4. **Costos de Cómputo (<nube>):** tabla comparativa de costos del servicio elegido.
   - **Azure y GCP:** elige la **dimensión** en el selector de la tabla (las mismas dimensiones del [Reporte de Facturación](#5-reporte-de-facturación)). La dimensión inicial es *Modelo de Compra* en Azure y *Servicio GCP* en GCP.
   - **AWS:** la tabla compara los recursos **por ranking de costo**: la fila *Top #1* muestra el recurso más costoso de cada cuenta, *Top #2* el segundo, y así sucesivamente. Bajo cada costo se indica el recurso. Sobre la tabla verás además dos listas: **Recursos Más Costosos (Por Tenant)** y **Recursos Menos Costosos (Por Tenant)**.
   - **Columna Análisis Comparativo:**
     - **Total** de la fila.
     - Etiqueta **Diff**, con la diferencia entre el entorno más costoso y el más económico: *~ Equal* (menos de 1 %), un porcentaje (por ejemplo, *+8.5%*) o un múltiplo (por ejemplo, *2.3x*). Pasa el cursor sobre ella para ver la explicación.
     - **Barras por entorno** (T1, T2, ...), con el costo de cada uno. En **naranja**, el más costoso.
     - En Azure y GCP, el botón **Ver desglose de recursos** abre la ventana **Análisis de Costos**, que muestra para cada entorno el recurso de **Top Consumo** (y qué porcentaje del costo del entorno representa) y el de **Menor Consumo**.

**Cómo usarlo**

1. Elige el **Período** y el **Servicio** que quieres comparar.
2. Si quieres comparar recursos específicos, elígelos en **Recursos** para cada entorno.
3. Presiona **Aplicar Filtros**.
4. Revisa el **estado** de cada tarjeta. Un entorno *Infrautilizado* puede ser candidato a reducir el tamaño de sus recursos; uno *Sobreutilizado* podría necesitar más capacidad.
5. Usa los gráficos para ver si las diferencias son constantes o se concentran en ciertos días.
6. En **Costos de Cómputo**, revisa la etiqueta **Diff** y abre **Ver desglose de recursos** para identificar qué recurso explica el mayor gasto.

> 🖼️ **Captura pendiente:** Leyenda "Criterios de Análisis" y tarjetas por entorno con su estado.
> *Archivo sugerido:* `img/intranube/10-computo-tarjetas.png`

> 🖼️ **Captura pendiente:** Gráficos por métrica del Reporte de Cómputo.
> *Archivo sugerido:* `img/intranube/11-computo-graficos.png`

> 🖼️ **Captura pendiente:** Tabla "Costos de Cómputo" con la columna Análisis Comparativo.
> *Archivo sugerido:* `img/intranube/12-computo-costos.png`

> 🖼️ **Captura pendiente:** Ventana "Análisis de Costos" con Top Consumo y Menor Consumo por entorno.
> *Archivo sugerido:* `img/intranube/13-computo-desglose.png`

> 🖼️ **Captura pendiente:** Listas "Recursos Más Costosos" y "Recursos Menos Costosos" y tabla por ranking (AWS).
> *Archivo sugerido:* `img/intranube/14-computo-aws-ranking.png`

---

## 7. Reporte de Storage y Discos

**Asistente:** Selector de Servicio → **Storage y Discos**
**Para qué sirve:** comparar el uso y el costo del almacenamiento de cada entorno.

**Filtros:** ver [tabla de filtros por reporte](#41-configuración-del-reporte-filtros).

**Servicios disponibles** (filtro **Servicios**)

| Nube | Servicios | Servicio inicial |
|---|---|---|
| **Azure** | Storage Account, Discos | Ninguno: debes elegir uno. |
| **AWS** | S3 Buckets, Discos | Ninguno: debes elegir uno. |
| **GCP** | Cloud Storage Buckets, Persistent Disks | Cloud Storage Buckets |

> ⚠️ **Importante:** En Azure y AWS, el reporte muestra *Seleccione Servicio* hasta que elijas un servicio y presiones **Aplicar Filtros**.

**Qué muestra**

1. **Tarjetas por entorno** (*Tenant 1*, *Tenant 2*, ...), con la cantidad de **Recursos** del entorno y sus métricas promedio en el período:
   - **Azure – Storage Account:** sección **Métricas Storage Account** (métricas a nivel de cuenta) y sección **Servicios Asociados**, con las métricas de cada servicio de la cuenta (por ejemplo, Blob, File, Queue y Table).
   - **Azure – Discos:** métricas de los discos.
   - **AWS:** **Métricas Servicio S3 Bucket** o **Métricas Servicio EBS** (discos).
   - **GCP:** **Métricas Servicio Cloud Storage Bucket** o **Métricas Servicio Persistent Disk**.

   Los tamaños se muestran en GB y las tasas de transferencia en MB.

2. **Gráficos por métrica:** un gráfico por cada métrica, con una línea por entorno.

3. **Tabla de costos:** tabla comparativa de costos del servicio elegido. Funciona igual que la tabla **Costos de Cómputo** del [Reporte de Cómputo](#6-reporte-de-cómputo): dimensión seleccionable en Azure y GCP, ranking de recursos en AWS, columna **Análisis Comparativo** y botón **Ver desglose de recursos**.

**Cómo usarlo**

1. Elige el **Período** y el **Servicio** (por ejemplo, *Discos*).
2. Si quieres, limita la comparación a ciertos **Recursos** de cada entorno.
3. Presiona **Aplicar Filtros**.
4. Compara la cantidad de recursos y las métricas de cada entorno: un entorno con muchos discos y poca actividad puede tener almacenamiento sin uso.
5. Revisa la tabla de costos para ver qué entorno y qué recurso concentran el gasto en almacenamiento.

> 🖼️ **Captura pendiente:** Tarjetas por entorno de Azure Storage Account con "Métricas Storage Account" y "Servicios Asociados".
> *Archivo sugerido:* `img/intranube/15-storage-tarjetas.png`

> 🖼️ **Captura pendiente:** Gráficos por métrica del Reporte de Storage y Discos.
> *Archivo sugerido:* `img/intranube/16-storage-graficos.png`

> 🖼️ **Captura pendiente:** Tabla de costos de almacenamiento con la columna Análisis Comparativo.
> *Archivo sugerido:* `img/intranube/17-storage-costos.png`

---

## 8. Preguntas frecuentes

**No veo la opción "Comparación Nubes" en mi perfil.**
Tu organización no tiene varias cuentas habilitadas en ninguna nube. Consulta al administrador de tu organización.

**En el Selector de Origen no aparece la nube que quiero comparar.**
Solo se muestran las nubes en las que tu organización tiene varias cuentas habilitadas.

**No aparece el paso 3 (Selector de Servicio).**
Debes marcar **al menos dos** entornos en el paso 2.

**No veo información después de cambiar los filtros.**
Recuerda presionar **Aplicar Filtros**. Los cambios no se aplican automáticamente.

**El reporte de Storage dice "Seleccione Servicio".**
Elige un servicio en el filtro **Servicios** (por ejemplo, *Discos*) y presiona **Aplicar Filtros**.

**Un selector de filtro dice "Sin datos".**
Ese entorno no tiene opciones para el período o los filtros superiores elegidos. Amplía el período o cambia los filtros de los bloques de arriba.

**¿Qué significa "Tenant 1" si estoy comparando cuentas de AWS o proyectos de GCP?**
Es la forma en que los reportes de Cómputo y Storage identifican a cada entorno comparado, sin importar la nube. En el Reporte de Facturación verás el nombre de cada entorno.

**Recargué la página y perdí la comparación.**
La configuración de la comparación no se guarda al recargar. Vuelve a elegir la nube, los entornos y el tipo de análisis.

**¿Qué diferencia hay entre Costo real y Costo Retail?**
El **Costo Retail** es el costo a precio de lista. El **costo real** es lo que efectivamente se cobra, después de descuentos, reservas o planes de ahorro.

**¿Cómo interpreto el estado "Infrautilizado" en el Reporte de Cómputo?**
Indica que el servicio de ese entorno tuvo, en promedio, muy poco uso de CPU y memoria en el período. Puede ser una oportunidad para reducir el tamaño o la cantidad de recursos. Revisa los gráficos antes de decidir.

**¿Por qué las horas de los gráficos no coinciden con mi hora local?**
Los gráficos muestran las fechas y horas en **UTC**.

---

## 9. Glosario

| Término | Definición |
|---|---|
| **Costo real** | Lo que efectivamente se cobra, después de descuentos, reservas o planes de ahorro. |
| **Costo Retail** | Costo a precio de lista, sin descuentos. |
| **Cuenta (AWS)** | Unidad de facturación y recursos en Amazon Web Services. |
| **Desviación** | Diferencia entre el presupuesto y lo facturado. |
| **Diff** | Diferencia entre el entorno más costoso y el más económico en una fila de la tabla de costos. |
| **Dimensión** | Criterio para agrupar los costos (por ejemplo, servicio, región o SKU). |
| **EBS** | Discos (volúmenes) de las instancias EC2 en AWS. |
| **Entorno** | Cada tenant, cuenta o proyecto que se compara. |
| **Forecast / Proyectado** | Proyección estimada del gasto. |
| **Grupo de Recursos** | Contenedor lógico de recursos en Azure. |
| **Infrautilizado** | Recurso con uso muy por debajo de su capacidad. |
| **Intranube** | Comparación entre entornos de una **misma** nube. |
| **Persistent Disk** | Disco de las máquinas virtuales en Google Cloud. |
| **Proyecto (GCP)** | Contenedor de recursos y facturación en Google Cloud. |
| **Ratio Mayor/Menor** | Cuántas veces más gasta el entorno más costoso que el más económico. |
| **S3 Bucket** | Contenedor de objetos del servicio de almacenamiento de AWS. |
| **SKU** | Código que identifica cada concepto facturable. |
| **Sobreutilizado** | Recurso con uso cercano o superior a su capacidad. |
| **Storage Account** | Cuenta de almacenamiento de Azure, que agrupa los servicios Blob, File, Queue y Table. |
| **Suscripción** | Unidad de facturación y acceso dentro de un tenant de Azure. |
| **Tag** | Etiqueta (clave y valor) asignada a un recurso para clasificarlo. |
| **Tenant** | Instancia de Microsoft Entra ID (Azure) que agrupa suscripciones de una organización. En los reportes también se usa para referirse a cualquier entorno comparado. |
| **UTC** | Tiempo Universal Coordinado, la referencia horaria de los gráficos. |
