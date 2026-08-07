# CardGame — E2: pantalla de Batalla

Documento dedicado a la **pantalla de batalla** (E2), la segunda de las tres pantallas del juego junto a la Exploración (E1, [`board-map.md`](board-map.md)) y el Pueblo (E3, [`../characters/npcs.md`](../characters/npcs.md) §4). Nace de la decisión raíz #1 del rediseño co-op (2026-08-06): el combate sale del mapa de exploración a su propia pantalla. Este documento es su versión canónica. Los detalles técnicos de implementación viven aparte en [`board-map-dev.md`](board-map-dev.md), igual que para el mapa. Términos transversales en [`../glossary.md`](../glossary.md).

## 0. Por qué pantalla aparte, y qué se conserva del mapa *(decisión raíz #1)*

**Antes** (`../game-design.md` §4b original): el combate se resolvía sobre el mismo tablero hexagonal de exploración, sin pantalla propia. **Ahora**: el combate ocurre en su propia pantalla, con **la misma geometría hexagonal, la misma escala y las mismas reglas de resolución de tiradas** que la exploración — no es un reglamento nuevo, es una arena local. Reutiliza `lib/rules/hex.ts` entero (`distance`, `neighbors`, `line`, `hasLineOfSight`, `toPixel`, `polygonPoints`), y los alcances del catálogo (Arco 4 hex, Bastón 2, mercenarios 4-6) siguen significando lo mismo.

**Qué se queda en `../game-design.md` §4b** (sirve en los dos tableros, es matemática de tirada, no de mapa):
- §4b.2 Iniciativa, §4b.3 Recurso de acción por turno, §4b.4 Resolución de un ataque paso a paso, §4b.7 Hechizos, §4b.9 Estados de combate, §4b.10 Tipos de daño y resistencias.

**Qué se traslada aquí** (medía hexágonos del mapa de exploración; ahora se mide en el tablero de batalla):
- Adyacencia y alcance en combate (antes §4b.1) → §2 de este documento.
- Fin de combate, victoria y derrota (antes §4b.8) → §7.
- Desengancharse (antes §4b.11) → §6.

**Qué se queda en `../characters/enemies.md` §2/§2b** (es la fase de **aproximación**, sucede en E1, antes de abrir esta pantalla): detección, sigilo, emboscada. Lo que decide *si* y *cómo* se abre la batalla sigue siendo de exploración; lo que pasa *dentro* de la batalla es este documento.

**Riesgo a vigilar de cerca:** si E1 no se lleva nada de sí mismo a la batalla, el mapa se queda en logística (mover 2 hex, clicar fichas, mirar el reloj) y todo lo ya construido en exploración (losetas, niebla en dos capas, visión en dos radios, detección, sigilo) sirve a un escenario que ya no decide la partida. El antídoto son las palancas de §1.

## 1. E1 → E2: quién entra a la batalla

**Radio de entrada:** los héroes a **≤3 hex** del hexágono donde se abre la batalla (no 2 — la Detección máxima del bestiario es 3-4, así que con radio 2 un enemigo perceptivo arranca la pelea dejando a compañeros fuera sin que "ver primero" proteja de nada). Los que quedan fuera:
- Siguen jugando su turno de exploración normal (Oteo, movimiento, interactuar con otra ficha si no hay ninguna otra batalla abierta).
- Si con su movimiento quedan a ≤3 hex del hexágono de la batalla, **entran al inicio de la ronda siguiente** por su borde de despliegue, tirando iniciativa al aparecer (misma regla que los refuerzos de `../characters/enemies.md` §5b.6).
- **No** pueden jugar cartas dirigidas a la batalla desde fuera del radio.

Un solo tablero de batalla abierto a la vez; quien active un segundo encuentro con otro ya abierto, espera.

**Emboscada** (llegada sin ser detectado, `../characters/enemies.md` §2b): ronda 1 entera del bando héroe antes de que actúe cualquier enemigo, con Ventaja en el primer ataque de todos.

**Un héroe caído en el mapa de exploración** — ver §7.2 (fin de batalla). Con compañeros presentes, 0 PV no es muerte: es un estado *Derribado* rescatable. En **solo**, sigue la regla dura de siempre.

## 2. Geometría, adyacencia y alcance

**Tablero:** hexagonal, coordenadas axiales, misma escala que el mapa de exploración — **7 columnas × 5 filas** (35 hex). Despliegue en bandas de 2 columnas en los lados cortos; frentes a **4 hexágonos** de distancia. Con Movimiento 2 (`../game-design.md` §2.2, sin regla de "Carrera"), el melee contacta en la ronda 2 y un Arco (alcance 4) dispara desde la ronda 1 — la ventana de 5-6 rondas por bando (`../game-design.md` §4b.12) se mantiene sin inventar nada. Cuadrícula descartada: obligaría a un segundo sistema de distancias y a reescribir el alcance en hexágonos de todo el catálogo.

**Adyacencia y rango** *(traslada `../game-design.md` §4b.1, sin cambios de fondo — solo pasa a medirse en este tablero en vez del de exploración)*:
- Dos fichas **nunca comparten hexágono**. Se **actúa sobre un objetivo en un hexágono contiguo** (uno de los 6 vecinos) para melee; nunca sobre el propio hexágono.
- Ataques a distancia y hechizos tienen alcance en hexágonos (definido por el arma/hechizo), no requieren adyacencia.
- **Alcance mínimo "a distancia": 2 hex.** El cuerpo a cuerpo ya cubre el hexágono contiguo (1 hex); ningún arma o hechizo a distancia puede tener alcance 1.
- **A bocajarro:** sí puedes disparar o lanzar un hechizo contra un objetivo adyacente, pero con **Desventaja** ([`../effects.md`](../effects.md)) — te está encima y no tienes espacio para apuntar.

## 3. Despliegue

Tu **distancia en el mapa de exploración** decide tu columna de salida en la batalla: adyacente al hexágono del enemigo (1 hex) → primera línea (columna 1); a 2-3 hex → segunda línea (columna 0). Dentro de su columna, cada jugador elige fila libre en orden de iniciativa. No hace falta una fase de colocación manual.

La banda enemiga se coloca por alcance: melee en la columna exterior, distancia/soporte/invocador en la más lejana, el líder de la composición (si lo hay) en el centro.

## 4. Unidad de combate y composición del bando enemigo

**Unidad = criatura individual, no pila** *(decisión raíz #3)*: cada criatura entra con su bloque de `../characters/enemies.md` §5b tal cual (PV, CA, Vel, Det, ataque, habilidad, Naturaleza) — el bestiario entero funciona sin escribir una regla nueva. Una pila exigiría una segunda matemática de daño en paralelo y rompería *Cazador de manada* del Lobo, los estados (se aplican a un cuerpo) y el crítico (dobla dados, no "mata 2,7 unidades").

**Composición y presupuesto:** ver `../characters/enemies.md` §5b.6 — presupuesto = héroes que entran + 1 (tope 6), coste Normal 1 / Élite 2 / Jefe 3, +1 si hay mercenario invocado. Es la traducción directa del motivo que ya sostenía el antiguo tope fijo de 2 (economía de acción), llevado a un bando de tamaño variable.

**La composición se ve antes de atacar:** dentro de la visión de detalle (`../game-design.md` §2.3), se revela cuántas criaturas y de qué tipo — coherente con que la ficha de Enemigo (a diferencia de Amenaza) ya es "certeza confirmada" (`board-map.md` §4).

## 5. Mercenario en el tablero de batalla

El mercenario es una **ficha propia** con bloque de combate por Rareza — ver [`../cards/mercenaries.md`](../cards/mercenaries.md) §1b para la tabla completa (PV/CA/Mov/Ini/Ataque/Figuras) y sus reglas. Resumen relevante a esta pantalla:
- Se despliega en el tablero de batalla al invocarse, en la columna/fila del jugador que lo invocó.
- Tira iniciativa propia (`1d20 + Nivel de su carta`, ya que no tiene DES propia) y actúa en su propio turno.
- 1 ataque por turno, sin Acción rápida, alcance medido desde su propia ficha.
- Cuenta +1 al presupuesto de composición enemiga (§4).
- Tope: 1 unidad de mercenario por jugador en el campo a la vez.

## 6. Iniciativa, turno y Desengancharse

**Iniciativa:** `1d20 + mod DES` por unidad, **una sola vez** al abrir la batalla; el orden queda fijo toda la pelea (no se retira cada ronda — 10+ tiradas por ronda son injugables en mesa, y la IA determinista está pensada para ser anticipable). Empates → mayor DES bruta, héroe gana. Mercenarios sin DES propia: `1d20 + Nivel de su carta`.

**Turno de una unidad:** idéntico a `../game-design.md` §4b.3 — 2 Movimiento + 1 Acción + 1 Acción rápida + hasta 1 carta modificadora por tirada. Cero reglas nuevas.

**Enemigos:** 1 ataque, sin Acción rápida (`../characters/enemies.md` §5b.5), **también Élite y Jefe** — la presión de más héroes se compensa con el presupuesto de composición (§4), no dándole un segundo golpe al enemigo.

**Desengancharse** *(traslada `../game-design.md` §4b.11, sin cambios de fondo — ahora solo ocurre dentro de esta pantalla, ya que el combate no se resuelve en ningún otro sitio)*: salir de un hexágono adyacente a un enemigo Activo exige una tirada enfrentada `1d20 + mod DES`, el que se va contra el que retiene.
- **Gana el que se va** → se mueve libremente.
- **Gana el que retiene** → el que se va **recibe el daño del ataque básico del rival sin tirada de ataque** (dado de daño + mod, directo, sin comparar con la CA) y **completa el movimiento igualmente**.
- **Máximo 1 vez por enemigo y por turno.** No gasta Acción de nadie: es parte del movimiento.
- **Empate** → gana el que se va.

*Escabullirse* (Pícaro), *Botas de teletransporte* y equivalentes se desenganchan sin tirar (éxito automático).

## 7. Obstáculos y campo de batalla

**4 tipos de obstáculo**, todos traducción directa de mecánicas ya escritas en `board-map.md` §3a:

| Obstáculo | Regla exacta | Terreno del que viene |
|---|---|---|
| **Roca** | Intransitable, bloquea línea de visión | Montaña |
| **Maleza** | Coste de movimiento 2, +1 CA contra ataques a distancia a quien esté dentro | Bosque |
| **Agua/lodo** | Coste 2, al entrar salvación CON CD 12 o Envenenado | Pantano |
| **Barricada** | Intransitable, bloquea visión, +1 CA a los adyacentes contra ataques a distancia | — (nueva, mismo número de cobertura que Bosque) |

**El terreno del mapa genera el campo — 7 plantillas.** El hexágono del mapa donde se abre la batalla decide cantidad y tipo de obstáculos, sembrados con la semilla de la partida:

| Terreno del mapa | Plantilla del campo | Efecto global |
|---|---|---|
| Llanura | 3 Rocas | — (campo abierto) |
| Bosque | 8 Maleza + 2 Rocas | Emboscada posible |
| Pantano | 6 Agua + 2 Maleza | — (ya lo pone el suelo) |
| Montaña | 10 Rocas en dos crestas, 2 pasos de 1 hex | El campo más táctico: los tiradores solo disparan por los pasos |
| Camino | 2 Barricadas + 1 Roca, banda de camino de 3 hex | +1 punto de Movimiento la primera vez que se cruza en el turno |
| Mazmorra | 8 Rocas en pasillos y 2 salas | Sin fuente de luz equipada, alcance máximo a distancia = 2 y los enemigos actúan primero en la ronda 1 (usa por fin la Antorcha) |
| Pueblo | 4 Barricadas | Ni cobertura ni emboscada — en una plaza no hay dónde esconderse |

Invariante al generar: siempre existe ruta transitable entre las dos bandas de despliegue (mismo criterio de "medir e informar, no repintar" que ya usa `board-gen.ts`).

## 8. Retirada

**Retirada es una regla distinta de Desengancharse (§6), a propósito.** Acción propia en tu turno: tirada **enfrentada** `1d20 + mod DES` contra la criatura enemiga adyacente con mejor DES.
- Ganas o empatas → sales del tablero de batalla, reapareces en el hexágono del mapa desde el que entraste.
- Pierdes → **no sales**, recibes el ataque básico del rival sin tirada de ataque, gastaste tu Acción, puedes reintentarlo la ronda siguiente.

> **Por qué no reutiliza Desengancharse.** Desengancharse está decidido con motivo escrito para que **siempre** completes el movimiento aunque pierdas ("fallo = daño pero te mueves, no te quedas clavado"). Si Retirada reutilizara esa tirada, la huida del combate entero nunca fallaría — lo contrario de "el enemigo puede impedirla si saca mejor resultado". Y *Escabullirse* / *Botas de teletransporte*, que dan desenganche automático, saltarían también esta tirada, dejando al Pícaro con huida gratis siempre. Retirada necesita su propio nombre y sus propias excepciones.

Coste: +2 de Nivel de Amenaza (`../game-design.md` §6c.2, "huir de un combate"), sin botín, la ficha del mapa queda Activa y persigue con el leash de 2 turnos de siempre.

## 9. Fin de la batalla

*(traslada y sustituye `../game-design.md` §4b.8, adaptado al co-op)*

| Resultado | Condición | Qué pasa |
|---|---|---|
| Victoria | Todas las criaturas a 0 PV | Ficha retirada del mapa (huella grabada), botín (`../game-design.md` §6b.6), avance de hito si era un jefe |
| Retirada | Ningún héroe queda en el campo | Ficha se queda Activa, persigue; +2 Amenaza; sin botín |
| Derrota | Todos los héroes caídos y ninguno salió | Partida rápida → fin de partida; Campaña → reiniciar capítulo |
| Héroe caído (parcial) | Uno a 0 PV, el bando sigue en pie | Ver §9.1 |

**Reloj:** al cerrar la batalla, forfait **escalado con el presupuesto de la composición enemiga** (`../game-design.md` §6c.2), **no** por ronda: `presupuesto − 1` (solo, presu 2 → **+1**; 2 héroes, presu 3 → **+2**; 3 héroes, presu 4 → **+3**; 4 héroes, presu 5-6 → **+4/+5**). Con 8-10 batallas por partida, un forfait plano se comería él solo 24-30 de los 40 turnos del reloj — de ahí que escale con el tamaño de la pelea en vez de ser una cifra fija.

**Memoria de la ficha** *(corregido también en `../characters/enemies.md` §2, 2026-08-07 — antes decía que el enemigo "recupera sus PV" al desistir)*: las bajas de una composición son **permanentes**; las supervivientes recuperan PV con el tiempo, ligado al mismo +1 que sube el reloj de Amenaza, para que curarse rápido sea contra un enemigo más entero. Con una composición de hasta 6 figuras, recuperar todos los PV de golpe borraría la estrategia de huir/curarse/volver que se busca.

### 9.1 Héroe caído (co-op)

A 0 PV con compañeros presentes: estado **Derribado**, fuera de la iniciativa, no otea, no es objetivo de la IA. Un compañero adyacente gasta su Acción y tira `1d20 + mod SAB` vs CD 12: éxito → se levanta con una fracción de sus PV máx.; fallo → nada (no penaliza). Cualquier curación lo levanta sin tirada. Si el bando pierde (Derrota) o se retira sin rescatarlo, ver la fila correspondiente de §9.

En **solo**, sigue la regla de `../game-design.md` §4b.8 original: 0 PV = caído, sin estado Derribado (no hay quién rescate).

## 10. Cartas en batalla

Campo `Escenario` en cada carta: `Exploración` / `Batalla` / `Ambos` (`../cards/README.md`). **No se parte el Mazo en dos** — un solo Mazo (≤20), un solo "en juego" (tope 5).

**Oteo de transición:** al abrir la batalla, 1 Oteo filtrado a `Batalla`/`Ambos` (gratis). No hay Oteo dentro de la batalla ronda a ronda — es lo que convierte "llenar en juego antes de tocar la ficha" en la decisión real de exploración. Al volver al mapa, lo simétrico con `Exploración`/`Ambos`.

**A vigilar (balance, no bloqueante):** antes una pelea de 5-6 turnos regalaba 5-6 Oteos; con este modelo, una batalla da como mucho 1. Palanca a probar en el prototipo: 0, 1, o 1 cada 2 rondas de batalla.

**Selección de objetivo — regla general (decidido 2026-08-06):** cualquier carta o ataque que necesite objetivo (un enemigo, un aliado, una ficha propia) se resuelve **eligiendo esa ficha entre las válidas visibles en el tablero de batalla** en el momento de jugar la carta — no hay objetivo automático salvo que la propia carta lo fije (ej. Retirada contra "la criatura enemiga adyacente con mejor DES", §8). Aplica igual a un ataque melee (adyacencia a quien actúa) que a un Soporte de mercenario (cualquier aliado del tablero, sin adyacencia, `../cards/mercenaries.md` §1b). El detalle de interacción (seleccionar tu ficha → se ofrecen sus acciones → seleccionar la ficha objetivo) es trabajo de UI para el futuro doc técnico de esta pantalla, no una regla nueva.

## 11. Botín, oro y stock (co-op)

- **Oro al bote común del equipo.** Se suma el de todas las criaturas derrotadas y se reparte o se gasta en grupo.
- **Cartas al héroe que remata** la criatura — es la rivalidad amistosa sin inventar un sistema nuevo.
- **Botín por ficha, no por criatura** (evita que una composición de 5 dispare 5 tiradas de loot): 1 tirada por la criatura de mayor categoría de la composición fija la fila de rareza (`../game-design.md` §6b.6).

Estado del stock de tienda (E3) e independencia por jugador: ver [`../characters/npcs.md`](../characters/npcs.md) §4.

## 12. Pendiente (no cerrado en esta ronda)

- **Tamaño del tablero y alcance de todos los ataques — reabierto para revisar juntos (2026-08-06):** la medida de §2 (7 columnas × 5 filas) y los alcances del catálogo (armas a distancia, hechizos de clase, mercenarios) se fijaron por separado; hasta que no se cierren juntos, ninguno de los dos cuenta como decidido de verdad. Síntoma concreto que lo dispara: en un campo de 7 columnas, la progresión de alcance Arco 4→5→6→7 hex y Ballesta de mano 3→4→5→6 hex (`../cards/weapons.md` §5b) pierde sentido — el escalón Poco común ya cubre el campo entero. Dirección dada pero sin cifras para el eje que sustituiría al alcance en esas familias (daño extra, número de disparos, ignorar cobertura...). No tocar ninguno de los dos números hasta cerrar esto.
- **Invariantes de balance por tamaño de bando** (equivalente a `../game-design.md` §4b.12 para 1-4 héroes + composición de hasta 6 figuras): la tabla actual de §4b.12 solo cubre 1 héroe. Se mide jugando el prototipo, no en papel.
- **Armadura pesada sin coste en E2:** su único coste hoy (desventaja de sigilo) no aplica en batalla. Sin coste nuevo por ahora; se mide jugando.
