# CardGame — Tablero y mapa: notas de implementación

Documento técnico complementario a [`board-map.md`](board-map.md) (el diseño del tablero/mapa). Aquí solo van apuntes de **cómo construirlo en código**, no mecánicas de juego — para eso siempre es la referencia el documento de diseño.

> **Mantenimiento:** cuando cambie algo en `board-map.md` que afecte a un punto de aquí (nuevo estado de niebla, nuevo campo en una localización especial, etc.), revisar y actualizar este documento en el mismo cambio para que no se desincronicen.

## 1. Sistema de coordenadas

**Coordenadas axiales o cúbicas** para cada hexágono, no fila/columna simple — es el estándar en desarrollo de juegos hex porque simplifica mucho calcular vecinos y distancias (fórmulas conocidas, sin casos especiales por fila par/impar como pasa con offset coordinates).

## 2. Modelo de datos sugerido (pseudocódigo, orientativo)

```
Hex {
  q, r                // coordenadas axiales
  terrain             // Llanura | Bosque | Pantano | Montaña | Camino (board-map.md §3a)
  groupId?            // a qué grupo/tile pertenece (board-map.md §2; null en prototipo hex-por-hex)
  isConnector: bool   // si es un hexágono "puerta" entre dos grupos (board-map.md §4)
  location?           // Pueblo | Mazmorra | Guarida | null  (localización especial, board-map.md §3b)
                      // En el prototipo NINGUNA abre sub-mapa: se resuelven en su hex (§3b-bis)
  boardToken?         // Exploracion | Amenaza | Tesoro | Terreno | Personaje | Enemigo | null
  isEntrance: bool    // hex de entrada, en una esquina (board-map.md §2c paso 0)
  terrainRevealed: bool   // capa 1 de niebla: se conoce el tipo de terreno (visión de terreno)
  contentRevealed: bool   // capa 2: se conoce su contenido/ficha (visión de detalle)
}                         // dos capas, no un solo `revealed` (board-map.md §2c, game-design.md §2.3)

Chapter {                 // el "reloj" y el estado de la partida
  turn                    // turno de héroe actual
  threat                  // Nivel de Amenaza, 0..40 — el TOPE ES LA DURACIÓN (game-design.md §6c.1)
  threatMax               // 40
  thresholdsFired: Set    // histéresis: 25/50/75 % se disparan UNA vez (game-design.md §6c.3)
  bossElite               // 1 de los 3 Élite, al azar (enemies.md §5c)
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

Group (tile) {              // solo versión con tiles (post-prototipo)
  id, terrainOrLocationType, hexes: Hex[], neighborGroupIds: []
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
                            // ARRANCA con las 2 Básicas elegidas en el setup (§1b paso 4), no vacío
  inPlayMax                 // = clamp(ceil(deck.length / 2), 3, 10) — elástico, no un 10 fijo (§4)
  states: Effect[]          // estados activos (../effects.md)
  actionUsed, quickActionUsed   // economía de acción del turno (§4b.3)
  usedThisCombat: []        // Especiales 1/combate — se vacía al terminar el COMBATE (§4b.8)
  usedThisRest: []          // Especiales/Hoguera 1/descanso
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

Combat {                    // game-design.md §4b.8 — hacía falta un objeto propio
  enemies: Enemy[]          // TOPE DURO: máx. 2 con aiState 'activo' a la vez (enemies.md §5b.6)
  pendingReinforcements: [] // los que esperan hueco por el tope de 2
  initiativeOrder: []       // 1d20 + modDES por participante (§4b.2)
  turnsOutOfContact         // contador del leash bidireccional; a 2 termina el combate (§4b.8)
  disengagedThisTurn: Set   // Desengancharse: máx. 1 vez por enemigo y turno (§4b.11)
}

Card {                      // cards/*
  origin                    // clase | equipo | mercenario | maldicion | encuentro
  type                      // Arma | Armadura | Item | Mercenario | Efecto | Maldicion | ...
  actionCost                // Accion | AccionRapida | Modificador | FueraDeCombate
                            // (sin `Pasiva`: retirado de la v1, cards/class.md §1)
  uses                      // ilimitado | 1/combate | 1/descanso
  rarity?                   // Comun..Legendario (no en cartas de clase)
  effect
}
```

> **Regla madre a la hora de implementarlo (game-design.md §4):** jugar una carta la **mueve de `inPlay` a `deck`**, siempre. `uses: 'ilimitado'` significa "sin contador propio", **no** "se queda en juego" — una carta jugada solo vuelve a estar disponible si el Oteo la devuelve a `inPlay`. Es el invariante del que dependen la economía del turno y el balance de §4b.12; si se implementa al revés (la carta se queda), "en juego" se convierte en un equipamiento fijo y el combate deja de tener decisiones a partir del turno 6.

Esto no es el modelo final, solo una forma concreta de ver cómo encajan las piezas definidas en el diseño (`board-map.md`, `../game-design.md`, `../characters/enemies.md`, `../cards/`), para no re-descubrirlo al programar.

## 3. Algoritmos clave a tener en cuenta

- **Generación del prototipo (board-map.md §2c):** elegir hex de entrada en **una esquina**, hex-por-hex con pesos (tabla A), garantizar conectividad (BFS/flood-fill desde la entrada evitando Montaña), colocar las localizaciones **garantizadas** (Guarida con el boss en el hex transitable más lejano —usar la distancia del mismo BFS—, y **1 Pueblo** en la mitad cercana a la entrada), y sembrar fichas por la tabla B. Sin tiles ni grupos en esta fase.
- **Niebla del prototipo — dos capas por hex:** para cada hex dentro de `visionTerrain` marcar `terrainRevealed`, y dentro de `visionDetail` marcar además `contentRevealed` (board-map.md §2c). Ambas son **acumulativas y permanentes**: lo revelado no se vuelve a ocultar al alejarse. La niebla por grupo (3 estados) es solo para la versión con tiles.
- **Recalcular visión** tras cada movimiento del héroe, y también al cambiar un modificador de visión (entrar/salir de Bosque, jugar *Ojo avizor*, ganar *Velo de sombras*). La Montaña **bloquea línea de visión**, así que no basta con el radio: hace falta un trazado de línea (supercover/line-of-sight sobre coordenadas cúbicas) por cada hex candidato.
- **Desengancharse (game-design.md §4b.11):** se evalúa al **abandonar** un hex adyacente a un enemigo con `aiState === 'activo'`, una vez por enemigo y turno. Conviene resolverlo dentro del propio paso de movimiento, no como un evento aparte, para que el orden movimiento → daño → llegada sea determinista.
- **Fin de combate y `usedThisCombat` (game-design.md §4b.8):** el combate **no** termina al huir. Hay que llevar `turnsOutOfContact` y solo vaciar `usedThisCombat` cuando llegue a 2 (o al morir todos los enemigos); si un enemigo te vuelve a detectar antes, el contador se **reinicia** y sigue siendo el mismo combate. Sin esto, huir un hex recarga las Especiales `1/combate`.
- **Tope de 2 enemigos activos (enemies.md §5b.6):** los refuerzos e invocaciones que no caben van a `pendingReinforcements` y entran cuando muere uno. Conviene comprobarlo en el sitio **donde se genera** el enemigo, no al pintarlo.
- **Ataque a bocajarro (game-design.md §4b.1):** un ataque a distancia contra un objetivo adyacente es legal y aplica **Desventaja**; no hay que rechazar el objetivo por estar por debajo del alcance mínimo. Vale para el héroe y para la IA (`enemies.md` §5b.6 paso 3).
- **Tabla de loot (game-design.md §6b.6):** conviene una **sola función** `rollLoot(fuente)` que haga los tres pasos (¿cae carta? → rareza → tipo) y devuelva cartas concretas del catálogo, porque la llaman **seis** sitios distintos: matar un enemigo, ficha de Tesoro, Mazmorra, Suceso *Hallazgo*, Combate *Botín inesperado* y el umbral del 25 % de Amenaza (que le resta un escalón de rareza). Ojo con la **regla de caída**: si la rareza sorteada no existe para ese tipo de carta, baja al escalón más alto disponible — sin ella, un Épico de arma devuelve vacío, porque el catálogo solo llega a Raro.
- **Ninguna localización abre sub-mapa en el prototipo (board-map.md §3b-bis):** Mazmorra, Mina, Cripta, Templo y Torre de mago se resuelven **en su hexágono**. No hace falta ni un segundo generador, ni pila de mapas, ni estado de entrada/salida. El sub-mapa llega con los tiles.
- **Ficha de Terreno (board-map.md §4b):** se resuelve **dentro del paso de movimiento**, como Desengancharse — la prueba decide si el hex cuesta o no y si pierdes el movimiento restante, así que no puede ser un evento posterior. La ficha **no se retira al fallar**.
- **Encaje de tiles (board-map.md §2, post-prototipo):** definir cada tile con "sockets" de borde (qué terrenos puede tocar en cada lado), similar a cómo encajan las piezas en juegos tipo Carcassonne, para que la generación aleatoria no produzca uniones raras entre grupos.
- **Propagación de niebla de guerra (board-map.md §4):** cuando un grupo pasa a `explorado`, recorrer sus `neighborGroupIds` y ponerlos en `detectado` si seguían en `sinExplorar`. Es una operación local (solo vecinos directos), no hace falta recalcular todo el mapa.
- **Vecinos y distancias:** usar las fórmulas estándar de coordenadas axiales/cúbicas (hay librerías/snippets de referencia ya resueltos, no conviene reinventarlas).
- **Extensión de visión por habilidad:** una función que, dado el personaje y sus habilidades activas, decide qué grupos en estado `detectado` muestran además su tipo de terreno o localización sin necesidad de entrar.

## 4. Separar lógica de mapa y renderizado

Mantener el modelo de datos del mapa (grid, grupos, niebla, fichas) separado de cómo se dibuja en pantalla (posición en píxeles de cada hexágono, estilo visual). Así se puede cambiar tamaño/arte de los hexágonos sin tocar la lógica de juego, y se puede testear la lógica del mapa sin necesidad de renderizar nada (útil para pruebas automatizadas más adelante).
