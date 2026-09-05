<!-- estado: escrito -->

# Tablero de batalla — V3

> **Escrito el 24 de agosto de 2026**, **reabierto y cerrado el 27 de agosto de 2026** —cuando el bando dejó de ser cinco fichas y pasó a ser de uno a tres jugadores con sus héroes (§2)— y **corregido con lo que midió el laboratorio** ([/dev/tablero](/dev/tablero)): el **28 de agosto de 2026** el presupuesto del bando enemigo se cerró en espejo (§2), la victoria pasó a plural (§6) y desplegar apretado resultó encerrar a las tuyas (§3); el **31 de agosto de 2026** el duelo del arquero se jugó en 2D y **la banda de 👢 Movimiento quedó decidida en 3 · 2 · 1** (§1.1 y §1.2), que es la primera cifra escrita de las 8 Habilidades. El tablero de batalla es uno de los dos tableros del juego *(decidido, [game-design.md](../game-design.md) §2)*; el otro es el [tablero de exploración](board-map.md).

## Qué cubre este documento

La pantalla donde se resuelve el combate: la arena, quién entra, el despliegue, la ronda, el turno de una ficha y el fin de la batalla. **Las reglas de resolución de ataque no viven aquí** sino en [game-design.md](../game-design.md) §4 — este documento es el escenario, no el motor. Lo que decide *si* se abre una batalla es del [tablero de exploración](board-map.md).

## 1. La arena *(decidido el 27 de agosto de 2026)*

**El tablero es grande, y no se ata al formato.** El mínimo es **14 columnas × 12 filas** —168 hexágonos, coordenadas axiales— y crece en cuatro tamaños hasta 20×15. Se juega igual de grande con un jugador que con tres *(decidido)*: un 1 contra 1 en 168 hexágonos es una partida de aproximación y maniobra, y eso es lo que se busca (§1.1).

```
  col   0  1  2  3  4  5  6  7  8  9 10 11 12 13
        ░  ░  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ▒  ▒
        ░  ░  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ▒  ▒
        ░  ░  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ▒  ▒   × 12 filas
        ░  ░  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ▒  ▒
        ⋮                                      ⋮

  ░ banda propia (24 hex)   ▒ banda enemiga (24 hex)
  frentes: col 1 ↔ col 12 = 11 hexágonos
  168 hexágonos · hasta 15 fichas por bando (§2)
```

**Sustituye a la 7×5** que este documento heredaba de [v2 §2](../../v2/board/battle.md), y por dos motivos que se suman:

1. **El bando ya no son cinco fichas.** Con tres jugadores hay **hasta 30 fichas en el campo** (§2), y en 35 hexágonos no caben ni desplegadas. El mínimo de 14×12 es lo que hace que quepan: 24 hexágonos por banda para 15 fichas.
2. **La 7×5 nunca se jugó.** Se heredaba de v2 por decisión explícita, pero el código de v2 que de verdad corrió partidas usaba **14×12** (`BATTLEFIELD_COLS/ROWS` en `lib/v2/rules/combat.ts`). Lo que se hereda ahora es la medida que tiene partidas detrás, no la que estaba escrita.

**Bandas de despliegue de 2 columnas en los lados cortos, pegadas al borde** *(decidido)*. Pegadas y no despegadas hacia el centro, porque **es lo único que garantiza la distancia inicial**: con despliegue en media cancha, cualquiera de los dos bandos puede renunciar a la aproximación saliendo a la línea de en medio, y la aproximación es el juego (§1.1).

**Cuadrícula descartada**, por el mismo motivo que en v2 y con más peso ahora: los alcances están decididos **en hexágonos** y son fijos por tipo de daño, así que un segundo sistema de distancias obligaría a reescribirlos en las 132 fichas.

### 1.1 El acercamiento es parte del juego *(decidido el 27 de agosto de 2026)*

La versión anterior de este apartado se llamaba *"los tres alcances quedan validados"* y decía que sobre 7×5 el 🏹 abría fuego en la ronda 1 y los otros dos entraban en la 2. Con frentes a **11** hexágonos eso ya no pasa: **hacen falta varias rondas de maniobra antes del primer golpe**.

**Eso no es un fallo, es la intención** *(decisión de Dario)*. Tres, cuatro o cinco rondas de aproximación es donde vive la estrategia de esta pelea: quién cruza, por dónde, quién espera, y a qué distancia se acepta el choque. El documento se corrige a favor del tablero grande, no al contrario.

**Los tres alcances no se tocan**: 🗡️ 1 · ✨ 2 · 🏹 4, como los fijó [game-design.md §4.3](../game-design.md). Y conviene decir por qué subirlos no era una salida: **🗡️ es 1 por definición** —el hexágono contiguo— y las fichas 🗡️ son **70 de las 132**, más de la mitad del catálogo. Escalar el alcance con el tablero solo escala a quien ya llegaba y deja a la mayoría del catálogo exactamente igual de lejos.

Lo que sí cambia es el otro lado de la ecuación: **👢 Movimiento pasa a depender del tipo de daño** (§1.2).

| Tipo | Alcance | 👢 Movimiento | Su trabajo en la aproximación |
|---|---|---|---|
| 🗡️ **Cuerpo a cuerpo** | 1 | **3** | Cruza el campo entero. Es el que paga la aproximación, y por eso es el que corre |
| ✨ **Mágico** | 2 | **2** | Avanza a media rienda y entra detrás del 🗡️ |
| 🏹 **A distancia** | 4 | **1** | **No avanza: espera.** Su trabajo es castigar a quien cruce |

Los tres valores de 👢 se decidieron el **31 de agosto de 2026** midiendo el duelo del §1.2, y son la primera cifra escrita de las 8 Habilidades.

**El 🏹 deja de abrir la batalla y pasa a esperarla**, y es el cambio de carácter más grande que trae el tablero grande. En 7×5 el frente enemigo estaba a tiro desde la casilla de salida; a 11 hexágonos, el arquero que avanza para disparar es el arquero que se pone a tiro del que corre. Su sitio es quieto.

### 1.2 El arquero que retrocede *(decidido el 27 y corregido el 28 de agosto de 2026)*

En un tablero grande y con pocas fichas aparece un bucle que en 7×5 no existía:

```
🗡️ alcance 1, 👢 2      contra      🏹 alcance 4, 👢 2

  d=4   el 🏹 dispara y retrocede 2   →  d=6
  d=6   el 🗡️ avanza 2                →  d=4
  d=4   el 🏹 dispara y retrocede 2   →  d=6
  …
```

**En el papel el bucle es estable: el 🗡️ nunca llega a d=1.** Con 👢 Movimiento igual para los dos y el ataque en cualquier orden dentro del turno (§5), el tirador conserva la distancia para siempre. En 7×5 lo paraba el borde del tablero —dos turnos de retroceso y estaba acorralado—, y de ahí salía la conclusión que este apartado escribió: que en 14×12 o más **no hay borde al que llegar**, y que un 1 contra 1 de 🗡️ contra 🏹 no es un desequilibrio sino una partida que no se puede ganar.

**Medida sobre la arena, esa conclusión era falsa** *(28 de agosto de 2026, [/dev/tablero](/dev/tablero))*. Las bandas van **pegadas al borde** (§1), así que el que espera tiene el borde a la espalda **desde la ronda 1**: lo que le queda para retroceder es la profundidad de su banda menos uno —**un hexágono**— y eso **no cambia con el tamaño del tablero**, porque la banda son dos columnas siempre. Con los dos 👢 a 2 sobre 14×12, el 🗡️ **contacta en la ronda 6 comiendo 2 disparos**, donde el modelo sin borde decía *jamás*.

**Y esa medida era optimista** *(31 de agosto de 2026, el mismo duelo jugado en 2D)*. En línea recta huir es retroceder, y por eso el borde caza; sobre el tablero el que huye tiene **las doce filas para correr de lado**, y correr en paralelo al borde conserva la distancia sin gastar sitio a la espalda. Medido así, con los dos 👢 a 2, **el 🗡️ tarda 16 rondas y come 11 disparos** en el tablero mínimo — y **22 rondas y 14 disparos** en el de 20×16, porque cuanto más grande es el campo, más sitio hay para dar la vuelta. **El borde caza al arquero tonto, no al arquero.**

**Así que el bucle es real y el reparto de 👢 Movimiento es necesidad, no carácter.** Es la conclusión que dos medidas seguidas han tenido que corregir, y por eso queda escrita con sus números:

| 👢 🗡️ contra 👢 🏹 | 14×12 | 20×16 |
|---|---|---|
| **2 contra 2** | contacto en la ronda 16, **11 disparos** | ronda 22, **14 disparos** |
| **3 contra 1** | ronda 4, 1 disparo | ronda 6, 1 disparo |
| **4 contra 1** | ronda 3, 1 disparo | ronda 4, 0 disparos |
| **4 contra 4** | ronda 4, 0 disparos | ronda 4, 0 disparos |

Lo que manda no es solo la diferencia: es que **el 👢 del que cruza se acerque al alcance 4 del arquero**. Igualados a 4 no pasa nada —quien cierra la distancia en un turno no da tiempo a retroceder— e igualados a 2 el juego se rompe. El peligro no es la igualdad, es la **igualdad baja**.

**La banda queda decidida: 🗡️ 3 · ✨ 2 · 🏹 1** *(Dario, 31 de agosto de 2026)*. Es el reparto **más lento que sigue siendo seguro**: la aproximación dura **cuatro rondas en el tablero mínimo y seis en el de 20×16** —dentro de las tres a cinco que pide el §1.1, y una por encima en el campo más grande— y deja al 🏹 cobrar **un disparo** mientras el 🗡️ cruza, que es exactamente su trabajo. Subir a 4 · 3 · 1 le quitaba ese disparo y bajaba la aproximación a tres rondas.

No toca el motor y no toca el §5: **son valores de ficha**, así que esto entra en la escala de [razas.md](../razas.md) en vez de ser un parche del tablero. Se descartó la otra salida —que disparar cueste el movimiento, o mover o disparar— porque rompe el §5 para un tipo de daño y el §5 argumenta justo lo contrario para las 70 fichas 🗡️.

> **Lo que arrastra, y ya no es solo trabajo:** la escala de 👢 Movimiento deja de ser "entero pequeño" a repartir libremente y pasa a tener **una banda por tipo de daño con valores escritos**. Es el **primer número de las 8 Habilidades** que entra en la escala. Si algún día una ficha quiere salirse de su banda, lo medido dice hasta dónde: **ninguna 🏹 por encima de 2, ninguna 🗡️ por debajo de 3**.

## 2. El bando: de uno a tres jugadores, cada uno con su héroe *(decidido el 27 de agosto de 2026)*

**El juego es co-op.** De uno a tres jugadores forman **un** bando, cada uno con **su héroe y hasta 4 unidades**, y enfrente está la máquina. Jugar en solitario es el mismo juego con un jugador: no hay dos modos, hay un número.

| Jugadores | Fichas por bando | En el campo |
|---|---|---|
| 1 | 5 | 10 |
| 2 | 10 | 20 |
| 3 | 15 | 30 |

Sustituye al "héroe + 4 unidades, cinco fichas" que este documento fijó el 24 de agosto: **la regla por jugador no cambia, se multiplica.** El tope de 4 unidades sigue siendo tope y no requisito —si solo has reclutado dos, entras con dos— y sigue siendo por jugador.

**PvP no se descarta, y queda como puerta con su condición escrita** *(27-ago-2026)*: el tablero ya serviría tal cual —dos bandas iguales, la misma lista de Iniciativa— así que lo que falta no es tablero. Falta **un segundo balance** (la máquina no juega como una persona) y sus propias reglas de victoria y recompensa. El día que se abra, se abre por ahí.

**Las ocho unidades de la raza son la reserva, no el ejército.** La progresión de ocho de [razas.md](../razas.md) es de dónde eliges, y elegir cuatro antes de la batalla **es una decisión de juego** — ¿el tier alto que pega, o dos baratas que hacen pantalla? Sin ese corte, la progresión de ocho se despliega sola y no se decide nada. Con tres jugadores la decisión crece: son tres reservas de ocho para doce ranuras de unidad, y lo que traiga cada uno es una conversación entre aliados.

**Una carta de unidad pone una ficha, una criatura** *(decidido)*. No hay pilas de figuras. Es lo que ya asumen los números cerrados: ❤️ Vida de 2–3 cifras es un cuerpo, el crítico **dobla el daño** (no "mata 2,7 unidades") y los 9 estados de [effects.md](../effects.md) se aplican a un cuerpo. Una pila exigiría una segunda matemática de daño en paralelo al §4.2 — un motor entero encima del que ya está escrito.

**El bando enemigo tiene dos formas, según el encuentro** *(decidido)*:

| Encuentro | Composición | Cómo se gana |
|---|---|---|
| **De facción** | **Un héroe enemigo por jugador**, cada uno con hasta 4 unidades de su raza | Caen **todos** sus héroes |
| **De fauna u horda** | Criaturas, sin héroe | Caen todas |

El de facción no hay que inventarlo: las **44 cartas de clase** de las once razas ya existen, y las unidades tienen su cara hostil por diseño ([characters/enemies.md](../characters/enemies.md)). El precio de tener dos formas es que **son dos condiciones de victoria**, y el jugador tiene que saber cuál está jugando **antes de desplegar** —porque cambia a qué apuntas y por tanto dónde te colocas—: eso es un requisito de pantalla, no una regla.

**El presupuesto de la máquina es el espejo: trae lo mismo que la mesa** *(decidido el 28 de agosto de 2026)*. Un héroe enemigo y hasta 4 unidades **por jugador**, así que la tabla de arriba vale igual para los dos lados: 5 fichas contra 5, 15 contra 15. Era lo único que bloqueaba poner un bando enemigo de verdad en el tablero, y ya no bloquea.

Se eligió entre tres candidatos **por lo que resuelve**: es la única forma en la que **la victoria se lee igual por los dos lados** —caen todos sus héroes ↔ caen todos los tuyos (§6)—, y con eso muere la asimetría que este apartado señalaba, la de ganar tumbando un héroe mientras la máquina tiene que tumbar tres. No se hereda la fórmula de v2 (*héroes-que-entran + 1*): era de un juego con otras cuentas, y el espejo dice lo mismo sin sumar nada.

> **Lo que sigue abierto no es el presupuesto, es la dificultad.** El espejo es el punto de partida, no una promesa de que la pelea esté igualada: la máquina no juega como una persona (§10), y si resulta fácil o imposible el dial es **su composición** —qué tiers trae, con qué Características— y no el número de fichas. Eso se mira con valores en la mano, no antes.

## 3. Despliegue *(decidido)*

**Colocación libre dentro de tu banda**, antes de la ronda 1: eliges el hexágono de cada una de tus fichas entre los de las dos columnas. Cero reglas nuevas, y es la decisión táctica más barata que existe.

**La banda es del bando, no del jugador** *(27-ago-2026)*. Los jugadores comparten las dos columnas: con tres son **15 fichas en 24 hexágonos**, así que la banda se llena y quién se pone delante deja de ser cosa de cada uno. Es la primera decisión conjunta de la partida y sale gratis — no hace falta ninguna regla para que exista.

**Y hay que desplegar dejando huecos** *(medido el 28 de agosto de 2026, [/dev/tablero](/dev/tablero))*. Como no se atraviesa a nadie (§5) y la banda tiene el borde detrás, un despliegue apretado **se encierra a sí mismo**: con la colocación natural —pantalla delante, héroes detrás— hay fichas a las que la ronda 1 les llega **sin salida, cero hexágonos**, tapadas por las suyas y con el borde a la espalda. Una con un jugador, tres con dos, **cinco con tres**, y no mejora agrandando el tablero: la banda son dos columnas siempre.

No es un fallo que haya que arreglar con una regla: es **la primera decisión táctica de la partida**, y el documento tiene que decirla en voz alta porque hasta ahora no la decía. Quién se queda sin turno depende además del **orden** de la lista de Iniciativa (§4) — la ficha tapada que mueve antes que su tapón sale, la que mueve después se queda. Queda una puerta con su condición escrita: **si al jugar resulta que apretar la banda castiga más de lo que enseña**, la respuesta barata es dejar que dos fichas aliadas **intercambien el sitio**, y no hace falta nada más.

Queda un detalle pendiente y es de mesa, no de reglas: **en qué orden colocan los jugadores** (§8). Colocar a la vez, por turnos o por Iniciativa cambia quién ve el despliegue de quién.

No se hereda el despliegue de v2 (§3), donde **la distancia en el mapa de exploración decidía tu columna de salida**: dependía de una fase de aproximación que V3 no tiene escrita, y elegir tú es mejor decisión que heredarla de cómo caminaste.

## 4. La ronda: una sola lista de Iniciativa *(decidido)*

**Todas las fichas de los dos bandos van en una única lista ordenada por ⚡ Iniciativa**, de mayor a menor; el turno salta de bando y de jugador según toque. Es la fórmula de [game-design.md §4.6](../game-design.md) aplicada tal cual —empate → 🍀 Suerte → azar—, y es lo que hace que ⚡ Iniciativa valga: con fases de bando solo te ordena contra tus propios aliados.

```
Ronda 1
  ⚡ 14  🏹 Arquero      (jugador A)
  ⚡ 12  🐺 Lobo         (enemigo)
  ⚡ 11  🔮 Mago         (jugador B)
  ⚡ 11  💀 Ghoul        (enemigo)   ← desempata 🍀 Suerte
  ⚡  8  ⚔️ Miliciano    (jugador A)
  ⚡  8  🛡️ Guardia      (jugador C)
  …
```

**El orden se fija al abrir la batalla y no se recalcula** *(decidido)*. ⚡ Iniciativa es propiedad fija de la ficha y **ningún estado la altera** (§4.6), así que recalcular daría exactamente el mismo orden: sería cálculo y relectura por nada. Queda una puerta con su condición escrita: **si algún día una carta toca ⚡ Iniciativa, el orden se rehace desde la ronda siguiente**, no en el acto.

**Con tres jugadores la lista tiene hasta 30 entradas**, y entre dos turnos tuyos pueden pasar nueve fichas. Eso es exactamente lo que compra el entrelazado —nadie encadena la ronda entera antes de que el rival mueva— y es también lo que hay que vigilar: la ronda se hace larga de jugar, y con ⚡ Iniciativa entera pequeña los empates pasan de ser el caso normal a ser casi todos (§10).

**Las fases de bando de v2 quedan descartadas** (v2 §6: fase de Aliados entera y luego fase de Enemigos). Se leían más fácil, pero permitían concentrar todos los golpes seguidos antes de que el rival moviera — que es exactamente donde nacen las combinaciones que matan sin respuesta.

## 5. El turno de una ficha *(decidido)*

**Mueve hasta 👢 Movimiento hexágonos y hace su ataque, en cualquier orden.** No es "mover o atacar": si mover consumiera el turno, las **70 fichas 🗡️** del catálogo —más de la mitad de las 132— pasarían la aproximación entera sin hacer nada mientras las 🏹 disparan gratis. Que el tirador pueda disparar y retroceder en el mismo turno es lo que lo hacía imbatible en campo abierto, y eso se arregla con 👢 Movimiento (§1.2), no rompiendo esta regla.

**Si además puede jugar una carta en su turno, cuántas y a qué coste, es de [game-design.md](../game-design.md) §6** (Turno y economía de cartas), que no está escrito. Este documento no lo decide de refilón.

**No se atraviesa a ninguna ficha, ni aliada ni enemiga**, y dos fichas nunca comparten hexágono *(decidido)*. Es lo que convierte una línea de unidades en una **pantalla**. Con 12 filas de alto, la pantalla no es un muro: quince fichas no tapan doce filas, así que **rodear es legal y lo que cuesta es tiempo** —el desvío se paga en rondas, y en un tablero donde el 🏹 espera quieto, pagar rondas cruzando es caro—. Es un peaje, no una pared, y se acepta como tal.

**Con una excepción, y es dentro de tu propia banda** *(medido el 28 de agosto de 2026)*. Este apartado decía *"rodear **siempre** es legal"* y eso es cierto en campo abierto y falso en las dos columnas del despliegue: allí el borde está a la espalda y las fichas propias tapan el frente, así que una ficha apretada puede empezar la batalla **sin ningún hexágono al que ir**. La regla no cambia —la que se queda sin salida simplemente no mueve, y ataca si tiene a alguien a tiro—; lo que cambia es que **desplegar deja de ser gratis**, y eso está escrito en el §3.

Encaja con lo que ya decía el catálogo: 🦅 **Volador** *"ignora obstáculos del mapa durante el movimiento, pero no puede atravesar enemigos"* ([razas.md](../razas.md)). Volar salta terreno, no cuerpos.

## 6. Fin de la batalla *(decidido el 27 de agosto de 2026)*

| Resultado | Condición |
|---|---|
| **Victoria** | **Caen todos los héroes enemigos**, o caen todas las criaturas si el encuentro no lleva héroe (§2) |
| **Derrota** | **Caen todos los héroes del bando** |

**La victoria se lee igual por los dos lados** *(corregido el 28 de agosto de 2026)*. Esta tabla decía *"cae el héroe enemigo"*, en singular, porque se escribió cuando enfrente había uno; con el presupuesto en espejo del §2 hay **un héroe enemigo por jugador**, y la condición pasa a ser simétrica —caen todos los suyos ↔ caen todos los tuyos—, que es justo por lo que se eligió el espejo.

**Un jugador cuyo héroe cae sigue jugando con sus unidades.** No sale de la mesa, no se retira nada del tablero, y la batalla continúa mientras quede un héroe aliado en pie.

Sustituye al "cae tu héroe y pierdes" del 24 de agosto, que estaba escrito para un bando con **un** héroe. Con tres jugadores había tres lecturas posibles y las otras dos son peores: si pierde el bando entero en cuanto cae cualquier héroe, la partida se decide protegiendo al jugador más frágil; si el jugador eliminado se va, **se queda mirando** el resto de la batalla, que es el problema clásico del co-op y no es un problema de reglas sino de mesa.

Lo que eso cambia: **el héroe deja de ser "la ficha que no puede caer" y pasa a ser "la que no te puedes permitir perder"**. Sigue siendo la pieza a esconder y la pieza a alcanzar —perderlo te deja jugando con cuatro unidades y sin la ficha más fuerte— pero ya no es un interruptor que apaga la partida.

**No se recupera el estado *Derribado* de v2** (§9.1: héroe a 0 rescatable por un compañero adyacente). Su motivo de descarte del 24 de agosto era *"es una regla de co-op con varios héroes en el campo"* y **ese motivo ya no vale** —ahora hay varios héroes—, así que se descarta por otro: **no hace falta**. Derribado existía para que perder al héroe no te sacara de la batalla, y eso ya lo consigue la regla de arriba sin estado nuevo, sin acción de tablero nueva y sin tocar el catálogo de [effects.md](../effects.md). Queda como puerta con su condición: **si al jugar resulta que el jugador sin héroe se queda sin nada interesante que hacer**, Derribado es la respuesta que ya está escrita y solo hay que traerla.

## 7. Terreno y obstáculos *(la fuente decidida, el catálogo pendiente)*

**De dónde saldrán está decidido: del terreno del mapa.** El hexágono del [tablero de exploración](board-map.md) donde se abre la batalla decidirá la plantilla de obstáculos del campo —bosque → maleza, montaña → crestas de roca, pantano → agua—, como hacía v2 (§7). Da variedad sin diseñar escenarios a mano, y sobre todo **le da fuente a cuatro Características que hoy no la tienen**: 🦅 Volador, 🐾 Ágil, 🌊 Anfibio y 🌲 Explorador.

**Pero el primer prototipo se juega a campo abierto** *(decidido el 24 de agosto de 2026)*: rejilla desnuda, sin ningún obstáculo. Primero se mide si la pelea se sostiene; el terreno entra después, encima de algo que ya funcione.

> **Lo que eso cuesta, y hay que tenerlo delante:** la resta de **cobertura** del [§4.1](../game-design.md) —`acierto = 🎯 Precisión − 💨 Evasivo − cobertura ± cartas`— **se queda sin fuente**. En el prototipo vale **0**. No se retira de la fórmula: es una **ranura reservada**, y el día que el campo tenga maleza es donde entra sin tocar el motor.
>
> Las cuatro Características de terreno no se quedan huérfanas, porque su texto habla del **mapa** (*"obstáculos del mapa"*, *"determinados terrenos"*): son rasgos de exploración hasta que el tablero de batalla tenga terreno. Pero conviene decirlo en voz alta — **en el prototipo de batalla no hacen nada**.

Y el tablero grande le sube el interés: **a 11 hexágonos de frente a frente, cruzar a cubierto vale mucho más que cruzar a campo abierto**, así que el terreno dejará de ser adorno en cuanto entre.

Pendiente, por tanto: el **catálogo de obstáculos** (cuáles, con qué regla exacta), las **plantillas por terreno**, y si un obstáculo **bloquea la línea de visión** o solo resta acierto. Esa última no es un detalle: bloquear exige un segundo sistema —línea limpia sí/no, además de la resta— y abre la pregunta de qué es cobertura parcial.

## 8. Lo que sigue por definir

- **La persecución con pantalla** (§1.2). El duelo ya está medido en 2D, pero es **1 contra 1**, que es el peor caso a propósito. Falta la otra mitad: qué hace el kiting con quince fichas por bando, donde la presa se choca con las suyas y el cazador tiene ayuda. No se contesta con un duelo — se contesta jugando la ronda entera.
- **El orden de colocación entre jugadores** en la banda compartida (§3).
- **El tope de jugadores.** Se escribe **1 a 3**, que es el formato nombrado; v2 llegaba a 4 y el tablero mínimo aguantaría 40 fichas de sitio, pero la lista de Iniciativa pasaría de 30 entradas y eso hay que jugarlo antes de prometerlo.
- **Si el tablero grande necesita un reloj o un incentivo para avanzar** (§10). Con el 🏹 esperando quieto, el bando que cruza es el que se expone: si a los dos les conviene esperar, la batalla se puede quedar mirándose. v2 tenía un reloj de 40 turnos que V3 no ha recuperado.
- **Retirada**: si se puede abandonar una batalla. No se decide aquí a propósito — lo que hace falta saber primero es **qué cuesta huir**, y eso es del [tablero de exploración](board-map.md) y de la economía ([game-design.md](../game-design.md) §7), que no están escritos. En v2 costaba +2 de Nivel de Amenaza, un reloj que V3 no tiene.
- **El catálogo de obstáculos y la línea de visión** (§7).
- **Cómo llegas a la batalla**: qué dispara la transición desde el mapa, y si hay algo equivalente a la emboscada de v2 (que dependía de sigilo y detección, mecánicas retiradas).
- **Qué pasa con una unidad que muere**: si la carta se pierde o vuelve a la reserva. Es economía, no tablero, pero se decide antes de poder jugar dos batallas seguidas.
- **Presentación de la ronda**: cómo se enseña en pantalla una lista de Iniciativa de hasta 30 entradas, cómo se distingue de un vistazo un encuentro con héroe de uno sin héroe (§2), y cómo sabe cada jugador cuáles de esas fichas son suyas.
- **PvP** (§2), aplazado con su motivo: falta un segundo balance, no falta tablero.

## 9. Relación con v2

De [v2/board/battle.md](../../v2/board/battle.md) se heredan **dos cosas, las dos por decisión explícita**: las **medidas del campo** que su código jugó de verdad —14×12 con bandas de 2 columnas (§1)— y el **co-op de varios héroes**, que v2 tenía de 1 a 4 y aquí es de 1 a 3 (§2). Lo demás se descarta o no se recupera:

| De v2 | Por qué no |
|---|---|
| La 7×5 escrita en su §2 | Se descarta a favor del 14×12 de su propio código, que es la medida con partidas detrás (§1) |
| Fases de bando | Sustituidas por la lista única de Iniciativa (§4) |
| Despliegue por distancia en el mapa | Necesita la fase de aproximación, que V3 no tiene (§3) |
| Estado *Derribado* y rescate | No hace falta: perder el héroe ya no te saca de la batalla (§6). Queda como puerta |
| **Desengancharse** y **Retirada** | Eran tiradas enfrentadas `1d20 + mod DES`: no hay d20 ni DES |
| Penalización a bocajarro | Era "Desventaja", mecanismo retirado; ya decidido que no penaliza (§1.1) |
| Presupuesto de composición enemiga (*héroes-que-entran + 1*) | **Resuelto por otro camino** (28-ago): la máquina trae **lo mismo que la mesa** (§2). El espejo hace simétrica la victoria, que es lo que su fórmula no daba |
| Mercenarios en el tablero | El tipo de carta desaparece; lo sustituye la Unidad |
| Cobertura como "+1 CA" | No hay CA: la cobertura resta acierto (§7) |
| Reloj de 40 turnos | No se ha recuperado, y el tablero grande vuelve a plantear si hace falta (§8) |
| Oteo de transición, botín al bote común | Son de exploración y economía, no de esta pantalla |

Su §12 dejaba **reabierto el par tamaño-de-tablero / alcances**, con el síntoma de que en 7 columnas la progresión de alcance del arco (4→5→6→7) cubría el campo entero. En V3 ese síntoma no existe —**el alcance no progresa**, es fijo por tipo de daño— y el par se cierra por el otro lado: el tablero manda, y lo que se adapta es **👢 Movimiento** (§1.1).

## 10. Qué hay que vigilar en el primer balance

- **Si a los dos bandos les conviene esperar, no pasa nada.** Es el riesgo propio del tablero grande con el 🏹 quieto: cruzar te expone y esperar no cuesta. Es el primer sitio donde mirar, y si aparece, el dial es un reloj o una recompensa por avanzar (§8), no el tamaño del campo.
- **El kiting está medido en el duelo, no en la batalla.** El 1 contra 1 de 🗡️ contra 🏹 —el caso límite, sin pantalla que ayude— está resuelto con la banda de 👢 del §1.2: contacto en la ronda 4 y un disparo de peaje. Lo que falta es el mismo bucle **con quince fichas por bando** (§8), y ahí las dos correcciones que ya se han comido dos conclusiones seguidas aconsejan lo mismo: medirlo antes de darlo por bueno.
- **La máquina no juega como una persona, y el espejo no es una promesa de dificultad.** El bando enemigo trae lo mismo que la mesa (§2), así que lo que decidirá si la pelea está igualada es **qué** trae —tiers y Características— y cómo decide sus turnos. Es el segundo sitio donde mirar, después del reloj.
- **El 🏹 sigue siendo la pieza anti-héroe, pero ya no decide la partida.** Dos cosas lo han moderado sin haberlo buscado: a 11 hexágonos no amenaza al héroe rival en la ronda 1, y con la derrota por caída de **todos** los héroes (§6) matar uno ya no gana. 🗣️ **Provocación** sigue siendo la única respuesta escrita que existe contra él, y merece mirarse al asignar Características.
- **Los empates de ⚡ Iniciativa con 30 fichas.** El desempate por 🍀 Suerte (§4.6) está escrito para eso, pero se escribió pensando en diez fichas, y es el cuarto trabajo de Suerte con un tope de 25 que se fijó cuando hacía dos.
- **Cuánto se tarda en jugar una ronda de 30 turnos.** No es balance de números, es balance de mesa, y es lo que puede decidir que el tope sean 2 jugadores y no 3.
- **Quince fichas en 24 hexágonos de banda** dan poco margen para desplegar en profundidad: la maniobra se decide casi entera en el despliegue conjunto (§3). Si la pelea resulta ser siempre el mismo choque, el dial es el **alto** del tablero —más filas, más sitio por donde rodear— porque el ancho ya no cambia el ritmo: lo cambia 👢 Movimiento.
