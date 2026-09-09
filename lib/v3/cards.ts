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
// LA RUTA NO SE INVENTA: se deriva del nombre con el mismo criterio que ya
// usó el arte (public/assets/v3/README.md §"Nombre de archivo" — slug
// español, sin acentos ni paréntesis), así que reproduce las 8 rutas que ese
// documento ya tiene escritas en vez de copiarlas a mano.
//
// Puro: sin React, sin node:fs. Los Character se inyectan.
// =========================================================================

import type { Character } from "./character";
import { raceSlug } from "./races";

export type UnitCard = {
  readonly character: Character;
  /** Ruta pública de la ilustración: `/assets/v3/races/<raza>/units/<unidad>.png`. */
  readonly illustration: string;
};

/** «🗡️ Miliciano» → «miliciano»; «🐉 Dragón dorado» → «dragon-dorado». */
function nameSlug(name: string): string {
  const label = name.slice(name.indexOf(" ") + 1).trim();
  return label
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Las cartas de unidad del roster que se le pase: cada `Character` de rol
 * "unidad" con su ilustración. Los héroes se descartan aquí y no antes,
 * porque quien llama (races.ts `charactersOfRace`) no distingue tipos de
 * carta, solo fichas.
 *
 * Lanza si a una unidad le falta `race`: no debería pasar viniendo de
 * `charactersOfRace`, que siempre la rellena, pero sin ella no hay ruta que
 * derivar.
 */
export function unitCardsOfRace(characters: readonly Character[]): readonly UnitCard[] {
  return characters
    .filter((c) => c.role === "unidad")
    .map((c): UnitCard => {
      if (!c.race) {
        throw new Error(`«${c.name}» no tiene raza puesta: no se puede derivar su ilustración.`);
      }
      return {
        character: c,
        illustration: `/assets/v3/races/${raceSlug(c.race)}/units/${nameSlug(c.name)}.png`,
      };
    });
}
