# CardGame — Cartas (índice)

Carpeta dedicada a **todos los tipos de carta** del juego, uno por documento. El sistema de cartas (ejes, iconos, rareza) se define en [`../game-design.md`](../game-design.md) §3; aquí vive el catálogo y el detalle de cada tipo. Términos transversales en [`../glossary.md`](../glossary.md).

## Los dos ejes de una carta (`../game-design.md` §3)

- **Por origen:** de la **clase** del héroe (innatas) o de **equipo** encontrado jugando (drafting).
- **Por tipo/icono:** Arma, Armadura, Item, Maldición, más las cartas de Efecto/Estado y las del mazo de encuentro.

## Tipos de carta (un md cada uno)

| Documento | Qué contiene | Origen |
|---|---|---|
| [`class.md`](class.md) | Cartas Básicas y Especiales de Clase | Clase |
| [`weapons.md`](weapons.md) | Armas (melee, distancia, soporte) | Equipo |
| [`armor.md`](armor.md) | Armaduras (ligeras, medias, pesadas) | Equipo |
| [`items.md`](items.md) | Items: aventurero, herramientas, mágicos, pociones, pergaminos, cartas de movimiento | Equipo |
| [`curses.md`](curses.md) | Maldiciones (efecto negativo que ocupa hueco de mazo) | Especial |
| [`effects.md`](effects.md) | Efectos/Estados (ventaja, aturdido, envenenado...) | Modificador |
| [`encounter.md`](encounter.md) | Mazo de encuentro (cartas del sistema en combate/exploración) | Sistema |

## Reglas de mazo (resumen, `../game-design.md` §4)

- **Mazo personal** = cartas de clase (innatas) + cartas de equipo (drafteadas). No se baraja ni se roba: juegas cualquier carta que tengas, dentro de la economía de acción (§4b.3).
- **Drafting:** cada turno "oteas" 2 cartas de equipo y eliges 1 para añadirla permanentemente.
- **Máximo del mazo — decidido:** el límite (ej. 10) cuenta **todas** las cartas del mazo personal (clase + equipo), no solo el equipo. Habrá una explicación in-fiction que se desarrollará más adelante; si el límite queda demasiado ajustado según avance el diseño, se podrá **subir** el número disponible (mecanismo por definir, quizá ligado al nivel/progresión).
- **Mazo de encuentro** ([`encounter.md`](encounter.md)) = aparte, gestionado por el sistema, no por el jugador.
- **Rareza** (Común → Legendario) aplica a Arma/Armadura/Item/Maldición, no a las cartas de clase (`../game-design.md` §3.3).
- **Comprar/vender:** las cartas de equipo se compran y venden por **oro** según su Rareza (`../game-design.md` §6b.3). Vender es el desagüe del exceso de mazo cuando llegas al máximo.
