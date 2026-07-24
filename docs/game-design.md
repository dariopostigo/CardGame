# CardGame — Documento de diseño (borrador inicial)

Mezcla de mecánicas de **D&D** (personajes, estadísticas, progresión, identidad de héroes/enemigos/NPCs — ver [`heroes.md`](characters/heroes.md), [`enemies.md`](characters/enemies.md), [`npcs.md`](characters/npcs.md)) con **Viajes por la Tierra Media** como inspiración solo de la **estructura de cartas y mazo** (mazo personal, iconografía de pruebas) y del **tablero** (ver [`board-map.md`](board/board-map.md)) — no de la identidad de personajes/razas, que ya se fijó como D&D puro. Este documento se irá ampliando iteración a iteración. Términos transversales en [`glossary.md`](glossary.md); catálogo de cartas por tipo en [`cards/`](cards/README.md). **Foto de qué está definido vs. pendiente en [`status.md`](status.md).** Ideas sin decidir todavía, aparcadas en [`ideas.md`](ideas.md).

## 1. Concepto central

Cada jugador controla un personaje con estadísticas de tipo D&D. Construye y baraja un **mazo personal** (clase + objetos equipados) que representa tanto sus capacidades como la suerte de cada turno. Las cartas de objeto (armas, armaduras, pociones, hechizos) se juegan desde la mano para modificar estadísticas propias, de aliados o de enemigos, o para aplicar ventaja/desventaja.

## 2. Personaje y estadísticas

Base D&D (6 características clásicas). Cada personaje tiene: PV, Nivel, Clase, Velocidad (§2.2) y las 6 estadísticas con su modificador (igual que D&D: `mod = floor((stat - 10) / 2)`).

### 2.1 Qué hace cada estadística (mecánica concreta)

| Estadística | En combate | Fuera de combate / exploración | Ejemplo de prueba |
|---|---|---|---|
| **Fuerza** | Bono a precisión y daño de armas cuerpo a cuerpo pesadas | Forzar puertas, cargar peso, pruebas de atletismo | "¿Derribas esta puerta atrancada?" |
| **Destreza** | Iniciativa (orden de turno), Defensa/CA base, precisión y daño de armas ligeras/a distancia | Sigilo, acrobacias, desactivar mecanismos simples | "¿Te detecta la ronda enemiga al cruzar el claro?" |
| **Constitución** | Puntos de Vida máximos (junto al dado de vida de la clase) | Resistencia a veneno, enfermedad, agotamiento | "¿Resistes el veneno del Trasgo de pantano?" |
| **Inteligencia** | Precisión y CD de hechizos arcanos (Mago) | Identificar objetos/trampas, pruebas de conocimiento | "¿Reconoces qué activa esta runa?" |
| **Sabiduría** | Precisión y CD de hechizos divinos/naturales (Clérigo) | **Determina el rango de visión base en el mapa** (Percepción); intuir intenciones | "¿Notas algo raro en esa Ficha de Amenaza antes de activarla?" |
| **Carisma** | Hechizos de pacto/inspiración (clases futuras) | Interacción con NPCs (precios, persuasión); límite de mercenarios contratables | "¿Consigues que el mercader te baje el precio?" |

Otros valores derivados directamente de las estadísticas:
- **Defensa/CA** = 10 + mod Destreza (+ bono de armadura equipada).
- **PV máximo** = dado de vida de la clase (nivel 1: máximo del dado; niveles siguientes: tirada o promedio, a decidir) + mod Constitución por nivel.

### 2.2 Movimiento

**Estándar: 2 movimientos por turno para todos los personajes**, sin variación por raza (sustituye la idea anterior de Velocidad-por-raza). 1 movimiento = 1 hexágono cruzado en `board-map.md`, modificado por el terreno de cada hexágono (`board-map.md` §3).

Fuentes de movimiento **extra** por encima del estándar:
- **Fichas del tablero** (ej. un NPC informante/guía, `npcs.md`) que conceden movimiento adicional puntual.
- **Cartas de movimiento** — un tipo de carta de equipo/objeto que se juega para ganar movimiento extra ese turno.
- **Cartas de clase innatas** — ciertos héroes pueden tener ya en su mazo cartas que dan movimiento extra desde el principio (ej. el Pícaro, coherente con su rol explorador en `heroes.md`).

### 2.3 Rango de visión

Rango de visión base = 1 hexágono (el actual + vecinos inmediatos, según `board-map.md` §4), gobernado por **Sabiduría**: cada +2 de modificador de Sabiduría añade +1 hexágono de rango. Las Cartas Especiales de Clase de exploración (pendientes de diseñar, ver checklist) pueden ampliarlo más allá de esta base, tal como ya anticipaba `board-map.md` §4.

### 2.4 Equipamiento: manos y armadura

- Cada personaje tiene **2 manos**. Las armas ocupan 1 o 2 manos (ver [`cards/weapons.md`](cards/weapons.md) para el listado con su icono ✋/🤲, ver [`glossary.md`](glossary.md)) — se pueden llevar hasta 2 armas de ✋ (una mano), o 1 arma de 🤲 (dos manos), nunca combinando ambas a la vez si no caben en las 2 manos disponibles.
- Cada personaje lleva **1 sola armadura** equipada (no se acumulan varias).
- Al principio de la aventura, el jugador elige con qué armas y armadura equiparse (partiendo del catálogo inicial de [`cards/`](cards/README.md)).

## 3. Tipos de carta

Dos ejes distintos: **de dónde sale la carta** (clase vs. equipo encontrado) y **qué icono/tipo tiene** (para saber cómo y cuándo se juega cada una).

### 3.1 Por origen

1. **Cartas Básicas de Clase** — inspiradas en las cartas "Básica 1/2/3" de Viajes. Cada clase tiene un set fijo de cartas genéricas disponibles desde el nivel 1 (p. ej. Guerrero: "Golpe firme", "Postura defensiva"). Catálogo en [`cards/class.md`](cards/class.md).
2. **Cartas Especiales de Clase** — se desbloquean por nivel/hito, igual que las subclases de D&D. Más potentes, uso limitado (una vez por combate/descanso). Ver [`cards/class.md`](cards/class.md).
3. **Cartas de equipo** — armas, armaduras e items obtenidos jugando (ver §3.2 y [`cards/`](cards/README.md) para el catálogo), se incorporan al mazo mediante el drafting de §4.
4. **Cartas de Mercenario** — compañías a sueldo que se **reclutan** superando una prueba de Carisma en una ficha del tablero (fallarla la convierte en enemigo) o se **compran** por oro; van al mazo como cartas de Acción reutilizables. Catálogo en [`cards/mercenaries.md`](cards/mercenaries.md).

### 3.2 Por tipo (icono diferenciador)

| Tipo | Icono (ejemplo) | Qué hace | Notas |
|---|---|---|---|
| **Arma** | Espada | Añade daño y tipo de daño (lista completa y resistencias en §4b.10); ocupa 1 o 2 manos (§2.4) | Puede requerir stat mínima para usarse sin penalización |
| **Armadura** | Escudo/coraza | Suma a la Defensa/CA; puede restar Destreza si es pesada | Solo 1 equipada a la vez (§2.4) |
| **Item** | Bolsa | Categoría amplia: pociones (efecto instantáneo), hechizos (Cartas Especiales o Pergaminos), objetos de aventura/herramientas/objetos mágicos raros — ver [`cards/items.md`](cards/items.md) | El más variado de los 4 tipos |
| **Mercenario** | 🪖 Casco/estandarte | Carta de Acción: das la orden a una compañía a sueldo (atacar, curarte, etc.); reutilizable, cuesta tu Acción | Origen (reclutar/comprar) y catálogo en [`cards/mercenaries.md`](cards/mercenaries.md) |
| **Maldición** | Calavera/nube negra | Efecto negativo persistente que **ocupa un hueco del mazo** (a diferencia de un Efecto/Estado temporal de combate) — ej. -1 movimiento, 1 de daño cada 2 turnos, otear solo 1 carta en vez de 2 | Definida en [`cards/curses.md`](cards/curses.md) (severidad Leve/Grave, fuentes, limpieza); da incentivo a "limpiar" el mazo |

Además siguen existiendo las **Cartas de Efecto/Estado** (ventaja, desventaja, aturdido, envenenado) que se aplican de forma *temporal* durante una prueba/combate sobre un personaje (propio, aliado o enemigo) — no ocupan hueco de mazo como la Maldición, son more bien un modificador puntual de una carta de Arma/Item/hechizo al jugarse.

Todas las cartas de equipo siguen el mismo patrón que viste en Viajes: **coste** (si aplica) + **texto de efecto** + **modificador de estadística o de prueba**.

### 3.3 Rareza

Determina lo poderosa que es una carta y la dificultad de encontrarla/comprarla (ligado a las Fichas de Tesoro de `board-map.md` y a los precios de `npcs.md`):

| Rareza | Color |
|---|---|
| Común | Gris |
| Poco común | Verde |
| Raro | Azul |
| Épico | Morado |
| Legendario | Dorado |

Aplica a cartas de Arma/Armadura/Item (y previsiblemente Maldición). Las cartas de clase (§3.1) no llevan rareza propia por ahora — quedan fuera de este sistema.

## 4. Mazo y turno

- El mazo de cada jugador = cartas básicas de clase + cartas especiales desbloqueadas + cartas de equipo (§3.2) obtenidas jugando.
- **Construcción del mazo de equipo (nuevo mecanismo):** en cada turno el jugador "otea" 2 cartas de equipo y elige 1 para añadirla de forma permanente a su mazo, hasta un máximo (ej. 10). **Decidido:** el máximo cuenta **todas** las cartas del mazo personal (cartas de clase innatas + equipo drafteado), no solo el equipo. Habrá una explicación in-fiction por desarrollar; si al ganar Cartas Especiales por nivel el límite queda demasiado ajustado, se podrá **subir** el número (mecanismo por definir, quizá ligado al nivel). Detalle en [`cards/README.md`](cards/README.md).
- **Sin barajar ni robar mano:** al no haber mazo-que-se-baraja-y-roba, el jugador puede jugar en cualquier momento **cualquiera** de las cartas que ya tiene en su mazo (dentro del recurso de acción disponible ese turno) para realizar su acción (curarse, ayudar en la aventura, aumentar estadísticas, atacar, etc.).
- **Ninguna carta se pierde al jugarla *(decidido)*:** jugar una carta del mazo personal (equipo, clase, item) cuesta el recurso de turno que le corresponda (Movimiento/Acción/Acción rápida/Carta de Efecto, §4b.3), pero la carta **vuelve a estar disponible** para jugarla otra vez más adelante — no hay descarte permanente ni cartas de "un solo uso" dentro del mazo personal. Textos como "un uso" o "se consume" en cartas de equipo/item **no aplican** y son restos de una idea descartada. El único límite real de repetición son las etiquetas explícitas **1/combate** o **1/descanso** de las Cartas Especiales de Clase (§3.1).
- **Resolución de pruebas — decidido:** al no haber "carta robada al azar", las pruebas y ataques se resuelven con **1d20 + modificador** de la estadística relevante contra una CD/Defensa. Las **cartas actúan como modificadores** de esa tirada (bonus, daño extra, ventaja/desventaja, estados), coherente con el §6 y con "juega cualquier carta cuando quieras". El detalle paso a paso del combate se define en la sección de combate (checklist).

## 4b. Combate (borrador)

Modelo elegido: **todo ocurre sobre el mismo tablero de hexágonos** (no hay pantalla de combate aparte). No es un "mini-juego" separado; el combate es una fase más de la exploración. Resuelve la duda abierta de `board-map.md` §8 ("¿el combate ocurre sobre el hex o en pantalla aparte?").

### 4b.1 Regla de interacción: adyacencia

- El héroe y cualquier otra entidad (enemigo, ficha) **nunca comparten hexágono**.
- Se **actúa sobre un objetivo en un hexágono contiguo** (uno de los 6 vecinos) — atacar cuerpo a cuerpo, interactuar con una ficha (NPC, Tesoro, etc.). Nunca sobre el propio hexágono.
- Ataques **a distancia y hechizos** tienen alcance en hexágonos (definido por el arma/hechizo, p. ej. Arco 3-4 hex), no requieren adyacencia.
- **Alcance mínimo "a distancia": 2 hex** *(decidido)*. El cuerpo a cuerpo ya cubre el hexágono contiguo (1 hex); para que un ataque cuente como **a distancia** tiene que quedar al menos un hexágono vacío entre el héroe y el enemigo (2 hex = 1 hex vacío + el hex del enemigo). Ninguna arma o hechizo a distancia puede tener alcance 1 — ese hueco ya es cuerpo a cuerpo.
- **Inicio del combate:** el héroe termina su movimiento en un hexágono adyacente a un enemigo (o una ficha de Amenaza se revela como enemigo junto a él). No se "entra" en el hexágono del enemigo; se combate desde el contiguo. *(Actualiza la redacción de `board-map.md` §4, ficha de Enemigo, que decía "inicia combate al entrar en el hexágono".)*

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
6. **Ventaja/Desventaja:** tira 2d20 y coge el mejor (ventaja) o el peor (desventaja). La aportan cartas de Efecto, estados o el terreno del hex (emboscada desde Bosque = ventaja; atacar cruzando Llanura/Camino a la vista = posible desventaja — `board-map.md` §4).
7. Restar el daño de los PV del objetivo. A 0 PV → derrotado.

### 4b.5 Movimiento de enemigos: activación por detección *(decidido)*

Los enemigos **sí se mueven**, pero solo tras **detectar al héroe**. Modelo de tres estados (detalle de comportamiento en `enemies.md` §2):

- **Latente:** anclado en su hexágono, no patrulla, mientras el héroe no entre en su **rango de visión** (modificado por la ocultación del terreno del héroe — ej. Bosque dificulta ser detectado, `board-map.md` §3/§4).
- **Activo (detectado el héroe):** se mueve hacia él por el mapa (persecución) e inicia combate al quedar adyacente. Dentro del combate sigue moviéndose (acercarse + golpear si melee, o reposicionarse si a distancia).
- Esto reintroduce la **detección activa** que `enemies.md` §2 tenía aplazada, y da valor mecánico al sigilo/ocultación (evitar o emboscar en vez de pelear siempre).

*(Idea futura, aún sin decidir — nota del diseñador:* enemigos o eventos "cazadores" que buscan proactivamente al héroe por el mapa **antes** de detectarlo por visión. Por ahora la activación es siempre reactiva, por detección.)

### 4b.6 El mazo de encuentro en combate

Resuelve el cross-reference pendiente entre §4 (solo hablaba del mazo personal) y `board-map.md` §5:

- Al iniciar un combate, el sistema revela **1 carta del mazo de encuentro** (`board-map.md` §5) que fija una condición de ESA pelea: emboscada, "el enemigo intenta huir", "el terreno se derrumba", refuerzos, etc.
- Enemigos élite/jefes pueden hacer robar más de una.
- Es **del sistema, no del jugador** (a diferencia del mazo personal) — conviven los dos en la misma pelea.

### 4b.7 Hechizos y maná (aplazado)

No hay sistema de maná definido. Para el prototipo, los hechizos son **Cartas**: Especiales de Clase con límite 1/combate o descanso, o Items (Pergamino). Sin reserva de puntos. El "maná/espacios de conjuro" mencionado en [`cards/items.md`](cards/items.md) queda como **idea futura** si más adelante se quiere granularidad de caster.

### 4b.8 Huir, victoria y derrota

- **Huir:** usar el Movimiento para salir de adyacencia/alcance. Si un enemigo está adyacente, opcionalmente una prueba de DES (`1d20 + mod DES` vs CD) para desengancharse sin recibir un golpe de oportunidad.
- **Victoria:** todos los enemigos a 0 PV → recompensas (loot de la ficha de Tesoro si aplica, posible carta del mazo de encuentro, y avance de hito si era un jefe).
- **Derrota (héroe a 0 PV):** con un solo héroe (`heroes.md`), 0 PV = caído. Modo Prueba → fin de partida; Modo Campaña → reiniciar el mapa/capítulo (el nivel y el mazo persisten). La recuperación entre combates se define en §4c (Descanso y recuperación).

### 4b.9 Estados de combate (borrador)

Aturdido (pierdes la Acción ese turno), Envenenado (daño al inicio de tu turno), Inmovilizado (no puedes usar Movimiento — ej. telaraña de la Araña, `enemies.md` §5), Ventaja/Desventaja (afectan la próxima tirada). Duran un nº de turnos o hasta superar una salvación (`1d20 + mod CON/DES` vs CD) — a afinar. No ocupan hueco de mazo (a diferencia de la Maldición, §3.2).

### 4b.10 Tipos de daño y resistencias

Cada arma/hechizo lleva un **tipo de daño** fijo (`cards/weapons.md`, `cards/class.md`). Dos familias, según de dónde sale el daño:

| Familia | Tipos | Fuente |
|---|---|---|
| **Físicos** (mundanos) | 🗡️ Cortante, 🏹 Perforante, 🔨 Contundente | Armas mundanas (`cards/weapons.md`) |
| **Mágicos/elementales** | 🔮 Arcano, ☀️ Radiante, 🔥 Fuego, 💀 Necrótico | Hechizos de clase (`cards/class.md`) y ataques de jefes (`enemies.md` §5b.4). Arcano = Mago, Radiante = Clérigo/divino, Fuego = hechizos ígneos (ej. Bola de fuego), Necrótico = exclusivo de enemigos de momento |

**Multiplicadores** al aplicar el tipo de daño contra el objetivo:
- **Resistente** → mitad de daño (redondeo hacia abajo).
- **Vulnerable** → daño doble.
- **Inmune** → 0 daño. *(Reservado: ningún enemigo del bestiario lo usa todavía.)*

Quién es resistente/vulnerable a qué **no se decide arma por arma ni enemigo por enemigo suelto**: lo fija la **Naturaleza de criatura** del objetivo (`enemies.md` §3b), con posibles excepciones puntuales como habilidad especial de un enemigo concreto (ej. el Trol de las minas y el fuego, `enemies.md` §5b.3). Los héroes no tienen resistencias propias por ahora (podría llegar más adelante vía armadura/objeto mágico).

## 4c. Descanso y recuperación

**Sin ciclo día/noche automático.** A diferencia de D&D (donde el descanso largo cura "de por sí" al pasar la noche), aquí **la recuperación se hace jugando cartas o visitando localizaciones seguras** — coherente con la filosofía "todo es una carta". El día/noche podría volver en el futuro solo como ambientación/modificador, no como cura automática (idea futura). Tres vías, de menor a mayor alcance:

### 4c.1 Consumibles — en cualquier momento (incluido combate)

- **Poción de vida** ([`cards/items.md`](cards/items.md)): Acción rápida (§4b.3), recupera PV al instante. La vía rápida de emergencia dentro del combate.
- Otros consumibles (pergaminos de curación, antídotos que quitan Envenenado, etc.) siguen el mismo patrón.

### 4c.2 Acampar — carta Hoguera (fuera de combate) = descanso corto

- La carta **Hoguera/Campamento** ([`cards/items.md`](cards/items.md)) solo se juega **fuera de combate**.
- **Efecto:** gastas Dados de Vida (§4c.4) para curarte y **reseteas tus habilidades 1/descanso** (ej. Segundo aliento del Guerrero, [`cards/class.md`](cards/class.md)).
- **Riesgo (tensión + anti-abuso):** acampar en terreno inseguro obliga a robar 1 carta del **mazo de encuentro** ([`cards/encounter.md`](cards/encounter.md)) o a una prueba de detección — puede saltar una **emboscada**. El terreno modifica el riesgo: Bosque es seguro (ocultación), Llanura/Camino quedan expuestos (`board-map.md` §3-4). Esto limita de forma natural y temática el acampar en bucle.
- Además, no puedes volver a acampar hasta que **ocurra algo** (entrar en combate o explorar un grupo nuevo) — evita re-acampar sin avanzar.

### 4c.3 Localización segura — descanso largo

- En **Pueblo/Aldea**, **Taberna** o **Templo/Santuario** (`board-map.md` §3b, `npcs.md`):
- **Efecto:** recuperas **todos los PV**, **recuperas todos los Dados de Vida** gastados, retiras estados negativos y reseteas 1/descanso. **Sin riesgo** (zona segura).
- Puede costar **oro** (economía pendiente) en la Taberna, o ser gratis según el lugar. El Templo puede además limpiar una Maldición ([`cards/curses.md`](cards/curses.md)).

### 4c.4 Dados de Vida (DV)

- Cada héroe tiene **DV = su nivel**, del tamaño de su dado de clase (Guerrero d10, Pícaro/Clérigo d8, Mago d6; `heroes.md` §2c). A nivel 1 = 1 DV.
- **Acampar (4c.2):** gastas 1 o más DV disponibles; por cada uno tiras el dado + mod CON y recuperas esos PV.
- **Descanso largo (4c.3):** recuperas todos los DV gastados.
- *(Modelo recomendado, fiel a D&D. Alternativa más simple para el primer prototipo: que la Hoguera cure una cantidad fija —p. ej. la mitad de los PV máx— sin llevar cuenta de DV.)*

## 5. Progresión de personaje

- Subir de nivel por hitos de historia (como D&D 5e "milestone leveling"), no por XP acumulada — encaja mejor con partidas cortas de cartas.
- Cada nivel: +1 PV máx (según clase), posible mejora de estadística, y desbloqueo de 1 carta especial de clase nueva que se añade al mazo personal.
- El equipo (armas/armaduras/items) se consigue jugando mediante el drafting de §4 (otear 2, elegir 1), no por nivel — dos ejes de progresión en paralelo (personaje vs. mazo de equipo), igual que en Viajes (colección de cartas de Objeto) combinado con el nivel de personaje de D&D.

## 6. Ventajas/Desventajas y objetivo de las cartas

Las cartas de Objeto/Efecto pueden apuntar a:
- **A ti mismo**: +stat, ventaja en próxima prueba, curación.
- **A un aliado**: buff temporal, protección (redirigir daño).
- **A un enemigo**: -stat, desventaja, daño directo, estado (aturdido/envenenado).

Esto es clave para que el "deckbuilding" tenga sentido táctico: no solo mejoras tu personaje, sino que tu mazo también decide cómo afectas al resto de la mesa.

## 6b. Economía y oro

**Recurso: Oro.** Moneda única, un **contador en la hoja de personaje** (no una carta — como los PV o los Dados de Vida, §4c.4). Simple y de sabor D&D; gemas/tesoros de alto valor podrían añadirse como variante futura. Resuelve la duda de economía que bloqueaba a `npcs.md`, al descanso largo (§4c.3) y a la limpieza de Maldiciones ([`cards/curses.md`](cards/curses.md)).

**Persistencia:** en **Modo Campaña** el oro persiste entre mapas (como el nivel y el mazo); en **Modo Prueba** se reinicia por partida.

### 6b.1 De dónde sale (fuentes)

| Fuente | Oro (orientativo, sin balancear) |
|---|---|
| Enemigo Normal derrotado | 1d6 |
| Enemigo Élite | 3d6 + loot bueno garantizado |
| Jefe de capítulo | ~5d10 |
| Jefe final | mucho + recompensa única |
| Ficha de Tesoro (`board-map.md` §4) | carta y/o oro (cofres de mayor rareza pueden dar ambos) |
| Vender cartas al Mercader | según Rareza (§6b.3) |
| Misiones (Dador de misión, `npcs.md`, solo Campaña) | recompensa fija |

### 6b.2 En qué se gasta (sumideros)

- **Comprar cartas** en tiendas (Mercader — Items, Herrero — armas/armaduras, Mago/Encantador — hechizos; `npcs.md`): precio por Rareza (§6b.3).
- **Comprar cartas de Mercenario** (`npcs.md`, [`cards/mercenaries.md`](cards/mercenaries.md)): coste según su Rareza; van a tu mazo (vía segura frente a reclutarlas con una prueba).
- **Limpiar una Maldición** en el Templo / **Sacerdote-Sanador** (`npcs.md`, [`cards/curses.md`](cards/curses.md)): coste fijo (o prueba).
- **Herrero** (`npcs.md`): reparar/mejorar una carta de equipo (subir de rareza o reforjar) — coste por definir.
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

- Los **Legendarios** normalmente **no se venden en tiendas** (solo se encuentran); el mercado llega hasta Épico.
- Las tiendas tienen **stock limitado/rotatorio** (no un catálogo infinito), para que explorar y draftear sigan importando y comprar no eclipse la exploración.

### 6b.4 Cómo encaja con el mazo y el drafting

- Comprar una carta la añade al mazo → **cuenta para el máximo** (§4). El oro da *elección*, pero el tamaño del mazo sigue siendo el límite real: la economía no rompe el equilibrio del mazo.
- **Vender** es el sumidero natural del exceso de cartas: como el mazo tiene tope, cambias equipo que ya no usas por oro para comprar algo mejor. Esto cierra el bucle drafting → tesoro → tienda que antes inflaba el mazo sin salida.

## 7. Próximos pasos / temas a documentar

### Dudas/inconsistencias detectadas al revisar contra board-map.md, enemies.md, npcs.md y heroes.md

1. ~~Faltaba el sistema de puntos de movimiento por turno~~ → **Resuelto (§2.2):** 2 movimientos estándar para todos (no depende de raza ni stat), con extras vía fichas/cartas de movimiento/cartas de clase.
2. ~~Faltaba el sistema de rango de visión / habilidades de exploración~~ → **Resuelto en parte (§2.3):** el rango de visión base lo gobierna Sabiduría. Sigue pendiente diseñar las Cartas Especiales de Clase de exploración que lo amplíen más (ver checklist).
3. ~~Falta un recurso de economía/moneda.~~ → **Resuelto (§6b):** el recurso es **Oro** (contador de personaje), con fuentes (enemigos, tesoros, venta) y sumideros (tiendas, mercenarios, descanso premium, limpiar maldiciones) y precios ligados a la Rareza.
4. ~~El tracker de Miedo seguía como "candidato" pero otros documentos lo asumían adoptado~~ → **Resuelto:** se saca de la documentación activa y pasa a [`ideas.md`](ideas.md). `board-map.md` y `heroes.md` se actualizan para no depender de él.
5. ~~Tensión entre CR de `enemies.md` y el leveling por hitos (§5).~~ → **Resuelto:** en vez de un CR 1:1, la **escala de dificultad** (`characters/enemies.md` §5c) decide qué categorías de enemigo aparecen según la zona del mapa (Modo Prueba) o el nivel/capítulo (Campaña).
6. ~~Falta cross-reference con el mazo de encuentro.~~ → **Resuelto (§4b.6):** en combate conviven el mazo personal (jugador) y el mazo de encuentro (sistema); este último revela 1 carta de condición al iniciar la pelea.
7. ~~El combate paso a paso es un bloqueo compartido~~ → **Resuelto (§4b):** combate sobre el mismo tablero hex por adyacencia, con recurso de acción por turno, ataque paso a paso e iniciativa. Queda **una decisión abierta** (§4b.5): si los enemigos se mueven o no dentro del combate. Pendiente propagar a `board-map.md` §8 y `enemies.md` §2/§4 (hecho en este mismo pase).

### Checklist

- [x] Definir lista de clases iniciales con sus cartas básicas — los **4 héroes** (Guerrero, Mago, Pícaro, Clérigo) tienen Básicas + 1 Especial en [`cards/class.md`](cards/class.md). Roster en [`heroes.md`](characters/heroes.md); falta balancear y decidir si el prototipo arranca con 2-3 o los 4.
- [x] Definir resolución exacta de pruebas — **1d20 + modificador** contra CD/Defensa, con las cartas como modificadores de la tirada (§4, §6).
- [x] Bocetar el catálogo de cartas de equipo por categoría (arma, armadura, item) — ver [`cards/`](cards/README.md) ([`weapons`](cards/weapons.md)/[`armor`](cards/armor.md)/[`items`](cards/items.md)). Cartas de **clase** bocetadas para Guerrero/Mago en [`cards/class.md`](cards/class.md). Bocetos iniciales de [`Efecto/Estado`](effects.md), [`Maldición`](cards/curses.md) y [`Mazo de encuentro`](cards/encounter.md) creados (pendientes de detalle).
- [x] Definir combate: orden de turno, cómo se resuelve un ataque paso a paso — ver **§4b** (adyacencia, iniciativa, recurso de acción por turno, ataque paso a paso, mazo de encuentro). Falta solo confirmar §4b.5 (movimiento de enemigos en combate).
- [x] Definir condición de victoria/derrota y estructura de "descanso" (recuperar recursos) — victoria/derrota en §4b.8; **descanso** en §4c (consumibles / carta Hoguera con riesgo / localización segura, sobre Dados de Vida). Falta balancear valores.
- [ ] Definir las primeras Cartas Especiales de Clase de exploración que amplíen el rango de visión (duda 2, queda solo esta parte).
- [x] Definir recurso de economía/moneda (duda 3) → **Oro** (§6b), con fuentes, sumideros y precios por Rareza. Falta balancear las cifras.
- [x] Definir dado de vida por clase — ver `heroes.md` §2c (Guerrero d10, Pícaro/Clérigo d8, Mago d6).
- [ ] Definir cómo se traduce capítulo/hito de Campaña a CR de enemigo esperado (duda 5).
- [x] Confirmar si el máximo de cartas del mazo (§4, ej. 10) cuenta solo el equipo o también las cartas de clase → **cuenta todas** (clase + equipo). El límite podrá subirse más adelante si hace falta.
- [x] Terminar de definir la mecánica de Maldición (§3.2) → [`cards/curses.md`](cards/curses.md): severidad Leve/Grave, catálogo de 8, fuentes, y limpieza (Templo por oro o prueba). Falta balancear.

## Referencias de inspiración

- Mecánica de mazo/pruebas: `docs/links.txt` (ejemplos visuales de CSS para cartas) y `public/assets/viajesporlatierramedia_examplecards*` (cartas reales de Viajes por la Tierra Media).
- Estadísticas y progresión: reglas base de D&D 5ª edición.
