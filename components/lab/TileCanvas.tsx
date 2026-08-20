"use client";

// =========================================================================
// Lienzo de una LOSETA suelta (presentacional)
//
// Dibuja una loseta —no un tablero—: sus hexágonos con su terreno, su contorno
// y sus anclas. Es lo que hace visible lo único que define una loseta: forma,
// terreno y por dónde se une.
//
// Vive en components/lab/ porque el jugador no ve losetas sueltas: solo ve el
// tablero ya montado. Es instrumental, y por eso puede permitirse cosas que un
// componente de juego no haría, como pintar huecos "candidatos" y hacer
// clicables los lados.
//
// Aquí no se decide nada: la geometría la pide a lib/v2/rules/hex.ts, lo que
// dibuja se lo dan por props y el color lo pone styles/components/_tile.scss.
// =========================================================================

import * as Hex from "@/lib/v2/rules/hex";
import type { HexCoord } from "@/lib/v2/rules/hex";
import type { TerrainId } from "@/lib/v2/rules/terrain";
import type { PlacedEdge } from "@/lib/v2/rules/tiles";

/**
 * Qué es cada hexágono del lienzo:
 *   · hex       — hexágono de la loseta. Su `terrain` pinta el relleno, y
 *                 `null` quiere decir "lo sortea el tablero al colocarme".
 *   · candidate — hueco vecino: no es de la loseta, pero se puede añadir.
 */
export type CanvasCellKind = "hex" | "candidate";

export type CanvasCell = {
  coord: HexCoord;
  kind: CanvasCellKind;
  /** Solo las de tipo "hex" lo llevan; un hueco de la rejilla no tiene terreno. */
  terrain?: TerrainId;
};

type Props = {
  cells: readonly CanvasCell[];
  /** Contorno de la loseta: cada borde exterior, con su ancla o su pared. */
  edges?: readonly PlacedEdge[];
  /** Radio del hexágono en píxeles del viewBox. */
  hexSize?: number;
  showCoords?: boolean;
  /**
   * Hexágonos que fijan el encuadre. Por defecto los de `cells`, pero el editor
   * pasa la rejilla completa para que el lienzo no baile al añadir o quitar.
   */
  frame?: readonly HexCoord[];
  /**
   * Encuadre de lado fijo, en radios de hexágono, centrado en la loseta. Es lo
   * que hace que en el catálogo todas salgan A LA MISMA ESCALA: sin esto, el
   * SVG se estira al ancho disponible y una loseta de 3 hexágonos se ve más
   * grande que una de 5, que es justo lo contrario de lo que hace falta para
   * compararlas. Tiene prioridad sobre `frame`.
   */
  frameSpan?: number;
  selected?: HexCoord | null;
  onCellClick?: (coord: HexCoord) => void;
  /** Si se pasa, cada lado del contorno se vuelve clicable (poner anclas). */
  onEdgeClick?: (hex: HexCoord, dir: number) => void;
  ariaLabel?: string;
};

const PADDING = 4;

/** Alto del triángulo del ancla, en fracción del radio del hexágono. */
const ANCHOR_HEIGHT = 0.3;
/** Ancho de su base, en fracción del lado del hexágono. */
const ANCHOR_WIDTH = 0.44;
/** Hueco entre la punta y el borde, para que no se pise con el contorno. */
const ANCHOR_INSET = 0.07;

/**
 * Cuadro de lado fijo centrado en el conjunto de hexágonos. El centro es el
 * punto medio del rectángulo que los contiene, no la media de los centros: con
 * la media, una loseta con tres hexágonos a un lado y uno al otro se dibujaría
 * descentrada.
 */
function squareBox(coords: readonly HexCoord[], hexSize: number, span: number) {
  const points = coords.map((coord) => Hex.toPixel(coord, hexSize));
  const cx = (Math.min(...points.map((p) => p.x)) + Math.max(...points.map((p) => p.x))) / 2;
  const cy = (Math.min(...points.map((p) => p.y)) + Math.max(...points.map((p) => p.y))) / 2;
  const side = span * hexSize;
  return { minX: cx - side / 2, minY: cy - side / 2, width: side, height: side };
}

/** El rectángulo del viewBox: los centros de `coords` más medio hexágono. */
function framingBox(coords: readonly HexCoord[], hexSize: number) {
  const points = coords.map((coord) => Hex.toPixel(coord, hexSize));
  const { width: w, height: h } = Hex.hexSize(hexSize);
  const minX = Math.min(...points.map((p) => p.x)) - w / 2 - PADDING;
  const maxX = Math.max(...points.map((p) => p.x)) + w / 2 + PADDING;
  const minY = Math.min(...points.map((p) => p.y)) - h / 2 - PADDING;
  const maxY = Math.max(...points.map((p) => p.y)) + h / 2 + PADDING;
  return { minX, minY, width: maxX - minX, height: maxY - minY };
}

/**
 * El triángulo de un ancla: punta contra el lado, apuntando hacia FUERA de la
 * loseta, y el cuerpo DENTRO del hexágono. Apunta afuera porque eso es lo que
 * significa —el sitio por el que esta loseta se ofrece a la de al lado—, y se
 * queda dentro para que la silueta de la pieza siga siendo la de sus hexágonos:
 * asomando por el contorno, dos losetas encajadas parecían solaparse.
 *
 * @returns {string} Los tres vértices, listos para <polygon points>.
 */
function anchorTriangle(center: { x: number; y: number }, hexSize: number, dir: number): string {
  const [a, b] = Hex.edgeEndpoints(center.x, center.y, hexSize, dir);
  const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };

  // Normal del lado, hacia fuera: del centro del hexágono al centro del lado.
  const nx = (mid.x - center.x) / (Math.hypot(mid.x - center.x, mid.y - center.y) || 1);
  const ny = (mid.y - center.y) / (Math.hypot(mid.x - center.x, mid.y - center.y) || 1);

  const apex = { x: mid.x - nx * hexSize * ANCHOR_INSET, y: mid.y - ny * hexSize * ANCHOR_INSET };
  const back = {
    x: apex.x - nx * hexSize * ANCHOR_HEIGHT,
    y: apex.y - ny * hexSize * ANCHOR_HEIGHT,
  };

  // La base, paralela al lado y centrada en el eje del triángulo.
  const half = (hexSize * ANCHOR_WIDTH) / 2;
  const tx = ((b.x - a.x) / (Math.hypot(b.x - a.x, b.y - a.y) || 1)) * half;
  const ty = ((b.y - a.y) / (Math.hypot(b.x - a.x, b.y - a.y) || 1)) * half;

  const p1 = { x: back.x - tx, y: back.y - ty };
  const p2 = { x: back.x + tx, y: back.y + ty };

  return `${p1.x.toFixed(2)},${p1.y.toFixed(2)} ${apex.x.toFixed(2)},${apex.y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`;
}

export default function TileCanvas({
  cells,
  edges = [],
  hexSize = 26,
  showCoords = false,
  frame,
  frameSpan,
  selected = null,
  onCellClick,
  onEdgeClick,
  ariaLabel = "Loseta",
}: Props) {
  // Sin memo a propósito: son 127 hexágonos como mucho, y memoizar obligaría a
  // meter un array nuevo en cada render en las dependencias.
  const viewBox =
    frameSpan === undefined
      ? framingBox(frame ?? cells.map((c) => c.coord), hexSize)
      : squareBox(
          cells.filter((c) => c.kind === "hex").map((c) => c.coord),
          hexSize,
          frameSpan,
        );

  return (
    <svg
      className="tile-canvas__svg"
      viewBox={`${viewBox.minX} ${viewBox.minY} ${viewBox.width} ${viewBox.height}`}
      role="img"
      aria-label={ariaLabel}
    >
      {/* 1. Hexágonos, pintados con su terreno */}
      <g>
        {cells.map((cell) => {
          const { x, y } = Hex.toPixel(cell.coord, hexSize);
          return (
            <polygon
              key={Hex.key(cell.coord)}
              className="tile-canvas__hex"
              points={Hex.polygonPoints(x, y, hexSize)}
              data-kind={cell.kind}
              data-terrain={cell.kind === "hex" ? cell.terrain : undefined}
              data-selected={selected && Hex.equals(selected, cell.coord) ? "true" : undefined}
              data-interactive={onCellClick ? "true" : undefined}
              onClick={onCellClick ? () => onCellClick(cell.coord) : undefined}
            >
              <title>{`${cell.coord.q},${cell.coord.r}`}</title>
            </polygon>
          );
        })}
      </g>

      {/* 2. Contorno: el borde de la loseta, que no es lo mismo que el de sus
          hexágonos. Va por encima del relleno para que se lea como una pieza. */}
      <g className="tile-canvas__outline">
        {edges.map((edge) => {
          const { x, y } = Hex.toPixel(edge.hex, hexSize);
          const [a, b] = Hex.edgeEndpoints(x, y, hexSize, edge.dir);
          return (
            <line
              key={`${Hex.key(edge.hex)}-${edge.dir}`}
              className="tile-canvas__border"
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
            />
          );
        })}
      </g>

      {/* 3. Anclas: el triángulo que apunta afuera desde dentro del hexágono. */}
      <g className="tile-canvas__anchors">
        {edges
          .filter((edge) => edge.isAnchor)
          .map((edge) => (
            <polygon
              key={`${Hex.key(edge.hex)}-${edge.dir}`}
              className="tile-canvas__anchor"
              points={anchorTriangle(Hex.toPixel(edge.hex, hexSize), hexSize, edge.dir)}
            />
          ))}
      </g>

      {/* 4. Zona de clic de cada lado del contorno: va encima de todo, y solo
          existe cuando se están poniendo anclas. */}
      {onEdgeClick && (
        <g>
          {edges.map((edge) => {
            const { x, y } = Hex.toPixel(edge.hex, hexSize);
            const [a, b] = Hex.edgeEndpoints(x, y, hexSize, edge.dir);
            return (
              <line
                key={`hit-${Hex.key(edge.hex)}-${edge.dir}`}
                className="tile-canvas__edge-hit"
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                onClick={() => onEdgeClick(edge.hex, edge.dir)}
              >
                <title>
                  {`${edge.isAnchor ? "Quitar el ancla" : "Poner un ancla"} ${
                    Hex.DIR_LABELS[edge.dir]
                  } de ${Hex.key(edge.hex)}`}
                </title>
              </line>
            );
          })}
        </g>
      )}

      {/* 5. Coordenadas locales */}
      {showCoords && (
        <g>
          {cells.map((cell) => {
            const { x, y } = Hex.toPixel(cell.coord, hexSize);
            return (
              <text
                key={Hex.key(cell.coord)}
                className="tile-canvas__coord"
                x={x}
                y={y}
                data-kind={cell.kind}
              >
                {cell.coord.q},{cell.coord.r}
              </text>
            );
          })}
        </g>
      )}
    </svg>
  );
}
