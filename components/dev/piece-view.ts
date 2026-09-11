// =========================================================================
// De `Character` a ficha dibujable — el único adaptador
//
// `PieceToken` pinta un `PieceView`, que es lo mínimo que hay que saber de un
// personaje para dibujar su ficha. Esto es lo que convierte una ficha del roster
// —un `Character` salido de razas.md (lib/v3/races.ts)— en ese `PieceView`.
//
// ES MECÁNICO: no decide nada de diseño. Cruza datos que ya existen con el
// vocabulario que ya pide el componente, y cada campo que toca lo saca del sitio
// donde ese dato ya vive —el raíl de color de `railForTier`, el retrato de
// `illustrationOf`, el glifo del nombre tal y como lo escribe el documento—.
//
// Y ESTÁ AQUÍ PORQUE ES UNO SOLO *(11 de septiembre de 2026)*. Hasta ese día
// había dos pantallas pintando fichas y cada una traía las suyas de un sitio:
// /dev/baraja las sacaba del roster —razas.md, en vivo— y /dev/pieza de los
// sujetos escritos a mano de `components/design/v3/` —el laboratorio del marco
// de carta, con los números inventados ficha a ficha—. Las dos dibujaban el
// mismo ⛏️ Minero con dos juegos de cifras distintos (❤️ 22 contra 26, 🛡️ 8
// contra 40), y lo vio Dario: «las fichas que hay en Baraja y Oteo son las
// mismas que en Fichas? porque creo que no». No lo eran. Ahora la fuente es una
// y este archivo es el sitio por donde pasa, así que no pueden volver a
// separarse sin que se note.
//
// LO QUE SE PIERDE CON LA UNIFICACIÓN, para que quede escrito: de las 8
// Habilidades del roster solo ❤️ Vida y ⚔️ Ataque son propias de cada ficha —la
// base de su raza por la curva de su tier—; las otras cinco salen todas en el
// escalón "normal" mientras razas.md no diga cuál les toca (lib/v3/races.ts, y
// es insumo de Dario). O sea que las cifras de las fichas dejan de variar de una
// a otra. No es un apaño de aquí: es el estado real del documento, y el día que
// traiga las suyas vuelven a variar solas y sin tocar nada.
// =========================================================================

import type { Character } from "@/lib/v3/character";
import { DAMAGE_TYPES } from "@/lib/v3/damage";
import type { PieceSideId } from "@/lib/v3/piece";
import { illustrationOf, splitGlyph } from "@/lib/v3/races";
import { railForTier } from "@/lib/v3/rarity";
import type { PieceView } from "./PieceToken";

/**
 * El glifo de una ficha: el que encabeza su nombre en razas.md
 * («🗡️ Miliciano»).
 *
 * Es exactamente lo que los sujetos escritos a mano llevan en `icon`, así que no
 * se inventa nada. `character.icon` gana si algún día existe; el tipo de daño es
 * el último recurso, para una ficha cuyo nombre viniera sin glifo.
 */
export function iconOf(character: Character): string {
  return (
    character.icon ?? (splitGlyph(character.name).icon || DAMAGE_TYPES[character.damage].icon)
  );
}

/** Lo que la pantalla pone encima de la ficha y el roster no sabe: de quién es y cómo está. */
export type PieceMeta = {
  /**
   * El id con el que esa pantalla la distingue. Por defecto el del personaje,
   * que es lo que quiere quien pinta una sola; hace falta pasarlo cuando la
   * MISMA ficha sale dos veces —/dev/pieza la pone en la escena y otra vez en la
   * tira de tiers, y son dos piezas que se eligen por separado—.
   */
  readonly id?: string;
  readonly side: PieceSideId;
  /** Cuánta ❤️ Vida le queda, en porcentaje. Por defecto entera. */
  readonly lifePct?: number;
  readonly states?: readonly { readonly id: string; readonly icon: string }[];
};

/**
 * La ficha del roster, lista para dibujar.
 *
 * El ROL no se pasa: lo trae el personaje —el roster ya distingue héroe de
 * unidad—, y de él cuelga lo demás. Un héroe no tiene tier, así que su color es
 * el raíl propio (`railForTier(null)`) y su retrato cuelga de la carpeta de la
 * raza en vez de la de `units/`.
 */
export function characterToPieceView(character: Character, meta: PieceMeta): PieceView {
  const vidaMax = character.abilities.vida;
  const lifePct = meta.lifePct ?? 100;
  return {
    id: meta.id ?? character.id,
    // Sin glifo: la ficha lo pinta aparte, en su hueco.
    name: splitGlyph(character.name).label,
    side: meta.side,
    role: character.role,
    tier: character.tier,
    // EL COLOR DE LA FICHA, y es el mismo con el que se imprime su carta: no se
    // vuelve a calcular en ninguna de las dos pantallas a propósito, porque si
    // la carta y la ficha lo sacaran de dos sitios podrían dejar de coincidir
    // sin que nadie se enterara.
    rarity: railForTier(character.tier ?? null),
    icon: iconOf(character),
    art: illustrationOf(character),
    damage: character.damage,
    vida: Math.max(1, Math.round((vidaMax * lifePct) / 100)),
    vidaMax,
    ataque: character.abilities.ataque,
    movimiento: character.abilities.movimiento,
    states: meta.states?.map((e) => ({ id: e.id, icon: e.icon })) ?? [],
  };
}
