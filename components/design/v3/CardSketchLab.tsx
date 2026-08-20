"use client";

import { useState } from "react";
import { cardFontVars } from "../card-fonts";
import { gameFontVars } from "@/components/game/ui/game-fonts";
import SketchCard, { SKETCHES, type SketchId } from "./sketch-cards";
import { SUBJECTS } from "./sample";

// Los estilos viven en el árbol ITCSS: el esqueleto en
// styles/components/_card-sketch.scss y cada boceto en
// styles/components/card-sketch/.

/* Bocetos de marco de carta de V3, dentro de la wiki.
   Es el hermano del lab de v2 (components/design/CardDesignLab.tsx) y hace lo
   contrario que él: aquel pinta el catálogo REAL con un marco ya decidido,
   este pinta sujetos de muestra con VARIOS marcos por decidir. En cuanto uno
   gane, esta página se queda con él y pasa a ser lo que era la otra.

   La lista crece por mezcla, no solo por referencia nueva: A, B y C salen cada
   uno de un concepto, y a partir de D son cruces de los que ya están sobre la
   mesa. Se añaden en sketch-cards.tsx.

   Las dos fuentes que carga: Cormorant para el nombre (la misma serif de las
   cartas de v2, que no cambió al cambiar las reglas) y Oswald para los
   números, que es la condensada del tema de producción — un número de tres
   cifras en una cápsula de 34px necesita una condensada o no entra. */

export default function CardSketchLab() {
  const [view, setView] = useState<SketchId>(SKETCHES[0].id);
  const [subjectId, setSubjectId] = useState(SUBJECTS[4].id); // 🐉 Dragón dorado
  const [tabla, setTabla] = useState(false);

  const shownSketches = SKETCHES.filter((s) => s.id === view);
  const shownSubjects = tabla ? SUBJECTS : SUBJECTS.filter((s) => s.id === subjectId);

  const btn = (active: boolean) =>
    `rounded-md border px-3 py-1.5 text-sm transition-colors ${
      active
        ? "border-[var(--wiki-accent)] bg-[var(--wiki-accent-soft)] font-medium text-[var(--wiki-accent)]"
        : "border-[var(--wiki-border)] text-[var(--wiki-text)] hover:bg-[var(--wiki-surface-2)]"
    }`;

  return (
    <div className={`sketch-lab ${cardFontVars} ${gameFontVars}`}>
      <h1 className="mb-1 text-2xl font-bold text-[var(--wiki-text)]">Diseño de cartas</h1>
      <p className="mb-2 max-w-3xl text-sm text-[var(--wiki-muted)]">
        Bocetos del <b>marco</b> de la carta de V3 — el objeto, no la ilustración que va dentro.
        Cada uno es una respuesta distinta a la misma pregunta: dónde caen los <b>13 datos</b> de
        una carta de unidad. Los tres primeros salen del análisis de{" "}
        <code className="rounded bg-[var(--wiki-code-bg)] px-1.5 py-0.5 text-[0.8em]">
          knowledge/v3/card-concept/
        </code>
        , un boceto por referencia; a partir de la <b>D</b> son <b>mezclas</b> de los que ya
        están sobre la mesa.
      </p>
      <p className="mb-5 max-w-3xl text-sm text-[var(--wiki-muted)]">
        <b>Nada de esto está decidido.</b> Los números de las Habilidades son inventados (los
        reales siguen pendientes en razas.md), la Rareza va por tier a falta de una regla, y las
        ilustraciones son las cuatro cartas de clase de v2 recortadas en vertical, porque V3
        todavía no tiene arte propio.
      </p>

      {/* Controles */}
      <div className="mb-5 flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]">
            Boceto
          </span>
          {SKETCHES.map((s) => (
            <button key={s.id} className={btn(view === s.id)} onClick={() => setView(s.id)}>
              {s.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]">
            Sujeto
          </span>
          {SUBJECTS.map((s) => (
            <button
              key={s.id}
              className={btn(!tabla && subjectId === s.id)}
              onClick={() => {
                setSubjectId(s.id);
                setTabla(false);
              }}
              title={`${s.traits.length} Características · Vida ${s.skills.vida}`}
            >
              {s.icon} {s.name}
            </button>
          ))}
          <button className={btn(tabla)} onClick={() => setTabla((v) => !v)}>
            Tabla completa
          </button>
        </div>
      </div>

      {/* Escenario. Reutiliza el objeto del lab de v2 (objects/_stage.scss);
          el fondo oscuro lo pone .sketch-lab. */}
      <div className="card-lab__stage">
        {shownSketches.map((sk) => (
          <section key={sk.id} className="mb-8 last:mb-0">
            <header className="mb-4 text-center">
              <h2 className="text-lg font-semibold text-[var(--wiki-text)]">{sk.label}</h2>
              <p className="mx-auto max-w-2xl text-xs text-[var(--wiki-muted)]">
                <b>{sk.source}.</b> {sk.bet}
              </p>
            </header>
            <div className="card-lab__grid">
              {shownSubjects.map((s) => (
                <SketchCard key={s.id} id={sk.id} subject={s} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Lo que hay que decidir mirando esto. Va en la página y no solo en el
          documento porque es lo que se contesta AQUÍ, con las cartas delante. */}
      <section className="mt-8 max-w-3xl text-sm text-[var(--wiki-text)]">
        <h2 className="mb-2 text-lg font-semibold">Qué falta decidir</h2>
        <ul className="list-disc space-y-1.5 pl-5 text-[var(--wiki-muted)]">
          <li>
            <b>Cuál de los esqueletos se toma de base</b>, o qué híbrido. El candidato que
            proponía el concepto: proporción y paleta de B + tira de ocho de A + subtítulo y
            ausencia de texto de C. La <b>D</b> es la primera mezcla montada, y va por otro lado:
            deja el esqueleto de C intacto y le cambia la piel por el herraje de v2.
          </li>
          <li>
            <b>Si el marco carga con la Rareza o solo la señala.</b> A, B y C la dicen con un
            filete de 3px; la D la convierte en la aleación del marco entero. Mira el Miliciano
            (común, hierro apagado) junto al Dragón dorado (legendaria, oro) y decide si eso
            ayuda a leer la carta o si le roba la ilustración.
          </li>
          <li>
            <b>Cuántas Características tiene que aguantar el marco.</b> El concepto dice «de 0 a
            4», pero en razas.md hay seis unidades de tier 8 con <b>cinco</b> (Dragón esquelético,
            Balor, Dragón ancestral, Kraken ancestral, Coloso mecánico y Abominación de plaga).
            Los tres bocetos están montados para cinco.
          </li>
          <li>
            <b>Si los ceros se imprimen o se ocultan.</b> Aquí se imprimen: mira la Suerte 0 del
            Miliciano y decide si molesta más el cero o el hueco.
          </li>
          <li>
            <b>Si el Tier se dice con el subtítulo, con un número propio o con el marco.</b> A, B
            y C lo dicen en el subtítulo, que es la opción más barata y la menos visible; la D lo
            sube a un medallón montado en la placa y le quita el subtítulo. Es la comparación
            directa entre las dos opciones.
          </li>
          <li>
            <b>El lienzo de la ilustración.</b> Todos son verticales y con el arte a sangre, así
            que el 1536×1050 apaisado heredado de v2 no sirve. La medida definitiva sale del boceto
            que gane y se escribe en <code>public/assets/v3/README.md</code>. Ojo con la D: su
            banda de metal se come 15px por cada lado.
          </li>
        </ul>
      </section>
    </div>
  );
}
