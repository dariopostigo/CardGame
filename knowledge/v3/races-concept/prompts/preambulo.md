# Preámbulo — común a las once razas

> **Esto es lo invariante**: se pega **una vez** por conversación, antes del
> primer bloque de sujeto. Lo que cambia por raza —identidad, rango anatómico,
> reparto de edad y belleza, y los 12 sujetos— vive en el archivo de su raza.
>
> **Vive aparte a propósito.** Estaba copiado dentro de `humanos.md`, y con once
> razas eso son once copias del bloque de encuadre: el día que se corrija otra
> vez, se corrige en diez sitios y se olvida en uno. Aquí hay un solo original.

## Qué le pasas a la IA

| Archivo | ¿Se lo pasas? | Para qué |
|---|---|---|
| [`../../art-direction/style-guide.md`](../../art-direction/style-guide.md) | **Sí, siempre** | El **cómo** se dibuja: línea, anatomía, sombreado, materiales, luz. Sin esto no hay estilo |
| **Este archivo** | **Sí, siempre** | El prompt base, el formato y el encuadre |
| El archivo de la raza que toque | **Sí** | Su identidad y sus sujetos |
| [`../sujetos.md`](../sujetos.md) | Opcional, recomendado | Si le pasas varios seguidos: da la identidad de la raza y la progresión de tier, y entiende por qué el tier 8 es enorme y el tier 1 pobre |
| [`../../art-direction/illustrations.md`](../../art-direction/illustrations.md) | Opcional | Criterio de encuadre y de qué pide cada tipo de sujeto |
| [`../razas.md`](../razas.md) | **No** | Son las reglas: Habilidades, Características, tiers. Está lleno de mecánica invisible (Resistencia mágica, Inmune al miedo, Último aliento) y lo único que consigue es que la IA intente dibujarla. Lo dibujable ya está filtrado en cada bloque |

## Cómo se usa

1. Le das `style-guide.md` como contexto.
2. Pegas **este preámbulo** una vez.
3. Pegas el **bloque de identidad** de la raza que toque (la primera sección de su archivo).
4. Pegas **un bloque de sujeto**. Una imagen por bloque.
5. Si la herramienta admite negativos, pegas el **negative prompt** de abajo.

Si abres una conversación nueva para cada imagen, repite los pasos 1–3.

### Con ChatGPT, que es la herramienta elegida

Tres cosas que cambian respecto a lo de arriba, y la segunda es la que decide si
las 132 parecen del mismo juego:

**1. El orden del prompt no hay que tocarlo.** GPT-Image entiende prosa larga y
pondera el prompt entero, así que el bloque de ENCUADRE puede seguir donde está.
(En modelos basados en CLIP —Flux, SDXL— habría que subirlo a la primera frase,
porque procesan en trozos de 77 tokens y diluyen el final. Aquí no hace falta.)

**2. La consistencia se hace ADJUNTANDO la imagen aprobada, no repitiendo el
prompt.** En cuanto el primer héroe de Humanos esté aprobado, se convierte en el
**concepto de calibración** que la §14 de la biblia declara pendiente, y a partir
de ahí **va adjunto en cada generación** con una línea del tipo «mantén
exactamente el estilo de línea, sombreado y paleta de la imagen adjunta; cambia
solo el sujeto». Sin eso los prompts dan el mismo criterio pero no el mismo
trazo, y la imagen 40 no se parecerá a la 3.

**3. El ratio hay que recortarlo a mano.** ChatGPT genera vertical en **1024×1536
(2:3)**, no en 5:7. El 2:3 es **más alto** que el 5:7, así que sobra alto y no
falta: se recortan **~102 px** para llegar a 1024×1434, y se escala a 1080×1512.
Recorta de donde haya aire de sobra —normalmente por arriba— y **nunca del cuarto
inferior**, que es el que necesita la banda del nombre.

> **Y un vicio propio de esta herramienta**: tiende a devolver acabados pulidos y
> caras agradables. El bloque REPARTO y el de FONDO son justamente los que hay que
> revisar en cada tirada, y si sale guapo o con el fondo detallado, se le repite la
> instrucción y se vuelve a tirar. No lo arregles pidiéndole «menos bonito»:
> repítele la línea concreta que se ha saltado.

---

## Bloque 1 — prompt base y formato

> **Copia literal** del prompt base universal de
> [`style-guide.md`](../../art-direction/style-guide.md#21-prompt-base-universal)
> §21 más el lienzo y el encuadre de
> [`public/assets/v3/README.md`](../../../../public/assets/v3/README.md#lienzo-y-formato).
> Si alguno de los dos cambia, hay que resincronizar **este** bloque, y solo este.

```
Ilustración 2D de fantasía cartoon estilizada con estética de cómic de
videojuego. Personaje diseñado mediante dibujo y tinta, con contornos exteriores
negros gruesos y expresivos y líneas interiores visibles que definen rostro,
ropa, equipo y materiales. Anatomía heroica estilizada y ligeramente exagerada,
silueta extremadamente clara y reconocible, rostro expresivo y lleno de
personalidad. Colores ricos y saturados de forma controlada, grandes formas de
color y sombreado gráfico mediante bloques de sombra claramente definidos, con
pocos degradados suaves. Detalle selectivo: máximo detalle en rostro,
cabello/barba y elementos distintivos; menor detalle en ropa y fondo. Materiales
reconocibles mediante formas gráficas y pequeñas marcas dibujadas, evitando
microtexturas fotorealistas. Fondo de fantasía medieval estilizado y atmosférico,
subordinado al personaje. Aspecto de personaje diseñado para un videojuego de
fantasía 2D moderno, expresivo, jugable y preparado visualmente para futuras
animaciones y sprites.

FORMATO: 1080×1512 px, ratio 5:7, VERTICAL, a sangre, sin transparencia.

ENCUADRE — es obligatorio y manda sobre cualquier otra consideración:
PLANO ENTERO. Se ve el personaje COMPLETO, de la coronilla a los pies, con los
pies dentro del cuadro y apoyados en suelo visible. NO es un retrato: nada de
primer plano, busto, plano medio ni recorte por la cintura o el muslo.
La figura ocupa el 60–70% del alto de la imagen, no más: si dudas, aléjate.
La figura va CENTRADA en el eje horizontal de la imagen.
La figura entera cabe entre el 8% y el 75% de la altura. El 25% inferior lo tapa
después una banda opaca con el nombre: ahí abajo solo puede haber suelo.
Aire de al menos el 8% a cada lado, y nada importante (rostro, manos, arma,
escudo) pegado al filo ni en las esquinas — encima va un marco decorativo.
Cámara a la altura del pecho y lente neutra. Sin contrapicado y sin gran angular.
Legible en miniatura.

FONDO — TRES PLANOS Y SOLO TRES. Es tan obligatorio como el encuadre:
El PERSONAJE lleva contorno negro grueso, líneas interiores completas, color al
100% de saturación y el rango completo de valores: su negro es el más negro de la
imagen y su luz la más clara.
El PLANO MEDIO va con línea FINA o sin línea, saturación a la mitad y el valor ya
comprimido hacia el fondo. Siluetas legibles, sin textura y sin marcas.
El FONDO LEJANO va SIN NINGUNA LÍNEA, en manchas planas, casi monocromo y a UN
SOLO VALOR claro. Ningún detalle.
Lo que se pierde con la distancia es LA LÍNEA, no el foco: perspectiva aérea, no
profundidad de campo. NADA de desenfoque de lente, nada de bokeh, nada de
degradado fotográfico — esto es tinta, y un fondo borroso parece un error.
NADA LEGIBLE DETRÁS: ni heráldica identificable, ni caras, ni ventanas que se
puedan contar, ni juntas de sillería. Si el ojo lee un objeto del fondo, compite.
El ACENTO de color de la raza NO aparece en el fondo lejano: es lo que señala al
personaje, y detrás deja de señalar. El fondo se queda con los dominantes,
desaturados.
LAS DOS ESQUINAS DE ARRIBA van tranquilas, a valor plano y uniforme, sin ninguna
silueta que las cruce: encima se imprimen números.
Como mucho DOS planos de fondo. Cinco capas de profundidad son un paisaje, y esto
es una carta.
El campo ESCENARIO de cada bloque dice QUÉ hay detrás; estas reglas dicen CÓMO se
pinta, y MANDAN sobre él. Si un ESCENARIO nombra estandartes, van SIN divisa y sin
heráldica —la divisa es del personaje—; si nombra un castillo o una arcada, es una
mancha plana sin sillares ni ventanas.
Luz principal desde ARRIBA A LA IZQUIERDA, siempre. Y un CONTRALUZ que recorra el
contorno del personaje por el lado opuesto: con el fondo aplanado, es lo que
impide que la silueta se pegue al escenario.

ESCALA — el tier NO se dice con el tamaño de la figura:
Todos los sujetos, del tier 1 al 8, llenan el mismo 60-70% del alto. Lo que dice
si algo es enorme es la PROPORCIÓN: un sujeto colosal tiene la CABEZA PEQUEÑA
respecto al cuerpo, hombros y tronco desproporcionados y ocupa hasta el 90% del
ancho; un sujeto de tier bajo tiene proporción normal, hombros estrechos y ocupa
como un tercio del ancho. NO agrande la figura para decir que es grande: cambie
sus proporciones.

REPARTO DEL CUERPO — se reparte en tres y NO lo decide la raza sola:
La RAZA fija el rango: escala en cabezas, rasgos de especie, techo y suelo de
masa. El PAPEL (clase o tier) elige la complexión dentro de ese rango. El TIER
pone la edad y el desgaste. Cada bloque de sujeto trae sus campos CUERPO, EDAD y
ROSTRO ya decididos: RESPÉTELOS aunque contradigan lo que suele hacer con un
personaje de fantasía. La belleza no es el estado por defecto: es un rasgo que
cada raza declara, y en la mayoría es «ninguna».
```

---

## Bloque 2 — la identidad de la raza

**No está aquí, y falta a propósito**: es lo único del preámbulo que cambia, así
que vive en el archivo de cada raza, en su primera sección. Pégalo justo después
del bloque 1.

| Raza | Archivo | Fase |
|---|---|---|
| 👤 Humanos | [`humanos.md`](humanos.md) | 1 — **listo para generar** |
| ⛏️ Enanos | [`enanos.md`](enanos.md) | 2 |
| 💀 No-muertos | [`no-muertos.md`](no-muertos.md) | 2 |
| 🔥 Demonios infernales | [`demonios.md`](demonios.md) | 2 |
| 🧝 Elfos | [`elfos.md`](elfos.md) | 2 |
| 🧌 Orkos | [`orkos.md`](orkos.md) | 3 — fuera de alcance |
| 🧚 Feéricos | [`feericos.md`](feericos.md) | 3 — fuera de alcance |
| 🐉 Dracónidos | [`draconidos.md`](draconidos.md) | 3 — fuera de alcance |
| 🐀 Hombres rata | [`hombres-rata.md`](hombres-rata.md) | 3 — fuera de alcance |
| 🤖 Constructos | [`constructos.md`](constructos.md) | 3 — fuera de alcance |
| 🧜 Abisales | [`abisales.md`](abisales.md) | 3 — fuera de alcance |

El orden no es sugerencia: **Humanos primero**, porque es la única raza que da
vara de medir —sus 12 imágenes fijan cuánta masa es un tier 8 y cuánto oro es
«acento»—, y las demás se juzgan contra ese bloque. La cola completa está en
[`../sujetos.md`](../sujetos.md#orden-de-la-cola).

---

## Bloque 3 — negative prompt

> Copia literal de [`style-guide.md`](../../art-direction/style-guide.md#20-negative-prompt-maestro) §20.

```
photorealistic, hyperrealistic, realistic concept art, photographic skin, skin
pores, realistic hair strands, realistic metal reflections, realistic leather
texture, cinematic photorealism, 3D render, realistic 3D character, glossy 3D
materials, realistic anatomy, overly detailed armor, excessive microdetails,
smooth airbrushed painting, oil painting, watercolor, soft photographic
gradients, no outlines, thin outlines, generic fantasy character, anime, manga,
pixel art, low-poly, text, logo, watermark, UI, frame, close-up, extreme
close-up, portrait crop, bust shot, half body, waist-up, cowboy shot, cropped
legs, cropped feet, cut off at the knees, feet out of frame, subject touching
frame edge, off-center subject, landscape orientation, wide-angle lens, extreme
low angle, fashion model, supermodel, cover model, glamour shot, beauty
portrait, makeup, lipstick, airbrushed face, flawless poreless skin, perfectly
symmetrical face, idealized beauty, sexy, cleavage, bare midriff
```

**Pégalo tal cual, sin excepciones por sujeto.** Dos avisos sobre lo que **no**
lleva, y las dos ausencias son deliberadas:

- **Ni `pristine heroic armor` ni `heavy plate armor`.** Se retiraron porque
  bloqueaban a los sujetos que sí son placa completa y reluciente: el Paladín
  humano de tier 7, el Guardia de hierro enano, los Constructos enteros. Lo que
  protegían se dice en positivo — el Miliciano pide gambesón remendado y «nada de
  oro, ni un remache».
- **Ni `muscular`, ni `young`, ni `handsome`, ni `beautiful`.** Romperían al
  Guerrero y al Paladín, que son macizos; al Miliciano, que es joven a propósito;
  y a los Elfos y los Feéricos, cuyas razas **sí** declaran belleza. Al negativo
  va solo lo que ningún sujeto del juego quiere nunca.

Es la misma regla las dos veces: **es más fiable pedir en positivo lo que sí toca
que prohibir en bloque lo contrario.**

---

## Al terminar cada imagen

**Primero el encuadre, que es lo que más falla y lo único que no se arregla
retocando:** ¿se ve el personaje entero con los pies dentro? ¿va centrado? ¿es
vertical? ¿queda libre el cuarto de abajo para la banda del nombre? Si alguna es
no, se vuelve a tirar; no se recorta ni se rellena.

**Después el reparto, que es lo segundo que falla:** ¿la complexión es la de su
papel o la IA le ha puesto el mismo cuerpo que a todos? ¿se le ve la edad que
pide su bloque? ¿la cara es la que declara su raza? Si los doce sujetos de una
raza parecen tener treinta años y buen aspecto, el prompt no llegó: revisa que el
bloque de identidad de la raza esté pegado.

Después, checklist de entrega en
[`../../art-direction/illustrations.md`](../../art-direction/illustrations.md#6-checklist-de-entrega)
§6, y el de estilo en `style-guide.md` §24. Los dos en treinta segundos.

## Dónde va el archivo

```
public/assets/v3/races/<raza>/            los 4 héroes
public/assets/v3/races/<raza>/units/      las 8 unidades
```

Las carpetas separadas son lo que salva las **25 colisiones de nombre** entre un
héroe y una unidad de su misma raza (el `arquero.webp` humano existe dos veces, y
en Hombres rata y Constructos colisionan las cuatro clases). La norma completa de
nombre y extensión está en
[`public/assets/v3/README.md`](../../../../public/assets/v3/README.md).
