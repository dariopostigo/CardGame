# CardGame — Documento de diseño (borrador inicial)

Mezcla de mecánicas de **D&D** (personajes, estadísticas, progresión, identidad de héroes/enemigos/NPCs — ver [`characters/heroes.md`](characters/heroes.md), [`characters/enemies.md`](characters/enemies.md), [`characters/npcs.md`](characters/npcs.md)) con **Viajes por la Tierra Media** como inspiración solo de la **estructura de cartas y mazo** (mazo personal, iconografía de pruebas) y del **tablero** (ver [`board/board-map.md`](board/board-map.md)) — no de la identidad de personajes/razas, que ya se fijó como D&D puro. Este documento se irá ampliando iteración a iteración. Términos transversales en [`glossary.md`](glossary.md); catálogo de cartas por tipo en [`cards/`](cards/README.md). **Foto de qué está definido vs. pendiente en [`status.md`](status.md).** Ideas sin decidir todavía, aparcadas en [`ideas.md`](ideas.md).

## 1. Concepto central

Cada jugador controla un personaje con estadísticas de tipo D&D. Tiene un **mazo personal** (clase + items + mercenarios) del que cada turno **otea** 2 cartas al azar y prepara 1 para jugarla cuando quiera (§4) —ahí está la suerte de cada turno—, más un **equipo** de armas y armaduras que lleva puesto, aparte del mazo (§4a). Las cartas se juegan para modificar estadísticas propias, de aliados o de enemigos, aplicar ventaja/desventaja, curarse, invocar mercenarios, etc.

## 1b. Inicio de una partida (setup) *(decidido)*

Flujo desde que el jugador abre la aplicación hasta que pisa el primer hexágono:

1. **Partida nueva → elegir modalidad.** **Partida rápida** (la única disponible en el prototipo) o **Modo Campaña**, que a su vez contiene **varias historias distintas seleccionables** (no un único arco; se irán añadiendo — `board/board-map.md` §2b).
2. **Elegir héroe** de los disponibles ([`characters/heroes.md`](characters/heroes.md)). La pantalla de selección muestra una **ficha completa** de cada uno: retrato, historia breve, puntos fuertes y débiles, las 6 estadísticas, PV, dado de vida y su kit inicial (`characters/heroes.md` §1b).
3. **Kit inicial** — se otorga automáticamente, sin pasar por tienda ni gastar oro (**el oro inicial sigue siendo 0**, §6b):
   - **Todas sus cartas de habilidad de clase** (8 por héroe, sin distinción Básica/Especial, [`cards/class.md`](cards/class.md)) → van al **Mazo**.
   - Una **selección fija de armas y armaduras por clase** → van **equipadas** (§4a), no al Mazo.
   - Un **puñado de items de arranque por clase** → van al **Mazo**, ya no por necesidad estructural (con 8 cartas de clase el Mazo ya no se vacía enseguida) sino por variedad de utilidad — ver el aviso de §4.
   - Los kits concretos de los 4 héroes están en `characters/heroes.md` §2d.
4. **Preparación de salida — eliges 2 cartas de habilidad de clase que arrancan ya "en juego"** *(decidido)*. La zona "en juego" (§4) no empieza vacía: escoges **2 de las 8 cartas de habilidad** de tu héroe ([`cards/class.md`](cards/class.md), cualquiera del roster) y salen preparadas desde el turno 1. Los otros 3 huecos (el tope fijo es 5, §4) los llena el Oteo.

   > **Por qué.** Sin esto, el **primer combate de la partida se peleaba con 0-2 cartas preparadas y al azar**, y para el Mago era una lotería de supervivencia: solo aguanta con *Escudo arcano* listo (CA 16 en vez de 13). Un héroe no debería morir por un sorteo antes de tomar ninguna decisión. Que **elijas** las 2 (en vez de dártelas todas) mantiene la decisión en tus manos y no infla el arranque: sigues empezando con 3 huecos libres. Al no haber ya distinción Básica/Especial, puedes elegir cualquiera de las 8 — el número exacto de partidas que esto cambia respecto a la cifra anterior está por recalcular.
5. **Generación del mapa y entrada.** Se genera el mapa (`board/board-map.md` §2c) y el héroe entra por **una esquina**, la "puerta" del mapa (§2c, paso 0). A partir de ahí empieza el turno 1: oteas, mueves, actúas.

## 2. Personaje y estadísticas

Base D&D (6 características clásicas). Cada personaje tiene: PV, Nivel, Clase, Movimiento (§2.2) y las 6 estadísticas con su modificador (igual que D&D: `mod = floor((stat - 10) / 2)`).

### 2.1 Qué hace cada estadística (mecánica concreta)

| Estadística | En combate | Fuera de combate / exploración | Ejemplo de prueba |
|---|---|---|---|
| **Fuerza** | Bono a precisión y daño de armas cuerpo a cuerpo pesadas | Forzar puertas, cargar peso, pruebas de atletismo | "¿Derribas esta puerta atrancada?" |
| **Destreza** | Iniciativa (orden de turno), Defensa/CA base, precisión y daño de armas ligeras/a distancia | Sigilo, acrobacias, desactivar mecanismos simples | "¿Te detecta la ronda enemiga al cruzar el claro?" |
| **Constitución** | Puntos de Vida máximos (junto al dado de vida de la clase) | Resistencia a veneno, enfermedad, agotamiento | "¿Resistes el veneno del Trasgo de pantano?" |
| **Inteligencia** | Precisión de hechizos arcanos (Mago) | Identificar objetos/trampas, pruebas de conocimiento | "¿Reconoces qué activa esta runa?" |
| **Sabiduría** | Precisión de hechizos divinos/naturales (Clérigo) | **Determina el rango de visión base en el mapa** (Percepción); intuir intenciones | "¿Notas algo raro en esa Ficha de Amenaza antes de activarla?" |
| **Carisma** | Hechizos de pacto/inspiración (clases futuras) | Interacción con NPCs (precios, persuasión); reclutar mercenarios (prueba de Carisma) | "¿Consigues que el mercader te baje el precio?" |

Otros valores derivados directamente de las estadísticas:
- **Defensa/CA** = 10 + mod Destreza (+ bono de armadura equipada).
- **Defensa/CA** con armadura equipada: la Destreza aporta distinto según el **peso** — fórmula completa en [`cards/armor.md`](cards/armor.md) §1.
- **PV máximo** = dado de vida de la clase (nivel 1: máximo del dado; niveles siguientes: tirada o promedio, a decidir) + mod Constitución por nivel + **10 de aguante de protagonista** *(decidido)*.

  > **Por qué 10 y no 2 *(decidido — sustituye el "+2 de aguante base")*.** El héroe **no es un personaje de nivel 1 de D&D**: es un protagonista **solo** al que le pedimos que limpie un mapa entero y mate a un Élite que en D&D es contenido de CR 2-5, o sea trabajo de un grupo de cuatro. Con +2 los números salían así:
  >
  > | | PV | Turnos que tardaba en morir | Turnos que tardaba en matar al boss |
  > |---|---|---|---|
  > | Guerrero (14 PV) vs. Capitán bandido | 14 | **2** *(con sus refuerzos)* | 8,6 |
  > | Guerrero vs. Trol de las minas | 14 | 3,7 | **23** *(la regeneración se comía el 57 % de su daño)* |
  > | Mago (8 PV) vs. **un lobo suelto** | 8 | **3,9** | 4,3 |
  >
  > Los tres Élite del bestiario ganaban a los cuatro héroes, y un crítico del Trol (2d10+3 = 14) mataba al Guerrero **de un golpe desde PV máximos**. No era una perilla de balance fino: faltaba aproximadamente el doble de aguante. Con +10 (Guerrero 22, Clérigo 20, Pícaro 19, Mago 16) el boss se pelea a 5-6 turnos por bando, que es la ventana que queremos. Va junto al ataque secundario de §4b.3 y al recorte de PV de los Élite (`characters/enemies.md` §5b) — las tres cosas son **un mismo ajuste**, no tres independientes.

### 2.2 Movimiento

**Estándar: 2 movimientos por turno para todos los héroes**, sin variación por raza (sustituye la idea anterior de Velocidad-por-raza). Los enemigos usan la misma base de **2**, con **3 para los cazadores ágiles** (Lobo, Araña matriarca, la Sombra) y **ninguno por debajo de 2** — detalle y motivo en `characters/enemies.md` §5b.1. 1 movimiento = 1 hexágono cruzado en `board/board-map.md`, modificado por el terreno de cada hexágono (`board/board-map.md` §3).

Fuentes de movimiento **extra** por encima del estándar:
- **Fichas del tablero** (ej. un NPC informante/guía, `characters/npcs.md`) que conceden movimiento adicional puntual.
- **Cartas de movimiento** — un tipo de carta de equipo/objeto que se juega para ganar movimiento extra ese turno.
- **Cartas de clase innatas** — ciertos héroes pueden tener ya en su mazo cartas que dan movimiento extra desde el principio (ej. el Pícaro, coherente con su rol explorador en `characters/heroes.md`).

**Suelo mínimo *(decidido)*:** el movimiento **nunca baja de 1 hexágono** por turno, por muchos modificadores negativos que se acumulen (Ralentizado de [`effects.md`](effects.md) + *Peso maldito* de [`cards/curses.md`](cards/curses.md) sumarían 0 sin esta regla). Quedarse literalmente clavado solo lo consigue el estado **Inmovilizado**, que es explícito.

### 2.3 Rango de visión *(decidido)*

**Dos radios distintos**, porque "ver por dónde voy" y "ver qué hay ahí" no son la misma cosa. Separarlos arregla la sensación de mirilla del radio único de 1 hexágono y da una **niebla en dos capas por hexágono**, sin necesitar el sistema de grupos/tiles que sigue aparcado (`board/board-map.md` §2, §4):

| Radio | Qué revela | Fórmula |
|---|---|---|
| **Visión de detalle** | Las **fichas** del tablero (Enemigo, Amenaza, Tesoro, NPC…) y las localizaciones especiales | `2 + mod SAB` (mínimo 1) |
| **Visión de terreno** | Solo el **tipo de terreno** de cada hexágono — la silueta del mapa, sin su contenido | `visión de detalle + 2` (mínimo 2) |

| Héroe | mod SAB | Detalle | Terreno |
|---|---|---|---|
| Guerrero (SAB 12) | +1 | 3 | 5 |
| Pícaro (SAB 10) | +0 | 2 | 4 |
| Mago (SAB 13) | +1 | 3 | 5 |
| Clérigo (SAB 15) | +2 | 4 | 6 |

- **Escala +1 por punto de modificador de SAB.** Sustituye el "+1 por cada +2 de mod" anterior, que daba **+0 a tres de los cuatro héroes** — con él la Sabiduría no diferenciaba nada.
- **Base bajada de 3 a 2 (2026-08-05):** con `/dev/movimiento` jugado de verdad, los radios de `3 + mod SAB` se sentían demasiado largos frente al mapa real y al pool de 2 puntos de movimiento por turno. Un punto menos de base en los dos radios.
- **Terreno:** Bosque **−1 a ambos radios** (`board/board-map.md` §3a); Montaña **bloquea la línea de visión**.
- **Invariantes de balance.** Los valores absolutos son perilla libre —no se pueden cerrar del todo hasta ver el tablero real jugando—, pero al afinarlos hay que preservar estas dos relaciones:
  - `detalle > detección enemiga` (detección = 2 + mod SAB del enemigo, `characters/enemies.md` §2) → **el héroe ve al enemigo antes de que el enemigo pueda detectarle**, que es exactamente lo que asume la fase de aproximación de `characters/enemies.md` §2b. Con el radio único anterior (visión 1 vs. detección 2) pasaba lo contrario y el sigilo quedaba muerto. **Ojo con la base 2:** el Pícaro (detalle 2) ya solo cumple el invariante contra el Bandido (detección 1); iguala —no supera— a Lobo/Trasgo/Esqueleto (detección 2), así que para esos tres el sigilo automático deja de estar garantizado y pasa a depender de la prueba (§2b). Si se nota mal jugando, la primera perilla a tocar es esta, no el mapa.
  - `terreno > detalle` → siempre conoces la silueta antes que el contenido.
- Entrar por una **esquina** del mapa (`board/board-map.md` §2c) hace que estos radios sean seguros: un disco de radio 6 desde una esquina solo cae ~1/3 sobre el tablero (~20 hexes de 144), no medio mapa. Desde el centro habría que recortarlos.
- **Nota de diseño:** el **Pícaro tiene la peor visión del roster** (SAB 10), lo cual es irónico para el explorador. Es a propósito: su ventaja en exploración no es la percepción bruta sino *Ojo avizor*, el sigilo y **Oculto** ([`cards/class.md`](cards/class.md), [`effects.md`](effects.md)).
- Cartas de clase e items de exploración pueden **ampliar cualquiera de los dos radios** (*Ojo avizor*, *Herramientas de navegante*…).

### 2.4 Equipamiento: manos y armadura

- Cada personaje tiene **2 manos**. Las armas ocupan 1 o 2 manos (ver [`cards/weapons.md`](cards/weapons.md) para el listado con su icono ✋/🤲, ver [`glossary.md`](glossary.md)) — se pueden llevar hasta 2 armas de ✋ (una mano), o 1 arma de 🤲 (dos manos), nunca combinando ambas a la vez si no caben en las 2 manos disponibles.
- Cada personaje lleva **1 sola armadura** equipada (no se acumulan varias).
- **De salida** el héroe lleva equipado el **kit inicial fijo de su clase** (§1b, `characters/heroes.md` §2d) — no se elige del catálogo completo, porque el oro inicial es 0 y no habría con qué comprar nada. A partir de ahí, equipa y desequipa libremente lo que vaya consiguiendo, antes de cada capítulo y en sitios seguros (§4a).

## 3. Tipos de carta

Dos ejes distintos: **de dónde sale la carta** (clase vs. equipo encontrado) y **qué icono/tipo tiene** (para saber cómo y cuándo se juega cada una).

### 3.1 Por origen

1. **Cartas de Habilidad de Clase** — inspiradas en las cartas "Básica 1/2/3" de Viajes. Cada clase tiene un set fijo de cartas genéricas, **todas disponibles desde el nivel 1** (p. ej. Guerrero: "Golpe firme", "Postura defensiva"): ya no hay un subconjunto que se desbloquee por nivel/hito de personaje *(decidido — elimina la distinción anterior entre "Básica" y "Especial")*, cada carta sube de Nivel por su cuenta pagando al Instructor (§6d.5). Las de Tipo `Turnos` indican en su columna Uso cuántos turnos permanecen en juego; no hay ningún límite de repeticiones más allá del propio ritmo del Oteo (`cards/class.md` §1). Catálogo en [`cards/class.md`](cards/class.md).
2. **Cartas de equipo** — armas, armaduras e items conseguidos jugando (botín, tesoro, recompensas, compra; ver §3.2 y [`cards/`](cards/README.md)). Las **armas y armaduras** se **equipan** aparte (§4a); los **items** entran al **Mazo** (§4). Nada de esto se consigue con el Oteo.
3. **Cartas de Mercenario** — compañías a sueldo que se **reclutan** superando una prueba de Carisma en una ficha del tablero (fallarla la convierte en enemigo) o se **compran** por oro; van al Mazo como cartas de Acción. Como cualquier carta, **al darles la orden vuelven al Mazo** (regla madre de §4): son una ráfaga preparada, no un aliado permanente en el tablero. Catálogo en [`cards/mercenaries.md`](cards/mercenaries.md).

### 3.2 Por tipo (icono diferenciador)

| Tipo | Icono (ejemplo) | Qué hace | Notas |
|---|---|---|---|
| **Arma** | Espada | Añade daño y tipo de daño (lista completa y resistencias en §4b.10); ocupa 1 o 2 manos (§2.4) | Puede requerir stat mínima para usarse sin penalización |
| **Armadura** | Escudo/coraza | Suma a la Defensa/CA; puede restar Destreza si es pesada | Solo 1 equipada a la vez (§2.4) |
| **Item** | Bolsa | Categoría amplia: pociones (efecto instantáneo), hechizos (cartas de habilidad de clase o Pergaminos), objetos de aventura/herramientas/objetos mágicos raros — ver [`cards/items.md`](cards/items.md) | El más variado de los 4 tipos |
| **Mercenario** | 🪖 Casco/estandarte | Carta de Acción: das la orden a una compañía a sueldo (atacar, curarte, etc.); cuesta tu Acción y, como toda carta, **gasta su preparación** al jugarse (regla madre de §4) | Origen (reclutar/comprar) y catálogo en [`cards/mercenaries.md`](cards/mercenaries.md) |
| **Maldición** | Calavera/nube negra | Efecto negativo persistente que **ocupa un hueco del mazo** (a diferencia de un Efecto/Estado temporal de combate) — ej. -1 movimiento, 1 de daño cada 2 turnos, −1 al rango de visión | Definida en [`cards/curses.md`](cards/curses.md) (Nivel 1-5 con estrellas, leído al revés; fuentes, limpieza); da incentivo a "limpiar" el mazo |

> **Dónde vive cada tipo:** **armas** y **armaduras** son el **sistema de equipo** (§4a) — se equipan, no ocupan hueco del Mazo ni pasan por el Oteo. **Items**, **mercenarios** y **maldiciones** sí viven en el **Mazo** (§4).

Además siguen existiendo las **Cartas de Efecto/Estado** (ventaja, desventaja, aturdido, envenenado) que se aplican de forma *temporal* durante una prueba/combate sobre un personaje (propio, aliado o enemigo) — no ocupan hueco de mazo como la Maldición, son más bien un modificador puntual de una carta de Arma/Item/hechizo al jugarse.

Todas las cartas de equipo siguen el mismo patrón que viste en Viajes: **coste** (si aplica) + **texto de efecto** + **modificador de estadística o de prueba**.

### 3.3 Rareza / Nivel de carta *(unificado, decidido)*

Determina lo poderosa que es una carta y la dificultad de encontrarla/comprarla (ligado a las Fichas de Tesoro de `board/board-map.md` y a los precios de `characters/npcs.md`). **Rareza y Nivel de carta son el mismo eje con dos nombres**: 5 escalones fijos, cada uno con su color y su número de estrellas (★) para el diseño visual de la carta.

| Nivel | Rareza | Color | Estrellas |
|---|---|---|---|
| 1 | Común | Gris | ★ |
| 2 | Poco común | Verde | ★★ |
| 3 | Raro | Azul | ★★★ |
| 4 | Épico | Morado | ★★★★ |
| 5 | Legendario | Dorado | ★★★★★ |

- **Aplica a Arma, Armadura, Item, Mercenario y Maldición** *(Maldición se suma ahora, decidido — antes quedaba "previsiblemente" fuera; su Nivel se lee al revés, ver [`cards/curses.md`](cards/curses.md) §1)*. Las **cartas de clase** (§3.1) siguen sin Rareza/Nivel de carta propio: se reforjan igual que el resto (§6d) pero cada una lleva su propia tabla de mejora carta a carta, sin insignia de estrella.
- **Subir de Nivel = subir de Rareza, y es la única vía de progresión de una carta que ya tienes** *(decidido, sustituye la idea de uso acumulado)*: pagar al NPC especializado de su categoría, sin más requisito — ver §6d.
- **Diseño visual — estrellas en la carta *(especificado, sin implementar todavía)*.** La insignia de Rareza ya existe (borde/marco coloreado por `data-rarity`, `components/design/GameCard.tsx` + `styles/components/_card.scss`) pero no muestra el escalón exacto, solo el color. Se añaden **de 1 a 5 estrellas pequeñas** (mismo color que la Rareza) junto al nombre de la carta, una por Nivel — no sustituyen el color (sigue siendo la lectura rápida a distancia), dan la cuenta exacta sin memorizar el orden cromático. Pendiente de implementar en esos dos ficheros (token de tamaño/posición nuevo en `styles/settings/`, por `AGENTS.md`).

## 4. Mazo y turno

- El mazo de cada jugador = cartas de habilidad de clase + **items y mercenarios** obtenidos jugando (§3.2). Las **armas y armaduras van aparte**, en el sistema de equipo (§4a).
- **Mazo — dos zonas: el Mazo y "en juego" *(decidido)*:**
  - **Mazo del capítulo — hasta 20 cartas:** tu baraja personal = **cartas de clase + items + mercenarios** (más las **maldiciones** que te caigan). **Las armas y armaduras NO cuentan aquí** — van en el sistema de equipo aparte (§4a). Es un **tope duro**: los items/mercenarios nuevos entran jugando (botín, Tesoro, recompensas, compra, §6b), **no** con el Oteo; al llegar a 20, incorporar uno nuevo obliga a **cambiar una carta por otra** (swap 1-por-1).
  - **En juego — tope fijo de 5 *(decidido, sustituye el tope elástico)*:** tu zona de cartas **preparadas**, las únicas que puedes jugar. Arranca con las **2 cartas de habilidad de clase que elegiste en el setup** (§1b, paso 4) y se llena poco a poco con el Oteo. **Clase, items y mercenarios compiten** por esos huecos (más de un tipo preparado = menos hueco para los demás).

    Antes el tope era una fórmula elástica `techo(Mazo ÷ 2)` entre 3 y 10, pensada para que un 10 fijo no quedara **muerto** al empezar la partida (con un Mazo de 7-8 cartas nunca lo alcanzabas). Un **5 fijo** no tiene ese problema: arrancas con 2 en juego del propio setup y el Oteo llena los otros 3 en pocos turnos incluso con el Mazo inicial más pequeño, así que se alcanza —y se empieza a sustituir— pronto en cualquier punto de la progresión, sin necesitar una fórmula que dependa del tamaño del Mazo.
  - **Otear *(decidido)*:** al **empezar tu turno**, antes de mover o actuar, revelas **2 cartas al azar de tu Mazo** y **eliges 1** para ponerla **en juego**; la otra **vuelve al Mazo**. Así "en juego" crece ~1 carta por turno hasta llenar sus 5 huecos. Las cartas en juego las usas **cuando quieras** (una poción, un mercenario, una carta de acción…), dentro de la economía de acción (§4b.3); no caducan si no las usas.
  - **Mazo con menos de 2 cartas *(decidido)*:** si en el Mazo queda **1 sola** carta sin preparar, el Oteo revela **esa 1** (la tomas o la dejas); si el Mazo está **vacío**, **no hay Oteo** ese turno. Es un caso de borde real, no teórico: con un Mazo pequeño se alcanza en pocos turnos.

  > **Aviso de contenido — el Oteo necesita un Mazo mínimo.** Para que el Oteo sea una decisión de verdad, el Mazo debe tener **siempre ≥3-4 cartas sin preparar**. Con las **8 cartas de habilidad de clase** que trae cada héroe desde el arranque (ya no 4: §3.1, `cards/class.md`) el Mazo ya no se vacía enseguida por sí solo; el **kit inicial también regala items** (§1b, `characters/heroes.md` §2d) por variedad de utilidad, no ya por necesidad estructural. Ampliar el catálogo de cartas de clase (`cards/class.md`) sigue mereciendo la pena por sabor e identidad, pero con cuidado: subir el roster de un héroe demasiado infla su presupuesto de poder y diluye la clase.

  Sustituye la idea anterior de "20 construidas + 10 drafteadas aparte (~30 en juego)". Detalle en [`cards/README.md`](cards/README.md).

  > **Reglas del Oteo *(decidido)*:** de las 2 cartas puedes elegir **1** o **ninguna** (si no te convence ninguna, las rechazas y las dos vuelven al Mazo). Con "en juego" **lleno**, para quedarte una nueva **sustituyes** una carta que ya tengas en juego (la sustituida vuelve al Mazo). Al **jugar** una carta también vuelve al Mazo y puede reaparecer en un Oteo posterior — nada se pierde.
  >
  > **El Oteo reparte al azar *(decidido)*:** las 2 cartas que muestra salen **al azar** de tu Mazo (como robar de una baraja); de ellas eliges 1 o ninguna. Hay un componente de **suerte**, así que **cómo compones tu Mazo importa**: cuanto mejor sea la mezcla, mejores serán las 2 que te ofrezca cada turno.
  >
  > **Puedes consultar tu Mazo entero, siempre *(decidido)*.** En cualquier momento ves la **lista completa** de las cartas que tienes en el Mazo sin preparar, además de las que tienes en juego. Lo aleatorio es **el orden en que salen**, no su identidad: no hay información oculta que proteger, es tu propia baraja.
  >
  > Así el Oteo es una **decisión con información** —"rechazo estas 2 porque sé que me quedan dos mejores"— en vez de una apuesta a ciegas, que es lo que hace que componer el Mazo (qué compras, qué vendes, qué te quedas del botín) tenga consecuencias que puedes razonar. Además el **swap 1-por-1** al llegar a 20 lo exige: no puedes elegir qué carta sacrificas si no ves lo que tienes.
- **Sin "mano" clásica:** no se roba y descarta una **mano completa** cada turno como en un juego de cartas al uso; el Oteo solo saca **2 al azar**, preparas 1 y lo que preparas **se queda en juego** hasta que lo juegas. Una vez una carta está **en juego**, es una opción **siempre disponible** hasta que la juegues (dentro del recurso de acción del turno, §4b.3): curarte, ayudar en la aventura, subir estadísticas, atacar, etc.
- **Ninguna carta se pierde al jugarla *(decidido)*:** jugar una carta del mazo personal (equipo, clase, item) Tipo `Accion` cuesta tu Acción principal (`cards/class.md` §1); Tipo `Pasiva`/`Turnos` no gastan Acción (se pagan con el hueco de "en juego" que ocupan, ver abajo). La carta **vuelve al Mazo** cuando corresponda (§4) y puede volver a prepararse con el Oteo más adelante — **hoy** no hay descarte permanente ni cartas de "un solo uso" en el mazo personal (podría añadirse como excepción puntual en el futuro; de momento ninguna carta lo lleva). Textos como "un uso" o "se consume" en cartas de equipo/item **no aplican** y son restos de una idea descartada. **No hay ningún límite de repetición más allá del propio ritmo del Oteo** *(decidido — se quitó el tope `1/combate`/`1/descanso` que antes llevaban algunas Cartas de Habilidad de Clase, `cards/class.md` §1)*.

  > **Regla madre — jugar una carta la saca de "en juego" *(decidido, resuelve una contradicción entre documentos)*.** "Nada se pierde" **no** significa "se puede repetir". Al jugar una carta Tipo `Accion`, **abandona la zona "en juego"** y vuelve al Mazo; para volver a usarla tiene que **salirte otra vez en un Oteo** y ocupar de nuevo un hueco preparado. O sea: **"en juego" es munición preparada, no un equipamiento permanente.**
  >
  > **Excepción — Tipo `Pasiva` y Tipo `Turnos` *(decidido)*.** Estos dos tipos, al jugarlos, **no** vuelven al Mazo: se quedan ocupando su hueco de "en juego". `Pasiva` lo ocupa **para siempre** (hasta que decidas sustituirla en un Oteo posterior, como cualquier carta preparada); `Turnos` lo ocupa **durante los turnos que indique su Efecto** y, al cumplirse, se descarta y vuelve sola al Mazo. El coste real de estos dos tipos es el hueco que sacrifican, no la Acción — detalle y ejemplos en `cards/class.md` §1.
  >
  > Esto contradecía a [`cards/class.md`](cards/class.md) §1 ("las Básicas son reutilizables cada turno; lo único que impide spamearlas es que cuestan la Acción"), a §3.1 de este documento y a [`cards/mercenaries.md`](cards/mercenaries.md) §1 ("un aliado al que das la orden una vez por turno") — **los tres eran texto viejo y quedan corregidos**; manda esta regla. Con la lectura contraria, "en juego" se convertía en un *loadout* fijo que montas en 4-6 turnos y luego repites hasta el final: el Oteo dejaba de decidir nada a partir del turno 6, y una sola carta de curación preparada volvía el combate imposible de perder.
  >
  > **Consecuencia de diseño, importante:** tu **motor de daño sostenido es el ataque con el arma equipada** (gratis, siempre disponible, sin otearlo — §4a), y las cartas son **ráfaga y utilidad** a un ritmo sostenido de **~1 por turno** (el ritmo del Oteo), con la opción de **acumular** hasta llenar "en juego" y descargarlas de golpe. Por eso el equilibrio del combate (§4b) se calibra sobre el arma, no sobre las cartas.
- **Resolución de pruebas — decidido:** las pruebas y ataques **no** se resuelven robando una carta al azar, sino con **1d20 + modificador** de la estadística relevante contra una CD/Defensa. Las **cartas actúan como modificadores** de esa tirada (bonus, daño extra, ventaja/desventaja, estados), coherente con el §6 y con "juega cualquier carta cuando quieras". El detalle paso a paso del combate se define en la sección de combate (checklist).

## 4a. Equipo: armas y armaduras (fuera del Mazo) *(decidido)*

Las **armas** ([`cards/weapons.md`](cards/weapons.md)) y **armaduras** ([`cards/armor.md`](cards/armor.md)) **no forman parte del Mazo** (§4) ni pasan por el Oteo: son un **sistema de equipo aparte**, al estilo RPG clásico (van "puestas", no se roban ni se juegan como carta).

- **Colección ilimitada:** no hay tope de cuántas armas/armaduras posees. Se consiguen como el resto de equipo —botín, fichas de Tesoro, recompensas y **compra en el Herrero** (`characters/npcs.md`, §6b)— y se guardan **sin ocupar hueco del Mazo**.
- **Lo que llevas equipado:** hasta **llenar tus 2 manos** —un arma a **2 manos**, o **dos a 1 mano**, o **1 mano + escudo** (§2.4)— y **1 armadura**. Eso es lo activo; el resto de tu colección queda guardado.
- **Cuándo se cambia:** equipas/desequipas **antes del capítulo** y en **localizaciones seguras** (Pueblo/Taberna/Templo, durante el descanso largo, §4c.3). **No** puedes cambiar de equipo en mitad del combate o la exploración.
- **En combate:** atacas con el arma equipada (siempre disponible, sin otearla) y tu Defensa/CA usa la armadura equipada (§4b.4, §2.4). Las cartas de clase, items y mercenarios del Mazo **modifican** o complementan esos ataques.

## 4b. Combate (borrador)

Modelo elegido: **todo ocurre sobre el mismo tablero de hexágonos** (no hay pantalla de combate aparte). No es un "mini-juego" separado; el combate es una fase más de la exploración. Resuelve la duda abierta de `board/board-map.md` §8 ("¿el combate ocurre sobre el hex o en pantalla aparte?").

### 4b.1 Regla de interacción: adyacencia

- El héroe y cualquier otra entidad (enemigo, ficha) **nunca comparten hexágono**.
- Se **actúa sobre un objetivo en un hexágono contiguo** (uno de los 6 vecinos) — atacar cuerpo a cuerpo, interactuar con una ficha (NPC, Tesoro, etc.). Nunca sobre el propio hexágono.
- Ataques **a distancia y hechizos** tienen alcance en hexágonos (definido por el arma/hechizo, p. ej. Arco 3-4 hex), no requieren adyacencia.
- **Alcance mínimo "a distancia": 2 hex** *(decidido)*. El cuerpo a cuerpo ya cubre el hexágono contiguo (1 hex); para que un ataque cuente como **a distancia** tiene que quedar al menos un hexágono vacío entre el héroe y el enemigo (2 hex = 1 hex vacío + el hex del enemigo). Ninguna arma o hechizo a distancia puede tener alcance 1 — ese hueco ya es cuerpo a cuerpo.
- **A bocajarro *(decidido)*:** ese mínimo de 2 hex es el alcance **eficaz**, no una prohibición. **Sí puedes** disparar o lanzar un hechizo contra un enemigo **adyacente**, pero con **Desventaja** ([`effects.md`](effects.md)) — te está encima y no tienes espacio para apuntar.
  - Hacía falta decidirlo por dos motivos concretos. Uno: [`effects.md`](effects.md) ya citaba "disparar a bocajarro" como fuente de Desventaja **y la regla no existía en ninguna parte**. Dos: sin ella, el **Mago** —cuyo Bastón tiene alcance 2 ([`cards/weapons.md`](cards/weapons.md) §2)— se quedaba literalmente **sin ningún ataque posible** en cuanto un enemigo se le pegaba, salvo que el Oteo le hubiera dado una carta. Nadie debe quedarse sin turno por su equipo.
  - Sigue siendo cierto que **ningún arma o hechizo puede tener alcance 1** en su ficha: el 1 lo cubre esta regla, no el catálogo.
- **Inicio del combate:** el héroe termina su movimiento en un hexágono adyacente a un enemigo (o una ficha de Amenaza se revela como enemigo junto a él). No se "entra" en el hexágono del enemigo; se combate desde el contiguo. *(Actualiza la redacción de `board/board-map.md` §4, ficha de Enemigo, que decía "inicia combate al entrar en el hexágono".)*

### 4b.2 Iniciativa / orden de turno *(decidido)*

- Al empezar el combate: **1d20 + mod Destreza** para el héroe y para cada enemigo. Actúa primero el más alto. Empates → mayor Destreza bruta → héroe gana.
- **Se tira, no se compara** *(decidido)*: se descarta la alternativa de comparar modificadores a secas. Con tirada, la Destreza pesa pero no decide sola, y encaja con las otras dos tiradas enfrentadas del sistema (Desengancharse §4b.11, huida enemiga `characters/enemies.md` §5b.6).
- Una **emboscada** (atacar sin haber sido detectado, `characters/enemies.md` §2b) **se salta la iniciativa** el primer turno: actúas tú primero.

### 4b.3 Recurso de acción por turno *(el que faltaba en §4)*

Cada turno el héroe dispone de:

| Recurso | Qué permite |
|---|---|
| **Movimiento (2 hex)** | Moverse hasta 2 hexágonos (coste modificado por terreno, §2.2). Se puede repartir antes y después de la Acción. |
| **1 Acción principal** | Un ataque con arma equipada, lanzar un hechizo, activar una Carta de Habilidad de Clase, o interactuar con una ficha contigua. |
| **1 Acción rápida** (1/turno) | Hacer un **ataque secundario** con tu equipo (ver abajo). Es el único uso: ninguna carta cuesta ya Acción rápida (`cards/class.md` §1, `cards/items.md` §4). |
| **Cartas de Efecto/modificador** | Enganchadas a una tirada concreta (tuya o del enemigo). **Hasta 1 por tirada** — así "juegas cualquier carta cuando quieras" (§4) sin poder apilar infinitas. No gastan la Acción. |

Algunas **Cartas de Habilidad de Clase** son potentes y de uso limitado: **1 vez por combate o por descanso** (§3.1).

**Ataque secundario *(decidido — sustituye al "dual-wield con arma ligera")*.** Cualquier héroe puede gastar su **Acción rápida** en un segundo ataque con el equipo que lleve puesto, sin necesitar ninguna carta:

| Lo que llevas equipado | Ataque secundario | Daño |
|---|---|---|
| **Dos armas** (una en cada mano ✋) | Con el arma de la **otra** mano | dado del arma **+ mod de la stat** |
| **Un arma** (✋ con la otra mano libre o con escudo, o 🤲 a dos manos) | Un **segundo golpe** con la misma arma | dado del arma, **sin el mod** |

- La tirada de ataque es normal (`1d20 + mod`, §4b.4) en los dos casos; lo que cambia es el daño.
- **Por qué así:** el escudo (+2 CA, [`cards/weapons.md`](cards/weapons.md) §3) y las dos armas dejan de ser la misma cosa — **escudo = defensa, dos armas = ofensiva** —, y ya no hace falta la propiedad **"Ligera"**, que se referenciaba en dos reglas y **no existía en ningún catálogo** (`cards/weapons.md` §4). La columna de Manos ✋/🤲 hace ese trabajo con datos que ya están escritos.
- **Por qué existe:** con la regla madre de §4 (jugar una carta gasta su preparación), el turno en el que el Oteo no te da nada útil se quedaba en *un solo* ataque de ~3,5 de daño frente a Élite de 30-35 PV. El ataque secundario sube el daño sostenido de la plantilla a **4,0-5,9** sin depender de la suerte: siempre puedes **pegar otra vez** aunque el Oteo no te dé nada que jugar.
- **Excepción:** la **Ballesta pesada** no admite ataque secundario (regla de Recarga, [`cards/weapons.md`](cards/weapons.md) §4).

### 4b.4 Resolución de un ataque (paso a paso)

1. Declarar objetivo: en hex contiguo (melee) o dentro de alcance (distancia/hechizo).
2. **Tirada de ataque:** `1d20 + mod stat relevante + bonos de cartas`. Stat según el arma/hechizo: FUE (melee pesada), DES (ligera/distancia), INT (arcano), SAB (divino) — coherente con §2.1.
3. Comparar con la **Defensa/CA** del objetivo (`10 + mod DES + armadura`, §2).
4. Si `tirada ≥ CA` → impacto. **Daño** = `dado(s) del arma/hechizo + mod stat + bonos de carta`. Aplicar el tipo de daño contra las resistencias/vulnerabilidades del objetivo (§4b.10).

   > **El modificador se suma siempre, hechizos incluidos *(decidido)*.** No hay excepción de "truco/cantrip" al estilo D&D: *Descarga arcana* hace `1d8 + mod INT` y *Llama sagrada* `1d8 + mod SAB` ([`cards/class.md`](cards/class.md)). Los textos de esas cartas decían solo "1d8" y **contradecían este paso**; corregidos. Sin el modificador, el atacante a distancia del juego pegaba **menos que una espada** (4,5 frente a 6,5), que es justo lo contrario de su rol. Las **dos excepciones explícitas** son el **ataque secundario** con una sola arma (§4b.3) y los **mercenarios**, que usan los valores fijos de su carta y no tus estadísticas ([`cards/mercenaries.md`](cards/mercenaries.md) §3).
5. **Crítico:** d20 natural 20 → impacto automático, se **doblan los dados de daño** (solo los dados, no el modificador). Natural 1 → fallo automático. **Aplica igual a los enemigos *(decidido)*** — la misma matemática en los dos bandos, como el resto de §4b (`characters/enemies.md` §5b.5).
6. **Ventaja/Desventaja:** tira 2d20 y coge el mejor (ventaja) o el peor (desventaja). La aportan cartas de Efecto, estados o el terreno del hex (emboscada desde Bosque = ventaja; atacar cruzando Llanura/Camino a la vista = posible desventaja — `board/board-map.md` §4).
7. Restar el daño de los PV del objetivo. A 0 PV → derrotado.

> **Precisión global — decidido:** de momento **no** se añade ningún `+2` global al ataque en ninguno de los dos bandos (no hay bono de competencia). La precisión resultante (~55 %) se revisa **jugando el prototipo**, no sobre el papel.

### 4b.5 Movimiento de enemigos: activación por detección *(decidido)*

Los enemigos **sí se mueven**, pero solo tras **detectar al héroe**. Modelo de tres estados (detalle de comportamiento en `characters/enemies.md` §2):

- **Latente:** anclado en su hexágono, no patrulla, mientras no **detecte** al héroe. Entrar en su rango de detección obliga a una **prueba de sigilo** (`characters/enemies.md` §2b); solo si el héroe la falla (o no es sigiloso) el enemigo despierta. Terreno como el Bosque acorta ese rango (`board/board-map.md` §3/§4).
- **Activo (detectado el héroe — prueba de sigilo fallada, `characters/enemies.md` §2b):** se mueve hacia él por el mapa (persecución) e inicia combate al quedar adyacente. Dentro del combate sigue moviéndose (acercarse + golpear si melee, o reposicionarse si a distancia). El **bucle de decisión** turno a turno dentro del combate (IA determinista: mover / atacar / habilidad / huir) está en `characters/enemies.md` §5b.6.
- Esto reintroduce la **detección activa** que `characters/enemies.md` §2 tenía aplazada, y da valor mecánico al sigilo/ocultación (evitar o emboscar en vez de pelear siempre).

> **El *kiting* por velocidad no funciona, y es a propósito *(decidido)*.** Un enemigo puede **mover su Velocidad completa y atacar en el mismo turno** (`characters/enemies.md` §5b.6, paso 4). Con la Velocidad igualada a 2, uno melee que esté a 3 hex se te pega y te golpea en un turno; si tú retrocedes 2, él vuelve a pegarse — y encima retroceder te cuesta una tirada de **Desengancharse** (§4b.11). O sea que **alejarte a pie es estrictamente peor que quedarte quieto**.
>
> No se arregla dando velocidad extra al héroe (eso convierte a todo enemigo lento en gratis). La forma de crear distancia es el **control**: *Enredo gélido* → **Inmovilizado**, Ralentizado, *Escabullirse* / *Desaparecer* → **Oculto** ([`effects.md`](effects.md), [`cards/class.md`](cards/class.md) §3).
>
> Consecuencia para el rol del Mago: **no es un *kiter*, es un frágil que castiga desde lejos y compra turnos con control** (`cards/class.md` §3, reescrito). Sobrevive por PV (16, §2), por *Escudo arcano* y por poder disparar a bocajarro (§4b.1), no por correr más.

*(Idea futura, aún sin decidir — nota del diseñador:* enemigos o eventos "cazadores" que buscan proactivamente al héroe por el mapa **antes** de detectarlo por visión. Por ahora la activación es siempre reactiva, por detección.)

### 4b.6 El mazo de encuentro en combate

Resuelve el cross-reference pendiente entre §4 (solo hablaba del mazo personal) y `board/board-map.md` §5:

- Al iniciar un combate, el sistema revela **1 carta del mazo de encuentro** (`board/board-map.md` §5) que fija una condición de ESA pelea: emboscada, "el enemigo intenta huir", "el terreno se derrumba", refuerzos, etc.
- Enemigos élite/jefes pueden hacer robar más de una.
- Es **del sistema, no del jugador** (a diferencia del mazo personal) — conviven los dos en la misma pelea.

### 4b.7 Hechizos (sin recurso de puntos)

En el prototipo los hechizos son simplemente **Cartas de habilidad de clase** (todas de uso libre — *Bola de fuego* igual que *Descarga arcana* o *Llama sagrada*, sin ningún tope de repetición) o **Pergaminos** (Item). Viven en el Mazo y se **preparan con el Oteo** como cualquier otra carta (§4): **no hay un subsistema de "preparar hechizos" aparte**, ni maná, ni espacios de conjuro. Se lanzan gastando la Acción que indique la carta y se resuelven con `1d20 + INT/SAB` vs CD/Defensa (§4b.4).

**Foco *(decidido)*:** el **Libro de hechizos** (Mago) y el **Símbolo sagrado** (Clérigo) son **armas equipadas** (§4a, [`cards/weapons.md`](cards/weapons.md) §3) que dan **+1 a las tiradas y CD de tus hechizos** mientras las empuñas —como el Bastón del poder—; potencian, no son requisito para lanzar. La granularidad de caster (tipos de magia, debilidades elementales, subclases de mago) queda como desarrollo posterior.

### 4b.8 Huir, victoria y derrota

- **Huir:** usar el Movimiento para salir de adyacencia/alcance. Si un enemigo **Activo** está adyacente, salir de su lado exige **Desengancharse** (§4b.11).
- **Victoria:** todos los enemigos a 0 PV → recompensas (loot de la ficha de Tesoro si aplica, posible carta del mazo de encuentro, y avance de hito si era un jefe).

**Cuándo termina exactamente un combate *(decidido)*.** Hacía falta definirlo porque de ello depende cuándo vuelves a estar **fuera de combate** —la condición que exige la Hoguera para acampar (§4c.2)— y no estaba escrito. El combate termina cuando **no queda ningún enemigo Activo que te tenga localizado**, por cualquiera de estas tres vías:

| Vía | Cuándo se considera terminado |
|---|---|
| **Victoria** — todos a 0 PV | Ya, al instante |
| **El enemigo escapa** — completa su *leash* de 2 turnos (`characters/enemies.md` §5b.6) | Al completarse el leash |
| **Escapas tú** — te mantienes fuera de la detección y la línea de visión de todos los enemigos Activos durante **2 turnos** (el mismo leash de `characters/enemies.md` §2, aplicado en tu dirección) | Al completarse esos 2 turnos, no al salir corriendo |

> **Por qué el fin de combate no es inmediato al huir.** Si lo fuera, el bucle óptimo sería: te alejas un hexágono y ya puedes acampar y curarte gratis a un paso de los mismos enemigos, antes de volver a por ellos. Exigir los 2 turnos completos de leash lo cierra sin inventar ninguna regla nueva —reutiliza el leash que ya existe— y le pone un precio real: **+2 de Nivel de Amenaza por huir** (§6c.2, corregido — la cifra vieja +8 era de antes del reescalado a tope 40) más los dos turnos perdidos. Si el enemigo te vuelve a detectar antes de completarlos, **es el mismo combate**: el contador de turnos se reinicia. *(Antes esta regla también cerraba el exploit de recargar cartas `1/combate` huyendo un hex; ese tope ya no existe en ningún sitio, `cards/class.md` §1 — el anti-abuso de acampar sigue siendo motivo suficiente por sí solo.)*
- **Derrota (héroe a 0 PV):** con un solo héroe (`characters/heroes.md`), 0 PV = caído. Partida rápida → fin de partida; Modo Campaña → reiniciar el mapa/capítulo (el nivel y el mazo persisten). La recuperación entre combates se define en §4c (Descanso y recuperación).

### 4b.9 Estados de combate (borrador)

Aturdido (pierdes tu Acción y Acción rápida —no atacas ni usas habilidades/objetos— pero **sí puedes moverte**), Envenenado (daño al inicio de tu turno), Inmovilizado (no puedes usar Movimiento — ej. telaraña de la Araña, `characters/enemies.md` §5), Ventaja/Desventaja (afectan la próxima tirada). Duran un nº de turnos o hasta superar una salvación (`1d20 + mod CON/DES` vs CD) — a afinar. No ocupan hueco de mazo (a diferencia de la Maldición, §3.2).

### 4b.10 Tipos de daño y resistencias

Cada arma/hechizo lleva un **tipo de daño** fijo (`cards/weapons.md`, `cards/class.md`). Dos familias, según de dónde sale el daño:

| Familia | Tipos | Fuente |
|---|---|---|
| **Físicos** (mundanos) | 🗡️ Cortante, 🏹 Perforante, 🔨 Contundente | Armas mundanas (`cards/weapons.md`) |
| **Mágicos/elementales** | 🔮 Arcano, ☀️ Radiante, 🔥 Fuego, 💀 Necrótico | Hechizos de clase (`cards/class.md`) y ataques de jefes (`characters/enemies.md` §5b.4). Arcano = Mago, Radiante = Clérigo/divino, Fuego = hechizos ígneos (ej. Bola de fuego), Necrótico = exclusivo de enemigos de momento |

**Multiplicadores** al aplicar el tipo de daño contra el objetivo:
- **Resistente** → mitad de daño (redondeo hacia abajo).
- **Vulnerable** → daño doble.
- **Inmune** → 0 daño. *(Reservado: ningún enemigo del bestiario lo usa todavía.)*

Quién es resistente/vulnerable a qué **no se decide arma por arma ni enemigo por enemigo suelto**: lo fija la **Naturaleza de criatura** del objetivo (`characters/enemies.md` §3b), con posibles excepciones puntuales como habilidad especial de un enemigo concreto (ej. el Trol de las minas y el fuego, `characters/enemies.md` §5b.3). Los héroes no tienen resistencias propias por ahora (podría llegar más adelante vía armadura/objeto mágico).

### 4b.11 Desengancharse *(decidido — sustituye al "golpe de oportunidad")*

**No existe el golpe de oportunidad.** Se descarta como concepto: era una **reacción** (actuar fuera de tu turno) y el sistema no tiene timing de reacciones en ningún otro sitio, así que introducirlo solo para esto complicaría el motor a cambio de nada. En su lugar, una única regla simétrica:

> **Salir de un hexágono adyacente a un enemigo Activo** (`characters/enemies.md` §2) exige una **tirada enfrentada `1d20 + mod DES`**: el que se va contra el que retiene.
> - **Gana el que se va** → se mueve libremente.
> - **Gana el que retiene** → el que se va **recibe el daño del ataque básico del rival sin tirada de ataque** (dado de daño + mod, se aplica directo, sin comparar con la CA) y **completa el movimiento igualmente**.
> - **Máximo 1 vez por enemigo y por turno.** No gasta Acción de nadie: es parte del movimiento.
> - **Empate** → gana el que se va (el movimiento se completa limpio).

Por qué así:
- **Una sola regla cubre los dos sentidos.** Antes había dos reglas distintas para lo mismo: la prueba de DES del héroe al huir (§4b.8) y la tirada **enfrentada** de DES del enemigo al huir (`characters/enemies.md` §5b.6). Ahora es la misma en ambas direcciones.
- **"Fallo = daño pero te mueves"**, no "fallo = te quedas clavado". Quedarse pegado a un enemigo por una tirada fallida es un bucle frustrante y, con 8 PV, letal para el Mago; así el jugador nunca pierde el control de su movimiento, solo paga por él.
- **Da texto real a las cartas de escape.** *Escabullirse* (Pícaro), *Botas de teletransporte* y equivalentes pasan a **desengancharse sin tirar** (éxito automático), que es un efecto concreto y valioso en vez de una referencia a una regla que no existía.

### 4b.12 Referencia de balance: las cuentas que sostienen §4b *(primer pase)*

Los números de §4b, §2 y `characters/enemies.md` §5b **no son independientes**: se eligieron juntos para que el boss de la Partida rápida se pelee en una ventana de 5-6 turnos por bando. Esta tabla existe para poder **comprobar** un cambio futuro en vez de re-deducirlo. Daño por turno = `probabilidad de impacto × daño medio`, incluyendo el crítico.

**Daño por turno del héroe** — solo con el **equipo del kit inicial** (`characters/heroes.md` §2d), **sin jugar ninguna carta**: es el suelo, y las cartas son el margen.

| Héroe | Acción (arma) | Acción rápida (ataque secundario, §4b.3) | Daño/turno vs CA 13 |
|---|---|---|---|
| Guerrero | Espada 1d8+2 | 2º golpe con la Espada, 1d8 sin mod | **5,9** |
| Clérigo | Maza bendita 1d6+2 | 2º golpe, 1d6 sin mod | **4,8** |
| Mago *(a 2 hex)* | Bastón 1d6+2 | 2º golpe, 1d6 sin mod | **4,8** |
| Pícaro *(adyacente)* | Dagas 1d4+2 | Ballesta a bocajarro, Desventaja | **3,6** |

- El **Pícaro** es el más bajo a propósito: su daño está en *Ataque furtivo* desde **Oculto** (+2d6 ≈ **10** ese turno), no en el intercambio de golpes. Con las dos armas en su rango (a 3 hex con la Ballesta) sube a ~5,0.
- El **Mago adyacente** cae a ~2,3 (Desventaja a bocajarro, §4b.1). Es su penalización por dejarse alcanzar, no un error.

**El boss de la Partida rápida** (uno de los 3 Élite al azar, `characters/enemies.md` §5b.3) contra el **Guerrero** (22 PV, CA 15), sin jugar ninguna carta:

| Boss | PV / CA | Turnos que tarda el Guerrero en matarlo | Turnos que tarda en morir | Veredicto |
|---|---|---|---|---|
| Capitán bandido + 1 refuerzo | 24 / 13 | 5,8 | 6,1 | **Gana con ~2 PV** — las cartas son el colchón |
| Araña matriarca | 28 / 14 | 5,3 | 5,3 *(+ veneno)* | **Empate técnico** — hay que jugar |
| Trol de las minas *(regen +1)* | 28 / 13 | 5,7 | 5,4 | **Pierde por poco sin cartas** — una Poción o *Postura defensiva* lo dan la vuelta |

Es la ventana que se buscaba: **el equipo solo no basta y el mazo decide la pelea**, que es justo lo que tiene que pasar en un juego de cartas.

> **La peor combinación conocida: Mago vs. Trol.** 7,4 turnos para matarlo contra 4,4 de aguante con *Escudo arcano* activo. Necesita *Bola de fuego* (corta la regeneración y quita 10,5 PV), pociones y buena suerte en el Oteo. Se deja así **a propósito** —el frágil contra el saco de PV es su peor emparejamiento— pero es el primer sitio donde mirar si al testear se siente injusto.
>
> **Si cambias un número, revisa estas relaciones**, no la tabla:
> - Daño/turno del héroe **× 5-6 ≈ PV del boss**.
> - Daño/turno del boss **× 5-6 ≈ PV del héroe**.
> - **Nunca más de 2 enemigos** a la vez (`characters/enemies.md` §5b.6): el héroe tiene 1 turno y N enemigos tienen N, y el ataque secundario solo compensa hasta 2.

## 4c. Descanso y recuperación

**Sin ciclo día/noche automático.** A diferencia de D&D (donde el descanso largo cura "de por sí" al pasar la noche), aquí **la recuperación se hace jugando cartas o visitando localizaciones seguras** — coherente con la filosofía "todo es una carta". El día/noche podría volver en el futuro solo como ambientación/modificador, no como cura automática (idea futura). Tres vías, de menor a mayor alcance:

### 4c.1 Consumibles — en cualquier momento (incluido combate)

- **Poción de vida** ([`cards/items.md`](cards/items.md) §4): Tipo `Accion`, cuesta tu Acción principal y recupera PV al instante. Curarte en combate significa renunciar a atacar ese turno, no un extra barato.
- Otros consumibles (pergaminos de curación, antídotos que quitan Envenenado, etc.) siguen el mismo patrón.

### 4c.2 Acampar — carta Hoguera (fuera de combate) = descanso corto

- La carta **Hoguera/Campamento** ([`cards/items.md`](cards/items.md)) solo se juega **fuera de combate**.
- **Efecto:** gastas Dados de Vida (§4c.4) para curarte.
- **Riesgo (tensión + anti-abuso):** acampar en terreno inseguro obliga a robar 1 carta del **mazo de encuentro** ([`cards/encounter.md`](cards/encounter.md)) o a una prueba de detección — puede saltar una **emboscada**. El terreno modifica el riesgo: Bosque es seguro (ocultación), Llanura/Camino quedan expuestos (`board/board-map.md` §3-4). Esto limita de forma natural y temática el acampar en bucle.
- Además, no puedes volver a acampar hasta que **ocurra algo** (entrar en combate o explorar un grupo nuevo) — evita re-acampar sin avanzar.

### 4c.3 Localización segura — descanso largo

- En **Pueblo/Aldea**, **Taberna** o **Templo/Santuario** (`board/board-map.md` §3b, `characters/npcs.md`):
- **Efecto:** recuperas **todos los PV**, **recuperas todos los Dados de Vida** gastados y retiras estados negativos. **Sin riesgo** (zona segura).
- Puede costar **oro** (economía pendiente) en la Taberna, o ser gratis según el lugar. El Templo puede además limpiar una Maldición ([`cards/curses.md`](cards/curses.md)).

### 4c.4 Dados de Vida (DV)

**En el prototipo: cura fija, sin contar DV *(decidido)*.** La **Hoguera** (§4c.2) cura **la mitad de los PV máximos** (redondeo hacia arriba) y se puede volver a jugar cuando la regla de "que ocurra algo" lo permita. Sin contador de DV que gestionar.

Motivo: el modelo de DV fiel a D&D se rompe justo en el prototipo. Con la progresión aparcada (§5, [`status.md`](status.md)) el héroe está **permanentemente a nivel 1**, o sea **1 solo DV**: acampas una vez, curas `1d10 + mod CON`, y hasta el próximo descanso largo la Hoguera **no hace nada**, aunque te cueste +10 de Nivel de Amenaza (§6c.2). Un sistema de recuperación con un único uso por partida no se puede testear.

**Modelo completo de DV *(diferido, llega con la progresión de nivel)*:**
- Cada héroe tiene **DV = su nivel**, del tamaño de su dado de clase (Guerrero d10, Pícaro/Clérigo d8, Mago d6; `characters/heroes.md` §2c).
- **Acampar:** gastas 1 o más DV disponibles; por cada uno tiras el dado + mod CON y recuperas esos PV.
- **Descanso largo (4c.3):** recuperas todos los DV gastados.
- Cobra sentido a partir de nivel 3-4, cuando tener varios DV convierte "cuánto curo ahora" en una decisión de recurso. Hasta entonces, cura fija.

> **Ojo al reactivarlo:** cartas y maldiciones ya referencian DV — *Saco de dormir* (+1 DV al acampar, [`cards/items.md`](cards/items.md)) y *Fatiga eterna* (−1 DV, [`cards/curses.md`](cards/curses.md)). Con cura fija, ambas quedan **inactivas** (mismo caso que las cartas que esperan el sistema de grupos/tiles, `board/board-map.md` §8): *Saco de dormir* pasa a "+2 PV al acampar" y *Fatiga eterna* a "la Hoguera cura un cuarto en vez de la mitad" mientras dure el prototipo.

## 5. Progresión de personaje *(formalizada, decidido)*

- **Subir de Nivel por hitos de historia** (como D&D 5e "milestone leveling"), no por XP acumulada — encaja mejor con partidas cortas de cartas. **Cada hito ya alcanzado concede +1 Nivel**, no hace falta ningún disparador nuevo.
- **Mismo rango 1-5 que las cartas (§3.3), mismo lenguaje de estrellas** — un héroe/enemigo de Nivel 3 se lee con ★★★ igual que una carta Rara. Es un eje **aparte** del Nivel de carta (subir de Nivel una Espada no sube el Nivel del héroe, y viceversa) y del reloj de Amenaza (§6c.5, que mide tiempo, no historia).
- **PV por nivel** — `dado de vida de la clase (promedio, redondeo arriba) + mod Constitución`, sumado cada nivel a partir del 2 (el Nivel 1 ya fija su PV con la fórmula de §2: dado máximo + mod CON + 10 de aguante):

  | Héroe | Dado | PV Nivel 1 | +PV por nivel (2→5) | PV en Nivel 5 |
  |---|---|---|---|---|
  | Guerrero (CON +2) | d10 | 22 | +8 | 22+8×4 = **54** |
  | Clérigo (CON +2) | d8 | 20 | +7 | 20+7×4 = **48** |
  | Pícaro (CON +1) | d8 | 19 | +6 | 19+6×4 = **43** |
  | Mago (CON +0) | d6 | 16 | +4 | 16+4×4 = **32** |

  Los enemigos usan la misma lógica de Dados de Vida — ver `characters/enemies.md` §5d.
- **Mejora de estadística — en los Niveles 3 y 5 *(decidido, sustituye "posible mejora")*:** +1 a la estadística principal del héroe (`characters/heroes.md` §2b), aplicado dos veces en todo el arco de 5 niveles — no es D&D con ASI cada 4 niveles, es una escala corta y las dos subidas se sienten en un arco de 5.
- **El Nivel de personaje ya no desbloquea cartas nuevas** *(decidido — elimina la distinción Básica/Especial de las cartas de clase)*: las **8 cartas de habilidad** de cada héroe están disponibles desde el arranque (`cards/class.md`), y suben de Nivel de forma independiente pagando al Instructor (§6d.5). Subir de Nivel el personaje solo da PV y mejora de estadística — son dos ejes que ya no se tocan entre sí.
- El equipo se consigue jugando —botín, tesoro, compra (§6b)—, no por nivel: **armas y armaduras** se equipan aparte (§4a) y los **items/mercenarios** entran al Mazo (§4). Dos ejes de progresión en paralelo (personaje vs. equipo/mazo), igual que en Viajes (colección de cartas de Objeto) combinado con el nivel de personaje de D&D. **Nivel de carta (§6d) es un tercer eje**, sobre cartas concretas, no sobre el personaje.

## 6. Ventajas/Desventajas y objetivo de las cartas

Las cartas de Objeto/Efecto pueden apuntar a:
- **A ti mismo**: +stat, ventaja en próxima prueba, curación.
- **A un aliado**: buff temporal, protección (redirigir daño).
- **A un enemigo**: -stat, desventaja, daño directo, estado (aturdido/envenenado).

Esto es clave para que el "deckbuilding" tenga sentido táctico: no solo mejoras tu personaje, sino que tu mazo también decide cómo afectas al resto de la mesa.

## 6b. Economía y oro

**Recurso: Oro.** Moneda única, un **contador en la hoja de personaje** (no una carta — como los PV o los Dados de Vida, §4c.4). Simple y de sabor D&D; gemas/tesoros de alto valor podrían añadirse como variante futura. Resuelve la duda de economía que bloqueaba a `characters/npcs.md`, al descanso largo (§4c.3) y a la limpieza de Maldiciones ([`cards/curses.md`](cards/curses.md)).

**Persistencia:** en **Modo Campaña** el oro persiste entre mapas (como el nivel y el mazo); en **Partida rápida** se reinicia por partida.

**Oro inicial — 0 *(decidido)*:** todos los héroes **empiezan sin oro** (tanto en Partida rápida como al comenzar la Campaña). No hay colchón de salida: el oro se gana enteramente jugando (§6b.1), así que las primeras compras dependen de explorar y combatir antes.

### 6b.1 De dónde sale (fuentes)

| Fuente | Oro (orientativo, sin balancear) |
|---|---|
| Enemigo Normal derrotado | 1d6 |
| Enemigo Élite | 3d6 + loot bueno garantizado |
| Jefe de capítulo | ~5d10 |
| Jefe final | mucho + recompensa única |
| Ficha de Tesoro (`board/board-map.md` §4) | carta y/o oro (cofres de mayor rareza pueden dar ambos) |
| Vender cartas a un NPC | según Rareza (§6b.3), al ≈40 % del precio de compra |
| Misiones (Dador de misión, `characters/npcs.md`, solo Campaña) | recompensa fija |

### 6b.2 En qué se gasta (sumideros)

- **Comprar cartas** en tiendas (Mercader — Items, Herrero — armas/armaduras, Mago/Encantador — hechizos; `characters/npcs.md`): precio por Rareza (§6b.3).
- **Comprar cartas de Mercenario** (`characters/npcs.md`, [`cards/mercenaries.md`](cards/mercenaries.md)): coste según su Rareza; van a tu mazo (vía segura frente a reclutarlas con una prueba).
- **Limpiar una Maldición** en el Templo / **Sacerdote-Sanador** (`characters/npcs.md`, [`cards/curses.md`](cards/curses.md)): coste fijo (o prueba).
- **Herrero** (`characters/npcs.md`): sube de Nivel una carta de equipo que ya tengas (§6d) — coste = trade-in de §6b.3.
- El **descanso largo** básico en Pueblo es gratis (§4c.3); solo los servicios premium cuestan oro.

### 6b.3 Precios por Rareza

Ligados a la Rareza de §3.3. Se **vende siempre por menos** de lo que cuesta comprar (≈40 %), para que farmear vendiendo no sea gratis:

| Rareza | Comprar | Vender |
|---|---|---|
| Común (gris) | 10 | 4 |
| Poco común (verde) | 25 | 10 |
| Raro (azul) | 60 | 25 |
| Épico (morado) | 150 | 60 |
| Legendario (dorado) | 400 | 160 |

- **Sin tope de rareza de momento:** cualquier carta puede aparecer en una tienda, **también los Legendarios**, a su precio de la tabla (400 de oro ya es de por sí una barrera). Cerrar el mercado por encima de Épico queda como palanca de balance futura ([`ideas.md`](ideas.md)).
- Las tiendas tienen **stock limitado** (no un catálogo infinito), para que explorar y encontrar botín sigan importando y comprar no eclipse la exploración. La oferta concreta de cada NPC —cuántas cartas y cuándo se renueva— está en `characters/npcs.md` §3: **se sortea al empezar el capítulo y no cambia hasta el siguiente**.

### 6b.4 Vender: quién compra qué *(decidido)*

**Regla única: cada NPC compra lo que vende.** No hay un "comprador universal" ni una tienda genérica; el NPC que trata una categoría de carta también te la compra al ≈40 % (§6b.3).

| NPC (`characters/npcs.md`) | Compra |
|---|---|
| Vendedor/Mercader | Items ([`cards/items.md`](cards/items.md)) |
| Herrero | Armas y armaduras ([`cards/weapons.md`](cards/weapons.md), [`cards/armor.md`](cards/armor.md)) |
| Capitán de mercenarios | Mercenarios ([`cards/mercenaries.md`](cards/mercenaries.md)) |
| Mago/Encantador | Pergaminos y hechizos |
| Tabernero · Sacerdote/Sanador · Informante · Dador de misión | **Nada** — solo ofrecen servicios |

- Las **Maldiciones no se venden nunca** ([`cards/curses.md`](cards/curses.md)): se limpian pagando al Sacerdote o con la prueba arriesgada.
- **Consecuencia a tener en cuenta:** si el mapa generado no tiene Herrero, no puedes liquidar armaduras esa partida. Por eso la generación garantiza **1 Pueblo** (`board/board-map.md` §2c), que es donde se concentran los NPCs de tienda.

### 6b.5 Cómo encaja con el mazo

- Comprar una carta la añade al Mazo → **cuenta para el máximo** (§4) — esto vale para **items y mercenarios**; las **armas/armaduras** compradas al Herrero **no cuentan** para el Mazo (colección ilimitada, §4a). El oro da *elección*, pero el tamaño del Mazo sigue siendo el límite real de las cartas que sí lo ocupan.
- **Vender cumple dos funciones distintas**, según qué vendas:
  - **Items y mercenarios** → alivia el **tope del Mazo**: cambias lo que ya no usas por oro para comprar algo mejor. Cierra el bucle botín/tesoro → tienda → Mazo, que antes lo inflaba sin salida.
  - **Armas y armaduras** → **no** alivia nada del Mazo (su colección es ilimitada desde §4a): es puro **oro por equipo obsoleto**. Es, de hecho, la fuente de ingresos más regular, porque el equipo viejo se acumula sin límite y sin coste.

### 6b.6 Tabla de loot: qué carta cae *(decidido)*

§6b.1 ya dice **cuánto oro** suelta cada fuente; esto es la otra mitad: **qué carta**. Sin ella no se podía implementar la ficha de Tesoro, el botín al matar, los Sucesos *Hallazgo* / *Botín inesperado* ni el umbral del 25 % de Amenaza ("empeora el loot", §6c.3).

**Paso 1 — ¿cae carta?**

| Fuente | Carta |
|---|---|
| Enemigo **Normal** | Tira 1d6: con **4-6** suelta 1 carta *(50 %)* |
| Enemigo **Élite** (incluido el boss de la Partida rápida) | **1 garantizada** |
| **Jefe de capítulo** | **1 garantizada** + otra tirada de 1d6 (4-6) |
| **Jefe final** | **2 garantizadas** + recompensa única de la Campaña |
| **Ficha de Tesoro** (`board/board-map.md` §4) | **1 garantizada**; si la rareza sorteada sale **Raro o superior**, **2 cartas** |
| **Mazmorra** (`board/board-map.md` §3b) | **2 garantizadas**, tirando en la fila de Élite |
| Suceso **Hallazgo** ([`cards/encounter.md`](cards/encounter.md) §4) | **1 garantizada**, tirando en la fila de Normal |
| Suceso **Botín inesperado** (Combate, §3) | **1 carta extra** al ganar, misma fila que la fuente del combate |
| **Ficha de Terreno**, al acertar la prueba (`board/board-map.md` §4b) | **1 garantizada**, pero **de un catálogo fijo**: siempre una carta de movimiento ([`cards/items.md`](cards/items.md) §5), nunca del catálogo general — no pasa por el Paso 3 |

**Paso 2 — ¿de qué rareza?** (§3.3). La rareza la marca **la fuente**, no la zona del mapa: los Élite ya aparecen lejos de la entrada (`characters/enemies.md` §5c), así que la progresión sale sola.

| Fuente | Común | Poco común | Raro | Épico | Legendario |
|---|---|---|---|---|---|
| Normal · Hallazgo | 80 % | 20 % | — | — | — |
| Ficha de Tesoro | 45 % | 40 % | 15 % | — | — |
| Élite · Mazmorra | — | 55 % | 35 % | 10 % | — |
| Jefe de capítulo | — | 25 % | 50 % | 25 % | — |
| Jefe final | — | — | 40 % | 45 % | 15 % |
| Ficha de Terreno (éxito) | 45 % | 40 % | 15 % | — | — |

> **Ficha de Terreno, un caso especial:** usa la misma rareza que la Ficha de Tesoro (45/40/15) porque no hace falta más — hay **exactamente una** carta de movimiento por escalón (Bota veloz Común, Atajo del pícaro Poco común, Zancada del viento Raro, `cards/items.md` §5), así que la tirada de rareza **ya elige la carta**, sin pasar por el Paso 3 ni sortear dentro del catálogo.

> **En el prototipo, Épico y Legendario casi no existen.** Las armas y armaduras solo llegan a **Raro** ([`cards/weapons.md`](cards/weapons.md) §5b, [`cards/armor.md`](cards/armor.md) §6b); los únicos Épico/Legendario escritos son objetos mágicos ([`cards/items.md`](cards/items.md) §3). **Regla de caída:** si la rareza sorteada no existe para el tipo de carta que toca, **baja al escalón más alto disponible**. Con el reparto de tipos de abajo, un Élite saca Épico un 10 % de las veces y casi siempre acabará siendo un item mágico o un Raro — que es exactamente el ritmo que se quiere hasta que se amplíen los catálogos.

**Paso 3 — ¿de qué tipo?** Importa mucho, porque solo dos de los cuatro tipos ocupan hueco del Mazo (§4, §4a):

| Tipo | Peso | ¿Cuenta para el Mazo? |
|---|---|---|
| **Item** ([`cards/items.md`](cards/items.md)) | 50 % | **Sí** |
| **Arma** ([`cards/weapons.md`](cards/weapons.md)) | 22 % | No — equipo (§4a) |
| **Armadura** ([`cards/armor.md`](cards/armor.md)) | 18 % | No — equipo (§4a) |
| **Mercenario** ([`cards/mercenaries.md`](cards/mercenaries.md)) | 10 % | **Sí** |

Dentro del tipo y la rareza, se sortea **uniformemente** entre las cartas del catálogo que encajen. Para armas y armaduras eso es elegir **familia + escalón** (`cards/weapons.md` §5b).

#### Calibrado: ¿a cuánto llega el Mazo? *(la comprobación)*

El objetivo elegido es **botín moderado: el Mazo acaba en 14-16 cartas** (arranca en 8, `characters/heroes.md` §2d). Estas son las cuentas que lo sostienen, para poder verificar un cambio futuro en vez de re-deducirlo:

| | Cuentas |
|---|---|
| Fichas en un mapa 12×12 | ~130 hexes con ficha posible × 17,5 % ≈ **23 fichas** |
| Reparto por tipo (tabla B de `board/board-map.md` §2c) | ~4,5 Enemigo · ~6,7 Amenaza · ~3,5 Tesoro · ~2,4 Exploración · ~5,3 Personaje · ~1,8 Terreno |
| Con qué te cruzas de verdad en **40 turnos** (§6c) | ~55 % del mapa → **~13 fichas** |
| Combates | ~2,5 de ficha de Enemigo + ~1,5 de Amenaza que sale ¡Emboscada! + **1 boss** ≈ **5 peleas** |
| **Cartas encontradas** | ~2 de Tesoro + ~2 de Normales + ~1,5 de Élite/boss + ~1 de Sucesos + ~0,5 de Ficha de Terreno ≈ **~7** |
| De ellas, al Mazo (60 %: items + mercenarios) | **~4** |
| Compradas con el oro de la partida (~40-60 oro, stock limitado) | **~2** al Mazo |
| **Mazo al final** | 8 + 4 + 2 ≈ **14** ✅ |

> La Ficha de Terreno es nueva como fuente de carta (`board/board-map.md` §4b) y todavía no estaba en esta cuenta; con ~1,8 apariciones/mapa, ~55 % de encuentro real y solo si se intenta y se acierta la prueba, aporta poco (~0,5 cartas) y el Mazo final sigue dentro del objetivo de 14-16. Cifra a remedir con el resto de la tabla, no solo esta fuente.

Consecuencias que conviene tener presentes:
- **El tope de 20 no se toca en una Partida rápida**, y es correcto: es el techo del Modo Campaña, donde el Mazo persiste entre mapas. El tope de "en juego" **no depende de esto**: son 5 huecos fijos desde el turno 1 (§4), así que las sustituciones empiezan pronto (los 2 de setup + ~3 turnos de Oteo) y no a mitad de partida.
- **Las armas y armaduras son el 40 % del botín y no ocupan Mazo**: es la fuente de ingresos regular de §6b.5 y la razón de que el Herrero importe.
- Las **Maldiciones** también entran al Mazo (Suceso *Maleficio*, [`cards/curses.md`](cards/curses.md)) y **cuentan** para el tope de 20: engordan el Mazo sin darte nada, lo que diluye el Oteo (peor probabilidad de que te salga algo útil). Con "en juego" en un tope fijo de 5, ya no suben ese tope — su castigo real es solo el Oteo más diluido.

## 6c. Nivel de Amenaza (reloj de capítulo)

Reloj de presión que impide que un capítulo (o una Partida rápida) se eternice y obliga a **decidir entre explorar o avanzar**. Inspirado en la Amenaza de *Viajes por la Tierra Media*. **Obligatorio en los dos modos** (Partida rápida y Campaña, `board/board-map.md` §2b). Cifras = primer pase sin balancear.

> **Ojo de nomenclatura:** no confundir con la **Ficha de Amenaza** (`board/board-map.md` §4), el token ambiguo del tablero — son dos conceptos distintos que comparten palabra. Este documento siempre usa el nombre completo ("Nivel de Amenaza" vs. "ficha de Amenaza") para no mezclarlos.

### 6c.1 El reloj

- Barra **por capítulo** de **0 → 40**, se **reinicia** al empezar cada capítulo/mapa (en **Partida rápida**, el único mapa es "el capítulo").
- **+1 al final de cada turno de héroe *(decidido)*.** Con la base a +1, el tope **es** la duración: **una partida son 40 turnos.**

  > **De dónde sale el 40 *(decidido — sustituye el tope 100)*.** El tope tenía que salir de una decisión de duración, no de un número redondo. Las referencias: el mapa del prototipo es **12×12** y el boss está en el hex más lejano a la entrada (`board/board-map.md` §2c), o sea una travesía de **22 hexes** ≈ **15-20 turnos** con coste de terreno. Con tope 100 tenías **cinco veces** lo necesario: podías recorrer el mapa entero dos veces y ganar de sobra, así que el reloj **no ejercía ninguna presión** — que es lo único para lo que existe. Con 40 llegas al boss holgado, te da para recoger ~55 % de las fichas del mapa y para una o dos acampadas, y **elegir entre explorar o avanzar vuelve a doler**. Es también la duración sobre la que está calibrada la tabla de loot (§6b.6).
- **No se pausa nunca *(decidido)*:** sigue corriendo igual dentro de una localización especial/sub-mapa (Mazmorra, Mina... `board/board-map.md` §3b) que dentro del mapa principal — entrar en un sub-mapa no es un respiro para el reloj.
- **Visible siempre** en pantalla, como los PV — la tensión solo funciona si se ve subir.

### 6c.2 Qué la mueve

Sube más rápido con acciones "lentas" o ruidosas y se frena avanzando — ahí está la decisión táctica:

| Sube la Amenaza | | Equivale a |
|---|---|---|
| Fin de turno (base) | **+1** | 1 turno |
| Acampar / descanso corto (§4c.2) | **+3** | 3 turnos — curarte medio PV cuesta tiempo de verdad, y refuerza el anti-abuso de §4c.2 |
| Fallar una prueba de sigilo y alertar una zona (`characters/enemies.md` §2b) | **+2** | 2 turnos |
| Huir de un combate (`characters/enemies.md` §5b.6) | **+2** | 2 turnos — mismo peso que alertar: los dos son un contratiempo, no una elección deliberada como acampar. Se suman a los 2 turnos de *leash* que ya cuesta escapar (§4b.8) |
| Carta de Suceso **Mal augurio** ([`cards/encounter.md`](cards/encounter.md) §4) | **+5** | 5 turnos — la subida de golpe más dura del juego, y por eso es la peor carta del mazo de Suceso |

| Baja / congela la Amenaza | | Equivale a |
|---|---|---|
| Derrotar al boss/objetivo del capítulo | *(no aplica un −W: la victoria ya resetea la barra a 0, §6c.4)* | — |
| **Tabernero**, pagando oro (`characters/npcs.md` §2), usable **1 vez por partida/capítulo** | **−10 por 50 oro** | Te devuelve **10 turnos** por casi todo el oro de una partida (~40-60, §6b.6): es un botón de pánico, no una rutina |

> **Reescalado a la base de 40 *(decidido)*.** Estas cifras eran +10 / +8 / +8 / +15 / −25, calibradas para el "+5 por ronda" y un tope de 100 que ya no existen. Sobre un tope de 40, acampar a +10 se comía **una cuarta parte de la partida** por una sola acampada y *Mal augurio* a +15 era casi una derrota instantánea. Ahora cada cifra se lee directamente como **"cuántos turnos te cuesta"**, que es la única forma de que sigan cuadrando si mañana cambia la duración: si el tope se mueve, esta columna no cambia — solo el tope.
>
> El ratio del Tabernero pasa de 2 a **5 oro por punto** a propósito: con el tope a 40, un punto de Amenaza vale 2,5 veces más que antes.

### 6c.3 Umbrales (escalado **mixto**: suave → duro)

Escalados **de una sola vez** al cruzar cada cuarto. Con el tope a 40 (§6c.1), los cuartos caen en los **turnos 10, 20 y 30** si no haces nada más que avanzar:

| Umbral | Valor (tope 40) | Efecto |
|---|---|---|
| **25 %** *(suave)* | **10** | Presión económica: los precios de tienda suben un **25 %** (§6b.3) y el loot **baja un escalón de rareza** en la tirada de §6b.6 (un Poco común sale Común) |
| **50 %** *(medio)* | **20** | Todos los enemigos ganan **+1 hex de rango de detección** (`characters/enemies.md` §2, §5b.1) — se vuelven más perceptivos, más difícil pasar desapercibido |
| **75 %** *(duro)* | **30** | Los ataques enemigos que impactan ganan una **probabilidad extra de aplicar un Estado negativo** además de su daño normal (`effects.md`) — tira 1d6, con 1-2 aplica Ralentizado, Envenenado leve o Miedo, aunque el enemigo no tenga esa habilidad de por sí; y **todos los enemigos Élite** (no solo el boss/jefe de la localización) ganan el mismo **Bono de jefe** (+2 a ataque y CA, `characters/enemies.md` §5b.1) que ya llevan los Jefes de forma permanente |
| **100 %** *(fin)* | **40** | **Pierdes el capítulo** (§6c.4) |

**Histéresis — se disparan una sola vez *(decidido):*** cada umbral (25/50/75 %) aplica su efecto **solo la primera vez** que se cruza hacia arriba en ese capítulo. Si luego la Amenaza baja (ej. Tabernero, objetivo cumplido) y **vuelve a subir** por encima de un umbral ya disparado, **no se repite** el efecto — es un cambio de estado permanente para el resto del capítulo, no una condición que se reevalúa cada ronda. *(Nota de UI: la barra debería marcar visualmente qué umbrales ya se han consumido, ej. una marca/muesca en 25/50/75 que se "rellena" al cruzarla — detalle de implementación, no de reglas.)*

### 6c.4 Ganar / perder un capítulo

- **Ganar** (cumples el objetivo — matar al jefe/boss — antes del 100 %): avanzas al siguiente capítulo con héroe, mazo y oro intactos (`board/board-map.md` §2b); la barra **se reinicia**. **Bonus de eficiencia** *(propuesta, a validar jugando — solo Modo Campaña; en **Partida rápida** no aplica, `board/board-map.md` §2b)* — según el umbral más alto que llegaste a cruzar:

  | Amenaza al ganar | Bonus |
  |---|---|
  | Nunca pasó de 25 % | Grande: +50 oro y una carta de Tesoro extra |
  | Cruzó 25 % pero no 50 % | Medio: +25 oro |
  | Cruzó 50 % pero no 75 % | Pequeño: +10 oro |
  | Cruzó 75 % (ganaste por los pelos) | Sin bonus |

  Reutiliza los mismos umbrales que ya disparan efectos (§6c.3) — no hace falta un tramo nuevo, y es fácil de calcular (basta el umbral más alto ya marcado).
- **Perder** (la barra llega al **100 %**): igual que caer a 0 PV en Campaña (§4b.8) → **reintentas el capítulo** (barra a 0; héroe, nivel, mazo y oro persisten). En **Partida rápida**, reintentar = reiniciar/regenerar el mapa.

### 6c.5 Encaje con el resto

- **Leveling por hitos** (§5): la Amenaza es el eje de *tiempo*; los hitos, el de *historia*. Independientes.
- **Descanso** (§4c): acampar sube Amenaza, coherente con su anti-abuso.
- **Partida rápida**: da urgencia real (no puedes farmear el mapa sin fin); el boss de la Guarida (`board/board-map.md` §2b) debe caer antes del turno **40**. Como la travesía hasta él son 15-20 turnos, el reloj se traduce en una pregunta concreta cada turno: **¿me desvío a esta ficha o sigo hacia la Guarida?**
- **Tabla de loot** (§6b.6): está calibrada sobre estos 40 turnos. Si mañana cambia la duración, hay que rehacer el calibrado del Mazo — son el mismo número visto desde dos sitios.

## 6d. Reforjar: subir de Nivel una carta *(decidido, sustituye la versión con uso)*

Cierra la idea que llevaba aparcada desde julio (`ideas.md`, "los items suben de nivel") y la nota pendiente de `status.md`. **No es la progresión de personaje** (§5, por hitos de historia): esto es subir de Nivel una **carta concreta** de tu Mazo o tu equipo — un tercer eje de progresión, independiente del personaje (§5) y del reloj de Amenaza (§6c.5).

### 6d.1 Mecanismo único: pagar al NPC especializado, sin uso *(decidido — retira el umbral de uso de la versión anterior)*

- Subir de Nivel una carta que ya tienes (equipada o en el Mazo) exige **una sola cosa**: pagar al NPC que trata su categoría (§6d.2) el coste de su escalón.
- **No hace falta haberla jugado, atacado con ella ni llevarla puesta un mínimo de combates.** La versión anterior de este apartado exigía acumular usos antes de poder pagar; queda retirada.
- **Coste — el mismo trade-in de siempre, ahora la única puerta:** `Comprar(escalón siguiente) − Vender(escalón actual)` de la tabla de precios de §6b.3. Como esa tabla depende solo del Nivel/Rareza y no de qué carta concreta sea, **el coste es el mismo para las cinco categorías**, cartas de clase incluidas (§6d.5):

  | Salto de Nivel | Coste |
  |---|---|
  | 1→2 (Común → Poco común) | 21 oro |
  | 2→3 (Poco común → Raro) | 50 oro |
  | 3→4 (Raro → Épico) | 125 oro |
  | 4→5 (Épico → Legendario) | 340 oro |

  Solo se sube **1 escalón por visita**; llegar de 1 a 5 exige las cuatro visitas y sus cuatro costes (496 oro en total) — una meta de Campaña completa (el oro persiste entre mapas, §6b), no de una sola Partida rápida (~40-60 oro por partida, §6b.6).

> **Por qué solo oro, sin uso *(decidido, sustituye la razón anterior)*.** La versión anterior exigía uso **y** oro para que reforjar no fuera solo "comprar directamente el siguiente escalón" (§6b.2, que ya existía). Dario ha decidido simplificarlo a **NPC + oro únicamente**, sin contador de uso que el motor tenga que trackear por carta. Sigue sin ser gratis ni instantáneo —el oro es el recurso más disputado del juego (§6b)— y sigue sin depender de jugar/grindear una carta concreta, coherente con que el personaje tampoco sube por XP acumulada (§5): **ningún eje de progresión del juego se basa en repetir una acción**, todos son hitos (personaje, §5) o economía (cartas, aquí).

### 6d.2 Categoría por categoría

| Categoría | NPC que reforja | Escalera que usa |
|---|---|---|
| Arma / Armadura | Herrero | Completa 1-5 (`cards/weapons.md` §5b, `cards/armor.md` §6b) |
| Item | Mercader | Parcial — solo ejemplos ilustrativos, ver §6d.3 |
| Mercenario | Capitán de mercenarios | Completa 1-5 en las tres familias (`cards/mercenaries.md` §3b) |
| Cartas de habilidad de clase | **Instructor** (`characters/npcs.md` §2) | Sin Rareza — tabla propia carta a carta, ver §6d.5 |
| Maldición | **Sacerdote/Sanador** (`characters/npcs.md` §2) | **Invertida**: el pago baja 1 Nivel en vez de subirlo — ver §6d.6 |

### 6d.3 Items — falta la escalera por familia

`cards/items.md` no tenía el patrón "misma familia, más potencia por escalón" de armas/armaduras: cada item era una carta única con una sola Rareza. Ya está hecho para los **9 items del kit inicial** (`characters/heroes.md` §2d) a los 5 escalones completos (`cards/items.md` §5b y su §5 de movimiento) — el Mercader ya puede reforjar todo lo que trae un héroe al empezar. Queda pendiente el resto del catálogo (Catalejo, objetos mágicos...), sin bloquear nada.

### 6d.4 Mercenarios

`cards/mercenaries.md` §3b agrupa el catálogo en familias por alcance (Melee, Distancia, Soporte). Las tres cubren ya los 5 escalones de punta a punta, así que el Capitán de mercenarios puede reforjar cualquier mercenario del catálogo del prototipo sin huecos.

### 6d.5 Cartas de clase — el Instructor

Las cartas de clase no llevan Rareza (§3.3) ni pasan por ninguna tienda, así que necesitan un NPC propio: el **Instructor**, en `characters/npcs.md` §2 (como el Tabernero o el Sacerdote, no vende/compra cartas — solo cobra un servicio). **Usa la misma tabla de coste de §6d.1** (21/50/125/340 oro): esa tabla nunca dependió del precio de mercado de la carta concreta, solo del escalón de Rareza, así que se aplica igual a una carta sin Rareza propia — no hace falta una tabla de precio aparte. Cada una de las 8 cartas de habilidad de un héroe necesita su propia fila de mejora carta a carta en `cards/class.md`, con el mismo espíritu que la regla de derivación de `weapons.md` §5b (mismo efecto base, +1 magnitud o +1 alcance/duración por escalón) — hecho para las **8 cartas de los 4 héroes** (`cards/class.md` §6a, §6b). Falta balancear las cifras.

### 6d.6 Maldiciones — el Sacerdote paga para bajar, no para subir

Invertido a propósito: nadie paga para que su propia Maldición empeore. En vez de subir de Nivel, el Sacerdote/Sanador cobra por **bajarlo 1**, usando la misma tabla de §6d.1 leída al revés — bajar desde un escalón caro (Épico/Legendario) cuesta lo mismo que subir hasta él (125/340 oro); bajar desde uno barato (Poco común), poco (21 oro).

**Ya no hay reloj de desgaste gratis** *(decidido, retira la versión anterior)*: antes aguantar una Maldición la debilitaba sola con el tiempo (15 turnos por escalón, sin pagar nada). Con la regla general de "solo NPC + oro" para las cinco categorías, esa vía gratuita queda retirada: una Maldición se queda en su Nivel hasta que la pagas, sin excepción. Los 5 escalones de severidad y el catálogo actualizado están en `cards/curses.md` §1-§2.

### 6d.7 Relación con lo ya aparcado

- **No compite con la progresión de personaje** (§5): son ejes independientes, igual que §6c.5 ya separa Amenaza (tiempo) de hitos (historia) — este es el tercero, **cartas** (Nivel + oro).
- **No es "Desgaste y reparación de equipo"** (`ideas.md`): esa idea aparcada es que el equipo empeore con el uso y haya que repararlo; ésta es la contraria, el equipo mejora si pagas. Podrían convivir en el futuro (desgaste hacia abajo + reforjado hacia arriba), pero hoy son ideas separadas y solo ésta queda decidida.

## 7. Próximos pasos / temas a documentar

### Dudas/inconsistencias detectadas al revisar contra board-map.md, enemies.md, npcs.md y heroes.md

1. ~~Faltaba el sistema de puntos de movimiento por turno~~ → **Resuelto (§2.2):** 2 movimientos estándar para todos (no depende de raza ni stat), con extras vía fichas/cartas de movimiento/cartas de clase.
2. ~~Faltaba el sistema de rango de visión / habilidades de exploración~~ → **Resuelto en parte (§2.3):** el rango de visión base lo gobierna Sabiduría. Sigue pendiente diseñar más Cartas de Habilidad de Clase de exploración que lo amplíen más (ver checklist).
3. ~~Falta un recurso de economía/moneda.~~ → **Resuelto (§6b):** el recurso es **Oro** (contador de personaje), con fuentes (enemigos, tesoros, venta) y sumideros (tiendas, mercenarios, descanso premium, limpiar maldiciones) y precios ligados a la Rareza.
4. ~~El tracker de Miedo seguía como "candidato" pero otros documentos lo asumían adoptado~~ → **Resuelto (evolucionado):** el tracker se **descarta**; el **Miedo** pasa a ser un **Efecto negativo** ([`effects.md`](effects.md)) y la presión temporal la cubre el nuevo **Nivel de Amenaza** (§6c). `board/board-map.md`, `characters/heroes.md` e `ideas.md` actualizados para no depender del tracker.
5. ~~Tensión entre CR de `characters/enemies.md` y el leveling por hitos (§5).~~ → **Resuelto:** en vez de un CR 1:1, la **escala de dificultad** (`characters/enemies.md` §5c) decide qué categorías de enemigo aparecen según la zona del mapa (**Partida rápida**) o el nivel/capítulo (Campaña).
6. ~~Falta cross-reference con el mazo de encuentro.~~ → **Resuelto (§4b.6):** en combate conviven el mazo personal (jugador) y el mazo de encuentro (sistema); este último revela 1 carta de condición al iniciar la pelea.
7. ~~El combate paso a paso es un bloqueo compartido~~ → **Resuelto (§4b):** combate sobre el mismo tablero hex por adyacencia, con recurso de acción por turno, ataque paso a paso e iniciativa. Los enemigos **sí se mueven** en combate; el bucle de decisión de la IA (determinista: mover/atacar/habilidad/huir) está en `characters/enemies.md` §5b.6.

### Checklist

- [x] Definir lista de clases iniciales con sus cartas de habilidad — los **4 héroes** (Guerrero, Mago, Pícaro, Clérigo) tienen 8 cartas cada uno en [`cards/class.md`](cards/class.md). Roster en [`characters/heroes.md`](characters/heroes.md); falta balancear y decidir si el prototipo arranca con 2-3 o los 4.
- [x] Definir resolución exacta de pruebas — **1d20 + modificador** contra CD/Defensa, con las cartas como modificadores de la tirada (§4, §6).
- [x] Bocetar el catálogo de cartas de equipo por categoría (arma, armadura, item) — ver [`cards/`](cards/README.md) ([`weapons`](cards/weapons.md)/[`armor`](cards/armor.md)/[`items`](cards/items.md)). Cartas de **clase** bocetadas para Guerrero/Mago en [`cards/class.md`](cards/class.md). Bocetos iniciales de [`Efecto/Estado`](effects.md), [`Maldición`](cards/curses.md) y [`Mazo de encuentro`](cards/encounter.md) creados (pendientes de detalle).
- [x] Definir combate: orden de turno, cómo se resuelve un ataque paso a paso — ver **§4b** (adyacencia, iniciativa, recurso de acción por turno, ataque paso a paso, mazo de encuentro). Falta solo confirmar §4b.5 (movimiento de enemigos en combate).
- [x] Definir condición de victoria/derrota y estructura de "descanso" (recuperar recursos) — victoria/derrota en §4b.8; **descanso** en §4c (consumibles / carta Hoguera con riesgo / localización segura, sobre Dados de Vida). Falta balancear valores.
- [x] Definir el **setup inicial** de una partida (modalidad → héroe → kit → entrada) → §1b, con los kits concretos en `characters/heroes.md` §2d.
- [x] Definir el **rango de visión** en condiciones → §2.3: dos radios (detalle `2 + mod SAB` / terreno `detalle + 2`), escala +1 por punto de mod, con los invariantes `detalle > detección enemiga` y `terreno > detalle`. Cifras afinadas una vez jugado `/dev/movimiento` (2026-08-05); base bajada de 3 a 2.
- [x] Resolver el **"golpe de oportunidad"** referenciado pero nunca definido → §4b.11 **Desengancharse**: tirada enfrentada de DES, misma regla para héroe y enemigo, sin reacciones.
- [x] Elegir modelo de **iniciativa** (§4b.2) → **tirada** 1d20 + mod DES *(decidido)*.
- [x] Elegir modelo de **recuperación** (§4c.4) → **cura fija** (mitad de PV máx) en el prototipo; DV completos llegan con la progresión.
- [x] Cerrar **quién compra las cartas** que te sobran → §6b.4: cada NPC compra lo que vende.
- [x] Arreglar el tope de "en juego", que era **muerto** con un Mazo pequeño → §4: **tope fijo de 5** (antes una fórmula elástica `techo(Mazo ÷ 2)` entre 3 y 10, sustituida por ser innecesaria: un 5 fijo ya se alcanza pronto con cualquier tamaño de Mazo), + regla de Mazo con <2 cartas.
- [x] **Resolver si una carta jugada se queda "en juego" o vuelve al Mazo** → **vuelve al Mazo** (regla madre de §4). `cards/class.md` §1, §3.1 de este documento y `cards/mercenaries.md` §1 decían lo contrario y quedan corregidos. Era la contradicción más grave del sistema: decidía si "en juego" es un *loadout* que se spamea o **munición preparada**.
- [x] **Cuadrar la matemática del combate** → §4b.12: PV de protagonista (§2), **ataque secundario** (§4b.3) y recorte de los Élite (`characters/enemies.md` §5b.3). Antes los tres Élite ganaban a los cuatro héroes y el Mago perdía contra un lobo suelto.
- [x] **Tope de 2 enemigos simultáneos** (`characters/enemies.md` §5b.6) — límite de economía de acción, no de balance.
- [x] **Definir cuándo termina un combate** (de lo que depende cuándo puedes volver a acampar) → §4b.8, por victoria / leash del enemigo / leash tuyo, cerrando el exploit de huir y acampar gratis a un paso de la pelea.
- [x] **Ataques a distancia contra un enemigo adyacente** → §4b.1, **a bocajarro con Desventaja**. Hace real la referencia que `effects.md` ya hacía y evita que el Mago se quede sin ataque.
- [x] **Críticos de los enemigos** → simétricos con el héroe (§4b.4 paso 5, `characters/enemies.md` §5b.1).
- [x] **El daño suma siempre el modificador**, hechizos incluidos → §4b.4 paso 4; corregidas *Descarga arcana* y *Llama sagrada*.
- [x] **Primer combate jugable** → §1b paso 4: eliges **2 cartas de habilidad** (de las 8 del héroe) que arrancan preparadas. Antes el primer combate se peleaba con 0-2 cartas al azar y el Mago moría por sorteo.
- [x] **Retirar la propiedad fantasma "Ligera"**, de la que colgaban dos reglas sin existir en ningún catálogo → `cards/weapons.md` §4.
- [x] **Dar contenido a la progresión de equipo** → `cards/weapons.md` §5b y `cards/armor.md` §6b: escalones Poco común/Raro para las familias del prototipo. Todo el catálogo era Común, así que no había nada que encontrar (ni a lo que apuntar desde la tabla de loot).
- [ ] Definir las primeras Cartas de Habilidad de Clase de exploración adicionales que amplíen el rango de visión (duda 2, queda solo esta parte).
- [x] **Tabla de loot** *(decidido)* → §6b.6: tres pasos (¿cae carta? · ¿qué rareza? · ¿qué tipo?), con el calibrado que la ata al objetivo elegido —**botín moderado, Mazo de 8 a ~14-16**— y la regla de caída para Épico/Legendario, que casi no existen en el catálogo del prototipo.
- [x] **Duración de una Partida rápida y reescalado del Nivel de Amenaza** *(decidido)* → **40 turnos** (§6c.1): el tope pasa de 100 a 40, los umbrales caen en los turnos 10/20/30 y las subidas de golpe se reescriben como "cuántos turnos te cuesta" (+3 acampar, +2 alertar/huir, +5 Mal augurio, −10 el Tabernero). Con tope 100 el reloj daba **cinco veces** lo necesario para la travesía de 22 hexes y no ejercía ninguna presión.
- [x] **¿Puede el jugador consultar su Mazo?** *(decidido)* → **sí, la lista completa y en cualquier momento** (§4). No estaba escrito, y el swap 1-por-1 ya lo exigía.
- [x] Definir recurso de economía/moneda (duda 3) → **Oro** (§6b), con fuentes, sumideros y precios por Rareza. Falta balancear las cifras.
- [x] Definir dado de vida por clase — ver `characters/heroes.md` §2c (Guerrero d10, Pícaro/Clérigo d8, Mago d6).
- [x] Definir cómo se traduce capítulo/hito de Campaña a CR de enemigo esperado (duda 5) → **escala de dificultad** por zona/nivel (`characters/enemies.md` §5c).
- [x] Confirmar si el máximo de cartas del mazo (§4, ej. 10) cuenta solo el equipo o también las cartas de clase → **cuenta todas** (clase + equipo). El límite podrá subirse más adelante si hace falta.
- [x] Terminar de definir la mecánica de Maldición (§3.2) → [`cards/curses.md`](cards/curses.md): Nivel 1-5 con estrellas (leído al revés), catálogo de 9, fuentes, y limpieza (Templo por oro o prueba). Falta balancear.
- [x] Definir el sistema de subir de nivel las **cartas** (no confundir con el personaje, §5) → **§6d Reforjar**: solo NPC + oro (sin uso), coste = trade-in de la tabla de §6b.3, igual para las cinco categorías. Arma/Armadura/Mercenario/cartas de clase ya completan su escalera 1-5; Item queda con catálogo por completar más allá del kit inicial (§6d.3).
- [x] Formalizar la progresión de **personaje** (§5), aparcada hasta ahora → mismo rango 1-5 que las cartas, hitos ya conceden el nivel, PV/estadística concretados por héroe; ya **no** desbloquea cartas (eso quedó eliminado al fusionar Básica/Especial, `cards/class.md` §6, con las 8 cartas de cada héroe ya con tabla 1-5). Falta balancear.

## Referencias de inspiración

- Mecánica de mazo/pruebas: `docs/links.txt` (ejemplos visuales de CSS para cartas) y `public/assets/viajesporlatierramedia_examplecards*` (cartas reales de Viajes por la Tierra Media).
- Estadísticas y progresión: reglas base de D&D 5ª edición.
