# CardGame — Estado del diseño (dashboard)

Foto única y honesta de qué está definido y qué no, para no perderse entre los checklists repartidos por cada documento. Los detalles finos siguen viviendo en cada doc; esto solo consolida.

**Leyenda:** ✅ Definido · 🟡 Parcial / boceto · ⭕ Abierto / sin empezar

> **"Definido" = hay una regla clara sobre el papel.** NO significa *balanceado* ni *implementado en código* — eso son fases aparte (ver "Transversal"). Casi todas las cifras actuales son un "primer pase" sin balancear.

## 1. Sistemas de reglas — el "cómo se juega"

| Sistema | Estado | Nota |
|---|---|---|
| Estadísticas y personaje (6 stats, mod, CA, PV) | ✅ | `game-design.md` §2 |
| Movimiento y rango de visión (base) | ✅ | Reglas base (2 mov, visión por SAB) + efectos de terreno oficiales para los 5 del prototipo (`board/board-map.md` §3a) |
| Combate (turno, iniciativa, adyacencia, ataque, estados) | ✅ | `game-design.md` §4b |
| Detección / comportamiento de enemigo | ✅ | Modelo latente→activo + rango de detección (2 + SAB), leash (2 turnos) y reducción por terreno resueltos (`characters/enemies.md` §2); **fase de aproximación + prueba de sigilo** (§2b); **IA de combate** = árbol de prioridades determinista, patrón único (`characters/enemies.md` §5b.6) |
| Descanso y recuperación | ✅ | `game-design.md` §4c |
| Economía / oro | ✅ | `game-design.md` §6b (sin balancear). **Oro inicial = 0** (decidido) |
| Nivel de Amenaza (reloj de capítulo) | ✅ | Barra por capítulo, umbrales mixtos (25/50/75/100), ganar/perder capítulo; obligatorio en ambos modos (`game-design.md` §6c). Base **+1/turno** (decidido); tope, umbrales y demás fuentes **pendientes de reajustar** a esa base |
| Mazo, Oteo y máximo | ✅ | `game-design.md` §4. Dos zonas (decidido): **Mazo ≤20** (clase + items + mercenarios; swap 1-por-1) + **"en juego" ≤10** preparadas. Cada turno **oteas 2 al azar / preparas 1**. **Armas y armaduras van aparte** (equipo, §4a) |
| **Progresión / subida de nivel** | ⭕ | **Aparcada por decisión del usuario.** Solo enunciado (milestone, +1 PV, 1 Especial/nivel). Concepto propuesto sin escribir: "level-up draft" (ver memoria) |

## 2. Contenido — el "con qué se juega"

| Contenido | Estado | Nota |
|---|---|---|
| Héroes (identidad + stats + DV) | ✅ | 4 héroes (`characters/heroes.md`). Prototipo arranca con **Guerrero + Mago** (decidido); Pícaro/Clérigo después |
| Cartas de clase — **nivel 1** | ✅ | 3 Básicas + 1 Especial por héroe (`cards/class.md`) |
| Cartas de clase — **niveles 2+** | ⭕ | Nada más allá de nivel 1; ligado a la progresión (§1) |
| Cartas y objetos de exploración (clase + ítems + NPC) | ✅ | Set inicial listado (Ojo avizor —clase—, Mapa del cartógrafo —ítem—, Antorcha —arma soporte—, Informante —NPC—, Vista lejana —futura—) en `board/board-map.md` §8 |
| Armas | ✅ | Valores de 1er pase (`cards/weapons.md`); **sistema de equipo** (llenan tus 2 manos), aparte del Mazo y sin límite de colección (`game-design.md` §4a) |
| Armaduras | ✅ | Valores de 1er pase + fórmula de CA (`cards/armor.md`); equipo aparte (1 equipada, §4a) |
| Items | ✅ | Lista + consumibles + Hoguera + efectos de objetos mágicos + cartas de movimiento (`cards/items.md`). Falta balancear |
| Mercenarios | ✅ | Sistema (reclutar por prueba / comprar por oro) + catálogo de 6 (`cards/mercenaries.md`). Falta balancear |
| Efectos / estados | ✅ | 11 estados (incl. **Miedo**) con efecto/duración/fuentes/cura + reglas generales (representación, CD 12, timing, stacking) en `effects.md`. Falta balancear |
| Maldiciones | ✅ | Severidad Leve/Grave, catálogo de 8, fuentes y limpieza (Templo/prueba) en `cards/curses.md`. Falta balancear |
| Mazo de encuentro | ✅ | 10 cartas de Combate + 10 de Suceso, cruce con las 6 fichas, mazo único (`cards/encounter.md`). Falta balancear frecuencias |
| **Enemigos — bloque de combate** | ✅ | 10 bloques jugables (PV/CA/ataque/daño/velocidad/detección/habilidad) + reglas de derivación (`characters/enemies.md` §5b). Falta balancear |
| Enemigos — bestiario (variedad) | 🟡 | ~8 normales/élite + 2 jefes de ejemplo (`characters/enemies.md`) |
| NPCs | 🟡 | 8 tipos definidos (7 en el prototipo; el Dador de misión es solo Campaña) (incl. **Sacerdote/Sanador** que limpia Maldiciones) e interacción ✅; **Mercenario resuelto** (`cards/mercenaries.md`); NPCs con nombre = sin definir |

## 3. Mundo y estructura

| Área | Estado | Nota |
|---|---|---|
| Tablero: hexágonos, niebla, fichas | ✅ (concepto) | `board/board-map.md` |
| Generación de mapa | ✅ (prototipo) | Hex-por-hex con pesos + tablas de probabilidad (terreno y fichas) en `board/board-map.md` §2c. El sistema por **tiles** (con fichas en agrupaciones temáticas: campamentos, salas) queda para post-prototipo. Enemigos **no reaparecen** (`characters/enemies.md` §2) |
| Terrenos (set de 5) | ✅ | Mecánicas oficiales (movimiento/detección/combate/descanso/peligro) en `board/board-map.md` §3a. Falta balancear |
| Localizaciones especiales | ✅ (prototipo) | Prototipo = Pueblo + Mazmorra + Guarida (`board/board-map.md` §8); catálogo completo para después |
| Partida rápida | ✅ | Reglas + generación + condición de victoria (boss de Guarida) listas (`board/board-map.md` §2b-2c) |
| Modo Campaña / historia / capítulos | ⭕ | Estructura conceptual ✅; **cero contenido narrativo escrito** (fase post-prototipo) |
| Mapeo hito → CR (dificultad) | ✅ | Escala por zona (Partida rápida) / nivel-capítulo (Campaña) en `characters/enemies.md` §5c |
| Condición de victoria/derrota | ✅ | Combate (§4b.8) + objetivos por modo (`board/board-map.md` §2b) |

## 4. Transversal

| Área | Estado | Nota |
|---|---|---|
| **Balance** (todas las cifras) | ⭕ | Todo es "primer pase"; se afina con el prototipo |
| Arte / UI / visual | ⭕ | Diferido a fase de arte (IA generativa) |
| Implementación / código | ⭕ | Nada de app todavía |
| Modelo de datos / técnico | ✅ | Modelo alineado con el diseño (Hex, Terreno, Character, Enemy, Card) en `board/board-map-dev.md`; el código en sí es la fase de build |

## 5. Resumen honesto

**El diseño sobre papel de la Partida rápida está prácticamente completo.** Todo el bucle tiene reglas claras y jugables: moverse → explorar → detectar/ser detectado → combatir → recuperarse → comprar/vender. Personaje, combate, descanso, economía, terreno, enemigos jugables, todas las categorías de carta, generación de mapa del prototipo y condiciones de victoria: **definidos**.

**Lo que queda NO es diseño de reglas "de mesa":**
1. **Balance** — necesita *jugar* para afinar cifras; no se puede cerrar en papel.
2. **Progresión más allá del nivel 1** — aparcada por decisión del usuario.
3. **Contenido de Campaña** (narrativa, capítulos) — fase posterior al prototipo.
4. **Arte / UI** — fase de arte.
5. **Código / implementación** — construir el prototipo.

## 6. Punto de inflexión

Con esta tanda, **se ha agotado el diseño de reglas que se puede hacer sin construir**. Los puntos restantes (balance, campaña, arte, código) requieren o bien un prototipo jugable, o bien decisiones que el usuario ha aparcado (niveles) o pospuesto (campaña).

**El siguiente paso natural es construir el prototipo de la Partida rápida**: implementar el mapa hex (§2c), un puñado de enemigos (`characters/enemies.md` §5b), 1-2 héroes con sus cartas (`cards/class.md`) y el bucle de combate (`game-design.md` §4b), para poder empezar a balancear jugando.
