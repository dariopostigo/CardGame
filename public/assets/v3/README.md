# Arte de V3

**Ya hay arte.** Cinco archivos, todos de la raza piloto: sus **cuatro héroes**
y su **primera unidad**.

| Archivo | Sujeto | Medida | Encuadre |
|---|---|---|---|
| `races/humanos/guerrero.png` | ⚔️ Guerrero (Humanos) | 1060×1484 | ✅ Vertical 5:7 |
| `races/humanos/mago.png` | 🔮 Mago (Humanos) | 1060×1484 | ✅ Vertical 5:7 |
| `races/humanos/sacerdote.png` | ✝️ Sacerdote (Humanos) | 1477×1065 | ⚠️ Apaisado |
| `races/humanos/arquero.png` | 🏹 Arquero (Humanos) | 1484×1060 | ⚠️ Apaisado |
| `races/humanos/units/miliciano.png` | 🗡️ Miliciano (Humanos, tier 1) | 1484×1060 | ⚠️ Apaisado |

Los cinco se pintan en los bocetos de marco de **Cartas › Diseño de cartas**
(`/docs/v3/cards/design`), que es lo único que hay montado que los use.

**Ya no faltan héroes**: el 🏹 Arquero llegó el 25 de agosto de 2026 y con él la
clase de héroe se juzga entera. El Miliciano abre `units/` y con él el caso que
ningún héroe enseñaba: un tier 1, raíl común y cero Características encima de
una ilustración de verdad.

> **Dos cosas siguen sin cuadrar con lo que dice este mismo documento**, y hay
> que cerrarlas antes de que lleguen las 127 restantes y se copie el criterio:
>
> 1. ~~**La ruta.**~~ **Cerrada** el 21 de agosto de 2026: estaban en
>    `human/heroes/` con nombre en inglés y ya están en `races/humanos/` con el
>    slug español que manda §"Nombre de archivo". Se cerró con tres archivos
>    dentro porque con 132 cuesta 44 veces más.
> 2. **El formato sigue abierto.** §"Nombre de archivo" pide `.webp` y estos son
>    `.png` de ~2,5 MB cada uno. A ese peso importa: son la ilustración de una
>    carta, no un fondo de pantalla. **No se convierten** mientras al archivo le
>    quede una vuelta, así que el `.webp` entra con la generación buena y no con
>    una conversión que se tira. Con Guerrero y Mago ya fijos, esos dos son los
>    primeros candidatos a convertirse.
> 3. **Al apaisado le queda otra vuelta, y solo por el encuadre.** Los otros dos
>    motivos por los que había que regenerar están **resueltos**: el reparto de
>    cuerpos (el Sacerdote nuevo ya es un hombre mayor y grueso, no un joven
>    esbelto) y la jerarquía de fondo. Lo que no se ha corregido es la
>    proporción: **1484×1060 es el lienzo bueno girado**, no un lienzo distinto,
>    y en un marco vertical obliga a tirar media anchura. Las normas están
>    escritas en §"Lienzo y formato" y §"Encuadre" aquí, el reparto en
>    [`sujetos.md`](../../../knowledge/v3/races-concept/sujetos.md#identidad-de-raza)
>    y el fondo en
>    [`style-guide.md`](../../../knowledge/v3/art-direction/style-guide.md#16-fondos)
>    §16.
>
> **No se recortan a mano.** Recortar un apaisado a 5:7 tira justo el aire
> lateral que pide §"Encuadre", y dejarlos como están tiene un uso: en el lab,
> pasar del Guerrero vertical al Sacerdote apaisado enseña la diferencia de un
> vistazo. Mientras tanto los apaisados sirven para juzgar el marco, no el arte.

Qué generar y con qué especificación (sujetos, encuadre, plantilla de prompt):
[`../../../knowledge/v3/art-direction/illustrations.md`](../../../knowledge/v3/art-direction/illustrations.md),
y la biblia visual que gobierna todo el arte del juego,
[`../../../knowledge/v3/art-direction/style-guide.md`](../../../knowledge/v3/art-direction/style-guide.md).

## Qué va aquí

Lo que se sirva al jugador en la URL `/assets/v3/…`: ilustraciones de carta,
retratos, sprites, modelos propios. **No** los moodboards ni las referencias
—eso vive en [`../../concepts/`](../../concepts/)— ni los modelos prestados de
prueba, que se quedan con la versión anterior en
[`../v2/models/`](../v2/models/README.md) hasta que haya propios.

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
| Tamaño | **1080 × 1512 px** | Sin decidir |
| Ratio | **5:7 (0,714), vertical** | Sin decidir |
| Sangrado | A sangre | A sangre |
| Transparencia | Ninguna | Ninguna |
| Extensión | `.webp` | `.webp` |

**Vertical, no apaisado.** El 5:7 es el de la carta ya construida
—`$sketch-width: 300px` × `$sketch-height: 420px` en
[`styles/settings/_card.scss`](../../../styles/settings/_card.scss)— y los cinco
bocetos de `/docs/v3/cards/design` lo comparten: gane el que gane, el arte se
pinta **a sangre en 300×420**. El 1536×1050 apaisado que decía antes esta tabla
venía de v2 y **queda retirado**: obligaba a tirar la mitad de la anchura para
que la imagen entrara en un marco vertical, y ese recorte era exactamente lo que
hacía salir al personaje enorme y descentrado.

Si la herramienta no ofrece 5:7, coge el ratio vertical más alto que tenga (2:3)
y deja el aire de sobra arriba y abajo: recortar hasta 5:7 es barato, inventar el
borde que faltaba no.

### Encuadre: plano general, con aire, y figura centrada

Esto no es estética, es lo que decide si la carta se lee. Los tres primeros
héroes se generaron sin esta tabla y salieron en **plano medio**, cortados por el
muslo y con la figura fuera del eje.

| | Norma |
|---|---|
| Plano | **General**, cámara alejada. La figura completa **y entorno alrededor**. No «plano entero», que es el plano en que el cuerpo llena el cuadro. Nunca busto, plano medio ni primer plano |
| Aire arriba | **Otra cabeza entera** por encima de la coronilla, como mínimo |
| Aire abajo | **Suelo visible** por delante y por detrás de los pies antes del borde. Los pies no se apoyan en el filo |
| Aire lateral | El hueco de **un brazo** a cada lado |
| Eje horizontal | El cuerpo **centrado**: su eje a ±5% del centro del lienzo |
| Alto de la figura | **~60%** del alto del lienzo, entre el **12%** y el **72%** de la altura |
| Cámara | A la altura del pecho, lente neutra. Sin contrapicado ni gran angular: agrandan al sujeto y le comen los pies |

> **Las cuatro filas de aire van en el prompt; la del alto de la figura, no.** Un
> modelo de imagen no mide porcentajes —el «60–70%» estuvo escrito y devolvió un
> 90%—, así que el aire se pide con **anclas visuales** (una cabeza, un brazo, un
> trozo de suelo) y el número se guarda para **comprobar** el resultado.

**El cuarto inferior no es tuyo.** Del 75% hacia abajo va la banda opaca del
nombre, que se pinta encima. Ahí solo puede haber suelo: ni pies, ni punta de
arma, ni nada que se quiera ver. Y arriba y a los lados manda lo mismo por otro
motivo — **el marco tapa los bordes**, así que nada importante (rostro, manos,
arma, escudo, el elemento distintivo) pegado al filo, y menos en las esquinas.

**Los sujetos anchos o enormes se resuelven alejando la cámara, no recortando.**
La Caballería ocupa más ancho que alto y el Dragón dorado tiene que aplastar en
escala; en los dos, la silueta completa entra en la banda aunque quede más
pequeña. Una silueta pequeña y entera se lee; media silueta grande, no.

> **La medida del retrato sigue sin decidir**, y por el mismo motivo que antes:
> no existe pantalla de selección de héroe ni ficha de unidad. Mientras tanto usa
> este mismo ratio y este mismo encuadre por consistencia, y deja margen de
> sobra.

> **Antes de generar nada**, mira si el documento de `docs/v3/` que le
> corresponde ya tiene su tabla. Sin tabla no hay a qué pegar el arte.
>
> Hoy eso deja **`races/` abierto** —[`docs/v3/razas.md`](../../../docs/v3/razas.md)
> tiene cerradas las razas, sus clases y sus unidades— y **`cards/` cerrado**:
> los documentos de `docs/v3/cards/` siguen siendo esqueletos.
