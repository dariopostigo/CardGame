"use client";

// =========================================================================
// La hoja de datos, editable (presentacional)
//
// Las 8 Habilidades una debajo de otra, cada una con su escala puesta: el mando
// no llega más allá de donde el motor la deja, así que el tope no es un aviso
// que salta después sino un sitio al que el dial no pasa. Lo que sí puede
// romperse a mano es lo que depende de OTRO campo —🍀 Suerte contra 🎯 Precisión,
// 👢 Movimiento contra el tipo de daño—, y eso lo canta CharacterReadings.
//
// Arriba va la FILA DE OCHO tal y como la imprime la carta, porque el ancho de
// cada número es un dato de diseño y no se ve mirando ocho sliders: es lo que
// decide si el hueco del marco se rompe (knowledge/v3/card-concept/).
//
// 👢 MOVIMIENTO SE PINTA DISTINTO A PROPÓSITO. Es la única de las ocho con valor
// decidido, y no por personaje sino por tipo de daño (battle.md §1.2), así que va
// atado a su banda mientras no se suelte a mano. Las otras siete son diales sin
// cerrar y la pantalla no debe fingir lo contrario.
//
// No decide nada: recibe el personaje y sube callbacks (ARCHITECTURE.md §6).
// =========================================================================

import { Slider, type SliderChangeEvent } from "primereact/slider";
import {
  ABILITIES,
  ABILITY_IDS,
  MOVEMENT_LIMITS,
  type AbilityId,
  type Character,
} from "@/lib/v3/character";
import { DAMAGE_TYPES } from "@/lib/v3/damage";
import { MOVEMENT_BAND } from "@/lib/v3/tempo";
import type { Trait } from "@/lib/v3/traits";
import { buttonClass } from "@/components/ui/Button";

export type CharacterSheetProps = {
  character: Character;
  /** El catálogo, para poder pintar el glifo de cada Característica elegida. */
  catalog: readonly Trait[];
  /** Qué Habilidades tienen algún problema, para marcarlas en el sitio. */
  flagged: ReadonlySet<AbilityId>;
  onAbility: (id: AbilityId, value: number) => void;
  /** Devolver 👢 Movimiento a la banda de su tipo de daño. */
  onMovementToBand: () => void;
  className?: string;
};

export default function CharacterSheet({
  character,
  catalog,
  flagged,
  onAbility,
  onMovementToBand,
  className,
}: CharacterSheetProps) {
  const type = DAMAGE_TYPES[character.damage];
  const chosen = character.traits
    .map((id) => catalog.find((t) => t.id === id))
    .filter((t): t is Trait => Boolean(t));

  return (
    <div className={className}>
      {/* --- La fila de ocho, como la imprime la carta --- */}
      <div className="mb-4 rounded-md bg-[var(--wiki-surface-2)] p-3">
        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]">
            La caja de datos de la carta
          </span>
          <span className="text-xs text-[var(--wiki-muted)]">
            {character.role === "heroe" ? (
              <>Héroe · sin tier, y nada lo sustituye</>
            ) : (
              <>Tier {character.tier}</>
            )}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-x-4 gap-y-2 sm:grid-cols-8">
          {ABILITY_IDS.map((id) => {
            const ability = ABILITIES[id];
            // El glifo de ⚔️ Ataque en una carta es el del TIPO DE DAÑO y no el
            // genérico: la carta dice cuánto pega y de qué manera en el mismo
            // hueco (razas.md §"Tipo de daño").
            const icon = id === "ataque" ? type.icon : ability.icon;
            return (
              <div
                key={id}
                className="flex flex-col items-center"
                title={`${ability.label} — ${ability.what}${id === "ataque" ? `. El glifo es el del tipo de daño: ${type.label}` : ""}`}
              >
                <span className="text-base leading-none">{icon}</span>
                <span
                  className={`mt-1 font-semibold tabular-nums ${
                    flagged.has(id) ? "text-[var(--wiki-danger)]" : "text-[var(--wiki-text)]"
                  }`}
                >
                  {character.abilities[id]}
                </span>
              </div>
            );
          })}
        </div>
        {/* Las Características son glifos y no texto: así se ven como en la
            carta, que es donde se descubre un icono repetido. */}
        <div className="mt-3 flex min-h-6 flex-wrap items-center gap-1.5 border-t border-[var(--wiki-border)] pt-2">
          {chosen.length === 0 ? (
            <span className="text-xs italic text-[var(--wiki-muted)]">
              Sin Características — el caso que descubre los huecos que se ven vacíos
            </span>
          ) : (
            chosen.map((t) => (
              <span key={t.id} className="text-base leading-none" title={`${t.label} — ${t.description}`}>
                {t.icon}
              </span>
            ))
          )}
        </div>
      </div>

      {/* --- Las ocho, con su escala --- */}
      <ul className="grid gap-2.5">
        {ABILITY_IDS.map((id) => {
          const ability = ABILITIES[id];
          const value = character.abilities[id];
          const isMovement = id === "movimiento";
          const band = MOVEMENT_BAND[character.damage];
          const limit = MOVEMENT_LIMITS[character.damage];
          const problem = flagged.has(id);

          return (
            <li key={id} className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1">
              <div className="flex min-w-0 items-baseline gap-2">
                <span className="text-sm">{ability.icon}</span>
                <span
                  className={`truncate text-sm font-medium ${
                    problem ? "text-[var(--wiki-danger)]" : "text-[var(--wiki-text)]"
                  }`}
                  title={ability.what}
                >
                  {ability.label}
                </span>
                {ability.scalesWithTier && (
                  <span
                    className="rounded-full border border-[var(--wiki-border)] px-1.5 text-[0.65rem] uppercase tracking-wide text-[var(--wiki-muted)]"
                    title="Crece con el tier: ×10 del tier 1 al 8. Las otras seis están topadas o no escalan."
                  >
                    tier
                  </span>
                )}
                {isMovement && (
                  <span
                    className="rounded-full border border-[var(--wiki-accent)] px-1.5 text-[0.65rem] uppercase tracking-wide text-[var(--wiki-accent)]"
                    title="La única de las ocho con valor decidido (31-ago-2026), y va por tipo de daño: 🗡️ 3 · ✨ 2 · 🏹 1."
                  >
                    decidida
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`w-10 text-right text-sm font-semibold tabular-nums ${
                    problem ? "text-[var(--wiki-danger)]" : "text-[var(--wiki-text)]"
                  }`}
                >
                  {value}
                </span>
                <span className="w-24 text-right text-[0.7rem] tabular-nums text-[var(--wiki-muted)]">
                  {ability.scale.min}–{ability.scale.max}
                </span>
              </div>

              <div className="col-span-2 flex items-center gap-3">
                <Slider
                  className="w-full"
                  value={value}
                  min={ability.scale.min}
                  max={ability.scale.max}
                  onChange={(e: SliderChangeEvent) =>
                    typeof e.value === "number" && onAbility(id, e.value)
                  }
                />
                {isMovement && value !== band && (
                  <button
                    className={buttonClass({ size: "sm" })}
                    title={`La banda de ${type.icon} ${type.label} es ${band} (battle.md §1.2)`}
                    onClick={onMovementToBand}
                  >
                    a la banda · {band}
                  </button>
                )}
              </div>

              {/* El motivo del tope, solo cuando estás pegado a él: es donde la
                  regla enseña algo. */}
              {(value === ability.scale.min || value === ability.scale.max || problem) && (
                <p className="col-span-2 -mt-0.5 text-[0.7rem] leading-snug text-[var(--wiki-muted)]">
                  {ability.scale.why}
                  {isMovement && limit.min !== undefined && ` · ninguna ${type.icon} por debajo de ${limit.min}`}
                  {isMovement && limit.max !== undefined && ` · ninguna ${type.icon} por encima de ${limit.max}`}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
