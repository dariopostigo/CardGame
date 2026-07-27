// Piezas de presentación de un repositorio: el marco donde se enseña cada
// componente. No son componentes del producto ni de las herramientas, son la
// vitrina; por eso viven aquí y no en components/ui/ ni en components/game/.
//
// Server Components a propósito (ni un "use client"): la mayoría de las fichas
// son estáticas y solo el especimen que necesita estado se envuelve en su
// propio componente de cliente.

import type { ReactNode } from "react";
import { BUILD_STATUS_LABEL } from "@/lib/sections";
import type { ComponentGroup } from "@/lib/repository";

/** Cabecera de una página de familia. Sale del registro, no se escribe a mano. */
export function GroupHeader({ group }: { group: ComponentGroup }) {
  return (
    <header className="mb-8">
      <div className="mb-1 flex items-center gap-2">
        <i className={`${group.icon} text-lg text-[var(--wiki-accent)]`} />
        <h1 className="text-2xl font-bold text-[var(--wiki-text)]">{group.label}</h1>
        {group.status !== "listo" && (
          <span className="rounded-full border border-[var(--wiki-accent)] px-2 py-0.5 text-[0.7rem] uppercase tracking-wide text-[var(--wiki-accent)]">
            {BUILD_STATUS_LABEL[group.status]}
          </span>
        )}
      </div>
      <p className="max-w-3xl text-sm text-[var(--wiki-muted)]">{group.summary}</p>
      {group.source && (
        <p className="mt-2 text-xs text-[var(--wiki-muted)]">
          Vive en{" "}
          <code className="rounded bg-[var(--wiki-code-bg)] px-1.5 py-0.5 text-[0.9em]">
            {group.source}
          </code>
        </p>
      )}
    </header>
  );
}

/** Bloque de la página: un tipo de pieza con todas sus variantes. */
export function Family({
  title,
  note,
  children,
}: {
  title: string;
  note?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="mb-10">
      <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]">
        {title}
      </h2>
      {note && <p className="mb-3 max-w-3xl text-sm text-[var(--wiki-muted)]">{note}</p>}
      <div className={note ? "" : "mt-3"}>{children}</div>
    </section>
  );
}

/**
 * Un especimen: el componente sobre un lienzo neutro, con su rótulo y, si hace
 * falta, la nota de cuándo usarlo. El lienzo es deliberadamente sobrio y
 * distinto del fondo de la página: sin un borde que delimite el componente no
 * se sabe qué es margen del especimen y qué es aire de la vitrina.
 */
export function Specimen({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <figure className="repo-specimen">
      <div className="repo-specimen__canvas">{children}</div>
      <figcaption className="repo-specimen__caption">
        <span className="repo-specimen__label">{label}</span>
        {hint && <span className="repo-specimen__hint">{hint}</span>}
      </figcaption>
    </figure>
  );
}

/** Rejilla de especímenes. Se estrecha sola en pantalla pequeña. */
export function SpecimenGrid({ children }: { children: ReactNode }) {
  return <div className="repo-specimen-grid">{children}</div>;
}

/** Fila de piezas dentro de un lienzo: botones o chips uno al lado del otro. */
export function Cluster({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-3">{children}</div>;
}
