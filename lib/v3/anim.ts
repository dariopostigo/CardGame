// =========================================================================
// El vocabulario de la animación de V3 — qué pasa, cuánto dura y en qué orden
//
// Esto NO es una regla de juego, pero tampoco es pintura: es la capa que
// convierte "el motor ha decidido que la ficha muere" en "durante 520 ms pasa
// esto". Vive en lib/v3/ y no en el componente por el motivo de siempre
// (ARCHITECTURE.md §6, la pregunta de "¿podría ejecutar esto sin pantalla?"):
// la duración de una secuencia, el orden de los sucesos y lo que se solapa con
// qué se pueden calcular y comprobar sin dibujar un solo píxel. Lo que sí es
// del componente es el `transform` concreto.
//
// POR QUÉ EXISTE ESTE ARCHIVO, que es la parte que importa:
//
// Un motor que cambia el estado en el mismo instante en que el jugador suelta
// la carta NO SE PUEDE ANIMAR. React repinta y la ficha aparece ya puesta: no
// hay nada entre el clic y el resultado, así que no hay nada que enseñar. La
// única forma de que esto parezca un videojuego es que el motor EMITA SUCESOS
// —"esta ficha se despliega aquí", "esta pega a esta otra", "esta cae"— y que
// la pantalla los reproduzca en cola, aplicando cada cambio cuando su
// animación termina. Es literalmente lo que hace Hearthstone, y es la razón de
// que allí pase medio segundo entre que sueltas y el tablero cambia.
//
// duel.ts ya devuelve `turns[]` en vez de un estado final, que es la forma
// correcta. `schedule()` de aquí abajo es la otra mitad: coge una lista de
// sucesos y les pone hora. Mientras el motor de combate no exista, el
// laboratorio (/dev/animacion) es el único que la usa.
//
// LOS NÚMEROS SON DIALES, no decisiones cerradas. Por eso viven aquí y no en
// styles/settings/_motion.scss como el resto de duraciones del proyecto: el
// laboratorio los mueve en vivo con sliders, y una variable Sass no se puede
// mover en vivo. Mismo caso —y misma excusa— que $deck-deal-stagger y que la
// cadencia de AnimatedSprite, ya documentados allí. Cuando la sensación esté
// decidida, los que acaben usándose desde CSS bajan a _motion.scss.
//
// LAS TRES COSAS QUE HACEN QUE ALGO "PESE", porque no son obvias y son las que
// se están ajustando aquí:
//
//   1. La SOMBRA, no la ficha. Lo que dice "esto venía de arriba" es una
//      sombra que empieza grande y difusa y acaba pequeña y dura. Sin ella la
//      caída se lee como un cambio de tamaño.
//   2. La CURVA. Caer es acelerar: si la curva frena al final (el `ease-out`
//      por defecto de todo), el objeto flota. Ver CURVES.
//   3. El APLASTADO al tocar (squash), de menos de 100 ms. Es el único trozo
//      de dibujo animado clásico que hay aquí, y es el que más se nota.
//
// Y la cuarta, que es del golpe y no de la caída: el HIT-STOP. Congelarlo todo
// 60-80 ms en el fotograma del impacto es el efecto más barato del catálogo y
// el que más contundencia da.
//
// EL FALLO Y EL CRÍTICO NO SON ADORNO, y esta es la parte de aquí que menos se
// parece a un ajuste de gusto. V3 no enseña dados: hay una tirada oculta 1..100
// contra dos umbrales (game-design.md §4.1, resuelta en combat.ts). Eso
// significa que **la animación es el único canal por el que el jugador se
// entera de lo que ha pasado** — no hay un número en pantalla que lo diga—, y
// que un ataque que no entra sin secuencia propia no se lee como un fallo: se
// lee como un juego roto.
//
// La restricción que gobierna las tres, y que no es obvia: los tres desenlaces
// tienen que ser INDISTINGUIBLES hasta el fotograma del contacto. La embestida
// es la misma, dura lo mismo y llega igual de lejos; lo que cambia empieza en
// el contacto y no antes. Si el fallo se notara en la ida, el jugador aprende a
// leer el resultado en el gesto y la tirada deja de tener suspense — que es lo
// único que una tirada oculta tiene que dar.
//
// Después del contacto sí divergen, y ahí aparece la segunda pregunta, que es
// de ritmo y no de información: ¿deben durar lo mismo? Un fallo corto hace que
// una tanda con mala suerte parezca acelerada, y un crítico largo ralentiza una
// ronda entera. Por eso `evenOut` es un dial y no una decisión tomada: se mira
// con una tanda de doce y se decide viéndola.
//
// LOS TRES TIEMPOS, que es lo que ordena todo lo que viene después. Lo de arriba
// cuenta lo que YA PASÓ —cayó, golpeó, falló, murió—. Un videojuego necesita
// otros dos, y son los que EVITAN preguntas en vez de contestarlas:
//
//   · ANTES — qué puedo hacer. Al coger una ficha, el terreno al que llega se
//     levanta. En V3 no es cortesía: 👢 Movimiento va por tipo de daño
//     (🗡️ 3 · ✨ 2 · 🏹 1, tempo.ts `MOVEMENT_BAND`), así que cada ficha alcanza
//     un sitio distinto, y con quince por bando nadie va a contar hexágonos de
//     cabeza. La cuenta ya existe y es del motor —movement.ts `reachable`, que
//     rodea los cuerpos—: lo que falta es enseñarla.
//   · MIENTRAS NO PASA NADA — que la mesa esté viva. Las fichas respiran, cada
//     una en su fase. Es lo más barato del archivo y lo que más cambia la
//     impresión general, porque un tablero perfectamente quieto no se lee como
//     un juego parado: se lee como una captura de pantalla.
//
// Y LA PROPIEDAD QUE UNE A ESAS DOS, que es la razón de que se construyan
// juntas y no una detrás de otra: lo que dice que una ficha YA HA ANDADO es que
// NO RESPIRA. Se lee por ausencia, y una ausencia solo se ve si lo demás está
// presente. Con el aliento apagado (`idleRise` a 0) el hundimiento y el color no
// bastan — la ficha gastada solo parece un poco más oscura, y nadie recorre un
// tablero buscando cuál está más oscura. Se comprueba apagando el dial.
//
// La otra propiedad es de reloj, y esa sí se puede medir sin pantalla: LA OFERTA
// TIENE QUE ESTAR COMPLETA ANTES DE QUE EL JUGADOR HAYA DECIDIDO. Un tablero que
// tarda medio segundo en decir dónde puedes soltar llega tarde: para cuando
// termina de abrirse, la mano ya va camino de un hexágono y la ayuda se ha
// convertido en un parpadeo por detrás del gesto. `offerDuration()` la mide
// contra `OFFER_BUDGET`.
// =========================================================================

import type { AttackResult } from "./combat";

/** Una curva de Bézier de CSS, en sus cuatro números. */
export type Curve = readonly [number, number, number, number];

export function cubic(c: Curve): string {
  return `cubic-bezier(${c.join(", ")})`;
}

// --- Curvas ----------------------------------------------------------------

export type CurveId = "suave" | "peso" | "rebote" | "duro";

/**
 * Las cuatro curvas de caída que merece la pena comparar. No son gustos
 * distintos del mismo movimiento: son cuatro físicas distintas, y solo una
 * puede ser la del juego.
 */
export const CURVES: Record<CurveId, { readonly curve: Curve; readonly label: string; readonly help: string }> = {
  suave: {
    curve: [0.16, 1, 0.3, 1],
    label: "Suave",
    help: "La curva de salida de todo el proyecto (paneles, fichas que andan). Frena al llegar, así que la ficha no cae: se posa. Está aquí para verla fallar.",
  },
  peso: {
    curve: [0.55, 0, 0.85, 0.35],
    label: "Peso",
    help: "Acelera hacia el suelo y no frena. Es lo que hace la gravedad, y por eso es la de por defecto.",
  },
  rebote: {
    curve: [0.34, 1.56, 0.64, 1],
    label: "Rebote",
    help: "Se pasa de largo y vuelve. Es la que usa el lab de Baraja de v2 al soltar una carta sobre el tablero: sirve para algo que bota, no para algo que pesa.",
  },
  duro: {
    curve: [0.7, 0, 1, 1],
    label: "Duro",
    help: "Acelera hasta el final sin ninguna suavidad. Piedra. Con el aplastado alto puede ser lo que pide una ficha de metal.",
  },
};

// --- Los diales ------------------------------------------------------------

export type Timings = {
  /** Vuelo: de donde se suelta la carta hasta quedar sobre su hexágono. */
  readonly flight: number;
  /** Caída: de la altura de vuelo al suelo. Es la que lleva la curva. */
  readonly fall: number;
  readonly fallCurve: CurveId;
  /** Aplastado contra el suelo y recuperación. */
  readonly squash: number;
  /** Cuánto se aplasta, de 0 a 1. 0,18 son 82 % de alto y 118 % de ancho. */
  readonly squashAmount: number;
  /** Altura en píxeles desde la que cae la ficha una vez colocada en su hexágono. */
  readonly hover: number;
  /** Cuántas veces más grande es la carta en la mano que la ficha en el suelo. */
  readonly cardScale: number;

  /** Embestida: ida hacia el objetivo. */
  readonly lunge: number;
  /** Y vuelta a su hexágono. Más rápida que la ida: el golpe ya se ha dado. */
  readonly lungeBack: number;
  /** Qué parte del camino hasta el objetivo recorre, de 0 a 1. Nunca 1: no se pisa. */
  readonly lungeDistance: number;
  /** El congelado en el fotograma del impacto. */
  readonly hitStop: number;
  /** El destello blanco del que recibe. */
  readonly flash: number;
  /** Amplitud del temblor de cámara, en píxeles. */
  readonly shake: number;
  readonly shakeTime: number;

  /** Lo que tarda una ficha en desaparecer al morir. */
  readonly death: number;

  // --- El desenlace: lo que separa fallar, golpear y criticar ---------------
  //
  // Todos son MULTIPLICADORES de los diales de arriba, no tiempos propios, y no
  // por comodidad: un fallo y un crítico tienen que ser el mismo golpe con otra
  // suerte. En cuanto se les da un reloj independiente se desafinan, y lo que
  // se ve son tres animaciones distintas en vez de tres resultados de la misma.

  /** Cuánto se aparta el objetivo al esquivar, en fracción del hexágono. */
  readonly missDodge: number;
  /** Cuánto se pasa de largo el atacante al fallar. 1 es quedarse donde el impacto. */
  readonly missOvershoot: number;
  /** Cuánto más lenta es la vuelta tras fallar: es la recuperación del que se ha vaciado. */
  readonly missRecovery: number;
  /** El congelado del crítico, en veces el normal. */
  readonly critStop: number;
  /** Su temblor, en veces el normal. */
  readonly critShake: number;
  /** Su destello, en veces el normal. */
  readonly critFlash: number;

  /**
   * Que los tres desenlaces ocupen lo mismo en la cola.
   *
   * No es accesibilidad ni ahorro: es ritmo. Sin esto, una tanda con mala
   * suerte va a otra velocidad que una con buena, y el jugador lo nota antes de
   * saber por qué. Con esto, el crítico paga su congelado extra acortando la
   * vuelta —que después de un congelado largo hasta sienta bien— y el fallo
   * rellena con recuperación.
   */
  readonly evenOut: boolean;

  // --- La mesa viva: el aliento y lo ya gastado ----------------------------

  /**
   * Cuánto sube y baja una ficha al respirar, en fracción del hexágono.
   *
   * A 0 no hay aliento, y ese es el experimento: apagarlo no deja el tablero
   * "igual pero quieto", lo deja pareciendo una imagen. Además se lleva por
   * delante la lectura de lo gastado, que es una ausencia de esto.
   */
  readonly idleRise: number;
  /** Lo que tarda un ciclo completo de respiración. */
  readonly idleCycle: number;
  /** Cuánto se hunde una ficha que ya ha andado, en fracción del hexágono. */
  readonly spentSink: number;
  /** Cuánto color pierde, de 0 a 1. No es un cadáver: todavía puede atacar. */
  readonly spentFade: number;
  /** El escalón entre una ficha y la siguiente al empezar el turno. */
  readonly wakeStagger: number;

  // --- Ofrecer el terreno y andarlo ----------------------------------------

  /** Cuánto se levanta un hexágono ofrecido, en píxeles. */
  readonly offerRise: number;
  /** Retraso por cada hexágono de distancia: es lo que hace la onda. */
  readonly offerRipple: number;
  /** Lo que cuesta un paso de hexágono a hexágono (§5). */
  readonly step: number;
  /** Cuánto se despega del suelo en cada paso. Andar es una sucesión de saltitos. */
  readonly stepHop: number;

  /** Partículas del reventón al aterrizar. */
  readonly dustCount: number;
  /** Velocidad inicial, en píxeles por segundo. */
  readonly dustSpeed: number;
  /** Cuánto vive cada partícula. */
  readonly dustLife: number;
  /** Radio inicial en píxeles. */
  readonly dustSize: number;
  /** Píxeles por segundo al cuadrado. Positivo cae, negativo sube (humo). */
  readonly dustGravity: number;
  /** Rozamiento del aire: qué fracción de la velocidad se pierde por segundo. */
  readonly dustDrag: number;
};

/**
 * El punto de partida. Salen de tres sitios: lo que ya está medido en v2
 * (_motion.scss, el lab de Baraja), lo que es física (la curva "peso") y lo
 * que es oficio de animación —el aplastado por debajo de 100 ms, el hit-stop
 * entre 60 y 80—. Ninguno está decidido: para eso está el laboratorio.
 */
export const TIMINGS: Timings = {
  flight: 260,
  fall: 190,
  fallCurve: "peso",
  squash: 110,
  squashAmount: 0.18,
  hover: 90,
  cardScale: 2.4,

  lunge: 170,
  lungeBack: 220,
  lungeDistance: 0.42,
  hitStop: 70,
  flash: 140,
  shake: 5,
  shakeTime: 240,

  death: 520,

  // El esquive es pequeño a propósito: apartarse medio hexágono se lee como
  // teletransportarse, y además dejaría al objetivo pisando la casilla de al
  // lado, que en un tablero de hexágonos es una mentira que se ve.
  missDodge: 0.26,
  missOvershoot: 1.3,
  missRecovery: 1.45,
  critStop: 2.2,
  critShake: 1.8,
  critFlash: 1.5,
  evenOut: false,

  // Tres píxeles en un hexágono de cuarenta, y ni uno más: el aliento tiene que
  // estar por debajo de lo que se mira a propósito. Si se ve respirar, es un
  // globo. El ciclo es largo por lo mismo —una ficha en guardia no jadea— y cada
  // una entra en su fase (`idlePhase`), porque quince fichas subiendo a la vez
  // no son quince fichas vivas: es el tablero entero bombeando.
  idleRise: 0.075,
  idleCycle: 2600,
  spentSink: 0.05,
  spentFade: 0.45,
  wakeStagger: 70,

  // 26 ms por hexágono en un campo de 14×12 son 340 ms hasta la esquina más
  // lejana, que ya roza el presupuesto; en el retal del banco son cuatro
  // hexágonos y sobra de largo. Es justo el número que hay que mirar con el
  // tablero de verdad delante, y por eso `offerDuration` existe.
  offerRise: 5,
  offerRipple: 26,
  step: 190,
  stepHop: 14,

  // La velocidad no es cosmética: el reventón nace tapado por la propia peana
  // —un disco opaco del tamaño del hexágono— así que si se abre despacio, los
  // primeros cien milisegundos del polvo no se ven. A 210 px/s la corona sale
  // de detrás de la ficha en el mismo fotograma del impacto, que es cuando hace
  // falta.
  dustCount: 26,
  dustSpeed: 210,
  dustLife: 620,
  dustSize: 9,
  dustGravity: -30,
  dustDrag: 2.6,
};

/**
 * Los diales que el laboratorio deja mover, con su rango y su porqué.
 *
 * Fuera quedan los dos que no son un número en una escala: la curva de caída
 * —que es una elección entre cuatro físicas, no un continuo— y `evenOut`, que
 * es un sí o un no.
 */
export type KnobId = Exclude<keyof Timings, "fallCurve" | "evenOut">;

export type Knob = {
  readonly id: KnobId;
  readonly group: "despliegue" | "impacto" | "desenlace" | "vida" | "movimiento" | "polvo";
  readonly label: string;
  readonly min: number;
  readonly max: number;
  readonly step: number;
  readonly unit: string;
  readonly help: string;
};

export const KNOBS: readonly Knob[] = [
  {
    id: "flight",
    group: "despliegue",
    label: "Vuelo",
    min: 0,
    max: 700,
    step: 10,
    unit: "ms",
    help: "De la mano al aire sobre el hexágono. Es donde la carta se convierte en ficha: si va muy rápido, el cambio no se ve y la carta parece desaparecer.",
  },
  {
    id: "fall",
    group: "despliegue",
    label: "Caída",
    min: 40,
    max: 600,
    step: 10,
    unit: "ms",
    help: "El tramo final contra el suelo. Corto y acelerado se lee como peso; largo, como una pluma.",
  },
  {
    id: "hover",
    group: "despliegue",
    label: "Altura",
    min: 0,
    max: 220,
    step: 5,
    unit: "px",
    help: "Desde qué altura cae. Manda más que la duración: es lo que separa dejar una ficha de soltarla.",
  },
  {
    id: "squash",
    group: "despliegue",
    label: "Aplastado",
    min: 0,
    max: 260,
    step: 10,
    unit: "ms",
    help: "El achatarse y recuperarse al tocar. Por encima de 150 ms deja de ser un impacto y pasa a ser goma.",
  },
  {
    id: "squashAmount",
    group: "despliegue",
    label: "Cuánto aplasta",
    min: 0,
    max: 0.4,
    step: 0.01,
    unit: "",
    help: "0,18 significa 82 % de alto y 118 % de ancho en el fotograma del golpe. A 0 no hay squash y se nota lo muerto que queda.",
  },
  {
    id: "cardScale",
    group: "despliegue",
    label: "Tamaño de la carta",
    min: 1,
    max: 4,
    step: 0.1,
    unit: "×",
    help: "Cuántas veces la ficha mide la carta en la mano. Es cuánto tiene que encoger durante el vuelo.",
  },

  {
    id: "lunge",
    group: "impacto",
    label: "Embestida",
    min: 60,
    max: 500,
    step: 10,
    unit: "ms",
    help: "La ida hacia el objetivo. Rápida: la intención de golpear no se delibera.",
  },
  {
    id: "lungeBack",
    group: "impacto",
    label: "Vuelta",
    min: 60,
    max: 600,
    step: 10,
    unit: "ms",
    help: "El regreso a su hexágono. Más lenta que la ida, que es lo que hace que la ida parezca violenta.",
  },
  {
    id: "lungeDistance",
    group: "impacto",
    label: "Recorrido",
    min: 0.1,
    max: 0.9,
    step: 0.02,
    unit: "",
    help: "Qué parte del camino hasta el objetivo recorre. Nunca 1: dos fichas no se pisan.",
  },
  {
    id: "hitStop",
    group: "impacto",
    label: "Congelado",
    min: 0,
    max: 300,
    step: 10,
    unit: "ms",
    help: "Todo se para en el fotograma del contacto. Es el efecto más barato que existe y el que más pega da. Ponlo a 0 y vuelve a subirlo: la diferencia es toda la contundencia.",
  },
  {
    id: "flash",
    group: "impacto",
    label: "Destello",
    min: 0,
    max: 400,
    step: 10,
    unit: "ms",
    help: "El blanco del que recibe. Es lo que dice CUÁL de las dos fichas se ha llevado el golpe.",
  },
  {
    id: "shake",
    group: "impacto",
    label: "Temblor",
    min: 0,
    max: 16,
    step: 1,
    unit: "px",
    help: "Cuánto se mueve la cámara. Por encima de 8 px marea, y en un juego de tablero se nota más que en uno de acción.",
  },
  {
    id: "shakeTime",
    group: "impacto",
    label: "Duración del temblor",
    min: 60,
    max: 600,
    step: 20,
    unit: "ms",
    help: "Un temblor largo es un terremoto; uno corto es un puñetazo.",
  },
  {
    id: "death",
    group: "impacto",
    label: "Muerte",
    min: 150,
    max: 1200,
    step: 20,
    unit: "ms",
    help: "Lo que tarda en irse del tablero. Es de lo más largo que hay aquí a propósito: perder una ficha tiene que verse.",
  },

  {
    id: "missDodge",
    group: "desenlace",
    label: "Esquive",
    min: 0,
    max: 0.6,
    step: 0.02,
    unit: "hex",
    help: "Cuánto se aparta el objetivo cuando el golpe no entra. Es lo que dice que ha fallado por algo y no porque el juego se haya olvidado de pegar. A 0 el fallo se lee como un bug.",
  },
  {
    id: "missOvershoot",
    group: "desenlace",
    label: "Pasarse de largo",
    min: 1,
    max: 2,
    step: 0.05,
    unit: "×",
    help: "El atacante que falla se pasa del punto de contacto: se ha vaciado en un golpe que no estaba. Es la mitad de la lectura del fallo; la otra mitad es el esquive.",
  },
  {
    id: "missRecovery",
    group: "desenlace",
    label: "Recuperación",
    min: 1,
    max: 2.5,
    step: 0.05,
    unit: "×",
    help: "Cuánto más lenta es la vuelta tras fallar. Aquí es donde el fallo cobra su castigo: sin congelado no hay contundencia que ganar, así que lo que queda es volver pesado.",
  },
  {
    id: "critStop",
    group: "desenlace",
    label: "Congelado del crítico",
    min: 1,
    max: 5,
    step: 0.1,
    unit: "×",
    help: "En veces el congelado normal. Es el dial que más hace por que un crítico se sienta crítico, muy por encima del color del número.",
  },
  {
    id: "critShake",
    group: "desenlace",
    label: "Temblor del crítico",
    min: 1,
    max: 4,
    step: 0.1,
    unit: "×",
    help: "Ojo con este: el temblor es lo primero que marea, y un crítico pasa una de cada cuatro veces como mucho pero en una ronda de treinta son siete.",
  },
  {
    id: "critFlash",
    group: "desenlace",
    label: "Destello del crítico",
    min: 1,
    max: 3,
    step: 0.1,
    unit: "×",
    help: "El fogonazo del que recibe. Es lo único de los tres que sigue funcionando con movimiento reducido, así que es lo que carga con distinguir el crítico cuando no hay desplazamiento.",
  },

  {
    id: "idleRise",
    group: "vida",
    label: "Aliento",
    min: 0,
    max: 0.3,
    step: 0.005,
    unit: "hex",
    help: "Cuánto sube y baja una ficha parada, en fracción del hexágono. Ponlo a 0: el tablero no se queda quieto, se queda muerto. Y con él se va la lectura de lo ya andado, que es la ausencia de esto.",
  },
  {
    id: "idleCycle",
    group: "vida",
    label: "Ciclo del aliento",
    min: 600,
    max: 6000,
    step: 100,
    unit: "ms",
    help: "Lo que tarda una respiración entera. Corto es jadeo y llama la atención; largo es guardia. Cada ficha entra en su propia fase, o quince subiendo a la vez serían un tablero bombeando.",
  },
  {
    id: "spentSink",
    group: "vida",
    label: "Hundimiento",
    min: 0,
    max: 0.25,
    step: 0.005,
    unit: "hex",
    help: "Cuánto se acuclilla la que ya ha andado. Es el más flojo de los tres avisos y el que menos falta hace: quítalo y todavía se lee.",
  },
  {
    id: "spentFade",
    group: "vida",
    label: "Color perdido",
    min: 0,
    max: 1,
    step: 0.05,
    unit: "",
    help: "Cuánto se apaga. Ojo con subirlo: una ficha que ya ha andado TODAVÍA PUEDE ATACAR (§5), así que si se apaga del todo se lee como muerta y se deja de contar con ella.",
  },
  {
    id: "wakeStagger",
    group: "vida",
    label: "Escalón al despertar",
    min: 0,
    max: 300,
    step: 10,
    unit: "ms",
    help: "El retraso entre una ficha y la siguiente al empezar el turno. A 0 se levantan todas de golpe y parece un repintado; escalonadas es una cascada, y de paso enseña en pequeño lo que `schedule()` va a tener que aprender a hacer con los estados.",
  },

  {
    id: "offerRise",
    group: "movimiento",
    label: "Levantada del terreno",
    min: 0,
    max: 20,
    step: 1,
    unit: "px",
    help: "Cuánto se despega el hexágono ofrecido. Es lo que hace que el terreno se OFREZCA en vez de solo encenderse: un tinte se lee como decoración y un relieve se lee como una tecla.",
  },
  {
    id: "offerRipple",
    group: "movimiento",
    label: "Onda",
    min: 0,
    max: 120,
    step: 2,
    unit: "ms/hex",
    help: "Retraso por hexágono de distancia. A 0 se enciende todo a la vez y no se ve de dónde sale; alto, la onda es bonita y llega tarde. Es el dial que hay que vigilar contra el presupuesto de abajo.",
  },
  {
    id: "step",
    group: "movimiento",
    label: "Paso",
    min: 60,
    max: 600,
    step: 10,
    unit: "ms/hex",
    help: "Lo que cuesta pasar de un hexágono al siguiente. Multiplícalo por 👢 3 y por quince fichas: es el dial que decide si un turno enemigo se puede mirar.",
  },
  {
    id: "stepHop",
    group: "movimiento",
    label: "Saltito",
    min: 0,
    max: 40,
    step: 1,
    unit: "px",
    help: "Cuánto se despega del suelo en cada paso. A 0 la ficha se desliza, que es lo que hace una pieza de ajedrez arrastrada por el tablero; con salto, anda.",
  },

  {
    id: "dustCount",
    group: "polvo",
    label: "Partículas",
    min: 0,
    max: 120,
    step: 1,
    unit: "",
    help: "Cuántas salen por reventón. Con 120 en el campo entero y quince fichas por bando ya son miles: el canvas aguanta, pero lo que se ve deja de ser polvo y pasa a ser niebla.",
  },
  {
    id: "dustSpeed",
    group: "polvo",
    label: "Velocidad",
    min: 10,
    max: 400,
    step: 10,
    unit: "px/s",
    help: "Con qué fuerza salen despedidas. Es lo que separa el polvo que levanta un pie del que levanta una roca.",
  },
  {
    id: "dustLife",
    group: "polvo",
    label: "Vida",
    min: 100,
    max: 2000,
    step: 20,
    unit: "ms",
    help: "Cuánto tardan en desvanecerse. Largo se lee como polvo fino en suspensión; corto, como tierra que vuelve al suelo.",
  },
  {
    id: "dustSize",
    group: "polvo",
    label: "Tamaño",
    min: 2,
    max: 40,
    step: 1,
    unit: "px",
    help: "El radio inicial. Cada partícula crece mientras vive, así que esto es de dónde parte.",
  },
  {
    id: "dustGravity",
    group: "polvo",
    label: "Gravedad",
    min: -200,
    max: 400,
    step: 10,
    unit: "px/s²",
    help: "Positivo cae —tierra, cascotes—; negativo sube, que es lo que hace el polvo fino y el humo. Por defecto está en negativo: es una nube, no una salpicadura.",
  },
  {
    id: "dustDrag",
    group: "polvo",
    label: "Rozamiento",
    min: 0,
    max: 8,
    step: 0.2,
    unit: "",
    help: "Cuánta velocidad pierde por segundo. Es lo que hace que el reventón se abra de golpe y luego se quede quieto flotando, en vez de irse recto.",
  },
];

// --- Las tres nubes ---------------------------------------------------------

/**
 * Lo que necesita el emisor de partículas para un reventón. El laboratorio solo
 * da mandos para el del ATERRIZAJE: los otros dos se derivan de él con
 * multiplicadores, porque lo que tienen que ser es hermanos suyos —el mismo
 * material, distinta violencia— y no tres ajustes independientes que se puedan
 * desafinar entre sí.
 */
export type DustSpec = {
  readonly count: number;
  readonly speed: number;
  readonly life: number;
  readonly size: number;
  readonly gravity: number;
  readonly drag: number;
  readonly color: string;
  /** Suma luz en vez de taparla. Para chispas, no para tierra. */
  readonly additive?: boolean;
  /** Hacia dónde sale, en radianes. Sin esto, en todas direcciones. */
  readonly direction?: number;
  /** Cuánto se abre alrededor de esa dirección, en radianes. */
  readonly spread?: number;
};

/** El polvo del aterrizaje: hacia los lados y hacia arriba, como una corona. */
export function landingDust(t: Timings): DustSpec {
  return {
    count: t.dustCount,
    speed: t.dustSpeed,
    life: t.dustLife,
    size: t.dustSize,
    gravity: t.dustGravity,
    drag: t.dustDrag,
    color: "#c8b795",
    // Media vuelta hacia arriba: el suelo está debajo, así que nada sale hacia
    // abajo. Es lo que le da la forma de corona en vez de la de explosión.
    direction: -Math.PI / 2,
    spread: Math.PI * 0.9,
  };
}

/** El del golpe: la mitad de partículas, el doble de rápidas y hacia el frente. */
export function hitDust(t: Timings, direction: number): DustSpec {
  return {
    count: Math.round(t.dustCount * 0.6),
    speed: t.dustSpeed * 2.1,
    life: t.dustLife * 0.5,
    size: t.dustSize * 0.55,
    gravity: Math.abs(t.dustGravity) * 0.6,
    drag: t.dustDrag * 1.6,
    color: "#ffe0a8",
    additive: true,
    direction,
    spread: Math.PI * 0.55,
  };
}

/**
 * El del crítico: chispas, no tierra.
 *
 * Cambia el MATERIAL y no solo la cantidad, y es la única de las cuatro que lo
 * hace. Un crítico con más polvo del mismo color se lee como un golpe normal
 * dado más fuerte; lo que se busca es que se lea como otra cosa. Por eso son
 * más pequeñas, mucho más rápidas, casi blancas y con gravedad positiva:
 * salen disparadas y caen, como esquirlas.
 */
export function critDust(t: Timings, direction: number): DustSpec {
  return {
    count: Math.round(t.dustCount * 1.3),
    speed: t.dustSpeed * 3.2,
    life: t.dustLife * 0.7,
    size: t.dustSize * 0.42,
    gravity: Math.abs(t.dustGravity) * 1.5,
    drag: t.dustDrag * 1.1,
    color: "#fff6d8",
    additive: true,
    direction,
    spread: Math.PI * 0.8,
  };
}

/**
 * El de la pisada: cuatro motas y se acabó.
 *
 * Es el reventón más pequeño del catálogo y el que más veces se va a emitir —una
 * ficha con 👢 3 deja tres por turno, y quince fichas por bando son noventa
 * pisadas por ronda—, así que aquí la cantidad no es gusto sino presupuesto. Sale
 * hacia los lados y casi sin fuerza: lo que levanta un pie no es una corona, es
 * una mancha que se queda donde cae.
 */
export function stepDust(t: Timings): DustSpec {
  return {
    count: Math.max(1, Math.round(t.dustCount * 0.16)),
    speed: t.dustSpeed * 0.35,
    life: t.dustLife * 0.55,
    size: t.dustSize * 0.7,
    gravity: t.dustGravity * 0.5,
    drag: t.dustDrag * 1.4,
    color: "#c8b795",
    direction: -Math.PI / 2,
    // Casi plano: una pisada esparce, no proyecta.
    spread: Math.PI * 1.5,
  };
}

/** El de la muerte: más y más gordas, en todas direcciones y lentas al caer. */
export function deathDust(t: Timings): DustSpec {
  return {
    count: Math.round(t.dustCount * 1.6),
    speed: t.dustSpeed * 0.8,
    life: t.dustLife * 1.4,
    size: t.dustSize * 1.4,
    gravity: t.dustGravity,
    drag: t.dustDrag,
    color: "#9d9384",
    spread: Math.PI * 2,
  };
}

// --- Accesibilidad ----------------------------------------------------------

/**
 * Los mismos sucesos sin movimiento, para `prefers-reduced-motion`.
 *
 * No es "sin animación": es sin DESPLAZAMIENTO. El destello y el aplastado se
 * quedan porque no mueven nada por la pantalla y son los que dicen qué ficha se
 * ha llevado el golpe; lo que se va es el vuelo, la caída, la embestida, el
 * temblor y el polvo, que son los que marean.
 */
export function reduced(t: Timings): Timings {
  return {
    ...t,
    flight: 0,
    fall: 60,
    hover: 0,
    squash: 0,
    lunge: 0,
    lungeBack: 0,
    lungeDistance: 0,
    hitStop: 0,
    shake: 0,
    dustCount: 0,

    // Sin desplazamiento no hay embestida, así que tampoco hay esquive ni
    // pasarse de largo: quitarlos no es una concesión, es que ya no existe el
    // gesto del que colgaban. Lo que se queda es el DESTELLO, y con él la carga
    // entera de distinguir los tres desenlaces —de ahí que `critFlash` no se
    // toque—; el resto lo tiene que decir el texto que flota.
    missDodge: 0,
    missOvershoot: 1,
    missRecovery: 1,
    critStop: 1,
    critShake: 1,

    // El aliento es lo PRIMERO que se apaga, y no por precaución: es movimiento
    // continuo, sin final y en toda la pantalla a la vez, que es exactamente el
    // perfil que la preferencia está pidiendo evitar. Quince fichas subiendo y
    // bajando para siempre no se negocian con "es poquito".
    //
    // Y como el aliento se va, la ficha ya andada se queda sin su lectura
    // principal —la ausencia de algo que ya no está en nadie—, así que aquí
    // `spentFade` NO se toca: pasa de ser el tercer aviso a ser el único, igual
    // que el destello carga con los tres desenlaces. El hundimiento sí se va,
    // que es desplazamiento.
    idleRise: 0,
    spentSink: 0,
    wakeStagger: 0,

    // La oferta se queda, y esto sí es una decisión: es información sobre lo que
    // se puede hacer, no un adorno. Lo que se va es el relieve y la onda —el
    // movimiento—, y queda el color, que dice lo mismo sin mover nada.
    offerRise: 0,
    offerRipple: 0,
    stepHop: 0,
  };
}

// --- La mesa viva -----------------------------------------------------------

/**
 * En qué punto de su respiración empieza cada ficha.
 *
 * Determinista a partir del id y no al azar, por dos motivos que no son el
 * mismo: al azar, la fase cambiaría en cada repintado de React y la ficha daría
 * un salto cada vez que cualquier otra cosa cambia; y siendo estable, dos
 * partidas iguales se ven iguales, que es lo que hace comparable una grabación
 * con la siguiente.
 *
 * @returns {number} Milisegundos dentro del ciclo, de 0 a `cycle`.
 */
export function idlePhase(id: string, cycle: number): number {
  // FNV-1a y luego la mezcla final de MurmurHash3, y las dos mitades hacen
  // falta. El hash de toda la vida —`h * 31 + carácter`— NO sirve aquí, y no es
  // teoría: los identificadores de este juego son "propio-1", "propio-2",
  // "propio-3", que solo se diferencian en el último carácter, así que sus
  // hashes salen consecutivos y sus fases a MILÉSIMAS de milisegundo unas de
  // otras. El resultado es exactamente el defecto que esta función existe para
  // evitar: tres fichas respirando a la vez. Lo que arregla eso es la mezcla de
  // abajo, que reparte por todo el rango dos entradas que se parecen.
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h ^= h >>> 15;
  h = Math.imul(h, 2246822507);
  h ^= h >>> 13;
  h = Math.imul(h, 3266489909);
  h ^= h >>> 16;
  return ((h >>> 0) / 4294967296) * cycle;
}

// --- La oferta --------------------------------------------------------------

/**
 * Lo que tarda un hexágono en acabar de levantarse. No es un dial: por debajo de
 * ~120 ms el relieve aparece de golpe y deja de leerse como que se ofrece, y por
 * encima la onda se solapa consigo misma. Lo que se ajusta es el retraso ENTRE
 * hexágonos (`offerRipple`), que es lo que hace la forma.
 */
export const OFFER_RISE_MS = 150;

/**
 * El presupuesto de la oferta: lo que se tarda en pasar de coger una ficha a
 * haber elegido a dónde va.
 *
 * Es una AFIRMACIÓN a comprobar, no una ley, y por eso está aquí con su número a
 * la vista en vez de escondida en un comentario. Si la oferta tarda más que
 * esto, el jugador ya ha empezado a mover la mano hacia un hexágono cuando el
 * tablero termina de decirle cuáles valen: la ayuda llega por detrás del gesto y
 * lo que se ve es un parpadeo.
 */
export const OFFER_BUDGET = 250;

/** Cuándo le toca levantarse a un hexágono que está a `steps` del origen. */
export function rippleDelay(steps: number, t: Timings): number {
  return Math.max(0, steps) * t.offerRipple;
}

/** Lo que tarda la oferta entera en estar puesta, contando la onda. */
export function offerDuration(maxSteps: number, t: Timings): number {
  return rippleDelay(maxSteps, t) + OFFER_RISE_MS;
}

// --- La cola ----------------------------------------------------------------

/**
 * Lo que el motor emite. No lleva píxeles ni curvas: dice QUÉ pasa y a quién,
 * y la pantalla decide cómo se ve.
 *
 * El ataque lleva su DESENLACE dentro, y ese es el detalle que hace que todo
 * esto funcione: la tirada la hace el motor una vez (combat.ts) y viaja en el
 * suceso. Si la pantalla tirase, un replay de la misma partida daría otro
 * resultado y el "un solo número explica todo lo que pasó" del §4.1 dejaría de
 * ser verdad. Lo que todavía no lleva —y llevará— es el daño, los estados que
 * aplica el crítico y quién muere por él.
 */
export type AnimEvent =
  | { readonly kind: "despliegue"; readonly id: string }
  | {
      /**
       * Andar (§5). Lleva los PASOS y no el destino porque lo que cuesta tiempo
       * es el camino, no la distancia: rodear a una ficha son más pasos para el
       * mismo hexágono, y esa diferencia es justo el peaje que el §5 quiere que
       * se note. Quien cuenta los pasos es movement.ts `pathTo`.
       */
      readonly kind: "paso";
      readonly id: string;
      readonly steps: number;
    }
  | {
      readonly kind: "ataque";
      readonly id: string;
      readonly target: string;
      /** Lo que decidió la tirada del §4.1. La pantalla no vuelve a tirar. */
      readonly result: AttackResult;
    }
  | { readonly kind: "muerte"; readonly id: string };

export type Beat = {
  readonly at: number;
  readonly duration: number;
  readonly event: AnimEvent;
};

/** Los tres tramos de un ataque, ya resueltos para su desenlace. */
export type AttackPhases = {
  /** La ida. Idéntica en los tres: es la que no puede delatar el resultado. */
  readonly lunge: number;
  /** El congelado del contacto. El fallo no tiene: no hay nada que congelar. */
  readonly stop: number;
  /** La vuelta, que es donde cada desenlace cobra o paga. */
  readonly back: number;
  readonly total: number;
};

/** Lo mínimo que puede durar una vuelta cuando `evenOut` le quita tiempo. */
const MIN_BACK = 60;

/**
 * Cuánto dura cada tramo de un ataque según cómo acabe.
 *
 * Esta es la función que decide de verdad cómo se sienten los tres desenlaces,
 * y está aquí y no en el componente porque se puede comprobar sin pantalla: que
 * la ida sea la misma en los tres es una PROPIEDAD, no un detalle de dibujo, y
 * es la que sostiene que el resultado no se pueda adivinar antes del contacto.
 */
export function attackPhases(result: AttackResult, t: Timings): AttackPhases {
  const lunge = t.lunge;
  const stop =
    result === "fallo" ? 0 : result === "critico" ? Math.round(t.hitStop * t.critStop) : t.hitStop;
  // El fallo no puede ganar contundencia con un congelado —no ha tocado nada—,
  // así que su peso está entero en volver despacio.
  let back = result === "fallo" ? Math.round(t.lungeBack * t.missRecovery) : t.lungeBack;

  if (t.evenOut) {
    // El listón es el IMPACTO y no el más largo de los tres: es el desenlace
    // mayoritario, y estirar los otros dos hasta el crítico haría que la ronda
    // entera fuese al ritmo de su caso más lento.
    const target = lunge + t.hitStop + t.lungeBack;
    back = Math.max(MIN_BACK, target - lunge - stop);
  }

  return { lunge, stop, back, total: lunge + stop + back };
}

/** Cuánto ocupa un suceso en la cola, de principio a fin. */
export function durationOf(event: AnimEvent, t: Timings): number {
  switch (event.kind) {
    case "despliegue":
      return t.flight + t.fall + t.squash;
    case "paso":
      return event.steps * t.step;
    case "ataque":
      return attackPhases(event.result, t).total;
    case "muerte":
      return t.death;
  }
}

/**
 * Pone hora a una lista de sucesos: uno detrás de otro, con un respiro entre
 * ellos.
 *
 * Se puede comprobar sin pantalla —"una ronda de 30 fichas atacando dura tanto"—
 * y esa es justo la pregunta que decide si el juego se puede mirar o hay que
 * meterle un botón de saltar animaciones. Con los valores de arriba, treinta
 * ataques seguidos son más de veinte segundos: la respuesta ya se ve venir, y
 * por eso `gap` existe y puede ser negativo (solapar).
 */
export function schedule(
  events: readonly AnimEvent[],
  t: Timings,
  gap = 60,
): Beat[] {
  let at = 0;
  const out: Beat[] = [];
  for (const event of events) {
    const duration = durationOf(event, t);
    out.push({ at, duration, event });
    at += duration + gap;
  }
  return out;
}

/** Lo que dura la cola entera. */
export function totalDuration(beats: readonly Beat[]): number {
  return beats.reduce((max, b) => Math.max(max, b.at + b.duration), 0);
}
