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
// El segundo fue la ANIMACIÓN, el 31 de agosto de 2026, y por lo mismo: una
// caída no necesita saber cuánto pega la ficha que cae. Va la última de la
// lista pero no es la última en importancia — es la única entrada que no
// construye una regla sino una SENSACIÓN, y la que decide si esto parece un
// videojuego o una web que aplica un reglamento.
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
    blocker:
      "Faltan siete de las 8 Habilidades en valores. 👢 Movimiento ya está: 🗡️ 3 · ✨ 2 · 🏹 1, banda por tipo de daño (31-ago), medida en el duelo del tablero.",
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
      "Los dos tableros separados de V3. Construida la ARENA de batalla, en cuatro tamaños desde el mínimo de 14×12: suelo como lámina continua y rejilla en trazo encima, siguiendo la dirección de arte, con las bandas y los alcances marcados con contorno. Encima está el FORMATO del §2 —co-op de uno a tres jugadores, cinco fichas cada uno—, el DESPLIEGUE libre del §3 en la banda compartida, y el RITMO DE LA APROXIMACIÓN con el 👢 Movimiento repartido por tipo de daño y la persecución del arquero medida. Enfrente hay un BANDO ENEMIGO de verdad —la máquina trae lo mismo que la mesa— y las fichas ya ANDAN: hasta 👢 Movimiento y sin atravesar a nadie (§5). El de exploración sigue siendo un esqueleto.",
    icon: "pi pi-map",
    status: "en-curso",
    doc: { href: "/docs/v3/board/battle", label: "Tablero de batalla" },
    blocker:
      "Ninguno de geometría, y lo que el tablero midió ya está en el documento: el bando enemigo se cierra en espejo, la victoria pasa a plural y desplegar apretado encierra a las tuyas (28-ago); el duelo del arquero jugado en 2D dio la banda de 👢 Movimiento —🗡️ 3 · ✨ 2 · 🏹 1, la primera cifra de las 8 Habilidades— (31-ago). Queda por construir la ilustración del campo, la segunda forma del bando enemigo (fauna u horda, §2) y el mismo bucle con quince fichas por bando, que el duelo 1 contra 1 no contesta. ⚡ Iniciativa y el turno siguen esperando las otras siete Habilidades.",
  },
  {
    slug: "animacion",
    label: "Animación",
    summary:
      "Cómo se SIENTE el juego, que es lo único de esta lista que no es una regla: soltar una carta y verla convertirse en ficha en el aire, la caída con su sombra y su polvo, el golpe con su embestida y su congelado, y la baja con su fogonazo. Están los TRES DESENLACES del §4.1 —fallo, impacto y crítico—, que en un juego sin dados en pantalla no son adorno sino el único canal por el que el jugador se entera de lo que ha pasado: la embestida es idéntica en los tres hasta el fotograma del contacto, y lo que separa fallar de criticar empieza ahí y ni un milisegundo antes. Diales en vivo para el vuelo, la curva de caída, el aplastado, el hit-stop, el temblor, el esquive, el congelado del crítico y las partículas, sobre un retal de quince hexágonos con la geometría y la cámara de la arena.",
    icon: "pi pi-play",
    status: "en-curso",
    doc: { href: "/docs/v3/game-design", label: "Diseño del juego §4.1" },
    blocker:
      "Ninguno, y es el segundo módulo que rompe el orden de dependencia por el mismo motivo que el tablero: no espera datos. Una caída no necesita saber cuánto pega la ficha. Lo que sí espera es al motor de combate, pero al revés de lo normal —no lo necesita para funcionar, es el motor el que va a tener que nacer emitiendo SUCESOS en vez de mutando estado, o nada de esto se podrá enseñar (lib/v3/anim.ts, `schedule`)—. De ese motor ya está escrito el primer trozo, y por necesidad de aquí: lib/v3/combat.ts resuelve la tirada del §4.1, que no depende de los valores de las 8 Habilidades. Lo que el banco pide a cambio es que `schedule()` aprenda a solapar: hoy es estrictamente secuencial, y el tic de estados al empezar el turno no cabe en fila.",
  },
];

/** Un módulo se puede visitar cuando existe su página. */
export function isAvailable(m: DevModule): boolean {
  return m.status !== "planificado";
}
