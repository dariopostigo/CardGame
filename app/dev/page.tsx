import Link from "next/link";
import type { Metadata } from "next";
import { DEV_MODULES, DEV_STATUS_LABEL, isAvailable, type DevModule } from "@/lib/dev-registry";

// Hub de /dev. Sale entero de lib/dev-registry.ts, así que un módulo nuevo
// aparece aquí solo con añadir su entrada — igual que el hub de /lab.

export const metadata: Metadata = {
  title: "Construcción de V3",
  description:
    "La implementación de la versión 3 de CardGame: ficha de personaje, motor de combate, estados, razas, cartas y tableros.",
};

export default function DevIndexPage() {
  const active = DEV_MODULES.filter(isAvailable);
  const planned = DEV_MODULES.filter((m) => !isAvailable(m));

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-1 text-2xl font-bold text-[var(--wiki-text)]">Construcción de V3</h1>
      <p className="mb-4 max-w-3xl text-sm text-[var(--wiki-muted)]">
        Aquí se implementa el juego nuevo: razas, las 8 Habilidades, Características y un combate
        que se resuelve sin dados. El motor vivirá en{" "}
        <code className="rounded bg-[var(--wiki-code-bg)] px-1.5 py-0.5 text-[0.8em]">
          lib/v3/
        </code>
        , y su diseño es el de la{" "}
        <Link href="/docs/v3" className="text-[var(--wiki-accent)] hover:underline">
          Wiki V3
        </Link>
        .
      </p>

      {active.length === 0 && (
        <div className="mb-10 rounded-lg border border-dashed border-[var(--wiki-border)] bg-[var(--wiki-surface)] p-5">
          <p className="mb-2 flex items-center gap-2 font-semibold text-[var(--wiki-text)]">
            <i className="pi pi-clock text-[var(--wiki-accent)]" />
            Todavía sin nada implementado
          </p>
          <p className="text-sm text-[var(--wiki-muted)]">
            No es un olvido: el motor de combate de V3 aún no está definido en la wiki, y hasta que
            lo esté, cualquier cosa que se construya aquí habría que rehacerla. Mientras tanto, el
            motor anterior sigue funcionando en{" "}
            <Link href="/lab" className="text-[var(--wiki-accent)] hover:underline">
              Lab
            </Link>
            . Lo que falta por decidir está en{" "}
            <Link
              href="/docs/v3/status"
              className="text-[var(--wiki-accent)] hover:underline"
            >
              Estado del diseño
            </Link>
            .
          </p>
        </div>
      )}

      {active.length > 0 && (
        <>
          <h2 className="mb-3 mt-8 text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]">
            En marcha
          </h2>
          <div className="mb-10 grid gap-4 sm:grid-cols-2">
            {active.map((m) => (
              <ModuleCard key={m.slug} module={m} />
            ))}
          </div>
        </>
      )}

      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]">
        Por construir ({planned.length})
      </h2>
      <p className="mb-4 max-w-3xl text-xs text-[var(--wiki-muted)]">
        En orden de dependencia: cada uno necesita que el anterior esté resuelto.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {planned.map((m) => (
          <ModuleCard key={m.slug} module={m} />
        ))}
      </div>
    </div>
  );
}

function ModuleCard({ module: m }: { module: DevModule }) {
  const available = isAvailable(m);

  const body = (
    <>
      <span className="flex items-center gap-2">
        <i className={`${m.icon} text-lg text-[var(--wiki-accent)]`} />
        <span className="font-semibold text-[var(--wiki-text)]">{m.label}</span>
        <span
          className={`ml-auto rounded-full border px-2 py-0.5 text-[0.7rem] uppercase tracking-wide ${
            m.status === "en-curso"
              ? "border-[var(--wiki-accent)] text-[var(--wiki-accent)]"
              : "border-[var(--wiki-border)] text-[var(--wiki-muted)]"
          }`}
        >
          {DEV_STATUS_LABEL[m.status]}
        </span>
      </span>
      <span className="text-sm text-[var(--wiki-muted)]">{m.summary}</span>
      {m.blocker && (
        <span className="flex items-start gap-1.5 text-xs text-[var(--wiki-muted)]">
          <i className="pi pi-lock mt-0.5 text-[0.7rem]" />
          <span>{m.blocker}</span>
        </span>
      )}
      {/* Texto plano, no enlace: cuando la tarjeta sea navegable no se puede
          anidar un <a> dentro de otro. El enlace al documento irá en el módulo. */}
      {m.doc && (
        <span className="mt-auto text-xs text-[var(--wiki-muted)]">Diseño: {m.doc.label}</span>
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
      href={`/dev/${m.slug}`}
      className={`${shell} transition-colors hover:border-[var(--wiki-accent)]`}
    >
      {body}
    </Link>
  );
}
