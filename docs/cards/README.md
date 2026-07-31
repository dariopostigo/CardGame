# CardGame — Cartas (índice)

Carpeta dedicada a **todos los tipos de carta** del juego, uno por documento. El sistema de cartas (ejes, iconos, rareza) se define en [`../game-design.md`](../game-design.md) §3; aquí vive el catálogo y el detalle de cada tipo. Términos transversales en [`../glossary.md`](../glossary.md).

## Los dos ejes de una carta (`../game-design.md` §3)

- **Por origen:** de la **clase** del héroe (innatas) o de **equipo** conseguido jugando (botín/tesoro/compra).
- **Por tipo/icono:** Arma, Armadura, Item, Maldición, más las cartas del mazo de encuentro.

## Tipos de carta (un md cada uno)

| Documento | Qué contiene | Origen |
|---|---|---|
| [`class.md`](class.md) | Cartas Básicas y Especiales de Clase | Clase |
| [`weapons.md`](weapons.md) | Armas (melee, distancia, soporte) | Equipo |
| [`armor.md`](armor.md) | Armaduras (ligeras, medias, pesadas) | Equipo |
| [`items.md`](items.md) | Items: aventurero, herramientas, mágicos, pociones, pergaminos, cartas de movimiento | Equipo |
| [`mercenaries.md`](mercenaries.md) | Mercenarios (cartas de Acción reclutadas por prueba o compradas por oro) | Mercenario |
| [`curses.md`](curses.md) | Maldiciones (efecto negativo que ocupa hueco de mazo) | Especial |
| [`encounter.md`](encounter.md) | Mazo de encuentro (cartas del sistema en combate/exploración) | Sistema |

> Los **Estados/Efectos** (ventaja, aturdido, envenenado...) no son un tipo de carta — son la ficha de reglas de los modificadores temporales que estas cartas aplican. Viven en [`../effects.md`](../effects.md), fuera de esta carpeta.

## Ver una tabla en modo cartas

En la wiki, cada tabla de catálogo de estos documentos tiene un conmutador **Tabla / Cartas**: la vista cartas pinta esas mismas filas con el diseño real de carta ([Diseño de cartas](/docs/cards/diseno)), para ver de un vistazo cómo queda todo lo implementado y decidir sobre el juego o sobre el propio diseño. Las dos vistas salen de la **misma fila** de markdown, así que no pueden decir cosas distintas: la tabla sigue siendo la fuente de verdad.

Una tabla entra en el catálogo cuando lleva encima su directiva (si no la lleva, se queda como tabla y ya está — así las tablas que no son catálogo, como la fórmula de CA de [`armor.md`](armor.md) §1 o las progresiones de rareza, no salen como cartas):

```
<!-- cards: arma -->
```

La categoría es obligatoria (`clase`, `arma`, `armadura`, `item`, `maldicion`, `mercenario`, `encuentro`) y admite ajustes para lo que no cabe en una columna:

| Ajuste | Para qué | Ejemplo |
|---|---|---|
| `peso=` | Peso de la armadura cuando está en el encabezado y no en una columna | `<!-- cards: armadura peso=media -->` |
| `fichas=` | Fichas fijas al pie de todas las cartas de la tabla | `<!-- cards: clase fichas="Guerrero,Básica" -->` |
| `rareza=` | Raíl de color cuando la tabla no tiene columna Rareza | `<!-- cards: encuentro rareza=enemigo -->` |
| `icono=` | Icono del badge, si el de la categoría no distingue | `<!-- cards: encuentro icono=⚔️ -->` |

De las columnas se encarga la convención: la **primera** es el nombre; `Rareza`, `Severidad`, `Manos`, `Peso` y `Tipo` alimentan las fichas de la carta; `Efecto`/`Propiedades`/`Notas` son el cuerpo; y **cualquier otra columna acaba como ficha en el pie** con su encabezado como etiqueta — o sea que añadir una columna a una tabla la hace aparecer en la carta sin tocar código. El detalle está en `lib/card-table.ts`.

## Reglas de mazo (resumen, `../game-design.md` §4)

- **Mazo personal** = cartas de clase (innatas) + **items y mercenarios** (conseguidos jugando) + maldiciones. No se roba una "mano": juegas cualquier carta que tengas **en juego**, dentro de la economía de acción (§4b.3).
- **Adquirir:** los items/mercenarios nuevos entran jugando —botín, fichas de Tesoro, recompensas y compra—; el Oteo **no** adquiere cartas (`../game-design.md` §4, §6b).
- **Oteo:** al empezar el turno revelas **2 cartas al azar del Mazo** y eliges **1** (o ninguna) para ponerla **en juego** (la otra vuelve al Mazo); así vas preparando cartas para usarlas cuando quieras.
- **Máximo — dos zonas (decidido):** un **Mazo de hasta 20 cartas** (clase + items + mercenarios; tope duro, swap 1-por-1 al llegar a 20) y una zona **"en juego"** de cartas preparadas —clase, items y mercenarios compiten por esos huecos— con **tope fijo de 5** (`../game-design.md` §4).
- **Arranque:** el Mazo empieza con el **kit inicial** del héroe, unas 8 cartas (4 de clase + 4 items — `../characters/heroes.md` §2d). Con solo las 4 de clase el Oteo se rompía en el turno 4.
- **Armas y armaduras — equipo aparte:** **no** van en el Mazo ni se otean; se **equipan** (hasta 2 manos + 1 armadura) y su colección es **ilimitada**. Se cambian antes del capítulo y en sitios seguros (`../game-design.md` §4a).
- **Mazo de encuentro** ([`encounter.md`](encounter.md)) = aparte, gestionado por el sistema, no por el jugador.
- **Rareza** (Común → Legendario) aplica a Arma/Armadura/Item/Mercenario/Maldición, no a las cartas de clase (`../game-design.md` §3.3).
- **Comprar/vender:** las cartas de equipo se compran y venden por **oro** según su Rareza (`../game-design.md` §6b.3). Vender es el desagüe del exceso de mazo cuando llegas al máximo.
