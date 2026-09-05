// =========================================================================
// Los nueve estados, leídos del disco (solo servidor: usa node:fs)
//
// La mitad sucia de `effects.ts`, y está partido por el mismo motivo mecánico
// que `traits-catalog.ts`: el catálogo lo pinta un componente de cliente —las
// chapas de estado de la ficha, en /dev/pieza— y `node:fs` en el bundle del
// navegador rompe el build (ARCHITECTURE.md §7 y §10).
//
// LEE docs/ Y NO knowledge/, al contrario que el catálogo de Características.
// Los estados no están en revisión: `docs/v3/effects.md` es el documento vigente
// y cerrado del §5, y no hay ningún concepto paralelo donde se estén
// redefiniendo. Cuando lo haya, este archivo es el que cambia de ruta.
// =========================================================================

import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import { parseEffects, type Effect } from "./effects";

const EFFECTS_MD = path.join(process.cwd(), "docs", "v3", "effects.md");

/**
 * Los nueve estados de effects.md §5.
 *
 * Lanza si la tabla no tiene la forma esperada, con el archivo y la línea: una
 * ficha que pinta chapas de un catálogo a medio leer diría que un estado no
 * existe cuando lo que falla es el parseo.
 */
export const getEffectCatalog = cache((): readonly Effect[] =>
  parseEffects(fs.readFileSync(EFFECTS_MD, "utf8"), "docs/v3/effects.md"),
);
