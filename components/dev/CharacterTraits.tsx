"use client";

// =========================================================================
// El catálogo de Características, para elegir (presentacional)
//
// Las 41 de razas.md en sus seis grupos, leídas del markdown y no copiadas
// (lib/v3/traits.ts). Elegir es lo único que hace: de 0 a 5, y al llegar a
// cinco el resto se apaga en vez de dejar pasar una sexta — el tope es del
// marco, que ya lo gastan seis unidades de tier 8.
//
// SE PINTAN CON SU NOMBRE, y en la carta no. Ahí son glifos sin texto, así que
// aquí hace falta el nombre para poder elegir y la fila de glifos de la hoja
// (CharacterSheet) para ver lo que el jugador verá. Son dos vistas de lo mismo
// a propósito: el icono repetido solo se ve en la segunda.
//
// El grupo no es una quinta clasificación: es el orden del documento, y sirve
// para encontrar un rasgo entre cuarenta y uno.
// =========================================================================

import {
  TRAIT_GROUPS,
  type Trait,
  type TraitGroupId,
} from "@/lib/v3/traits";
import { MAX_TRAITS } from "@/lib/v3/character";
import Button, { buttonClass } from "@/components/ui/Button";

export type CharacterTraitsProps = {
  catalog: readonly Trait[];
  /** Ids elegidas, en el orden en que se eligieron. */
  chosen: readonly string[];
  onToggle: (id: string) => void;
  onClear: () => void;
  /** Los emojis que la carta enseñaría repetidos, si hay alguno. */
  repeated: readonly { readonly icon: string; readonly labels: readonly string[] }[];
  className?: string;
};

export default function CharacterTraits({
  catalog,
  chosen,
  onToggle,
  onClear,
  repeated,
  className,
}: CharacterTraitsProps) {
  const full = chosen.length >= MAX_TRAITS;
  const picked = new Set(chosen);

  return (
    <div className={className}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="font-semibold text-[var(--wiki-text)]">
            Características · {chosen.length} de {MAX_TRAITS}
          </div>
          <p className="mt-0.5 max-w-2xl text-xs text-[var(--wiki-muted)]">
            Las {catalog.length} de razas.md, en sus {TRAIT_GROUPS.length} grupos. El tope de cinco
            no es del gusto: es lo que ya gastan seis unidades de tier 8, y si se congela ahí sigue
            siendo una decisión abierta.
          </p>
        </div>
        <Button size="sm" onClick={onClear} disabled={chosen.length === 0}>
          Vaciar
        </Button>
      </div>

      {/* El aviso que no es ilegal pero se ve en la carta. */}
      {repeated.length > 0 && (
        <div className="mb-3 rounded-md border border-[var(--wiki-accent)] bg-[var(--wiki-surface-2)] p-2.5 text-xs text-[var(--wiki-muted)]">
          <i className="pi pi-exclamation-circle mr-1.5 text-[var(--wiki-accent)]" />
          En la carta las Características son glifos sin texto, así que este personaje enseñaría el
          mismo icono dos veces:
          {repeated.map((r) => (
            <span key={r.icon} className="ml-1 text-[var(--wiki-text)]">
              {r.icon} {r.labels.join(" + ")}.
            </span>
          ))}{" "}
          Las familias elementales lo hacen queriendo; el resto es un choque que se arregla en
          razas.md.
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {TRAIT_GROUPS.map((group) => (
          <TraitGroupBlock
            key={group.id}
            id={group.id}
            icon={group.icon}
            label={group.label}
            traits={catalog.filter((t) => t.group === group.id)}
            picked={picked}
            full={full}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  );
}

function TraitGroupBlock({
  icon,
  label,
  traits,
  picked,
  full,
  onToggle,
}: {
  id: TraitGroupId;
  icon: string;
  label: string;
  traits: readonly Trait[];
  picked: ReadonlySet<string>;
  full: boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]">
        {icon} {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {traits.map((t) => {
          const on = picked.has(t.id);
          return (
            <button
              key={t.id}
              className={buttonClass({ size: "sm", active: on })}
              // El texto de razas.md, tal cual: es la definición del rasgo y no
              // hay una segunda escrita en ningún sitio.
              title={t.description}
              disabled={full && !on}
              onClick={() => onToggle(t.id)}
            >
              <span className="mr-1">{t.icon}</span>
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
