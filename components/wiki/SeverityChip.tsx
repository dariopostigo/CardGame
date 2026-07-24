"use client";

import { Tooltip } from "primereact/tooltip";
import type { SeverityLevel } from "@/lib/severity";

const LABEL: Record<SeverityLevel, string> = {
  leve: "Leve",
  grave: "Grave",
};

// Mini-carta de color para la columna Severidad de cards/curses.md — mismo
// mecanismo que RarityChip.tsx pero con la paleta ámbar/rojo de lib/severity.ts,
// para no confundirse con la Rareza de las cartas buenas.
export default function SeverityChip({ level }: { level: SeverityLevel }) {
  const label = LABEL[level] ?? level;

  return (
    <Tooltip.Root>
      <Tooltip.Trigger
        as="span"
        className={`wiki-severity-chip wiki-severity-chip--${level}`}
        tabIndex={0}
        aria-label={label}
      />
      <Tooltip.Portal>
        <Tooltip.Positioner sideOffset={6}>
          <Tooltip.Popup className="wiki-icon-tip-popup">{label}</Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
