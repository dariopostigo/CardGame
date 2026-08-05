"use client";

// El desplegable de ajustes de la referencia (preview-03/04, no example1.jpg)
// necesitaba una lista abierta que se pudiera vestir del todo, algo que un
// <select> nativo no da: el panel lo pinta el sistema operativo. PrimeReact
// ya es dependencia del lado de herramientas (styles/vendor/_primereact.scss,
// tema Lara ámbar) y su <Dropdown> pinta su propio panel en HTML normal, así
// que aquí se reviste entero con $game en vez de reconstruir un listbox
// accesible desde cero. className/panelClassName delimitan el reskin: el
// resto de la wiki sigue viendo el ámbar de siempre.

import { Dropdown, type DropdownProps } from "primereact/dropdown";

export default function GameSelect({ className, panelClassName, ...rest }: DropdownProps) {
  return (
    <Dropdown
      className={["game-select", className].filter(Boolean).join(" ")}
      panelClassName={["game-select-panel", panelClassName].filter(Boolean).join(" ")}
      {...rest}
    />
  );
}
