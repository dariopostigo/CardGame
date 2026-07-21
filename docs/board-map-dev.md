# CardGame — Tablero y mapa: notas de implementación

Documento técnico complementario a [`board-map.md`](board-map.md) (el diseño del tablero/mapa). Aquí solo van apuntes de **cómo construirlo en código**, no mecánicas de juego — para eso siempre es la referencia el documento de diseño.

> **Mantenimiento:** cuando cambie algo en `board-map.md` que afecte a un punto de aquí (nuevo estado de niebla, nuevo campo en una localización especial, etc.), revisar y actualizar este documento en el mismo cambio para que no se desincronicen.

## 1. Sistema de coordenadas

**Coordenadas axiales o cúbicas** para cada hexágono, no fila/columna simple — es el estándar en desarrollo de juegos hex porque simplifica mucho calcular vecinos y distancias (fórmulas conocidas, sin casos especiales por fila par/impar como pasa con offset coordinates).

## 2. Modelo de datos sugerido (pseudocódigo, orientativo)

```
Hex {
  q, r                // coordenadas axiales
  terrain             // Llanura, Bosque, Pantano, ... (board-map.md §3)
  groupId             // a qué grupo/tile pertenece (board-map.md §2)
  isConnector: bool   // si es un hexágono "puerta" entre dos grupos (board-map.md §4)
  eventToken?         // Tesoro | Prueba | EnemigoOculto | Narrativo | Vacio | null
}

Group (tile) {
  id
  terrainOrLocationType   // terreno base (§3) o localización especial (§3b)
  hexes: Hex[]
  neighborGroupIds: []
  explorationState        // 'sinExplorar' | 'detectado' | 'explorado'  (§4)
}

Character {
  position: HexCoord
  movementPoints
  visionRange             // base + bonus de habilidades (§4)
  explorationAbilities: []
}
```

Esto no es el modelo final, solo una forma concreta de ver cómo encajan entre sí "hexágono", "grupo" y "personaje" tal como se definen en `board-map.md`, para no tener que re-descubrirlo al programar.

## 3. Algoritmos clave a tener en cuenta

- **Encaje de tiles (board-map.md §2):** definir cada tile con "sockets" de borde (qué terrenos puede tocar en cada lado), similar a cómo encajan las piezas en juegos tipo Carcassonne, para que la generación aleatoria no produzca uniones raras entre grupos.
- **Propagación de niebla de guerra (board-map.md §4):** cuando un grupo pasa a `explorado`, recorrer sus `neighborGroupIds` y ponerlos en `detectado` si seguían en `sinExplorar`. Es una operación local (solo vecinos directos), no hace falta recalcular todo el mapa.
- **Vecinos y distancias:** usar las fórmulas estándar de coordenadas axiales/cúbicas (hay librerías/snippets de referencia ya resueltos, no conviene reinventarlas).
- **Extensión de visión por habilidad:** una función que, dado el personaje y sus habilidades activas, decide qué grupos en estado `detectado` muestran además su tipo de terreno o localización sin necesidad de entrar.

## 4. Separar lógica de mapa y renderizado

Mantener el modelo de datos del mapa (grid, grupos, niebla, fichas) separado de cómo se dibuja en pantalla (posición en píxeles de cada hexágono, estilo visual). Así se puede cambiar tamaño/arte de los hexágonos sin tocar la lógica de juego, y se puede testear la lógica del mapa sin necesidad de renderizar nada (útil para pruebas automatizadas más adelante).
