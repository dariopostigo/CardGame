# Prompts — los 11 estandartes de raza

> **Qué es esto: los prompts montados y listos para pegar** en una IA para
> generar las once banderas de raza que define
> [`../banners.md`](../banners.md). Allí está *qué* bandera es cada una y *por
> qué*; aquí está *lo que se pega en la IA*. Mismo reparto que usan los
> pictogramas entre [`../../icon-concept/icons.md`](../../icon-concept/icons.md)
> y [`../../icon-concept/prompts/razas.md`](../../icon-concept/prompts/razas.md).

> **Escrito el 27 de agosto de 2026 y corregido dos veces el mismo día**, las dos
> mirando lo que salía:
>
> 1. El concepto decía que el archivo era «la pieza entera, con el emblema
>    encima» y la IA hizo eso: once banderas con el **logotipo horneado dentro**.
>    El emblema ya existe en `icons/races/` y ya se usa en otros tres sitios, así
>    que hornearlo aquí serían dos dibujos del mismo objeto. **La bandera va
>    vacía.**
> 2. El preámbulo pedía **realismo de material** —«pieza de utilería pintada, con
>    su grano y su caída»— y salieron banderas cargadas de pliegues, costuras,
>    herrajes y desgaste. **La referencia que zanjó esto**
>    ([`../imgs/faction-banners.png`](../imgs/), estandartes de facción tipo
>    Heroes of Might & Magic) es lo contrario: un **panel plano de color liso**
>    con el emblema dorado encima y nada más. Se cambió el registro entero, de
>    ilustración de tela a **emblema gráfico**.
> 3. Con la primera bandera ya montada en la carta (Humanos), **la proporción**:
>    el «1 : 2,3» estaba escrito a secas y el generador lo aplicó al **lienzo**,
>    pero el asta se lleva el 30 % del ancho, así que el paño salió a **1 : 3,0**
>    y en la carta se veía demasiado largo. Ahora el paño va **en píxeles** y no
>    en proporción. En la misma pasada se cayeron **dos reglas que estaban de
>    más**: el asta dorada y el filete dorado, que este documento prohibía y que
>    montados quedan bien.
>
> **Con estos prompts salieron las once, ese mismo día y de una tacada**, y están
> montadas (`public/assets/v3/banners/`). Lo que hay que saber si se vuelven a
> usar:
>
> - **Lo que funcionó.** Las cinco cotas en píxeles: el paño cayó dentro de
>   **3 px sobre 945** en los once archivos, así que no hubo que reencuadrar nada.
>   Los once remates del pie salieron los que pedía la tabla, sin confundir los
>   parecidos.
> - **Lo que se perdió por el camino.** **Constructos volvió sin su runa azul**:
>   la regla 3 dice «un solo tono» y el generador la aplicó también al acento, que
>   era la excepción. Si se regenera esa raza, el acento hay que decirlo **fuera**
>   de la frase del tono, no dentro.
> - **Lo que hay que cambiar antes de regenerar Feéricos.** Su campo lila salió
>   a **1,06 de contraste** contra el emblema de oro que lleva encima: el peor de
>   los once y prácticamente la misma luminosidad. No es un fallo del prompt —pidió
>   el campo subido de valor y eso es lo que dio—, es que la decisión de fondo era
>   la mala. Ver [`../banners.md`](../banners.md) §11.

## Las cinco reglas que mandan sobre las once

Salen todas de [`../banners.md`](../banners.md) y de las tres correcciones de
arriba. Cualquier idea de bandera que las incumpla está mal por bien que quede:

1. **El paño, liso.** Sin pliegues, sin ondas, sin trama, sin costuras, sin
   desgaste, sin manchas. La tela es un plano de color; todo lo que la IA quiera
   añadirle de «realismo» va en contra, porque en la carta se ve a 38 px y ahí un
   pliegue es ruido.

   **El asta sí va, y esto se corrigió al montar la primera** *(27-ago-2026)*:
   esta regla decía «sin herrajes ni asta», la primera bandera vino con travesaño
   y remates, y montada queda bien. En la carta ni se ve —la tapa entera el disco
   del Tier— pero es lo que hace que la pieza funcione sola en los tamaños
   grandes, que es para lo que existe el archivo.
2. **Ningún dibujo dentro del paño.** Ni emblema, ni sello, ni escudo, ni runa,
   ni símbolo, ni letra. La bandera es el **campo**; la carga va encima y es otro
   archivo (§4, la ley del esmalte: son dos objetos).
3. **Nada de oro DENTRO del paño.** El oro es el material del emblema que se
   pone encima, y una mancha dorada en mitad de la tela se lo come.

   **Pero en el contorno sí, y es la otra corrección del 27 de agosto**: la regla
   decía «nada de oro» a secas, la primera bandera vino con filete dorado y asta
   dorada, y montada no compite con el emblema — lo **enmarca**, y de paso ata la
   bandera al medallón del Tier de arriba. Lo que la regla protegía era el
   centro, no el borde.
4. **Mate, sin luz propia.** El brillo es de la **veta de Rareza** de la carta,
   que es metal encendido; la bandera es color teñido (§8). Si el paño brilla, se
   lee como rareza y no como raza.
5. **Las once tienen que ser intercambiables.** Mismo lienzo, mismo ancho, mismo
   borde de arriba. **Solo el 20 % inferior cambia de una raza a otra**: por
   encima de esa línea, las once son idénticas salvo el color.

**Y de ahí sale dónde vive la personalidad**, que con este registro es más
estrecho y más claro que antes: **el tinte y el corte de abajo.** Nada más. El
resto lo pone el emblema dorado que va encima.

## Cómo se usa

1. Pegas el **preámbulo** una vez.
2. Pegas **un bloque de raza**. Una imagen por bloque.
3. Si la herramienta admite negativos, pegas el **negative prompt**.
4. **Adjunta la referencia de facción**
   ([`../imgs/faction-banners.png`](../imgs/)) con una línea
   del tipo «este es el nivel de simpleza y este el acabado; cambia solo el color
   y el corte de abajo, y quita el emblema». Es la lección que ya aprendieron las
   razas y los iconos —*la consistencia se hace adjuntando la imagen aprobada, no
   repitiendo el prompt*— y aquí es además lo que arregla el problema, porque
   «simple» dicho con palabras no ha bastado dos veces.
5. Cuando vuelvan, se pasan por la lista de **Al terminar**.

---

## Bloque 1 — preámbulo

> Traducción a prompt de [`../banners.md`](../banners.md) §5 (el tinte), §6 (el
> corte), §7 (la caja) y §10 (el archivo). Si alguno cambia, se resincroniza
> **este** bloque.

```
Estandarte de facción para la interfaz de un juego de fantasía. ILUSTRACIÓN
PLANA Y GRÁFICA, estilo emblema de interfaz: una forma limpia de COLOR LISO. NO
es un trozo de tela pintado con realismo.

EL PAÑO ES LISO, y esto manda sobre todo lo demás: sin pliegues, sin
ondulaciones, sin textura de tejido, sin hilos, sin costuras, sin remiendos, sin
desgaste y sin manchas. La tela es un plano de color.

Cuelga de un TRAVESAÑO horizontal dorado, con un remate en cada extremo, que
sobresale un poco por los lados del paño. Y el paño lleva un FILETE DORADO fino
siguiendo su contorno. Esos dos son los únicos sitios con oro de la pieza: dentro
de la tela no hay ninguno.

LA BANDERA VA VACÍA: el panel NO lleva ningún emblema, escudo, símbolo, sello,
runa, letra ni logotipo. Color liso de arriba abajo.

FORMA, idéntica en todas. Y las medidas son DEL PAÑO, no del lienzo — el asta
sobresale, así que el lienzo es más ancho que la tela:

  · Lienzo: 1000 x 1760 px.
  · Paño: 700 px de ancho, CENTRADO (de x=150 a x=850), y de y=105 a y=1715.
    O sea 1610 de alto: la TELA es 1:2,3.
  · Lados rectos y paralelos, borde superior recto.
  · El corte del pie arranca en y=1393, el 80% del paño.

Lo ÚNICO que cambia de una bandera a otra es el color y cómo se corta ese 20%
de abajo.

COLOR: un solo tono plano en todo el paño, con un oscurecimiento muy suave hacia
los bordes y hacia el pie. Ningún otro color dentro de la tela.

NADA DE ORO DENTRO DEL PAÑO: ni emblema, ni franja, ni adorno dorado sobre la
tela. El oro vive solo en el travesaño y en el filete del contorno.

MATE: sin brillo especular, sin resplandor, sin luz propia, sin partes
incandescentes. Iluminación uniforme y plana.

FORMATO: fondo TRANSPARENTE, la bandera centrada, ocupando el lienzo entero de
alto sin tocar el filo, y SIN sombra proyectada.
```

---

## Bloque 2 — las once banderas

Cada bloque es una línea de **color** y una de **corte**, que es todo lo que
distingue a una raza de otra en este registro. El tinte sale de
[`../banners.md`](../banners.md) §5 y el corte de §6.

### 👤 Humanos

```
Panel liso AZUL HERÁLDICO profundo (#2f4f82). El pie se corta en una PUNTA
limpia y simétrica, centrada. Filete recto y nítido en todo el contorno.
```

### ⛏️ Enanos

```
Panel liso GRANATE oscuro (#6d1f2b). El pie se corta en una punta ANCHA Y ROMA,
casi un trapecio, más maciza que puntiaguda. Filete grueso y recto.
```

### 💀 No-muertos

```
Panel liso VERDÍN GRIS apagado (#4a5a4a). El pie termina DESHILACHADO en cuatro
o cinco lengüetas estrechas y desiguales, como una tela deshecha, pero dibujadas
en plano y sin hilos sueltos.
```

### 🔥 Demonios infernales

```
Panel liso ROJO SANGRE oscuro (#7d1616). El pie se corta en una V PROFUNDA y
claramente ASIMÉTRICA: un lado baja más que el otro. Filete recto y duro.
```

### 🧝 Elfos

```
Panel liso VERDE FRÍO profundo, entre teal y musgo (#1f4a45). El pie se corta en
una punta LARGA Y ESTRECHA, más aguda que las demás. Filete finísimo.
```

### 🧟 Orkos

```
Panel liso VERDE OLIVA SUCIO (#4f4a22). El pie está ROTO en un corte basto,
irregular y asimétrico, como arrancado de un tirón. Filete irregular, que se
pierde en tramos.
```

### 🧚 Feéricos

```
Panel liso LILA (#8f74bd), el único claro del juego. El pie termina en ONDAS
suaves y simétricas, como el borde de un pétalo. Filete fino y curvo.
```

### 🐉 Dracónidos

```
Panel liso PÚRPURA PROFUNDO casi negro (#3b1c4e). El pie se corta en punta con
DOS ESCALONES a cada lado, como escamas superpuestas bajando hacia el vértice.
Filete recto.
```

### 🐀 Hombres rata

```
Panel liso MARRÓN ENFERMO (#5a4326). El pie está roto y desigual, con un corte
mordido. Cruzando el pie, una FRANJA ESTRECHA Y TORCIDA de color amarillo-verde
ácido (#a8b820), como un retal que no pega — es el único sitio de la pieza con un
segundo color.
```

### 🤖 Constructos

```
Panel liso PIEDRA PÁLIDA (#8d8b83). El pie NO se corta en punta: termina RECTO,
horizontal y limpio, y la pieza entera es perfectamente simétrica y rígida — es
una placa, no un paño. Filete doble, recto y geométrico.
```

### 🧜 Abisales

```
Panel liso AZUL TINTA muy oscuro (#12293f). El pie termina en ONDAS irregulares
y asimétricas, sin ningún tramo recto. Filete que ondula con el borde.
```

---

## Bloque 3 — negative prompt

> **No es el negative prompt de los iconos** ni el maestro de las ilustraciones.
> Aquel prohíbe color y medallones, que aquí son justo lo que se pide.

```
emblem, logo, coat of arms, crest, heraldic charge, shield, sigil, insignia,
badge, monogram, symbol on the banner, icon, rune, star, sun, skull, animal,
face, figure, text, letters, numbers, watermark, signature,
glow, glowing edges, neon, bloom, embers, fire,
light source, specular highlight, cloth folds, drapery, wrinkles, creases,
waving flag, fabric texture, woven threads, stitching, seams, embroidery, frayed
threads, stains, dirt, grunge overlay, gold on the cloth, golden stripe on the
banner, chain, rope, tassels, fringe, 3D render,
photorealistic, painterly rendering, heavy shading, scene, background,
landscape, ground shadow, drop shadow, multiple banners, collage, grid, cropped
at canvas edge, off-center, square format, horizontal flag
```

**Dos ausencias deliberadas.** No se prohíben `torn` ni `ragged`: cuatro cortes
—No-muertos, Orkos, Hombres rata y Abisales— **piden** un borde roto o irregular,
y prohibirlo en bloque los rompe. Lo que se prohíbe es el **hilo suelto**
(`frayed threads`) y la costura, que es de dónde venía el ruido: el corte va
dibujado en plano, no simulado.

---

## Al terminar

Lo que hay que mirar en los once archivos. Los tres primeros son el motivo de las
dos correcciones:

1. **Que no haya NADA dibujado en el panel.** Fue el fallo de la primera tanda.
2. **Que el PAÑO sea plano.** Ni pliegues, ni trama, ni desgaste. Fue el fallo
   de la segunda tanda, y es el que hay que mirar con más desconfianza porque una
   IA añade «realismo» sin que se lo pidas. El asta y el filete no son ese
   problema: van dorados y van bien.
3. **Que no haya oro DENTRO del paño.** En el travesaño y en el contorno, sí.
4. **Que nada brille.** Ni resplandor ni especular: eso es de la veta de Rareza.
5. **Que las medidas del PAÑO sean las de la norma** —700 de ancho centrado, de
   y=105 a y=1715, corte en y=1393— y no las del lienzo. Fue el fallo de la
   tercera tanda: el «1 : 2,3» se aplicó al lienzo, el asta se llevó el 30 % del
   ancho y la tela salió a 1 : 3,0, o sea una bandera demasiado larga. **Se mide
   con una regla, no se mira.**
6. **Que las once caigan igual** por encima del 20 % inferior: mismo ancho, mismo
   borde de arriba, mismo contorno. Es la regla 5, y es la que decide si se
   pueden meter en el mismo hueco de la carta.
7. **Que el corte de abajo se distinga entre las once** puestas en fila. Es la
   mitad de la personalidad de la pieza y la única que no aporta el color.
8. **Fondo transparente y sin sombra horneada** — la sombra la pone el CSS con
   `drop-shadow`.

Van a `public/assets/v3/banners/<slug>.png`, con el slug de siempre —`humanos`,
`enanos`, `no-muertos`, `demonios-infernales`, `elfos`, `orkos`, `feericos`,
`draconidos`, `hombres-rata`, `constructos`, `abisales`—, y su norma de archivo
está en
[`public/assets/v3/README.md`](../../../public/assets/v3/README.md).
