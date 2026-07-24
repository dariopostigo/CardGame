"use client";

import { Tooltip } from "primereact/tooltip";
import type { RarityLevel } from "@/lib/rarity";

const LABEL: Record<RarityLevel, string> = {
  comun: "Común",
  "poco-comun": "Poco común",
  raro: "Raro",
  epico: "Épico",
  legendario: "Legendario",
};

// Mini-carta de color que sustituye al texto de rareza en las tablas de la
// wiki (`lib/remark-rarity-chip.ts` la inserta) — misma paleta que el lab de
// cartas (card-design.css §2). Sin texto visible, así que el nombre solo vive
// en el tooltip real al pasar el ratón (igual que el resto de iconos, IconTip.tsx).
export default function RarityChip({ level }: { level: RarityLevel }) {
  const label = LABEL[level] ?? level;

  return (
    <Tooltip.Root>
      <Tooltip.Trigger
        as="span"
        className={`wiki-rarity-chip wiki-rarity-chip--${level}`}
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
