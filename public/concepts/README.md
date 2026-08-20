# `public/concepts/` — referencias visuales

Moodboards: capturas de otros juegos, láminas de UI, ejemplos de cartas, mapas.
Se citan en comentarios de código y de estilos para dejar por escrito **de
dónde salió una decisión visual** (la paleta `$game`, el botón con remache, la
mesa del tablero…).

**Nada de esto se sirve al jugador ni se usa en producción**, y por eso no
lleva versión: una referencia no es de v2 ni de V3, es de donde se copió la
idea. El arte que sí se sirve vive en [`../assets/`](../assets/README.md),
partido en `v2/` y `v3/`.

| Carpeta | Qué es |
|---|---|
| `UI/` | Láminas de interfaz medieval. `example1.jpg` es la elegida: de ahí salen la paleta `$game`, la tipografía de rótulo y el botón con remache |
| `cardsExamples/`, `affinityDesign/` | Anatomía de carta de otros juegos y pruebas vectoriales |

> **Excepción a la norma:** los conceptos de marco de carta que se están
> valorando para V3 **no** viven aquí, sino junto a su análisis en
> [`knowledge/v3/card-concept/`](../../knowledge/v3/card-concept/README.md), para poder
> hojearlos con el texto delante. Esa carpeta es base de conocimiento; esta es
> referencia que se cita desde el código.
| `viajesTierraMedia/` | *Viajes por la Tierra Media*: referencia del mapa y de la mesa (`map1.webp`) |
| `oldenEra/`, `mightandmagic/` | Heroes of Might & Magic — de aquí salen las razas de V3 |
| `boardsExamples/`, `map/`, `magic/`, `items/` | Tableros, mapas, efectos e iconografía de objeto |

Al citar una de estas imágenes en un comentario, escribe la ruta completa
(`public/concepts/UI/example1.jpg`): es lo que hace que la referencia se pueda
encontrar años después.
