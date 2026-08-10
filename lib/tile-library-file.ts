// =========================================================================
// data/tile-library.json: leerlo y escribirlo
//
// Solo servidor: es el único sitio del proyecto que ESCRIBE en el repositorio.
// Vive fuera de lib/rules/ a propósito —el motor es puro y no toca el disco— y
// lo usa la ruta de guardado de /dev/tiles.
//
// El formato no está aquí, está en tile-library-format.ts, que es puro: el
// laboratorio lo necesita para enseñar en pantalla lo mismo que se va a escribir.
// =========================================================================

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { StoredLibrary } from "@/lib/rules/tiles";
import { formatLibrary } from "@/lib/tile-library-format";

export const LIBRARY_PATH = path.join(process.cwd(), "data", "tile-library.json");

export async function readLibraryFile(): Promise<unknown> {
  return JSON.parse(await readFile(LIBRARY_PATH, "utf8"));
}

export async function writeLibraryFile(library: StoredLibrary): Promise<void> {
  await writeFile(LIBRARY_PATH, formatLibrary(library), "utf8");
}
