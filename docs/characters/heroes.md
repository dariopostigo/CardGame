# CardGame — Héroes (borrador)

Boceto de los héroes/clases jugables iniciales, previo a definir en detalle las estadísticas y cartas exactas en [`../game-design.md`](../game-design.md) (que ya fija la base de 6 estadísticas D&D y el sistema de cartas). Aquí solo se esboza identidad, rol y sabor de cada uno — los números concretos vienen después.

**Base: razas y clases de D&D**, sin atarse a marcas de Tolkien/Viajes por la Tierra Media (eso queda solo como inspiración de mecánicas de tablero en `../board/board-map.md`, no como fuente de identidad de personaje). Términos transversales en [`../glossary.md`](../glossary.md).

## 1. Propósito de este boceto

`../game-design.md` §7 tiene pendiente "Definir lista de clases iniciales (2-3 para el prototipo) con sus cartas básicas" — este documento es el primer paso de esa tarea: fijar identidad y rol de cada héroe antes de diseñar cartas y números.

## 2. Roster inicial propuesto (4 arquetipos, punto de partida)

| Héroe (clase D&D) | Raza (D&D) | Stat principal | Rol en combate | Gancho breve |
|---|---|---|---|---|
| Guerrero *(Fighter)* | Enano | Fuerza / Constitución | Tanque, daño cuerpo a cuerpo, aguanta golpes | Superviviente de una guarnición caída, busca redención |
| Pícaro *(Rogue)* | Mediano *(Halfling)* | Destreza | Sigilo, ataque a distancia/furtivo, buen aliado en fichas de Exploración/Amenaza (`../board/board-map.md`) | Ex-contrabandista que conoce atajos y peligros del camino |
| Mago *(Wizard)* | Elfo | Inteligencia | Daño mágico a distancia, control de enemigos | Estudioso exiliado de una torre arcana, busca conocimiento perdido |
| Clérigo *(Cleric)* | Humano | Sabiduría | Curación, soporte, buffs a aliados | Sacerdote errante de un templo destruido, sigue una causa personal |

Cubre los 4 roles clásicos de grupo D&D (tanque / daño furtivo-a distancia / daño mágico-control / soporte-curación), cada uno con una estadística principal distinta de las 6 de `../game-design.md` §2.

**Candidatos para ampliar el roster más adelante** (no para el prototipo inicial, solo para cuando quieras ir añadiendo): Bárbaro (Fuerza, semiorco), Explorador/Ranger (Destreza, humano o elfo), Paladín (Carisma/Fuerza, humano o dracónido), Bardo (Carisma, gnomo), Druida (Sabiduría, humano), Monje (Destreza/Sabiduría, humano), Hechicero/Sorcerer (Carisma, tiefling), Brujo/Warlock (Carisma, cualquiera).

## 2b. Estadísticas base (array estándar de D&D)

Método: **array estándar de D&D 5e (15, 14, 13, 12, 10, 8)**, repartido entre las 6 estadísticas de `../game-design.md` §2 según la prioridad de cada héroe. Cada uno "dumpea" (deja al mínimo, 8) la estadística menos relevante para su rol.

| Héroe | Fuerza | Destreza | Constitución | Inteligencia | Sabiduría | Carisma |
|---|---|---|---|---|---|---|
| Guerrero | **15** | 13 | **14** | 8 | 12 | 10 |
| Pícaro | 8 | **15** | 13 | 12 | 10 | **14** |
| Mago | 8 | 14 | 10 | **15** | 13 | 12 |
| Clérigo | 13 | 10 | 14 | 8 | **15** | 12 |

Modificador D&D: `mod = floor((stat - 10) / 2)` — ej. 15 → +2, 14 → +2, 13 → +1, 12 → +1, 10 → +0, 8 → −1 (ya definido en `../game-design.md` §2).

Notas de por qué cada uno dumpea lo que dumpea:
- **Guerrero**: Inteligencia al mínimo (luchador directo, no estratega arcano); Sabiduría en 12 le da algo de percepción de enano.
- **Pícaro**: Fuerza al mínimo (no depende de la fuerza bruta); Carisma en 14 como secundaria (encaja con el pícaro "labia fácil", útil también para NPCs de `npcs.md`).
- **Mago**: Fuerza al mínimo (arquetipo físicamente débil); Destreza en 14 como secundaria (esquiva, poca CON/PV).
- **Clérigo**: Inteligencia al mínimo (fe, no estudio arcano); Constitución en 14 como secundaria (aguanta en primera línea de soporte).

## 2c. Movimiento y Dado de Vida

Valores derivados según `../game-design.md` §2.2-§2.1 (movimiento estándar, PV = dado de vida + mod Constitución + **2 de aguante base** del prototipo, ver §2). El movimiento es **2 para todos** (estándar fijo, no varía por raza — ver `../game-design.md` §2.2); los extras vienen de fichas/cartas, no de la raza:

| Héroe | Raza | Movimiento/turno | Dado de vida | PV nivel 1 (dado máx + mod CON + 2 base) |
|---|---|---|---|---|
| Guerrero | Enano | 2 | d10 | 10 + 2 + 2 = 14 |
| Pícaro | Mediano | 2 | d8 | 8 + 1 + 2 = 11 |
| Mago | Elfo | 2 | d6 | 6 + 0 + 2 = 8 |
| Clérigo | Humano | 2 | d8 | 8 + 2 + 2 = 12 |

El dado de vida sigue la convención D&D por rol (marcial > semi-marcial > caster puro): Guerrero d10 (el más resistente), Pícaro/Clérigo d8, Mago d6 (el más frágil, coherente con su Fuerza/Constitución bajas).

Ese mismo dado son los **Dados de Vida (DV)** que se gastan al acampar para curarse (`../game-design.md` §4c.4): cada héroe tiene tantos DV como su nivel (a nivel 1, 1 DV), y el descanso largo los recupera.

## 3. Cómo conecta cada héroe con el resto del diseño

- Cada héroe usa las 6 estadísticas de `../game-design.md` §2; su stat principal marca qué Cartas Básicas de Clase tiene sentido que reciba primero.
- Las Cartas Especiales de Clase (`../game-design.md` §3) son donde cada héroe empieza a diferenciarse de verdad — el prototipo puede lanzarse con muy pocas y ampliar después.
- *(Idea futura)* El estado **Miedo** ([`../effects.md`](../effects.md)) podría afectar distinto según el héroe — ej. el Clérigo más resistente por fe, el Pícaro más vulnerable en combate abierto pero no en sigilo.

## 4. Próximos pasos / preguntas abiertas

- [x] Definir método y valores de las 6 estadísticas base de cada héroe (§2b — array estándar de D&D repartido por rol).
- [x] Definir Movimiento y Dado de Vida de cada héroe (§2c).
- [ ] Reducir/confirmar el roster a 2-3 héroes para el prototipo (el de 4 de arriba es punto de partida, no cerrado).
- [x] Diseñar las primeras Cartas Básicas de Clase (`../game-design.md` §3) para cada héroe → hechas para los **4 héroes** (Guerrero, Mago, Pícaro, Clérigo), cada uno con 3 Básicas + 1 Especial, en [`cards/class.md`](../cards/class.md). Falta balancear.
- [x] Decidir si el jugador controla un héroe fijo por partida, o un grupo → **un solo héroe por partida** (decidido para el prototipo: simplifica combate, turno e iniciativa). El "grupo" queda como idea futura para Modo Campaña.
- [ ] Cuando quieras, ir añadiendo héroes de la lista de candidatos (§2) o nuevos, uno a uno.
