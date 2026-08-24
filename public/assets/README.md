# `public/assets/` — el arte que se sirve

Todo lo que hay aquí se sirve tal cual en la URL `/assets/…`. Desde el 20 de
agosto de 2026 **el arte de juego está partido por versión**, igual que
`docs/` y `lib/`:

| Carpeta | Qué es | Se toca |
|---|---|---|
| `v2/` | Arte del juego anterior (héroes de clase D&D, sprite del tablero) más los `.glb` prestados de [`v2/models/`](v2/models/README.md). Es lo que sirven `/lab` y `/play` | **No.** Congelado, como `docs/v2/` |
| `v3/` | Arte del juego vigente. **Aquí va todo lo nuevo** | Sí |

Y fuera de `assets/`, sin versión porque no se sirven al jugador:

- [`../concepts/`](../concepts/) — moodboards y referencias visuales (UI,
  cartas de otros juegos, mapas, Olden Era…). Se citan en comentarios de código
  y de estilos; nada de esto entra en producción.

## La regla

Arte nuevo → `v3/`. Si algo de `v2/` sirve para V3 **se copia a `v3/`**, no se
enlaza desde allí: `v2/` puede vaciarse el día que el juego anterior deje de
ejecutarse, y nada de V3 debe romperse por eso.

El corte completo, con sus reglas y sus pendientes, está en
[`ARCHITECTURE.md`](../../ARCHITECTURE.md) §"El corte v2 / v3".
