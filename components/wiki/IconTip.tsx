"use client";

import { useRef, type RefObject } from "react";
import { Tooltip } from "primereact/tooltip";
import { ICON_TOOLTIPS } from "@/lib/icon-tooltip";

// Renderiza los iconos que `lib/remark-icon-tooltip.ts` detecta en los .md
// (manos de arma, tipos de daño — docs/glossary.md) con un Tooltip real al
// pasar el ratón, en vez de dejarlos como emoji suelto sin contexto.
//
// En PrimeReact 10 el Tooltip no envuelve al elemento: se monta al lado y se
// le señala el objetivo con `target`. Le pasamos la ref del propio icono (y no
// un selector) para que cada instancia enganche la suya y siga funcionando
// cuando la prosa se vuelve a pintar al cambiar de página de la wiki.
//
// El `as RefObject<HTMLElement>` es un parche de tipos, no de ejecución: la
// v10 declaró `target` cuando en React 18 una ref inicializada a null seguía
// siendo RefObject<HTMLElement>, y en React 19 pasó a ser RefObject<T | null>.
// Mismo objeto, hay que estrecharlo a mano (también en RarityChip/SeverityChip).
export default function IconTip({ icon }: { icon: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const label = ICON_TOOLTIPS[icon];
  if (!label) return <>{icon}</>;

  return (
    <>
      <span ref={ref} className="wiki-icon-tip" tabIndex={0}>
        {icon}
      </span>
      <Tooltip target={ref as RefObject<HTMLElement>} content={label} position="top" className="wiki-icon-tip-tooltip" />
    </>
  );
}
