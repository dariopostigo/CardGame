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

> **Retocado el 28 de agosto de 2026: tres emblemas se rehacen**, por decisión de
> Dario sobre lo entregado. **👤 Humanos** deja de ser una bandera y se queda solo
> con el sol, que era lo que le gustaba de aquel dibujo; **💀 No-muertos** pasa a
> ser una **calavera**; **🐀 Hombres rata** pasa a ser una **cabeza de rata**. Los
> tres bloques de abajo ya están corregidos y llevan su nota de qué cambió. Las
> otras ocho no se tocan. Y esto **reabre un pendiente que el 27 se daba por
> cerrado**: con la calavera dibujada, la colisión triple del 💀 vuelve a estar
> viva y ya no se resuelve «sin tocar el catálogo» —ver *Las cuatro calaveras*,
> abajo—.

> **Y los tres entraron el 29 de agosto de 2026, tal como los pedían estos
> bloques**: el sol solo, la calavera rota sin mandíbula con la venda cruzada y
> la cabeza de rata de frente con una oreja mordida y la cola por detrás. Están
> en `public/assets/v3/icons/races/` y **los tres viejos se guardan** en
> `icons/races/old/`. Ningún prompt de abajo hay que corregirlo por lo entregado:
> los tres salieron a la primera, y de paso cerraron la pregunta del «un solo
> metal» a favor de la línea en positivo —ver el final de este documento—.

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

De los dos pendientes que §4 dejaba anotados, y que el 27 de agosto se dieron los
dos por cerrados, **hoy solo cae uno entero**:

| Pendiente de §4 | Cómo queda |
|---|---|
| 👤 Humanos es una silueta genérica: «persona» no dice Humanos | **Cerrado.** Deja de ser una figura y pasa a ser **su heráldica**, que es lo único de sus ocho ejes que no comparte con ninguna otra raza. Desde el 28 de agosto es **el sol solo**, sin gonfalón: el paño era el envase, no el símbolo |
| 💀 se usa tres veces (raza, Característica *No-muerto*, clase *Nigromante*) y 😈 dos | **Cerrado el 😈, abierto el 💀.** Demonios son **cuernos partidos**, no una llama ni una cara, y ahí la colisión desaparece sola. Pero No-muertos **sí es una calavera** desde el 28 de agosto, así que el 💀 vuelve a estar tres veces —cuatro contando el ☠️ del grupo Veneno de §3— y hay que separarlas por dibujo |

### Las cuatro calaveras

Con el 💀 dibujado, el set tiene **cuatro conceptos con cráneo y solo uno hecho**.
No los puede separar el color —no hay— ni el envase —el medallón solo distingue
Característica de Habilidad, y un emblema de raza no lleva ninguno—, así que los
separa la silueta y nada más:

| Concepto | Dónde vive | Qué lo separa |
|---|---|---|
| **Raza No-muertos** | Emblema, `races/no-muertos` | **Rota y sin mandíbula**, con venda. Es la única calavera incompleta del juego, y eso no es un adorno: sale de su eje *Silueta*, «siempre falta algo» |
| **Característica *No-muerto*** | Raíl de la carta, con medallón | Sin dibujar. Le toca la calavera **entera**, con su mandíbula, que es justo lo contrario de la de raza |
| **Clase *Nigromante*** | [`docs/v3/razas.md`](../../../../docs/v3/razas.md) | Sin dibujar. No debería ser una calavera a secas: la clase es **quien la maneja**, no quien la es |
| **Grupo ☠️ Veneno**, sus tres papeles (`icons.md` §3) | Raíl de la carta, con medallón | Sin dibujar, y es **el que hay que mover**. Un cráneo con tibias cruzadas a 27 px es la misma mancha que los otros tres, y este es el único de los cuatro que no necesita un cráneo para decir lo que dice |

**Aquí solo se cierra la parte de raza.** Las otras tres filas son catálogo de
`icons.md` §3 y de `docs/v3/razas.md`, y se deciden allí; queda apuntado como
pendiente en §4 y §7. Lo que sí manda este documento es que el emblema de raza
llega primero y se lleva la calavera rota, así que las otras tres se dibujan
**contra** ella.

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
EMBLEMA: un SOL HERÁLDICO de ocho rayos rectos y puntiagudos que salen de un
DISCO central macizo. Los rayos son anchos en la base y acaban en punta, todos
del mismo largo, y ese largo es como mínimo el radio del disco. Alrededor del
borde del disco, una hilera de REMACHES gruesos; por dentro el disco va liso.
Forjado como una pieza de armadura, no dibujado como un sol de cielo.
SIN BANDERA, SIN ASTA Y SIN TELA. SIN CARA DENTRO DEL SOL.
```

> **Cambió el 28 de agosto de 2026**: era un gonfalón con el sol dentro y ahora
> es el sol solo. No se pierde el argumento —la heráldica sigue siendo lo único
> de sus ocho ejes que no comparte con nadie—, se pierde el envase: a 27 px el
> paño era la mancha grande y el sol el detalle interior, o sea justo al revés de
> la regla 1 de §6. Los remaches son suyos, del eje *Motivos* («heráldica simple
> y legible, remaches visibles»), y son lo que impide que el sol salga celeste en
> vez de forjado.
>
> **Vigilar la pareja nueva con 🤖 Constructos**, que son ya los dos únicos
> emblemas simétricos del set. Los separa que uno es **estrellado** y el otro **de
> lados planos**, y por eso el prompt fija el largo mínimo de los rayos: si el sol
> vuelve con rayos cortos y romos, se parecen, y lo que se corrige es el sol
> —rayos más largos—, nunca el hexágono.

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
EMBLEMA: una CALAVERA DE FRENTE, solo el cráneo, SIN LA MANDÍBULA INFERIOR: las
cuencas de los ojos hundidas y profundas, la fosa nasal marcada, la fila de
dientes superiores apenas insinuada. Le FALTA UN TROZO DE HUESO en la sien de un
SOLO lado, con el borde partido y astillado, para que el contorno quede
asimétrico e incompleto. Una VENDA ancha cruza la frente en diagonal y cae
suelta por el lado contrario al roto. La venda es del MISMO LATÓN que el hueso:
un solo metal en toda la pieza, sin hueso pálido ni tela de otro tono. Silueta
ancha y redonda arriba, estrechándose abajo. SIN TIBIAS CRUZADAS.
```

> **Cambió el 28 de agosto de 2026**: era un costillar, y el costillar existía
> para esquivar el 💀. Ahora es la calavera que su eje *Motivos* pedía desde el
> principio, y lo que la hace **suya** —y la separa de las otras tres calaveras
> del juego, ver *Las cuatro calaveras*— es que **está rota**: sin mandíbula y con
> la sien partida. Eso no es decoración, es su eje *Silueta* entero: «siempre
> falta algo».
>
> Dos líneas del prompt están ahí a propósito y no se quitan. **«Sin tibias
> cruzadas»** es lo único que la separa del ☠️ del grupo Veneno de §3, que todavía
> no está dibujado. Y **«la venda es del mismo latón»** es la corrección de la
> primera tanda: la venda salió en hueso pálido, fuera del monocromo, porque el
> material del objeto tira más que la regla del set y hay que decirlo en positivo.

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
EMBLEMA: una CABEZA DE RATA DE FRENTE, animal y no humanoide. DOS OREJAS
GRANDES Y REDONDAS, muy separadas, que son lo más ancho de la pieza; la oreja
de la derecha va MORDIDA, con una muesca abierta en el borde. Hocico estrecho
que se adelanta hacia el espectador, ojos pequeños y hundidos, y DOS INCISIVOS
LARGOS asomando por debajo del hocico. Una COLA DESNUDA Y ANILLADA sube por
detrás de la cabeza y se curva sobre uno de los lados; la cola es del MISMO
LATÓN que la cabeza, un solo metal en toda la pieza, nada de cobre ni de rosado.
Solo la cabeza: SIN CUERPO Y SIN HOMBROS.
```

> **Cambió el 28 de agosto de 2026**: era un vial remendado con la cola
> enroscada. La cabeza es lo que pidió Dario; **la cola se queda** porque es el
> eje *Silueta* de la raza —«la cola cierra la lectura, y es lo que la distingue
> de un orko pequeño»—, y si al verla sobra, se borran sus dos frases y el resto
> del bloque sigue en pie.
>
> Va **de frente** a propósito: 🐉 Dracónidos es la única cabeza de perfil del
> set, y de frente contra de perfil no compiten ni a 27 px. Lo que las separa de
> verdad son **las orejas**, que es la mancha ancha que ninguna otra cabeza del
> juego tiene —tampoco la tendrá 🐺 *Bestia* de §3, cuya oreja es triangular—. La
> línea del latón es la corrección de la primera tanda, donde la cola salió en
> cobre rosado.

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

Y desde el 28 de agosto de 2026, **una retirada por bloque y no general**: en los
tres emblemas que son una cabeza —💀 No-muertos, 🐀 Hombres rata y 🐉
Dracónidos— hay que **quitar `face, portrait` del negativo**. Ahí el glifo *es*
una cara, y prohibirla pelea contra el propio bloque; con el costillar y el vial
no pasaba, y por eso no se había visto. Lo que sigue prohibido en los tres —y es
lo que de verdad protegía esa línea— es `full human figure, standing character,
humanoid body`: ninguno de los once es un humanoide, y una cabeza animal o de
dracónido no lo es.

---

## Al terminar

**Primero los once juntos, que es lo único que no se juzga de uno en uno.**
Montados en una cuadrícula **a 42 px** y mirados a la vez: es el requisito de §4
y no se comprueba con el archivo a tamaño completo. Las parejas que vigilar eran
dos, por motivo compartido de cuerno o de ala; **con el retoque del 28 de agosto
son cinco**, y tres de ellas las estrena ese retoque:

| Pareja de riesgo | Qué las separa |
|---|---|
| 🔥 Demonios vs 🐉 Dracónidos | Demonios es **solo el par de cuernos**, curvos hacia arriba y uno partido, sin cabeza. Dracónidos es **una cabeza de perfil** con hocico: hay masa y dirección, no dos puntas |
| 🧚 Feéricos vs 🐉 Dracónidos | Feéricos es **ala de insecto**, retícula de nervaduras y contorno recortado. En Dracónidos no se dibuja ninguna ala — su ampliación es la cresta |
| 💀 No-muertos vs 🧟 Orkos *(nueva)* | Las dos son hueso con dientes. No-muertos es el **cráneo sin mandíbula**: alto, redondo arriba, con dos cuencas negras. Orkos es **solo la mandíbula**: baja, ancha, con los colmillos apuntando hacia arriba y la cuerda. Una es la mitad que a la otra le falta, y por eso juntas se leen — pero hay que mirarlas juntas |
| 🐀 Hombres rata vs 🐉 Dracónidos *(nueva)* | Las dos son ahora una cabeza. Hombres rata va **de frente y con dos orejas redondas** que son lo más ancho de la pieza; Dracónidos va **de perfil**, sin orejas, y su ancho lo pone la cresta hacia atrás |
| 👤 Humanos vs 🤖 Constructos *(nueva)* | Los dos únicos simétricos del set. Humanos es **estrellado**, de puntas largas; Constructos es **de lados planos**, un hexágono. Si el sol vuelve con rayos cortos, la que se corrige es Humanos |

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

> **Esas dos líneas ya están escritas** en sus bloques desde el 28 de agosto, y
> **cayeron en la misma pieza que se rehizo**: la venda sigue en la calavera y la
> cola sigue en la cabeza de rata, así que la regeneración de los tres emblemas
> fue también la prueba de si la línea en positivo aguanta el monocromo.
>
> **La pasó, el 29 de agosto.** Midiendo qué proporción del glifo se aparta del
> latón, la venda baja del 31 % al 5 % y la cola del 56 % al 16 %: la calavera
> nueva es el emblema más monocromo de los once y la rata entra en la banda de
> los ocho que no se tocaron (13–41 %). Así que el rasgo 1 de §5 **no hay que
> tocarlo** — faltaba la frase, no sobraba la regla. Es la respuesta a la pregunta
> abierta de `icons.md` §7.

**Y los tres archivos viejos no se borran, se apartan.** Este documento pedía
borrarlos —«no valen como respaldo de nada, porque el dibujo está descartado, no
la ejecución»— y el 29 de agosto Dario decidió lo contrario: `humanos.png`,
`no-muertos.png` y `hombres-rata.png` con el gonfalón, el costillar y el vial
viven en `public/assets/v3/icons/races/old/`. El motivo no es el respaldo, que
efectivamente no sirve: es tener a la vista **bocetos distintos del mismo
emblema**, que es lo único que este set tiene de eso — los otros ocho se
generaron una vez y no hay con qué compararlos. La carpeta no la sirve el juego:
nada la referencia y no entra en las cuentas de peso de `icons/`.
