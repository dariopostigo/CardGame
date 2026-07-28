// =========================================================================
// Arte de las cartas (provisional: emoji)
//
// Las tablas de docs/cards/*.md son la fuente de los DATOS, pero no llevan
// columna de arte: la ilustración no es una característica de juego y no
// tiene sitio en una tabla. Por eso el arte vive aquí, indexado por nombre de
// carta, y es lo único de la carta que no sale del markdown.
//
// Es un puesto provisional para la fase de arte (docs/status.md §4): cuando
// haya ilustraciones de verdad, este mapa pasa a apuntar a los assets y el
// resto del pipeline no se entera.
//
// La clave se normaliza (minúsculas, sin acentos y sin el paréntesis final),
// así que "Linterna (sorda o de aceite)" encuentra a "Linterna" y no hay que
// repetir el nombre largo de la tabla.
// =========================================================================

import type { CardCategory } from "./card-table";

/** Icono del badge de cada categoría (la ficha grande de la esquina). */
export const CATEGORY_BADGE: Record<CardCategory, string> = {
  clase: "🙂",
  arma: "⚔️",
  armadura: "🛡️",
  item: "🎒",
  maldicion: "☠️",
  mercenario: "👹",
  encuentro: "🎲",
};

/** Arte de reserva cuando una carta nueva todavía no tiene la suya. */
const FALLBACK_ART: Record<CardCategory, string> = {
  clase: "✨",
  arma: "⚔️",
  armadura: "🛡️",
  item: "🎒",
  maldicion: "☠️",
  mercenario: "👤",
  encuentro: "🎲",
};

function key(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s*\([^)]*\)\s*$/, "") // "Linterna (sorda o de aceite)" → "linterna"
    .replace(/[¡!¿?]/g, "") //           "¡Emboscada!" → "emboscada"
    .replace(/\s+/g, " ")
    .trim();
}

const ART: Record<string, string> = {
  // --- Cartas de clase (cards/class.md)
  "golpe firme": "⚔️",
  "postura defensiva": "🛡️",
  embestida: "💨",
  "segundo aliento": "❤️‍🩹",
  "descarga arcana": "⚡",
  "escudo arcano": "🔵",
  "enredo gelido": "❄️",
  "bola de fuego": "🔥",
  "ataque furtivo": "🗡️",
  escabullirse: "🌑",
  "ojo avizor": "👁️",
  desaparecer: "💨",
  "palabra sanadora": "❤️‍🩹",
  "llama sagrada": "☀️",
  "escudo de fe": "🙏",
  bendicion: "🙏",

  // --- Armas (cards/weapons.md)
  dagas: "🔪",
  espada: "🗡️",
  hacha: "🪓",
  lanza: "🔱",
  maza: "🔨",
  "maza bendita": "⚒️",
  escudo: "🛡️",
  arco: "🏹",
  "ballesta pesada": "🏹",
  "ballesta de mano": "🏹",
  "baston de mago": "🪄",
  "libro de hechizos": "📖",
  "simbolo sagrado": "📿",
  antorcha: "🔥",
  "espada vorpal": "🗡️",
  "baston del poder": "🦯",

  // --- Armaduras (cards/armor.md)
  acolchada: "🧥",
  cuero: "🧥",
  "cuero tachonado": "🧥",
  pieles: "🥋",
  "cota de escamas": "🥋",
  "media cota": "🥋",
  "cota de anillas": "🛡️",
  coraza: "🛡️",
  "cota de malla": "🧥",
  placas: "🛡️",

  // --- Items (cards/items.md)
  mochila: "🧳",
  catalejo: "🔭",
  "saco / bolsa": "👝",
  "saco de dormir": "🛏️",
  manta: "🧣",
  "cuerda de canamo": "🧶",
  "yesca y pedernal": "⛰️",
  linterna: "🏮",
  "odre / cantimplora": "🧴",
  "raciones de viaje": "🍖",
  "kit de escalada": "🧗",
  ganzuas: "🗝️",
  "espejo de acero pequeno": "🪞",
  cadena: "⛓️",
  "estacas de hierro": "📌",
  martillo: "🔨",
  "pala / pico": "⛏️",
  "herramientas de artesano": "🛠️",
  "instrumento musical": "🎻",
  "kit de disfraz": "🎭",
  "kit de falsificacion": "📄",
  "kit de venenos": "☠️",
  "herramientas de navegante": "🧭",
  "mapa del cartografo": "🗺️",
  "juego de dados / cartas": "🎲",
  "trampa para osos": "🕳️",
  grilletes: "🔗",
  "manto de invisibilidad": "🧥",
  "anillo de deseo": "💍",
  "orbe de dragon": "🔮",
  "guantelete del ogro": "🧤",
  "botas de teletransporte": "👢",
  "pocion de vida": "🧪",
  antidoto: "🧪",
  pergamino: "📜",
  "hoguera / campamento": "🔥",
  "bota veloz": "👟",
  "atajo del picaro": "👟",
  "zancada del viento": "🌀",

  // --- Maldiciones (cards/curses.md)
  "peso maldito": "⛓️",
  "herida infectada": "🤢",
  "velo de sombras": "🌑",
  "mano temblorosa": "🤚",
  "marca del cazador": "🎯",
  "sangre lenta": "🩸",
  "fatiga eterna": "😩",
  susurros: "👂",

  // --- Mercenarios (cards/mercenaries.md)
  "mercenarios de las llanuras": "👤",
  "arquero a sueldo": "🧝🏼",
  "bruto de taberna": "👹",
  "curandera errante": "🧚🏼",
  "espadachin veterano": "🤺",
  "compania de la grifa negra": "🦅",

  // --- Mazo de encuentro (cards/encounter.md)
  "emboscada enemiga": "🌾",
  "golpe de las sombras": "🌑",
  refuerzos: "👥",
  "terreno favorable": "⛰️",
  "terreno traicionero": "🕳️",
  "el enemigo flaquea": "🏃",
  frenesi: "😤",
  "veterano solitario": "🪖",
  niebla: "🌫️",
  "botin inesperado": "💰",
  emboscada: "⚡",
  trampa: "🪤",
  "sendero oculto": "🛤️",
  hallazgo: "💎",
  viajero: "🧑‍🌾",
  "falsa alarma": "🍃",
  maleficio: "☠️",
  "mal augurio": "🌘",
  "descanso interrumpido": "🔥",
  "clima adverso": "🌧️",
  provisiones: "🍖",
  mercenarios: "🗡️",
};

/** Arte de una carta por su nombre, con reserva por categoría. */
export function artFor(name: string, category: CardCategory): string {
  return ART[key(name)] ?? FALLBACK_ART[category];
}
