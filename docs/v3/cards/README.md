# Cartas — V3

> Esqueleto e índice del catálogo de cartas.

## El sistema de cartas se mantiene *(decidido)*

La mecánica de cartas de la versión anterior sigue siendo la base: lo que cambia es el contenido de cada carta, que pasa a referirse a **Habilidades** y **Características** ([razas.md](../razas.md)) en vez de a las 6 estadísticas D&D, a la CA y al arma equipada.

## Tipos de carta

| Documento | Tipo | Estado |
|---|---|---|
| [class.md](class.md) | Cartas de clase | Esqueleto |
| [units.md](units.md) | Cartas de unidad | Esqueleto |
| [items.md](items.md) | Items | Esqueleto |
| [curses.md](curses.md) | Maldiciones | Esqueleto |
| [encounter.md](encounter.md) | Mazo de encuentro | Esqueleto |

## Tipos que desaparecen *(decidido)*

- **Armas y armaduras** quedan obsoletas como tipo de carta. No hay `weapons.md` ni `armor.md` en V3, y ninguna carta debe referirse a equipo empuñado ni a peso de armadura.
- **Mercenarios** quedan obsoletos como tipo de carta. Su hueco lo ocupa la **Unidad** ([units.md](units.md)), que no es un cambio de nombre: se escribe desde cero y se organiza por raza.

Estas dos retiradas tienen cola en el código, para cuando se escriba el catálogo de verdad: `lib/card-table.ts` y `lib/card-catalog.ts` tienen `"mercenario"` y `"mercenaries"` como literales.

## Por definir

- **Anatomía de cada tipo de carta**: qué campos tiene y cómo se rellenan.
- **Cómo se representa la Rareza** y cómo se relaciona con la potencia de la carta.
- **Cómo se obtienen** las cartas de cada tipo.
