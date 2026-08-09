# CardGame — Estado del diseño (dashboard)

Foto única y honesta de qué está definido y qué no, para no perderse entre los checklists repartidos por cada documento. Los detalles finos siguen viviendo en cada doc; esto solo consolida.

Es también el **punto de continuación** del proyecto: la §6 dice por dónde se sigue. Lo que no está aquí es la parte técnica —stack, capas, motor de reglas y decisiones de arquitectura—, que vive en `ARCHITECTURE.md` en la raíz del repositorio.

**Leyenda:** ✅ Definido · 🟡 Parcial / boceto · ⭕ Abierto / sin empezar

> **"Definido" = hay una regla clara sobre el papel.** NO significa *balanceado* ni *implementado en código* — eso son fases aparte (ver "Transversal"). Casi todas las cifras actuales son un "primer pase" sin balancear.

## 1. Sistemas de reglas — el "cómo se juega"

| Sistema | Estado | Nota |
|---|---|---|
| **Setup de partida** (modalidad → héroe → kit → entrada) | ✅ | `game-design.md` §1b; kits por clase en `characters/heroes.md` §2d; entrada en **una esquina** (`board/board-map.md` §2c) |
| Estadísticas y personaje (6 stats, mod, CA, PV) | ✅ | `game-design.md` §2 |
| Movimiento y rango de visión | ✅ | 2 mov (mínimo 1) + **visión en dos radios**: detalle `2 + mod SAB` (fichas) y terreno `+2` (silueta), con los invariantes `detalle > detección enemiga` y `terreno > detalle` (`game-design.md` §2.3). Efectos de terreno oficiales para los 6 del prototipo, Mazmorra incluida (`board/board-map.md` §3a). Base bajada de 3 a 2 tras jugar `/dev/movimiento` (2026-08-05); también se corrigió ahí un bug de movimiento casi ilimitado por el bono de Camino |
| Combate (turno, iniciativa, adyacencia, ataque, estados) | ✅ | Partido en dos sitios desde el 2026-08-06 (co-op, `board/battle.md`, decisión raíz #1): la matemática de tirada (iniciativa 1d20+DES, ataque paso a paso, estados, tipos de daño) sigue en `game-design.md` §4b; lo que mide el tablero (adyacencia, Desengancharse, fin de combate, composición, mercenario como ficha) vive en `board/battle.md`. **Ventana de 5-6 turnos** verificada solo para 1 héroe en `game-design.md` §4b.12 — **para 2-4 héroes + composición está sin rehacer** (`board/battle.md` §12), se mide jugando el prototipo |
| Detección / comportamiento de enemigo | ✅ | Modelo latente→activo + rango de detección (2 + SAB), leash (2 turnos) y reducción por terreno resueltos (`characters/enemies.md` §2); **fase de aproximación + prueba de sigilo** (§2b); **IA de combate** = árbol de prioridades determinista, patrón único (`characters/enemies.md` §5b.6) |
| **Co-op y modelo de 3 escenarios** *(añadido 2026-08-06)* | ✅ (diseño) | **1-4 héroes**, en Partida rápida y Campaña por igual (`characters/heroes.md` §4). Tres pantallas: **E1** Exploración (sin cambios de fondo), **E2** Batalla (`board/battle.md`, pantalla propia con la misma geometría hexagonal) y **E3** Pueblo (`characters/npcs.md` §3c, Plaza + panel de oficio). `GameState` raíz con overlays `battle`/`village` nullable — **sin construir todavía**, es diseño sobre papel |
| Descanso y recuperación | ✅ | `game-design.md` §4c. **Cura fija** (mitad de PV máx) en el prototipo; los Dados de Vida quedan diferidos a la progresión de nivel, porque a nivel 1 darían 1 solo uso por partida |
| Economía / oro | ✅ | `game-design.md` §6b (sin balancear). **Oro inicial = 0**; **cada NPC compra lo que vende** (§6b.4) |
| Nivel de Amenaza (reloj de capítulo) | ✅ | Barra **0→40** a **+1/turno**: el tope **es la duración de la partida, 40 turnos** (`game-design.md` §6c.1). Umbrales en los turnos 10/20/30, subidas de golpe reescritas como "cuántos turnos cuesta" (+3 acampar, +2 alertar/huir, +5 Mal augurio, −10 el Tabernero). Con tope 100 el reloj daba 5× lo necesario y no presionaba |
| Mazo, Oteo y máximo | ✅ | `game-design.md` §4. Dos zonas: **Mazo ≤20** (clase + items + mercenarios; swap 1-por-1) + **"en juego" con tope fijo de 5**. Cada turno **oteas 2 al azar / preparas 1**, con regla para Mazo de <2 cartas. Arranca con ~12 cartas (8 de clase + 4 items) y con **2 cartas de habilidad de clase ya preparadas** (§1b paso 4). **Armas y armaduras van aparte** (equipo, §4a) |
| **Regla madre de cartas** | ✅ | **Jugar una carta la saca de "en juego"** y la devuelve al Mazo (`game-design.md` §4). Tres documentos decían lo contrario ("reutilizable cada turno") y quedan corregidos — era la contradicción más grave del sistema: decidía si "en juego" es un *loadout* que se spamea o **munición preparada** |
| **Matemática del combate** | 🟡 | Válida tal cual solo para **1 héroe solo**: PV de protagonista (+10, `game-design.md` §2), ataque secundario (§4b.3), Élite a 4 DV (`characters/enemies.md` §5b.3). El **tope de 2 enemigos simultáneos se sustituyó por un presupuesto de composición** que escala con héroes+mercenario (`characters/enemies.md` §5b.6, `board/battle.md` §4) — con eso, 2-4 héroes ya tienen una regla, pero **nadie ha verificado que la ventana de 5-6 turnos se sostenga** con varios héroes y hasta 6 figuras enemigas a la vez. Es la pieza de balance más grande pendiente del modelo co-op |
| **Duración de una partida** | ✅ | **40 turnos** (= el tope del Nivel de Amenaza, `game-design.md` §6c.1). Es el número del que dependen la tabla de loot, el tamaño final del Mazo y la densidad de fichas — si cambia, se rehacen los tres |
| **Progresión / subida de nivel (personaje)** | ✅ | **Formalizada** *(ya no aparcada)*: `game-design.md` §5. Mismo rango 1-5 que las cartas, cada hito ya concede el nivel. PV y mejora de estadística (Niveles 3/5) concretados para los 4 héroes; **ya no desbloquea cartas** (eso se eliminó al fusionar Básica/Especial, `cards/class.md` §6, con las 8 cartas de cada héroe ya con tabla 1-5). Falta balancear |
| **Progresión de cartas (reforjar)** | 🟡 | `game-design.md` §6d. **Solo NPC + oro, sin uso** *(simplificado)*: coste = trade-in de la tabla de precios (§6b.3), igual para las cinco categorías (21/50/125/340 oro por salto). Arma, Armadura, Mercenario y cartas de clase completan ya su escalera 1-5 (`cards/weapons.md` §5b, `cards/armor.md` §6b, `cards/mercenaries.md` §3b, `cards/class.md` §6a); Item cubre ya los 9 del kit inicial y el resto del catálogo pendiente (§6d.3); Maldiciones usan la versión invertida (el Sacerdote cobra por bajar 1 Nivel, `cards/curses.md` §4) |

## 2. Contenido — el "con qué se juega"

| Contenido | Estado | Nota |
|---|---|---|
| Héroes (identidad + stats + kit) | ✅ | 4 héroes con **ficha de selección** (historia + fuertes/débiles, §1b) y **kit inicial** por clase (§2d) en `characters/heroes.md`. Prototipo arranca con **Guerrero + Mago** (decidido); Pícaro/Clérigo después |
| Cartas de clase | ✅ | **8 cartas de habilidad por héroe**, todas al mismo nivel desde el arranque, sin distinción Básica/Especial, las 8 con tabla de reforjar 1-5 (`cards/class.md` §6). El tipo `Pasiva` se retiró de la v1 (se saltaba el Oteo); reformulado como *Aura/Postura* en `ideas.md`. **Ampliarlas sigue siendo deseable** por identidad y variedad de Oteo, ya no por tamaño de Mazo. Falta balancear las cifras |
| Cartas de clase — **niveles 2+** | ⭕ | Nada más allá de nivel 1; ligado a la progresión (§1) |
| Cartas y objetos de exploración (clase + ítems + NPC) | ✅ | Set inicial listado (Ojo avizor —clase—, Mapa del cartógrafo —ítem—, Antorcha —arma soporte—, Informante —NPC—, Vista lejana —futura—) en `board/board-map.md` §8 |
| Armas | ✅ | Valores de 1er pase (`cards/weapons.md`); **sistema de equipo** (llenan tus 2 manos), aparte del Mazo y sin límite de colección (`game-design.md` §4a). **Escalones Poco común/Raro** para las 7 familias del prototipo (§5b) y sin la propiedad fantasma "Ligera" (§4) |
| Armaduras | ✅ | Valores de 1er pase + fórmula de CA (`cards/armor.md`); equipo aparte (1 equipada, §4a). **Escalones Poco común/Raro** para Cuero tachonado, Cota de escamas y Cota de malla (§6b) |
| Items | ✅ | Lista + consumibles + Hoguera + efectos de objetos mágicos + cartas de movimiento (`cards/items.md`). **Mochila deshabilitada** (su efecto era neto 0). Falta balancear |
| Mercenarios | ✅ | **Ficha del tablero de batalla desde el 2026-08-06** (revierte el modelo anterior de carta-efecto): bloque de combate por Rareza (PV/CA/Mov/Ini/Ataque/Figuras), alcance medido **desde su propia ficha**, cuenta +1 al presupuesto de composición enemiga (`cards/mercenaries.md` §1b, `board/battle.md` §5). Sistema de adquisición sin cambios (reclutar por prueba / comprar por oro), catálogo de 15. Falta balancear |
| Efectos / estados | ✅ | 11 estados (incl. **Miedo**) con efecto/duración/fuentes/cura + reglas generales (representación, CD 12, timing, stacking) en `effects.md`. **Escudado a 2 turnos** y suelo de 2 turnos para todo buff (§1). Falta balancear |
| Maldiciones | ✅ | Severidad a **5 escalones** (mismo eje 1-5 con estrellas que el resto de cartas, leído al revés), catálogo de 9, fuentes y limpieza (Sacerdote baja 1 Nivel, o prueba gratuita) en `cards/curses.md`. Falta balancear |
| Mazo de encuentro | ✅ | 10 cartas de Combate + 10 de Suceso, cruce con las 6 fichas, mazo único (`cards/encounter.md`). Falta balancear frecuencias |
| **Enemigos — bloque de combate** | ✅ | 10 bloques jugables (PV/CA/ataque/daño/velocidad/detección/habilidad) + reglas de derivación (`characters/enemies.md` §5b). **Élite a 4 DV** (24/28/28) y regen del Trol +1; **Velocidad 3** para Lobo/Matriarca/Sombra; **críticos** escritos. **Nivel de enemigo** (1-5, dial de dificultad aparte de Categoría, §5d) nuevo. Falta balancear |
| Enemigos — bestiario (variedad) | 🟡 | ~8 normales/élite + 2 jefes de ejemplo (`characters/enemies.md`) |
| NPCs | 🟡 | 9 tipos definidos (8 en el prototipo; el Dador de misión es solo Campaña) (incl. **Sacerdote/Sanador** que limpia Maldiciones y el **Instructor**, nuevo, que reforja cartas de clase — `game-design.md` §6d.5) e interacción ✅; **Mercenario resuelto** (`cards/mercenaries.md`); **stock de tienda resuelto** (4/3/3/2 cartas, sorteadas por capítulo y fijas hasta el siguiente, `characters/npcs.md` §3); NPCs con nombre = sin definir |

## 3. Mundo y estructura

| Área | Estado | Nota |
|---|---|---|
| Tablero: hexágonos, niebla, fichas | ✅ (concepto) | `board/board-map.md`. Hexágonos y fichas **ya construidos**; la niebla, todavía no |
| Generación de mapa | ✅ **y construida** | **Por losetas**, no hex-por-hex: el sistema de *tiles* se adelantó y ya funciona (`board/board-map.md` §2c). Cada hexágono llega pintado por su pieza, así que la tabla A pasó de sorteo a **objetivo del maquetado**; y **la generación no repinta ni un hexágono**: lo que sale en la partida es el catálogo tal cual. Con **entrada por la boca del camino** de la primera loseta, **1 Guarida garantizada**, la conectividad **medida y no arreglada** (0 hexágonos incomunicados en 300 tableros) y los **huecos cerrados** aceptados como negativo del mapa (§2). El **Pueblo ya no está garantizado, y ya no lo decide el maquetado**: volvió a ser ficha (`board/board-map.md` §4, revertido 2026-08-09), sorteada por la tabla B con la misma incertidumbre que Amenaza o Tesoro — frecuencia real pendiente de medir con el lote de semillas. Enemigos **no reaparecen** (`characters/enemies.md` §2) |
| Terrenos (set de 5) | ✅ | Mecánicas oficiales (movimiento/detección/combate/descanso/peligro) en `board/board-map.md` §3a. Falta balancear |
| Localizaciones especiales | ✅ (prototipo) | **La Mazmorra ya no es localización: es terreno** y la trae maquetada la loseta (`board/board-map.md` §3a, §3b). El **Pueblo volvió a ser ficha** (§4, revertido 2026-08-09) — se retiraron los 5 tipos de loseta de Pueblo y su siembra de NPCs por instancia. Queda **1 localización, la Guarida**, y es invisible: solo marca dónde espera el boss. **Ninguna abre sub-mapa**: la Mazmorra se resuelve en su hexágono (§3b-bis, 1 Élite distinto al boss + 2 cartas de loot; sin luz te embosca) y el Pueblo en su propia pantalla (la Taberna, `characters/npcs.md` §3c) — el sub-mapa de tiles sigue sin construir |
| Fichas del tablero (las 6) | ✅ | Las 6 tienen resolución: Enemigo/Amenaza/Exploración vía mazo de encuentro (`cards/encounter.md` §5), Tesoro vía tabla de loot (`game-design.md` §6b.6), Personaje vía `characters/npcs.md`, y **Terreno** = atajo arriesgado con prueba `1d20 + FUE/DES` vs CD 12: éxito cruza gratis y da una carta de movimiento (también en la tabla de loot, `game-design.md` §6b.6), fallo sufre el peligro del terreno (`board/board-map.md` §4b) |
| Partida rápida | ✅ | Reglas + generación + condición de victoria (boss de Guarida) listas (`board/board-map.md` §2b-2c) |
| Modo Campaña / historia / capítulos | ⭕ | Estructura conceptual ✅ (y es un **contenedor de varias historias** seleccionables, no un arco único — `board/board-map.md` §2b); **cero contenido narrativo escrito** (fase post-prototipo) |
| Mapeo hito → CR (dificultad) | ✅ | Escala por zona (Partida rápida) / nivel-capítulo (Campaña) en `characters/enemies.md` §5c |
| Condición de victoria/derrota | ✅ | Combate (`board/battle.md` §9, trasladado 2026-08-06) + objetivos por modo (`board/board-map.md` §2b) |

## 4. Transversal

| Área | Estado | Nota |
|---|---|---|
| **Tabla de loot** | ✅ | `game-design.md` §6b.6: tres pasos (¿cae carta? · rareza por fuente · tipo de carta) + regla de caída para Épico/Legendario. **Calibrada**: botín moderado, Mazo de 8 → **~14-16** en una partida de 40 turnos, con las cuentas escritas para poder verificarlas. Falta balancear jugando |
| **Reescalado del Nivel de Amenaza** | ✅ | Hecho: tope **40**, umbrales en 10/20/30, subidas de golpe +3/+2/+5 y Tabernero −10 (`game-design.md` §6c.1-6c.3). Cada cifra se lee ahora como "cuántos turnos cuesta", así que sobrevive a un cambio futuro de duración |
| **Modelo de interacción / UX** | ⭕ | **No está escrito en ninguna parte, y no es arte.** Cómo se presentan las 2 cartas del Oteo y la elección, cómo se ve "en juego" y la sustitución con el tope lleno, cómo apuntas a un hexágono, cómo se distinguen las dos capas de niebla. En un juego de cartas es la mitad de la experiencia; se decidirá construyendo, pero conviene saber que se está **inventando**, no implementando |
| **Balance** (todas las cifras) | ⭕ | Todo es "primer pase"; se afina con el prototipo |
| Arte / UI / visual | ⭕ | Diferido a fase de arte (IA generativa) |
| Implementación / código | 🟡 | **Hay app.** Wiki de diseño + repositorios de componentes funcionando, y del motor están **hexágonos, azar con semilla, terrenos, losetas y generación de tablero**, con tres laboratorios en curso (`/dev/losetas`, `/dev/tablero` y `/dev/pieces`). Falta todo lo que toca la partida en sí: turno, mazo, movimiento, visión, combate, comportamiento de las fichas y reloj. Detalle y orden en la §6 |
| **Tests del motor** | ⭕ | Sin runner instalado y sin un solo test, con el motor ya en cuatro dígitos de líneas. Es la deuda que más crece: `node:test` o Vitest, sin decidir |
| Modelo de datos / técnico | ✅ | Modelo alineado con el diseño (Hex, Terreno, Character, Enemy, Card) en `board/board-map-dev.md`; el código en sí es la fase de build |

## 5. Resumen honesto

**El diseño sobre papel de la Partida rápida está completo, y ahora también el arranque.** Todo el bucle tiene reglas claras y jugables: abrir la app → elegir modalidad y héroe → recibir el kit → entrar por una esquina → moverse → explorar → detectar/ser detectado → combatir → recuperarse → comprar/vender.

Las dos tandas de revisión que cerraron esto arreglaron, además de rellenar huecos, **cosas que estaban rotas y no solo incompletas**.

**Primera tanda (arranque y exploración):**
1. **El Oteo no funcionaba a nivel 1** — con 4 cartas de clase el Mazo se vaciaba en 3 turnos. Arreglado con el kit inicial (~8 cartas) + el tope fijo de 5 en "en juego" (se alcanza pronto en cualquier tamaño de Mazo).
2. **El sigilo estaba muerto** — la visión del héroe (1) era menor que la detección enemiga (2), así que la fase de aproximación nunca podía dispararse. Arreglado con los dos radios de visión y el invariante `detalle > detección`.
3. **El "golpe de oportunidad" se referenciaba en 3 cartas y no existía.** Resuelto como *Desengancharse*, una sola regla simétrica.
4. **Sin Pueblo garantizado**, tienda + descanso largo + limpiar Maldiciones podían quedar inaccesibles en una partida entera.

**Segunda tanda (combate):**
5. **Cuatro documentos se contradecían sobre si una carta jugada se queda "en juego" o vuelve al Mazo** — y de eso depende la forma entera de un turno. Resuelto con la **regla madre** (`game-design.md` §4): vuelve al Mazo, "en juego" es munición.
6. **El combate era invencible-por-el-enemigo.** Los tres Élite ganaban a los cuatro héroes (el Guerrero moría en 2 turnos contra el Capitán y necesitaba 23 contra el Trol) y el Mago perdía contra un lobo suelto. Arreglado con PV de protagonista, ataque secundario y Élite a 4 DV — con la ventana verificable en **§4b.12**.
7. **Un héroe solo no puede pelear contra 3 enemigos**, por economía de acción y no por balance de bloques. **Tope de 2** (`characters/enemies.md` §5b.6).
8. **Reglas que se referenciaban sin existir:** la propiedad "Ligera" (de la que colgaban 2 reglas), "disparar a bocajarro", el modificador en el daño de los hechizos, los críticos de los enemigos y el propio **fin de combate** (necesario para saber cuándo puedes volver a acampar).
9. **El *kiting* no funcionaba y tres documentos lo asumían** — el rol del Mago, el paso 3 de la IA enemiga y un arquetipo futuro. Reescritos con lo que sí funciona: control, no velocidad.
10. **No había equipo que encontrar** — todo el catálogo era Común, así que la premisa "el equipo bueno es la recompensa de explorar" no tenía a qué apuntar. Escalones Poco común/Raro en `cards/weapons.md` §5b y `cards/armor.md` §6b.

**Tercera tanda (los bloqueantes del prototipo):**
11. **La tabla de loot no existía** y bloqueaba seis sitios a la vez (ficha de Tesoro, botín al matar, *Hallazgo*, *Botín inesperado*, la Mazmorra y el umbral del 25 %). Escrita y **calibrada** contra un objetivo concreto: Mazo de 8 → ~14-16 (`game-design.md` §6b.6).
12. **El reloj de Amenaza no presionaba.** Tope 100 con base +1/turno daba 100 turnos para una travesía de 15-20: podías recorrer el mapa dos veces. Ahora **el tope es la duración: 40 turnos**, y de ahí salen los umbrales y las subidas de golpe.
13. **Una de las 6 fichas del tablero no tenía ninguna regla** (Terreno). Ahora es un atajo arriesgado con prueba propia, y aparece el doble de veces (`board/board-map.md` §4b).
14. **La Mazmorra pedía un segundo generador entero** sin añadir mecánica nueva. Recortada a **1 hexágono reforzado** (§3b-bis), lo que además da por fin un uso mecánico a la Antorcha.
15. **Nadie había dicho si puedes ver tu propio Mazo.** Sí, la lista completa (§4) — el swap 1-por-1 ya lo exigía.

**Cuarta tanda (co-op y modelo de 3 escenarios, 2026-08-06):**
16. **El prototipo estaba escrito para 1 héroe solo, sin plan para más.** `heroes.md` §4 fijaba un solo héroe, y el tope de 2 enemigos simultáneos (`characters/enemies.md` §5b.6) era matemática de economía de acción para ese único caso. Reabierto a **1-4 héroes en los dos modos** (`characters/heroes.md` §4), con el tope de 2 sustituido por un **presupuesto de composición** que escala con cuántos entran (`characters/enemies.md` §5b.6, `board/battle.md` §4).
17. **El combate se sacó del mapa de exploración a su propia pantalla** (`board/battle.md`, decisión raíz #1) — misma geometría hexagonal y misma matemática de tirada, tablero distinto. El Pueblo hizo lo mismo (E3, `characters/npcs.md` §3c: Plaza + panel de oficio, stock independiente por jugador) — *(superado en parte 2026-08-09: el Pueblo volvió a ser ficha en vez de terreno multi-hexágono; la pantalla propia se mantiene, pero hoy solo tiene construido el primer escalón — fachada + entrada + placeholder de tienda, sin Plaza ni panel de oficio)*.
18. **El mercenario pasó de carta-efecto a ficha del tablero** (`cards/mercenaries.md` §1b), con bloque de combate por Rareza y contando para el presupuesto de composición enemiga — la infraestructura de "una unidad más" ya se pagaba para los enemigos, así que dejar de pagarla para el mercenario no tenía motivo.
19. **El reloj de Amenaza subía por turno de héroe**, que con 4 héroes lo vaciaba en una cuarta parte del tiempo previsto. Corregido a **+1 por ronda de mesa** (`game-design.md` §6c.1).

**Lo que queda:**
1. **Balance** — necesita *jugar* para afinar cifras; no se puede cerrar en papel. Es el motivo de construir. **La pieza más grande ahora mismo:** la matemática de §4b.12 (ventana de 5-6 turnos) solo está verificada para 1 héroe — para 2-4 héroes + composición de hasta 6 figuras está sin rehacer, y no se recalcula en papel (`board/battle.md` §12). Ojo además al probarlo: co-op, pantalla de batalla y balance se estrenan **los tres a la vez** — si algo se siente mal, no hay forma de aislar cuál de los tres es la causa sin jugarlo con cuidado (1-2 héroes antes de 4, por el propio orden recomendado en §6).
2. **Modelo de interacción / UX** (§4) — se inventa construyendo, pero no está escrito.
3. **Progresión más allá del nivel 1** — mecanismo ya formalizado (`game-design.md` §5): PV y estadística por nivel para los 4 héroes; el personaje ya no desbloquea cartas al subir, y las 8 cartas de cada héroe ya tienen tabla de reforjar 1-5 (`cards/class.md` §6). Falta activar los Dados de Vida completos (`game-design.md` §4c.4) y balancear todas las cifras nuevas.
4. **Contenido de Campaña** (narrativa, capítulos, historias) — fase posterior al prototipo.
5. **Arte / UI** — fase propia.
6. **Ampliar catálogos** (más cartas de clase, más enemigos, Épico/Legendario en armas y armaduras) — deseable, nunca bloqueante.

## 6. Por dónde se sigue

**Ya no queda ningún bloqueante de reglas y la construcción está en marcha.** Lo que falta requiere o bien un prototipo jugable (todo el balance), o bien decisiones aparcadas (niveles) o pospuestas (campaña y arte).

**Construido hasta hoy:** el tablero. Hexágonos y coordenadas, azar con semilla, los terrenos, el sistema de **losetas** con su biblioteca editable (17 tipos y 39 variantes tras retirar los 5 de Pueblo, los cinco tamaños) y la **generación del tablero** completa: encaje por anclas en los tres tamaños (**12, 15 ó 18 losetas**, 12 el mínimo), entrada, conectividad medida, Guarida garantizada, siembra de fichas —Pueblo incluido, otra vez ficha y no terreno— y huecos cerrados. Y el **diseño de las fichas** (`board/board-map.md` §4c): las 7 de contenido y las 3 de personaje, todas en el mismo disco tumbado y con sus cuatro estados. Se trabaja en `/dev/losetas`, `/dev/tablero` y `/dev/pieces`.

**Lo inmediato, dentro del tablero:**
- **El lote de semillas** — cientos de tableros de golpe en `/dev/tablero`, para mirar el reparto y no el ejemplar. Las cifras que este documento y `board/board-map.md` §2c citan ("300 tableros") se midieron a mano; hasta que el lote exista, cada afirmación sobre el reparto hay que volver a medirla igual. **Y hay que remedirlas todas**: se midieron con tableros de **9 losetas** y el tamaño mínimo ha subido a **12** (los tres son 12/15/18, `board/board-map.md` §2c), así que suben la cobertura de Mazmorra, los huecos cerrados y sobre todo la **travesía máxima**, que es la que el reloj de 40 turnos da por supuesta. Además, al quitar los 5 tipos de loseta de Pueblo cambió la composición entera de la bolsa, así que ninguna cifra medida con la biblioteca vieja sigue siendo válida — el lote de semillas hay que correrlo de cero.
- **Decisión abierta:** Camino y Montaña salen en el tablero por debajo de su cuota de bolsa (16,7 vs 19,8 · 8,9 vs 9,8) porque tienen anclas restringidas. Subir pesos o dar preferencia al ancla de camino al colocar (`board/board-map.md` §2c).
- **Tests del motor** (§4) — elegir runner y cubrir los invariantes del encaje antes de que el motor doble de tamaño.

**Decisiones que se pueden tomar sobre la marcha con valores provisionales** (no hace falta cerrarlas antes de seguir): qué enemigo concreto sale en cada ficha dentro de su categoría, la definición de "zona cerca/media/lejana" en hexes, los nombres propios de 2-3 NPCs y una CD 12 por defecto para las pruebas de ficha.

**Orden de lo que queda**, de lo que desbloquea más a lo que menos:
1. **Fichas** en el tablero por orden de frecuencia: Amenaza y Personaje (~6,7 y ~5,3 por mapa) → Enemigo y Tesoro → Exploración → **Terreno al final** (~1,8 por mapa, `board/board-map.md` §4b).
2. Turno, movimiento y **Oteo** (`game-design.md` §4) con el Guerrero y sus 8 cartas: es el bucle mínimo jugable.
3. **Combate** (`game-design.md` §4b) contra 1 Normal, y luego el tope de 2.
4. **Tabla de loot** (`game-design.md` §6b.6) y **reloj de Amenaza** (§6c) — con esto la partida ya se gana y se pierde.
5. Pueblo, tiendas y descanso; el **Mago** como segundo héroe (es el que más estresa el sistema: 16 PV, alcance, bocajarro).
6. **La niebla, al final y a propósito** (`board/board-map.md` §4): la de dos capas por hexágono está escrita y la de grupo se podría construir ya, pero cuál es la buena depende de cómo se comporte la **ficha del héroe** en el tablero, así que espera a las fichas de personaje.
