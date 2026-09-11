// =========================================================================
// El roster en datos — las fichas de las razas piloto, derivadas de razas.md
//
// VIVÍA EN /dev/razas HASTA EL 10 DE SEPTIEMBRE DE 2026 y se mudó aquí en una
// frase de Dario: «el DEV lo quiero sobre todo para el desarrollo del
// videojuego en sí, lo que es el gameplay». La prueba de que tenía razón estaba
// en el propio archivo: esto era un `"use client"` sin un solo `useState` ni un
// solo `onClick`. No hay nada que tocar en esta pantalla —se lee—, y una
// pantalla que solo se lee es wiki, no laboratorio. En `/dev` se quedan las que
// contestan algo cuando las manoseas: mueves un dial y se rompe una regla.
//
// LO QUE NO SE PIERDE AL MUDARLA. Aquí dentro estaba la única comprobación de
// que razas.md sigue produciendo fichas legales —la columna «legal / N reglas
// rotas»—, y en un rincón de la wiki eso dejaría de sonar. La comprobación se
// separó del dibujo: `rosterProblems()` (lib/v3/races.ts) la ejecuta el hub de
// /dev y la pinta en rojo. La columna sigue aquí, pero ya no es la única que
// mira.
//
// SIGUE EN LA CADENA DE /dev, con `home` apuntando a esta ruta
// (lib/dev-registry.ts, módulo «razas»): que se mire en la wiki no la saca del
// orden de construcción — de ella cuelgan el catálogo de cartas, el combate y la
// baraja. El precedente es el marco de carta, que se construye en
// /docs/v3/cards/design desde el 1 de septiembre.
//
// NO ES LA FUENTE, ES LO QUE EL CÓDIGO HACE CON ELLA. Lo escrito a mano está en
// docs/v3/razas/unidades.md; esto es el cruce del roster crudo (traits.ts
// `parseRoster`) con la anatomía de /dev/personaje (races.ts
// `charactersOfRace`), leído en vivo. Si las dos tablas no dicen lo mismo, la
// que se equivoca no es siempre la misma — por eso conviene verlas separadas.
//
// LAS CINCO DE ESCALÓN SE VEN DISTINTAS A PROPÓSITO. 🛡️ 🔮 🎯 🍀 ⚡ salen en
// `DEFAULT_STEP` (lib/v3/races.ts) porque razas.md todavía no dice el escalón de
// cada ficha — es insumo de Dario, no un dato que falte leer. Se pintan
// atenuadas y con «por defecto» para que no se confundan con un número decidido,
// el mismo trato que reciben en /dev/personaje.
//
// Y SE VE LA COLISIÓN ARQUERO/MAGO PORQUE NO SE ESCONDE. Humanos ya trae dos de
// los 25 nombres duplicados héroe/unidad (README de races-concept, 24-ago-2026:
// se renombra la unidad, que es trabajo pendiente y no decisión) — su propio
// Arquero y su propio Mago se llaman igual que una unidad de su progresión. La
// tabla los enseña uno al lado del otro en vez de que haga falta ir a buscarlos.
//
// No decide nada y no tiene estado: recibe los Character ya construidos y los
// pinta (ARCHITECTURE.md §6).
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

export type RosterViewProps = {
  /** Las fichas de las razas piloto, ya construidas por lib/v3/races.ts. */
  characters: readonly Character[];
  /** Las 41 Características, para pintar el glifo y el nombre de cada rasgo. */
  catalog: readonly Trait[];
};

const PENDING = new Set(ABILITIES_WITHOUT_VALUES);

export default function RosterView({ characters, catalog }: RosterViewProps) {
  const label = "text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]";
  const card = "rounded-lg border border-[var(--wiki-border)] bg-[var(--wiki-surface)] p-3";

  // Una raza por sección, en el orden en que llegan (razas piloto: Humanos,
  // luego Enanos) — no se ordena alfabéticamente ni se supone cuántas hay.
  const races: string[] = [];
  for (const c of characters) {
    if (c.race && !races.includes(c.race)) races.push(c.race);
  }

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-[var(--wiki-text)]">El roster en datos</h1>
      <p className="mb-3 max-w-3xl text-sm text-[var(--wiki-muted)]">
        Las fichas de{" "}
        <Link href="/docs/v3/razas" className="text-[var(--wiki-accent)] hover:underline">
          las razas
        </Link>{" "}
        tal y como las construye el código: cruza el roster escrito en razas.md con la anatomía de{" "}
        <Link href="/dev/personaje" className="text-[var(--wiki-accent)] hover:underline">
          Estadísticas de personaje
        </Link>{" "}
        y sale un personaje legal —o no— por ficha. <b className="text-[var(--wiki-text)]">Nada se
        escribe a mano aquí</b>: si esta tabla cambia es porque cambió el documento. Lo escrito está
        en{" "}
        <Link
          href="/docs/v3/razas/unidades"
          className="text-[var(--wiki-accent)] hover:underline"
        >
          Unidades
        </Link>
        .
      </p>
      <p className="mb-5 max-w-3xl rounded-lg border border-[var(--wiki-border)] bg-[var(--wiki-surface)] p-3 text-sm text-[var(--wiki-muted)]">
        <b className="text-[var(--wiki-text)]">Razas piloto: Humanos y Enanos</b>, sus 12 fichas
        cada una —4 héroes y 8 unidades—, y nada más: las otras nueve esperan a que estas dos estén
        jugables (
        <Link href="/docs/v3/status" className="text-[var(--wiki-accent)] hover:underline">
          status
        </Link>{" "}
        §4). ❤️, ⚔️ y 👢 son reales —la curva de tier de cada raza y la banda de su tipo de daño—;
        las cinco atenuadas (
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
