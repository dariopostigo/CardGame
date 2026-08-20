// =========================================================================
// Registro de los dos repositorios de componentes
//
// Un repositorio es un catálogo de piezas de interfaz agrupadas por familia:
// se entra a ver cómo se ve un botón, no cómo funciona el motor. Hay dos
// porque hay DOS PIELES que no comparten nada visual:
//
//   · repository-dev → la piel sobria de nuestras herramientas (wiki y labs).
//     PrimeReact sobre el skin --wiki-*, con modo claro y oscuro.
//   · repository-pro → la piel medieval del juego. Pergamino, hierro, madera,
//     sin modo claro: es diegética, no es "chrome". Está por construir.
//
// Lo que sí comparten es el marco (RepoShell) y esta lista, igual que los
// laboratorios comparten LabShell y lib/lab-registry.ts. Añadir una familia son
// dos pasos: una entrada aquí y su página en app/repository-<side>/<slug>/.
//
// Regla que sostiene todo esto: una galería ENSEÑA los componentes de verdad,
// nunca copias suyas. Si un especimen de aquí se pinta con marcado propio,
// deja de documentar y empieza a mentir en cuanto el componente cambie.
// =========================================================================

import { type BuildStatus } from "./sections";

export type RepoSide = "dev" | "pro";

export type ComponentGroup = {
  /** Segmento de URL: /repository-<side>/<slug>. */
  readonly slug: string;
  readonly label: string;
  /** Qué hay dentro, en una frase. */
  readonly summary: string;
  /** Icono de PrimeIcons. */
  readonly icon: string;
  readonly status: BuildStatus;
  /** Dónde viven estos componentes en el repo, si ya existen. */
  readonly source?: string;
};

// --- Lado desarrollo: la piel de las herramientas -------------------------
// El orden va de lo más básico a lo más compuesto: primero la letra, luego
// lo que se pulsa, luego lo que se rellena.
export const REPO_DEV_GROUPS: readonly ComponentGroup[] = [
  {
    slug: "typography",
    label: "Títulos y textos",
    summary:
      "La escala de títulos, el cuerpo de texto, los rótulos de sección, el texto atenuado, el código en línea y los enlaces. Todo sobre el skin claro/oscuro.",
    icon: "pi pi-align-left",
    status: "listo",
    source: "styles/components/_prose.scss",
  },
  {
    slug: "buttons",
    label: "Botones y acciones",
    summary:
      "El botón de las herramientas en sus cuatro variantes, con el estado activo de las conmutaciones, los tamaños, el de solo icono y el deshabilitado.",
    icon: "pi pi-stop",
    status: "listo",
    source: "components/ui/Button.tsx",
  },
  {
    slug: "forms",
    label: "Campos y controles",
    summary:
      "Texto, área de texto, número, desplegable, radios, grupo de botones, casillas, interruptor y deslizador: los controles con los que se manejan los paneles de mando de los labs, vestidos con el tema Lara ámbar de PrimeReact 10 en claro y oscuro.",
    icon: "pi pi-sliders-h",
    status: "en-curso",
    source: "primereact/* + styles/vendor/_primereact.scss",
  },
  {
    slug: "surfaces",
    label: "Superficies y avisos",
    summary:
      "Tarjetas, paneles, separadores, el callout de la wiki, las mini-cartas de rareza y severidad, y los mensajes de aviso y error.",
    icon: "pi pi-window-maximize",
    status: "planificado",
    source: "styles/components/_callout.scss, _chip.scss",
  },
  {
    slug: "navigation",
    label: "Navegación",
    summary:
      "Menú lateral, migas de pan, pestañas, buscador y el interruptor de tema: el esqueleto que comparten los cuatro apartados.",
    icon: "pi pi-directions",
    status: "planificado",
    source: "components/wiki/, components/nav/",
  },
  {
    slug: "data",
    label: "Tablas y datos",
    summary:
      "Tablas de la wiki, listas, estados vacíos y los indicadores numéricos que usan los labs para medir reparto de terreno y travesía.",
    icon: "pi pi-table",
    status: "planificado",
  },
  {
    slug: "iconography",
    label: "Iconografía",
    summary:
      "El juego de PrimeIcons que se usa de verdad —y con qué significado— para no tener tres iconos distintos para la misma idea.",
    icon: "pi pi-heart",
    status: "planificado",
  },
];

// --- Lado producción: la piel medieval -----------------------------------
// Todo planificado a propósito: aquí no hay nada construido todavía y el
// índice es la lista de lo que hará falta cuando exista app/play/. El primer
// grupo es el que desbloquea a los demás: sin tokens no hay tema.
export const REPO_PRO_GROUPS: readonly ComponentGroup[] = [
  {
    slug: "foundations",
    label: "Fundamentos del tema",
    summary:
      "El mapa $game: cuero y hierro casi negros, sangre como acento y oro para el texto grabado —inspirado en public/concepts/UI/example1.jpg, no en el pergamino del primer boceto—, más la tipografía de rótulo (Oswald) y de cuerpo. Sin esto no hay tema, solo componentes sueltos.",
    icon: "pi pi-palette",
    status: "en-curso",
    source: "styles/settings/_game.scss",
  },
  {
    slug: "typography",
    label: "Títulos y textos",
    summary:
      "Rótulos grabados —de titular y de panel—, cuerpo legible sobre cuero, texto secundario apagado y la cifra de las estadísticas. La letra del juego no es la letra de las herramientas.",
    icon: "pi pi-align-left",
    status: "en-curso",
    source: "styles/components/_game-typography.scss",
  },
  {
    slug: "buttons",
    label: "Botones y acciones",
    summary:
      "El remache con bisel de example1.jpg: botón neutro de acero/cuero y botón primario de sangre con halo, con sus estados de reposo, sobre, pulsado y sin puntos de acción.",
    icon: "pi pi-stop",
    status: "en-curso",
    source: "components/game/ui/GameButton.tsx",
  },
  {
    slug: "panels",
    label: "Paneles y pergaminos",
    summary:
      "Marcos de madera con esquinas herradas, pergaminos desplegables, secciones del HUD y el fondo de las ventanas de diálogo.",
    icon: "pi pi-window-maximize",
    status: "planificado",
  },
  {
    slug: "forms",
    label: "Campos y selectores",
    summary:
      "Casillas, radios, interruptores, desplegables, campos de texto y deslizadores vestidos de época, para los ajustes y la creación de partida. Todos revisten componentes reales de PrimeReact.",
    icon: "pi pi-sliders-h",
    status: "en-curso",
    source:
      "components/game/ui/GameCheckbox.tsx, GameRadio.tsx, GameSwitch.tsx, GameSelect.tsx, GameInput.tsx, GameSlider.tsx",
  },
  {
    slug: "hud",
    label: "HUD de partida",
    summary:
      "Puntos de vida, Nivel de Amenaza, oro, estados del héroe y el reloj de la partida: los indicadores que están siempre en pantalla.",
    icon: "pi pi-heart-fill",
    status: "planificado",
  },
  {
    slug: "cards",
    label: "Cartas y mazo",
    summary:
      "La carta ya tiene su laboratorio dentro de la wiki; aquí entran el mazo, la zona «en juego», el Oteo y las animaciones de robo.",
    icon: "pi pi-clone",
    status: "planificado",
    source: "components/design/GameCard.tsx",
  },
  {
    slug: "board",
    label: "Piezas del tablero",
    summary:
      "Hexágono, terreno, las dos capas de niebla y las fichas. Existen como componentes de laboratorio; aquí se documenta su versión de producción.",
    icon: "pi pi-map",
    status: "planificado",
    source: "components/game/board/",
  },
  {
    slug: "feedback",
    label: "Avisos y diálogos",
    summary:
      "Tostadas de suceso, confirmaciones, el aviso de subida de Amenaza y las pantallas de victoria y derrota.",
    icon: "pi pi-comment",
    status: "planificado",
  },
];

export function groupsOf(side: RepoSide): readonly ComponentGroup[] {
  return side === "dev" ? REPO_DEV_GROUPS : REPO_PRO_GROUPS;
}

/** Los que ya tienen página: el resto se listan apagados, como en /dev. */
export function isBuilt(group: ComponentGroup): boolean {
  return group.status !== "planificado";
}

export function groupBySlug(side: RepoSide, slug: string): ComponentGroup | undefined {
  return groupsOf(side).find((g) => g.slug === slug);
}
