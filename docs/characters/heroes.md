# CardGame — Héroes (borrador)

Boceto de los héroes/clases jugables iniciales, previo a definir en detalle las estadísticas y cartas exactas en [`../game-design.md`](../game-design.md) (que ya fija la base de 6 estadísticas D&D y el sistema de cartas). Aquí solo se esboza identidad, rol y sabor de cada uno — los números concretos vienen después.

**Base: razas y clases de D&D**, sin atarse a marcas de Tolkien/Viajes por la Tierra Media (eso queda solo como inspiración de mecánicas de tablero en `../board/board-map.md`, no como fuente de identidad de personaje). Términos transversales en [`../glossary.md`](../glossary.md).

## 1. Propósito de este boceto

`../game-design.md` §7 tiene pendiente "Definir lista de clases iniciales (2-3 para el prototipo) con sus cartas básicas" — este documento es el primer paso de esa tarea: fijar identidad y rol de cada héroe antes de diseñar cartas y números.

## 1b. Fichas de héroe (pantalla de selección)

Texto que se muestra al elegir héroe, paso 2 del setup (`../game-design.md` §1b): historia breve, puntos fuertes y débiles. Los números salen de §2b-§2d.

### Guerrero — Enano *(Fighter)*

> Sobrevivió al asalto que borró su guarnición del mapa. De los cuarenta que defendían la puerta salió él solo, y no le gusta hablar de cómo. Ahora recorre los caminos buscando algo que se parezca a una redención, o al menos a una pelea que sí pueda ganar.

- **Fuerte:** el más resistente del roster (14 PV, d10) y el que impacta con más seguridad. *Golpe firme* ataca con ventaja de serie, y aguanta la armadura más pesada sin penalización.
- **Débil:** lento de reflejos e Inteligencia mínima; sin nada a distancia, tiene que llegar hasta el enemigo. Con armadura pesada hace ruido: **desventaja para evitar detección**, así que el sigilo no es una opción.
- **Para quien quiera:** entrar de frente y no morir.

### Mago — Elfo *(Wizard)*

> Exiliado de su torre arcana por leer lo que no debía. No discute la sentencia: discute que el conocimiento que buscaba siga ahí fuera, en ruinas y criptas que nadie ha catalogado. Viaja ligero porque lo único que necesita cabe en un libro.

- **Fuerte:** el mejor daño a distancia (*Descarga arcana*, 4 hex) y el único control real del juego (*Enredo gélido* inmoviliza). *Bola de fuego* golpea a varios enemigos a la vez.
- **Débil:** **8 PV, el más frágil con diferencia** — dos golpes de un élite y cae. Fuerza mínima: no puede blandir armas pesadas ni forzar nada. Si un enemigo llega a adyacencia, ya vas tarde.
- **Para quien quiera:** matar antes de que le toquen. Posicionamiento sobre reflejos.

### Pícaro — Mediano *(Rogue)*

> Ex-contrabandista. Conoce los atajos porque los usó para mover mercancía que no era suya, y conoce los peligros porque alguna vez le pillaron. Cambió de oficio, no de costumbres.

- **Fuerte:** el mejor en sigilo y exploración. *Ataque furtivo* pega +2d6 desde las sombras, *Desaparecer* le saca de cualquier combate, y **Oculto** le hace indetectable. Puede elegir qué peleas dar.
- **Débil:** Fuerza mínima y solo 11 PV: en combate abierto y de frente pierde. **Y tiene la peor visión del roster** (Sabiduría 10) — irónico para el explorador, pero su ventaja es esconderse, no percibir.
- **Para quien quiera:** evitar la mitad de los combates y ganar la otra mitad por emboscada.

### Clérigo — Humano *(Cleric)*

> Su templo ya no existe; su causa, sí. No predica y no explica a quién sirve. Se limita a aparecer donde hace falta, curar lo que puede curarse y quemar lo que no debería seguir caminando.

- **Fuerte:** el único con **curación repetible** (*Palabra sanadora*), lo que alarga muchísimo la supervivencia entre descansos. **La mejor visión del roster** (Sabiduría 15). Su daño ☀️ radiante es devastador contra no-muertos, que es la Naturaleza de medio bestiario ([`enemies.md`](enemies.md) §3b).
- **Débil:** Destreza 10 (el peor en iniciativa y sigilo) e Inteligencia mínima. Daño mediocre: mata despacio, y las peleas largas dan tiempo a que suba el Nivel de Amenaza.
- **Para quien quiera:** partidas largas de desgaste, sin depender de pociones.

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

## 2c. Movimiento, Dado de Vida y visión

Valores derivados según `../game-design.md` §2.2-§2.3 (movimiento estándar, PV = dado de vida + mod Constitución + **10 de aguante de protagonista**, ver §2). El movimiento es **2 para todos** (estándar fijo, no varía por raza — ver `../game-design.md` §2.2); los extras vienen de fichas/cartas, no de la raza:

| Héroe | Raza | Mov./turno | Dado de vida | PV nivel 1 (dado máx + mod CON + 10) | Visión detalle | Visión terreno |
|---|---|---|---|---|---|---|
| Guerrero | Enano | 2 | d10 | 10 + 2 + 10 = **22** | 4 | 6 |
| Pícaro | Mediano | 2 | d8 | 8 + 1 + 10 = **19** | 3 | 5 |
| Mago | Elfo | 2 | d6 | 6 + 0 + 10 = **16** | 4 | 6 |
| Clérigo | Humano | 2 | d8 | 8 + 2 + 10 = **20** | 5 | 7 |

> **El aguante base subió de 2 a 10 *(decidido)*.** Con los 14/11/8/12 anteriores los tres Élite del bestiario ganaban a los cuatro héroes y el Mago perdía contra un lobo suelto (`../game-design.md` §2). La proporción entre los cuatro se conserva —el Guerrero sigue aguantando un 38 % más que el Mago—, solo se sube el suelo. Motivo y cuentas completas en `../game-design.md` §2.

El dado de vida sigue la convención D&D por rol (marcial > semi-marcial > caster puro): Guerrero d10 (el más resistente), Pícaro/Clérigo d8, Mago d6 (el más frágil, coherente con su Fuerza/Constitución bajas).

**Visión** = `2 + mod SAB` de detalle (fichas) y `+2` más de terreno (silueta del mapa), `../game-design.md` §2.3. El Clérigo ve más lejos y el **Pícaro es el que menos** (Sabiduría 10) — decidido a propósito: su ventaja exploradora es el sigilo y *Ojo avizor*, no la percepción bruta.

**Dados de Vida:** en el prototipo **no se usan** — la Hoguera cura una cantidad fija (mitad de los PV máximos, `../game-design.md` §4c.4), porque a nivel 1 el héroe tendría 1 solo DV y el descanso corto sería inservible. Cuando llegue la progresión de nivel, cada héroe pasa a tener **DV = su nivel**, del tamaño de su dado de clase, recuperables en el descanso largo.

## 2d. Kit inicial por héroe *(decidido)*

Se otorga automáticamente al elegir héroe (paso 3 del setup, `../game-design.md` §1b). **El oro inicial es 0**, así que esto no se compra ni se elige del catálogo: es lo que llevas puesto al entrar al mapa.

Criterio: **equipo modesto a propósito**. Nada de armadura pesada de salida — si el Guerrero empezara con Cota de malla y escudo tendría CA 18 y los enemigos Normales (ataque +1) le acertarían 1 vez de cada 5, con lo que el botín dejaría de importar. El equipo bueno es la recompensa de explorar, no el punto de partida.

| Héroe | Equipado (2 manos + 1 armadura, §2.4) | CA resultante | Items al Mazo |
|---|---|---|---|
| **Guerrero** | Espada ✋ · Escudo ✋ · Cuero tachonado 🥼 (+2) | 10 +1 DES +2 +2 escudo = **15** | Poción de vida · Hoguera · Raciones de viaje · Martillo |
| **Mago** | Bastón de mago ✋ · Libro de hechizos ✋ · Acolchada 🥼 (+1) | 10 +2 DES +1 = **13** | Poción de vida · Hoguera · Pergamino · Bota veloz |
| **Pícaro** | Dagas ✋ · Ballesta de mano ✋ · Cuero 🥼 (+1) | 10 +2 DES +1 = **13** | Poción de vida · Hoguera · Ganzúas · Atajo del pícaro |
| **Clérigo** | Maza bendita ✋ · Símbolo sagrado ✋ · Cota de escamas 👕 (+4) | 10 +0 DES +4 = **14** | Poción de vida · Hoguera · Antídoto · Raciones de viaje |

Catálogos: armas y focos en [`../cards/weapons.md`](../cards/weapons.md), armaduras en [`../cards/armor.md`](../cards/armor.md), items en [`../cards/items.md`](../cards/items.md).

**Notas de por qué cada kit es así:**
- **Todos llevan Poción de vida + Hoguera.** No es sabor: son el sistema de recuperación entero (`../game-design.md` §4c) y sin ellos en el kit no se puede testear.
- **Guerrero:** espada y escudo, el arquetipo. Armadura ligera de salida (la pesada es objetivo de loot). Martillo y Raciones le dan utilidad fuera de combate, que es donde está más pelado.
- **Mago:** las dos manos ocupadas por Bastón + Libro (foco arcano, +1 a tiradas y CD de hechizos). Ojo: **no le queda mano para la Antorcha**, así que las localizaciones oscuras le cuestan de verdad. La Bota veloz es su salida de emergencia con 8 PV.
- **Pícaro:** las dos manos con arma de **1 mano cada una** — Dagas para melee finesse y Ballesta de mano para 3 hex. Cubre las dos distancias, que es su forma de elegir peleas.
- **Clérigo:** Maza bendita (usa **FUE o SAB**, la mejor de las dos) + Símbolo sagrado como foco divino. Es el único que arranca con armadura media: hace ruido (desventaja para evitar detección) y no le importa, porque no es un héroe de sigilo.

> **Estos kits ayudan al arreglo del Oteo, pero ya no son la mitad de él.** Cada héroe trae **8 cartas de habilidad de clase** (`../cards/class.md` §6, sin distinción Básica/Especial) + 4 items = **12 cartas de Mazo** al arrancar, muy por encima del mínimo de 3-4 sin preparar que necesita el Oteo (`../game-design.md` §4, tope fijo de 5 en juego). Antes, con solo 4 cartas de clase, los items eran quienes evitaban que el Mazo se vaciara en 3 turnos; ahora esa función la cubren de sobra las propias cartas de clase, y los items se quedan por variedad de utilidad.

## 3. Cómo conecta cada héroe con el resto del diseño

- Cada héroe usa las 6 estadísticas de `../game-design.md` §2; su stat principal marca qué Cartas de Habilidad de Clase (`../game-design.md` §3) tiene sentido que reciba primero.
- Ese mismo roster de 8 cartas por héroe es donde cada uno empieza a diferenciarse de verdad — el prototipo puede lanzarse con muy pocas y ampliar después.
- *(Idea futura)* El estado **Miedo** ([`../effects.md`](../effects.md)) podría afectar distinto según el héroe — ej. el Clérigo más resistente por fe, el Pícaro más vulnerable en combate abierto pero no en sigilo.

## 4. Próximos pasos / preguntas abiertas

- [x] Definir método y valores de las 6 estadísticas base de cada héroe (§2b — array estándar de D&D repartido por rol).
- [x] Definir Movimiento y Dado de Vida de cada héroe (§2c).
- [x] Roster del **prototipo** = **Guerrero + Mago** *(decidido)*: máximo contraste (melee/tanque 14 PV vs. distancia/frágil 8 PV). Pícaro y Clérigo entran justo después; el catálogo de los 4 sigue en [`../cards/class.md`](../cards/class.md).
- [x] Diseñar las primeras Cartas de Habilidad de Clase (`../game-design.md` §3) para cada héroe → hechas para los **4 héroes** (Guerrero, Mago, Pícaro, Clérigo), cada uno con **8 cartas** al mismo nivel, en [`cards/class.md`](../cards/class.md). Falta balancear.
- [x] Decidir si el jugador controla un héroe fijo por partida, o un grupo → **co-op de 1 a 4 héroes, en Partida rápida y en Campaña por igual** *(reabierto 2026-08-06 — corrige la versión anterior de esta misma línea, que fijaba un solo héroe y dejaba el grupo como idea futura solo para Campaña)*. Cada héroe es una ficha independiente con su propio turno, iniciativa y Mazo; el número de jugadores en una partida concreta es 1-4, elegido al empezar. El combate en sí ocurre en la pantalla de batalla (E2, [`../board/battle.md`](../board/battle.md)), no sobre el mapa — ver `board/battle.md` §0, decisión raíz #1.
- [x] **Propagar el mismo modelo a la Exploración (E1) y al setup** *(decidido 2026-08-07)* — esta línea ya decía "ficha independiente con turno propio", pero `../game-design.md` §1b y `../board/board-map.md` §2c seguían escritos en singular ("el héroe entra por una esquina"), sin decir cómo entran/se mueven 2-4 héroes en el mapa compartido. Cerrado: entran todos por el mismo hexágono, cada uno con su propio turno (Oteo → Mover → Actuar), pueden separarse libremente, y **repetir clase entre jugadores está permitido** (el roster del prototipo solo tiene 2 héroes construidos, así que 3-4 jugadores lo exigen).
- [x] Escribir la **ficha de cada héroe** para la pantalla de selección (historia + fuertes/débiles) → §1b.
- [x] Definir el **kit inicial** de cada héroe (equipo + items de arranque) → §2d. Falta balancear.
- [ ] Cuando quieras, ir añadiendo héroes de la lista de candidatos (§2) o nuevos, uno a uno.
- [ ] Ampliar las **cartas de clase** de cada héroe (`../cards/class.md`): hoy son 8 al mismo nivel, y aunque el kit inicial ya arregla el tamaño de Mazo (§2d), más cartas de clase darían más identidad y variedad al Oteo.
