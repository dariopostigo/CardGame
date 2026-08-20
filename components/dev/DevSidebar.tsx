"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DEV_MODULES, DEV_STATUS_LABEL, isAvailable } from "@/lib/dev-registry";

// Menú de /dev. Mismo criterio que el de /lab (components/lab/LabSidebar.tsx):
// lo planificado se lista apagado y sin enlace. Hoy lo está todo — el menú es
// la hoja de ruta de V3, no un índice de páginas que existan.

export default function DevSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="p-3 text-sm">
      <Link
        href="/dev"
        onClick={onNavigate}
        className={`mb-3 flex items-center gap-2 rounded-md px-3 py-1.5 transition-colors ${
          pathname === "/dev"
            ? "bg-[var(--wiki-accent-soft)] font-medium text-[var(--wiki-accent)]"
            : "text-[var(--wiki-text)] hover:bg-[var(--wiki-surface-2)]"
        }`}
      >
        <i className="pi pi-th-large text-[0.85em] opacity-80" />
        <span>Todo el proyecto</span>
      </Link>

      <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]">
        Construcción de V3
      </p>
      <ul className="mt-1 space-y-0.5">
        {DEV_MODULES.map((m) => {
          const href = `/dev/${m.slug}`;
          const active = pathname === href;

          if (!isAvailable(m)) {
            return (
              <li key={m.slug}>
                <span
                  className="flex cursor-not-allowed items-center gap-2 rounded-md px-3 py-1.5 text-[var(--wiki-muted)] opacity-70"
                  title={`${DEV_STATUS_LABEL[m.status]} — todavía sin construir`}
                >
                  <i className={`${m.icon} text-[0.85em] opacity-60`} />
                  <span>{m.label}</span>
                  <i className="pi pi-clock ml-auto text-[0.7rem]" />
                </span>
              </li>
            );
          }

          return (
            <li key={m.slug}>
              <Link
                href={href}
                onClick={onNavigate}
                className={`flex items-center gap-2 rounded-md px-3 py-1.5 transition-colors ${
                  active
                    ? "bg-[var(--wiki-accent-soft)] font-medium text-[var(--wiki-accent)]"
                    : "text-[var(--wiki-text)] hover:bg-[var(--wiki-surface-2)]"
                }`}
              >
                <i className={`${m.icon} text-[0.85em] opacity-80`} />
                <span>{m.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
