<!-- estado: escrito -->

# La ficha — V3

> El átomo del juego. **Una ficha es cualquier cosa que pisa el tablero de batalla con Habilidades y Características**: un héroe, una unidad o un enemigo. Son 132, y las tres se rellenan igual.

Qué valen esos campos es catálogo y vive en otro sitio: los héroes en [Héroes](../characters/heroes.md), las unidades en [Unidades](../razas/unidades.md).

## Los campos *(cerrados; faltan los valores)*

| Campo | Obligatorio | De dónde sale |
|---|---|---|
| Las **8 Habilidades**, con su número | Sí, las ocho | [Habilidades](habilidades.md) |
| El **tipo de daño** | Sí, uno y solo uno | [Tipo de daño](dano.md) |
| Sus **Características** | Sí, al menos una | [Características](caracteristicas.md); cuántas caben, abajo |
| El **tier** | **Solo las unidades** | [Unidades](../razas/unidades.md) — 8 por raza |

**Y nada más.** No hay campo de alcance —lo trae puesto el tipo de daño—, ni de rango, ni de nivel: V3 no tiene progresión de personaje ([game-design.md](../game-design.md) §3), y la única curva que existe es el tier.

**El héroe es el que no tiene tier**, y no tiene nada en su lugar. Internamente equivale a un tier fijo —el mismo para los 44— para poder darle ❤️ y ⚔️ con la curva de su raza, pero **eso no se imprime en la carta**.

## 📐 Cuántas Características caben

**El tope no es un número: es un techo por tier.** Y el de un héroe es otro.

| tier | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | héroe |
|---|---|---|---|---|---|---|---|---|---|
| **tope** | 2 | 2 | 3 | 3 | 3 | 4 | 4 | 5 | **3** |

Es **el máximo observado en cada tier**, escrito. Sale de contar las 132: cuántas Características lleva una ficha ya venía funcionando como un **segundo eje de progresión** en paralelo a la curva ×10, con una media que sube monótona del 1,18 del tier 1 al 4,36 del tier 8. Un solo número no lo describe — dejaría que un tier 1 llevase cinco rasgos.

**Los héroes paran en 3** porque ninguno de los 44 llega a cuatro: lo que distingue a un héroe es su clase, y una unidad solo tiene sus rasgos.

- **El marco no es la restricción.** Medido sobre la carta real (300×420), el raíl aguanta **siete** medallones antes de tocar el panel. El tope es una decisión de balance, no un límite de sitio.
- **Holgura cero, y va dicho.** Ratifica las 132 tal y como están —cero fichas cambian—, así que una unidad nueva de tier 5 con cuatro rasgos rompe el tope. Que salte es la conversación, no el fallo.
- **La etiqueta de tipo ocupa plaza como cualquier otra.** 💀 *No-muerto*, 😈 *Demonio*, 🤖 *Constructo* y 🐺 *Bestia* dicen qué eres y no qué haces, pero su texto tiene mecánica —*No-muerto* es inmune al miedo—, y sacarlas del recuento daría un rasgo gratis a cuatro razas. Las razas con etiqueta **gastan una plaza permanente en identidad**: ese es su coste.

**Está comprobado y no prometido**: `capViolations()` en `lib/v3/traits.ts` mide las 132 contra esta tabla. Hoy devuelve vacío.
