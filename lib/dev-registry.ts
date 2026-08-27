// =========================================================================
// Registro de módulos de /dev — la construcción de V3
//
// Espejo de lib/lab-registry.ts, que hace lo mismo para los laboratorios del
// motor v2. Misma mecánica: de aquí comen el hub (app/dev) y el menú lateral,
// y añadir un módulo son dos pasos —una entrada aquí y su página en
// app/dev/<slug>/.
//
// Casi todo sigue en "planificado", y por un motivo que no es el diseño sino
// los datos: el motor SÍ está escrito en la wiki (docs/v3/game-design.md §4,
// con sus diales fijados el 23-ago-2026), pero sin los valores de las 8
// Habilidades no hay ficha que ejecutar. El hub hace de hoja de ruta visible
// mientras tanto, igual que ya hacía /lab con sus entradas apagadas — así lo
// que falta por construir se ve en la propia aplicación y no hay que mantener
// la lista en otro sitio.
//
// El primero que arrancó fue el TABLERO, el 27 de agosto de 2026, y por ser el
// único que no espera datos: la arena de battle.md §1 es geometría, así que se
// puede construir y medir sin una sola ficha. Rompe el orden de dependencia de
// la lista a propósito — no es que se haya adelantado, es que no depende de
// nadie.
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
      "Los dos tableros separados de V3. Construida la ARENA de batalla, en cuatro tamaños desde el mínimo de 14×12: suelo como lámina continua y rejilla en trazo encima, siguiendo la dirección de arte, con las bandas y los alcances marcados con contorno. Encima está el FORMATO del §2 —co-op de uno a tres jugadores, cinco fichas cada uno—, el DESPLIEGUE libre del §3 en la banda compartida, y el RITMO DE LA APROXIMACIÓN con el 👢 Movimiento repartido por tipo de daño y la persecución del arquero medida. El de exploración sigue siendo un esqueleto.",
    icon: "pi pi-map",
    status: "en-curso",
    doc: { href: "/docs/v3/board/battle", label: "Tablero de batalla" },
    blocker:
      "Ninguno de geometría: el 27 de agosto se cerró que el tablero es grande, que la aproximación larga es la intención y que lo que se adapta es 👢 Movimiento (🗡️ alto, 🏹 bajo), no los alcances. Lo que falta: el movimiento en código (lib/v3/movement.ts), la ilustración del campo, y el bando enemigo de verdad —que espera una decisión, cuántas fichas y cuántos héroes trae la máquina contra uno, dos o tres jugadores—. Iniciativa y turno siguen esperando los valores de las 8 Habilidades.",
  },
];

/** Un módulo se puede visitar cuando existe su página. */
export function isAvailable(m: DevModule): boolean {
  return m.status !== "planificado";
}
