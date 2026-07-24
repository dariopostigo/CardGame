# CardGame — Cartas: Mazo de encuentro

Mazo **gestionado por el sistema** (no por el jugador) con cartas cortas que se roban en momentos de tensión de la exploración. Definido en [`../board-map.md`](../board/board-map.md) §5 y usado en combate en [`../game-design.md`](../game-design.md) §4b.6 y al acampar en §4c.2. Índice de cartas en [`README.md`](README.md). Valores = **primer pase sin balancear**.

## 1. Cuándo se roba

| Situación | Qué se roba |
|---|---|
| **Iniciar un combate** (ficha de Enemigo, o Amenaza revelada como enemigo) | 1 **carta de Combate** (§3) |
| **Activar una ficha ambigua** (Amenaza, Exploración) | 1 **carta de Suceso** (§4) — puede acabar en combate, trampa, hallazgo o nada |
| **Acampar en terreno inseguro** (`../game-design.md` §4c.2) | 1 **carta de Suceso** (§4) |

## 2. Dos tipos de carta

- **Combate:** modifican una pelea que ya va a ocurrir (le dan un giro). Se revela 1 al empezar el combate; enemigos élite/jefes pueden hacer robar más de una.
- **Suceso:** resuelven una ficha ambigua o un descanso arriesgado. Su resultado es variable (puede *desencadenar* un combate, y entonces se roba además una carta de Combate).

El terreno del hexágono aplica **además** su propio efecto (`../board-map.md` §3a): p. ej. atacar desde Bosque ya da emboscada por terreno, se sume a lo que diga la carta.

## 3. Cartas de Combate (boceto, ~10)

| Carta | Efecto |
|---|---|
| Emboscada enemiga | Si el héroe iba expuesto (Llanura/Camino, no Oculto), el enemigo actúa primero e ignora la iniciativa el primer turno |
| Golpe de las sombras | Si el héroe estaba **Oculto** o en **Bosque** ([`../effects.md`](../effects.md), `../board-map.md` §3a), abre con un ataque gratis con ventaja |
| Refuerzos | Al final del turno 2 aparece 1 enemigo Normal adicional (`../enemies.md` §5b) |
| Terreno favorable | El héroe gana **+1 CA** durante todo el combate (cobertura natural) |
| Terreno traicionero | Un hexágono de la zona es peligroso: entrar en él inflige 1d4 o causa **Ralentizado** |
| El enemigo flaquea | Al bajar del 50 % de PV, el enemigo intenta **huir** usando su movimiento; si escapa, sueltas menos loot |
| Frenesí | El enemigo ataca con **+1 al daño** pero **−2 CA** (todo o nada) |
| Veterano solitario | Solo hay 1 enemigo, pero con **+25 % PV** y su habilidad reforzada |
| Niebla | Los ataques a distancia sufren **Desventaja** este combate |
| Botín inesperado | Al ganar, **oro extra** o una carta de Tesoro adicional (`../game-design.md` §6b.1) |

## 4. Cartas de Suceso (boceto, ~10)

| Carta | Efecto |
|---|---|
| ¡Emboscada! | Se convierte en **combate**: roba también 1 carta de Combate (así una Amenaza se resuelve como enemigo) |
| Trampa | Salvación DES CD 12 o 1d6 de daño / un estado negativo ([`../effects.md`](../effects.md)) |
| Sendero oculto | +2 de movimiento este turno, o revela (**Detectado**) un grupo vecino (`../board-map.md` §4) |
| Hallazgo | Una carta de Tesoro menor o algo de oro |
| Viajero | Aparece un NPC amistoso (`../npcs.md`) — pequeño encuentro de calma |
| Falsa alarma | Nada: el hexágono queda vacío (el resultado "vacío" de `../board-map.md` §4) |
| Mal presagio | Ganas una **Maldición** leve ([`curses.md`](curses.md)) — el riesgo real de husmear donde no debes |
| Descanso interrumpido | *(solo al acampar)* La acampada falla: no recuperas y salta un combate (roba 1 carta de Combate) |
| Clima adverso | **Ralentizado** o riesgo de estado hasta salir de la zona |
| Provisiones | Recuperas algo de PV o ganas una Poción ([`items.md`](items.md)) |
| Mercenarios | La ficha resulta ser una compañía a sueldo: prueba de **Carisma CD 12** — éxito = ganas una carta de Mercenario ([`mercenaries.md`](mercenaries.md)); fallo = **combate** (roba también 1 carta de Combate) |

## 5. Qué ficha del tablero usa el mazo

Cruce con las 6 fichas de [`../board-map.md`](../board/board-map.md) §4:

| Ficha | Usa el mazo |
|---|---|
| Enemigo | Sí — 1 carta de **Combate** al iniciar la pelea |
| Amenaza | Sí — 1 carta de **Suceso** (puede salir ¡Emboscada!, Trampa, o nada) |
| Exploración (comodín) | Sí — 1 carta de **Suceso** (rango completo: hallazgo, NPC, mercenarios, trampa, vacío…) |
| Terreno | A veces — puede robar un Suceso de tipo Trampa/Hallazgo tras la prueba de terreno |
| Tesoro | **No** — da loot directo (`../board-map.md` §4) |
| Personaje (NPC) | **No** — interacción de calma, sin mazo (`../npcs.md` §3) |

## 6. ¿Un mazo o varios? *(decidido)*

- **Prototipo / Modo Prueba:** un **único mazo base** (las cartas de arriba). Simple y suficiente. La variedad ya la aporta la **distribución de fichas por terreno** (`../board-map.md` §4).
- **Modo Campaña:** se puede **sesgar o añadir** cartas temáticas por capítulo (ej. un capítulo de no-muertos añade cartas de "más esqueletos"/"terreno maldito"). No se implementa hasta la Campaña.

## 7. Próximos pasos

- [ ] Balancear frecuencias (cuántas de cada tipo, probabilidad de ¡Emboscada! vs. Hallazgo) al testear.
- [ ] Decidir el reparto exacto Combate/Suceso del mazo base y si se barajan juntas o en dos pilas.
- [ ] Afinar valores de daño/CD de las cartas de Suceso.
- [ ] Cuando llegue la Campaña, diseñar los sesgos temáticos por capítulo (§6).
