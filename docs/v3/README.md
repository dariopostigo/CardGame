# V3 — Diseño vigente

Rediseño del juego alrededor de **razas**, con referencias declaradas en Heroes of Might & Magic: Olden Era y Magic the Gathering. Sustituye por completo a la versión anterior, que queda archivada en [v2](../v2/) como base de conocimiento.

**Principio de trabajo:** V3 se escribe de cero. No se traduce nada de v2 — lo que se recupere de allí se recupera por decisión explícita, documento a documento, y se reescribe sobre el sistema nuevo. Nada de v2 se da por decidido aquí.

## Cómo está organizado

El árbol tiene **seis apartados**:

| Apartado | Qué entra |
|---|---|
| **General** | Las reglas que no son de nadie en concreto, y los documentos vivos |
| **Sistemas** | Lo que llevan las **132 fichas por igual**: la ficha, las Habilidades, las Características, el tipo de daño y los estados |
| **Razas** | Lo que sí es de una raza: sus 4 clases y sus 8 unidades |
| **Tablero** | Los dos tableros: exploración y batalla |
| **Personajes** | Quién ocupa una ficha: héroes, enemigos y NPCs |
| **Cartas** | El catálogo de cartas, por tipo |

**Si vale para las 132 fichas es Sistemas; si es de una raza es Razas; si es lo que imprime una carta es Cartas.** Una unidad es una **ficha** y su carta es otra cosa: lo que la ficha vale está en Razas, lo que su carta imprime está en Cartas.

## Estado del árbol

Cuatro palabras, las mismas que pinta el menú de la wiki: cada documento las declara en sí mismo, en una línea `<!-- estado: … -->` que no se ve al leerlo. Aquí van con el detalle de **qué** falta, que en el menú no cabe.

- **Por escribir** — esqueleto, nada decidido todavía.
- **A medias** — parte cerrada y parte todavía en una línea.
- **Escrito** — decidido y redactado. No quiere decir *balanceado*.
- **En espera** — no está decidido que eso siga formando parte del juego. En el menú va apagado y sin enlace.
- *Vivo* — los índices, el glosario, las ideas y el estado no declaran nada: crecen siempre, así que ninguna de las cuatro les valdría y no se les quitaría nunca.

### General

| Documento | Contenido | Estado |
|---|---|---|
| [game-design.md](game-design.md) | Reglas generales, turno, motor de combate, progresión y rareza | **A medias** — §1-§4 escritos y sin huecos (rumbo, tableros, tier y Rareza, motor de combate). **§6 turno y economía de cartas escrito pero provisional** (8-sep, heredado de v2). **Vacíos §5 fuera de combate, §7 economía de partida y §8 balance** |
| [glossary.md](glossary.md) | Vocabulario V3 | *Vivo* — se llena conforme los documentos fijen cada término |
| [status.md](status.md) | Qué está decidido, qué falta, qué falta balancear | *Vivo* — es el punto de continuación |
| [ideas.md](ideas.md) | Ideas aparcadas | *Vivo* |

### Sistemas

| Documento | Contenido | Estado |
|---|---|---|
| [sistemas/ficha.md](sistemas/ficha.md) | Qué campos lleva una ficha y cuántas Características caben | **Escrito** — la anatomía y el techo por tier, comprobado en `lib/v3/traits.ts` |
| [sistemas/habilidades.md](sistemas/habilidades.md) | Las 8 Habilidades, su escala y de dónde sale cada número | **Escrito** *(8-sep)* — sin fórmula: 🛡️ 🔮 🎯 🍀 ⚡ se asignan por escalones a ojo. Las tres cifras del sistema puestas (❤️ 20 · ⚔️ 5 · héroe tier 5) y 👢 medida *(31-ago)*. Los valores de cada ficha van con su catálogo |
| [sistemas/caracteristicas.md](sistemas/caracteristicas.md) | El catálogo de 41 rasgos, en seis familias | **A medias** — el catálogo cerrado; faltan las 41 cifras y tres redundancias |
| [sistemas/dano.md](sistemas/dano.md) | El campo obligatorio: 🗡️ · 🏹 · ✨, con su alcance | **Escrito** *(23 y 24-ago)* |
| [sistemas/effects.md](sistemas/effects.md) | Estados y efectos temporales | **Escrito** — 9 estados; diales sin balancear |

### Razas

| Documento | Contenido | Estado |
|---|---|---|
| [razas/](razas/) | Las 11 razas con sus 4 clases | **A medias** — escritas enteras; **las sub-facciones siguen abiertas** *(3-sep)* |
| [razas/unidades.md](razas/unidades.md) | Las 88 unidades, una tabla por raza: tier, rol, tipo de daño y Características | **A medias** — Características asignadas; faltan los escalones de 🛡️ 🔮 🎯 🍀 ⚡ y 25 nombres por revisar |

### Tablero

| Documento | Contenido | Estado |
|---|---|---|
| [board/board-map.md](board/board-map.md) | Tablero de exploración | **Por escribir** |
| [board/battle.md](board/battle.md) | Tablero de batalla | **Escrito** — arena grande, co-op de 1 a 3 jugadores, bando enemigo en espejo y banda de 👢 3 · 2 · 1; terreno y retirada aplazados con motivo |
| [board/board-map-dev.md](board/board-map-dev.md) | Contrapartida técnica del anterior | **Por escribir** — espera a que `board-map.md` cierre |

### Personajes

| Documento | Contenido | Estado |
|---|---|---|
| [characters/heroes.md](characters/heroes.md) | Los 44 héroes y su tabla de Características | **A medias** *(6-sep)* — la tabla de los 44 está cerrada; faltan los escalones de 🛡️ 🔮 🎯 🍀 ⚡ y el trasfondo |
| [characters/enemies.md](characters/enemies.md) | Las razas en su cara hostil | **A medias** — las dos formas de encuentro y el presupuesto en espejo *(28-ago)*; la mezcla y el comportamiento sin escribir |
| [characters/npcs.md](characters/npcs.md) | NPCs | **Por escribir** |

### Cartas

| Documento | Contenido | Estado |
|---|---|---|
| [cards/README.md](cards/README.md) | Índice y anatomía de las cartas | *Vivo* |
| [cards/class.md](cards/class.md) | Cartas de clase | **Por escribir** |
| [cards/units.md](cards/units.md) | Cartas de unidad | **Por escribir** — la carta, no el catálogo: las unidades están en [razas/unidades.md](razas/unidades.md) |
| [cards/items.md](cards/items.md) | Items | **Por escribir** |
| [cards/curses.md](cards/curses.md) | Maldiciones | **En espera** *(5-sep)* — no está decidido que el tipo de carta siga |
| [cards/encounter.md](cards/encounter.md) | Mazo de encuentro | **Por escribir** |

**Sin `weapons.md` ni `armor.md`**: armas y armaduras quedan obsoletas como tipo de carta *(decidido, ver [cards/README.md](cards/README.md))*. **Sin `mercenaries.md`**: lo sustituye [cards/units.md](cards/units.md).

## Por dónde va el trabajo

Las razas piloto son **Humanos y Enanos**: las dos se construyen enteras —clases, unidades, cartas y balance— antes de tocar ninguna otra. El resto queda en StandBy hasta tener una primera versión jugable con estas dos; el detalle está en [status.md](status.md) §4.
