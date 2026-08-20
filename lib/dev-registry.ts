// =========================================================================
// Registro de módulos de /dev — la construcción de V3
//
// Espejo de lib/lab-registry.ts, que hace lo mismo para los laboratorios del
// motor v2. Misma mecánica: de aquí comen el hub (app/dev) y el menú lateral,
// y añadir un módulo son dos pasos —una entrada aquí y su página en
// app/dev/<slug>/.
//
// Hoy está entero en "planificado" a propósito: `lib/v3/` está vacío y el
// motor de V3 todavía no está definido (docs/v3/game-design.md §4). El hub
// hace de hoja de ruta visible mientras tanto, igual que ya hacía /lab con
// sus entradas apagadas — así lo que falta por construir se ve en la propia
// aplicación y no hay que mantener la lista en otro sitio.
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
      "La anatomía común a héroes, unidades y enemigos: las 8 Habilidades con su valor, la lista de Características y el alcance. Es el sustrato del que dependen todos los demás.",
    icon: "pi pi-id-card",
    status: "planificado",
    doc: { href: "/docs/v3/razas", label: "Razas · Habilidades y Características" },
    blocker:
      "Faltan los valores numéricos de las 8 Habilidades y decidir dónde vive el alcance.",
  },
  {
    slug: "combate",
    label: "Motor de combate",
    summary:
      "Resolución sin dados: si puedes atacar, si aciertas, si es crítico y cuánto daño haces. Más iniciativa por Velocidad y el reparto entre Defensa y Resistencia mágica.",
    icon: "pi pi-bolt",
    status: "planificado",
    doc: { href: "/docs/v3/game-design", label: "Diseño del juego §4" },
    blocker: "El motor todavía no está definido en la wiki. Bloquea todo el catálogo de cartas.",
  },
  {
    slug: "estados",
    label: "Estados y efectos",
    summary:
      "Los efectos temporales que aplican las Características al golpear —Quemadura, Envenenamiento, Congelación, Hemorragia— definidos sobre Habilidades y no sobre tiradas.",
    icon: "pi pi-sparkles",
    status: "planificado",
    doc: { href: "/docs/v3/effects", label: "Efectos y estados" },
    blocker: "Depende del motor de combate.",
  },
  {
    slug: "razas",
    label: "Razas y unidades",
    summary:
      "Las 10 razas con sus 4 clases y su progresión de 8 unidades, en datos: el catálogo que consultan el reclutamiento, el mazo y la composición de enemigos.",
    icon: "pi pi-sitemap",
    status: "planificado",
    doc: { href: "/docs/v3/razas", label: "Razas" },
    blocker: "Falta la ficha de personaje y decidir si se reclutan unidades de otras razas.",
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
      "Los dos tableros separados de V3: el de exploración y el de batalla. La geometría hexagonal ya existe en el motor v2 y está por decidir si se comparte o se reescribe.",
    icon: "pi pi-map",
    status: "planificado",
    doc: { href: "/docs/v3/board/board-map", label: "Tablero de exploración" },
    blocker: "Ninguno de los dos tableros está definido en la wiki.",
  },
];

/** Un módulo se puede visitar cuando existe su página. */
export function isAvailable(m: DevModule): boolean {
  return m.status !== "planificado";
}
