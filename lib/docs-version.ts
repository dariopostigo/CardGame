// Las dos versiones de la wiki, en un módulo aparte de lib/docs.ts.
//
// Vive separado por una razón concreta, no por orden: lib/docs.ts usa node:fs
// y es solo-servidor, pero la cabecera, las migas y el buscador son
// componentes cliente que necesitan saber en qué versión están. Importar
// estos helpers desde lib/docs.ts metería `fs` en el bundle del navegador y
// el build falla. Aquí no hay nada que no pueda cruzar esa frontera.

export type DocsVersion = "v2" | "v3";

/** En orden de aparición: la vigente primero. */
export const DOCS_VERSIONS: readonly DocsVersion[] = ["v3", "v2"];

/**
 * La versión con la que se abre la wiki. Es a donde redirige /docs y donde
 * apunta el apartado Wiki de la portada (lib/sections.ts) — que lleva la ruta
 * escrita a mano, así que cambiar esto obliga a cambiarla también.
 */
export const DEFAULT_DOCS_VERSION: DocsVersion = "v3";

export const VERSION_LABEL: Record<DocsVersion, string> = { v3: "V3", v2: "v2" };

export function isDocsVersion(v: string): v is DocsVersion {
  return v === "v2" || v === "v3";
}

/** La versión a la que pertenece una ruta de la wiki, si pertenece a alguna. */
export function versionOfRoute(pathname: string): DocsVersion | null {
  const seg = pathname.split("/").filter(Boolean)[1];
  return seg && isDocsVersion(seg) ? seg : null;
}
