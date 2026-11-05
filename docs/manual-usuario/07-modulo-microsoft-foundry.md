# Manual de Usuario — Cloud Performance

## Módulo Servicios IA: Microsoft Foundry

> **Versión del documento:** 1.0 · **Módulo:** Servicios IA — Microsoft Foundry (Azure AI Foundry)
> **Dirigido a:** usuarios finales de Cloud Performance que usan modelos de IA en Microsoft Foundry y quieren entender su costo, compararlo con otras nubes y reducir el consumo de tokens.

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
   - 5.1 [Modelos Foundry](#51-modelos-foundry)
6. [Comparación (Azure Foundry ↔ AWS Bedrock / GCP Vertex)](#6-comparación-azure-foundry--aws-bedrock--gcp-vertex)
7. [Prompt Optimization](#7-prompt-optimization)
8. [Preguntas frecuentes](#8-preguntas-frecuentes)
9. [Glosario](#9-glosario)

---

## 1. Introducción

El módulo **Microsoft Foundry** de Cloud Performance analiza el uso que tu organización hace de los **modelos de IA** desplegados en **Microsoft Foundry** (antes Azure AI Foundry). Con él puedes:

- Ver cuánto has pagado por cada **modelo** y **cuenta de Azure AI**, separado en tokens de **entrada** y **salida**.
- **Simular** cuánto costaría el mismo consumo con **modelos equivalentes** de otros proveedores, con un indicador de **confiabilidad** de cada alternativa.
- **Comparar** tu gasto en Foundry con lo que costaría en **AWS Bedrock** o **GCP Vertex**, modelo por modelo y despliegue por despliegue.
- **Optimizar tus prompts**: comprimir un prompt para que use menos tokens y ver cuánto ahorrarías en cada llamada.

> 🖼️ **Captura pendiente:** Vista general del módulo Microsoft Foundry con el menú lateral abierto.
> *Archivo sugerido:* `img/foundry/00-vista-general.png`

---

## 2. Antes de comenzar

### 2.1 Cómo ingresar al módulo

1. Inicia sesión en Cloud Performance con tu usuario y contraseña.
2. Abre el menú de usuario (tu nombre, en la esquina superior derecha) y selecciona **Perfil**.
3. En el menú lateral del perfil, haz clic en **Servicios IA**. Verás la pantalla **Nubes registradas**.
4. Haz clic en la tarjeta **Microsoft Foundry**.
   - Si tu organización tiene **más de una cuenta de Azure**, la tarjeta muestra un selector **Suscripción:**. Primero elige la cuenta (opción *Seleccione una cuenta...*) y luego haz clic en la tarjeta. Mientras no elijas una cuenta, la tarjeta se ve en gris y no permite ingresar.
5. Se abrirá la página de **Inicio** del módulo.

> 🖼️ **Captura pendiente:** Pantalla "Nubes registradas" de Servicios IA con la tarjeta Microsoft Foundry.
> *Archivo sugerido:* `img/foundry/01-servicios-ia.png`

> 💡 **Consejo:** Para cambiar de cuenta de Azure, vuelve a **Perfil → Servicios IA** y elige otra en la tarjeta de Microsoft Foundry.

### 2.2 Acceso según tu plan

| Plan | Acceso al módulo Microsoft Foundry |
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
| Costo y Optimización | Costo facturado por modelo y simulación con modelos equivalentes. |
| Comparación | Comparación de tu gasto en Foundry contra AWS Bedrock y GCP Vertex. |
| Prompt Optimization | Compresión de prompts y conteo de tokens. |

---

## 3. Uso general de las vistas

### 3.1 Panel de filtros

Las vistas **Modelos Foundry** y **Comparación** comparten este panel:

| Filtro | Cómo se usa |
|---|---|
| **Periodo** | Calendario para elegir un rango de fechas: haz clic en la fecha de inicio y luego en la de término. Por defecto, desde **ayer hasta hoy**. |
| **Región** | Lista con buscador. Opción *Todas las Regiones*. Determina qué cuentas aparecen en *Instancias*. |
| **Instancias** | Dos listas: primero elige la categoría **Cuentas Azure AI** y luego la **cuenta** que quieres analizar. |

1. Ajusta los filtros.
2. Presiona **Aplicar Filtros**. La información se actualiza solo al presionar este botón.
3. Para volver a los valores iniciales, presiona **Limpiar Filtros**.

> ⚠️ **Importante:** Ambas vistas analizan **una cuenta a la vez**. Elige una cuenta específica en *Instancias*; con *Todas las instancias* no se muestra información.

> 💡 **Consejo:** Los filtros aplicados quedan guardados en la dirección (URL) de la página. Puedes guardarla en favoritos o compartirla con un colega que tenga acceso.

> 🖼️ **Captura pendiente:** Panel de filtros con Periodo, Región e Instancias (Cuentas Azure AI).
> *Archivo sugerido:* `img/foundry/02-panel-filtros.png`

### 3.2 Mensajes que puedes encontrar

| Mensaje | Significado y qué hacer |
|---|---|
| **No se ha seleccionado ninguna cuenta de Azure AI.** | Elige una cuenta específica en el filtro *Instancias* y presiona **Aplicar Filtros**. |
| **Sin categorías disponibles** (en *Instancias*) | No hay cuentas de Azure AI en la región elegida. Elige otra región o *Todas las Regiones*. |
| **Sin datos para mostrar** | No hay consumo para la cuenta en el período elegido. Amplía el período. |
| **Error al cargar datos** | Hubo un problema al obtener la información. Intenta nuevamente o ajusta el rango de fechas. Si persiste, contacta a soporte. |

---

## 4. Inicio

**Menú:** Inicio

Es la primera pantalla al ingresar al módulo (**Dashboard Microsoft Foundry**). Muestra el encabezado del módulo. Usa el **menú lateral** para ir a cada vista.

> 🖼️ **Captura pendiente:** Página de Inicio del módulo Microsoft Foundry.
> *Archivo sugerido:* `img/foundry/03-inicio.png`

---

## 5. Costo y Optimización

**Menú:** Costo y Optimización

Pantalla de acceso a las vistas de costo. Haz clic en **Acceder** en la tarjeta **Modelos Foundry**.

> 🖼️ **Captura pendiente:** Pantalla "Costo y Optimización" con la tarjeta Modelos Foundry.
> *Archivo sugerido:* `img/foundry/04-costo-optimizacion.png`

### 5.1 Modelos Foundry

**Menú:** Costo y Optimización → Modelos Foundry
**Para qué sirve:** conocer el costo facturado de cada modelo de IA de una cuenta y simular cuánto costaría ese mismo consumo con modelos equivalentes.

**Filtros:** Periodo · Región · Instancias (cuenta de Azure AI). Ver [3.1](#31-panel-de-filtros).

**Qué muestra**

El título de la vista es **Costo y Optimización Azure AI Foundry**. Debajo verás **una tarjeta por modelo** usado en la cuenta, ordenadas de **mayor a menor costo**. Cada tarjeta incluye:

1. **Encabezado:**
   - **Proveedor y nombre** del modelo (por ejemplo, *OpenAI - gpt-4o*).
   - **Estrellas** (1 a 5) y **nivel** del modelo, cuando hay información de perfil. Algunos modelos incluyen además una breve descripción.
   - **Cuenta** y **región** donde está desplegado.

2. **Tokens entrada** y **Tokens salida:** cantidad de tokens consumidos en el período.

3. **Costo Facturado:** total facturado por el modelo. Debajo, el **Desglose según facturación**:
   - **Entrada** y **Salida**, con su subtotal.
   - Por cada concepto facturado: nombre (por ejemplo, *Entrada (Caché Lectura)* o *Fine-tuning*), tarifa calculada, nombre del medidor de Azure, costo y cantidad de tokens.

4. **Simulación de costos** (sección desplegable; haz clic para abrirla): estima cuánto habrías pagado con **modelos equivalentes de otros proveedores**, con tu mismo consumo.
   - **Modelo actual:** tu modelo y su costo facturado, como referencia.
   - **Ordenar modelos** (cuando hay más de una alternativa): *Mayor ahorro*, *Mayor confiabilidad* o *Confiabilidad + ahorro*.
   - Por cada modelo alternativo:
     - Nombre, proveedor, estrellas, nivel y descripción.
     - Etiqueta con la **diferencia porcentual** respecto de tu costo: en **verde** con flecha hacia abajo si es más barato; en **rojo** con flecha hacia arriba si es más caro.
     - **Confiabilidad del modelo:** nivel (**Alta**, **Media** o **Baja**) y porcentaje de similitud con tu modelo actual en habilidades, capacidades y precio. No es una probabilidad de éxito. Si dice *Sin datos suficientes*, no hay información para calcularla.
     - **Desglose Simulado:** tarifa y costo estimado por concepto (entrada, salida, caché).
     - **Ahorro Proyectado** (verde) o **Costo Adicional** (rojo), y el **Costo Estimado** total.
     - Avisos, cuando corresponda:
       - **Comparación parcial: sin tarifa para…** El modelo alternativo no tiene precio para algún concepto; el costo estimado está incompleto.
       - **Faltan capacidades:** el modelo alternativo no soporta alguna capacidad que usa tu modelo actual.
       - **Riesgo de cuota (TPM):** el límite de tokens por minuto del alternativo es menor que el de tu modelo actual.

5. **Pie de la tarjeta:** **Versión Modelo** y **Cuenta Base**.

**Cómo usarla**

1. Elige el **Periodo**, la **Región** y la **cuenta** en *Instancias*.
2. Presiona **Aplicar Filtros**.
3. Revisa las primeras tarjetas: son los modelos que más te cuestan.
4. En el desglose, identifica si el costo viene de la **entrada** o de la **salida**. Si viene de la entrada, la [optimización de prompts](#7-prompt-optimization) puede ayudarte.
5. Abre **Simulación de costos** y ordena por **Confiabilidad + ahorro** para ver alternativas baratas y a la vez similares a tu modelo.
6. Antes de considerar un cambio, revisa los avisos de capacidades y de cuota.

> 🖼️ **Captura pendiente:** Tarjeta de un modelo con tokens, Costo Facturado y desglose según facturación.
> *Archivo sugerido:* `img/foundry/05-modelo-costo.png`

> 🖼️ **Captura pendiente:** Sección "Simulación de costos" abierta, con el selector "Ordenar modelos" y la confiabilidad.
> *Archivo sugerido:* `img/foundry/06-simulacion-costos.png`

---

## 6. Comparación (Azure Foundry ↔ AWS Bedrock / GCP Vertex)

**Menú:** Comparación
**Para qué sirve:** estimar cuánto costaría el consumo de una cuenta de Foundry si usaras **modelos equivalentes** en **AWS Bedrock** o en **GCP Vertex**, y qué tan confiables son esas equivalencias.

**Filtros:** Periodo · Región · Instancias (cuenta de Azure AI). Ver [3.1](#31-panel-de-filtros).

> ℹ️ **Nota:** Muchos modelos de Foundry no existen con el mismo nombre en otras nubes. Las equivalencias son **modelos de otra familia con un perfil y un precio similares**. Úsalas como una guía, no como una promesa de ahorro exacta.

**Encabezado de la cuenta**

Muestra el nombre de la cuenta, su grupo de recursos, ubicación y tipo, junto con:

- **Catálogo AWS Bedrock / GCP Vertex:** cantidad de modelos del catálogo de destino considerados.
- **Líneas de facturación:** cantidad de registros de facturación analizados.
- **Comparar contra:** botones **AWS** y **GCP** para cambiar la nube de destino. Toda la vista se actualiza al cambiar.

**Tarjetas de resumen**

| Tarjeta | Qué indica |
|---|---|
| **Costo Azure Foundry** | Costo facturado de la cuenta en el período y cantidad de modelos facturados. |
| **Proyección AWS Bedrock / GCP Vertex** | Costo estimado en la nube de destino y qué porcentaje del gasto pudo compararse (*Cobertura*). |
| **Diferencia estimada** | Diferencia en USD y en porcentaje entre la proyección y lo facturado en Azure. |
| **Despliegues** | Cantidad de despliegues de la cuenta y cuántos están **sin consumo**. |
| **Modelos sin equivalencia** | Modelos sin un equivalente confiable en la nube de destino. Se valorizan a su costo de Azure. |

Si hay consumos que no se pudieron asignar a un modelo, verás un aviso ámbar **N medidores sin resolver por US$X**, con la lista de esos medidores. Ese gasto queda **fuera de la proyección**.

La vista se organiza en cinco secciones numeradas:

**1. Comparación de costos — ¿Cuánto costaría lo mismo en AWS Bedrock / GCP Vertex?**

- A la izquierda: **Azure Foundry, hoy** (costo facturado), **Proyección** en la nube de destino y la diferencia en porcentaje y USD (verde si es ahorro, rojo si es mayor costo).
- A la derecha: un ranking por modelo con barras de **diferencia porcentual**. Las barras verdes, hacia la izquierda, son ahorro; las rojas, hacia la derecha, son mayor costo. Junto a cada barra aparece el modelo recomendado. El ranking usa porcentajes para que modelos de costos muy distintos se comparen en la misma escala.
- Los modelos sin candidato recomendado aparecen como **Sin equivalencia**.

**2. Composición del consumo — ¿Por qué cuesta lo que cuesta?**

- Una barra por modelo, dividida en **Entrada**, **Caché lectura**, **Caché escritura** y **Salida**.
- Botones **Tokens** y **Costo** para ver la proporción de volumen o de gasto.
- Indicador **Caché:** qué porcentaje del total corresponde a caché.
- Cuando el volumen y el gasto de un concepto no se parecen, aparece un **consejo** (💡) que indica el modelo a revisar primero. Por ejemplo, la salida puede ser el 20 % de los tokens pero el 60 % del costo.

**3. Detalle por modelo — consumo, precio y mejor alternativa**

Una tarjeta por modelo facturado, con:

- Nombre, versión, clase y tipo de despliegue; región de Azure → región del candidato.
- Costo en Azure, tokens totales y precio promedio por millón de tokens.
- Barras comparativas **Azure** vs **AWS/GCP** (cada tarjeta usa su propia escala).
- Una fila por tipo de consumo: tokens, precio por millón en Azure y en destino, costo en Azure y diferencia. El ícono ⚠️ indica que se usó una tarifa aproximada.
- **Modelo recomendado:** nombre, proveedor, porcentaje de equivalencia, nivel de confianza (**Alta**, **Media** o **Baja**), costo proyectado, diferencia y la justificación de la recomendación. Debajo: candidatos evaluados, despliegues (y cuántos están inactivos) y la **fecha de retiro** del modelo de Azure, si existe.
- Si ningún candidato es suficientemente parecido, verás *"Ningún candidato supera el umbral mínimo de equivalencia"*.

**4. Confianza de la equivalencia — ¿Qué tan confiables son estas equivalencias?**

Lista de **todos los candidatos evaluados** para cada modelo, con el recomendado primero (★):

- Proveedor y región del candidato.
- Barra de **equivalencia** (verde: confianza alta; ámbar: media; gris: baja), con una marca en el **umbral mínimo de 50 %**.
- Diferencia porcentual y costo proyectado.
- Nivel de confianza y, si corresponde, la etiqueta **No elegible**. Los candidatos no elegibles se ven atenuados.

> 💡 **Consejo:** "Recomendado" no significa "el más barato". El recomendado equilibra precio y equivalencia; un candidato más barato pero con baja equivalencia podría no servir para tu caso.

**5. Infraestructura — ¿Dónde vive este consumo?**

Tabla **Despliegues de la cuenta**, con buscador (*Buscar despliegue...*):

| Columna | Qué indica |
|---|---|
| **Despliegue** | Nombre del despliegue. |
| **Modelo** | Modelo desplegado. |
| **SKU** | Tipo de despliegue. |
| **Región** | Ubicación del despliegue. |
| **Tokens entrada** / **Tokens salida** | Tokens consumidos en el período. |
| **Participación** | Proporción de tokens del despliegue sobre el total del modelo. |
| **Costo asignado** | Costo del modelo repartido según esa participación. |
| **Estado** | Por ejemplo, *Inactivo*: despliegue aprovisionado sin tokens en el período. |

**Cómo usarla**

1. Elige el **Periodo**, la **Región** y la **cuenta**, y presiona **Aplicar Filtros**.
2. En **Comparar contra**, elige **AWS** o **GCP**.
3. Revisa la **Diferencia estimada** y la **Cobertura**: una cobertura baja indica que buena parte del gasto no pudo compararse.
4. En la sección 1, identifica los modelos con mayor ahorro potencial.
5. En las secciones 3 y 4, confirma que el modelo recomendado tenga confianza **Alta** o **Media**.
6. En la sección 5, busca despliegues **inactivos**: son candidatos a eliminar.

> 🖼️ **Captura pendiente:** Encabezado de la cuenta y tarjetas de resumen, con el selector "Comparar contra".
> *Archivo sugerido:* `img/foundry/07-comparacion-resumen.png`

> 🖼️ **Captura pendiente:** Secciones 1 y 2: comparación de costos y composición del consumo.
> *Archivo sugerido:* `img/foundry/08-comparacion-costos-mezcla.png`

> 🖼️ **Captura pendiente:** Sección 3: tarjeta de detalle de un modelo con su recomendado.
> *Archivo sugerido:* `img/foundry/09-comparacion-detalle-modelo.png`

> 🖼️ **Captura pendiente:** Secciones 4 y 5: confianza de candidatos y tabla de despliegues.
> *Archivo sugerido:* `img/foundry/10-comparacion-confianza-despliegues.png`

---

## 7. Prompt Optimization

**Menú:** Prompt Optimization
**Para qué sirve:** reducir la cantidad de tokens de un prompt. En Microsoft Foundry se paga por **tokens**, no por prompt, por lo que un prompt más corto reduce el costo de **cada llamada**.

La vista se titula **Optimización de Prompts**. No usa el panel de filtros general; tiene su propio formulario.

**Formulario: Prompt a optimizar**

| Campo | Cómo se usa |
|---|---|
| **Modelo** | Lista con buscador (*Buscar por modelo o proveedor...*), agrupada por proveedor: OpenAI, Anthropic, Meta, Mistral AI, Microsoft, DeepSeek, xAI, Cohere y *Otros proveedores*. La cantidad de tokens depende del modelo, así que el mismo prompt puede dar conteos distintos. |
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
> *Archivo sugerido:* `img/foundry/11-prompt-formulario.png`

> 🖼️ **Captura pendiente:** Tarjetas de resumen y paneles "Prompt original" y "Prompt optimizado".
> *Archivo sugerido:* `img/foundry/12-prompt-resultado.png`

---

## 8. Preguntas frecuentes

**No veo información después de cambiar los filtros.**
Recuerda presionar **Aplicar Filtros**. Los cambios no se aplican automáticamente.

**Aparece "No se ha seleccionado ninguna cuenta de Azure AI".**
En *Instancias*, elige primero **Cuentas Azure AI** y luego una cuenta específica.

**El filtro Instancias dice "Sin categorías disponibles".**
No hay cuentas de Azure AI en la región elegida. Cambia la región o elige *Todas las Regiones*.

**¿Qué significa la "Confiabilidad" o "Confianza" de un modelo alternativo?**
Indica qué tan parecido es el modelo alternativo al tuyo en habilidades, capacidades y precio. No es una garantía de que funcionará igual en tu caso; pruébalo antes de cambiar.

**¿Por qué el modelo recomendado no es el más barato?**
La recomendación equilibra el ahorro con la equivalencia. Un modelo más barato pero muy distinto podría no cumplir tu caso de uso.

**¿Qué es la "Cobertura" en la vista Comparación?**
Es el porcentaje de tu gasto en Foundry que pudo compararse con la nube de destino. El resto corresponde a modelos sin equivalencia o a consumos que no se pudieron asignar.

**¿La optimización de prompts modifica algo en mi cuenta de Azure?**
No. Solo procesa el texto que pegas y te muestra el resultado; no cambia ningún recurso.

**El prompt optimizado se lee raro.**
Es esperable: la compresión elimina lo que aporta menos información. Revisa el resultado y pruébalo con tu modelo antes de usarlo.

**¿Por qué el mismo prompt da distinta cantidad de tokens con otro modelo?**
Cada modelo usa su propio tokenizador, que divide el texto de forma diferente.

---

## 9. Glosario

| Término | Definición |
|---|---|
| **Caché (lectura / escritura)** | Tokens que el modelo reutiliza de llamadas anteriores (lectura) o que guarda para reutilizar (escritura); suelen tener otro precio. |
| **Candidato** | Modelo de otra nube evaluado como posible equivalente de tu modelo. |
| **Cobertura** | Porcentaje del gasto que pudo compararse con la nube de destino. |
| **Confianza / Confiabilidad** | Indicador de qué tan parecido es un modelo alternativo al tuyo. |
| **Cuenta de Azure AI** | Recurso de Azure donde se despliegan los modelos de Foundry. |
| **Despliegue** | Instancia de un modelo publicada en una cuenta, con su propia capacidad. |
| **Entrada (input)** | Tokens que envías al modelo (el prompt). |
| **Equivalencia** | Grado de similitud entre tu modelo y un candidato; bajo el 50 % no se considera equivalente. |
| **Fine-tuning** | Ajuste de un modelo con datos propios; tiene cargos específicos. |
| **Medidor** | Concepto de facturación de Azure asociado a un consumo. |
| **Microsoft Foundry** | Plataforma de Microsoft (antes Azure AI Foundry) para desplegar y usar modelos de IA. |
| **AWS Bedrock** | Servicio de modelos de IA de Amazon Web Services. |
| **GCP Vertex** | Servicio de modelos de IA de Google Cloud. |
| **Prompt** | Texto o instrucciones que se envían al modelo. |
| **Salida (output)** | Tokens que el modelo genera como respuesta. |
| **Token** | Unidad mínima de texto que procesa un modelo; puede ser una palabra, parte de una palabra o un signo. |
| **Tokenizador / Codificación** | Método que usa cada modelo para dividir el texto en tokens. |
| **TPM** | Tokens por minuto: límite de capacidad de un despliegue. |
