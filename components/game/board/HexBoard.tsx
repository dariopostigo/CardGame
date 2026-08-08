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
//   3. relleno de los hexágonos (y el clic y la niebla). El
//      hexágono no lleva borde propio: el terreno de una misma loseta fluye
//      sin cortes, como en la foto de referencia (map1.webp) — el único trazo
//      del mapa es el de la capa 4.
//   4. contorno de cada loseta, que tiene que quedar POR ENCIMA del relleno de
//      todos los hexágonos, no solo del suyo
//   4b. resalte de hover/selección, por ENCIMA del contorno de loseta (ver
//      más abajo por qué necesita su propia capa). También el alcance de
//      movimiento (`reachable`, lib/rules/movement.ts), como un relleno
//      translúcido en la misma capa: no es un estado nuevo, es la misma idea
//      de "trazo que decide si se pinta" pero con fill en vez de stroke.
//   5. marcas pintadas en el suelo: la entrada y las coordenadas
//   6. las fichas, que son piezas encima de la loseta y llevan su sombra
//   7. el pulso de selección (`selected`): dos aros que crecen y se
//      desvanecen, por ENCIMA de la ficha para que se note sobre cualquier
//      terreno o disco que tenga debajo
//
// Había una capa más, la de localizaciones —impresa en la loseta y por eso sin
// sombra—, y ya no hace falta: el Pueblo y la Mazmorra son TERRENO, así que los
// pinta la capa 3 con el resto del mapa, y la Guarida no se ve.
//
// Al pasar el ratón por un hexágono interactivo, no se mueve: se resalta con
// un contorno más grueso y una sombra suave (`.board__hex-highlight` en
// _board.scss). Se probó de verdad LEVANTAR el hexágono (relleno arriba con
// `transform`, dejando ver el canto oscuro de la capa 2 debajo) y se descartó:
// cada vértice de un hexágono lo comparten TRES losetas, así que al subir uno
// solo, ese vértice se separa del de las otras dos —que no se han movido— y el
// borde de la tercera se queda apuntando al sitio donde estaba el vértice
// antes, como una púa suelta. Pasa incluso entre losetas del mismo terreno, así
// que no hay forma de disimularlo con el color. La única forma de que no se
// note es que nada se mueva.
//
// El resalte vive en su PROPIA capa (4b) y no en el propio hexágono (capa 3)
// por el mismo motivo que el contorno de loseta vive en la 4 y no en la 3:
// tiene que quedar por ENCIMA de todo lo que se le pueda montar por delante.
// Con el contorno de loseta ya claro y grueso (map1.webp), si el resalte
// pintara su trazo en el propio hexágono, la loseta vecina lo taparía justo en
// los lados que dan a otra pieza —el aro de hover saldría "mordido" ahí—.
// Como capa aparte, encima de la 4, siempre se ve entero. No reabre el
// problema del párrafo anterior: es el mismo polígono, sin transformar, así
// que no hay vértice que desalinear; lo único que cambia es si su trazo
// (siempre existe, a 0 de grosor) se pinta visible o no, vía `data-hover`/
// `data-selected` y el estado `hoveredHex` de abajo.
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
//
// El tablero se mira por una VENTANA de alto fijo y se puede recorrer: rueda
// para acercar, arrastre para moverse, flechas si no hay ratón. Todas las capas
// van dentro de un grupo con la `transform` de la cámara, que calcula
// use-board-view.ts; el `viewBox` sigue siendo la vista encajada —el estado
// neutro— y el zoom un desvío medido contra ella. Sigue sin decidir nada de la
// partida: mover la cámara no es jugar.
//
// Dentro del marco hay una capa que no es del mapa: la NIEBLA de atmósfera
// (BoardFog), un lienzo DEBAJO del SVG y fuera de la cámara. Es la mesa la que
// tiene niebla, no el tablero, así que el mapa la tapa y ni se acerca ni se
// arrastra con él. Ojo con el nombre: no tiene nada que ver con la niebla de
// exploración —lo que el jugador no ha descubierto—, que es un dato del hexágono
// y la pinta la capa 3 con data-hidden.
// =========================================================================

import { useMemo, useState } from "react";
import * as Hex from "@/lib/rules/hex";
import type { HexCoord, HexKey } from "@/lib/rules/hex";
import type { Board, Hex as HexCell } from "@/lib/rules/state";
import { TERRAINS } from "@/lib/rules/terrain";
import { direction } from "@/lib/rules/tiles";
import Button from "@/components/ui/Button";
import BoardFog from "./BoardFog";
import BoardPiece from "./BoardPiece";
import { TOKEN_ART, type PawnId } from "./piece-art";
import { useBoardView } from "./use-board-view";

/**
 * Una ficha de héroe a pintar (co-op, characters/heroes.md §4): quién es,
 * dónde está y con qué cara. `pieceId` es "heroe-1".."heroe-4" — el color por
 * puesto en la mesa, no por clase (piece-art.tsx) —, así que dos héroes de la
 * misma clase (repetir está permitido) siguen distinguiéndose.
 */
export type HeroMarker = {
  readonly id: string;
  readonly position: HexCoord;
  readonly pieceId: PawnId;
  readonly label: string;
};

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
  /** Hexágonos dentro del alcance de movimiento actual (capa 4b, resalte de relleno). */
  reachable?: ReadonlySet<HexKey>;
  /**
   * Los héroes en el tablero. Se pintan siempre, no dependen de
   * `contentRevealed` (se ven a sí mismos). Si varios comparten hexágono —los
   * 1-4 pueden arrancar juntos en la entrada— se reparten en abanico para no
   * dibujarse exactamente superpuestos.
   */
  heroes?: readonly HeroMarker[];
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
  reachable,
  heroes = [],
  onHexClick,
}: Props) {
  // Alias local: la inclinación entra en cada fórmula de geometría de abajo y no
  // es un dato de este tablero, es la cámara del juego (ver BOARD_TILT).
  const tilt = BOARD_TILT;

  // Qué hexágono tiene el ratón encima ahora mismo. Solo alimenta la capa 4b
  // (el trazo de resalte): no mueve nada, así que no reabre el problema del
  // vértice compartido de la nota de arriba.
  const [hoveredHex, setHoveredHex] = useState<HexCoord | null>(null);

  // Orden de pintado estable entre renders: los hexágonos viven en un Map y su
  // orden de inserción depende del encaje de las losetas, que no significa nada.
  const cells = useMemo(
    () => [...board.hexes.values()].sort((a, b) => a.coord.r - b.coord.r || a.coord.q - b.coord.q),
    [board],
  );

  // Centro en píxeles de cada héroe, repartiendo en abanico a los que
  // comparten hexágono (co-op: los 1-4 pueden arrancar juntos en la entrada,
  // characters/heroes.md §4). Con uno solo en la casilla no hay desplazamiento
  // — se pinta en el centro, como el héroe único de siempre.
  const heroPixels = useMemo(() => {
    const byHex = new Map<HexKey, HeroMarker[]>();
    for (const hero of heroes) {
      const k = Hex.key(hero.position);
      const group = byHex.get(k);
      if (group) group.push(hero);
      else byHex.set(k, [hero]);
    }
    const fanRadius = hexSize * 0.32;
    const out: { hero: HeroMarker; x: number; y: number }[] = [];
    for (const group of byHex.values()) {
      const { x: cx, y: cy } = Hex.toPixel(group[0].position, hexSize, tilt);
      group.forEach((hero, i) => {
        if (group.length === 1) {
          out.push({ hero, x: cx, y: cy });
          return;
        }
        const angle = (i / group.length) * 2 * Math.PI - Math.PI / 2;
        out.push({
          hero,
          x: cx + fanRadius * Math.cos(angle),
          y: cy + fanRadius * Math.sin(angle) * tilt,
        });
      });
    }
    return out;
  }, [heroes, hexSize, tilt]);

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

  // La cámara. Se le pasa el encuadre encajado porque es su origen: el zoom y el
  // arrastre se miden contra él, y es lo que le permite frenar el arrastre antes
  // de que el tablero se salga del marco.
  const view = useBoardView(viewBox);

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
    <div
      className="board__viewport"
      role="group"
      aria-label="Tablero: arrastra para moverte, rueda o botones para acercar"
      title="Arrastra el tablero para moverte · rueda para acercar y alejar · flechas y +/− con el foco puesto"
      {...view.frameProps}
    >
      {/* La niebla va DEBAJO del tablero: es atmósfera de la mesa, no un velo
          sobre el mapa (ver BoardFog). Las losetas son opacas, así que la tapan;
          se ve por todo alrededor, a través de la sombra proyectada y por los
          huecos cerrados, que son agujeros de verdad. */}
      <BoardFog />

      <svg
        className="board__svg"
        viewBox={`${viewBox.minX} ${viewBox.minY} ${viewBox.width} ${viewBox.height}`}
        role="img"
        aria-label={`Tablero de ${cells.length} hexágonos en ${board.tiles.length} losetas`}
      >
        {/* La cámara envuelve las seis capas: se mueve el tablero entero, no una
            capa suya, porque el volumen sale de la geometría y los cantos y las
            sombras tienen que viajar con el terreno al que pertenecen. */}
        <g transform={view.transform}>
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
                  data-interactive={onHexClick ? "true" : undefined}
                  onClick={
                    onHexClick
                      ? () => {
                          // Todo arrastre termina en un clic sobre el hexágono donde
                          // se suelta el ratón, y mover el mapa no es seleccionar.
                          if (view.wasDrag()) return;
                          onHexClick(cell);
                        }
                      : undefined
                  }
                  onPointerEnter={onHexClick ? () => setHoveredHex(cell.coord) : undefined}
                  onPointerLeave={
                    onHexClick
                      ? () =>
                          setHoveredHex((h) => (h && Hex.equals(h, cell.coord) ? null : h))
                      : undefined
                  }
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
                const cellKey = Hex.key(cell.coord);
                const sides: React.ReactElement[] = [];
                for (let dir = 0; dir < 6; dir++) {
                  const neighborCoord = Hex.add(cell.coord, direction(dir));
                  const neighbor = board.hexes.get(Hex.key(neighborCoord));
                  // Lado exterior de la loseta: da al vacío o a otra loseta.
                  if (neighbor && neighbor.tileId === cell.tileId) continue;
                  // Un borde contra OTRA loseta lo ven las dos casillas que lo
                  // comparten —cada una lo dibujaría desde su lado— y en reposo
                  // coinciden pixel a pixel, así que se pinta una sola vez,
                  // desde la casilla de clave menor.
                  if (neighbor && Hex.key(neighborCoord) < cellKey) continue;
                  const [a, b] = Hex.edgeEndpoints(x, y, hexSize, dir, tilt);
                  sides.push(
                    <line
                      key={`${cellKey}-${dir}`}
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

          {/* 4b. Resalte interactivo (hover / selección), por ENCIMA del contorno
              de loseta. Si viviera en el propio hexágono (capa 3, como antes), el
              contorno claro de la loseta se pintaría encima en los lados que dan a
              otra pieza y el resalte se vería cortado justo ahí. Es el mismo
              polígono del hexágono, solo el trazo: no se mueve, así que la nota de
              arriba sobre el vértice compartido no aplica —esto no levanta nada,
              solo decide si un trazo ya quieto se pinta o no. */}
          <g className="board__highlights">
            {cells.map((cell) => {
              const { x, y } = center(cell);
              return (
                <polygon
                  key={Hex.key(cell.coord)}
                  className="board__hex-highlight"
                  points={Hex.polygonPoints(x, y, hexSize, tilt)}
                  data-hover={
                    onHexClick && hoveredHex && Hex.equals(hoveredHex, cell.coord)
                      ? "true"
                      : undefined
                  }
                  data-selected={selected && Hex.equals(selected, cell.coord) ? "true" : undefined}
                  data-reachable={reachable?.has(Hex.key(cell.coord)) ? "true" : undefined}
                />
              );
            })}
          </g>

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
                  state={cell.resolved ? "spent" : "placed"}
                  label={TOKEN_ART[cell.token].label}
                />
              );
            })}
            {/* Los héroes, aparte de las fichas de contenido: no dependen de
                `contentRevealed` (se ven a sí mismos siempre) ni de
                `cell.token` (no son contenido del hexágono, son quienes andan
                por él). `heroPixels` ya resolvió el abanico de los que
                comparten casilla. */}
            {heroPixels.map(({ hero, x, y }) => (
              <BoardPiece
                key={hero.id}
                piece={{ family: "pawn", id: hero.pieceId }}
                x={x}
                y={y}
                hexSize={hexSize}
                tilt={tilt}
                label={hero.label}
              />
            ))}
          </g>

          {/* 7. Pulso de selección: cualquier casilla seleccionada (héroe o
              cualquier otra ficha) lo lleva, por igual — es "esto es lo que
              estás mirando", no un estado del héroe. Va DESPUÉS de las fichas
              a propósito, para que el aro se vea completo por encima del disco
              y no a medias por debajo de su sombra. Dos aros con retraso
              (`board__pulse--b`) en vez de uno: un solo aro se ve "parpadear"
              al reiniciar el bucle; con dos desfasados siempre hay uno a medio
              crecer y la animación se lee continua. */}
          {selected &&
            board.hexes.has(Hex.key(selected)) &&
            (() => {
              const { x, y } = Hex.toPixel(selected, hexSize, tilt);
              const points = Hex.polygonPoints(x, y, hexSize, tilt);
              return (
                <g className="board__pulse-group" style={{ pointerEvents: "none" }}>
                  <polygon className="board__pulse" points={points} />
                  <polygon className="board__pulse board__pulse--b" points={points} />
                </g>
              );
            })()}
        </g>
      </svg>

      {/* Mando de la cámara. Va dentro del marco y encima del recorte —es la
          única cosa de esta pantalla que no es tablero— y no propaga el
          pointerdown: si lo hiciera, pulsar «+» empezaría también un arrastre.
          Los botones existen aparte de la rueda porque la rueda no se ve: un
          mando visible es lo que dice que el mapa se puede recorrer. */}
      <div className="board__nav" onPointerDown={(e) => e.stopPropagation()}>
        <Button
          size="sm"
          iconOnly
          aria-label="Alejar"
          title="Alejar"
          disabled={view.atMin}
          onClick={view.zoomOut}
        >
          <i className="pi pi-minus" />
        </Button>
        <span className="board__zoom" title="Escala: 100 % es el tablero encajado en el marco">
          {Math.round(view.zoom * 100)} %
        </span>
        <Button
          size="sm"
          iconOnly
          aria-label="Acercar"
          title="Acercar"
          disabled={view.atMax}
          onClick={view.zoomIn}
        >
          <i className="pi pi-plus" />
        </Button>
        <Button
          size="sm"
          title="Volver a encajar el tablero entero en el marco"
          disabled={view.isFit}
          onClick={view.fit}
        >
          Encajar
        </Button>
      </div>
    </div>
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
