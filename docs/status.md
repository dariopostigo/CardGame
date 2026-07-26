# CardGame — Estado del diseño (dashboard)

Foto única y honesta de qué está definido y qué no, para no perderse entre los checklists repartidos por cada documento. Los detalles finos siguen viviendo en cada doc; esto solo consolida.

**Leyenda:** ✅ Definido · 🟡 Parcial / boceto · ⭕ Abierto / sin empezar

> **"Definido" = hay una regla clara sobre el papel.** NO significa *balanceado* ni *implementado en código* — eso son fases aparte (ver "Transversal"). Casi todas las cifras actuales son un "primer pase" sin balancear.

## 1. Sistemas de reglas — el "cómo se juega"

| Sistema | Estado | Nota |
|---|---|---|
| **Setup de partida** (modalidad → héroe → kit → entrada) | ✅ | `game-design.md` §1b; kits por clase en `characters/heroes.md` §2d; entrada en **una esquina** (`board/board-map.md` §2c) |
| Estadísticas y personaje (6 stats, mod, CA, PV) | ✅ | `game-design.md` §2 |
| Movimiento y rango de visión | ✅ | 2 mov (mínimo 1) + **visión en dos radios**: detalle `3 + mod SAB` (fichas) y terreno `+2` (silueta), con los invariantes `detalle > detección enemiga` y `terreno > detalle` (`game-design.md` §2.3). Efectos de terreno oficiales para los 5 del prototipo (`board/board-map.md` §3a). Cifras a afinar contra el tablero real |
| Combate (turno, iniciativa, adyacencia, ataque, estados) | ✅ | `game-design.md` §4b. **Iniciativa = tirada** 1d20+DES (decidido); **Desengancharse** (§4b.11) sustituye al "golpe de oportunidad", que se descartó |
| Detección / comportamiento de enemigo | ✅ | Modelo latente→activo + rango de detección (2 + SAB), leash (2 turnos) y reducción por terreno resueltos (`characters/enemies.md` §2); **fase de aproximación + prueba de sigilo** (§2b); **IA de combate** = árbol de prioridades determinista, patrón único (`characters/enemies.md` §5b.6) |
| Descanso y recuperación | ✅ | `game-design.md` §4c. **Cura fija** (mitad de PV máx) en el prototipo; los Dados de Vida quedan diferidos a la progresión de nivel, porque a nivel 1 darían 1 solo uso por partida |
| Economía / oro | ✅ | `game-design.md` §6b (sin balancear). **Oro inicial = 0**; **cada NPC compra lo que vende** (§6b.4) |
| Nivel de Amenaza (reloj de capítulo) | ✅ | Barra por capítulo, umbrales mixtos (25/50/75/100), ganar/perder capítulo; obligatorio en ambos modos (`game-design.md` §6c). Base **+1/turno** (decidido); tope, umbrales y demás fuentes **pendientes de reajustar** a esa base |
| Mazo, Oteo y máximo | ✅ | `game-design.md` §4. Dos zonas: **Mazo ≤20** (clase + items + mercenarios; swap 1-por-1) + **"en juego" con tope elástico** `techo(Mazo ÷ 2)` entre 3 y 10 — el 10 fijo anterior era un tope **muerto** con un Mazo pequeño. Cada turno **oteas 2 al azar / preparas 1**, con regla para Mazo de <2 cartas. Arranca con ~8 cartas (kit inicial). **Armas y armaduras van aparte** (equipo, §4a) |
| **Progresión / subida de nivel** | ⭕ | **Aparcada por decisión del usuario.** Solo enunciado (milestone, +1 PV, 1 Especial/nivel). Concepto propuesto sin escribir: "level-up draft" (ver memoria) |

## 2. Contenido — el "con qué se juega"

| Contenido | Estado | Nota |
|---|---|---|
| Héroes (identidad + stats + kit) | ✅ | 4 héroes con **ficha de selección** (historia + fuertes/débiles, §1b) y **kit inicial** por clase (§2d) en `characters/heroes.md`. Prototipo arranca con **Guerrero + Mago** (decidido); Pícaro/Clérigo después |
| Cartas de clase — **nivel 1** | ✅ | 3 Básicas + 1 Especial por héroe (`cards/class.md`). El tipo `Pasiva` se retiró de la v1 (se saltaba el Oteo); reformulado como *Aura/Postura* en `ideas.md`. **Ampliarlas sigue siendo deseable** por identidad y variedad de Oteo, ya no por tamaño de Mazo |
| Cartas de clase — **niveles 2+** | ⭕ | Nada más allá de nivel 1; ligado a la progresión (§1) |
| Cartas y objetos de exploración (clase + ítems + NPC) | ✅ | Set inicial listado (Ojo avizor —clase—, Mapa del cartógrafo —ítem—, Antorcha —arma soporte—, Informante —NPC—, Vista lejana —futura—) en `board/board-map.md` §8 |
| Armas | ✅ | Valores de 1er pase (`cards/weapons.md`); **sistema de equipo** (llenan tus 2 manos), aparte del Mazo y sin límite de colección (`game-design.md` §4a) |
| Armaduras | ✅ | Valores de 1er pase + fórmula de CA (`cards/armor.md`); equipo aparte (1 equipada, §4a) |
| Items | ✅ | Lista + consumibles + Hoguera + efectos de objetos mágicos + cartas de movimiento (`cards/items.md`). **Mochila deshabilitada** (su efecto era neto 0). Falta balancear |
| Mercenarios | ✅ | Sistema (reclutar por prueba / comprar por oro) + catálogo de 6, con **alcance melee/distancia medido desde el héroe** y **tirada de ataque** por rareza (`cards/mercenaries.md` §1b). Falta balancear |
| Efectos / estados | ✅ | 11 estados (incl. **Miedo**) con efecto/duración/fuentes/cura + reglas generales (representación, CD 12, timing, stacking) en `effects.md`. Falta balancear |
| Maldiciones | ✅ | Severidad Leve/Grave, catálogo de 8, fuentes y limpieza (Templo/prueba) en `cards/curses.md`. Falta balancear |
| Mazo de encuentro | ✅ | 10 cartas de Combate + 10 de Suceso, cruce con las 6 fichas, mazo único (`cards/encounter.md`). Falta balancear frecuencias |
| **Enemigos — bloque de combate** | ✅ | 10 bloques jugables (PV/CA/ataque/daño/velocidad/detección/habilidad) + reglas de derivación (`characters/enemies.md` §5b). Falta balancear |
| Enemigos — bestiario (variedad) | 🟡 | ~8 normales/élite + 2 jefes de ejemplo (`characters/enemies.md`) |
| NPCs | 🟡 | 8 tipos definidos (7 en el prototipo; el Dador de misión es solo Campaña) (incl. **Sacerdote/Sanador** que limpia Maldiciones) e interacción ✅; **Mercenario resuelto** (`cards/mercenaries.md`); **stock de tienda resuelto** (4/3/3/2 cartas, sorteadas por capítulo y fijas hasta el siguiente, `characters/npcs.md` §3); NPCs con nombre = sin definir |

## 3. Mundo y estructura

| Área | Estado | Nota |
|---|---|---|
| Tablero: hexágonos, niebla, fichas | ✅ (concepto) | `board/board-map.md` |
| Generación de mapa | ✅ (prototipo) | Hex-por-hex con pesos + tablas de probabilidad (terreno y fichas) en `board/board-map.md` §2c, con **entrada en una esquina** y **1 Pueblo + 1 Guarida garantizados** (sin Pueblo garantizado, tienda/descanso largo/limpiar maldiciones podían quedar inaccesibles). El sistema por **tiles** queda para post-prototipo. Enemigos **no reaparecen** (`characters/enemies.md` §2) |
| Terrenos (set de 5) | ✅ | Mecánicas oficiales (movimiento/detección/combate/descanso/peligro) en `board/board-map.md` §3a. Falta balancear |
| Localizaciones especiales | ✅ (prototipo) | Prototipo = Pueblo + Mazmorra + Guarida (`board/board-map.md` §8); catálogo completo para después |
| Partida rápida | ✅ | Reglas + generación + condición de victoria (boss de Guarida) listas (`board/board-map.md` §2b-2c) |
| Modo Campaña / historia / capítulos | ⭕ | Estructura conceptual ✅ (y es un **contenedor de varias historias** seleccionables, no un arco único — `board/board-map.md` §2b); **cero contenido narrativo escrito** (fase post-prototipo) |
| Mapeo hito → CR (dificultad) | ✅ | Escala por zona (Partida rápida) / nivel-capítulo (Campaña) en `characters/enemies.md` §5c |
| Condición de victoria/derrota | ✅ | Combate (§4b.8) + objetivos por modo (`board/board-map.md` §2b) |

## 4. Transversal

| Área | Estado | Nota |
|---|---|---|
| **Tabla de loot** | ⭕ | **Hueco de contenido pendiente:** nadie define qué carta suelta un enemigo o un cofre, ni con qué rareza. Bloquea el botín y el umbral del 25 % de Amenaza ("empeora el loot") |
| **Reescalado del Nivel de Amenaza** | ⭕ | La base bajó a **+1/turno** pero el tope 100, los umbrales 25/50/75 y las subidas de golpe (+10 acampar, +8 alertar/huir, +15 Mal augurio) siguen calibrados para el "+5 por ronda" antiguo (`game-design.md` §6c.1-6c.2) |
| **Balance** (todas las cifras) | ⭕ | Todo es "primer pase"; se afina con el prototipo |
| Arte / UI / visual | ⭕ | Diferido a fase de arte (IA generativa) |
| Implementación / código | ⭕ | Nada de app todavía |
| Modelo de datos / técnico | ✅ | Modelo alineado con el diseño (Hex, Terreno, Character, Enemy, Card) en `board/board-map-dev.md`; el código en sí es la fase de build |

## 5. Resumen honesto

**El diseño sobre papel de la Partida rápida está completo, y ahora también el arranque.** Todo el bucle tiene reglas claras y jugables: abrir la app → elegir modalidad y héroe → recibir el kit → entrar por una esquina → moverse → explorar → detectar/ser detectado → combatir → recuperarse → comprar/vender.

La tanda de revisión que cerró esto arregló, además de rellenar huecos, **cuatro cosas que estaban rotas y no solo incompletas**:
1. **El Oteo no funcionaba a nivel 1** — con 4 cartas de clase el Mazo se vaciaba en 3 turnos. Arreglado con el kit inicial (~8 cartas) + el tope elástico de "en juego".
2. **El sigilo estaba muerto** — la visión del héroe (1) era menor que la detección enemiga (2), así que la fase de aproximación nunca podía dispararse. Arreglado con los dos radios de visión y el invariante `detalle > detección`.
3. **El "golpe de oportunidad" se referenciaba en 3 cartas y no existía.** Resuelto como *Desengancharse*, una sola regla simétrica.
4. **Sin Pueblo garantizado**, tienda + descanso largo + limpiar Maldiciones podían quedar inaccesibles en una partida entera.

**Lo que queda:**
1. **Tabla de loot** — el único hueco de *contenido* que sigue bloqueando (§4).
2. **Reescalado del Nivel de Amenaza** a la base de +1/turno (§4).
3. **Balance** — necesita *jugar* para afinar cifras; no se puede cerrar en papel.
4. **Progresión más allá del nivel 1** — aparcada por decisión del usuario. Arrastra los Dados de Vida y las cartas de clase de nivel 2+.
5. **Contenido de Campaña** (narrativa, capítulos, historias) — fase posterior al prototipo.
6. **Arte / UI** y **código** — fases propias.

## 6. Punto de inflexión

**Se ha agotado el diseño de reglas que se puede hacer sin construir.** Lo que queda requiere o bien un prototipo jugable (balance, loot, reescalado de Amenaza), o bien decisiones aparcadas (niveles) o pospuestas (campaña).

**El siguiente paso natural es construir el prototipo de la Partida rápida**: implementar el mapa hex con las dos capas de niebla (`board/board-map.md` §2c), un puñado de enemigos (`characters/enemies.md` §5b), el Guerrero y el Mago con su kit y sus cartas (`characters/heroes.md` §2d, `cards/class.md`) y el bucle de combate (`game-design.md` §4b), para poder empezar a balancear jugando.

**Decisiones que se pueden tomar sobre la marcha con valores provisionales** (no hace falta cerrarlas antes de empezar): qué enemigo concreto sale en cada ficha, la definición de "zona cerca/media/lejana" en hexes, las reglas de la ficha de Terreno, la generación del sub-mapa de Mazmorra y una CD 12 por defecto para las pruebas de ficha.
