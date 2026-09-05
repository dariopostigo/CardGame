"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DEV_LAYERS,
  DEV_MODULES,
  DEV_STATUS_LABEL,
  moduleHref,
  orderOf,
  standInsOf,
  type DevModule,
} from "@/lib/dev-registry";

// Menú de /dev. Mismo criterio que el de /lab (components/lab/LabSidebar.tsx):
// lo planificado se lista apagado y sin enlace, porque el menú es también la
// hoja de ruta de V3 y no un índice de páginas que existan.
//
// Lo que no comparte con /lab es el ORDEN: aquí la lista está agrupada por las
// cuatro alturas de la cadena y numerada, y ese número es la posición real en
// lib/dev-registry.ts, no un adorno. Un módulo con deuda —los que se
// construyeron antes que sus dependencias y usan un remiendo en su lugar— lleva
// la llave inglesa; el detalle de qué usa en lugar de qué está en el hub.

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

      {DEV_LAYERS.map((layer) => {
        const modules = DEV_MODULES.filter((m) => m.layer === layer.id);
        if (modules.length === 0) return null;

        return (
          <div key={layer.id} className="mb-3">
            <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]">
              {layer.label}
            </p>
            <ul className="mt-1 space-y-0.5">
              {modules.map((m) => (
                <ModuleLink key={m.slug} module={m} pathname={pathname} onNavigate={onNavigate} />
              ))}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}

function ModuleLink({
  module: m,
  pathname,
  onNavigate,
}: {
  module: DevModule;
  pathname: string;
  onNavigate?: () => void;
}) {
  const href = moduleHref(m);
  const debts = standInsOf(m).length;

  const inner = (
    <>
      <span className="w-4 shrink-0 text-right text-[0.7rem] tabular-nums opacity-50">
        {orderOf(m.slug)}
      </span>
      <i className={`${m.icon} text-[0.85em] ${href ? "opacity-80" : "opacity-60"}`} />
      <span className="truncate">{m.label}</span>
    </>
  );

  if (!href) {
    return (
      <li>
        <span
          className="flex cursor-not-allowed items-center gap-2 rounded-md px-3 py-1.5 text-[var(--wiki-muted)] opacity-70"
          title={`${DEV_STATUS_LABEL[m.status]} — todavía sin construir`}
        >
          {inner}
          <i className="pi pi-clock ml-auto text-[0.7rem]" />
        </span>
      </li>
    );
  }

  return (
    <li>
      <Link
        href={href}
        onClick={onNavigate}
        className={`flex items-center gap-2 rounded-md px-3 py-1.5 transition-colors ${
          pathname === href
            ? "bg-[var(--wiki-accent-soft)] font-medium text-[var(--wiki-accent)]"
            : "text-[var(--wiki-text)] hover:bg-[var(--wiki-surface-2)]"
        }`}
      >
        {inner}
        {/* Se construye fuera de /dev: el marco de carta cuelga de la wiki. */}
        {m.home && <i className="pi pi-external-link ml-auto text-[0.7rem] opacity-60" />}
        {!m.home && debts > 0 && (
          <i
            className="pi pi-wrench ml-auto text-[0.7rem] opacity-60"
            title={`${debts} ${debts === 1 ? "dependencia" : "dependencias"} con sustituto provisional`}
          />
        )}
      </Link>
    </li>
  );
}
