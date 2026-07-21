# CardGame — Héroes (borrador)

Boceto de los héroes/clases jugables iniciales, previo a definir en detalle las estadísticas y cartas exactas en [`game-design.md`](game-design.md) (que ya fija la base de 6 estadísticas D&D y el sistema de cartas). Aquí solo se esboza identidad, rol y sabor de cada uno — los números concretos vienen después.

**Base: razas y clases de D&D**, sin atarse a marcas de Tolkien/Viajes por la Tierra Media (eso queda solo como inspiración de mecánicas de tablero en `board-map.md`, no como fuente de identidad de personaje).

## 1. Propósito de este boceto

`game-design.md` §7 tiene pendiente "Definir lista de clases iniciales (2-3 para el prototipo) con sus cartas básicas" — este documento es el primer paso de esa tarea: fijar identidad y rol de cada héroe antes de diseñar cartas y números.

## 2. Roster inicial propuesto (4 arquetipos, punto de partida)

| Héroe (clase D&D) | Raza (D&D) | Stat principal | Rol en combate | Gancho breve |
|---|---|---|---|---|
| Guerrero *(Fighter)* | Enano | Fuerza / Constitución | Tanque, daño cuerpo a cuerpo, aguanta golpes | Superviviente de una guarnición caída, busca redención |
| Pícaro *(Rogue)* | Mediano *(Halfling)* | Destreza | Sigilo, ataque a distancia/furtivo, buen aliado en fichas de Exploración/Amenaza (`board-map.md`) | Ex-contrabandista que conoce atajos y peligros del camino |
| Mago *(Wizard)* | Elfo | Inteligencia | Daño mágico a distancia, control de enemigos | Estudioso exiliado de una torre arcana, busca conocimiento perdido |
| Clérigo *(Cleric)* | Humano | Sabiduría | Curación, soporte, buffs a aliados | Sacerdote errante de un templo destruido, sigue una causa personal |

Cubre los 4 roles clásicos de grupo D&D (tanque / daño furtivo-a distancia / daño mágico-control / soporte-curación), cada uno con una estadística principal distinta de las 6 de `game-design.md` §2.

**Candidatos para ampliar el roster más adelante** (no para el prototipo inicial, solo para cuando quieras ir añadiendo): Bárbaro (Fuerza, semiorco), Explorador/Ranger (Destreza, humano o elfo), Paladín (Carisma/Fuerza, humano o dracónido), Bardo (Carisma, gnomo), Druida (Sabiduría, humano), Monje (Destreza/Sabiduría, humano), Hechicero/Sorcerer (Carisma, tiefling), Brujo/Warlock (Carisma, cualquiera).

## 3. Cómo conecta cada héroe con el resto del diseño

- Cada héroe usa las 6 estadísticas de `game-design.md` §2; su stat principal marca qué Cartas Básicas de Clase tiene sentido que reciba primero.
- Las Cartas Especiales de Clase (`game-design.md` §3) son donde cada héroe empieza a diferenciarse de verdad — el prototipo puede lanzarse con muy pocas y ampliar después.
- *(Idea futura, no activa)* Si algún día se retoma el tracker de Miedo (`game-design.md`, "Ideas futuras"), podría afectar distinto según el héroe — ej. el Clérigo más resistente por fe, el Pícaro más vulnerable en combate abierto pero no en sigilo.

## 4. Próximos pasos / preguntas abiertas

- [ ] Reducir/confirmar el roster a 2-3 héroes para el prototipo (el de 4 de arriba es punto de partida, no cerrado).
- [ ] Diseñar las primeras Cartas Básicas de Clase (`game-design.md` §3) para cada héroe elegido.
- [ ] Decidir si el jugador controla un héroe fijo por partida, o puede tener/cambiar entre varios en Modo Campaña (un "grupo" en vez de un solo personaje).
- [ ] Cuando quieras, ir añadiendo héroes de la lista de candidatos (§2) o nuevos, uno a uno.
