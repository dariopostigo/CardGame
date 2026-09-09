"use client";

// =========================================================================
// Módulo «Catálogo de cartas» de /dev — las cartas de unidad de las razas piloto
//
// Depende de /dev/razas (lib/dev-registry.ts): el roster ya daba un
// `Character` legal por ficha, y una carta de unidad no le pide nada más que
// una ILUSTRACIÓN (lib/v3/cards.ts `unitCardsOfRace`) — los otros 12 datos ya
// estaban.
//
// SOLO UNIDADES. Las cartas de clase de Humanos (Guerrero, Mago, Sacerdote,
// Arquero) no están aquí: esperan a que se decida cómo se expresa un efecto
// (docs/v3/cards/class.md), que es diseño de juego y no algo que se pueda
// derivar. Se eligió así explícitamente al empezar este módulo.
//
// ES UNA TABLA DE DATOS, NO EL OBJETO-CARTA. El marco (L·Lámina) ya existe
// aparte, en components/design/v3/ y /docs/v3/cards/design, y no se
// reconstruye aquí: lib/dev-registry.ts ya distingue "cartas" (lo que el
// objeto imprime) de "marco" (el objeto). Las cinco Habilidades de escalón
// siguen atenuadas por el mismo motivo que en /dev/razas: no están decididas
// ficha a ficha, y esta pantalla no debe fingir que sí.
//
// No decide nada: recibe las UnitCard ya construidas y las pinta
// (ARCHITECTURE.md §6).
// =========================================================================

import Link from "next/link";
import {
  ABILITIES,
  ABILITIES_WITHOUT_VALUES,
  checks as checksOf,
  repeatedGlyphs,
  validate,
} from "@/lib/v3/character";
import type { UnitCard } from "@/lib/v3/cards";
import { DAMAGE_TYPES } from "@/lib/v3/damage";
import { rarityForTier } from "@/lib/v3/rarity";
import type { Trait } from "@/lib/v3/traits";
import RarityChip from "@/components/wiki/RarityChip";

export type CardModuleProps = {
  /** Las cartas de unidad de las razas piloto, ya construidas por lib/v3/cards.ts. */
  cards: readonly UnitCard[];
  /** Las 41 Características, para pintar el glifo y el nombre de cada rasgo. */
  catalog: readonly Trait[];
};

const PENDING = new Set(ABILITIES_WITHOUT_VALUES);

export default function CardModule({ cards, catalog }: CardModuleProps) {
  const label = "text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]";
  const card = "rounded-lg border border-[var(--wiki-border)] bg-[var(--wiki-surface)] p-3";

  // Una raza por sección, en el orden en que llegan (razas piloto: Humanos,
  // luego Enanos) — mismo criterio que RaceModule.
  const races: string[] = [];
  for (const c of cards) {
    if (c.character.race && !races.includes(c.character.race)) races.push(c.character.race);
  }

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="mb-1 text-2xl font-bold text-[var(--wiki-text)]">Catálogo de cartas</h1>
      <p className="mb-3 max-w-3xl text-sm text-[var(--wiki-muted)]">
        Las cartas de V3 como <b className="text-[var(--wiki-text)]">datos</b>, no como el objeto —
        eso es el marco, ya elegido en{" "}
        <Link href="/docs/v3/cards/design" className="text-[var(--wiki-accent)] hover:underline">
          Diseño de cartas
        </Link>
        —: aquí se ve lo que ese objeto imprime, leído en vivo del roster de{" "}
        <Link href="/dev/razas" className="text-[var(--wiki-accent)] hover:underline">
          Razas y unidades
        </Link>
        .
      </p>
      <p className="mb-5 max-w-3xl rounded-lg border border-[var(--wiki-border)] bg-[var(--wiki-surface)] p-3 text-sm text-[var(--wiki-muted)]">
        <b className="text-[var(--wiki-text)]">Cartas de unidad de Humanos y Enanos</b>, las 8 de
        cada una: es el único tipo de carta con anatomía cerrada hoy —13 datos + tipo de daño, todos
        derivados del{" "}
        <Link href="/dev/personaje" className="text-[var(--wiki-accent)] hover:underline">
          Character
        </Link>{" "}
        de cada ficha más su ilustración—. Las cartas de{" "}
        <b className="text-[var(--wiki-text)]">clase</b> (Guerrero, Mago, Sacerdote, Arquero...) no
        están: esperan a que se decida cómo se expresa un efecto, que es diseño de juego y no algo
        que este módulo pueda derivar. Las cinco Habilidades atenuadas (
        {ABILITIES_WITHOUT_VALUES.map((id) => ABILITIES[id].icon).join(" ")}) siguen en su valor
        por defecto, como en el roster: no decidido todavía.
      </p>

      {races.map((race) => (
        <div key={race} className={`${card} mb-4 overflow-x-auto`}>
          <p className={`${label} mb-2`}>
            {race} · Unidades · {cards.filter((c) => c.character.race === race).length}
          </p>
          <table className="w-full min-w-[56rem] text-sm">
            <thead>
              <tr className="border-b border-[var(--wiki-border)] text-left text-xs uppercase tracking-wide text-[var(--wiki-muted)]">
                <th className="py-1.5 pr-3">Ilustración</th>
                <th className="py-1.5 pr-3">Ficha</th>
                <th className="py-1.5 pr-3">Tier</th>
                <th className="py-1.5 pr-3">Tipo de daño</th>
                {(Object.keys(ABILITIES) as (keyof typeof ABILITIES)[]).map((id) => (
                  <th key={id} className="py-1.5 pr-2 text-right" title={ABILITIES[id].label}>
                    {ABILITIES[id].icon}
                  </th>
                ))}
                <th className="py-1.5 pr-3">Características</th>
                <th className="py-1.5">Estado</th>
              </tr>
            </thead>
            <tbody>
              {cards
                .filter((c) => c.character.race === race)
                .map((c) => (
                  <CardRow key={c.character.id} unitCard={c} catalog={catalog} />
                ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

function CardRow({ unitCard, catalog }: { unitCard: UnitCard; catalog: readonly Trait[] }) {
  const { character, illustration } = unitCard;
  const type = DAMAGE_TYPES[character.damage];
  const problems = validate(character, catalog);
  const repeated = repeatedGlyphs(character, catalog);
  const chosen = character.traits
    .map((id) => catalog.find((t) => t.id === id))
    .filter((t): t is Trait => Boolean(t));

  return (
    <tr className="border-b border-[var(--wiki-border)] align-top last:border-0">
      <td className="py-1.5 pr-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={illustration}
          alt={character.name}
          className="h-14 w-10 rounded object-cover"
          title={illustration}
        />
      </td>
      <td className="py-1.5 pr-3 font-medium text-[var(--wiki-text)]">{character.name}</td>
      <td className="py-1.5 pr-3 text-[var(--wiki-muted)]">
        <span className="inline-flex items-center gap-1.5">
          {character.tier}
          <RarityChip level={rarityForTier(character.tier as number)} />
        </span>
      </td>
      <td className="py-1.5 pr-3 whitespace-nowrap text-[var(--wiki-muted)]">
        {type.icon} {type.label}
      </td>
      {(Object.keys(ABILITIES) as (keyof typeof ABILITIES)[]).map((id) => (
        <td
          key={id}
          className={`py-1.5 pr-2 text-right tabular-nums ${
            PENDING.has(id) ? "italic text-[var(--wiki-muted)]" : "text-[var(--wiki-text)]"
          }`}
          title={
            PENDING.has(id) ? `${ABILITIES[id].label} — por defecto, no decidido todavía` : ABILITIES[id].label
          }
        >
          {character.abilities[id]}
        </td>
      ))}
      <td className="py-1.5 pr-3">
        {chosen.length === 0 ? (
          <span className="text-xs italic text-[var(--wiki-muted)]">—</span>
        ) : (
          <span className="inline-flex flex-wrap items-center gap-1">
            {chosen.map((t) => {
              const isRepeated = repeated.some((r) => r.labels.includes(t.label));
              return (
                <span
                  key={t.id}
                  className={`text-base leading-none ${isRepeated ? "opacity-60" : ""}`}
                  title={isRepeated ? `${t.label} — glifo repetido en esta ficha` : t.label}
                >
                  {t.icon}
                </span>
              );
            })}
          </span>
        )}
      </td>
      <td className="py-1.5">
        {problems.length === 0 ? (
          <span
            className="text-xs text-[var(--wiki-muted)]"
            title={`${checksOf(character, catalog).length} comprobaciones, todas en orden`}
          >
            <i className="pi pi-check mr-1 text-[0.65rem]" />
            legal
          </span>
        ) : (
          <span
            className="text-xs text-[var(--wiki-danger)]"
            title={problems.map((p) => p.message).join(" · ")}
          >
            <i className="pi pi-times mr-1 text-[0.65rem]" />
            {problems.length} {problems.length === 1 ? "regla rota" : "reglas rotas"}
          </span>
        )}
      </td>
    </tr>
  );
}
