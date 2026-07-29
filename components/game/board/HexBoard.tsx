"use client";

// =========================================================================
// Tablero hexagonal (presentacional)
//
// Recibe el tablero ya generado y lo pinta. No genera nada, no decide nada y
// no conoce las reglas: la geometría la pide a lib/rules/hex.ts y el color lo
// pone styles/components/_board.scss vía data-terrain. Las interacciones
// suben como callback (onHexClick), nunca como setter.
//
// El tablero se ve INCLINADO, no a plomo desde arriba: el eje vertical va
// comprimido (`tilt`) y cada loseta enseña su CANTO por los lados que dan al
// vacío, con una sombra debajo. Es la referencia de la app de Viajes por la
// Tierra Media, y el punto importante es de dónde sale ese volumen: de la
// GEOMETRÍA, recalculada en pantalla, nunca pintado en el terreno. Por eso
// aguanta los 6 giros de una loseta —el canto y la sombra siempre caen hacia
// el mismo lado, aunque la pieza gire— y por eso el día que el terreno sea una
// ilustración, la lámina podrá seguir siendo cenital sin delatarse.
//
// Se pinta en capas, no hexágono a hexágono. El orden NO es arbitrario:
//   1. huecos cerrados (el negativo del mapa: simas y lagunas)
//   2. base: la silueta y los cantos, en oscuro y con la sombra proyectada.
//      Va junto en un grupo porque la sombra se calcula sobre la silueta de
//      todo lo que contiene; los hexágonos de esta capa los tapa la 3, así que
//      lo único que queda a la vista es el canto.
//   3. relleno de los hexágonos (y el clic, la niebla y la selección)
//   4. contorno de cada loseta, que tiene que quedar POR ENCIMA del relleno de
//      todos los hexágonos, no solo del suyo
//   5. marcas pintadas en el suelo: la entrada y las coordenadas
//   6. las fichas, que son piezas encima de la loseta y llevan su sombra
//
// Había una capa más, la de localizaciones —impresa en la loseta y por eso sin
// sombra—, y ya no hace falta: el Pueblo y la Mazmorra son TERRENO, así que los
// pinta la capa 3 con el resto del mapa, y la Guarida no se ve.
//
// Los cantos se pintan ANTES de los rellenos a propósito: así un canto que
// caiga sobre la propia loseta —pasa en las piezas con entrantes— queda tapado
// sin tener que averiguar cuál se ve y cuál no. Y como el canto solo existe en
// los lados que dan al vacío, nunca puede tapar la cara de OTRA loseta: donde
// dos piezas se tocan no hay grosor a la vista, igual que en la mesa. Eso es lo
// que hace que aquí no haga falta ordenar por profundidad.
//
// El sendero no tiene capa: el Camino es un terreno como los demás y se ve por
// su color, igual que en el catálogo de /dev/losetas. Antes se le dibujaba
// encima un trazo de centro a centro, de cuando el terreno se sorteaba hexágono
// a hexágono y el camino había que "seguirlo"; hoy la loseta lo trae pintado y
// el trazo solo tapaba el terreno de debajo, se cruzaba consigo mismo en las
// encrucijadas y salía al vacío por las anclas sin pareja.
// =========================================================================

import { useMemo } from "react";
import * as Hex from "@/lib/rules/hex";
import type { HexCoord } from "@/lib/rules/hex";
import type { Board, Hex as HexCell } from "@/lib/rules/state";
import { TERRAINS } from "@/lib/rules/terrain";
import { direction } from "@/lib/rules/tiles";
import BoardPiece from "./BoardPiece";
import { TOKEN_ART } from "./piece-art";

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

/** Sitio que se le deja a la sombra proyectada, en píxeles del viewBox. */
const SHADOW_MARGIN = 12;

/**
 * La inclinación de la casa: cuánto se comprime el eje vertical. 1 sería el
 * tablero plano visto a plomo desde arriba.
 *
 * Constante y no parámetro, por el mismo motivo que SKIRT_DEPTH: la inclinación
 * es la CÁMARA del juego, igual en todas las partidas, así que no hay nada que
 * decidir en cada tablero. Se probó ajustable (Ligera 0,85 / Media 0,72 /
 * Marcada 0,6) y este es el valor elegido a ojo contra la referencia. Por debajo
 * de ~0,55 el hexágono deja de leerse como hexágono.
 *
 * Lo que decide es el encargo artístico: la compresión se come esa resolución,
 * así que la lámina de cada loseta habrá que entregarla 1/0,85 ≈ 1,18 veces más
 * alta de lo que mide en pantalla.
 */
export const BOARD_TILT = 0.85;

/**
 * Grosor de la loseta, en fracción del radio del hexágono.
 *
 * Constante y no parámetro: el grosor del cartón es una propiedad de la pieza,
 * igual en todas y en todas las partidas, así que no hay nada que decidir en
 * cada tablero. Se probó ajustable (Fino 0,14 / Cartón 0,26) y este valor es el
 * término medio elegido a ojo contra la referencia.
 */
const SKIRT_DEPTH = 0.2;

export default function HexBoard({
  board,
  hexSize = 30,
  revealAll = false,
  showCoords = false,
  showTiles = true,
  selected = null,
  onHexClick,
}: Props) {
  // Alias local: la inclinación entra en cada fórmula de geometría de abajo y no
  // es un dato de este tablero, es la cámara del juego (ver BOARD_TILT).
  const tilt = BOARD_TILT;

  // Orden de pintado estable entre renders: los hexágonos viven en un Map y su
  // orden de inserción depende del encaje de las losetas, que no significa nada.
  const cells = useMemo(
    () => [...board.hexes.values()].sort((a, b) => a.coord.r - b.coord.r || a.coord.q - b.coord.q),
    [board],
  );

  // Cuánto cuelga el canto en pantalla. Es la altura de la loseta ya proyectada,
  // así que no lleva `tilt`: la pared es vertical y la inclinación de la cámara
  // es justo lo que la hace visible.
  const skirt = hexSize * SKIRT_DEPTH;

  // Encuadre: el rectángulo que ocupan todos los centros, más medio hexágono
  // de margen. Es lo que hace que la silueta irregular quede centrada sola.
  // Por abajo se le suma el canto y por todos lados el hueco de la sombra, que
  // si no el filtro sale cortado por el borde del viewBox.
  const viewBox = useMemo(() => {
    const points = cells.map((c) => Hex.toPixel(c.coord, hexSize, tilt));
    const { width: w, height: h } = Hex.hexSize(hexSize, tilt);
    const minX = Math.min(...points.map((p) => p.x)) - w / 2 - PADDING - SHADOW_MARGIN;
    const maxX = Math.max(...points.map((p) => p.x)) + w / 2 + PADDING + SHADOW_MARGIN;
    const minY = Math.min(...points.map((p) => p.y)) - h / 2 - PADDING - SHADOW_MARGIN;
    const maxY =
      Math.max(...points.map((p) => p.y)) + h / 2 + PADDING + SHADOW_MARGIN + skirt;
    return { minX, minY, width: maxX - minX, height: maxY - minY };
  }, [cells, hexSize, tilt, skirt]);

  const center = (cell: HexCell) => Hex.toPixel(cell.coord, hexSize, tilt);

  // Los cantos: un lado por cada borde que da al VACÍO. Los que dan a otra
  // loseta no enseñan grosor, y los que miran hacia arriba en pantalla tienen
  // su pared al otro lado de la pieza (ver Hex.SKIRT_DIRECTIONS).
  const skirts = useMemo(() => {
    const out: Array<{ key: string; points: string }> = [];
    for (const cell of cells) {
      const { x, y } = Hex.toPixel(cell.coord, hexSize, tilt);
      for (const dir of Hex.SKIRT_DIRECTIONS) {
        if (board.hexes.has(Hex.key(Hex.add(cell.coord, direction(dir))))) continue;
        const [a, b] = Hex.edgeEndpoints(x, y, hexSize, dir, tilt);
        out.push({
          key: `${Hex.key(cell.coord)}-${dir}`,
          points: `${a.x.toFixed(2)},${a.y.toFixed(2)} ${b.x.toFixed(2)},${b.y.toFixed(2)} ${b.x.toFixed(2)},${(b.y + skirt).toFixed(2)} ${a.x.toFixed(2)},${(a.y + skirt).toFixed(2)}`,
        });
      }
    }
    return out;
  }, [board, cells, hexSize, tilt, skirt]);

  return (
    <svg
      className="board__svg"
      viewBox={`${viewBox.minX} ${viewBox.minY} ${viewBox.width} ${viewBox.height}`}
      role="img"
      aria-label={`Tablero de ${cells.length} hexágonos en ${board.tiles.length} losetas`}
    >
      {/* 1. Huecos cerrados. No son hexágonos del tablero —no llevan terreno, ni
          ficha, ni niebla— así que se pintan aparte y no reciben el clic: son el
          agujero que dejó el encaje, y se ven siempre porque no hay nada que
          descubrir en ellos. Van debajo de los cantos para que el hueco se lea
          como una sima: se le ven las paredes de las losetas que lo rodean. */}
      <g className="board__voids">
        {board.voids.map((coord) => {
          const { x, y } = Hex.toPixel(coord, hexSize, tilt);
          return (
            <polygon
              key={Hex.key(coord)}
              className="board__void"
              points={Hex.polygonPoints(x, y, hexSize, tilt)}
            >
              <title>Intransitable</title>
            </polygon>
          );
        })}
      </g>

      {/* 2. Base: la silueta del tablero y los cantos de las losetas. La sombra
          proyectada la pone el filtro de _board.scss sobre este grupo entero, así
          que se calcula de una vez sobre la silueta de todo el tablero y no
          loseta a loseta (que sombrearía a las vecinas, y están a la misma
          altura). Queda fuera de la capa interactiva a propósito: si el hover
          entrara en el grupo filtrado, el navegador tendría que rasterizar la
          sombra otra vez en cada pasada del ratón. */}
      <g className="board__base">
        {cells.map((cell) => {
          const { x, y } = center(cell);
          return (
            <polygon
              key={Hex.key(cell.coord)}
              className="board__base-hex"
              points={Hex.polygonPoints(x, y, hexSize, tilt)}
            />
          );
        })}
        {skirts.map((side) => (
          <polygon key={side.key} className="board__skirt" points={side.points} />
        ))}
      </g>

      {/* 3. Relleno */}
      <g>
        {cells.map((cell) => {
          const { x, y } = center(cell);
          const terrainKnown = revealAll || cell.terrainRevealed;
          return (
            <polygon
              key={Hex.key(cell.coord)}
              className="board__hex"
              points={Hex.polygonPoints(x, y, hexSize, tilt)}
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

      {/* 4. Contorno de cada loseta */}
      {showTiles && (
        <g className="board__tiles">
          {cells.flatMap((cell) => {
            const { x, y } = center(cell);
            const sides: React.ReactElement[] = [];
            for (let dir = 0; dir < 6; dir++) {
              const neighbor = board.hexes.get(Hex.key(Hex.add(cell.coord, direction(dir))));
              // Lado exterior de la loseta: da al vacío o a otra loseta.
              if (neighbor && neighbor.tileId === cell.tileId) continue;
              const [a, b] = Hex.edgeEndpoints(x, y, hexSize, dir, tilt);
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

      {/* 5. Marcas del suelo: el anillo de la entrada y las coordenadas. Van
          antes de las fichas y fuera de su grupo, porque están PINTADAS en la
          loseta —no son piezas— y no les toca sombra. */}
      <g>
        {cells.map((cell) => {
          const { x, y } = center(cell);
          const contentKnown = revealAll || cell.contentRevealed;

          return (
            <g key={Hex.key(cell.coord)}>
              {cell.isEntrance && contentKnown && (
                <polygon
                  className="board__entrance"
                  points={Hex.polygonPoints(x, y, hexSize * 0.72, tilt)}
                />
              )}

              {showCoords && (
                <text className="board__coord" x={x} y={y - hexSize * 0.62 * tilt}>
                  {cell.coord.q},{cell.coord.r}
                </text>
              )}
            </g>
          );
        })}
      </g>

      {/* 6. Fichas: las piezas sobre la loseta. La sombra la pone esta CAPA
          entera y no cada ficha: todas están a la misma altura sobre el tablero,
          así que la luz les cae igual, y así el navegador rasteriza un filtro y
          no veintitrés.

          El orden de `cells` (por fila y luego por columna) deja de importar
          ahora que ninguna ficha sobresale de su hexágono, y se conserva porque
          es lo que hace el pintado estable entre renders. */}
      <g className="board__pieces">
        {cells.map((cell) => {
          if (!cell.token || !(revealAll || cell.contentRevealed)) return null;
          const { x, y } = center(cell);
          return (
            <BoardPiece
              key={Hex.key(cell.coord)}
              piece={{ family: "token", id: cell.token }}
              x={x}
              y={y}
              hexSize={hexSize}
              tilt={tilt}
              label={TOKEN_ART[cell.token].label}
            />
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
    if (cell.token) parts.push(TOKEN_ART[cell.token].label);
  }

  return parts.join(" · ");
}
