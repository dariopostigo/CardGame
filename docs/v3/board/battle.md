# Tablero de batalla — V3

> **Escrito el 24 de agosto de 2026.** El tablero de batalla es uno de los dos tableros del juego *(decidido, [game-design.md](../game-design.md) §2)*; el otro es el [tablero de exploración](board-map.md).

## Qué cubre este documento

La pantalla donde se resuelve el combate: la arena, quién entra, el despliegue, la ronda, el turno de una ficha y el fin de la batalla. **Las reglas de resolución de ataque no viven aquí** sino en [game-design.md](../game-design.md) §4 — este documento es el escenario, no el motor. Lo que decide *si* se abre una batalla es del [tablero de exploración](board-map.md).

## 1. La arena *(decidido)*

**Rejilla hexagonal de 7 columnas × 5 filas** — 35 hexágonos, coordenadas axiales. Se **hereda de [v2](../../v2/board/battle.md) §2 por decisión explícita**, no por inercia: es la geometría sobre la que se calcularon los alcances del §4.3, así que confirmarla es lo que los deja firmes.

```
  col   0  1  2  3  4  5  6
        ░  ░  ·  ·  ·  ▒  ▒
        ░  ░  ·  ·  ·  ▒  ▒
        ░  ░  ·  ·  ·  ▒  ▒
        ░  ░  ·  ·  ·  ▒  ▒
        ░  ░  ·  ·  ·  ▒  ▒

  ░ banda propia (10 hex)   ▒ banda enemiga (10 hex)
  frentes: col 1 ↔ col 5 = 4 hexágonos
```

**Bandas de despliegue de 2 columnas** en los lados cortos, con los frentes a **4 hexágonos**. Diez hexágonos por banda para cinco fichas (§2): cabe una línea de frente completa y aún sobra fondo, que es lo que hace que colocar delante o detrás sea una elección y no un acomodo.

**Cuadrícula descartada**, por el mismo motivo que en v2 y con más peso ahora: los alcances están decididos **en hexágonos** y son fijos por tipo de daño, así que un segundo sistema de distancias obligaría a reescribirlos en las 132 fichas.

### 1.1 Los tres alcances quedan validados

Los alcances 🗡️ 1 · ✨ 2 · 🏹 4 se fijaron el 23 de agosto *sobre esta geometría* y quedaban **provisionales a la espera de este documento**. Con la rejilla confirmada **dejan de ser provisionales**, y el ritmo que [game-design.md §4.3](../game-design.md) daba por hecho se cumple:

| Tipo | Alcance | Qué hace en la ronda 1 |
|---|---|---|
| 🏹 **A distancia** | 4 | Dispara sin moverse: el frente está justo a tiro |
| ✨ **Mágico** | 2 | Tiene que avanzar; tira en la ronda 2 |
| 🗡️ **Cuerpo a cuerpo** | 1 | Avanza; contacta y golpea en la ronda 2 |

## 2. El bando: héroe + 4 unidades *(decidido)*

Un jugador pone **cinco fichas** en el tablero: **su héroe y cuatro unidades**.

**Las ocho unidades de la raza son la reserva, no el ejército.** La progresión de ocho de [razas.md](../razas.md) es de dónde eliges, y elegir cuatro antes de la batalla **es una decisión de juego** — ¿el tier alto que pega, o dos baratas que hacen pantalla? Sin ese corte, la progresión de ocho se despliega sola y no se decide nada.

Cuatro es el **tope, no un requisito**: si solo has reclutado dos, entras con dos. Si se pueden llevar dos copias de la misma unidad es cosa del reclutamiento ([cards/units.md](../cards/units.md)) y no del tablero; el tablero solo dice cuatro.

**Una carta de unidad pone una ficha, una criatura** *(decidido)*. No hay pilas de figuras. Es lo que ya asumen los números cerrados: ❤️ Vida de 2–3 cifras es un cuerpo, el crítico **dobla el daño** (no "mata 2,7 unidades") y los 9 estados de [effects.md](../effects.md) se aplican a un cuerpo. Una pila exigiría una segunda matemática de daño en paralelo al §4.2 — un motor entero encima del que ya está escrito.

**El bando enemigo tiene dos formas, según el encuentro** *(decidido)*:

| Encuentro | Composición | Cómo se gana |
|---|---|---|
| **De facción** | Héroe enemigo + hasta 4 unidades de su raza | Cae su héroe |
| **De fauna u horda** | Hasta 5 criaturas, sin héroe | Caen las cinco |

El de facción no hay que inventarlo: las **44 cartas de clase** de las once razas ya existen, y las unidades tienen su cara hostil por diseño ([characters/enemies.md](../characters/enemies.md)). El precio de tener dos formas es que **son dos condiciones de victoria**, y el jugador tiene que saber cuál está jugando **antes de desplegar** —porque cambia a qué apuntas y por tanto dónde te colocas—: eso es un requisito de pantalla, no una regla.

## 3. Despliegue *(decidido)*

**Colocación libre dentro de tu banda**, antes de la ronda 1: eliges el hexágono de cada una de tus cinco fichas entre los diez de tus dos columnas. Cero reglas nuevas, y es la decisión táctica más barata que existe.

No se hereda el despliegue de v2 (§3), donde **la distancia en el mapa de exploración decidía tu columna de salida**: dependía de una fase de aproximación que V3 no tiene escrita, y elegir tú es mejor decisión que heredarla de cómo caminaste.

## 4. La ronda: una sola lista de Iniciativa *(decidido)*

**Las diez fichas de los dos bandos van en una única lista ordenada por ⚡ Iniciativa**, de mayor a menor; el turno salta de bando según toque. Es la fórmula de [game-design.md §4.6](../game-design.md) aplicada tal cual —empate → 🍀 Suerte → azar—, y es lo que hace que ⚡ Iniciativa valga: con fases de bando solo te ordena contra tus propios aliados.

```
Ronda 1
  ⚡ 14  🏹 Arquero      (tú)
  ⚡ 12  🐺 Lobo         (enemigo)
  ⚡ 11  🔮 Mago         (tú)
  ⚡ 11  💀 Ghoul        (enemigo)   ← desempata 🍀 Suerte
  ⚡  8  ⚔️ Miliciano    (tú)
  …
```

**El orden se fija al abrir la batalla y no se recalcula** *(decidido)*. ⚡ Iniciativa es propiedad fija de la ficha y **ningún estado la altera** (§4.6), así que recalcular daría exactamente el mismo orden: sería cálculo y relectura por nada. Queda una puerta con su condición escrita: **si algún día una carta toca ⚡ Iniciativa, el orden se rehace desde la ronda siguiente**, no en el acto.

**Las fases de bando de v2 quedan descartadas** (v2 §6: fase de Aliados entera y luego fase de Enemigos). Se leían más fácil, pero permitían concentrar los cinco golpes seguidos antes de que el rival moviera — que es exactamente donde nacen las combinaciones que matan sin respuesta, y con la derrota por caída del héroe (§6) matarían la partida entera.

## 5. El turno de una ficha *(decidido)*

**Mueve hasta 👢 Movimiento hexágonos y hace su ataque, en cualquier orden.** No es "mover o atacar": si mover consumiera el turno, las **70 fichas 🗡️** del catálogo —más de la mitad de las 132— pasarían dos rondas sin hacer nada mientras las 🏹 disparan gratis. Y es lo que el §4.3 ya daba por hecho: *"el 🗡️ contacta en la ronda 2"* solo sale si en esa ronda mueve **y** golpea.

**Si además puede jugar una carta en su turno, cuántas y a qué coste, es de [game-design.md](../game-design.md) §6** (Turno y economía de cartas), que no está escrito. Este documento no lo decide de refilón.

**No se atraviesa a ninguna ficha, ni aliada ni enemiga**, y dos fichas nunca comparten hexágono *(decidido)*. Es lo que convierte una línea de unidades en una **pantalla**, y la pantalla es lo que le da trabajo a las cuatro unidades cuando la derrota depende del héroe (§6). El precio se acepta: en una rejilla de 5 filas de alto, tu propia línea de frente puede encerrar detrás a tu 🗡️ — es un atasco real, y es tuyo por haber desplegado así.

Encaja con lo que ya decía el catálogo: 🦅 **Volador** *"ignora obstáculos del mapa durante el movimiento, pero no puede atravesar enemigos"* ([razas.md](../razas.md)). Volar salta terreno, no cuerpos.

## 6. Fin de la batalla *(decidido)*

| Resultado | Condición |
|---|---|
| **Victoria** | Cae el héroe enemigo, o caen las cinco criaturas si el encuentro no lleva héroe (§2) |
| **Derrota** | **Cae tu héroe**, aunque queden unidades en pie |

**El héroe a 0 ❤️ Vida es derrota inmediata.** Es lo que le da trabajo a las cuatro unidades —son pantalla, no relleno— y lo que convierte tu 🔮 Mago en algo que hay que esconder y el del rival en algo que hay que alcanzar. En un tablero de 35 hexágonos, ahí nace la táctica.

**No se hereda el estado *Derribado* de v2** (§9.1: héroe rescatable por un compañero adyacente). Era una regla de co-op con varios héroes en el campo, y aquí metería un estado nuevo fuera del catálogo de [effects.md](../effects.md) y una acción de tablero nueva para salvar a la única ficha que no puede caer.

## 7. Terreno y obstáculos *(la fuente decidida, el catálogo pendiente)*

**De dónde saldrán está decidido: del terreno del mapa.** El hexágono del [tablero de exploración](board-map.md) donde se abre la batalla decidirá la plantilla de obstáculos del campo —bosque → maleza, montaña → crestas de roca, pantano → agua—, como hacía v2 (§7). Da variedad sin diseñar escenarios a mano, y sobre todo **le da fuente a cuatro Características que hoy no la tienen**: 🦅 Volador, 🐾 Ágil, 🌊 Anfibio y 🌲 Explorador.

**Pero el primer prototipo se juega a campo abierto** *(decidido el 24 de agosto de 2026)*: rejilla desnuda, sin ningún obstáculo. Primero se mide si la pelea de 5 contra 5 funciona sobre 35 hexágonos; el terreno entra después, encima de algo que ya se sostenga.

> **Lo que eso cuesta, y hay que tenerlo delante:** la resta de **cobertura** del [§4.1](../game-design.md) —`acierto = 🎯 Precisión − 💨 Evasivo − cobertura ± cartas`— **se queda sin fuente**. En el prototipo vale **0**. No se retira de la fórmula: es una **ranura reservada**, y el día que el campo tenga maleza es donde entra sin tocar el motor.
>
> Las cuatro Características de terreno no se quedan huérfanas, porque su texto habla del **mapa** (*"obstáculos del mapa"*, *"determinados terrenos"*): son rasgos de exploración hasta que el tablero de batalla tenga terreno. Pero conviene decirlo en voz alta — **en el prototipo de batalla no hacen nada**.

Pendiente, por tanto: el **catálogo de obstáculos** (cuáles, con qué regla exacta), las **plantillas por terreno**, y si un obstáculo **bloquea la línea de visión** o solo resta acierto. Esa última no es un detalle: bloquear exige un segundo sistema —línea limpia sí/no, además de la resta— y abre la pregunta de qué es cobertura parcial.

## 8. Lo que sigue por definir

- **Retirada**: si se puede abandonar una batalla. No se decide aquí a propósito — lo que hace falta saber primero es **qué cuesta huir**, y eso es del [tablero de exploración](board-map.md) y de la economía ([game-design.md](../game-design.md) §7), que no están escritos. En v2 costaba +2 de Nivel de Amenaza, un reloj que V3 no tiene.
- **El catálogo de obstáculos y la línea de visión** (§7).
- **Cómo llegas a la batalla**: qué dispara la transición desde el mapa, y si hay algo equivalente a la emboscada de v2 (que dependía de sigilo y detección, mecánicas retiradas).
- **Qué pasa con una unidad que muere**: si la carta se pierde o vuelve a la reserva. Es economía, no tablero, pero se decide antes de poder jugar dos batallas seguidas.
- **Presentación de la ronda**: cómo se enseña en pantalla la lista de Iniciativa, y cómo se distingue de un vistazo un encuentro con héroe de uno sin héroe (§2).

## 9. Relación con v2

De [v2/board/battle.md](../../v2/board/battle.md) se **hereda una sola cosa, y por decisión explícita**: la geometría de 7×5 con bandas de 2 columnas y frentes a 4 (§1). Todo lo demás se descarta o no se recupera:

| De v2 | Por qué no |
|---|---|
| Fases de bando | Sustituidas por la lista única de Iniciativa (§4) |
| Despliegue por distancia en el mapa | Necesita la fase de aproximación, que V3 no tiene (§3) |
| Estado *Derribado* y rescate | Regla de co-op con varios héroes (§6) |
| **Desengancharse** y **Retirada** | Eran tiradas enfrentadas `1d20 + mod DES`: no hay d20 ni DES |
| Penalización a bocajarro | Era "Desventaja", mecanismo retirado; ya decidido que no penaliza (§4.3) |
| Presupuesto de composición enemiga | Estaba en héroes-que-entran + 1, para un co-op de 1-4 héroes |
| Mercenarios en el tablero | El tipo de carta desaparece; lo sustituye la Unidad |
| Cobertura como "+1 CA" | No hay CA: la cobertura resta acierto (§7) |
| Oteo de transición, botín al bote común | Son de exploración y economía, no de esta pantalla |

Su §12 dejaba **reabierto el par tamaño-de-tablero / alcances**, con el síntoma de que en 7 columnas la progresión de alcance del arco (4→5→6→7) cubría el campo entero. En V3 ese síntoma no existe: **el alcance no progresa** —es fijo por tipo de daño— así que el par se cierra confirmando los dos a la vez (§1.1).

## 10. Qué hay que vigilar en el primer balance

- **El 🏹 es la pieza anti-héroe, y a campo abierto no hay nada que lo pare.** Con frentes a 4 y alcance 4, un arquero avanza un hexágono y **ya amenaza al héroe enemigo en la ronda 1**, atravesando la línea de unidades como si no estuviera — la pantalla del §5 solo frena al 🗡️. Es coherente (el alcance es lo que le queda al arquero para existir, §4.3) pero es el primer sitio donde mirar si el juego se decide en la ronda 1.
- **🗣️ Provocación gana un trabajo de verdad.** *"Puede obligar a determinados enemigos a atacarlo"* era un rasgo sin escenario; con la derrota por caída del héroe, es **la única respuesta escrita que existe** contra el arquero anti-héroe. Merece mirarse al asignar Características.
- **Diez fichas por ronda con ⚡ Iniciativa entera pequeña**: los empates son el caso normal, no el raro. El desempate por 🍀 Suerte (§4.6) está escrito para eso, pero es el cuarto trabajo de Suerte y su tope de 25 se fijó cuando hacía dos.
- **Cinco fichas en diez hexágonos de banda** dan poco margen para rodear: la maniobra se decide casi entera en el despliegue. Si la pelea resulta ser siempre el mismo choque frontal, el dial es el **ancho** del tablero (7×7 mantiene los alcances intactos porque no cambia la distancia entre frentes), no el alcance.
