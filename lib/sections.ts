// =========================================================================
// Los apartados del proyecto
//
// Fuente única de la navegación de primer nivel: de aquí comen la portada
// (app/page.tsx) y la cabecera de los marcos (SectionLinks.tsx). Antes los
// enlaces cruzados estaban escritos a mano en cada Shell, y con dos
// apartados se aguantaba; con varios, cada uno enlazando a los demás, son
// enlaces que se desincronizan solos.
//
// Cinco documentan el proyecto y se distinguen por DOS preguntas, y conviene
// no mezclarlas:
//
//   · qué documentan  → el juego sobre papel | el motor | una interfaz
//   · a quién visten  → a nosotros (herramientas) | al jugador (producto)
//
// Wiki, Dev y Lab responden a la primera; los dos repositorios a la segunda.
// Un repositorio de componentes es SIEMPRE una herramienta —el jugador nunca
// ve una galería—, así que repository-pro es un apartado de desarrollo que
// documenta producción. Por eso están al mismo nivel.
//
// Play es el sexto y no encaja en ese esquema: no documenta nada, es el juego
// jugable. Está aquí para compartir la misma cabecera de acceso directo que
// los demás, no porque comparta su lógica.
//
// LA WIKI ES UNA SOLA, aunque el diseño esté partido en dos versiones
// (ARCHITECTURE.md, "El corte v2 / v3"). Se entra siempre por V3, la vigente,
// y a v2 se llega con el conmutador de la cabecera. Llegó a haber dos
// apartados —Wiki V3 y Wiki v2— y se descartó: v2 es archivo de consulta, no
// un destino que merezca una puerta propia en la portada, y dos entradas casi
// idénticas ensucian la cabecera sin ganar nada.
// =========================================================================

/** Estado de construcción, común a labs y a familias de componentes. */
export type BuildStatus = "listo" | "en-curso" | "planificado";

export const BUILD_STATUS_LABEL: Record<BuildStatus, string> = {
  listo: "Listo",
  "en-curso": "En curso",
  planificado: "Planificado",
};

export type SectionId =
  | "wiki"
  | "dev"
  | "lab"
  | "repository-dev"
  | "repository-pro"
  | "play";

export type Section = {
  readonly id: SectionId;
  /** Raíz de la sección. Todo lo que cuelgue de aquí pertenece a ella. */
  readonly href: string;
  /** Nombre largo: portada. */
  readonly label: string;
  /** Nombre corto: cabecera y migas, donde no cabe el largo. */
  readonly short: string;
  /** Qué es, en una frase, para la tarjeta de la portada. */
  readonly summary: string;
  /** Icono de PrimeIcons. */
  readonly icon: string;
};

export const SECTIONS: readonly Section[] = [
  {
    id: "wiki",
    // Entra directo en V3, la versión vigente. A v2 se llega con el
    // conmutador de la cabecera (components/wiki/VersionSwitch.tsx), no desde
    // aquí: es archivo, no un segundo destino de primer nivel.
    href: "/docs/v3",
    label: "Wiki",
    short: "Wiki",
    summary:
      "El juego sobre papel: razas, Habilidades, Características, unidades y cartas. Es la fuente de verdad del diseño. Abre en V3; la v2 congelada queda a un clic.",
    icon: "pi pi-book",
  },
  {
    id: "dev",
    href: "/dev",
    label: "Dev",
    short: "Dev",
    summary:
      "La construcción de V3: ficha de personaje, motor de combate, razas y tableros. Todavía sin nada implementado — hoy es el mapa de lo que falta.",
    icon: "pi pi-code",
  },
  {
    id: "lab",
    href: "/lab",
    label: "Lab",
    short: "Lab",
    summary:
      "Los laboratorios del motor v2: losetas, generación de tablero, fichas, baraja, combate y animaciones. Cada pieza aislada del resto.",
    icon: "pi pi-slack",
  },
  {
    id: "repository-dev",
    href: "/repository-dev",
    label: "Repositorio de desarrollo",
    short: "Repo. dev",
    summary:
      "Los controles con los que están hechas la wiki y los laboratorios: botones, campos, selectores, títulos y textos. La piel sobria, la que vemos nosotros.",
    icon: "pi pi-th-large",
  },
  {
    id: "repository-pro",
    href: "/repository-pro",
    label: "Repositorio de producción",
    short: "Repo. pro",
    summary:
      "Los componentes que verá el jugador, con tema medieval: pergamino, hierro y madera. Por construir: hoy es el índice de lo que hará falta.",
    icon: "pi pi-shield",
  },
  {
    id: "play",
    href: "/play",
    label: "Play",
    short: "Play",
    summary:
      "El juego jugable: hub, partidas y tablero en marcha sobre el motor. Aquí se junta lo que ya maduró en los laboratorios.",
    icon: "pi pi-play",
  },
];

export const SECTIONS_BY_ID: Readonly<Record<SectionId, Section>> = Object.fromEntries(
  SECTIONS.map((s) => [s.id, s]),
) as Record<SectionId, Section>;

/** Los demás apartados: lo que va en la cabecera de cada marco. */
export function otherSections(current: SectionId): readonly Section[] {
  return SECTIONS.filter((s) => s.id !== current);
}
