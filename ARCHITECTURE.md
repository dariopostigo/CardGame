# CardGame — Arquitectura

> Arquitectura **concreta** de este proyecto. Sin placeholders: aquí el stack está decidido y las capas que no existen (transporte, roles, i18n) no se documentan.
> Deriva de una plantilla genérica de arquitectura React/Next, recortada a lo que aplica y **ampliada** con lo que un juego por turnos necesita y un panel de administración no: motor de reglas puro, determinismo y simulación de balance.
>
> Documentos hermanos: [`AGENTS.md`](AGENTS.md) (estilos + aviso de Next), [`docs/v3/status.md`](docs/v3/status.md) (estado del diseño y punto de continuación), [`docs/v3/`](docs/v3/) (diseño del juego, que es la **fuente de verdad del contenido**), [`docs/v2/board/board-map-dev.md`](docs/v2/board/board-map-dev.md) (modelo de datos y algoritmos de la versión anterior).

---

## El corte v2 / v3 *(20 de agosto de 2026)*

El proyecto está partido en dos versiones, y **este documento describe casi todo lo de la versión anterior**, que es la única con código.

| | Diseño | Código | Estado |
|---|---|---|---|
| **v3** | [`docs/v3/`](docs/v3/) | `lib/v3/` (vacío) | Diseño **vigente**: razas, 8 Habilidades, Características, combate sin dados. Nada implementado |
| **v2** | [`docs/v2/`](docs/v2/) | `lib/v2/rules/` | **Congelado**. Raíz D&D: 6 estadísticas, d20, CA, armas y armaduras. Es lo que ejecutan hoy `/lab` y `/play` |

Reglas del corte:

- **`lib/v2/rules/` no se amplía.** Se mantiene funcionando porque los laboratorios se apoyan en él, pero el diseño que implementa ya no es el vigente.
- **`lib/v3/` está vacío a propósito.** El motor de V3 no se escribe hasta que [`docs/v3/game-design.md`](docs/v3/game-design.md) §4 lo defina.
- **La infraestructura no se ha repartido todavía.** Unas 1.900 de las 4.239 líneas de `lib/v2/rules/` (`hex.ts`, `tiles.ts`, `board-gen.ts`, `rng.ts`) no tienen nada de D&D dentro y son candidatas a compartirse. Decidir si se extraen, se copian o se reescriben **cuando V3 necesite geometría de verdad**, no antes.
- **Rutas y componentes siguen sin partir.** `app/` y `components/` viven sobre v2. Se migran ruta a ruta cuando haya motor V3 que renderizar.
- **El arte sí está partido**, igual que el diseño: [`public/assets/v2/`](public/assets/v2/cards/README.md) (congelado) y [`public/assets/v3/`](public/assets/v3/README.md) (vacío, para lo nuevo). Se sirven en `/assets/v2/…` y `/assets/v3/…`; el corte está dentro de `assets/` y no en la raíz de `public/` para que una carpeta de arte no se confunda con una ruta de la app. Quedan **fuera** del corte `public/assets/models/` (modelos prestados de laboratorio) y [`public/concepts/`](public/concepts/README.md) (moodboards): ninguno de los dos se sirve al jugador, así que no son de ninguna versión. Si algo de `v2/` sirve para V3 **se copia**, no se enlaza: `v2/` debe poder vaciarse sin romper nada de V3.
- **La dirección de arte vigente es [`knowledge/v3/art-direction/`](knowledge/v3/art-direction/README.md)**, y su alcance es estrecho a propósito: **el concepto de arte de todas las ilustraciones del juego, y nada más**. Son dos documentos con papeles distintos: [`style-guide.md`](knowledge/v3/art-direction/style-guide.md) es la *biblia visual* —**cómo** se dibuja: línea, anatomía, color, materiales, luz— y gobierna todo el arte del juego; [`illustrations.md`](knowledge/v3/art-direction/illustrations.md) es **qué** se dibuja —razas, héroes de clase, unidades, criaturas y cartas, con sus encuadres y su plantilla de prompt— y es donde se escribirán los bloques sujeto a sujeto. La dependencia va en un solo sentido: el segundo se apoya en el primero y no repite nada suyo. Hay **una sola biblia**, no una por versión, porque el estilo no cambió al cambiar el motor de reglas: V3 se dibuja igual que v2, lo que cambia es a quién. Por eso los *prompts* congelados de v2 (`knowledge/v2/art-direction/`, más su lámina) apuntan hacia adelante: son catálogo muerto —sus categorías Arma, Armadura y Mercenario ni existen en V3, y **no se traducen**— con un estilo vivo.
- **Tres cosas suenan a dirección de arte y viven fuera de ella**, cada una donde manda su dependencia real. Las **medidas del archivo** (tamaño, ratio, sangrado, transparencia, aire, extensión) están en [`public/assets/v3/README.md`](public/assets/v3/README.md#lienzo-y-formato) junto a las rutas y el nombre, porque dependen del componente que pinta la imagen y no del estilo — y siguen siendo el lienzo heredado de v2, que probablemente sea el equivocado. El **diseño de la carta** como objeto (marco, tipografía, disposición del nombre y los números, tratamiento de la Rareza) es un tercer papel que **está empezando** en [`knowledge/v3/card-concept/`](knowledge/v3/card-concept/README.md), por ahora una base de datos de conceptos de referencia —qué se roba de cada uno y qué se descarta— con **las imágenes al lado del texto**, por una vez, para hojearlas mientras se lee el análisis; sus tres candidatos son verticales y con el arte a sangre, de ahí la duda sobre el lienzo. Y el **concepto de calibración** —la imagen contra la que se juzga si una generación acierta el estilo— **no existe**: la §14 de la biblia está vacía a propósito, y la ocupará el primer héroe de Humanos que se apruebe. Vivirá con su raza, no en la biblia, porque es un *sujeto*.
- **`CARDS_ROOT`** ([`lib/card-catalog.ts`](lib/card-catalog.ts)) apunta a `docs/v2/cards` para que el laboratorio de diseño de cartas no se quede vacío. Se mueve a v3 —junto con `DESIGN_LAB_VERSION` en [`lib/docs.ts`](lib/docs.ts)— el día que `docs/v3/cards/` tenga su primera tabla.

Todo lo que sigue, salvo mención expresa, describe **v2**.

---

## 0. El stack (decidido)

| Pieza | Decisión | Nota |
|---|---|---|
| Framework | **Next.js 16.2.11, App Router** | Breaking changes respecto a versiones anteriores: **leer `node_modules/next/dist/docs/` antes de programar** ([`AGENTS.md`](AGENTS.md)) |
| React | **19.2.4** | Server Components por defecto; `"use client"` es una excepción explícita |
| Lenguaje | **TypeScript `strict`** | [`tsconfig.json`](tsconfig.json). Sin `any` sin justificación escrita |
| UI kit | **PrimeReact 10** (tema Lara ámbar) | Versión totalmente gratuita: sin comprobación de licencia ni componentes PRO. Los componentes llegan **vestidos** y con las clases `p-*`; el tema es CSS, se carga en [`styles/vendor/_primereact.scss`](styles/vendor/_primereact.scss) (claro y oscuro) y [`app/providers.tsx`](app/providers.tsx) solo lleva opciones globales. Los campos son suyos; el **botón es nuestro** (`components/ui/Button.tsx`), porque el de Lara trae su paleta escrita a pelo en vez de los tokens del skin |
| Estilos | **Tailwind 4 + SCSS/ITCSS** | Reglas completas en [`AGENTS.md`](AGENTS.md). **No se repiten aquí** |
| Formularios | `react-hook-form` | Solo donde haga falta (lab de diseño) |
| Contenido | **Markdown en [`docs/v2/`](docs/v2/)** parseado en build | No hay CMS ni base de datos |
| Datos remotos | **Ninguno** | Sin API, sin backend, sin transporte |
| Auth / roles | **Ninguno** | Juego local de un jugador |
| i18n | **Ninguno** | Español, en el código y en la UI |
| Alias | `@/*` → **raíz del repo** | No hay `src/`: `app/`, `components/`, `lib/`, `styles/`, `docs/v2/` cuelgan de la raíz |

Consecuencia directa: **las capas de transporte, servicios thin, `ApiResponse<T>`, control de acceso e i18n no existen en este proyecto.** Si algún día entra un backend (multijugador, ranking), se añaden entonces y se documentan entonces.

---

## 0-bis. Vocabulario

Seis cosas distintas que es fácil llamar "mapa" a todas. **En el código, en la UI y en los documentos se llaman siempre así:**

| Concepto | Qué es | En el código | Dónde se trabaja |
|---|---|---|---|
| **hexágono** | Una casilla: terreno, ficha, niebla | `Hex` ([`lib/v2/rules/state.ts`](lib/v2/rules/state.ts)) | — |
| **loseta** / **variante** | Pieza predefinida de hexágonos con su forma, el terreno de cada uno y sus anclas. Se **maqueta a mano** | `TileDef`, `PlacedTile` ([`lib/v2/rules/tiles.ts`](lib/v2/rules/tiles.ts)) | `/lab/tiles` |
| **tipo de loseta** | Un **sitio** del mundo (un peñasco, una ciénaga, una posada), definido por **un terreno**, con su peso en la bolsa y sus variantes dentro | `TileType` ([`lib/v2/rules/tiles.ts`](lib/v2/rules/tiles.ts)) | `/lab/tiles` |
| **biblioteca** | Todos los tipos que existen. **Vive en datos**, no en código | [`data/tile-library.json`](data/tile-library.json) → `TILE_TYPES` ([`lib/v2/rules/tile-library.ts`](lib/v2/rules/tile-library.ts)) | `/lab/tiles` |
| **ancla** | Borde exterior por el que una loseta se une a otra. Solo en el contorno; el resto del borde es pared | `TileDef.anchors` ([`lib/v2/rules/tiles.ts`](lib/v2/rules/tiles.ts)) | `/lab/tiles`, modo Anclas |
| **tablero** | El mapa completo de **una** partida rápida o capítulo, resultado de unir losetas por sus anclas. Se **genera** con una semilla | `Board` ([`lib/v2/rules/board-gen.ts`](lib/v2/rules/board-gen.ts)) | `/lab/board` |

Por qué separarlos: son dos problemas de diseño que se afinan con criterios distintos. Cambiar la forma de una loseta afecta a cómo se ve el terreno de cerca; cambiar cuántas se colocan afecta a la duración de la partida. Mezclarlos en un solo laboratorio —como estaba al principio— hace que no se sepa qué se está tocando. La palabra **"mapa"** queda solo para el documento de diseño ([`docs/v2/board/board-map.md`](docs/v2/board/board-map.md)) y para el sentido coloquial.

**Tipo y variante.** Lo que se sortea al construir el tablero es el TIPO —el sitio—, y la variante es solo el dibujo que le toca: dos peñascos distintos son el mismo sitio dibujado de otra manera. Por eso el peso es del tipo y se reparte entre sus variantes (`TileDef.weight` es una fracción, no un número a mano): añadir un peñasco más no hace que salgan más peñascos, hace que se repitan menos. A cada tipo lo define **un** terreno, que es su identidad y no una restricción: las excepciones son legítimas cuando el sitio las pide —el Camino que cruza el paso de montaña, el Pantano al que baja el vado— y `typeNotes` avisa de las que parecen un descuido, sin bloquear.

**Los tres grados de libertad de una loseta**, y solo tres: su **forma** (dentro del tope de su tamaño), el **terreno** de cada hexágono y sus **anclas**. El terreno es **obligatorio en todos**: no existe "este lo sortea el tablero", así que una loseta llega pintada entera y lo que se ve al maquetarla es lo que sale en la partida. Consecuencia directa: **el reparto de terreno del tablero lo decide la biblioteca y nada más**, y la tabla A (§2c) pasa de ser un sorteo a ser el objetivo al que apunta el maquetado —`/lab/tiles` enseña el medido junto a la cuota—. La variedad entre partidas la dan las variantes y el giro.

Y al revés: **la generación no repinta NADA.** `board-gen.ts` no sortea terreno y tampoco lo corrige: cada hexágono del tablero es el que dibujó su loseta, sin excepciones. Tenía dos permisos para corregirse y se le han quitado los dos, porque un tablero que se corrige a sí mismo esconde el problema en vez de enseñarlo: ya no abre la Montaña que encierra una bolsa (la **cuenta** en `GeneratedBoard.stranded`, que `/lab/board` enseña como «Incomunicado») y ya no mueve la entrada que cae en roca (`pickEntrance` elige por terreno y no le hace falta). Los dos eran síntomas de otra cosa —un maquetado que parte su propio terreno— y se arreglan donde se decide: en la loseta. `typeNotes` avisa al maquetar. *(El Pueblo ya no forma parte de esta lista: volvió a ser ficha, §4 de `board-map.md`, así que "fundar un Pueblo" dejó de ser una operación que pudiera existir.)*

**Los cinco tamaños** (`TILE_SIZES`) doblan capacidad en cada nivel: Mínima 4, Pequeña 8, Mediana 16, Grande 32, Enorme 64 hexágonos. El tamaño no se guarda en la loseta, se deriva de cuántos hexágonos tiene (`sizeOf`), para que no puedan discrepar. Es de la **variante**, no del tipo: un mismo tipo puede tener un peñasco Mínimo y otro Pequeño. La biblioteca de hoy son **17 tipos y 39 variantes** —los 5 tipos de Pueblo se retiraron al volver a ser ficha— que cubren **los cinco tamaños** (7 Mínimas, 13 Pequeñas, 13 Medianas, 5 Grandes y 1 Enorme, el Robledal viejo de 37 hexágonos), con una media de ~8,7 hexágonos por pieza (por peso de bolsa) y **todos los tipos con dos variantes o más**, que es lo que evita que un sitio salga siempre igual dibujado. Cada familia de terreno de ambiente llega a pieza grande: Llanura el Páramo, Montaña el Paso, Bosque el Robledal viejo, y Camino y Pantano sus Grandes propias; de los dos de lugar que quedan en la biblioteca, la **Mazmorra** llega a Grande — el Pueblo ya no tiene tipos de loseta propios. Por eso el tamaño del tablero se pide en **piezas y no en ancho × alto**: `tileCount` son **12, 15 ó 18** —12 el mínimo *(decidido)*— y lo que de verdad fija el tamaño es el total de hexágonos que salga, ~103-105 / ~129-131 / ~155-157 según la media exacta, no el número de piezas.

**Las losetas se maquetan DIBUJADAS** (`drawn()`): una cadena por fila de hexágonos y un carácter por hexágono (espacio hueco y `L C B P M Z U` los terrenos; todos llevan el suyo), sobre la rejilla escalonada de `hex.ts`. Veinte hexágonos escritos como literales `{q, r}` esconden un duplicado o un hueco; dibujados se ven. `toDrawing` es la inversa y da el dibujo **canónico**: la misma loseta siempre el mismo dibujo, esté donde esté en el papel, y por eso abrirla en el editor y guardarla sin tocar nada no mueve el fichero. Cuidado con el orden: hay que trasladar en coordenadas **axiales** y pasar a la rejilla escalonada después, porque mover el dibujo por el papel un número impar de filas no lo traslada, lo deforma (las filas impares van medio hexágono a la derecha).

**La biblioteca vive en `data/tile-library.json`, y `/lab/tiles` la ESCRIBE** (por `app/api/lab/tile-library`, una ruta que responde 404 fuera de desarrollo). Antes era un literal de TypeScript y la salida del editor había que copiarla y pegarla a mano; ahí es donde se colaban los errores. El JSON se sigue revisando en el diff igual que se revisaba el código —el dibujo ASCII se lee—, y lo que no cabe en un JSON, el *por qué* de cada pieza, va en el campo `note` de cada tipo y de cada variante. Se valida al arrancar (`parseLibrary` + `validateTileTypes`) y **antes de escribir**, con la misma función: si no pasa, no se escribe nada.

---

## 1. Principios

| Principio | Aplicación en CardGame |
|---|---|
| **Motor puro** | Las reglas del juego son funciones puras en `lib/v2/rules/`. Cero React, cero DOM, cero `fs`. La UI es un espectador |
| **Determinismo** | Misma `seed` + misma secuencia de acciones = misma partida, siempre. El azar vive **dentro** del estado |
| **El markdown es la fuente de verdad** | Las cifras de las cartas viven en [`docs/v2/cards/`](docs/v2/cards/) y se leen de ahí. Nunca se transcriben a mano |
| **Separación de responsabilidades** | Reglas → estado → presentación. Cada capa ignora la de arriba |
| **Responsabilidad única** | Cada función/componente hace una cosa |
| **Contenedor / presentacional** | La página orquesta; los componentes pintan y suben eventos |
| **Composición, nunca herencia** | Vale para componentes y para funciones de reglas |
| **Tipado estricto** | El dominio se modela con tipos; los estados imposibles no deben compilar |
| **Servidor por defecto** | `"use client"` lo más abajo posible del árbol |

Los dos primeros son los que mandan aquí y no salen en ninguna guía de arquitectura genérica. El **por qué** está en la §9.

---

## 2. La app son dos mitades distintas

No hay una única arquitectura porque no hay una única aplicación:

| | **Wiki de diseño** (existe) | **Juego** (por construir) |
|---|---|---|
| Rutas | [`app/docs/`](app/docs/) | `app/play/` |
| Renderizado | Server Components + prerender | **Isla de cliente**: todo el juego es interactivo |
| Origen de datos | `node:fs` sobre [`docs/v2/`](docs/v2/) en build ([`lib/docs.ts`](lib/docs.ts), [`lib/card-catalog.ts`](lib/card-catalog.ts)) | El catálogo serializado + la `seed` |
| Estado | Ninguno (salvo tema y buscador) | `GameState` completo, en cliente |
| Persistencia | — | `localStorage` (`seed` + log de acciones) |

La wiki ya hace lo correcto (servidor + `fs` + `cache` de React) y **no se toca** para meter el juego. El juego entra como una ruta nueva con su propio árbol de cliente.

---

## 2-bis. Los apartados

Dos mitades de **aplicación**, pero **seis** puertas de primer nivel ([`lib/sections.ts`](lib/sections.ts), fuente única de la portada y de todas las cabeceras). Se distinguen por dos preguntas distintas que conviene no mezclar: **qué documentan** y **a quién visten**.

| Apartado | Ruta | Qué documenta | Piel |
|---|---|---|---|
| **Wiki** | [`app/docs/`](app/docs/) | el juego **sobre papel**, en sus dos versiones. Abre en V3 | herramienta |
| **Dev** | [`app/dev/`](app/dev/) | la **construcción de V3**: un módulo por sistema ([`lib/dev-registry.ts`](lib/dev-registry.ts)). Hoy todo planificado | herramienta |
| **Lab** | [`app/lab/`](app/lab/) | el **motor v2**: un laboratorio por pieza ([`lib/lab-registry.ts`](lib/lab-registry.ts)) | herramienta |
| **Repositorio de desarrollo** | [`app/repository-dev/`](app/repository-dev/) | la **interfaz de las herramientas**: botones, campos, títulos | herramienta (`--wiki-*`) |
| **Repositorio de producción** | [`app/repository-pro/`](app/repository-pro/) | la **interfaz del juego**, tema medieval. Vacío: es el índice de lo pendiente | producto (`--game-*`, por crear) |
| **Play** | [`app/play/`](app/play/) | nada: es el juego jugable | producto |

**La wiki es UNA, con las dos versiones dentro.** Aunque el diseño esté partido (§"El corte v2 / v3"), no hay dos apartados: `Shell` mira el primer segmento de la URL (`versionOfRoute`, [`lib/docs-version.ts`](lib/docs-version.ts)) y enseña solo el árbol de esa versión —menú, título, buscador y migas incluidos—, y un `VersionSwitch` en la cabecera salta de una a otra.

- Se entra siempre por **V3** (`DEFAULT_DOCS_VERSION`): el apartado apunta a `/docs/v3` y `/docs` a pelo redirige allí.
- El buscador **no cruza versiones**: buscar "Guerrero" desde V3 no debe devolver el Guerrero D&D de v2.
- Llegó a haber dos apartados, *Wiki V3* y *Wiki v2*, y se descartó: v2 es archivo de consulta, no un destino que merezca puerta propia, y dos entradas casi idénticas ensucian la cabecera sin ganar nada. Por el mismo motivo `/docs` ya no enseña un selector.

> `lib/docs-version.ts` existe separado de [`lib/docs.ts`](lib/docs.ts) por una razón concreta: `docs.ts` usa `node:fs` y es solo-servidor, pero la cabecera, las migas y el buscador son componentes cliente que necesitan saber en qué versión están. Importarlos desde `docs.ts` mete `fs` en el bundle del navegador y el build de Turbopack falla.

**Lab y Dev tienen marco y registro propios**, en espejo (`LabShell`/`DevShell`, `lib/lab-registry.ts`/`lib/dev-registry.ts`). Hoy los dos marcos son casi idénticos y unificarlos sería tentador; no se hace porque van a divergir según crezca cada sección, y parametrizar ahora un componente cuyas diferencias aún no conocemos cuesta más que mantener dos.

Los dos repositorios salen los dos de [`lib/repository.ts`](lib/repository.ts) y comparten marco (`RepoShell`), porque son **el mismo instrumento con dos pieles**. Tres decisiones que sostienen esto:

1. **Un repositorio de componentes es una herramienta, aunque documente producción.** El jugador no ve una galería. Por eso `repository-pro` es un apartado de desarrollo y está al mismo nivel que los otros tres, no dentro de una hipotética sección de producción.
2. **El marco nunca se viste con el tema que muestra.** Cabecera, menú y ficha son siempre `--wiki-*`; lo medieval va **dentro** del lienzo del especimen. Un botón de hierro sobre una página ya maquillada de pergamino no se puede juzgar.
3. **Una galería enseña los componentes de verdad, nunca copias.** Un especimen con marcado propio deja de documentar en cuanto el componente cambie. Consecuencia: los componentes de producción vivirán en `components/game/ui/` —del lado del juego, por la frontera de la §3— y los genéricos de herramienta en `components/ui/` cuando se saquen de `components/wiki/`.

Los `--game-*` **no son los `--wiki-*` con otros valores**: el skin de las herramientas es *chrome* y conmuta claro/oscuro en runtime; el del juego es diegético, forma parte de la ficción y no tiene modo claro. Son dos mapas separados en `styles/settings/`, como ya lo están la rareza y el skin.

---

## 3. Estructura de carpetas

Estado actual, con lo que se añade marcado:

```
app/
├── layout.tsx              # raíz: fuentes, metadata, script anti-FOUC de tema
├── providers.tsx           # "use client" — PrimeReactProvider
├── page.tsx                # portada: las seis puertas (sale de lib/sections.ts)
├── api/lab/                # solo en desarrollo: escribe data/ (404 en producción)
├── docs/                   # LA WIKI, con v2 y v3 dentro (server components)
│   ├── [[...slug]]/        #   catch-all: resuelve v2/… y v3/…; /docs → /docs/v3
│   ├── search-index/       #   índice de búsqueda, filtrado por versión en cliente
│   └── v2/cards/design/    #   lab de diseño de carta (sigue a DESIGN_LAB_VERSION)
├── dev/                    # CONSTRUCCIÓN DE V3 — hoy solo el hub
│   ├── layout.tsx          #   DevShell: cabecera + menú de módulos
│   └── page.tsx            #   hub, sale de lib/dev-registry.ts
├── lab/                    # LABORATORIOS del motor v2
│   ├── layout.tsx          #   LabShell: cabecera + menú de labs
│   ├── page.tsx            #   hub, sale de lib/lab-registry.ts
│   ├── tiles/              #   la pieza: forma, terreno y anclas
│   ├── board/              #   el encaje: generación de la partida
│   ├── pieces/             #   las fichas: las 7 de contenido y las 3 de personaje
│   └── maps/               #   redirección histórica → /lab/board
├── repository-dev/         # REPOSITORIO de componentes de las HERRAMIENTAS
│   ├── layout.tsx          #   RepoShell side="dev"
│   ├── page.tsx            #   hub, sale de lib/repository.ts
│   ├── typography/         #   títulos, textos, prosa
│   ├── buttons/            #   Button propio (components/ui/Button.tsx)
│   └── forms/              #   campos, select, radios, casillas, deslizador
├── repository-pro/         # REPOSITORIO de componentes del JUEGO (medieval)
│   ├── layout.tsx          #   RepoShell side="pro"
│   └── page.tsx            #   solo el índice: no hay ni un componente aún
└── play/                   # redirección histórica → /lab/board

components/
├── wiki/                   # marco de las dos wikis
│                           #   Shell (filtra el árbol por versión), Sidebar,
│                           #   SearchBox, Breadcrumb, VersionSwitch
├── nav/                    # SectionLinks: navegación entre apartados
├── design/                 # lab de diseño de carta (vive dentro de la wiki)
├── dev/                    # marco de /dev — DevShell + DevSidebar, nada más aún
├── lab/                    # marco de /lab y paneles de mando de cada lab
│                           #   TileLab + TileCanvas (loseta), BoardLab (tablero)
│                           #   PieceLab (fichas), tile-sketch (el boceto),
│                           #   tile-library-store (editar)
├── repository/             # marco y VITRINA de los dos repositorios
│   ├── RepoShell/Sidebar   #   un solo marco para los dos lados
│   ├── RepoIndex.tsx       #   hub compartido
│   ├── Showcase.tsx        #   Specimen, Family, SpecimenGrid (la vitrina)
│   └── dev/                #   especímenes que necesitan estado (FormShowcase)
├── ui/                     # genéricos de herramienta
│   └── Button.tsx          #   el botón de todo el proyecto (+ buttonClass)
└── game/                   # componentes presentacionales del JUEGO
    ├── board/              #   hexágonos, fichas, la cámara (zoom/arrastre) y la niebla
    ├── ui/                 #   kit medieval: botón, panel…    (por construir)
    ├── hand/               #   Oteo, zona "en juego", mazo   (por construir)
    ├── combat/             #   iniciativa, objetivos, log     (por construir)
    └── hud/                #   PV, Amenaza, oro, estados      (por construir)

lib/
├── sections.ts             # los seis apartados: portada + cabeceras
├── repository.ts           # familias de componentes de los dos repositorios
├── lab-registry.ts         # registro de laboratorios v2: hub + menú de /lab
├── dev-registry.ts         # registro de módulos V3: hub + menú de /dev
├── card-table.ts           # parseo de tablas de carta en markdown
├── card-catalog.ts         # catálogo completo (solo servidor: node:fs)
├── docs.ts                 # las dos wikis: árbol, slugs, búsqueda (node:fs)
├── docs-version.ts         # helpers de versión — el único cruzable al cliente
├── card-art.ts  rarity.ts  severity.ts  remark-*.ts  …
├── v2/rules/               # EL MOTOR de la versión anterior (ver §4)
└── v3/                     # motor de V3 — vacío, aún sin escribir

styles/                     # ITCSS — ver AGENTS.md
docs/v3/                    # diseño VIGENTE del juego (fuente de verdad)
docs/v2/                    # diseño anterior, congelado como base de conocimiento
data/                       # datos del juego editables desde /lab (tile-library.json)

public/
├── assets/                 # lo que SE SIRVE, partido por versión
│   ├── v3/                 #   arte de V3 — vacío, aquí va lo nuevo
│   ├── v2/                 #   arte del juego anterior (cards/, sprites/), congelado
│   └── models/             #   .glb prestados de laboratorio: sin versión, no son arte de juego
└── concepts/               # moodboards y referencias: sin versión, nunca en producción

knowledge/                  # base de conocimiento: conceptos y papeles de trabajo.
                            #   NO se indexa en la wiki. Antes se llamaba md/
├── v2/                     # art-direction/ (prompts congelados + lámina) + PLAN-COMBATE archivado
└── v3/                     # art-direction/ (el concepto de arte: biblia visual + ilustraciones),
                            #   card-concept/ (marcos de referencia, con sus imágenes al lado),
                            #   races-concept/ (razas en redefinición antes de tocar docs/v3, con la
                            #     identidad visual de las 11 razas y prompts/ montados por raza)
                            #   + el plan de migración, ya ejecutado.
                            #   Cada carpeta con su README.md que dice qué entra y qué no
```

**La frontera lab / juego.** `components/game/` es el juego de verdad: componentes que acabarán en la partida. `components/lab/` es instrumental: los paneles de mando que solo existen para probar el motor. Un lab **usa** componentes de juego, nunca al revés — así ningún atajo de laboratorio se cuela en el producto. Cuando llegue la pantalla de juego será `app/play/` otra vez, montando los mismos componentes de `components/game/` que hoy prueban los labs.

`components/repository/` está del lado instrumental y no la cruza: es la **vitrina**, no las piezas. Los especímenes del repositorio medieval importarán de `components/game/ui/` exactamente igual que un lab importa de `components/game/board/`.

**Sobre `data/`:** contenido del juego que el motor lee pero no es código, y que se edita desde un laboratorio. Hoy solo está la biblioteca de losetas. Se distingue de `docs/v2/` en que `docs/v2/` lo escribe una persona y lo lee otra, y `data/` lo escribe una herramienta y lo lee el motor: por eso es JSON con formato fijo (`lib/tile-library-file.ts`) y no markdown.

**Sobre agrupar `lib/`:** hoy son 12 archivos planos y el pipeline de contenido (`card-table`, `card-catalog`, `docs`, `remark-*`, `markdown-link`) se distingue mal de los helpers. Cuando `lib/v2/rules/` empiece a crecer, merece la pena mover ese pipeline a `lib/content/`. Es un `git mv` y arreglar imports; **no es urgente y no se hace "de paso"**.

**Cuándo un componente se comparte:** si lo usan 2+ zonas del juego, sube a `components/game/`; si lo usa toda la app (wiki incluida), a `components/`. Igual que ya pasa con [`components/Markdown.tsx`](components/Markdown.tsx).

---

## 4. El motor de reglas (`lib/v2/rules/`)

**Es la pieza central de este proyecto.** Un reductor puro que recibe estado + acción y devuelve estado nuevo + eventos:

```ts
export function applyAction(state: GameState, action: GameAction): ActionResult;
```

Nada más. Sin React, sin `fs`, sin `Date.now()`, sin `Math.random()`.

### Archivos previstos

| Archivo | Responsabilidad |
|---|---|
| `state.ts` | Tipos de `GameState` (`Hex`, `Chapter`, `Character`, `Enemy`, `Combat`, `Card` — ya esbozados en [`docs/v2/board/board-map-dev.md`](docs/v2/board/board-map-dev.md) §2) |
| `actions.ts` | Unión discriminada de acciones: `Move`, `PlayCard`, `Scout`, `Prepare`, `Attack`, `Disengage`, `Rest`, `EndTurn`… |
| `events.ts` | Unión de eventos: `Damaged`, `CardDrawn`, `EnemyActivated`, `ThresholdFired`, `HexRevealed`… |
| `reduce.ts` | `applyAction`: valida legalidad y despacha al subsistema |
| `rng.ts` | PRNG con semilla (xorshift/mulberry32). Devuelve `[valor, rngSiguiente]` |
| `hex.ts` | Coordenadas axiales/cúbicas, vecinos, distancia, línea de visión |
| `terrain.ts` | Los 6 terrenos del prototipo: coste de movimiento, modificadores de visión/detección, peligro y cuota de generación (`docs/v2/board/board-map.md` §3a) |
| `vision.ts` | Las dos capas de niebla, acumulativas y permanentes |
| `movement.ts` | Alcance de movimiento: coste de terreno, bonus de Camino una vez por turno, suelo de 1 |
| `deck.ts` | Mazo / "en juego" / Oteo, con el tope fijo de "en juego" |
| `combat.ts` | Iniciativa, ataque, adyacencia, desengancharse, fin de combate |
| `enemy-ai.ts` | Árbol de prioridades determinista (`docs/v2/characters/enemies.md` §5b.6) |
| `threat.ts` | Reloj 0→40, umbrales con histéresis |
| `loot.ts` | `rollLoot(fuente)` — un solo sitio, lo llaman seis (§6b.6) |
| `tiles.ts` | Qué **es** una loseta: forma, terreno por hexágono, anclas, tamaños, tipos y el ida y vuelta con el dibujo (`drawn`/`toDrawing`) |
| `tile-library.ts` | **Cuáles** hay: lee `data/tile-library.json`, lo valida al arrancar y publica `TILE_TYPES` / `TILES` |
| `board-gen.ts` | Generación del **tablero**: unión de **12, 15 ó 18** losetas por sus anclas + entrada por la boca del camino + Guarida del boss + fichas (tabla B, Pueblo incluido). No repinta terreno: la conectividad se **mide** (`stranded`) |

### Reglas duras del motor

1. **Cero `Math.random()`.** El RNG es parte del estado y se pasa y se devuelve. Es lo único que hace posibles el replay y la simulación.
2. **Cero acceso a disco o red.** El catálogo de cartas **entra como parámetro**, no se lee.
3. **Inmutabilidad.** `applyAction` no muta su entrada.
4. **Una jugada ilegal no es una excepción**, es un resultado (§5).
5. **Los eventos son el único canal hacia la UI** para animaciones y registro de partida. El motor no sabe que existe una pantalla.

### Invariantes que el motor debe codificar

Están en el diseño y son justo los que se implementan mal si no se escriben aquí:

- **Jugar una carta la mueve de `inPlay` a `deck`, siempre.** `uses: 'ilimitado'` = "sin contador propio", **no** "se queda en juego" ([`docs/v2/game-design.md`](docs/v2/game-design.md) §4). Si se implementa al revés, el combate deja de tener decisiones a partir del turno 6.
- **`inPlayMax = clamp(ceil(deck.length / 2), 3, 10)`** — elástico, no un 10 fijo.
- **Máximo 2 enemigos con `aiState: 'activo'`**; el resto espera en `pendingReinforcements`, y se comprueba **donde se genera** el enemigo.
- **`usedThisCombat` se vacía solo cuando `turnsOutOfContact` llega a 2** o mueren todos. Huir un hexágono **no** recarga las Especiales `1/combate`.
- **Desengancharse y la ficha de Terreno se resuelven dentro del paso de movimiento**, no como eventos posteriores, para que el orden sea determinista.
- **La regla de caída del loot**: si la rareza sorteada no existe para ese tipo de carta, baja al escalón más alto disponible.

---

## 5. Contrato de resultado

El equivalente aquí del `ApiResponse<T>` de un proyecto con backend. Unión discriminada, para que TypeScript estreche solo:

```ts
export type ActionResult =
  | { ok: true; state: GameState; events: GameEvent[] }
  | { ok: false; reason: IllegalReason };

export type IllegalReason =
  | { kind: "notEnoughMovement"; needed: number; available: number }
  | { kind: "cardNotInPlay"; cardId: CardId }
  | { kind: "outOfRange"; from: HexCoord; to: HexCoord; range: number }
  | { kind: "actionAlreadyUsed"; slot: "action" | "quickAction" }
  | { kind: "notYourTurn" };
```

**Por qué así y no `{ success, code, error?, data? }`:** con `ok` discriminando, `if (res.ok)` ya garantiza `state` y `events` sin `?? []` en cada consumidor, y el estado imposible (`ok: true` sin datos) no compila. Y `reason` es **estructurado**, no un `string`: la UI decide el mensaje y puede además usarlo para deshabilitar el botón *antes* de que lo pulses.

**Regla:** toda validación de legalidad vive en el motor y se expone también en consulta (`canPlay(state, action): IllegalReason | null`), para que la UI apague acciones ilegales sin duplicar reglas.

---

## 6. La frontera con React

Una sola, y estrecha:

```
lib/v2/rules/  (puro, testeable, sin React)
      ↕                    ← applyAction / canPlay
GameProvider  ("use client", instancia el estado UNA vez)
      ↕                    ← state + dispatch + events
components/game/**  (presentacionales)
```

**Reglas:**

- El proveedor **instancia el estado de partida una sola vez** y lo expone por contexto. Llamar al mismo hook en varios componentes crearía instancias separadas: ese es el bug clásico y aquí sería fatal (dos partidas paralelas).
- `useGame()` devuelve `{ state, dispatch, canPlay }`. Los selectores (`useHex(q, r)`, `useHero()`) leen del contexto; no recalculan reglas.
- Los componentes **reciben datos y suben callbacks**, nunca setters ni el `dispatch` crudo si se puede evitar: `onMoveTo={(hex) => …}` es mejor contrato que `dispatch`.
- **Ninguna regla de juego dentro de un componente.** El test es una pregunta: *¿podría ejecutar esto sin pantalla?* Si la respuesta es no y contiene una decisión de juego, está en el sitio equivocado.
- Estado **de UI** (hex sobre el que está el ratón, carta arrastrándose, modal abierto) sí vive en el componente. No es estado de partida.
- `"use client"` va en el proveedor y en los componentes interactivos, **nunca** en [`app/layout.tsx`](app/layout.tsx).

---

## 7. Pipeline de contenido: markdown → dominio

Ya existe y funciona; conviene nombrarlo como capa porque es el "transporte" de este proyecto.

```
docs/v2/cards/*.md  ──[ card-table.ts ]──▶  CardRecord  ──[ card-catalog.ts ]──▶  CatalogCard[]
   (fuente de verdad)                    (fila parseada)      (solo servidor, node:fs + cache)
```

**Reglas:**

- **Nunca transcribir a mano** datos que están en [`docs/v2/`](docs/v2/). Ya se pagó: `components/design/cards-data.tsx` eran 97 cartas copiadas que empezaron a divergir del markdown, y por eso existe [`lib/card-catalog.ts`](lib/card-catalog.ts).
- **Validar en la frontera.** El parseo produce texto; el dominio necesita números y uniones. La conversión (`"1d8+2"` → tirada, `"Poco común"` → `Rarity`) se hace **una vez**, al construir el catálogo, y **falla ruidosamente en build** si una tabla está mal. El motor no debe defenderse de datos sucios.
- **El catálogo tiene que cruzar al cliente.** `card-catalog.ts` usa `node:fs`, así que no puede importarse desde un componente de cliente: un Server Component lo carga y lo pasa como props tipadas al proveedor del juego (alternativa: generar un JSON en build). Decidir al construir (§11).
- El motor recibe el catálogo **inyectado**. Así se puede testear con un catálogo mínimo de 3 cartas.

---

## 8. Reglas de ubicación

| Elemento | Dónde | Cuándo |
|---|---|---|
| Regla de juego, cálculo, azar | `lib/v2/rules/` | Siempre. Sin excepción |
| Tipos del dominio de partida | `lib/v2/rules/state.ts` | Modelo de juego |
| Parseo/adaptación de contenido | `lib/card-table.ts`, `lib/card-catalog.ts` | Markdown → dominio |
| Helper puro no-juego (formateo, slug) | `lib/*.ts` | Genérico |
| Componente de una sola zona del juego | `components/game/<zona>/` | Un solo consumidor |
| Componente de varias zonas del juego | `components/game/` | 2+ consumidores |
| Componente de toda la app | `components/` | Wiki + juego |
| Estado de partida | `GameProvider` (contexto) | Instanciado una vez |
| Estado de UI local | El propio componente | Hover, drag, modal |
| Orquestación de pantalla | `app/play/**/page.tsx` | Coordina, no decide reglas |
| Token visual (color, radio, z-index) | `styles/settings/` | Ver [`AGENTS.md`](AGENTS.md) |

---

## 9. Testing y simulación de balance

**Esta sección es la razón de ser de toda la arquitectura anterior.**

Según [`docs/v2/status.md`](docs/v2/status.md) §4-§6, el prototipo existe **para balancear**, y todas las cifras son un primer pase que "solo se cierra jugando". Hay decisiones abiertas concretas esperando datos: si activar un +2 global de precisión en ambos lados, si el reloj de 40 turnos cuadra con el tamaño real del tablero, los precios de la economía, y el residual de kiting con armas de alcance 4.

Con las reglas en funciones puras y deterministas se pueden responder **sin jugar a mano**:

1. **Tests unitarios del motor** — sin renderizar nada. Un ataque con Ventaja, el tope fijo de "en juego", que huir no recarga las Especiales.
2. **Partidas guionizadas** — una secuencia fija de acciones sobre una `seed` fija, comprobando el estado final. Detecta regresiones de reglas al tocar balance.
3. **Simulador headless** — N partidas con `seed` distinta y una política de juego sencilla, volcando métricas: tasa de muerte por héroe, turnos hasta el boss, cuántas partidas termina el reloj antes que el jugador, cuánto loot cae de verdad, si el kiting a alcance 4 gana siempre. Eso son minutos de CPU en vez de semanas de testeo manual.

Con la lógica dentro de componentes y hooks, **nada de esto es posible**: cada partida cuesta una persona y un navegador.

> **Pendiente de decidir:** no hay runner de tests instalado. Candidatos: el `node:test` que ya trae Node (cero dependencias, suficiente para funciones puras) o Vitest (mejor DX, watch, y sirve si algún día se testean componentes).

---

## 10. Anti-patrones

```text
❌ Math.random() / Date.now() dentro de lib/v2/rules/        → rompe determinismo, replay y simulación
❌ Una regla de juego dentro de un componente             → intestable sin pantalla
❌ useState como fuente de verdad del estado de partida   → el estado vive en el motor
❌ Llamar al hook de partida en varios componentes        → instancias separadas = dos partidas
❌ "use client" en app/layout.tsx                         → arrastra toda la app al cliente
❌ node:fs importado desde código de cliente o del motor  → el catálogo se inyecta
❌ Transcribir a mano cifras que están en docs/v2/*.md       → ya divergió una vez
❌ Pasar setters como props (setState del padre)          → pasa callbacks con intención
❌ Devolver boolean sin contexto en vez de IllegalReason  → la UI no puede explicar el "no"
❌ window.confirm                                         → ConfirmDialog de PrimeReact
❌ React.FC                                               → rompe genéricos, children implícito
❌ Literales de color/tamaño en SCSS                      → funciones de token (AGENTS.md)
❌ Reinventar las fórmulas de coordenadas hexagonales     → están resueltas, usar las estándar
```

---

## 11. Decisiones abiertas de arquitectura

| Tema | Opciones | Inclinación |
|---|---|---|
| Contenedor de estado | `useReducer` + contexto · Zustand | **Empezar con `useReducer` + contexto**: el motor ya *es* un reductor, así que no aporta nada una librería. Si aparece prop-drilling o problemas de re-render, entra Zustand después sin tocar `lib/v2/rules/` |
| Persistencia | `seed` + log de acciones · snapshot del estado | **Log**: más pequeño, da replay gratis y valida el determinismo. Snapshot como caché si rehidratar resulta lento |
| Catálogo en cliente | Props desde un Server Component · JSON generado en build | Decidir al construir `app/play/` |
| Runner de tests | `node:test` · Vitest | Ver §9 |
| Agrupar `lib/content/` | Ahora · cuando crezca `lib/v2/rules/` | Cuando crezca (§3) |

---

## 12. Checklist antes de dar por bueno un módulo

- [ ] Las reglas están en `lib/v2/rules/`, son puras y no usan `Math.random()`
- [ ] El azar pasa por el RNG con semilla del estado
- [ ] `applyAction` no muta la entrada
- [ ] Las jugadas ilegales devuelven `IllegalReason`, no lanzan ni devuelven `false`
- [ ] Hay `canPlay` para que la UI deshabilite sin duplicar reglas
- [ ] Los componentes reciben datos y suben callbacks; ninguno decide reglas
- [ ] El estado de partida se instancia una sola vez
- [ ] Props tipadas explícitamente, sin `React.FC`
- [ ] `"use client"` lo más abajo posible
- [ ] Las cifras salen de [`docs/v2/`](docs/v2/), no de una copia a mano
- [ ] Hay al menos un test unitario del invariante que este módulo introduce
- [ ] Los estilos usan tokens, no literales ([`AGENTS.md`](AGENTS.md))
