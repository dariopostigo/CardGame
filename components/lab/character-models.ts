// =========================================================================
// Catálogo de modelos 3D del laboratorio de personaje — /lab/character
//
// Datos puros, sin Three.js: de aquí come el selector de CharacterLab.tsx y
// la carga de character-scene.ts. Separado del motor por lo mismo que
// dice-geometry.ts está separado de dice-scene.ts — la lista de qué se puede
// cargar no necesita arrastrar WebGL.
//
// Son modelos PRESTADOS de prueba (licencias en public/assets/models/
// README.md), no arte del juego: están para validar el pipeline
// «IA 3D → auto-rig → animaciones de biblioteca → .glb → navegador» antes de
// generar los personajes de verdad. Al haber modelos propios, esta lista
// cambia y los prestados se van.
// =========================================================================

export type CharacterModel = {
  readonly id: string;
  readonly label: string;
  /** Ruta servida desde public/. */
  readonly url: string;
  /** Humanoide o cuadrúpedo: los dos casos que cubre un auto-rig de IA. */
  readonly rig: "humanoide" | "cuadrúpedo";
  /** Tamaño del archivo en disco, en bytes. Lo pone el catálogo porque
   *  GLTFLoader no lo reporta y el peso es justo una de las cosas a juzgar. */
  readonly bytes: number;
  /** Clip que se reproduce al cargar, si existe. */
  readonly defaultClip: string;
  readonly credit: string;
};

export const CHARACTER_MODELS: readonly CharacterModel[] = [
  {
    id: "robot",
    label: "Robot",
    url: "/assets/models/robot-expressive.glb",
    rig: "humanoide",
    bytes: 463988,
    defaultClip: "Idle",
    credit: "Tomás Laulhé · CC0",
  },
  {
    id: "fox",
    label: "Zorro",
    url: "/assets/models/fox.glb",
    rig: "cuadrúpedo",
    bytes: 162852,
    defaultClip: "Survey",
    credit: "PixelMannen · CC0 / rig de tomkranis · CC-BY 4.0",
  },
];

export const MODELS_BY_ID: Readonly<Record<string, CharacterModel>> = Object.fromEntries(
  CHARACTER_MODELS.map((m) => [m.id, m]),
);

export function formatBytes(bytes: number): string {
  return bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.round(bytes / 1024)} KB`;
}
