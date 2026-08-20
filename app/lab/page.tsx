import Link from "next/link";
import type { Metadata } from "next";
import { LABS, LAB_STATUS_LABEL, isAvailable, type Lab } from "@/lib/lab-registry";

// Hub de laboratorios. Sale entero de lib/lab-registry.ts, así que un laboratorio
// nuevo aparece aquí solo con añadir su entrada.

export const metadata: Metadata = {
  title: "Laboratorios",
  description:
    "Laboratorios de desarrollo de CardGame: losetas, generación de tablero, fichas, baraja, combate y animaciones.",
};

export default function LabIndexPage() {
  const active = LABS.filter(isAvailable);
  const planned = LABS.filter((l) => !isAvailable(l));

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-1 text-2xl font-bold text-[var(--wiki-text)]">Laboratorios</h1>
      <p className="mb-8 max-w-3xl text-sm text-[var(--wiki-muted)]">
        Cada pieza del videojuego se construye y se prueba en su propio laboratorio, aislada del
        resto. Las reglas viven en el motor (
        <code className="rounded bg-[var(--wiki-code-bg)] px-1.5 py-0.5 text-[0.8em]">
          lib/v2/rules/
        </code>
        , funciones puras y deterministas) y cada laboratorio solo es una ventana para mirarlas; por
        eso lo que se afina aquí sirve igual en el juego y en el simulador de balance.
      </p>

      {active.length > 0 && (
        <>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]">
            En marcha
          </h2>
          <div className="mb-10 grid gap-4 sm:grid-cols-2">
            {active.map((lab) => (
              <LabCard key={lab.slug} lab={lab} />
            ))}
          </div>
        </>
      )}

      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]">
        Por construir ({planned.length})
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {planned.map((lab) => (
          <LabCard key={lab.slug} lab={lab} />
        ))}
      </div>
    </div>
  );
}

function LabCard({ lab }: { lab: Lab }) {
  const available = isAvailable(lab);

  const body = (
    <>
      <span className="flex items-center gap-2">
        <i className={`${lab.icon} text-lg text-[var(--wiki-accent)]`} />
        <span className="font-semibold text-[var(--wiki-text)]">{lab.label}</span>
        <span
          className={`ml-auto rounded-full border px-2 py-0.5 text-[0.7rem] uppercase tracking-wide ${
            lab.status === "en-curso"
              ? "border-[var(--wiki-accent)] text-[var(--wiki-accent)]"
              : "border-[var(--wiki-border)] text-[var(--wiki-muted)]"
          }`}
        >
          {LAB_STATUS_LABEL[lab.status]}
        </span>
      </span>
      <span className="text-sm text-[var(--wiki-muted)]">{lab.summary}</span>
      {/* Texto plano, no enlace: la tarjeta entera ya lo es y no se puede
          anidar un <a> dentro de otro. El enlace al documento va en el lab. */}
      {lab.doc && (
        <span className="mt-auto text-xs text-[var(--wiki-muted)]">Diseño: {lab.doc.label}</span>
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
      href={`/lab/${lab.slug}`}
      className={`${shell} transition-colors hover:border-[var(--wiki-accent)] hover:bg-[var(--wiki-surface-2)]`}
    >
      {body}
    </Link>
  );
}
