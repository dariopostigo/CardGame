"use client";

// =========================================================================
// Módulo «Razas y unidades» de /dev — el roster real de las razas piloto
//
// Depende de /dev/personaje (lib/dev-registry.ts): la anatomía ya estaba
// cerrada, así que esto no decide ninguna regla nueva — cruza el roster
// crudo de razas.md (lib/v3/traits.ts `parseRoster`) con esa anatomía
// (lib/v3/races.ts `charactersOfRace`) y enseña las 12 fichas de cada una de
// las dos razas piloto (Humanos y Enanos, status.md §4) como Character de
// verdad, no como los 60 inventados de components/design/v3/sample.ts y
// races.ts. Una sección por raza, en el orden en que llega el prop.
//
// LAS CINCO DE ESCALÓN SE VEN DISTINTAS A PROPÓSITO. 🛡️ 🔮 🎯 🍀 ⚡ salen en
// `DEFAULT_STEP` (lib/v3/races.ts) porque razas.md todavía no dice el
// escalón de cada ficha — es insumo de Dario, no un dato que falte leer. Se
// pintan atenuadas y con «por defecto» para que no se confundan con un
// número decidido, el mismo trato que ABILITIES_WITHOUT_VALUES ya recibe en
// /dev/personaje.
//
// Y SE VE LA COLISIÓN ARQUERO/MAGO PORQUE NO SE ESCONDE. Humanos es la raza
// piloto y ya trae dos de los 25 nombres duplicados héroe/unidad
// (README de races-concept, 24-ago-2026: se renombra la unidad, que es
// trabajo pendiente y no decisión) — su propio Arquero y su propio Mago se
// llaman igual que una unidad de su progresión. La tabla los enseña uno al
// lado del otro en vez de que haga falta ir a buscarlos.
//
// No decide nada: recibe los Character ya construidos y los pinta
// (ARCHITECTURE.md §6).
// =========================================================================

import Link from "next/link";
import {
  ABILITIES,
  ABILITIES_WITHOUT_VALUES,
  checks as checksOf,
  repeatedGlyphs,
  validate,
  type Character,
} from "@/lib/v3/character";
import { DAMAGE_TYPES } from "@/lib/v3/damage";
import { rarityForTier } from "@/lib/v3/rarity";
import type { Trait } from "@/lib/v3/traits";
import RarityChip from "@/components/wiki/RarityChip";

export type RaceModuleProps = {
  /** Las fichas de la raza piloto, ya construidas por lib/v3/races.ts. */
  characters: readonly Character[];
  /** Las 41 Características, para pintar el glifo y el nombre de cada rasgo. */
  catalog: readonly Trait[];
};

const PENDING = new Set(ABILITIES_WITHOUT_VALUES);

export default function RaceModule({ characters, catalog }: RaceModuleProps) {
  const label = "text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]";
  const card = "rounded-lg border border-[var(--wiki-border)] bg-[var(--wiki-surface)] p-3";

  // Una raza por sección, en el orden en que llegan (razas piloto: Humanos,
  // luego Enanos) — no se ordena alfabéticamente ni se supone cuántas hay.
  const races: string[] = [];
  for (const c of characters) {
    if (c.race && !races.includes(c.race)) races.push(c.race);
  }

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="mb-1 text-2xl font-bold text-[var(--wiki-text)]">Razas y unidades</h1>
      <p className="mb-3 max-w-3xl text-sm text-[var(--wiki-muted)]">
        El catálogo de{" "}
        <Link href="/docs/v3/razas" className="text-[var(--wiki-accent)] hover:underline">
          las 11 razas
        </Link>{" "}
        con sus 4 clases y su progresión de 8 unidades, en datos: de aquí comen el reclutamiento,
        el mazo y la composición de enemigos. Cruza el roster de razas.md con la anatomía de{" "}
        <Link href="/dev/personaje" className="text-[var(--wiki-accent)] hover:underline">
          Estadísticas de personaje
        </Link>{" "}
        — nada se escribe a mano, todo sale de leer el documento.
      </p>
      <p className="mb-5 max-w-3xl rounded-lg border border-[var(--wiki-border)] bg-[var(--wiki-surface)] p-3 text-sm text-[var(--wiki-muted)]">
        <b className="text-[var(--wiki-text)]">Razas piloto: Humanos y Enanos</b>, sus 12 fichas
        cada una —4 héroes y 8 unidades—, y nada más: las otras nueve esperan a que estas dos estén
        jugables (status.md §4). ❤️, ⚔️ y 👢 son reales —la curva de tier de cada raza y la banda de
        su tipo de daño—; las cinco atenuadas (
        {ABILITIES_WITHOUT_VALUES.map((id) => ABILITIES[id].icon).join(" ")}) están en{" "}
        <b className="text-[var(--wiki-text)]">su valor por defecto</b>, no decidido: razas.md
        todavía no dice qué escalón le toca a cada ficha, y eso es insumo de Dario, ficha a ficha.
        Y Humanos ya enseña sola una de las 25 colisiones pendientes:{" "}
        <b className="text-[var(--wiki-text)]">🏹 Arquero</b> y{" "}
        <b className="text-[var(--wiki-text)]">🔮 Mago</b> son a la vez una clase de héroe y una
        unidad de su propia progresión — se renombra la unidad, que es trabajo, no decisión.
      </p>

      {races.map((race) => {
        const ofRace = characters.filter((c) => c.race === race);
        return (
          <div key={race} className="mb-6">
            <h2 className="mb-2 text-lg font-semibold text-[var(--wiki-text)]">{race}</h2>
            <RosterTable
              title="Héroes"
              characters={ofRace.filter((c) => c.role === "heroe")}
              catalog={catalog}
              className={`${card} mb-4`}
              label={label}
            />
            <RosterTable
              title="Unidades"
              characters={ofRace.filter((c) => c.role === "unidad")}
              catalog={catalog}
              className={card}
              label={label}
            />
          </div>
        );
      })}
    </div>
  );
}

function RosterTable({
  title,
  characters,
  catalog,
  className,
  label,
}: {
  title: string;
  characters: readonly Character[];
  catalog: readonly Trait[];
  className: string;
  label: string;
}) {
  return (
    <div className={className}>
      <p className={`${label} mb-2`}>
        {title} · {characters.length}
      </p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[52rem] text-sm">
          <thead>
            <tr className="border-b border-[var(--wiki-border)] text-left text-xs uppercase tracking-wide text-[var(--wiki-muted)]">
              <th className="py-1.5 pr-3">Ficha</th>
              <th className="py-1.5 pr-3">Rol</th>
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
            {characters.map((c) => (
              <CharacterRow key={c.id} character={c} catalog={catalog} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CharacterRow({ character, catalog }: { character: Character; catalog: readonly Trait[] }) {
  const type = DAMAGE_TYPES[character.damage];
  const checks = checksOf(character, catalog);
  const problems = validate(character, catalog);
  const repeated = repeatedGlyphs(character, catalog);
  const chosen = character.traits
    .map((id) => catalog.find((t) => t.id === id))
    .filter((t): t is Trait => Boolean(t));

  return (
    <tr className="border-b border-[var(--wiki-border)] align-top last:border-0">
      <td className="py-1.5 pr-3 font-medium text-[var(--wiki-text)]">{character.name}</td>
      <td className="py-1.5 pr-3 text-[var(--wiki-muted)]">
        {character.role === "heroe" ? (
          "Héroe"
        ) : (
          <span className="inline-flex items-center gap-1.5">
            Tier {character.tier}
            <RarityChip level={rarityForTier(character.tier as number)} />
          </span>
        )}
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
          title={PENDING.has(id) ? `${ABILITIES[id].label} — por defecto, no decidido todavía` : ABILITIES[id].label}
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
          <span className="text-xs text-[var(--wiki-muted)]" title={`${checks.length} comprobaciones, todas en orden`}>
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
