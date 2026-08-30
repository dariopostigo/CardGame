// =========================================================================
// El roster de "Diseño baraja" — las razas que hoy se pueden pintar
//
// Esta página crece raza a raza, y este es el archivo que crece. La lista de
// razas estaba escrita dentro de CardDeck.tsx cuando solo había una: con dos
// ya no cabe ahí sin meter doce fichas de datos en un componente.
//
// POR QUÉ NO VA EN sample.ts, que es donde está 👤 Humanos. Porque sample.ts
// no es "los datos de V3": es la MUESTRA del laboratorio de bocetos
// (CardSketchLab), la plantilla de la raza piloto contra la que se comparan
// nueve marcos. Añadir Enanos allí las metería también en esa comparación, y
// nueve bocetos × veinticuatro cartas no se comparan: se hojean. El
// laboratorio se queda con la raza piloto, que es todo lo que necesita para
// juzgar un marco, y la baraja —que ya no compara nada— es la que acumula.
//
// Así que Humanos se IMPORTA de sample.ts en vez de copiarse. Sigue habiendo
// una sola copia de cada dato: la raza piloto vive donde nació, y de aquí en
// adelante cada raza nueva se escribe aquí.
import {
  HEROES as HUMAN_HEROES,
  HERO_RAIL,
  rarityForTier,
  SKELETAL_DRAGON,
  UNITS as HUMAN_UNITS,
  type Subject,
} from "./sample";

// --- ⛏️ Enanos ------------------------------------------------------------
// La segunda raza base de knowledge/v3/races-concept/razas.md, entrada el 26 de
// agosto de 2026. Nombres, emojis, orden de progresión, tipo de daño y
// Características salen de allí tal cual —§"Enanos — Progresión de unidades",
// §"Características de todas las unidades › ⛏️ Enanos" y §"Tabla de
// características de héroes"—.
//
// LOS NÚMEROS SON INVENTADOS, igual que los de Humanos y con el mismo aviso:
// razas.md no tiene ni una cifra de Enanos, y las 1.056 de las 132 fichas
// siguen siendo insumo de Dario. Lo que aquí importa es la FORMA (cuántas
// cifras entran en cada hueco del marco), no el valor. Lo que sí se ha
// respetado, porque está cerrado (razas.md §"La escala", 23-ago-2026): Vida
// 2-3 cifras, Ataque 1-2, 🛡️/🔮 por debajo de 75, 🎯 Precisión en 65-95,
// 🍀 Suerte por debajo de 25 y nunca por encima de Precisión, y la curva de
// ×10 de Vida y Ataque del tier 1 al 8 —del ⛏️ Minero al ⛰️ Coloso hay ×12 de
// Vida y ×10 de Ataque—.
//
// Y NO SON LOS DE HUMANOS CON OTRO NOMBRE. La raza tiene un sesgo escrito en
// sus Características —seis de las ocho unidades llevan 🛡️ Resistente al daño
// físico— y los números lo siguen: 🛡️ Defensa alta (el Coloso a 70, lo más
// cerca del tope de 75 que hay en la página), 🔮 Resistencia mágica baja como
// contrapeso, y ⚡ Iniciativa y 👢 Movimiento cortos —ninguna unidad pasa de 3
// hexágonos, cuando el 🦅 Grifo de Humanos anda por 9—. Eso es lo que hace que
// la raza sirva de algo aquí: pone dos columnas del pie a números de una cifra
// repetidos, que es un caso que Humanos no daba.
//
// LAS DOCE TIENEN ILUSTRACIÓN, y eso pasó el mismo día que entraron los números
// (26 de agosto de 2026, esa noche): los cuatro héroes en
// public/assets/v3/races/enanos/ y las ocho unidades en enanos/units/, con los
// slugs que ya pedía knowledge/v3/races-concept/prompts/enanos.md §"Al terminar".
//
// Y con eso ⛏️ ENANOS FUE LA PRIMERA RAZA DIBUJADA ENTERA, cinco días antes que la
// piloto. Conviene tenerlo escrito porque invierte la premisa de ese archivo de
// prompts («Fase 2: entra cuando Humanos esté cerrado», «sin las 12 imágenes de
// la raza piloto no hay vara de medir»): durante esos cinco días la vara de medir
// la puso esta raza, la única con una progresión de ocho tiers completa y cuatro
// héroes al lado. Desde el 31 de agosto de 2026 son DOS —👤 Humanos cerró con el
// 🐉 Dragón dorado—, así que ahora hay dos progresiones enteras que comparar entre
// sí, y acaban en cosas distintas a propósito: aquí en un armazón de metal
// (⛰️ Coloso de adamantita), allí en una criatura.
//
// Lo que Humanos seguía enseñando y aquí no —el hueco del emoji en una carta de
// verdad— se acabó con esa tanda: sus unidades sin arte bajaron de cuatro a dos
// el 27 (entraron 🐎 Caballería y 🦅 Grifo), a una el 28 (✝️ Paladín) y a ninguna
// el 31. En todo el laboratorio el hueco vacío se ve ya en una sola carta, el
// 🐉 Dragón esquelético del caso límite de `sample.ts`, que es de 💀 No-muertos —o
// sea que ninguna de las dos razas dibujadas puede volver a enseñarlo.
//
// SON PROVISIONALES, igual que las de Humanos y por la misma decisión de Dario
// (public/assets/v3/README.md): se mete lo que sale para que las cartas dejen de
// ser emojis y se puedan mirar. Aquí no se cuadra nada a mano — ni recortes, ni
// `object-position` por sujeto. Si una carta se ve mal por su ilustración, se
// anota y se sigue.
//
// De la tanda salen dos datos, y el primero es una MEJORA: las doce son
// VERTICALES. Ni una apaisada, que es lo que estropeaba tres de las doce de
// Humanos. Siete están en el 5:7 bueno (1060×1484) y cinco en 2:3 (1024×1536:
// Minero, Guerrero enano, Herrero de guerra, Ingeniero unidad y Mosquetero), que
// no es un fallo — el README lo da como el sustituto válido cuando la herramienta
// no ofrece 5:7. El segundo dato es el de siempre y ahora es unánime: el ENCUADRE
// se sale de la norma en las DOCE, con los pies entre el 82% y el 89% del alto
// cuando el tope son 72, así que el panel del pie de la J les come las piernas.
// Está medido archivo por archivo en ese README y no es tarea de aquí.
//
// Los `id` van prefijados con la raza a propósito: ⚙️ Ingeniero es a la vez
// héroe y unidad de Enanos —una de las 25 colisiones de nombre que status.md
// tiene abiertas—, y ⚔️ Guerrero se llama igual que el héroe de Humanos. Sin
// prefijo habría dos sujetos con el mismo id en la misma página.

/**
 * Las dos rutas del arte de ⛏️ Enanos. Son las mismas funciones que `sample.ts`
 * tiene para Humanos, con la raza cambiada — y van copiadas a propósito en vez de
 * importarse: lo que las separa es la CARPETA, y una función que reciba la raza
 * por parámetro convierte en dato de llamada lo único que este archivo ya sabe de
 * memoria. Cuando haya cinco razas se generalizan; con dos, un `ART(raza, slug)`
 * solo añade un argumento que siempre vale lo mismo.
 *
 * La carpeta es también lo que resuelve la colisión ⚙️ Ingeniero, que en esta raza
 * es héroe Y unidad de tier 4: `enanos/ingeniero.png` y
 * `enanos/units/ingeniero.png` son dos archivos distintos con el mismo nombre, y
 * eso ya lo dejaba escrito el archivo de prompts.
 *
 * `.png` de ~2,7 MB, donde el README pide `.webp`. Con estas doce el repo pasó de
 * ~20 MB a ~52 MB de arte provisional —y con las cuatro de Humanos del 27, el 28 y
 * el 31 de agosto va por ~60 MB—, así que el argumento de «no convertir lo que se
 * va a tirar» ya no sale gratis: sigue en pie, pero es el dato que hay que mirar
 * cuando llegue la tercera raza, y ahora la proyección tiene dos muestras en vez
 * de una — las dos razas completas pesan 30,1 MB cada una.
 */
const ART_DWARF = (slug: string) => `/assets/v3/races/enanos/${slug}.png`;

/** Igual, pero para las unidades: cuelgan de `units/`. */
const ART_DWARF_UNIT = (slug: string) =>
  `/assets/v3/races/enanos/units/${slug}.png`;

const DWARF_UNITS: readonly Subject[] = [
  {
    id: "enanos-minero",
    name: "Minero",
    kind: "unidad",
    race: "Enanos",
    raceIcon: "⛏️",
    tier: 1,
    rarity: rarityForTier(1),
    icon: "⛏️",
    // El tier 1 de la raza, y a diferencia del 🗡️ Miliciano de Humanos NO es el
    // caso vacío: ya trae 🛡️ Resistente al daño físico. En Enanos el raíl de
    // medallones no se vacía nunca por abajo, solo por el ⚙️ Ingeniero y el
    // 🔫 Mosquetero, que son los dos de 🏹 A distancia.
    //
    // Su emoji ⛏️ es el MISMO que el de la raza, y hasta que llegó el arte esta
    // carta repetía el pico en la ilustración y en el emblema del medallón. Con
    // `art` puesto el choque DESAPARECE —el pico se queda solo en el medallón—,
    // y eso deja un dato que no se veía venir: el emoji de sujeto y el emblema de
    // raza solo compiten mientras el sujeto no está dibujado, así que de los
    // problemas que status.md §"marco que gana" apunta sobre el emblema, este se
    // arregla solo. El otro no: un emblema hecho con un emoji de razas.md sigue
    // sin distinguir nada por sí solo a 42px.
    art: ART_DWARF_UNIT("minero"),
    skills: {
      vida: 22,
      ataque: 5,
      defensa: 8,
      resistencia: 2,
      precision: 68,
      suerte: 0,
      iniciativa: 4,
      movimiento: 3,
    },
    damage: "cuerpo",
    traits: [{ icon: "🛡️", label: "Resistente al daño físico" }],
  },
  {
    id: "enanos-guerrero-enano",
    name: "Guerrero enano",
    kind: "unidad",
    race: "Enanos",
    raceIcon: "⛏️",
    tier: 2,
    rarity: rarityForTier(2),
    icon: "🪓",
    // El nombre lleva la raza dentro porque la unidad se llamaba "Guerrero" y
    // choca con el héroe ⚔️ Guerrero: es uno de los 25 duplicados de status.md,
    // y de los pocos que razas.md ya trae resuelto por el lado que se decidió
    // renombrar (la unidad, no el héroe).
    art: ART_DWARF_UNIT("guerrero-enano"),
    skills: {
      vida: 32,
      ataque: 7,
      defensa: 16,
      resistencia: 4,
      precision: 71,
      suerte: 1,
      iniciativa: 4,
      movimiento: 3,
    },
    damage: "cuerpo",
    traits: [{ icon: "🛡️", label: "Resistente al daño físico" }],
  },
  {
    id: "enanos-herrero-de-guerra",
    name: "Herrero de guerra",
    kind: "unidad",
    race: "Enanos",
    raceIcon: "⛏️",
    tier: 3,
    rarity: rarityForTier(3),
    icon: "🔨",
    // GLIFO REPETIDO, y es un caso nuevo: 🗡️ Perforante usa el mismo emoji que
    // el tipo de daño 🗡️ Cuerpo a cuerpo, que se dibuja pegado al número de
    // ⚔️ Ataque. En un marco que pinta las Características como glifos sin
    // texto, la carta enseña 🗡️ dos veces y en dos sitios que significan cosas
    // distintas. Es el mismo problema que en Humanos tenía 😤 Último aliento
    // con 🛡️ —resuelto en razas.md el 22-ago cambiándole el emoji—, pero aquí
    // choca contra un CAMPO y no contra otro rasgo, así que no se arregla
    // repartiendo iconos entre Características: o cambia el emoji de
    // Perforante, o el rasgo se lee mal en las dos fichas donde pasa (esta y el
    // ⛰️ Coloso de adamantita). Es problema de razas.md; aquí solo se ve.
    art: ART_DWARF_UNIT("herrero-de-guerra"),
    skills: {
      vida: 42,
      ataque: 11,
      defensa: 22,
      resistencia: 6,
      precision: 70,
      suerte: 2,
      iniciativa: 3,
      movimiento: 3,
    },
    damage: "cuerpo",
    traits: [
      { icon: "🛡️", label: "Resistente al daño físico" },
      { icon: "🗡️", label: "Perforante" },
    ],
  },
  {
    id: "enanos-ingeniero",
    name: "Ingeniero",
    kind: "unidad",
    race: "Enanos",
    raceIcon: "⛏️",
    tier: 4,
    rarity: rarityForTier(4),
    icon: "⚙️",
    // Se llama igual, con el mismo emoji, que el héroe ⚙️ Ingeniero de su
    // propia raza — y los dos son 🏹 A distancia. Es la colisión del 🏹 Arquero
    // de Humanos otra vez, y otra vez lo único que separa las dos cartas es el
    // rótulo bajo el nombre ("Héroe" contra "Tier 4"). Con Humanos pasaba una
    // vez por raza; en Enanos vuelve a pasar, así que ya no es anécdota.
    art: ART_DWARF_UNIT("ingeniero"),
    skills: {
      vida: 46,
      ataque: 13,
      defensa: 6,
      resistencia: 3,
      precision: 82,
      suerte: 3,
      iniciativa: 5,
      movimiento: 3,
    },
    damage: "distancia",
    traits: [{ icon: "👁️", label: "Percepción" }],
  },
  {
    id: "enanos-mosquetero",
    name: "Mosquetero",
    kind: "unidad",
    race: "Enanos",
    raceIcon: "⛏️",
    tier: 5,
    rarity: rarityForTier(5),
    icon: "🔫",
    // La 🎯 Precisión más alta de las ocho unidades, que es lo único que
    // distingue a un tirador cuando el Alcance es fijo por tipo de daño
    // (razas.md, 23-ago: 🏹 son 4 hexágonos y no un campo por ficha).
    art: ART_DWARF_UNIT("mosquetero"),
    skills: {
      vida: 58,
      ataque: 21,
      defensa: 5,
      resistencia: 3,
      precision: 86,
      suerte: 6,
      iniciativa: 6,
      movimiento: 3,
    },
    damage: "distancia",
    traits: [{ icon: "🗡️", label: "Perforante" }],
  },
  {
    id: "enanos-guardia-de-hierro",
    name: "Guardia de hierro",
    kind: "unidad",
    race: "Enanos",
    raceIcon: "⛏️",
    tier: 6,
    rarity: rarityForTier(6),
    icon: "🛡️",
    // El otro caso de 🛡️ repetido, y el arte se lo lleva también: el emoji hacía
    // de ilustración y volvía a salir en su propia Característica, y ahora solo
    // queda el de la Característica. Es la misma lección del ⛏️ Minero — los
    // choques que el emoji provocaba por hacer de relleno se van con el relleno—,
    // y sirve para no arreglar dos veces lo mismo: el que hay que resolver de
    // verdad es el del 🔨 Herrero, que choca contra un CAMPO del marco y no
    // contra un hueco de imagen.
    art: ART_DWARF_UNIT("guardia-de-hierro"),
    skills: {
      vida: 132,
      ataque: 22,
      defensa: 45,
      resistencia: 18,
      precision: 72,
      suerte: 2,
      iniciativa: 3,
      movimiento: 2,
    },
    damage: "cuerpo",
    traits: [
      { icon: "🛡️", label: "Resistente al daño físico" },
      { icon: "🧪", label: "Inmune a estados alterados" },
    ],
  },
  {
    id: "enanos-golem-de-piedra",
    name: "Gólem de piedra",
    kind: "unidad",
    race: "Enanos",
    raceIcon: "⛏️",
    tier: 7,
    rarity: rarityForTier(7),
    icon: "🗿",
    // La 🎯 Precisión más baja de la página, casi en el suelo de la banda (65).
    // No es un número suelto: lleva 🐌 Lentitud, y un marco donde el número más
    // bajo de una columna sigue siendo de dos cifras es justo lo que hay que
    // comprobar del pie.
    art: ART_DWARF_UNIT("golem-de-piedra"),
    skills: {
      vida: 175,
      ataque: 30,
      defensa: 52,
      resistencia: 24,
      precision: 67,
      suerte: 0,
      iniciativa: 2,
      movimiento: 2,
    },
    damage: "cuerpo",
    traits: [
      { icon: "🤖", label: "Constructo" },
      { icon: "🛡️", label: "Resistente al daño físico" },
      { icon: "🐌", label: "Lentitud" },
    ],
  },
  {
    id: "enanos-coloso-de-adamantita",
    name: "Coloso de adamantita",
    kind: "unidad",
    race: "Enanos",
    raceIcon: "⛏️",
    tier: 8,
    rarity: rarityForTier(8),
    icon: "⛰️",
    // EL PEOR CASO DE LA PÁGINA, y por dos motivos a la vez. Uno: VEINTE
    // caracteres de nombre —el 🐉 Dragón dorado de Humanos llega a trece, que
    // es justo el escalón LONG_NAME, y ni el 🐉 Dragón esquelético que el
    // laboratorio de bocetos guarda como caso límite pasa de dieciocho—, así
    // que este rótulo es el que de verdad mide hasta dónde aguanta la placa del
    // pie. Dos: cuatro Características con tres cifras de Vida y 🛡️ Defensa a
    // 70, a cinco puntos del tope de la escala.
    //
    // MEDIDO Y APROBADO con el arte puesto (26-ago-2026): los veinte caracteres
    // entran en UNA línea en el escalón LONG_NAME y las cuatro Características
    // entran en el raíl. La placa de la J aguanta el peor nombre del catálogo.
    //
    // Lo que NO aguanta es otra cosa, y no es del marco: la ilustración trae
    // figuras diminutas a los pies del Coloso para dar la escala —el prompt las
    // pedía— y **el panel del pie se las come enteras**, porque caen en el cuarto
    // de abajo que la norma de encuadre reserva al rótulo. La carta enseña un
    // armazón grande sin nada que diga que es colosal. Son dos líneas de la
    // especificación peleándose, y se arregla en el prompt: para los sujetos
    // enormes el ancla de escala va al lado o en la arquitectura, nunca abajo.
    // Anotado en public/assets/v3/README.md §"⛏️ Enanos".
    art: ART_DWARF_UNIT("coloso-de-adamantita"),
    skills: {
      vida: 260,
      ataque: 52,
      defensa: 70,
      resistencia: 34,
      precision: 78,
      suerte: 4,
      iniciativa: 2,
      movimiento: 2,
    },
    damage: "cuerpo",
    traits: [
      { icon: "🤖", label: "Constructo" },
      { icon: "🛡️", label: "Resistente al daño físico" },
      { icon: "🧪", label: "Inmune a estados alterados" },
      { icon: "🗡️", label: "Perforante" },
    ],
  },
];

// Los cuatro héroes de ⛏️ Enanos, en el orden de razas.md §"Razas y clases":
// ⚔️ Guerrero, ⚙️ Ingeniero, 🪓 Berserker y 🔯 Maestro de runas. Sin tier y con
// HERO_RAIL, igual que los de Humanos: el color de héroe es su propio raíl y no
// un escalón prestado de la escala de rareza.
const DWARF_HEROES: readonly Subject[] = [
  {
    id: "enanos-heroe-guerrero",
    name: "Guerrero",
    kind: "heroe",
    race: "Enanos",
    raceIcon: "⛏️",
    rarity: HERO_RAIL,
    icon: "⚔️",
    // Mismo nombre y mismo emoji que el ⚔️ Guerrero de Humanos, que es una
    // colisión distinta de las 25 de status.md: esas son héroe contra unidad
    // DENTRO de una raza, y esta es héroe contra héroe ENTRE razas. No es un
    // problema —los cuatro nombres de clase son vocabulario fijo de las once
    // razas, y cuatro cartas se llaman "⚔️ Guerrero" a propósito—, pero con dos
    // razas en la página ya se ven las dos juntas, y lo único que las separa es
    // el emblema de raza del medallón. Que es exactamente el punto que status.md
    // §"marco que gana" deja anotado: el emblema solo funciona si los emojis de
    // razas.md se distinguen a 42px, y ⛏️ contra 👤 es un caso fácil.
    art: ART_DWARF("guerrero"),
    skills: {
      vida: 132,
      ataque: 20,
      defensa: 34,
      resistencia: 10,
      precision: 79,
      suerte: 4,
      iniciativa: 6,
      movimiento: 4,
    },
    damage: "cuerpo",
    traits: [
      { icon: "🛡️", label: "Resistente al daño físico" },
      { icon: "😤", label: "Último aliento" },
    ],
  },
  {
    id: "enanos-heroe-ingeniero",
    name: "Ingeniero",
    kind: "heroe",
    race: "Enanos",
    raceIcon: "⛏️",
    rarity: HERO_RAIL,
    icon: "⚙️",
    art: ART_DWARF("ingeniero"),
    skills: {
      vida: 88,
      ataque: 17,
      defensa: 18,
      resistencia: 12,
      precision: 87,
      suerte: 6,
      iniciativa: 8,
      movimiento: 4,
    },
    damage: "distancia",
    traits: [
      { icon: "👁️", label: "Percepción" },
      { icon: "🤖", label: "Constructo" },
    ],
  },
  {
    id: "enanos-heroe-berserker",
    name: "Berserker",
    kind: "heroe",
    race: "Enanos",
    raceIcon: "⛏️",
    rarity: HERO_RAIL,
    icon: "🪓",
    // La 🍀 Suerte más alta de la página, y la primera de DOS CIFRAS: Humanos no
    // pasa de 8, así que hasta ahora esa columna del pie solo se había visto con
    // un dígito. La escala la deja llegar a 25 (razas.md), y un héroe cuyo
    // rasgo es 💥 Golpe crítico es el sitio donde toca gastarla. Es un caso de
    // marco, no de balance: enseña la columna con el ancho que de verdad puede
    // pedir.
    art: ART_DWARF("berserker"),
    skills: {
      vida: 104,
      ataque: 27,
      defensa: 9,
      resistencia: 5,
      precision: 76,
      suerte: 14,
      iniciativa: 10,
      movimiento: 5,
    },
    damage: "cuerpo",
    traits: [
      { icon: "💥", label: "Golpe crítico" },
      { icon: "🩸", label: "Hemorragia" },
      { icon: "😤", label: "Último aliento" },
    ],
  },
  {
    id: "enanos-heroe-maestro-de-runas",
    name: "Maestro de runas",
    kind: "heroe",
    race: "Enanos",
    raceIcon: "⛏️",
    rarity: HERO_RAIL,
    icon: "🔯",
    // El héroe más largo de nombre de las dos razas (dieciséis caracteres, tres
    // por encima del escalón LONG_NAME) y el único ✨ Mágico de Enanos, que en
    // una raza de 🛡️ es lo que rompe la monotonía del pie.
    art: ART_DWARF("maestro-de-runas"),
    skills: {
      vida: 84,
      ataque: 15,
      defensa: 20,
      resistencia: 30,
      precision: 81,
      suerte: 7,
      iniciativa: 6,
      movimiento: 4,
    },
    damage: "magico",
    traits: [{ icon: "🛡️", label: "Resistente al daño físico" }],
  },
];

// --- 💀 No-muertos --------------------------------------------------------
// La tercera raza base de razas.md, entrada el 26 de agosto de 2026. Mismas
// fuentes y mismo aviso que Enanos: nombres, emojis, orden, tipo de daño y
// Características copiados, NÚMEROS INVENTADOS dentro de la escala cerrada.
//
// Su sesgo es el contrario del de Enanos, y a propósito: 🛡️ Defensa floja y
// 🔮 Resistencia mágica alta —una raza que ya está muerta no la mata el veneno
// ni el miedo, pero la parte un martillo—, 🍀 Suerte casi a cero en toda la
// progresión (un esqueleto no tiene fortuna) y 🎯 Precisión baja salvo en los
// dos que apuntan.
//
// Y tiene una fractura interna que ninguna de las dos anteriores tenía: la raza
// es lenta y torpe EXCEPTO sus dos unidades 🐾 Ágiles —🧟 Necrófago y
// 🧛 Vampiro—, que doblan en ⚡ Iniciativa y 👢 Movimiento a sus vecinas de
// tier. En el pie de la carta eso se ve como un salto, no como una curva, que
// es lo que hay que comprobar: hasta ahora las tres razas subían parejas.
//
// El tier 8 NO se escribe aquí: es el 🐉 Dragón esquelético, que ya estaba en
// sample.ts como caso límite del laboratorio de bocetos y siempre fue esta
// unidad. Se importa en vez de copiarse, así que sus números —210 de Vida y 44
// de Ataque— son los que fijan el techo de la curva de esta raza y no al revés:
// el 🦴 Esqueleto se escribió hacia atrás desde ahí para que el ×10 del tier
// cuadre.
const UNDEAD_UNITS: readonly Subject[] = [
  {
    id: "no-muertos-esqueleto",
    name: "Esqueleto",
    kind: "unidad",
    race: "No-muertos",
    raceIcon: "💀",
    tier: 1,
    rarity: rarityForTier(1),
    icon: "🦴",
    // El ⚔️ Ataque más bajo de la página, por debajo del 🗡️ Miliciano y del
    // ⛏️ Minero: es carne de cañón y el número lo dice. Y la 🎯 Precisión más
    // baja de las cuatro razas, a un punto del suelo de la banda (65).
    skills: {
      vida: 20,
      ataque: 4,
      defensa: 3,
      resistencia: 6,
      precision: 66,
      suerte: 0,
      iniciativa: 3,
      movimiento: 3,
    },
    damage: "cuerpo",
    traits: [{ icon: "💀", label: "No-muerto" }],
  },
  {
    id: "no-muertos-arquero-esqueleto",
    name: "Arquero esqueleto",
    kind: "unidad",
    race: "No-muertos",
    raceIcon: "💀",
    tier: 2,
    rarity: rarityForTier(2),
    icon: "🏹",
    // Otro nombre con la raza dentro para no chocar con el 🏹 Arquero de
    // Humanos — pero el EMOJI sí choca, y no hay nada que hacer: 🏹 es el emoji
    // del arco en razas.md y lo usan las dos. Con el filtro en "Todas", tres
    // cartas de la página llevan 🏹 en el medallón.
    skills: {
      vida: 19,
      ataque: 6,
      defensa: 2,
      resistencia: 6,
      precision: 79,
      suerte: 1,
      iniciativa: 4,
      movimiento: 3,
    },
    damage: "distancia",
    traits: [{ icon: "💀", label: "No-muerto" }],
  },
  {
    id: "no-muertos-necrofago",
    name: "Necrófago",
    kind: "unidad",
    race: "No-muertos",
    raceIcon: "💀",
    tier: 3,
    rarity: rarityForTier(3),
    icon: "🧟",
    // Primera de las dos 🐾 Ágiles: ⚡ Iniciativa 9 y 👢 Movimiento 6 en una
    // raza donde el resto anda por 3. El salto es el punto.
    skills: {
      vida: 30,
      ataque: 10,
      defensa: 4,
      resistencia: 8,
      precision: 70,
      suerte: 2,
      iniciativa: 9,
      movimiento: 6,
    },
    damage: "cuerpo",
    traits: [
      { icon: "💀", label: "No-muerto" },
      { icon: "🐾", label: "Ágil" },
    ],
  },
  {
    id: "no-muertos-guerrero-esqueletico",
    name: "Guerrero esquelético",
    kind: "unidad",
    race: "No-muertos",
    raceIcon: "💀",
    tier: 4,
    rarity: rarityForTier(4),
    icon: "💀",
    // VEINTE caracteres, empatado con el ⛰️ Coloso de adamantita en el rótulo
    // más largo del juego — y este además es un tier 4, o sea que el caso ya no
    // vive solo en el escalón legendario donde se le puede perdonar.
    //
    // Su emoji 💀 es el de su propia raza, como le pasa al ⛏️ Minero con el
    // pico: la ilustración y el emblema del medallón repiten calavera.
    skills: {
      vida: 52,
      ataque: 12,
      defensa: 20,
      resistencia: 10,
      precision: 72,
      suerte: 1,
      iniciativa: 4,
      movimiento: 3,
    },
    damage: "cuerpo",
    traits: [
      { icon: "💀", label: "No-muerto" },
      { icon: "🛡️", label: "Resistente al daño físico" },
    ],
  },
  {
    id: "no-muertos-nigromante",
    name: "Nigromante",
    kind: "unidad",
    race: "No-muertos",
    raceIcon: "💀",
    tier: 5,
    rarity: rarityForTier(5),
    icon: "🧙",
    // Se llama igual que el héroe 💀 Nigromante de su raza, pero con OTRO emoji
    // (🧙 la unidad, 💀 el héroe). Es una variante de la colisión que no se
    // había visto: el 🏹 Arquero de Humanos y el ⚙️ Ingeniero de Enanos
    // comparten nombre Y emoji, así que solo los separa el rótulo; aquí el
    // medallón sí ayuda. Lo malo es que ese 💀 del héroe es también el emblema
    // de la raza, así que ayuda enseñando dos veces lo mismo.
    skills: {
      vida: 44,
      ataque: 18,
      defensa: 5,
      resistencia: 26,
      precision: 76,
      suerte: 3,
      iniciativa: 6,
      movimiento: 4,
    },
    damage: "magico",
    traits: [{ icon: "💀", label: "No-muerto" }],
  },
  {
    id: "no-muertos-vampiro",
    name: "Vampiro",
    kind: "unidad",
    race: "No-muertos",
    raceIcon: "💀",
    tier: 6,
    rarity: rarityForTier(6),
    icon: "🧛",
    // Segunda 🐾 Ágil y el mismo caso que el Nigromante: nombre del héroe
    // 🩸 Vampiro con emoji distinto. En una raza de once fichas hay DOS
    // colisiones de nombre; Humanos y Enanos tenían una cada una.
    skills: {
      vida: 78,
      ataque: 24,
      defensa: 12,
      resistencia: 22,
      precision: 84,
      suerte: 9,
      iniciativa: 15,
      movimiento: 8,
    },
    damage: "cuerpo",
    traits: [
      { icon: "💀", label: "No-muerto" },
      { icon: "🧛", label: "Robo de vida" },
      { icon: "🐾", label: "Ágil" },
    ],
  },
  {
    id: "no-muertos-abominacion",
    name: "Abominación",
    kind: "unidad",
    race: "No-muertos",
    raceIcon: "💀",
    tier: 7,
    rarity: rarityForTier(7),
    icon: "☠️",
    // Tiene MÁS 🛡️ Defensa que el 🐉 Dragón esquelético que va detrás, y no es
    // un descuido: solo ❤️ Vida y ⚔️ Ataque escalan con el tier (razas.md §"La
    // escala"), así que un tier 8 no es un tier 7 con todo más alto. Es la
    // primera ficha de la página que lo enseña de frente.
    skills: {
      vida: 160,
      ataque: 32,
      defensa: 34,
      resistencia: 12,
      precision: 68,
      suerte: 0,
      iniciativa: 3,
      movimiento: 3,
    },
    damage: "cuerpo",
    traits: [
      { icon: "💀", label: "No-muerto" },
      { icon: "🛡️", label: "Resistente al daño físico" },
      { icon: "🩸", label: "Hemorragia" },
      { icon: "😱", label: "Inmune al miedo" },
    ],
  },
  // El tier 8, importado y no escrito. Ver el comentario de la cabecera de la
  // raza y el de SKELETAL_DRAGON en sample.ts.
  SKELETAL_DRAGON,
];

// Los cuatro héroes de 💀 No-muertos, en el orden de razas.md: ⚔️ Guerrero,
// 💀 Nigromante, 🩸 Vampiro y ☠️ Liche. Dos de los cuatro se llaman igual que
// una unidad de su propia raza.
const UNDEAD_HEROES: readonly Subject[] = [
  {
    id: "no-muertos-heroe-guerrero",
    name: "Guerrero",
    kind: "heroe",
    race: "No-muertos",
    raceIcon: "💀",
    rarity: HERO_RAIL,
    icon: "⚔️",
    // El TERCER ⚔️ Guerrero de la página, con el mismo nombre y el mismo emoji
    // que los de Humanos y Enanos. Es a propósito —los cuatro nombres de clase
    // son vocabulario fijo de las once razas— y con tres juntos ya se ve qué
    // carga de verdad el emblema del medallón: es lo único que las distingue, y
    // 💀 contra ⛏️ contra 👤 es el caso fácil de status.md. Cuando estén las
    // once habrá cuatro cartas llamadas "⚔️ Guerrero".
    skills: {
      vida: 110,
      ataque: 19,
      defensa: 28,
      resistencia: 14,
      precision: 75,
      suerte: 2,
      iniciativa: 5,
      movimiento: 4,
    },
    damage: "cuerpo",
    traits: [
      { icon: "💀", label: "No-muerto" },
      { icon: "🛡️", label: "Resistente al daño físico" },
      { icon: "☠️", label: "Inmune al veneno" },
    ],
  },
  {
    id: "no-muertos-heroe-nigromante",
    name: "Nigromante",
    kind: "heroe",
    race: "No-muertos",
    raceIcon: "💀",
    rarity: HERO_RAIL,
    icon: "💀",
    // Una sola Característica, y es 💀 No-muerto: el mismo glifo que su emoji de
    // ilustración Y que el emblema de su raza. La carta enseña tres calaveras en
    // tres sitios distintos, cada una diciendo otra cosa. Es el caso más crudo
    // de lo que status.md deja anotado sobre emblemas hechos con emoji, y no se
    // arregla en el marco.
    skills: {
      vida: 72,
      ataque: 16,
      defensa: 8,
      resistencia: 32,
      precision: 78,
      suerte: 5,
      iniciativa: 6,
      movimiento: 4,
    },
    damage: "magico",
    traits: [{ icon: "💀", label: "No-muerto" }],
  },
  {
    id: "no-muertos-heroe-vampiro",
    name: "Vampiro",
    kind: "heroe",
    race: "No-muertos",
    raceIcon: "💀",
    rarity: HERO_RAIL,
    icon: "🩸",
    // La ⚡ Iniciativa más alta de la página. Sigue sin tener escala propia
    // (razas.md: solo se compara), así que es el número que no hay que cuadrar
    // con nada — pero sí que tiene que caber, y aquí ya son dos cifras.
    skills: {
      vida: 92,
      ataque: 23,
      defensa: 13,
      resistencia: 24,
      precision: 86,
      suerte: 11,
      iniciativa: 16,
      movimiento: 8,
    },
    damage: "cuerpo",
    traits: [
      { icon: "💀", label: "No-muerto" },
      { icon: "🧛", label: "Robo de vida" },
      { icon: "🐾", label: "Ágil" },
    ],
  },
  {
    id: "no-muertos-heroe-liche",
    name: "Liche",
    kind: "heroe",
    race: "No-muertos",
    raceIcon: "💀",
    rarity: HERO_RAIL,
    icon: "☠️",
    // El héroe con menos ❤️ Vida de la página y la 🔮 Resistencia mágica más
    // alta hasta el 👹 Balor: 44 sobre un tope de 75. El reparto extremo es el
    // punto —un marco que dé el mismo peso a los ocho números no deja ver que
    // esta ficha es una cosa y el ⚔️ Guerrero de al lado es la contraria—.
    skills: {
      vida: 68,
      ataque: 21,
      defensa: 6,
      resistencia: 44,
      precision: 83,
      suerte: 6,
      iniciativa: 7,
      movimiento: 4,
    },
    damage: "magico",
    traits: [
      { icon: "💀", label: "No-muerto" },
      { icon: "☠️", label: "Inmune al veneno" },
    ],
  },
];

// --- 🔥 Demonios infernales ------------------------------------------------
// La cuarta raza base, entrada el 26 de agosto de 2026 junto a No-muertos.
// Mismo aviso: nombres, emojis, orden, tipo de daño y Características copiados
// de razas.md, NÚMEROS INVENTADOS dentro de la escala cerrada.
//
// Es la raza de cristal: el ⚔️ Ataque más alto del juego —el 👹 Balor a 66,
// catorce por encima del ⛰️ Coloso de adamantita— con 🛡️ Defensa floja en toda
// la mitad baja de la progresión, 🔮 Resistencia mágica alta (media raza es
// inmune al fuego) y ⚡ Iniciativa por encima de las otras tres. Pega primero y
// pega más, y cae. Es el contrapunto exacto de Enanos.
//
// Y ES LA RAZA QUE ROMPE EL RAÍL DE GLIFOS, que es el motivo de fondo para
// meterla ahora y no dejarla para el final. Las otras tres dieron casos
// aislados de emoji repetido; aquí el choque es sistemático y está en razas.md:
// 🔥 es el emoji de CUATRO cosas distintas —🔥 Fuego (fuente de daño),
// 🔥 Resistente al fuego, 🔥 Inmune al fuego y el emblema de la propia raza—, y
// tres unidades llevan DOS Características de 🔥 a la vez. Ver el comentario del
// 🔥 Demonio de fuego, que es el peor de los tres.
const DEMON_UNITS: readonly Subject[] = [
  {
    id: "demonios-diablillo",
    name: "Diablillo",
    kind: "unidad",
    race: "Demonios infernales",
    raceIcon: "🔥",
    tier: 1,
    rarity: rarityForTier(1),
    icon: "👿",
    // El único tier 1 ✨ Mágico de las cuatro razas, y con la ❤️ Vida más baja
    // de la página (16). Un tier 1 que no es un peón de melé es un caso que la
    // baraja no tenía.
    skills: {
      vida: 16,
      ataque: 6,
      defensa: 2,
      resistencia: 14,
      precision: 72,
      suerte: 4,
      iniciativa: 8,
      movimiento: 5,
    },
    damage: "magico",
    traits: [
      { icon: "😈", label: "Demonio" },
      { icon: "🐾", label: "Ágil" },
    ],
  },
  {
    id: "demonios-guerrero-infernal",
    name: "Guerrero infernal",
    kind: "unidad",
    race: "Demonios infernales",
    raceIcon: "🔥",
    tier: 2,
    rarity: rarityForTier(2),
    icon: "🗡️",
    // Su emoji 🗡️ es el mismo que el del tipo de daño 🗡️ Cuerpo a cuerpo que
    // lleva pegado al número de ⚔️ Ataque: ilustración y campo, dos huecos, un
    // solo glifo. Es la tercera forma que toma el problema del 🔥 de esta raza.
    skills: {
      vida: 26,
      ataque: 9,
      defensa: 8,
      resistencia: 16,
      precision: 74,
      suerte: 3,
      iniciativa: 7,
      movimiento: 4,
    },
    damage: "cuerpo",
    traits: [
      { icon: "😈", label: "Demonio" },
      { icon: "🔥", label: "Resistente al fuego" },
    ],
  },
  {
    id: "demonios-sabueso-infernal",
    name: "Sabueso infernal",
    kind: "unidad",
    race: "Demonios infernales",
    raceIcon: "🔥",
    tier: 3,
    rarity: rarityForTier(3),
    icon: "🔥",
    // Emoji 🔥, Característica 🔥 Fuego y emblema de raza 🔥: tres huecos, un
    // glifo, tres significados.
    skills: {
      vida: 31,
      ataque: 13,
      defensa: 5,
      resistencia: 18,
      precision: 77,
      suerte: 5,
      iniciativa: 14,
      movimiento: 8,
    },
    damage: "cuerpo",
    traits: [
      { icon: "😈", label: "Demonio" },
      { icon: "🔥", label: "Fuego" },
      { icon: "🐾", label: "Ágil" },
    ],
  },
  {
    id: "demonios-demonio-de-batalla",
    name: "Demonio de batalla",
    kind: "unidad",
    race: "Demonios infernales",
    raceIcon: "🔥",
    tier: 4,
    rarity: rarityForTier(4),
    icon: "😈",
    // Dieciocho caracteres, el tercer rótulo más largo de la página.
    skills: {
      vida: 54,
      ataque: 17,
      defensa: 18,
      resistencia: 20,
      precision: 76,
      suerte: 4,
      iniciativa: 8,
      movimiento: 5,
    },
    damage: "cuerpo",
    traits: [
      { icon: "😈", label: "Demonio" },
      { icon: "🔥", label: "Resistente al fuego" },
      { icon: "😱", label: "Inmune al miedo" },
    ],
  },
  {
    id: "demonios-brujo-infernal",
    name: "Brujo infernal",
    kind: "unidad",
    race: "Demonios infernales",
    raceIcon: "🔥",
    tier: 5,
    rarity: rarityForTier(5),
    icon: "🧙",
    skills: {
      vida: 48,
      ataque: 24,
      defensa: 7,
      resistencia: 30,
      precision: 80,
      suerte: 6,
      iniciativa: 9,
      movimiento: 5,
    },
    damage: "magico",
    traits: [
      { icon: "😈", label: "Demonio" },
      { icon: "🔥", label: "Fuego" },
    ],
  },
  {
    id: "demonios-demonio-de-fuego",
    name: "Demonio de fuego",
    kind: "unidad",
    race: "Demonios infernales",
    raceIcon: "🔥",
    tier: 6,
    rarity: rarityForTier(6),
    icon: "🔥",
    // EL PEOR CASO DE GLIFO REPETIDO DE TODA LA PÁGINA, y es de otra clase que
    // los anteriores. Lleva 🔥 Inmune al fuego Y 🔥 Fuego, o sea DOS
    // Características con el mismo emoji EN EL MISMO RAÍL, una al lado de la
    // otra. Los casos de Enanos (🗡️ Perforante contra el campo de tipo de daño)
    // y el de su propio 🔨 hermano eran glifo repetido en dos huecos DISTINTOS
    // del marco, que se puede leer con esfuerzo; esto son dos medallones
    // idénticos y contiguos que significan cosas opuestas —una es resistencia,
    // la otra es fuente de daño—, y encima el emoji de la ilustración y el
    // emblema de la raza también son 🔥. Cinco 🔥 en una carta.
    //
    // No tiene arreglo en el marco: en un raíl de glifos sin texto la carta
    // dice, literalmente, "fuego fuego". Es razas.md lo que hay que tocar
    // —repartir emojis entre las cuatro cosas que hoy son 🔥—, y le pasa igual
    // al 👹 Señor demoníaco y al 👹 Balor.
    skills: {
      vida: 82,
      ataque: 34,
      defensa: 22,
      resistencia: 40,
      precision: 82,
      suerte: 5,
      iniciativa: 10,
      movimiento: 5,
    },
    damage: "magico",
    traits: [
      { icon: "😈", label: "Demonio" },
      { icon: "🔥", label: "Inmune al fuego" },
      { icon: "🔥", label: "Fuego" },
      { icon: "🛡️", label: "Resistente al daño físico" },
    ],
  },
  {
    id: "demonios-senor-demoniaco",
    name: "Señor demoníaco",
    kind: "unidad",
    race: "Demonios infernales",
    raceIcon: "🔥",
    tier: 7,
    rarity: rarityForTier(7),
    icon: "👹",
    // LA COLISIÓN MÁS COMPLETA DEL CATÁLOGO. Se llama igual que el héroe
    // 👹 Señor demoníaco de su propia raza, con el mismo emoji, el mismo tipo de
    // daño y las mismas tres Características de las cuatro que lleva. Las dos
    // cartas se diferencian en el rótulo bajo el nombre ("Tier 7" contra
    // "Héroe"), en el color de la veta y en los ocho números —que además
    // contradicen la jerarquía: esta unidad pega MÁS que el héroe que se llama
    // como ella—. Peor que el 🏹 Arquero de Humanos, que al menos no compartía
    // Características.
    skills: {
      vida: 140,
      ataque: 46,
      defensa: 30,
      resistencia: 44,
      precision: 85,
      suerte: 7,
      iniciativa: 12,
      movimiento: 6,
    },
    damage: "cuerpo",
    traits: [
      { icon: "😈", label: "Demonio" },
      { icon: "🔥", label: "Fuego" },
      { icon: "🔥", label: "Inmune al fuego" },
      { icon: "😱", label: "Inmune al miedo" },
    ],
  },
  {
    id: "demonios-balor",
    name: "Balor",
    kind: "unidad",
    race: "Demonios infernales",
    raceIcon: "🔥",
    tier: 8,
    rarity: rarityForTier(8),
    // 👹 y no 😈: razas.md se CONTRADICE en este sujeto —la progresión de
    // unidades lo escribe "😈 Balor" y la tabla de Características "👹 Balor"—.
    // Se toma el de la tabla por coherencia con los rasgos, que salen de ahí, y
    // porque la elección no arregla nada: con 👹 repite emoji con el
    // 👹 Señor demoníaco de tier 7, y con 😈 lo repetiría con el 😈 Demonio de
    // batalla de tier 4. Es un dato a corregir en razas.md, no aquí.
    icon: "👹",
    // El techo del juego: cinco Características —empata con el 🐉 Dragón
    // esquelético, que era el único que llegaba— y el ⚔️ Ataque más alto de las
    // cuatro razas (66, contra 52 del ⛰️ Coloso y 44 del Dragón). Su raíl es
    // además el más sucio de los dos que llegan a cinco: dos de los cinco
    // medallones son 🔥.
    skills: {
      vida: 200,
      ataque: 66,
      defensa: 34,
      resistencia: 52,
      precision: 88,
      suerte: 9,
      iniciativa: 13,
      movimiento: 7,
    },
    damage: "cuerpo",
    traits: [
      { icon: "😈", label: "Demonio" },
      { icon: "🔥", label: "Inmune al fuego" },
      { icon: "🔥", label: "Fuego" },
      { icon: "💣", label: "Explosivo" },
      { icon: "😱", label: "Inmune al miedo" },
    ],
  },
];

// Los cuatro héroes de 🔥 Demonios infernales, en el orden de razas.md:
// ⚔️ Guerrero, 🧙 Brujo, 🔥 Inquisidor infernal y 👹 Señor demoníaco.
const DEMON_HEROES: readonly Subject[] = [
  {
    id: "demonios-heroe-guerrero",
    name: "Guerrero",
    kind: "heroe",
    race: "Demonios infernales",
    raceIcon: "🔥",
    rarity: HERO_RAIL,
    icon: "⚔️",
    // El CUARTO ⚔️ Guerrero. Con la página en "Todas" hay cuatro cartas con el
    // mismo nombre y el mismo emoji, y el emblema de raza es lo único que las
    // separa: 👤 ⛏️ 💀 🔥. Ahí está el problema que status.md apunta —👤 es una
    // silueta genérica y 🔥 no es una criatura, es un elemento—, y ahora se
    // puede mirar con las cuatro juntas en vez de imaginarlo.
    skills: {
      vida: 124,
      ataque: 24,
      defensa: 30,
      resistencia: 26,
      precision: 80,
      suerte: 5,
      iniciativa: 8,
      movimiento: 5,
    },
    damage: "cuerpo",
    traits: [
      { icon: "😈", label: "Demonio" },
      { icon: "🔥", label: "Resistente al fuego" },
      { icon: "🛡️", label: "Resistente al daño físico" },
    ],
  },
  {
    id: "demonios-heroe-brujo",
    name: "Brujo",
    kind: "heroe",
    race: "Demonios infernales",
    raceIcon: "🔥",
    rarity: HERO_RAIL,
    icon: "🧙",
    // Nombre y emoji del 🧙 Brujo infernal de su raza, con la raza quitada del
    // nombre de la unidad — el patrón que razas.md ya aplicó para no chocar.
    skills: {
      vida: 76,
      ataque: 22,
      defensa: 10,
      resistencia: 38,
      precision: 81,
      suerte: 7,
      iniciativa: 8,
      movimiento: 5,
    },
    damage: "magico",
    traits: [
      { icon: "😈", label: "Demonio" },
      { icon: "🔥", label: "Resistente al fuego" },
    ],
  },
  {
    id: "demonios-heroe-inquisidor-infernal",
    name: "Inquisidor infernal",
    kind: "heroe",
    race: "Demonios infernales",
    raceIcon: "🔥",
    rarity: HERO_RAIL,
    icon: "🔥",
    // El HÉROE con el rótulo más largo del juego: diecinueve caracteres, a uno
    // del ⛰️ Coloso. Y en la carta de héroe el rótulo tiene más sitio que en la
    // de unidad —no hay Tier que escribir—, así que es el caso que dice si esa
    // holgura sirve de algo o si el nombre parte igual.
    skills: {
      vida: 84,
      ataque: 20,
      defensa: 14,
      resistencia: 36,
      precision: 84,
      suerte: 9,
      iniciativa: 9,
      movimiento: 5,
    },
    damage: "magico",
    traits: [
      { icon: "😈", label: "Demonio" },
      { icon: "🔥", label: "Resistente al fuego" },
      { icon: "😱", label: "Inmune al miedo" },
    ],
  },
  {
    id: "demonios-heroe-senor-demoniaco",
    name: "Señor demoníaco",
    kind: "heroe",
    race: "Demonios infernales",
    raceIcon: "🔥",
    rarity: HERO_RAIL,
    icon: "👹",
    // La otra mitad de la colisión completa: ver el comentario de la unidad de
    // tier 7. Mismo nombre, mismo emoji, mismo tipo de daño y tres
    // Características idénticas, y el héroe pega MENOS que la unidad que se
    // llama como él.
    skills: {
      vida: 116,
      ataque: 30,
      defensa: 24,
      resistencia: 40,
      precision: 83,
      suerte: 8,
      iniciativa: 11,
      movimiento: 6,
    },
    damage: "cuerpo",
    traits: [
      { icon: "😈", label: "Demonio" },
      { icon: "🔥", label: "Fuego" },
      { icon: "🔥", label: "Inmune al fuego" },
    ],
  },
];

export type DeckRace = {
  readonly name: string;
  /** Emoji de la raza, el que usa razas.md. */
  readonly icon: string;
  readonly units: readonly Subject[];
  readonly heroes: readonly Subject[];
};

/**
 * Las razas que hoy se pueden pintar, en el orden de razas.md §"Razas y clases"
 * —que es el de las cinco bases y luego los tres DLC, no el de entrada aquí—.
 *
 * CUATRO DE ONCE, y las que faltan no faltan por descuido: 🧝 Elfos cierra las
 * cinco bases y las seis de DLC quedan fuera de alcance hasta que las bases
 * estén jugables (razas.md §Alcance). Cada una entra con un bloque como los de
 * aquí y una línea en esta lista, y nada más — la página no se toca.
 *
 * Con cuatro, la baraja son 48 cartas y ya no es una muestra: es donde se ven
 * los choques que ninguna raza suelta enseña —cuatro ⚔️ Guerreros con el mismo
 * emoji, tres 🏹 en el medallón, el 🔥 de 🔥 Demonios haciendo de cuatro cosas—,
 * y todos son del catálogo de razas.md y no del marco.
 */
export const DECK_RACES: readonly DeckRace[] = [
  { name: "Humanos", icon: "👤", units: HUMAN_UNITS, heroes: HUMAN_HEROES },
  { name: "Enanos", icon: "⛏️", units: DWARF_UNITS, heroes: DWARF_HEROES },
  { name: "No-muertos", icon: "💀", units: UNDEAD_UNITS, heroes: UNDEAD_HEROES },
  {
    name: "Demonios infernales",
    icon: "🔥",
    units: DEMON_UNITS,
    heroes: DEMON_HEROES,
  },
];
