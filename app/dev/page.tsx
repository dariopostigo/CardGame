import Link from "next/link";
import type { Metadata } from "next";
import {
  DEV_LAYERS,
  DEV_MODULES,
  DEV_MODULES_BY_SLUG,
  DEV_STATUS_LABEL,
  dependencyProblems,
  isAvailable,
  moduleHref,
  orderOf,
  standInsOf,
  type DevModule,
} from "@/lib/dev-registry";
import { pilotCharacters, rosterProblems } from "@/lib/v3/races";
import { getRoster, getTraitCatalog } from "@/lib/v3/traits-catalog";

// Hub de /dev. Sale entero de lib/dev-registry.ts, así que un módulo nuevo
// aparece aquí solo con añadir su entrada — igual que el hub de /lab.
//
// MANDA EL ORDEN, NO EL ESTADO. Antes esta página partía la lista en dos
// rejillas —«En marcha» y «Por construir»— y con eso el último eslabón de la
// cadena salía arriba del todo. Ahora es una sola columna descendente, de lo
// general a lo que depende de ello, y el estado es un distintivo. El coste
// aceptado es que lo construido queda repartido por la lista en vez de junto;
// a cambio se lee de arriba abajo y se ve dónde estás.
//
// Y AQUÍ SUENAN LAS DOS ALARMAS DE V3 (la segunda, desde el 10 de septiembre de
// 2026). `dependencyProblems()` vigila que este mapa no mienta —que nadie
// dependa de un slug que no existe o de uno que va después—, y `rosterProblems()`
// que razas.md siga produciendo fichas legales. La segunda estaba dibujada en
// una columna de /dev/razas y de /dev/cartas, y al mudarse esas dos tablas a la
// wiki se habría quedado en un sitio al que hay que acordarse de ir. El hub sí
// se abre, así que se comprueba al abrirlo.

// El roster se lee de knowledge/v3/races-concept/razas.md con node:fs, y Next
// no rastrea esas lecturas: sin esto, la alarma se congelaría en la foto del
// primer render y seguiría diciendo que todo va bien después de romper el
// documento.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Construcción de V3",
  description:
    "La implementación de la versión 3 de CardGame, en orden de dependencia: de la ficha de personaje a la animación.",
};

/** Un nombre de archivo o de carpeta va en código, aquí y en la entradilla. */
const CODE = "rounded bg-[var(--wiki-code-bg)] px-1.5 py-0.5 text-[0.8em]";

/**
 * El estado del roster derivado: cuántas fichas salen de razas.md y qué no
 * cuadra en ellas.
 *
 * Atrapa TODO, incluida la lectura del documento: `getRoster()` y
 * `getTraitCatalog()` lanzan si razas.md no tiene la forma esperada, y un hub
 * que revienta por eso deja de avisar justo el día que hay algo de lo que
 * avisar. El fallo se cuenta como problema, que es lo que es.
 */
function rosterAlarm(): { count: number; problems: readonly string[] } {
  try {
    const catalog = getTraitCatalog();
    const roster = getRoster();
    const problems = rosterProblems(roster, catalog);
    // `pilotCharacters` sí lanza con lo que `rosterProblems` acaba de contar sin
    // lanzar, así que solo se le pregunta el número cuando no hay nada roto —y
    // cuando lo hay, el número no es lo que se está mirando.
    const count = problems.length === 0 ? pilotCharacters(roster, catalog).length : 0;
    return { count, problems };
  } catch (err) {
    return { count: 0, problems: [`razas.md no se puede leer: ${(err as Error).message}`] };
  }
}

export default function DevIndexPage() {
  const problems = dependencyProblems();
  const roster = rosterAlarm();
  const built = DEV_MODULES.filter(isAvailable).length;

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-1 text-2xl font-bold text-[var(--wiki-text)]">Construcción de V3</h1>
      <p className="mb-3 text-sm text-[var(--wiki-muted)]">
        Aquí se implementa el juego nuevo: razas, las 8 Habilidades, Características y un combate
        que se resuelve sin dados. El motor vive en{" "}
        <code className={CODE}>lib/v3/</code>
        , y su diseño es el de la{" "}
        <Link href="/docs/v3" className="text-[var(--wiki-accent)] hover:underline">
          Wiki V3
        </Link>
        .
      </p>
      <p className="mb-8 max-w-3xl rounded-lg border border-[var(--wiki-border)] bg-[var(--wiki-surface)] p-3 text-sm text-[var(--wiki-muted)]">
        <strong className="text-[var(--wiki-text)]">La lista va de lo general a lo que depende
        de ello</strong>, y ese orden manda sobre el estado: cada módulo declara de quién necesita
        algo, así que se lee de arriba abajo. Cuando uno se ha construido antes que sus
        dependencias, lo que usa en su lugar sale marcado como{" "}
        <span className="font-medium text-[var(--wiki-text)]">sustituto</span> — es deuda apuntada,
        no un olvido. Hoy hay{" "}
        <strong className="text-[var(--wiki-text)]">
          {built} de {DEV_MODULES.length}
        </strong>{" "}
        en marcha.{" "}
        {roster.problems.length === 0 && roster.count > 0 && (
          <>
            Y las{" "}
            <strong className="text-[var(--wiki-text)]">{roster.count} fichas</strong> de las razas
            piloto se comprueban al abrir esta página: si{" "}
            <code className={CODE}>razas.md</code> dejara de producir fichas legales, saldría aquí
            en rojo.
          </>
        )}
      </p>

      {roster.problems.length > 0 && (
        <div className="mb-8 rounded-lg border border-[var(--wiki-danger)] bg-[var(--wiki-danger-soft)] p-4">
          <p className="mb-2 flex items-center gap-2 font-semibold text-[var(--wiki-danger)]">
            <i className="pi pi-exclamation-triangle" />
            El roster no cuadra con la anatomía
          </p>
          <p className="mb-2 text-xs text-[var(--wiki-muted)]">
            Sale de cruzar <code className={CODE}>razas.md</code> con{" "}
            <code className={CODE}>lib/v3/character.ts</code>. Se ve ficha a ficha en{" "}
            <Link
              href="/docs/v3/razas/roster"
              className="text-[var(--wiki-accent)] hover:underline"
            >
              el roster en datos
            </Link>
            .
          </p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--wiki-muted)]">
            {roster.problems.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      )}

      {problems.length > 0 && (
        <div className="mb-8 rounded-lg border border-[var(--wiki-danger)] bg-[var(--wiki-danger-soft)] p-4">
          <p className="mb-2 flex items-center gap-2 font-semibold text-[var(--wiki-danger)]">
            <i className="pi pi-exclamation-triangle" />
            La cadena está rota
          </p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--wiki-muted)]">
            {problems.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      )}

      {DEV_LAYERS.map((layer) => {
        const modules = DEV_MODULES.filter((m) => m.layer === layer.id);
        if (modules.length === 0) return null;

        return (
          <section key={layer.id} className="mb-9">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]">
              {layer.label}
            </h2>
            <p className="mb-3 max-w-2xl text-xs text-[var(--wiki-muted)]">{layer.blurb}</p>
            <div className="space-y-3">
              {modules.map((m) => (
                <ModuleRow key={m.slug} module={m} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function ModuleRow({ module: m }: { module: DevModule }) {
  const href = moduleHref(m);
  const needs = m.needs ?? [];
  const debts = standInsOf(m).length;

  const body = (
    <>
      <span className="flex flex-wrap items-center gap-2">
        <i className={`${m.icon} text-lg text-[var(--wiki-accent)]`} />
        <span className="font-semibold text-[var(--wiki-text)]">{m.label}</span>
        {m.home && (
          <span className="text-xs text-[var(--wiki-muted)]">
            <i className="pi pi-external-link mr-1 text-[0.65rem]" />
            se construye en {m.home.label}
          </span>
        )}
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

      {needs.length === 0 ? (
        <span className="text-xs italic text-[var(--wiki-muted)]">
          No depende de nadie — se puede construir hoy mismo.
        </span>
      ) : (
        <span className="flex flex-col gap-1 rounded-md bg-[var(--wiki-surface-2)] px-3 py-2 text-xs">
          {/* «Depende de 2» a secas se leería como «depende del número 2», que
              es justo el otro número que hay en esta caja. */}
          <span className="font-medium text-[var(--wiki-text)]">
            Depende de {needs.length} {needs.length === 1 ? "módulo" : "módulos"}
            {debts > 0 && (
              <span className="font-normal text-[var(--wiki-muted)]">
                {" "}
                · {debts} con sustituto
              </span>
            )}
          </span>
          {needs.map((dep) => {
            const target = DEV_MODULES_BY_SLUG[dep.slug];
            return (
              <span key={dep.slug} className="flex flex-col text-[var(--wiki-muted)]">
                <span>
                  <span className="tabular-nums opacity-60">{orderOf(dep.slug)}.</span>{" "}
                  <span className="font-medium text-[var(--wiki-text)]">
                    {target?.label ?? dep.slug}
                  </span>{" "}
                  — {dep.what}
                </span>
                {dep.standIn && (
                  <span className="pl-5 text-[var(--wiki-accent)]">
                    <i className="pi pi-wrench mr-1 text-[0.65rem]" />
                    hoy, en su lugar: {dep.standIn}
                  </span>
                )}
              </span>
            );
          })}
        </span>
      )}

      {m.blocker && (
        <span className="flex items-start gap-1.5 text-xs text-[var(--wiki-muted)]">
          <i className="pi pi-lock mt-0.5 text-[0.7rem]" />
          <span>{m.blocker}</span>
        </span>
      )}

      {/* Texto plano, no enlace: la fila entera ya es un <a> cuando se puede
          visitar, y no se puede anidar un <a> dentro de otro. */}
      {m.doc && (
        <span className="text-xs text-[var(--wiki-muted)]">Diseño: {m.doc.label}</span>
      )}
    </>
  );

  const shell =
    "flex flex-1 flex-col gap-2 rounded-lg border border-[var(--wiki-border)] bg-[var(--wiki-surface)] p-4";

  return (
    <div className="flex items-start gap-3">
      <span
        aria-hidden
        className={`mt-4 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold tabular-nums ${
          href
            ? "border-[var(--wiki-accent)] text-[var(--wiki-accent)]"
            : "border-[var(--wiki-border)] text-[var(--wiki-muted)]"
        }`}
      >
        {orderOf(m.slug)}
      </span>
      {href ? (
        <Link href={href} className={`${shell} transition-colors hover:border-[var(--wiki-accent)]`}>
          {body}
        </Link>
      ) : (
        <div className={`${shell} opacity-60`}>{body}</div>
      )}
    </div>
  );
}
