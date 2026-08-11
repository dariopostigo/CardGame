"use client";

// =========================================================================
// Laboratorio de MOVIMIENTO Y VISIÓN — /dev/movement
//
// Banco de pruebas de lib/rules/movement.ts y lib/rules/vision.ts: 1-4
// héroes co-op (characters/heroes.md §4) empiezan en la entrada del tablero
// de /dev/board y se mueven a golpe de clic, cada uno con su propio turno
// dentro de una RONDA de mesa (game-design.md §6c.1: la ronda —todos han
// jugado— es lo que hace avanzar el reloj de Amenaza en la partida real, no
// el turno suelto de un héroe). Lo que se prueba aquí es si el alcance con
// coste de terreno y los dos radios de visión (docs/game-design.md §2.2,
// §2.3) se sienten bien, no si el tablero se genera bien —eso ya lo prueba
// /dev/board— ni el combate ni la activación de enemigos (§4b.5,
// /dev/combate, todavía sin motor). Tampoco modela Oteo/Acción: no lo hacía
// para un solo héroe y este paso no amplía ese alcance, solo multiplica el
// que ya había.
//
// La niebla es COMPARTIDA por el equipo (decidido): un solo tablero
// revelado, plegando el radio de cada héroe sobre él según su propio mod de
// Sabiduría — no una copia por héroe.
//
// Toda la regla vive en el motor: el laboratorio solo pide un tablero, pide
// alcance y visión, y pinta lo que le devuelven.
// =========================================================================

import { useMemo, useState, type ChangeEvent } from "react";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { SelectButton } from "primereact/selectbutton";
import * as Hex from "@/lib/rules/hex";
import type { HexCoord, HexKey } from "@/lib/rules/hex";
import { generateBoard } from "@/lib/rules/board-gen";
import { abilityMod, HERO_CLASS_IDS, HERO_ROSTER } from "@/lib/rules/hero-roster";
import type { Board, Hero, HeroClassId, Hex as HexCell } from "@/lib/rules/state";
import { TERRAINS, TERRAIN_IDS } from "@/lib/rules/terrain";
import { MOVE_BASE, movePointsForTurn, reachableHexes, type ReachableInfo } from "@/lib/rules/movement";
import { revealFromPosition, visionRadii } from "@/lib/rules/vision";
import HexBoard, { type HeroMarker } from "@/components/game/board/HexBoard";
import CombatantDrawer, { type CombatantDrawerSubject } from "@/components/game/board/CombatantDrawer";
import { TOKEN_ART } from "@/components/game/board/piece-art";
import type { PawnId } from "@/components/game/board/piece-art";
import { buttonClass } from "@/components/ui/Button";

const INITIAL_SEED = "sendero-1";

/** Tope de jugadores del co-op (characters/heroes.md §4). */
const PLAYER_COUNT_OPTIONS = [1, 2, 3, 4] as const;

/** Color por puesto en la mesa, no por clase (piece-art.tsx, styles/settings/_colors.scss). */
const HERO_PIECE_IDS: readonly PawnId[] = ["heroe-1", "heroe-2", "heroe-3", "heroe-4"];

type Modifiers = { slowed: boolean; cursedWeight: boolean };

/**
 * Los dos modificadores negativos que cita game-design.md §2.2 como el caso
 * que justifica el suelo: Ralentizado (effects.md) + Peso maldito
 * (cards/curses.md) suman 0 sin él. Un solo modificador nunca lo demuestra
 * —2 − 1 ya da 1 sin necesidad de suelo—, hacen falta los dos a la vez.
 * Es un interruptor único y compartido, para demostrar el suelo: no lleva la
 * cuenta de quién está maldito, aplica al presupuesto de quien tenga el turno.
 */
function modifierValues(m: Modifiers): number[] {
  const out: number[] = [];
  if (m.slowed) out.push(-1);
  if (m.cursedWeight) out.push(-1);
  return out;
}

export default function MovementLab() {
  const [seed, setSeed] = useState(INITIAL_SEED);
  const [players, setPlayers] = useState<HeroClassId[]>([HERO_CLASS_IDS[0]]);
  const [modifiers, setModifiers] = useState<Modifiers>({ slowed: false, cursedWeight: false });

  const { board } = useMemo(
    () => generateBoard({ seed, tileCount: 12, tokenDensity: 0.17, sprawl: 2 }),
    [seed],
  );

  function setPlayerCount(n: number) {
    setPlayers((prev) => {
      if (n <= prev.length) return prev.slice(0, n);
      const grown = [...prev];
      while (grown.length < n) grown.push(HERO_CLASS_IDS[grown.length % HERO_CLASS_IDS.length]);
      return grown;
    });
  }

  function setPlayerClass(index: number, classId: HeroClassId) {
    setPlayers((prev) => prev.map((c, i) => (i === index ? classId : c)));
  }

  const btn = (active: boolean) => buttonClass({ active });
  const label = "text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]";

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-[var(--wiki-text)]">Movimiento y visión</h1>
      <p className="mb-5 max-w-3xl text-sm text-[var(--wiki-muted)]">
        Cada héroe tiene <b>2 puntos de movimiento por turno</b>, sin variación por raza (
        <code>docs/game-design.md</code> §2.2). 1 punto cruza 1 hexágono de Llanura o
        Camino; el Pantano cuesta 2 y la Montaña 3 —transitable, pero muy cara sin
        movimiento extra—. El <b>Camino da +1 al pool</b> la primera vez que se pisa ese
        turno: no se acumula por cruzar varios tramos seguidos.
      </p>
      <p className="mb-5 max-w-3xl text-sm text-[var(--wiki-muted)]">
        La niebla tiene <b>dos capas</b>: visión de <b>terreno</b> (la silueta del mapa) y
        de <b>detalle</b> (las fichas), <code>2 + mod SAB</code> la de detalle y esa
        misma +2 la de terreno (§2.3). El Bosque y la Mazmorra ciegan al héroe que está
        de pie en ellos; la Montaña corta la línea de visión del todo. Una vez revelado,
        un hexágono se queda revelado para <b>todo el equipo</b> — la niebla es
        acumulativa, permanente y compartida, no vuelve a cerrarse ni es distinta para
        cada héroe.
      </p>

      {/* Controles de partida: semilla o roster nuevos empiezan de cero (niebla,
          ronda y posición). 1-4 jugadores, cada uno con su propia clase — repetir
          clase está permitido (characters/heroes.md §4). */}
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

        <div className="flex flex-col gap-1" title="1-4 héroes co-op, todos entran por la misma casilla.">
          <span className={label}>Jugadores</span>
          <SelectButton
            value={players.length}
            onChange={(e) => e.value != null && setPlayerCount(e.value)}
            options={[...PLAYER_COUNT_OPTIONS]}
            allowEmpty={false}
          />
        </div>

        {players.map((classId, i) => (
          <div
            key={i}
            className="flex flex-col gap-1"
            title="Determina los dos radios de visión: 2 + mod SAB de detalle (mínimo 1), esa cifra + 2 de terreno (mínimo 2)."
          >
            <span className={label}>Héroe {i + 1}</span>
            <SelectButton
              value={classId}
              onChange={(e) => e.value != null && setPlayerClass(i, e.value)}
              options={HERO_CLASS_IDS.map((id) => ({ label: HERO_ROSTER[id].label, id }))}
              optionLabel="label"
              optionValue="id"
              allowEmpty={false}
            />
          </div>
        ))}

        <div
          className="flex flex-col gap-1"
          title="Se suman al pool base de 2 al terminar turno, no a mitad de uno en curso. Actívalos los dos a la vez para ver el suelo de 1 hexágono (§2.2) atrapar la suma antes de llegar a 0."
        >
          <span className={label}>Modificadores del próximo turno</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <InputSwitch
                inputId="movement-slowed"
                checked={modifiers.slowed}
                onChange={(e) => setModifiers((m) => ({ ...m, slowed: Boolean(e.value) }))}
              />
              <label htmlFor="movement-slowed" className="cursor-pointer text-sm text-[var(--wiki-text)]">
                Ralentizado (−1)
              </label>
            </div>
            <div className="flex items-center gap-2">
              <InputSwitch
                inputId="movement-cursed-weight"
                checked={modifiers.cursedWeight}
                onChange={(e) => setModifiers((m) => ({ ...m, cursedWeight: Boolean(e.value) }))}
              />
              <label
                htmlFor="movement-cursed-weight"
                className="cursor-pointer text-sm text-[var(--wiki-text)]"
              >
                Peso maldito (−1)
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* La sesión de partida: clave en semilla+roster para que cambiar cualquiera de
          las dos reinicie posición, niebla y ronda sin arrastrar estado de la sesión
          anterior. */}
      <MovementSession
        key={`${seed}:${players.join(",")}`}
        board={board}
        players={players}
        modifiers={modifiers}
      />
    </div>
  );
}

type HeroSession = {
  readonly hero: Hero;
  readonly pointsLeft: number;
  readonly roadBonusUsed: boolean;
};

function buildHeroSessions(players: readonly HeroClassId[], entrance: HexCoord, budget: number): HeroSession[] {
  return players.map((classId, i) => {
    const def = HERO_ROSTER[classId];
    return {
      hero: {
        id: `h${i}`,
        classId,
        abilityScores: def.abilityScores,
        pv: { current: def.pvMax, max: def.pvMax },
        position: entrance,
      },
      pointsLeft: budget,
      roadBonusUsed: false,
    };
  });
}

type SessionProps = {
  board: Board;
  players: readonly HeroClassId[];
  modifiers: Modifiers;
};

function MovementSession({ board, players, modifiers }: SessionProps) {
  const turnBudget = movePointsForTurn(MOVE_BASE, modifierValues(modifiers));

  const [round, setRound] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);
  const [heroes, setHeroes] = useState<HeroSession[]>(() =>
    buildHeroSessions(players, board.entrance, turnBudget),
  );
  const [revealedBoard, setRevealedBoard] = useState<Board>(() => {
    let revealed = board;
    for (const session of buildHeroSessions(players, board.entrance, turnBudget)) {
      revealed = revealFromPosition(revealed, session.hero.position, abilityMod(session.hero.abilityScores.sabiduria));
    }
    return revealed;
  });
  // Qué casilla está seleccionada: CUALQUIER ficha se puede seleccionar para
  // inspeccionarla (panel de abajo), pero el alcance de movimiento solo
  // aparece cuando la seleccionada es la del héroe con el turno activo —
  // seleccionar no es lo mismo que "quiero moverme", es "quiero mirar esto".
  const [selected, setSelected] = useState<HexCoord | null>(null);

  const active = heroes[activeIndex];
  const activeSabMod = abilityMod(active.hero.abilityScores.sabiduria);
  const activeSelected = selected !== null && Hex.equals(selected, active.hero.position);

  const reachable = useMemo(
    () =>
      activeSelected
        ? reachableHexes(revealedBoard, active.hero.position, active.pointsLeft, !active.roadBonusUsed)
        : new Map<HexKey, ReachableInfo>(),
    [activeSelected, revealedBoard, active.hero.position, active.pointsLeft, active.roadBonusUsed],
  );
  // El propio hexágono del héroe activo entra en `reachable` (coste 0,
  // quedarte donde estás) pero resaltarlo confundiría con "aquí puedes ir":
  // ya lo marca su ficha. Se excluye solo del resalte, no de la lógica de clic.
  const reachableHighlight = useMemo(() => {
    if (!activeSelected) return new Set<HexKey>();
    const activeKey = Hex.key(active.hero.position);
    return new Set([...reachable.keys()].filter((k) => k !== activeKey));
  }, [activeSelected, reachable, active.hero.position]);

  const activeTerrain = revealedBoard.hexes.get(Hex.key(active.hero.position))!.terrain;
  const radii = visionRadii(activeSabMod, activeTerrain);
  const selectedCell = selected ? revealedBoard.hexes.get(Hex.key(selected)) : undefined;
  const heroesAtSelected = selected
    ? heroes
        .map((session, index) => ({ session, index }))
        .filter(({ session }) => Hex.equals(session.hero.position, selected))
    : [];

  // Ficha a enseñar en el panel lateral: el primer héroe en la casilla
  // seleccionada, si hay alguno (co-op: varios pueden compartir hexágono al
  // arrancar en la entrada — SelectionPanel de abajo sigue listándolos a
  // todos cuando son más de uno). Sin equipo en este lab, así que no hay
  // CA ni ataque que mostrar — el panel los omite si no vienen informados.
  const firstHeroAtSelected = heroesAtSelected[0];
  const drawerSubject: CombatantDrawerSubject | null = firstHeroAtSelected
    ? {
        piece: { family: "pawn", id: HERO_PIECE_IDS[firstHeroAtSelected.index] },
        title: `Héroe ${firstHeroAtSelected.index + 1}`,
        subtitle: HERO_ROSTER[firstHeroAtSelected.session.hero.classId].label,
        abilityScores: HERO_ROSTER[firstHeroAtSelected.session.hero.classId].abilityScores,
        pv: firstHeroAtSelected.session.hero.pv,
        effects: [],
      }
    : null;

  const heroMarkers: HeroMarker[] = heroes.map((session, i) => ({
    id: session.hero.id,
    position: session.hero.position,
    pieceId: HERO_PIECE_IDS[i],
    label: `Héroe ${i + 1} — ${HERO_ROSTER[session.hero.classId].label} (${session.hero.pv.current}/${session.hero.pv.max} PV)`,
  }));

  function handleHexClick(hex: HexCell) {
    // Con el héroe activo ya seleccionado, clicar una casilla a su alcance
    // MUEVE en vez de reseleccionar: ahí es donde "seleccionar" se convierte
    // en "actuar". Su propia casilla no cuenta como destino, solo como toggle
    // de selección (rama de abajo).
    if (activeSelected && !Hex.equals(hex.coord, active.hero.position)) {
      const step = reachable.get(Hex.key(hex.coord));
      if (step !== undefined) {
        setHeroes((prev) =>
          prev.map((session, i) =>
            i === activeIndex
              ? {
                  hero: { ...session.hero, position: hex.coord },
                  pointsLeft: step.pointsLeft,
                  roadBonusUsed: step.roadBonusUsed,
                }
              : session,
          ),
        );
        setRevealedBoard((prev) => revealFromPosition(prev, hex.coord, activeSabMod));
        setSelected(hex.coord); // el héroe activo sigue seleccionado en su nueva casilla
        return;
      }
    }

    // Cualquier otra casilla —cualquier ficha, terreno vacío, o la del héroe
    // activo sin alcance que ofrecer— se selecciona para inspeccionarla;
    // clicar la ya seleccionada la deselecciona.
    setSelected((prev) => (prev && Hex.equals(prev, hex.coord) ? null : hex.coord));
  }

  function endTurn() {
    const next = (activeIndex + 1) % heroes.length;
    setHeroes((prev) =>
      prev.map((session, i) => (i === next ? { ...session, pointsLeft: turnBudget, roadBonusUsed: false } : session)),
    );
    setActiveIndex(next);
    if (next === 0) setRound((r) => r + 1);
    setSelected(null);
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-[var(--wiki-text)]">
        <span title="Sube cuando todos los héroes presentes han jugado su turno (game-design.md §6c.1) — en la partida real es lo que mueve el reloj de Amenaza.">
          <b>Ronda:</b> {round}
        </span>
        <span>
          <b>Turno de:</b> Héroe {activeIndex + 1} ({HERO_ROSTER[active.hero.classId].label})
        </span>
        <span title="Se recarga a este valor al empezar turno; el suelo de 1 hexágono (§2.2) ya está aplicado.">
          <b>Movimiento:</b> {active.pointsLeft} de {turnBudget}
        </span>
        <span title="Fichas, enemigos y localizaciones: 2 + mod SAB, mínimo 1, con el modificador del terreno donde estás de pie.">
          <b>Visión de detalle:</b> {radii.detail} hexágonos
        </span>
        <span title="Solo la silueta del terreno: visión de detalle + 2, mínimo 2.">
          <b>Visión de terreno:</b> {radii.terrain} hexágonos
        </span>
        <button className={buttonClass({ variant: "primary" })} onClick={endTurn}>
          Terminar turno
        </button>
      </div>

      {heroes.length > 1 && (
        <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--wiki-muted)]">
          {heroes.map((session, i) => (
            <span key={session.hero.id} className={i === activeIndex ? "font-semibold text-[var(--wiki-text)]" : ""}>
              Héroe {i + 1} ({HERO_ROSTER[session.hero.classId].label}): {session.hero.pv.current}/{session.hero.pv.max} PV
            </span>
          ))}
        </div>
      )}

      <p className="mb-3 max-w-3xl text-sm text-[var(--wiki-muted)]">
        Clica <b>cualquier ficha</b> (o casilla vacía) para inspeccionarla: qué terreno es,
        qué se sabe de ella todavía según la niebla, o qué tipo de ficha hay. Clica{" "}
        <b>la del héroe con el turno activo</b> para ver hasta dónde llega este turno —el
        tinte de abajo— y muévelo con un segundo clic sobre una casilla alcanzable; se
        queda seleccionado para encadenar movimientos sin volver a clicarlo. Las fichas de
        los demás héroes se pueden inspeccionar, pero no mover hasta que sea su turno.
      </p>

      <div className="board rounded-lg border border-[var(--wiki-border)] bg-[var(--wiki-surface)] p-3">
        <HexBoard
          board={revealedBoard}
          revealAll={false}
          heroes={heroMarkers}
          selected={selected}
          reachable={reachableHighlight}
          onHexClick={handleHexClick}
        />

        <div className="board__legend">
          {TERRAIN_IDS.map((id) => (
            <span
              key={id}
              className="board__legend-item"
              title={`Visión del héroe de pie ahí: ${signed(TERRAINS[id].heroVisionMod)}`}
            >
              <span className="board__swatch" data-terrain={id} />
              {TERRAINS[id].label} · coste {TERRAINS[id].moveCost}
            </span>
          ))}
        </div>
      </div>

      {selectedCell && (
        <SelectionPanel cell={selectedCell} heroesHere={heroesAtSelected} activeIndex={activeIndex} />
      )}

      <CombatantDrawer subject={drawerSubject} onClose={() => setSelected(null)} />
    </>
  );
}

/** Panel de la casilla seleccionada: terreno + ficha + héroes presentes, respetando la niebla. */
function SelectionPanel({
  cell,
  heroesHere,
  activeIndex,
}: {
  cell: HexCell;
  heroesHere: readonly { session: HeroSession; index: number }[];
  activeIndex: number;
}) {
  const terrainKnown = cell.terrainRevealed;
  const contentKnown = cell.contentRevealed;
  const def = terrainKnown ? TERRAINS[cell.terrain] : null;

  return (
    <div className="mt-4 rounded-lg border border-[var(--wiki-border)] bg-[var(--wiki-surface)] p-3 text-sm">
      <div className="mb-1 font-semibold text-[var(--wiki-text)]">
        Hexágono {cell.coord.q},{cell.coord.r}
        {def && ` — ${def.label}`}
        {cell.isEntrance && terrainKnown && " · Entrada"}
      </div>

      {/* Con un solo héroe en la casilla, su ficha completa ya sale en el
          panel lateral (CombatantDrawer); esta lista solo hace falta cuando
          comparten hexágono varios héroes (co-op) y hay más de uno que ver. */}
      {heroesHere.length > 1 && (
        <ul className="mb-1 grid gap-0.5 text-[var(--wiki-text)]">
          {heroesHere.map(({ session, index }) => (
            <li key={session.hero.id}>
              <b>Héroe {index + 1}</b> ({HERO_ROSTER[session.hero.classId].label}) —{" "}
              {session.hero.pv.current}/{session.hero.pv.max} PV
              {index === activeIndex && " · turno activo"}
            </li>
          ))}
        </ul>
      )}

      {!def ? (
        <p className="text-[var(--wiki-muted)]">
          Sin explorar: está fuera de tu visión de terreno, todavía no conoces ni la
          silueta.
        </p>
      ) : (
        <ul className="grid gap-0.5 text-[var(--wiki-muted)]">
          <li>Coste de movimiento: {def.moveCost}</li>
          {def.blocksLineOfSight && <li>Bloquea la línea de visión</li>}
          {def.allowsAmbush && <li>Emboscada y cobertura</li>}
          {def.safeToCamp && <li>Seguro para acampar</li>}
          {def.hazard && (
            <li>
              Peligro al cruzar: salvación {def.hazard.save} CD {def.hazard.cd} o{" "}
              {def.hazard.effect}
            </li>
          )}

          {!contentKnown ? (
            <li>
              Puede haber una ficha aquí, pero está fuera de tu visión de detalle: hace
              falta acercarse para distinguirla.
            </li>
          ) : cell.token ? (
            <li>
              <b>{TOKEN_ART[cell.token].label}</b>
              {cell.token === "enemigo" && (
                <>
                  {" "}
                  — todavía sin ficha de combate propia (fuerza, habilidades, nivel de
                  amenaza): eso llega con el motor de combate (<code>/dev/combate</code>,
                  hoy planificado).
                </>
              )}
            </li>
          ) : (
            <li>No hay ninguna ficha en este hexágono.</li>
          )}
        </ul>
      )}
    </div>
  );
}

/** Semilla legible al azar. Es una elección de UI, no una regla: aquí sí vale Math.random. */
function randomSeed(): string {
  return Math.random().toString(36).slice(2, 8);
}

function signed(n: number): string {
  return n === 0 ? "sin cambio" : n > 0 ? `+${n}` : `${n}`;
}
