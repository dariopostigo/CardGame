"use client";

// Menú de familias de un repositorio. Mismo trato que en /dev: las que están
// planificadas se listan apagadas y sin enlace, porque el menú es también el
// mapa de lo que falta. En repository-pro eso es TODA la lista, y así debe
// verse: el índice del trabajo pendiente del tema medieval.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BUILD_STATUS_LABEL } from "@/lib/sections";
import { groupsOf, isBuilt, type RepoSide } from "@/lib/repository";

export default function RepoSidebar({
  side,
  onNavigate,
}: {
  side: RepoSide;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const root = `/repository-${side}`;
  const groups = groupsOf(side);

  return (
    <nav className="p-3 text-sm">
      <Link
        href={root}
        onClick={onNavigate}
        className={`mb-3 flex items-center gap-2 rounded-md px-3 py-1.5 transition-colors ${
          pathname === root
            ? "bg-[var(--wiki-accent-soft)] font-medium text-[var(--wiki-accent)]"
            : "text-[var(--wiki-text)] hover:bg-[var(--wiki-surface-2)]"
        }`}
      >
        <i className="pi pi-th-large text-[0.85em] opacity-80" />
        <span>Todas las familias</span>
      </Link>

      <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]">
        Familias
      </p>
      <ul className="mt-1 space-y-0.5">
        {groups.map((group) => {
          const href = `${root}/${group.slug}`;
          const active = pathname === href;

          if (!isBuilt(group)) {
            return (
              <li key={group.slug}>
                <span
                  className="flex cursor-not-allowed items-center gap-2 rounded-md px-3 py-1.5 text-[var(--wiki-muted)] opacity-70"
                  title={`${BUILD_STATUS_LABEL[group.status]} — todavía sin construir`}
                >
                  <i className={`${group.icon} text-[0.85em] opacity-60`} />
                  <span>{group.label}</span>
                  <i className="pi pi-clock ml-auto text-[0.7rem]" />
                </span>
              </li>
            );
          }

          return (
            <li key={group.slug}>
              <Link
                href={href}
                onClick={onNavigate}
                className={`flex items-center gap-2 rounded-md px-3 py-1.5 transition-colors ${
                  active
                    ? "bg-[var(--wiki-accent-soft)] font-medium text-[var(--wiki-accent)]"
                    : "text-[var(--wiki-text)] hover:bg-[var(--wiki-surface-2)]"
                }`}
              >
                <i className={`${group.icon} text-[0.85em] opacity-80`} />
                <span>{group.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
