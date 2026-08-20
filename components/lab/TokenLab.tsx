"use client";

// =========================================================================
// Laboratorio de FICHAS DEL TABLERO — /lab/tokens
//
// Banco de pruebas de lib/v2/rules/tokens.ts: qué pasa al interactuar con cada
// ficha, no solo cuál sale (eso ya lo prueba /lab/board). Deliberadamente
// más simple que /lab/movement —tablero siempre revelado, un solo héroe—
// porque aquí no se prueba niebla ni co-op, se prueba resolución.
//
// Terreno y Tesoro tienen fórmula cerrada (prueba de habilidad / tabla de
// loot, docs/board/board-map.md §4b y game-design.md §6b.6) y se resuelven
// del todo. Amenaza, Exploración y Enemigo roban del mazo de encuentro
// (cards/encounter.md) y MUESTRAN la carta, sin aplicar su efecto: la mayoría
// depende de sistemas que no existen todavía (Maldición, reloj de Amenaza,
// Mercenario, pantalla de batalla). Personaje es solo lectura: qué oficio es
// y qué ofrece, sin comprar/vender de verdad (Hero no tiene oro todavía).
// Pueblo abre VillageScreen, una pantalla propia a pantalla completa con un
// placeholder de tienda — nunca se retira, es un edificio, no contenido.
// =========================================================================

import { useMemo, useState, type ChangeEvent } from "react";
import { InputText } from "primereact/inputtext";
import { SelectButton } from "primereact/selectbutton";
import * as Hex from "@/lib/v2/rules/hex";
import type { HexCoord } from "@/lib/v2/rules/hex";
import { generateBoard } from "@/lib/v2/rules/board-gen";
import * as Rng from "@/lib/v2/rules/rng";
import type { Board, Hero, HeroClassId, Hex as HexCell } from "@/lib/v2/rules/state";
import { TERRAINS } from "@/lib/v2/rules/terrain";
import { HERO_CLASS_IDS, HERO_ROSTER } from "@/lib/v2/rules/hero-roster";
import {
  NPC_BLURB,
  NPC_LABEL,
  resolveEnemigo,
  resolveSuceso,
  resolveTerreno,
  resolveTesoro,
  retireToken,
  type TerrainOutcome,
} from "@/lib/v2/rules/tokens";
import { buildEncounterState, type EncounterState } from "@/lib/v2/rules/encounter";
import type { DeckCard } from "@/lib/v2/rules/deck";
import type { CatalogCard } from "@/lib/card-catalog";
import HexBoard from "@/components/game/board/HexBoard";
import { TOKEN_ART, TOKEN_IDS } from "@/components/game/board/piece-art";
import { buttonClass } from "@/components/ui/Button";
import VillageScreen from "@/components/lab/VillageScreen";

const INITIAL_SEED = "cofre-1";

type Resolution =
  | { readonly kind: "terreno"; readonly outcome: TerrainOutcome }
  | { readonly kind: "tesoro"; readonly cards: readonly CatalogCard[] }
  | { readonly kind: "suceso"; readonly ficha: "amenaza" | "exploracion"; readonly card: DeckCard }
  | { readonly kind: "enemigo"; readonly card: DeckCard }
  | { readonly kind: "personaje" }
  | { readonly kind: "pueblo" };

type HistoryEntry = { readonly coord: HexCoord; readonly cell: HexCell; readonly resolution: Resolution };

/** Semilla legible al azar. Elección de UI, no del motor: aquí sí vale Math.random. */
function randomSeed(): string {
  return Math.random().toString(36).slice(2, 8);
}

export default function TokenLab({ catalog }: { catalog: readonly CatalogCard[] }) {
  const [seed, setSeed] = useState(INITIAL_SEED);
  const [heroClass, setHeroClass] = useState<HeroClassId>(HERO_CLASS_IDS[0]);

  const { board: generatedBoard } = useMemo(() => generateBoard({ seed }), [seed]);

  const btn = (active: boolean) => buttonClass({ active });
  const label = "text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]";

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-[var(--wiki-text)]">Fichas del tablero</h1>
      <p className="mb-5 max-w-3xl text-sm text-[var(--wiki-muted)]">
        Las 7 fichas de contenido (<code>docs/board/board-map.md</code> §4) ya salían en el
        tablero, pero nada resolvía qué pasa al interactuar con ellas. Clica una ficha para
        resolverla: <b>Terreno</b> tira su prueba, <b>Tesoro</b> sortea la tabla de loot,{" "}
        <b>Amenaza</b>/<b>Exploración</b> roban una carta de Suceso, <b>Enemigo</b> roba una de
        Combate, <b>Personaje</b> muestra su oficio y <b>Pueblo</b> abre la pantalla de la Taberna.
        Una ficha resuelta se retira y deja su huella (§4c) — <b>Terreno</b> y <b>Pueblo</b> son la
        excepción: Terreno se queda si fallas la prueba, y Pueblo no se retira nunca (es un
        edificio, no contenido que se consuma).
      </p>

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
          title="Solo hace falta para la prueba de la ficha de Terreno: 1d20 + mejor de mod FUE/DES."
        >
          <span className={label}>Clase</span>
          <SelectButton
            value={heroClass}
            onChange={(e) => e.value != null && setHeroClass(e.value)}
            options={HERO_CLASS_IDS.map((id) => ({ label: HERO_ROSTER[id].label, id }))}
            optionLabel="label"
            optionValue="id"
            allowEmpty={false}
          />
        </div>
      </div>

      {/* Sesión: clave en semilla+clase para reiniciar tablero, PV y el mazo de encuentro sin arrastrar estado anterior. */}
      <TokenSession key={`${seed}:${heroClass}`} board={generatedBoard} heroClass={heroClass} catalog={catalog} />
    </div>
  );
}

function buildHero(classId: HeroClassId, position: HexCoord): Hero {
  const def = HERO_ROSTER[classId];
  return {
    id: "h0",
    classId,
    abilityScores: def.abilityScores,
    pv: { current: def.pvMax, max: def.pvMax },
    position,
  };
}

type SessionProps = {
  board: Board;
  heroClass: HeroClassId;
  catalog: readonly CatalogCard[];
};

function TokenSession({ board: initialBoard, heroClass, catalog }: SessionProps) {
  const [board, setBoard] = useState(initialBoard);
  const [hero, setHero] = useState<Hero>(() => buildHero(heroClass, initialBoard.entrance));
  const [rng, setRng] = useState<Rng.Rng>(() => Rng.rngFromSeed(`${initialBoard.entrance.q},${initialBoard.entrance.r}:fichas`));
  const [encounterState, setEncounterState] = useState<EncounterState>(() => buildEncounterState(catalog));
  const [selected, setSelected] = useState<HexCoord | null>(null);
  const [history, setHistory] = useState<readonly HistoryEntry[]>([]);
  const [villageAt, setVillageAt] = useState<HexCoord | null>(null);

  function record(coord: HexCoord, cell: HexCell, resolution: Resolution) {
    setHistory((h) => [...h, { coord, cell, resolution }]);
  }

  function handleHexClick(hex: HexCell) {
    setSelected(hex.coord);
    if (!hex.token || hex.resolved) return;

    if (hex.token === "terreno") {
      const { outcome, board: nextBoard, hero: nextHero, rng: nextRng } = resolveTerreno(
        board,
        hex.coord,
        hero,
        catalog,
        rng,
      );
      setBoard(nextBoard);
      setHero(nextHero);
      setRng(nextRng);
      record(hex.coord, hex, { kind: "terreno", outcome });
      return;
    }

    if (hex.token === "tesoro") {
      const { cards, rng: nextRng } = resolveTesoro(rng, catalog);
      setRng(nextRng);
      setBoard((b) => retireToken(b, hex.coord));
      record(hex.coord, hex, { kind: "tesoro", cards });
      return;
    }

    if (hex.token === "amenaza" || hex.token === "exploracion") {
      const { card, encounterState: nextState, rng: nextRng } = resolveSuceso(encounterState, catalog, rng);
      setEncounterState(nextState);
      setRng(nextRng);
      setBoard((b) => retireToken(b, hex.coord));
      record(hex.coord, hex, { kind: "suceso", ficha: hex.token, card });
      return;
    }

    if (hex.token === "enemigo") {
      const { card, encounterState: nextState, rng: nextRng } = resolveEnemigo(encounterState, catalog, rng);
      setEncounterState(nextState);
      setRng(nextRng);
      setBoard((b) => retireToken(b, hex.coord));
      record(hex.coord, hex, { kind: "enemigo", card });
      return;
    }

    if (hex.token === "pueblo") {
      // Nunca se retira: es un edificio persistente, no contenido que se
      // consuma. Se puede volver a entrar cuantas veces haga falta.
      setVillageAt(hex.coord);
      record(hex.coord, hex, { kind: "pueblo" });
      return;
    }

    // "personaje"
    setBoard((b) => retireToken(b, hex.coord));
    record(hex.coord, hex, { kind: "personaje" });
  }

  const selectedCell = selected ? board.hexes.get(Hex.key(selected)) : undefined;
  const latestForSelected = useMemo(() => {
    if (!selected) return null;
    for (let i = history.length - 1; i >= 0; i--) {
      if (Hex.equals(history[i].coord, selected)) return history[i];
    }
    return null;
  }, [history, selected]);

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-[var(--wiki-text)]">
        <span>
          <b>{HERO_ROSTER[hero.classId].label}:</b> {hero.pv.current}/{hero.pv.max} PV
        </span>
        <span>
          <b>Mazo de Suceso:</b> {encounterState.suceso.length} cartas sin robar
        </span>
        <span>
          <b>Mazo de Combate:</b> {encounterState.combate.length} cartas sin robar
        </span>
        <span>
          <b>Fichas resueltas:</b> {history.length}
        </span>
      </div>

      <div className="board rounded-lg border border-[var(--wiki-border)] bg-[var(--wiki-surface)] p-3">
        <HexBoard board={board} revealAll selected={selected} onHexClick={handleHexClick} />

        <div className="board__legend">
          {TOKEN_IDS.map((t) => (
            <span key={t} className="board__legend-item" title={TOKEN_ART[t].label}>
              {TOKEN_ART[t].label.split(":")[0]}
            </span>
          ))}
        </div>
      </div>

      {selectedCell && (
        <TokenPanel cell={selectedCell} resolution={latestForSelected?.resolution ?? null} />
      )}

      {villageAt && <VillageScreen onExit={() => setVillageAt(null)} />}

      {history.length > 0 && (
        <details className="mt-4 text-sm text-[var(--wiki-muted)]" open>
          <summary className="cursor-pointer text-[var(--wiki-text)]">
            Registro de esta sesión ({history.length})
          </summary>
          <ul className="mt-2 grid gap-1">
            {[...history].reverse().map((entry, i) => (
              <li key={i}>
                <button
                  type="button"
                  className="text-left hover:underline"
                  onClick={() => setSelected(entry.coord)}
                >
                  {entry.coord.q},{entry.coord.r} — {summarize(entry.resolution)}
                </button>
              </li>
            ))}
          </ul>
        </details>
      )}
    </>
  );
}

function summarize(resolution: Resolution): string {
  switch (resolution.kind) {
    case "terreno":
      return resolution.outcome.kind === "exito"
        ? `Terreno — éxito, ${resolution.outcome.card?.name ?? "sin carta"}`
        : `Terreno — fallo${resolution.outcome.effect ? `, ${resolution.outcome.effect}` : ""}`;
    case "tesoro":
      return `Tesoro — ${resolution.cards.map((c) => c.name).join(", ") || "sin cartas"}`;
    case "suceso":
      return `${resolution.ficha === "amenaza" ? "Amenaza" : "Exploración"} — ${resolution.card.card.name}`;
    case "enemigo":
      return `Enemigo — ${resolution.card.card.name}`;
    case "personaje":
      return "Personaje";
    case "pueblo":
      return "Pueblo — entra a la Taberna";
  }
}

function TokenPanel({ cell, resolution }: { cell: HexCell; resolution: Resolution | null }) {
  const def = cell.terrainRevealed ? TERRAINS[cell.terrain] : null;

  return (
    <div className="mt-4 rounded-lg border border-[var(--wiki-border)] bg-[var(--wiki-surface)] p-3 text-sm">
      <div className="mb-1 font-semibold text-[var(--wiki-text)]">
        Hexágono {cell.coord.q},{cell.coord.r}
        {def && ` — ${def.label}`}
        {cell.token && ` · ficha de ${TOKEN_ART[cell.token].label.split(":")[0]}`}
        {cell.resolved && " · resuelta"}
      </div>

      {!cell.token && <p className="text-[var(--wiki-muted)]">Sin ficha: solo terreno.</p>}

      {cell.token && !resolution && (
        <p className="text-[var(--wiki-muted)]">Clica la ficha para resolverla.</p>
      )}

      {resolution?.kind === "personaje" && (
        <p className="text-[var(--wiki-text)]">
          Personaje:{" "}
          {cell.npcType ? (
            <>
              oficio <b>{NPC_LABEL[cell.npcType]}</b>. {NPC_BLURB[cell.npcType]}
            </>
          ) : (
            "sin oficio asignado todavía (falta el sistema que lo decida)."
          )}
        </p>
      )}

      {resolution?.kind === "pueblo" && (
        <p className="text-[var(--wiki-text)]">
          Pueblo: entra a la Taberna. Vuelve a clicar la ficha para reabrir la pantalla.
        </p>
      )}

      {resolution && resolution.kind !== "personaje" && resolution.kind !== "pueblo" && (
        <ResolutionView resolution={resolution} />
      )}
    </div>
  );
}

function cardLine(card: CatalogCard): string {
  return `${card.name} (${card.rarity})`;
}

function ResolutionView({
  resolution,
}: {
  resolution: Exclude<Resolution, { kind: "personaje" } | { kind: "pueblo" }>;
}) {
  if (resolution.kind === "terreno") {
    const { outcome } = resolution;
    if (outcome.kind === "exito") {
      return (
        <p className="text-[var(--wiki-text)]">
          Prueba de Terreno: <b>éxito</b> (tirada {outcome.check.roll}, total {outcome.check.total} vs
          CD 12). Cruzas gratis y ganas:{" "}
          <b>{outcome.card ? cardLine(outcome.card) : "— sin carta disponible en el catálogo"}</b>. La
          ficha se retira.
        </p>
      );
    }
    return (
      <p className="text-[var(--wiki-text)]">
        Prueba de Terreno: <b>fallo</b> (tirada {outcome.check.roll}, total {outcome.check.total} vs CD
        12). Pierdes el movimiento que te quedara este turno.{" "}
        {outcome.save ? (
          outcome.save.success ? (
            <>Salvación superada: sin efecto.</>
          ) : (
            <>
              Salvación fallida: sufrirías <b>{outcome.effect}</b> (no se aplica todavía: falta la
              lista de efectos activos en Hero).
            </>
          )
        ) : (
          <>
            Sin salvación propia del terreno: <b>{outcome.damage}</b> de daño contundente directo.
          </>
        )}{" "}
        La ficha se queda: puedes reintentarlo otro turno o rodearla.
      </p>
    );
  }

  if (resolution.kind === "tesoro") {
    return (
      <p className="text-[var(--wiki-text)]">
        Ficha de Tesoro:{" "}
        {resolution.cards.length > 0 ? (
          <b>{resolution.cards.map(cardLine).join(" + ")}</b>
        ) : (
          "el catálogo no tiene cartas de ese tipo/rareza todavía"
        )}
        . El oro que dé además el cofre no está decidido numéricamente en los docs, así que no se
        resuelve aquí.
      </p>
    );
  }

  if (resolution.kind === "suceso") {
    return (
      <p className="text-[var(--wiki-text)]">
        Ficha de {resolution.ficha === "amenaza" ? "Amenaza" : "Exploración"}: roba 1 carta de{" "}
        <b>Suceso</b> — <b>{resolution.card.card.name}</b>. {resolution.card.card.text}
      </p>
    );
  }

  return (
    <p className="text-[var(--wiki-text)]">
      Ficha de Enemigo: roba 1 carta de <b>Combate</b> — <b>{resolution.card.card.name}</b>.{" "}
      {resolution.card.card.text} Esto abriría la pantalla de batalla — sin motor todavía.
    </p>
  );
}
