# Ilustraciones de carta (final, no moodboard)

Aquí van las imágenes ya generadas para sustituir el emoji de cada carta (`../../../lib/card-art.ts`), una a una según se vayan haciendo. Distinto de las carpetas hermanas (`../UI`, `../cardsExamples`, `../affinityDesign`...), que son solo referencias de moodboard citadas en comentarios — nada de esto se sirve todavía en producción.

Qué generar y con qué especificación (lienzo, formato, tono, brief por carta): [`../../../art-direction/cards.md`](../../../art-direction/cards.md).

## Carpetas

Una por categoría, mismo nombre que su documento en `docs/cards/`:

| Carpeta | Corresponde a |
|---|---|
| `class/<heroe>/` | [`class.md`](../../../docs/cards/class.md) — subcarpeta por héroe: `guerrero`, `mago`, `picaro`, `clerigo` |
| `weapons/` | [`weapons.md`](../../../docs/cards/weapons.md) |
| `armor/` | [`armor.md`](../../../docs/cards/armor.md) |
| `items/` | [`items.md`](../../../docs/cards/items.md) |
| `curses/` | [`curses.md`](../../../docs/cards/curses.md) |
| `mercenaries/` | [`mercenaries.md`](../../../docs/cards/mercenaries.md) |
| `encounter/combat/`, `encounter/event/` | [`encounter.md`](../../../docs/cards/encounter.md) — las dos pilas del mazo (§3 Combate, §4 Suceso) |

Todas las demás carpetas quedan planas (sin subcarpeta por familia/rareza): el propio `art-briefs.md` ya agrupa por familia como índice, la carpeta es solo almacenaje.

## Nombre de archivo

Slug del nombre **español** de la carta (tal cual sale en la tabla del `.md`), en minúsculas y sin acentos — mismo criterio que la función `key()` de `lib/card-art.ts`, con un paso extra para que sea válido como nombre de archivo:

1. Quita acentos y pasa a minúsculas.
2. Quita cualquier paréntesis final: `"Linterna (sorda o de aceite)"` → `linterna`.
3. Quita `¡ ! ¿ ?`.
4. Cualquier tramo de caracteres que no sea letra/número (espacios, `/`, comas...) se convierte en un único `-`.
5. Sin guion al principio o al final.

Ejemplos:

| Nombre de la carta | Archivo |
|---|---|
| Espada | `espada.webp` |
| Espada de acero enano | `espada-de-acero-enano.webp` |
| Filo del juramento | `filo-del-juramento.webp` |
| Saco / bolsa | `saco-bolsa.webp` |
| Linterna (sorda o de aceite) | `linterna.webp` |
| ¡Emboscada! | `emboscada.webp` |
| Golpe firme | `golpe-firme.webp` (en `class/guerrero/`) |

## Formato

Extensión `.webp` (igual que el resto de `public/assets/`). Si la IA solo entrega `.png`, vale igual mientras se decide el pipeline de conversión — no hace falta bloquear por esto para ir guardando.
