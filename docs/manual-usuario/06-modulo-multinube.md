# Manual de Usuario — Cloud Performance

## Módulo Consolidado Multinube

> **Versión del documento:** 1.0 · **Módulo:** Consolidado Multinube
> **Dirigido a:** usuarios finales de Cloud Performance que necesitan ver en un solo lugar la facturación de sus cuentas de Azure, AWS y GCP.

---

## Índice

1. [Introducción](#1-introducción)
2. [Antes de comenzar](#2-antes-de-comenzar)
   - 2.1 [Requisitos para usar el módulo](#21-requisitos-para-usar-el-módulo)
   - 2.2 [Cómo ingresar al módulo](#22-cómo-ingresar-al-módulo)
3. [Configurar el consolidado](#3-configurar-el-consolidado)
   - 3.1 [Paso 1: Selector de Nube](#31-paso-1-selector-de-nube)
   - 3.2 [Paso 2: Selección de cuentas](#32-paso-2-selección-de-cuentas)
   - 3.3 [Volver a la configuración](#33-volver-a-la-configuración)
4. [Dashboard Consolidado Multi-Tenant](#4-dashboard-consolidado-multi-tenant)
   - 4.1 [Filtros](#41-filtros)
   - 4.2 [Resumen Ejecutivo Consolidado](#42-resumen-ejecutivo-consolidado)
   - 4.3 [Tendencia de Gasto Agregado](#43-tendencia-de-gasto-agregado)
   - 4.4 [Distribución por Categoría](#44-distribución-por-categoría)
   - 4.5 [Top Servicios Globales](#45-top-servicios-globales)
5. [Mensajes que puedes encontrar](#5-mensajes-que-puedes-encontrar)
6. [Preguntas frecuentes](#6-preguntas-frecuentes)
7. [Glosario](#7-glosario)

---

## 1. Introducción

El módulo **Consolidado Multinube** suma la facturación de las cuentas que elijas en **dos o tres nubes** (Azure, AWS y GCP) y la presenta en un único dashboard. Con él puedes:

- Conocer el **gasto total** de tu organización en todas las nubes, para un mes y en lo que va del año.
- Ver cuánto aporta **cada nube** y **cada cuenta** al total.
- Seguir la **tendencia mensual** del gasto de cada nube.
- Comparar el gasto por **categoría** (cómputo, bases de datos, almacenamiento, networking y otros).
- Identificar los **servicios** de mayor costo entre todas las nubes.
- Filtrar el análisis por **etiquetas (tags)** de cada nube.

> 🖼️ **Captura pendiente:** Pantalla "Módulos de comparación cloud" con la tarjeta Consolidado Multinube destacada.
> *Archivo sugerido:* `img/multinube/00-modulos-comparacion.png`

---

## 2. Antes de comenzar

### 2.1 Requisitos para usar el módulo

- Tu organización debe tener **al menos dos nubes** habilitadas en Cloud Performance. Si tiene una sola, el asistente muestra el aviso *"Requiere al menos dos proveedores activos para comparar."*
- El módulo está disponible para los roles **Usuario**, **Administrador de empresa** y **Administrador global**. Con otro rol verás el aviso **🚫 Acceso Denegado**.

### 2.2 Cómo ingresar al módulo

1. Inicia sesión en Cloud Performance con tu usuario y contraseña.
2. Abre el menú de usuario (tu nombre, en la esquina superior derecha) y selecciona **Perfil**.
3. Haz clic en **Comparación Nubes**. Puedes hacerlo desde la tarjeta de la página de inicio del perfil o desde el menú lateral.
4. En la pantalla **Módulos de comparación cloud**, haz clic en la tarjeta **Consolidado Multinube**.
5. Se abrirá la pantalla **Comparación Multi-Tenant Global**, con el asistente de configuración.

> 🖼️ **Captura pendiente:** Perfil con la opción "Comparación Nubes" en el menú lateral.
> *Archivo sugerido:* `img/multinube/01-perfil-comparacion-nubes.png`

---

## 3. Configurar el consolidado

El asistente tiene dos pasos numerados. El paso activo se destaca con un borde verde; el paso 2 se ve atenuado hasta que completas el paso 1.

> 🖼️ **Captura pendiente:** Pantalla "Comparación Multi-Tenant Global" con los pasos 1 y 2.
> *Archivo sugerido:* `img/multinube/02-asistente.png`

### 3.1 Paso 1: Selector de Nube

1. Verás una tarjeta por cada nube habilitada: **Microsoft Azure**, **Amazon Web Services** y **Google Cloud**.
2. Haz clic en las nubes que quieres consolidar. Debes marcar **al menos dos**.
3. Presiona **Continuar**.

Después de continuar, las tarjetas del paso 1 quedan bloqueadas. Para cambiar las nubes, usa el ícono **↺** de la esquina del paso 1: limpia toda la selección y te devuelve al inicio.

### 3.2 Paso 2: Selección de cuentas

El paso **Selección de Tenant** muestra un grupo por cada nube elegida, con el logo y el nombre de la nube.

1. Marca las cuentas (tenants, cuentas o proyectos) que quieres incluir. Puedes marcar **una o varias por nube**.
2. Si una nube tiene **una sola cuenta**, queda marcada automáticamente.
3. Para desmarcar todo, usa **Limpiar Selección**.
4. Presiona **Ir a comparación**. El botón se habilita cuando cada nube elegida tiene **al menos una cuenta marcada**.

> 🖼️ **Captura pendiente:** Paso 2 con cuentas marcadas en Azure y AWS, y el botón "Ir a comparación".
> *Archivo sugerido:* `img/multinube/03-paso2-cuentas.png`

### 3.3 Volver a la configuración

En la parte superior del dashboard está el botón **↺ Volver a la configuración**. Te devuelve al paso 2 **con tus nubes y cuentas aún marcadas**, para que agregues o quites cuentas y vuelvas a presionar **Ir a comparación**.

> ⚠️ **Importante:** Si recargas la página del navegador, la configuración se pierde y vuelves al paso 1.

---

## 4. Dashboard Consolidado Multi-Tenant

**Para qué sirve:** ver el gasto conjunto de las cuentas elegidas en todas las nubes, su evolución y su composición.

El dashboard muestra el título **Consolidado Multi-Tenant**, el panel de filtros y cuatro secciones: el resumen ejecutivo, la tendencia de gasto, la distribución por categoría y los servicios de mayor costo.

> 🖼️ **Captura pendiente:** Dashboard completo con filtros y Resumen Ejecutivo Consolidado.
> *Archivo sugerido:* `img/multinube/04-dashboard.png`

### 4.1 Filtros

| Filtro | Cómo se usa |
|---|---|
| **Periodo** | Selector de **mes y año**. Por defecto, el **mes actual**. El mes elegido es el **mes de análisis**; el dashboard muestra además los meses anteriores del mismo año (desde enero). |
| **Tags** | Un recuadro por cada nube elegida, con su logo. Primero elige la **clave** (*Todas las claves* por defecto) y luego el **valor** (*Todos los valores*). La lista de valores aparece al elegir una clave. Si la nube no tiene etiquetas, el recuadro muestra *Sin tags*. |

1. Ajusta los filtros.
2. Presiona **Aplicar Filtros**. La información se actualiza solo al presionar este botón.
3. Para volver al mes actual y quitar las etiquetas, presiona **Limpiar**.

> ⚠️ **Importante:** Para filtrar por etiqueta debes elegir **una clave y un valor específicos**. Si eliges una clave pero dejas *Todos los valores*, la etiqueta no se aplica.

> 💡 **Consejo:** Cada nube tiene su propio filtro de etiquetas. Si usas la misma etiqueta en todas tus nubes (por ejemplo, `proyecto = ventas`), elígela en cada recuadro para ver el gasto consolidado de ese proyecto.

> 🖼️ **Captura pendiente:** Panel de filtros con el selector de Periodo y los recuadros de Tags por nube.
> *Archivo sugerido:* `img/multinube/05-filtros.png`

### 4.2 Resumen Ejecutivo Consolidado

**Tarjetas globales**

| Tarjeta | Qué indica |
|---|---|
| **Total Global (Mes)** | Gasto total de todas las cuentas elegidas en el **mes de análisis**. La etiqueta junto al título indica el mes (por ejemplo, *OCTUBRE DE 2026*). |
| **Total Global (Año)** | Gasto total **desde enero hasta el mes de análisis** del año indicado en la etiqueta (por ejemplo, *AÑO 2026*). |

**Tarjetas por nube** (*Azure Consolidado*, *AWS Consolidado*, *GCP Consolidado*)

- El **gasto de la nube** en el mes de análisis.
- El **Desglose por Cuenta**: el gasto del mes de cada cuenta elegida, ordenado de mayor a menor.

Todos los montos están en **USD**.

> 🖼️ **Captura pendiente:** Tarjetas "Total Global" y tarjetas por nube con el desglose por cuenta.
> *Archivo sugerido:* `img/multinube/06-resumen-ejecutivo.png`

### 4.3 Tendencia de Gasto Agregado

Gráfico de áreas con la **facturación mensual (USD)** de cada nube, desde enero hasta el mes de análisis. El mes de análisis aparece **resaltado** con un sombreado y su nombre en negrita.

- **Pasa el cursor** (o haz clic) sobre un mes para ver el gasto de cada nube, el **porcentaje** que representa y el **Total Consolidado** del mes.
- **Haz clic en la leyenda** para ocultar o mostrar una nube.
- Con los íconos de la esquina superior derecha puedes **hacer zoom** sobre un tramo, **restaurar** la vista y **guardar el gráfico como imagen**.

> 🖼️ **Captura pendiente:** Gráfico "Tendencia de Gasto Agregado" con el tooltip de un mes abierto.
> *Archivo sugerido:* `img/multinube/07-tendencia.png`

### 4.4 Distribución por Categoría

Gráfico **Distribución por Categoría (Suma de Tenants)**. Para cada mes muestra **una columna por nube**, identificada con el logo de la nube sobre la columna (el orden se indica en la leyenda **Orden por mes**). Cada columna se divide en categorías:

| Categoría | Ejemplos de servicios |
|---|---|
| **Cómputo** | Máquinas virtuales, EC2, Compute Engine, Kubernetes (AKS, EKS, GKE), funciones, App Service. |
| **Bases de Datos** | SQL, RDS, Cosmos DB, DynamoDB, BigQuery, Spanner, Redis. |
| **Almacenamiento** | Storage, S3, Blob, discos (EBS, Persistent Disk), Filestore, backups. |
| **Networking** | Redes virtuales, DNS, balanceadores de carga, gateways, CDN, VPN. |
| **Otros** | Servicios que no corresponden a las categorías anteriores. |

- **Pasa el cursor** sobre un mes para ver, por nube, el gasto de cada categoría y el total de la nube.
- **Haz clic en una categoría de la leyenda** para ocultarla o mostrarla en todas las nubes.

> 🖼️ **Captura pendiente:** Gráfico "Distribución por Categoría" con las columnas por nube y el tooltip abierto.
> *Archivo sugerido:* `img/multinube/08-categorias.png`

### 4.5 Top Servicios Globales

Gráfico de barras horizontales con los **servicios de mayor costo** de todas las nubes, desde enero hasta el mes de análisis, ordenados de mayor a menor. Cada barra se divide por nube (Azure, AWS y GCP), con su color. Si hay más de 100 servicios, el resto se agrupa en **Otros Servicios Agrupados**.

- **Pasa el cursor** sobre una barra para ver el costo del servicio en cada nube.
- Usa la **barra deslizante** de la derecha o la **rueda del mouse** para recorrer la lista.

> 🖼️ **Captura pendiente:** Gráfico "Top Servicios Globales".
> *Archivo sugerido:* `img/multinube/09-top-servicios.png`

---

## 5. Mensajes que puedes encontrar

| Mensaje | Significado y qué hacer |
|---|---|
| **Requiere al menos dos proveedores activos para comparar.** | Tu organización tiene una sola nube habilitada. Consulta al administrador de tu organización. |
| **Agrupando facturación mensual...** / **Calculando desglose de servicios...** | La información se está procesando. Espera unos segundos. |
| **No hay datos de facturación disponibles en este período.** | No hay gasto para las cuentas y filtros elegidos. Cambia el mes o quita las etiquetas. |
| **No hay datos de servicios disponibles.** | No hay servicios con costo para los filtros elegidos. |
| **Sin tags** | La nube no tiene etiquetas en el período. |
| **Error cargando etiquetas.** | No se pudieron obtener las etiquetas de esa nube. Intenta nuevamente más tarde. |

---

## 6. Preguntas frecuentes

**El asistente dice "Requiere al menos dos proveedores activos para comparar".**
Este módulo necesita al menos dos nubes habilitadas en tu organización. Consulta al administrador de tu organización.

**El botón "Ir a comparación" está deshabilitado.**
Cada nube elegida en el paso 1 debe tener al menos una cuenta marcada en el paso 2.

**¿Cómo cambio las nubes después de presionar "Continuar"?**
Usa el ícono **↺** del paso 1. Se limpia toda la selección y puedes empezar de nuevo.

**¿Qué diferencia hay entre "Total Global (Mes)" y "Total Global (Año)"?**
El primero suma el gasto del **mes de análisis**. El segundo suma el gasto **desde enero hasta el mes de análisis**.

**Elegí una etiqueta, pero los montos no cambiaron.**
Asegúrate de haber elegido **una clave y un valor** específicos, y de haber presionado **Aplicar Filtros**.

**¿Puedo ver meses de años distintos en el mismo gráfico?**
No. El dashboard muestra los meses del año del mes de análisis, desde enero hasta ese mes.

**¿En qué moneda están los montos?**
Todos los montos están en **USD**.

**Recargué la página y perdí la configuración.**
La configuración no se guarda al recargar. Vuelve a elegir las nubes y las cuentas.

---

## 7. Glosario

| Término | Definición |
|---|---|
| **Categoría** | Agrupación de servicios de distinto proveedor por su función: Cómputo, Bases de Datos, Almacenamiento, Networking u Otros. |
| **Consolidado** | Suma del gasto de varias cuentas o nubes en un solo valor o gráfico. |
| **Cuenta** | Tenant de Azure, cuenta de AWS o proyecto de GCP. |
| **Mes de análisis** | Mes elegido en el filtro *Periodo*; es el mes que resumen las tarjetas del resumen ejecutivo. |
| **Multinube** | Uso combinado de varios proveedores de nube. |
| **Networking** | Servicios de red: redes virtuales, DNS, balanceadores, CDN, VPN, etc. |
| **Tag** | Etiqueta (clave y valor) asignada a un recurso para clasificarlo. |
| **Tenant** | Instancia de Microsoft Entra ID (Azure); en este módulo también se usa para referirse a cualquier cuenta. |
| **USD** | Dólar estadounidense, moneda de todos los montos del módulo. |
