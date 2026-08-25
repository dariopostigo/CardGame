# Concepto de iconos — V3

> **Qué es esta carpeta: el diseño de los pictogramas de interfaz** — las 8
> Habilidades (más sus 3 variantes de Tipo de daño), el catálogo de
> Características y los 11 emblemas de raza. Hoy todos son un emoji de
> marcador de posición — [`docs/v3/status.md`](../../../docs/v3/status.md)
> lo deja escrito: *"los emoji siguen siendo marcadores de posición hasta que
> se genere un icono por Característica"*. Esta carpeta define qué hace falta
> generar y con qué reglas. Nada más.

## Por qué no vive en otro sitio

| Se podría confundir con... | Por qué no es eso |
|---|---|
| [`../art-direction/`](../art-direction/README.md) | `style-guide.md` dice cómo se dibuja una **ilustración de personaje** —anatomía, rostro, sombreado, pose—, y un pictograma de 30px no usa nada de eso. Sí se le toma prestado un principio, la jerarquía *silueta → línea* de su §2, porque un icono que no se lee en silueta tampoco se lee a este tamaño. |
| [`../card-concept/`](../card-concept/README.md) | Ese documento decide **dónde vive** cada icono en la carta —la fila de ocho, el raíl de Características, el medallón de raza— y qué tamaño le queda. Esta carpeta decide **qué representa** cada glifo y cómo se dibuja; el marco decide dónde se mete. Los tamaños de referencia que usa `icons.md` (30px, 42px…) están medidos en los bocetos de esa carpeta, no inventados aquí. |
| [`../races-concept/`](../races-concept/README.md) | Qué Habilidades y qué Características existen se decide en `razas.md`, no aquí. Esta carpeta no inventa conceptos nuevos: los recoge del catálogo cerrado y decide su icono. Si el catálogo cambia, este documento se queda desactualizado hasta que se revise. |

## Qué hay

| Archivo | Qué es |
|---|---|
| [`icons.md`](icons.md) | El inventario completo — qué icono hace falta para cada Habilidad, Tipo de daño, Característica y Raza — y las reglas de dibujo: silueta, línea, tratamiento de "papel" para los glifos que comparten dibujo a propósito, y dónde tiene que funcionar cada uno (metal oscuro, vitela clara, 30–42px). |

## Estado

**Sin empezar a generar.** `icons.md` es el encargo, no el resultado: dice qué
falta y con qué reglas, no entrega ningún icono terminado. Bloqueado, además,
por dos decisiones que no son de esta carpeta: el marco de carta final
([`../card-concept/`](../card-concept/README.md), sin cerrar) todavía puede
mover los tamaños exactos, y no hay carpeta reservada en `public/assets/v3/`
para iconos — a diferencia de `public/assets/v3/races/`, que ya existe.
