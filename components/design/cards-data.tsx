import type { ReactNode } from "react";

/* Catálogo real de cartas (docs/cards/*) para estresar los templates visuales
   del laboratorio de diseño con contenido de verdad, no ejemplos curados. */

export type Stat = { k?: string; v?: string; label?: string };

export type Category = "clase" | "arma" | "armadura" | "item" | "maldicion";

export type CardData = {
  category: Category;
  rarity: string;
  badge: string;
  cost?: string;
  emoji: string;
  name: string;
  text: ReactNode;
  stats: Stat[];
  tag: string;
  legendary?: boolean;
  hands?: "1h" | "2h";
  damageType?: "cortante" | "perforante" | "contundente" | "arcano" | "radiante" | "fuego" | "necrotico";
  weight?: "ligera" | "media" | "pesada";
  severity?: "leve" | "grave";
};

export const CATEGORIES: { key: Category; label: string }[] = [
  { key: "clase", label: "Clase" },
  { key: "arma", label: "Arma" },
  { key: "armadura", label: "Armadura" },
  { key: "item", label: "Item" },
  { key: "maldicion", label: "Maldición" },
];

export const CARDS: CardData[] = [
  // ---------------------------------------------------------------- CLASE
  {
    category: "clase", rarity: "clase", badge: "🛡️", cost: "Acción", emoji: "⚔️",
    name: "Golpe firme",
    text: <>Ataque cuerpo a cuerpo a un enemigo adyacente <b>con ventaja</b> (2d20, coges el mejor).</>,
    stats: [{ label: "Guerrero" }, { k: "Uso", v: "Básica" }],
    tag: "Básica 1 · Clase",
  },
  {
    category: "clase", rarity: "clase", badge: "🛡️", cost: "Acción rápida", emoji: "🛡️",
    name: "Postura defensiva",
    text: <>Hasta tu próximo turno, <b>+2 a tu Defensa/CA</b>. No combinable con Embestida el mismo turno.</>,
    stats: [{ label: "Guerrero" }, { k: "Uso", v: "Básica" }],
    tag: "Básica 1 · Clase",
  },
  {
    category: "clase", rarity: "clase", badge: "🛡️", cost: "Acción", emoji: "💨",
    name: "Embestida",
    text: <>Muévete hasta 2 hex hacia un enemigo y ataca al terminar. Si te moviste ≥1 hex, <b>+2 al daño</b>.</>,
    stats: [{ label: "Guerrero" }, { k: "Uso", v: "Básica" }],
    tag: "Básica 1 · Clase",
  },
  {
    category: "clase", rarity: "clase", badge: "🛡️", cost: "Acción rápida", emoji: "❤️‍🩹",
    name: "Segundo aliento",
    text: <>Recuperas <b>1d10 + nivel</b> PV.</>,
    stats: [{ label: "Guerrero" }, { k: "Uso", v: "1/descanso" }],
    tag: "Especial · Clase",
  },
  {
    category: "clase", rarity: "clase", badge: "🔮", cost: "Acción", emoji: "⚡",
    name: "Descarga arcana",
    text: <>Ataque a distancia (alcance 4 hex): 1d20 + mod INT vs Defensa; si impacta, <b>1d8 de daño arcano</b>.</>,
    stats: [{ label: "Mago" }, { k: "Uso", v: "Básica" }],
    tag: "Básica 1 · Clase",
  },
  {
    category: "clase", rarity: "clase", badge: "🔮", cost: "Acción rápida", emoji: "🔵",
    name: "Escudo arcano",
    text: <>Hasta tu próximo turno, <b>+3 a tu Defensa/CA</b>.</>,
    stats: [{ label: "Mago" }, { k: "Uso", v: "Básica" }],
    tag: "Básica 1 · Clase",
  },
  {
    category: "clase", rarity: "clase", badge: "🔮", cost: "Acción", emoji: "❄️",
    name: "Enredo gélido",
    text: <>A distancia (alcance 3 hex): si impacta (1d20 + mod INT vs Defensa), el enemigo queda <b>Inmovilizado 1 turno</b>.</>,
    stats: [{ label: "Mago" }, { k: "Uso", v: "Básica" }],
    tag: "Básica 1 · Clase",
  },
  {
    category: "clase", rarity: "clase", badge: "🔮", cost: "Acción", emoji: "🔥",
    name: "Bola de fuego",
    text: (
      <>Explosión a distancia (alcance 4 hex): <b>3d6 de fuego</b> al enemigo objetivo y a los adyacentes a él. Cada afectado hace una salvación de Destreza (1d20 + mod DES vs CD) para recibir la mitad.</>
    ),
    stats: [{ label: "Mago" }, { k: "Uso", v: "1/combate" }],
    tag: "Especial · Clase",
  },
  {
    category: "clase", rarity: "clase", badge: "🗡️", cost: "Acción", emoji: "🗡️",
    name: "Ataque furtivo",
    text: <>Ataque con arma ligera o a distancia. Si estás Oculto o atacas con ventaja, <b>+2d6 de daño</b>.</>,
    stats: [{ label: "Pícaro" }, { k: "Uso", v: "Básica" }],
    tag: "Básica 1 · Clase",
  },
  {
    category: "clase", rarity: "clase", badge: "🗡️", cost: "Acción rápida", emoji: "🌑",
    name: "Escabullirse",
    text: (
      <>Te mueves 1 hex sin arriesgar golpe de oportunidad y ganas <b>+2 para evitar detección</b> hasta tu próximo turno; si terminas en Bosque u otro terreno de ocultación, quedas Oculto.</>
    ),
    stats: [{ label: "Pícaro" }, { k: "Uso", v: "Básica" }],
    tag: "Básica 1 · Clase",
  },
  {
    category: "clase", rarity: "clase", badge: "🗡️", cost: "Acción", emoji: "👁️",
    name: "Ojo avizor",
    text: <>Adelanta a Detectado un grupo vecino sin explorar, o <b>+1 a tu rango de visión</b> hasta tu próximo turno.</>,
    stats: [{ label: "Pícaro" }, { k: "Uso", v: "Básica" }],
    tag: "Básica 1 · Clase",
  },
  {
    category: "clase", rarity: "clase", badge: "🗡️", cost: "Acción rápida", emoji: "💨",
    name: "Desaparecer",
    text: <>Quedas <b>Oculto</b> aunque estés a la vista, hasta que ataques o interactúes.</>,
    stats: [{ label: "Pícaro" }, { k: "Uso", v: "1/combate" }],
    tag: "Especial · Clase",
  },
  {
    category: "clase", rarity: "clase", badge: "✨", cost: "Acción rápida", emoji: "❤️‍🩹",
    name: "Palabra sanadora",
    text: <>Recuperas tú (o un aliado adyacente) <b>1d8 + mod SAB</b> PV.</>,
    stats: [{ label: "Clérigo" }, { k: "Uso", v: "Básica" }],
    tag: "Básica 1 · Clase",
  },
  {
    category: "clase", rarity: "clase", badge: "✨", cost: "Acción", emoji: "☀️",
    name: "Llama sagrada",
    text: <>Ataque divino a distancia (alcance 3 hex): 1d20 + mod SAB vs Defensa; <b>1d8 de daño radiante</b>, especialmente efectivo vs no-muertos.</>,
    stats: [{ label: "Clérigo" }, { k: "Uso", v: "Básica" }],
    tag: "Básica 1 · Clase",
  },
  {
    category: "clase", rarity: "clase", badge: "✨", cost: "Acción rápida", emoji: "🙏",
    name: "Escudo de fe",
    text: <>Concede <b>Escudado +2 CA</b> a ti o a un aliado adyacente hasta tu próximo turno.</>,
    stats: [{ label: "Clérigo" }, { k: "Uso", v: "Básica" }],
    tag: "Básica 1 · Clase",
  },
  {
    category: "clase", rarity: "clase", badge: "✨", cost: "Acción", emoji: "🙏",
    name: "Bendición",
    text: <>Durante 3 turnos ganas Bendecido: <b>+1d4</b> a tus tiradas de ataque y de salvación.</>,
    stats: [{ label: "Clérigo" }, { k: "Uso", v: "1/combate" }],
    tag: "Especial · Clase",
  },

  // ----------------------------------------------------------------- ARMA
  {
    category: "arma", rarity: "comun", badge: "⚔️", emoji: "🔪",
    name: "Dagas",
    text: <>Hoja corta y ligera, ideal para el ataque furtivo.</>,
    stats: [{ k: "Daño", v: "1d4" }, { k: "Stat", v: "FUE/DES" }],
    tag: "Común · Arma",
    hands: "1h",
    damageType: "perforante",
  },
  {
    category: "arma", rarity: "comun", badge: "⚔️", emoji: "🗡️",
    name: "Espada (1 mano)",
    text: <>Hoja equilibrada a una mano.</>,
    stats: [{ k: "Daño", v: "1d8" }, { k: "Stat", v: "FUE" }],
    tag: "Común · Arma",
    hands: "1h",
    damageType: "cortante",
  },
  {
    category: "arma", rarity: "comun", badge: "⚔️", emoji: "🗡️",
    name: "Espada (2 manos)",
    text: <>Hoja pesada a dos manos.</>,
    stats: [{ k: "Daño", v: "1d12" }, { k: "Stat", v: "FUE" }],
    tag: "Común · Arma",
    hands: "2h",
    damageType: "cortante",
  },
  {
    category: "arma", rarity: "comun", badge: "⚔️", emoji: "🪓",
    name: "Hacha (1 mano)",
    text: <>Hacha de una mano.</>,
    stats: [{ k: "Daño", v: "1d6" }, { k: "Stat", v: "FUE" }],
    tag: "Común · Arma",
    hands: "1h",
    damageType: "cortante",
  },
  {
    category: "arma", rarity: "comun", badge: "⚔️", emoji: "🪓",
    name: "Hacha (2 manos)",
    text: <>Hacha grande a dos manos.</>,
    stats: [{ k: "Daño", v: "1d12" }, { k: "Stat", v: "FUE" }],
    tag: "Común · Arma",
    hands: "2h",
    damageType: "cortante",
  },
  {
    category: "arma", rarity: "comun", badge: "⚔️", emoji: "🔱",
    name: "Lanza",
    text: <>Arma larga con punta perforante.</>,
    stats: [{ k: "Daño", v: "1d10" }, { k: "Stat", v: "FUE" }],
    tag: "Común · Arma",
    hands: "2h",
    damageType: "perforante",
  },
  {
    category: "arma", rarity: "comun", badge: "⚔️", emoji: "🔨",
    name: "Maza",
    text: <>Arma contundente sencilla.</>,
    stats: [{ k: "Daño", v: "1d6" }, { k: "Stat", v: "FUE" }],
    tag: "Común · Arma",
    hands: "1h",
    damageType: "contundente",
  },
  {
    category: "arma", rarity: "comun", badge: "⚔️", emoji: "⚒️",
    name: "Maza bendita",
    text: <>Maza consagrada por el clero.</>,
    stats: [{ k: "Daño", v: "1d6" }, { k: "Stat", v: "FUE/SAB" }],
    tag: "Común · Arma",
    hands: "1h",
    damageType: "contundente",
  },
  {
    category: "arma", rarity: "comun", badge: "⚔️", emoji: "🛡️",
    name: "Escudo",
    text: <>Protección adicional para el brazo.</>,
    stats: [{ k: "Daño", v: "1d4" }, { k: "Stat", v: "FUE" }],
    tag: "Común · Arma",
    hands: "1h",
    damageType: "contundente",
  },
  {
    category: "arma", rarity: "comun", badge: "⚔️", emoji: "🏹",
    name: "Arco",
    text: <>Arma a distancia de largo alcance.</>,
    stats: [{ k: "Daño", v: "1d8" }, { k: "Stat", v: "DES" }, { k: "Alcance", v: "4 hex" }],
    tag: "Común · Arma",
    hands: "2h",
    damageType: "perforante",
  },
  {
    category: "arma", rarity: "comun", badge: "⚔️", emoji: "🏹",
    name: "Ballesta pesada",
    text: <>Ballesta grande y potente.</>,
    stats: [{ k: "Daño", v: "1d10" }, { k: "Stat", v: "DES" }, { k: "Alcance", v: "5 hex" }],
    tag: "Común · Arma",
    hands: "2h",
    damageType: "perforante",
  },
  {
    category: "arma", rarity: "comun", badge: "⚔️", emoji: "🏹",
    name: "Ballesta de mano",
    text: <>Arma a distancia compacta, a una mano.</>,
    stats: [{ k: "Daño", v: "1d6" }, { k: "Stat", v: "DES" }, { k: "Alcance", v: "3 hex" }],
    tag: "Común · Arma",
    hands: "1h",
    damageType: "perforante",
  },
  {
    category: "arma", rarity: "comun", badge: "⚔️", emoji: "🪄",
    name: "Bastón de mago",
    text: <>Vara tallada con runas arcanas.</>,
    stats: [{ k: "Daño", v: "1d6" }, { k: "Stat", v: "INT" }, { k: "Alcance", v: "2 hex" }],
    tag: "Común · Arma",
    hands: "1h",
    damageType: "arcano",
  },
  {
    category: "arma", rarity: "comun", badge: "⚔️", emoji: "📖",
    name: "Libro de hechizos",
    text: <><b>Foco arcano:</b> necesario para preparar ciertos hechizos de Mago; +1 hechizo especial preparado. No hace daño.</>,
    stats: [{ label: "Foco arcano" }, { label: "Sin daño" }],
    tag: "Común · Arma",
    hands: "1h",
  },
  {
    category: "arma", rarity: "comun", badge: "⚔️", emoji: "📿",
    name: "Símbolo sagrado",
    text: <><b>Foco divino:</b> necesario para preparar ciertos hechizos de Clérigo; +1 hechizo especial preparado. No hace daño.</>,
    stats: [{ label: "Foco divino" }, { label: "Sin daño" }],
    tag: "Común · Arma",
    hands: "1h",
  },
  {
    category: "arma", rarity: "comun", badge: "⚔️", emoji: "🔥",
    name: "Antorcha",
    text: <><b>Ilumina:</b> mejora el rango de visión en localizaciones oscuras (Cueva/Mazmorra/Mina). No hace daño.</>,
    stats: [{ label: "Ilumina" }, { label: "Sin daño" }],
    tag: "Común · Arma",
    hands: "1h",
  },

  // ------------------------------------------------------------- ARMADURA
  {
    category: "armadura", rarity: "comun", badge: "🛡️", emoji: "🧥",
    name: "Acolchada",
    text: <>Tela acolchada, ligera y barata.</>,
    stats: [{ k: "CA", v: "+1" }],
    tag: "Común · Armadura",
    weight: "ligera",
  },
  {
    category: "armadura", rarity: "comun", badge: "🛡️", emoji: "🧥",
    name: "Cuero",
    text: <>Cuero curtido, flexible y silencioso.</>,
    stats: [{ k: "CA", v: "+1" }],
    tag: "Común · Armadura",
    weight: "ligera",
  },
  {
    category: "armadura", rarity: "comun", badge: "🛡️", emoji: "🧥",
    name: "Cuero tachonado",
    text: <>Cuero reforzado con tachones metálicos.</>,
    stats: [{ k: "CA", v: "+2" }],
    tag: "Común · Armadura",
    weight: "ligera",
  },
  {
    category: "armadura", rarity: "comun", badge: "🛡️", emoji: "🥋",
    name: "Pieles",
    text: <>Pieles curtidas de bestia.</>,
    stats: [{ k: "CA", v: "+2" }],
    tag: "Común · Armadura",
    weight: "media",
  },
  {
    category: "armadura", rarity: "comun", badge: "🛡️", emoji: "🥋",
    name: "Cota de escamas",
    text: <>Escamas metálicas cosidas sobre cuero. Desventaja para evitar detección (ruidosa).</>,
    stats: [{ k: "CA", v: "+4" }, { label: "Ruidosa" }],
    tag: "Común · Armadura",
    weight: "media",
  },
  {
    category: "armadura", rarity: "comun", badge: "🛡️", emoji: "🥋",
    name: "Media cota",
    text: <>Malla que cubre torso y hombros. Desventaja para evitar detección (ruidosa).</>,
    stats: [{ k: "CA", v: "+5" }, { label: "Ruidosa" }],
    tag: "Común · Armadura",
    weight: "media",
  },
  {
    category: "armadura", rarity: "comun", badge: "🛡️", emoji: "🛡️",
    name: "Cota de anillas",
    text: <>Anillos de hierro cosidos sobre cuero grueso. Desventaja para evitar detección.</>,
    stats: [{ k: "CA", v: "+4" }, { label: "Ruidosa" }],
    tag: "Común · Armadura",
    weight: "pesada",
  },
  {
    category: "armadura", rarity: "comun", badge: "🛡️", emoji: "🛡️",
    name: "Coraza",
    text: <>Protege el torso; algo menos ruidosa que otras armaduras pesadas.</>,
    stats: [{ k: "CA", v: "+5" }],
    tag: "Común · Armadura",
    weight: "pesada",
  },
  {
    category: "armadura", rarity: "comun", badge: "🛡️", emoji: "🧥",
    name: "Cota de malla",
    text: <>Cota de malla completa. <b>Desventaja</b> para evitar detección (ruidosa).</>,
    stats: [{ k: "CA", v: "+6" }, { label: "Ruidosa" }, { k: "Req.", v: "FUE 13" }],
    tag: "Común · Armadura",
    weight: "pesada",
  },
  {
    category: "armadura", rarity: "comun", badge: "🛡️", emoji: "🛡️",
    name: "Placas",
    text: <>Requiere <b>FUE 15</b>; desventaja para evitar detección. <b>−1 Movimiento</b> si no cumples el requisito.</>,
    stats: [{ k: "CA", v: "+8" }, { label: "Ruidosa" }, { k: "Req.", v: "FUE 15" }],
    tag: "Común · Armadura",
    weight: "pesada",
  },

  // ----------------------------------------------------------------- ITEM
  {
    category: "item", rarity: "legendario", badge: "🎒", emoji: "🗡️",
    name: "Espada vorpal",
    text: <>Con crítico (<b>nat 20</b>) decapita: muerte instantánea a no-jefes, daño masivo a jefes.</>,
    stats: [{ k: "Daño", v: "2d8" }, { label: "Cortante" }, { label: "2 manos" }],
    tag: "Legendario · Item",
    legendary: true,
  },
  {
    category: "item", rarity: "legendario", badge: "🎒", cost: "Acción", emoji: "🧥",
    name: "Manto de invisibilidad",
    text: <>Quedas <b>Oculto</b> sin necesitar terreno.</>,
    stats: [{ label: "Sin terreno" }, { k: "Uso", v: "1/combate" }],
    tag: "Legendario · Item",
    legendary: true,
  },
  {
    category: "item", rarity: "epico", badge: "🎒", cost: "Pasiva", emoji: "🪄",
    name: "Bastón del poder",
    text: <>Foco arcano: <b>+1</b> a tiradas y CD de hechizos y <b>+1 CA</b>. Potencia las cartas de Mago.</>,
    stats: [{ k: "Manos", v: "1h" }, { label: "Foco arcano" }],
    tag: "Épico · Item",
  },
  {
    category: "item", rarity: "legendario", badge: "🎒", cost: "Acción rápida", emoji: "💍",
    name: "Anillo de deseo",
    text: <>Copia el efecto de una Especial que hayas visto este combate, <b>o cúrate al máximo</b>.</>,
    stats: [],
    tag: "Legendario · Item",
    legendary: true,
  },
  {
    category: "item", rarity: "legendario", badge: "🎒", cost: "Acción", emoji: "🔮",
    name: "Orbe de dragón",
    text: <>Aliento de <b>4d6 de fuego</b> en un hex y sus adyacentes (salvación DES por mitad).</>,
    stats: [{ k: "Daño", v: "4d6" }, { label: "Fuego" }, { k: "Uso", v: "1/combate" }],
    tag: "Legendario · Item",
    legendary: true,
  },
  {
    category: "item", rarity: "epico", badge: "🎒", cost: "Pasiva", emoji: "🧤",
    name: "Guantelete del ogro",
    text: <><b>+2</b> de Fuerza efectiva para armas y pruebas; <b>+2</b> al daño cuerpo a cuerpo.</>,
    stats: [{ k: "FUE", v: "+2" }, { k: "Daño", v: "+2" }],
    tag: "Épico · Item",
  },
  {
    category: "item", rarity: "epico", badge: "🎒", cost: "Acción rápida", emoji: "👢",
    name: "Botas de teletransporte",
    text: <>Te teletransportas hasta <b>3 hex</b> (ignora terreno y adyacencia).</>,
    stats: [{ k: "Alcance", v: "3 hex" }, { k: "Uso", v: "1/combate" }],
    tag: "Épico · Item",
  },
  {
    category: "item", rarity: "comun", badge: "🎒", cost: "Acción rápida", emoji: "🧪",
    name: "Poción de vida",
    text: <>Recuperas PV al instante (<b>2d4+2</b>).</>,
    stats: [{ k: "Cura", v: "2d4+2" }],
    tag: "Común · Item",
  },
  {
    category: "item", rarity: "comun", badge: "🎒", cost: "Acción rápida", emoji: "🧪",
    name: "Antídoto",
    text: <>Retira el estado <b>Envenenado</b>.</>,
    stats: [{ label: "Cura estado" }],
    tag: "Común · Item",
  },
  {
    category: "item", rarity: "poco-comun", badge: "🎒", cost: "Acción", emoji: "📜",
    name: "Pergamino (hechizo)",
    text: <>Lanza un hechizo concreto.</>,
    stats: [],
    tag: "Poco común · Item",
  },
  {
    category: "item", rarity: "comun", badge: "🎒", cost: "Fuera de combate", emoji: "🔥",
    name: "Hoguera / Campamento",
    text: (
      <>Descanso corto: gastas Dados de Vida para curarte y reseteas habilidades 1/descanso. Acampar en terreno inseguro <b>arriesga una emboscada</b>.</>
    ),
    stats: [{ label: "Descanso corto" }, { label: "Riesgo emboscada" }],
    tag: "Común · Item",
  },
  {
    category: "item", rarity: "comun", badge: "🎒", cost: "Acción rápida", emoji: "👟",
    name: "Bota veloz",
    text: <><b>+2</b> de movimiento este turno.</>,
    stats: [{ k: "Mov.", v: "+2" }],
    tag: "Común · Item",
  },
  {
    category: "item", rarity: "poco-comun", badge: "🎒", cost: "Acción rápida", emoji: "👟",
    name: "Atajo del pícaro",
    text: <><b>+1</b> de movimiento e ignoras el coste extra de terreno difícil (Pantano) este turno.</>,
    stats: [{ k: "Mov.", v: "+1" }, { label: "Ignora terreno difícil" }],
    tag: "Poco común · Item",
  },
  {
    category: "item", rarity: "raro", badge: "🎒", cost: "Acción rápida", emoji: "🌀",
    name: "Zancada del viento",
    text: <><b>+3</b> de movimiento este turno.</>,
    stats: [{ k: "Mov.", v: "+3" }],
    tag: "Raro · Item",
  },

  // ------------------------------------------------------------ MALDICIÓN
  {
    category: "maldicion", rarity: "maldicion", badge: "💀", emoji: "⛓️",
    name: "Peso maldito",
    text: <>Ocupa un hueco del mazo y <b>no se puede vender</b>. Límpiala en el Templo.</>,
    stats: [{ k: "Efecto", v: "−1 Mov." }, { k: "Limpieza", v: "30 oro" }],
    tag: "Severidad Leve · Maldición",
    severity: "leve",
  },
  {
    category: "maldicion", rarity: "maldicion", badge: "💀", emoji: "🤢",
    name: "Herida infectada",
    text: <><b>1 de daño</b> al inicio de tu turno cada 2 turnos en combate. Límpiala en el Templo.</>,
    stats: [{ k: "Efecto", v: "1 dmg/2 turnos" }, { k: "Limpieza", v: "30 oro" }],
    tag: "Severidad Leve · Maldición",
    severity: "leve",
  },
  {
    category: "maldicion", rarity: "maldicion", badge: "💀", emoji: "🌑",
    name: "Velo de sombras",
    text: <>Oteas solo <b>1 carta</b> en vez de 2 en el drafting. Límpiala en el Templo.</>,
    stats: [{ label: "Drafting −1 carta" }, { k: "Limpieza", v: "30 oro" }],
    tag: "Severidad Leve · Maldición",
    severity: "leve",
  },
  {
    category: "maldicion", rarity: "maldicion", badge: "💀", emoji: "🤚",
    name: "Mano temblorosa",
    text: <><b>Desventaja</b> en tu primera tirada de cada combate. Límpiala en el Templo.</>,
    stats: [{ label: "Desventaja 1ª tirada" }, { k: "Limpieza", v: "30 oro" }],
    tag: "Severidad Leve · Maldición",
    severity: "leve",
  },
  {
    category: "maldicion", rarity: "maldicion", badge: "💀", emoji: "🎯",
    name: "Marca del cazador",
    text: <>Los enemigos te detectan <b>+1 hex</b> más lejos. Límpiala en el Templo.</>,
    stats: [{ label: "Detección +1 hex" }, { k: "Limpieza", v: "60 oro" }],
    tag: "Severidad Grave · Maldición",
    severity: "grave",
  },
  {
    category: "maldicion", rarity: "maldicion", badge: "💀", emoji: "🩸",
    name: "Sangre lenta",
    text: <>Toda curación que recibes se reduce <b>a la mitad</b>. Límpiala en el Templo.</>,
    stats: [{ label: "Curación −50%" }, { k: "Limpieza", v: "60 oro" }],
    tag: "Severidad Grave · Maldición",
    severity: "grave",
  },
  {
    category: "maldicion", rarity: "maldicion", badge: "💀", emoji: "😩",
    name: "Fatiga eterna",
    text: <>Tienes <b>1 Dado de Vida menos</b> disponible hasta limpiarla.</>,
    stats: [{ label: "−1 Dado de Vida" }, { k: "Limpieza", v: "60 oro" }],
    tag: "Severidad Grave · Maldición",
    severity: "grave",
  },
  {
    category: "maldicion", rarity: "maldicion", badge: "💀", emoji: "👂",
    name: "Susurros",
    text: <>Al inicio de cada combate, salvación SAB CD 12 o quedas <b>Asustado</b> 1 turno.</>,
    stats: [{ label: "Riesgo Asustado" }, { k: "Limpieza", v: "60 oro" }],
    tag: "Severidad Grave · Maldición",
    severity: "grave",
  },
];
