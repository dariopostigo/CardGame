"use client";

import { PrimeReactProvider } from "primereact/api";
import type { ReactNode } from "react";

// PrimeReact 10: el proveedor solo lleva opciones globales de la librería. No
// hay comprobación de licencia, ni banner, ni preset de tema en JS — el tema
// es CSS y se carga desde styles/vendor/_primereact.scss.
//
// `ripple` enciende la onda al pulsar en los componentes de la librería;
// `pt`/`unstyled` se dejan sin tocar: el tema Lara ya viste los componentes y
// lo que queremos distinto lo pisamos desde styles/, que va sin @layer.
export default function Providers({ children }: { children: ReactNode }) {
  return <PrimeReactProvider value={{ ripple: true }}>{children}</PrimeReactProvider>;
}
