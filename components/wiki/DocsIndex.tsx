import Link from "next/link";
import { getNavTree } from "@/lib/docs";

export default function DocsIndex() {
  const nav = getNavTree();
  return (
    <div className="wiki-prose prose">
      <h1>CardGame — Wiki de diseño</h1>
      <p>
        Documentación de diseño del juego de cartas y tablero. Explora por
        secciones o usa el buscador de la barra superior.
      </p>
      <div className="not-prose mt-6 grid gap-4 sm:grid-cols-2">
        {nav.map((g) => (
          <div
            key={g.key}
            className="rounded-xl border border-[var(--wiki-border)] bg-[var(--wiki-surface)] p-4"
          >
            <div className="mb-2 flex items-center gap-2 font-semibold">
              <i className={`${g.icon} text-[var(--wiki-accent)]`} />
              <span>{g.label}</span>
            </div>
            <ul className="space-y-1">
              {g.items.map((it) => (
                <li key={it.href}>
                  <Link
                    href={it.href}
                    className="flex items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-[var(--wiki-surface-2)]"
                  >
                    <i className={`${it.icon} text-[0.85em] opacity-80`} />
                    <span>{it.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
