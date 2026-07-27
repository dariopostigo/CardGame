// =========================================================================
// El formato de data/tile-library.json
//
// Puro, sin disco, para que lo puedan usar los dos lados: la ruta que escribe el
// fichero (lib/tile-library-file.ts) y el laboratorio, que enseña en pantalla lo
// que va a guardar. Si cada uno formateara a su manera, la vista previa mentiría.
//
// El formato importa más de lo que parece: la biblioteca se revisa leyendo el
// diff. Por eso cada dibujo va con una fila por línea (que es como se lee un
// dibujo) y cada ancla en una sola línea (que es como se lee un ancla). Y sobre
// todo tiene que ser ESTABLE: guardar sin haber cambiado nada no puede mover ni
// una coma, o el diff dejaría de servir para revisar.
// =========================================================================

import type { StoredLibrary } from "@/lib/rules/tiles";

/**
 * JSON indentado a dos espacios, pero con las listas simples —las filas de un
 * dibujo, las tres cifras de un ancla— recogidas en una línea. `JSON.stringify`
 * las abriría a una línea por elemento y un ancla ocuparía cuatro renglones.
 *
 * @param {unknown} value - Lo que se va a escribir.
 * @returns {string} El JSON, sin salto de línea final.
 */
export function formatJson(value: unknown): string {
  const json = JSON.stringify(value, null, 2);
  // Solo las listas que no contienen otra lista ni un objeto: por eso el cuerpo
  // no puede tener corchetes ni llaves. `anchors` y `variants` sí los tienen, y
  // se quedan abiertas.
  return json.replace(/\[\n[^[\]{}]*?\n\s*\]/g, (match) =>
    match.replace(/\s*\n\s*/g, " ").replace("[ ", "[").replace(" ]", "]"),
  );
}

/** El contenido exacto del fichero, con su salto de línea final. */
export function formatLibrary(library: StoredLibrary): string {
  return `${formatJson(library)}\n`;
}
