# CardGame — Arquitectura

> Arquitectura **concreta** de este proyecto. Sin placeholders: aquí el stack está decidido y las capas que no existen (transporte, roles, i18n) no se documentan.
> Deriva de una plantilla genérica de arquitectura React/Next, recortada a lo que aplica y **ampliada** con lo que un juego por turnos necesita y un panel de administración no: motor de reglas puro, determinismo y simulación de balance.
>
> Documentos hermanos: [`AGENTS.md`](AGENTS.md) (estilos + aviso de Next), [`PENDIENTE.md`](PENDIENTE.md) (punto de continuación), [`docs/`](docs/) (diseño del juego, que es la **fuente de verdad del contenido**), [`docs/board/board-map-dev.md`](docs/board/board-map-dev.md) (modelo de datos y algoritmos).

---

## 0. El stack (decidido)

| Pieza | Decisión | Nota |
|---|---|---|
| Framework | **Next.js 16.2.11, App Router** | Breaking changes respecto a versiones anteriores: **leer `node_modules/next/dist/docs/` antes de programar** ([`AGENTS.md`](AGENTS.md)) |
| React | **19.2.4** | Server Components por defecto; `"use client"` es una excepción explícita |
| Lenguaje | **TypeScript `strict`** | [`tsconfig.json`](tsconfig.json). Sin `any` sin justificación escrita |
| UI kit | **PrimeReact 11** + `@primeuix/themes` (preset Aura, acento ámbar) | Configurado en [`app/providers.tsx`](app/providers.tsx) |
| Estilos | **Tailwind 4 + SCSS/ITCSS** | Reglas completas en [`AGENTS.md`](AGENTS.md). **No se repiten aquí** |
| Formularios | `react-hook-form` | Solo donde haga falta (lab de diseño) |
| Contenido | **Markdown en [`docs/`](docs/)** parseado en build | No hay CMS ni base de datos |
| Datos remotos | **Ninguno** | Sin API, sin backend, sin transporte |
| Auth / roles | **Ninguno** | Juego local de un jugador |
| i18n | **Ninguno** | Español, en el código y en la UI |
| Alias | `@/*` → **raíz del repo** | No hay `src/`: `app/`, `components/`, `lib/`, `styles/`, `docs/` cuelgan de la raíz |

Consecuencia directa: **las capas de transporte, servicios thin, `ApiResponse<T>`, control de acceso e i18n no existen en este proyecto.** Si algún día entra un backend (multijugador, ranking), se añaden entonces y se documentan entonces.

---

## 0-bis. Vocabulario

Cuatro cosas distintas que es fácil llamar "mapa" a todas. **En el código, en la UI y en los documentos se llaman siempre así:**

| Concepto | Qué es | En el código | Dónde se trabaja |
|---|---|---|---|
| **hexágono** | Una casilla: terreno, ficha, niebla | `Hex` ([`lib/rules/state.ts`](lib/rules/state.ts)) | — |
| **loseta** | Pieza predefinida de hexágonos con su forma, el terreno de cada uno y sus anclas. Se **maqueta a mano** | `TileDef`, `PlacedTile` ([`lib/rules/tiles.ts`](lib/rules/tiles.ts)) | `/dev/losetas` |
| **ancla** | Borde exterior por el que una loseta se une a otra. Solo en el contorno; el resto del borde es pared | `TileDef.anchors` ([`lib/rules/tiles.ts`](lib/rules/tiles.ts)) | `/dev/losetas`, modo Anclas |
| **tablero** | El mapa completo de **una** partida rápida o capítulo, resultado de unir losetas por sus anclas. Se **genera** con una semilla | `Board` ([`lib/rules/board-gen.ts`](lib/rules/board-gen.ts)) | `/dev/tablero` |

Por qué separarlos: son dos problemas de diseño que se afinan con criterios distintos. Cambiar la forma de una loseta afecta a cómo se ve el terreno de cerca; cambiar cuántas se colocan afecta a la duración de la partida. Mezclarlos en un solo laboratorio —como estaba al principio— hace que no se sepa qué se está tocando. La palabra **"mapa"** queda solo para el documento de diseño ([`docs/board/board-map.md`](docs/board/board-map.md)) y para el sentido coloquial.

**Los tres grados de libertad de una loseta**, y solo tres: su **forma** (dentro del tope de su tamaño), el **terreno** de cada hexágono y sus **anclas**. Un hexágono puede quedarse *al sorteo* (`terrain: null`): entonces su terreno lo pone el tablero al colocar la loseta, con los pesos de la tabla A, y cambia en cada partida. Eso es lo que permite tener piezas con carácter fijo (un paso de montaña, un vado) sin que el tablero se repita.

**Los cinco tamaños** (`TILE_SIZES`) doblan capacidad en cada nivel: Mínima 4, Pequeña 8, Mediana 16, Grande 32, Enorme 64 hexágonos. El tamaño no se guarda en la loseta, se deriva de cuántos hexágonos tiene (`sizeOf`), para que no puedan discrepar. La biblioteca de hoy cubre cuatro de los cinco: 5 Mínimas, 5 Pequeñas, 4 Medianas y 2 Grandes, con una media de 7,7 hexágonos por pieza (por peso de bolsa). No hay ninguna Enorme a propósito: 64 hexágonos son un tablero entero, no una pieza. Por eso `tileCount` bajó de 15 a **9** — lo que fija el tamaño del tablero es el total de hexágonos (~68), no el número de piezas.

**Las losetas se maquetan DIBUJADAS** (`drawn()`): una cadena por fila de hexágonos y un carácter por hexágono (espacio hueco, `.` al sorteo, `L C B P M` los terrenos), sobre la rejilla escalonada de `hex.ts`. Veinte hexágonos escritos como literales `{q, r}` esconden un duplicado o un hueco; dibujados se ven. El editor de `/dev/losetas` devuelve el literal en ese mismo formato (`toDrawing`/`toSource`), así que lo que sale se pega tal cual. Ojo con una trampa del escalonado: subir un dibujo una fila no lo mueve, lo convierte en otra forma, y por eso el literal generado puede empezar con una fila en blanco.

---

## 1. Principios

| Principio | Aplicación en CardGame |
|---|---|
| **Motor puro** | Las reglas del juego son funciones puras en `lib/rules/`. Cero React, cero DOM, cero `fs`. La UI es un espectador |
| **Determinismo** | Misma `seed` + misma secuencia de acciones = misma partida, siempre. El azar vive **dentro** del estado |
| **El markdown es la fuente de verdad** | Las cifras de las cartas viven en [`docs/cards/`](docs/cards/) y se leen de ahí. Nunca se transcriben a mano |
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
| Origen de datos | `node:fs` sobre [`docs/`](docs/) en build ([`lib/docs.ts`](lib/docs.ts), [`lib/card-catalog.ts`](lib/card-catalog.ts)) | El catálogo serializado + la `seed` |
| Estado | Ninguno (salvo tema y buscador) | `GameState` completo, en cliente |
| Persistencia | — | `localStorage` (`seed` + log de acciones) |

La wiki ya hace lo correcto (servidor + `fs` + `cache` de React) y **no se toca** para meter el juego. El juego entra como una ruta nueva con su propio árbol de cliente.

---

## 3. Estructura de carpetas

Estado actual, con lo que se añade marcado:

```
app/
├── layout.tsx              # raíz: fuentes, metadata, script anti-FOUC de tema
├── providers.tsx           # "use client" — PrimeReactProvider
├── page.tsx                # portada: las dos puertas (Wiki / Dev)
├── docs/                   # wiki (server components)
├── dev/                    # LABORATORIOS de desarrollo
│   ├── layout.tsx          #   DevShell: cabecera + menú de labs
│   ├── page.tsx            #   hub, sale de lib/dev-labs.ts
│   ├── losetas/            #   la pieza: forma, terreno y anclas
│   ├── tablero/            #   el encaje: generación de la partida
│   └── mapas/              #   redirección histórica → /dev/tablero
└── play/                   # redirección histórica → /dev/tablero

components/
├── wiki/                   # wiki
├── design/                 # lab de diseño de carta (vive dentro de la wiki)
├── dev/                    # marco de /dev y paneles de mando de cada lab
│                           #   TileLab + TileCanvas (loseta), BoardLab (tablero)
└── game/                   # componentes presentacionales del JUEGO
    ├── board/              #   hexágonos, niebla, fichas
    ├── hand/               #   Oteo, zona "en juego", mazo   (por construir)
    ├── combat/             #   iniciativa, objetivos, log     (por construir)
    └── hud/                #   PV, Amenaza, oro, estados      (por construir)

lib/
├── dev-labs.ts             # registro de laboratorios: hub + menú de /dev
├── card-table.ts           # parseo de tablas de carta en markdown
├── card-catalog.ts         # catálogo completo (solo servidor: node:fs)
├── card-art.ts  docs.ts  rarity.ts  severity.ts  remark-*.ts  …
└── rules/                  # EL MOTOR (ver §4)

styles/                     # ITCSS — ver AGENTS.md
docs/                       # diseño del juego = contenido (fuente de verdad)
```

**La frontera lab / juego.** `components/game/` es el juego de verdad: componentes que acabarán en la partida. `components/dev/` es instrumental: los paneles de mando que solo existen para probar el motor. Un lab **usa** componentes de juego, nunca al revés — así ningún atajo de laboratorio se cuela en el producto. Cuando llegue la pantalla de juego será `app/play/` otra vez, montando los mismos componentes de `components/game/` que hoy prueban los labs.

**Sobre agrupar `lib/`:** hoy son 12 archivos planos y el pipeline de contenido (`card-table`, `card-catalog`, `docs`, `remark-*`, `markdown-link`) se distingue mal de los helpers. Cuando `lib/rules/` empiece a crecer, merece la pena mover ese pipeline a `lib/content/`. Es un `git mv` y arreglar imports; **no es urgente y no se hace "de paso"**.

**Cuándo un componente se comparte:** si lo usan 2+ zonas del juego, sube a `components/game/`; si lo usa toda la app (wiki incluida), a `components/`. Igual que ya pasa con [`components/Markdown.tsx`](components/Markdown.tsx).

---

## 4. El motor de reglas (`lib/rules/`)

**Es la pieza central de este proyecto.** Un reductor puro que recibe estado + acción y devuelve estado nuevo + eventos:

```ts
export function applyAction(state: GameState, action: GameAction): ActionResult;
```

Nada más. Sin React, sin `fs`, sin `Date.now()`, sin `Math.random()`.

### Archivos previstos

| Archivo | Responsabilidad |
|---|---|
| `state.ts` | Tipos de `GameState` (`Hex`, `Chapter`, `Character`, `Enemy`, `Combat`, `Card` — ya esbozados en [`docs/board/board-map-dev.md`](docs/board/board-map-dev.md) §2) |
| `actions.ts` | Unión discriminada de acciones: `Move`, `PlayCard`, `Scout`, `Prepare`, `Attack`, `Disengage`, `Rest`, `EndTurn`… |
| `events.ts` | Unión de eventos: `Damaged`, `CardDrawn`, `EnemyActivated`, `ThresholdFired`, `HexRevealed`… |
| `reduce.ts` | `applyAction`: valida legalidad y despacha al subsistema |
| `rng.ts` | PRNG con semilla (xorshift/mulberry32). Devuelve `[valor, rngSiguiente]` |
| `hex.ts` | Coordenadas axiales/cúbicas, vecinos, distancia, línea de visión |
| `vision.ts` | Las dos capas de niebla, acumulativas y permanentes |
| `deck.ts` | Mazo / "en juego" / Oteo, con el tope elástico |
| `combat.ts` | Iniciativa, ataque, adyacencia, desengancharse, fin de combate |
| `enemy-ai.ts` | Árbol de prioridades determinista (`docs/characters/enemies.md` §5b.6) |
| `threat.ts` | Reloj 0→40, umbrales con histéresis |
| `loot.ts` | `rollLoot(fuente)` — un solo sitio, lo llaman seis (§6b.6) |
| `tiles.ts` | Biblioteca de **losetas**: forma, terreno por hexágono, anclas y los cinco tamaños. Catálogo dibujado a mano (`drawn()`), no generado |
| `board-gen.ts` | Generación del **tablero**: unión de losetas por anclas + conectividad + localizaciones garantizadas + fichas |

### Reglas duras del motor

1. **Cero `Math.random()`.** El RNG es parte del estado y se pasa y se devuelve. Es lo único que hace posibles el replay y la simulación.
2. **Cero acceso a disco o red.** El catálogo de cartas **entra como parámetro**, no se lee.
3. **Inmutabilidad.** `applyAction` no muta su entrada.
4. **Una jugada ilegal no es una excepción**, es un resultado (§5).
5. **Los eventos son el único canal hacia la UI** para animaciones y registro de partida. El motor no sabe que existe una pantalla.

### Invariantes que el motor debe codificar

Están en el diseño y son justo los que se implementan mal si no se escriben aquí:

- **Jugar una carta la mueve de `inPlay` a `deck`, siempre.** `uses: 'ilimitado'` = "sin contador propio", **no** "se queda en juego" ([`docs/game-design.md`](docs/game-design.md) §4). Si se implementa al revés, el combate deja de tener decisiones a partir del turno 6.
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
lib/rules/  (puro, testeable, sin React)
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
docs/cards/*.md  ──[ card-table.ts ]──▶  CardRecord  ──[ card-catalog.ts ]──▶  CatalogCard[]
   (fuente de verdad)                    (fila parseada)      (solo servidor, node:fs + cache)
```

**Reglas:**

- **Nunca transcribir a mano** datos que están en [`docs/`](docs/). Ya se pagó: `components/design/cards-data.tsx` eran 97 cartas copiadas que empezaron a divergir del markdown, y por eso existe [`lib/card-catalog.ts`](lib/card-catalog.ts).
- **Validar en la frontera.** El parseo produce texto; el dominio necesita números y uniones. La conversión (`"1d8+2"` → tirada, `"Poco común"` → `Rarity`) se hace **una vez**, al construir el catálogo, y **falla ruidosamente en build** si una tabla está mal. El motor no debe defenderse de datos sucios.
- **El catálogo tiene que cruzar al cliente.** `card-catalog.ts` usa `node:fs`, así que no puede importarse desde un componente de cliente: un Server Component lo carga y lo pasa como props tipadas al proveedor del juego (alternativa: generar un JSON en build). Decidir al construir (§11).
- El motor recibe el catálogo **inyectado**. Así se puede testear con un catálogo mínimo de 3 cartas.

---

## 8. Reglas de ubicación

| Elemento | Dónde | Cuándo |
|---|---|---|
| Regla de juego, cálculo, azar | `lib/rules/` | Siempre. Sin excepción |
| Tipos del dominio de partida | `lib/rules/state.ts` | Modelo de juego |
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

Según [`PENDIENTE.md`](PENDIENTE.md) §5 y [`docs/status.md`](docs/status.md) §4, el prototipo existe **para balancear**, y todas las cifras son un primer pase que "solo se cierra jugando". Hay decisiones abiertas concretas esperando datos: si activar el +2 global de precisión (B3), si el reloj de 40 turnos cuadra con un mapa 12×12 (B4), la economía y el oro inicial (B5), y el residual de kiting con armas de alcance 4.

Con las reglas en funciones puras y deterministas se pueden responder **sin jugar a mano**:

1. **Tests unitarios del motor** — sin renderizar nada. Un ataque con Ventaja, el tope elástico de "en juego", que huir no recarga las Especiales.
2. **Partidas guionizadas** — una secuencia fija de acciones sobre una `seed` fija, comprobando el estado final. Detecta regresiones de reglas al tocar balance.
3. **Simulador headless** — N partidas con `seed` distinta y una política de juego sencilla, volcando métricas: tasa de muerte por héroe, turnos hasta el boss, cuántas partidas termina el reloj antes que el jugador, cuánto loot cae de verdad, si el kiting a alcance 4 gana siempre. Eso son minutos de CPU en vez de semanas de testeo manual.

Con la lógica dentro de componentes y hooks, **nada de esto es posible**: cada partida cuesta una persona y un navegador.

> **Pendiente de decidir:** no hay runner de tests instalado. Candidatos: el `node:test` que ya trae Node (cero dependencias, suficiente para funciones puras) o Vitest (mejor DX, watch, y sirve si algún día se testean componentes).

---

## 10. Anti-patrones

```text
❌ Math.random() / Date.now() dentro de lib/rules/        → rompe determinismo, replay y simulación
❌ Una regla de juego dentro de un componente             → intestable sin pantalla
❌ useState como fuente de verdad del estado de partida   → el estado vive en el motor
❌ Llamar al hook de partida en varios componentes        → instancias separadas = dos partidas
❌ "use client" en app/layout.tsx                         → arrastra toda la app al cliente
❌ node:fs importado desde código de cliente o del motor  → el catálogo se inyecta
❌ Transcribir a mano cifras que están en docs/*.md       → ya divergió una vez
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
| Contenedor de estado | `useReducer` + contexto · Zustand | **Empezar con `useReducer` + contexto**: el motor ya *es* un reductor, así que no aporta nada una librería. Si aparece prop-drilling o problemas de re-render, entra Zustand después sin tocar `lib/rules/` |
| Persistencia | `seed` + log de acciones · snapshot del estado | **Log**: más pequeño, da replay gratis y valida el determinismo. Snapshot como caché si rehidratar resulta lento |
| Catálogo en cliente | Props desde un Server Component · JSON generado en build | Decidir al construir `app/play/` |
| Runner de tests | `node:test` · Vitest | Ver §9 |
| Agrupar `lib/content/` | Ahora · cuando crezca `lib/rules/` | Cuando crezca (§3) |

---

## 12. Checklist antes de dar por bueno un módulo

- [ ] Las reglas están en `lib/rules/`, son puras y no usan `Math.random()`
- [ ] El azar pasa por el RNG con semilla del estado
- [ ] `applyAction` no muta la entrada
- [ ] Las jugadas ilegales devuelven `IllegalReason`, no lanzan ni devuelven `false`
- [ ] Hay `canPlay` para que la UI deshabilite sin duplicar reglas
- [ ] Los componentes reciben datos y suben callbacks; ninguno decide reglas
- [ ] El estado de partida se instancia una sola vez
- [ ] Props tipadas explícitamente, sin `React.FC`
- [ ] `"use client"` lo más abajo posible
- [ ] Las cifras salen de [`docs/`](docs/), no de una copia a mano
- [ ] Hay al menos un test unitario del invariante que este módulo introduce
- [ ] Los estilos usan tokens, no literales ([`AGENTS.md`](AGENTS.md))
