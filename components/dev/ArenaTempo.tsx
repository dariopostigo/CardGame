"use client";

// =========================================================================
// El ritmo de la ronda, medido sobre la arena que hay en pantalla
//
// La comprobación que el tablero puede hacer HOY, sin una sola Habilidad: el
// §1.1 de battle.md declaró los tres alcances validados porque sobre 7×5 el 🏹
// abría en la ronda 1 y los otros dos entraban en la 2. Eso son distancias,
// alcances y 👢 Movimiento, así que se puede recalcular — y con el tamaño mínimo
// en 14×12 hay que recalcularlo.
//
// El mando de 👢 Movimiento existe porque ese valor NO está decidido (las 8
// Habilidades siguen sin números). Abre en 2 porque 2 es el único valor que hace
// verdadera la tabla del §1.1 sobre su propio tablero, así que es lo que el
// diseño llevaba dentro sin escribirlo (lib/v3/tempo.ts).
//
// Todo lo que se afirma aquí lo calcula lib/v3/tempo.ts: este componente no
// sabe qué forma tenía la tabla original, solo la enseña.
// =========================================================================

import { Slider, type SliderChangeEvent } from "primereact/slider";
import { DESIGNED_FRONT_DISTANCE, type Arena } from "@/lib/v3/arena";
import { DAMAGE_TYPES } from "@/lib/v3/damage";
import {
  IMPLIED_MOVEMENT,
  openingTempo,
  shapeWindow,
  tempoVerdict,
  type TempoVerdict,
} from "@/lib/v3/tempo";

/** El tope del mando. Doce hexágonos por turno ya es cruzar el campo mínimo. */
const MOVEMENT_MAX = 12;

export type ArenaTempoProps = {
  arena: Arena;
  movement: number;
  onMovementChange: (value: number) => void;
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
  const shape = shapeWindow(arena.frontDistance, MOVEMENT_MAX);
  const frontOff = arena.frontDistance !== DESIGNED_FRONT_DISTANCE;

  // Rondas en las que no pega nadie: las que hay antes de la primera. Es el
  // precio del tablero grande, y es el número que se nota jugando.
  const first = rows.reduce<number | null>(
    (min, r) => (r.round === null ? min : min === null ? r.round : Math.min(min, r.round)),
    null,
  );
  const walking = first === null ? null : first - 1;

  const muted = "text-[var(--wiki-muted)]";

  return (
    <div className={className}>
      <div className="mb-3 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div>
          <div className="font-semibold text-[var(--wiki-text)]">
            El ritmo de la ronda, medido sobre estas columnas
          </div>
          <p className={`mt-0.5 text-xs ${muted}`}>
            Cada ficha mueve hasta 👢 Movimiento y ataca en el mismo turno (§5), y avanza sola: el
            rival aguanta. Se mide desde la columna del frente; una ficha colocada más atrás suma
            su distancia, y eso se ve ficha a ficha en el despliegue.
          </p>
        </div>
        <div className="flex w-52 shrink-0 flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]">
            👢 Movimiento · {movement}
            {movement === IMPLIED_MOVEMENT && <span className="ml-1 opacity-70">implícito</span>}
          </span>
          <Slider
            value={movement}
            min={1}
            max={MOVEMENT_MAX}
            onChange={(e: SliderChangeEvent) =>
              typeof e.value === "number" && onMovementChange(e.value)
            }
          />
        </div>
      </div>

      <ul className="grid gap-1 text-sm">
        {rows.map((r) => {
          const t = DAMAGE_TYPES[r.id];
          return (
            <li key={r.id} className="flex flex-wrap items-baseline gap-x-2">
              <span className="w-44 shrink-0 text-[var(--wiki-text)]">
                {t.icon} {t.label} · {r.range}
              </span>
              <span className={muted}>
                a {r.distance} hexágonos del frente enemigo
                {r.advance === 0 ? (
                  <> y ya lo tiene a tiro</>
                ) : (
                  <>
                    , tiene que avanzar <b className="text-[var(--wiki-text)]">{r.advance}</b>
                  </>
                )}
                {" → pega en la "}
                <b className="text-[var(--wiki-text)]">
                  {r.round === null ? "nunca" : `ronda ${r.round}`}
                </b>
              </span>
            </li>
          );
        })}
      </ul>

      <div className="mt-3 border-t border-[var(--wiki-border)] pt-2 text-sm">
        <Verdict verdict={verdict} rows={rows} walking={walking} frontOff={frontOff} arena={arena} />

        <p className={`mt-2 text-xs ${muted}`}>
          Sobre {arena.frontDistance} hexágonos entre frentes, la forma del §1.1 —el 🏹 abriendo
          solo— se conserva con 👢 Movimiento{" "}
          <b className="text-[var(--wiki-text)]">{shape.length ? shape.join(", ") : "ninguno"}</b>
          {shape.length > 1 && (
            <> y se aplana con el resto. La lista tiene agujeros porque los tres alcances no
            redondean al mismo paso: no es un intervalo</>
          )}
          .
        </p>
      </div>
    </div>
  );
}

/** El veredicto, en una frase y con lo que arrastra. */
function Verdict({
  verdict,
  rows,
  walking,
  frontOff,
  arena,
}: {
  verdict: TempoVerdict;
  rows: ReturnType<typeof openingTempo>;
  walking: number | null;
  frontOff: boolean;
  arena: Arena;
}) {
  const ranged = rows.find((r) => r.id === "a-distancia")?.round;
  const rest = rows.filter((r) => r.id !== "a-distancia").map((r) => r.round);
  const danger = "text-[var(--wiki-danger)]";
  const strong = "text-[var(--wiki-text)]";

  if (verdict === "nunca") {
    return (
      <p className="text-[var(--wiki-muted)]">
        <i className={`pi pi-exclamation-triangle mr-1.5 ${danger}`} />
        Con 👢 Movimiento a 0 nadie llega: el alcance no da para cruzar y la batalla no empieza.
      </p>
    );
  }

  if (verdict === "identico") {
    return (
      <p className="text-[var(--wiki-muted)]">
        <i className="pi pi-check-circle mr-1.5 text-[var(--wiki-accent)]" />
        <b className={strong}>Sale la tabla del §1.1 tal cual</b>: el 🏹 abre en la ronda 1 y los
        otros dos entran en la 2.
      </p>
    );
  }

  if (verdict === "escalonado") {
    return (
      <p className="text-[var(--wiki-muted)]">
        <b className={strong}>La forma del §1.1 se conserva</b>: el 🏹 abre solo en la ronda{" "}
        {ranged} y el resto entra en la {Math.min(...(rest as number[]))}. El alcance sigue
        comprando ritmo, que es lo que el §4.3 le pide.
        {walking !== null && walking > 0 && (
          <>
            {" "}
            Lo que se paga son <b className={strong}>{walking}</b>{" "}
            {walking === 1 ? "ronda" : "rondas"} de acercamiento sin un solo ataque
            {frontOff && <> —el precio de {arena.frontDistance} hexágonos entre frentes—</>}.
          </>
        )}
      </p>
    );
  }

  return (
    <p className="text-[var(--wiki-muted)]">
      <i className={`pi pi-exclamation-triangle mr-1.5 ${danger}`} />
      <b className={strong}>El ritmo se aplana</b>: el 🏹 ya no abre solo, así que su alcance deja
      de comprar rondas y los tres tipos de daño empiezan a la vez. Es el otro fallo posible, y va
      en dirección contraria al de un tablero largo: aquí 👢 Movimiento se traga la diferencia entre
      1, 2 y 4 hexágonos de alcance.
    </p>
  );
}
