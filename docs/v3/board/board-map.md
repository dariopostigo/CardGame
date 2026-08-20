# Tablero de exploración — V3

> Esqueleto. El tablero de exploración es uno de los dos tableros del juego *(decidido, [game-design.md](../game-design.md) §2)*; el otro es el [tablero de batalla](battle.md).

## Qué cubre este documento

El mapa por el que se mueve el héroe fuera del combate: geometría, generación, terrenos, localizaciones, visión y desplazamiento.

## Por definir

- **Geometría y generación del mapa.**
- **Terrenos** y qué efecto tiene cada uno sobre el movimiento y sobre las fichas.
- **Localizaciones** y qué se hace en cada una.
- **Movimiento**: cómo se gasta la Habilidad Movimiento en este tablero.
- **Rango de visión**: qué revela el mapa y de qué depende. En v2 salía de una característica que ya no existe, así que necesita mecanismo nuevo.
- **Pruebas fuera de combate**: si existen, y cómo se resuelven sin dados.
- **Transición a batalla**: qué dispara el paso de un tablero al otro.

## Relación con v2

El mapa hexagonal, la generación de tablero y los terrenos de [v2/board/board-map.md](../../v2/board/board-map.md) apenas dependían de las 6 estadísticas D&D, así que es de lo más probable de recuperar. Pero se recupera por decisión explícita y reescrito aquí, no por herencia.
