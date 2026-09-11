// =========================================================================
// El catálogo en datos — las cartas de unidad de las razas piloto
//
// VIVÍA EN /dev/cartas HASTA EL 10 DE SEPTIEMBRE DE 2026 y se mudó con su
// hermana el roster, por el mismo motivo y con la misma prueba: era un
// `"use client"` sin estado ni manejadores. Se lee y ya está, así que es wiki.
// El porqué entero está en la cabecera de RosterView.tsx; aquí basta con la
// consecuencia: `/dev` se queda con lo que se juega y lo que se mide, y las dos
// tablas derivadas se miran donde se mira el documento del que salen.
//
// SIGUE EN LA CADENA DE /dev con `home` (lib/dev-registry.ts, módulo «cartas»):
// de aquí come la baraja, y el orden de construcción no cambia porque cambie la
// puerta.
//
// ES UNA TABLA DE DATOS, NO EL OBJETO-CARTA. El marco (L·Lámina) ya existe
// aparte, en components/design/v3/ y en /docs/v3/cards/design, y no se
// reconstruye aquí: lib/dev-registry.ts distingue «cartas» —lo que el objeto
// imprime— de «marco» —el objeto—. Son dos páginas vecinas del mismo grupo de la
// wiki y esa vecindad es la buena: una enseña lo que se pinta y la otra con qué
// se pinta.
//
// SOLO UNIDADES. Las cartas de clase (Guerrero, Mago, Sacerdote, Arquero) no
// están: esperan a que se redacten las 40 del piloto (docs/v3/cards/class.md),
// que es contenido de juego y no algo que se pueda derivar de un documento.
//
// Las cinco Habilidades de escalón siguen atenuadas por el mismo motivo que en
// el roster: no están decididas ficha a ficha, y esta página no debe fingir que
// sí.
//
// No decide nada y no tiene estado: recibe las UnitCard ya construidas y las
// pinta (ARCHITECTURE.md §6).
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

export type UnitCatalogViewProps = {
  /** Las cartas de unidad de las razas piloto, ya construidas por lib/v3/cards.ts. */
  cards: readonly UnitCard[];
  /** Las 41 Características, para pintar el glifo y el nombre de cada rasgo. */
  catalog: readonly Trait[];
};

const PENDING = new Set(ABILITIES_WITHOUT_VALUES);

export default function UnitCatalogView({ cards, catalog }: UnitCatalogViewProps) {
  const label = "text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]";
  const card = "rounded-lg border border-[var(--wiki-border)] bg-[var(--wiki-surface)] p-3";

  // Una raza por sección, en el orden en que llegan (razas piloto: Humanos,
  // luego Enanos) — mismo criterio que RosterView.
  const races: string[] = [];
  for (const c of cards) {
    if (c.character.race && !races.includes(c.character.race)) races.push(c.character.race);
  }

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-[var(--wiki-text)]">El catálogo en datos</h1>
      <p className="mb-3 max-w-3xl text-sm text-[var(--wiki-muted)]">
        Lo que una carta de unidad lleva escrito, derivado en vivo del{" "}
        <Link
          href="/docs/v3/razas/roster"
          className="text-[var(--wiki-accent)] hover:underline"
        >
          roster
        </Link>{" "}
        — no el objeto, que es el marco ya elegido en{" "}
        <Link href="/docs/v3/cards/design" className="text-[var(--wiki-accent)] hover:underline">
          Diseño de cartas
        </Link>
        . Cada ficha de rol «unidad» más su ilustración, y nada escrito a mano: la ruta del archivo
        se deriva del nombre con el mismo criterio que usó el arte.
      </p>
      <p className="mb-5 max-w-3xl rounded-lg border border-[var(--wiki-border)] bg-[var(--wiki-surface)] p-3 text-sm text-[var(--wiki-muted)]">
        <b className="text-[var(--wiki-text)]">Cartas de unidad de Humanos y Enanos</b>, las 8 de
        cada una: es el único tipo de carta con anatomía cerrada hoy —13 datos + tipo de daño, todos
        derivados del{" "}
        <Link href="/dev/personaje" className="text-[var(--wiki-accent)] hover:underline">
          Character
        </Link>{" "}
        de cada ficha más su ilustración—. Las cartas de{" "}
        <b className="text-[var(--wiki-text)]">clase</b> (
        <Link href="/docs/v3/cards/class" className="text-[var(--wiki-accent)] hover:underline">
          Guerrero, Mago, Sacerdote, Arquero...
        </Link>
        ) no están: falta redactar las 40 del piloto, que es contenido de juego y no algo que esta
        página pueda derivar. Las cinco Habilidades atenuadas (
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
