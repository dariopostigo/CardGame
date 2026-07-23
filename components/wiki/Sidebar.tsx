"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { NavGroup } from "@/lib/docs";

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
              <i
                className={`pi ${isCollapsed ? "pi-chevron-right" : "pi-chevron-down"} ml-auto text-[0.7rem]`}
              />
            </button>
            {!isCollapsed && (
              <ul className="mt-1 space-y-0.5">
                {g.items.map((it) => {
                  const active = pathname === it.href;
                  return (
                    <li key={it.href}>
                      <Link
                        href={it.href}
                        onClick={onNavigate}
                        className={`flex items-center gap-2 rounded-md px-3 py-1.5 transition-colors ${
                          active
                            ? "bg-[var(--wiki-accent-soft)] font-medium text-[var(--wiki-accent)]"
                            : "text-[var(--wiki-text)] hover:bg-[var(--wiki-surface-2)]"
                        }`}
                      >
                        <i className={`${it.icon} text-[0.85em] opacity-80`} />
                        <span>{it.label}</span>
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
