"use client";

// =========================================================================
// Módulo «Estadísticas de personaje» de /dev — la anatomía de V3
//
// NO ES LA FICHA. Esto es la HOJA DE DATOS de un personaje; la ficha es el disco
// que se pone en el hexágono y anda por él, y es otro módulo (el 5, «Ficha de
// personaje», que en v2 se llamaba igual: board-map.md §4c). La palabra valía
// para las dos cosas hasta el 1 de septiembre de 2026 y ya no: el porqué está en
// la cabecera de lib/dev-registry.ts.
//
// La raíz de la cadena (lib/dev-registry.ts): no depende de nadie y de ella
// cuelgan el roster, el catálogo de cartas, la ficha del tablero y el motor de
// combate. Lo que se construye aquí es la ANATOMÍA —qué campos lleva un personaje,
// en qué escala va cada número y qué combinaciones son ilegales—, que está
// cerrada en el diseño desde el 23 de agosto de 2026; los VALORES no, y siguen
// siendo insumo pendiente de Dario (status.md §2, punto 3).
//
// POR QUÉ SE PUEDE CONSTRUIR SIN ELLOS, que es la pregunta que este módulo tenía
// encima: de los cuatro módulos que dependen de aquí, tres piden la FORMA y no
// las cifras —el roster necesita saber qué rellena, la carta qué imprime y el
// disco qué hay que poder leer encima—. Solo el motor de combate necesita
// números. Así que la anatomía desbloquea tres cuartas partes de su descendencia
// sin decidir una sola cifra, y eso es lo que hay en esta pantalla.
//
// LO QUE ESTA PANTALLA MIDE, porque una pantalla de /dev no está para enseñar
// datos sino para contestar algo:
//
//   · Si la escala aguanta un personaje real. Los topes no son un aviso que salta
//     al guardar: son el final del recorrido de cada dial, así que se ve dónde
//     hay sitio y dónde no. Los tres que dependen de OTRO campo —🍀 contra 🎯,
//     👢 contra el tipo de daño, el tier contra el papel— sí se pueden romper a
//     mano, y son los que enseñan algo al romperse.
//   · Si el catálogo de Características se sostiene en una carta. Se eligen
//     hasta cinco y se ven como el jugador las verá: glifos sin texto, uno al
//     lado de otro. Ahí se destapa el icono repetido, que hasta ahora se
//     encontraba mirando cartas de una en una.
//   · Qué significan de verdad 🎯 Precisión y 🍀 Suerte, en desenlaces por cien
//     ataques y con la banda real 65–95.
//
// El catálogo NO se escribe aquí: se lee de razas.md (lib/v3/traits.ts) y entra
// como props desde el Server Component de la ruta. Y ninguna regla vive en este
// archivo: todo son funciones de lib/v3/ (ARCHITECTURE.md §6). Lo único que hay
// aquí es estado de interfaz — el personaje que estás mirando.
// =========================================================================

import { useMemo, useState } from "react";
import Link from "next/link";
import { SelectButton } from "primereact/selectbutton";
import {
  ABILITIES_WITHOUT_VALUES,
  MAX_TRAITS,
  TIERS,
  blankCharacter,
  checks as checksOf,
  repeatedGlyphs,
  type AbilityId,
  type Character,
  type CharacterRole,
} from "@/lib/v3/character";
import { DAMAGE_TYPES, DAMAGE_TYPE_IDS, type DamageTypeId } from "@/lib/v3/damage";
import { MOVEMENT_BAND } from "@/lib/v3/tempo";
import type { Trait } from "@/lib/v3/traits";
import Button, { buttonClass } from "@/components/ui/Button";
import CharacterSheet from "./CharacterSheet";
import CharacterTraits from "./CharacterTraits";
import CharacterReadings from "./CharacterReadings";

const ROLES: readonly { label: string; value: CharacterRole }[] = [
  { label: "Unidad", value: "unidad" },
  { label: "Héroe", value: "heroe" },
];

export type CharacterModuleProps = {
  /** Las 41 Características, leídas de razas.md por el Server Component. */
  catalog: readonly Trait[];
};

export default function CharacterModule({ catalog }: CharacterModuleProps) {
  const [character, setCharacter] = useState<Character>(() =>
    blankCharacter("unidad", "cuerpo-a-cuerpo"),
  );

  const checks = useMemo(() => checksOf(character, catalog), [character, catalog]);
  const repeated = useMemo(() => repeatedGlyphs(character, catalog), [character, catalog]);
  const flagged = useMemo(
    () =>
      new Set(
        checks.filter((k) => !k.ok && k.ability).map((k) => k.ability as AbilityId),
      ),
    [checks],
  );
  const failed = checks.filter((k) => !k.ok).length;

  const setRole = (role: CharacterRole) =>
    setCharacter((c) => ({
      ...c,
      role,
      // El tier no es un campo que se quede vacío: una unidad lo tiene y un
      // héroe NO TIENE NADA en su lugar (status.md §5).
      tier: role === "unidad" ? (c.tier ?? 1) : undefined,
      name: role === "heroe" ? "Héroe sin nombre" : "Unidad sin nombre",
    }));

  const setDamage = (damage: DamageTypeId) =>
    setCharacter((c) => ({
      ...c,
      damage,
      abilities: {
        ...c.abilities,
        // Si 👢 iba en la banda del tipo anterior, sigue en la del nuevo: es un
        // valor del TIPO y no del personaje, así que lo normal es que le siga.
        // Si estaba salido a mano, se respeta y el aviso salta solo.
        movimiento:
          c.abilities.movimiento === MOVEMENT_BAND[c.damage]
            ? MOVEMENT_BAND[damage]
            : c.abilities.movimiento,
      },
    }));

  const label = "text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]";
  const card = "rounded-lg border border-[var(--wiki-border)] bg-[var(--wiki-surface)] p-3";

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="mb-1 text-2xl font-bold text-[var(--wiki-text)]">
        Estadísticas de personaje
      </h1>
      <p className="mb-3 max-w-3xl text-sm text-[var(--wiki-muted)]">
        La hoja de datos común a héroes, unidades y enemigos —que en V3{" "}
        <b className="text-[var(--wiki-text)]">son las mismas razas</b>, no un bestiario aparte—: las{" "}
        <Link href="/docs/v3/razas" className="text-[var(--wiki-accent)] hover:underline">
          8 Habilidades
        </Link>{" "}
        con su escala, el tipo de daño que trae puesto el alcance, y las{" "}
        {catalog.length} Características del catálogo. Es la raíz de la cadena de{" "}
        <Link href="/dev" className="text-[var(--wiki-accent)] hover:underline">
          /dev
        </Link>
        : no depende de nadie y de ella cuelga todo lo demás.
      </p>
      <p className="mb-5 max-w-3xl rounded-lg border border-[var(--wiki-border)] bg-[var(--wiki-surface)] p-3 text-sm text-[var(--wiki-muted)]">
        <b className="text-[var(--wiki-text)]">La anatomía está cerrada y los valores no.</b> De las
        ocho, solo <b className="text-[var(--wiki-text)]">👢 Movimiento</b> tiene número —🗡️ 3 · ✨ 2 ·
        🏹 1, banda por tipo de daño— y no se eligió a dedo: lo midió el duelo del arquero en el{" "}
        <Link href="/dev/tablero" className="text-[var(--wiki-accent)] hover:underline">
          laboratorio del tablero
        </Link>
        . Las otras <b className="text-[var(--wiki-text)]">{ABILITIES_WITHOUT_VALUES.length}</b>{" "}
        siguen siendo insumo pendiente, así que aquí son diales: lo que se construye es la escala en
        la que caben, no las 1.056 cifras. Un personaje en blanco arranca en el suelo de cada
        escala, y el suelo <b className="text-[var(--wiki-text)]">ya es legal</b>.
      </p>

      {/* --- Mandos --- */}
      <div className="mb-5 flex flex-wrap items-end gap-x-6 gap-y-3">
        <div
          className="flex flex-col gap-1"
          title="No es un matiz de sabor: la unidad tiene tier y el héroe no tiene nada en su lugar. V3 no tiene progresión de personaje (status.md §5)."
        >
          <span className={label}>Papel</span>
          <SelectButton
            value={character.role}
            onChange={(e) => e.value && setRole(e.value as CharacterRole)}
            options={ROLES as { label: string; value: CharacterRole }[]}
            optionLabel="label"
            optionValue="value"
            allowEmpty={false}
          />
        </div>

        <div
          className="flex flex-col gap-1"
          title="Su puesto en la progresión de ocho de su raza. Es el único eje de potencia que tiene el juego, y de él sale también la Rareza de su carta."
        >
          <span className={label}>
            Tier {character.role === "heroe" && <span className="opacity-60">· no aplica</span>}
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {Array.from({ length: TIERS }, (_, i) => i + 1).map((t) => (
              <button
                key={t}
                className={buttonClass({ size: "sm", active: character.tier === t })}
                disabled={character.role === "heroe"}
                onClick={() => setCharacter((c) => ({ ...c, tier: t }))}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div
          className="flex flex-col gap-1"
          title="Campo obligatorio de todo personaje, uno y solo uno. Trae puesto el alcance y decide contra qué número se resta su daño, así que la hoja no lleva campo de alcance (§4.3)."
        >
          <span className={label}>Tipo de daño</span>
          <div className="flex flex-wrap items-center gap-1.5">
            {DAMAGE_TYPE_IDS.map((id) => {
              const type = DAMAGE_TYPES[id];
              return (
                <button
                  key={id}
                  className={buttonClass({ active: character.damage === id })}
                  title={`${type.label} · alcance ${type.range} · lo frena ${
                    type.mitigatedBy === "defensa" ? "🛡️ Defensa" : "🔮 Resistencia mágica"
                  } · 👢 ${MOVEMENT_BAND[id]}`}
                  onClick={() => setDamage(id)}
                >
                  {type.icon} {type.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className={label}>Hoja</span>
          <Button
            onClick={() => setCharacter(blankCharacter(character.role, character.damage))}
            title="Vuelve al suelo de cada escala, que es el punto de partida honesto mientras los valores sean insumo pendiente."
          >
            En blanco
          </Button>
        </div>

        <div className="ml-auto flex flex-col gap-1">
          <span className={label}>Estado</span>
          <span
            className={`rounded-full border px-3 py-1 text-sm ${
              failed === 0
                ? "border-[var(--wiki-border)] text-[var(--wiki-muted)]"
                : "border-[var(--wiki-danger)] text-[var(--wiki-danger)]"
            }`}
          >
            {failed === 0 ? (
              <>
                <i className="pi pi-check mr-1.5 text-[0.75rem]" />
                personaje legal
              </>
            ) : (
              <>
                <i className="pi pi-times mr-1.5 text-[0.75rem]" />
                {failed} {failed === 1 ? "regla rota" : "reglas rotas"}
              </>
            )}
          </span>
        </div>
      </div>

      {/* --- La hoja y sus lecturas --- */}
      <div className="mb-4 grid gap-4 lg:grid-cols-[1fr_22rem]">
        <CharacterSheet
          className={card}
          character={character}
          catalog={catalog}
          flagged={flagged}
          onAbility={(id, value) =>
            setCharacter((c) => ({ ...c, abilities: { ...c.abilities, [id]: value } }))
          }
          onMovementToBand={() =>
            setCharacter((c) => ({
              ...c,
              abilities: { ...c.abilities, movimiento: MOVEMENT_BAND[c.damage] },
            }))
          }
        />
        <CharacterReadings className={card} character={character} checks={checks} />
      </div>

      {/* --- El catálogo --- */}
      <CharacterTraits
        className={`${card} mb-4`}
        catalog={catalog}
        chosen={character.traits}
        repeated={repeated}
        onToggle={(id) =>
          setCharacter((c) => ({
            ...c,
            traits: c.traits.includes(id)
              ? c.traits.filter((t) => t !== id)
              : c.traits.length >= MAX_TRAITS
                ? c.traits
                : [...c.traits, id],
          }))
        }
        onClear={() => setCharacter((c) => ({ ...c, traits: [] }))}
      />
    </div>
  );
}
