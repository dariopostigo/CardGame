// Tipografía de rótulo de los bocetos de marco V3: Platypi, una serif de
// titulación con remates de pala y contraste alto. Sustituye a Cormorant, que
// es la serif de libro de las cartas de v2: correcta pero neutra, dice
// "documento" y no "objeto de juego".
//
// Se pide VARIABLE (no se le pasa `weight`), que es como next/font carga el eje
// wght entero —de 300 a 800— en un solo archivo. Así el rótulo puede afinarse
// por peso sin descargar una fuente más por escalón, que es justo lo que no
// dejaban hacer las dos display probadas antes.
//
// Vive en su propio módulo por lo mismo que card-fonts.ts con Cormorant y
// game-fonts.ts con Oswald: next/font se resuelve en tiempo de build por
// llamada, así que dos componentes que la pidan por su cuenta la descargan dos
// veces. Y aparte de card-fonts.ts porque aquella la comparten el lab de v2 y
// la wiki, y esta es solo de los bocetos de V3.
import { Platypi } from "next/font/google";

const platypi = Platypi({
  subsets: ["latin"],
  variable: "--font-platypi",
});

/** Clase con la custom property --font-platypi, para el elemento que la use. */
export const sketchFontVars = platypi.variable;
