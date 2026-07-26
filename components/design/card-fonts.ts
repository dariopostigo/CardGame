// Tipografía serif de los temas de carta, compartida por el lab de diseño y
// por la vista cartas de la wiki: serif de libro (Cormorant) para el nombre y
// EB Garamond para el cuerpo. Los temas las consumen vía
// $font-serif-display/$font-serif-body (styles/settings/_typography.scss).
//
// Vive en su propio módulo porque next/font se resuelve en tiempo de build por
// llamada: si cada componente llamara a Cormorant() por su cuenta, se
// cargarían dos veces las mismas fuentes. Las clases quedan acotadas al scope
// .card-lab, no afectan al resto de la wiki.
import { EB_Garamond, Cormorant } from "next/font/google";

const cormorant = Cormorant({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cormorant",
});

const ebGaramond = EB_Garamond({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-eb-garamond",
});

/** Clases con las custom properties de fuente, para el elemento .card-lab. */
export const cardFontVars = `${cormorant.variable} ${ebGaramond.variable}`;
