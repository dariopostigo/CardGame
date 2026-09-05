// =========================================================================
// La ficha de personaje — la pieza que se pone en el hexágono
//
// Esto es la FICHA, no la hoja de datos: lo que anda por el tablero de batalla
// (docs/v3/board/battle.md §5), y lo que en v2 ya se llamaba así
// (docs/v2/board/board-map.md §4c, «quien anda por el tablero»). Lo que lleva
// escrito viene de `character.ts`; lo que se decide aquí es qué de eso se ve
// desde arriba y a tamaño de partida.
//
// LA FORMA ESTÁ DECIDIDA: UN HEXÁGONO TUMBADO *(Dario, 1 de septiembre de
// 2026)*. La ficha tiene la forma de la casilla, apoyada encima de ella y no de
// pie sobre una peana: mismo hexágono, mismo giro, mismo aplastado, un poco más
// pequeña para que la rejilla siga viéndose por debajo. Antes de esto se probó el
// medallón redondo de pie —la referencia de Hearthstone, que es de dónde viene el
// retrato dentro de la ficha— y lo que lo tumbó fue una medida: con la arena a
// 0,67 de inclinación las filas están a UN radio de hexágono, así que cualquier
// cuerpo de pie muerde el hexágono de detrás. Hearthstone no tiene ese problema
// porque su tablero es una sola fila.
//
// Y ES PLANA: SIN GROSOR *(Dario, 3 de septiembre de 2026: «quita el disco y el
// grosor ya»)*. El 2 de septiembre se probó levantarla del suelo y dibujarle un
// canto —y de paso se probó también hacerla redonda, que no se había pedido—:
// las dos cosas se van. La ficha es un POLÍGONO apoyado en su casilla, y de aquí
// se parte para ir mejorando. Lo que quede de aquel intento en el historial vale
// como medida de lo que costaba: levantarla se comía 0,16 radios del margen con
// la fila de detrás.
//
// LO QUE ESO CUESTA, y hay que tenerlo delante porque no es gratis: un hexágono
// aplastado por 0,67 es MÁS ANCHO QUE ALTO —1,73 de ancho por 1,34 de alto, en
// radios—, y las ilustraciones son verticales 5:7. Con esa ventana, el techo de
// lo que se puede enseñar del archivo es el **55% de su alto**: más que eso y la
// imagen deja de cubrir el ancho de la ficha. O sea que la figura entera NO
// CABE, y el encuadre de la ficha no puede ser el de la carta. Se elige qué 55%.
//
// DOS CAPAS, y siguen siendo dos aunque ya no haya nadie de pie:
//   · EL CARTÓN — el hexágono de fuera, y EL ÚNICO MARCO *(3 de septiembre de
//     2026: «parece que tiene como 3 bordes del mismo color… solo un marco»)*. Su
//     trazo, y ninguno más, lleva color, y con él van la ❤️ Vida y los estados. El
//     aro de más del héroe y el filete del retrato eran las otras dos líneas del
//     mismo color, y se fueron. TODAS LAS FICHAS SE DIBUJAN IGUAL: el héroe
//     tampoco lleva el trazo más gordo —se probó el mismo día y se leyó como un
//     fallo, «la de los héroes es distinta que las demás»—, porque con el color
//     del tier en el marco ya tiene raíl propio y no hay nada que añadir. Lo que
//     cambia de una ficha a otra es el COLOR, nunca la forma ni el grosor.
//   · LA CARA — el retrato recortado dentro, a ras del marco. Es lo que se cambia
//     el día que la vía 3D decida algo (/lab/character), y por eso está aparte:
//     una figura se pondría de pie SOBRE esta ficha sin tocar su lectura.
//
// EL COLOR DEL MARCO ES EL DEL TIER, NO EL DEL BANDO *(Dario, 3 de septiembre de
// 2026: «quiero que la ficha tenga el color del tier del personaje»)*. Y eso no
// pide una paleta nueva: la Rareza de una carta SALE del tier
// (game-design.md §3, `rarityForTier`), así que el color del tier ya existe y ya
// está dibujado —es el raíl de $rarity que lleva su carta—. La ficha del tablero
// y la carta de la mano quedan del mismo color, que es la mitad del argumento.
// Son CINCO raíles para ocho tiers, y eso está escrito y razonado desde antes
// (card-concept/README.md: «un color no aguanta ocho valores»). Los héroes no
// tienen tier: se llevan su raíl propio, el mismo con el que se imprimen.
//
// Y DE QUIÉN ES SE DICE ILUMINANDO LA CASILLA, no la ficha *(el mismo día)*: un
// hexágono translúcido debajo de la pieza, y en TRES tonos *(Dario, ese mismo 3
// de septiembre: «para mí azul, para mis enemigos rojo y para mis aliados verde;
// de esa manera se distinguen y no hace falta el número del jugador»)*. Con eso el
// color de la ficha queda libre para el tier y battle.md §8 queda contestado
// —«cómo sabe cada jugador cuáles de esas fichas son suyas»— con las dos mitades:
// el azul dice que es MÍA y el verde que es de mi bando pero no mía. Lo que el
// color no dice es cuál de los dos aliados, y eso es la decisión y no un pendiente:
// se probó una cifra encima de la ficha para decir el jugador y se retiró en cuanto
// entró el verde, porque decía lo mismo con letra pequeña.
//
// LA ❤️ VIDA ES UNA BARRA QUE FLOTA DEBAJO, no un arco por el borde *(2 de
// septiembre de 2026)*. El arco se probó y se descarta: seguía el perímetro del
// hexágono, o sea que un mordisco de un 10% se leía en un sitio distinto según
// por qué lado del polígono cayera. Una barra horizontal es la convención de los
// videojuegos por el motivo de siempre —la misma longitud significa lo mismo en
// todas las fichas—, y a cambio pide sitio: cuelga por debajo de la ficha y la
// casilla de delante empieza justo ahí (`lifeBar`, y la comprobación que lo mide).
//
// LO QUE NO SE DECIDE AQUÍ, y por eso son diales y no constantes: el tamaño de la
// ficha, el del retrato dentro, qué 55% del archivo se enseña y qué cifras suben a
// la ficha. Esta capa aporta la geometría y las comprobaciones; el módulo de
// /dev/pieza es el que las mueve y las mira. (Cómo se dice de quién es la ficha
// era el quinto dial hasta el 3 de septiembre de 2026: dejó de serlo porque ya
// está decidido.)
//
// Puro: sin React, sin colores, sin `node:fs`. Los colores son de SCSS
// (styles/settings/_colors.scss, mapa de la arena) y aquí solo hay números.
// =========================================================================

import * as Hex from "./hex";
import { ABILITIES, TIERS } from "./character";

// --- De quién es cada ficha ------------------------------------------------
// Hasta tres jugadores, cada uno con su héroe, y un bando enemigo en espejo
// (battle.md §2). Son cuatro identidades y desde el 3 de septiembre de 2026 el
// COLOR las reparte en TRES *(Dario: «para mí azul, para mis enemigos rojo y para
// mis aliados verde»)*: la casilla se ilumina en AZUL si la ficha es del jugador
// que está mirando, en VERDE si es de otro jugador de su bando y en ROJO si es
// enemiga.
//
// Que sean tres y no cuatro es la decisión: los dos aliados comparten el verde, o
// sea que el color dice si una ficha se puede mover pero no de cuál de los dos
// compañeros es. Se probó decirlo con una cifra encima de la ficha —un 1, 2 o 3—
// y se retiró el mismo día que entró el verde: «de esa manera se distinguen y no
// hace falta el número del jugador».
//
// Con eso battle.md §8 —«cómo sabe cada jugador cuáles de esas fichas son
// suyas»— queda contestado. Ojo con lo que esto arrastra: `j1` ya no es «el
// jugador 1» a secas, es EL QUE MIRA. En una partida de verdad el azul lo lleva
// la ficha del jugador de esta pantalla, no la del primero de la mesa.

export type PieceSideId = "j1" | "j2" | "j3" | "enemigo";

export type PieceSide = {
  readonly id: PieceSideId;
  readonly label: string;
  readonly ally: boolean;
};

export const PIECE_SIDES: readonly PieceSide[] = [
  { id: "j1", label: "Jugador 1", ally: true },
  { id: "j2", label: "Jugador 2", ally: true },
  { id: "j3", label: "Jugador 3", ally: true },
  { id: "enemigo", label: "Enemigo", ally: false },
];

export const PIECE_SIDE_IDS: readonly PieceSideId[] = PIECE_SIDES.map((s) => s.id);

// (Aquí vivió `SideMarkId`, el mando de tres posiciones que elegía CÓMO se decía
// de quién era la ficha: iluminar su casilla, el número del jugador, o las dos
// cosas. Existió medio día. Nació porque con dos tonos —aliado y enemigo— el
// color no llegaba a decir el jugador, y murió en cuanto los aliados tuvieron
// verde: con tres tonos no queda nada que el número añada, así que el mando se
// había quedado con una sola posición útil y un mando de una posición no es un
// mando. La cifra que pintaba está descrita en styles/components/_ficha.scss, por
// si algún día hay que separar al aliado 2 del 3.)

// --- El encuadre del retrato ----------------------------------------------
// La cara de la ficha es un hexágono aplastado y la ilustración es vertical, así
// que hay que elegir QUÉ BANDA del archivo se ve. Las tres opciones no son
// inventadas: salen de dónde cae la figura en los 24 archivos que ya existen,
// medido en public/assets/v3/README.md —del ~6-10% (coronilla) al 77-91% (pies),
// centrada, con «el hueco de un brazo a cada lado»—.

/**
 * El lienzo nominal de la ilustración: 5:7 vertical, que es lo que manda
 * §"Lienzo y formato" y lo que cumplen 16 de los 24 archivos —contados en su
 * tabla el 5 de septiembre de 2026; antes ponía 19 aquí, que no salía: 16 + 5 + 3
 * son los 24—. Los cinco de 2:3 entran por anchura y se les va un 6,7% de alto, que ya está medido en el
 * README del arte; los tres apaisados salen mal a propósito y son útiles así.
 */
export const NOMINAL_ASPECT = 7 / 5;

// LA FIGURA DE LA NORMA, que es contra la que se encuadra *(Dario, 5 de
// septiembre de 2026)*.
//
// La pregunta no era qué banda enseñar sino PARA QUÉ ARTE se recorta, porque el
// que existe no cumple su propia especificación: pide los pies al 72% y en los 24
// archivos caen entre el 77% y el 91%. Se encuadra **para la norma**, así que la
// ilustración que no la cumple se ve mal en la ficha — y eso es la señal, no un
// fallo del encuadre. Es lo que ya decía el README del arte: «la norma no se toca
// ni se relaja; si algo hay que cambiar es el prompt».
//
// Los dos números salen de su tabla §"Encuadre", fila «Alto de la figura»: ~60%
// del lienzo, ENTRE EL 12% Y EL 72%. No son de aquí y no se eligen aquí.

/** Dónde cae la coronilla en un archivo que cumple la norma. */
export const FIGURE_TOP = 0.12;
/** Dónde caen los pies en un archivo que cumple la norma. */
export const FIGURE_BOTTOM = 0.72;

/**
 * Cuánto aire se deja por encima de la coronilla, en fracción de la propia
 * banda. Es lo único de esta cuenta que se eligió mirando la pantalla, y no se
 * eligió ahora: sale de despejarlo del encuadre que Dario fijó por ojo el 2 de
 * septiembre de 2026 —Medio cuerpo, ancla 0,34— y por eso la regla lo reproduce
 * clavado. Los otros dos encuadres llevaban 4 y 2 puntos de aire contra sus 5,5,
 * o sea tres criterios distintos: eso es lo que se acaba.
 */
export const HEADROOM_SHARE = 0.1;

/**
 * Dónde tiene que caer el centro de la banda para que la coronilla de la figura
 * normativa entre con su aire. No es una preferencia: es `FIGURE_TOP` más lo que
 * la banda baja desde ahí.
 */
export function framingAnchor(cover: number): number {
  return FIGURE_TOP + cover * (0.5 - HEADROOM_SHARE);
}

export type FramingId = "cabeza" | "busto" | "medio-cuerpo";

export type Framing = {
  readonly id: FramingId;
  readonly label: string;
  /** Qué fracción del ALTO del archivo se quiere ver dentro de la ficha. */
  readonly cover: number;
  /**
   * Qué fracción del alto del archivo cae en el centro de la ficha. **No se
   * escribe**: la calcula `framingAnchor()` desde la figura de la norma.
   */
  readonly anchor: number;
  readonly why: string;
};

const framing = (id: FramingId, label: string, cover: number, why: string): Framing => ({
  id,
  label,
  cover,
  anchor: framingAnchor(cover),
  why,
});

export const FRAMINGS: readonly Framing[] = [
  framing(
    "cabeza",
    "Cabeza",
    0.22,
    "La cara llena la ficha. Es lo que distingue a un Miliciano de un Caballero de un vistazo, y lo que se pierde es todo lo que la silueta dice: el arma, la montura, las alas.",
  ),
  framing(
    "busto",
    "Busto",
    0.4,
    "Cabeza y torso, que es el encuadre de Hearthstone. Entra la cara y entra con qué pega; se va de la cintura para abajo, o sea el trozo que el arte de este repo tiene peor encuadrado (los pies caen entre el 77% y el 91%).",
  ),
  framing(
    "medio-cuerpo",
    "Medio cuerpo",
    0.55,
    "El techo de lo que cabe: a partir del 55% del alto la imagen ya no cubre el ancho de un hexágono tumbado. Es todo lo que se puede pedir, y aun así la figura entera no entra NI CUMPLIENDO LA NORMA —esta ocupa el 60% del archivo (12%–72%) contra los 55% de la banda, así que se quedan fuera los pies aunque el arte sea perfecto—. En el arte que hay hoy, que ocupa el 85%, se queda fuera bastante más.",
  ),
];

export const FRAMING_BY_ID: Readonly<Record<FramingId, Framing>> = Object.fromEntries(
  FRAMINGS.map((f) => [f.id, f]),
) as Readonly<Record<FramingId, Framing>>;

/**
 * El encuadre con el que se abre: MEDIO CUERPO *(Dario, 2 de septiembre de
 * 2026)*, que es el techo de lo que cabe en una ficha tumbada.
 *
 * Es el que enseña más del archivo sin recortarse, así que también es el que pone
 * a prueba el encuadre del arte que existe: los pies caen entre el 77% y el 91%
 * del alto y con el 55% no entran, o sea que lo que se ve es tronco y armas. El
 * busto —el de Hearthstone— sigue estando a un botón.
 *
 * Y ES EL QUE PRUEBA QUE LA REGLA DEL ANCLA ES LA BUENA: este encuadre lo fijó
 * Dario por ojo con ancla 0,34, y al derivarla de la figura de la norma el 5 de
 * septiembre de 2026 —`framingAnchor()`— sale 0,340 clavado. Los otros dos, que
 * no se habían mirado con la misma atención, se movieron: Cabeza 0,19 → 0,208 y
 * Busto 0,30 → 0,280. O sea que la regla no cambia lo que estaba juzgado, ordena
 * lo que no lo estaba.
 */
export const DEFAULT_FRAMING: FramingId = "medio-cuerpo";

// --- Las ranuras y lo que puede ir en ellas -------------------------------
// La forma manda, y un hexágono manda más que un círculo: tiene SEIS ESQUINAS y
// las cifras van ahí, mordiendo el cartón. Cinco son útiles —la de abajo se
// reserva a la marca de bando— y de ahí no salen más sin apilar cosas encima del
// retrato.

export type SlotId =
  | "abajo-izq"
  | "abajo-der"
  | "arriba-izq"
  | "arriba-der"
  | "punta-arriba"
  | "punta-abajo";

export type Slot = {
  readonly id: SlotId;
  readonly label: string;
  /**
   * El vértice donde va, en radios de la cara. La `y` se aplasta con el tablero
   * (la pone `slotAt`), porque la ficha está tumbada.
   */
  readonly ux: number;
  readonly uy: number;
};

/**
 * Los vértices de un hexágono puntiagudo arriba, que es el giro de esta arena:
 * dos a cada lado a media altura y uno arriba y otro abajo. Las cuatro esquinas
 * laterales son las que reciben cifras —es donde las pone Hearthstone, abajo y
 * mordiendo el retrato— y las dos puntas se reparten los estados y el bando.
 *
 * Las ranuras no caen EN el vértice sino un poco por dentro (`SLOT_INSET`): con
 * la gema centrada en el vértice de la cara, su borde salía por fuera de la
 * silueta de la ficha, y una ficha con círculos colgando de los lados deja de
 * leerse como una pieza. Una gema tiene que MORDER el marco, no salirse.
 */
export const SLOTS: readonly Slot[] = [
  { id: "abajo-izq", label: "Esquina abajo izquierda", ux: -0.866, uy: 0.5 },
  { id: "abajo-der", label: "Esquina abajo derecha", ux: 0.866, uy: 0.5 },
  { id: "arriba-izq", label: "Esquina arriba izquierda", ux: -0.866, uy: -0.5 },
  { id: "arriba-der", label: "Esquina arriba derecha", ux: 0.866, uy: -0.5 },
  { id: "punta-arriba", label: "Punta de arriba", ux: 0, uy: -1 },
  { id: "punta-abajo", label: "Punta de abajo", ux: 0, uy: 1 },
];

export const SLOT_BY_ID: Readonly<Record<SlotId, Slot>> = Object.fromEntries(
  SLOTS.map((s) => [s.id, s]),
) as Readonly<Record<SlotId, Slot>>;

/**
 * Cuánto se meten las ranuras hacia dentro del vértice de la cara, en radios de
 * cara. Con 0,86 y la gema a 0,25 del radio, el borde de la gema queda dentro de
 * la silueta de la ficha — o sea que la cifra muerde el marco y no cuelga del
 * lado.
 */
export const SLOT_INSET = 0.86;

export type FieldId = "ataque" | "vida" | "movimiento" | "tipo-dano" | "tier" | "nombre";

export type Field = {
  readonly id: FieldId;
  readonly label: string;
  readonly icon: string;
  readonly slot: SlotId;
  /** Si Hearthstone lo lleva en su ficha de tablero. */
  readonly hearthstone: boolean;
  /**
   * Cuántos dígitos puede llegar a tener este dato EN EL PEOR CASO, o 0 si no es
   * una cifra. Sale de la anatomía —por eso se importa `ABILITIES` en vez de
   * copiar el número—, y es lo único que hace falta para dimensionar su gema.
   */
  readonly maxDigits: number;
  readonly why: string;
};

const digitsOf = (n: number) => String(Math.trunc(n)).length;

/**
 * Lo que PODRÍA subir a la ficha, con su sitio propuesto.
 *
 * De las 8 Habilidades solo dos cambian durante la batalla —❤️ Vida baja y
 * 👢 Movimiento se gasta—, y las otras seis son fijas: están en la carta y se
 * pueden consultar. Ese es el argumento de Hearthstone para llevar dos cifras y
 * no diez, y aquí se puede comprobar en vez de creerlo.
 *
 * LA ⚡ INICIATIVA NO ESTÁ Y NO ES UN OLVIDO *(Dario, 3 de septiembre de 2026:
 * «quita la opción de Iniciativa, tengo pensado cómo implementarlo en el tablero
 * de combate»)*. Era candidata porque con hasta 30 entradas por ronda (§4) saber
 * cuándo actúa cada uno es lo que deja planear, pero eso no se resuelve poniendo
 * una cifra en cada ficha: se resuelve en el tablero, y ahí no es un dato de la
 * pieza sino el ORDEN de la ronda. Así que deja de ser una opción de esta
 * pantalla en vez de quedarse como un botón que no se va a pulsar.
 */
export const FIELDS: readonly Field[] = [
  {
    id: "ataque",
    label: "⚔️ Ataque",
    icon: "⚔️",
    slot: "abajo-izq",
    hearthstone: true,
    maxDigits: digitsOf(ABILITIES.ataque.scale.max),
    why: "Es la mitad de la cuenta de un intercambio: cuánto quita. En Hearthstone va abajo a la izquierda y es lo primero que se mira.",
  },
  {
    id: "vida",
    label: "❤️ Vida",
    icon: "❤️",
    slot: "abajo-der",
    hearthstone: true,
    maxDigits: digitsOf(ABILITIES.vida.scale.max),
    why: "La otra mitad, y la única cifra que CAMBIA sola: sin ella no se sabe si el golpe mata. Es la que menos se discute.",
  },
  {
    id: "movimiento",
    label: "👢 Movimiento",
    icon: "👢",
    slot: "arriba-izq",
    hearthstone: false,
    maxDigits: digitsOf(ABILITIES.movimiento.scale.max),
    why: "Se gasta dentro del turno, así que cambia como la ❤️ Vida. Pero el terreno que se ofrece al coger la ficha ya lo dice pintando los hexágonos (§5), y eso se lee mejor que una cifra.",
  },
  {
    id: "tipo-dano",
    label: "Tipo de daño",
    icon: "🗡️",
    slot: "arriba-izq",
    hearthstone: false,
    maxDigits: 0,
    why: "Trae puesto el alcance —🗡️ 1 · ✨ 2 · 🏹 4— y decide contra qué se resta el daño, así que es la información táctica más densa de la ficha. Es lo que pinta hoy el sustituto de la arena.",
  },
  {
    id: "tier",
    label: "Tier",
    icon: "🔺",
    slot: "arriba-der",
    hearthstone: false,
    maxDigits: digitsOf(TIERS),
    why: "Dice de qué familia de números es sin dar ninguno. Los héroes no tienen, así que es un campo que la mitad de las fichas del bando deja vacío. Desde el 3 de septiembre de 2026 la ficha ya lleva el tier EN EL COLOR del marco, y esta cifra es la que dice si hace falta además el número: el color son cinco valores y la cifra ocho, así que lo que se compara es un tier exacto contra una familia de potencia.",
  },
  {
    id: "nombre",
    label: "Nombre",
    icon: "🏷️",
    slot: "punta-arriba",
    hearthstone: false,
    maxDigits: 0,
    why: "Hearthstone NO lo lleva, y es la ausencia más deliberada de su ficha: el retrato es el nombre. Está aquí para poder verlo fallar con diez fichas en pantalla.",
  },
];

export const FIELD_BY_ID: Readonly<Record<FieldId, Field>> = Object.fromEntries(
  FIELDS.map((f) => [f.id, f]),
) as Readonly<Record<FieldId, Field>>;

// --- La cifra dentro de su gema --------------------------------------------
//
// LA GEMA MÁS GRANDE NO ARREGLA NADA, y esto es lo que había que ver antes de
// tocar ningún mando: la cifra se pintaba a `1,15 · radio` y el hueco es
// `1,8 · radio`, así que tres dígitos ocupan `2,07 · radio` y se pasan un 15%
// SEA CUAL SEA EL TAMAÑO DE LA GEMA. El radio está en los dos lados de la
// desigualdad y se va. No era un problema de sitio: era de proporción.
//
// Y NO HAY NINGUNA BASE DE ❤️ QUE EVITE EL CASO: con la base mínima —10, el
// suelo de `BASE_LIMITS`— el tier 8 llega a 100 (`firstThreeDigitTier`). Las
// tres cifras salen siempre; la base solo elige en qué tier. Así que «que no
// pase» no estaba sobre la mesa.
//
// LA DECISIÓN, del 5 de septiembre de 2026: cada gema pinta su cifra al mayor
// tamaño que le quepa A SU PEOR CASO, y el peor caso lo dice el dato. Como ❤️
// Vida es el ÚNICO de los seis que llega a tres dígitos —👢 y tier son de uno, y
// ⚔️ Ataque se quedó en dos por el tope que salió de la curva—, es la única que
// encoge. Las demás no cambian.
//
// Y ENCOGE SIEMPRE, no solo cuando le tocan tres cifras. Eso es lo que corrige
// de verdad: el dibujo ya bajaba a 0,95 mirando `text.length > 2`, o sea la
// CADENA y no el dato, así que una ficha con ❤️ 100 pintaba su cifra pequeña y
// al recibir el primer golpe —99, dos caracteres— la agrandaba de golpe. El
// número cambiaba de tamaño al recibir daño. Atado al dato, no se mueve nunca.
//
// El tope de 1,15 sigue siendo el de antes: es lo que se juzgó en pantalla para
// las cifras de uno y dos dígitos, y no hay razón para que lo paguen ellas.

/** Lo más grande que se pinta una cifra, en radios de su gema. */
export const GEM_FONT_MAX = 1.15;
/** Ancho de un dígito de palo, en tamaños de fuente. */
export const GEM_DIGIT_WIDTH = 0.6;
/** El hueco de la gema, en radios: la cuerda útil de un círculo, no su diámetro. */
export const GEM_TEXT_SPAN = 1.8;
/** Lo que se deja sin llenar para que la cifra no vaya a tocar el borde. */
export const GEM_TEXT_MARGIN = 0.95;

/**
 * A qué tamaño pinta su cifra una gema, en radios de la propia gema.
 *
 * No se elige: es el mayor que cabe para `maxDigits`, topado en
 * `GEM_FONT_MAX`. Un dato sin cifra —el tipo de daño, el nombre— devuelve el
 * tope, porque a ellos la anchura no los limita.
 */
export function gemFontRatio(maxDigits: number): number {
  if (maxDigits <= 0) return GEM_FONT_MAX;
  return Math.min(GEM_FONT_MAX, (GEM_TEXT_MARGIN * GEM_TEXT_SPAN) / (maxDigits * GEM_DIGIT_WIDTH));
}

// --- El halo del marco -----------------------------------------------------
// EL COLOR DEL TIER NO PUEDE APOYARSE EN LO QUE TENGA DEBAJO *(Dario, 5 de
// septiembre de 2026)*, y esto es lo que se midió para llegar ahí.
//
// El marco lleva el tier y la casilla el bando, y hay TRES PARES que son el
// mismo tono Y LA MISMA LUMINOSIDAD —no parecidos: iguales—:
//
//   casilla propio  #6b86c4  vs raíl "raro"       #3b82f6   tono 222/217°, L 56/56
//   casilla aliado  #5fa85c  vs raíl "poco-comun" #3fae5a   tono 118/135°, L 63/63
//   casilla enemigo #b8544a  vs raíl "heroe"      #d9422c   tono   5/  8°, L 48/50
//
// En la paleta solo los separa la saturación. Lo que hoy los separa EN PANTALLA
// es otra cosa: la casilla se pinta al 34% sobre el suelo, y eso la hunde entre
// 20 y 30 puntos de L por debajo del marco. O sea que la separación no está en
// los colores, está en la transparencia — y por eso se estrecha según bajas por
// el tablero, que es donde el suelo se aclara:
//
//   ΔE2000 del par más apretado (héroe sobre casilla enemiga)
//     suelo far  #2c2924   26,7   (el marco, 23 puntos de L más claro)
//     suelo mid  #453f36   23,2   (17 puntos)
//     suelo near #605645   19,5   (10 puntos)
//
// Ninguno es confundible —el umbral está en 2,3— y el problema no es ese: es que
// al ser EL MISMO TONO, marco y casilla se leen como una sola cosa roja en vez de
// como tier + bando. Y encima lo que los separa está construido sobre arena:
// `$arena-ground-*` está marcado en su propio comentario como «un SUSTITUTO con
// fecha de caducidad», el hueco donde entra la ilustración del campo. Con una
// lámina cualquiera debajo, esos 10 puntos del frente pueden invertirse.
//
// Este tablero ya aprendió esto una vez: cuando entró la lámina, las bandas de
// despliegue dejaron de pintarse de relleno y pasaron a contorno (ArenaBoard.tsx,
// cabecera). La casilla del bando es el mismo relleno y no había pasado por ahí.
//
// LA RESPUESTA ES UN HALO, no tocar los colores: un filo casi negro por fuera del
// trazo de color, que es exactamente lo que ya hacen los rótulos de la arena con
// `$arena-label-halo` —«el rótulo se apoya en su propio halo y no en el color de
// debajo»—. Con él el marco compara contra negro y da igual lo que haya al otro
// lado. Y no es el segundo borde que se retiró el 3 de septiembre: aquello eran
// tres líneas DEL MISMO COLOR, y esta es del negro del cuerpo de la ficha, o sea
// su canto.
//
// Los dos números son ESPEJO de styles/components/_ficha.scss, como `lib/rarity.ts`
// lo es de `$rarity`: los pinta la hoja, y aquí están para poder medir lo que el
// halo le come a la casilla. Si cambian allí, cambian aquí.

/** Grosor del trazo de color del marco, en píxeles. */
export const FRAME_STROKE = 2.2;
/** Lo que el halo asoma por fuera de ese trazo, en píxeles. */
export const FRAME_HALO = 1;

/**
 * Lo que la casilla iluminada deja ver alrededor de la ficha, ya descontado todo
 * lo que se le pinta encima. El trazo va CENTRADO en el borde del hexágono, así
 * que de cada anchura solo estorba la mitad.
 */
export function litCellGap(g: PieceGeometry): number {
  return (g.hexWidth - g.tileW) / 2 - FRAME_STROKE / 2 - FRAME_HALO;
}

/**
 * Lo que lleva la ficha de Hearthstone: ⚔️ Ataque y ❤️ Vida, y nada más.
 *
 * Fue el punto de partida de la pantalla hasta el 3 de septiembre de 2026, y
 * dejó de serlo el día que la ficha pasó a abrir desnuda (`DEFAULT_FIELDS`).
 * Sigue aquí porque es la REFERENCIA con la que se mide cuántos datos lleva
 * encima —la comprobación de más abajo—, no un preajuste: el atajo que los ponía
 * de golpe se fue con el cambio de partida, «no tiene sentido ya».
 */
export const HEARTHSTONE_FIELDS: readonly FieldId[] = FIELDS.filter((f) => f.hearthstone).map(
  (f) => f.id,
);

/**
 * Con lo que se abre la ficha: NADA *(Dario, 3 de septiembre de 2026: «los datos
 * de la ficha por defecto quitados todos»)*.
 *
 * No es que las cifras se descarten —siguen todas a un botón—: es el orden en que
 * se juzga. Primero la PIEZA —su forma, su color, su retrato, su casilla
 * iluminada—, que es lo que se ve de lejos y lo que aquí está en obras, y encima
 * de una pieza que ya se lee se va poniendo lo que haga falta. Al revés no se
 * puede mirar: dos gemas encima del retrato tapan justo lo que hay que juzgar, y
 * a tamaño de partida son la mitad de la tinta de la ficha.
 *
 * Los dos de Hearthstone —⚔️ Ataque y ❤️ Vida— siguen siendo la REFERENCIA, la
 * de la comprobación «no lleva más datos que la ficha de Hearthstone», pero ya
 * no son un preajuste: el botón que los ponía de golpe se quitó el mismo día
 * *(Dario: «no tiene sentido ya»)*, porque era el atajo para volver a un punto de
 * partida que dejó de existir. Cada dato se pone por su cuenta.
 */
export const DEFAULT_FIELDS: readonly FieldId[] = [];

// --- La geometría ----------------------------------------------------------
// Todo sale del radio del hexágono, que lo manda el tablero y no el gusto
// (ArenaBoard: `hexSize` 34 y `ARENA_TILT` 0,67). Las tres fracciones de abajo
// son los diales de esta pantalla.

/**
 * La ficha, en radios de casilla: DEJA VER LA REJILLA POR DEBAJO, y desde el 3
 * de septiembre de 2026 un poco más *(Dario: «por defecto la ficha un poco más
 * pequeña, solo un poco»)*.
 *
 * Bajó de 0,82 a 0,78 —un 5% de diámetro— y lo que gana es AIRE: contra el borde
 * de su casilla pasa de 5,30 a 6,48 px por lado a tamaño de partida (el hexágono
 * de 34 de la arena). Ese aire dejó de ser estética el mismo día: es por donde
 * asoma la CASILLA ILUMINADA, o sea lo único que dice de quién es la ficha, así
 * que ensancharlo es darle más voz al azul, al verde y al rojo. De paso la barra
 * de ❤️ Vida se despega del borde de su hexágono, donde cabía por 0,43 px: ahora
 * le sobran 1,34.
 */
export const TILE_RADIUS = 0.78;

/**
 * El retrato dentro, en radios de casilla: EL MISMO que la ficha, o sea que
 * llega hasta el marco *(3 de septiembre de 2026: «solo un marco»)*.
 *
 * Antes se quedaba en 0,70 y entre el retrato y el borde quedaba una banda de
 * cartón. Con el marco de color repetido en el retrato eso eran tres trazos; sin
 * él, la banda sigue leyéndose como un segundo borde, así que el retrato sube a
 * ras del marco y la ficha queda con una sola línea. El dial lo puede volver a
 * meter hacia dentro para verlo.
 */
export const FACE_RADIUS = TILE_RADIUS;

export type PieceDials = {
  /** Radio de la ficha, en radios de casilla. */
  readonly tile: number;
  /** Radio de la cara —el retrato— en radios de casilla. */
  readonly face: number;
};

export const DEFAULT_DIALS: PieceDials = {
  tile: TILE_RADIUS,
  face: FACE_RADIUS,
};

/** Una caja de la ficha, en píxeles y relativa al centro de su casilla. */
export type PieceRect = {
  readonly dx: number;
  readonly dy: number;
  readonly w: number;
  readonly h: number;
  /** Radio de las esquinas, para las cajas que lo tienen. */
  readonly r: number;
};

export type PieceGeometry = {
  readonly size: number;
  readonly tilt: number;
  readonly dials: PieceDials;
  /** Radio de la ficha y de la cara, en píxeles del viewBox. */
  readonly tileR: number;
  readonly faceR: number;
  /** Ancho y alto de la ficha y de la cara, ya aplastados. */
  readonly tileW: number;
  readonly tileH: number;
  readonly faceW: number;
  readonly faceH: number;
  /** La barra de ❤️ Vida, colgando por debajo de la ficha. */
  readonly bar: PieceRect;
  /** Radio de una gema de cifra. */
  readonly gemR: number;
  readonly hexWidth: number;
  readonly hexHeight: number;
  /** Separación entre los centros de dos casillas contiguas de la misma fila. */
  readonly colGap: number;
  /** Y entre los centros de dos filas contiguas. Con tilt 0,67 es ~1 radio. */
  readonly rowGap: number;
  /**
   * Cuánto del hexágono de detrás tapa la ficha, en radios de casilla. Cero o
   * menos = no tapa nada, que es lo que consigue tumbarla.
   */
  readonly occlusion: number;
  /** Dónde cae una ranura, en píxeles del viewBox desde el centro de la casilla. */
  slotAt(slot: SlotId): { readonly dx: number; readonly dy: number };
};

export function pieceGeometry(
  size: number,
  tilt: number,
  dials: PieceDials = DEFAULT_DIALS,
): PieceGeometry {
  const { width: hexWidth, height: hexHeight } = Hex.hexSize(size, tilt);
  const tileR = size * dials.tile;
  const faceR = size * dials.face;

  // Un hexágono puntiagudo arriba mide √3 de ancho y 2 de alto por radio, y el
  // alto se aplasta con el tablero. De aquí sale que sea más ancho que alto.
  const { width: tileW, height: tileH } = Hex.hexSize(tileR, tilt);
  const { width: faceW, height: faceH } = Hex.hexSize(faceR, tilt);

  // Los vecinos, en píxeles y no de memoria: la casilla del este y la del
  // noreste, que con la arena comprimida NO están a la misma distancia.
  const here = Hex.toPixel({ q: 0, r: 0 }, size, tilt);
  const east = Hex.toPixel({ q: 1, r: 0 }, size, tilt);
  const northEast = Hex.toPixel({ q: 0, r: -1 }, size, tilt);
  const colGap = Math.abs(east.x - here.x);
  const rowGap = Math.abs(northEast.y - here.y);

  // El borde de arriba de la ficha contra el centro de la casilla de detrás.
  const top = -Math.max(tileH, faceH) / 2;
  const occlusion = (-rowGap - top) / size;

  // LA BARRA DE ❤️ VIDA, colgada del borde de abajo de la ficha.
  //
  // El ancho es menor que el de la ficha porque el hexágono se estrecha hacia la
  // punta: una barra tan ancha como la ficha sobresaldría por los lados y
  // dejaría de leerse como parte de ella. Y el ALTO es lo que es porque el sitio
  // es el que hay: entre el borde de abajo de la ficha y el de su casilla quedan
  // unos pocos píxeles a tamaño de partida, y la barra con su hueco tienen que
  // caber ahí.
  //
  // POR QUÉ LA BARRA NO SE PINTA DENTRO DE SU FICHA, y esto sí es una decisión de
  // dibujo con una medida detrás: cuelga por debajo de la ficha, o sea justo
  // donde empieza la casilla de delante, y en una rejilla hexagonal hay DOS
  // vecinos delante, medio hexágono a cada lado. Medido con el hexágono de 34 de
  // la arena: cada uno se come 12,1 px de los 34,8 de la barra, así que con las
  // dos casillas ocupadas solo quedaría el 31% del centro. Por eso la barra es
  // INTERFAZ y no parte de la pieza: se pinta en una capa por encima de todas las
  // fichas (ArenaBoard `renderPieceOverlay`), que es lo que hacen los videojuegos
  // con las suyas. Es también lo que quiere decir «flotante».
  const barH = Math.max(2, size * 0.08);
  const barW = tileW * 0.72;
  const bar: PieceRect = {
    dx: -barW / 2,
    dy: tileH / 2 + size * 0.028,
    w: barW,
    h: barH,
    r: barH / 2,
  };

  return {
    size,
    tilt,
    dials,
    tileR,
    faceR,
    tileW,
    tileH,
    faceW,
    faceH,
    bar,
    // La gema, a 0,25 del radio de la cara. Empezó en 0,32 —un tercio del ancho
    // del retrato, que es lo que ocupa en Hearthstone— y bajó al mirarla en
    // pantalla: a ese tamaño dos gemas se comen la cara Y se salen de la silueta
    // de la ficha, así que volvía a leerse como un dibujo con globos pegados.
    // Hearthstone puede permitírselo porque su carta es cuatro veces más grande
    // que esta casilla.
    gemR: faceR * 0.25,
    hexWidth,
    hexHeight,
    colGap,
    rowGap,
    occlusion,
    slotAt(slot: SlotId) {
      const s = SLOT_BY_ID[slot];
      return {
        dx: s.ux * faceR * SLOT_INSET,
        dy: s.uy * faceR * tilt * SLOT_INSET,
      };
    },
  };
}

/**
 * El rectángulo de la ilustración dentro de la cara, y cuánto del archivo se ve.
 *
 * La imagen se coloca detrás de la ventana hexagonal y se recorta con ella
 * (`slice`), así que el encuadre se hace moviendo y escalando la imagen, nunca
 * cortando el archivo. Y aquí está el techo del 55%: si el alto pedido dejara la
 * imagen más estrecha que la ficha, se agranda hasta cubrirla y lo que se
 * enseña deja de ser lo pedido. `cover` devuelve lo que de verdad se ve, que es
 * lo que la comprobación mira.
 */
export function portraitRect(
  g: PieceGeometry,
  framing: Framing,
): { readonly dx: number; readonly dy: number; readonly w: number; readonly h: number; readonly cover: number } {
  let h = g.faceH / framing.cover;
  let w = h / NOMINAL_ASPECT;
  if (w < g.faceW) {
    w = g.faceW;
    h = w * NOMINAL_ASPECT;
  }
  return { dx: -w / 2, dy: -framing.anchor * h, w, h, cover: g.faceH / h };
}

/** El techo de encuadre de una ficha tumbada: cuánto del alto del archivo cabe. */
export function coverCeiling(tilt: number): number {
  // faceH / (faceW · aspecto), con faceW = √3·r y faceH = 2·r·tilt.
  return (2 * tilt) / (Math.sqrt(3) * NOMINAL_ASPECT);
}

// --- Las comprobaciones ----------------------------------------------------
// Mismo trato que en `character.ts`: se enseñan PASEN O NO, con la regla y su
// lectura, porque la lista es la geometría leída en voz alta. Y ninguna es una
// opinión sobre si algo se ve bonito: todas son medidas.
//
// La lista puede ACORTARSE, y eso es distinto de que una se calle cuando falla:
// la de la gema solo sale si hay alguna cifra puesta en la ficha, porque mide lo
// que se pinta. Ninguna otra depende de los mandos.

export type PieceCheck = {
  readonly id: string;
  readonly rule: string;
  readonly reading: string;
  readonly ok: boolean;
  readonly message?: string;
};

const r2 = (n: number) => n.toFixed(2).replace(".", ",");
const pct = (n: number) => `${Math.round(n * 100)}%`;

export function pieceChecks(
  g: PieceGeometry,
  fields: readonly FieldId[],
  framing: Framing,
): readonly PieceCheck[] {
  const checks: PieceCheck[] = [];

  // 1. La rejilla se sigue viendo: si la ficha llena la casilla, el tablero
  //    desaparece debajo de las fichas y deja de leerse como una rejilla. Y
  //    desde el 3 de septiembre de 2026 ese mismo aire es lo que dice DE QUIÉN ES
  //    LA FICHA —la casilla iluminada asoma justo por ahí—, así que la medida
  //    dejó de ser solo estética.
  const gap = (g.hexWidth - g.tileW) / 2;
  const showsGrid = gap >= 1;
  checks.push({
    id: "rejilla-visible",
    rule: "La ficha deja ver su casilla por debajo",
    reading: `${r2(gap)} px de aire`,
    ok: showsGrid,
    message: showsGrid
      ? undefined
      : "Por debajo de 1 px de aire la ficha tapa su propia casilla y pasan dos cosas: el campo deja de leerse como una rejilla —parecen losetas, no fichas encima de un tablero— y la casilla iluminada se queda sin sitio donde verse, o sea que la ficha deja de decir si es mía, de un aliado o del enemigo.",
  });

  // 1-bis. Lo que el marco le come a esa casilla. La de arriba mide el aire
  //    ANTES de pintar nada; esta mide lo que queda después, que es lo que
  //    realmente se ve del azul, del verde o del rojo. Desde el 5 de septiembre
  //    de 2026 el marco no va solo: lleva halo, y el halo también come.
  const lit = litCellGap(g);
  const litOk = lit >= 1;
  checks.push({
    id: "casilla-visible",
    rule: "Queda casilla que ver después del marco y su halo",
    reading: `${r2(lit)} px de los ${r2(gap)} de aire`,
    ok: litOk,
    message: litOk
      ? undefined
      : "El marco y su halo se han comido la casilla iluminada. Es lo único que dice de quién es la ficha, así que si no asoma, la ficha deja de tener dueño: hay que bajar el radio de la ficha o adelgazar el halo, no quitarlo.",
  });

  // 2. Un solo marco: el retrato no puede pasarse del borde de la ficha, porque
  //    entonces el marco deja de cerrarla y el color del tier se parte.
  const insideFrame = g.dials.face <= g.dials.tile;
  checks.push({
    id: "un-solo-marco",
    rule: "El retrato no se sale del marco",
    reading: insideFrame
      ? `${r2((g.tileW - g.faceW) / 2)} px de margen`
      : `se pasa ${r2((g.faceW - g.tileW) / 2)} px`,
    ok: insideFrame,
    message: insideFrame
      ? undefined
      : "El marco es el ÚNICO trazo con color y lo que lleva es el TIER (decisión del 3 de septiembre de 2026), así que tiene que quedar por fuera del retrato: si el retrato lo desborda, la ficha se queda sin lo que se ve de lejos.",
  });

  // 3. El encuadre pedido, contra el techo de una ficha tumbada.
  const rect = portraitRect(g, framing);
  const fits = rect.cover >= framing.cover - 0.005;
  checks.push({
    id: "encuadre",
    rule: `El encuadre «${framing.label}» cabe en la ficha`,
    reading: `${pct(rect.cover)} de ${pct(framing.cover)} del archivo`,
    ok: fits,
    message: fits
      ? undefined
      : `Un hexágono tumbado es más ancho que alto, así que el techo son ${pct(
          coverCeiling(g.tilt),
        )} del alto del archivo: a partir de ahí la imagen no cubre el ancho y se agranda, o sea que se enseña menos de lo pedido. La figura entera ocupa el 85% y no entra de ninguna manera.`,
  });

  // 3-bis. La banda contra la FIGURA de la norma, que es lo que el encuadre de
  //    arriba no mira: aquel dice si cabe en la ficha, este si lo que cabe es el
  //    personaje. Dos bordes, y el de abajo es el que puede fallar de verdad —el
  //    de arriba lo garantiza `framingAnchor()` por construcción—: si la banda
  //    baja de la línea de los pies, la ficha enseña suelo vacío.
  const bandTop = framing.anchor - framing.cover / 2;
  const bandBottom = framing.anchor + framing.cover / 2;
  const showsGround = bandBottom > FIGURE_BOTTOM;
  checks.push({
    id: "banda-en-figura",
    rule: `La banda «${framing.label}» se queda dentro de la figura`,
    reading: `${pct(bandTop)}–${pct(bandBottom)} del archivo, con la figura en ${pct(
      FIGURE_TOP,
    )}–${pct(FIGURE_BOTTOM)}`,
    ok: !showsGround,
    message: showsGround
      ? "La banda pasa de la línea de los pies, así que por debajo solo hay suelo. Es sitio de ficha gastado en nada."
      : undefined,
  });

  // 4. Las cifras dentro de su gema, CADA UNA CON LA SUYA. Desde el 5 de
  //    septiembre de 2026 la fuente no es un número común: la deriva
  //    `gemFontRatio()` del peor caso del dato, así que lo que se mide aquí es
  //    la gema más apretada de las que hay puestas —la de ❤️ Vida siempre que
  //    esté, porque es la única de tres dígitos—.
  //
  //    ESTA COMPROBACIÓN YA NO PUEDE FALLAR mientras la fuente se derive, y eso
  //    es a propósito: queda de guardia, para que se encienda el día que alguien
  //    vuelva a escribir un tamaño fijo en el SVG. Lo que informa es la lectura.
  //
  //    SOLO SI HAY ALGUNA GEMA PUESTA, y por eso es la única comprobación que
  //    puede no salir: desde el 3 de septiembre de 2026 la ficha abre SIN datos
  //    (`DEFAULT_FIELDS`), y una medida de algo que no está en pantalla no es una
  //    medida —sería una alarma roja al lado de una ficha a la que no le pasa
  //    nada—. El nombre no cuenta: es una tira sobre la punta, no una gema.
  const span = g.gemR * GEM_TEXT_SPAN;
  const numbered = fields
    .map((id) => FIELD_BY_ID[id])
    .filter((f) => f.maxDigits > 0);
  const tightest = numbered
    .map((f) => ({
      field: f,
      width: f.maxDigits * g.gemR * gemFontRatio(f.maxDigits) * GEM_DIGIT_WIDTH,
    }))
    .sort((a, b) => b.width - a.width)[0];
  if (tightest) {
    const fits = tightest.width <= span;
    checks.push({
      id: "cifra-en-gema",
      rule: `La gema más apretada —${tightest.field.label}, ${tightest.field.maxDigits} dígitos— entra`,
      reading: `${r2(tightest.width)} de ${r2(span)} px`,
      ok: fits,
      message: fits
        ? undefined
        : "La fuente de esa gema no sale de `gemFontRatio()`: hay un tamaño escrito a mano en el dibujo.",
    });
  }

  // 5. Una ranura, una cosa.
  const used = new Map<SlotId, FieldId[]>();
  for (const id of fields) {
    const slot = FIELD_BY_ID[id].slot;
    used.set(slot, [...(used.get(slot) ?? []), id]);
  }
  const clashes = [...used.entries()].filter(([, ids]) => ids.length > 1);
  checks.push({
    id: "ranura-ocupada",
    rule: "Ningún dato comparte esquina con otro",
    reading: clashes.length === 0 ? `${fields.length} en ${used.size}` : `${clashes.length} choques`,
    ok: clashes.length === 0,
    message:
      clashes.length === 0
        ? undefined
        : clashes
            .map(
              ([slot, ids]) =>
                `${SLOT_BY_ID[slot].label}: ${ids.map((i) => FIELD_BY_ID[i].label).join(" y ")}`,
            )
            .join(" · "),
  });

  // 6. Cuántos datos lleva encima, contra los dos de la referencia.
  const asHearthstone = fields.length <= HEARTHSTONE_FIELDS.length;
  checks.push({
    id: "cuantos-datos",
    rule: "No lleva más datos que la ficha de Hearthstone",
    reading: `${fields.length} de ${HEARTHSTONE_FIELDS.length}`,
    ok: asHearthstone,
    message: asHearthstone
      ? undefined
      : "No es ilegal: es el aviso de que se está pasando de la referencia. De las 8 Habilidades solo ❤️ Vida y 👢 Movimiento cambian durante la batalla; las otras seis están en la carta y se pueden consultar sin mirar el tablero.",
  });

  // 7. Lo que se ganó al tumbarla, escrito para que no se pierda.
  const clear = g.occlusion <= 0;
  checks.push({
    id: "tapa-la-fila-de-detras",
    rule: "La ficha no tapa la fila de detrás",
    reading: clear ? `${r2(-g.occlusion)} radios de margen` : `tapa ${r2(g.occlusion)} radios`,
    ok: clear,
    message: clear
      ? undefined
      : "Con la arena a 0,67 de inclinación las filas están a un radio, así que cualquier cosa levantada muerde el hexágono de detrás. Es lo que tumbó el medallón de pie.",
  });

  // 8. La barra de ❤️ Vida cuelga por debajo de la ficha, y por debajo de la
  //    ficha empieza la casilla de delante.
  const barBottom = g.bar.dy + g.bar.h;
  const barIn = barBottom <= g.hexHeight / 2;
  checks.push({
    id: "barra-en-su-casilla",
    rule: "La barra de ❤️ Vida no se sale de su casilla",
    reading: `${r2(barBottom)} de ${r2(g.hexHeight / 2)} px`,
    ok: barIn,
    message: barIn
      ? undefined
      : "Si la barra pasa del borde de abajo de su hexágono, la ficha de la fila de delante se la come al pintarse encima —el orden del pintor va de atrás hacia delante—, así que las fichas del fondo se quedarían sin ❤️ Vida visible.",
  });

  return checks;
}

// --- La ❤️ Vida como barra -------------------------------------------------

/**
 * Lo que se pinta de rojo de la barra de ❤️ Vida, en píxeles.
 *
 * Es la otra forma de decir lo mismo que la cifra, y no la sustituye: la cifra
 * dice cuánto queda y la barra dice cuánto queda DE LO QUE HABÍA, que es la
 * pregunta de un intercambio. Se juzgan juntas o no se juzgan.
 *
 * Antes esto era un arco por el perímetro del hexágono y se descartó por una
 * razón que solo se ve con diez fichas juntas: en un polígono aplastado, el mismo
 * 10% de mordisco ocupa distinta longitud según por qué lado caiga, así que dos
 * fichas igual de tocadas no se veían igual. En una barra recta, la misma
 * longitud significa siempre lo mismo.
 *
 * Nunca devuelve menos de cero ni más que el ancho de la barra: la ❤️ Vida de una
 * ficha viva puede pasar de su máximo (curaciones) y la de una muerta bajar de
 * cero, y ninguna de las dos cosas la arregla la barra.
 */
export function lifeWidth(g: PieceGeometry, fraction: number): number {
  return g.bar.w * Math.min(1, Math.max(0, fraction));
}

// --- El encuadre de una hoja de fichas ------------------------------------

/**
 * La caja que hay que enseñar para que unas fichas quepan enteras.
 *
 * La usan las dos hojas que pintan fichas fuera de la arena —el calibre y la tira
 * de tiers— y vive aquí porque no es una decisión de dibujo: es la suma de lo que
 * la ficha se sale de su casilla por los cuatro lados, y eso lo sabe la
 * geometría. La ficha sobresale por ARRIBA (encima de la punta van los estados y
 * el nombre) y por ABAJO (la barra de ❤️ Vida cuelga), así que un encuadre hecho
 * con el hexágono a secas corta las dos cosas.
 *
 * @param centres - Los centros de las casillas que se enseñan, en píxeles.
 */
export function stageBox(
  g: PieceGeometry,
  centres: readonly { readonly x: number; readonly y: number }[],
  air: { readonly top?: number; readonly side?: number; readonly bottom?: number } = {},
): { readonly x: number; readonly y: number; readonly width: number; readonly height: number } {
  const side = air.side ?? g.gemR * 1.2;
  // Arriba, sitio para las chapas de estado y el rótulo del nombre, que van por
  // encima de la punta de la ficha porque en una ficha tumbada no hay otro sitio.
  const top = air.top ?? g.gemR * 4;
  const bottom = air.bottom ?? g.gemR * 1.2;

  const xs = centres.map((c) => c.x);
  const ys = centres.map((c) => c.y);
  // Lo que la ficha ocupa por encima y por debajo del centro de su casilla,
  // contra lo que ocupa la casilla misma: manda el que más se salga.
  const over = Math.max(g.hexHeight / 2, g.tileH / 2);
  const under = Math.max(g.hexHeight / 2, g.bar.dy + g.bar.h);

  const x = Math.min(...xs) - g.hexWidth / 2 - side;
  const y = Math.min(...ys) - over - top;
  return {
    x,
    y,
    width: Math.max(...xs) + g.hexWidth / 2 + side - x,
    height: Math.max(...ys) + under + bottom - y,
  };
}

/** El encuadre de `stageBox`, ya en el formato que pide un `viewBox`. */
export function stageViewBox(
  g: PieceGeometry,
  centres: readonly { readonly x: number; readonly y: number }[],
  air?: { readonly top?: number; readonly side?: number; readonly bottom?: number },
): string {
  const b = stageBox(g, centres, air);
  return `${b.x.toFixed(1)} ${b.y.toFixed(1)} ${b.width.toFixed(1)} ${b.height.toFixed(1)}`;
}
