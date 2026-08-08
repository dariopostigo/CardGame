// =========================================================================
// Arte de las fichas del tablero
//
// Capa de presentación pura: el motor solo conoce identificadores ("tesoro",
// "enemigo"), nunca cómo se pintan. Aquí vive el DIBUJO de cada uno y su
// rótulo; el color lo pone styles/components/_piece.scss desde el mapa $piece
// de settings, y la geometría del disco la monta BoardPiece.tsx.
//
// VOCABULARIO (dos cosas distintas, dos familias distintas):
//   · ficha de contenido (`BoardToken`) — las 6 de board-map.md §4. Es lo que
//     hay EN el hexágono, y se retira al resolverlo.
//   · ficha de personaje (`PawnId`)     — el héroe y el enemigo ya activo. Es
//     quien SE MUEVE por el tablero, y eso es lo único que la separa de la otra
//     familia: una ficha de contenido espera donde está, un personaje anda.
//
// Las dos van igual: DISCO tumbado en la loseta. La familia de localización
// —Pueblo, Mazmorra, Guarida como placa impresa en el suelo— ya no existe: el
// Pueblo y la Mazmorra son terreno de la loseta (`TerrainId`) y la Guarida es un
// dato invisible del motor (`LocationId`), así que no hay nada que dibujar.
//
// DOS TIPOS DE DIBUJO conviven aquí, y la diferencia importa:
//   · ruta (Amenaza, Enemigo y el Enemigo activo) — pinta con `currentColor`,
//     así que coge la tinta que le da $piece y se adapta a la cara de su ficha.
//   · emoji en un <text> (Tesoro, Exploración, Personaje, el Héroe, Terreno y
//     Jefe) — trae SUS colores y no obedece a la tinta de $piece, así que la
//     cara de esas seis tiene que hacerle de PAPEL: por eso Tesoro va en oro
//     claro y el Héroe en azul pálido. Además dependen de la fuente del
//     sistema: se pintan distinto en cada uno, y si es vieja sale el
//     rectángulo de carácter desconocido. Se usan porque son los que se han
//     pedido; si un día hay que uniformar la paleta, son las seis que hay que
//     redibujar.
//
// Todo es arte provisional en cualquier caso: la fase de arte está diferida
// (docs/status.md §4).
//
// Todos los glifos están dibujados en una caja de 24×24 centrada en (12,12), y
// nada se sale del círculo de radio 11: así el disco los encierra sin recortes.
// =========================================================================

import type { ReactNode } from "react";
import type { BoardToken } from "@/lib/rules/state";

/**
 * Las fichas de personaje: quien se mueve por el tablero, más el marcador de
 * jefe.
 *
 * Se llaman peones y no "figuras" porque ya no son figuras: eran siluetas de
 * pie sobre una peana —la única familia que se levantaba de la loseta— y ahora
 * van en el mismo disco tumbado que las seis de contenido. Lo que las sigue
 * separando es que se MUEVEN.
 *
 * El enemigo activo es "enemigo-activo" y no "enemigo" aunque sea el mismo bicho
 * que la ficha latente: el id es la clave con la que _piece.scss le busca el
 * color, y latente y activo tienen que salir de DISTINTO color. Compartir id
 * sería compartir cara, que es justo lo que no puede pasar.
 *
 * "jefe" es distinto de los otros dos: no es un bando, es una CATEGORÍA de
 * peligro (`../../../docs/characters/enemies.md` §3) — el Jefe de capítulo y el
 * Jefe final de campaña comparten esta única ficha (corona), sin distinguirse
 * entre sí. Vive en Modo Campaña, que todavía no tiene motor (`board-gen.ts` no
 * lo coloca): es diseño por delante del sistema, igual que ya pasó con los
 * bloques de combate de `enemies.md` §5b antes de que existiera el combate.
 */
/**
 * "heroe-1".."heroe-4" y no un "heroe" único: en co-op (characters/heroes.md
 * §4, 1-4 fichas en el mismo tablero, repetir clase permitido) lo que hay que
 * distinguir a golpe de vista es el PUESTO en la mesa, no la clase — dos
 * Guerreros necesitan caras distintas. Los cuatro comparten el mismo glifo
 * (mago); lo que cambia es el color, en $piece.
 */
export type PawnId = "heroe-1" | "heroe-2" | "heroe-3" | "heroe-4" | "enemigo-activo" | "jefe";

export type PieceArt = {
  /** Qué representa, para el tooltip y la leyenda. */
  readonly label: string;
  /** El glifo, en la caja de 24×24. */
  readonly art: ReactNode;
};

// --- Las 6 fichas de contenido (board-map.md §4) ---------------------------

export const TOKEN_ART: Readonly<Record<BoardToken, PieceArt>> = {
  exploracion: {
    label: "Exploración: comodín, puede salir cualquier cosa",
    art: (
      <text x="12" y="12" fontSize="19" textAnchor="middle" dominantBaseline="central">
        {"\u{1F441}\u{FE0F}"}
      </text>
    ),
  },
  amenaza: {
    label: "Amenaza: peligro ambiguo, normalmente un enemigo",
    art: (
      // Exclamación sola, y lo más grande que cabe en el disco. Llevaba un
      // rombo alrededor y a tamaño de partida no se leía: el disco YA es un
      // marco, así que el segundo marco solo comía el sitio del signo.
      <>
        <path fill="currentColor" d="M 9.4 2.4 L 14.6 2.4 L 13.6 15.6 L 10.4 15.6 Z" />
        <circle fill="currentColor" cx="12" cy="19.8" r="2.6" />
      </>
    ),
  },
  tesoro: {
    label: "Tesoro: cartas y/o oro garantizados",
    art: (
      // Cofre abierto: U+1FA8E, de Unicode 17 (2025). Con fuente vieja sale el
      // rectángulo de carácter desconocido.
      <text x="12" y="12" fontSize="19" textAnchor="middle" dominantBaseline="central">
        {"\u{1FA8E}"}
      </text>
    ),
  },
  terreno: {
    label: "Terreno: atajo arriesgado, prueba FUE/DES vs CD 12",
    art: (
      // Montaña: U+26F0 + U+FE0E (variante de PRESENTACIÓN DE TEXTO, no la
      // emoji a color de U+FE0F). Antes era una cresta a ruta; pasa a este
      // glifo por decisión de diseño, así que el violeta de su ficha ahora
      // hace de papel en vez de tinta.
      <text x="12" y="12" fontSize="19" textAnchor="middle" dominantBaseline="central">
        {"\u{26F0}\u{FE0E}"}
      </text>
    ),
  },
  personaje: {
    label: "Personaje: NPC con el que interactuar",
    art: (
      // Elfo: U+1F9DD + tono de piel U+1F3FB + U+200D U+2642 U+FE0F. Es una
      // secuencia ZWJ de cuatro puntos de código, así que una fuente que no la
      // tenga completa la parte en dos glifos (elfo + símbolo de varón) en vez
      // de fallar limpio. Sustituye a un busto dibujado a ruta.
      <text x="12" y="12" fontSize="19" textAnchor="middle" dominantBaseline="central">
        {"\u{1F9DD}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}"}
      </text>
    ),
  },
  enemigo: {
    label: "Enemigo: combate al quedar adyacente",
    art: <HornedSkull />,
  },
};

/**
 * Calavera con cuernos: el glifo del enemigo, y lo comparten sus DOS fichas —el
 * disco latente y el disco activo— porque es el mismo enemigo. Está aquí como
 * función y no repetido en los dos sitios justo por eso: si se redibuja, se
 * redibuja una vez, y latente y activo no pueden separarse por descuido.
 *
 * Lo que distingue al activo es solo el COLOR de su cara (ver $piece), que es
 * exactamente lo que se pidió: la misma criatura, otro estado.
 */
function HornedSkull() {
  return (
    <>
      {/* Cuencas, nariz y dientes son huecos del propio relleno. */}
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M 12 2.6 C 17.4 2.6, 21 6.6, 21 11.6 C 21 14.6, 19.6 16.6, 17.6 17.6
           L 17.6 20.6 L 6.4 20.6 L 6.4 17.6 C 4.4 16.6, 3 14.6, 3 11.6
           C 3 6.6, 6.6 2.6, 12 2.6 Z
           M 7.1 11.2 A 2.3 2.3 0 1 0 11.7 11.2 A 2.3 2.3 0 1 0 7.1 11.2 Z
           M 12.3 11.2 A 2.3 2.3 0 1 0 16.9 11.2 A 2.3 2.3 0 1 0 12.3 11.2 Z
           M 12 13.6 L 13.5 16.6 L 10.5 16.6 Z
           M 9.4 17.8 L 10.4 17.8 L 10.4 20.6 L 9.4 20.6 Z
           M 13.6 17.8 L 14.6 17.8 L 14.6 20.6 L 13.6 20.6 Z"
      />
      {/* Cuernos, aparte: es lo que la separa de una calavera cualquiera. */}
      <path
        fill="currentColor"
        d="M 3.6 6.6 C 1.4 5, 1.2 2.4, 3.2 1.2 C 3 3.6, 4.2 5.2, 5.8 6 Z
           M 20.4 6.6 C 22.6 5, 22.8 2.4, 20.8 1.2 C 21 3.6, 19.8 5.2, 18.2 6 Z"
      />
    </>
  );
}

// --- Las 3 fichas de personaje --------------------------------------------

/**
 * El héroe, el enemigo activo y el marcador de Jefe, en el MISMO disco que las
 * seis de contenido.
 *
 * Eran dos figuras de pie sobre una peana, y la regla de la casa era "solo los
 * personajes se ponen de pie". Ya no: las nueve fichas van tumbadas y son la misma
 * pieza, así que lo que distingue a un personaje no es la forma sino el dibujo y
 * el color. Sale más barato de mirar —no hay nada que sobresalga del hexágono y
 * tape al vecino de detrás— y de dibujar, que es lo que importa mientras el arte
 * siga siendo provisional.
 */
/**
 * Mago: U+1F9D9 + tono de piel U+1F3FB + U+200D U+2642 U+FE0F. Secuencia ZWJ
 * de cuatro puntos de código, igual que el elfo de la ficha de Personaje, con
 * el mismo riesgo: una fuente que no la tenga completa la parte en dos glifos
 * (mago + símbolo de varón).
 *
 * Comparte glifo de FAMILIA con esa ficha —los dos son humanoides con
 * capucha—, así que lo que tiene que separarlos es la cara, no el dibujo. Es
 * función y no repetido cuatro veces (una por héroe-1..4) justo por eso: si se
 * redibuja, se redibuja una vez, y los cuatro puestos de la mesa no pueden
 * separarse por descuido — igual que `HornedSkull` para el enemigo.
 */
function MageGlyph() {
  return (
    <text x="12" y="12" fontSize="19" textAnchor="middle" dominantBaseline="central">
      {"\u{1F9D9}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}"}
    </text>
  );
}

export const PAWN_ART: Readonly<Record<PawnId, PieceArt>> = {
  // Los cuatro puestos de la mesa (co-op, characters/heroes.md §4): mismo
  // glifo, y lo único que los separa es la cara ($piece "heroe-1".."heroe-4").
  // "heroe-1" es el azul PÁLIDO validado a tamaño de partida en /dev/pieces
  // (board-map.md §4c) contra el azul medio de la ficha de Personaje.
  "heroe-1": { label: "Héroe 1: tu ficha en el tablero", art: <MageGlyph /> },
  "heroe-2": { label: "Héroe 2: tu ficha en el tablero", art: <MageGlyph /> },
  "heroe-3": { label: "Héroe 3: tu ficha en el tablero", art: <MageGlyph /> },
  "heroe-4": { label: "Héroe 4: tu ficha en el tablero", art: <MageGlyph /> },
  "enemigo-activo": {
    // La MISMA calavera con cuernos que el disco latente, y a propósito: es el
    // mismo enemigo, así que no se inventa un icono nuevo para decir que se ha
    // despertado. Lo que cambia es la cara (ver $piece).
    label: "Enemigo activo: te ha detectado y viene a por ti",
    art: <HornedSkull />,
  },
  jefe: {
    // Corona: U+1F451. Comparten esta única ficha el Jefe de capítulo y el Jefe
    // final de campaña (../../../docs/characters/enemies.md §3) — la corona dice
    // "esto es un jefe", no cuál de los dos; si algún día hiciera falta
    // distinguirlos, se separan por color (como latente/activo), no por glifo
    // nuevo. Reservada a Modo Campaña: board-gen.ts no la coloca todavía.
    label: "Jefe: Jefe de capítulo o Jefe final de campaña (Modo Campaña)",
    art: (
      <text x="12" y="12" fontSize="19" textAnchor="middle" dominantBaseline="central">
        {"\u{1F451}"}
      </text>
    ),
  },
};

// --- Listas, para recorrer sin repetir el orden en cada pantalla -----------

/** Orden de las fichas: de la más frecuente a la más rara (board-map.md §2c). */
export const TOKEN_IDS: readonly BoardToken[] = [
  "amenaza",
  "personaje",
  "enemigo",
  "tesoro",
  "exploracion",
  "terreno",
];

export const PAWN_IDS: readonly PawnId[] = [
  "heroe-1",
  "heroe-2",
  "heroe-3",
  "heroe-4",
  "enemigo-activo",
  "jefe",
];

/** Nombre legible de los 3 Élite, para el resumen de la partida. */
export const ELITE_LABEL: Record<string, string> = {
  "capitan-bandido": "Capitán bandido",
  "trol-de-las-minas": "Trol de las minas",
  "arana-matriarca": "Araña matriarca",
};
