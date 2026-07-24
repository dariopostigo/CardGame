<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Estilos: SCSS + ITCSS

Todo el CSS vive en `styles/`, en un único punto de entrada (`styles/main.scss`) que importa `app/layout.tsx`. No hay archivos `.css` propios ni estilos co-ubicados con los componentes.

- **Orden de capas** (definido en `styles/main.scss`, no reordenar): vendor → settings → tools → generic → elements → objects → components → utilities.
- **Nada de valores literales** en los parciales: colores, radios, z-index y tamaños se piden por nombre a las funciones de `styles/tools/_functions.scss` (`skin()`, `z()`, `radius()`, `rarity()`, `depth()`…). Si el token no existe, el build falla.
- **Tokens nuevos** → `styles/settings/`. Es la fuente única: las rarezas y severidades se generan desde ahí tanto para el lab de cartas como para las mini-cartas de la wiki (`lib/rarity.ts` y `lib/severity.ts` son su espejo en TS).
- **Skin claro/oscuro**: los `--wiki-*` se emiten solo en `styles/elements/_root.scss` desde los mapas `$skin-light`/`$skin-dark`; el TSX los consume con `var(--wiki-…)` en clases arbitrarias de Tailwind.
- Nuestras reglas van **sin `@layer`** a propósito: así ganan a las utilidades de Tailwind sin `!important`.
- Tailwind se importa como `@import "tailwindcss/index.css"` (con extensión) para que Sass lo deje pasar tal cual en vez de intentar resolverlo como módulo Sass.
