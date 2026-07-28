import Link from "next/link";
import type { Metadata } from "next";
import { Family, GroupHeader, Specimen, SpecimenGrid } from "@/components/repository/Showcase";
import { groupBySlug } from "@/lib/repository";

// Títulos y textos de las herramientas. No hay un componente <Title/>: la
// tipografía de la wiki y de los labs son utilidades de Tailwind sobre los
// tokens del skin, y lo que hace falta documentar es CUÁL se usa para qué.
// Por eso esta página enseña la convención junto al especimen: sin ella, cada
// lab nuevo se inventa su propio tamaño de título.

const group = groupBySlug("dev", "typography")!;

export const metadata: Metadata = {
  title: group.label,
  description: group.summary,
};

export default function TipografiaPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <GroupHeader group={group} />

      <Family
        title="Escala de títulos"
        note={
          <>
            Tres niveles y ni uno más. El de página va una sola vez por pantalla; el de sección es
            un <b>rótulo</b> —pequeño, en versalitas y atenuado— y no un título grande, que es lo
            que mantiene la jerarquía legible en páginas largas de laboratorio.
          </>
        }
      >
        <SpecimenGrid>
          <Specimen label="Título de página" hint={<code>text-2xl font-bold</code>}>
            <span className="text-2xl font-bold text-[var(--wiki-text)]">Generación de tablero</span>
          </Specimen>
          <Specimen
            label="Rótulo de sección"
            hint={<code>text-xs font-semibold uppercase tracking-wide</code>}
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]">
              Por construir
            </span>
          </Specimen>
          <Specimen label="Subtítulo de bloque" hint={<code>text-sm font-semibold</code>}>
            <span className="text-sm font-semibold text-[var(--wiki-text)]">
              Reparto de terreno medido
            </span>
          </Specimen>
        </SpecimenGrid>
      </Family>

      <Family
        title="Textos"
        note={
          <>
            El cuerpo de las herramientas es <code>text-sm</code>, un escalón por debajo del de la
            wiki: aquí se lee de reojo mientras se mira un tablero, no se lee del tirón.
          </>
        }
      >
        <SpecimenGrid>
          <Specimen label="Cuerpo" hint={<code>text-sm text-[var(--wiki-text)]</code>}>
            <p className="text-sm text-[var(--wiki-text)]">
              Cada tipo de loseta reparte su peso entre sus variantes: añadir un peñasco más no hace
              que salgan más peñascos, hace que se repitan menos.
            </p>
          </Specimen>
          <Specimen
            label="Atenuado"
            hint={
              <>
                <code>text-[var(--wiki-muted)]</code> — descripciones y ayuda, nunca información que
                haga falta para decidir
              </>
            }
          >
            <p className="text-sm text-[var(--wiki-muted)]">
              9 losetas, ~72 hexágonos. El total de hexágonos es lo que fija el tamaño del tablero,
              no el número de piezas.
            </p>
          </Specimen>
          <Specimen label="Cifra medida" hint="Los labs miden: la cifra manda sobre el adjetivo">
            <span className="text-2xl font-bold tabular-nums text-[var(--wiki-text)]">72</span>
            <span className="text-sm text-[var(--wiki-muted)]">hexágonos</span>
          </Specimen>
          <Specimen label="Código en línea" hint={<code>bg-[var(--wiki-code-bg)]</code>}>
            <p className="text-sm text-[var(--wiki-text)]">
              La biblioteca vive en{" "}
              <code className="rounded bg-[var(--wiki-code-bg)] px-1.5 py-0.5 text-[0.85em]">
                data/tile-library.json
              </code>
              .
            </p>
          </Specimen>
          <Specimen label="Enlace" hint="Acento del skin; subrayado punteado si va dentro de prosa">
            <Link
              href="/docs/board/board-map"
              className="text-sm text-[var(--wiki-accent)] underline decoration-dotted"
            >
              Tablero y mapa §2c
            </Link>
          </Specimen>
          <Specimen label="Deshabilitado" hint="Lo planificado se lista apagado, no se esconde">
            <span className="flex items-center gap-2 text-sm text-[var(--wiki-muted)] opacity-70">
              <i className="pi pi-circle-fill text-[0.85em] opacity-60" />
              Diseño de fichas
              <i className="pi pi-clock text-[0.7rem]" />
            </span>
          </Specimen>
        </SpecimenGrid>
      </Family>

      <Family
        title="Prosa de la wiki"
        note={
          <>
            El markdown de <code>docs/</code> no tiene clases donde agarrarse: se estiliza por
            elemento bajo <code>.wiki-prose</code>, que remapea las variables{" "}
            <code>--tw-prose-*</code> al skin. Esta es la única tipografía del proyecto que se
            hereda en vez de pedirse.
          </>
        }
      >
        <figure className="repo-specimen repo-specimen--stacked">
          <div className="repo-specimen__canvas">
            <div className="wiki-prose prose prose-sm max-w-none">
              <h3>Anclas</h3>
              <p>
                Una loseta se une a otra <b>solo</b> por su contorno; el resto del borde es pared.
                Al generar, dos anclas encajan si miran la una a la otra.
              </p>
              <ul>
                <li>El ancla es del dibujo, no del tipo.</li>
                <li>
                  Girar la pieza gira sus anclas: <code>rotate(anchor, 2)</code>.
                </li>
              </ul>
              <blockquote className="wiki-callout">
                Aviso: una variante cuya roca parta su propio terreno transitable no pasa el
                validador.
              </blockquote>
            </div>
          </div>
          <figcaption className="repo-specimen__caption">
            <span className="repo-specimen__label">Bloque de prosa</span>
            <span className="repo-specimen__hint">
              <code>.wiki-prose</code> + <code>prose</code> de @tailwindcss/typography
            </span>
          </figcaption>
        </figure>
      </Family>
    </div>
  );
}
