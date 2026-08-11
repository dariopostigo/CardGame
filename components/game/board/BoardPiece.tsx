"use client";

// =========================================================================
// Una ficha sobre el tablero (presentacional)
//
// Recibe qué ficha es y dónde va, y la pinta. No decide nada: el dibujo lo
// trae piece-art.tsx y el color lo pone styles/components/_piece.scss desde el
// mapa $piece. La geometría de la loseta (centros, vértices) es de hex.ts; lo
// que se calcula aquí es solo el volumen de la PIEZA.
//
// LA REGLA DE LA CASA, y es la decisión de diseño de este apartado:
//
//   TODA ficha va tumbada en la loseta · todas son el mismo disco
//
// Es un cartón que descansa sobre el tablero, comprimido por la misma inclinación
// que la loseta, con la sombra corta de la capa de fichas y dos filetes propios.
// Se probó de pie —mirando a la cámara, para que el glifo no se achatara— y
// sobra: con la inclinación en 0,85 el glifo solo pierde un 15 % de altura y se
// lee igual, mientras que de pie el disco tapaba el hexágono de detrás y bailaba
// entre dos casillas.
//
// Antes había tres geometrías: el disco de contenido, la PLACA de localización y
// la PEANA de personaje, la única que se levantaba. Ya no queda ninguna de las
// dos: las localizaciones se fueron —Pueblo y Mazmorra son terreno de la loseta,
// la Guarida es un dato invisible— y el héroe y el enemigo activo pasaron al
// mismo disco que todo lo demás. Lo que separa una ficha de otra es su dibujo y
// su color, no su forma.
//
// El volumen sale de la GEOMETRÍA (compresión por `tilt` y la sombra que pone la
// capa entera en HexBoard), nunca pintado en el dibujo: es la misma regla que
// sostiene el tablero inclinado, y es lo que permite que el arte definitivo siga
// siendo cenital.
// =========================================================================

import type { BoardToken } from "@/lib/rules/state";
import { PAWN_ART, TOKEN_ART, type PawnId } from "./piece-art";

/**
 * Qué ficha se pinta. Las dos familias se dibujan IGUAL —el mismo disco— y la
 * distinción se mantiene porque no son la misma cosa para el motor: una ficha de
 * contenido es lo que hay en el hexágono y se retira al resolverlo; un peón es
 * quien anda por el tablero. La familia decide de qué mapa sale el dibujo, y el
 * id, cuál.
 */
export type PieceSpec =
  | { readonly family: "token"; readonly id: BoardToken }
  | { readonly family: "pawn"; readonly id: PawnId };

/** El dibujo y el rótulo de una ficha, de la familia que sea. */
function artOf(piece: PieceSpec) {
  return piece.family === "token" ? TOKEN_ART[piece.id] : PAWN_ART[piece.id];
}

/**
 * Estado de una ficha de contenido:
 *   · placed — está ahí, sin resolver.
 *   · spent  — ya se resolvió: la ficha SE RETIRA y queda su huella grabada en
 *     el terreno. Sin relieve y sin sombra a propósito, porque ya no hay pieza:
 *     es la marca de "aquí ya estuve", para que el jugador no vuelva a andar
 *     hasta un cofre vacío.
 *
 * Solo lo tienen las de contenido: un peón no se resuelve, se mueve.
 */
export type PieceState = "placed" | "spent";

type Props = {
  piece: PieceSpec;
  /** Centro del hexágono en píxeles del viewBox. */
  x: number;
  y: number;
  /** Radio del hexágono: todas las medidas de la ficha salen de él. */
  hexSize: number;
  /** La compresión vertical del tablero (HexBoard.BOARD_TILT). */
  tilt?: number;
  state?: PieceState;
  /** Texto para lectores de pantalla; sin él la ficha es decorativa. */
  label?: string;
};

// --- Medidas, en fracción del radio del hexágono --------------------------

/**
 * Radio del disco, en fracción del radio del hexágono. Es el de TODAS las fichas:
 * medía 0,34 cuando convivía con la placa de localización de 0,5, y al quedarse
 * el disco solo se queda con la medida grande.
 */
const LAID_RADIUS = 0.5;

/** Lado de la caja del glifo, en radios de la ficha que lo lleva. */
const GLYPH_BOX = 1.5;

/** Grosor del filete oscuro que rodea al disco, en píxeles del viewBox. */
const RIM = 1.1;

/**
 * Grosor del cartón de una ficha, en fracción de su radio: cuánto asoma su canto
 * por debajo de la cara. Es el mismo recurso que le da volumen a la loseta
 * (SKIRT_DEPTH en HexBoard), a su escala: la pieza es un cartón grueso, no una
 * pegatina, y eso se dice extruyendo su silueta, no pintándole una sombra.
 */
const TOKEN_DEPTH = 0.14;

/**
 * El brillo de arriba, en fracción del radio: cuánto ocupa y cuánto se sube del
 * centro. La luz del tablero viene de arriba —es la misma que proyecta la sombra
 * de la loseta hacia abajo—, así que la ficha tiene que estar más clara por ahí.
 * Canto abajo y brillo arriba son lo que la hace parecer bombeada.
 */
const GLOSS_SIZE = 0.78;
const GLOSS_RISE = 0.3;

/**
 * Coloca un dibujo de la caja de 24×24 centrado en (cx, cy).
 *
 * @param {number} box - Lado que ocupará la caja en el viewBox.
 * @param {number} [yScale=1] - Compresión vertical, para lo que va tumbado.
 * @returns {string} El `transform` del grupo que envuelve al dibujo.
 */
function glyphTransform(cx: number, cy: number, box: number, yScale = 1): string {
  const k = box / 24;
  return `translate(${cx.toFixed(2)} ${cy.toFixed(2)}) scale(${k.toFixed(4)} ${(k * yScale).toFixed(4)}) translate(-12 -12)`;
}

export default function BoardPiece({
  piece,
  x,
  y,
  hexSize,
  tilt = 1,
  state = "placed",
  label,
}: Props) {
  const title = label ? <title>{label}</title> : null;

  // Ficha resuelta: no hay pieza, hay huella. Vale igual para una ficha de
  // contenido y para una localización ya visitada.
  if (state === "spent") {
    const r = hexSize * LAID_RADIUS;
    return (
      <g className="piece" data-piece={piece.id} data-family={piece.family} data-state="spent">
        {title}
        <ellipse className="piece__mark" cx={x} cy={y} rx={r} ry={r * tilt} />
      </g>
    );
  }

  // El disco, tumbado en la loseta, y es el mismo para las dos familias. Todo lo
  // que lo compone —filetes, relieve y glifo— se comprime con la misma `tilt` que
  // el hexágono, porque está en el mismo plano que él.
  //
  // El RELIEVE son dos elementos y ninguno está pintado en el dibujo: el canto
  // asoma por debajo de la cara (la pieza tiene grosor) y el brillo va arriba (la
  // luz viene de arriba, la misma que tira la sombra de la loseta hacia abajo).
  // Los dos son neutros, así que valen igual para las nueve fichas.
  const r = hexSize * LAID_RADIUS;
  const depth = r * TOKEN_DEPTH;

  // El grupo entero se posiciona con `transform`, no con cx/cy absolutos en
  // cada elipse: así CSS puede transicionar UN solo valor (styles/components/
  // _piece.scss) cuando `x`/`y` cambian de hexágono, y la ficha se desliza en
  // vez de saltar. Todo lo de dentro queda en coordenadas locales a (0,0).
  return (
    <g
      className="piece"
      data-piece={piece.id}
      data-family={piece.family}
      transform={`translate(${x} ${y})`}
    >
      {title}
      {/* Canto: la misma elipse desplazada hacia abajo. Va detrás de la cara, así
          que solo se ve la media luna de abajo, que es exactamente lo que se ve
          del grosor de un cartón apoyado en la mesa. */}
      <ellipse className="piece__edge" cx={0} cy={depth} rx={r} ry={r * tilt} />

      {/* Dos filetes y no uno: el oscuro de fuera separa el disco del Bosque y
          de la Mazmorra, y el claro de la propia cara lo separa del Camino. Con
          uno solo, la ficha desaparecía sobre la mitad del tablero. */}
      <ellipse className="piece__rim" cx={0} cy={0} rx={r + RIM} ry={(r + RIM) * tilt} />
      <ellipse className="piece__face" cx={0} cy={0} rx={r} ry={r * tilt} />

      {/* Brillo. Debajo del glifo para que no le lave el color. */}
      <ellipse
        className="piece__gloss"
        cx={0}
        cy={-r * tilt * GLOSS_RISE}
        rx={r * GLOSS_SIZE}
        ry={r * tilt * GLOSS_SIZE * 0.6}
      />

      <g className="piece__glyph" transform={glyphTransform(0, 0, r * GLYPH_BOX, tilt)}>
        {artOf(piece).art}
      </g>
    </g>
  );
}

/**
 * La misma ficha, suelta y a plomo, para leyendas y catálogos. No lleva
 * inclinación ni apoyo: fuera del tablero no hay mesa sobre la que apoyarse.
 *
 * @param {number} [size=18] - Lado en píxeles del icono.
 */
export function PieceIcon({
  piece,
  size = 18,
  className,
}: {
  piece: PieceSpec;
  size?: number;
  className?: string;
}) {
  const art = artOf(piece);

  return (
    <svg
      className={["piece-icon", className].filter(Boolean).join(" ")}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      role="img"
      aria-label={art.label}
      data-piece={piece.id}
      data-family={piece.family}
    >
      <circle className="piece__face" cx="12" cy="12" r="10.8" />
      <g className="piece__glyph" transform="translate(12 12) scale(0.7) translate(-12 -12)">
        {art.art}
      </g>
    </svg>
  );
}
