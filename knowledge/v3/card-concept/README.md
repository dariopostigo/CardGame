# Conceptos de marco de carta — V3

> Base de datos de referencias para **el diseño de la carta como objeto**: marco,
> disposición, tipografía, dónde caen los números. Es la tercera pata que
> faltaba, la que [`../art-direction/`](../art-direction/README.md) deja fuera a
> propósito: allí `style-guide.md` dice **cómo se dibuja** e `illustrations.md`
> dice **qué se dibuja**; aquí se decide **dónde se mete**.
>
> De esta carpeta cuelga un dato que hoy vive en otro sitio: **la medida de la
> ilustración** ([`public/assets/v3/README.md`](../../../public/assets/v3/README.md#lienzo-y-formato))
> está bloqueada por el marco que se decida aquí.
>
> Un concepto entra aquí porque algo suyo sirve, no porque guste entero. Cada
> ficha dice qué se roba y qué se descarta.

**Las imágenes viven aquí, junto al texto**, para poder hojear los conceptos sin
salir de la carpeta. Es la excepción a la norma de
[`public/concepts/`](../../../public/concepts/): allí va la referencia visual
que se cita desde el código (la paleta, el botón con remache, la mesa del
tablero), aquí la que se está analizando para tomar una decisión de diseño.
`olden-era.png` es copia de `public/concepts/oldenEra/2.png`, que se queda
también en su moodboard.

## Contra qué se juzgan

La carta de unidad de V3 tiene que sostener **13 datos** y ningún párrafo de
prosa — a diferencia de las de v2, que eran casi todo texto de efecto:

| Bloque | Datos |
|---|---|
| Identidad | Nombre · Raza · Tier (1–8) · Rareza |
| Arte | Ilustración |
| Habilidades | Vida · Ataque · Defensa · Resistencia mágica · Precisión · Suerte · Velocidad · Movimiento |
| Características | De 0 a **5** chips (icono + nombre) |

> **Son cinco, no cuatro.** Este documento decía "de 0 a 4" y estaba mal: en la
> tabla de unidades de [`docs/v3/razas.md`](../../../docs/v3/razas.md) hay
> **seis** unidades de tier 8 con cinco Características —🐉 Dragón esquelético,
> 👹 Balor, 🐲 Dragón ancestral, 🐙 Kraken ancestral, ⚙️ Coloso mecánico y
> 🧪 Abominación de plaga—. El marco tiene que aguantar cinco, y un chip de más
> es justo lo que rompe un raíl o una cenefa que iba justa.

Y tiene que aguantar los dos extremos de
[`docs/v3/razas.md`](../../../docs/v3/razas.md) sin romperse:

- **🗡️ Miliciano (tier 1)** — cero Características, Vida de dos cifras, nombre
  corto. Es el que descubre los huecos que se ven vacíos.
- **🐉 Dragón dorado (tier 8)** — cuatro Características, Vida de tres cifras,
  nombre de catorce caracteres. Es el que descubre los huecos que rebosan.
- **🐉 Dragón esquelético (tier 8, No-muertos)** — cinco Características y
  dieciocho caracteres de nombre. No es de Humanos, así que no toca a la raza
  piloto, pero es el peor caso real del catálogo y por eso entra.

## Dónde se ven dibujados

Los tres conceptos de abajo están montados como bocetos funcionando en la wiki,
en **Cartas › Diseño de cartas** (`/docs/v3/cards/design`): un boceto por
concepto, con los tres sujetos de arriba y los otros tres de en medio. El
código está en `components/design/v3/` (los sujetos de muestra, en
`sample.ts`) y sus estilos en `styles/components/card-sketch/`.

Es donde se contesta lo que este documento deja abierto, porque hay cosas —si
la fila de ocho se lee, si el cero molesta, cuánto arte se come un panel— que
no se deciden mirando referencias sino mirando la carta.

A partir del cuarto, los bocetos ya **no salen de una referencia nueva sino de
cruzar los que hay** (ver §"Mezclas"). Se siguen numerando con letra y viven en
la misma página.

---

## Concepto A — Olden Era

![Ficha de Señor vampiro de Olden Era](olden-era.png)

*Heroes of Might & Magic: Olden Era*, ficha de criatura (Señor vampiro).
📎 `olden-era.png`

**Es prácticamente nuestro modelo de datos ya dibujado.** De los tres es el
único que enseña ocho estadísticas a la vez y sigue siendo legible.

| Zona | Qué hace |
|---|---|
| Cabecera | Banda con cantoneras ornamentales y el nombre centrado |
| Tira de stats | **Ocho** pares icono-sobre-número en una sola fila, todos al mismo tamaño, sin etiquetas de texto |
| Raíl izquierdo | Las Características como **medallones circulares** apilados en vertical, encima del arte |
| Arte | A sangre, ocupa todo el cuerpo; el marco lo pisa |
| Pie | Economía de reclutamiento (oro y crecimiento) |

**Qué se roba.** Dos cosas, y las dos son respuestas a preguntas que teníamos
abiertas:

1. **Dónde van las ocho Habilidades**: en una tira, todas iguales, icono arriba
   y número abajo, sin jerarquía. Yo proponía cuatro grandes y cuatro finas;
   esto demuestra que con iconos buenos no hace falta jerarquizar.
2. **Cómo se resuelve el rango 0–4 de Características**: un raíl vertical sobre
   el arte. Es la mejor solución al problema del Miliciano que hemos visto,
   porque con cero medallones **no queda un hueco vacío** — queda arte. El raíl
   no es una fila de la cuadrícula, es una capa encima.

**Qué no encaja.** Es un panel de interfaz, no una carta: proporción casi
cuadrada, sin tratamiento de Rareza por ningún lado, y el pie es economía de
reclutamiento que V3 todavía no ha decidido si tiene. Imprime los ceros en vez
de ocultarlos (Suerte 0), que es una decisión a tomar aparte.

---

## Concepto B — Mano inicial (Steam, app 3918850)

![Mano inicial de cinco cartas](steam-3918850-mano-inicial.jpg)

📎 `steam-3918850-mano-inicial.jpg` · captura de la ficha de Steam de la app
3918850, descargada al repo porque su URL lleva sello de tiempo y caduca.

**El único de los tres que es una carta de verdad, en la mano, y a proporción
de carta.** Cinco en pantalla y todas se leen.

| Zona | Qué hace |
|---|---|
| Gema de coste | Círculo dorado grande **solapado sobre la esquina superior izquierda**, mordiendo el marco |
| Chip secundario | Un `+2` pequeño colgando bajo la gema, y bajo él un banderín de facción |
| Arte | A sangre en el ~55% superior, fundido en negro hacia el panel |
| Nombre | Versalitas doradas, filete fino debajo |
| Texto | Serif clara, centrada |
| Pines de pie | Espada abajo-izquierda (ataque) y gema roja abajo-derecha (vida), con el tipo de criatura (`HUMAN`, `ELEMENTAL`) centrado y pequeño entre las dos |

**Qué se roba.** La **proporción y la disciplina de contraste** —es la prueba
de que un diseño oscuro con oro aguanta cinco cartas juntas—, el patrón de
**colgar un valor secundario bajo el principal** (la gema con su `+2`), y los
**dos pines de esquina inferior** para los números que se consultan en cada
intercambio de golpes.

**Qué no encaja.** Solo lleva dos estadísticas. Nuestras ocho no caben en esta
disposición sin rehacerla, y la mitad inferior se la come un párrafo de
descripción que V3 **no tiene**: ese espacio es justo el que nos sobra para la
tira de stats del concepto A.

---

## Concepto C — Warhammer Combat Cards

![Cinco cartas de Warhammer Combat Cards](warhammer-combat-cards.png)

📎 `warhammer-combat-cards.png` · lámina promocional de *Warhammer Combat
Cards*, descargada al repo porque venía de un enlace temporal de Google.

**El más agresivo de los tres, y el que enseña que se puede prescindir del
texto por completo.** Cero prosa: todo son números y glifos.

| Zona | Qué hace |
|---|---|
| Marco | Borde de piedra tosca e irregular, con puntas de flecha en las esquinas de abajo |
| Arte | **Es la carta entera**: no hay ventana de ilustración, hay ilustración con un borde encima |
| Gemas superiores | Dos, **desbordando las esquinas**: círculo dorado a la izquierda, escudo rojo a la derecha |
| Placa de nombre | Losa de piedra solapada sobre el tercio inferior, con **nombre + subtítulo** |
| Vainas de stats | Fila de tres cápsulas oscuras bajo la placa |
| Cenefa de rasgos | Tira de glifos diminutos pegada al borde inferior |

**Qué se roba.** El **subtítulo bajo el nombre** —«Warmaster of Chaos» es
exactamente nuestro «Humanos · Tier 6»—, la **cenefa de glifos** como segunda
respuesta al rango 0–4 de Características (distinta a la del concepto A: abajo
en horizontal en vez de a la izquierda en vertical), y la demostración de que
**una carta sin una sola frase puede seguir sintiéndose llena**.

**Qué no encaja.** Solo tres estadísticas visibles. Y tiene un coste que se
paga fuera de la carta: la placa se come el centro de la composición, así que
la ilustración hay que encuadrarla para ella —la cabeza de la figura tiene que
quedar alta— y eso es una restricción que vuelve a
[`../art-direction/illustrations.md`](../art-direction/illustrations.md).
Las gemas que desbordan las esquinas también atan: una carta así no se puede
recortar sin cortar números.

---

## En qué coinciden los tres

Esto es lo que más pesa, porque cuando tres referencias distintas hacen lo
mismo deja de ser gusto y pasa a ser oficio:

1. **Ninguno tiene ventana de ilustración enmarcada.** El arte va a sangre y el
   marco lo pisa por encima. El tema `armored` de v2
   ([`components/design/card-frames.tsx`](../../../components/design/card-frames.tsx))
   sí tiene ventana — por eso se nota de otra familia.
2. **Los números importantes van en las esquinas de arriba, sobre el arte**, no
   en una fila aparte. Los tres. Ganan sitio y ganan jerarquía a la vez.
3. **Las Características nunca son texto**: son iconos, medallones o glifos. En
   ninguno de los tres se lee la palabra.
4. **El nombre siempre va sobre una banda opaca solapada**, nunca sobre el arte
   desnudo. Es lo único que garantiza que se lea con cualquier ilustración
   detrás.

## Mezclas

Los conceptos de arriba son referencias externas. Esta sección es otra cosa:
**cruces entre lo que ya está sobre la mesa**, que es como se avanza una vez
hay bocetos que mirar. Cada mezcla dice de dónde saca el esqueleto, de dónde la
piel, y qué se descubre al juntarlos que no se veía por separado.

### Mezcla D — Blindada (boceto C × tema `armored` de v2)

Boceto **D · Blindada** en `/docs/v3/cards/design`. Código en
`components/design/v3/sketch-frames.tsx` (el marco vectorial) y
`styles/components/card-sketch/_blindada.scss`.

**El esqueleto es entero del concepto C**: arte a carta entera, placa solapada
sobre el tercio inferior, las ocho Habilidades en una sola fila de cápsulas,
glifos de Característica al pie. Eso no se toca, porque es lo que se está
juzgando.

**La piel es la del tema `armored` de v2**
([`components/design/card-frames.tsx`](../../../components/design/card-frames.tsx)
y `styles/components/card-themes/_armored.scss`), que es la única pieza de v2
con un marco de verdad y no un filete. Trae tres cosas:

| Qué trae de Armored | Qué resuelve |
|---|---|
| Banda de metal de 15px con **cantoneras remachadas** en las cuatro esquinas | El marco pasa a ser un objeto, no un borde |
| El metal **es** el color de la Rareza (`--m`/`--m-hi`/`--m-lo`/`--m-edge`) | La pregunta abierta de dónde vive la Rareza |
| El **medallón** montado sobre el canto de la placa, con sus dos roblones | La pregunta abierta de cómo se dice el Tier |

**Lo que la mezcla deja fuera a propósito: la ventana de arte.** Es lo que este
documento ya señalaba en §"En qué coinciden los tres" como el motivo de que
`armored` "se note de otra familia". Sin ventana, el herraje aguanta: sigue
leyéndose como blindaje aunque el arte vaya a sangre por debajo.

**Lo que se descubre al juntarlos**, y es lo que había que ver:

- **El medallón vale para el Tier, pero se come el alto de la placa.** El
  rótulo tiene que arrancar por debajo de él —21px de aire— o se lo traga. A
  cambio el subtítulo se queda solo con la raza, así que la placa no crece
  tanto como parece.
- **La banda cuesta 30px de fila.** Con 15px de marco a cada lado, cada cápsula
  de la fila de ocho baja de ~34px (boceto C) a ~30px. La Vida de tres cifras
  del 🐉 Dragón dorado sigue entrando, pero ya sin holgura: es el techo.
- **Un marco de Rareza es mucho más fuerte que un filete de Rareza.** Con la
  legendaria dorada la carta se lee antes por el marco que por la ilustración.
  Eso puede ser exactamente lo que se quiere o justo lo que no; es la decisión
  que este boceto pone encima de la mesa.

## Lo que esto cambia de lo ya escrito

**El lienzo heredado de v2 es el equivocado.** La especificación vigente
([`public/assets/v3/README.md`](../../../public/assets/v3/README.md#lienzo-y-formato))
arrastra 1536×1050 —apaisado— porque era la medida de las cartas de v2. **Los
tres conceptos son verticales**, y en los tres la ilustración ocupa la carta
entera.
Si V3 va por aquí, la ilustración de carta es **vertical y a sangre**, no un
recorte apaisado con los bordes tapados. Queda pendiente de que se cierre el
marco, pero es el primer indicio real de medida que tenemos.

Anotado también en [`docs/v3/status.md`](../../../docs/v3/status.md) §6.

## Qué falta decidir

> Los puntos de abajo son los que se contestan en `/docs/v3/cards/design`, con
> los bocetos delante.

- **Cuál de los esqueletos se toma de base**, o qué híbrido: el candidato
  obvio es *proporción y paleta de B + tira de ocho de A + subtítulo y ausencia
  de texto de C*. La mezcla D va por otro lado —deja C intacto y le cambia la
  piel—, así que las dos vías siguen abiertas.
- **Dónde vive la Rareza.** Ninguno de los tres conceptos la trata: A y C no la
  tienen y B la insinúa con el color del arte. En v2 se resolvió en el borde
  (halo + filete tintados) y esa decisión sigue siendo buena. La mezcla D
  propone la contraria y más fuerte: el marco entero es de la aleación de la
  rareza.
- **Si los ceros se imprimen o se ocultan.** A los imprime; con Suerte 0 en
  media plantilla, ocultarlos deja huecos irregulares en la tira.
- **Si el Tier se dice con un número, con el subtítulo o con el marco.** A, B y
  C lo dicen en el subtítulo; la mezcla D lo sube al medallón del marco y le
  quita el subtítulo. Ya se pueden comparar las dos.
