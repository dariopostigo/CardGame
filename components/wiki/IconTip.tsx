"use client";

import { Tooltip } from "primereact/tooltip";
import { ICON_TOOLTIPS } from "@/lib/icon-tooltip";

// Renderiza los iconos que `lib/remark-icon-tooltip.ts` detecta en los .md
// (manos de arma, tipos de daño — docs/glossary.md) con un Tooltip real al
// pasar el ratón, en vez de dejarlos como emoji suelto sin contexto.
export default function IconTip({ icon }: { icon: string }) {
  const label = ICON_TOOLTIPS[icon];
  if (!label) return <>{icon}</>;

  return (
    <Tooltip.Root>
      <Tooltip.Trigger as="span" className="wiki-icon-tip" tabIndex={0}>
        {icon}
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Positioner sideOffset={6}>
          <Tooltip.Popup className="wiki-icon-tip-popup">{label}</Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
