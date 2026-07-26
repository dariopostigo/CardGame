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

export type LabStatus = "listo" | "en-curso" | "planificado";

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

export const LAB_STATUS_LABEL: Record<LabStatus, string> = {
  listo: "Listo",
  "en-curso": "En curso",
  planificado: "Planificado",
};

// El orden importa: primero la pieza, luego el tablero que se monta con ella.
export const DEV_LABS: readonly DevLab[] = [
  {
    slug: "losetas",
    label: "Losetas",
    summary:
      "La pieza: su forma en uno de los cinco tamaños, el terreno de cada hexágono y las anclas por las que se une a otra. Catálogo girando en vivo y boceto para maquetar losetas nuevas.",
    icon: "pi pi-box",
    status: "en-curso",
    doc: { href: "/docs/board/board-map", label: "Tablero y mapa §2" },
  },
  {
    slug: "tablero",
    label: "Generación de tablero",
    summary:
      "El encaje: cuántas losetas, cómo se unen por sus anclas, hacia dónde crece la silueta, Guarida y Pueblo garantizados y siembra de fichas.",
    icon: "pi pi-map",
    status: "en-curso",
    doc: { href: "/docs/board/board-map", label: "Tablero y mapa §2c" },
  },
  {
    slug: "semillas",
    label: "Semillas y determinismo",
    summary:
      "Comparador de semillas: generar en lote, medir travesía, reparto de terreno y fichas, y comprobar que una semilla reproduce la partida exacta.",
    icon: "pi pi-hashtag",
    status: "planificado",
  },
  {
    slug: "fichas",
    label: "Diseño de fichas",
    summary:
      "Las 6 fichas del tablero y las localizaciones: iconografía, legibilidad sobre cada terreno y estados (sin explorar, detectada, resuelta).",
    icon: "pi pi-circle-fill",
    status: "planificado",
    doc: { href: "/docs/board/board-map", label: "Fichas del tablero" },
  },
  {
    slug: "baraja",
    label: "Baraja y Oteo",
    summary:
      "Mazo, zona «en juego» con tope elástico y el Oteo de 2 cartas por turno. Es donde se prueba la regla madre: jugar una carta la devuelve al Mazo.",
    icon: "pi pi-clone",
    status: "planificado",
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
      "Miles de partidas sin pantalla para cerrar las cifras: tasa de muerte por héroe, turnos hasta el boss y si el reloj llega antes que el jugador.",
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
