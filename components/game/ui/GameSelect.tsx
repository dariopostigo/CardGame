// El desplegable de ajustes de la referencia (preview-03/04 en
// public/assets/UI/, no example1.jpg: ahí no hay ninguno): un <select>
// nativo de verdad, no un botón que abre una lista propia. La lista
// desplegada la pinta el sistema operativo —no se puede vestir del todo—,
// pero a cambio funciona con teclado y lector de pantalla sin una línea de
// JS, y es justo lo que la referencia necesita: elegir una entre pocas.

import type { SelectHTMLAttributes } from "react";

type GameSelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "className"> & {
  className?: string;
};

export default function GameSelect({ className, children, ...rest }: GameSelectProps) {
  return (
    <div className={["game-select", className].filter(Boolean).join(" ")}>
      <select className="game-select__control" {...rest}>
        {children}
      </select>
      <i className="pi pi-chevron-down game-select__chevron" />
    </div>
  );
}
