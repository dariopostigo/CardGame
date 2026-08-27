# Concepto de iconos — V3

> **Qué es esta carpeta: el diseño de los pictogramas de interfaz** — las 8
> Habilidades (más sus 3 variantes de Tipo de daño), el catálogo de
> Características y los 11 emblemas de raza. Hoy todos son un emoji de
> marcador de posición — [`docs/v3/status.md`](../../../docs/v3/status.md)
> lo deja escrito: *"los emoji siguen siendo marcadores de posición hasta que
> se genere un icono por Característica"*. Esta carpeta define qué hace falta
> generar y con qué reglas, y desde el **26 de agosto de 2026** también con qué
> dibujo: la dirección está elegida (`icons.md` §5) y las ocho Habilidades ya
> están entregadas — los emoji siguen de pie en todo lo demás. Nada más.

## Por qué no vive en otro sitio

| Se podría confundir con... | Por qué no es eso |
|---|---|
| [`../art-direction/`](../art-direction/README.md) | `style-guide.md` dice cómo se dibuja una **ilustración de personaje** —anatomía, rostro, sombreado, pose—, y un pictograma de 30px no usa nada de eso. Sí se le toma prestado un principio, la jerarquía *silueta → línea* de su §2, porque un icono que no se lee en silueta tampoco se lee a este tamaño. |
| [`../card-concept/`](../card-concept/README.md) | Ese documento decide **dónde vive** cada icono en la carta —la fila de ocho, el raíl de Características, el medallón de raza— y qué tamaño le queda. Esta carpeta decide **qué representa** cada glifo y cómo se dibuja; el marco decide dónde se mete. Los tamaños de referencia que usa `icons.md` (30px, 42px…) están medidos en los bocetos de esa carpeta, no inventados aquí. |
| [`../races-concept/`](../races-concept/README.md) | Qué Habilidades y qué Características existen se decide en `razas.md`, no aquí. Esta carpeta no inventa conceptos nuevos: los recoge del catálogo cerrado y decide su icono. Si el catálogo cambia, este documento se queda desactualizado hasta que se revise. |

## Qué hay

| Archivo | Qué es |
|---|---|
| [`icons.md`](icons.md) | El inventario completo — qué icono hace falta para cada Habilidad, Tipo de daño, Característica y Raza —, **la dirección de dibujo elegida** (§5) y las reglas que la rodean: silueta, tratamiento de "papel" para los glifos que comparten dibujo a propósito, y dónde tiene que funcionar cada uno (metal oscuro, vitela clara, 30–42px). |
| [`imgs/`](imgs/) | Las dos láminas de la comparación, cada una con sus glifos montados sobre los dos fondos: `chosen-direction.png` (la elegida) y `option-3-ornate-ring.png` (el aro ornamentado, guardado sin implementar). |

> **Por qué las láminas viven aquí y no en `public/assets/v3/`.** Entraron ahí
> por error y salieron el mismo día: `public/assets/v3/` es **lo que se sirve
> al jugador** en `/assets/v3/…`, y una lámina de comparación no se sirve
> nunca. Va junto a su análisis, que es la misma excepción que ya se aplica a
> los conceptos de marco en [`../card-concept/imgs/`](../card-concept/imgs/) y
> que [`public/concepts/README.md`](../../../public/concepts/README.md) deja
> escrita.

## Estado

**Dirección elegida y las 8 Habilidades entregadas.** El 26 de agosto de 2026 se
cerró el **cómo se dibujan** —relieve de metal dorado, monocromo, con la
Característica dentro de un medallón y la Habilidad desnuda: `icons.md` §5—, que
era la pregunta que bloqueaba todo lo demás, y esa misma noche entraron los
**diez primeros archivos** en `public/assets/v3/icons/`: las ocho Habilidades
completas y dos de los tres Tipos de daño. **Ni una Característica ni un emblema
de raza**, que es donde está el grueso.

Lo abierto está contado en `icons.md` §7. Tres cosas merecen salir aquí porque
no se resuelven en esta carpeta:

- **Quién dibuja el aro del medallón.** La carta ya pinta el suyo y el icono
  elegido trae otro; no caben los dos. Se decide en
  [`../card-concept/`](../card-concept/README.md), que sigue sin cerrar, y
  **bloquea la entrega de cualquier Característica** — la mayor parte del
  encargo.
- **La extensión y el peso.** Los diez entraron como `.png` de 1254×1254 y pesan
  **12 MB** para dibujos que se pintan a 30px. La norma se decide en
  [`public/assets/v3/README.md`](../../../public/assets/v3/README.md), y su
  `.webp` de la tabla de lienzo no sirve tal cual: es la norma de una ilustración
  a sangre y sin transparencia.
- **La normalización de encuadre.** Ninguno está recortado, pero la caja del
  glifo baila entre el 84 % y el 97 % del lienzo y no va centrada. Es mecánica y
  conviene resolverla antes de las 41 Características, no después.
