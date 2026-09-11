"use client";

// =========================================================================
// Módulo «Motor de combate» de /dev — un combate 1 contra 1 con fichas reales
//
// lib/v3/combat.ts (la tirada del §4.1) y lib/v3/battle.ts `fight()` (el
// golpe entero, §4.2 y §4.6, más los Estados desde el 7-sep) ya estaban
// escritos y probados, pero con estadísticas INVENTADAS: no había ningún
// `Character` real con las 8 Habilidades puestas. Con el roster armando las
// 24 fichas de las dos razas piloto (Humanos y Enanos, status.md §4), lo
// único que faltaba era el puente —lib/v3/fighters.ts `fighterOf()`— y esta
// pantalla, que enfrenta dos de esas 24 fichas de verdad —de la misma raza o
// de las dos— sobre la arena mínima de /dev/tablero.
//
// UN CONTRA UNO A PROPÓSITO, mismo criterio que duel.ts: es el caso límite,
// y un bando de cuatro es una composición que todavía no ha decidido nadie
// (eso es el módulo «baraja»). Las dos fichas pueden ser la misma —un héroe
// contra sí mismo— para ver si el motor reparte parejo antes de mirar nada
// más raro.
//
// `applies` YA NO ESTÁ VACÍO SIEMPRE (8-sep-2026): `fighters.ts` `appliesOf()`
// cruza las Características que la ficha ya lleva en razas.md contra la
// columna "Lo aplica" de effects.md — el 🪓 Berserker de Enanos dispara
// Sangrado, su 🗿 Gólem de piedra dispara Lentitud, el 🐉 Dragón dorado de
// Humanos dispara Quemadura. El registro recalcula la ❤️ Vida sumando tanto
// `hit.damage` como el `selfDamage` del tic de Estados al final de cada
// turno — sin esto último, un tic pasaría sin bajar la cifra en pantalla.
//
// No decide ninguna regla (ARCHITECTURE.md §6): fight() ya las aplicó, esto
// solo pinta lo que devolvió.
// =========================================================================

import { useMemo, useState } from "react";
import Link from "next/link";
import { ARENA, buildArena, type Side } from "@/lib/v3/arena";
import { fight, type BattleResult } from "@/lib/v3/battle";
import { ABILITY_IDS, ABILITIES, type Character } from "@/lib/v3/character";
import { DAMAGE_TYPES } from "@/lib/v3/damage";
import { frontToFront } from "@/lib/v3/duel";
import type { Effect } from "@/lib/v3/effects";
import { appliesOf, fighterOf } from "@/lib/v3/fighters";
import { rarityForTier } from "@/lib/v3/rarity";
import type { Trait } from "@/lib/v3/traits";
import ArenaBoard, { type ArenaPiece } from "./ArenaBoard";
import RarityChip from "@/components/wiki/RarityChip";
import Button from "@/components/ui/Button";

export type CombatModuleProps = {
  /** Las 24 fichas reales de las dos razas piloto —4 héroes y 8 unidades cada una—, de lib/v3/races.ts. */
  characters: readonly Character[];
  /** El catálogo de Estados. Se le pasa a fight(), y a appliesOf() para saber cuál dispara cada ficha. */
  effects: readonly Effect[];
  /** Las 41 Características, para que appliesOf() cruce lo que cada ficha ya lleva. */
  catalog: readonly Trait[];
};

const SWEEP_SIZE = 1000;

type Snapshot = {
  readonly own: Character;
  readonly enemy: Character;
  readonly ownFighterId: string;
  readonly enemyFighterId: string;
};

type SweepStats = {
  readonly n: number;
  readonly winsOwn: number;
  readonly winsEnemy: number;
  readonly draws: number;
  readonly avgRounds: number;
};

function resultLabel(result: "fallo" | "impacto" | "critico"): string {
  switch (result) {
    case "fallo":
      return "falla";
    case "impacto":
      return "acierta";
    case "critico":
      return "¡crítico!";
  }
}

function fichaOption(c: Character): string {
  return c.tier === undefined ? `Héroe · ${c.name}` : `Tier ${c.tier} · ${c.name}`;
}

export default function CombatModule({ characters, effects, catalog }: CombatModuleProps) {
  const label = "text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]";
  const card = "rounded-lg border border-[var(--wiki-border)] bg-[var(--wiki-surface)] p-3";
  const select =
    "rounded-md border border-[var(--wiki-border)] bg-[var(--wiki-bg)] px-2 py-1.5 text-sm text-[var(--wiki-text)]";

  // Una raza por optgroup, en el orden en que llegan (razas piloto: Humanos,
  // luego Enanos) — mismo criterio que las dos tablas de la wiki.
  const races: string[] = [];
  for (const c of characters) {
    if (c.race && !races.includes(c.race)) races.push(c.race);
  }

  // Por defecto, un enfrentamiento entre las dos razas piloto: la propia es
  // la primera ficha que llega, y la enemiga la primera de una raza distinta
  // — así se abre en «Humanos contra Enanos» sin que este módulo tenga que
  // conocer sus nombres.
  const [ownId, setOwnId] = useState(characters[0].id);
  const [enemyId, setEnemyId] = useState(
    characters.find((c) => c.race !== characters[0].race)?.id ?? characters[0].id,
  );
  const [result, setResult] = useState<BattleResult | null>(null);
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [sweep, setSweep] = useState<SweepStats | null>(null);

  const ownCharacter = characters.find((c) => c.id === ownId) ?? characters[0];
  const enemyCharacter = characters.find((c) => c.id === enemyId) ?? characters[0];

  const ownApplies = useMemo(
    () => appliesOf(ownCharacter, catalog, effects),
    [ownCharacter, catalog, effects],
  );
  const enemyApplies = useMemo(
    () => appliesOf(enemyCharacter, catalog, effects),
    [enemyCharacter, catalog, effects],
  );

  const arena = useMemo(() => buildArena(ARENA), []);
  const positions = useMemo(() => frontToFront(arena), [arena]);

  const pieces = useMemo<ArenaPiece[]>(
    () => [
      {
        id: "propio",
        hex: positions.chaser,
        side: "propio",
        role: ownCharacter.role,
        icon: DAMAGE_TYPES[ownCharacter.damage].icon,
        label: `${ownCharacter.name} · ⚔️ ${ownCharacter.abilities.ataque} · ❤️ ${ownCharacter.abilities.vida}`,
      },
      {
        id: "enemigo",
        hex: positions.runner,
        side: "enemigo",
        role: enemyCharacter.role,
        icon: DAMAGE_TYPES[enemyCharacter.damage].icon,
        label: `${enemyCharacter.name} · ⚔️ ${enemyCharacter.abilities.ataque} · ❤️ ${enemyCharacter.abilities.vida}`,
      },
    ],
    [ownCharacter, enemyCharacter, positions],
  );

  const runOne = () => {
    const own = fighterOf(ownCharacter, "propio", positions.chaser, ownApplies);
    const enemy = fighterOf(enemyCharacter, "enemigo", positions.runner, enemyApplies);
    setResult(fight(arena, [own, enemy], { effects }));
    setSnapshot({ own: ownCharacter, enemy: enemyCharacter, ownFighterId: own.id, enemyFighterId: enemy.id });
  };

  const runSweep = () => {
    let winsOwn = 0;
    let winsEnemy = 0;
    let draws = 0;
    let roundsTotal = 0;
    for (let i = 0; i < SWEEP_SIZE; i++) {
      const own = fighterOf(ownCharacter, "propio", positions.chaser, ownApplies);
      const enemy = fighterOf(enemyCharacter, "enemigo", positions.runner, enemyApplies);
      const r = fight(arena, [own, enemy], { effects });
      if (r.winner === "propio") winsOwn++;
      else if (r.winner === "enemigo") winsEnemy++;
      else draws++;
      roundsTotal += r.rounds;
    }
    setSweep({ n: SWEEP_SIZE, winsOwn, winsEnemy, draws, avgRounds: roundsTotal / SWEEP_SIZE });
  };

  const rows = useMemo(() => {
    if (!result || !snapshot) return [];
    const life = new Map<string, number>([
      [snapshot.ownFighterId, snapshot.own.abilities.vida],
      [snapshot.enemyFighterId, snapshot.enemy.abilities.vida],
    ]);
    const nameOf = (id: string) => (id === snapshot.ownFighterId ? snapshot.own.name : snapshot.enemy.name);
    const sideOf = (id: string): Side => (id === snapshot.ownFighterId ? "propio" : "enemigo");

    return result.turns.map((t) => {
      let targetName: string | null = null;
      let targetLife: number | null = null;
      if (t.hit) {
        const before = life.get(t.hit.defender) ?? 0;
        const after = Math.max(0, before - t.hit.damage);
        life.set(t.hit.defender, after);
        targetName = nameOf(t.hit.defender);
        targetLife = after;
      }

      // El tic de los propios Estados (effects.md §3) llega al final del
      // turno del afectado, después de resolver su golpe si tenía uno.
      let selfLife: number | null = null;
      if (t.selfDamage > 0 || t.selfDied) {
        const before = life.get(t.id) ?? 0;
        const after = Math.max(0, before - t.selfDamage);
        life.set(t.id, after);
        selfLife = after;
      }

      return {
        round: t.round,
        actor: nameOf(t.id),
        side: sideOf(t.id),
        steps: t.steps,
        hit: t.hit,
        targetName,
        targetLife,
        died: t.defenderDied,
        selfDamage: t.selfDamage,
        selfLife,
        selfDied: t.selfDied,
      };
    });
  }, [result, snapshot]);

  const abilityBadge = (c: Character) => (
    <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[var(--wiki-muted)]">
      {ABILITY_IDS.map((id) => (
        <span key={id} title={ABILITIES[id].label}>
          {ABILITIES[id].icon} {c.abilities[id]}
        </span>
      ))}
    </span>
  );

  /** Qué Estados dispara esta ficha al golpear (fighters.ts appliesOf()), o nada si no lleva ninguna Característica que aplique uno. */
  const appliesLine = (ids: readonly string[]) => {
    if (ids.length === 0) return null;
    const labels = ids
      .map((id) => effects.find((e) => e.id === id))
      .filter((e): e is Effect => e !== undefined)
      .map((e) => `${e.icon} ${e.label}`);
    return (
      <p className="mt-1 text-xs text-[var(--wiki-muted)]">
        Dispara: <span className="text-[var(--wiki-text)]">{labels.join(" · ")}</span>
      </p>
    );
  };

  const fichaSelector = (
    value: string,
    onChange: (id: string) => void,
    sideLabel: string,
  ) => (
    <div className="flex flex-col gap-1">
      <span className={label}>{sideLabel}</span>
      <select className={select} value={value} onChange={(e) => onChange(e.target.value)}>
        {races.map((race) => (
          <optgroup key={race} label={race}>
            {characters
              .filter((c) => c.race === race)
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {fichaOption(c)}
                </option>
              ))}
          </optgroup>
        ))}
      </select>
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="mb-1 text-2xl font-bold text-[var(--wiki-text)]">Motor de combate</h1>
      <p className="mb-3 max-w-3xl text-sm text-[var(--wiki-muted)]">
        La tirada oculta del{" "}
        <Link href="/docs/v3/game-design" className="text-[var(--wiki-accent)] hover:underline">
          §4
        </Link>{" "}
        y el golpe entero, ya con fichas <b className="text-[var(--wiki-text)]">reales</b> de{" "}
        <Link href="/docs/v3/razas/roster" className="text-[var(--wiki-accent)] hover:underline">
          el roster
        </Link>
        , no estadísticas inventadas. <b className="text-[var(--wiki-text)]">Un contra uno</b>, a
        propósito: un bando de cuatro es una composición que todavía no decide nadie —eso es el
        módulo «baraja»—, y el 1 contra 1 es el caso que hay que ver primero.
      </p>
      <p className="mb-5 max-w-3xl rounded-lg border border-[var(--wiki-border)] bg-[var(--wiki-surface)] p-3 text-sm text-[var(--wiki-muted)]">
        Las cinco Habilidades de escalón (
        {["defensa", "resistencia-magica", "precision", "suerte", "iniciativa"].map((id) =>
          ABILITIES[id as keyof typeof ABILITIES].icon,
        ).join(" ")}
        ) siguen en su valor por defecto «normal», igual que en el roster: no está decidido ficha a
        ficha todavía. Lo que sí dispara cada ficha sale solo de lo que ya lleva en razas.md —quien
        no tenga ninguna Característica de las nueve de{" "}
        <Link href="/docs/v3/sistemas/effects" className="text-[var(--wiki-accent)] hover:underline">
          effects.md
        </Link>{" "}
        sigue sin aplicar nada.
      </p>

      <div className="mb-4 flex flex-wrap gap-6">
        {fichaSelector(ownId, setOwnId, "Tu ficha")}
        {fichaSelector(enemyId, setEnemyId, "Enemigo")}
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <div className={card}>
          <div className="mb-1 flex items-center gap-1.5 font-medium text-[var(--wiki-text)]">
            {ownCharacter.name}
            {ownCharacter.tier !== undefined && <RarityChip level={rarityForTier(ownCharacter.tier)} />}
          </div>
          {abilityBadge(ownCharacter)}
          {appliesLine(ownApplies)}
        </div>
        <div className={card}>
          <div className="mb-1 flex items-center gap-1.5 font-medium text-[var(--wiki-text)]">
            {enemyCharacter.name}
            {enemyCharacter.tier !== undefined && <RarityChip level={rarityForTier(enemyCharacter.tier)} />}
          </div>
          {abilityBadge(enemyCharacter)}
          {appliesLine(enemyApplies)}
        </div>
      </div>

      <div className={`arena ${card} mb-4`}>
        <ArenaBoard arena={arena} pieces={pieces} />
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <Button onClick={runOne}>
          <i className="pi pi-bolt mr-1.5" />
          Un combate
        </Button>
        <Button onClick={runSweep} variant="ghost">
          <i className="pi pi-refresh mr-1.5" />
          {SWEEP_SIZE.toLocaleString("es")} combates
        </Button>
      </div>

      {result && snapshot && (
        <div className={`${card} mb-4 overflow-x-auto`}>
          <p className="mb-2 text-sm text-[var(--wiki-text)]">
            <b>
              {result.winner === "empate"
                ? "Empate"
                : result.winner === "propio"
                  ? `Gana ${snapshot.own.name}`
                  : `Gana ${snapshot.enemy.name}`}
            </b>{" "}
            en {result.rounds} {result.rounds === 1 ? "ronda" : "rondas"} · {snapshot.own.name} contra{" "}
            {snapshot.enemy.name}
          </p>
          <table className="w-full min-w-[42rem] text-sm">
            <thead>
              <tr className="border-b border-[var(--wiki-border)] text-left text-xs uppercase tracking-wide text-[var(--wiki-muted)]">
                <th className="py-1.5 pr-3">Ronda</th>
                <th className="py-1.5 pr-3">Ficha</th>
                <th className="py-1.5 pr-3">Anduvo</th>
                <th className="py-1.5 pr-3">Tirada</th>
                <th className="py-1.5 pr-3">Daño</th>
                <th className="py-1.5 pr-3">❤️ del objetivo</th>
                <th className="py-1.5">Tic de Estado</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-[var(--wiki-border)] last:border-0">
                  <td className="py-1 pr-3 text-[var(--wiki-muted)]">{row.round}</td>
                  <td className="py-1 pr-3 text-[var(--wiki-text)]" data-side={row.side}>
                    {row.actor}
                  </td>
                  <td className="py-1 pr-3 text-[var(--wiki-muted)]">{row.steps > 0 ? row.steps : "—"}</td>
                  <td className="py-1 pr-3 text-[var(--wiki-muted)]">
                    {row.hit ? `${row.hit.roll} · ${resultLabel(row.hit.result)}` : "—"}
                  </td>
                  <td className="py-1 pr-3 text-[var(--wiki-muted)]">{row.hit ? row.hit.damage : "—"}</td>
                  <td className="py-1 pr-3 text-[var(--wiki-muted)]">
                    {row.targetName
                      ? `${row.targetName}: ${row.targetLife}${row.died ? " · cae" : ""}`
                      : "—"}
                  </td>
                  <td className="py-1 text-[var(--wiki-muted)]">
                    {row.selfDamage > 0
                      ? `${row.actor}: -${row.selfDamage} → ${row.selfLife}${row.selfDied ? " · cae" : ""}`
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {sweep && (
        <div className={`${card} mb-4 text-sm`}>
          <p className="mb-1 font-medium text-[var(--wiki-text)]">
            {sweep.n.toLocaleString("es")} combates, {ownCharacter.name} contra {enemyCharacter.name}
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-[var(--wiki-text)]">
            <span>
              gana {ownCharacter.name}: <b>{((sweep.winsOwn / sweep.n) * 100).toFixed(1)}%</b>
            </span>
            <span>
              gana {enemyCharacter.name}: <b>{((sweep.winsEnemy / sweep.n) * 100).toFixed(1)}%</b>
            </span>
            {sweep.draws > 0 && (
              <span>
                empate: <b>{((sweep.draws / sweep.n) * 100).toFixed(1)}%</b>
              </span>
            )}
            <span>
              rondas de media: <b>{sweep.avgRounds.toFixed(1)}</b>
            </span>
          </div>
          {(sweep.winsOwn / sweep.n < 0.05 ||
            sweep.winsOwn / sweep.n > 0.95) && (
            <p className="mt-2 text-[var(--wiki-danger)]">
              <i className="pi pi-exclamation-triangle mr-1.5" />
              Un bando gana casi siempre: con las mismas Habilidades de escalón por defecto para las
              132 fichas, esto puede ser el ⚔️/❤️ real de la raza hablando, no un fallo del motor.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
