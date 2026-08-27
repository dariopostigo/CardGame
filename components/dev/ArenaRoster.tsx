"use client";

// =========================================================================
// El bando y su despliegue (presentacional)
//
// El bando de battle.md §2 —de uno a tres jugadores, cada uno con su héroe y
// cuatro unidades— con lo único que el tablero necesita saber de cada ficha: su
// dueño, su tipo de daño y en qué hexágono está. Ni Habilidades, ni Vida, ni
// carta: eso no existe todavía y no se inventa aquí (lib/v3/deployment.ts).
//
// Se agrupa por jugador, y con un solo jugador el rótulo desaparece: la lista de
// cinco fichas de antes sigue siendo exactamente esta con players = 1.
//
// El panel es la mitad de tierra del despliegue y el tablero es la otra: aquí se
// elige QUIÉN se coloca y allí DÓNDE. Elegir una ficha es lo que pone el tablero
// en modo colocar, y por eso no hay un mando de "modo" —la selección ya lo dice—.
//
// Cada fila enseña la consecuencia de donde está puesta: en qué ronda pega desde
// ahí. Es lo que convierte el §3 —"colocar delante o detrás es una elección"— en
// algo que se puede ver antes de soltar la ficha.
//
// No decide nada: todo sube por callback (ARCHITECTURE.md §6).
// =========================================================================

import * as Hex from "@/lib/v3/hex";
import { DAMAGE_TYPES, DAMAGE_TYPE_IDS, type DamageTypeId } from "@/lib/v3/damage";
import { figureName, hexOf, type Deployment, type Roster } from "@/lib/v3/deployment";
import Button, { buttonClass } from "@/components/ui/Button";

export type ArenaRosterProps = {
  roster: Roster;
  deployment: Deployment;
  selectedId: string | null;
  /** En qué ronda pega esa ficha desde donde está, o null si no está puesta. */
  roundOf: (figureId: string) => number | null;
  onSelect: (figureId: string | null) => void;
  onDamage: (figureId: string, damage: DamageTypeId) => void;
  onLift: (figureId: string) => void;
  onAuto: () => void;
  onEmpty: () => void;
  /** El último "no" del motor, tal cual lo explicó. */
  refusal?: string | null;
  className?: string;
};

export default function ArenaRoster({
  roster,
  deployment,
  selectedId,
  roundOf,
  onSelect,
  onDamage,
  onLift,
  onAuto,
  onEmpty,
  refusal,
  className,
}: ArenaRosterProps) {
  const placed = deployment.length;

  // Las fichas se agrupan por jugador porque el bando es de uno a tres (§2), y
  // con un solo jugador el grupo no se rotula: no hay nada que distinguir.
  const owners = [...new Set(roster.map((f) => f.owner))];
  const groups = owners.map((owner) => ({
    owner,
    figures: roster.filter((f) => f.owner === owner),
  }));

  return (
    <div className={className}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="font-semibold text-[var(--wiki-text)]">
            El bando · {placed} de {roster.length} desplegadas
          </div>
          <p className="mt-0.5 text-xs text-[var(--wiki-muted)]">
            Elige una ficha y pulsa un hexágono de la banda. Sin ninguna elegida, el tablero vuelve
            a medir distancias.
            {groups.length > 1 && (
              <> La banda es del bando y no del jugador (§3): las {roster.length} fichas se reparten
              los mismos hexágonos.</>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={onAuto} title="Una colocación razonable: el 🗡️ delante haciendo pantalla, el alcance y el héroe detrás.">
            Colocar todas
          </Button>
          <Button size="sm" onClick={onEmpty} disabled={placed === 0}>
            Vaciar
          </Button>
        </div>
      </div>

      {groups.map(({ owner, figures }) => (
        <div key={owner} className={groups.length > 1 ? "mb-3 last:mb-0" : undefined}>
          {groups.length > 1 && (
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]">
              Jugador {owner}
            </div>
          )}
          <ul className="grid gap-1.5">
            {figures.map((figure) => {
              const hex = hexOf(deployment, figure.id);
              const cell = hex ? Hex.axialToOffset(hex) : null;
              const round = roundOf(figure.id);
              const isSelected = selectedId === figure.id;
              return (
                <li
                  key={figure.id}
                  className={[
                    "flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md border px-2 py-1.5",
                    isSelected
                      ? "border-[var(--wiki-accent)] bg-[var(--wiki-surface-2)]"
                      : "border-[var(--wiki-border)]",
                  ].join(" ")}
                >
                  {/* La ficha entera es el botón de elegir: el objetivo de clic
                      es la fila, no un punto de la fila. Vuelve a pulsarse para
                      soltarla. */}
                  <button
                    className="flex min-w-40 items-baseline gap-2 text-left"
                    onClick={() => onSelect(isSelected ? null : figure.id)}
                  >
                    <span className="text-[var(--wiki-text)]">
                      {figure.role === "heroe" ? "★" : "·"} {figure.label}
                    </span>
                    <span className="text-xs text-[var(--wiki-muted)]">
                      {cell ? `col ${cell.col}, fila ${cell.row}` : "sin colocar"}
                    </span>
                  </button>

                  {/* El tipo de daño se puede cambiar porque es lo único decidido
                      de una ficha, y es lo que hace que colocarla sea una
                      decisión. Con 👢 Movimiento repartido por tipo de daño
                      (§1.2), cambiarlo cambia también lo que corre. */}
                  <span className="flex gap-1">
                    {DAMAGE_TYPE_IDS.map((id) => (
                      <button
                        key={id}
                        className={buttonClass({ size: "sm", active: figure.damage === id })}
                        title={`${DAMAGE_TYPES[id].label} · alcance ${DAMAGE_TYPES[id].range}`}
                        onClick={() => onDamage(figure.id, id)}
                      >
                        {DAMAGE_TYPES[id].icon}
                      </button>
                    ))}
                  </span>

                  <span className="ml-auto flex items-center gap-2 text-xs text-[var(--wiki-muted)]">
                    {round !== null && (
                      <span title="Desde donde está, contra el frente enemigo, con el 👢 Movimiento de su tipo de daño.">
                        pega en la ronda <b className="text-[var(--wiki-text)]">{round}</b>
                      </span>
                    )}
                    {cell && (
                      <button
                        className={buttonClass({ size: "sm", iconOnly: true })}
                        title="Retirar del tablero"
                        aria-label={`Retirar ${figureName(figure)}`}
                        onClick={() => onLift(figure.id)}
                      >
                        <i className="pi pi-times" />
                      </button>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      {/* El "no" del motor, con sus palabras. Un botón apagado no explica nada,
          y aquí el motivo es el que enseña la regla (§3, §5). */}
      {refusal && (
        <p className="mt-2 text-sm text-[var(--wiki-danger)]">
          <i className="pi pi-ban mr-1.5" />
          {refusal}
        </p>
      )}
    </div>
  );
}
