// =========================================================================
// Registro de laboratorios de /dev
//
// Fuente única de la sección de desarrollo: de aquí comen el hub (app/dev)
// y el menú lateral. Añadir un laboratorio nuevo son dos pasos: una entrada
// en esta lista y su página en app/dev/<slug>/.
//
// Los laboratorios en estado "planificado" salen listados y apagados: el hub
// es también el mapa de ruta de lo que falta por construir, y así no hay que
// mantener la lista de pendientes en otro sitio.
// =========================================================================

import { BUILD_STATUS_LABEL, type BuildStatus } from "./sections";

// El estado de construcción es el mismo concepto aquí y en los repositorios de
// componentes (lib/repository.ts), así que vive una sola vez, en el registro de
// apartados. El alias se queda para no reescribir a los consumidores de /dev.
export type LabStatus = BuildStatus;

export type DevLab = {
  /** Segmento de URL: /dev/<slug>. */
  readonly slug: string;
  readonly label: string;
  /** Qué se prueba aquí, en una frase. */
  readonly summary: string;
  /** Icono de PrimeIcons. */
  readonly icon: string;
  readonly status: LabStatus;
  /** Documento de diseño de referencia, si lo tiene. */
  readonly doc?: { href: string; label: string };
};

export const LAB_STATUS_LABEL = BUILD_STATUS_LABEL;

// El orden importa: primero la loseta, luego el tablero que se monta con ellas,
// y luego las fichas que se ponen encima del tablero ya montado.
export const DEV_LABS: readonly DevLab[] = [
  {
    slug: "losetas",
    label: "Losetas",
    summary:
      "La pieza: su forma en uno de los cinco tamaños, el terreno de cada hexágono y las anclas por las que se une a otra. Biblioteca de tipos y variantes, editable: se guarda en disco.",
    icon: "pi pi-box",
    status: "en-curso",
    doc: { href: "/docs/board/board-map", label: "Tablero y mapa §2" },
  },
  // El LOTE de semillas no es un laboratorio aparte: es este mismo generador con
  // estos mismos mandos, mirando el reparto de cientos de tableros en vez del
  // ejemplar que tienes delante. Duplicarlo en su propia pantalla sería duplicar
  // el panel de mandos. Y "misma semilla → mismo tablero" no es una pantalla, es
  // una comprobación de una línea. Lo que sí es de otro sitio es "misma semilla →
  // misma PARTIDA" (robo de cartas, loot, IA, reloj): eso lo prueba el simulador,
  // porque son partidas y no tableros.
  {
    slug: "tablero",
    label: "Generación de tablero",
    summary:
      "El encaje: cuántas losetas, cómo se unen por sus anclas, hacia dónde crece la silueta, la Guarida del boss y la siembra de fichas. Nada se repinta: el tablero es el catálogo, así que si no sale Pueblo es que el encaje no lo ha traído. Aquí entra también el lote de semillas —cientos de tableros de golpe para ver el reparto y no el ejemplar—, que es lo que queda por construir.",
    icon: "pi pi-map",
    status: "en-curso",
    doc: { href: "/docs/board/board-map", label: "Tablero y mapa §2c" },
  },
  {
    slug: "pieces",
    label: "Diseño de fichas",
    summary:
      "La pieza que se pone encima: las 6 fichas de contenido y las 3 de personaje, todas en el mismo disco tumbado. Dibujo vectorial, legibilidad a tamaño de partida sobre los siete terrenos, y los estados de la niebla más la ficha ya resuelta.",
    icon: "pi pi-circle-fill",
    status: "en-curso",
    doc: { href: "/docs/board/board-map", label: "Tablero y mapa §4c" },
  },
  {
    slug: "baraja",
    label: "Baraja y Oteo",
    summary:
      "Mazo, zona «en juego» con tope elástico y el Oteo de 2 cartas por turno. Es donde se prueba la regla madre: jugar una carta la devuelve al Mazo.",
    icon: "pi pi-clone",
    status: "en-curso",
    doc: { href: "/docs/game-design", label: "Mazo y Oteo" },
  },
  {
    slug: "movimiento",
    label: "Movimiento y visión",
    summary:
      "Los 2 puntos de movimiento contra el coste de cada terreno, y los dos radios de visión que abren las dos capas de niebla.",
    icon: "pi pi-directions",
    status: "planificado",
    doc: { href: "/docs/game-design", label: "Movimiento y visión" },
  },
  {
    slug: "combate",
    label: "Combate",
    summary:
      "Iniciativa, adyacencia, ataque y estados, con el árbol de prioridades de la IA enemiga y el tope de 2 enemigos activos.",
    icon: "pi pi-bolt",
    status: "planificado",
    doc: { href: "/docs/characters/enemies", label: "Enemigos" },
  },
  {
    slug: "animaciones",
    label: "Animaciones",
    summary:
      "Cómo se ven las transiciones: revelar un hexágono, robar y preparar carta, impacto en combate, subida del Nivel de Amenaza.",
    icon: "pi pi-sparkles",
    status: "planificado",
  },
  {
    slug: "simulador",
    label: "Simulador de balance",
    summary:
      "Miles de partidas sin pantalla para cerrar las cifras: tasa de muerte por héroe, turnos hasta el boss y si el reloj llega antes que el jugador. Es también donde se comprueba el determinismo de verdad: que una semilla reproduce la partida exacta, robo de cartas y loot incluidos.",
    icon: "pi pi-chart-bar",
    status: "planificado",
    doc: { href: "/docs/status", label: "Estado del diseño" },
  },
];

export const LABS_BY_SLUG: Readonly<Record<string, DevLab>> = Object.fromEntries(
  DEV_LABS.map((l) => [l.slug, l]),
);

/** Los que ya tienen página: el resto se listan apagados. */
export function isAvailable(lab: DevLab): boolean {
  return lab.status !== "planificado";
}
