# Plan de migración v2 → v3

> Plan de trabajo, no documento de diseño — vive en `md/` y no en `docs/` porque `docs/` se indexa solo en la wiki (`lib/docs.ts`).
>
> ## ✅ EJECUTADO el 20 de agosto de 2026
>
> Los 5 pasos están hechos y verificados: `npx tsc --noEmit` y `npx next build` pasan, y los 39 documentos del árbol caen en un grupo de navegación (ninguno huérfano). Se conserva como registro de lo que se hizo y de lo que quedó pendiente; bórralo cuando ya no aporte.
>
> **Desviaciones respecto a lo planeado:**
>
> - **El paso 3.3 se hizo a medias, a propósito.** El residuo de sigilo sí se limpió (Asesino y Asesino élfico). El solape triple de Resistencia mágica **no se fundió**: hay unidades con 🔮 Resistencia mágica ya asignada en sus tablas de Características, así que borrarla las dejaría huérfanas, y decidir qué añade el rasgo sobre la Habilidad es diseño, no migración. Queda anotado en `docs/v3/razas.md` y en `docs/v3/status.md` §3.
> - **`PLAN-COMBATE.md` se archivó**, no se borró: está en `md/v2/` con un aviso de que sus reglas están muertas pero su estructura sigue siendo buena referencia.
> - **Aparecieron 15 enlaces más de los 28 contados**: `lib/dev-labs.ts` (9) y los labs de `components/dev/` (6) tenían rutas `/docs/...` cableadas que ahora apuntan a `/docs/v2/...`.
> - **Extra no planeado:** se documentó el corte en `ARCHITECTURE.md` (sección nueva "El corte v2 / v3") y en `AGENTS.md`, para que no se escriba diseño nuevo dentro de `docs/v2/` por inercia.
> - **Extra no planeado:** `docs/v2/ideas.md` apuntaba a `plan-accion.md`, que este plan borra. Redirigido a los documentos de V3.

## Objetivo

Separar el juego actual (D&D: 6 estadísticas, d20, CA, armas/armaduras) del juego nuevo (V3: razas, 8 Habilidades, Características, combate sin dados) en dos árboles paralelos, **v2 congelado como base de conocimiento** y **v3 escrito desde cero**.

**Principio:** no se traduce nada de v2 a v3. Se escribe V3 de nuevo, y se consulta v2 cuando interese recuperar algo concreto. Lo que en v2 estaba decidido y balanceado deja de estar decidido hasta que se vuelva a decidir sobre el sistema nuevo.

**Decisiones que enmarcan este plan** *(2026-08-20)*:

- Split de documentación **y** de código.
- Código: **solo `lib/`**. Rutas y componentes se quedan sobre v2 hasta que exista motor V3 que renderizar.
- `lib/`: **mover sin duplicar ni extraer núcleo**. Ninguna decisión de arquitectura antes de tiempo.
- `docs/v3/` es **espejo estructural de v2**, con contenido nuevo.
- `conceptV3.md` **no se parte**: pasa entero a `docs/v3/razas.md` menos su sección de cabecera.

---

## Paso 0 — Aterrizar los 12 puntos antes de borrarlos

La sección "Nuevo cambio de rumbo en el juego" de `conceptV3.md` se elimina, pero contiene decisiones que no están escritas en ningún otro sitio. **Primero se reparten, después se borra la sección.** Sin este paso, la migración pierde diseño.

| # | Decisión | Destino |
|---|---|---|
| 1 | Rumbo: HoMM Olden Era + Magic; razas, Habilidades y Características como base de las acciones de combate | `v3/game-design.md` §1 |
| 2 | Dos tableros separados: exploración y batalla | `v3/board/board-map.md` y `v3/board/battle.md` |
| 3 | El sistema de cartas se mantiene, adaptado a Habilidades/Características | `v3/cards/README.md` |
| 4 | Las cartas de clase cubren todas las razas | `v3/cards/class.md` |
| 5 | Una carta de unidad por cada unidad de cada raza | `v3/cards/units.md` |
| 6 | Mercenarios obsoletos | no se replica `mercenaries.md`; nota en `v3/cards/units.md` |
| 7 | Los enemigos son las propias razas; una raza como Boss final | `v3/characters/enemies.md` |
| 8 | Campañas sin definir (necesitan historia) | `v3/status.md`, como no-alcance |
| 9 | Nivel y rareza se mantienen como están | `v3/game-design.md` |
| 10 | El héroe sube de nivel igual que las unidades | `v3/characters/heroes.md` |
| 11 | Armas y armaduras obsoletas | no se replican; nota en `v3/cards/README.md` |
| 12 | Items, maldiciones y mazo de encuentro: repasar por coherencia | `v3/status.md`, como tarea pendiente |

## Paso 1 — Partir `docs/`

**1.1 Mover v2 en bloque.** `git mv` de todo el contenido actual de `docs/` a `docs/v2/`. En bloque es importante: los enlaces relativos entre documentos de v2 son relativos entre sí y sobreviven al movimiento intactos. Incluye `others/links.txt` (no es `.md`, la wiki lo ignora, pero se mueve igual).

**1.2 Crear `docs/v2/README.md`** marcando el árbol como congelado: qué sistema describe, por qué se conserva, y que no se edita.

**1.3 Ajustar `lib/docs.ts`.** `GROUPS` ([docs.ts:34-39](../../lib/docs.ts#L34-L39)) tiene las carpetas de primer nivel escritas a mano (`""`, `board`, `characters`, `cards`) y `META` ([docs.ts:42-60](../../lib/docs.ts#L42-L60)) indexa por slug. Ambas listas pasan a cubrir `v2/*` y `v3/*`. Es el único punto donde el split se nota en la navegación.

**1.4 Ajustar `CARDS_ROOT`** ([card-catalog.ts:20](../../lib/card-catalog.ts#L20)), hoy `docs/cards`.

> **Sub-decisión de calendario:** si apunta a `docs/v3/cards` desde el primer día, el lab de diseño de cartas (`/docs/cards/design`) se queda vacío hasta que exista la primera tabla V3. **Propuesta: dejarlo en `docs/v2/cards` y moverlo el día que `v3/cards/` tenga su primera tabla.** Es un cambio de una línea y mantiene el lab útil mientras tanto.

**1.5 Arreglar las referencias externas.** Unas 28 en total: `ARCHITECTURE.md` (21), `README.md` (3), `PLAN-COMBATE.md` (3), `AGENTS.md` (1). Las 26 de `plan-accion.md` no cuentan: ese fichero muere en el paso 3.

**1.6 Comprobar la ruta cableada** `/docs/cards/design` ([docs.ts:134](../../lib/docs.ts#L134)) y el índice de búsqueda (`app/docs/search-index`), que ahora recorrerá los dos árboles.

## Paso 2 — Partir `lib/`

**2.1** `git mv lib/rules lib/v2/rules`.

**2.2** Reemplazar `lib/rules/` → `lib/v2/rules/` en los imports: 105 ocurrencias en 28 ficheros, de las cuales las de dentro de `lib/rules/` se arreglan con el mismo reemplazo. Consumidores externos: 14 componentes de `components/dev/`, 4 de `components/game/board/`, `app/dev/page.tsx`, `app/api/dev/tile-library/route.ts`, `lib/tile-library-file.ts`, `lib/tile-library-format.ts`.

**2.3** Crear `lib/v3/` vacío.

**2.4** Verificar que la app sigue arrancando y que los labs de `/dev` funcionan igual. Este paso no cambia ni una línea de lógica: solo rutas de import.

**Lo que este paso deliberadamente NO hace:** no extrae `hex`, `tiles`, `board-gen` ni `rng` a un núcleo compartido. Son ~1.900 de las 4.239 líneas y no tienen nada de D&D, pero decidir hoy qué es "agnóstico" es decidir sin saber qué pide V3. Se resuelve cuando `lib/v3/` necesite geometría hexagonal de verdad.

## Paso 3 — `razas.md` y muerte de `plan-accion.md`

**3.1** `md/v3/conceptV3.md` → `docs/v3/razas.md`.

**3.2** Eliminar de él la sección "Nuevo cambio de rumbo en el juego", ya repartida en el paso 0.

**3.3** Limpiar los dos residuos conocidos del documento:
- "Sigilo" sigue escrito en el Asesino élfico ([líneas 48 y 258](../../docs/v3/razas.md), ya en su destino), pese a estar retirado.
- Resistencia mágica aparece tres veces: como Habilidad, como Característica en la sección Magia, y como "Resistente a la magia" en Resistencias.

**3.4** Borrar `md/v3/plan-accion.md`. Está escrito como un diff contra v2 y bajo el principio de sustitución total no sirve. Lo que valía de él —el inventario de decisiones tomadas y de huecos abiertos— se rehace sobre V3 en `v3/status.md`.

**3.5** Decidir qué hacer con `PLAN-COMBATE.md` (raíz): es el plan de implementación del motor d20 con iniciativa, CA y ventaja/desventaja. Obsoleto bajo el motor sin dados. Se archiva con v2 o se borra.

## Paso 4 — Esqueletos de `docs/v3/`

Crear los ficheros vacíos con su índice de secciones, para que la estructura exista antes que el contenido:

```
docs/v3/
  README.md        índice del árbol V3 y estado de cada documento
  game-design.md   reglas generales, turno, nivel, rareza
  glossary.md      vocabulario V3
  status.md        qué está decidido, qué falta, qué falta balancear
  ideas.md         aparcadas
  effects.md       estados
  razas.md         ← del paso 3
  board/           board-map.md  board-map-dev.md  battle.md
  characters/      heroes.md  enemies.md  npcs.md
  cards/           README.md  class.md  units.md  items.md
                   curses.md  encounter.md
```

Sin `weapons.md` ni `armor.md` (punto 11). `units.md` ocupa el lugar de `mercenaries.md` (puntos 5 y 6).

## Paso 5 — Verificación

- La wiki muestra dos raíces navegables y ningún documento da 404.
- `/docs/cards/design` sigue listando cartas.
- Los labs de `/dev` y `/play` arrancan igual que antes.
- Ninguna referencia rota en `ARCHITECTURE.md` ni `README.md`.

---

## Lo que este plan no resuelve

Son decisiones de diseño de V3, no de migración, y se toman al escribir `v3/game-design.md` y `v3/razas.md`:

- **Alcance**: el motor habla de "dentro de tu rango" pero ninguna de las 8 Habilidades es alcance.
- **Caster**: el Foco de hechizos se retira como objeto y no hay Característica que lo sustituya en el catálogo.
- **Regla de facción**: si se pueden reclutar unidades de razas distintas a la del héroe.
- **Escala de unidades**: cómo se relacionan los 8 tiers de progresión con Rareza y con Nivel 1-5.
- **Estados**: qué estados existen en V3 y qué hacen, definidos sobre el motor sin dados en vez de traducidos desde 2d20/CA.
- **Valores numéricos** de las 8 Habilidades: insumo pendiente de Dario.

## Punto de no retorno

Después del paso 1, `docs/v2/` deja de ser el diseño vigente y pasa a ser referencia histórica. El balance de la Partida rápida —completo en papel tras varias tandas de corrección— **no migra**: V3 se balancea de cero con su propio motor. Es el coste real de la decisión y está asumido.
