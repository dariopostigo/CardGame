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
// tablero buscando cuál está más oscura. Se comprueba apagando el dial — que hoy
// es el estado de partida: `TIMINGS.idleRise` viene a 0 a propósito y el dial de
// /dev/animacion es el único sitio donde se enciende.
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

  // EL ALIENTO ENTRA APAGADO, y vale para todo /dev: es el único bucle INFINITO
  // del proyecto y corre en todas las fichas puestas a la vez, así que mirando
  // cualquier otra cosa —una caída, una embestida, el polvo, el reparto de un
  // mazo— se cuela por debajo de lo que se está juzgando. Decidido el 11 de
  // septiembre de 2026, y por eso se apaga AQUÍ y no en cada pantalla: los dos
  // sitios que respiran leen este número.
  //
  // El valor queda escrito para no tener que volver a deducirlo: era 0.075,
  // tres píxeles en un hexágono de cuarenta y ni uno más, porque el aliento
  // tiene que estar por debajo de lo que se mira a propósito —si se ve
  // respirar, es un globo—. El ciclo se queda puesto por lo mismo: 2600 ms es
  // guardia, no jadeo, y cada ficha entra en su fase (`idlePhase`) porque
  // quince subiendo a la vez no son quince fichas vivas, es el tablero entero
  // bombeando. Se vuelve a encender con el dial de /dev/animacion, que es donde
  // vive el experimento; el día que se cierre, el número se escribe aquí.
  idleRise: 0,
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
 *
 * Y fuera queda la FAMILIA, que hasta el 11 de septiembre de 2026 era un campo
 * `group` aquí mismo. Quién enseña cada dial lo dice ahora `ANIMATIONS`, más
 * abajo: un dial se ve en la secuencia que lo mueve. Mantener las dos listas era
 * mantener dos taxonomías de lo mismo —una por parentesco y otra por la pregunta
 * que contesta cada secuencia— y la que sobraba era esta, porque un dial suelto
 * no se puede mirar y una animación sí.
 */
export type KnobId = Exclude<keyof Timings, "fallCurve" | "evenOut">;

export type Knob = {
  readonly id: KnobId;
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
    label: "Vuelo",
    min: 0,
    max: 700,
    step: 10,
    unit: "ms",
    help: "De la mano al aire sobre el hexágono. Es donde la carta se convierte en ficha: si va muy rápido, el cambio no se ve y la carta parece desaparecer.",
  },
  {
    id: "fall",
    label: "Caída",
    min: 40,
    max: 600,
    step: 10,
    unit: "ms",
    help: "El tramo final contra el suelo. Corto y acelerado se lee como peso; largo, como una pluma.",
  },
  {
    id: "hover",
    label: "Altura",
    min: 0,
    max: 220,
    step: 5,
    unit: "px",
    help: "Desde qué altura cae. Manda más que la duración: es lo que separa dejar una ficha de soltarla.",
  },
  {
    id: "squash",
    label: "Aplastado",
    min: 0,
    max: 260,
    step: 10,
    unit: "ms",
    help: "El achatarse y recuperarse al tocar. Por encima de 150 ms deja de ser un impacto y pasa a ser goma.",
  },
  {
    id: "squashAmount",
    label: "Cuánto aplasta",
    min: 0,
    max: 0.4,
    step: 0.01,
    unit: "",
    help: "0,18 significa 82 % de alto y 118 % de ancho en lo más hondo del golpe, al que se llega en los dos primeros fotogramas del aplastado. A 0 no hay squash y se nota lo muerto que queda.",
  },
  {
    id: "cardScale",
    label: "Tamaño de la carta",
    min: 1,
    max: 4,
    step: 0.1,
    unit: "×",
    help: "Cuántas veces la ficha mide la carta en la mano. Es cuánto tiene que encoger durante el vuelo.",
  },

  {
    id: "lunge",
    label: "Embestida",
    min: 60,
    max: 500,
    step: 10,
    unit: "ms",
    help: "La ida hacia el objetivo. Rápida: la intención de golpear no se delibera.",
  },
  {
    id: "lungeBack",
    label: "Vuelta",
    min: 60,
    max: 600,
    step: 10,
    unit: "ms",
    help: "El regreso a su hexágono. Más lenta que la ida, que es lo que hace que la ida parezca violenta.",
  },
  {
    id: "lungeDistance",
    label: "Recorrido",
    min: 0.1,
    max: 0.9,
    step: 0.02,
    unit: "",
    help: "Qué parte del camino hasta el objetivo recorre. Nunca 1: dos fichas no se pisan.",
  },
  {
    id: "hitStop",
    label: "Congelado",
    min: 0,
    max: 300,
    step: 10,
    unit: "ms",
    help: "Todo se para en el fotograma del contacto. Es el efecto más barato que existe y el que más pega da. Ponlo a 0 y vuelve a subirlo: la diferencia es toda la contundencia.",
  },
  {
    id: "flash",
    label: "Destello",
    min: 0,
    max: 400,
    step: 10,
    unit: "ms",
    help: "El blanco del que recibe. Es lo que dice CUÁL de las dos fichas se ha llevado el golpe.",
  },
  {
    id: "shake",
    label: "Temblor",
    min: 0,
    max: 16,
    step: 1,
    unit: "px",
    help: "Cuánto se mueve la cámara. Por encima de 8 px marea, y en un juego de tablero se nota más que en uno de acción.",
  },
  {
    id: "shakeTime",
    label: "Duración del temblor",
    min: 60,
    max: 600,
    step: 20,
    unit: "ms",
    help: "Un temblor largo es un terremoto; uno corto es un puñetazo.",
  },
  {
    id: "death",
    label: "Muerte",
    min: 150,
    max: 1200,
    step: 20,
    unit: "ms",
    help: "Lo que tarda en irse del tablero. Es de lo más largo que hay aquí a propósito: perder una ficha tiene que verse.",
  },

  {
    id: "missDodge",
    label: "Esquive",
    min: 0,
    max: 0.6,
    step: 0.02,
    unit: "hex",
    help: "Cuánto se aparta el objetivo cuando el golpe no entra. Es lo que dice que ha fallado por algo y no porque el juego se haya olvidado de pegar. A 0 el fallo se lee como un bug.",
  },
  {
    id: "missOvershoot",
    label: "Pasarse de largo",
    min: 1,
    max: 2,
    step: 0.05,
    unit: "×",
    help: "El atacante que falla se pasa del punto de contacto: se ha vaciado en un golpe que no estaba. Es la mitad de la lectura del fallo; la otra mitad es el esquive.",
  },
  {
    id: "missRecovery",
    label: "Recuperación",
    min: 1,
    max: 2.5,
    step: 0.05,
    unit: "×",
    help: "Cuánto más lenta es la vuelta tras fallar. Aquí es donde el fallo cobra su castigo: sin congelado no hay contundencia que ganar, así que lo que queda es volver pesado.",
  },
  {
    id: "critStop",
    label: "Congelado del crítico",
    min: 1,
    max: 5,
    step: 0.1,
    unit: "×",
    help: "En veces el congelado normal. Es el dial que más hace por que un crítico se sienta crítico, muy por encima del color del número.",
  },
  {
    id: "critShake",
    label: "Temblor del crítico",
    min: 1,
    max: 4,
    step: 0.1,
    unit: "×",
    help: "Ojo con este: el temblor es lo primero que marea, y un crítico pasa una de cada cuatro veces como mucho pero en una ronda de treinta son siete.",
  },
  {
    id: "critFlash",
    label: "Destello del crítico",
    min: 1,
    max: 3,
    step: 0.1,
    unit: "×",
    help: "El fogonazo del que recibe. Es lo único de los tres que sigue funcionando con movimiento reducido, así que es lo que carga con distinguir el crítico cuando no hay desplazamiento.",
  },

  {
    id: "idleRise",
    label: "Aliento",
    min: 0,
    max: 0.3,
    step: 0.005,
    unit: "hex",
    help: "Cuánto sube y baja una ficha parada, en fracción del hexágono. Ponlo a 0: el tablero no se queda quieto, se queda muerto. Y con él se va la lectura de lo ya andado, que es la ausencia de esto.",
  },
  {
    id: "idleCycle",
    label: "Ciclo del aliento",
    min: 600,
    max: 6000,
    step: 100,
    unit: "ms",
    help: "Lo que tarda una respiración entera. Corto es jadeo y llama la atención; largo es guardia. Cada ficha entra en su propia fase, o quince subiendo a la vez serían un tablero bombeando.",
  },
  {
    id: "spentSink",
    label: "Hundimiento",
    min: 0,
    max: 0.25,
    step: 0.005,
    unit: "hex",
    help: "Cuánto se acuclilla la que ya ha andado. Es el más flojo de los tres avisos y el que menos falta hace: quítalo y todavía se lee.",
  },
  {
    id: "spentFade",
    label: "Color perdido",
    min: 0,
    max: 1,
    step: 0.05,
    unit: "",
    help: "Cuánto se apaga. Ojo con subirlo: una ficha que ya ha andado TODAVÍA PUEDE ATACAR (§5), así que si se apaga del todo se lee como muerta y se deja de contar con ella.",
  },
  {
    id: "wakeStagger",
    label: "Escalón al despertar",
    min: 0,
    max: 300,
    step: 10,
    unit: "ms",
    help: "El retraso entre una ficha y la siguiente al empezar el turno. A 0 se levantan todas de golpe y parece un repintado; escalonadas es una cascada, y de paso enseña en pequeño lo que `schedule()` va a tener que aprender a hacer con los estados.",
  },

  {
    id: "offerRise",
    label: "Levantada del terreno",
    min: 0,
    max: 20,
    step: 1,
    unit: "px",
    help: "Cuánto se despega el hexágono ofrecido. Es lo que hace que el terreno se OFREZCA en vez de solo encenderse: un tinte se lee como decoración y un relieve se lee como una tecla.",
  },
  {
    id: "offerRipple",
    label: "Onda",
    min: 0,
    max: 120,
    step: 2,
    unit: "ms/hex",
    help: "Retraso por hexágono de distancia. A 0 se enciende todo a la vez y no se ve de dónde sale; alto, la onda es bonita y llega tarde. Es el dial que hay que vigilar contra el presupuesto de abajo.",
  },
  {
    id: "step",
    label: "Paso",
    min: 60,
    max: 600,
    step: 10,
    unit: "ms/hex",
    help: "Lo que cuesta pasar de un hexágono al siguiente. Multiplícalo por 👢 3 y por quince fichas: es el dial que decide si un turno enemigo se puede mirar.",
  },
  {
    id: "stepHop",
    label: "Saltito",
    min: 0,
    max: 40,
    step: 1,
    unit: "px",
    help: "Cuánto se despega del suelo en cada paso. A 0 la ficha se desliza, que es lo que hace una pieza de ajedrez arrastrada por el tablero; con salto, anda.",
  },

  {
    id: "dustCount",
    label: "Partículas",
    min: 0,
    max: 120,
    step: 1,
    unit: "",
    help: "Cuántas salen por reventón. Con 120 en el campo entero y quince fichas por bando ya son miles: el canvas aguanta, pero lo que se ve deja de ser polvo y pasa a ser niebla.",
  },
  {
    id: "dustSpeed",
    label: "Velocidad",
    min: 10,
    max: 400,
    step: 10,
    unit: "px/s",
    help: "Con qué fuerza salen despedidas. Es lo que separa el polvo que levanta un pie del que levanta una roca.",
  },
  {
    id: "dustLife",
    label: "Vida",
    min: 100,
    max: 2000,
    step: 20,
    unit: "ms",
    help: "Cuánto tardan en desvanecerse. Largo se lee como polvo fino en suspensión; corto, como tierra que vuelve al suelo.",
  },
  {
    id: "dustSize",
    label: "Tamaño",
    min: 2,
    max: 40,
    step: 1,
    unit: "px",
    help: "El radio inicial. Cada partícula crece mientras vive, así que esto es de dónde parte.",
  },
  {
    id: "dustGravity",
    label: "Gravedad",
    min: -200,
    max: 400,
    step: 10,
    unit: "px/s²",
    help: "Positivo cae —tierra, cascotes—; negativo sube, que es lo que hace el polvo fino y el humo. Por defecto está en negativo: es una nube, no una salpicadura.",
  },
  {
    id: "dustDrag",
    label: "Rozamiento",
    min: 0,
    max: 8,
    step: 0.2,
    unit: "",
    help: "Cuánta velocidad pierde por segundo. Es lo que hace que el reventón se abra de golpe y luego se quede quieto flotando, en vez de irse recto.",
  },
];

// --- El catálogo de secuencias ----------------------------------------------
//
// QUÉ ANIMACIONES EXISTEN, y de qué diales cuelga cada una. Es la lista que
// faltaba: `KNOBS` agrupa los mandos por FAMILIA —«impacto» mete en la misma
// caja la embestida, el contacto y la muerte, que son tres secuencias
// distintas—, y eso vale para una caja de sliders pero no para contestar «quiero
// mirar solo la caída». De aquí salen los bancos por animación del catálogo de
// /dev/animacion, los diales que enseña cada uno y el índice.
//
// NO SUSTITUYE AL BANCO GRANDE y esto es lo que hay que no olvidar al leer esta
// lista: aislada, cada secuencia parece bien. Lo que no se ve de una en una es
// la MEZCLA, y la mezcla es donde están las dos cosas que esta pantalla
// descubrió — que lo gastado se lee por AUSENCIA del aliento (y una ausencia
// solo se ve si lo demás está presente), y que el ritmo de una tanda de doce no
// se juzga mirando un ataque. El preview afina UNA propiedad; el banco juzga el
// conjunto. Hacen falta los dos.

/** Qué tiene que haber en el retal para poder ver una secuencia. */
export type Scene =
  /** Una carta en la mano y sitio donde soltarla. */
  | "carta"
  /** Una ficha puesta, y nada más. */
  | "ficha"
  /** Dos: quien pega y quien recibe. */
  | "duelo"
  /** Una ficha y sitio para andar. */
  | "camino";

export type AnimationId =
  | "despliegue"
  | "oferta"
  | "paso"
  | "aliento"
  | "gastado"
  | "embestida"
  | "desenlace"
  | "muerte"
  | "polvo";

export type AnimationSpec = {
  readonly id: AnimationId;
  readonly label: string;
  /** La pregunta que contesta mirarla. Una sola, y por eso se puede aislar. */
  readonly question: string;
  readonly scene: Scene;
  /** Los diales que la mueven. El orden es el de mirarlos, no el de `KNOBS`. */
  readonly knobs: readonly KnobId[];
  /** Si además hay que elegir la curva de caída (no es un número en una escala). */
  readonly curve?: boolean;
  /** Lo que hay que hacer con ella para que enseñe lo que tiene que enseñar. */
  readonly try: string;
};

export const ANIMATIONS: readonly AnimationSpec[] = [
  {
    id: "despliegue",
    label: "Soltar la carta",
    question: "¿Pesa lo que cae?",
    scene: "carta",
    knobs: ["flight", "fall", "hover", "squash", "squashAmount", "cardScale"],
    curve: true,
    try: "Pon la curva en «Suave» —la que usa hoy todo el proyecto— y compárala con «Peso». La suave frena al llegar, así que la ficha no cae: se posa. Luego sube la ALTURA a 200 px sin tocar la duración: la caída dura lo mismo y pesa el doble, porque lo que pesa es el recorrido y no el reloj.",
  },
  {
    id: "oferta",
    label: "Ofrecer el terreno",
    question: "¿Llega la ayuda antes que la decisión?",
    scene: "camino",
    knobs: ["offerRise", "offerRipple"],
    try: "Pon la onda a 0 y vuelve a subirla. A 0 se enciende todo a la vez y no se ve de dónde sale; alta, la onda es bonita y llega tarde. El presupuesto son 250 ms —lo que se tarda en pasar de coger una ficha a haber elegido a dónde va— y está medido abajo.",
  },
  {
    id: "paso",
    label: "Andar",
    question: "¿Anda, o se desliza?",
    scene: "camino",
    knobs: ["step", "stepHop"],
    try: "Baja el SALTITO a 0: la ficha se desliza, que es lo que hace una pieza de ajedrez arrastrada por el tablero. Y multiplica el PASO por 👢 3 y por quince fichas antes de subirlo: es el dial que decide si un turno enemigo se puede mirar.",
  },
  {
    id: "aliento",
    label: "Respirar",
    question: "¿Está viva la mesa cuando no pasa nada?",
    scene: "ficha",
    knobs: ["idleRise", "idleCycle"],
    try: "Viene a 0, que es el estado de partida de todo /dev: es el único bucle que no para nunca y con él puesto se cuela por debajo de cualquier otra cosa que estés juzgando. Súbelo aquí. El valor que tenía era 0,075 —tres píxeles en un hexágono de cuarenta— porque el aliento tiene que estar por debajo de lo que se mira a propósito: si se ve respirar, es un globo.",
  },
  {
    id: "gastado",
    label: "Ya ha andado",
    question: "¿Se distingue la que ya se movió?",
    scene: "ficha",
    knobs: ["spentSink", "spentFade", "wakeStagger", "idleRise"],
    try: "Con el ALIENTO puesto, la gastada es la única que no respira y se encuentra sola. Bájalo a 0 y búscala otra vez: sigue hundida y sigue apagada, y aun así hay que recorrer el tablero mirando fichas de una en una. Esa es toda la diferencia entre las dos animaciones más baratas del catálogo, y es la razón de que estas dos no se puedan juzgar por separado.",
  },
  {
    id: "embestida",
    label: "Golpear",
    question: "¿Pega, o se acerca?",
    scene: "duelo",
    knobs: ["lunge", "lungeBack", "lungeDistance", "hitStop", "flash", "shake", "shakeTime"],
    try: "Suéltalo con el CONGELADO a 0 y luego a 70 ms. Es el mismo golpe, y no lo parece: es el efecto más barato del catálogo y el que más contundencia da.",
  },
  {
    id: "desenlace",
    label: "Fallar y criticar",
    question: "¿Se distinguen los tres sin leer el texto?",
    scene: "duelo",
    knobs: ["missDodge", "missOvershoot", "missRecovery", "critStop", "critShake", "critFlash"],
    try: "Encadena los tres. Los primeros milisegundos son idénticos y TIENEN que serlo: sin dados en pantalla, si el fallo se notara en la embestida el resultado se leería en el gesto. Todo lo que cambia empieza en el contacto.",
  },
  {
    id: "muerte",
    label: "Caer",
    question: "¿Se lee como una baja o como un fallo de la pantalla?",
    scene: "duelo",
    knobs: ["death"],
    try: "Es de lo más largo del catálogo a propósito: perder una ficha tiene que verse. Lo que no puede ser es un fundido — tiene que pasar algo violento primero y tiene que quedar algo después.",
  },
  {
    id: "polvo",
    label: "El polvo",
    question: "¿Es tierra o es niebla?",
    scene: "carta",
    knobs: ["dustCount", "dustSpeed", "dustLife", "dustSize", "dustGravity", "dustDrag"],
    try: "Los mandos son los del reventón al aterrizar; el del golpe, el del crítico y el de la muerte se derivan de él para que no se desafinen entre sí. Con 120 partículas en el campo entero y quince fichas por bando ya son miles: el lienzo aguanta, pero lo que se ve deja de ser polvo.",
  },
];

/** Los diales de una secuencia, ya resueltos contra `KNOBS`. */
export function knobsOf(id: AnimationId): readonly Knob[] {
  const spec = ANIMATIONS.find((a) => a.id === id);
  if (!spec) return [];
  return spec.knobs
    .map((k) => KNOBS.find((knob) => knob.id === k))
    .filter((k): k is Knob => k !== undefined);
}

// --- Otras animaciones: las que todavía no existen ---------------------------

/**
 * Si una animación se puede hacer con lo que hay montado, y a qué precio.
 *
 * No es una prioridad ni una estimación: es una RESPUESTA TÉCNICA, y por eso
 * vive en el código y no en un documento. El día que el emisor de partículas
 * gane algo, o que el tablero deje de ser SVG, lo que cambia son estos
 * veredictos —y cambiarlos aquí es cambiarlos en la pantalla que los enseña—.
 */
export type Feasibility =
  /** La infraestructura ya está puesta: es rellenar datos o componer lo que hay. */
  | "listo"
  /** Código nuevo, pero nada que inventar y nada que pueda salir mal. */
  | "directo"
  /** Se puede, pero pide un dato que hoy no viaja, o tiene un coste que respetar. */
  | "condicion"
  /** No con este tablero: pediría WebGL o fotogramas dibujados a mano. */
  | "no";

export const FEASIBILITY_LABEL: Record<Feasibility, string> = {
  listo: "Ya está lo que hace falta",
  directo: "Directo",
  condicion: "Con condición",
  no: "No con este tablero",
};

/**
 * Se agrupan por LO QUE SE VE, no por el sistema que las mueve: la pregunta que
 * contesta esta lista es «¿cuál hacemos ahora?», y esa se contesta mirando el
 * tablero, no el código.
 */
export type BacklogFamily =
  | "polvo"
  | "impacto"
  | "muerte"
  | "estados"
  | "ataque"
  | "camara"
  | "carta";

export const BACKLOG_FAMILIES: readonly {
  readonly id: BacklogFamily;
  readonly label: string;
  readonly note: string;
}[] = [
  {
    id: "polvo",
    label: "Polvo y partículas",
    note: "El emisor ya existe y acepta un `DustSpec` distinto en cada reventón, con la física guardada en la partícula y no en el emisor: por eso conviven nubes con gravedades opuestas y por eso esta familia entera es rellenar datos.",
  },
  {
    id: "impacto",
    label: "El golpe",
    note: "Lo que pasa entre que una ficha pega y la otra lo acusa. Es donde el catálogo ya tiene más puesto —congelado, destello, temblor— y donde lo que falta se nota más.",
  },
  {
    id: "muerte",
    label: "La muerte",
    note: "Siete formas de caer, y ninguna se puede elegir mientras el suceso no diga de qué murió.",
  },
  {
    id: "estados",
    label: "Los estados",
    note: "La familia a la que hay que tenerle respeto: no son golpes, son BUCLES que viven mientras dure el estado, siguen a la ficha cuando embiste y pueden coincidir diez a la vez. Lo que aquí se elija mal se paga treinta veces.",
  },
  {
    id: "ataque",
    label: "El ataque, según el tipo de daño",
    note: "Hoy la única animación de ataque es una embestida, que es literalmente acercarse: describe a 70 fichas de 132. Las otras 62 —21 🏹 y 41 ✨— no se acercan.",
  },
  {
    id: "camara",
    label: "La cámara y el tablero",
    note: "Todo lo que no es una ficha. Hoy no existe ningún verbo de cámara: se mueven las fichas y nada más, así que es donde más se gana por menos código.",
  },
  {
    id: "carta",
    label: "La carta y el mazo",
    note: "La otra mitad de la pantalla. Es la única familia que no se dibuja en SVG —la carta es DOM— y eso cambia cómo se hacen algunas cosas, no si se pueden.",
  },
];

export type BacklogEntry = {
  /** Corto y estable, para poder decir «hazme la C1» y que no haga falta nada más. */
  readonly id: string;
  readonly family: BacklogFamily;
  readonly label: string;
  readonly feasibility: Feasibility;
  /** Qué la hace fácil, o qué le falta. Una línea: la lista se lee de un vistazo. */
  readonly note: string;
  /** Las que salieron de Dario. Una lista de ideas sin dueño se discute peor. */
  readonly asked?: boolean;
};

/**
 * LO QUE TODAVÍA NO EXISTE.
 *
 * `ANIMATIONS` son las nueve que hay; esta es la lista de las que no, y están
 * en el mismo archivo a propósito: el día que una se construye se borra su fila
 * de aquí y se escribe su `AnimationSpec` ahí arriba, en el mismo diff. Así no
 * hay forma de que una animación exista en dos sitios, ni de que la lista de
 * pendientes se quede mintiendo — que es exactamente lo que le pasó a la caja
 * de «Todos los diales» antes de borrarla.
 *
 * Lo que esta lista NO es: un orden de trabajo ni una estimación. Es un
 * catálogo de ideas con una respuesta técnica pegada, para que elegir la
 * siguiente sea mirar y no investigar.
 *
 * DOS COSAS BLOQUEAN FAMILIAS ENTERAS y no animaciones sueltas, así que no son
 * filas: el suceso `muerte` solo lleva `id` —sin saber qué la mató, las siete
 * muertes no se pueden repartir— y el daño se calcula en `resolveHit` y se tira
 * en `toAnimEvents`. Las dos se arreglan añadiendo un campo, no rediseñando.
 */
export const BACKLOG: readonly BacklogEntry[] = [
  // --- Polvo -------------------------------------------------------------
  {
    id: "A1",
    family: "polvo",
    label: "Distintos tipos de polvo",
    feasibility: "listo",
    asked: true,
    note: "Un `DustSpec` por tipo, que son diez campos. El emisor ya acepta uno distinto en cada reventón.",
  },
  {
    id: "A2",
    family: "polvo",
    label: "Ceniza que cae",
    feasibility: "listo",
    note: "La muerte por 🔥: gravedad positiva y sin luz añadida, que es justo lo contrario del polvo del aterrizaje.",
  },
  {
    id: "A3",
    family: "polvo",
    label: "Vaho frío",
    feasibility: "listo",
    note: "🧊: lenta, sin gravedad y con mucho rozamiento, para que se quede flotando.",
  },
  {
    id: "A4",
    family: "polvo",
    label: "Burbujas de veneno",
    feasibility: "listo",
    note: "☠️: pocas, grandes y subiendo. El veneno se distingue por durar, así que su nube tiene que durar.",
  },
  {
    id: "A5",
    family: "polvo",
    label: "Salpicadura de agua",
    feasibility: "condicion",
    asked: true,
    note: "El reventón es de los fáciles; lo que no existe es la casilla de agua. `arena.ts` dice que se juega a campo abierto: ni terreno, ni obstáculos, ni cobertura.",
  },
  {
    id: "A6",
    family: "polvo",
    label: "Briznas al andar",
    feasibility: "listo",
    note: "Un reventón pequeño en cada `paso`. Ojo con el caso peor: quince fichas andando son quince reventones por hexágono recorrido.",
  },
  {
    id: "A7",
    family: "polvo",
    label: "Chispazo al rebotar en mucha 🛡️",
    feasibility: "condicion",
    note: "El mismo golpe hace menos daño contra mucha Defensa, y hoy eso no se ve. Pide que la mitigación suba al suceso.",
  },

  // --- El golpe ----------------------------------------------------------
  {
    id: "B1",
    family: "impacto",
    label: "Explosión al pegar",
    feasibility: "directo",
    asked: true,
    note: "El reventón de chispas ya está; lo que falta es la onda de choque y el humo que viene detrás. El congelado ya sabe esperar a que la corona esté abierta.",
  },
  {
    id: "B2",
    family: "impacto",
    label: "Onda de choque",
    feasibility: "directo",
    note: "Una sola forma que escala y se desvanece. No es polvo: no van al lienzo de partículas, va en el SVG.",
  },
  {
    id: "B3",
    family: "impacto",
    label: "El número de daño",
    feasibility: "condicion",
    note: "`resolveHit` lo calcula ya, con la mitigación aplicada, y `toAnimEvents` lo tira. Es el único que puede contar que el mismo golpe duele distinto según a quién.",
  },
  {
    id: "B4",
    family: "impacto",
    label: "Rechazo del golpeado",
    feasibility: "directo",
    note: "Media casilla hacia atrás y vuelta. Es la mitad del golpe que hoy no existe: solo se mueve quien pega.",
  },
  {
    id: "B5",
    family: "impacto",
    label: "El tajo del arma",
    feasibility: "directo",
    note: "Un trazo que se dibuja solo y se borra. En SVG es un `stroke-dasharray` animado, sin nada más.",
  },
  {
    id: "B6",
    family: "impacto",
    label: "Líneas de velocidad en la embestida",
    feasibility: "directo",
    note: "El truco más viejo del dibujo animado y el más barato de todos: unas rayas detrás del que se lanza.",
  },
  {
    id: "B7",
    family: "impacto",
    label: "La grieta que queda en el suelo",
    feasibility: "directo",
    note: "Solo del crítico. Se pinta en el suelo y se borra sola: sería lo único que sobrevive al golpe que lo hizo.",
  },
  {
    id: "B8",
    family: "impacto",
    label: "El golpeado parpadea en rojo",
    feasibility: "listo",
    note: "Es el dial `flash` aplicado al que RECIBE en vez de al que pega. Cero código nuevo, otro nodo.",
  },
  {
    id: "B9",
    family: "impacto",
    label: "La ❤️ Vida bajando, con su fantasma detrás",
    feasibility: "directo",
    note: "La barra ya se pinta (`PieceLifeBar`). Lo que falta es que tarde en bajar y que una segunda capa la persiga.",
  },
  {
    id: "B10",
    family: "impacto",
    label: "Explosión con volumen y humo iluminado",
    feasibility: "no",
    note: "Pide una capa de WebGL. `three` está instalado y el lab de dados de v2 prueba que el patrón funciona, pero eso es otro tablero y no un efecto encima de este.",
  },

  // --- La muerte ---------------------------------------------------------
  {
    id: "C1",
    family: "muerte",
    label: "Explotar en cascotes",
    feasibility: "directo",
    asked: true,
    note: "La ficha ya se dibuja como un retrato recortado por un `clipPath`; un cascote es ese mismo recorte doce veces, cada uno con su giro. Doce nodos durante medio segundo y solo cuando alguien muere.",
  },
  {
    id: "C2",
    family: "muerte",
    label: "Derretirse",
    feasibility: "directo",
    asked: true,
    note: "Con una máscara que baja es directo. Con deformación de verdad (`feDisplacementMap`) es un filtro SVG, y un filtro solo vale para lo que pasa de una en una: una muerte sí, diez a la vez no.",
  },
  {
    id: "C3",
    family: "muerte",
    label: "Deshacerse en ceniza de abajo arriba",
    feasibility: "directo",
    note: "La misma máscara que el derretido, al revés y con A2 saliendo por el borde que se come.",
  },
  {
    id: "C4",
    family: "muerte",
    label: "Desinflarse",
    feasibility: "directo",
    note: "☠️: escala no uniforme y sin girar. La muerte del que llevaba cinco turnos muriéndose.",
  },
  {
    id: "C5",
    family: "muerte",
    label: "Hundirse en el suelo",
    feasibility: "directo",
    note: "`spentSink` ya hunde una ficha que ha andado; esta es la misma idea llevada hasta el final.",
  },
  {
    id: "C6",
    family: "muerte",
    label: "Congelarse y hacerse añicos",
    feasibility: "directo",
    note: "Los cascotes de C1 en otro color y sin giro: el hielo no vuela, se desmorona.",
  },
  {
    id: "C7",
    family: "muerte",
    label: "Volarse en pedazos de papel",
    feasibility: "directo",
    note: "C1 con más trozos, más planos y más flotación. Es la muerte que recuerda que esto son cartas.",
  },
  {
    id: "C8",
    family: "muerte",
    label: "La luz de su casilla apagándose",
    feasibility: "directo",
    note: "La casilla iluminada ya se pinta y ya viaja con la ficha; solo hay que apagarla cuando la ficha se va, en vez de que desaparezca con ella.",
  },
  {
    id: "C9",
    family: "muerte",
    label: "Elegir la muerte según lo que la mató",
    feasibility: "condicion",
    note: "El suceso `muerte` lleva `{ id }` y nada más. Sin saber qué la mató —🔥 ceniza, 🧊 añicos, ☠️ desinflarse— las siete de arriba no se pueden repartir y todas tienen que ser la misma.",
  },

  // --- Los estados -------------------------------------------------------
  {
    id: "D1",
    family: "estados",
    label: "Llamita sobre la ficha",
    feasibility: "condicion",
    note: "Con partículas, diez a la vez no cuestan nada. Con un filtro SVG, diez a la vez tumban los 60 fps. La condición es elegir bien, no que no se pueda.",
  },
  {
    id: "D2",
    family: "estados",
    label: "Escarcha creciendo por el borde",
    feasibility: "directo",
    note: "Un trazo que se dibuja sobre el contorno del hexágono. Se queda mientras dure y se retira cuando se cae.",
  },
  {
    id: "D3",
    family: "estados",
    label: "Las tres pilas de 🧊",
    feasibility: "directo",
    note: "Congelación es la única que acumula, y a pila llena no actúa: la escalera 1-2-3 tiene que verse llegar.",
  },
  {
    id: "D4",
    family: "estados",
    label: "El tic de daño, en cascada",
    feasibility: "listo",
    note: "`Batch` y `stagger` ya existen en la cola y no los usa nadie. El escalón pequeño es lo que separa una cascada de un fallo de pintado.",
  },
  {
    id: "D5",
    family: "estados",
    label: "Aura de 🌀 Confusión",
    feasibility: "directo",
    note: "Y con ella la animación que tiene que decir «esto era el plan y no ha pasado»: mirar al objetivo elegido y girarse a otro.",
  },
  {
    id: "D6",
    family: "estados",
    label: "😵 Aturdido dando vueltas",
    feasibility: "condicion",
    note: "Lo que falta es el dibujo, no el código: los pictogramas de estado son iconografía y viven en `knowledge/v3/icon-concept/`.",
  },
  {
    id: "D7",
    family: "estados",
    label: "🌑 Ceguera: la ficha apagada",
    feasibility: "directo",
    note: "Bajar el color de una ficha ya se hace para la que ya ha andado (`spentFade`); aquí es lo mismo con otra intención.",
  },
  {
    id: "D8",
    family: "estados",
    label: "🕸️ Inmovilizada: raíces o anclas",
    feasibility: "condicion",
    note: "Igual que el Aturdido: pide dibujo. Y es la única que clava a alguien en el sitio, así que merece leerse de lejos.",
  },
  {
    id: "D9",
    family: "estados",
    label: "El estado que se cae por 🍀",
    feasibility: "directo",
    note: "La tirada oculta del final del turno es la única buena noticia del sistema de estados y hoy no tiene imagen.",
  },
  {
    id: "D10",
    family: "estados",
    label: "Fuego de verdad lamiendo la ficha",
    feasibility: "no",
    note: "Shader. Lo procedural llega a una llamita convincente; a esto, no.",
  },

  // --- El ataque ---------------------------------------------------------
  {
    id: "E1",
    family: "ataque",
    label: "Proyectil con arco 🏹",
    feasibility: "directo",
    note: "21 fichas. Rompe el reparto ida/congelado/vuelta, porque un arquero no tiene ida: pide su propio reparto —salida, vuelo, impacto— donde lo que es idéntico en los tres desenlaces pasa a ser el VUELO.",
  },
  {
    id: "E2",
    family: "ataque",
    label: "Estela del proyectil",
    feasibility: "listo",
    note: "Emitir polvo a lo largo del vuelo. Es el emisor de siempre, movido.",
  },
  {
    id: "E3",
    family: "ataque",
    label: "Círculo mágico bajo la ficha ✨",
    feasibility: "directo",
    note: "41 fichas, que son casi un tercio del catálogo. Y es la que mejor dice «esto no es un arma» sin escribirlo.",
  },
  {
    id: "E4",
    family: "ataque",
    label: "Rayo que serpentea",
    feasibility: "directo",
    note: "Un trazo generado que se redibuja cada fotograma. Va en el SVG y no cuesta nada mientras sea uno.",
  },
  {
    id: "E5",
    family: "ataque",
    label: "El impacto, lejos de quien tiró",
    feasibility: "directo",
    note: "El congelado tiene que caer cuando el tiro LLEGA, no cuando sale. Es lo que hace que un disparo se sienta como un golpe.",
  },
  {
    id: "E6",
    family: "ataque",
    label: "Fichas que andan con las piernas y pegan con los brazos",
    feasibility: "no",
    note: "Son fotogramas dibujados y no hay pipeline de arte animado: ni formato, ni carpeta, ni quien los dibuje. Este es el techo de verdad, y no se sube programando.",
  },

  // --- Cámara y tablero --------------------------------------------------
  {
    id: "F1",
    family: "camara",
    label: "Empujón de cámara en el crítico",
    feasibility: "condicion",
    note: "Un 2-3 % durante el congelado. Probablemente lo más vistoso por línea de código de toda la lista; la condición es que componga con el zoom del tablero en vez de pelearse con él.",
  },
  {
    id: "F2",
    family: "camara",
    label: "Sacudida de cámara en la muerte",
    feasibility: "condicion",
    note: "Lo mismo que el empujón, y con el mismo cuidado. Hoy el temblor es de la ficha golpeada, no de la pantalla.",
  },
  {
    id: "F3",
    family: "camara",
    label: "Foco: todo oscuro menos los dos del duelo",
    feasibility: "directo",
    note: "Un rectángulo con una máscara que abre dos huecos. Quieto durante el golpe, así que no cuesta nada.",
  },
  {
    id: "F4",
    family: "camara",
    label: "Ralentí en el golpe mortal",
    feasibility: "directo",
    note: "Es multiplicar los tiempos, y aquí ya está todo en milisegundos y en un solo sitio.",
  },
  {
    id: "F5",
    family: "camara",
    label: "El hexágono del objetivo, marcado antes del golpe",
    feasibility: "directo",
    note: "La oferta ya sabe encender casillas con una onda; esto es la misma herramienta contestando otra pregunta.",
  },
  {
    id: "F6",
    family: "camara",
    label: "La estela del camino andado",
    feasibility: "directo",
    note: "Para poder mirar un turno enemigo de quince fichas y saber por dónde ha pasado cada una.",
  },

  // --- La carta ----------------------------------------------------------
  {
    id: "G1",
    family: "carta",
    label: "La carta se consume al desplegar",
    feasibility: "directo",
    note: "La carta es DOM y no SVG, pero `clip-path: polygon()` la trocea igual de bien sobre copias absolutas.",
  },
  {
    id: "G2",
    family: "carta",
    label: "Barrido de luz por el marco según Rareza",
    feasibility: "directo",
    note: "El raíl de color por Rareza ya existe y es el mismo del que se sirve la ficha. Aquí solo se mueve.",
  },
  {
    id: "G3",
    family: "carta",
    label: "Robar del mazo",
    feasibility: "directo",
    note: "El lab de v2 ya reparte cartas escalonadas; lo que falta es la mano de V3 recolocándose al recibirla.",
  },
  {
    id: "G4",
    family: "carta",
    label: "Temblor de negación al no poder jugarla",
    feasibility: "directo",
    note: "La respuesta a una acción imposible. Sin ella, soltar una carta donde no cabe no dice nada.",
  },
];

/** Las entradas de una familia, en el orden en el que están escritas. */
export function backlogOf(family: BacklogFamily): readonly BacklogEntry[] {
  return BACKLOG.filter((entry) => entry.family === family);
}

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
 * Varios sucesos que empiezan casi a la vez, no uno detrás de otro.
 *
 * Es el caso que una cola estrictamente secuencial no sabe decir: el tic de
 * estados al empezar el turno son diez fichas por tres estados, y en fila eso
 * es una eternidad. `stagger` es el escalón entre uno y el siguiente —a 0
 * son exactamente a la vez, y eso se lee como un fallo de pintado; con un
 * escalón pequeño (60 ms, como `wakeStagger`) se lee como una cascada—. Lo que
 * viene después del lote espera a que **termine el último**, no al que menos
 * tarde.
 */
export type Batch = { readonly events: readonly AnimEvent[]; readonly stagger?: number };

/** Lo que puede llevar la cola: un suceso solo, o un lote en paralelo. */
export type Cue = AnimEvent | Batch;

function isBatch(cue: Cue): cue is Batch {
  return "events" in cue;
}

/**
 * Pone hora a una lista de sucesos: uno detrás de otro, con un respiro entre
 * ellos — salvo los que llegan como `Batch`, que se reparten en paralelo entre
 * sí y solo entonces le ceden el turno al siguiente.
 *
 * Se puede comprobar sin pantalla —"una ronda de 30 fichas atacando dura tanto"—
 * y esa es justo la pregunta que decide si el juego se puede mirar o hay que
 * meterle un botón de saltar animaciones. Con los valores de arriba, treinta
 * ataques seguidos son más de veinte segundos: la respuesta ya se ve venir, y
 * por eso `gap` existe y puede ser negativo (solapar).
 */
export function schedule(
  cues: readonly Cue[],
  t: Timings,
  gap = 60,
): Beat[] {
  let at = 0;
  const out: Beat[] = [];
  for (const cue of cues) {
    if (isBatch(cue)) {
      const stagger = cue.stagger ?? 0;
      let batchEnd = at;
      cue.events.forEach((event, i) => {
        const start = at + i * stagger;
        const duration = durationOf(event, t);
        out.push({ at: start, duration, event });
        batchEnd = Math.max(batchEnd, start + duration);
      });
      at = batchEnd + gap;
    } else {
      const duration = durationOf(cue, t);
      out.push({ at, duration, event: cue });
      at += duration + gap;
    }
  }
  return out;
}

/** Lo que dura la cola entera. */
export function totalDuration(beats: readonly Beat[]): number {
  return beats.reduce((max, b) => Math.max(max, b.at + b.duration), 0);
}
