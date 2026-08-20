// =========================================================================
// Registro del menú del hub (app/play/)
//
// Mismo patrón que lib/lab-registry.ts y lib/repository.ts: una entrada aquí +
// su página en app/play/<slug>/. Las entradas "planificado" salen listadas
// y apagadas en el hub en vez de desaparecer, para no esconder lo que falta.
// =========================================================================

import { type BuildStatus } from "./sections";

export type HubMenuEntry = {
  /** Segmento de URL: /play/<slug>. Vacío ("") para "Nuevo juego", que hoy es la portada del setup. */
  readonly slug: string;
  readonly label: string;
  readonly icon: string;
  readonly status: BuildStatus;
};

export const HUB_MENU: readonly HubMenuEntry[] = [
  { slug: "new-game", label: "Nuevo juego", icon: "pi pi-play", status: "en-curso" },
  { slug: "load-game", label: "Cargar partida", icon: "pi pi-folder-open", status: "planificado" },
  { slug: "heroes", label: "Héroes", icon: "pi pi-shield", status: "planificado" },
  { slug: "friends", label: "Amigos", icon: "pi pi-users", status: "planificado" },
  { slug: "collection", label: "Colección", icon: "pi pi-clone", status: "planificado" },
];

export function isHubEntryAvailable(entry: HubMenuEntry): boolean {
  return entry.status !== "planificado";
}
