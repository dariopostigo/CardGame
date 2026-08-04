// Tipografía de rótulo del tema de producción: Oswald, la condensada y
// pesada que hace de "PLAY NOW" / "PARTY INTERFACE" en example1.jpg
// (public/assets/UI/). Geist, la de las herramientas, no tiene ese peso.
//
// Vive en su propio módulo por lo mismo que card-fonts.ts con Cormorant:
// next/font se resuelve en tiempo de build por llamada, así que si cada
// componente de components/game/ui/ llamara a Oswald() por su cuenta se
// cargaría la fuente dos veces.
import { Oswald } from "next/font/google";

const oswald = Oswald({
  weight: ["600", "700"],
  subsets: ["latin"],
  variable: "--font-oswald",
});

/** Clase con la custom property --font-oswald, para el elemento que la use. */
export const gameFontVars = oswald.variable;
