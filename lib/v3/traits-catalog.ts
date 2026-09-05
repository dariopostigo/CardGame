// =========================================================================
// El catálogo de Características, leído del disco (solo servidor: usa node:fs)
//
// La mitad sucia de `traits.ts`: lo único que hace es traer el markdown y
// pasárselo al parseo. Está partido igual que card-table/card-catalog, y por el
// mismo motivo mecánico: `traits.ts` lo importa un componente de cliente —el
// inspector de /dev/personaje— y `node:fs` en el bundle del navegador rompe el
// build (ARCHITECTURE.md §7 y §10).
//
// De aquí sale hacia el cliente como props de un Server Component, que es la
// opción que el §7 deja apuntada para el catálogo de cartas y que aquí no tiene
// discusión: son 41 filas, no hace falta generar ningún JSON.
//
// LEE knowledge/ Y NO docs/, y conviene que quede escrito porque es lo
// contrario de lo que hace `lib/docs.ts`. Las razas se están redefiniendo en
// `knowledge/v3/races-concept/razas.md`, que es el archivo que se edita;
// `docs/v3/razas.md` está congelado y solo se reescribe cuando un bloque del
// concepto se cierra, porque lo lee la wiki (AGENTS.md). Los dos apartados de
// Características son idénticos hoy, así que lo que cambia no es el resultado:
// es de cuál de los dos se enteraría este laboratorio el día que se muevan.
// =========================================================================

import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import { parseTraits, type Trait } from "./traits";

const RAZAS_MD = path.join(
  process.cwd(),
  "knowledge",
  "v3",
  "races-concept",
  "razas.md",
);

/**
 * Las 41 Características de razas.md.
 *
 * Lanza si el documento no tiene la forma esperada, con el archivo y la línea
 * señalados: un catálogo que se queda corto en silencio dejaría fichas
 * validando contra rasgos que no existen.
 */
export const getTraitCatalog = cache((): readonly Trait[] =>
  parseTraits(fs.readFileSync(RAZAS_MD, "utf8"), "knowledge/v3/races-concept/razas.md"),
);
