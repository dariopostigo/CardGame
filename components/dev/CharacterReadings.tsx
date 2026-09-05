"use client";

// =========================================================================
// Las lecturas de la hoja (presentacional)
//
// Cuatro cosas que salen de la hoja SIN DECIDIR NADA, y por eso pueden estar
// aquí mientras a la anatomía le faltan siete cifras:
//
//   1. Lo que trae puesto el tipo de daño — alcance y qué lo frena (§4.3). No es
//      un campo de la hoja, y esta caja es donde se ve que no hace falta.
//   2. Qué significan 🎯 Precisión y 🍀 Suerte, en desenlaces por cien ataques.
//      Sale de lib/v3/combat.ts, que ya resuelve el §4.1: es lo único del motor
//      que no espera valores, porque consume los umbrales y no los inventa.
//   3. Las comprobaciones de la anatomía, PASEN O NO. La lista es la anatomía
//      leída en voz alta, y por eso las que pasan también se enseñan.
//   4. La curva del tier, ×10 del 1 al 8. Se lee al revés de como se escribe:
//      se toma el valor de la hoja como el que le toca a SU tier y se deshace
//      la multiplicación, así que se ve a qué familia de números pertenece lo
//      que acabas de teclear.
//
// Ninguna regla vive aquí: todo son funciones de lib/v3/ (ARCHITECTURE.md §6).
// =========================================================================

import { expectedMix } from "@/lib/v3/combat";
import {
  ABILITIES,
  TIER_CURVE,
  TIERS,
  derivedOf,
  scaleByTier,
  tierMultiplier,
  type Character,
  type Check,
} from "@/lib/v3/character";
import { DAMAGE_TYPES } from "@/lib/v3/damage";

export type CharacterReadingsProps = {
  character: Character;
  checks: readonly Check[];
  className?: string;
};

const SAMPLE = 100;

export default function CharacterReadings({
  character,
  checks,
  className,
}: CharacterReadingsProps) {
  const derived = derivedOf(character);
  const type = DAMAGE_TYPES[character.damage];
  const mix = expectedMix(SAMPLE, character.abilities.precision, character.abilities.suerte);
  const failed = checks.filter((k) => !k.ok);

  const heading = "text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]";

  return (
    <div className={className}>
      {/* --- 1. Lo que trae el tipo de daño --- */}
      <p className={heading}>Lo que trae puesto el tipo de daño</p>
      <dl className="mb-4 mt-1.5 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
        <dt className="text-[var(--wiki-muted)]">Alcance</dt>
        <dd className="text-[var(--wiki-text)]">
          <b>{derived.range}</b> {derived.range === 1 ? "hexágono" : "hexágonos"}
          <span
            className="ml-1 text-xs text-[var(--wiki-muted)]"
            title="Es un máximo, no un mínimo: se puede disparar o lanzar magia contra un enemigo pegado, sin penalización (§4.3)."
          >
            máximo
          </span>
        </dd>

        <dt className="text-[var(--wiki-muted)]">Su daño lo frena</dt>
        <dd className="text-[var(--wiki-text)]">
          {derived.mitigatedBy === "defensa" ? (
            <>🛡️ Defensa del defensor</>
          ) : (
            <>🔮 Resistencia mágica del defensor</>
          )}
        </dd>

        <dt className="text-[var(--wiki-muted)]">Banda de 👢</dt>
        <dd className="text-[var(--wiki-text)]">
          <b>{derived.movementBand}</b>
          {character.abilities.movimiento !== derived.movementBand && (
            <span className="ml-1 text-xs text-[var(--wiki-accent)]">
              este personaje lleva {character.abilities.movimiento}
            </span>
          )}
        </dd>

        <dt className="text-[var(--wiki-muted)]">🍀 Suerte efectiva</dt>
        <dd className="text-[var(--wiki-text)]" title="Con su tope de 25 y sin pasar de 🎯 Precisión (§4.1).">
          <b>{derived.luck}</b>
          {derived.luck !== character.abilities.suerte && (
            <span className="ml-1 text-xs text-[var(--wiki-accent)]">
              saneada de {character.abilities.suerte}
            </span>
          )}
        </dd>
      </dl>

      {/* --- 2. Qué hacen sus dos umbrales --- */}
      <p className={heading}>Sus dos umbrales, en {SAMPLE} ataques básicos</p>
      <p className="mt-1 mb-1.5 text-xs text-[var(--wiki-muted)]">
        Una sola tirada oculta contra 🎯 {character.abilities.precision} y 🍀 {derived.luck} (§4.1).
        Un {type.icon} {type.label} tira igual que los otros dos: lo que no tira es el hechizo, que
        viene de una carta.
      </p>
      <div className="mb-4 flex gap-2">
        {(
          [
            ["fallo", mix.fallo, "pi-times"],
            ["impacto", mix.impacto, "pi-check"],
            ["crítico", mix.critico, "pi-star-fill"],
          ] as const
        ).map(([label, n, icon]) => (
          <div
            key={label}
            className="flex-1 rounded-md bg-[var(--wiki-surface-2)] px-2.5 py-1.5 text-center"
          >
            <div className="text-lg font-semibold tabular-nums text-[var(--wiki-text)]">{n}</div>
            <div className="text-[0.7rem] text-[var(--wiki-muted)]">
              <i className={`pi ${icon} mr-1 text-[0.65rem]`} />
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* --- 3. Las comprobaciones --- */}
      <p className={heading}>
        Lo que el motor no deja pasar · {checks.length - failed.length} de {checks.length}
      </p>
      <ul className="mb-4 mt-1.5 grid gap-1">
        {checks.map((k) => (
          <li key={k.id} className="text-xs">
            <div className="flex items-baseline gap-1.5">
              <i
                className={`pi ${k.ok ? "pi-check" : "pi-times"} text-[0.65rem] ${
                  k.ok ? "text-[var(--wiki-muted)]" : "text-[var(--wiki-danger)]"
                }`}
              />
              <span className={k.ok ? "text-[var(--wiki-muted)]" : "text-[var(--wiki-danger)]"}>
                {k.rule}
              </span>
              <span className="ml-auto shrink-0 tabular-nums text-[var(--wiki-muted)]">
                {k.reading}
              </span>
            </div>
            {/* El motivo solo cuando hace falta: es lo que enseña la regla. */}
            {!k.ok && k.message && (
              <p className="mt-0.5 pl-4 leading-snug text-[var(--wiki-muted)]">{k.message}</p>
            )}
          </li>
        ))}
      </ul>

      {/* --- 4. La curva del tier --- */}
      <p className={heading}>La curva del tier</p>
      {character.role === "heroe" || character.tier === undefined ? (
        <p className="mt-1 text-xs text-[var(--wiki-muted)]">
          Un héroe no tiene tier, así que no tiene curva: no sube, y no hay ningún dato en camino
          para ese hueco. Es <b className="text-[var(--wiki-text)]">quién</b> es —su clase, sus
          Características y su tipo de daño—, y una unidad, cuál es.
        </p>
      ) : (
        <TierCurve character={character} />
      )}
    </div>
  );
}

/**
 * Las dos Habilidades que escalan, a lo largo de los ocho tiers.
 *
 * Se deshace la multiplicación del tier de la hoja para sacar su base, y desde
 * ahí se rehace la tabla entera. Así el número que acabas de teclear enseña la
 * progresión de la que formaría parte, que es la pregunta útil: un ⚔️ Ataque de
 * 11 en tier 3 dice que su raza empieza en 6 y acaba en 58.
 */
function TierCurve({ character }: { character: Character }) {
  const tier = character.tier ?? 1;
  const rows = (["vida", "ataque"] as const).map((id) => {
    const base = character.abilities[id] / tierMultiplier(tier);
    return {
      id,
      icon: ABILITIES[id].icon,
      label: ABILITIES[id].label,
      values: TIER_CURVE.map((_, i) => scaleByTier(base, i + 1)),
    };
  });

  return (
    <div className="mt-1.5 overflow-x-auto">
      <table className="w-full min-w-[24rem] text-right text-xs tabular-nums">
        <thead>
          <tr className="text-[var(--wiki-muted)]">
            <th className="text-left font-normal">tier</th>
            {Array.from({ length: TIERS }, (_, i) => i + 1).map((t) => (
              <th
                key={t}
                className={`font-normal ${t === tier ? "text-[var(--wiki-accent)]" : ""}`}
              >
                {t}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="text-[var(--wiki-muted)]">
            <td className="text-left">× la base</td>
            {TIER_CURVE.map((m, i) => (
              <td key={m} className={i + 1 === tier ? "text-[var(--wiki-accent)]" : ""}>
                {m.toLocaleString("es-ES")}
              </td>
            ))}
          </tr>
          {rows.map((row) => (
            <tr key={row.id} className="text-[var(--wiki-text)]">
              <td className="text-left" title={`${row.label} crece con el tier`}>
                {row.icon} {row.label}
              </td>
              {row.values.map((v, i) => (
                <td
                  key={i}
                  className={
                    i + 1 === tier ? "font-semibold text-[var(--wiki-accent)]" : undefined
                  }
                >
                  {v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-1.5 text-xs text-[var(--wiki-muted)]">
        Solo estas dos escalan, y ×10 del tier 1 al 8. Las otras seis están topadas o no escalan, así
        que un tier 8 pega y aguanta diez veces más pero{" "}
        <b className="text-[var(--wiki-text)]">no acierta diez veces mejor</b> — que es lo que deja
        que un tier 1 siga arañando a un tier 8 sin ningún caso especial.
      </p>
    </div>
  );
}
