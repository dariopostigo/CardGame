# Cartas — V3

> Esqueleto e índice del catálogo de cartas.

**El sistema de cartas se mantiene** *(decidido)*: la mecánica de la versión anterior sigue siendo la base, y lo que cambia es el contenido — cada carta pasa a hablar de **Habilidades** y **Características** ([Sistemas](../sistemas/ficha.md)) en vez de estadísticas D&D, CA y arma equipada.

## Tipos de carta

| Documento | Tipo | Estado |
|---|---|---|
| [class.md](class.md) | Cartas de clase | A medias — anatomía y efecto cerrados, faltan las 40 cartas del piloto |
| [units.md](units.md) | Cartas de unidad | A medias — Humanos construida ([/dev/cartas](/dev/cartas)) |
| [items.md](items.md) | Items | Esqueleto |
| [curses.md](curses.md) | Maldiciones | **En espera** — no está decidido que el tipo siga |
| [encounter.md](encounter.md) | Mazo de encuentro | Esqueleto |

*Maldiciones va apagada y sin enlace en el menú de la wiki a propósito, para que la espera se vea sin abrir nada. Se entra desde esta tabla.*

## Tipos que desaparecen *(decidido)*

- **Armas y armaduras** quedan obsoletas como tipo de carta. Ninguna carta debe referirse a equipo empuñado ni a peso de armadura.
- **Mercenarios** quedan obsoletos: su hueco lo ocupa la **Unidad** ([units.md](units.md)), que se escribe desde cero y se organiza por raza.

*Cola en el código: `lib/card-table.ts` y `lib/card-catalog.ts` tienen `"mercenario"` y `"mercenaries"` como literales.*

## Por definir

- **Anatomía de cada tipo de carta**: qué campos tiene y cómo se rellenan. La de **unidad** ya está cerrada —13 datos + tipo de daño, en [`knowledge/v3/card-concept/README.md`](../../../knowledge/v3/card-concept/README.md) §"Contra qué se juzgan"— y construida para las dos razas piloto en [`/dev/cartas`](/dev/cartas) *(8-sep-2026)*. La de **clase** también está cerrada ([class.md](class.md), 8-sep-2026): 5 campos, y el efecto se expresa con Habilidad/Estado/daño-curación, nada nuevo por carta. Item, maldición y encuentro siguen sin la suya.
- **Al menos una carta de limpieza por raza.** No es una preferencia: [effects.md §6.1](../sistemas/effects.md) decidió que quitar un estado antes de tiempo **solo se puede con cartas**, así que si el catálogo no la trae, el control encadenado se queda sin respuesta.
- **La Rareza de las cartas que no son unidades.** En una unidad está resuelta —sale del tier, con su función escrita en [game-design.md §3.1](../game-design.md)—; **clase, item, maldición y encuentro no tienen tier del que derivarla.** Lo que sí está cerrado es que **no pueden esquivar la pregunta pintándose por tipo**: el raíl de color dice la Rareza y nada más (el rojo del héroe es la única excepción, y sustituye a un escalón que no existe). De las cuatro, la maldición es la única que tenía respuesta —su Severidad **es** el mismo eje leído al revés— y está congelada con el tipo de carta; las otras tres **no están bloqueadas por una decisión, sino por su catálogo vacío**.
- **Cómo se obtienen** las cartas de cada tipo.
