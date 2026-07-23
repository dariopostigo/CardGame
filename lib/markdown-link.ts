// Resolvedor puro (sin dependencias de Node) de los enlaces que aparecen dentro
// de los .md, para que la navegación cruzada entre documentos funcione dentro de
// la wiki. Testeable de forma aislada.
//
// Reglas:
//  - http(s)://, // y mailto:  -> externo (nueva pestaña)
//  - #ancla                    -> ancla en la misma página
//  - /ruta                     -> ya absoluta (p. ej. /assets/...)
//  - relativo a .md            -> ruta de wiki /docs/<slug>  (con README -> índice de carpeta)
//  - otro relativo             -> se sirve tal cual desde la raíz pública

export type ResolvedLink =
  | { kind: "internal"; href: string }
  | { kind: "external"; href: string }
  | { kind: "anchor"; href: string }
  | { kind: "raw"; href: string };

/** Normaliza una ruta POSIX resolviendo "." y "..". */
export function normalizePosix(p: string): string {
  const out: string[] = [];
  for (const part of p.split("/")) {
    if (part === "" || part === ".") continue;
    if (part === "..") out.pop();
    else out.push(part);
  }
  return out.join("/");
}

/** Une un directorio (relativo a docs/) con una ruta relativa. */
export function joinPosix(dir: string, rel: string): string {
  return normalizePosix((dir ? dir + "/" : "") + rel);
}

/**
 * Convierte una ruta de archivo relativa a docs/ (sin extensión) en la ruta de
 * wiki, normalizando README como índice de su carpeta.
 * "cards/README" -> "/docs/cards" ; "game-design" -> "/docs/game-design"
 */
export function docPathToRoute(pathNoExt: string): string {
  let slug = pathNoExt.replace(/\/README$/i, "").replace(/^README$/i, "");
  return "/docs" + (slug ? "/" + slug : "");
}

/**
 * Resuelve un href de markdown contra el directorio del documento actual.
 * @param href       el href tal cual aparece en el markdown
 * @param currentDir directorio del doc actual, relativo a docs/ ("" para raíz)
 */
export function resolveLink(href: string, currentDir: string): ResolvedLink {
  if (!href) return { kind: "raw", href: "" };

  if (/^(https?:)?\/\//i.test(href) || href.startsWith("mailto:")) {
    return { kind: "external", href };
  }
  if (href.startsWith("#")) {
    return { kind: "anchor", href };
  }
  if (href.startsWith("/")) {
    return { kind: "raw", href };
  }

  const hashIndex = href.indexOf("#");
  const pathPart = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
  const hash = hashIndex >= 0 ? href.slice(hashIndex) : "";

  const resolved = joinPosix(currentDir, pathPart);

  if (/\.mdx?$/i.test(resolved)) {
    const noExt = resolved.replace(/\.mdx?$/i, "");
    return { kind: "internal", href: docPathToRoute(noExt) + hash };
  }

  // Recurso relativo no-markdown: servir desde la raíz pública.
  return { kind: "raw", href: "/" + resolved + hash };
}
