// =========================================================================
// Registro de módulos de /dev — la construcción de V3
//
// Espejo de lib/lab-registry.ts, que hace lo mismo para los laboratorios del
// motor v2. Misma mecánica: de aquí comen el hub (app/dev) y el menú lateral,
// y añadir un módulo son dos pasos —una entrada aquí y su página en
// app/dev/<slug>/.
//
// Hoy está entero en "planificado" a propósito: `lib/v3/` está vacío. El
// motor SÍ está escrito ya en la wiki (docs/v3/game-design.md §4, con sus
// diales fijados el 23-ago-2026), así que lo que frena ahora no es el diseño
// del motor sino los datos: sin los valores de las 8 Habilidades no hay ficha
// que ejecutar. El hub hace de hoja de ruta visible mientras tanto, igual que
// ya hacía /lab con sus entradas apagadas — así lo que falta por construir se
// ve en la propia aplicación y no hay que mantener la lista en otro sitio.
//
// El ORDEN es el de dependencia, no el de importancia: cada módulo necesita
// que el anterior esté resuelto. Sale de docs/v3/status.md §2.
// =========================================================================

import { BUILD_STATUS_LABEL, type BuildStatus } from "./sections";

export type DevModuleStatus = BuildStatus;

export type DevModule = {
  /** Segmento de URL: /dev/<slug>. */
  readonly slug: string;
  readonly label: string;
  /** Qué se construye aquí, en una frase. */
  readonly summary: string;
  /** Icono de PrimeIcons. */
  readonly icon: string;
  readonly status: DevModuleStatus;
  /** Documento de diseño que tiene que estar cerrado antes de construirlo. */
  readonly doc?: { href: string; label: string };
  /** Qué falta por decidir antes de poder empezar, si falta algo. */
  readonly blocker?: string;
};

export const DEV_STATUS_LABEL = BUILD_STATUS_LABEL;

export const DEV_MODULES: readonly DevModule[] = [
  {
    slug: "personaje",
    label: "Ficha de personaje",
    summary:
      "La anatomía común a héroes, unidades y enemigos: las 8 Habilidades con su valor, el tipo de daño con su alcance y la lista de Características. Es el sustrato del que dependen todos los demás.",
    icon: "pi pi-id-card",
    status: "planificado",
    doc: { href: "/docs/v3/razas", label: "Razas · Habilidades y Características" },
    blocker: "Faltan los valores numéricos de las 8 Habilidades.",
  },
  {
    slug: "combate",
    label: "Motor de combate",
    summary:
      "Resolución sin dados: una tirada oculta 1..100 contra dos umbrales —🎯 Precisión para acertar y 🍀 Suerte para el crítico—, mitigación porcentual por tipo de daño y orden de actuación por ⚡ Iniciativa.",
    icon: "pi pi-bolt",
    status: "planificado",
    doc: { href: "/docs/v3/game-design", label: "Diseño del juego §4" },
    blocker: "Ninguno de diseño: el motor está escrito y con sus diales fijados. Falta la ficha de personaje que ejecutar.",
  },
  {
    slug: "estados",
    label: "Estados y efectos",
    summary:
      "Los nueve estados temporales con su daño por turno, su duración y su acumulación: los elementales entran siempre, los de control los aplica el crítico, y solo una carta los quita antes de tiempo.",
    icon: "pi pi-sparkles",
    status: "planificado",
    doc: { href: "/docs/v3/effects", label: "Efectos y estados" },
    blocker: "Ninguno de diseño: el catálogo está escrito. Depende del motor de combate en código.",
  },
  {
    slug: "razas",
    label: "Razas y unidades",
    summary:
      "Las 11 razas con sus 4 clases y su progresión de 8 unidades, en datos: el catálogo que consultan el reclutamiento, el mazo y la composición de enemigos.",
    icon: "pi pi-sitemap",
    status: "planificado",
    doc: { href: "/docs/v3/razas", label: "Razas" },
    blocker: "Falta la ficha de personaje.",
  },
  {
    slug: "cartas",
    label: "Cartas",
    summary:
      "El catálogo de V3 leído del markdown, igual que hace hoy la wiki con v2: cartas de clase y de unidad con su bloque de Habilidades y Características.",
    icon: "pi pi-th-large",
    status: "planificado",
    doc: { href: "/docs/v3/cards", label: "Cartas" },
    blocker: "No hay ninguna carta escrita todavía.",
  },
  {
    slug: "tablero",
    label: "Tableros",
    summary:
      "Los dos tableros separados de V3. El de batalla ya está escrito: rejilla hexagonal 7×5 heredada de v2, cinco fichas por bando —héroe + 4 unidades—, una sola lista de ⚡ Iniciativa entrelazada y derrota si cae el héroe. El de exploración sigue siendo un esqueleto.",
    icon: "pi pi-map",
    status: "planificado",
    doc: { href: "/docs/v3/board/battle", label: "Tablero de batalla" },
    blocker:
      "El de batalla ya no bloquea de diseño; su primer prototipo va a campo abierto a propósito, sin obstáculos. Lo que falta es el de exploración, y de él cuelgan el terreno del campo y la retirada.",
  },
];

/** Un módulo se puede visitar cuando existe su página. */
export function isAvailable(m: DevModule): boolean {
  return m.status !== "planificado";
}
