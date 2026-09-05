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
| [curses.md](curses.md) | Maldiciones | **En espera** *(5-sep-2026)* |
| [encounter.md](encounter.md) | Mazo de encuentro | Esqueleto |

**Maldiciones va apagada y sin enlace en el menú de la wiki** a propósito, para que la espera se vea sin abrir nada: desde el 5 de septiembre de 2026 no está decidido que siga siendo un tipo de carta. Se entra desde esta tabla, que es donde toca —[curses.md](curses.md) cuenta qué arrastra la decisión—. Lo que lo apaga es la línea `<!-- estado: en-espera -->` del propio documento; el día que se resuelva, se cambia esa palabra y ya está.

## Tipos que desaparecen *(decidido)*

- **Armas y armaduras** quedan obsoletas como tipo de carta. No hay `weapons.md` ni `armor.md` en V3, y ninguna carta debe referirse a equipo empuñado ni a peso de armadura.
- **Mercenarios** quedan obsoletos como tipo de carta. Su hueco lo ocupa la **Unidad** ([units.md](units.md)), que no es un cambio de nombre: se escribe desde cero y se organiza por raza.

Estas dos retiradas tienen cola en el código, para cuando se escriba el catálogo de verdad: `lib/card-table.ts` y `lib/card-catalog.ts` tienen `"mercenario"` y `"mercenaries"` como literales.

## Por definir

- **Anatomía de cada tipo de carta**: qué campos tiene y cómo se rellenan.
- **Al menos una carta de limpieza por raza.** No es una preferencia: [effects.md §6.1](../effects.md) decidió *(23-ago-2026)* que quitar un estado antes de tiempo **solo se puede con cartas** —ninguna Habilidad limpia, y curar tampoco—, así que si el catálogo no la trae, el control encadenado se queda sin respuesta en el juego.
- **La Rareza de las cartas que no son unidades.** En una carta de unidad ya está resuelto **del todo**: la Rareza sale del tier *(24 de agosto de 2026)* y desde el **5 de septiembre de 2026** la función exacta también está escrita y medida — 1-2 Común · 3-4-5 Poco común · 6 Raro · 7 Épico · 8 Legendario, [game-design.md §3.1](../game-design.md). No se asigna a mano ni puede contradecir a la potencia. Lo que falta es de dónde sale en las de **clase, item, maldición y encuentro**, que no tienen tier del que derivarla. Cómo se *dibuja* es otra cosa y está en el marco, que sigue en experimentación.

  **Y las cuatro no son el mismo caso**, que es lo que se vio al medirlo el 5 de septiembre:

  - **La maldición ya tiene su eje, pero está en standby.** La Severidad no se parece al Nivel 1-5: **es** el Nivel, «el mismo eje con estrellas que el resto de cartas, leído al revés» ([v2/cards/curses.md](../../v2/cards/curses.md) §1), y sigue viva en el código (`lib/severity.ts`, `$severity`). O sea que se deriva sola y era la única de las cuatro que se podía cerrar hoy — quedaba solo elegir la paleta del raíl, la de Rareza o la de Severidad. **Se paró ahí el 5 de septiembre de 2026 por decisión de Dario: no está decidido que este tipo de carta siga existiendo**, y eso está por encima. La pregunta queda congelada, no descartada, en [curses.md](curses.md), con lo que arrastra la decisión medido al lado.
  - **Clase, item y encuentro no tienen ninguno, y sus catálogos están vacíos** (esqueletos de 24, 16 y 15 líneas con «nada decidido todavía»). No hay nada que medir, así que esto **no está bloqueado por una decisión: está bloqueado por su catálogo**.
  - **v2 sí tenía respuesta y V3 la retiró.** Allí la Rareza **era** el Nivel de carta, y lo subías pagando a un NPC (`v2/game-design.md` §3.3 y §6d, «Reforjar»). V3 cerró el 24-ago que la Rareza no es un segundo eje, así que esa vía se fue con la progresión y nadie puso nada en su sitio. Y hay un precedente que conviene tener presente: en v2 **las cartas de clase no llevaban Rareza** —tabla de mejora propia, sin insignia de estrella—, salida que hoy está cerrada por lo de abajo.

  Lo que **sí** quedó cerrado *(3 de septiembre de 2026, [status.md](../status.md))* es que la respuesta tiene que ser una Rareza y no un rodeo: el raíl de color de una carta dice **la Rareza y nada más** —el rojo del héroe es la única excepción, y lo es porque sustituye a un escalón que no existe, no porque nombre un tipo—. O sea que **estos cuatro tipos no pueden esquivar la pregunta pintándose por tipo**. Se descartó que el raíl dijera además de qué tipo de carta se trata, porque el tipo ya se dice tres veces sin gastar color (el nombre, el mazo del que sale y la anatomía misma de la carta) y la Rareza no tiene ningún otro sitio donde decirse.
- **Cómo se obtienen** las cartas de cada tipo.
