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
// Los tres mandos de 👢 Movimiento abren en la BANDA DECIDIDA —3 · 2 · 1, Dario,
// 31 de agosto de 2026— y siguen siendo mandos porque hay que poder ver qué pasa
// al moverlos: es lo que dejó claro que igualarlos rompe el juego.
//
// LA CAZA SE MIDE DOS VECES, y no es duplicar: en línea recta (tempo.ts `chase`)
// la presa solo puede huir hacia atrás, así que el borde la caza; sobre la arena
// (duel.ts `duel`) usa las filas y da la vuelta al campo. Las dos cuentas juntas
// son el argumento entero del §1.2, y enseñarlas separadas es lo que evita
// volver a concluir de más con la fácil.
//
// Todo lo que se afirma aquí lo calculan lib/v3/tempo.ts y lib/v3/duel.ts: este
// componente no decide nada.
// =========================================================================

import { Slider, type SliderChangeEvent } from "primereact/slider";
import { retreatRoom, type Arena } from "@/lib/v3/arena";
import { DAMAGE_TYPES, DAMAGE_TYPE_IDS, type DamageTypeId } from "@/lib/v3/damage";
import {
  MOVEMENT_BAND,
  chaseAgainstArcher,
  openingTempo,
  tempoVerdict,
  type MovementByType,
  type TempoVerdict,
} from "@/lib/v3/tempo";
import { duelsAgainstArcher, frontToFront, type RunnerPolicy } from "@/lib/v3/duel";

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
  // El sitio que tiene el 🏹 para retroceder sale de la arena, no del papel: sus
  // bandas van pegadas al borde (§1), así que espera con el borde a la espalda.
  const room = retreatRoom(arena.spec);
  const chases = chaseAgainstArcher(arena.frontDistance, movement, room);

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
          const isBand = movement[id] === MOVEMENT_BAND[id];
          return (
            <div key={id} className="flex flex-col gap-1">
              <span className={labelClass}>
                {t.icon} 👢 {movement[id]}
                <span className="ml-1 normal-case opacity-70">
                  ({BAND_LABEL[t.movementBand]}
                  {isBand && " · decidido"})
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
          El 🏹 juega el kiting puro: dispara si te tiene a tiro y retrocede lo que le dan los pies,
          y le toca antes que a ti. Si no se le alcanza, no es un desequilibrio: es una partida que
          no se puede ganar.
        </p>
        <p className={`mb-2 text-xs ${muted}`}>
          Pero <b className={strong}>el borde cuenta</b>: sus bandas van pegadas al borde (§1), así
          que solo tiene{" "}
          <b className={strong}>
            {room} {room === 1 ? "hexágono" : "hexágonos"}
          </b>{" "}
          para retroceder —la profundidad de su banda menos uno, y eso no cambia con el tamaño del
          tablero—. El bucle del §1.2 está escrito sin borde, y sin borde dice que al arquero no se
          le alcanza jamás.
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
                    {result.closingPerRound <= 0 && (
                      <>
                        {" "}
                        —y solo porque{" "}
                        <b className={strong}>lo acorrala el borde</b>: a campo abierto no gana
                        terreno ({result.closingPerRound} hexágonos por ronda) y no lo alcanzaría—
                      </>
                    )}
                  </span>
                ) : (
                  <span className="text-[var(--wiki-danger)]">
                    <i className="pi pi-exclamation-triangle mr-1.5" />
                    no lo alcanza
                    <span className={muted}>
                      {" "}
                      —{" "}
                      {movement[id] === 0
                        ? "con 👢 0 no se mueve, así que se queda en su columna mirando"
                        : `no gana terreno (${result.closingPerRound} hexágonos por ronda) y ni acorralado llega a tiempo`}
                    </span>
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* --- La misma caza, jugada en 2D sobre la arena (§1.2) --- */}
      <div className="mt-3 border-t border-[var(--wiki-border)] pt-2 text-sm">
        <div className={`mb-1 font-semibold ${strong}`}>Y lo mismo, jugado sobre esta arena</div>
        <p className={`mb-2 text-xs ${muted}`}>
          La cuenta de arriba es <b className={strong}>en línea recta</b>, y ahí huir es retroceder:
          por eso el borde caza. Aquí el duelo se juega en el tablero, 1 contra 1 y desde la columna
          del frente, así que la presa tiene las {arena.spec.rows} filas para correr de lado. Se
          miden dos presas, porque no dan lo mismo: la <b className={strong}>voraz</b> coge siempre
          el hexágono que más la aleja —es la que juega el tablero hoy— y acaba metiéndose en la
          esquina ella sola; la que <b className={strong}>conserva sitio</b> desempata alejándose del
          borde, y es el peor caso.
        </p>
        <ul className="grid gap-1">
          {(["voraz", "con-sitio"] as RunnerPolicy[]).map((policy) => (
            <li key={policy} className="flex flex-wrap items-baseline gap-x-2">
              <span className={`w-52 shrink-0 ${strong}`}>
                presa {policy === "voraz" ? "voraz" : "que conserva sitio"}
              </span>
              <span className={muted}>
                {duelsAgainstArcher(arena, frontToFront(arena), movement, { policy }).map(
                  ({ id, result }, i) => (
                    <span key={id}>
                      {i > 0 && " · "}
                      {DAMAGE_TYPES[id].icon}{" "}
                      {result.contact ? (
                        <>
                          <b className={strong}>ronda {result.round}</b>, {result.shots}{" "}
                          {result.shots === 1 ? "disparo" : "disparos"}
                        </>
                      ) : (
                        <b className="text-[var(--wiki-danger)]">no lo alcanza</b>
                      )}
                      {result.rowsUsed > 1 && (
                        <span className="opacity-70"> ({result.rowsUsed} filas)</span>
                      )}
                    </span>
                  ),
                )}
              </span>
            </li>
          ))}
        </ul>
        <p className={`mt-2 text-xs ${muted}`}>
          Con la banda decidida —🗡️ 3 · ✨ 2 · 🏹 1— las dos presas caen igual y el peaje es{" "}
          <b className={strong}>un disparo</b>. Igualando los tres mandos a 2 el bucle vuelve entero:{" "}
          <b className={strong}>16 rondas y 11 disparos</b> aquí, y peor cuanto más grande el campo.
          Es lo que hace que el reparto sea un requisito de la escala y no una preferencia.
        </p>
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
  const crossing = rows
    .filter((r) => r.id !== "a-distancia")
    .slice()
    .sort((a, b) => (a.round ?? 99) - (b.round ?? 99));
  const rest = crossing.map((r) => r.round);
  const soonest = Math.min(...(rest as number[]));

  /**
   * Los dos que cruzan, con su ronda. Se enumeran en vez de resumirse con el
   * mínimo: cuando no coinciden, "los dos entran en la 3" es falso para uno de
   * ellos, y la tabla de arriba lo delata.
   */
  const whoCrosses =
    crossing.length === 2 && crossing[0].round === crossing[1].round ? (
      <>
        el {DAMAGE_TYPES[crossing[0].id].icon} y el {DAMAGE_TYPES[crossing[1].id].icon} entran
        juntos en la ronda <b className={strong}>{crossing[0].round}</b>
      </>
    ) : (
      <>
        {crossing.map((r, i) => (
          <span key={r.id}>
            {i === 0 ? "el " : " y el "}
            {DAMAGE_TYPES[r.id].icon} {i === 0 ? "entra en la ronda " : "en la "}
            <b className={strong}>{r.round}</b>
          </span>
        ))}
      </>
    );

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
        <b className={strong}>El 🏹 abre solo</b> en la ronda {ranged}, y detrás {whoCrosses}: el
        alcance compra rondas, que es lo que el §4.3 le pide.
        {maniobra}
      </p>
    );
  }

  // Sin escalón no significa "todos a la vez": con el reparto del §1.1 lo normal
  // es que el 🗡️ y el ✨ entren juntos y el 🏹 llegue mucho después, porque es el
  // que tiene los pies cortos. Se dice con los números en la mano y no con una
  // frase hecha: la caja de al lado enseña la tabla, y las dos tienen que
  // contar lo mismo.
  const late = ranged !== null && ranged !== undefined && ranged > soonest;

  return (
    <p className={muted}>
      <b className={strong}>El 🏹 ya no abre</b>: {whoCrosses}
      {late ? (
        <>
          {" "}
          y él no llegaría hasta la <b className={strong}>{ranged}</b> si tuviera que cruzar
        </>
      ) : (
        <> , a la vez que él</>
      )}
      . No es un fallo: bajó de pies a cambio de que nadie se quede fuera de su alcance, y su
      trabajo pasó a ser <b className={strong}>esperar quieto</b> y castigar a quien cruce (§1.1) —
      así que esa ronda suya es la cuenta pesimista, la de un arquero que insiste en avanzar.
      {maniobra}
    </p>
  );
}
