"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { NavGroup } from "@/lib/docs";
import { DOC_STATUS_HELP, DOC_STATUS_LABEL } from "@/lib/doc-status";

// El estado de cada documento se lee del propio .md (lib/doc-status.ts) y aquí
// solo se pinta, con una regla: SE ETIQUETA LO QUE SE SALE DE LA NORMA. El
// grupo dice su estado por defecto una vez, en la cabecera, y las entradas que
// lo comparten se callan. Con 14 de 18 documentos de V3 en el mismo estado, la
// alternativa —etiquetarlas todas— era una columna de palabras repetidas que
// tapaba justo el caso raro.
//
// El caso raro es `en-espera`, y ese no se marca: se apaga. No es enlace, va
// tachado y en gris, porque no está esperando a que alguien lo escriba —está
// esperando a que se decida si sigue existiendo—. Se llega a él desde el
// índice de su grupo, que es donde está contado por qué.

const CHIP = "ml-auto shrink-0 text-[0.6rem] uppercase tracking-wide opacity-70";

export default function Sidebar({
  nav,
  onNavigate,
}: {
  nav: NavGroup[];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const toggle = (k: string) => setCollapsed((c) => ({ ...c, [k]: !c[k] }));

  return (
    <nav className="p-3 text-sm">
      {nav.map((g) => {
        const isCollapsed = collapsed[g.key];
        return (
          <div key={g.key} className="mb-4">
            <button
              onClick={() => toggle(g.key)}
              className="flex w-full items-center gap-2 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]"
            >
              <i className={g.icon} />
              <span>{g.label}</span>
              {g.defaultStatus && (
                <span
                  title={`Por defecto en este grupo. ${DOC_STATUS_HELP[g.defaultStatus]}`}
                  className="font-normal normal-case opacity-70"
                >
                  · {DOC_STATUS_LABEL[g.defaultStatus]}
                </span>
              )}
              <i
                className={`pi ${isCollapsed ? "pi-chevron-right" : "pi-chevron-down"} ml-auto text-[0.7rem]`}
              />
            </button>
            {!isCollapsed && (
              <ul className="mt-1 space-y-0.5">
                {g.items.map((it) => {
                  const active = pathname === it.href;
                  // Solo lo que difiere de la norma del grupo.
                  const status =
                    it.status && it.status !== g.defaultStatus ? it.status : null;

                  if (status === "en-espera") {
                    return (
                      <li key={it.href}>
                        <span
                          aria-disabled="true"
                          title={`${DOC_STATUS_HELP["en-espera"]} Se lee desde el índice del grupo.`}
                          className="flex cursor-not-allowed items-center gap-2 rounded-md px-3 py-1.5 text-[var(--wiki-muted)] opacity-60"
                        >
                          <i className={`${it.icon} text-[0.85em] opacity-80`} />
                          <span className="line-through decoration-from-font">
                            {it.label}
                          </span>
                          <span className={CHIP}>
                            {DOC_STATUS_LABEL["en-espera"]}
                          </span>
                        </span>
                      </li>
                    );
                  }

                  return (
                    <li key={it.href}>
                      <Link
                        href={it.href}
                        onClick={onNavigate}
                        title={status ? DOC_STATUS_HELP[status] : undefined}
                        className={`flex items-center gap-2 rounded-md px-3 py-1.5 transition-colors ${
                          active
                            ? "bg-[var(--wiki-accent-soft)] font-medium text-[var(--wiki-accent)]"
                            : "text-[var(--wiki-text)] hover:bg-[var(--wiki-surface-2)]"
                        }`}
                      >
                        <i className={`${it.icon} text-[0.85em] opacity-80`} />
                        <span>{it.label}</span>
                        {status && (
                          <span className={`${CHIP} text-[var(--wiki-muted)]`}>
                            {DOC_STATUS_LABEL[status]}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </nav>
  );
}
