// =========================================================================
// Editar la biblioteca: mutaciones y guardado
//
// Lo que el laboratorio de /lab/tiles hace con la biblioteca, separado de la
// pantalla. Todas las mutaciones trabajan sobre la forma GUARDADA (`StoredLibrary`,
// lo que hay en data/tile-library.json) y no sobre los tipos ya dibujados: la
// forma guardada es la fuente de verdad y los tipos se derivan de ella con
// `parseLibrary`. Al revés —editar los tipos y volver a serializar— habría dos
// copias del estado y una acabaría mintiendo.
//
// Son funciones puras que devuelven una biblioteca nueva. Guardar es lo único que
// habla con el servidor, y devuelve los problemas de validación en vez de
// lanzarlos: que una loseta no valga es parte del trabajo de maquetar, no un
// error del programa.
// =========================================================================

import type { StoredLibrary, StoredType, StoredVariant } from "@/lib/v2/rules/tiles";

const ENDPOINT = "/api/lab/tile-library";

export type SaveResult =
  | { readonly ok: true; readonly library: StoredLibrary }
  | { readonly ok: false; readonly problems: readonly string[] };

/**
 * Escribir la biblioteca en el disco. La valida el servidor con la misma función
 * que la valida al arrancar, así que lo que aquí vuelve como `problems` es
 * exactamente lo que impediría que la aplicación levantase.
 *
 * @param {StoredLibrary} library - La biblioteca completa.
 * @returns {Promise<SaveResult>} La biblioteca canónica, o los problemas.
 */
export async function saveLibrary(library: StoredLibrary): Promise<SaveResult> {
  let response: Response;
  try {
    response = await fetch(ENDPOINT, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(library),
    });
  } catch {
    return { ok: false, problems: ["No se ha podido llegar al servidor de desarrollo"] };
  }

  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const problems = readProblems(body);
    return { ok: false, problems: problems.length > 0 ? problems : [`Error ${response.status}`] };
  }
  return { ok: true, library: (body as { library: StoredLibrary }).library };
}

function readProblems(body: unknown): string[] {
  if (typeof body !== "object" || body === null) return [];
  const problems = (body as { problems?: unknown }).problems;
  return Array.isArray(problems) ? problems.map(String) : [];
}

// --- Mutaciones ------------------------------------------------------------

/** Cambiar los datos de un tipo sin tocar sus variantes. */
export function updateType(
  library: StoredLibrary,
  typeId: string,
  changes: Partial<Omit<StoredType, "variants">>,
): StoredLibrary {
  return {
    types: library.types.map((type) => (type.id === typeId ? { ...type, ...changes } : type)),
  };
}

export function removeType(library: StoredLibrary, typeId: string): StoredLibrary {
  return { types: library.types.filter((type) => type.id !== typeId) };
}

/**
 * Un tipo nuevo, ya con una variante dentro. Nace válido a propósito: un tipo sin
 * variantes no es nada y no se podría guardar, así que se crea con la loseta más
 * pequeña que existe y se edita desde ahí.
 *
 * @returns {{library: StoredLibrary, type: StoredType}} La biblioteca y el tipo creado.
 */
export function addType(library: StoredLibrary): { library: StoredLibrary; type: StoredType } {
  const id = freeId(
    "tipo-nuevo",
    library.types.map((t) => t.id),
  );
  const type: StoredType = {
    id,
    label: "Tipo nuevo",
    terrain: "llanura",
    weight: 3,
    note: "",
    variants: [
      {
        id: `${id}-1`,
        label: "Variante nueva",
        note: "",
        art: ["LLL"],
        anchors: [
          [0, 0, "O"],
          [2, 0, "E"],
        ],
      },
    ],
  };
  return { library: { types: [...library.types, type] }, type };
}

/**
 * Dejar una variante dentro de un tipo: sirve para crear, para guardar cambios y
 * para MOVERLA a otro tipo. Se quita de toda la biblioteca la variante que
 * sustituye, y no solo de su tipo, porque un id de variante es único en la
 * biblioteca entera; si no, al cambiarle el tipo quedarían dos.
 *
 * Se quita EXACTAMENTE una: la que se sustituye. Si el id nuevo choca con otra
 * variante, quedan dos iguales y la validación lo canta al guardar — que es
 * mejor final que quitar las dos y perder una sin avisar.
 *
 * @param {string} replaces - Id que tenía antes de editarla, si es que existía.
 */
export function putVariant(
  library: StoredLibrary,
  typeId: string,
  variant: StoredVariant,
  replaces?: string,
): StoredLibrary {
  const gone = new Set([replaces ?? variant.id]);

  return {
    types: library.types.map((type) => {
      const kept = type.variants.filter((v) => !gone.has(v.id));
      if (type.id !== typeId) return { ...type, variants: kept };

      // Si estaba en este tipo, se queda en su sitio; si no, va al final.
      const at = type.variants.findIndex((v) => gone.has(v.id));
      const variants = [...kept];
      variants.splice(at < 0 ? variants.length : at, 0, variant);
      return { ...type, variants };
    }),
  };
}

export function removeVariant(
  library: StoredLibrary,
  typeId: string,
  variantId: string,
): StoredLibrary {
  return {
    types: library.types.map((type) =>
      type.id === typeId
        ? { ...type, variants: type.variants.filter((v) => v.id !== variantId) }
        : type,
    ),
  };
}

/** Un id libre a partir de una base: `base`, `base-2`, `base-3`… */
export function freeId(base: string, taken: readonly string[]): string {
  const used = new Set(taken);
  if (!used.has(base)) return base;
  for (let n = 2; ; n++) {
    const candidate = `${base}-${n}`;
    if (!used.has(candidate)) return candidate;
  }
}

/** Todos los ids de variante que hay ahora, para no repetir ninguno. */
export function variantIds(library: StoredLibrary): string[] {
  return library.types.flatMap((type) => type.variants.map((v) => v.id));
}
