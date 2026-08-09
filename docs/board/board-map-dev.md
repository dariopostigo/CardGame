# CardGame — Tablero y mapa: notas de implementación

Documento técnico complementario a [`board-map.md`](board-map.md) (el diseño del tablero/mapa). Aquí solo van apuntes de **cómo construirlo en código**, no mecánicas de juego — para eso siempre es la referencia el documento de diseño.

> **Mantenimiento:** cuando cambie algo en `board-map.md` que afecte a un punto de aquí (nuevo estado de niebla, nuevo terreno, nuevo campo del hexágono, etc.), revisar y actualizar este documento en el mismo cambio para que no se desincronicen.

## 1. Sistema de coordenadas

**Coordenadas axiales o cúbicas** para cada hexágono, no fila/columna simple — es el estándar en desarrollo de juegos hex porque simplifica mucho calcular vecinos y distancias (fórmulas conocidas, sin casos especiales por fila par/impar como pasa con offset coordinates).

## 2. Modelo de datos sugerido (pseudocódigo, orientativo)

```
Hex {
  q, r                // coordenadas axiales
  terrain             // Llanura | Bosque | Pantano | Montaña | Camino | Mazmorra (board-map.md §3a)
                      // Obligatorio: lo trae pintado la loseta, no se sortea (§2c, tabla A)
  tileId              // loseta a la que pertenece (obligatorio: no hay hexágono sin loseta,
                      // lib/rules/state.ts). El grupo/tile YA está construido (§2, §2c) — lo
                      // que sigue aparcado es la niebla POR grupo (§4), no el dato en sí
  isConnector: bool   // si es un hexágono "puerta" entre dos grupos (board-map.md §4). Diseño
                      // por delante del motor: sin consumidor hasta que la niebla por grupo se
                      // retome (aparcada a propósito hasta que existan fichas de personaje, §4)
  location?           // Guarida | null  (la única localización que queda, e INVISIBLE: solo
                      // marca dónde espera el boss. La Mazmorra es terreno, board-map.md §3a;
                      // el Pueblo es ficha, ver boardToken)
                      // En el prototipo NINGUNA abre sub-mapa: se resuelven en su hex (§3b-bis)
  boardToken?         // Exploracion | Amenaza | Tesoro | Terreno | Personaje | Enemigo | Pueblo | null
                      // Pueblo nunca pasa a "Resuelta": es un edificio persistente, no contenido
                      // que se consuma (lib/rules/tokens.ts) — la excepción del estado de abajo.
                      // NOTA: board-map.md §4c ya diseña un 4º estado de ficha ("Resuelta",
                      // con huella grabada) y una 3ª ficha de personaje (Jefe, corona morada)
                      // que este campo todavía no representa. Aparcado a propósito: el propio
                      // lib/rules/state.ts dice que Character/Enemy/Combat/Card "se añadirá al
                      // implementar su subsistema, no antes", y Resuelta/Jefe son ese mismo caso
  isEntrance: bool    // hex de entrada: la boca del camino de la primera loseta,
                      // o su hex más exterior si no trae camino (board-map.md §2c paso 0)
  terrainRevealed: bool   // capa 1 de niebla: se conoce el tipo de terreno (visión de terreno)
  contentRevealed: bool   // capa 2: se conoce su contenido/ficha (visión de detalle)
}                         // dos capas, no un solo `revealed` (board-map.md §2c, game-design.md §2.3)

PlacedTile {              // una loseta ya colocada en el tablero (lib/rules/state.ts)
  id                      // identificador de la instancia ("t0", "t1"… es el tileId de sus hexágonos)
  defId                   // loseta de la biblioteca de la que sale (lib/rules/tile-library.ts)
  rotation                // pasos de 60° con los que se colocó
  hexes: HexCoord[]
}

Board {                   // el tablero de una partida: hexágonos + losetas que los trajeron
                          // (lib/rules/state.ts, se genera en board-gen.ts, se prueba en /dev/tablero)
  hexes: Map<HexKey, Hex>  // indexado por hex.key() para acceso O(1)
  tiles: PlacedTile[]      // en orden de colocación
  voids: HexCoord[]        // huecos cerrados: el negativo del mapa, no son hexágonos (§2, `findVoids`)
  entrance: HexCoord
  distanceFromEntrance: Map<HexKey, number>   // BFS desde la entrada esquivando Montaña
}

GeneratedBoard {          // lo que devuelve `generateBoard()` (board-gen.ts)
  board: Board
  chapter: Chapter
  stranded: HexCoord[]     // terreno transitable incomunicado por la roca; se MIDE y no se
                          // arregla — antes se abría la Montaña, ya no (§2)
}

Chapter {                 // el "reloj" y el estado de la partida
  turn                    // turno de héroe actual
  threat                  // Nivel de Amenaza, 0..40 — el TOPE ES LA DURACIÓN (game-design.md §6c.1)
  threatMax               // 40
  thresholdsFired: Set    // histéresis: 25/50/75 % se disparan UNA vez (game-design.md §6c.3)
  bossElite               // 1 de los 3 Élite, al azar (enemies.md §5b.3)
  dungeonElite?           // 1 de los 2 restantes, si el mapa lleva Mazmorra (board-map.md §3b-bis)
  seed
}

TerrainDef {                // datos de board-map.md §3a
  moveCost                  // 1, 2, 3 (Montaña = 3, muy difícil; board-map.md §3a)
  enemyDetectionMod         // ej. Bosque -1
  heroVisionMod             // ej. Bosque -1
  coverVsRanged             // ej. Bosque +1 CA
  safeToCamp: bool
  hazard?                   // ej. Pantano: {save:'CON', cd:12, effect:'Envenenado'}
  genWeight                 // peso de generación (tabla A, §2c)
}

Group (tile) {              // la niebla de grupo (§4) todavía no lee este dato: el grupo en sí
                            // ya existe (PlacedTile, arriba), lo que falta es la lógica de
                            // exploración por grupo, aparcada hasta las fichas de personaje (§4)
  id, terrain, hexes: Hex[], neighborGroupIds: []
                            // "terrain" y no "terrainOrLocationType": la Mazmorra ya es terreno
                            // (board-map.md §3b), no una localización aparte del grupo
  explorationState          // 'sinExplorar' | 'detectado' | 'explorado' (§4)
}

Character {
  position: HexCoord
  level, xpMode:'milestone'
  stats { fue, des, con, int, sab, car }   // game-design.md §2
  pv, pvMax                 // pvMax = dadoMax + modCON + 10 de aguante de protagonista (§2)
  ca                        // 10 + DES según el PESO de la armadura + bono (cards/armor.md §1)
  movementPoints            // 2 base, mínimo 1 tras modificadores (§2.2)
  visionDetail              // 3 + modSAB, mínimo 1 → revela fichas (§2.3)
  visionTerrain             // visionDetail + 2, mínimo 2 → revela terreno (§2.3)
  gold                      // game-design.md §6b; inicial 0
  hitDice, hitDiceMax       // DIFERIDO: en el prototipo la Hoguera cura fijo (§4c.4)
  hands[2], armor           // equipo, del kit inicial (§2.4, §1b)
  deck: Card[]              // clase + items + mercenarios; tope deckMax=20 (§4)
  deckMax                   // 20
  inPlay: Card[]            // cartas preparadas, las únicas jugables (§4)
                            // ARRANCA con las 2 cartas de habilidad de clase elegidas en el setup (§1b paso 4), no vacío
  inPlayMax                 // = clamp(ceil(deck.length / 2), 3, 10) — elástico, no un 10 fijo (§4)
  states: Effect[]          // estados activos (../effects.md)
  actionUsed, quickActionUsed   // economía de acción del turno (§4b.3)
}

Enemy {                     // bloque de combate, enemies.md §5b
  category                  // Comun | Elite | JefeCapitulo | JefeFinal
  pv, ca, attackBonus, damage, damageType, range
  speed                     // 2 por defecto; 3 en Lobo/Matriarca/Sombra; NUNCA 1 (enemies.md §5b.1)
  detectionRange            // 2 + modSAB (enemies.md §2)
  aiState                   // 'latente' | 'activo'
  anchor: HexCoord          // a dónde vuelve si desiste (leash, enemies.md §2)
  ability                   // texto/efecto especial
  resistances[], weaknesses[]
}

Combat {                    // board/battle.md §9 (antes game-design.md §4b.8, trasladado 2026-08-06)
  heroes: Hero[]            // 1-4, characters/heroes.md §4
  enemies: Enemy[]          // tamaño = presupuesto de composición, no un tope fijo (enemies.md §5b.6, battle.md §4)
  mercenaries: Mercenary[]  // fichas propias, cuentan +1 al presupuesto de enemies (cards/mercenaries.md §1b)
  compositionBudget         // heroes.length + 1 (+1 por mercenario), tope 6 (enemies.md §5b.6)
  pendingReinforcements: [] // los que esperan hueco por presupuesto
  initiativeOrder: []       // 1d20 + modDES por participante, una sola vez al abrir (battle.md §6, game-design.md §4b.2)
  turnsOutOfContact         // contador del leash bidireccional; a 2 termina el combate (battle.md §9)
  disengagedThisTurn: Set   // Desengancharse: máx. 1 vez por enemigo y turno (battle.md §6)
}

Card {                      // cards/*
  origin                    // clase | equipo | mercenario | maldicion | encuentro
  type                      // Arma | Armadura | Item | Mercenario | Efecto | Maldicion | ...
  actionCost                // Accion | AccionRapida | Modificador | FueraDeCombate
                            // (sin `Pasiva`: retirado de la v1, cards/class.md §1)
  usoTurnos?                // Tipo Turnos: nº de turnos en juego antes de volver al Mazo (cards/class.md §1); ausente si no aplica
  rarity?                   // Comun..Legendario (no en cartas de clase)
  effect
}
```

> **Regla madre a la hora de implementarlo (game-design.md §4):** jugar una carta la **mueve de `inPlay` a `deck`**, siempre. `uses: 'ilimitado'` significa "sin contador propio", **no** "se queda en juego" — una carta jugada solo vuelve a estar disponible si el Oteo la devuelve a `inPlay`. Es el invariante del que dependen la economía del turno y el balance de §4b.12; si se implementa al revés (la carta se queda), "en juego" se convierte en un equipamiento fijo y el combate deja de tener decisiones a partir del turno 6.

Esto no es el modelo final, solo una forma concreta de ver cómo encajan las piezas definidas en el diseño (`board-map.md`, `../game-design.md`, `../characters/enemies.md`, `../cards/`), para no re-descubrirlo al programar.

## 3. Algoritmos clave a tener en cuenta

- **Generación del prototipo (board-map.md §2c):** elegir hex de entrada en **una esquina**, hex-por-hex con pesos (tabla A), garantizar conectividad (BFS/flood-fill desde la entrada evitando Montaña), colocar lo **garantizado** (Guarida con el boss en el hex transitable más lejano —usar la distancia del mismo BFS—), y sembrar fichas por la tabla B, Pueblo incluido —vuelve a ser una ficha más, sin garantía de aparecer. Sin tiles ni grupos en esta fase.
- **Niebla del prototipo — dos capas por hex:** para cada hex dentro de `visionTerrain` marcar `terrainRevealed`, y dentro de `visionDetail` marcar además `contentRevealed` (board-map.md §2c). Ambas son **acumulativas y permanentes**: lo revelado no se vuelve a ocultar al alejarse. La niebla por grupo (3 estados) es solo para la versión con tiles.
- **Recalcular visión** tras cada movimiento del héroe, y también al cambiar un modificador de visión (entrar/salir de Bosque, jugar *Ojo avizor*, ganar *Velo de sombras*). La Montaña **bloquea línea de visión**, así que no basta con el radio: hace falta un trazado de línea (supercover/line-of-sight sobre coordenadas cúbicas) por cada hex candidato.
- **Fin de combate, solo el leash de reengancharse (game-design.md §4b.8):** esto sí sigue siendo del mapa, aunque el combate en sí ya se resuelva en su propia pantalla — es la condición para volver a "fuera de combate" y poder acampar (`../game-design.md` §4c.2). Hay que llevar `turnsOutOfContact` y solo considerarlo cumplido cuando llegue a 2; si un enemigo te vuelve a detectar antes, el contador se **reinicia**. Sin esto, huir un hex te dejaría acampar gratis a un paso de los enemigos.

> **Retirado de esta lista (2026-08-07): Desengancharse, tope de enemigos y ataque a bocajarro.** Los tres describían mecánica de combate que, con la pantalla de batalla propia (`../board/battle.md`, decisión raíz #1), ya no ocurre en este tablero — el propio `Combat{}` de §2 ya usa el presupuesto de composición (tope 6, no 2) y cita `battle.md`, así que estas tres entradas habían quedado contradichas por el resto del documento. No se reescriben aquí: son candidatas a un futuro documento técnico de la pantalla de batalla (`board/battle-dev.md` o equivalente), que todavía no existe.
- **Tabla de loot (game-design.md §6b.6):** conviene una **sola función** `rollLoot(fuente)` que haga los tres pasos (¿cae carta? → rareza → tipo) y devuelva cartas concretas del catálogo, porque la llaman **seis** sitios distintos: matar un enemigo, ficha de Tesoro, Mazmorra, Suceso *Hallazgo*, Combate *Botín inesperado* y el umbral del 25 % de Amenaza (que le resta un escalón de rareza). Ojo con la **regla de caída**: si la rareza sorteada no existe para ese tipo de carta, baja al escalón más alto disponible — sin ella, un Épico de arma devuelve vacío, porque el catálogo solo llega a Raro.
- **Nada abre sub-mapa en el prototipo (board-map.md §3b-bis):** Mazmorra, Mina y Cripta se resuelven **en su hexágono**, y ni siquiera son localizaciones ya: la Mazmorra es terreno. El Pueblo tampoco abre sub-mapa, pero sí abre su propia **pantalla** (la Taberna, `characters/npcs.md` §3c) — es la única excepción, y es pantalla completa, no un hexágono reforzado. No hace falta ni un segundo generador, ni pila de mapas, ni estado de entrada/salida para las de terreno. El sub-mapa llega con los tiles.
- **Ficha de Terreno (board-map.md §4b):** se resuelve **dentro del paso de movimiento**, como Desengancharse — la prueba decide si el hex cuesta o no y si pierdes el movimiento restante, así que no puede ser un evento posterior. La ficha **no se retira al fallar**.
- **Encaje de tiles (board-map.md §2, post-prototipo):** definir cada tile con "sockets" de borde (qué terrenos puede tocar en cada lado), similar a cómo encajan las piezas en juegos tipo Carcassonne, para que la generación aleatoria no produzca uniones raras entre grupos.
- **Propagación de niebla de guerra (board-map.md §4):** cuando un grupo pasa a `explorado`, recorrer sus `neighborGroupIds` y ponerlos en `detectado` si seguían en `sinExplorar`. Es una operación local (solo vecinos directos), no hace falta recalcular todo el mapa.
- **Vecinos y distancias:** usar las fórmulas estándar de coordenadas axiales/cúbicas (hay librerías/snippets de referencia ya resueltos, no conviene reinventarlas).
- **Extensión de visión por habilidad:** una función que, dado el personaje y sus habilidades activas, decide qué grupos en estado `detectado` muestran además su tipo de terreno sin necesidad de entrar.

## 4. Separar lógica de mapa y renderizado

Mantener el modelo de datos del mapa (grid, grupos, niebla, fichas) separado de cómo se dibuja en pantalla (posición en píxeles de cada hexágono, estilo visual). Así se puede cambiar tamaño/arte de los hexágonos sin tocar la lógica de juego, y se puede testear la lógica del mapa sin necesidad de renderizar nada (útil para pruebas automatizadas más adelante).
