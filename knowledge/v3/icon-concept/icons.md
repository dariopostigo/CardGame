# Iconos de interfaz — V3

Inventario y reglas de dibujo para los pictogramas que hoy son emoji de
marcador de posición: las 8 Habilidades, el Tipo de daño, el catálogo de
Características y los 11 emblemas de raza. Fuente del catálogo:
[`docs/v3/razas.md`](../../../docs/v3/razas.md) — si ese documento cambia,
esto se queda desactualizado hasta revisarlo.

No decide dónde vive cada icono en la carta (eso es
[`card-concept/`](../card-concept/README.md)) ni cómo se ilustra un personaje
(eso es [`art-direction/`](../art-direction/README.md)). Decide dos cosas:
**qué glifos hacen falta** y **con qué reglas se dibujan** para que funcionen
donde el marco los va a poner.

## 0. Por qué hace falta este documento

Todo el catálogo se diseñó en emoji porque un emoji es gratis y legible
mientras se discuten reglas. Pero el emoji tiene tres problemas que ya han
salido, cada uno registrado donde se descubrió:

1. **No acepta color ni familia propia.** Solo se le puede gobernar el
   tamaño; todo lo demás lo decide el fondo que tenga detrás
   ([`card-concept/README.md`](../card-concept/README.md), Mezcla E). Un
   icono propio sí puede tener color y trazo consistentes con el resto de la
   carta.
2. **Hay colisiones de glifo por accidente.** La auditoría de
   [`docs/v3/status.md`](../../../docs/v3/status.md) encontró diez grupos de
   Características que compartían emoji; siete eran fallos de catálogo y ya
   están corregidos, pero **tres siguen compartiendo glifo a propósito** (ver
   §3) y necesitan un tratamiento visual que hoy no existe.
3. **Algunos son siluetas genéricas.** 👤 Humanos, el emblema de la raza
   piloto, es el caso ya señalado: se lee "persona", no "Humanos". Un icono
   diseñado puede llevar un atributo que lo distinga (ver §4).

## 1. Las 8 Habilidades

Van en fila en el pie de la carta (`card-concept/`, boceto E · Forja) y en
listas y tablas de la wiki. Ocho glifos, todos al mismo peso visual — ninguno
manda sobre otro.

| Emoji actual | Habilidad | Qué representa |
|---|---|---|
| ❤️ | Vida | Puntos de vida máximos |
| ⚔️ | Ataque | Daño por golpe — **en la carta nunca se dibuja este glifo genérico**, ver §2 |
| 🛡️ | Defensa | % de mitigación de daño físico — comparte glifo con la Característica *Resistente al daño físico* (§3) |
| 🔮 | Resistencia mágica | % de mitigación de daño mágico |
| 🎯 | Precisión | Umbral de acierto |
| 🍀 | Suerte | Umbral de crítico y desempate de Iniciativa |
| ⚡ | Iniciativa | Orden de actuación |
| 👢 | Movimiento | Hexágonos de desplazamiento por turno |

## 2. Tipo de daño — variantes del icono de Ataque

**No es una Característica ni una Habilidad novena: es un campo obligatorio
de las 132 fichas**, y se dibuja *en el sitio del icono de Ataque* — el glifo
que acompaña al número de Ataque cambia según el tipo, y el genérico ⚔️ de la
tabla de arriba no llega a aparecer en ninguna carta
([`docs/v3/razas.md`](../../../docs/v3/razas.md#-tipo-de-daño)).

| Emoji actual | Tipo | Alcance |
|---|---|---|
| 🗡️ | Cuerpo a cuerpo | 1 hexágono |
| 🏹 | A distancia | 4 hexágonos |
| ✨ | Mágico | 2 hexágonos |

> **Excepción viva, y temporal** (26 de agosto de 2026): 🗡️ Cuerpo a cuerpo es
> el único de los tres sin archivo, así que por decisión de Dario el laboratorio
> pinta el genérico `abilities/ataque.png` en su hueco — la fila de ocho se ve
> entera de oro, que es lo que hay que juzgar, en vez de con un emoji suelto en
> 70 de las 132 fichas. Mientras dure, la frase de arriba deja de ser cierta en
> pantalla: el genérico **sí** aparece en la carta, diciendo "Ataque" donde toca
> decir "Cuerpo a cuerpo". Es un suplente, no una respuesta, y §7 lo sigue
> contando como pendiente.

Estos tres tienen que dibujarse **a la misma escala y con el mismo peso**
entre sí — es el mismo hueco de la carta rellenado con uno de los tres —, y
distinguirse con claridad de 🗡️ *Perforante* y de ✨ *Ataque mágico* (que ya
no existe como Característica, pero el glifo ✨ sigue circulando en
documentación vieja).

**Abierto:** si un contexto fuera de la carta —cabecera de tabla en la wiki,
leyenda— necesita nombrar "Ataque" en general y no un tipo concreto, hace
falta decidir si eso usa el ⚔️ genérico (que hoy no se dibuja en ningún sitio
real) o si esa etiqueta simplemente no existe fuera de la carta.

## 3. Catálogo de Características

Copiado de [`docs/v3/razas.md`](../../../docs/v3/razas.md#-características-de-los-personajes),
agrupado igual que allí. Las filas marcadas comparten glifo a propósito con
otra de la lista (o con una Habilidad) y se explican en la subsección
siguiente.

### ⚔️ Ofensivas
| Emoji | Característica |
|---|---|
| 💥 | Golpe crítico |
| 🩸 | Hemorragia |
| 💫 | Aturdimiento |
| 🗡️ | Perforante |
| 💣 | Explosivo |
| 🧛 | Robo de vida |

### 🌪️ Elementales y estados alterados
| Emoji | Característica |
|---|---|
| 🔥 | Fuego *(comparte glifo, grupo Fuego)* |
| ☠️ | Veneno *(comparte glifo, grupo Veneno)* |
| 🧊 | Hielo *(comparte glifo, grupo Frío)* |
| 🌑 | Ceguera |
| 🕸️ | Inmovilización |
| 🐌 | Lentitud |
| 🌀 | Confusión |
| 😵 | Aturdido |
| 😱 | Miedo *(comparte glifo, grupo Miedo)* |

### 🛡️ Resistencias e inmunidades
| Emoji | Característica |
|---|---|
| 🛡️ | Resistente al daño físico *(comparte glifo, grupo Defensa — con una Habilidad)* |
| 💨 | Evasivo |
| 🔥 | Resistente al fuego *(grupo Fuego)* |
| ☠️ | Resistente al veneno *(grupo Veneno)* |
| 🧊 | Resistente al frío *(grupo Frío)* |
| 😱 | Inmune al miedo *(grupo Miedo)* |
| 🔥 | Inmune al fuego *(grupo Fuego)* |
| ☠️ | Inmune al veneno *(grupo Veneno)* |
| 🧊 | Inmune al frío *(grupo Frío)* |
| 🧪 | Inmune a estados alterados |
| 🧿 | Inmune a la magia |

### 💚 Supervivencia
| Emoji | Característica |
|---|---|
| 💚 | Regeneración |
| 🕯️ | Inmortal |
| 👻 | Resurrección |
| 😤 | Último aliento |

### 🦅 Movimiento y terreno
| Emoji | Característica |
|---|---|
| 🦅 | Volador |
| 🐾 | Ágil |
| 🌊 | Anfibio |
| 🌲 | Explorador |

### 🧠 Percepción y comportamiento
| Emoji | Característica |
|---|---|
| 👁️ | Percepción |
| 🗣️ | Provocación |
| 👑 | Líder |
| 🐺 | Bestia |
| 🤖 | Constructo |
| 💀 | No-muerto *(colisiona con el emblema de raza, ver §4)* |
| 😈 | Demonio *(colisiona con el emblema de raza, ver §4)* |

**41 Características en total.** Sumadas a las 8 Habilidades y el genérico de
Ataque, son **50 conceptos**, pero no hacen falta 50 dibujos distintos: los
grupos que comparten glifo a propósito reducen el número de siluetas nuevas
que hay que diseñar (ver siguiente subsección).

### Grupos de glifo compartido a propósito

Encontrados en la auditoría de
[`docs/v3/status.md`](../../../docs/v3/status.md): tres conceptos —fuego,
veneno, frío— cada uno con hasta tres papeles (la *fuente* del efecto, la
*resistencia* a él, la *inmunidad* a él), más el miedo con dos papeles, más un
quinto grupo que cruza una Habilidad con una Característica. El glifo
compartido **informa a propósito** de que las fichas van del mismo tema; lo
que falta por marcar es el **papel**, y eso es tratamiento visual del icono
generado — un contorno, un anillo —, **no un dibujo distinto por papel**.

| Grupo | Papeles que comparten el mismo glifo base |
|---|---|
| 🔥 Fuego | Fuente (Fuego) · Resistencia (Resistente al fuego) · Inmunidad (Inmune al fuego) |
| ☠️ Veneno | Fuente (Veneno) · Resistencia (Resistente al veneno) · Inmunidad (Inmune al veneno) |
| 🧊 Frío | Fuente (Hielo) · Resistencia (Resistente al frío) · Inmunidad (Inmune al frío) |
| 😱 Miedo | Fuente (Miedo) · Inmunidad (Inmune al miedo) |
| 🛡️ Defensa | Habilidad (Defensa) · Característica (Resistente al daño físico) |

Esto fija **una regla de dibujo, no solo de catálogo**: cada uno de estos
cinco conceptos se diseña como **un glifo base con hasta tres variantes de
papel**, y las variantes tienen que leerse por el aro o el contorno que las
rodea, no por redibujar el símbolo interior. Contando así, las 41
Características más el genérico de Ataque y las 7 Habilidades restantes
piden **36 siluetas base**, no 50 — de las cuales 5 llevan además 2 o 3
variantes de papel.

## 4. Los 11 emblemas de raza

Van en el medallón de la carta (`card-concept/`, Mezcla E · Forja) y tienen
que **distinguirse entre sí a 42px** — la medida ya probada en el boceto
ganador. Es el requisito más duro de los tres inventarios: no compiten contra
un fondo variable como las Características, compiten entre ellos, once a la
vez, en la misma cuadrícula visual.

| Emoji actual | Raza |
|---|---|
| 👤 | Humanos |
| ⛏️ | Enanos |
| 💀 | No-muertos |
| 🔥 | Demonios infernales |
| 🧝 | Elfos |
| 🧟 | Orkos |
| 🧚 | Feéricos |
| 🐉 | Dracónidos |
| 🐀 | Hombres rata |
| 🤖 | Constructos |
| 🧜 | Abisales |

**Dos problemas ya detectados, sin resolver:**

- **👤 Humanos es una silueta genérica.** Es literalmente "persona", y a 42px
  no dice "Humanos" más que cualquier otro emblema con figura humanoide —
  varias razas más (Enanos, Elfos, Hombres rata...) también son humanoides.
  Necesita un atributo propio, no solo la silueta de la especie.
- **💀 se usa tres veces con significados distintos**: aquí como emblema de la
  raza No-muertos, en §3 como la Característica *No-muerto*, y en
  [`docs/v3/razas.md`](../../../docs/v3/razas.md) como icono de la clase
  *Nigromante*. Los tres son legítimos por separado, pero si alguna vez
  aparecen juntos en la misma pantalla — la carta de un Nigromante No-muerto,
  que además puede llevar la Característica *No-muerto* — hay tres 💀 en la
  misma ficha sin nada que los distinga. A diferencia de los grupos de §3,
  **esto no es una colisión a propósito** y no tiene tratamiento de papel
  definido: es un pendiente de catálogo, no solo de dibujo.
- Igual pasa, en menor medida, con 😈 (Demonios infernales como raza, Demonio
  como Característica).

## 5. La dirección elegida

**Cerrada el 26 de agosto de 2026.** Dos láminas generadas y comparadas, cada
una montada sobre los **dos fondos** que la regla 2 de §6 exigía —metal oscuro
y vitela clara—, que es lo que hace que esto sea una elección y no un gusto
sobre un fondo. Gana [`imgs/chosen-direction.png`](imgs/chosen-direction.png).

### Qué es

**Relieve de metal dorado, monocromo.** No es ninguna de las dos opciones que
este documento tenía escritas —ni mono-línea grabada ni icono a color con
contorno propio—: es una tercera. El glifo es una **silueta maciza tallada en
metal**, con el canto biselado, encendido por arriba a la izquierda y en
sombra por el lado opuesto.

Cinco rasgos, y los cinco valen para los 36 glifos base a la vez:

1. **Un solo metal.** Oro pálido / latón, y nada más. **No hay color por
   concepto**: 🔥 Fuego y 🧊 Frío salen del mismo dorado.
2. **Silueta maciza, no trazo.** Forma rellena con canto biselado. A 27px una
   línea de un píxel se pierde; un canto encendido contra una masa, no.
3. **El valor se invierte con el fondo; el dibujo no.** Sobre metal oscuro el
   glifo va claro; sobre vitela va bronce con el canto encendido. Es el
   **mismo dibujo** las dos veces — un archivo por glifo, no dos.
4. **Dibujo de una sola pieza y sin escena.** Corazón, espada, escudo, copo,
   trébol, rayo, bota, calavera.
5. **Luz desde arriba a la izquierda, siempre** — la misma que manda el prompt
   base de las ilustraciones en
   [`prompts/preambulo.md`](../races-concept/prompts/preambulo.md). Icono e
   ilustración se iluminan igual, y eso no estaba garantizado.

### El envase dice de qué tipo es el icono

Esto es lo que la lámina decide y no estaba escrito en ninguna parte:

| | Envase | Dónde vive |
|---|---|---|
| **Habilidad** | **Ninguno.** El glifo va desnudo | La fila de ocho, en el pie de la carta |
| **Característica** | **Medallón redondo**: doble aro de oro y cara hundida | El raíl |

Con eso **se resuelve solo el grupo 🛡️ Defensa** de §3, que era el peor de los
cinco porque no cruzaba dos Características sino una Característica con una
Habilidad: mismo escudo, y lo que dice cuál es cuál es que uno lleva medallón
y el otro no. La lámina lo enseña a propósito — el escudo sale dos veces.

Y de paso cae la regla 3 de §6, *«un glifo sin papel detrás no se lee»*: **la
cara hundida del medallón ES el papel**, y ahora viene con el icono en vez de
pedírselo a la pieza que lo monta.

### Lo que la elección cuesta

**El color deja de estar disponible como código.** Con emoji, 🔥 era rojo y 🧊
azul y medio trabajo lo hacía el color; en oro monocromo lo hace **solo el
dibujo**. Sube el listón de las 36 siluetas, y confirma la regla 5 de §6 por
un camino nuevo: el papel de los cinco grupos compartidos **no puede** marcarse
con color aunque se quisiera, tiene que ser aro o contorno.

**Y hay un choque con el marco, que hay que resolver al implementar.** La carta
ya dibuja su propio medallón de Característica —redondo, aro de ~1,6px, cara de
27px, un solo token para la E y la G
([`docs/v3/status.md`](../../../docs/v3/status.md), ajuste del 25 de agosto)—
y el icono elegido trae el suyo, más rico. **No caben los dos.** O el marco
deja de dibujar el aro y lo trae el archivo, o el archivo se entrega sin aro y
el aro sigue siendo del marco — y esta segunda opción pierde justo lo que la
lámina compra, la cara hundida como papel propio. Se decide en
[`card-concept/`](../card-concept/README.md), pero sale de aquí.

### La primera tanda, entregada y medida

**Diez archivos, la misma noche del 26 de agosto de 2026**, y son la prueba de
que la dirección se puede producir y no solo dibujar en una lámina: PNG sueltos
con transparencia, un glifo por archivo, en
[`public/assets/v3/icons/`](../../../public/assets/v3/README.md). Son **las 8
Habilidades enteras** (`abilities/`) y **dos de los tres Tipos de daño**
(`damage/`, 🏹 *A distancia* y ✨ *Mágico*): **falta 🗡️ *Cuerpo a cuerpo***, y con
él el trío de §2 no se puede montar todavía — los tres tienen que salir a la
misma escala y con el mismo peso, y eso solo se juzga con los tres delante.

Ninguna Característica ni ningún emblema de raza, que es donde está el trabajo:
diez de cuarenta y siete.

**Tres cosas medidas sobre los archivos, no sobre la lámina**, y las tres son de
producción y no de diseño — la dirección aguanta:

1. **Ninguno está recortado en el filo.** Se comprobó columna a columna: el
   canto y su sombra caben dentro del lienzo en los diez.
2. **Pero el encuadre no está normalizado.** Lienzo común, 1254×1254, y ahí se
   acaba el acuerdo: la caja del glifo ocupa entre el **84 % y el 97 %** del
   lienzo y **no va centrada** —🏹 *A distancia* deja 150px de aire a un lado y
   26 al otro; ⚡ *Iniciativa*, 79 arriba y 102 abajo—. A 30px son dos o tres
   píxeles de salto, y la fila de ocho Habilidades **se mira entera**, así que se
   nota. Hace falta una pasada de recorte y relleno a caja común, que es
   mecánica y no vuelve a pedirle nada al generador.
3. **El contraste va aceptable en los dos fondos y bien en ninguno**, que es
   exactamente lo que compra un solo dorado medio. Medido sobre la luminancia
   media del relleno —orientativo, porque un pictograma se lee por el canto y no
   como texto—, el cuerpo se queda entre **2,4 y 4,6** contra vitela clara y
   contra metal oscuro, sin fallar en ninguno: ❤️ *Vida* y ⚡ *Iniciativa* son los
   más claros y flojean sobre vitela, 🔮 *Res. mágica* y 🏹 *A distancia* los más
   oscuros y flojean sobre metal. **Lo que los salva en el fondo claro es el
   contorno oscuro, no el relleno** — la regla 2 de §6 pedía justo eso, y se
   cumple por construcción y no por suerte, que es la diferencia con el emoji.

Y una cuarta que solo apareció al montarlos en la carta, que es donde tenía que
aparecer: **un pictograma no se puede sustituir por un emoji al mismo cuerpo.**
Un emoji trae su propio aire y no llena su caja; un PNG con la alfa ajustada sí
la llena, así que el primer montaje —icono y emoji a la misma medida de letra—
dejó el oro **más pequeño de lo que se veía el emoji**, 17,6px de dibujo real en
una columna de 32. Se corrige con un factor
(`$sketch-stat-art`, en `styles/settings/_card.scss`) y no con un píxel, porque
los tres sitios donde cae el par —ocho en fila, seis en fila, los dos pines de
esquina— tienen cada uno su escalón medido contra su anchura de columna. **Es la
misma lección del glifo del medallón el 25 de agosto**, vista por segunda vez y
por el otro lado: allí la pieza estaba bien y el dibujo se quedaba corto; aquí la
medida de letra estaba bien y el dibujo la desbordaba al revés.

Y una que no es medida sino aritmética: **pesan 12 MB los diez**, PNG de 1254px
para dibujos de 30. La conversión no corre prisa mientras al encuadre le quede
vuelta —convertir un relleno es trabajo que se tira dos veces, la misma lección
que las razas—, pero la cuenta a 47 archivos ya no es despreciable.

### Opción 3 — el aro ornamentado, aparcado

La otra lámina, [`imgs/option-3-ornate-ring.png`](imgs/option-3-ornate-ring.png),
monta los tres Tipos de daño en un **aro con cuatro cúspides y rombos en los
puntos cardinales**, tipo rosa de los vientos. **La silueta gusta y no se
implementa.** Queda guardada para dos usos posibles, ninguno decidido:

- cambiar de envase algún día, si el medallón liso se queda corto;
- **marcar unas Características como más importantes que otras** — un eje que
  hoy no existe, porque el raíl las pinta todas iguales.

Dos avisos para el día que se saque del cajón. **No es el marcador de papel de
§3**: importancia y papel (fuente / resistencia / inmunidad) son dos ejes
distintos, y gastar el aro ornamentado en uno deja al otro sin recurso. Y
**como envase de Tipo de daño se contradice con §2**: ahí el glifo va pegado al
número de Ataque, en el sitio del icono de una Habilidad, y las Habilidades van
desnudas — meterlo en un aro le daría más peso que a las ocho.

## 6. Cómo se dibujan

Reglas recogidas de lo que ya se ha probado y medido en `card-concept/` y
`status.md` al construir los bocetos de carta — no son gusto, son lo que ya
falló o funcionó al poner un glifo real en una carta real.

1. **Silueta antes que detalle.** Se toma prestada la jerarquía de
   [`art-direction/style-guide.md`](../art-direction/style-guide.md#2-principio-fundamental)
   —*silueta → línea → forma → color → sombra → detalle*— porque a 27–42px no
   hay sitio para nada después de la silueta. Es el único principio que se
   importa de la biblia visual; el resto (anatomía, rostros, sombreado
   cartoon) no aplica a un pictograma.
2. **Tiene que funcionar sobre metal oscuro Y sobre fondo claro.** El boceto
   ganador (E · Forja / G · Estandarte) monta los medallones de Característica
   sobre peltre oscuro; el boceto I · Retablo los prueba sobre una caja de
   datos clara ("vitela") y ahí es donde se vio el problema real: *"los
   glifos de Característica se salvan por su contorno negro —💀 y 🧊 son los
   casos malos—"* (`docs/v3/status.md`). Un emoji se salva por casualidad; un
   icono diseñado necesita un contorno que funcione en los dos fondos por
   construcción. **Es la regla que decidió §5**: las dos láminas se generaron
   con los dos fondos en la misma imagen, y no se eligió sobre uno solo.
3. **Un glifo sin papel detrás no se lee — y ya está resuelto.** La lección
   venía de `card-concept/README.md`: un emoji "no toma color ni familia
   tipográfica... todo lo demás lo decide el fondo", y necesita papel claro o
   se lee como mancha. La dirección elegida lo resuelve **para las
   Características** con la cara hundida de su medallón (§5). Las Habilidades
   van desnudas y se salvan por el canto biselado, no por papel.
4. **Tamaños de referencia, no inventados aquí:** ~27–30px para el glifo
   dentro de un medallón de Característica (`docs/v3/status.md`, ajuste del
   25 de agosto), **42px** para que once emblemas de raza se distingan entre
   sí, y la fila de ocho Habilidades cabe en cápsulas de ~30–34px de ancho.
   Si el marco de carta cambia estas medidas, este documento hay que
   revisarlo.
5. **Un papel se marca con contorno o anillo, nunca redibujando el glifo**
   (§3). `docs/v3/status.md` lo dejó dicho para los cinco grupos de glifo
   compartido, y §5 lo cierra por otro lado: sin color en el set, **no hay
   ninguna otra vía**.
6. **Un solo tratamiento para todo el set, y ya está elegido.** Era la
   pregunta abierta —mono-línea o color— y la respuesta es la tercera opción
   de §5, relieve de metal monocromo. Sea cual sea, la razón de que tenga que
   ser una sola sigue en pie: Habilidades y Características **conviven en la
   misma carta**, y mezclar tratamientos entre las dos filas se notaría más
   que cualquier otra inconsistencia.

## 7. Qué falta

Diez archivos entregados de los 47 que cuentan §3 y §4 (36 siluetas base más 11
emblemas; los tres Tipos de daño de §2 no estaban en esa cuenta y habrá que
sumarlos al revisarla). Lo que queda, por orden de lo que bloquea a lo que no:

- **Quién dibuja el aro del medallón**, el archivo o el marco (§5, *lo que la
  elección cuesta*). **Bloquea la entrega de cualquier Característica**, que es
  la mayor parte de lo que falta. Se decide en
  [`card-concept/`](../card-concept/README.md).
- **Cómo se dibuja el "papel"** de los cinco grupos de §3 — qué grosor de
  anillo, qué contorno distingue fuente / resistencia / inmunidad. La lámina
  elegida enseña cuatro de los cinco conceptos compartidos (Defensa, Fuego,
  Veneno, Frío) **con una sola variante cada uno**, así que no lo contesta: sigue
  escrito que existe, no cómo se ve. Y ahora es más difícil, porque el set no
  tiene color con el que separarlas (§5).
- **🗡️ Cuerpo a cuerpo**, el archivo que falta para cerrar los tres Tipos de
  daño de §2. Los tres tienen que salir a la misma escala y con el mismo peso, y
  eso no se juzga con dos. **Lleva suplente en pantalla** —el genérico
  `abilities/ataque.png`, decisión de Dario, ver el aviso de §2— y por eso este
  pendiente es de los que se olvidan: la carta ya no enseña ningún hueco.
- **La normalización de encuadre** de lo ya entregado (§5): recorte y relleno a
  caja común. Es mecánica, no vuelve a pedirle nada al generador, y conviene
  resolverla **antes** de las 41 Características, no después — la receta que
  salga se aplica a las 47.
- **La colisión del 💀 y el 😈** entre emblema de raza, Característica e icono
  de clase (§4) — es un pendiente de catálogo que bloquea el emblema de
  No-muertos y el de Demonios infernales.
- **Un atributo propio para 👤 Humanos** que lo distinga de cualquier otro
  emblema humanoide (§4).
- **La extensión y el peso.** Entran como `.png` de 1254px porque no había norma
  y se decidió no inventarla con diez archivos en la mano; se decide en
  [`public/assets/v3/README.md`](../../../public/assets/v3/README.md), que es la
  fuente única, y su `.webp` de la tabla de lienzo **no vale tal cual**: es la
  norma de una ilustración a sangre y sin transparencia.
