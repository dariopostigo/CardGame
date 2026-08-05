"use client";

// Antes era un <input> nativo oculto con un <span> pintado encima. Pasa a
// revestir el <Checkbox> de PrimeReact —mismo motivo que el desplegable:
// el estado marcado/foco/deshabilitado ya lo gestiona la librería, aquí solo
// se pinta con $game—. className cae en el mismo <div class="p-checkbox">
// raíz (no hay wrapper propio), así que el reskin va sobre esas clases.

import { useId, type ReactNode } from "react";
import { Checkbox, type CheckboxProps } from "primereact/checkbox";

type GameCheckboxProps = CheckboxProps & {
  label?: ReactNode;
  hint?: ReactNode;
};

export default function GameCheckbox({
  className,
  inputId,
  label,
  hint,
  ...rest
}: GameCheckboxProps) {
  const autoId = useId();
  const id = inputId ?? autoId;

  return (
    <span className="game-checkbox">
      <Checkbox
        inputId={id}
        className={["game-checkbox__control", className].filter(Boolean).join(" ")}
        {...rest}
      />
      {(label || hint) && (
        <label htmlFor={id} className="game-checkbox__text">
          {label && <span className="game-type-body game-checkbox__label">{label}</span>}
          {hint && <span className="game-type-meta game-checkbox__hint">{hint}</span>}
        </label>
      )}
    </span>
  );
}
