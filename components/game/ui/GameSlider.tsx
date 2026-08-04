"use client";

// El deslizador de ajustes de la referencia (preview-03/04, no example1.jpg):
// una pista fina con el tramo recorrido en oro y un pomo redondo, no el
// slider gris de fábrica del navegador con un tinte encima —eso, probado,
// desentona por completo con el resto del tema (ver la nota de
// _game-form.scss)—. Chrome/Safari no tienen un pseudo-elemento para "la
// parte ya recorrida", así que se pinta a mano con un degradado de dos
// paradas en el propio fondo del <input> y una custom property
// (--game-slider-fill) que este componente mantiene al día en cada arrastre.
// Firefox sí tiene ::-moz-range-progress y lo usa directo, sin JS.

import { useEffect, useRef, type InputHTMLAttributes } from "react";

type GameSliderProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "className"> & {
  className?: string;
};

function applyFill(input: HTMLInputElement) {
  const min = Number(input.min || 0);
  const max = Number(input.max || 100);
  const pct = max > min ? ((Number(input.value) - min) / (max - min)) * 100 : 0;
  input.style.setProperty("--game-slider-fill", `${pct}%`);
}

export default function GameSlider({ className, onInput, ...rest }: GameSliderProps) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) applyFill(ref.current);
  }, []);

  return (
    <input
      ref={ref}
      type="range"
      className={["game-slider", className].filter(Boolean).join(" ")}
      onInput={(event) => {
        applyFill(event.currentTarget);
        onInput?.(event);
      }}
      {...rest}
    />
  );
}
