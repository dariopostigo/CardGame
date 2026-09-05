# V3 — Diseño vigente

Rediseño del juego alrededor de **razas**, con referencias declaradas en Heroes of Might & Magic: Olden Era y Magic the Gathering. Sustituye por completo a la versión anterior, que queda archivada en [v2](../v2/) como base de conocimiento.

**Principio de trabajo:** V3 se escribe de cero. No se traduce nada de v2 — lo que se recupere de allí se recupera por decisión explícita, documento a documento, y se reescribe sobre el sistema nuevo. Nada de v2 se da por decidido aquí.

## Estado del árbol

Cuatro palabras, y son las mismas que pinta el menú de la wiki *(desde el 5 de septiembre de 2026)*: cada documento las declara en sí mismo, en una línea `<!-- estado: … -->` que no se ve al leerlo. Aquí van con el detalle de **qué** falta, que en el menú no cabe.

- **Por escribir** — esqueleto, nada decidido todavía.
- **A medias** — parte cerrada y parte todavía en una línea.
- **Escrito** — decidido y redactado. No quiere decir *balanceado*.
- **En espera** — no está decidido que eso siga formando parte del juego. En el menú va apagado y sin enlace.
- *Vivo* — los índices, el glosario, las ideas y el estado no declaran nada: crecen siempre, así que ninguna de las cuatro les valdría y no se les quitaría nunca.

| Documento | Contenido | Estado |
|---|---|---|
| [razas.md](razas.md) | 11 razas con sus clases, las 8 Habilidades, el catálogo de Características, y las 8 unidades de cada raza | **A medias** — escrita entera salvo los valores numéricos de las Habilidades; 👢 Movimiento sí *(31-ago)* |
| [game-design.md](game-design.md) | Reglas generales, turno, motor de combate, progresión y rareza | **A medias** — §4 motor de combate y §3.1 la función de tier a Rareza escritos; economía de cartas, economía de partida y balance sin definir |
| [glossary.md](glossary.md) | Vocabulario V3 | *Vivo* — se llena conforme los documentos fijen cada término |
| [status.md](status.md) | Qué está decidido, qué falta, qué falta balancear | *Vivo* — es el punto de continuación |
| [ideas.md](ideas.md) | Ideas aparcadas | *Vivo* |
| [effects.md](effects.md) | Estados y efectos temporales | **Escrito** — 9 estados; diales sin balancear |
| [board/board-map.md](board/board-map.md) | Tablero de exploración | **Por escribir** |
| [board/board-map-dev.md](board/board-map-dev.md) | Contrapartida técnica del anterior | **Por escribir** — espera a que `board-map.md` cierre |
| [board/battle.md](board/battle.md) | Tablero de batalla | **Escrito y rehecho** *(27-ago)*, **corregido con lo medido** *(28 y 31-ago)* — arena grande, co-op de 1 a 3 jugadores, bando enemigo en espejo y banda de 👢 Movimiento 3 · 2 · 1; terreno y retirada aplazados con motivo |
| [characters/heroes.md](characters/heroes.md) | Héroes jugables y su progresión | **Por escribir** |
| [characters/enemies.md](characters/enemies.md) | Las razas en su cara hostil | **A medias** — las dos formas de encuentro y el presupuesto en espejo *(28-ago)*; la mezcla y el comportamiento sin escribir |
| [characters/npcs.md](characters/npcs.md) | NPCs | **Por escribir** |
| [cards/README.md](cards/README.md) | Índice y anatomía de las cartas | *Vivo* |
| [cards/class.md](cards/class.md) | Cartas de clase | **Por escribir** |
| [cards/units.md](cards/units.md) | Cartas de unidad | **Por escribir** |
| [cards/items.md](cards/items.md) | Items | **Por escribir** |
| [cards/curses.md](cards/curses.md) | Maldiciones | **En espera** *(5-sep)* — no está decidido que el tipo de carta siga |
| [cards/encounter.md](cards/encounter.md) | Mazo de encuentro | **Por escribir** |

**Sin `weapons.md` ni `armor.md`**: armas y armaduras quedan obsoletas como tipo de carta *(decidido, ver [cards/README.md](cards/README.md))*. **Sin `mercenaries.md`**: lo sustituye [cards/units.md](cards/units.md).

## Por dónde va el trabajo

La raza piloto es **Humanos**: se construye entera —clases, unidades, cartas y balance— antes de tocar ninguna otra. El orden de las demás y el alcance de los DLC están en [status.md](status.md).
