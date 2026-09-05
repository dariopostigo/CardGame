// =========================================================================
// La Rareza de una carta — V3
//
// La Rareza NO es un eje propio (game-design.md §3, 24-ago-2026): sale del
// tier. Este archivo es esa función, y nada más.
//
// NO CONFUNDIR CON `lib/rarity.ts`, que es otra cosa: allí vive la PALETA
// —los cinco colores, sus etiquetas y su orden—, espejo de `$rarity` en
// styles/settings/_colors.scss. Aquí vive la REGLA: qué escalón le toca a un
// tier. Una es de pintura y la otra de juego; la primera la comparten la wiki
// y el lab de cartas de v2, y esta es de V3.
//
// -------------------------------------------------------------------------
// DE DÓNDE SALE EL CORTE (decidido por Dario el 5 de septiembre de 2026)
//
// Ocho tiers en cinco Rarezas: hacen falta cuatro fronteras. La pregunta era
// dónde, y se midieron las 88 unidades de razas.md buscándolas en las dos
// curvas que recorren la progresión.
//
// LA POTENCIA NO DA NINGUNA. El ×10 de razas.md §"La escala" (1 · 1,4 · 1,9 ·
// 2,7 · 3,7 · 5,2 · 7,2 · 10) sube con pasos de ×1,357 a ×1,421: es una
// geométrica pura. Ningún escalón destaca sobre otro, así que cortarla por
// ahí habría sido elegir, no medir.
//
// EL REPARTO DE CARACTERÍSTICAS DA EXACTAMENTE CUATRO. Media de rasgos por
// tier, y su salto respecto al anterior:
//
//     tier    1     2     3     4     5     6     7     8
//     media  1,18  1,27  2,00  1,91  2,00  2,55  3,27  4,36
//     salto    —   +0,09 +0,73 −0,09 +0,09 +0,55 +0,73 +1,09
//                         ^^^^              ^^^^  ^^^^  ^^^^
//
// Cuatro saltos de ≥0,55 y tres llanos de ≤0,09: seis veces de diferencia,
// sin ningún caso dudoso en medio. O sea que el roster ya había partido los
// ocho tiers en cinco grupos —{1,2} {3,4,5} {6} {7} {8}— antes de que nadie
// preguntara, y esta función se limita a escribirlos. Es el mismo trato que
// `TRAIT_CAP_BY_TIER` (lib/v3/traits.ts) y que `framingAnchor()`: una regla
// derivada que reproduce lo que la mano ya hacía, en vez de sustituirla.
//
// LO QUE ESTO CUESTA, DICHO: el reparto NO es una pirámide de colección. Por
// raza salen 2 comunes, 3 poco-comunes, 1 rara, 1 épica y 1 legendaria —22 ·
// 33 · 11 · 11 · 11 en las 88—, así que la banda gorda está en el segundo
// escalón y no en el primero. Se aceptó a sabiendas: la Rareza aquí dice de
// qué CLASE de carta se trata, y con qué frecuencia aparece una unidad es
// economía (game-design.md §7), que no está escrita. Si algún día la economía
// pide una pirámide, se cambia aquí y con el motivo escrito — no se maquilla
// asignando rarezas a mano, que es justo lo que el eje único vino a evitar.
//
// Y LOS TRES DE ARRIBA VAN SOLOS, cada uno en su escalón, porque es lo que
// dice el roster: 2,55 → 3,27 → 4,36, separándose más en cada paso. Un tier 8
// no es "un tier 7 grande".
//
// LO QUE HABÍA ANTES: una función en `components/design/v3/sample.ts` que
// repartía 1-2 · 3-4 · 5-6 · 7 · 8, con un comentario encima diciendo que era
// "la lectura más obvia" para que los bocetos enseñaran los cinco raíles. No
// era una regla y no lo disimulaba. Contra los datos fallaba en los dos
// sentidos: juntaba 5 con 6 cruzando un salto de +0,55, y separaba 4 de 5,
// que van a +0,09 uno del otro.
// =========================================================================

/** Los cinco escalones, de menos a más. Claves de `$rarity`. */
export type Rarity = "comun" | "poco-comun" | "raro" | "epico" | "legendario";

/**
 * El escalón de cada tier, del 1 al 8. Es la tabla completa: leerla de
 * arriba abajo son las cinco bandas que el roster ya tenía.
 */
export const RARITY_BY_TIER: readonly Rarity[] = [
  "comun", // tier 1  ┐ media 1,18
  "comun", // tier 2  ┘       1,27
  "poco-comun", // tier 3  ┐       2,00
  "poco-comun", // tier 4  │       1,91
  "poco-comun", // tier 5  ┘       2,00
  "raro", // tier 6          2,55
  "epico", // tier 7          3,27
  "legendario", // tier 8          4,36
];

/**
 * El raíl de color de un héroe. **No es una Rareza**: un héroe no tiene tier
 * del que derivarla, y prestarle un escalón diría que un Sacerdote es "más
 * legendario" que un Guerrero, que es falso. Tiene raíl propio —el rojo de
 * `game("accent-hi")`— y el motivo largo está en `styles/settings/_colors.scss`
 * junto al token.
 */
export const HERO_RAIL = "heroe";

/**
 * La Rareza de una unidad de tier `tier`. Lanza si el tier está fuera de la
 * progresión de ocho: un tier 9 no es "legendario también", es un error de
 * quien llama.
 */
export function rarityForTier(tier: number): Rarity {
  const rarity = RARITY_BY_TIER[tier - 1];
  if (rarity === undefined) {
    throw new Error(
      `Tier ${tier} fuera de la escala: RARITY_BY_TIER solo cubre del 1 al ${RARITY_BY_TIER.length}.`,
    );
  }
  return rarity;
}

/**
 * El raíl que le toca a una ficha: su Rareza si es unidad, el rojo de héroe si
 * no tiene tier. Es lo único que una carta necesita preguntar.
 */
export function railForTier(tier: number | null): Rarity | typeof HERO_RAIL {
  return tier === null ? HERO_RAIL : rarityForTier(tier);
}
