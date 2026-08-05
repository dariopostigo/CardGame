"use client";

// Antes era un <input type="range"> con el tramo recorrido pintado a mano
// (--game-slider-fill). Pasa a revestir el <Slider> de PrimeReact, que ya
// pinta la pista y el pomo como <span> reales (.p-slider-range/-handle) en
// vez de depender de pseudo-elementos por motor de navegador: mismo motivo
// que el resto de la familia, un control con nodos propios se tema entero
// con $game sin ramas por Chrome/Firefox.

import { Slider, type SliderProps } from "primereact/slider";

export default function GameSlider({ className, ...rest }: SliderProps) {
  return <Slider className={["game-slider", className].filter(Boolean).join(" ")} {...rest} />;
}
