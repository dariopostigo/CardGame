"use client";

import { useRef, type RefObject } from "react";
import { Tooltip } from "primereact/tooltip";
import type { SeverityLevel } from "@/lib/severity";

const LABEL: Record<SeverityLevel, string> = {
  leve: "Leve",
  molesta: "Molesta",
  grave: "Grave",
  severa: "Severa",
  malefica: "Maléfica",
};

// Mini-carta de color para la columna Nivel de cards/curses.md — mismo
// mecanismo que RarityChip.tsx pero con la paleta ámbar→púrpura de
// lib/severity.ts, para no confundirse con la Rareza de las cartas buenas.
export default function SeverityChip({ level }: { level: SeverityLevel }) {
  const ref = useRef<HTMLSpanElement>(null);
  const label = LABEL[level] ?? level;

  return (
    <>
      <span
        ref={ref}
        className={`wiki-severity-chip wiki-severity-chip--${level}`}
        tabIndex={0}
        aria-label={label}
      />
      <Tooltip target={ref as RefObject<HTMLElement>} content={label} position="top" className="wiki-icon-tip-tooltip" />
    </>
  );
}
