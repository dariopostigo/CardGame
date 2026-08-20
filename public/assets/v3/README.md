# Arte de V3

Vacío a propósito, igual que `lib/v3/`: el diseño de V3 todavía no ha llegado
al arte. Esta carpeta existe para que lo primero que se genere tenga sitio sin
tener que decidir nada.

Qué generar y con qué especificación (sujetos, encuadre, plantilla de prompt):
[`../../../knowledge/v3/art-direction/illustrations.md`](../../../knowledge/v3/art-direction/illustrations.md),
y la biblia visual que gobierna todo el arte del juego,
[`../../../knowledge/v3/art-direction/style-guide.md`](../../../knowledge/v3/art-direction/style-guide.md).

## Qué va aquí

Lo que se sirva al jugador en la URL `/assets/v3/…`: ilustraciones de carta,
retratos, sprites, modelos propios. **No** los moodboards ni las referencias
—eso vive en [`../../concepts/`](../../concepts/)— ni los modelos prestados de
prueba, que están en [`../models/`](../models/) hasta que haya propios.

## La estructura, cuando toque

Espejo de `docs/v3/`, misma norma que siguió v2: una carpeta por documento del
catálogo, con el mismo nombre.

| Carpeta | Corresponde a |
|---|---|
| `cards/class/<clase>/` | [`docs/v3/cards/class.md`](../../../docs/v3/cards/class.md) |
| `cards/units/` | [`docs/v3/cards/units.md`](../../../docs/v3/cards/units.md) |
| `cards/items/` | [`docs/v3/cards/items.md`](../../../docs/v3/cards/items.md) |
| `cards/curses/` | [`docs/v3/cards/curses.md`](../../../docs/v3/cards/curses.md) |
| `cards/encounter/` | [`docs/v3/cards/encounter.md`](../../../docs/v3/cards/encounter.md) |
| `races/<raza>/` | [`docs/v3/razas.md`](../../../docs/v3/razas.md) — los 4 héroes de clase de esa raza |
| `races/<raza>/units/` | [`docs/v3/razas.md`](../../../docs/v3/razas.md) — sus 8 unidades de progresión |

No crees ninguna hasta que su documento tenga contenido: una carpeta vacía
promete un catálogo que aún no existe.

## Nombre de archivo

El mismo criterio de v2 (slug del nombre español, sin acentos ni paréntesis;
la norma completa, con ejemplos, en
[`../v2/cards/README.md`](../v2/cards/README.md#nombre-de-archivo)) —
salvo que V3 decida otra cosa. Extensión `.webp`.

## Lienzo y formato

**Esta sección es la fuente única.** La dirección de arte
([`knowledge/v3/art-direction/`](../../../knowledge/v3/art-direction/README.md))
dice cómo se dibuja y qué se dibuja; la medida del archivo que acaba aquí se
decide aquí, porque depende del componente que lo va a pintar y no del estilo.

| | Ilustración de carta | Retrato de héroe o unidad |
|---|---|---|
| Tamaño | **1536 × 1050 px** *(heredado, ver aviso)* | Sin decidir |
| Ratio | ~1,46:1, apaisado | Sin decidir |
| Sangrado | A sangre | A sangre |
| Transparencia | Ninguna | Ninguna |
| Aire de seguridad | **≥10% en los cuatro bordes** | El que pida su pantalla |
| Extensión | `.webp` | `.webp` |

El aire no es estética: **la ilustración va debajo de un marco que tapa los
bordes**. Nada importante —rostro, manos, arma, escudo, el elemento distintivo—
puede quedar pegado al filo, y menos en las esquinas.

> **Las dos medidas están pendientes de lo mismo: una pantalla construida.** El
> 1536×1050 viene de v2; V3 no ha decidido su marco de carta, así que es medida
> heredada, no tomada del componente que la va a pintar — y el análisis de
> [`knowledge/v3/card-concept/`](../../../knowledge/v3/card-concept/README.md)
> apunta a que el marco de V3 será **vertical y a sangre**, lo que la invalida.
> Del retrato no hay medida en absoluto: no existe pantalla de selección de
> héroe ni ficha de unidad. Mientras tanto, usa el mismo ratio por consistencia
> y **deja margen de sobra**: recortar es barato, inventar el borde que faltaba
> no.

> **Antes de generar nada**, mira si el documento de `docs/v3/` que le
> corresponde ya tiene su tabla. Sin tabla no hay a qué pegar el arte.
>
> Hoy eso deja **`races/` abierto** —[`docs/v3/razas.md`](../../../docs/v3/razas.md)
> tiene cerradas las razas, sus clases y sus unidades— y **`cards/` cerrado**:
> los documentos de `docs/v3/cards/` siguen siendo esqueletos.
