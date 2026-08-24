// Resolvedor puro (sin dependencias de Node) de los enlaces que aparecen dentro
// de los .md, para que la navegación cruzada entre documentos funcione dentro de
// la wiki. Testeable de forma aislada.
//
// Reglas:
//  - http(s)://, // y mailto:  -> externo (nueva pestaña)
//  - #ancla                    -> ancla en la misma página
//  - /ruta                     -> ya absoluta (p. ej. /assets/...)
//  - relativo a .md            -> ruta de wiki /docs/<slug>  (con README -> índice de carpeta)
//  - relativo a carpeta        -> ruta de wiki /docs/<slug>  (p. ej. "../v2/" -> /docs/v2)
//  - relativo que sale de docs/ -> fuera de la wiki: no se enlaza (ver "outside")
//  - otro relativo (con extensión) -> se sirve tal cual desde la raíz pública

export type ResolvedLink =
  | { kind: "internal"; href: string }
  | { kind: "external"; href: string }
  | { kind: "anchor"; href: string }
  /**
   * Apunta a un archivo del repositorio que está fuera de docs/ (p. ej.
   * knowledge/…): existe en disco y el enlace funciona leyendo el .md en el
   * editor, pero la wiki no lo sirve. Se pinta como texto, no como enlace, en
   * vez de fabricar un /docs/<algo> que da 404.
   */
  | { kind: "outside"; href: string }
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

/**
 * Une un directorio (relativo a docs/) con una ruta relativa. `escaped` avisa
 * de que la ruta sube por encima de docs/: normalizePosix se come esos ".."
 * sobrantes en silencio, y sin la marca un `../../knowledge/x.md` acabaría
 * como /docs/knowledge/x.
 */
export function joinPosix(dir: string, rel: string): { path: string; escaped: boolean } {
  const out: string[] = [];
  let escaped = false;
  for (const part of ((dir ? dir + "/" : "") + rel).split("/")) {
    if (part === "" || part === ".") continue;
    if (part === "..") {
      if (out.length === 0) escaped = true;
      else out.pop();
    } else out.push(part);
  }
  return { path: out.join("/"), escaped };
}

/**
 * Convierte una ruta de archivo relativa a docs/ (sin extensión) en la ruta de
 * wiki, normalizando README como índice de su carpeta.
 * "cards/README" -> "/docs/cards" ; "game-design" -> "/docs/game-design"
 */
export function docPathToRoute(pathNoExt: string): string {
  const slug = pathNoExt.replace(/\/README$/i, "").replace(/^README$/i, "");
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

  const { path: resolved, escaped } = joinPosix(currentDir, pathPart);

  // Sale de docs/: es un archivo del repositorio que la wiki no sirve.
  if (escaped) {
    return { kind: "outside", href: pathPart + hash };
  }

  if (/\.mdx?$/i.test(resolved)) {
    const noExt = resolved.replace(/\.mdx?$/i, "");
    return { kind: "internal", href: docPathToRoute(noExt) + hash };
  }

  // Carpeta de la wiki: "../v2/" o "board" apuntan al índice de esa carpeta,
  // igual que hace el enlace en el editor. Se reconocen por no llevar
  // extensión (o acabar en "/"), que es lo único que las distingue de un
  // recurso.
  if (pathPart.endsWith("/") || !/\.[a-z0-9]+$/i.test(pathPart)) {
    return { kind: "internal", href: docPathToRoute(resolved) + hash };
  }

  // Recurso relativo no-markdown: servir desde la raíz pública.
  return { kind: "raw", href: "/" + resolved + hash };
}
