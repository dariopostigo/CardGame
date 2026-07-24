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
  boardToken?         // Exploracion | Amenaza | Tesoro | Terreno | Personaje | Enemigo | null
  revealed: bool      // prototipo: si ya está dentro del rango de visión (niebla simple, §2c)
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
  pv, pvMax
  ca                        // 10 + modDES + armadura (game-design.md §2, §4b)
  movementPoints            // 2 base (§2.2)
  visionRange               // base 1 + Sabiduría (§2.3)
  gold                      // game-design.md §6b
  hitDice, hitDiceMax       // = nivel; se gastan al acampar (§4c.4)
  hands[2], armor           // equipo (§2.4)
  deck: Card[]              // clase + equipo; tope = deckMax (§4)
  deckMax
  states: Effect[]          // estados activos (../effects.md)
  usedThisCombat: []        // Especiales 1/combate
  usedThisRest: []          // Especiales/Hoguera 1/descanso
}

Enemy {                     // bloque de combate, enemies.md §5b
  category                  // Comun | Elite | JefeCapitulo | JefeFinal
  pv, ca, attackBonus, damage, damageType, range, speed
  detectionRange            // 2 + Sabiduría (enemies.md §2)
  aiState                   // 'latente' | 'activo'
  anchor: HexCoord          // a dónde vuelve si desiste (leash, enemies.md §2)
  ability                   // texto/efecto especial
  resistances[], weaknesses[]
}

Card {                      // cards/*
  origin                    // clase | equipo | mercenario | maldicion | encuentro
  type                      // Arma | Armadura | Item | Mercenario | Efecto | Maldicion | ...
  actionCost                // Accion | AccionRapida | Modificador | Pasiva | FueraDeCombate
  uses                      // ilimitado | 1/combate | 1/descanso (ninguna carta del mazo personal se pierde al jugarla, game-design.md §4)
  rarity?                   // Comun..Legendario (no en cartas de clase)
  effect
}
```

Esto no es el modelo final, solo una forma concreta de ver cómo encajan las piezas definidas en el diseño (`board-map.md`, `../game-design.md`, `../characters/enemies.md`, `../cards/`), para no re-descubrirlo al programar.

## 3. Algoritmos clave a tener en cuenta

- **Generación del prototipo (board-map.md §2c):** hex-por-hex con pesos (tabla A), garantizar conectividad (BFS/flood-fill desde la entrada evitando Montaña), colocar boss en el hex transitable más lejano, y sembrar fichas por la tabla B. Sin tiles ni grupos en esta fase.
- **Niebla del prototipo:** simple por rango de visión (marcar `Hex.revealed` para los hexes dentro de la visión del personaje según su posición); la niebla por grupo (3 estados) es solo para la versión con tiles.
- **Encaje de tiles (board-map.md §2, post-prototipo):** definir cada tile con "sockets" de borde (qué terrenos puede tocar en cada lado), similar a cómo encajan las piezas en juegos tipo Carcassonne, para que la generación aleatoria no produzca uniones raras entre grupos.
- **Propagación de niebla de guerra (board-map.md §4):** cuando un grupo pasa a `explorado`, recorrer sus `neighborGroupIds` y ponerlos en `detectado` si seguían en `sinExplorar`. Es una operación local (solo vecinos directos), no hace falta recalcular todo el mapa.
- **Vecinos y distancias:** usar las fórmulas estándar de coordenadas axiales/cúbicas (hay librerías/snippets de referencia ya resueltos, no conviene reinventarlas).
- **Extensión de visión por habilidad:** una función que, dado el personaje y sus habilidades activas, decide qué grupos en estado `detectado` muestran además su tipo de terreno o localización sin necesidad de entrar.

## 4. Separar lógica de mapa y renderizado

Mantener el modelo de datos del mapa (grid, grupos, niebla, fichas) separado de cómo se dibuja en pantalla (posición en píxeles de cada hexágono, estilo visual). Así se puede cambiar tamaño/arte de los hexágonos sin tocar la lógica de juego, y se puede testear la lógica del mapa sin necesidad de renderizar nada (útil para pruebas automatizadas más adelante).
