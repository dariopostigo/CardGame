// =========================================================================
// Sujetos de muestra de los bocetos de marco V3
//
// El lab de v2 (components/design/CardDesignLab.tsx) pinta el catálogo REAL,
// leído de las tablas de docs/v2/cards/*.md. Este no puede: docs/v3/cards/ no
// tiene todavía ni una tabla, así que los sujetos se escriben aquí a mano.
//
// PERO NO SE ESCOGEN A DEDO. Son la plantilla entera de la raza piloto tal y
// como está en knowledge/v3/races-concept/razas.md: las OCHO unidades de
// 👤 Humanos en su orden de progresión (tier 1 → 8) y sus CUATRO héroes, que
// desde el 25-ago-2026 están los cuatro. Un marco se juzga con el reparto real
// de una raza —cuántos nombres largos hay, cuántas Características caen por
// carta, cuántas cifras de Vida— y no con media docena de casos elegidos para
// que salga bien.
//
// Los héroes están por dos motivos. Uno: NO son unidades, no tienen tier, y
// eso descoloca a cualquier marco que reserve un sitio fijo para el Tier — el
// hueco reservado para un número se queda esperándolo. Dos: concentran el arte
// de V3 (public/assets/v3/races/humanos/), así que son las cartas que de verdad
// enseñan cómo queda un marco sobre una ilustración de este juego y no sobre un
// emoji o sobre un recorte prestado de v2. Ojo: ese arte sigue moviéndose —el
// Sacerdote y el Arquero entraron apaisados y les queda otra vuelta—, así que
// sirve para juzgar el marco, no el arte.
//
// Y ya no son lo único dibujado: el 🗡️ Miliciano es la primera UNIDAD con arte
// propio, que es el caso que faltaba —tier, raíl común y cero Características
// encima de una ilustración de verdad—. Desde el 31 de agosto de 2026 la
// progresión está dibujada ENTERA, del tier 1 al 8 (🐎 Caballería y 🦅 Grifo el
// 27, ✝️ Paladín el 28, 🐉 Dragón dorado el 31), así que 👤 Humanos es la segunda
// raza completa y en esta plantilla **no queda ni una carta a emoji**.
//
// Y eso gasta el caso de prueba que la raza aún enseñaba, tal y como estaba
// avisado: cómo aguanta el marco un hueco de arte vacío ya no se puede mirar en
// una carta de Humanos. Sobrevive por una sola, y prestada: el 🐉 Dragón
// esquelético del caso límite de aquí abajo, que es de 💀 No-muertos. O sea que
// en este laboratorio el hueco vacío pasa a verse en UNA carta de otra raza, y el
// día que esa también se dibuje habrá que dejar un sujeto a emoji a propósito o
// dejar de juzgarlo. (En la baraja sobra dónde mirarlo: 💀 No-muertos y
// 🔥 Demonios entraron enteras sin arte, veinticuatro cartas.)
//
// El 🐉 Dragón esquelético no es de Humanos y se queda de todas formas: es el
// peor caso que este laboratorio puede enseñar (cinco Características y
// dieciocho caracteres de nombre) y sin él ningún boceto pasa de cuatro chips.
// Va en su propia lista, etiquetado como caso límite, para no ensuciar la
// plantilla de la raza.
//
// Ojo con "peor caso": lo es AQUÍ, no en el catálogo. Desde que la baraja
// (races.ts) tiene cuatro razas, el ⛰️ Coloso de adamantita de ⛏️ Enanos le
// saca dos caracteres de nombre y el 👹 Balor de 🔥 Demonios le empata a cinco
// Características con un raíl más sucio. Este laboratorio no las pinta a
// propósito —compara nueve marcos, y con veinticuatro cartas por marco deja de
// comparar—, así que el Dragón sigue siendo su techo.
//
// LOS NÚMEROS DE LAS HABILIDADES SON INVENTADOS. docs/v3/razas.md avisa de que
// los valores siguen pendientes; aquí solo importa su FORMA (una, dos o tres
// cifras), que es lo que decide si el hueco del número se rompe. Lo que NO es
// inventado es todo lo demás: nombres, emojis, orden, raza y Características
// salen de razas.md tal cual.
//
// PERO YA NO SON LIBRES: el 23-ago-2026 se cerró la ESCALA de las ocho
// (docs/v3/razas.md §"La escala"), así que los inventados tienen que caber en
// ella o el marco se estaría juzgando con números imposibles. Al cotejarlos
// salió un desajuste real y está corregido: 🎯 Precisión iba de 7 a 18 cuando
// es un UMBRAL sobre 1..100 y su banda es 65-95. Ahora va de 66 a 90 — mismas
// dos cifras, así que el marco no se mueve, pero ya se lee como lo que es.
// El resto ya encajaba: ⚔️ Ataque 5-48 (1-2 cifras), ❤️ Vida 15-240 (2-3),
// 🛡️/🔮 por debajo de 75, 🍀 Suerte por debajo de 25, y del Miliciano al
// Dragón dorado hay ×8 de Ataque y ×13 de Vida, que es la curva ×10 por tier.
// =========================================================================

/**
 * La raíz de los pictogramas propios, servidos en `/assets/v3/icons/…`.
 *
 * El emoji de cada ficha NO se borra al llegar su archivo: se queda de reserva.
 * Sirve para las tres cosas que el PNG todavía no puede hacer — el conmutador
 * del laboratorio, el hueco que aún no tiene archivo (🗡️ Cuerpo a cuerpo) y
 * cualquier sitio fuera de la carta donde no haya CSS que dimensione una
 * imagen—. Por eso `icon` y `art` conviven en la misma ficha en vez de
 * sustituirse.
 */
import { HERO_RAIL, rarityForTier } from "@/lib/v3/rarity";

const ICONS = "/assets/v3/icons";
const BANNERS = "/assets/v3/banners";

/**
 * Las 8 Habilidades, en el orden de docs/v3/razas.md §"Habilidades".
 *
 * `art` entró el 26 de agosto de 2026 con la primera tanda de pictogramas
 * (knowledge/v3/icon-concept/icons.md §5): relieve de metal dorado, monocromo,
 * y **la Habilidad va desnuda** —sin medallón, que es lo que la distingue de
 * una Característica—. Las ocho están.
 *
 * Ojo con `ataque`: el glifo que acompaña al número de Ataque en una carta es el
 * del TIPO DE DAÑO, no este (ver DAMAGE más abajo). El genérico es de la wiki y
 * las tablas — salvo que ahora mismo hace además de suplente del 🗡️ Cuerpo a
 * cuerpo, que no tiene archivo; está explicado ahí y es temporal.
 */
export const SKILLS = [
  {
    key: "vida",
    label: "Vida",
    icon: "❤️",
    art: `${ICONS}/abilities/vida.png`,
  },
  {
    key: "ataque",
    label: "Ataque",
    icon: "⚔️",
    art: `${ICONS}/abilities/ataque.png`,
  },
  {
    key: "defensa",
    label: "Defensa",
    icon: "🛡️",
    art: `${ICONS}/abilities/defensa.png`,
  },
  {
    key: "resistencia",
    label: "Resistencia mágica",
    icon: "🔮",
    art: `${ICONS}/abilities/resistencia-magica.png`,
  },
  {
    key: "precision",
    label: "Precisión",
    icon: "🎯",
    art: `${ICONS}/abilities/precision.png`,
  },
  {
    key: "suerte",
    label: "Suerte",
    icon: "🍀",
    art: `${ICONS}/abilities/suerte.png`,
  },
  {
    key: "iniciativa",
    label: "Iniciativa",
    icon: "⚡",
    art: `${ICONS}/abilities/iniciativa.png`,
  },
  {
    key: "movimiento",
    label: "Movimiento",
    icon: "👢",
    art: `${ICONS}/abilities/movimiento.png`,
  },
] as const;

export type SkillKey = (typeof SKILLS)[number]["key"];

/**
 * El tipo de daño (docs/v3/razas.md §"Tipo de daño"). Campo obligatorio de toda
 * ficha, uno y solo uno — no es una Característica: lo llevan las 132, y un
 * rasgo que lleva todo el mundo no dice nada en la fila de glifos.
 *
 * Por eso se dibuja EN EL SITIO DEL ICONO DE ⚔️ Ataque: el glifo que acompaña
 * al número es el del tipo, así que la carta dice cuánto pega y de qué manera
 * en el mismo hueco y sin gastar ni un pixel más de marco.
 */
/**
 * 🗡️ Cuerpo a cuerpo usa `abilities/ataque.png` **de suplente, por decisión de
 * Dario** (26 de agosto de 2026), y conviene que quede escrito porque es la
 * única ficha del archivo cuyo `art` no es el suyo.
 *
 * Su archivo propio NO existe: la tanda de esa noche trajo dos de los tres
 * tipos. Dejarlo en emoji hacía que 70 de las 132 fichas —es el tipo de daño más
 * repetido con diferencia— enseñaran siete piezas de oro y un emoji suelto en la
 * misma fila, y con la fila entera de oro se ve mejor lo que se está juzgando.
 *
 * El precio, que es real y no se disimula: el genérico ⚔️ es **otro dibujo**
 * —espada ancha contra la daga que pedía el concepto— y `icons.md` §2 dice que
 * en una carta no se pinta nunca. Mientras esté aquí, la carta enseña "Ataque"
 * donde tiene que decir "Cuerpo a cuerpo". Se cae solo el día que llegue
 * `damage/cuerpo-a-cuerpo.png`, y hasta entonces sigue contado como pendiente en
 * `icons.md` §7 — el suplente tapa el hueco en la pantalla, no en la lista.
 */
export const DAMAGE = {
  cuerpo: { icon: "🗡️", label: "Cuerpo a cuerpo", art: `${ICONS}/abilities/ataque.png` },
  distancia: {
    icon: "🏹",
    label: "A distancia",
    art: `${ICONS}/damage/a-distancia.png`,
  },
  magico: { icon: "✨", label: "Mágico", art: `${ICONS}/damage/magico.png` },
} as const;

export type DamageKey = keyof typeof DAMAGE;

/**
 * Los 11 emblemas de raza (knowledge/v3/icon-concept/icons.md §4), entrados el
 * 27 de agosto de 2026 con la segunda tanda de pictogramas. Mismo relieve de
 * oro monocromo que las ocho Habilidades y, como ellas, **desnudos**: el aro
 * del medallón lo dibuja el marco de cada boceto, no el archivo.
 *
 * Tres se sustituyeron el 29 de agosto de 2026 —Humanos, No-muertos y Hombres
 * rata cambian de dibujo, no de ruta— y este mapa no se enteró: el archivo se
 * reemplaza en su sitio. Los tres descartados quedan en `icons/races/old/`, que
 * nadie referencia.
 *
 * VA EN UN MAPA POR RAZA Y NO EN UN CAMPO DE CADA FICHA, al contrario que la
 * ilustración. El emblema es de la RAZA: las doce fichas de Humanos comparten
 * archivo, así que un campo por ficha serían 132 copias de once rutas y once
 * regeneraciones a doce manos. `raceIcon` sí es campo de ficha, y se queda.
 *
 * Y están LOS ONCE aunque la baraja solo pinte cuatro razas. Los archivos
 * existen los once (public/assets/v3/icons/races/), así que la raza que entre en
 * races.ts trae su emblema sin tocar este archivo — que es lo contrario de lo
 * que pasa con la ilustración, donde cada ficha nueva trae su ruta.
 *
 * Las claves son el `race` de la ficha, literal. Si no coincide, raceArtFor()
 * devuelve undefined y la carta cae al emoji: se ve el hueco, no se rompe.
 */
const RACE_ART: Record<string, string> = {
  Humanos: `${ICONS}/races/humanos.png`,
  Enanos: `${ICONS}/races/enanos.png`,
  "No-muertos": `${ICONS}/races/no-muertos.png`,
  "Demonios infernales": `${ICONS}/races/demonios-infernales.png`,
  Elfos: `${ICONS}/races/elfos.png`,
  Orkos: `${ICONS}/races/orkos.png`,
  "Feéricos": `${ICONS}/races/feericos.png`,
  "Dracónidos": `${ICONS}/races/draconidos.png`,
  "Hombres rata": `${ICONS}/races/hombres-rata.png`,
  Constructos: `${ICONS}/races/constructos.png`,
  Abisales: `${ICONS}/races/abisales.png`,
};

/** El emblema de una raza, o `undefined` si esa raza no tiene archivo. */
export function raceArtFor(race: string): string | undefined {
  return RACE_ART[race];
}

/**
 * El ESTANDARTE de cada raza: el paño teñido del que cuelga el emblema, y que
 * hasta ahora dibujaba el CSS (`styles/components/card-sketch/_cuerpo.scss`).
 * Es la otra mitad de la pieza, y va aparte a propósito — el archivo es la
 * bandera VACÍA y el emblema se pone encima, que es como la heráldica reparte
 * campo y carga (knowledge/v3/card-concept/banners.md §4).
 *
 * Desde el 27 de agosto de 2026 están las ONCE, y salieron de una tacada con
 * los prompts corregidos (knowledge/v3/card-concept/prompts/banners.md): mismo
 * lienzo, mismo asta, mismo filete, y lo único que cambia de una a otra es el
 * TINTE y el CORTE del pie — que es justo el reparto que pedía el concepto.
 *
 * El paño de CSS que había antes NO se borra aunque ya no lo use ninguna de las
 * once. Es la red: una raza que entre mañana sin estandarte dibujado cae a un
 * paño teñido en vez de a un hueco. Vive en su parcial
 * (`styles/components/card-sketch/_cuerpo.scss`), y el selector que decide
 * es `[data-art]` — con archivo, la imagen; sin él, la tela pintada.
 */
const RACE_BANNERS: Record<string, string> = {
  Humanos: `${BANNERS}/humanos.png`,
  Enanos: `${BANNERS}/enanos.png`,
  "No-muertos": `${BANNERS}/no-muertos.png`,
  "Demonios infernales": `${BANNERS}/demonios-infernales.png`,
  Elfos: `${BANNERS}/elfos.png`,
  Orkos: `${BANNERS}/orkos.png`,
  "Feéricos": `${BANNERS}/feericos.png`,
  "Dracónidos": `${BANNERS}/draconidos.png`,
  "Hombres rata": `${BANNERS}/hombres-rata.png`,
  Constructos: `${BANNERS}/constructos.png`,
  Abisales: `${BANNERS}/abisales.png`,
};

/** El estandarte de una raza, o `undefined` si todavía no está dibujado. */
export function raceBannerFor(race: string): string | undefined {
  return RACE_BANNERS[race];
}

export type Trait = { icon: string; label: string };

/**
 * Unidad o héroe. No es un matiz de sabor: la unidad tiene tier (1–8, su
 * puesto en la progresión de la raza) y el héroe NO TIENE NADA en su lugar —V3
 * no tiene progresión de personaje (docs/v3/status.md §5), así que no hay ningún
 * dato en camino para ese hueco—. Cualquier boceto que meta el Tier en una pieza
 * fija del marco tiene que resolverlo poniendo otra cosa, no esperando el dato.
 */
export type SubjectKind = "unidad" | "heroe";

export type Subject = {
  readonly id: string;
  readonly name: string;
  readonly kind: SubjectKind;
  readonly race: string;
  /** Emoji de la raza, el que usa razas.md. */
  readonly raceIcon: string;
  /** Solo unidades: su puesto en la progresión. Los héroes no tienen. */
  readonly tier?: number;
  /** Clave de $rarity (styles/settings/_colors.scss) — ver rarityForTier(). */
  readonly rarity: string;
  /** Emoji de la unidad o del héroe: hace de ilustración cuando no hay imagen. */
  readonly icon: string;
  /**
   * Ilustración. Desde el 26 de agosto de 2026 **toda la que hay es de V3**, y ya
   * no es solo de esta raza: son VEINTICUATRO archivos, doce y doce. Los doce de
   * 👤 Humanos cuelgan de aquí (`public/assets/v3/races/humanos/`: los cuatro
   * héroes y las OCHO unidades de la progresión —Miliciano, Arquero, Caballero y
   * Mago del 26 de agosto de 2026, Caballería y Grifo del 27, ✝️ Paladín del 28 y
   * 🐉 Dragón dorado del 31—) y los doce de ⛏️ Enanos, que son la otra raza entera
   * y se cablean en `races.ts`, que es donde vive esa raza. El relleno prestado de
   * las cartas de clase de v2 se retiró con la tanda del 26, porque ya no cubría
   * ningún hueco — y con él se fue la última imagen del juego anterior que quedaba
   * en un lab de V3.
   *
   * **Ya no queda ninguna carta de Humanos en emoji** *(31-ago-2026)*, y con eso
   * se acaba el caso de prueba del hueco vacío en las dos razas dibujadas. En esta
   * plantilla sobrevive por una sola carta y prestada, el 🐉 Dragón esquelético del
   * caso límite, que es de 💀 No-muertos. (En la baraja hay muchas más, pero
   * tampoco son de aquí: 💀 No-muertos y 🔥 Demonios entraron enteras sin arte y
   * viven en `races.ts`.)
   *
   * **Y las doce son PROVISIONALES**, por decisión de Dario del 26 de agosto de
   * 2026: el generador no está respetando la especificación de
   * `public/assets/v3/README.md`, así que se va metiendo lo que sale para que
   * las cartas dejen de ser emojis y se puedan mirar de verdad. Ninguna es
   * definitiva, y por eso aquí no hay que cuadrar nada a mano — ni recortes, ni
   * `object-position` por sujeto, ni casos especiales. **Si una carta se ve mal
   * por su ilustración, se anota y se sigue.**
   *
   * De ahí salen dos cosas que conviene no confundir. Nueve archivos están en el
   * 5:7 vertical bueno (Guerrero, Mago héroe, Arquero, Caballero, Mago unidad,
   * Caballería, Grifo, Paladín y Dragón dorado) y tres entraron apaisados
   * —1484×1060, el mismo lienzo girado— (Sacerdote, Arquero héroe y Miliciano),
   * así que al pasar de uno a otro se ve por qué el lienzo tenía que ser 5:7. Pero
   * el desajuste que de verdad se nota en la carta no es ese: es el ENCUADRE, que
   * se sale de la norma en once de los doce —la figura acaba entre el 77% y el 91%
   * del alto cuando el tope es el 72%—, así que el panel de cualquier boceto le
   * come las piernas. Y con ⛏️ Enanos dentro eso dejó de ser cosa de esta tirada:
   * sus doce fallan igual, en la misma banda, así que de los veinticuatro archivos
   * **solo el ✝️ Sacerdote cumple** y cumple de rebote. Los dos están medidos en ese
   * README y ninguno es tarea: son la lista de comprobación de cuando llegue la
   * generación buena.
   */
  readonly art?: string;
  readonly skills: Record<SkillKey, number>;
  /** Tipo de daño. Obligatorio: no hay defecto, igual que en razas.md. */
  readonly damage: DamageKey;
  readonly traits: readonly Trait[];
};

/**
 * Arte de V3 **de la raza piloto, que desde el 31 de agosto de 2026 está
 * completa**. Son DOCE archivos: los CUATRO héroes de Humanos y sus OCHO unidades
 * de progresión enteras, del 🗡️ Miliciano al 🐉 Dragón dorado. Las otras doce del
 * juego son de ⛏️ Enanos y tienen sus propias funciones en `races.ts`: el arte
 * sigue al dato, y el dato de cada raza vive en su archivo.
 *
 * Con esa tanda desapareció `ART_V2`, que prestaba las cartas de clase del juego
 * anterior a las unidades sin arte. No hacía falta borrarlo a mano: al quedarse
 * sin ninguna llamada dejó de compilar limpio, que es la manera de que un
 * apaño provisional avise de que ya sobra.
 *
 * La ruta y el nombre son los que manda `public/assets/v3/README.md`, que es la
 * fuente única: `races/<raza>/` para los héroes y `races/<raza>/units/` para las
 * unidades, con el slug del nombre español. De ahí las dos funciones: la carpeta
 * es lo que separa a un héroe de una unidad, y no el nombre —👤 Humanos tiene un
 * 🏹 Arquero y un 🔮 Mago de cada clase, y cada par se llama igual—. Es el mismo
 * choque de nombres que status.md tiene abierto como «los 25 nombres duplicados»,
 * y aquí ya está resuelto por carpeta.
 *
 * Siguen siendo `.png` de ~2,5 MB donde ese documento pide `.webp`, y el motivo
 * de no convertirlos no ha cambiado: el arte todavía se está tirando y volviendo
 * a tirar. Doce archivos son ya ~30 MB de esta raza sola —lo mismo que pesa
 * ⛏️ Enanos, o sea que la cuenta por raza completa ya tiene dos muestras y dan la
 * misma cifra—, y los veinticuatro del repo ~60 MB, así que la conversión pesa de
 * verdad — pero el marco ya está
 * elegido (J · Orla), así que lo que la retiene no es esa decisión: es que a
 * estos archivos les queda otra vuelta por el encuadre. La cuenta y la decisión
 * pendiente están en `public/assets/v3/README.md`.
 */
const ART_V3 = (slug: string) => `/assets/v3/races/humanos/${slug}.png`;

/** Igual, pero para las unidades: cuelgan de `units/`. */
const ART_V3_UNIT = (slug: string) => `/assets/v3/races/humanos/units/${slug}.png`;

/**
 * Rareza por tier. **Ya no se inventa aquí**: desde el 5 de septiembre de 2026
 * es una regla de V3 y vive en `lib/v3/rarity.ts`, derivada de las 88 unidades
 * de razas.md. Lo que había antes era un reparto provisional (1-2 · 3-4 · 5-6 ·
 * 7 · 8) puesto para que los bocetos enseñaran los cinco raíles; se cambia el
 * corte en dos sitios (el tier 5 sube a poco-común, el 6 baja a raro) y los
 * sujetos de más abajo se repintan solos.
 *
 * Se reexporta con el mismo nombre porque los sujetos la llaman en cada tier y
 * el resto del archivo no tiene por qué saber de dónde salió.
 */
export { rarityForTier };

/**
 * Lo que va bajo el nombre: el rango de la carta. Es lo único que un boceto
 * tiene que preguntar para saber si está pintando una unidad o un héroe.
 */
export const rankOf = (s: Subject) => (s.kind === "heroe" ? "Héroe" : `Tier ${s.tier}`);

/**
 * Raíl de color de un héroe: el suyo, no un escalón prestado de la escala de
 * rareza. Clave de $rarity (styles/settings/_colors.scss), donde vive junto a
 * las otras categorías que no son escalones de rareza ("clase", "enemigo"…), y allí está
 * el porqué del color — es la sangre del tema de producción.
 *
 * Un héroe no tiene tier, así que no puede tener rareza por tier; y darle una
 * a mano decía que un Sacerdote es "más legendario" que un Guerrero, que es
 * falso. Los tres comparten raíl y así se leen como lo que son: una familia
 * distinta de las unidades.
 *
 * Vive con la regla, en `lib/v3/rarity.ts`, desde que la regla existe
 * (5-sep-2026): es la otra mitad de la misma pregunta —qué raíl le toca a una
 * ficha— y tenerlas separadas invitaba a que una se moviera sin la otra.
 */
export { HERO_RAIL };

// --- Las ocho unidades de 👤 Humanos --------------------------------------
// razas.md §"Unidades › 👤 Humanos — Progresión de unidades" para el orden y
// los nombres, y §"Características de todas las unidades › 👤 Humanos" para
// los chips. El tier es la posición en esa progresión.
export const UNITS: readonly Subject[] = [
  {
    id: "miliciano",
    name: "Miliciano",
    kind: "unidad",
    race: "Humanos",
    raceIcon: "👤",
    tier: 1,
    rarity: rarityForTier(1),
    icon: "🗡️",
    // El caso vacío: cero Características y todo a una cifra menos la Vida.
    // Es el que descubre los huecos que se ven vacíos.
    //
    // Y desde el 25-ago-2026 es además la PRIMERA UNIDAD con arte propio de V3,
    // que es un caso que ningún héroe enseña: la carta de tier 1 lleva el raíl
    // 🩶 común, el rótulo "Tier 1" y el raíl de medallones vacío, todo encima de
    // una ilustración de verdad. Hasta ahora ese caso solo se había visto con un
    // emoji detrás, que perdona cualquier contraste.
    art: ART_V3_UNIT("miliciano"),
    skills: {
      vida: 18,
      ataque: 6,
      defensa: 4,
      resistencia: 1,
      precision: 66,
      suerte: 0,
      iniciativa: 5,
      movimiento: 4,
    },
    damage: "cuerpo",
    traits: [],
  },
  {
    id: "arquero",
    name: "Arquero",
    kind: "unidad",
    race: "Humanos",
    raceIcon: "👤",
    tier: 2,
    rarity: rarityForTier(2),
    icon: "🏹",
    art: ART_V3_UNIT("arquero"),
    skills: {
      vida: 15,
      ataque: 7,
      defensa: 3,
      resistencia: 1,
      precision: 78,
      suerte: 2,
      iniciativa: 6,
      movimiento: 4,
    },
    damage: "distancia",
    // Sin Características: la única que tenía era 🏹 Ataque a distancia, que
    // ahora es el campo `damage`. Los casos vacíos de la raza pasan de uno a
    // TRES —Miliciano, Arquero y Mago—, así que el raíl sin medallones deja de
    // ser una rareza y hay que mirarlo.
    traits: [],
  },
  {
    id: "caballero",
    name: "Caballero",
    kind: "unidad",
    race: "Humanos",
    raceIcon: "👤",
    tier: 3,
    rarity: rarityForTier(3),
    icon: "🛡️",
    art: ART_V3_UNIT("caballero"),
    skills: {
      vida: 34,
      ataque: 10,
      defensa: 12,
      resistencia: 3,
      precision: 72,
      suerte: 2,
      iniciativa: 4,
      movimiento: 3,
    },
    damage: "cuerpo",
    traits: [{ icon: "🛡️", label: "Resistente al daño físico" }],
  },
  {
    id: "mago",
    name: "Mago",
    kind: "unidad",
    race: "Humanos",
    raceIcon: "👤",
    tier: 4,
    rarity: rarityForTier(4),
    icon: "🔮",
    art: ART_V3_UNIT("mago"),
    skills: {
      vida: 24,
      ataque: 5,
      defensa: 3,
      resistencia: 12,
      precision: 74,
      suerte: 3,
      iniciativa: 5,
      movimiento: 4,
    },
    damage: "magico",
    traits: [],
  },
  {
    id: "caballeria",
    name: "Caballería",
    kind: "unidad",
    race: "Humanos",
    raceIcon: "👤",
    tier: 5,
    rarity: rarityForTier(5),
    icon: "🐎",
    // El primer sujeto MONTADO con arte, que es el caso ancho que la norma de
    // encuadre resuelve alejando la cámara: caballo y jinete entran completos y
    // la figura sale más pequeña, como estaba pedido. Lo que no cumple es el
    // pie —cascos al 88%— y el remate de arriba: la punta de la lanza acaba al
    // 1% del alto, pegada al filo que el marco tapa.
    art: ART_V3_UNIT("caballeria"),
    skills: {
      vida: 48,
      ataque: 16,
      defensa: 9,
      resistencia: 4,
      precision: 76,
      suerte: 4,
      iniciativa: 10,
      movimiento: 7,
    },
    damage: "cuerpo",
    traits: [
      { icon: "🐾", label: "Ágil" },
      { icon: "💥", label: "Golpe crítico" },
    ],
  },
  {
    id: "grifo",
    name: "Grifo",
    kind: "unidad",
    race: "Humanos",
    raceIcon: "👤",
    tier: 6,
    rarity: rarityForTier(6),
    icon: "🦅",
    // El primer sujeto VOLADOR con arte, y el que mejor cae de los veinticuatro
    // después del ✝️ Sacerdote: la garra más baja queda al 77% y el cuarto de
    // abajo es castillo, o sea fondo, que es lo que la norma pide ahí. No es
    // mérito del prompt sino de que vuela — el ancla de suelo se cambió por
    // «cielo sobre piedra abajo» y el sujeto flota por encima. A cambio falla
    // por donde su propio prompt avisaba: las alas se salen del cuadro (la
    // derecha por arriba, la izquierda por el lado), y las alas eran su rasgo
    // obligatorio. Con el 🐉 Dragón dorado del 31 eso deja de ser cosa suya: los
    // dos sujetos con envergadura del juego han salido con las alas cortadas.
    art: ART_V3_UNIT("grifo"),
    skills: {
      vida: 62,
      ataque: 19,
      defensa: 11,
      resistencia: 6,
      precision: 80,
      suerte: 5,
      iniciativa: 14,
      movimiento: 9,
    },
    damage: "cuerpo",
    traits: [
      { icon: "🦅", label: "Volador" },
      { icon: "💥", label: "Golpe crítico" },
      { icon: "🐾", label: "Ágil" },
    ],
  },
  {
    id: "paladin",
    name: "Paladín",
    kind: "unidad",
    race: "Humanos",
    raceIcon: "👤",
    tier: 7,
    rarity: rarityForTier(7),
    icon: "✝️",
    // El PEOR encuadre DE UN CUERPO de los veinticuatro, y con diferencia: la
    // bota de delante cae al 91% del alto (la de detrás al 86%), cuando hasta
    // ahora el suelo lo marcaban tres archivos al 89%. La figura va del 10% —la
    // punta del penacho— al 91,5%, o sea que ocupa el 81% del lienzo donde la
    // norma pide un 60%: no es plano general, es plano entero. (El 🐉 Dragón
    // dorado empata la cifra pero con la cola: su cuerpo para al 84%.) El panel del pie de la J no le come las
    // piernas, le come las botas enteras. Y repite el fallo de borde de la
    // 🐎 Caballería girado 90°: la cabeza del mazo llega al 2% del ANCHO, pegada
    // al filo izquierdo que el marco tapa.
    art: ART_V3_UNIT("paladin"),
    skills: {
      vida: 96,
      ataque: 24,
      defensa: 22,
      resistencia: 14,
      precision: 85,
      suerte: 6,
      iniciativa: 9,
      movimiento: 5,
    },
    damage: "cuerpo",
    traits: [
      { icon: "🛡️", label: "Resistente al daño físico" },
      { icon: "😱", label: "Inmune al miedo" },
    ],
  },
  {
    id: "dragon-dorado",
    name: "Dragón dorado",
    kind: "unidad",
    race: "Humanos",
    raceIcon: "👤",
    tier: 8,
    rarity: rarityForTier(8),
    icon: "🐉",
    // El techo de Humanos: cuatro Características, tres cifras de Vida y trece
    // caracteres de nombre, justo el límite del escalón de rótulo (LONG_NAME).
    //
    // Y con su arte (31-ago-2026) la raza queda dibujada entera, así que esta
    // plantilla se queda SIN ninguna carta a emoji: el hueco vacío solo se ve ya
    // en el 🐉 Dragón esquelético del caso límite, que es de otra raza.
    //
    // Encuadre: el primer archivo del repo que falla por un APÉNDICE y no por el
    // cuerpo. Las garras delanteras acaban al 81% y las traseras al 84% —antes
    // que las de cualquier sujeto a pie de las dos razas—, pero la cola cuelga
    // hasta el 91%, que empata la peor cifra (el ✝️ Paladín). Con la punta del ala
    // al 5% la figura ocupa el 86% del alto donde la norma pide un 60%: es el
    // nuevo techo, y por envergadura, no por cámara. Las dos alas salen cortadas
    // por los filos (izquierda ~19–55% del alto, derecha ~17–49%) aunque su propio
    // bloque pedía «la criatura ENTERA dentro del cuadro»: con el 🦅 Grifo son dos
    // de dos, los dos sujetos con envergadura del juego.
    art: ART_V3_UNIT("dragon-dorado"),
    skills: {
      vida: 240,
      ataque: 48,
      defensa: 30,
      resistencia: 28,
      precision: 90,
      suerte: 8,
      iniciativa: 12,
      movimiento: 9,
    },
    damage: "cuerpo",
    traits: [
      { icon: "🦅", label: "Volador" },
      { icon: "🔥", label: "Inmune al fuego" },
      { icon: "🔥", label: "Fuego" },
      { icon: "💣", label: "Explosivo" },
    ],
  },
];

// --- Los cuatro héroes de 👤 Humanos ---------------------------------------
// razas.md §"Razas y clases › 👤 Humanos" y §"Tabla de características de
// héroes", en su orden: ⚔️ Guerrero, 🔮 Mago, ✝️ Sacerdote y 🏹 Arquero. Están
// los cuatro y los cuatro tienen ilustración — el Arquero era el que faltaba y
// llegó el 25-ago-2026—, así que la clase de héroe ya se juzga entera y no por
// una muestra.
//
// El 🔮 Mago choca de nombre con la unidad 🔮 Mago, y el 🏹 Arquero con la
// unidad 🏹 Arquero. Ahora la segunda colisión también está en la página, y es
// la peor de las dos: los dos Arqueros comparten nombre, emoji y tipo de daño,
// y lo único que los distingue es el rótulo bajo el nombre ("Héroe" contra
// "Tier 2"). Un marco que no haga legible esa línea deja dos cartas idénticas.
// Es un problema del catálogo de razas.md, pero se ve aquí.
//
// Los tres comparten HERO_RAIL: los héroes tienen color propio y no un escalón
// de la escala de rareza, que no les corresponde. Ver ahí el porqué.
export const HEROES: readonly Subject[] = [
  {
    id: "heroe-guerrero",
    name: "Guerrero",
    kind: "heroe",
    race: "Humanos",
    raceIcon: "👤",
    rarity: HERO_RAIL,
    icon: "⚔️",
    art: ART_V3("guerrero"),
    skills: {
      vida: 120,
      ataque: 22,
      defensa: 20,
      resistencia: 8,
      precision: 82,
      suerte: 5,
      iniciativa: 8,
      movimiento: 5,
    },
    damage: "cuerpo",
    // Esta ficha fue la que destapó el problema del glifo repetido: Último
    // aliento llevaba 🛡️, igual que Resistente al daño físico, y en un marco que
    // dibuja las Características como glifos y sin texto la carta enseñaba el
    // mismo icono dos veces. Resuelto en razas.md (22-ago-2026) dándole 😤, que
    // además deja de mentir: Último aliento es un buff de daño, no de defensa.
    traits: [
      { icon: "🛡️", label: "Resistente al daño físico" },
      { icon: "😱", label: "Inmune al miedo" },
      { icon: "😤", label: "Último aliento" },
    ],
  },
  {
    id: "heroe-mago",
    name: "Mago",
    kind: "heroe",
    race: "Humanos",
    raceIcon: "👤",
    rarity: HERO_RAIL,
    icon: "🔮",
    art: ART_V3("mago"),
    skills: {
      vida: 78,
      ataque: 14,
      defensa: 9,
      resistencia: 26,
      precision: 80,
      suerte: 6,
      iniciativa: 7,
      movimiento: 5,
    },
    damage: "magico",
    // El héroe con menos Características del set: es el que enseña el raíl
    // corto. Tenía dos y se queda en una — ✨ Ataque mágico dejó de ser rasgo
    // el 23-ago-2026 y ahora es el campo `damage`, que se dibuja en el icono
    // del Ataque. Ese hueco liberado es justo lo que compra el campo nuevo.
    traits: [{ icon: "🧊", label: "Resistente al frío" }],
  },
  {
    id: "heroe-sacerdote",
    name: "Sacerdote",
    kind: "heroe",
    race: "Humanos",
    raceIcon: "👤",
    rarity: HERO_RAIL,
    icon: "✝️",
    art: ART_V3("sacerdote"),
    skills: {
      vida: 84,
      ataque: 11,
      defensa: 12,
      resistencia: 20,
      precision: 77,
      suerte: 7,
      iniciativa: 7,
      movimiento: 5,
    },
    damage: "magico",
    traits: [{ icon: "😱", label: "Inmune al miedo" }],
  },
  {
    id: "heroe-arquero",
    name: "Arquero",
    kind: "heroe",
    race: "Humanos",
    raceIcon: "👤",
    rarity: HERO_RAIL,
    icon: "🏹",
    art: ART_V3("arquero"),
    skills: {
      vida: 88,
      ataque: 19,
      defensa: 10,
      resistencia: 9,
      // La 🎯 Precisión más alta de los cuatro, y no por gusto: es el único que
      // lleva 👁️ Percepción y 💥 Golpe crítico a la vez. Sigue dentro de la
      // banda 65-95 que fija razas.md §"La escala".
      precision: 88,
      suerte: 8,
      iniciativa: 11,
      movimiento: 6,
    },
    damage: "distancia",
    traits: [
      { icon: "👁️", label: "Percepción" },
      { icon: "💥", label: "Golpe crítico" },
    ],
  },
];

// --- Fuera de la raza piloto ----------------------------------------------
// Humanos llega a cuatro Características y a trece caracteres de nombre, y el
// catálogo llega a cinco y a veinte. Esa diferencia es justo la que revienta un
// raíl o una cenefa que iba justa, así que la muestra necesita al menos un
// sujeto que la toque. Va aparte para que se vea que no forma parte de la
// plantilla de la raza.
/**
 * El 🐉 Dragón esquelético, con nombre propio y no solo dentro de STRESS.
 *
 * Nunca fue un sujeto inventado para forzar un marco: es la **unidad de tier 8
 * de 💀 No-muertos**, tal cual la escribe razas.md, y aquí entró antes que su
 * raza solo porque era el único sitio donde se podía mirar un raíl de cinco
 * Características. Desde el 26 de agosto de 2026 su raza está en la baraja
 * (races.ts), así que **la misma ficha hace los dos papeles** —caso límite del
 * laboratorio y último escalón de la progresión de su raza— en vez de haber dos
 * copias que puedan desalinearse. Que es la misma razón por la que la baraja
 * importa 👤 Humanos de aquí en vez de copiarlo.
 *
 * Por eso su `id` no lleva el prefijo de raza que llevan los sujetos escritos en
 * races.ts: es más antiguo que esa norma y el id es el valor del selector de
 * este laboratorio, así que renombrarlo sería mover un control por estética.
 */
export const SKELETAL_DRAGON: Subject = {
  id: "dragon-esqueletico",
  name: "Dragón esquelético",
  kind: "unidad",
  race: "No-muertos",
  raceIcon: "💀",
  tier: 8,
  rarity: rarityForTier(8),
  icon: "🐉",
  skills: {
    vida: 210,
    ataque: 44,
    defensa: 26,
    resistencia: 32,
    precision: 86,
    suerte: 4,
    iniciativa: 11,
    movimiento: 9,
  },
  damage: "cuerpo",
  traits: [
    { icon: "💀", label: "No-muerto" },
    { icon: "🦅", label: "Volador" },
    { icon: "🧊", label: "Hielo" },
    { icon: "😱", label: "Inmune al miedo" },
    { icon: "🧪", label: "Inmune a estados alterados" },
  ],
};

export const STRESS: readonly Subject[] = [SKELETAL_DRAGON];

export const SUBJECTS: readonly Subject[] = [...UNITS, ...HEROES, ...STRESS];

/** Nombre a partir del cual el rótulo baja de escalón (sketch-font "name-long"). */
export const LONG_NAME = 13;
