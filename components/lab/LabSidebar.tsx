"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LABS, LAB_STATUS_LABEL, isAvailable } from "@/lib/lab-registry";

// Menú de laboratorios. Los planificados se listan apagados y sin enlace: son
// el mapa de ruta, no páginas que existan todavía.

export default function LabSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="p-3 text-sm">
      <Link
        href="/lab"
        onClick={onNavigate}
        className={`mb-3 flex items-center gap-2 rounded-md px-3 py-1.5 transition-colors ${
          pathname === "/lab"
            ? "bg-[var(--wiki-accent-soft)] font-medium text-[var(--wiki-accent)]"
            : "text-[var(--wiki-text)] hover:bg-[var(--wiki-surface-2)]"
        }`}
      >
        <i className="pi pi-th-large text-[0.85em] opacity-80" />
        <span>Todos los laboratorios</span>
      </Link>

      <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]">
        Laboratorios
      </p>
      <ul className="mt-1 space-y-0.5">
        {LABS.map((lab) => {
          const href = `/lab/${lab.slug}`;
          const active = pathname === href;

          if (!isAvailable(lab)) {
            return (
              <li key={lab.slug}>
                <span
                  className="flex cursor-not-allowed items-center gap-2 rounded-md px-3 py-1.5 text-[var(--wiki-muted)] opacity-70"
                  title={`${LAB_STATUS_LABEL[lab.status]} — todavía sin construir`}
                >
                  <i className={`${lab.icon} text-[0.85em] opacity-60`} />
                  <span>{lab.label}</span>
                  <i className="pi pi-clock ml-auto text-[0.7rem]" />
                </span>
              </li>
            );
          }

          return (
            <li key={lab.slug}>
              <Link
                href={href}
                onClick={onNavigate}
                className={`flex items-center gap-2 rounded-md px-3 py-1.5 transition-colors ${
                  active
                    ? "bg-[var(--wiki-accent-soft)] font-medium text-[var(--wiki-accent)]"
                    : "text-[var(--wiki-text)] hover:bg-[var(--wiki-surface-2)]"
                }`}
              >
                <i className={`${lab.icon} text-[0.85em] opacity-80`} />
                <span>{lab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
