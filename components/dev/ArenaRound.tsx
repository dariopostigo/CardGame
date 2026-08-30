"use client";

// =========================================================================
// La ronda en pantalla (presentacional)
//
// El §4 dice que las fichas de los dos bandos van en UNA SOLA LISTA ordenada por
// ⚡ Iniciativa, entrelazada, y que con tres jugadores tiene hasta 30 entradas.
// El §8 deja pendiente justo lo que hay aquí: "cómo se enseña en pantalla una
// lista de hasta 30 entradas, cómo se distingue un encuentro con héroe de uno
// sin héroe, y cómo sabe cada jugador cuáles de esas fichas son suyas".
//
// Esto es el primer intento de contestarlo, y contesta lo tercero: cada entrada
// lleva el color de su bando y el nombre de su dueño, así que la lista se lee
// por bandas de color sin buscar. Lo que NO contesta todavía es cómo se ordena,
// porque ⚡ no tiene valores: el orden que se enseña es el sustituto de
// lib/v3/round.ts (alterna bandos) y se dice en la propia caja para que nadie
// lo confunda con la lista de verdad.
//
// SE PUEDE IR TURNO A TURNO, y no es un lujo de laboratorio: en un tablero donde
// una ficha puede quedarse sin salida (§5), el ORDEN decide quién pierde el
// turno, y eso solo se ve parándose en cada ficha. La cuenta de turnos perdidos
// va en la cabecera.
//
// No decide nada: todo sube por callback (ARCHITECTURE.md §6).
// =========================================================================

import { SelectButton } from "primereact/selectbutton";
import type { Side } from "@/lib/v3/arena";
import type { TurnLog } from "@/lib/v3/round";
import Button from "@/components/ui/Button";

/** Cómo se pinta una entrada de la lista. Lo resuelve quien tiene los rosters. */
export type RoundEntry = {
  readonly id: string;
  readonly side: Side;
  readonly icon: string;
  readonly name: string;
};

export type ArenaRoundProps = {
  round: number;
  /** El orden de esta ronda, ya resuelto a nombres. */
  entries: readonly RoundEntry[];
  /** A quién le toca ahora: índice dentro de `entries`. */
  cursor: number;
  /** Lo que ha pasado en esta ronda, en el orden en que pasó. */
  logs: readonly TurnLog[];
  /** Lo más cerca que están los dos bandos, o null si falta alguno. */
  frontGap: number | null;
  opening: Side;
  sideOptions: { value: Side; label: string }[];
  canPlay: boolean;
  onOpening: (side: Side) => void;
  onStep: () => void;
  onRound: () => void;
  onRewind: () => void;
  className?: string;
};

export default function ArenaRound({
  round,
  entries,
  cursor,
  logs,
  frontGap,
  opening,
  sideOptions,
  canPlay,
  onOpening,
  onStep,
  onRound,
  onRewind,
  className,
}: ArenaRoundProps) {
  const muted = "text-[var(--wiki-muted)]";
  const strong = "text-[var(--wiki-text)]";

  // Lo que hizo cada una, por id, para poder pintarlo al lado de su nombre.
  const done = new Map(logs.map((l) => [l.id, l]));
  const lost = logs.filter((l) => l.held === "sin salida").length;
  const attacks = logs.filter((l) => l.attacked).length;
  const moved = logs.filter((l) => l.steps > 0).length;
  // Tablas de verdad: nadie anduvo, nadie llegó a tiro y HAY dos bandos. Sin la
  // última condición, desplegar un bando solo dispararía el aviso del §10 —que
  // habla de los dos— por no tener enemigo al que ir.
  const bothSides =
    entries.some((e) => e.side === "propio") && entries.some((e) => e.side === "enemigo");
  const stalled = logs.length > 0 && moved === 0 && attacks === 0 && bothSides;

  return (
    <div className={className}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className={`font-semibold ${strong}`}>
            La ronda · {round === 0 ? "sin empezar" : `ronda ${round}`}
            {round > 0 && cursor < entries.length && (
              <span className={`ml-2 text-xs font-normal ${muted}`}>
                van {cursor} de {entries.length} turnos
              </span>
            )}
          </div>
          <p className={`mt-0.5 text-xs ${muted}`}>
            Cada ficha hace lo que le da su tipo de daño en la tabla del §1.1: el 🗡️ y el ✨ cruzan,
            el 🏹 espera quieto y solo se mueve cuando le llega alguien —dispara y retrocede, que es
            el bucle del §1.2—. Esto <b className={strong}>no resuelve ataques</b>: los apunta.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SelectButton
            value={opening}
            onChange={(e) => e.value && onOpening(e.value as Side)}
            options={sideOptions}
            optionLabel="label"
            optionValue="value"
            allowEmpty={false}
          />
          <Button size="sm" onClick={onStep} disabled={!canPlay} title="Una ficha, la de arriba de la lista.">
            <i className="pi pi-step-forward mr-1.5" />
            Turno
          </Button>
          <Button size="sm" onClick={onRound} disabled={!canPlay}>
            <i className="pi pi-play mr-1.5" />
            Ronda entera
          </Button>
          <Button size="sm" onClick={onRewind} disabled={round === 0}>
            Volver al despliegue
          </Button>
        </div>
      </div>

      {round > 0 && (
        <>
          <div className="mb-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-[var(--wiki-text)]">
            <span>
              se movieron <b>{moved}</b> de {logs.length}
            </span>
            <span
              className={lost > 0 ? "text-[var(--wiki-danger)]" : undefined}
              title="Fichas a las que les tocó el turno sin tener a dónde ir: encerradas entre las suyas y el borde (§5). Quién pierde el turno depende del ORDEN, y el orden es lo que el §4 saca de ⚡ Iniciativa."
            >
              perdieron el turno <b>{lost}</b>
            </span>
            <span>
              ataques apuntados <b>{attacks}</b>
            </span>
            {frontGap !== null && (
              <span>
                lo más cerca que están los dos bandos: <b>{frontGap}</b>
              </span>
            )}
          </div>

          {stalled && (
            <p className="mb-2 text-sm text-[var(--wiki-danger)]">
              <i className="pi pi-exclamation-triangle mr-1.5" />
              <b>Nadie se ha movido y nadie ha llegado a tiro.</b>{" "}
              <span className={muted}>
                Es el primer riesgo del §10 en pantalla: si a los dos bandos les conviene esperar,
                la batalla no empieza. Pasa en cuanto ningún bando tiene fichas que crucen —el 🏹 no
                avanza por doctrina (§1.1)— y no lo arregla el tablero: pide un reloj o una
                recompensa por avanzar (§8).
              </span>
            </p>
          )}
        </>
      )}

      {/* La lista. Es la del §4 con una salvedad escrita: el orden todavía no es
          el de ⚡ Iniciativa, porque ⚡ no tiene valores. */}
      <div className={`mb-1 text-xs ${muted}`}>
        {entries.length} turnos ·{" "}
        <b className={strong}>el orden alterna bandos</b>, que es el sustituto de la lista de ⚡
        Iniciativa del §4 mientras las 8 Habilidades no tengan números
      </div>
      <ol className="arena__turnlist">
        {entries.map((entry, i) => {
          const log = done.get(entry.id);
          const isNow = round > 0 && i === cursor;
          return (
            <li
              key={entry.id}
              className="arena__turn"
              data-side={entry.side}
              data-now={isNow ? "true" : undefined}
              data-done={log && i < cursor ? "true" : undefined}
            >
              <span className="arena__turn-index">{i + 1}</span>
              <span className="arena__turn-name">
                {entry.icon} {entry.name}
              </span>
              <span className="arena__turn-what">
                {i >= cursor || !log
                  ? ""
                  : log.steps > 0
                    ? `anduvo ${log.steps}${log.attacked ? " · a tiro" : ""}`
                    : log.held === "sin salida"
                      ? "sin salida"
                      : `${log.held ?? "quieta"}${log.attacked ? " · a tiro" : ""}`}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
