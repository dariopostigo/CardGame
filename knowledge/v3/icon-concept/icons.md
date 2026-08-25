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

## 5. Cómo se dibujan

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
   construcción, no por suerte.
3. **Un glifo sin color de fondo detrás no se lee.** Lección repetida en
   `card-concept/README.md`: un emoji "no toma color ni familia tipográfica...
   todo lo demás lo decide el fondo", y necesita **papel claro** o se lee
   como mancha. Un icono propio puede resolver esto con su propio relleno en
   vez de depender de la pieza que lo monta.
4. **Tamaños de referencia, no inventados aquí:** ~27–30px para el glifo
   dentro de un medallón de Característica (`docs/v3/status.md`, ajuste del
   25 de agosto), **42px** para que once emblemas de raza se distingan entre
   sí, y la fila de ocho Habilidades cabe en cápsulas de ~30–34px de ancho.
   Si el marco de carta cambia estas medidas, este documento hay que
   revisarlo.
5. **Un papel se marca con contorno o anillo, nunca redibujando el glifo**
   (§3). Es la única regla que ya está escrita como decisión y no como
   observación — `docs/v3/status.md` lo deja dicho para los cinco grupos de
   glifo compartido.
6. **Mono-línea o a color, pero consistente en todo el set.** No está
   decidido cuál de las dos — es la primera pregunta abierta de §6 — pero sea
   cual sea la respuesta, tiene que valer para los 36 glifos base a la vez:
   mezclar tratamientos entre Habilidades y Características se notaría más
   que cualquier otra inconsistencia, porque las dos filas conviven en la
   misma carta.

## 6. Qué falta

- **Mono-línea grabada en el metal (a juego con los remaches del marco) o
  icono a color con contorno propio.** Es la decisión de estilo que falta
  antes de generar nada, y condiciona la regla 6 de arriba.
- **Cómo se dibuja el "papel"** de los cinco grupos de §3 — qué grosor de
  anillo, qué color o ausencia de color distingue fuente / resistencia /
  inmunidad. Hoy solo está escrito que existe, no cómo se ve.
- **La colisión del 💀 y el 😈** entre emblema de raza, Característica e
  icono de clase (§4) — es un pendiente de catálogo que bloquea el emblema de
  No-muertos y el de Demonios infernales.
- **Un atributo propio para 👤 Humanos** que lo distinga de cualquier otro
  emblema humanoide (§4).
- **No hay plantilla de prompt**, a diferencia de
  [`art-direction/illustrations.md`](../art-direction/illustrations.md#3-plantilla-de-prompt):
  no está decidido si estos 36+11 glifos se generan con IA, se dibujan a mano
  en vectorial, o una mezcla — line art e iconografía pequeña son justo el
  tipo de imagen donde un generador de ilustraciones suele fallar más.
- **No hay carpeta reservada en `public/assets/v3/`** para los archivos
  finales, a diferencia de `public/assets/v3/races/`, que ya existe y sirve
  arte de razas.
