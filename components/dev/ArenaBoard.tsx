"use client";

// =========================================================================
// La arena de batalla de V3 (presentacional)
//
// Recibe la arena ya construida (lib/v3/arena.ts) y la pinta. No decide nada:
// ni quién despliega, ni quién alcanza a quién. Las interacciones suben como
// callback, nunca como setter (ARCHITECTURE.md §6).
//
// LA DIRECCIÓN DE ARTE MANDA, y es `public/concepts/oldenEra/3.png`. De ahí
// salen cuatro decisiones que no son de gusto, y la primera cambia la
// estructura del componente entero:
//
//  1. EL SUELO ES UNA LÁMINA CONTINUA, no un color por hexágono. En la
//     referencia el terreno está pintado de lado a lado —tierra, charcos,
//     rocas, matojos— y los hexágonos no se ven como celdas de colores: se ven
//     como una rejilla DIBUJADA ENCIMA de una ilustración. Por eso aquí los
//     polígonos comparten una sola pintura en coordenadas de usuario
//     (`gradientUnits="userSpaceOnUse"`): al no tener cada uno la suya, la
//     unión se lee como una superficie sola y no hay que recortar nada. El día
//     que exista la ilustración entra por `groundImage` y el resto no se toca.
//
//     Lo que eso se lleva por delante: el bando NO se puede pintar en el suelo.
//     Antes cada banda tenía su color de relleno, y con una lámina debajo eso
//     ya no cabe — así que el bando se dice con un CONTORNO, que es como lo
//     dice la referencia.
//
//  2. LA REJILLA ES TRAZO, y cada arista una sola vez (Hex.uniqueEdges). Con
//     polígonos con borde, el lado que dos hexágonos comparten se pintaría dos
//     veces y saldría al doble de opacidad: sobre una lámina oscura eso se ve.
//
//  3. UN ÁREA SE MARCA CON SU CONTORNO (Hex.boundaryEdges), no con un tinte de
//     relleno. Es exactamente lo que hace la referencia con el alcance de la
//     ficha activa, y es lo que deja que el suelo siga siendo arte.
//
//  4. LA CÁMARA VA MÁS TUMBADA: la compresión vertical de la referencia,
//     medida superponiendo esta misma geometría sobre la captura, es ~0,67 y no
//     el 0,85 del tablero de exploración (ver ARENA_TILT).
//
// Se pinta en capas, y el orden importa:
//   1. base: la silueta del tablero entero, en oscuro y con su sombra. Va junta
//      en un grupo porque el filtro trabaja sobre la silueta de todo lo que
//      contiene: así la sombra sale del contorno de la arena completa y no
//      hexágono a hexágono. La tapa la capa 2.
//   2. suelo: la lámina. Aquí entra la ilustración cuando exista.
//   3. rejilla: la malla, en trazo fino y sin repetir aristas.
//   4. contornos de región: banda propia, banda enemiga, alcance. Más gruesos
//      que la malla y con halo, porque son lo que hay que ver.
//   5. fichas: los discos desplegados, con la sombra corta de una pieza que se
//      levanta milímetros del suelo. Sin ratón propio: los clics los recoge la
//      capa de encima, que es la que sabe qué hexágono es cada sitio.
//   6. interacción: el hexágono bajo el ratón, el elegido y el de origen.
//   7. rótulos, pintados en el suelo. No se escriben debajo de una ficha: el
//      número taparía el glifo y no diría nada que la ficha no diga.
//
// La cámara la trae el hook de v2 (use-board-view.ts) y se IMPORTA, no se
// copia: no es motor de v2 —no tiene un solo import del proyecto— y su propia
// cabecera avisa de que existe para no acabar con "dos versiones del mismo
// arrastre". La geometría sí es copia (lib/v3/hex.ts) y ahí el motivo es el
// contrario: v2 está congelado y lo vigente no puede colgar de él.
// =========================================================================

import { useMemo, useState } from "react";
import * as Hex from "@/lib/v3/hex";
import type { HexCoord, HexEdge, HexKey } from "@/lib/v3/hex";
import type { Arena, Side } from "@/lib/v3/arena";
import { useBoardView } from "@/components/game/board/use-board-view";
import Button from "@/components/ui/Button";

/**
 * La compresión vertical de la arena: cuánto se aplasta el eje Y para que el
 * campo se vea desde delante en vez de a plomo.
 *
 * 0,67 y no el 0,85 del tablero de exploración, y el número está MEDIDO, no
 * elegido a ojo: se superpuso esta misma geometría puntiaguda-arriba sobre
 * `public/concepts/oldenEra/3.png` a varias compresiones, y a 0,67 las
 * columnas y las filas caen encima de las de la referencia. A 0,85 los
 * hexágonos salen demasiado altos y las filas se separan a la vista.
 *
 * No cuadra exacto y no puede: la referencia usa una cámara en PERSPECTIVA —los
 * hexágonos de delante son mayores que los del fondo— y esto es una compresión
 * ortográfica uniforme. A cambio, la geometría no se deforma y un hexágono
 * mide lo mismo en todo el tablero, que es lo que necesita un juego por
 * casillas.
 */
export const ARENA_TILT = 0.67;

/** Aire alrededor del tablero, en píxeles del viewBox. */
const PADDING = 10;

/** Sitio para la sombra proyectada, o el filtro sale cortado por el borde. */
const SHADOW_MARGIN = 14;

/**
 * Un área marcada con su contorno. `kind` decide el color, no el contenido:
 * dos regiones del mismo bando se ven igual.
 */
export type ArenaRegion = {
  readonly id: string;
  readonly kind: Side | "alcance";
  readonly hexes: readonly HexCoord[];
};

/**
 * Una ficha desplegada sobre la arena.
 *
 * Se dibuja TUMBADA y todas son el mismo disco, que es la regla de la casa del
 * tablero de v2 (components/game/board/BoardPiece.tsx) y aquí se mantiene por el
 * mismo motivo y con un apoyo más: en `public/concepts/oldenEra/3.png` las
 * figuras van sobre PEANAS redondas con el aro del color de su bando, así que el
 * disco es lo que pide la referencia. Lo que separa una ficha de otra es su
 * glifo y su aro, no su forma.
 */
export type ArenaPiece = {
  readonly id: string;
  readonly hex: HexCoord;
  readonly side: Side;
  readonly role: "heroe" | "unidad";
  /** El glifo de dentro: hoy el icono de su tipo de daño. */
  readonly icon: string;
  /** Para el tooltip: quién es y qué alcance tiene. */
  readonly label: string;
  readonly selected?: boolean;
};

export type ArenaBoardProps = {
  arena: Arena;
  /** Radio del hexágono en píxeles del viewBox. */
  hexSize?: number;
  /** Compresión vertical. 1 sería el tablero plano visto a plomo. */
  tilt?: number;
  /**
   * La ilustración del campo, si ya existe. Se estira sobre la caja del
   * tablero y la recortan los propios hexágonos, así que la lámina que se
   * encargue tiene que venir con la silueta del tablero entero, no por casilla.
   */
  groundImage?: string;
  /** Áreas marcadas con contorno: bandas de despliegue, alcance… */
  regions?: readonly ArenaRegion[];
  /** Las fichas ya desplegadas, de los dos bandos. */
  pieces?: readonly ArenaPiece[];
  /**
   * Dónde se dibuja la malla. En la referencia la rejilla NO está siempre:
   * aparece solo sobre el área que la ficha activa puede pisar, y el resto del
   * campo es ilustración limpia. Para trabajar el diseño hace falta verla
   * entera, así que se puede elegir.
   */
  grid?: "completa" | "regiones" | "ninguna";
  /** Desde dónde se mide: se marca aparte, no forma parte de ninguna región. */
  origin?: HexCoord | null;
  selected?: HexCoord | null;
  /** Qué se escribe encima de cada hexágono; null para no escribir nada. */
  label?: (hex: HexCoord) => string | null;
  onHexClick?: (hex: HexCoord) => void;
};

export default function ArenaBoard({
  arena,
  hexSize = 34,
  tilt = ARENA_TILT,
  groundImage,
  regions = [],
  pieces = [],
  grid = "completa",
  origin = null,
  selected = null,
  label,
  onHexClick,
}: ArenaBoardProps) {
  const [hovered, setHovered] = useState<HexCoord | null>(null);

  // Identificador único de este tablero, para que dos <ArenaBoard> en la misma
  // página no compartan los <defs> (el segundo se quedaría con la pintura del
  // primero, que es el fallo clásico de los ids de SVG).
  const uid = useMemo(
    () => `arena-${arena.spec.cols}x${arena.spec.rows}-${arena.spec.bandDepth}`,
    [arena.spec],
  );

  // Los centros y polígonos, una sola vez: los piden cuatro capas.
  const cells = useMemo(
    () =>
      arena.hexes.map((hex) => {
        const { x, y } = Hex.toPixel(hex, hexSize, tilt);
        return {
          hex,
          key: Hex.key(hex),
          x,
          y,
          points: Hex.polygonPoints(x, y, hexSize, tilt),
        };
      }),
    [arena, hexSize, tilt],
  );

  // El encuadre encajado: la arena entera con su aire y sitio para la sombra.
  const viewBox = useMemo(() => {
    const { width: w, height: h } = Hex.hexSize(hexSize, tilt);
    const margin = PADDING + SHADOW_MARGIN;
    const minX = Math.min(...cells.map((c) => c.x)) - w / 2 - margin;
    const maxX = Math.max(...cells.map((c) => c.x)) + w / 2 + margin;
    const minY = Math.min(...cells.map((c) => c.y)) - h / 2 - margin;
    const maxY = Math.max(...cells.map((c) => c.y)) + h / 2 + margin;
    return { minX, minY, width: maxX - minX, height: maxY - minY };
  }, [cells, hexSize, tilt]);

  // La cámara se mide contra el encuadre encajado, que es su origen.
  const view = useBoardView(viewBox);

  /** Una arista a segmento de línea, en píxeles del viewBox. */
  const segment = (edge: HexEdge) => {
    const { x, y } = Hex.toPixel(edge.hex, hexSize, tilt);
    const [a, b] = Hex.edgeEndpoints(x, y, hexSize, edge.dir, tilt);
    return { x1: a.x, y1: a.y, x2: b.x, y2: b.y };
  };

  // La malla. En modo "regiones" solo se dibuja dentro de lo marcado, que es
  // cómo lo hace la referencia: fuera del área no hay rejilla, hay campo.
  const meshEdges = useMemo(() => {
    if (grid === "ninguna") return [];
    if (grid === "completa") return Hex.uniqueEdges(arena.hexes);
    const inRegions = new Set<HexKey>();
    for (const r of regions) for (const h of r.hexes) inRegions.add(Hex.key(h));
    return Hex.uniqueEdges(arena.hexes.filter((h) => inRegions.has(Hex.key(h))));
  }, [grid, arena.hexes, regions]);

  // Quién está en cada hexágono. Lo piden tres sitios —el tooltip, el rótulo que
  // se calla y nada más—, así que se calcula una vez.
  const pieceByKey = useMemo(
    () => new Map(pieces.map((p) => [Hex.key(p.hex), p] as const)),
    [pieces],
  );

  const regionOutlines = useMemo(
    () => regions.map((r) => ({ ...r, edges: Hex.boundaryEdges(r.hexes) })),
    [regions],
  );

  return (
    <div className="arena__viewport" {...view.frameProps}>
      <svg
        className="arena__svg"
        viewBox={`${viewBox.minX} ${viewBox.minY} ${viewBox.width} ${viewBox.height}`}
        role="img"
        aria-label={`Arena de batalla de ${arena.spec.cols} columnas por ${arena.spec.rows} filas`}
      >
        <defs>
          {/* La pintura del suelo, COMPARTIDA por los 168 (o 300) hexágonos:
              en coordenadas de usuario, así que no se reinicia en cada
              polígono y la unión se lee como una sola superficie. Es lo que
              sustituye al recorte, que con estos hexágonos saldría carísimo. */}
          <linearGradient
            id={`${uid}-ground`}
            gradientUnits="userSpaceOnUse"
            x1={viewBox.minX}
            y1={viewBox.minY}
            x2={viewBox.minX}
            y2={viewBox.minY + viewBox.height}
          >
            <stop offset="0" className="arena__ground-far" />
            <stop offset="0.55" className="arena__ground-mid" />
            <stop offset="1" className="arena__ground-near" />
          </linearGradient>

          {groundImage && (
            <pattern
              id={`${uid}-art`}
              patternUnits="userSpaceOnUse"
              x={viewBox.minX}
              y={viewBox.minY}
              width={viewBox.width}
              height={viewBox.height}
            >
              <image
                href={groundImage}
                x={0}
                y={0}
                width={viewBox.width}
                height={viewBox.height}
                preserveAspectRatio="xMidYMid slice"
              />
            </pattern>
          )}
        </defs>

        <g transform={view.transform}>
          {/* 1. Base: la silueta del tablero y su sombra. */}
          <g className="arena__base">
            {cells.map((c) => (
              <polygon key={c.key} className="arena__base-hex" points={c.points} />
            ))}
          </g>

          {/* 2. El suelo. Sin trazo: los polígonos se tocan exacto y lo que
              tiene que leerse es una lámina, no celdas. */}
          <g className="arena__ground">
            {cells.map((c) => (
              <polygon
                key={c.key}
                points={c.points}
                fill={`url(#${uid}-${groundImage ? "art" : "ground"})`}
              />
            ))}
          </g>

          {/* 3. La malla, cada arista una sola vez. */}
          <g className="arena__mesh">
            {meshEdges.map((e) => {
              const s = segment(e);
              return <line key={`${Hex.key(e.hex)}-${e.dir}`} {...s} />;
            })}
          </g>

          {/* 4. Contornos de región: solo las aristas que dan afuera, que es lo
              que convierte un puñado de hexágonos en un área. */}
          {regionOutlines.map((r) => (
            <g key={r.id} className="arena__region" data-kind={r.kind}>
              {r.edges.map((e) => {
                const s = segment(e);
                return <line key={`${Hex.key(e.hex)}-${e.dir}`} {...s} />;
              })}
            </g>
          ))}

          {/* 5. Las fichas. Un solo `drop-shadow` para la capa entera (lo pone
              el parcial): todas están a la misma altura sobre el suelo, así que
              la luz les cae igual y el filtro se rasteriza una vez. */}
          {pieces.length > 0 && (
            <g className="arena__pieces">
              {pieces.map((p) => {
                const { x, y } = Hex.toPixel(p.hex, hexSize, tilt);
                // El disco sale del hexágono y se comprime con él: la ficha está
                // TUMBADA en la casilla, no de pie sobre ella.
                const rx = hexSize * 0.6;
                const ry = rx * tilt;
                return (
                  <g
                    key={p.id}
                    className="arena__piece"
                    data-side={p.side}
                    data-role={p.role}
                    data-selected={p.selected ? "true" : undefined}
                  >
                    <ellipse className="arena__piece-base" cx={x} cy={y} rx={rx} ry={ry} />
                    {/* El héroe lleva un aro de más por fuera, y no es adorno:
                        es la única ficha cuya caída pierde la batalla (§6), así
                        que hay que poder encontrarla de un vistazo entre diez. */}
                    {p.role === "heroe" && (
                      <ellipse
                        className="arena__piece-ring"
                        cx={x}
                        cy={y}
                        rx={rx * 1.26}
                        ry={ry * 1.26}
                      />
                    )}
                    <text
                      className="arena__piece-icon"
                      x={x}
                      y={y}
                      fontSize={(hexSize * 0.62).toFixed(1)}
                    >
                      {p.icon}
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* 6. Interacción. Va por encima de la malla, de los contornos y de
              las fichas: es lo que el ratón está señalando ahora mismo, y tiene
              que ganar —también para que el clic llegue con la ficha delante—. */}
          <g className="arena__marks">
            {cells.map((c) => {
              const isHover = hovered && Hex.equals(hovered, c.hex);
              const isSel = selected && Hex.equals(selected, c.hex);
              const isOrigin = origin && Hex.equals(origin, c.hex);
              return (
                <polygon
                  key={c.key}
                  className="arena__mark"
                  points={c.points}
                  data-hover={isHover ? "true" : undefined}
                  data-selected={isSel ? "true" : undefined}
                  data-origin={isOrigin ? "true" : undefined}
                  data-interactive={onHexClick ? "true" : undefined}
                  onClick={
                    onHexClick
                      ? () => {
                          // Todo arrastre acaba en un clic sobre el hexágono
                          // donde se suelta el ratón, y mover la cámara no es
                          // elegir.
                          if (view.wasDrag()) return;
                          onHexClick(c.hex);
                        }
                      : undefined
                  }
                  onPointerEnter={onHexClick ? () => setHovered(c.hex) : undefined}
                  onPointerLeave={
                    onHexClick
                      ? () => setHovered((h) => (h && Hex.equals(h, c.hex) ? null : h))
                      : undefined
                  }
                >
                  <title>{describe(arena, c.hex, origin, pieceByKey.get(c.key) ?? null)}</title>
                </polygon>
              );
            })}
          </g>

          {/* 7. Rótulos: van PINTADOS en el suelo, así que fuera de cualquier
              capa con sombra. */}
          {label && (
            <g className="arena__labels">
              {cells.map((c) => {
                if (pieceByKey.has(c.key)) return null;
                const text = label(c.hex);
                if (text === null) return null;
                return (
                  <text key={c.key} className="arena__label" x={c.x} y={c.y}>
                    {text}
                  </text>
                );
              })}
            </g>
          )}
        </g>
      </svg>

      {/* Mando de la cámara. No propaga el pointerdown: si lo hiciera, pulsar
          «+» empezaría también un arrastre. */}
      <div className="arena__nav" onPointerDown={(e) => e.stopPropagation()}>
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
        <span className="arena__zoom" title="Escala: 100 % es la arena encajada en el marco">
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
          title="Volver a encajar la arena entera en el marco"
          disabled={view.isFit}
          onClick={view.fit}
        >
          Encajar
        </Button>
      </div>
    </div>
  );
}

/** Texto del tooltip nativo: dónde está ese hexágono, a qué distancia y quién. */
function describe(
  arena: Arena,
  hex: HexCoord,
  origin: HexCoord | null,
  piece: ArenaPiece | null,
): string {
  const { col, row } = Hex.axialToOffset(hex);
  const parts = [`col ${col}, fila ${row}`];
  if (origin) parts.push(`a ${Hex.distance(origin, hex)} hex`);
  if (piece) parts.push(piece.label);
  return parts.join(" · ");
}
