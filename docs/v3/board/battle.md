# Tablero de batalla — V3

> Esqueleto. El tablero de batalla es uno de los dos tableros del juego *(decidido, [game-design.md](../game-design.md) §2)*; el otro es el [tablero de exploración](board-map.md).

## Qué cubre este documento

La pantalla donde se resuelve el combate: rejilla, despliegue, turnos y fin de combate. **Las reglas de resolución de ataque no viven aquí** sino en [game-design.md](../game-design.md) §4; este documento es el escenario, no el motor.

## Por definir

- **Rejilla de batalla**: forma, tamaño y si hay obstáculos.
- **Despliegue**: quién entra, dónde y cuántas fichas caben.
- **Adyacencia y alcance**: qué cuenta como estar en contacto y cómo se mide la distancia de un ataque a distancia.
- **Orden de turno**: cómo se traduce la Habilidad Velocidad al orden de actuación.
- **Fin de combate**: victoria, derrota y si existe retirada.
- **Unidades en el tablero**: cómo entra en batalla una unidad reclutada.

## Relación con v2

[v2/board/battle.md](../../v2/board/battle.md) tenía la pantalla de batalla completa sobre el papel. Buena parte de su contenido depende de mecánicas retiradas (sigilo y aproximación, mercenarios como tipo de carta, tiradas de impacto), así que se revisa entero antes de recuperar nada.
