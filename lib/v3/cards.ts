// =========================================================================
// Las cartas de unidad — V3
//
// La anatomía de una carta de unidad es la de knowledge/v3/card-concept/
// README.md §"Contra qué se juzgan": 13 datos —nombre, raza, tier, Rareza,
// ilustración, las 8 Habilidades, hasta 5 Características— más el tipo de
// daño, que no pide hueco propio. Los 12 primeros son exactamente el
// `Character` que ya arma `lib/v3/races.ts`; lo único que le falta a una
// unidad para ser una carta es LA ILUSTRACIÓN, y eso es lo que este archivo
// añade.
//
// SOLO UNIDADES, NO HÉROES. Una carta de héroe es de clase, y esa anatomía
// no está cerrada (docs/v3/cards/class.md: "por definir cómo se expresa un
// efecto") — no es una omisión, es la frontera de alcance de esta vuelta.
//
// LA RUTA NO SE INVENTA y tampoco se deriva aquí: la da `illustrationOf`
// (races.ts), que la saca del nombre con el mismo criterio que ya usó el arte
// (public/assets/v3/README.md §"Nombre de archivo"). Estuvo escrita en este
// archivo hasta el 11 de septiembre de 2026, cuando /dev/pieza necesitó la
// misma ruta para los héroes —que tienen retrato pero no carta— y bajó al
// roster, que es de quien es.
//
// Puro: sin React, sin node:fs. Los Character se inyectan.
// =========================================================================

import type { Character } from "./character";
import { illustrationOf } from "./races";

export type UnitCard = {
  readonly character: Character;
  /** Ruta pública de la ilustración: `/assets/v3/races/<raza>/units/<unidad>.png`. */
  readonly illustration: string;
};

/**
 * Las cartas de unidad del roster que se le pase: cada `Character` de rol
 * "unidad" con su ilustración. Los héroes se descartan aquí y no antes,
 * porque quien llama (races.ts `charactersOfRace`) no distingue tipos de
 * carta, solo fichas.
 *
 * Lanza si a una unidad le falta `race`: no debería pasar viniendo de
 * `charactersOfRace`, que siempre la rellena, pero sin ella no hay ruta que
 * derivar (lo comprueba `illustrationOf`).
 */
export function unitCardsOfRace(characters: readonly Character[]): readonly UnitCard[] {
  return characters
    .filter((c) => c.role === "unidad")
    .map((c): UnitCard => ({ character: c, illustration: illustrationOf(c) }));
}
