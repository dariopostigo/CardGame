"use client";

// =========================================================================
// El ritmo de la aproximación, medido sobre la arena que hay en pantalla
//
// La comprobación que el tablero puede hacer HOY, sin una sola Habilidad: son
// distancias, alcances y 👢 Movimiento.
//
// Lo que se mide cambió el 27 de agosto de 2026. Antes se comprobaba si salía la
// tabla del §1.1 —el 🏹 abriendo en la ronda 1— y ahora esa tabla no es el
// objetivo: **la aproximación larga es la intención**, así que aquí se enseña
// cuánto dura y quién entra en qué orden, sin veredicto de aprobado.
//
// La comprobación que SÍ tiene un aprobado y un suspenso es la otra, la del
// §1.2: si el que corre alcanza al que dispara. Ahí un "no llega nunca" es una
// partida que no se puede ganar, y por eso va en su propio bloque y se dice con
// el color de peligro.
//
// Los tres mandos de 👢 Movimiento existen porque esos valores NO están
// decididos: el reparto sí (🗡️ alto, 🏹 bajo), los números son insumo de Dario.
// Abren en LAB_MOVEMENT, que es el juego más pequeño que rompe el bucle.
//
// Todo lo que se afirma aquí lo calcula lib/v3/tempo.ts: este componente no
// decide nada.
// =========================================================================

import { Slider, type SliderChangeEvent } from "primereact/slider";
import type { Arena } from "@/lib/v3/arena";
import { DAMAGE_TYPES, DAMAGE_TYPE_IDS, type DamageTypeId } from "@/lib/v3/damage";
import {
  LAB_MOVEMENT,
  chaseAgainstArcher,
  openingTempo,
  tempoVerdict,
  type MovementByType,
  type TempoVerdict,
} from "@/lib/v3/tempo";

/** El tope del mando. Doce hexágonos por turno ya es cruzar medio campo. */
const MOVEMENT_MAX = 12;

const BAND_LABEL: Record<"alto" | "medio" | "bajo", string> = {
  alto: "el más alto",
  medio: "medio",
  bajo: "el más bajo",
};

export type ArenaTempoProps = {
  arena: Arena;
  movement: MovementByType;
  onMovementChange: (id: DamageTypeId, value: number) => void;
  className?: string;
};

export default function ArenaTempo({
  arena,
  movement,
  onMovementChange,
  className,
}: ArenaTempoProps) {
  const rows = openingTempo(arena.frontDistance, movement);
  const verdict = tempoVerdict(rows);
  const chases = chaseAgainstArcher(arena.frontDistance, movement);

  // Rondas de maniobra: las que hay antes del primer ataque de cualquiera. Ya
  // no es un precio, es la duración de la aproximación.
  const first = rows.reduce<number | null>(
    (min, r) => (r.round === null ? min : min === null ? r.round : Math.min(min, r.round)),
    null,
  );

  const muted = "text-[var(--wiki-muted)]";
  const strong = "text-[var(--wiki-text)]";
  const labelClass = "text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]";

  return (
    <div className={className}>
      <div className="mb-3">
        <div className={`font-semibold ${strong}`}>
          El ritmo de la aproximación, medido sobre estas columnas
        </div>
        <p className={`mt-0.5 text-xs ${muted}`}>
          Cada ficha mueve hasta 👢 Movimiento y ataca en el mismo turno (§5), y avanza sola: el
          rival aguanta. Se mide desde la columna del frente, a {arena.frontDistance} hexágonos; una
          ficha colocada más atrás suma su distancia, y eso se ve ficha a ficha en el despliegue.
        </p>
      </div>

      {/* Los tres mandos. Van juntos y en el orden del catálogo (alcance corto a
          largo) para que el reparto se lea de un vistazo: si el de arriba no es
          el más alto, el bucle del §1.2 vuelve. */}
      <div className="mb-4 grid gap-x-6 gap-y-3 sm:grid-cols-3">
        {DAMAGE_TYPE_IDS.map((id) => {
          const t = DAMAGE_TYPES[id];
          const isLab = movement[id] === LAB_MOVEMENT[id];
          return (
            <div key={id} className="flex flex-col gap-1">
              <span className={labelClass}>
                {t.icon} 👢 {movement[id]}
                <span className="ml-1 normal-case opacity-70">
                  ({BAND_LABEL[t.movementBand]}
                  {isLab && " · lab"})
                </span>
              </span>
              <Slider
                value={movement[id]}
                min={0}
                max={MOVEMENT_MAX}
                onChange={(e: SliderChangeEvent) =>
                  typeof e.value === "number" && onMovementChange(id, e.value)
                }
              />
            </div>
          );
        })}
      </div>

      <ul className="grid gap-1 text-sm">
        {rows.map((r) => {
          const t = DAMAGE_TYPES[r.id];
          return (
            <li key={r.id} className="flex flex-wrap items-baseline gap-x-2">
              <span className={`w-52 shrink-0 ${strong}`}>
                {t.icon} {t.label} · alcance {r.range} · 👢 {r.movement}
              </span>
              <span className={muted}>
                {r.advance === 0 ? (
                  <>ya tiene el frente a tiro</>
                ) : (
                  <>
                    tiene que avanzar <b className={strong}>{r.advance}</b>
                  </>
                )}
                {" → pega en la "}
                <b className={strong}>{r.round === null ? "nunca" : `ronda ${r.round}`}</b>
              </span>
            </li>
          );
        })}
      </ul>

      <div className="mt-3 border-t border-[var(--wiki-border)] pt-2 text-sm">
        <Shape verdict={verdict} rows={rows} first={first} />
      </div>

      {/* --- La caza (§1.2) --- */}
      <div className="mt-3 border-t border-[var(--wiki-border)] pt-2 text-sm">
        <div className={`mb-1 font-semibold ${strong}`}>El arquero que retrocede (§1.2)</div>
        <p className={`mb-2 text-xs ${muted}`}>
          El 🏹 juega el kiting puro: dispara si te tiene a tiro y retrocede siempre lo que le dan
          los pies, y le toca antes que a ti. Si no se le alcanza, no es un desequilibrio: es una
          partida que no se puede ganar.
        </p>
        <ul className="grid gap-1">
          {chases.map(({ id, result }) => {
            const t = DAMAGE_TYPES[id];
            return (
              <li key={id} className="flex flex-wrap items-baseline gap-x-2">
                <span className={`w-52 shrink-0 ${strong}`}>
                  {t.icon} persigue al 🏹 (👢 {movement["a-distancia"]})
                </span>
                {result.contact ? (
                  <span className={muted}>
                    lo alcanza en la <b className={strong}>ronda {result.round}</b> y come{" "}
                    <b className={strong}>{result.shots}</b>{" "}
                    {result.shots === 1 ? "disparo" : "disparos"} por el camino
                  </span>
                ) : (
                  <span className="text-[var(--wiki-danger)]">
                    <i className="pi pi-exclamation-triangle mr-1.5" />
                    no lo alcanza nunca
                    <span className={muted}>
                      {" "}
                      — no gana terreno ({result.closingPerRound} hexágonos por ronda), así que el
                      bucle es estable y en un tablero grande no hay borde que lo acorrale
                    </span>
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/** La forma del ritmo, en una frase. Sin aprobado: la aproximación es la idea. */
function Shape({
  verdict,
  rows,
  first,
}: {
  verdict: TempoVerdict;
  rows: ReturnType<typeof openingTempo>;
  first: number | null;
}) {
  const muted = "text-[var(--wiki-muted)]";
  const strong = "text-[var(--wiki-text)]";
  const ranged = rows.find((r) => r.id === "a-distancia")?.round;
  const rest = rows.filter((r) => r.id !== "a-distancia").map((r) => r.round);

  if (verdict === "nunca") {
    return (
      <p className={muted}>
        <i className="pi pi-exclamation-triangle mr-1.5 text-[var(--wiki-danger)]" />
        Con 👢 Movimiento a 0 esa ficha no llega: se queda mirando la batalla desde su columna.
      </p>
    );
  }

  const maniobra =
    first !== null && first > 1 ? (
      <>
        {" "}
        La aproximación dura <b className={strong}>{first - 1}</b>{" "}
        {first - 1 === 1 ? "ronda" : "rondas"} antes del primer golpe, y eso es lo que se busca
        (§1.1).
      </>
    ) : null;

  if (verdict === "escalonado") {
    return (
      <p className={muted}>
        <b className={strong}>El 🏹 abre solo</b> en la ronda {ranged} y el resto entra en la{" "}
        {Math.min(...(rest as number[]))}: el alcance compra rondas, que es lo que el §4.3 le pide.
        {maniobra}
      </p>
    );
  }

  return (
    <p className={muted}>
      <b className={strong}>Los tres entran casi a la vez</b>, así que el alcance ya no compra
      rondas — es lo normal en cuanto 👢 Movimiento se reparte por tipo de daño, y no es un fallo:
      el 🏹 bajó de pies a cambio de que nadie pueda quedarse fuera de su alcance, y su trabajo pasó
      a ser esperar quieto (§1.1).
      {maniobra}
    </p>
  );
}
