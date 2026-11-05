# Manual de Usuario — Cloud Performance

## Módulo Servicios IA: Google Vertex AI

> **Versión del documento:** 1.0 · **Módulo:** Servicios IA — Google Vertex AI
> **Dirigido a:** usuarios finales de Cloud Performance que usan modelos de IA en Google Vertex AI y quieren entender su costo, compararlo con otras nubes y reducir el consumo de tokens.

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
   - 5.1 [Modelos Vertex AI](#51-modelos-vertex-ai)
6. [Comparación (Google Vertex AI vs AWS Bedrock / Azure Foundry)](#6-comparación-google-vertex-ai-vs-aws-bedrock--azure-foundry)
7. [Prompt Optimization](#7-prompt-optimization)
8. [Preguntas frecuentes](#8-preguntas-frecuentes)
9. [Glosario](#9-glosario)

---

## 1. Introducción

El módulo **Google Vertex AI** de Cloud Performance analiza el uso que tu organización hace de los **modelos de IA** de **Vertex AI** en Google Cloud. Con él puedes:

- Ver el consumo de tokens de cada **modelo** y **endpoint**, y comparar el **costo real facturado** con el **costo estimado a precio de catálogo**.
- Revisar el detalle de la facturación de Vertex AI por **SKU**.
- **Simular** cuánto costaría el mismo consumo con **modelos equivalentes**, con un indicador de **confiabilidad** de cada alternativa.
- **Comparar** tu gasto en Vertex AI con lo que costaría en **AWS Bedrock** o **Azure Foundry**, modelo por modelo y endpoint por endpoint.
- **Optimizar tus prompts**: comprimir un prompt para que use menos tokens y ver cuánto ahorrarías en cada llamada.

> 🖼️ **Captura pendiente:** Vista general del módulo Google Vertex AI con el menú lateral abierto.
> *Archivo sugerido:* `img/vertex/00-vista-general.png`

---

## 2. Antes de comenzar

### 2.1 Cómo ingresar al módulo

1. Inicia sesión en Cloud Performance con tu usuario y contraseña.
2. Abre el menú de usuario (tu nombre, en la esquina superior derecha) y selecciona **Perfil**.
3. En el menú lateral del perfil, haz clic en **Servicios IA**. Verás la pantalla **Nubes registradas**.
4. Haz clic en la tarjeta **Vertex AI**.
   - Si tu organización tiene **más de una cuenta de GCP**, la tarjeta muestra un selector **Proyecto:**. Primero elige la cuenta (opción *Seleccione una cuenta...*) y luego haz clic en la tarjeta. Mientras no elijas una cuenta, la tarjeta se ve en gris y no permite ingresar.
5. Se abrirá la página de **Inicio** del módulo.

> 🖼️ **Captura pendiente:** Pantalla "Nubes registradas" de Servicios IA con la tarjeta Vertex AI y el selector de proyecto.
> *Archivo sugerido:* `img/vertex/01-servicios-ia.png`

> 💡 **Consejo:** Para cambiar de cuenta de GCP, vuelve a **Perfil → Servicios IA** y elige otra en la tarjeta de Vertex AI.

### 2.2 Acceso según tu plan

| Plan | Acceso al módulo Google Vertex AI |
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
| Costo y Optimización | Costo real y de catálogo por modelo, y simulación con modelos equivalentes. |
| Comparación | Comparación de tu gasto en Vertex AI contra AWS Bedrock y Azure Foundry. |
| Prompt Optimization | Compresión de prompts y conteo de tokens. |

---

## 3. Uso general de las vistas

### 3.1 Panel de filtros

Las vistas **Modelos Vertex AI** y **Comparación** comparten este panel:

| Filtro | Cómo se usa |
|---|---|
| **Período** | Calendario para elegir un rango de fechas: haz clic en la fecha de inicio y luego en la de término. Por defecto, desde **ayer hasta hoy**. |
| **Proyectos** | Lista con buscador para elegir uno o varios proyectos de GCP. Opción inicial *Todos los Proyectos*. |
| **Regiones** | Lista con buscador para elegir una o varias regiones. Opción inicial *Todas las Regiones*. |
| **Recurso** | Lista con buscador de los **endpoints** de Vertex AI. Viene con **todos seleccionados** (*Todos los Recursos*). En *Modelos Vertex AI* puedes marcar varios con *Seleccionar todos* / *Deseleccionar todos* o uno por uno; en *Comparación* eliges uno. La lista depende del proyecto y la región. |

1. Ajusta los filtros.
2. Presiona **Aplicar**. La información se actualiza solo al presionar este botón.
3. Para volver a los valores iniciales, presiona **Limpiar**.

> 💡 **Consejo:** Los filtros aplicados quedan guardados en la dirección (URL) de la página. Puedes guardarla en favoritos o compartirla con un colega que tenga acceso.

> 🖼️ **Captura pendiente:** Panel de filtros con Período, Proyectos, Regiones y Recurso.
> *Archivo sugerido:* `img/vertex/02-panel-filtros.png`

### 3.2 Mensajes que puedes encontrar

| Mensaje | Significado y qué hacer |
|---|---|
| **Sin recursos** (en el filtro *Recurso*) | No hay endpoints de Vertex AI para el proyecto y la región elegidos. Cambia el proyecto o la región. |
| **Sin datos para mostrar** | No hay consumo de Vertex AI para los filtros y el período elegidos. Amplía el período o revisa los filtros. |
| **Error al cargar datos** | Hubo un problema al obtener la información. Intenta nuevamente o ajusta los filtros. Si persiste, contacta a soporte. |

---

## 4. Inicio

**Menú:** Inicio

Es la primera pantalla al ingresar al módulo (**Dashboard Google Vertex**). Muestra el encabezado del módulo. Usa el **menú lateral** para ir a cada vista.

> 🖼️ **Captura pendiente:** Página de Inicio del módulo Google Vertex AI.
> *Archivo sugerido:* `img/vertex/03-inicio.png`

---

## 5. Costo y Optimización

**Menú:** Costo y Optimización

Pantalla de acceso a las vistas de costo. Haz clic en **Acceder** en la tarjeta **Modelos Vertex AI**.

> 🖼️ **Captura pendiente:** Pantalla "Costo y Optimización" con la tarjeta Modelos Vertex AI.
> *Archivo sugerido:* `img/vertex/04-costo-optimizacion.png`

### 5.1 Modelos Vertex AI

**Menú:** Costo y Optimización → Modelos Vertex AI
**Para qué sirve:** conocer el consumo y el costo de cada modelo de Vertex AI, comparar lo facturado con el precio de catálogo y simular cuánto costaría el mismo consumo con modelos equivalentes.

**Filtros:** Período · Proyectos · Regiones · Recurso (endpoints, varios). Ver [3.1](#31-panel-de-filtros).

**Qué muestra**

El título de la vista es **Costo y Optimización Google Vertex AI**. Debajo verás **una tarjeta por modelo**, ordenadas de **mayor a menor costo**. Cada tarjeta incluye:

1. **Encabezado:**
   - **Proveedor y nombre** del modelo (por ejemplo, *Google - gemini-2.5-pro*).
   - **Estrellas** (1 a 5) y **nivel** del modelo, cuando hay información de perfil. Algunos modelos incluyen además una breve descripción.
   - **Endpoint** donde se usa el modelo.
   - **Región**, o *global* si el modelo se usa a nivel global.

2. **Tokens:** cuatro indicadores: **Tokens entrada**, **Tokens salida**, **Tokens cache** (entrada reutilizada de llamadas anteriores) y **Tokens total**.

3. **Costos:**
   - **Costo billing real:** lo que efectivamente se facturó, según la exportación de facturación de GCP. Debajo se muestra el costo **Bruto** (antes de créditos y descuentos). Si no se encontró la facturación del recurso, indica *Sin match*.
   - **Costo estimado catálogo:** lo que costarían los mismos tokens a precio de lista.
   - **Diferencia billing vs catálogo:** cuánto más o menos se pagó realmente frente al precio de lista (en monto y porcentaje). En **verde**, se pagó menos; en **rojo**, se pagó más.
   - **Tarifas de catálogo aplicadas:** por cada concepto (entrada, salida, entrada cacheada), la tarifa por millón de tokens, su descripción y el costo resultante.

4. **Detalle de métricas y facturación Vertex** (sección desplegable):
   - **Modelo base** del endpoint.
   - **Throughput consumido**, cuando el modelo se mide por capacidad y no por tokens.
   - **Facturación real por billing export:** por concepto, el costo, la cantidad, la tarifa neta, el SKU y el costo bruto. Si no hay facturación para el recurso, se indica que se mantiene el cálculo estimado por catálogo.
   - **Comparación catálogo vs billing:** por concepto, tokens, costo a catálogo, costo facturado, tarifa facturada y la diferencia.
   - **SKUs facturados:** cada concepto facturado, con su costo, tipo de uso, SKU, región de la API, cantidad y créditos aplicados, si los hay.

5. **Simulación de costos** (sección desplegable): estima cuánto costaría tu operación con **modelos equivalentes** en Google Vertex AI, con tu mismo consumo.
   - **Modelo actual:** tu modelo y su costo de referencia (el costo real facturado si existe; si no, el costo de catálogo).
   - **Ordenar modelos** (cuando hay más de una alternativa): *Mayor ahorro*, *Mayor confiabilidad* o *Confiabilidad + ahorro*.
   - Por cada modelo alternativo:
     - Nombre, proveedor, estrellas, nivel y descripción.
     - Etiqueta con la **diferencia porcentual**: en **verde** con flecha hacia abajo si es más barato; en **rojo** con flecha hacia arriba si es más caro.
     - **Confiabilidad del modelo:** nivel (**Alta**, **Media** o **Baja**) y porcentaje de similitud con tu modelo actual. No es una probabilidad de éxito. Si dice *Sin datos suficientes*, no hay información para calcularla.
     - **Desglose simulado:** tarifa y costo estimado por concepto.
     - **Ahorro proyectado** (verde) o **Costo adicional** (rojo), y el **Costo estimado** total.
     - Avisos, cuando corresponda:
       - **Comparación parcial: sin tarifa para…** El modelo alternativo no tiene precio para algún concepto; el costo estimado está incompleto.
       - **Faltan capacidades:** el modelo alternativo no soporta alguna capacidad que usa tu modelo actual.
       - **Riesgo de equivalencia:** el límite de tokens por minuto (TPM) del alternativo es distinto al de tu modelo actual.

6. Si al modelo le falta la tarifa de algún concepto, verás el aviso **Estimación parcial: sin tarifa para…**: el costo estimado a catálogo está incompleto.

7. **Pie de la tarjeta:** **Versión modelo** y **Proyecto**.

**Cómo usarla**

1. Elige el **Período**, los **Proyectos** y las **Regiones**. Si quieres, limita el análisis a ciertos endpoints en **Recurso**.
2. Presiona **Aplicar**.
3. Revisa las primeras tarjetas: son los modelos que más te cuestan.
4. Compara el **Costo billing real** con el **Costo estimado catálogo** para ver el efecto de tus descuentos o créditos.
5. Si el costo viene sobre todo de la **entrada**, la [optimización de prompts](#7-prompt-optimization) puede ayudarte. Un alto volumen de **Tokens cache** suele abaratar la entrada.
6. Abre **Simulación de costos** y ordena por **Confiabilidad + ahorro** para ver alternativas baratas y a la vez similares a tu modelo.

> 🖼️ **Captura pendiente:** Tarjeta de un modelo con tokens, costo billing real, costo de catálogo y tarifas aplicadas.
> *Archivo sugerido:* `img/vertex/05-modelo-costo.png`

> 🖼️ **Captura pendiente:** Sección "Detalle de métricas y facturación Vertex" abierta.
> *Archivo sugerido:* `img/vertex/06-detalle-facturacion.png`

> 🖼️ **Captura pendiente:** Sección "Simulación de costos" abierta, con el selector "Ordenar modelos" y la confiabilidad.
> *Archivo sugerido:* `img/vertex/07-simulacion-costos.png`

---

## 6. Comparación (Google Vertex AI vs AWS Bedrock / Azure Foundry)

**Menú:** Comparación
**Para qué sirve:** estimar cuánto costaría tu consumo de Vertex AI si usaras **modelos equivalentes** en **AWS Bedrock** o en **Azure Foundry**, y qué tan confiables son esas equivalencias.

**Filtros:** Período · Proyectos · Regiones · Recurso (endpoint). Ver [3.1](#31-panel-de-filtros).

> ℹ️ **Nota:** Muchos modelos de Vertex AI no existen con el mismo nombre en otras nubes. Las equivalencias son **modelos con un perfil y un precio similares**. Úsalas como una guía, no como una promesa de ahorro exacta.

**Encabezado de la selección**

Muestra el proyecto, la región y el servicio analizados, junto con:

- **Catálogo AWS Bedrock / Azure Foundry:** cantidad de modelos del catálogo de destino considerados.
- **Métricas Vertex:** cantidad de registros de métricas analizados.
- **Comparar contra:** botones **AWS** y **Azure** para cambiar la nube de destino. Toda la vista se actualiza al cambiar.

**Tarjetas de resumen**

| Tarjeta | Qué indica |
|---|---|
| **Costo GCP Vertex AI** | Costo del período y cantidad de modelos medidos. |
| **Proyección AWS Bedrock / Azure Foundry** | Costo estimado en la nube de destino y qué porcentaje del gasto pudo compararse (*Cobertura*). |
| **Diferencia estimada** | Diferencia en USD y en porcentaje entre la proyección y el costo en Vertex AI. |
| **Endpoints** | Cantidad de endpoints y cuántos están **sin consumo**. |
| **Modelos sin equivalencia** | Modelos sin un equivalente confiable en la nube de destino. Se valorizan a su costo en GCP Vertex AI. |

Si hay consumos que no se pudieron asignar a un modelo, verás un aviso ámbar **N métricas sin resolver por US$X**, con la lista de esas métricas. Ese gasto queda **fuera de la proyección**.

La vista se organiza en cinco secciones numeradas:

**1. Comparación de costos — ¿Cuánto costaría lo mismo en AWS Bedrock / Azure Foundry?**

- A la izquierda: **GCP Vertex AI, hoy** (costo medido), **Proyección** en la nube de destino y la diferencia en porcentaje y USD (verde si es ahorro, rojo si es mayor costo).
- A la derecha: un ranking por modelo con barras de **diferencia porcentual**. Las barras verdes, hacia la izquierda, son ahorro; las rojas, hacia la derecha, son mayor costo. Junto a cada barra aparece el modelo recomendado. El ranking usa porcentajes para que modelos de costos muy distintos se comparen en la misma escala.
- Los modelos sin candidato recomendado aparecen como **Sin equivalencia**.

**2. Composición del consumo — ¿Por qué cuesta lo que cuesta?**

- Una barra por modelo, dividida en **Entrada**, **Caché lectura**, **Caché escritura** y **Salida**.
- Botones **Tokens** y **Costo** para ver la proporción de volumen o de gasto.
- Indicador **Caché:** qué porcentaje del total corresponde a caché.
- Cuando el volumen y el gasto de un concepto no se parecen, aparece un **consejo** (💡) que indica el modelo a revisar primero.

**3. Detalle por modelo — consumo, precio y mejor alternativa**

Una tarjeta por modelo medido, con:

- Nombre, versión, clase y tipo de endpoint; región de GCP → región del candidato.
- Costo en GCP, tokens totales y precio promedio por millón de tokens.
- Barras comparativas **GCP Vertex AI** vs **AWS/Azure** (cada tarjeta usa su propia escala).
- Una fila por tipo de consumo: tokens, precio por millón en GCP y en destino, costo en GCP y diferencia. El ícono ⚠️ indica que se usó una tarifa aproximada.
- **Modelo recomendado:** nombre, proveedor, porcentaje de equivalencia, nivel de confianza (**Alta**, **Media** o **Baja**), costo proyectado, diferencia y la justificación. Debajo: candidatos evaluados, endpoints (y cuántos están inactivos) y la **fecha de retiro** del modelo, si existe.
- Si ningún candidato es suficientemente parecido, verás *"Ningún candidato supera el umbral mínimo de equivalencia"*.

**4. Confianza de la equivalencia — ¿Qué tan confiables son estas equivalencias?**

Lista de **todos los candidatos evaluados** para cada modelo, con el recomendado primero (★):

- Proveedor y región del candidato.
- Barra de **equivalencia** (verde: confianza alta; ámbar: media; gris: baja), con una marca en el **umbral mínimo de 50 %**.
- Diferencia porcentual y costo proyectado.
- Nivel de confianza y, si corresponde, la etiqueta **No elegible**. Los candidatos no elegibles se ven atenuados.

> 💡 **Consejo:** "Recomendado" no significa "el más barato". El recomendado equilibra precio y equivalencia; un candidato más barato pero con baja equivalencia podría no servir para tu caso.

**5. Infraestructura — ¿Dónde vive este consumo?**

Tabla **Endpoints de la selección**, con buscador (*Buscar endpoint...*). El costo de cada modelo se reparte entre sus endpoints según los tokens observados.

| Columna | Qué indica |
|---|---|
| **Endpoint** | Nombre del endpoint y su proyecto. |
| **Modelo** | Modelo desplegado y su versión. |
| **Tráfico** | Porcentaje del tráfico del endpoint que recibe ese modelo. |
| **Región** | Ubicación del endpoint. |
| **Tokens entrada** / **Tokens salida** | Tokens consumidos en el período. |
| **Participación** | Proporción de tokens del endpoint sobre el total del modelo. |
| **Costo asignado** | Costo medido del modelo repartido según esa participación. |
| **Estado** | **Activo** o **Inactivo** (endpoint aprovisionado sin tokens en el período). |

**Cómo usarla**

1. Elige el **Período**, los **Proyectos**, las **Regiones** y el **endpoint**, y presiona **Aplicar**.
2. En **Comparar contra**, elige **AWS** o **Azure**.
3. Revisa la **Diferencia estimada** y la **Cobertura**: una cobertura baja indica que buena parte del gasto no pudo compararse.
4. En la sección 1, identifica los modelos con mayor ahorro potencial.
5. En las secciones 3 y 4, confirma que el modelo recomendado tenga confianza **Alta** o **Media**.
6. En la sección 5, busca endpoints **inactivos**: son candidatos a eliminar.

> 🖼️ **Captura pendiente:** Encabezado de la selección y tarjetas de resumen, con el selector "Comparar contra".
> *Archivo sugerido:* `img/vertex/08-comparacion-resumen.png`

> 🖼️ **Captura pendiente:** Secciones 1 y 2: comparación de costos y composición del consumo.
> *Archivo sugerido:* `img/vertex/09-comparacion-costos-mezcla.png`

> 🖼️ **Captura pendiente:** Sección 3: tarjeta de detalle de un modelo con su recomendado.
> *Archivo sugerido:* `img/vertex/10-comparacion-detalle-modelo.png`

> 🖼️ **Captura pendiente:** Secciones 4 y 5: confianza de candidatos y tabla de endpoints.
> *Archivo sugerido:* `img/vertex/11-comparacion-confianza-endpoints.png`

---

## 7. Prompt Optimization

**Menú:** Prompt Optimization
**Para qué sirve:** reducir la cantidad de tokens de un prompt. En Google Vertex AI se paga por **tokens**, no por prompt, por lo que un prompt más corto reduce el costo de **cada llamada**.

La vista se titula **Optimización de Prompts**. No usa el panel de filtros general; tiene su propio formulario.

**Formulario: Prompt a optimizar**

| Campo | Cómo se usa |
|---|---|
| **Modelo** | Lista con buscador (*Buscar por modelo o proveedor...*) de los modelos de Vertex AI, agrupados por proveedor (por ejemplo, Anthropic, Meta, Mistral AI) y *Otros proveedores*. La cantidad de tokens depende del modelo, así que el mismo prompt puede dar conteos distintos. |
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
> *Archivo sugerido:* `img/vertex/12-prompt-formulario.png`

> 🖼️ **Captura pendiente:** Tarjetas de resumen y paneles "Prompt original" y "Prompt optimizado".
> *Archivo sugerido:* `img/vertex/13-prompt-resultado.png`

---

## 8. Preguntas frecuentes

**No veo información después de cambiar los filtros.**
Recuerda presionar **Aplicar**. Los cambios no se aplican automáticamente.

**El filtro Recurso dice "Sin recursos".**
No hay endpoints de Vertex AI para el proyecto y la región elegidos. Cambia el proyecto, elige *Todas las Regiones* o amplía el período.

**¿Por qué el "Costo billing real" es distinto del "Costo estimado catálogo"?**
El costo real incluye los descuentos, créditos y acuerdos de tu organización; el de catálogo usa el precio público. La diferencia muestra cuánto te benefician (o no) esas condiciones.

**La tarjeta dice "Sin match" en el costo real.**
No se encontró la facturación de ese recurso en la exportación de facturación de GCP para el período. La tarjeta sigue mostrando el costo estimado a catálogo. Si el aviso persiste, consulta al administrador de tu organización para revisar la exportación de facturación.

**¿Qué significa la "Confiabilidad" o "Confianza" de un modelo alternativo?**
Indica qué tan parecido es el modelo alternativo al tuyo. No es una garantía de que funcionará igual en tu caso; pruébalo antes de cambiar.

**¿Qué es la "Cobertura" en la vista Comparación?**
Es el porcentaje de tu gasto en Vertex AI que pudo compararse con la nube de destino. El resto corresponde a modelos sin equivalencia o a consumos que no se pudieron asignar.

**¿La optimización de prompts modifica algo en mi proyecto de GCP?**
No. Solo procesa el texto que pegas y te muestra el resultado; no cambia ningún recurso.

**¿Por qué el mismo prompt da distinta cantidad de tokens con otro modelo?**
Cada modelo usa su propio tokenizador, que divide el texto de forma diferente.

---

## 9. Glosario

| Término | Definición |
|---|---|
| **AWS Bedrock** | Servicio de modelos de IA de Amazon Web Services. |
| **Azure Foundry** | Plataforma de Microsoft para desplegar y usar modelos de IA (Microsoft Foundry). |
| **Billing export** | Exportación de la facturación detallada de Google Cloud, de donde se obtiene el costo real. |
| **Caché (lectura / escritura)** | Tokens que el modelo reutiliza de llamadas anteriores (lectura) o que guarda para reutilizar (escritura); suelen tener otro precio. |
| **Candidato** | Modelo de otra nube evaluado como posible equivalente de tu modelo. |
| **Catálogo** | Lista de precios públicos de un proveedor. |
| **Cobertura** | Porcentaje del gasto que pudo compararse con la nube de destino. |
| **Confianza / Confiabilidad** | Indicador de qué tan parecido es un modelo alternativo al tuyo. |
| **Costo bruto** | Costo antes de aplicar créditos y descuentos. |
| **Endpoint** | Punto de acceso de Vertex AI donde se despliega uno o más modelos para recibir solicitudes. |
| **Entrada (input)** | Tokens que envías al modelo (el prompt). |
| **Equivalencia** | Grado de similitud entre tu modelo y un candidato; bajo el 50 % no se considera equivalente. |
| **Google Vertex AI** | Plataforma de Google Cloud para usar y desplegar modelos de IA. |
| **Prompt** | Texto o instrucciones que se envían al modelo. |
| **Salida (output)** | Tokens que el modelo genera como respuesta. |
| **SKU** | Código que identifica cada concepto facturable en Google Cloud. |
| **Throughput** | Capacidad de procesamiento contratada o consumida, en lugar de tokens individuales. |
| **Token** | Unidad mínima de texto que procesa un modelo; puede ser una palabra, parte de una palabra o un signo. |
| **Tokenizador / Codificación** | Método que usa cada modelo para dividir el texto en tokens. |
| **TPM** | Tokens por minuto: límite de capacidad de un modelo o endpoint. |
