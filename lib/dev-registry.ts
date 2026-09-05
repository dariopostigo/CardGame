// =========================================================================
// Registro de módulos de /dev — la construcción de V3
//
// Espejo de lib/lab-registry.ts, que hace lo mismo para los laboratorios del
// motor v2. Misma mecánica: de aquí comen el hub (app/dev) y el menú lateral,
// y añadir un módulo son dos pasos —una entrada aquí y su página en
// app/dev/<slug>/.
//
// LA DEPENDENCIA ESTÁ EN LOS DATOS, y esta es la diferencia con /lab. Hasta el
// 1 de septiembre de 2026 esta lista decía de sí misma «el orden es el de
// dependencia», pero eso era una frase en un comentario: nada la comprobaba y
// nada la enseñaba. El hub, además, partía la lista en dos rejillas por estado,
// así que el último eslabón de la cadena —la Animación— salía arriba del todo,
// y las dos entradas construidas «rompían el orden a propósito». Un orden que
// se rompe a propósito dos veces de siete no es un orden.
//
// Ahora cada módulo declara `needs`, con el slug de quien le hace falta y QUÉ
// le pide. De ahí sale la ordenación, el «depende de» de cada tarjeta y la
// comprobación de que la lista sigue siendo topológica (`dependencyProblems`,
// que el hub pinta en rojo si algo se tuerce). El orden manda sobre el estado:
// se lee de arriba abajo y se ve dónde estás, aunque eso entierre lo construido
// entre lo planificado.
//
// EL SUSTITUTO ES LA PIEZA CLAVE. Un módulo se puede construir antes que sus
// dependencias si se inventa un remiendo en su lugar —la Animación lo hizo con
// tres: un retal de hexágonos, un rectángulo por carta y discos por fichas—, y
// eso no está mal: es lo que ha permitido medir la caída sin esperar a que
// existan las 132 fichas. Lo que estaba mal es que la deuda viviera en un
// comentario de un componente. `standIn` la pone en el mapa: la tarjeta dice
// qué usa hoy en lugar de qué, así que se ve de un vistazo lo que hay que
// volver a tocar cuando el acreedor exista.
//
// El MARCO tiene el suyo desde el 1 de septiembre de 2026, y es el más caro de
// todos porque no es un dibujo de relleno sino un VOCABULARIO paralelo:
// `components/design/v3/sample.ts` y `races.ts` llevan escritas sus propias 8
// Habilidades, su propio tipo de daño, su propio `Trait` y sesenta fichas a mano
// con los números inventados. Es lo que había que hacer —el marco necesitaba
// sujetos meses antes de que hubiera anatomía— y su cabecera avisa de lo que es;
// pero desde que existe `lib/v3/character.ts` son dos definiciones de lo mismo,
// que es el error que este proyecto ya ha pagado dos veces (las 97 cartas
// copiadas de v2 y las tres entradas para «resistencia mágica»).
//
// Y ese sustituto ya lo piden DOS módulos: la FICHA también tira de esos 48
// sujetos, porque para dibujar un medallón hace falta un retrato y un nombre, y
// eso no lo da la anatomía —lo dará el «Catálogo de cartas»—. Que dos acreedores
// distintos apunten al mismo remiendo no lo empeora: lo hace más barato de
// pagar, porque los dos se arreglan con el mismo módulo.
//
// «FICHA» ERA DOS MÓDULOS A LA VEZ, y por eso el 1 cambió de nombre el 1 de
// septiembre de 2026. Se llamaba «Ficha de personaje» y el 5 «Diseño de ficha»,
// y no son la misma cosa ni de lejos: uno es la HOJA DE DATOS —las 8 Habilidades
// en su escala— y el otro el DISCO que se pone en el hexágono. El nombre estaba
// además en el sitio equivocado: docs/v2/board/board-map.md §4c ya llamaba
// «Ficha de personaje» al disco, «quien anda por el tablero», y el glosario de
// V3 usa «ficha» en los dos sentidos en la misma tabla (glossary.md, filas de
// «Personaje» y de «Bando»). Se resuelve como se resolvió «Habilidad» el 24 de
// agosto: la palabra se queda con un solo dueño —FICHA es la pieza del tablero,
// el módulo 5— y el 1 se llama por lo que lleva dentro, ESTADÍSTICAS.
//
// TRES MÓDULOS NO DEPENDEN DE NADIE, y ninguno «rompe el orden»: el orden dice
// que dos no tienen aristas y el tercero las tiene todas remendadas.
//   · El TABLERO (27 de agosto de 2026), porque la arena es geometría y se puede
//     medir sin una sola ficha.
//   · La ANIMACIÓN (31 de agosto), porque una caída no necesita saber cuánto
//     pega la ficha que cae.
//   · Las ESTADÍSTICAS DE PERSONAJE (1 de septiembre), que son la raíz de todo lo
//     demás y arrancaron las últimas de las tres por un motivo que resultó ser
//     falso: se daban por bloqueadas esperando las siete cifras que faltan. Lo
//     que esperaba las cifras era el MOTOR; la anatomía —la escala, los topes, la
//     curva del tier y el catálogo de Características— estaba cerrada en el
//     diseño desde el 23 de agosto, y es lo que piden tres de sus cuatro
//     descendientes.
//
// UNO SE CONSTRUYE FUERA DE /dev: el marco de carta, que vive en
// components/design/v3/ y cuelga de la wiki (/docs/v3/cards/design). Se queda
// donde está —mudarlo movería páginas, rutas y componentes vivos por un
// beneficio de orden—, pero entra en la cadena con su `home` apuntando allí.
// Estaba construyéndose V3 en un sitio que este mapa no nombraba.
// =========================================================================

import { BUILD_STATUS_LABEL, type BuildStatus } from "./sections";

export type DevModuleStatus = BuildStatus;

/**
 * Las cuatro alturas de la cadena. No es una quinta clasificación por encima de
 * `needs` —las aristas mandan—, es la etiqueta de lectura: agrupa la lista para
 * que se entienda de un vistazo por qué el orden es el que es.
 */
export type DevLayerId = "sustrato" | "piezas" | "reglas" | "sensacion";

export type DevLayer = {
  readonly id: DevLayerId;
  readonly label: string;
  readonly blurb: string;
};

export const DEV_LAYERS: readonly DevLayer[] = [
  {
    id: "sustrato",
    label: "El sustrato",
    blurb:
      "Los datos. No se ve nada: son las cifras y los catálogos de los que come todo lo demás, y por eso van arriba.",
  },
  {
    id: "piezas",
    label: "Las piezas",
    blurb:
      "Lo que se ve. Cada una se diseña aislada y se puede juzgar antes de que haya una sola regla escrita.",
  },
  {
    id: "reglas",
    label: "Las reglas",
    blurb: "Lo que pasa. Necesitan datos que ejecutar, así que esperan al sustrato.",
  },
  {
    id: "sensacion",
    label: "La sensación",
    blurb:
      "Cómo se siente. Va la última porque las usa a todas, no porque importe menos.",
  },
];

/** Una arista de la cadena: de quién depende un módulo y para qué. */
export type DevDependency = {
  /** Slug del módulo del que se depende. Tiene que estar antes en la lista. */
  readonly slug: string;
  /** Qué se le pide, en una frase. */
  readonly what: string;
  /**
   * Lo que se usa HOY en su lugar, mientras el otro módulo no exista. Si está
   * puesto, es deuda: hay que volver aquí cuando el acreedor esté construido.
   */
  readonly standIn?: string;
};

export type DevModule = {
  /** Segmento de URL: /dev/<slug>. Clave de las aristas aunque no haya página. */
  readonly slug: string;
  readonly label: string;
  /** Qué se construye aquí, en una frase. */
  readonly summary: string;
  /** Icono de PrimeIcons. */
  readonly icon: string;
  readonly status: DevModuleStatus;
  readonly layer: DevLayerId;
  /** De quién depende. Vacío solo si de verdad no depende de nadie. */
  readonly needs?: readonly DevDependency[];
  /** Documento de diseño que tiene que estar cerrado antes de construirlo. */
  readonly doc?: { href: string; label: string };
  /** Dónde se construye, cuando no es en /dev/<slug>. */
  readonly home?: { href: string; label: string };
  /** Qué falta por decidir antes de poder empezar, si falta algo. */
  readonly blocker?: string;
};

export const DEV_STATUS_LABEL = BUILD_STATUS_LABEL;

export const DEV_MODULES: readonly DevModule[] = [
  // ---------------------------------------------------------------- sustrato
  {
    slug: "personaje",
    label: "Estadísticas de personaje",
    summary:
      "La HOJA DE DATOS común a héroes, unidades y enemigos —que en V3 son las mismas razas—, no la pieza que se pone en el tablero: eso es la ficha, y es el módulo 5. Las 8 Habilidades con su escala y sus topes, el tipo de daño que trae puesto el alcance, y las 41 Características. Construida la ANATOMÍA en lib/v3/character.ts, que es lo que se podía cerrar sin las cifras: la escala de las ocho con el motivo de cada tope, la curva ×10 del tier, el tope de cinco Características y las catorce comprobaciones que dicen por qué un personaje es ilegal. El CATÁLOGO se lee de razas.md y no se copia (traits.ts), y de paso destapa los glifos repetidos, que hasta ahora se encontraban mirando cartas de una en una. Es la raíz de la cadena — no depende de nadie y de ella cuelga todo.",
    icon: "pi pi-id-card",
    status: "en-curso",
    layer: "sustrato",
    doc: { href: "/docs/v3/razas", label: "Razas · Habilidades y Características" },
    blocker:
      "Siguen faltando siete de las 8 Habilidades en valores, y son insumo: 👢 Movimiento es la única puesta (🗡️ 3 · ✨ 2 · 🏹 1, banda por tipo de daño, 31-ago) y no se eligió a dedo sino midiendo el duelo del tablero. Pero eso ya no bloquea a la descendencia: de los cuatro módulos que cuelgan de aquí, tres piden la FORMA —qué rellenan las 132 fichas, qué imprime la carta, qué hay que leer en el disco— y solo el motor de combate necesita cifras. Y EL 5 DE SEPTIEMBRE DE 2026 SE CERRÓ EL MÉTODO, que era el hueco que nadie había nombrado: la escala decía en qué rango va cada número y no quién lo decide, así que «faltan siete» se leía como 1.056 celdas en blanco. Son 122 — once bases de ❤️ y once de ⚔️ por raza con la curva ×10 haciendo los otros siete escalones, una rejilla de tipo de daño × tier para 🛡️ 🔮 🎯 🍀, tres cifras de ⚡ en banda por tipo de daño y el tier al que equivale un héroe (razas.md §«De dónde sale cada número»). De regalo salieron dos topes que no elige nadie porque los impone la curva, y ya se comprueban en lib/v3/character.ts: ⚔️ base ≤ 9 y ❤️ base 10–99. Lo que queda por construir aquí es EL BANCO, y ahora se sabe qué tiene que medir: tres de esas 122 —el tier del héroe, el reparto de ⚡ y el límite de 👢 de ✨, que el duelo dejó vacío—, como se midió 👢.",
  },
  {
    slug: "razas",
    label: "Razas y unidades",
    summary:
      "Las 11 razas con sus 4 clases y su progresión de 8 unidades, en datos: el catálogo que consultan el reclutamiento, el mazo y la composición de enemigos.",
    icon: "pi pi-sitemap",
    status: "planificado",
    layer: "sustrato",
    needs: [
      { slug: "personaje", what: "la anatomía que rellenan las 132 fichas" },
    ],
    doc: { href: "/docs/v3/razas", label: "Razas" },
    blocker:
      "Ya no faltan las estadísticas de personaje: la anatomía está en lib/v3/character.ts, así que el hueco que rellenan las 132 existe. Lo que queda es trabajo escrito y no decisión: los 25 nombres de unidad que colisionan con los de héroe (decidido el 24-ago que se renombra la unidad), y las cifras de cada ficha, que son insumo.",
  },
  {
    slug: "cartas",
    label: "Catálogo de cartas",
    summary:
      "Las cartas de V3 como DATOS, leídas del markdown igual que hace hoy la wiki con v2: clase, unidad, item, maldición y encuentro, cada una con su bloque de Habilidades y Características. No es el objeto —eso es el marco—, es lo que el objeto imprime.",
    icon: "pi pi-list",
    status: "planificado",
    layer: "sustrato",
    needs: [
      { slug: "personaje", what: "el bloque de Habilidades y Características que imprime cada carta" },
      { slug: "razas", what: "el roster del que salen: 4 clases y 8 unidades por raza" },
    ],
    doc: { href: "/docs/v3/cards", label: "Cartas" },
    blocker:
      "No hay ninguna carta escrita todavía. Y una decisión abierta que es de aquí: la Rareza de las cartas que no son unidades, que no tienen tier del que derivarla.",
  },

  // ------------------------------------------------------------------ piezas
  {
    slug: "tablero",
    label: "Tableros",
    summary:
      "Los dos tableros separados de V3. Construida la ARENA de batalla, en cuatro tamaños desde el mínimo de 14×12: suelo como lámina continua y rejilla en trazo encima, siguiendo la dirección de arte, con las bandas y los alcances marcados con contorno. Encima está el FORMATO del §2 —co-op de uno a tres jugadores, cinco fichas cada uno—, el DESPLIEGUE libre del §3 en la banda compartida, y el RITMO DE LA APROXIMACIÓN con el 👢 Movimiento repartido por tipo de daño y la persecución del arquero medida. Enfrente hay un BANDO ENEMIGO de verdad —la máquina trae lo mismo que la mesa— y las fichas ya ANDAN: hasta 👢 Movimiento y sin atravesar a nadie (§5). El de exploración sigue siendo un esqueleto.",
    icon: "pi pi-map",
    status: "en-curso",
    layer: "piezas",
    doc: { href: "/docs/v3/board/battle", label: "Tablero de batalla" },
    blocker:
      "Ninguno de geometría, y no depende de nadie: por eso arrancó primero. Lo que el tablero midió ya está en el documento —el bando enemigo en espejo, la victoria en plural y el despliegue con huecos (28-ago); la banda de 👢 Movimiento, primera cifra de las 8 Habilidades (31-ago)—. Queda por construir la ilustración del campo, la segunda forma del bando enemigo (fauna u horda, §2) y el mismo bucle con quince fichas por bando, que el duelo 1 contra 1 no contesta. ⚡ Iniciativa y el turno siguen esperando las otras siete Habilidades.",
  },
  {
    slug: "pieza",
    label: "Ficha de personaje",
    summary:
      "LA FICHA: lo que se pone en el hexágono y anda por él. Las Estadísticas dicen QUÉ es una unidad; esta dice cómo se ve desde arriba y a tamaño de partida. Dos decisiones de Dario la definen: el retrato de la carta dentro de la ficha viene de HEARTHSTONE, y la forma es un HEXÁGONO TUMBADO con el giro y el aplastado de la casilla, un poco más pequeño para que la rejilla se siga viendo (1-sep) —0,78 radios de casilla desde el 3 de septiembre, que bajó de 0,82: «por defecto la ficha un poco más pequeña, solo un poco», y lo que gana no es estética, es el aire por donde asoma la casilla iluminada— y PLANO —el grosor y el disco redondo se probaron el 2 y el 3 de septiembre y los dos se fueron el mismo día 3: «quita el disco y el grosor ya»—. Ahora mismo esta pantalla es la BASE desde la que se va mejorando, no una decisión cerrada. UN SOLO MARCO, y esa es la primera corrección del día 3: el trazo del hexágono es el único que lleva color —antes había además un aro para el héroe y un filete alrededor del retrato, tres líneas iguales—. Y TODAS LAS FICHAS SE DIBUJAN IGUAL: al héroe se le probó ese mismo trazo más gordo y se fue el mismo día por lo mismo, porque se leía como un fallo y porque con el color del tier en el marco ya tiene raíl propio; lo que cambia de una ficha a otra es el color, nunca la forma ni el grosor. Y EL COLOR DE ESE MARCO ES EL DEL TIER, que es la segunda del mismo día: no hay paleta nueva, es el raíl de $rarity que le da rarityForTier() —el mismo con el que se imprime su carta, porque la Rareza sale del tier (game-design.md §3)—, así que son cinco colores para ocho tiers y los héroes van en su raíl propio. DE QUIÉN ES LA FICHA SE DICE ILUMINANDO SU CASILLA, y en TRES tonos: «para mí azul, para mis enemigos rojo y para mis aliados verde» (3-sep). El rojo y el azul de la arena quedaron intercambiados en todo el proyecto ese día para que el azul sea el propio, y el verde es el único de los tres que no sale del muestreo de la referencia porque allí no hay tercer bando. Los dos aliados comparten el verde: el color dice si una ficha se puede mover, no de cuál de los dos compañeros es, y eso es la decisión —con el verde puesto se retiró la cifra del jugador que se había probado unas horas antes, «de esa manera se distinguen y no hace falta el número del jugador»—. Dos capas: el CARTÓN lleva el tier, la ❤️ Vida —cifra en la gema y BARRA flotante debajo, como en un videojuego— y los estados; la CARA lleva el retrato recortado a ras del marco, y es la capa que se cambiaría si la vía 3D decide algo. La ⚡ Iniciativa dejó de ser una opción de la ficha (3-sep): se resuelve en el tablero de combate, en el orden de la ronda, no poniendo una cifra en cada pieza. Y LA PANTALLA ABRE CON LA FICHA DESNUDA, sin un solo dato encima (3-sep): «los datos de la ficha por defecto quitados todos». No es que las cifras se descarten —siguen todas a un botón, y los dos de Hearthstone a uno solo—: es el orden en que se juzga, primero la pieza que se ve de lejos y encima de una pieza que ya se lee lo que haga falta, porque dos gemas sobre el retrato tapan justo lo que está en obras. Se pinta sobre la arena de verdad, pero en una ESCENA de 6×4 con las fichas en contacto —el 14×12 entero solo enseñaba dos manchas lejanas—, y el calibre trae las veinticuatro fichas de las dos razas dibujadas en su orden de tier, que es lo que dice si el encuadre vale para todas o solo para la que se eligió. El nombre es el de v2 (board-map.md §4c, «quien anda por el tablero») y vuelve aquí porque es de aquí.",
    icon: "pi pi-circle-fill",
    status: "en-curso",
    layer: "piezas",
    needs: [
      {
        slug: "personaje",
        what: "qué hay que poder leer en la ficha: bando, ❤️ Vida, tipo de daño y estados",
        standIn:
          "los 48 sujetos con su arte y sus cifras de components/design/v3/ —el laboratorio del marco—, con las 8 Habilidades escritas otra vez y los números inventados",
      },
      { slug: "tablero", what: "el diámetro real — lo manda el hexágono de la arena, no el gusto" },
    ],
    doc: { href: "/docs/v3/board/battle", label: "Tablero de batalla §5" },
    blocker:
      "EL ASPECTO DE LA FICHA ESTÁ EN OBRAS: el 3 de septiembre de 2026 se quitaron el grosor y el disco redondo que se habían probado el día antes, así que lo que hay es la BASE —un hexágono plano— y se va mejorando desde ahí con Dario delante. La decisión de pipeline no bloquea: la figura 3D se pondría de pie SOBRE esta ficha, así que es la capa de arriba y la de abajo —la que se lee— no cambia con ella. Y tumbarla resolvió el solape entre filas: con la arena a 0,67 las filas están a un radio, así que de pie se muerde el hexágono de detrás y tumbada no. Lo que queda abierto es una sola cosa, y no es de diseño: que 108 de los 132 sujetos siguen sin dibujar, así que solo dos razas se pueden mirar. Lo que se cerró el 5 de septiembre de 2026 y salió de esta lista: LA ❤️ VIDA DE TRES CIFRAS, que era la primera de las cuatro. Dos medidas cambiaron la pregunta antes de tocar ningún mando —agrandar la gema no arregla nada, porque el radio se va de los dos lados de la desigualdad y tres dígitos se pasan un 15% sea cual sea el tamaño; y no hay ninguna base de ❤️ que evite el caso, porque con la mínima el tier 8 llega a 100—. Así que cada gema pinta su cifra al mayor tamaño que le quepa A SU PEOR CASO (`gemFontRatio`), y como ❤️ Vida es el único de los seis datos que llega a tres dígitos es la única que encoge: 6,30 px contra los 7,62 de las demás en el hexágono de 34. Encoge SIEMPRE, y eso es lo que corrige de verdad: el dibujo miraba `text.length` y no el dato, así que una ficha con ❤️ 100 encogía su cifra y al bajar a 99 la agrandaba —el número cambiaba de tamaño al recibir daño—. Queda mirarlo en pantalla: si esos 6,30 px se leen a tamaño de partida no lo dice la medida, lo dice el ojo. Y EL ENCUADRE DEL RETRATO, el mismo día y por el mismo camino —mirar el dato antes que el mando—: la pregunta no era qué banda enseñar sino PARA QUÉ ARTE se recorta, porque el que existe no cumple su propia norma (pide los pies al 72% y caen entre el 77% y el 91%). Se encuadra PARA LA NORMA, así que la ilustración que no la cumple se ve mal en la ficha y eso es la señal, que es lo que ya decía el README del arte —«la norma no se toca ni se relaja; si algo hay que cambiar es el prompt»—. Con eso el ancla deja de escribirse a mano: la calcula `framingAnchor()` desde la figura normativa —12%–72%, de la tabla §Encuadre del README del arte— y la prueba de que la regla es la buena es que reproduce CLAVADO el 0,340 que Dario había fijado por ojo el 2 de septiembre; los otros dos, que nadie había mirado igual, se movieron (Cabeza 0,19 → 0,208, Busto 0,30 → 0,280) y llevaban 4 y 2 puntos de aire sobre la coronilla contra los 5,5 del elegido, o sea tres criterios distintos donde ahora hay uno. Lo que sigue abierto del encuadre no es el número: es si el mismo vale para las doce fichas de una raza, y eso lo dice la tira de tiers. Y LOS TRES COLORES QUE SE PISAN, el mismo día y de nuevo porque medir cambió la pregunta. Lo que trae el color del tier son tres raíles que caen en la familia de una casilla —el del héroe es rojo como el enemigo, el de «raro» (tiers 5 y 6) azul como el propio, el de «poco común» (tiers 3 y 4) verde como el aliado—, y al medirlos resultó que no son parecidos: son el mismo tono Y LA MISMA LUMINOSIDAD (#6b86c4 vs #3b82f6, L 56/56; #5fa85c vs #3fae5a, L 63/63; #b8544a vs #d9422c, L 48/50). En la paleta solo los separa la saturación; en pantalla los separa otra cosa, que la casilla se pinta al 34% sobre el suelo. O sea que la separación no estaba en los colores sino en la transparencia, y eso se ve en que se estrecha según el suelo se aclara hacia el frente: el par más apretado mide ΔE2000 26,7 al fondo y 19,5 en la fila de delante. Ninguno es confundible —el umbral está en 2,3— y el problema tampoco era ese: al ser el mismo tono, marco y casilla se leen como UNA sola cosa roja en vez de como tier + bando. Y lo que los separaba estaba construido sobre un sustituto, porque `$arena-ground-*` es el hueco donde entra la ilustración del campo. Así que el marco deja de compararse con lo que tenga debajo y se apoya en un HALO casi negro, que es lo que ya hacen los rótulos de la arena con `$arena-label-halo` —y no es el segundo borde que se retiró el día 3, porque aquellos tres eran del mismo color y este es el canto del propio cartón—. Cuesta 1 px de la casilla iluminada: de los 6,48 px de aire del hexágono de 34 se ven 4,38 en vez de 5,38, y hay comprobación nueva que lo vigila (`casilla-visible`). Este tablero ya había aprendido lo mismo una vez: cuando entró la lámina, las bandas de despliegue pasaron de relleno a contorno. Y lo que se cerró el día 3: DE QUIÉN ES LA FICHA, en tres casillas de color —azul yo, verde el aliado, rojo el enemigo—, que contesta battle.md §8 entero; la cifra del jugador que ocupó su sitio media tarde se retiró con el verde.",
  },
  {
    slug: "marco",
    label: "Marco de carta",
    summary:
      "La carta como OBJETO: marco, tipografía, disposición y escala de Rareza. CERRADO el 3 de septiembre de 2026 con L · Lámina, tras doce bocetos: la última pregunta abierta era la del BORDE, con tres respuestas en pantalla —lo traza el navegador (J · Orla, el elegido desde el 25 de agosto), lo trae dibujado un archivo (K · Moldura, 1-sep) o no hay borde (L, 2-sep)—, y ganó la tercera. La J y la K se borraron con la decisión. Se construye fuera de /dev, en la wiki, y entra aquí porque la Animación y la Baraja dependen de él.",
    icon: "pi pi-id-card",
    // "listo" desde el 3 de septiembre de 2026: la carta está elegida y los
    // bocetos rivales borrados. Lo único que le queda —si 2px de Rareza aguantan
    // impresos— no se contesta construyendo, se contesta imprimiendo.
    status: "listo",
    layer: "piezas",
    needs: [
      {
        slug: "personaje",
        what: "la anatomía que imprime: las 8 Habilidades en su escala, el tipo de daño en el sitio del icono de ⚔️ Ataque y las Características como glifos",
        standIn:
          "components/design/v3/sample.ts y races.ts, con su propia copia de las ocho, su propio Trait y sesenta fichas escritas a mano con los números inventados",
      },
      { slug: "cartas", what: "el roster real que imprimir — es el catálogo el que enseña si el marco aguanta cinco Características" },
    ],
    home: { href: "/docs/v3/cards/design", label: "Wiki › Cartas › Diseño de cartas" },
    doc: { href: "/docs/v3/cards/design", label: "Diseño de cartas" },
    blocker:
      "Ninguno: es el único módulo de la lista que no espera datos ni documentos, porque su pregunta se contesta mirando — y ya está contestada. Lo único que queda no se puede mirar en pantalla: si la línea de Rareza de 2px aguanta impresa a 63mm, que se contesta con una prueba en papel y es el mismo pendiente que tenía el hilo de oro de la J.",
  },

  // ------------------------------------------------------------------ reglas
  {
    slug: "combate",
    label: "Motor de combate",
    summary:
      "Resolución sin dados: una tirada oculta 1..100 contra dos umbrales —🎯 Precisión para acertar y 🍀 Suerte para el crítico—, mitigación porcentual por tipo de daño y orden de actuación por ⚡ Iniciativa.",
    icon: "pi pi-bolt",
    status: "planificado",
    layer: "reglas",
    needs: [
      { slug: "personaje", what: "los valores que entran en la tirada: 🎯 Precisión, 🍀 Suerte, ⚔️ Ataque y las dos mitigaciones" },
    ],
    doc: { href: "/docs/v3/game-design", label: "Diseño del juego §4" },
    blocker:
      "Ninguno de diseño: el motor está escrito y con sus diales fijados. Faltan las cifras de las 8 Habilidades que ejecutar, que es lo único de las estadísticas de personaje que sigue en el aire. El primer trozo ya existe y lo pidió la Animación: lib/v3/combat.ts resuelve la tirada del §4.1, que es la parte que no depende de los valores.",
  },
  {
    slug: "estados",
    label: "Estados y efectos",
    summary:
      "Los nueve estados temporales con su daño por turno, su duración y su acumulación: los elementales entran siempre, los de control los aplica el crítico, y solo una carta los quita antes de tiempo.",
    icon: "pi pi-sparkles",
    status: "planificado",
    layer: "reglas",
    needs: [
      { slug: "combate", what: "el crítico, que es lo único que aplica los estados de control" },
    ],
    doc: { href: "/docs/v3/effects", label: "Efectos y estados" },
    blocker: "Ninguno de diseño: el catálogo está escrito. Depende del motor de combate en código.",
  },
  {
    slug: "baraja",
    label: "Baraja y Oteo",
    summary:
      "De dónde sale una carta y a dónde vuelve: el mazo, la mano, la zona en juego y el robo de cada turno. Es la economía del turno, y es lo que hoy no tiene dueño — la Animación suelta cartas al aire sin que haya nada detrás de las que las sostenga.",
    icon: "pi pi-clone",
    status: "planificado",
    layer: "reglas",
    needs: [
      { slug: "cartas", what: "qué se baraja" },
      { slug: "marco", what: "cómo se ve una carta en la mano — es lo que decide cuántas caben" },
      { slug: "combate", what: "cuándo se juega: el turno cuelga del orden por ⚡ Iniciativa" },
    ],
    doc: { href: "/docs/v3/game-design", label: "Diseño del juego §6" },
    blocker:
      "El único módulo bloqueado por un DOCUMENTO EN BLANCO y no por valores: game-design.md §6, «Turno y economía de cartas», está sin escribir. Y no se hereda de v2 —mazo, tope de 5 en juego y Oteo de 2— sin decidirlo: V3 se escribe de cero.",
  },

  // --------------------------------------------------------------- sensación
  {
    slug: "animacion",
    label: "Animación",
    summary:
      "Cómo se SIENTE el juego, que es lo único de esta lista que no es una regla: soltar una carta y verla convertirse en ficha en el aire, la caída con su sombra y su polvo, el golpe con su embestida y su congelado, y la baja con su fogonazo. Están los TRES DESENLACES del §4.1 —fallo, impacto y crítico—, que en un juego sin dados en pantalla no son adorno sino el único canal por el que el jugador se entera de lo que ha pasado: la embestida es idéntica en los tres hasta el fotograma del contacto, y lo que separa fallar de criticar empieza ahí y ni un milisegundo antes. Y están los otros dos TIEMPOS, que no cuentan lo que pasó sino que evitan preguntas: el TERRENO QUE SE OFRECE al coger una ficha —en onda desde ella, y bastante menor que el círculo de su 👢 porque no se atraviesa a nadie (§5)—, con su andar de hexágono en hexágono; y la MESA VIVA, donde las fichas respiran cada una en su fase y la que ya ha andado deja de hacerlo. Esas dos son una sola animación y no se pueden juzgar por separado: lo gastado se lee por AUSENCIA, y una ausencia solo se ve si lo demás está presente. Diales en vivo para el vuelo, la curva de caída, el aplastado, el hit-stop, el temblor, el esquive, el congelado del crítico, el aliento, el paso, la onda y las partículas.",
    icon: "pi pi-play",
    status: "en-curso",
    layer: "sensacion",
    needs: [
      {
        slug: "tablero",
        what: "el hexágono y la cámara sobre los que cae la ficha",
        standIn: "un retal propio de quince hexágonos, con la geometría de la arena copiada a mano",
      },
      {
        slug: "pieza",
        what: "la ficha que cae, golpea y muere",
        standIn: "discos con un glifo",
      },
      {
        slug: "marco",
        what: "la carta que se suelta desde la mano",
        standIn: "un rectángulo con un borde",
      },
      {
        slug: "baraja",
        what: "de dónde sale esa carta y a dónde vuelve",
        standIn: "cartas de ejemplo sueltas, sin mano ni mazo detrás",
      },
      {
        slug: "combate",
        what: "los tres desenlaces del §4.1, que son lo que la animación tiene que contar",
      },
    ],
    doc: { href: "/docs/v3/game-design", label: "Diseño del juego §4.1" },
    blocker:
      "Ninguno para seguir midiendo: los cuatro sustitutos son deliberados, porque una caída no necesita saber cuánto pega la ficha, y mezclar el movimiento con el aspecto haría que se juzgaran los dos a la vez y mal. Lo que sí espera es al motor de combate, y al revés de lo normal: no lo necesita para funcionar, es el motor el que va a tener que nacer emitiendo SUCESOS en vez de mutando estado, o nada de esto se podrá enseñar (lib/v3/anim.ts, `schedule`). Lo que el banco pide a cambio es que `schedule()` aprenda a solapar: hoy es estrictamente secuencial, y el tic de estados al empezar el turno no cabe en fila. La oferta y el andar ya no piden nada: las cuentas las hace lib/v3/movement.ts, que existía desde el duelo del tablero, así que el banco pregunta y no calcula. Lo que sí queda abierto es si la onda de la oferta entra en presupuesto sobre el 14×12 de verdad —en el retal de quince siempre cabe—, y eso solo se ve mudando esto a la arena.",
  },
];

export const DEV_MODULES_BY_SLUG: Readonly<Record<string, DevModule>> = Object.fromEntries(
  DEV_MODULES.map((m) => [m.slug, m]),
);

/** A dónde lleva el módulo, o null si todavía no hay nada que ver. */
export function moduleHref(m: DevModule): string | null {
  if (m.status === "planificado") return null;
  return m.home?.href ?? `/dev/${m.slug}`;
}

/** Un módulo se puede visitar cuando existe su página, aquí o donde se construya. */
export function isAvailable(m: DevModule): boolean {
  return moduleHref(m) !== null;
}

/** Su posición en la cadena, 1..n. Es el número que se pinta delante. */
export function orderOf(slug: string): number {
  return DEV_MODULES.findIndex((m) => m.slug === slug) + 1;
}

/** Las deudas vivas de un módulo: dependencias que hoy tienen un remiendo. */
export function standInsOf(m: DevModule): readonly DevDependency[] {
  return (m.needs ?? []).filter((d) => d.standIn !== undefined);
}

/**
 * Comprueba que la lista sigue siendo lo que dice ser.
 *
 * Sin esto el orden vuelve a ser una promesa: basta añadir un módulo en el
 * sitio equivocado, o apuntar a un slug que no existe, para que el mapa mienta
 * sin que nadie se entere. El hub lo pinta en rojo, así que se ve en la propia
 * aplicación y no hace falta acordarse de mirar.
 */
export function dependencyProblems(): readonly string[] {
  const problems: string[] = [];
  const seen = new Set<string>();

  for (const m of DEV_MODULES) {
    if (seen.has(m.slug)) problems.push(`«${m.slug}» está dos veces en la lista.`);
    for (const dep of m.needs ?? []) {
      if (!(dep.slug in DEV_MODULES_BY_SLUG)) {
        problems.push(`«${m.slug}» depende de «${dep.slug}», que no existe.`);
      } else if (!seen.has(dep.slug)) {
        problems.push(
          `«${m.slug}» depende de «${dep.slug}», que va DESPUÉS en la lista: el orden no es topológico.`,
        );
      }
    }
    seen.add(m.slug);
  }

  return problems;
}
