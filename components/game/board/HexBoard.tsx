"use client";

// =========================================================================
// Tablero hexagonal (presentacional)
//
// Recibe el tablero ya generado y lo pinta. No genera nada, no decide nada y
// no conoce las reglas: la geometría la pide a lib/rules/hex.ts y el color lo
// pone styles/components/_board.scss vía data-terrain. Las interacciones
// suben como callback (onHexClick), nunca como setter.
//
// Se pinta en capas, no hexágono a hexágono, porque el contorno de una loseta
// y el trazo de un sendero tienen que quedar POR ENCIMA del relleno de todos
// los hexágonos, no solo del suyo:
//   1. relleno de los hexágonos
//   2. senderos
//   3. contorno de cada loseta (el lado que da a otra loseta o al vacío)
//   4. fichas, localizaciones y entrada
// =========================================================================

import { useMemo } from "react";
import * as Hex from "@/lib/rules/hex";
import type { HexCoord } from "@/lib/rules/hex";
import type { Board, Hex as HexCell } from "@/lib/rules/state";
import { TERRAINS } from "@/lib/rules/terrain";
import { direction } from "@/lib/rules/tiles";
import { LOCATION_GLYPH, TOKEN_GLYPH } from "./board-glyphs";

type Props = {
  board: Board;
  /** Radio del hexágono en píxeles del viewBox. */
  hexSize?: number;
  /** Ignora la niebla y muestra el tablero entero (vista de desarrollo). */
  revealAll?: boolean;
  /** Escribe las coordenadas axiales sobre cada hexágono. */
  showCoords?: boolean;
  /** Dibuja el contorno de cada loseta. */
  showTiles?: boolean;
  selected?: HexCoord | null;
  onHexClick?: (hex: HexCell) => void;
};

const PADDING = 8;

/** Marca pintada sobre un hexágono: la localización o su ficha. */
type Mark = { kind: "location" | "token"; glyph: string; dy: number };

export default function HexBoard({
  board,
  hexSize = 30,
  revealAll = false,
  showCoords = false,
  showTiles = true,
  selected = null,
  onHexClick,
}: Props) {
  // Orden de pintado estable entre renders: los hexágonos viven en un Map y su
  // orden de inserción depende del encaje de las losetas, que no significa nada.
  const cells = useMemo(
    () => [...board.hexes.values()].sort((a, b) => a.coord.r - b.coord.r || a.coord.q - b.coord.q),
    [board],
  );

  // Encuadre: el rectángulo que ocupan todos los centros, más medio hexágono
  // de margen. Es lo que hace que la silueta irregular quede centrada sola.
  const viewBox = useMemo(() => {
    const points = cells.map((c) => Hex.toPixel(c.coord, hexSize));
    const { width: w, height: h } = Hex.hexSize(hexSize);
    const minX = Math.min(...points.map((p) => p.x)) - w / 2 - PADDING;
    const maxX = Math.max(...points.map((p) => p.x)) + w / 2 + PADDING;
    const minY = Math.min(...points.map((p) => p.y)) - h / 2 - PADDING;
    const maxY = Math.max(...points.map((p) => p.y)) + h / 2 + PADDING;
    return { minX, minY, width: maxX - minX, height: maxY - minY };
  }, [cells, hexSize]);

  const center = (cell: HexCell) => Hex.toPixel(cell.coord, hexSize);

  return (
    <svg
      className="board__svg"
      viewBox={`${viewBox.minX} ${viewBox.minY} ${viewBox.width} ${viewBox.height}`}
      role="img"
      aria-label={`Tablero de ${cells.length} hexágonos en ${board.tiles.length} losetas`}
    >
      {/* 1. Relleno */}
      <g>
        {cells.map((cell) => {
          const { x, y } = center(cell);
          const terrainKnown = revealAll || cell.terrainRevealed;
          return (
            <polygon
              key={Hex.key(cell.coord)}
              className="board__hex"
              points={Hex.polygonPoints(x, y, hexSize)}
              data-terrain={terrainKnown ? cell.terrain : undefined}
              data-hidden={terrainKnown ? undefined : "true"}
              data-selected={selected && Hex.equals(selected, cell.coord) ? "true" : undefined}
              data-interactive={onHexClick ? "true" : undefined}
              onClick={onHexClick ? () => onHexClick(cell) : undefined}
            >
              <title>{describe(cell, terrainKnown, revealAll || cell.contentRevealed)}</title>
            </polygon>
          );
        })}
      </g>

      {/* 2. Senderos: del centro del hexágono al punto medio de cada lado por
          el que sigue el camino. Los de dos hexágonos contiguos se encuentran
          en la junta, así que el trazo sale continuo entre losetas. */}
      <g className="board__roads">
        {cells.map((cell) => {
          if (!(revealAll || cell.terrainRevealed) || cell.roadLinks.length === 0) return null;
          const { x, y } = center(cell);
          return cell.roadLinks.map((dir) => {
            const end = Hex.edgeMidpoint(x, y, hexSize, dir);
            return (
              <line
                key={`${Hex.key(cell.coord)}-${dir}`}
                className="board__road"
                x1={x}
                y1={y}
                x2={end.x}
                y2={end.y}
              />
            );
          });
        })}
      </g>

      {/* 3. Contorno de cada loseta */}
      {showTiles && (
        <g className="board__tiles">
          {cells.flatMap((cell) => {
            const { x, y } = center(cell);
            const sides: React.ReactElement[] = [];
            for (let dir = 0; dir < 6; dir++) {
              const neighbor = board.hexes.get(Hex.key(Hex.add(cell.coord, direction(dir))));
              // Lado exterior de la loseta: da al vacío o a otra loseta.
              if (neighbor && neighbor.tileId === cell.tileId) continue;
              const [a, b] = Hex.edgeEndpoints(x, y, hexSize, dir);
              sides.push(
                <line
                  key={`${Hex.key(cell.coord)}-${dir}`}
                  className="board__tile-edge"
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                />,
              );
            }
            return sides;
          })}
        </g>
      )}

      {/* 4. Marcas */}
      <g>
        {cells.map((cell) => {
          const { x, y } = center(cell);
          const contentKnown = revealAll || cell.contentRevealed;

          const marks: Mark[] = [];
          if (contentKnown && cell.location) {
            marks.push({ kind: "location", glyph: LOCATION_GLYPH[cell.location].glyph, dy: 0 });
          }
          if (contentKnown && cell.token) {
            marks.push({
              kind: "token",
              glyph: TOKEN_GLYPH[cell.token].glyph,
              dy: marks.length > 0 ? hexSize * 0.5 : 0,
            });
          }

          return (
            <g key={Hex.key(cell.coord)}>
              {cell.isEntrance && contentKnown && (
                <polygon
                  className="board__entrance"
                  points={Hex.polygonPoints(x, y, hexSize * 0.72)}
                />
              )}

              {marks.map((mark) => (
                <g key={mark.kind}>
                  <circle
                    className="board__glyph-halo"
                    cx={x}
                    cy={y + mark.dy}
                    r={hexSize * (mark.kind === "location" ? 0.3 : 0.24)}
                  />
                  <text className={`board__glyph board__glyph--${mark.kind}`} x={x} y={y + mark.dy}>
                    {mark.glyph}
                  </text>
                </g>
              ))}

              {showCoords && (
                <text className="board__coord" x={x} y={y - hexSize * 0.62}>
                  {cell.coord.q},{cell.coord.r}
                </text>
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
}

/** Texto del tooltip nativo: lo que el jugador sabe de ese hexágono. */
function describe(cell: HexCell, terrainKnown: boolean, contentKnown: boolean): string {
  if (!terrainKnown) return "Sin explorar";

  const def = TERRAINS[cell.terrain];
  const parts = [`${def.label} · coste ${def.moveCost}`];

  if (def.blocksLineOfSight) parts.push("bloquea la visión");
  if (def.allowsAmbush) parts.push("emboscada y cobertura");
  if (def.hazard) parts.push(`peligro: salvación ${def.hazard.save} CD ${def.hazard.cd}`);
  if (def.safeToCamp) parts.push("seguro para acampar");

  if (contentKnown) {
    if (cell.isEntrance) parts.push("Entrada");
    if (cell.location) parts.push(LOCATION_GLYPH[cell.location].label);
    if (cell.token) parts.push(TOKEN_GLYPH[cell.token].label);
  }

  return parts.join(" · ");
}
