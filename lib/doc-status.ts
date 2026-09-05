// =========================================================================
// El estado de un documento de la wiki
//
// Cuatro palabras para contestar de un vistazo, desde el menú, si algo hay
// que definirlo, está a medias, ya está o está parado. Se declara en el
// propio .md con una directiva en comentario, EN LA PRIMERA LÍNEA:
//
//     <!-- estado: a-medias -->
//
// Solo cuenta si está en la cabecera del archivo (lib/docs.ts la busca en las
// cinco primeras líneas), para que un documento pueda citarla —como hace
// docs/v3/cards/README.md— sin cambiarse el estado a sí mismo.
//
// Va en el documento y no en una tabla aparte a propósito: es lo único que
// no se puede desincronizar de lo que describe, y se edita en el mismo sitio
// donde se escribe. El precedente es `<!-- cards: … -->` (lib/card-table.ts),
// que ya se lee así. react-markdown no renderiza HTML crudo, o sea que la
// línea no se ve en la página.
//
// ESTE MÓDULO NO TOCA EL DISCO. Lo importa el menú, que es un componente de
// cliente; quien lee los .md es lib/docs.ts, que sí usa node:fs y no cruza
// esa frontera (mismo reparto que lib/docs-version.ts).
//
// --- Por qué solo cuatro, y por qué no todos los documentos llevan ----------
//
// Medido el 5 de septiembre de 2026: de los 18 documentos de V3, **14
// empezaban por "Esqueleto"**. Una etiqueta que llevan casi todos no informa
// de nada — y de hecho tapa la que importa. De ahí las dos reglas:
//
//   · El grupo dice su estado por defecto UNA vez, en su cabecera, y el
//     documento solo se etiqueta si se sale de ahí (getNavTree lo calcula).
//   · Los índices y los documentos vivos —Estado, Ideas, Glosario, los
//     README— NO declaran estado, y por eso no llevan etiqueta. No son
//     diseño, son andamios: crecen siempre, así que cualquiera de las cuatro
//     palabras les mentiría y no se les quitaría nunca.
//
// v2 tampoco declara nada: está congelada entera y eso ya se dice una vez, en
// su entrada de índice ("v2 (congelado)", con candado). No se repite por
// documento.
//
// Y NO reutiliza el BuildStatus de lib/sections.ts (listo · en curso ·
// planificado), que gastan /dev y los repositorios, porque mide otra cosa:
// si algo está CONSTRUIDO. Un documento de diseño puede estar escrito entero
// sobre algo sin decidir —ideas.md es exactamente eso— y "listo" mentiría.
// =========================================================================

export type DocStatus = "por-escribir" | "a-medias" | "escrito" | "en-espera";

/** Lo que se lee en el menú. Corto: cabe en la columna. */
export const DOC_STATUS_LABEL: Record<DocStatus, string> = {
  "por-escribir": "por escribir",
  "a-medias": "a medias",
  escrito: "escrito",
  // Se queda en inglés porque es el que ya está puesto y el que se reconoce:
  // no es "aún no escrito", es "no se sabe si esto sigue en el juego".
  "en-espera": "standby",
};

/** Qué significa cada uno, para el `title` del menú. */
export const DOC_STATUS_HELP: Record<DocStatus, string> = {
  "por-escribir": "Esqueleto: nada decidido todavía.",
  "a-medias": "Parte cerrada y parte todavía en una línea.",
  escrito: "Decidido y redactado.",
  "en-espera":
    "En espera: no está decidido que esto siga formando parte del juego.",
};

/**
 * Orden de menos a más hecho. Sirve para deshacer empates al calcular el
 * estado por defecto de un grupo: con dos estados igual de frecuentes gana el
 * menos hecho, que es el que no promete de más.
 */
export const DOC_STATUS_ORDER: readonly DocStatus[] = [
  "por-escribir",
  "a-medias",
  "escrito",
  "en-espera",
];

export function isDocStatus(value: string): value is DocStatus {
  return (DOC_STATUS_ORDER as readonly string[]).includes(value);
}

/**
 * El estado por defecto de un grupo: el que comparte la MAYORÍA de sus
 * entradas. Devuelve null si no la hay, y entonces cada entrada con estado
 * carga con su propia etiqueta.
 *
 * Mayoría de TODAS las entradas, no solo de las que declaran estado. La
 * diferencia importa porque las que no declaran nada —los índices vivos— se
 * ven igual que las que se callan por compartir la norma: si la norma la
 * marcasen dos documentos de siete, el Glosario parecería estar "a medias"
 * sin haberlo dicho nunca. Con la mayoría exigida, un grupo mezclado no tiene
 * norma y se etiqueta entrada por entrada, que es lo honesto.
 *
 * `en-espera` nunca puede ser la norma aunque sea mayoría: es el único que
 * apaga la entrada en el menú, y de volverse implícito dejaría de verse justo
 * lo que se quería ver.
 */
export function defaultStatusOf(
  states: readonly (DocStatus | undefined)[],
): DocStatus | null {
  const counts = new Map<DocStatus, number>();
  for (const s of states) {
    if (!s || s === "en-espera") continue;
    counts.set(s, (counts.get(s) ?? 0) + 1);
  }
  for (const s of DOC_STATUS_ORDER) {
    const n = counts.get(s) ?? 0;
    if (n > 1 && n * 2 > states.length) return s;
  }
  return null;
}
