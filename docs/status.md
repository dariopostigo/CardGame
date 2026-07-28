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
| Movimiento y rango de visión | ✅ | 2 mov (mínimo 1) + **visión en dos radios**: detalle `3 + mod SAB` (fichas) y terreno `+2` (silueta), con los invariantes `detalle > detección enemiga` y `terreno > detalle` (`game-design.md` §2.3). Efectos de terreno oficiales para los 6 del prototipo, Cueva incluida (`board/board-map.md` §3a). Cifras a afinar contra el tablero real |
| Combate (turno, iniciativa, adyacencia, ataque, estados) | ✅ | `game-design.md` §4b. **Iniciativa = tirada** 1d20+DES; **Desengancharse** (§4b.11) sustituye al "golpe de oportunidad"; **ataque secundario** con la Acción rápida (§4b.3); **a bocajarro** con Desventaja (§4b.1); **críticos simétricos**; **fin de combate definido** (§4b.8, cierra el exploit de huir para recargar `1/combate`). Cuentas y ventana de 5-6 turnos en **§4b.12** |
| Detección / comportamiento de enemigo | ✅ | Modelo latente→activo + rango de detección (2 + SAB), leash (2 turnos) y reducción por terreno resueltos (`characters/enemies.md` §2); **fase de aproximación + prueba de sigilo** (§2b); **IA de combate** = árbol de prioridades determinista, patrón único (`characters/enemies.md` §5b.6) |
| Descanso y recuperación | ✅ | `game-design.md` §4c. **Cura fija** (mitad de PV máx) en el prototipo; los Dados de Vida quedan diferidos a la progresión de nivel, porque a nivel 1 darían 1 solo uso por partida |
| Economía / oro | ✅ | `game-design.md` §6b (sin balancear). **Oro inicial = 0**; **cada NPC compra lo que vende** (§6b.4) |
| Nivel de Amenaza (reloj de capítulo) | ✅ | Barra **0→40** a **+1/turno**: el tope **es la duración de la partida, 40 turnos** (`game-design.md` §6c.1). Umbrales en los turnos 10/20/30, subidas de golpe reescritas como "cuántos turnos cuesta" (+3 acampar, +2 alertar/huir, +5 Mal augurio, −10 el Tabernero). Con tope 100 el reloj daba 5× lo necesario y no presionaba |
| Mazo, Oteo y máximo | ✅ | `game-design.md` §4. Dos zonas: **Mazo ≤20** (clase + items + mercenarios; swap 1-por-1) + **"en juego" con tope elástico** `techo(Mazo ÷ 2)` entre 3 y 10. Cada turno **oteas 2 al azar / preparas 1**, con regla para Mazo de <2 cartas. Arranca con ~8 cartas y con **2 Básicas ya preparadas** (§1b paso 4). **Armas y armaduras van aparte** (equipo, §4a) |
| **Regla madre de cartas** | ✅ | **Jugar una carta la saca de "en juego"** y la devuelve al Mazo (`game-design.md` §4). Tres documentos decían lo contrario ("reutilizable cada turno") y quedan corregidos — era la contradicción más grave del sistema: decidía si "en juego" es un *loadout* que se spamea o **munición preparada** |
| **Matemática del combate** | ✅ | `game-design.md` §4b.12: PV de protagonista (+10, §2), ataque secundario (§4b.3), Élite a 4 DV y **tope de 2 enemigos simultáneos** (`characters/enemies.md` §5b.3, §5b.6). Antes los 3 Élite ganaban a los 4 héroes y el Mago perdía contra un lobo suelto |
| **Duración de una partida** | ✅ | **40 turnos** (= el tope del Nivel de Amenaza, `game-design.md` §6c.1). Es el número del que dependen la tabla de loot, el tamaño final del Mazo y la densidad de fichas — si cambia, se rehacen los tres |
| **Progresión / subida de nivel** | ⭕ | **Aparcada por decisión del usuario.** Solo enunciado (milestone, +1 PV, 1 Especial/nivel). Concepto propuesto sin escribir: "level-up draft" (ver memoria) |

## 2. Contenido — el "con qué se juega"

| Contenido | Estado | Nota |
|---|---|---|
| Héroes (identidad + stats + kit) | ✅ | 4 héroes con **ficha de selección** (historia + fuertes/débiles, §1b) y **kit inicial** por clase (§2d) en `characters/heroes.md`. Prototipo arranca con **Guerrero + Mago** (decidido); Pícaro/Clérigo después |
| Cartas de clase — **nivel 1** | ✅ | 3 Básicas + 1 Especial por héroe (`cards/class.md`). El tipo `Pasiva` se retiró de la v1 (se saltaba el Oteo); reformulado como *Aura/Postura* en `ideas.md`. **Ampliarlas sigue siendo deseable** por identidad y variedad de Oteo, ya no por tamaño de Mazo |
| Cartas de clase — **niveles 2+** | ⭕ | Nada más allá de nivel 1; ligado a la progresión (§1) |
| Cartas y objetos de exploración (clase + ítems + NPC) | ✅ | Set inicial listado (Ojo avizor —clase—, Mapa del cartógrafo —ítem—, Antorcha —arma soporte—, Informante —NPC—, Vista lejana —futura—) en `board/board-map.md` §8 |
| Armas | ✅ | Valores de 1er pase (`cards/weapons.md`); **sistema de equipo** (llenan tus 2 manos), aparte del Mazo y sin límite de colección (`game-design.md` §4a). **Escalones Poco común/Raro** para las 7 familias del prototipo (§5b) y sin la propiedad fantasma "Ligera" (§4) |
| Armaduras | ✅ | Valores de 1er pase + fórmula de CA (`cards/armor.md`); equipo aparte (1 equipada, §4a). **Escalones Poco común/Raro** para Cuero tachonado, Cota de escamas y Cota de malla (§6b) |
| Items | ✅ | Lista + consumibles + Hoguera + efectos de objetos mágicos + cartas de movimiento (`cards/items.md`). **Mochila deshabilitada** (su efecto era neto 0). Falta balancear |
| Mercenarios | ✅ | Sistema (reclutar por prueba / comprar por oro) + catálogo de 6, con **alcance melee/distancia medido desde el héroe** y **tirada de ataque** por rareza (`cards/mercenaries.md` §1b). Falta balancear |
| Efectos / estados | ✅ | 11 estados (incl. **Miedo**) con efecto/duración/fuentes/cura + reglas generales (representación, CD 12, timing, stacking) en `effects.md`. **Escudado a 2 turnos** y suelo de 2 turnos para todo buff (§1). Falta balancear |
| Maldiciones | ✅ | Severidad Leve/Grave, catálogo de 8, fuentes y limpieza (Templo/prueba) en `cards/curses.md`. Falta balancear |
| Mazo de encuentro | ✅ | 10 cartas de Combate + 10 de Suceso, cruce con las 6 fichas, mazo único (`cards/encounter.md`). Falta balancear frecuencias |
| **Enemigos — bloque de combate** | ✅ | 10 bloques jugables (PV/CA/ataque/daño/velocidad/detección/habilidad) + reglas de derivación (`characters/enemies.md` §5b). **Élite a 4 DV** (24/28/28) y regen del Trol +1; **Velocidad 3** para Lobo/Matriarca/Sombra; **críticos** escritos. Falta balancear |
| Enemigos — bestiario (variedad) | 🟡 | ~8 normales/élite + 2 jefes de ejemplo (`characters/enemies.md`) |
| NPCs | 🟡 | 8 tipos definidos (7 en el prototipo; el Dador de misión es solo Campaña) (incl. **Sacerdote/Sanador** que limpia Maldiciones) e interacción ✅; **Mercenario resuelto** (`cards/mercenaries.md`); **stock de tienda resuelto** (4/3/3/2 cartas, sorteadas por capítulo y fijas hasta el siguiente, `characters/npcs.md` §3); NPCs con nombre = sin definir |

## 3. Mundo y estructura

| Área | Estado | Nota |
|---|---|---|
| Tablero: hexágonos, niebla, fichas | ✅ (concepto) | `board/board-map.md`. Hexágonos y fichas **ya construidos**; la niebla, todavía no |
| Generación de mapa | ✅ **y construida** | **Por losetas**, no hex-por-hex: el sistema de *tiles* se adelantó y ya funciona (`board/board-map.md` §2c). Cada hexágono llega pintado por su pieza, así que la tabla A pasó de sorteo a **objetivo del maquetado**; la conectividad es el único paso que puede repintar terreno (0 hexágonos abiertos en 300 tableros). Con **entrada por la boca del camino** de la primera loseta, **1 Pueblo + 1 Guarida garantizados** (sin Pueblo garantizado, tienda/descanso largo/limpiar maldiciones podían quedar inaccesibles) y los **huecos cerrados** aceptados como negativo del mapa (§2). Enemigos **no reaparecen** (`characters/enemies.md` §2) |
| Terrenos (set de 5) | ✅ | Mecánicas oficiales (movimiento/detección/combate/descanso/peligro) en `board/board-map.md` §3a. Falta balancear |
| Localizaciones especiales | ✅ (prototipo) | Prototipo = Pueblo + Mazmorra + Guarida. **Ninguna abre sub-mapa**: se resuelven en su hexágono (`board/board-map.md` §3b-bis) — la Mazmorra es 1 hex reforzado (1 Élite distinto al boss + 2 cartas de loot; sin luz te embosca). El sub-mapa llega con los tiles |
| Fichas del tablero (las 6) | ✅ | Las 6 tienen resolución: Enemigo/Amenaza/Exploración vía mazo de encuentro (`cards/encounter.md` §5), Tesoro vía tabla de loot (`game-design.md` §6b.6), Personaje vía `characters/npcs.md`, y **Terreno** = atajo arriesgado con prueba `1d20 + FUE/DES` vs CD 12 (`board/board-map.md` §4b), que era la única sin regla |
| Partida rápida | ✅ | Reglas + generación + condición de victoria (boss de Guarida) listas (`board/board-map.md` §2b-2c) |
| Modo Campaña / historia / capítulos | ⭕ | Estructura conceptual ✅ (y es un **contenedor de varias historias** seleccionables, no un arco único — `board/board-map.md` §2b); **cero contenido narrativo escrito** (fase post-prototipo) |
| Mapeo hito → CR (dificultad) | ✅ | Escala por zona (Partida rápida) / nivel-capítulo (Campaña) en `characters/enemies.md` §5c |
| Condición de victoria/derrota | ✅ | Combate (§4b.8) + objetivos por modo (`board/board-map.md` §2b) |

## 4. Transversal

| Área | Estado | Nota |
|---|---|---|
| **Tabla de loot** | ✅ | `game-design.md` §6b.6: tres pasos (¿cae carta? · rareza por fuente · tipo de carta) + regla de caída para Épico/Legendario. **Calibrada**: botín moderado, Mazo de 8 → **~14-16** en una partida de 40 turnos, con las cuentas escritas para poder verificarlas. Falta balancear jugando |
| **Reescalado del Nivel de Amenaza** | ✅ | Hecho: tope **40**, umbrales en 10/20/30, subidas de golpe +3/+2/+5 y Tabernero −10 (`game-design.md` §6c.1-6c.3). Cada cifra se lee ahora como "cuántos turnos cuesta", así que sobrevive a un cambio futuro de duración |
| **Modelo de interacción / UX** | ⭕ | **No está escrito en ninguna parte, y no es arte.** Cómo se presentan las 2 cartas del Oteo y la elección, cómo se ve "en juego" y la sustitución con el tope lleno, cómo apuntas a un hexágono, cómo se distinguen las dos capas de niebla. En un juego de cartas es la mitad de la experiencia; se decidirá construyendo, pero conviene saber que se está **inventando**, no implementando |
| **Balance** (todas las cifras) | ⭕ | Todo es "primer pase"; se afina con el prototipo |
| Arte / UI / visual | ⭕ | Diferido a fase de arte (IA generativa) |
| Implementación / código | 🟡 | **Hay app.** Wiki de diseño + repositorios de componentes funcionando, y del motor están **hexágonos, azar con semilla, terrenos, losetas y generación de tablero**, con dos laboratorios en curso (`/dev/losetas` y `/dev/tablero`). Falta todo lo que toca la partida en sí: turno, mazo, movimiento, visión, combate, fichas y reloj. Detalle y orden en la §6 |
| **Tests del motor** | ⭕ | Sin runner instalado y sin un solo test, con el motor ya en cuatro dígitos de líneas. Es la deuda que más crece: `node:test` o Vitest, sin decidir |
| Modelo de datos / técnico | ✅ | Modelo alineado con el diseño (Hex, Terreno, Character, Enemy, Card) en `board/board-map-dev.md`; el código en sí es la fase de build |

## 5. Resumen honesto

**El diseño sobre papel de la Partida rápida está completo, y ahora también el arranque.** Todo el bucle tiene reglas claras y jugables: abrir la app → elegir modalidad y héroe → recibir el kit → entrar por una esquina → moverse → explorar → detectar/ser detectado → combatir → recuperarse → comprar/vender.

Las dos tandas de revisión que cerraron esto arreglaron, además de rellenar huecos, **cosas que estaban rotas y no solo incompletas**.

**Primera tanda (arranque y exploración):**
1. **El Oteo no funcionaba a nivel 1** — con 4 cartas de clase el Mazo se vaciaba en 3 turnos. Arreglado con el kit inicial (~8 cartas) + el tope elástico de "en juego".
2. **El sigilo estaba muerto** — la visión del héroe (1) era menor que la detección enemiga (2), así que la fase de aproximación nunca podía dispararse. Arreglado con los dos radios de visión y el invariante `detalle > detección`.
3. **El "golpe de oportunidad" se referenciaba en 3 cartas y no existía.** Resuelto como *Desengancharse*, una sola regla simétrica.
4. **Sin Pueblo garantizado**, tienda + descanso largo + limpiar Maldiciones podían quedar inaccesibles en una partida entera.

**Segunda tanda (combate):**
5. **Cuatro documentos se contradecían sobre si una carta jugada se queda "en juego" o vuelve al Mazo** — y de eso depende la forma entera de un turno. Resuelto con la **regla madre** (`game-design.md` §4): vuelve al Mazo, "en juego" es munición.
6. **El combate era invencible-por-el-enemigo.** Los tres Élite ganaban a los cuatro héroes (el Guerrero moría en 2 turnos contra el Capitán y necesitaba 23 contra el Trol) y el Mago perdía contra un lobo suelto. Arreglado con PV de protagonista, ataque secundario y Élite a 4 DV — con la ventana verificable en **§4b.12**.
7. **Un héroe solo no puede pelear contra 3 enemigos**, por economía de acción y no por balance de bloques. **Tope de 2** (`characters/enemies.md` §5b.6).
8. **Reglas que se referenciaban sin existir:** la propiedad "Ligera" (de la que colgaban 2 reglas), "disparar a bocajarro", el modificador en el daño de los hechizos, los críticos de los enemigos y el propio **fin de combate** (del que dependen los `1/combate`).
9. **El *kiting* no funcionaba y tres documentos lo asumían** — el rol del Mago, el paso 3 de la IA enemiga y un arquetipo futuro. Reescritos con lo que sí funciona: control, no velocidad.
10. **No había equipo que encontrar** — todo el catálogo era Común, así que la premisa "el equipo bueno es la recompensa de explorar" no tenía a qué apuntar. Escalones Poco común/Raro en `cards/weapons.md` §5b y `cards/armor.md` §6b.

**Tercera tanda (los bloqueantes del prototipo):**
11. **La tabla de loot no existía** y bloqueaba seis sitios a la vez (ficha de Tesoro, botín al matar, *Hallazgo*, *Botín inesperado*, la Mazmorra y el umbral del 25 %). Escrita y **calibrada** contra un objetivo concreto: Mazo de 8 → ~14-16 (`game-design.md` §6b.6).
12. **El reloj de Amenaza no presionaba.** Tope 100 con base +1/turno daba 100 turnos para una travesía de 15-20: podías recorrer el mapa dos veces. Ahora **el tope es la duración: 40 turnos**, y de ahí salen los umbrales y las subidas de golpe.
13. **Una de las 6 fichas del tablero no tenía ninguna regla** (Terreno). Ahora es un atajo arriesgado con prueba propia, y aparece el doble de veces (`board/board-map.md` §4b).
14. **La Mazmorra pedía un segundo generador entero** sin añadir mecánica nueva. Recortada a **1 hexágono reforzado** (§3b-bis), lo que además da por fin un uso mecánico a la Antorcha.
15. **Nadie había dicho si puedes ver tu propio Mazo.** Sí, la lista completa (§4) — el swap 1-por-1 ya lo exigía.

**Lo que queda:**
1. **Balance** — necesita *jugar* para afinar cifras; no se puede cerrar en papel. Es el motivo de construir.
2. **Modelo de interacción / UX** (§4) — se inventa construyendo, pero no está escrito.
3. **Progresión más allá del nivel 1** — aparcada por decisión del usuario. Arrastra los Dados de Vida y las cartas de clase de nivel 2+.
4. **Contenido de Campaña** (narrativa, capítulos, historias) — fase posterior al prototipo.
5. **Arte / UI** — fase propia.
6. **Ampliar catálogos** (más cartas de clase, más enemigos, Épico/Legendario en armas y armaduras) — deseable, nunca bloqueante.

## 6. Por dónde se sigue

**Ya no queda ningún bloqueante de reglas y la construcción está en marcha.** Lo que falta requiere o bien un prototipo jugable (todo el balance), o bien decisiones aparcadas (niveles) o pospuestas (campaña y arte).

**Construido hasta hoy:** el tablero. Hexágonos y coordenadas, azar con semilla, los terrenos, el sistema de **losetas** con su biblioteca editable (17 tipos y 39 variantes, los cinco tamaños) y la **generación del tablero** completa: encaje por anclas, entrada, conectividad, Pueblo y Guarida garantizados, siembra de fichas y huecos cerrados. Se trabaja en `/dev/losetas` y `/dev/tablero`.

**Lo inmediato, dentro del tablero:**
- **El lote de semillas** — cientos de tableros de golpe en `/dev/tablero`, para mirar el reparto y no el ejemplar. Las cifras que este documento y `board/board-map.md` §2c citan ("300 tableros") se midieron a mano; hasta que el lote exista, cada afirmación sobre el reparto hay que volver a medirla igual.
- **Decisión abierta:** Camino y Montaña salen en el tablero por debajo de su cuota de bolsa (16,7 vs 19,8 · 8,9 vs 9,8) porque tienen anclas restringidas. Subir pesos o dar preferencia al ancla de camino al colocar (`board/board-map.md` §2c).
- **Tests del motor** (§4) — elegir runner y cubrir los invariantes del encaje antes de que el motor doble de tamaño.

**Decisiones que se pueden tomar sobre la marcha con valores provisionales** (no hace falta cerrarlas antes de seguir): qué enemigo concreto sale en cada ficha dentro de su categoría, la definición de "zona cerca/media/lejana" en hexes, los nombres propios de 2-3 NPCs y una CD 12 por defecto para las pruebas de ficha.

**Orden de lo que queda**, de lo que desbloquea más a lo que menos:
1. **Fichas** en el tablero por orden de frecuencia: Amenaza y Personaje (~6,7 y ~5,3 por mapa) → Enemigo y Tesoro → Exploración → **Terreno al final** (~1,2 por mapa, `board/board-map.md` §4b).
2. Turno, movimiento y **Oteo** (`game-design.md` §4) con el Guerrero y sus 8 cartas: es el bucle mínimo jugable.
3. **Combate** (`game-design.md` §4b) contra 1 Normal, y luego el tope de 2.
4. **Tabla de loot** (`game-design.md` §6b.6) y **reloj de Amenaza** (§6c) — con esto la partida ya se gana y se pierde.
5. Pueblo, tiendas y descanso; el **Mago** como segundo héroe (es el que más estresa el sistema: 16 PV, alcance, bocajarro).
6. **La niebla, al final y a propósito** (`board/board-map.md` §4): la de dos capas por hexágono está escrita y la de grupo se podría construir ya, pero cuál es la buena depende de cómo se comporte la **ficha del héroe** en el tablero, así que espera a las fichas de personaje.
