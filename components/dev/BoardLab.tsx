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
// dónde crece el tablero y dónde caen las fichas, el boss y el Pueblo. Cómo es
// cada loseta por dentro se maqueta en el otro laboratorio (/dev/losetas).
//
// Vive en components/dev/ y no en components/game/ porque es instrumental: el
// tablero que pinta (components/game/board/HexBoard) sí es del juego, este
// panel de mandos no. Toda la lógica que se ve aquí está en el motor; el
// laboratorio solo pide tableros y los enseña.
// =========================================================================

import { useMemo, useState, type ChangeEvent } from "react";
import Link from "next/link";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { SelectButton } from "primereact/selectbutton";
import * as Hex from "@/lib/rules/hex";
import { generateBoard } from "@/lib/rules/board-gen";
import type { BoardToken, Hex as HexCell } from "@/lib/rules/state";
import { TERRAINS, TERRAIN_IDS, type TerrainId } from "@/lib/rules/terrain";
import { TILES_BY_ID } from "@/lib/rules/tile-library";
import { PieceIcon } from "@/components/game/board/BoardPiece";
import { ELITE_LABEL, TOKEN_ART, TOKEN_IDS } from "@/components/game/board/piece-art";
import HexBoard from "@/components/game/board/HexBoard";
import { buttonClass } from "@/components/ui/Button";

// Semilla inicial fija: si fuera aleatoria, el servidor y el cliente
// generarían tableros distintos y la hidratación se quejaría.
const INITIAL_SEED = "guarida-1";

// Los tres tamaños de tablero, y 12 es el MÍNIMO: la bolsa va de 4 a 37
// hexágonos por pieza (media 8,6 por peso), así que salen ~103, ~129 y ~155
// casillas. Lo que fija el tamaño es el total de hexágonos, no las piezas.
const TILE_COUNTS = [12, 15, 18];
const DENSITIES = [0.12, 0.17, 0.22];
const SHAPES: Array<{ label: string; sprawl: number }> = [
  { label: "Alargado", sprawl: 2 },
  { label: "Compacto", sprawl: 0.4 },
];

export default function BoardLab() {
  const [seed, setSeed] = useState(INITIAL_SEED);
  const [tileCount, setTileCount] = useState(12);
  const [tokenDensity, setTokenDensity] = useState(0.17);
  const [sprawl, setSprawl] = useState(2);
  const [revealAll, setRevealAll] = useState(true);
  const [showCoords, setShowCoords] = useState(false);
  const [showTiles, setShowTiles] = useState(true);
  const [selected, setSelected] = useState<HexCell | null>(null);

  const { board, chapter, stranded } = useMemo(
    () => generateBoard({ seed, tileCount, tokenDensity, sprawl }),
    [seed, tileCount, tokenDensity, sprawl],
  );

  const stats = useMemo(() => summarize(board.hexes), [board]);

  // Losetas de Pueblo colocadas. Se cuenta aparte del terreno porque es la
  // pregunta que de verdad importa desde que la generación no funda pueblos: no
  // «hay casas», sino «el encaje ha sacado el sitio donde vive la gente».
  const villageTiles = useMemo(
    () =>
      board.tiles.filter((t) =>
        (TILES_BY_ID[t.defId]?.cells ?? []).some((c) => c.terrain === "pueblo"),
      ).length,
    [board],
  );
  const maxDistance = useMemo(
    () => Math.max(...[...board.distanceFromEntrance.values()].filter(Number.isFinite)),
    [board],
  );

  // Las clases salen de components/ui/Button.tsx: mismo botón que documenta
  // /repository-dev/buttons, para que retocarlo se vea aquí sin copiar nada.
  const btn = (active: boolean) => buttonClass({ active });

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
      <p className="mb-5 max-w-3xl text-sm text-[var(--wiki-muted)]">
        El tablero se mira por una <b>ventana</b>: <b>arrástralo</b> con el ratón para moverte por
        él y usa la <b>rueda</b> —o el mando de la esquina— para acercar y alejar. Con el foco
        puesto en el marco valen también las flechas, <code>+</code>, <code>−</code> y{" "}
        <code>0</code> para volver a encajarlo. Hace falta desde que el tablero mínimo son 12
        losetas: encajado entero se ve la silueta, pero para leer un hexágono hay que acercarse.
      </p>
      <p className="mb-5 max-w-3xl text-sm text-[var(--wiki-muted)]">
        El fondo es <b>la mesa</b> del juego, la misma que en la partida, y sobre ella corre la{" "}
        <b>niebla de atmósfera</b>: jirones a la deriva que pasan <i>por debajo</i> del tablero. La
        niebla es de la mesa, no un velo sobre el mapa, así que las losetas la tapan y se ve
        alrededor, bajo la sombra del tablero y por los huecos cerrados. Tampoco se acerca ni se
        arrastra con la cámara, y no esconde nada —no la confundas con la niebla de exploración, que
        tapa lo que el héroe no ha visto y va por hexágono—. Si has pedido menos movimiento en el
        sistema, se queda quieta.
      </p>
      <p className="mb-5 max-w-3xl text-sm text-[var(--wiki-muted)]">
        El <b>terreno no se sortea y no se repinta</b>: cada hexágono del tablero es el que dibujó
        su loseta en el catálogo, sin una sola excepción. La generación no abre Montañas, no mueve
        la entrada y <b>no funda pueblos</b>: si el encaje no saca ninguna loseta de Pueblo, esa
        partida no tiene Pueblo, y lo que hay que subir es el peso de esos tipos en la bolsa.
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

        <div
          className="flex flex-col gap-1"
          title="Los tres tamaños de tablero. 12 es el mínimo: la bolsa va de 4 a 37 hexágonos por pieza (media 8,6), así que salen ~103, ~129 y ~155 hexágonos, y por debajo de 12 el mapa no da para una travesía."
        >
          <span className={label}>Losetas</span>
          <SelectButton
            value={tileCount}
            onChange={(e) => setTileCount(Number(e.value))}
            options={TILE_COUNTS}
            allowEmpty={false}
          />
        </div>

        <div className="flex flex-col gap-1">
          <span className={label}>Silueta</span>
          <SelectButton
            value={sprawl}
            onChange={(e) => setSprawl(Number(e.value))}
            options={SHAPES}
            optionLabel="label"
            optionValue="sprawl"
            allowEmpty={false}
          />
        </div>

        <div className="flex flex-col gap-1">
          <span className={label}>Densidad de fichas</span>
          <SelectButton
            value={tokenDensity}
            onChange={(e) => setTokenDensity(Number(e.value))}
            options={DENSITIES}
            itemTemplate={(d: number) => `${Math.round(d * 100)} %`}
            allowEmpty={false}
          />
        </div>

        <div className="flex flex-col gap-1">
          <span className={label}>Vista</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <InputSwitch
                inputId="board-reveal-all"
                checked={revealAll}
                onChange={(e) => setRevealAll(Boolean(e.value))}
              />
              <label htmlFor="board-reveal-all" className="cursor-pointer text-sm text-[var(--wiki-text)]">
                Revelar todo
              </label>
            </div>
            <div className="flex items-center gap-2">
              <InputSwitch
                inputId="board-show-tiles"
                checked={showTiles}
                onChange={(e) => setShowTiles(Boolean(e.value))}
              />
              <label htmlFor="board-show-tiles" className="cursor-pointer text-sm text-[var(--wiki-text)]">
                Losetas
              </label>
            </div>
            <div className="flex items-center gap-2">
              <InputSwitch
                inputId="board-show-coords"
                checked={showCoords}
                onChange={(e) => setShowCoords(Boolean(e.value))}
              />
              <label htmlFor="board-show-coords" className="cursor-pointer text-sm text-[var(--wiki-text)]">
                Coordenadas
              </label>
            </div>
          </div>
        </div>

      </div>

      {/* Resumen de la partida que saldría de este tablero */}
      <div className="mb-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-[var(--wiki-text)]">
        <span
          title={
            board.tiles.length < tileCount
              ? "El encaje se ha cerrado antes de colocarlas todas: se han agotado las anclas libres. El generador ya reintenta la siembra y se queda el mejor intento, así que si esto sale a menudo lo que hay que revisar es cuántas anclas trae la bolsa, no el número de losetas."
              : undefined
          }
        >
          <b>Tablero:</b> {board.hexes.size} hexágonos en {board.tiles.length} losetas
          {board.tiles.length < tileCount && (
            <b className="text-[var(--wiki-danger)]"> (de {tileCount} pedidas)</b>
          )}
        </span>
        <span title="La Guarida es la única localización que queda, y no se ve: solo marca el hexágono transitable más lejano a la entrada, que es donde espera el boss. Derrotarlo es la condición de victoria.">
          <b>Boss de la Guarida:</b> {ELITE_LABEL[chapter.bossElite]}
        </span>
        <span title="El segundo Élite va en un hexágono de Mazmorra de la mitad lejana. Si el encaje no ha sacado ninguna loseta de Mazmorra allí, esta partida no lo lleva: lo decide el maquetado, no un dado.">
          <b>Élite de Mazmorra:</b>{" "}
          {chapter.dungeonElite ? ELITE_LABEL[chapter.dungeonElite] : "este tablero no saca Mazmorra"}
        </span>
        <span title="El Pueblo lo trae maquetado su loseta (Posada, Poblado, Iglesia, Torre de mago) y no se garantiza: si el encaje no saca ninguna, esta partida se queda sin tienda y sin descanso largo. Si sale «ninguno» a menudo, hay que subir el peso de los tipos de Pueblo en /dev/losetas.">
          <b>Pueblo:</b>{" "}
          {stats.terrain.pueblo === 0
            ? "ninguno"
            : `${stats.terrain.pueblo} ${stats.terrain.pueblo === 1 ? "hexágono" : "hexágonos"} en ${villageTiles} ${villageTiles === 1 ? "loseta" : "losetas"}`}
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
        <span title="Vacío rodeado de tablero por todos lados: lo deja el encaje y ya no se puede rellenar, así que es terreno intransitable. Forma parte del mapa, no es un fallo.">
          <b>Huecos cerrados:</b>{" "}
          {board.voids.length === 0
            ? "ninguno"
            : `${board.voids.length} ${board.voids.length === 1 ? "hexágono" : "hexágonos"}`}
        </span>
        <span title="Terreno transitable al que no se llega desde la entrada sin cruzar Montaña. La generación ya no abre la roca para arreglarlo: si aquí sale algo, la culpa es de una loseta cuya montaña parte su propio terreno, y se arregla en /dev/losetas.">
          <b>Incomunicado:</b>{" "}
          {stranded.length === 0
            ? "nada"
            : `${stranded.length} ${stranded.length === 1 ? "hexágono" : "hexágonos"}`}
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
          {TOKEN_IDS.map((t) => (
            <span key={t} className="board__legend-item" title={TOKEN_ART[t].label}>
              <PieceIcon piece={{ family: "token", id: t }} />
              {capitalize(t)} · {stats.tokens[t]}
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
            {selected.location === "guarida" && " · Guarida (aquí espera el boss)"}
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
  const tokens = Object.fromEntries(TOKEN_IDS.map((t) => [t, 0])) as Record<BoardToken, number>;
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
