"use client";

// =========================================================================
// Laboratorio de generación de TABLERO — /dev/tablero
//
// Banco de pruebas de lib/rules/board-gen.ts: cambia la semilla y los
// parámetros y mira qué tablero sale. No es la pantalla de juego —todavía no
// hay héroe ni turnos—, es la herramienta para ver si la generación cumple lo
// que promete docs/board/board-map.md §2 y §2c antes de construir encima.
//
// Lo que se prueba aquí es el ENCAJE, no la loseta: cuántas se colocan, por
// dónde crece el tablero, dónde caen las localizaciones y las fichas. Cómo es
// cada loseta por dentro se maqueta en el otro laboratorio (/dev/losetas).
//
// Vive en components/dev/ y no en components/game/ porque es instrumental: el
// tablero que pinta (components/game/board/HexBoard) sí es del juego, este
// panel de mandos no. Toda la lógica que se ve aquí está en el motor; el
// laboratorio solo pide tableros y los enseña.
// =========================================================================

import { useMemo, useState, type ChangeEvent } from "react";
import Link from "next/link";
import { InputText } from "primereact/inputtext";
import * as Hex from "@/lib/rules/hex";
import { generateBoard } from "@/lib/rules/board-gen";
import type { BoardToken, Hex as HexCell } from "@/lib/rules/state";
import { TERRAINS, TERRAIN_IDS, type TerrainId } from "@/lib/rules/terrain";
import { TILES_BY_ID } from "@/lib/rules/tiles";
import { ELITE_LABEL, LOCATION_GLYPH, TOKEN_GLYPH } from "@/components/game/board/board-glyphs";
import HexBoard from "@/components/game/board/HexBoard";

// Semilla inicial fija: si fuera aleatoria, el servidor y el cliente
// generarían tableros distintos y la hidratación se quejaría.
const INITIAL_SEED = "guarida-1";

// Pocas losetas y grandes: la bolsa va de 3 a 21 hexágonos por pieza, así que
// 9 losetas ya dan las ~65 casillas de un tablero de Partida rápida.
const TILE_COUNTS = [6, 9, 12];
const DENSITIES = [0.12, 0.17, 0.22];
const SHAPES: Array<{ label: string; sprawl: number }> = [
  { label: "Alargado", sprawl: 2 },
  { label: "Compacto", sprawl: 0.4 },
];

export default function BoardLab() {
  const [seed, setSeed] = useState(INITIAL_SEED);
  const [tileCount, setTileCount] = useState(9);
  const [tokenDensity, setTokenDensity] = useState(0.17);
  const [sprawl, setSprawl] = useState(2);
  const [revealAll, setRevealAll] = useState(true);
  const [showCoords, setShowCoords] = useState(false);
  const [showTiles, setShowTiles] = useState(true);
  const [selected, setSelected] = useState<HexCell | null>(null);

  const { board, chapter } = useMemo(
    () => generateBoard({ seed, tileCount, tokenDensity, sprawl }),
    [seed, tileCount, tokenDensity, sprawl],
  );

  const stats = useMemo(() => summarize(board.hexes), [board]);
  const maxDistance = useMemo(
    () => Math.max(...[...board.distanceFromEntrance.values()].filter(Number.isFinite)),
    [board],
  );

  const btn = (active: boolean) =>
    `rounded-md border px-3 py-1.5 text-sm transition-colors ${
      active
        ? "border-[var(--wiki-accent)] bg-[var(--wiki-accent-soft)] font-medium text-[var(--wiki-accent)]"
        : "border-[var(--wiki-border)] text-[var(--wiki-text)] hover:bg-[var(--wiki-surface-2)]"
    }`;

  const label = "text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]";

  const selectedTile = selected ? board.tiles.find((t) => t.id === selected.tileId) : undefined;

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-[var(--wiki-text)]">Generación de tablero</h1>
      <p className="mb-5 max-w-3xl text-sm text-[var(--wiki-muted)]">
        El tablero de una <b>Partida rápida</b> (o de un capítulo de campaña) se monta encajando{" "}
        <Link href="/dev/losetas" className="text-[var(--wiki-accent)] hover:underline">
          losetas
        </Link>{" "}
        borde con borde, como en un tablero modular (
        <Link href="/docs/board/board-map" className="text-[var(--wiki-accent)] hover:underline">
          Tablero y mapa §2
        </Link>
        ). Las losetas solo se unen <b>ancla contra ancla</b>: el resto de su contorno es pared, así
        que el tablero solo crece por donde la pieza se ofrece. Aquí se prueba el <b>encaje</b>:
        cuántas losetas, hacia dónde crece y dónde caen las localizaciones y las fichas. La misma
        semilla da siempre el mismo tablero.
      </p>

      {/* Controles */}
      <div className="mb-5 flex flex-wrap items-end gap-x-6 gap-y-3">
        <div className="flex flex-col gap-1">
          <span className={label}>Semilla</span>
          <div className="flex items-center gap-2">
            <InputText
              value={seed}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSeed(e.target.value)}
              className="w-40"
              placeholder="cualquier texto"
            />
            <button className={btn(false)} onClick={() => setSeed(randomSeed())}>
              Nueva
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className={label}>Losetas</span>
          <div className="flex items-center gap-2">
            {TILE_COUNTS.map((n) => (
              <button key={n} className={btn(tileCount === n)} onClick={() => setTileCount(n)}>
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className={label}>Silueta</span>
          <div className="flex items-center gap-2">
            {SHAPES.map((s) => (
              <button
                key={s.label}
                className={btn(sprawl === s.sprawl)}
                onClick={() => setSprawl(s.sprawl)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className={label}>Densidad de fichas</span>
          <div className="flex items-center gap-2">
            {DENSITIES.map((d) => (
              <button key={d} className={btn(tokenDensity === d)} onClick={() => setTokenDensity(d)}>
                {Math.round(d * 100)} %
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className={label}>Vista</span>
          <div className="flex items-center gap-2">
            <button className={btn(revealAll)} onClick={() => setRevealAll((v) => !v)}>
              Revelar todo
            </button>
            <button className={btn(showTiles)} onClick={() => setShowTiles((v) => !v)}>
              Losetas
            </button>
            <button className={btn(showCoords)} onClick={() => setShowCoords((v) => !v)}>
              Coordenadas
            </button>
          </div>
        </div>
      </div>

      {/* Resumen de la partida que saldría de este tablero */}
      <div className="mb-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-[var(--wiki-text)]">
        <span>
          <b>Tablero:</b> {board.hexes.size} hexágonos en {board.tiles.length} losetas
        </span>
        <span>
          <b>Boss de la Guarida:</b> {ELITE_LABEL[chapter.bossElite]}
        </span>
        <span>
          <b>Mazmorra:</b>{" "}
          {chapter.dungeonElite ? ELITE_LABEL[chapter.dungeonElite] : "no la lleva este tablero"}
        </span>
        <span>
          <b>Travesía máxima:</b> {maxDistance} hexágonos
        </span>
        <span title="Grupos de Camino conectados entre sí. Un tablero con muchos tramos cortos es un tablero donde el sendero muere en cada junta.">
          <b>Sendero:</b> {stats.terrain.camino} hexágonos en {stats.roadRuns} tramos (mayor:{" "}
          {stats.longestRoad})
        </span>
        <span>
          <b>Fichas:</b> {stats.tokenTotal}
        </span>
      </div>

      {/* Tablero */}
      <div className="board rounded-lg border border-[var(--wiki-border)] bg-[var(--wiki-surface)] p-3">
        <HexBoard
          board={board}
          revealAll={revealAll}
          showCoords={showCoords}
          showTiles={showTiles}
          selected={selected?.coord ?? null}
          onHexClick={(hex) => setSelected(hex)}
        />

        <div className="board__legend">
          {TERRAIN_IDS.map((id) => (
            <span key={id} className="board__legend-item">
              <span className="board__swatch" data-terrain={id} />
              {TERRAINS[id].label} · {stats.terrain[id]}
            </span>
          ))}
        </div>

        <div className="board__legend">
          {(Object.keys(TOKEN_GLYPH) as BoardToken[]).map((t) => (
            <span key={t} className="board__legend-item" title={TOKEN_GLYPH[t].label}>
              <span aria-hidden>{TOKEN_GLYPH[t].glyph}</span>
              {capitalize(t)} · {stats.tokens[t]}
            </span>
          ))}
          {(Object.keys(LOCATION_GLYPH) as Array<keyof typeof LOCATION_GLYPH>).map((l) => (
            <span key={l} className="board__legend-item" title={LOCATION_GLYPH[l].label}>
              <span aria-hidden>{LOCATION_GLYPH[l].glyph}</span>
              {capitalize(l)}
            </span>
          ))}
        </div>
      </div>

      {/* Losetas usadas: para ver si la bolsa está bien repartida */}
      <details className="mt-4 text-sm text-[var(--wiki-muted)]">
        <summary className="cursor-pointer text-[var(--wiki-text)]">
          Losetas de este tablero ({board.tiles.length})
        </summary>
        <ul className="mt-2 grid gap-0.5">
          {countBy(board.tiles.map((t) => t.defId)).map(([defId, n]) => (
            <li key={defId}>
              {TILES_BY_ID[defId]?.label ?? defId} × {n}
            </li>
          ))}
        </ul>
      </details>

      {/* Detalle del hexágono seleccionado */}
      {selected && (
        <div className="mt-4 rounded-lg border border-[var(--wiki-border)] bg-[var(--wiki-surface)] p-3 text-sm">
          <div className="mb-1 font-semibold text-[var(--wiki-text)]">
            Hexágono {selected.coord.q},{selected.coord.r} — {TERRAINS[selected.terrain].label}
            {selected.isEntrance && " · Entrada"}
            {selected.location && ` · ${capitalize(selected.location)}`}
            {selected.token && ` · ficha de ${capitalize(selected.token)}`}
          </div>
          <ul className="grid gap-0.5 text-[var(--wiki-muted)]">
            <li>
              Loseta: {selectedTile ? TILES_BY_ID[selectedTile.defId]?.label : "—"} (
              {selected.tileId}, giro {selectedTile ? selectedTile.rotation * 60 : 0}°)
            </li>
            <li>Coste de movimiento: {TERRAINS[selected.terrain].moveCost}</li>
            <li>
              Detección enemiga: {signed(TERRAINS[selected.terrain].enemyDetectionMod)} · visión del
              héroe: {signed(TERRAINS[selected.terrain].heroVisionMod)}
            </li>
            <li>
              Distancia desde la entrada:{" "}
              {formatDistance(board.distanceFromEntrance.get(Hex.key(selected.coord)))}
            </li>
            {TERRAINS[selected.terrain].hazard && (
              <li>
                Peligro al cruzar: salvación {TERRAINS[selected.terrain].hazard!.save} CD{" "}
                {TERRAINS[selected.terrain].hazard!.cd} o{" "}
                {TERRAINS[selected.terrain].hazard!.effect}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

// --- Helpers de presentación ----------------------------------------------

type Summary = {
  terrain: Record<TerrainId, number>;
  tokens: Record<BoardToken, number>;
  tokenTotal: number;
  /** Tramos de sendero: grupos de Camino conectados entre sí. */
  roadRuns: number;
  /** Hexágonos del tramo más largo. */
  longestRoad: number;
};

function summarize(hexes: ReadonlyMap<string, HexCell>): Summary {
  const terrain = Object.fromEntries(TERRAIN_IDS.map((id) => [id, 0])) as Record<TerrainId, number>;
  const tokens = Object.fromEntries(
    (Object.keys(TOKEN_GLYPH) as BoardToken[]).map((t) => [t, 0]),
  ) as Record<BoardToken, number>;
  let tokenTotal = 0;

  for (const cell of hexes.values()) {
    terrain[cell.terrain]++;
    if (cell.token) {
      tokens[cell.token]++;
      tokenTotal++;
    }
  }

  const { runs: roadRuns, longest: longestRoad } = roadStretches(hexes);
  return { terrain, tokens, tokenTotal, roadRuns, longestRoad };
}

/**
 * Los tramos de sendero del tablero. Es la medida de si el encaje une los
 * caminos o los pica en trozos: 40 hexágonos de Camino en 3 tramos es una red;
 * los mismos 40 en 15 tramos son manchas de tierra sin sentido.
 *
 * @returns {{runs: number, longest: number}} Cuántos tramos y el mayor.
 */
function roadStretches(hexes: ReadonlyMap<string, HexCell>): { runs: number; longest: number } {
  const pending = new Set(
    [...hexes.values()].filter((c) => c.terrain === "camino").map((c) => Hex.key(c.coord)),
  );
  let runs = 0;
  let longest = 0;

  while (pending.size > 0) {
    const start = pending.values().next().value!;
    pending.delete(start);
    const queue = [Hex.fromKey(start as `${number},${number}`)];
    let size = 0;

    for (let head = 0; head < queue.length; head++) {
      size++;
      for (const neighbor of Hex.neighbors(queue[head])) {
        const nk = Hex.key(neighbor);
        if (!pending.has(nk)) continue;
        pending.delete(nk);
        queue.push(neighbor);
      }
    }
    runs++;
    longest = Math.max(longest, size);
  }
  return { runs, longest };
}

function countBy(items: readonly string[]): Array<[string, number]> {
  const tally = new Map<string, number>();
  for (const item of items) tally.set(item, (tally.get(item) ?? 0) + 1);
  return [...tally.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

/** Semilla legible al azar. Es una elección de UI, no una regla: aquí sí vale Math.random. */
function randomSeed(): string {
  return Math.random().toString(36).slice(2, 8);
}

function signed(n: number): string {
  return n === 0 ? "sin cambio" : n > 0 ? `+${n}` : `${n}`;
}

function formatDistance(d: number | undefined): string {
  if (d === undefined) return "—";
  return Number.isFinite(d) ? `${d} hexágonos` : "inalcanzable rodeando la Montaña";
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
