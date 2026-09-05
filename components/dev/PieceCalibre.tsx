"use client";

// =========================================================================
// La hoja de calibre de la ficha (presentacional)
//
// La misma ficha de la escena, en grande y con dos cosas que a tamaño de partida
// no se pueden mirar:
//
//   1. SU PROPIO HEXÁGONO debajo, dibujado. Es lo que enseña que el diámetro no
//      es una decisión de dibujo: lo manda la casilla (registro de /dev, módulo
//      «pieza»: «el diámetro real — lo manda el hexágono de la arena, no el
//      gusto»).
//   2. LA CASILLA DE DETRÁS con su ficha, en fantasma. Es la comprobación de que
//      tumbar la ficha resolvió el solape: dos fichas en filas contiguas no
//      se pisan, cosa que un cuerpo de pie sí hacía —con la arena a 0,67 las
//      filas están a un radio—. Y de paso enseña lo otro que hay que mirar: dos
//      fichas del mismo bando pegadas, donde lo único que las separa es el
//      retrato.
//
// La escala es la de verdad multiplicada, no otra: se pinta con el mismo
// `pieceGeometry` y el mismo componente que la arena, solo con otro radio de
// hexágono. Si se juzgara con un dibujo aparte no se estaría juzgando la ficha.
// =========================================================================

import * as Hex from "@/lib/v3/hex";
import {
  pieceGeometry,
  stageViewBox,
  type FieldId,
  type FramingId,
  type PieceDials,
} from "@/lib/v3/piece";
import PieceToken, { PieceLifeBar, type PieceView } from "./PieceToken";

export type PieceCalibreProps = {
  piece: PieceView;
  /** La de detrás, para ver el solape. Sin ella se pinta solo su casilla. */
  behind?: PieceView;
  /** Radio del hexágono de esta hoja, en píxeles. La arena usa 34. */
  hexSize: number;
  tilt: number;
  dials: PieceDials;
  framing: FramingId;
  fields: readonly FieldId[];
  lifeBar: boolean;
  className?: string;
};

export default function PieceCalibre({
  piece,
  behind,
  hexSize,
  tilt,
  dials,
  framing,
  fields,
  lifeBar,
  className,
}: PieceCalibreProps) {
  const g = pieceGeometry(hexSize, tilt, dials);

  // Dos casillas contiguas: la de delante y la de la fila de detrás. En una
  // rejilla hexagonal NO hay ninguna justo encima —el vecino de arriba va medio
  // hexágono a un lado—, así que el encuadre se saca de las dos y no de una: con
  // el ancho de una sola, la de detrás salía cortada por el filo.
  const front = Hex.toPixel({ q: 0, r: 0 }, hexSize, tilt);
  const back = Hex.toPixel({ q: 0, r: -1 }, hexSize, tilt);

  return (
    <svg
      className={className}
      viewBox={stageViewBox(g, [front, back])}
      role="img"
      aria-label={`Ficha de ${piece.name}`}
    >
      {/* Las dos casillas, en trazo: la rejilla de la arena, sin su suelo. */}
      <polygon
        className="ficha-calibre__hex"
        points={Hex.polygonPoints(back.x, back.y, hexSize, tilt)}
      />
      <polygon
        className="ficha-calibre__hex"
        points={Hex.polygonPoints(front.x, front.y, hexSize, tilt)}
      />

      {/* Orden de pintor: primero la de atrás. */}
      {behind && (
        <g opacity={0.55}>
          <PieceToken
            piece={behind}
            cx={back.x}
            cy={back.y}
            geometry={g}
            framing={framing}
            fields={fields}
          />
        </g>
      )}
      <PieceToken
        piece={piece}
        cx={front.x}
        cy={front.y}
        geometry={g}
        framing={framing}
        fields={fields}
      />

      {/* Las barras, después de las DOS fichas: es interfaz y va por encima. Aquí
          es donde se ve para qué —la barra de la de atrás cae justo donde está la
          de delante—, así que esta hoja también es la prueba de esa decisión. */}
      {lifeBar && (
        <>
          {behind && (
            <g opacity={0.55}>
              <PieceLifeBar piece={behind} cx={back.x} cy={back.y} geometry={g} />
            </g>
          )}
          <PieceLifeBar piece={piece} cx={front.x} cy={front.y} geometry={g} />
        </>
      )}
    </svg>
  );
}
