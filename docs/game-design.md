# CardGame — Documento de diseño (borrador inicial)

Mezcla de mecánicas de **D&D** (personajes, estadísticas, progresión, identidad de héroes/enemigos/NPCs — ver [`characters/heroes.md`](characters/heroes.md), [`characters/enemies.md`](characters/enemies.md), [`characters/npcs.md`](characters/npcs.md)) con **Viajes por la Tierra Media** como inspiración solo de la **estructura de cartas y mazo** (mazo personal, iconografía de pruebas) y del **tablero** (ver [`board/board-map.md`](board/board-map.md)) — no de la identidad de personajes/razas, que ya se fijó como D&D puro. Este documento se irá ampliando iteración a iteración. Términos transversales en [`glossary.md`](glossary.md); catálogo de cartas por tipo en [`cards/`](cards/README.md). **Foto de qué está definido vs. pendiente en [`status.md`](status.md).** Ideas sin decidir todavía, aparcadas en [`ideas.md`](ideas.md).

## 1. Concepto central

Cada jugador controla un personaje con estadísticas de tipo D&D. Tiene un **mazo personal** (clase + items + mercenarios) del que cada turno **otea** 2 cartas al azar y prepara 1 para jugarla cuando quiera (§4) —ahí está la suerte de cada turno—, más un **equipo** de armas y armaduras que lleva puesto, aparte del mazo (§4a). Las cartas se juegan para modificar estadísticas propias, de aliados o de enemigos, aplicar ventaja/desventaja, curarse, invocar mercenarios, etc.

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
- **PV máximo** = dado de vida de la clase (nivel 1: máximo del dado; niveles siguientes: tirada o promedio, a decidir) + mod Constitución por nivel + **2 de aguante base** *(ajuste de prototipo, una sola vez a nivel 1: sube el suelo de PV para que los casters no caigan en 2 golpes — B2 del balance; a revalidar jugando)*.

### 2.2 Movimiento

**Estándar: 2 movimientos por turno para todos los héroes**, sin variación por raza (sustituye la idea anterior de Velocidad-por-raza). Los enemigos usan la misma base (de momento **2** para todos, igualados al héroe; se personalizará por tipo más adelante, `characters/enemies.md` §5b.1). 1 movimiento = 1 hexágono cruzado en `board/board-map.md`, modificado por el terreno de cada hexágono (`board/board-map.md` §3).

Fuentes de movimiento **extra** por encima del estándar:
- **Fichas del tablero** (ej. un NPC informante/guía, `characters/npcs.md`) que conceden movimiento adicional puntual.
- **Cartas de movimiento** — un tipo de carta de equipo/objeto que se juega para ganar movimiento extra ese turno.
- **Cartas de clase innatas** — ciertos héroes pueden tener ya en su mazo cartas que dan movimiento extra desde el principio (ej. el Pícaro, coherente con su rol explorador en `characters/heroes.md`).

### 2.3 Rango de visión

Rango de visión base = 1 hexágono (el actual + vecinos inmediatos, según `board/board-map.md` §4), gobernado por **Sabiduría**: cada +2 de modificador de Sabiduría añade +1 hexágono de rango. Las Cartas Especiales de Clase de exploración (pendientes de diseñar, ver checklist) pueden ampliarlo más allá de esta base, tal como ya anticipaba `board/board-map.md` §4.

### 2.4 Equipamiento: manos y armadura

- Cada personaje tiene **2 manos**. Las armas ocupan 1 o 2 manos (ver [`cards/weapons.md`](cards/weapons.md) para el listado con su icono ✋/🤲, ver [`glossary.md`](glossary.md)) — se pueden llevar hasta 2 armas de ✋ (una mano), o 1 arma de 🤲 (dos manos), nunca combinando ambas a la vez si no caben en las 2 manos disponibles.
- Cada personaje lleva **1 sola armadura** equipada (no se acumulan varias).
- Al principio de la aventura (y luego antes de cada capítulo y en sitios seguros, §4a), el jugador elige con qué armas y armadura equiparse (partiendo del catálogo inicial de [`cards/`](cards/README.md)).

## 3. Tipos de carta

Dos ejes distintos: **de dónde sale la carta** (clase vs. equipo encontrado) y **qué icono/tipo tiene** (para saber cómo y cuándo se juega cada una).

### 3.1 Por origen

1. **Cartas Básicas de Clase** — inspiradas en las cartas "Básica 1/2/3" de Viajes. Cada clase tiene un set fijo de cartas genéricas disponibles desde el nivel 1 (p. ej. Guerrero: "Golpe firme", "Postura defensiva"). Catálogo en [`cards/class.md`](cards/class.md).
2. **Cartas Especiales de Clase** — se desbloquean por nivel/hito, igual que las subclases de D&D. Más potentes, uso limitado (una vez por combate/descanso). Ver [`cards/class.md`](cards/class.md).
3. **Cartas de equipo** — armas, armaduras e items conseguidos jugando (botín, tesoro, recompensas, compra; ver §3.2 y [`cards/`](cards/README.md)). Las **armas y armaduras** se **equipan** aparte (§4a); los **items** entran al **Mazo** (§4). Nada de esto se consigue con el Oteo.
4. **Cartas de Mercenario** — compañías a sueldo que se **reclutan** superando una prueba de Carisma en una ficha del tablero (fallarla la convierte en enemigo) o se **compran** por oro; van al mazo como cartas de Acción reutilizables. Catálogo en [`cards/mercenaries.md`](cards/mercenaries.md).

### 3.2 Por tipo (icono diferenciador)

| Tipo | Icono (ejemplo) | Qué hace | Notas |
|---|---|---|---|
| **Arma** | Espada | Añade daño y tipo de daño (lista completa y resistencias en §4b.10); ocupa 1 o 2 manos (§2.4) | Puede requerir stat mínima para usarse sin penalización |
| **Armadura** | Escudo/coraza | Suma a la Defensa/CA; puede restar Destreza si es pesada | Solo 1 equipada a la vez (§2.4) |
| **Item** | Bolsa | Categoría amplia: pociones (efecto instantáneo), hechizos (Cartas Especiales o Pergaminos), objetos de aventura/herramientas/objetos mágicos raros — ver [`cards/items.md`](cards/items.md) | El más variado de los 4 tipos |
| **Mercenario** | 🪖 Casco/estandarte | Carta de Acción: das la orden a una compañía a sueldo (atacar, curarte, etc.); reutilizable, cuesta tu Acción | Origen (reclutar/comprar) y catálogo en [`cards/mercenaries.md`](cards/mercenaries.md) |
| **Maldición** | Calavera/nube negra | Efecto negativo persistente que **ocupa un hueco del mazo** (a diferencia de un Efecto/Estado temporal de combate) — ej. -1 movimiento, 1 de daño cada 2 turnos, −1 al rango de visión | Definida en [`cards/curses.md`](cards/curses.md) (severidad Leve/Grave, fuentes, limpieza); da incentivo a "limpiar" el mazo |

> **Dónde vive cada tipo:** **armas** y **armaduras** son el **sistema de equipo** (§4a) — se equipan, no ocupan hueco del Mazo ni pasan por el Oteo. **Items**, **mercenarios** y **maldiciones** sí viven en el **Mazo** (§4).

Además siguen existiendo las **Cartas de Efecto/Estado** (ventaja, desventaja, aturdido, envenenado) que se aplican de forma *temporal* durante una prueba/combate sobre un personaje (propio, aliado o enemigo) — no ocupan hueco de mazo como la Maldición, son más bien un modificador puntual de una carta de Arma/Item/hechizo al jugarse.

Todas las cartas de equipo siguen el mismo patrón que viste en Viajes: **coste** (si aplica) + **texto de efecto** + **modificador de estadística o de prueba**.

### 3.3 Rareza

Determina lo poderosa que es una carta y la dificultad de encontrarla/comprarla (ligado a las Fichas de Tesoro de `board/board-map.md` y a los precios de `characters/npcs.md`):

| Rareza | Color |
|---|---|
| Común | Gris |
| Poco común | Verde |
| Raro | Azul |
| Épico | Morado |
| Legendario | Dorado |

Aplica a cartas de Arma/Armadura/Item (y previsiblemente Maldición). Las cartas de clase (§3.1) no llevan rareza propia por ahora — quedan fuera de este sistema.

## 4. Mazo y turno

- El mazo de cada jugador = cartas de clase (básicas + especiales) + **items y mercenarios** obtenidos jugando (§3.2). Las **armas y armaduras van aparte**, en el sistema de equipo (§4a).
- **Mazo — dos zonas: el Mazo y "en juego" *(decidido)*:**
  - **Mazo del capítulo — hasta 20 cartas:** tu baraja personal = **cartas de clase + items + mercenarios** (más las **maldiciones** que te caigan). **Las armas y armaduras NO cuentan aquí** — van en el sistema de equipo aparte (§4a). Es un **tope duro**: los items/mercenarios nuevos entran jugando (botín, Tesoro, recompensas, compra, §6b), **no** con el Oteo; al llegar a 20, incorporar uno nuevo obliga a **cambiar una carta por otra** (swap 1-por-1).
  - **En juego — hasta 10 cartas:** tu zona de cartas **preparadas**, las únicas que puedes jugar. Empieza **vacía** al comenzar el capítulo y se llena poco a poco con el Oteo. **Clase, items y mercenarios compiten** por esos 10 huecos (más de un tipo preparado = menos hueco para los demás).
  - **Otear *(decidido)*:** al **empezar tu turno**, antes de mover o actuar, revelas **2 cartas al azar de tu Mazo** y **eliges 1** para ponerla **en juego**; la otra **vuelve al Mazo**. Así "en juego" crece ~1 carta por turno (1/10, 2/10…). Las cartas en juego las usas **cuando quieras** (una poción, un mercenario, una carta de acción…), dentro de la economía de acción (§4b.3); no caducan si no las usas.

  Sustituye la idea anterior de "20 construidas + 10 drafteadas aparte (~30 en juego)". Detalle en [`cards/README.md`](cards/README.md).

  > **Reglas del Oteo *(decidido)*:** de las 2 cartas puedes elegir **1** o **ninguna** (si no te convence ninguna, las rechazas y las dos vuelven al Mazo). Con "en juego" **lleno (10/10)**, para quedarte una nueva **sustituyes** una carta que ya tengas en juego (la sustituida vuelve al Mazo). Al **jugar** una carta también vuelve al Mazo y puede reaparecer en un Oteo posterior — nada se pierde.
  >
  > **El Oteo reparte al azar *(decidido)*:** las 2 cartas que muestra salen **al azar** de tu Mazo (como robar de una baraja); de ellas eliges 1 o ninguna. Hay un componente de **suerte**, así que **cómo compones tu Mazo de 20 importa**: cuanto mejor sea la mezcla, mejores serán las 2 que te ofrezca cada turno.
- **Sin "mano" clásica:** no se roba y descarta una **mano completa** cada turno como en un juego de cartas al uso; el Oteo solo saca **2 al azar**, preparas 1 y lo que preparas **se queda en juego** hasta que lo juegas. Una vez una carta está **en juego**, es una opción **siempre disponible** hasta que la juegues (dentro del recurso de acción del turno, §4b.3): curarte, ayudar en la aventura, subir estadísticas, atacar, etc.
- **Ninguna carta se pierde al jugarla *(decidido)*:** jugar una carta del mazo personal (equipo, clase, item) cuesta el recurso de turno que le corresponda (Movimiento/Acción/Acción rápida/Carta de Efecto, §4b.3), pero la carta **vuelve al Mazo** (§4) y puede volver a prepararse con el Oteo más adelante — **hoy** no hay descarte permanente ni cartas de "un solo uso" en el mazo personal (podría añadirse como excepción puntual en el futuro; de momento ninguna carta lo lleva). Textos como "un uso" o "se consume" en cartas de equipo/item **no aplican** y son restos de una idea descartada. El único límite real de repetición son las etiquetas explícitas **1/combate** o **1/descanso** de las Cartas Especiales de Clase (§3.1).
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
- **Inicio del combate:** el héroe termina su movimiento en un hexágono adyacente a un enemigo (o una ficha de Amenaza se revela como enemigo junto a él). No se "entra" en el hexágono del enemigo; se combate desde el contiguo. *(Actualiza la redacción de `board/board-map.md` §4, ficha de Enemigo, que decía "inicia combate al entrar en el hexágono".)*

### 4b.2 Iniciativa / orden de turno

- Al empezar el combate: **1d20 + mod Destreza** para el héroe y para cada enemigo. Actúa primero el más alto. Empates → mayor Destreza bruta → héroe gana.
- Alternativa más simple para el prototipo (sin tirada): compara mod Destreza directamente, mayor primero.

### 4b.3 Recurso de acción por turno *(el que faltaba en §4)*

Cada turno el héroe dispone de:

| Recurso | Qué permite |
|---|---|
| **Movimiento (2 hex)** | Moverse hasta 2 hexágonos (coste modificado por terreno, §2.2). Se puede repartir antes y después de la Acción. |
| **1 Acción principal** | Un ataque con arma equipada, lanzar un hechizo, activar una Carta Especial de Clase, o interactuar con una ficha contigua. |
| **1 Acción rápida** (1/turno) | Beber una poción, jugar una carta de Item "rápido", o un segundo ataque con arma ligera en la otra mano (dual-wield, sin el mod de daño la segunda vez). |
| **Cartas de Efecto/modificador** | Enganchadas a una tirada concreta (tuya o del enemigo). **Hasta 1 por tirada** — así "juegas cualquier carta cuando quieras" (§4) sin poder apilar infinitas. No gastan la Acción. |

Las **Cartas Especiales de Clase** son potentes y de uso limitado: **1 vez por combate o por descanso** (§3.1).

### 4b.4 Resolución de un ataque (paso a paso)

1. Declarar objetivo: en hex contiguo (melee) o dentro de alcance (distancia/hechizo).
2. **Tirada de ataque:** `1d20 + mod stat relevante + bonos de cartas`. Stat según el arma/hechizo: FUE (melee pesada), DES (ligera/distancia), INT (arcano), SAB (divino) — coherente con §2.1.
3. Comparar con la **Defensa/CA** del objetivo (`10 + mod DES + armadura`, §2).
4. Si `tirada ≥ CA` → impacto. **Daño** = `dado(s) del arma/hechizo + mod stat + bonos de carta`. Aplicar el tipo de daño contra las resistencias/vulnerabilidades del objetivo (§4b.10).
5. **Crítico:** d20 natural 20 → impacto automático, se **doblan los dados de daño**. Natural 1 → fallo automático.
6. **Ventaja/Desventaja:** tira 2d20 y coge el mejor (ventaja) o el peor (desventaja). La aportan cartas de Efecto, estados o el terreno del hex (emboscada desde Bosque = ventaja; atacar cruzando Llanura/Camino a la vista = posible desventaja — `board/board-map.md` §4).
7. Restar el daño de los PV del objetivo. A 0 PV → derrotado.

> **Precisión global — decidido:** de momento **no** se añade ningún `+2` global al ataque en ninguno de los dos bandos (no hay bono de competencia). La precisión resultante (~55 %) se revisa **jugando el prototipo**, no sobre el papel.

### 4b.5 Movimiento de enemigos: activación por detección *(decidido)*

Los enemigos **sí se mueven**, pero solo tras **detectar al héroe**. Modelo de tres estados (detalle de comportamiento en `characters/enemies.md` §2):

- **Latente:** anclado en su hexágono, no patrulla, mientras no **detecte** al héroe. Entrar en su rango de detección obliga a una **prueba de sigilo** (`characters/enemies.md` §2b); solo si el héroe la falla (o no es sigiloso) el enemigo despierta. Terreno como el Bosque acorta ese rango (`board/board-map.md` §3/§4).
- **Activo (detectado el héroe — prueba de sigilo fallada, `characters/enemies.md` §2b):** se mueve hacia él por el mapa (persecución) e inicia combate al quedar adyacente. Dentro del combate sigue moviéndose (acercarse + golpear si melee, o reposicionarse si a distancia). El **bucle de decisión** turno a turno dentro del combate (IA determinista: mover / atacar / habilidad / huir) está en `characters/enemies.md` §5b.6.
- Esto reintroduce la **detección activa** que `characters/enemies.md` §2 tenía aplazada, y da valor mecánico al sigilo/ocultación (evitar o emboscar en vez de pelear siempre).

*(Idea futura, aún sin decidir — nota del diseñador:* enemigos o eventos "cazadores" que buscan proactivamente al héroe por el mapa **antes** de detectarlo por visión. Por ahora la activación es siempre reactiva, por detección.)

### 4b.6 El mazo de encuentro en combate

Resuelve el cross-reference pendiente entre §4 (solo hablaba del mazo personal) y `board/board-map.md` §5:

- Al iniciar un combate, el sistema revela **1 carta del mazo de encuentro** (`board/board-map.md` §5) que fija una condición de ESA pelea: emboscada, "el enemigo intenta huir", "el terreno se derrumba", refuerzos, etc.
- Enemigos élite/jefes pueden hacer robar más de una.
- Es **del sistema, no del jugador** (a diferencia del mazo personal) — conviven los dos en la misma pelea.

### 4b.7 Hechizos (sin recurso de puntos)

En el prototipo los hechizos son simplemente **Cartas de clase** (Especiales 1/combate o 1/descanso, y Básicas de ataque mágico como *Descarga arcana* o *Llama sagrada*) o **Pergaminos** (Item). Viven en el Mazo y se **preparan con el Oteo** como cualquier otra carta (§4): **no hay un subsistema de "preparar hechizos" aparte**, ni maná, ni espacios de conjuro. Se lanzan gastando la Acción que indique la carta y se resuelven con `1d20 + INT/SAB` vs CD/Defensa (§4b.4).

**Foco *(decidido)*:** el **Libro de hechizos** (Mago) y el **Símbolo sagrado** (Clérigo) son **armas equipadas** (§4a, [`cards/weapons.md`](cards/weapons.md) §3) que dan **+1 a las tiradas y CD de tus hechizos** mientras las empuñas —como el Bastón del poder—; potencian, no son requisito para lanzar. La granularidad de caster (tipos de magia, debilidades elementales, subclases de mago) queda como desarrollo posterior.

### 4b.8 Huir, victoria y derrota

- **Huir:** usar el Movimiento para salir de adyacencia/alcance. Si un enemigo está adyacente, opcionalmente una prueba de DES (`1d20 + mod DES` vs CD) para desengancharse sin recibir un golpe de oportunidad.
- **Victoria:** todos los enemigos a 0 PV → recompensas (loot de la ficha de Tesoro si aplica, posible carta del mazo de encuentro, y avance de hito si era un jefe).
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

## 4c. Descanso y recuperación

**Sin ciclo día/noche automático.** A diferencia de D&D (donde el descanso largo cura "de por sí" al pasar la noche), aquí **la recuperación se hace jugando cartas o visitando localizaciones seguras** — coherente con la filosofía "todo es una carta". El día/noche podría volver en el futuro solo como ambientación/modificador, no como cura automática (idea futura). Tres vías, de menor a mayor alcance:

### 4c.1 Consumibles — en cualquier momento (incluido combate)

- **Poción de vida** ([`cards/items.md`](cards/items.md)): Acción rápida (§4b.3), recupera PV al instante. La vía rápida de emergencia dentro del combate.
- Otros consumibles (pergaminos de curación, antídotos que quitan Envenenado, etc.) siguen el mismo patrón.

### 4c.2 Acampar — carta Hoguera (fuera de combate) = descanso corto

- La carta **Hoguera/Campamento** ([`cards/items.md`](cards/items.md)) solo se juega **fuera de combate**.
- **Efecto:** gastas Dados de Vida (§4c.4) para curarte y **reseteas tus habilidades 1/descanso** (ej. Segundo aliento del Guerrero, [`cards/class.md`](cards/class.md)).
- **Riesgo (tensión + anti-abuso):** acampar en terreno inseguro obliga a robar 1 carta del **mazo de encuentro** ([`cards/encounter.md`](cards/encounter.md)) o a una prueba de detección — puede saltar una **emboscada**. El terreno modifica el riesgo: Bosque es seguro (ocultación), Llanura/Camino quedan expuestos (`board/board-map.md` §3-4). Esto limita de forma natural y temática el acampar en bucle.
- Además, no puedes volver a acampar hasta que **ocurra algo** (entrar en combate o explorar un grupo nuevo) — evita re-acampar sin avanzar.

### 4c.3 Localización segura — descanso largo

- En **Pueblo/Aldea**, **Taberna** o **Templo/Santuario** (`board/board-map.md` §3b, `characters/npcs.md`):
- **Efecto:** recuperas **todos los PV**, **recuperas todos los Dados de Vida** gastados, retiras estados negativos y reseteas 1/descanso. **Sin riesgo** (zona segura).
- Puede costar **oro** (economía pendiente) en la Taberna, o ser gratis según el lugar. El Templo puede además limpiar una Maldición ([`cards/curses.md`](cards/curses.md)).

### 4c.4 Dados de Vida (DV)

- Cada héroe tiene **DV = su nivel**, del tamaño de su dado de clase (Guerrero d10, Pícaro/Clérigo d8, Mago d6; `characters/heroes.md` §2c). A nivel 1 = 1 DV.
- **Acampar (4c.2):** gastas 1 o más DV disponibles; por cada uno tiras el dado + mod CON y recuperas esos PV.
- **Descanso largo (4c.3):** recuperas todos los DV gastados.
- *(Modelo recomendado, fiel a D&D. Alternativa más simple para el primer prototipo: que la Hoguera cure una cantidad fija —p. ej. la mitad de los PV máx— sin llevar cuenta de DV.)*

## 5. Progresión de personaje

- Subir de nivel por hitos de historia (como D&D 5e "milestone leveling"), no por XP acumulada — encaja mejor con partidas cortas de cartas.
- Cada nivel: PV extra (dado de vida de la clase + mod CON, §2), posible mejora de estadística, y desbloqueo de 1 carta especial de clase nueva que se añade al mazo personal.
- El equipo se consigue jugando —botín, tesoro, compra (§6b)—, no por nivel: **armas y armaduras** se equipan aparte (§4a) y los **items/mercenarios** entran al Mazo (§4). Dos ejes de progresión en paralelo (personaje vs. equipo/mazo), igual que en Viajes (colección de cartas de Objeto) combinado con el nivel de personaje de D&D.

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
| Vender cartas al Mercader | según Rareza (§6b.3) |
| Misiones (Dador de misión, `characters/npcs.md`, solo Campaña) | recompensa fija |

### 6b.2 En qué se gasta (sumideros)

- **Comprar cartas** en tiendas (Mercader — Items, Herrero — armas/armaduras, Mago/Encantador — hechizos; `characters/npcs.md`): precio por Rareza (§6b.3).
- **Comprar cartas de Mercenario** (`characters/npcs.md`, [`cards/mercenaries.md`](cards/mercenaries.md)): coste según su Rareza; van a tu mazo (vía segura frente a reclutarlas con una prueba).
- **Limpiar una Maldición** en el Templo / **Sacerdote-Sanador** (`characters/npcs.md`, [`cards/curses.md`](cards/curses.md)): coste fijo (o prueba).
- **Herrero** (`characters/npcs.md`): reparar/mejorar una carta de equipo (subir de rareza o reforjar) — coste por definir.
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

### 6b.4 Cómo encaja con el mazo

- Comprar una carta la añade al Mazo → **cuenta para el máximo** (§4) — esto vale para **items y mercenarios**; las **armas/armaduras** compradas al Herrero **no cuentan** para el Mazo (colección ilimitada, §4a). El oro da *elección*, pero el tamaño del Mazo sigue siendo el límite real de las cartas que sí lo ocupan.
- **Vender** es el sumidero natural del exceso de cartas: como el Mazo tiene tope, cambias equipo que ya no usas por oro para comprar algo mejor. Esto cierra el bucle botín/tesoro → tienda → Mazo que antes lo inflaba sin salida.

## 6c. Nivel de Amenaza (reloj de capítulo)

Reloj de presión que impide que un capítulo (o una Partida rápida) se eternice y obliga a **decidir entre explorar o avanzar**. Inspirado en la Amenaza de *Viajes por la Tierra Media*. **Obligatorio en los dos modos** (Partida rápida y Campaña, `board/board-map.md` §2b). Cifras = primer pase sin balancear.

> **Ojo de nomenclatura:** no confundir con la **Ficha de Amenaza** (`board/board-map.md` §4), el token ambiguo del tablero — son dos conceptos distintos que comparten palabra. Este documento siempre usa el nombre completo ("Nivel de Amenaza" vs. "ficha de Amenaza") para no mezclarlos.

### 6c.1 El reloj

- Barra **por capítulo** de **0 → 100**, se **reinicia** al empezar cada capítulo/mapa (en **Partida rápida**, el único mapa es "el capítulo").
- **+1 al final de cada turno de héroe *(decidido, primer pase)*.** *(Sustituye el "+5 por ronda" anterior. Con este ritmo mucho más lento, el tope 100, los umbrales 25/50/75 y las demás fuentes de abajo quedan **pendientes de reajustar a esta nueva base** — "de momento +1 por turno y ya iremos afinando".)*
- **No se pausa nunca *(decidido)*:** sigue corriendo igual dentro de una localización especial/sub-mapa (Mazmorra, Mina... `board/board-map.md` §3b) que dentro del mapa principal — entrar en un sub-mapa no es un respiro para el reloj.
- **Visible siempre** en pantalla, como los PV — la tensión solo funciona si se ve subir.

### 6c.2 Qué la mueve

Sube más rápido con acciones "lentas" o ruidosas y se frena avanzando — ahí está la decisión táctica:

| Sube la Amenaza | |
|---|---|
| Fin de turno (base) | +1 |
| Acampar / descanso corto (§4c.2) | **+10** *(propuesta: el doble de una ronda, para que curarte/resetear habilidades tenga un coste de tiempo real — refuerza el anti-abuso de acampar ya existente)* |
| Fallar una prueba de sigilo y alertar una zona (`characters/enemies.md` §2b) | **+8** *(propuesta)* |
| Huir de un combate (`characters/enemies.md` §5b.6) | **+8** *(propuesta, mismo peso que alertar — ambos son "un contratiempo", no una elección deliberada como acampar)* |
| Carta de Suceso **Mal augurio** ([`cards/encounter.md`](cards/encounter.md) §4) | +15 (subida de golpe, fuera de las 4 fuentes fijas anteriores) |

| Baja / congela la Amenaza | |
|---|---|
| Derrotar al boss/objetivo del capítulo (Élite de Guarida en **Partida rápida**, objetivo de la historia en Campaña) | *(no aplica un −W: la victoria ya resetea la barra a 0 directamente, §6c.4 — esta fila queda solo como referencia de qué acción es "la" que cierra el capítulo)* |
| **Tabernero**, pagando oro — **decidido:** ya no es el Pueblo el que baja la Amenaza automáticamente; es una acción de pago del NPC Tabernero (`characters/npcs.md` §2), usable **1 vez por partida/capítulo** | **−25 por 50 oro** *(propuesta: ratio 2 oro por punto, en línea con el precio de un objeto Raro, §6b.3)* |

*(Cifras = primer pase, a afinar jugando. **Aviso:** con la base recién bajada a +1/turno (§6c.1), las subidas de golpe de esta tabla —+10, +8, +15— quedan desproporcionadas y hay que reescalarlas junto con el tope y los umbrales.)*

### 6c.3 Umbrales (escalado **mixto**: suave → duro)

Escalados **de una sola vez** al cruzar cada cuarto:

| Umbral | Efecto |
|---|---|
| **25 %** *(suave)* | Presión económica: suben los precios de tienda y empeora el loot |
| **50 %** *(medio)* | Todos los enemigos ganan **+1 hex de rango de detección** (`characters/enemies.md` §2, §5b.1) — se vuelven más perceptivos, más difícil pasar desapercibido |
| **75 %** *(duro)* | Los ataques enemigos que impactan ganan una **probabilidad extra de aplicar un Estado negativo** además de su daño normal (`effects.md`) — tira 1d6, con 1-2 aplica Ralentizado, Envenenado leve o Miedo, aunque el enemigo no tenga esa habilidad de por sí; y **todos los enemigos Élite** (no solo el boss/jefe de la localización) ganan el mismo **Bono de jefe** (+2 a ataque y CA, `characters/enemies.md` §5b.1) que ya llevan los Jefes de forma permanente |
| **100 %** *(fin)* | **Pierdes el capítulo** (§6c.4) |

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
- **Partida rápida**: da urgencia real (no puedes farmear el mapa sin fin); el boss de la Guarida (`board/board-map.md` §2b) debe caer antes del 100 %.

## 7. Próximos pasos / temas a documentar

### Dudas/inconsistencias detectadas al revisar contra board-map.md, enemies.md, npcs.md y heroes.md

1. ~~Faltaba el sistema de puntos de movimiento por turno~~ → **Resuelto (§2.2):** 2 movimientos estándar para todos (no depende de raza ni stat), con extras vía fichas/cartas de movimiento/cartas de clase.
2. ~~Faltaba el sistema de rango de visión / habilidades de exploración~~ → **Resuelto en parte (§2.3):** el rango de visión base lo gobierna Sabiduría. Sigue pendiente diseñar las Cartas Especiales de Clase de exploración que lo amplíen más (ver checklist).
3. ~~Falta un recurso de economía/moneda.~~ → **Resuelto (§6b):** el recurso es **Oro** (contador de personaje), con fuentes (enemigos, tesoros, venta) y sumideros (tiendas, mercenarios, descanso premium, limpiar maldiciones) y precios ligados a la Rareza.
4. ~~El tracker de Miedo seguía como "candidato" pero otros documentos lo asumían adoptado~~ → **Resuelto (evolucionado):** el tracker se **descarta**; el **Miedo** pasa a ser un **Efecto negativo** ([`effects.md`](effects.md)) y la presión temporal la cubre el nuevo **Nivel de Amenaza** (§6c). `board/board-map.md`, `characters/heroes.md` e `ideas.md` actualizados para no depender del tracker.
5. ~~Tensión entre CR de `characters/enemies.md` y el leveling por hitos (§5).~~ → **Resuelto:** en vez de un CR 1:1, la **escala de dificultad** (`characters/enemies.md` §5c) decide qué categorías de enemigo aparecen según la zona del mapa (**Partida rápida**) o el nivel/capítulo (Campaña).
6. ~~Falta cross-reference con el mazo de encuentro.~~ → **Resuelto (§4b.6):** en combate conviven el mazo personal (jugador) y el mazo de encuentro (sistema); este último revela 1 carta de condición al iniciar la pelea.
7. ~~El combate paso a paso es un bloqueo compartido~~ → **Resuelto (§4b):** combate sobre el mismo tablero hex por adyacencia, con recurso de acción por turno, ataque paso a paso e iniciativa. Los enemigos **sí se mueven** en combate; el bucle de decisión de la IA (determinista: mover/atacar/habilidad/huir) está en `characters/enemies.md` §5b.6.

### Checklist

- [x] Definir lista de clases iniciales con sus cartas básicas — los **4 héroes** (Guerrero, Mago, Pícaro, Clérigo) tienen Básicas + 1 Especial en [`cards/class.md`](cards/class.md). Roster en [`characters/heroes.md`](characters/heroes.md); falta balancear y decidir si el prototipo arranca con 2-3 o los 4.
- [x] Definir resolución exacta de pruebas — **1d20 + modificador** contra CD/Defensa, con las cartas como modificadores de la tirada (§4, §6).
- [x] Bocetar el catálogo de cartas de equipo por categoría (arma, armadura, item) — ver [`cards/`](cards/README.md) ([`weapons`](cards/weapons.md)/[`armor`](cards/armor.md)/[`items`](cards/items.md)). Cartas de **clase** bocetadas para Guerrero/Mago en [`cards/class.md`](cards/class.md). Bocetos iniciales de [`Efecto/Estado`](effects.md), [`Maldición`](cards/curses.md) y [`Mazo de encuentro`](cards/encounter.md) creados (pendientes de detalle).
- [x] Definir combate: orden de turno, cómo se resuelve un ataque paso a paso — ver **§4b** (adyacencia, iniciativa, recurso de acción por turno, ataque paso a paso, mazo de encuentro). Falta solo confirmar §4b.5 (movimiento de enemigos en combate).
- [x] Definir condición de victoria/derrota y estructura de "descanso" (recuperar recursos) — victoria/derrota en §4b.8; **descanso** en §4c (consumibles / carta Hoguera con riesgo / localización segura, sobre Dados de Vida). Falta balancear valores.
- [ ] Definir las primeras Cartas Especiales de Clase de exploración que amplíen el rango de visión (duda 2, queda solo esta parte).
- [x] Definir recurso de economía/moneda (duda 3) → **Oro** (§6b), con fuentes, sumideros y precios por Rareza. Falta balancear las cifras.
- [x] Definir dado de vida por clase — ver `characters/heroes.md` §2c (Guerrero d10, Pícaro/Clérigo d8, Mago d6).
- [x] Definir cómo se traduce capítulo/hito de Campaña a CR de enemigo esperado (duda 5) → **escala de dificultad** por zona/nivel (`characters/enemies.md` §5c).
- [x] Confirmar si el máximo de cartas del mazo (§4, ej. 10) cuenta solo el equipo o también las cartas de clase → **cuenta todas** (clase + equipo). El límite podrá subirse más adelante si hace falta.
- [x] Terminar de definir la mecánica de Maldición (§3.2) → [`cards/curses.md`](cards/curses.md): severidad Leve/Grave, catálogo de 8, fuentes, y limpieza (Templo por oro o prueba). Falta balancear.

## Referencias de inspiración

- Mecánica de mazo/pruebas: `docs/links.txt` (ejemplos visuales de CSS para cartas) y `public/assets/viajesporlatierramedia_examplecards*` (cartas reales de Viajes por la Tierra Media).
- Estadísticas y progresión: reglas base de D&D 5ª edición.
