// =========================================================================
// La BIBLIOTECA de losetas: qué tipos existen
//
// El catálogo no está en código: está en data/tile-library.json, y este módulo
// lo lee y lo convierte en tipos con sus variantes ya dibujadas. Se hizo así
// porque el editor de /dev/losetas ESCRIBE ese fichero: añadir un peñasco nuevo
// es guardar desde el laboratorio, no editar un literal de TypeScript. El JSON
// sigue siendo texto revisable —el dibujo ASCII se lee en el diff igual que se
// leía aquí—, y lo que no cabe en un JSON, el "por qué está dibujada así", va en
// el campo `note` de cada tipo y de cada variante.
//
// Se valida al ARRANCAR, a propósito: una biblioteca con una loseta partida es
// un error de datos que el compilador no puede ver, y es mucho mejor que reviente
// al importar que a mitad de una generación.
//
// Cada tipo es un SITIO reconocible —un peñasco, una ciénaga con la orilla
// arbolada, un paso entre dos crestas—, y de ahí salen los criterios de
// maquetado de sus variantes:
//
//   · UN terreno define el tipo, y el resto de la loseta lo acompaña. El terreno
//     va en MASAS: un bosque es una mancha compacta y una sierra es una cresta;
//     salteado hexágono a hexágono no se lee como paisaje, se lee como ruido.
//   · Las orillas se dejan AL SORTEO. Así la pieza se funde con sus vecinas y no
//     sale idéntica en cada partida (§2c tabla A).
//   · Las EXCEPCIONES son legítimas cuando el sitio las pide: el Camino que cruza
//     el paso de montaña, el Pantano al que baja el vado. `typeNotes` avisa de
//     las que probablemente no lo sean.
//   · El camino CRUZA la loseta de un borde a otro, y las anclas de una loseta
//     con camino están SOLO en las bocas de ese camino: así una pieza de camino
//     se une siempre por donde el camino continúa, y la red no sale a trozos.
//   · Las demás anclan en terreno abierto, nunca en una pared de roca, en medio
//     del pantano ni en la boca de una cueva: el ancla es una invitación a
//     seguir, y una montaña no invita a nada.
//
// Los TAMAÑOS hacen dos trabajos distintos. Las Mínimas y Pequeñas son la
// argamasa —accidentes del terreno que rellenan y doblan el tablero—; las
// Medianas y Grandes son regiones con interior propio, y pesan poco porque una
// sola ya marca el carácter de la partida. No hay ninguna Enorme a propósito: 64
// hexágonos son un tablero entero, no una pieza.
// =========================================================================

import data from "@/data/tile-library.json";
import {
  allVariants,
  parseLibrary,
  toStoredLibrary,
  validateTileTypes,
  type StoredLibrary,
  type TileDef,
  type TileType,
} from "./tiles";

/** Los tipos de loseta: la bolsa de sitios con la que se construye el tablero. */
export const TILE_TYPES: readonly TileType[] = parseLibrary(data);

/**
 * El contenido del fichero, que es con lo que trabaja el editor. Se vuelve a
 * generar desde los tipos en vez de reusar el JSON importado: así tiene los
 * tipos de TypeScript de verdad (el JSON importado no sabe que sus anclas son
 * tuplas) y, de paso, el ida y vuelta queda comprobado en cada arranque.
 */
export const STORED_LIBRARY: StoredLibrary = toStoredLibrary(TILE_TYPES);

const PROBLEMS = validateTileTypes(TILE_TYPES);
if (PROBLEMS.length > 0) {
  throw new Error(`data/tile-library.json no es válido:\n · ${PROBLEMS.join("\n · ")}`);
}

/**
 * Todas las variantes, en una lista plana: la bolsa de LOSETAS. Es lo que mira
 * board-gen, porque al encajar da igual de qué tipo sea cada pieza; el tipo ya
 * hizo su trabajo repartiendo el peso entre sus variantes.
 */
export const TILES: readonly TileDef[] = allVariants(TILE_TYPES);

export const TILES_BY_ID: Readonly<Record<string, TileDef>> = Object.fromEntries(
  TILES.map((t) => [t.id, t]),
);

export const TILE_TYPES_BY_ID: Readonly<Record<string, TileType>> = Object.fromEntries(
  TILE_TYPES.map((t) => [t.id, t]),
);

/** El tipo del que sale una loseta. */
export function typeOf(def: TileDef): TileType | undefined {
  return TILE_TYPES_BY_ID[def.typeId];
}
