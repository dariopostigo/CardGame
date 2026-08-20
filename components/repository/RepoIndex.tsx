// Hub de un repositorio: la rejilla de familias, en marcha arriba y por
// construir abajo. Sale entero de lib/repository.ts, igual que el hub de /dev
// sale de lib/lab-registry.ts, así que una familia nueva aparece aquí sola.
//
// La intro la pone cada lado: lo que hay que explicar en el repositorio de
// herramientas (qué skin, qué kit) no tiene nada que ver con lo que hay que
// explicar en el medieval (que está vacío y por qué).

import Link from "next/link";
import type { ReactNode } from "react";
import { BUILD_STATUS_LABEL } from "@/lib/sections";
import { groupsOf, isBuilt, type ComponentGroup, type RepoSide } from "@/lib/repository";

export default function RepoIndex({
  side,
  title,
  intro,
}: {
  side: RepoSide;
  title: string;
  intro: ReactNode;
}) {
  const groups = groupsOf(side);
  const built = groups.filter(isBuilt);
  const planned = groups.filter((g) => !isBuilt(g));

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-1 text-2xl font-bold text-[var(--wiki-text)]">{title}</h1>
      <div className="mb-8 max-w-3xl text-sm text-[var(--wiki-muted)]">{intro}</div>

      {built.length > 0 && (
        <>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]">
            En marcha
          </h2>
          <div className="mb-10 grid gap-4 sm:grid-cols-2">
            {built.map((group) => (
              <GroupCard key={group.slug} side={side} group={group} />
            ))}
          </div>
        </>
      )}

      {planned.length > 0 && (
        <>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]">
            Por construir ({planned.length})
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {planned.map((group) => (
              <GroupCard key={group.slug} side={side} group={group} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function GroupCard({ side, group }: { side: RepoSide; group: ComponentGroup }) {
  const available = isBuilt(group);

  const body = (
    <>
      <span className="flex items-center gap-2">
        <i className={`${group.icon} text-lg text-[var(--wiki-accent)]`} />
        <span className="font-semibold text-[var(--wiki-text)]">{group.label}</span>
        <span
          className={`ml-auto rounded-full border px-2 py-0.5 text-[0.7rem] uppercase tracking-wide ${
            group.status === "en-curso"
              ? "border-[var(--wiki-accent)] text-[var(--wiki-accent)]"
              : "border-[var(--wiki-border)] text-[var(--wiki-muted)]"
          }`}
        >
          {BUILD_STATUS_LABEL[group.status]}
        </span>
      </span>
      <span className="text-sm text-[var(--wiki-muted)]">{group.summary}</span>
      {/* Texto plano, no enlace: la tarjeta entera ya lo es. */}
      {group.source && (
        <span className="mt-auto text-xs text-[var(--wiki-muted)]">
          <code className="rounded bg-[var(--wiki-code-bg)] px-1.5 py-0.5 text-[0.9em]">
            {group.source}
          </code>
        </span>
      )}
    </>
  );

  const shell =
    "flex h-full flex-col gap-2 rounded-lg border border-[var(--wiki-border)] bg-[var(--wiki-surface)] p-4";

  if (!available) {
    return <div className={`${shell} opacity-60`}>{body}</div>;
  }

  return (
    <Link
      href={`/repository-${side}/${group.slug}`}
      className={`${shell} transition-colors hover:border-[var(--wiki-accent)] hover:bg-[var(--wiki-surface-2)]`}
    >
      {body}
    </Link>
  );
}
