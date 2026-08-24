# Enemigos — V3

> Esqueleto. En V3 los enemigos no son un bestiario aparte: son las propias razas.

## Los enemigos son las razas *(decidido)*

Ya no hay un catálogo de monstruos independiente. En una partida pueden aparecer, por zonas, enemigos de una raza concreta, y **una raza entera puede ocupar el papel de Boss final**.

La consecuencia directa: las 8 unidades de cada raza ([razas.md](../razas.md)) tienen **dos caras**. Reclutable, como carta de unidad ([cards/units.md](../cards/units.md)), y hostil, como enemigo con el que te cruzas. Una misma unidad tiene que servir para las dos.

## Dos formas de encuentro *(decidido el 24 de agosto de 2026)*

El [tablero de batalla](../board/battle.md) §2 fijó que el bando enemigo puede tener **dos formas**, y de eso depende cómo se gana:

| Encuentro | Composición | Cómo se gana |
|---|---|---|
| **De facción** | Héroe enemigo + hasta 4 unidades de su raza | **Cae su héroe** |
| **De fauna u horda** | Hasta 5 criaturas, sin héroe | **Caen las cinco** |

El de facción **espeja al bando del jugador** y no hay que inventarlo: las 44 cartas de clase de las once razas ya existen. El de horda cubre los encuentros que no tienen líder.

Sale de aquí un requisito que es de pantalla y no de reglas: el jugador tiene que saber **qué forma tiene el encuentro antes de desplegar**, porque cambia a qué apunta y por tanto dónde se coloca.

## Por definir

- **Cómo se reparten las 8 unidades de una raza** entre categorías de amenaza, si es que existen categorías.
- **Qué distingue a una unidad hostil de la misma unidad reclutada**, si es que algo las distingue más allá del bando.
- **Cómo se compone un grupo enemigo** dentro del tope de 5, y qué lo raciona. Que el tope son 5 fichas ya está decidido; lo que falta es qué mezcla se permite y con qué presupuesto.
- **Qué héroe enemigo lleva un encuentro de facción**, y si un enemigo puede mezclar razas en su bando: la regla de facción cerrada *(23-ago-2026)* obliga al jugador, pero **a los enemigos no les toca** porque no reclutan.
- **Comportamiento**: cómo decide un enemigo qué hacer en su turno, y si cada raza tiene un patrón propio.
- **Qué raza aparece dónde**, y cómo se elige la raza del Boss final de una partida.

## Relación con v2

El bestiario de [v2/characters/enemies.md](../../v2/characters/enemies.md) —lobos, bandidos, trasgos, esqueletos, arañas— desaparece: no eran razas jugables. Su formato de bloque de combate y su patrón de IA sí son referencia útil de estructura, no de contenido.
