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
//   · Las ORILLAS se pintan también, hexágono a hexágono: no hay "esto lo decide
//     el tablero". Lo que hace que una pieza no salga idéntica en cada partida no
//     es el azar dentro de ella, son sus VARIANTES y el giro (§2c tabla A).
//   · Las EXCEPCIONES son legítimas cuando el sitio las pide: el Camino que cruza
//     el paso de montaña, el Pantano al que baja el vado. `typeNotes` avisa de
//     las que probablemente no lo sean.
//   · El camino CRUZA la loseta de un borde a otro, y las anclas de una loseta
//     con camino están SOLO en las bocas de ese camino: así una pieza de camino
//     se une siempre por donde el camino continúa, y la red no sale a trozos.
//   · Las demás anclan en terreno abierto, nunca en una pared de roca, en medio
//     del pantano ni en la boca de una mazmorra: el ancla es una invitación a
//     seguir, y una montaña no invita a nada.
//   · Los tipos de PUEBLO se maquetan por lo que sale DENTRO, no por el paisaje:
//     lo que separa una Posada de una Torre de mago no es el dibujo del terreno,
//     es con quién te encuentras al llegar (un tabernero, un mago). De ahí que
//     sean cinco tipos y no cinco variantes de uno: el tablero necesita saber qué
//     clase de sitio le ha tocado para sembrarlo (`FIXED_VILLAGE_NPC`/`NPC_TYPES`
//     en board-gen).
//
// Los TAMAÑOS hacen dos trabajos distintos. Las Mínimas y Pequeñas son la
// argamasa —accidentes del terreno que rellenan y doblan el tablero—; las
// Medianas y Grandes son regiones con interior propio, y pesan poco porque una
// sola ya marca el carácter de la partida. Hay UNA Enorme (el Robledal viejo, 37
// hexágonos) y con eso basta: al tope de 64 le cabe un tablero entero, así que una
// Enorme no es una pieza grande, es media partida decidida de golpe.
//
// El PESO de cada tipo no es una intuición: se ajusta para que el reparto de
// terreno de la bolsa dé en la tabla A (§2c). Con la biblioteca de hoy la bolsa
// sale a Llanura 38,4 · Bosque 18,7 · Camino 18,9 · Pantano 9,4 · Montaña 9,7.
// Tocar un dibujo mueve esas cifras, así que después de maquetar hay que volver a
// mirarlas en /dev/losetas.
//
// Y el objetivo NO es 40/20/20/10/10 a secas, aunque eso sea lo que dice la tabla:
// el Pueblo se lleva un 2,9 % y la Mazmorra un 1,9 %, y ninguno de los dos tiene
// cuota que cumplir, así que a los cinco con cuota les queda el 95,2 % del
// tablero para repartir. La cuota que hay que comparar es la de la tabla escalada
// a ese 95,2 % —38,1 / 19,0 / 19,0 / 9,5 / 9,5—, y contra eso los cinco están
// dentro de 0,4 puntos. Perseguir el 40 redondo sería quitarle sitio al Pueblo,
// que es justo lo que se acaba de añadir.
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
