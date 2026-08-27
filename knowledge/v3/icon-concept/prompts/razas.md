# Prompts — los 11 emblemas de raza

> **Qué es esto: los prompts montados y listos para pegar** en una IA para
> generar los once emblemas de raza que inventaría
> [`../icons.md`](../icons.md#4-los-11-emblemas-de-raza) §4. Allí está *qué*
> emblemas hacen falta y *cómo* se dibuja el set entero; aquí está *lo que se
> pega en la IA*. Es el mismo reparto que usan las razas entre
> [`../../races-concept/sujetos.md`](../../races-concept/sujetos.md) y
> [`../../races-concept/prompts/`](../../races-concept/prompts/preambulo.md).

> **Escrito el 27 de agosto de 2026, y los once se generaron el mismo día.** El
> dibujo de cada emblema —qué objeto es— **no estaba decidido en `icons.md` §4**,
> que solo tenía el emoji provisional y dos problemas anotados. Se propuso aquí
> por primera vez, derivado de los ejes **Motivos** y **Silueta** de cada raza en
> [`sujetos.md`](../../races-concept/sujetos.md#identidad-de-raza), y los once
> archivos están en `public/assets/v3/icons/races/`. **Lo que salió, medido, está
> en [`../icons.md`](../icons.md#4-los-11-emblemas-de-raza) §4** — incluidas las
> dos desviaciones: `no-muertos` y `hombres-rata` salieron con un segundo tono
> fuera del latón, contra el rasgo 1 de §5, y está sin decidir si se acepta. Si un
> emblema se regenera, el prompt se corrige aquí.

## Lo que condiciona los once

Dos restricciones, y las dos salen de decisiones ya cerradas. Mandan sobre
cualquier idea de emblema:

- **El set es oro monocromo** (`icons.md` §5). No hay color por concepto, así que
  el **acento de paleta** que distingue cada raza a 100 px en una ilustración
  —el granate enano, el turquesa abisal— **no está disponible aquí**. Lo hace
  todo la silueta.
- **Se miran los once juntos a 42 px** (`icons.md` §4). No compiten contra un
  fondo variable como las Características: compiten entre ellos, once a la vez,
  en la misma cuadrícula. Por eso **ninguno es una figura humanoide** — lo serían
  siete de las once, y a ese tamaño no se distinguirían entre sí.

Y de paso caen los dos pendientes que §4 dejaba anotados, los dos **por dibujo y
no por catálogo**:

| Pendiente de §4 | Cómo se resuelve aquí |
|---|---|
| 👤 Humanos es una silueta genérica: «persona» no dice Humanos | Deja de ser una figura. Pasa a ser **su heráldica** —gonfalón y sol—, que es lo único de sus ocho ejes que no comparte con ninguna otra raza |
| 💀 se usa tres veces (raza, Característica *No-muerto*, clase *Nigromante*) y 😈 dos | **Ninguno de los dos se dibuja**: No-muertos es un **costillar**, no una calavera; Demonios son **cuernos partidos**, no una llama ni una cara. La colisión desaparece sin tocar el catálogo |

## Cómo se usa

1. Le das [`../icons.md`](../icons.md) §5 y §6 como contexto, o directamente el
   preámbulo de abajo, que es su resumen operativo.
2. Pegas el **preámbulo** una vez.
3. Pegas **un bloque de raza**. Una imagen por bloque.
4. Si la herramienta admite negativos, pegas el **negative prompt**.
5. **Adjunta uno de los ocho iconos de Habilidad ya entregados**
   (`public/assets/v3/icons/abilities/`) con una línea del tipo «mantén
   exactamente este relieve, este metal y este canto; cambia solo el dibujo». Es
   la lección 2 del preámbulo de las razas —*la consistencia se hace adjuntando
   la imagen aprobada, no repitiendo el prompt*—, y aquí sale gratis: el estilo
   ya está producido y aprobado en diez archivos.

---

## Bloque 1 — preámbulo

> Traducción a prompt de `icons.md` §5 (los cinco rasgos de la dirección
> elegida), §6 regla 1 (silueta antes que detalle), §6 regla 2 (los dos fondos)
> y §6 regla 4 (los 42 px). Si §5 o §6 cambian, se resincroniza **este** bloque.

```
Pictograma de interfaz para un juego de cartas de fantasía. RELIEVE DE METAL
DORADO, MONOCROMO: un solo metal, oro pálido / latón, sin ningún otro color.
El glifo es una SILUETA MACIZA TALLADA EN METAL, con el canto biselado,
encendido por arriba a la izquierda y en sombra por el lado opuesto. Contorno
exterior oscuro y definido.

DIBUJO DE UNA SOLA PIEZA Y SIN ESCENA: un objeto, centrado, de frente o de
perfil limpio. Nada de fondo, nada de paisaje, nada de figura humana completa,
nada de composición con varios elementos sueltos.

Luz principal desde ARRIBA A LA IZQUIERDA, siempre.

LEGIBILIDAD: tiene que leerse a 42 px de alto. La silueta manda sobre el
detalle: si el dibujo depende de una línea fina o de un detalle interior, está
mal. Tiene que funcionar igual sobre metal oscuro y sobre pergamino claro.

FORMATO: cuadrado, fondo TRANSPARENTE, el glifo centrado y ocupando ~90% del
lienzo, con el canto y su sombra dentro del lienzo sin recortarse en el filo.
```

**El emblema va desnudo, sin aro y sin medallón.** En la dirección elegida el
medallón es el envase de las **Características**, no de las razas (`icons.md`
§5, *el envase dice de qué tipo es el icono*), y el medallón de raza de la carta
**ya lo pinta el marco**. Un aro en el archivo se sumaría al del marco y no
caben los dos — es exactamente el choque que §5 deja abierto para las
Características, y aquí no hay que heredarlo.

---

## Bloque 2 — los once emblemas

Cada bloque lleva dos líneas: la **identidad** de la raza, resumida de sus ocho
ejes, que es contexto para la IA, y el **EMBLEMA**, que es la instrucción.

### 👤 Humanos

Acero y heráldica; gente corriente de castillo y campo cultivado, oficio militar
y estandartes.

```
EMBLEMA: un gonfalón heráldico colgado de su asta —paño rectangular acabado en
dos picos abajo— con un SOL de ocho rayos rectos en el centro. La tela cae
recta, con dos pliegues marcados. Remaches visibles en el asta.
```

### ⛏️ Enanos

Piedra, hierro sin pulir y forja; bajos y anchísimos, geometría angular.

```
EMBLEMA: un YUNQUE macizo visto de perfil, base ancha y cuerno pronunciado, con
remaches gruesos en el costado y un nudo geométrico angular grabado en el
flanco. Proporción de trapecio: mucho más ancho que alto.
```

### 💀 No-muertos

Hueso, verdín y cripta; contorno roto al que siempre le falta algo.

```
EMBLEMA: una CAJA TORÁCICA de frente, costillas curvas a los lados de la
columna, con DOS COSTILLAS PARTIDAS en un solo lado para que el contorno quede
asimétrico e incompleto. Una venda suelta cruza por detrás. SIN CALAVERA.
```

### 🔥 Demonios infernales

Carbón, sangre y brasa; se reconoce por el perfil de la cabeza antes que por el
cuerpo.

```
EMBLEMA: un PAR DE CUERNOS DESPAREJADOS que arrancan de una base corta y se
curvan hacia arriba y hacia fuera; el de la derecha está PARTIDO a media altura.
Entre las bases, un sello infernal grabado y agrietado. SIN LLAMA Y SIN CARA.
```

### 🧝 Elfos

Verdes fríos y plata, filigrana curva; alta, estrecha y vertical.

```
EMBLEMA: una HOJA lanceolada estrecha, vertical, con su nervio central marcado,
enmarcada por un ARCO CRECIENTE fino que la abraza por los lados sin cerrarse
arriba. Todo curvo, nada recto. Silueta más alta que ancha.
```

### 🧟 Orkos

Oliva sucio y óxido, equipo remendado, todo mate; encorvada hacia delante y
asimétrica.

```
EMBLEMA: una MANDÍBULA INFERIOR ancha y baja, vista de frente, con colmillos
desparejados que sobresalen hacia arriba —uno más largo y uno roto—, atada con
cuerda tosca por un extremo. Proporción baja y ancha, claramente asimétrica.
```

### 🧚 Feéricos

Pálidos e iridiscentes, translucidez, apéndices finos; la única que no se lee
como masa sólida.

```
EMBLEMA: un PAR DE ALAS DE INSECTO desplegadas, nervaduras internas visibles
como una retícula, el par ligeramente desigual, con una ESPIRAL fina saliendo
del punto donde se juntan. Bordes recortados y ligeros, contorno no macizo.
```

### 🐉 Dracónidos

Púrpura y escama, joya oscura; el contorno sale del cuerpo por detrás y por
arriba.

```
EMBLEMA: CABEZA DE DRACÓNIDO DE PERFIL mirando a la izquierda, hocico alargado
y cerrado, placas de escama superpuestas en la mejilla y una CRESTA DE CUERNOS
que se abre hacia atrás y hacia arriba, ampliando la silueta por detrás. Porte
imponente y severo: nada de hocico amable ni ojo grande y expresivo.
```

### 🐀 Hombres rata

Marrón enfermo y ácido líquido; baja, encorvada, y la cola cierra la lectura.

```
EMBLEMA: un VIAL de cuello estrecho, tapón de corcho, con una COLA DE RATA larga
y desnuda enroscada dos vueltas alrededor del cuerpo del vial y la punta saliendo
por un lado. El vial va abollado y remendado con un aro de metal desparejado.
```

### 🤖 Constructos

Hierro y piedra pálida, runa dentro de línea grabada; la única raza simétrica del
juego.

```
EMBLEMA: una PLACA HEXAGONAL perfectamente simétrica, remachada en cada vértice,
con una RUNA de trazos RECTOS grabada y hundida en el centro. Geometría dura,
eje vertical exacto, ningún borde orgánico.
```

### 🧜 Abisales

Tinta profunda y bioluminiscencia orgánica; ondulada, ningún borde es una línea
limpia.

```
EMBLEMA: una CONCHA EN ESPIRAL vista de frente, tres vueltas, con un TENTÁCULO
que sale de la boca de la concha y se curva hacia fuera, las ventosas marcadas
por debajo. Percebes pequeños adheridos al borde. Todo el contorno ondulado,
ninguna recta.
```

---

## Bloque 3 — negative prompt

> **No es el negative prompt maestro de las ilustraciones**
> ([`style-guide.md`](../../art-direction/style-guide.md) §20) y no hay que
> mezclarlos: la mitad de aquél habla de encuadre de figura, de rostros y de
> fondo, y aquí no hay ninguna de las tres cosas. Este es propio del set de
> iconos.

```
color, multicolor, colored icon, rainbow palette, gradient background, painted
illustration, photorealistic, 3D render, glossy plastic, chrome, silver, copper,
multiple metals, flat vector icon, thin line icon, outline-only, sticker,
emoji, cartoon mascot, scene, background, landscape, environment, shadow on
ground, full human figure, standing character, humanoid body, face, portrait,
text, letters, numbers, logo, watermark, signature, frame, border, circular
ring, medallion, badge, ornate rim, drop shadow outside the glyph, glow, neon,
bloom, motion blur, busy interior detail, microdetail, hatching, cropped at
canvas edge, off-center, multiple separate objects, collage, grid of icons
```

Dos ausencias deliberadas, por la misma doctrina de positivo que aprendieron las
razas: **ni `asymmetrical` ni `broken`**. Cuatro emblemas —No-muertos, Demonios,
Orkos, Feéricos— **piden** asimetría o rotura, y prohibirla en bloque los rompe.
Lo que se pide en positivo va en su bloque.

---

## Al terminar

**Primero los once juntos, que es lo único que no se juzga de uno en uno.**
Montados en una cuadrícula **a 42 px** y mirados a la vez: es el requisito de §4
y no se comprueba con el archivo a tamaño completo. Dos parejas son las que
vigilar, porque comparten motivo de cuerno o de ala:

| Pareja de riesgo | Qué las separa |
|---|---|
| 🔥 Demonios vs 🐉 Dracónidos | Demonios es **solo el par de cuernos**, curvos hacia arriba y uno partido, sin cabeza. Dracónidos es **una cabeza de perfil** con hocico: hay masa y dirección, no dos puntas |
| 🧚 Feéricos vs 🐉 Dracónidos | Feéricos es **ala de insecto**, retícula de nervaduras y contorno recortado. En Dracónidos no se dibuja ninguna ala — su ampliación es la cresta |

**Y la cuadrícula sigue sin montarse.** Los once están entregados y juzgados de
uno en uno, que es exactamente lo que §4 decía que no bastaba. Al mirarlos a 42
px hay un sospechoso que no estaba en la tabla de riesgo: **`feericos` es el
único calado del set** —nervadura fina sobre hueco, mientras los otros diez son
masa—, y el calado se empasta antes que cualquier colisión de motivo.

Y tres cosas que se sabían de la primera tanda y se repitieron:

- **El encuadre salió sin normalizar, y algo peor.** La caja del glifo va del
  **84 % al 98 %** del lienzo —antes 84–97— y en cinco de los once el alto pasa
  del 95 %. Es una pasada mecánica de recorte y relleno a caja común, posterior,
  y **no se le vuelve a pedir al generador**.
- **La extensión y el peso siguen sin decidir.** Los once entraron como `.png` de
  1254×1254 y pesan 15 MB, así que `icons/` va por 26 MB en 21 archivos. La norma
  se decide en
  [`public/assets/v3/README.md`](../../../../public/assets/v3/README.md), y el
  `.webp` de su tabla de lienzo no vale tal cual — es la norma de una ilustración
  a sangre y sin transparencia.
- **El contraste queda aceptable en los dos fondos y bien en ninguno**, que es lo
  que compra un solo dorado medio. Lo que salva al glifo sobre fondo claro es **el
  contorno oscuro, no el relleno**: si un emblema sale sin contorno, no se arregla
  aclarando el oro.

Y una que no se sabía: **el prompt no basta para sostener «un solo metal»**.
`no-muertos` devolvió la venda en hueso pálido y `hombres-rata` la cola en cobre
rosado, las dos claramente fuera del latón, porque el material del objeto tira
más que la regla del set. Si se decide mantener el monocromo estricto, esos dos
prompts necesitan la línea en positivo —«la venda es del mismo latón que el
hueso», «la cola es del mismo latón que el vial»—, no una prohibición en el
negativo.
