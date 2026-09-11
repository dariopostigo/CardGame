// =========================================================================
// «Otras animaciones» — la lista de las que todavía no existen
//
// El hermano de `AnimationCatalog`: aquel enseña las nueve que hay, con sus
// diales y su botón; este enseña las que no, con un veredicto técnico pegado a
// cada una. Las dos listas son datos de lib/v3/anim.ts (`ANIMATIONS` y
// `BACKLOG`), están en el mismo archivo, y construir una es MOVERLA de una a la
// otra en el mismo diff. Ese es todo el mecanismo que impide que esta pantalla
// acabe mintiendo, que es lo que le pasó a la caja de «Todos los diales».
//
// Es una lista ABIERTA a propósito: se escribe antes de decidir nada, y el
// veredicto está para que elegir la siguiente sea mirar y no investigar. Por
// eso no lleva ni orden ni prioridad ni fechas — nada de eso se sabe todavía, y
// fingirlo haría que la lista se leyera como un plan.
//
// No tiene estado ni interactividad y no se pliega: una lista de pendientes que
// entra plegada es una lista que no se lee.
// =========================================================================

import {
  BACKLOG,
  BACKLOG_FAMILIES,
  FEASIBILITY_LABEL,
  backlogOf,
  type Feasibility,
} from "@/lib/v3/anim";

/** El recuento de arriba: cuántas de cada veredicto, en este orden. */
const ORDER: readonly Feasibility[] = ["listo", "directo", "condicion", "no"];

export default function AnimationBacklog() {
  const counts = ORDER.map((id) => ({
    id,
    label: FEASIBILITY_LABEL[id],
    n: BACKLOG.filter((entry) => entry.feasibility === id).length,
  }));

  return (
    <div className="anim-backlog">
      <ul className="anim-backlog__tally">
        {counts.map((c) => (
          <li key={c.id} className={`anim-backlog__verdict anim-backlog__verdict--${c.id}`}>
            <b>{c.n}</b> {c.label.toLowerCase()}
          </li>
        ))}
      </ul>

      <div className="anim-backlog__families">
        {BACKLOG_FAMILIES.map((family) => {
          const rows = backlogOf(family.id);
          return (
            <section key={family.id} className="anim-backlog__family">
              <h3 className="anim-backlog__family-head">
                {family.label}
                <span className="anim-backlog__count">{rows.length}</span>
              </h3>
              <p className="anim-backlog__family-note">{family.note}</p>
              <ul className="anim-backlog__list">
                {rows.map((entry) => (
                  <li key={entry.id} className="anim-backlog__row">
                    <code className="anim-backlog__id">{entry.id}</code>
                    <div className="anim-backlog__body">
                      <div className="anim-backlog__label">
                        {entry.label}
                        {entry.asked && (
                          <span
                            className="anim-backlog__asked"
                            title="Salió de Dario, no del banco."
                          >
                            pedida
                          </span>
                        )}
                      </div>
                      <p className="anim-backlog__note">{entry.note}</p>
                    </div>
                    <span
                      className={`anim-backlog__verdict anim-backlog__verdict--${entry.feasibility}`}
                    >
                      {FEASIBILITY_LABEL[entry.feasibility]}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
