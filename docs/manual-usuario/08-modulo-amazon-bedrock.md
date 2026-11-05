# Manual de Usuario — Cloud Performance

## Módulo Servicios IA: Amazon Bedrock

> **Versión del documento:** 1.0 · **Módulo:** Servicios IA — Amazon Bedrock
> **Dirigido a:** usuarios finales de Cloud Performance que usan modelos de IA en Amazon Bedrock y quieren entender su costo, compararlo con otras nubes y reducir el consumo de tokens.

---

## Índice

1. [Introducción](#1-introducción)
2. [Antes de comenzar](#2-antes-de-comenzar)
   - 2.1 [Cómo ingresar al módulo](#21-cómo-ingresar-al-módulo)
   - 2.2 [Acceso según tu plan](#22-acceso-según-tu-plan)
   - 2.3 [Elementos de la pantalla](#23-elementos-de-la-pantalla)
3. [Uso general de las vistas](#3-uso-general-de-las-vistas)
   - 3.1 [Panel de filtros](#31-panel-de-filtros)
   - 3.2 [Mensajes que puedes encontrar](#32-mensajes-que-puedes-encontrar)
4. [Inicio](#4-inicio)
5. [Costo y Optimización](#5-costo-y-optimización)
   - 5.1 [Tarjeta de costo de un modelo](#51-tarjeta-de-costo-de-un-modelo)
   - 5.2 [Inference Profiles](#52-inference-profiles)
   - 5.3 [Modelos Custom](#53-modelos-custom)
   - 5.4 [Modelos Foundation](#54-modelos-foundation)
6. [Comparación (AWS Bedrock vs Azure Foundry / Google Vertex AI)](#6-comparación-aws-bedrock-vs-azure-foundry--google-vertex-ai)
7. [Prompt Optimization](#7-prompt-optimization)
8. [Preguntas frecuentes](#8-preguntas-frecuentes)
9. [Glosario](#9-glosario)

---

## 1. Introducción

El módulo **Amazon Bedrock** de Cloud Performance analiza el uso que tu organización hace de los **modelos de IA** de **Amazon Bedrock**. Con él puedes:

- Ver cuánto has pagado por cada **modelo**, ya sea un modelo base (*foundation*), un **modelo custom** o un modelo usado a través de un **inference profile**, separado en tokens de **entrada** y **salida**.
- Consultar las **tarifas** de cada modelo por 1.000 y por 1.000.000 de tokens.
- **Comparar** el costo de tu uso con **modelos equivalentes** de otros proveedores.
- Estimar cuánto costaría tu consumo en **Azure Foundry** o en **Google Vertex AI**, modelo por modelo y recurso por recurso.
- **Optimizar tus prompts**: comprimir un prompt para que use menos tokens y ver cuánto ahorrarías en cada llamada.

> 🖼️ **Captura pendiente:** Vista general del módulo Amazon Bedrock con el menú lateral abierto.
> *Archivo sugerido:* `img/bedrock/00-vista-general.png`

---

## 2. Antes de comenzar

### 2.1 Cómo ingresar al módulo

1. Inicia sesión en Cloud Performance con tu usuario y contraseña.
2. Abre el menú de usuario (tu nombre, en la esquina superior derecha) y selecciona **Perfil**.
3. En el menú lateral del perfil, haz clic en **Servicios IA**. Verás la pantalla **Nubes registradas**.
4. Haz clic en la tarjeta **Amazon Bedrock**.
   - Si tu organización tiene **más de una cuenta de AWS**, la tarjeta muestra un selector **Cuenta:**. Primero elige la cuenta (opción *Seleccione una cuenta...*) y luego haz clic en la tarjeta. Mientras no elijas una cuenta, la tarjeta se ve en gris y no permite ingresar.
5. Se abrirá la página de **Inicio** del módulo.

> 🖼️ **Captura pendiente:** Pantalla "Nubes registradas" de Servicios IA con la tarjeta Amazon Bedrock y el selector de cuenta.
> *Archivo sugerido:* `img/bedrock/01-servicios-ia.png`

> 💡 **Consejo:** Para cambiar de cuenta de AWS, vuelve a **Perfil → Servicios IA** y elige otra en la tarjeta de Amazon Bedrock.

### 2.2 Acceso según tu plan

| Plan | Acceso al módulo Amazon Bedrock |
|---|---|
| **Starter (Freemium)** / **Starter** | Sin acceso. Verás un aviso de **acceso denegado** con el nombre de tu plan. |
| **Pro** / **Business** / **Global Access** | Acceso completo a todas las vistas. |

Para ampliar tu acceso, contacta al administrador de tu organización.

### 2.3 Elementos de la pantalla

**Barra superior**

- **Logo Cloud Performance:** te lleva a la página principal.
- **Botón de tema (☀️ / 🌙):** cambia entre modo claro y modo oscuro.
- **Menú de usuario:** acceso a tu **Perfil** y a **Cerrar sesión**.

**Botón de menú lateral**

Ubicado a la izquierda de la barra superior. El menú viene **contraído** al ingresar; haz clic en este botón para abrirlo o cerrarlo.

**Menú lateral**

| Entrada del menú | Descripción breve |
|---|---|
| Inicio | Página de bienvenida del módulo. |
| Costo y Optimización | Costo y tarifas por modelo: inference profiles, modelos custom y modelos foundation. |
| Comparación | Comparación de tu gasto en Bedrock contra Azure Foundry y Google Vertex AI. |
| Prompt Optimization | Compresión de prompts y conteo de tokens. |

---

## 3. Uso general de las vistas

### 3.1 Panel de filtros

Las vistas de **Costo y Optimización** y **Comparación** comparten este panel:

| Filtro | Cómo se usa |
|---|---|
| **Periodo** | Calendario para elegir un rango de fechas: haz clic en la fecha de inicio y luego en la de término. Por defecto, desde **ayer hasta hoy**. |
| **Región** | Lista con buscador. Opción *Todas las Regiones*. En *Comparación* puedes elegir **varias** regiones. |
| **Instancia** | Lista con buscador para elegir **un** elemento: un inference profile, un modelo custom o un modelo foundation, según la vista. La lista depende del período y de la región. |

1. Ajusta los filtros.
2. Presiona **Aplicar Filtros**. La información se actualiza solo al presionar este botón.
3. Para volver a los valores iniciales, presiona **Limpiar Filtros**.

> ⚠️ **Importante:** Todas estas vistas necesitan que elijas un elemento en **Instancia**. Si la lista muestra *Sin instancias en la región/criterios seleccionados*, amplía el período o cambia la región.

> 💡 **Consejo:** Los filtros aplicados quedan guardados en la dirección (URL) de la página. Puedes guardarla en favoritos o compartirla con un colega que tenga acceso.

> 🖼️ **Captura pendiente:** Panel de filtros con Periodo, Región e Instancia.
> *Archivo sugerido:* `img/bedrock/02-panel-filtros.png`

### 3.2 Mensajes que puedes encontrar

| Mensaje | Significado y qué hacer |
|---|---|
| **No se ha seleccionado ningún perfil / modelo / modelo custom.** | Elige un elemento en el filtro **Instancia** y presiona **Aplicar Filtros**. |
| **Sin instancias en la región/criterios seleccionados** | No hay elementos para el período y la región elegidos. Amplía el período o elige *Todas las Regiones*. |
| **Sin datos para mostrar** | No hay consumo para el elemento elegido en el período. Amplía el período. |
| **Error al cargar datos** | Hubo un problema al obtener la información. Intenta nuevamente o ajusta el rango de fechas. Si persiste, contacta a soporte. |

---

## 4. Inicio

**Menú:** Inicio

Es la primera pantalla al ingresar al módulo (**Dashboard Amazon Bedrock**). Muestra el encabezado del módulo. Usa el **menú lateral** para ir a cada vista.

> 🖼️ **Captura pendiente:** Página de Inicio del módulo Amazon Bedrock.
> *Archivo sugerido:* `img/bedrock/03-inicio.png`

---

## 5. Costo y Optimización

**Menú:** Costo y Optimización

Pantalla de acceso a las vistas de costo. Tiene tres tarjetas; haz clic en **Acceder** en la que necesites:

| Tarjeta | Qué analiza |
|---|---|
| **Inference Profiles** | Modelos usados a través de un inference profile. |
| **Modelos Custom** | Modelos personalizados (por ejemplo, ajustados con tus datos). |
| **Modelos Foundation** | Modelos base de Bedrock usados directamente. |

> 🖼️ **Captura pendiente:** Pantalla "Costo y Optimización" con las tres tarjetas.
> *Archivo sugerido:* `img/bedrock/04-costo-optimizacion.png`

Las tres vistas tienen los mismos **filtros** (Periodo · Región · Instancia; ver [3.1](#31-panel-de-filtros)) y muestran el mismo tipo de **tarjeta de costo**, que se describe a continuación.

### 5.1 Tarjeta de costo de un modelo

Cada vista muestra **una tarjeta por modelo** del elemento elegido. Cada tarjeta incluye:

1. **Encabezado:** proveedor y nombre del modelo (por ejemplo, *Anthropic - Claude 3.5 Sonnet*), el identificador del elemento analizado y la **región**.

2. **Tokens entrada** y **Tokens salida:** cantidad de tokens consumidos en el período.

3. **Costo total:** costo del período, con el detalle de **Entrada** y **Salida**.

4. **Tarifas:** precio del modelo **por 1K** y **por 1M** de tokens para:
   - Entrada.
   - Salida.
   - Lectura de caché.
   - Escritura de caché.

5. **Comparación de costos** (sección desplegable; haz clic para abrirla): costo estimado de tu mismo uso si se ejecutara en **modelos equivalentes de otros proveedores**.
   - **Modelo actual:** tu modelo y su costo total, como referencia.
   - Por cada modelo alternativo:
     - Nombre y proveedor.
     - Etiqueta con la **diferencia porcentual**: en **verde** con flecha hacia abajo si es más barato; en **rojo** con flecha hacia arriba si es más caro.
     - **Costo estimado**, con su detalle de entrada y salida.
     - Aviso **Comparación parcial: sin tarifa para…** cuando el modelo alternativo no tiene precio para algún concepto; en ese caso, el costo estimado está incompleto.

6. **Pie de la tarjeta:** el **Modelo** y el elemento analizado (**Perfil**, **Modelo Custom** o **Modelo Foundation**, según la vista).

> 🖼️ **Captura pendiente:** Tarjeta de costo de un modelo con tokens, costo total, tarifas y la comparación de costos abierta.
> *Archivo sugerido:* `img/bedrock/05-tarjeta-costo.png`

**Cómo usar estas vistas**

1. Elige el **Periodo** y la **Región**.
2. En **Instancia**, elige el elemento que quieres analizar.
3. Presiona **Aplicar Filtros**.
4. Revisa si el costo viene más de la **entrada** o de la **salida**. Si viene de la entrada, la [optimización de prompts](#7-prompt-optimization) puede ayudarte.
5. Revisa las **Tarifas**: las de caché suelen ser más bajas que las de entrada normal.
6. Abre **Comparación de costos** para ver si hay modelos equivalentes más económicos.

### 5.2 Inference Profiles

**Menú:** Costo y Optimización → Inference Profiles

Título de la vista: **Costo y Optimización Modelos en Inference Profiles**. En **Instancia** eliges un **inference profile**. La tarjeta muestra bajo el nombre del modelo el nombre del perfil, y en el pie, el **Perfil**.

> 🖼️ **Captura pendiente:** Vista Inference Profiles con su tarjeta de costo.
> *Archivo sugerido:* `img/bedrock/06-inference-profiles.png`

### 5.3 Modelos Custom

**Menú:** Costo y Optimización → Modelos Custom

Título de la vista: **Costo y Optimización Modelos Custom**. En **Instancia** eliges un **modelo custom**. La tarjeta muestra el identificador (ARN) del modelo custom bajo el nombre, y lo repite en el pie como **Modelo Custom**.

> 🖼️ **Captura pendiente:** Vista Modelos Custom con su tarjeta de costo.
> *Archivo sugerido:* `img/bedrock/07-modelos-custom.png`

### 5.4 Modelos Foundation

**Menú:** Costo y Optimización → Modelos Foundation

Título de la vista: **Costo y Optimización Modelos Foundation**. En **Instancia** eliges un **modelo foundation**. La tarjeta muestra el nombre del modelo foundation bajo el nombre, y lo repite en el pie como **Modelo Foundation**.

> 🖼️ **Captura pendiente:** Vista Modelos Foundation con su tarjeta de costo.
> *Archivo sugerido:* `img/bedrock/08-modelos-foundation.png`

---

## 6. Comparación (AWS Bedrock vs Azure Foundry / Google Vertex AI)

**Menú:** Comparación
**Para qué sirve:** estimar cuánto costaría el consumo de un inference profile de Bedrock si usaras **modelos equivalentes** en **Azure Foundry** o en **Google Vertex AI**, y qué tan confiables son esas equivalencias.

**Filtros:** Periodo · Región (una o varias) · Instancia (inference profile). Ver [3.1](#31-panel-de-filtros).

> ℹ️ **Nota:** Muchos modelos de Bedrock no existen con el mismo nombre en otras nubes. Las equivalencias son **modelos con un perfil y un precio similares**. Úsalas como una guía, no como una promesa de ahorro exacta.

**Encabezado de la selección**

Muestra el nombre del recurso elegido, su identificador, la región y el servicio, junto con:

- **Catálogo Azure Foundry / Google Vertex AI:** cantidad de modelos del catálogo de destino considerados.
- **Métricas Bedrock:** cantidad de registros de métricas analizados.
- **Comparar contra:** botones **Azure** y **GCP** para cambiar la nube de destino. Toda la vista se actualiza al cambiar.

**Tarjetas de resumen**

| Tarjeta | Qué indica |
|---|---|
| **Costo AWS Bedrock** | Costo del período y cantidad de modelos medidos. |
| **Proyección Azure Foundry / Google Vertex AI** | Costo estimado en la nube de destino y qué porcentaje del gasto pudo compararse (*Cobertura*). |
| **Diferencia estimada** | Diferencia en USD y en porcentaje entre la proyección y el costo en Bedrock. |
| **Recursos** | Cantidad de recursos (inference profiles o despliegues) y cuántos están **sin consumo**. |
| **Modelos sin equivalencia** | Modelos sin un equivalente confiable en la nube de destino. Se valorizan a su costo en AWS Bedrock. |

Si hay consumos que no se pudieron asignar a un modelo, verás un aviso ámbar **N métricas sin resolver por US$X**, con la lista de esas métricas. Ese gasto queda **fuera de la proyección**.

La vista se organiza en cinco secciones numeradas:

**1. Comparación de costos — ¿Cuánto costaría lo mismo en Azure Foundry / Google Vertex AI?**

- A la izquierda: **AWS Bedrock, hoy** (costo medido), **Proyección** en la nube de destino y la diferencia en porcentaje y USD (verde si es ahorro, rojo si es mayor costo).
- A la derecha: un ranking por modelo con barras de **diferencia porcentual**. Las barras verdes, hacia la izquierda, son ahorro; las rojas, hacia la derecha, son mayor costo. Junto a cada barra aparece el modelo recomendado. El ranking usa porcentajes para que modelos de costos muy distintos se comparen en la misma escala.
- Los modelos sin candidato recomendado aparecen como **Sin equivalencia**.

**2. Composición del consumo — ¿Por qué cuesta lo que cuesta?**

- Una barra por modelo, dividida en **Entrada**, **Caché lectura**, **Caché escritura** y **Salida**.
- Botones **Tokens** y **Costo** para ver la proporción de volumen o de gasto.
- Indicador **Caché:** qué porcentaje del total corresponde a caché.
- Cuando el volumen y el gasto de un concepto no se parecen, aparece un **consejo** (💡) que indica el modelo a revisar primero.

**3. Detalle por modelo — consumo, precio y mejor alternativa**

Una tarjeta por modelo medido, con:

- Nombre, proveedor, clase y tipo de recurso; identificador del modelo; región de AWS → región del candidato.
- Costo en AWS, tokens totales y precio promedio por millón de tokens.
- Barras comparativas **AWS** vs **Azure/GCP** (cada tarjeta usa su propia escala).
- Una fila por tipo de consumo: tokens, precio por millón en AWS y en destino, costo en AWS y diferencia. El ícono ⚠️ indica que se usó una tarifa aproximada.
- **Modelo recomendado:** nombre, proveedor, porcentaje de equivalencia, nivel de confianza (**Alta**, **Media** o **Baja**), costo proyectado, diferencia y la justificación. Debajo: candidatos evaluados y recursos (y cuántos están inactivos). Si el modelo de Bedrock no está activo, se indica su **Ciclo de vida** (por ejemplo, un modelo en proceso de retiro).
- Si ningún candidato es suficientemente parecido, verás *"Ningún candidato supera el umbral mínimo de equivalencia"*.

**4. Confianza de la equivalencia — ¿Qué tan confiables son estas equivalencias?**

Lista de **todos los candidatos evaluados** para cada modelo, con el recomendado primero (★):

- Proveedor y región del candidato.
- Barra de **equivalencia** (verde: confianza alta; ámbar: media; gris: baja), con una marca en el **umbral mínimo de 50 %**.
- Diferencia porcentual y costo proyectado.
- Nivel de confianza y, si corresponde, la etiqueta **No elegible**. Los candidatos no elegibles se ven atenuados.

> 💡 **Consejo:** "Recomendado" no significa "el más barato". El recomendado equilibra precio y equivalencia; un candidato más barato pero con baja equivalencia podría no servir para tu caso.

**5. Infraestructura — ¿Dónde vive este consumo?**

Tabla **Recursos de la selección**, con buscador (*Buscar recurso...*):

| Columna | Qué indica |
|---|---|
| **Recurso** | Nombre e identificador del inference profile o despliegue. |
| **Modelo** | Modelo y su identificador. |
| **Tipo** | Tipo de recurso y variante de precio. |
| **Región** | Ubicación del recurso. |
| **Tokens entrada** / **Tokens salida** | Tokens consumidos en el período. |
| **Participación** | Proporción de tokens del recurso sobre el total del modelo. |
| **Costo asignado** | Costo medido del modelo repartido según esa participación. |
| **Estado** | Por ejemplo, *Inactivo*: recurso aprovisionado sin tokens en el período. |

**Cómo usarla**

1. Elige el **Periodo**, la **Región** y el **inference profile** en *Instancia*, y presiona **Aplicar Filtros**.
2. En **Comparar contra**, elige **Azure** o **GCP**.
3. Revisa la **Diferencia estimada** y la **Cobertura**: una cobertura baja indica que buena parte del gasto no pudo compararse.
4. En la sección 1, identifica los modelos con mayor ahorro potencial.
5. En las secciones 3 y 4, confirma que el modelo recomendado tenga confianza **Alta** o **Media**.
6. En la sección 5, busca recursos **inactivos**.

> 🖼️ **Captura pendiente:** Encabezado de la selección y tarjetas de resumen, con el selector "Comparar contra".
> *Archivo sugerido:* `img/bedrock/09-comparacion-resumen.png`

> 🖼️ **Captura pendiente:** Secciones 1 y 2: comparación de costos y composición del consumo.
> *Archivo sugerido:* `img/bedrock/10-comparacion-costos-mezcla.png`

> 🖼️ **Captura pendiente:** Sección 3: tarjeta de detalle de un modelo con su recomendado.
> *Archivo sugerido:* `img/bedrock/11-comparacion-detalle-modelo.png`

> 🖼️ **Captura pendiente:** Secciones 4 y 5: confianza de candidatos y tabla de recursos.
> *Archivo sugerido:* `img/bedrock/12-comparacion-confianza-recursos.png`

---

## 7. Prompt Optimization

**Menú:** Prompt Optimization
**Para qué sirve:** reducir la cantidad de tokens de un prompt. En Amazon Bedrock se paga por **tokens**, no por prompt, por lo que un prompt más corto reduce el costo de **cada llamada**.

La vista se titula **Optimización de Prompts**. No usa el panel de filtros general; tiene su propio formulario.

**Formulario: Prompt a optimizar**

| Campo | Cómo se usa |
|---|---|
| **Modelo** | Lista con buscador (*Buscar por modelo o proveedor...*) de los modelos de Bedrock, agrupados por proveedor (por ejemplo, Anthropic, Meta, Mistral AI, Cohere) y *Otros proveedores*. La cantidad de tokens depende del modelo, así que el mismo prompt puede dar conteos distintos. |
| **Objetivo de compresión** | **Porcentaje** o **Máximo de tokens**. |
| **Porcentaje objetivo** | Si elegiste *Porcentaje*: barra deslizante de 5 % a 95 % (por defecto, 50 %). Indica qué proporción de los tokens originales conservará el prompt optimizado. |
| **Máximo de tokens** | Si elegiste *Máximo de tokens*: escribe un número entero (por ejemplo, *500*). El prompt optimizado no superará esa cantidad. |
| **Filtro a nivel de contexto** | Descarta los fragmentos menos relevantes antes de comprimir. Activado por defecto. |
| **Filtro a nivel de token** | Elimina los tokens que menos aportan dentro de cada fragmento. |
| **Cuadro de texto** | Pega el prompt completo: texto plano, JSON o cualquier otro formato. Se envía completo, sin recortes. Debajo se muestra la cantidad de **caracteres** y **líneas**. |

> ℹ️ **Nota:** Los dos filtros son **excluyentes**: al activar uno, el otro se desactiva automáticamente.

**Botones**

- **Optimizar prompt:** se habilita cuando hay un modelo elegido, un prompt escrito y un objetivo válido. Mientras procesa, muestra *Optimizando...*. También puedes usar el atajo **Ctrl + Enter** (**⌘ + Enter** en Mac) dentro del cuadro de texto.
- **Limpiar:** borra el prompt y el resultado.

**Resultado**

1. **Tarjetas de resumen:**

   | Tarjeta | Qué indica |
   |---|---|
   | **Tokens originales** | Tokens del prompt original, sus caracteres y su costo estimado. |
   | **Tokens optimizados** | Tokens del prompt optimizado, sus caracteres y su costo estimado. |
   | **Tokens ahorrados** | Diferencia de tokens. Si la compresión no redujo el prompt, se muestra como **Tokens agregados** (en rojo). |
   | **Reducción** | Porcentaje de reducción sobre el total de tokens originales. |
   | **Ahorro estimado** | Diferencia de costo por llamada. Si no hay precio para el modelo, indica *Sin precio disponible para este modelo*. |
   | **Codificación** | Tokenizador usado y modelo elegido. |

2. **Desglose de tokens — ¿Qué se recortó del prompt?** Dos paneles lado a lado:
   - **Prompt original:** lo que escribiste, dividido en tokens.
   - **Prompt optimizado:** el resultado comprimido, con cuántos tokens menos tiene.

   Cada panel muestra la cantidad de tokens, el costo estimado, los caracteres y un botón **Copiar** para llevar el texto al portapapeles.

   - **Mostrar como:** **Texto** muestra cada token como un bloque de color (los colores solo marcan dónde empieza y termina cada token); **IDs de token** muestra los identificadores numéricos.
   - **Pasa el cursor** sobre un bloque para ver su posición y su ID.
   - En prompts muy largos, usa **Mostrar N tokens más** para seguir viendo el contenido.

> ⚠️ **Importante:** La compresión sacrifica legibilidad para bajar el conteo de tokens, por lo que el prompt optimizado se lee entrecortado. **Revísalo y pruébalo** antes de usarlo en producción.

> 💡 **Consejo:** Si cambias el modelo, el objetivo o los filtros después de optimizar, verás el aviso *"El resultado corresponde a otra configuración"*. Presiona **Optimizar prompt** de nuevo para actualizar el resultado.

**Cómo usarla**

1. Elige el **Modelo** que usas en producción.
2. Define el **Objetivo de compresión** (por ejemplo, conservar el 50 % de los tokens).
3. Pega tu prompt en el cuadro de texto.
4. Presiona **Optimizar prompt**.
5. Revisa la **Reducción** y el **Ahorro estimado**, y compara ambos paneles para ver qué se eliminó.
6. Si el resultado te sirve, usa **Copiar** en el panel del prompt optimizado.

> 🖼️ **Captura pendiente:** Formulario "Prompt a optimizar" con modelo, objetivo, filtros y prompt.
> *Archivo sugerido:* `img/bedrock/13-prompt-formulario.png`

> 🖼️ **Captura pendiente:** Tarjetas de resumen y paneles "Prompt original" y "Prompt optimizado".
> *Archivo sugerido:* `img/bedrock/14-prompt-resultado.png`

---

## 8. Preguntas frecuentes

**No veo información después de cambiar los filtros.**
Recuerda presionar **Aplicar Filtros**. Los cambios no se aplican automáticamente.

**El filtro Instancia dice "Sin instancias en la región/criterios seleccionados".**
No hay inference profiles o modelos con consumo para el período y la región elegidos. Amplía el período o elige *Todas las Regiones*.

**¿Cuál de las tres vistas de costo debo usar?**
Depende de cómo llamas al modelo: si usas un **inference profile**, revisa *Inference Profiles*; si usas un modelo que **ajustaste con tus datos**, *Modelos Custom*; si llamas directamente a un **modelo base** de Bedrock, *Modelos Foundation*.

**¿Qué puedo elegir en el filtro Instancia de la vista Comparación?**
Solo **inference profiles**. Para revisar el costo de modelos custom o foundation, usa las vistas de *Costo y Optimización*.

**¿Qué significa la "Confianza" de un modelo alternativo?**
Indica qué tan parecido es el modelo alternativo al tuyo. No es una garantía de que funcionará igual en tu caso; pruébalo antes de cambiar.

**¿Qué es la "Cobertura" en la vista Comparación?**
Es el porcentaje de tu gasto en Bedrock que pudo compararse con la nube de destino. El resto corresponde a modelos sin equivalencia o a consumos que no se pudieron asignar.

**¿La optimización de prompts modifica algo en mi cuenta de AWS?**
No. Solo procesa el texto que pegas y te muestra el resultado; no cambia ningún recurso.

**¿Por qué el mismo prompt da distinta cantidad de tokens con otro modelo?**
Cada modelo usa su propio tokenizador, que divide el texto de forma diferente.

---

## 9. Glosario

| Término | Definición |
|---|---|
| **Amazon Bedrock** | Servicio de AWS para usar modelos de IA de distintos proveedores. |
| **ARN** | Identificador único de un recurso en AWS. |
| **Azure Foundry** | Plataforma de Microsoft para desplegar y usar modelos de IA (Microsoft Foundry). |
| **Caché (lectura / escritura)** | Tokens que el modelo reutiliza de llamadas anteriores (lectura) o que guarda para reutilizar (escritura); suelen tener otro precio. |
| **Candidato** | Modelo de otra nube evaluado como posible equivalente de tu modelo. |
| **Ciclo de vida** | Estado de disponibilidad de un modelo en Bedrock (por ejemplo, activo o en retiro). |
| **Cobertura** | Porcentaje del gasto que pudo compararse con la nube de destino. |
| **Confianza** | Indicador de qué tan parecido es un modelo alternativo al tuyo. |
| **Entrada (input)** | Tokens que envías al modelo (el prompt). |
| **Equivalencia** | Grado de similitud entre tu modelo y un candidato; bajo el 50 % no se considera equivalente. |
| **Google Vertex AI** | Servicio de modelos de IA de Google Cloud. |
| **Inference profile** | Recurso de Bedrock que define cómo y en qué regiones se invoca un modelo; permite seguir su consumo y su costo. |
| **Modelo custom** | Modelo de Bedrock personalizado, por ejemplo, ajustado con tus propios datos. |
| **Modelo foundation** | Modelo base que ofrece Bedrock, sin personalizar. |
| **Prompt** | Texto o instrucciones que se envían al modelo. |
| **Salida (output)** | Tokens que el modelo genera como respuesta. |
| **Token** | Unidad mínima de texto que procesa un modelo; puede ser una palabra, parte de una palabra o un signo. |
| **Tokenizador / Codificación** | Método que usa cada modelo para dividir el texto en tokens. |
