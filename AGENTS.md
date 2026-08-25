<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# El proyecto está partido en v2 y v3

Desde el 20 de agosto de 2026 conviven dos versiones del juego. **Antes de escribir diseño o reglas, comprueba en cuál estás.**

- **`docs/v3/` es el diseño vigente** (razas, 8 Habilidades, Características, combate sin dados). Todo el diseño nuevo se escribe aquí. **Excepción abierta: las razas.** Se están redefiniendo en `knowledge/v3/races-concept/razas.md`, que es el archivo que se edita; `docs/v3/razas.md` queda congelado —lo lee la wiki— y solo se reescribe cuando un bloque del concepto está cerrado. Ver [`knowledge/v3/races-concept/README.md`](knowledge/v3/races-concept/README.md).
- **`docs/v2/` está congelado**: es la versión anterior, de raíz D&D, y se conserva solo como base de conocimiento. **No se edita.** Si algo de allí sirve para V3, se reescribe en el documento V3 que toque — no se copia ni se enlaza como si siguiera vigente.
- **`lib/v2/rules/` es el motor de v2** y sigue siendo lo que ejecutan `/lab` y `/play`. No se amplía. **`lib/v3/` está vacío** a propósito hasta que V3 defina su motor.
- **El arte también está partido**: `public/assets/v2/` (congelado) y `public/assets/v3/` (vacío, para lo nuevo), servidos en `/assets/v2/…` y `/assets/v3/…`. Los `.glb` prestados de laboratorio viven en `public/assets/v2/models/`: no son arte del juego, pero los cargan los laboratorios de v2. Fuera del corte, porque no se sirve al jugador: `public/concepts/` (moodboards y referencias, que se citan por ruta completa en los comentarios).
- **La dirección de arte vigente es `knowledge/v3/art-direction/`** y su alcance es estrecho: **el concepto de arte de todas las ilustraciones, y nada más**. Dos documentos: `style-guide.md` (la biblia visual: cómo se dibuja todo) e `illustrations.md` (qué se dibuja: razas, héroes, unidades, criaturas y cartas, con sus encuadres y su plantilla de prompt). Los prompts de v2 (`knowledge/v2/art-direction/`) están congelados y **no se traducen**: son catálogo muerto. El estilo, en cambio, no cambió al cambiar las reglas — por eso hay una sola biblia y vive con V3.
- **Lo que suena a dirección de arte pero no lo es vive fuera**, cada cosa donde manda su dependencia: las **medidas del archivo** (lienzo, ratio, sangrado, aire, extensión) en `public/assets/v3/README.md`, junto a las rutas y el nombre; el **diseño de la carta** —marco, tipografía, disposición, Rareza, **sin definir**— en `knowledge/v3/card-concept/`; los **sujetos y sus prompts montados** en `knowledge/v3/races-concept/` (`sujetos.md` y `prompts/`); los **pictogramas de Habilidades, Tipo de daño, Características y emblemas de raza** —no son ilustración, son iconografía de interfaz— en `knowledge/v3/icon-concept/`. No las devuelvas a `art-direction/`. **Cada carpeta de `knowledge/v3/` tiene su `README.md`** que dice qué entra y qué no: léelo antes de añadir nada.
- El corte completo, con sus reglas y sus pendientes, está en [`ARCHITECTURE.md`](ARCHITECTURE.md) §"El corte v2 / v3".

La aplicación sigue el mismo corte, y **`/dev` ya no es lo que era**:

| Ruta | Qué es |
|---|---|
| `/docs` | La wiki. Redirige a `/docs/v3`; se salta a `/docs/v2` con el conmutador de la cabecera. **Un solo apartado**, no dos |
| `/dev` | Construcción de V3 (`lib/dev-registry.ts`, `components/dev/`). Hoy solo el hub: todo planificado |
| `/lab` | Los laboratorios del motor v2 (`lib/lab-registry.ts`, `components/lab/`). Antes vivían en `/dev` |

Al escribir código nuevo de V3 va en `/dev` y `lib/v3/`, nunca en `/lab` ni en `lib/v2/`.

# Estilos: SCSS + ITCSS

Todo el CSS vive en `styles/`, en un único punto de entrada (`styles/main.scss`) que importa `app/layout.tsx`. No hay archivos `.css` propios ni estilos co-ubicados con los componentes.

- **Orden de capas** (definido en `styles/main.scss`, no reordenar): vendor → settings → tools → generic → elements → objects → components → utilities.
- **Nada de valores literales** en los parciales: colores, radios, z-index y tamaños se piden por nombre a las funciones de `styles/tools/_functions.scss` (`skin()`, `z()`, `radius()`, `rarity()`, `depth()`…). Si el token no existe, el build falla.
- **Tokens nuevos** → `styles/settings/`. Es la fuente única: las rarezas y severidades se generan desde ahí tanto para el lab de cartas como para las mini-cartas de la wiki (`lib/rarity.ts` y `lib/severity.ts` son su espejo en TS).
- **Skin claro/oscuro**: los `--wiki-*` se emiten solo en `styles/elements/_root.scss` desde los mapas `$skin-light`/`$skin-dark`; el TSX los consume con `var(--wiki-…)` en clases arbitrarias de Tailwind.
- Nuestras reglas van **sin `@layer`** a propósito: así ganan a las utilidades de Tailwind sin `!important`.
- Tailwind se importa como `@import "tailwindcss/index.css"` (con extensión) para que Sass lo deje pasar tal cual en vez de intentar resolverlo como módulo Sass.
