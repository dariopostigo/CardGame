<!-- estado: escrito -->

# Tablero de batalla — V3

> La pantalla donde se resuelve el combate: la arena, quién entra, el despliegue, la ronda, el turno de una ficha y el fin de la batalla.

**Las reglas de resolución de ataque no viven aquí** sino en [game-design.md](../game-design.md) §4 — esto es el escenario, no el motor. Lo que decide *si* se abre una batalla es del [tablero de exploración](board-map.md). El historial de decisiones y lo que midió [/dev/tablero](/dev/tablero) está en [status.md](../status.md).

## 1. La arena

**El tablero es grande y no se ata al formato.** Mínimo **14 columnas × 12 filas** —168 hexágonos, coordenadas axiales— y crece en cuatro tamaños hasta 20×15. Se juega igual de grande con un jugador que con tres.

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

- **Bandas de despliegue de 2 columnas en los lados cortos, pegadas al borde.** Pegadas, porque es lo único que garantiza la distancia inicial: con despliegue en media cancha cualquiera de los dos bandos puede renunciar a la aproximación.
- **Hexágonos, no cuadrícula.** Los alcances están decididos en hexágonos y son fijos por tipo de daño.

### 1.1 El acercamiento es parte del juego

Con los frentes a **11 hexágonos** hacen falta **varias rondas de maniobra antes del primer golpe**, y eso es la intención: quién cruza, por dónde, quién espera y a qué distancia se acepta el choque.

**Los tres alcances no se tocan** —🗡️ 1 · ✨ 2 · 🏹 4, [game-design.md §4.3](../game-design.md)—. Lo que se adapta al campo es **👢 Movimiento**:

| Tipo | Alcance | 👢 | Su trabajo en la aproximación |
|---|---|---|---|
| 🗡️ **Cuerpo a cuerpo** | 1 | **3** | Cruza el campo entero. Paga la aproximación, y por eso corre |
| ✨ **Mágico** | 2 | **2** | Avanza a media rienda y entra detrás del 🗡️ |
| 🏹 **A distancia** | 4 | **1** | **No avanza: espera.** Su trabajo es castigar a quien cruce |

**El 🏹 deja de abrir la batalla y pasa a esperarla**, y es el cambio de carácter más grande del tablero grande: el arquero que avanza para disparar es el que se pone a tiro del que corre.

### 1.2 El arquero que retrocede

En campo abierto aparece un bucle: el tirador dispara y retrocede, y con el mismo 👢 para los dos conserva la distancia para siempre. El borde no lo caza, porque correr en paralelo al borde conserva la distancia sin gastar sitio a la espalda.

**Medido en 2D** *([/dev/tablero](/dev/tablero))*, con alcance 1 contra alcance 4:

| 👢 🗡️ contra 👢 🏹 | 14×12 | 20×16 |
|---|---|---|
| **2 contra 2** | contacto en la ronda 16, **11 disparos** | ronda 22, **14 disparos** |
| **3 contra 1** | ronda 4, 1 disparo | ronda 6, 1 disparo |
| **4 contra 1** | ronda 3, 1 disparo | ronda 4, 0 disparos |
| **4 contra 4** | ronda 4, 0 disparos | ronda 4, 0 disparos |

Lo que manda no es la diferencia: es que **el 👢 del que cruza se acerque al alcance 4 del arquero**. El peligro no es la igualdad, es la **igualdad baja**.

**La banda queda decidida: 🗡️ 3 · ✨ 2 · 🏹 1.** Es el reparto **más lento que sigue siendo seguro** —cuatro rondas de aproximación en el tablero mínimo, seis en el de 20×16— y deja al 🏹 cobrar **un disparo** mientras el 🗡️ cruza, que es exactamente su trabajo.

> **Son valores de ficha, no un parche del tablero**: entran en la escala de [Habilidades](../sistemas/habilidades.md). Si algún día una ficha quiere salirse de su banda, lo medido dice hasta dónde: **ninguna 🏹 por encima de 2, ninguna 🗡️ por debajo de 3, ninguna ✨ por debajo de 2**.

## 2. El bando: de uno a tres jugadores, cada uno con su héroe

**El juego es co-op.** De uno a tres jugadores forman **un** bando, cada uno con **su héroe y hasta 4 unidades**, y enfrente está la máquina. Jugar en solitario es el mismo juego con un jugador: no hay dos modos, hay un número.

| Jugadores | Fichas por bando | En el campo |
|---|---|---|
| 1 | 5 | 10 |
| 2 | 10 | 20 |
| 3 | 15 | 30 |

- El tope de 4 unidades es **tope y no requisito**, y es por jugador.
- **Las ocho unidades de la raza son la reserva, no el ejército.** Elegir cuatro antes de la batalla es una decisión de juego: ¿el tier alto que pega, o dos baratas que hacen pantalla? Con tres jugadores son tres reservas de ocho para doce ranuras.
- **Una carta de unidad pone una ficha, una criatura.** No hay pilas de figuras: una pila exigiría una segunda matemática de daño en paralelo al §4.2.

**El bando enemigo tiene dos formas, según el encuentro:**

| Encuentro | Composición | Cómo se gana |
|---|---|---|
| **De facción** | **Un héroe enemigo por jugador**, cada uno con hasta 4 unidades de su raza | Caen **todos** sus héroes |
| **De fauna u horda** | Criaturas, sin héroe | Caen todas |

Son **dos condiciones de victoria**, y el jugador tiene que saber cuál juega **antes de desplegar**: eso es un requisito de pantalla, no una regla.

**El presupuesto de la máquina es el espejo: trae lo mismo que la mesa.** Un héroe enemigo y hasta 4 unidades por jugador, así que la tabla vale igual para los dos lados. Es lo único que permite que **la victoria se lea igual por los dos lados** (§6).

> **Lo que sigue abierto no es el presupuesto, es la dificultad.** El espejo es el punto de partida, no una promesa de pelea igualada: la máquina no juega como una persona (§10), y si resulta fácil o imposible el dial es **su composición** —qué tiers, con qué Características—, no el número de fichas. Eso se mira con valores en la mano.

**PvP no se descarta**, y queda como puerta con su condición: el tablero ya serviría tal cual, así que lo que falta es **un segundo balance** y sus propias reglas de victoria y recompensa.

## 3. Despliegue

**Colocación libre dentro de tu banda**, antes de la ronda 1.

**La banda es del bando, no del jugador.** Con tres son 15 fichas en 24 hexágonos: la banda se llena, y quién se pone delante es la primera decisión conjunta de la partida.

**Y hay que desplegar dejando huecos.** Como no se atraviesa a nadie (§5) y la banda tiene el borde detrás, un despliegue apretado **se encierra a sí mismo**: con la colocación natural —pantalla delante, héroes detrás— hay fichas a las que la ronda 1 les llega sin salida. Una con un jugador, tres con dos, **cinco con tres**, y no mejora agrandando el tablero. Quién se queda sin turno depende además del orden de la lista de Iniciativa (§4).

> No es un fallo que pida una regla: es la primera decisión táctica de la partida. **Si al jugar resulta que apretar la banda castiga más de lo que enseña**, la respuesta barata es dejar que dos fichas aliadas intercambien el sitio.

Pendiente: **en qué orden colocan los jugadores** (§8).

## 4. La ronda: una sola lista de Iniciativa

**Todas las fichas de los dos bandos van en una única lista ordenada por ⚡ Iniciativa**, de mayor a menor; el turno salta de bando y de jugador según toque. Es la fórmula de [game-design.md §4.6](../game-design.md) tal cual —empate → 🍀 Suerte → azar—, y es lo que hace que ⚡ valga: con fases de bando solo te ordena contra tus aliados.

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

**El orden se fija al abrir la batalla y no se recalcula**: ⚡ es propiedad fija de la ficha y ningún estado la altera. Si algún día una carta la toca, el orden se rehace **desde la ronda siguiente**, no en el acto.

Con tres jugadores la lista tiene **hasta 30 entradas** y entre dos turnos tuyos pueden pasar nueve fichas. Eso es lo que compra el entrelazado —nadie encadena la ronda entera antes de que el rival mueva— y también lo que hay que vigilar (§10).

## 5. El turno de una ficha

**Mueve hasta 👢 Movimiento hexágonos y hace su ataque, en cualquier orden.** No es "mover o atacar": si mover consumiera el turno, las **70 fichas 🗡️** del catálogo pasarían la aproximación entera sin hacer nada. Que el tirador pueda disparar y retroceder se arregla con 👢 (§1.2), no rompiendo esta regla.

**No se atraviesa a ninguna ficha, ni aliada ni enemiga**, y dos fichas nunca comparten hexágono. Es lo que convierte una línea de unidades en una **pantalla** — pero con 12 filas de alto no es un muro: **rodear es legal y lo que cuesta es tiempo**. Es un peaje, no una pared.

Con una excepción, y es **dentro de tu propia banda**: allí el borde está a la espalda y las propias tapan el frente, así que una ficha apretada puede no tener **ningún hexágono al que ir** (§3). La regla no cambia: la que se queda sin salida no mueve, y ataca si tiene a alguien a tiro.

Encaja con el catálogo: 🦅 **Volador** *"ignora obstáculos del mapa, pero no puede atravesar enemigos"* — volar salta terreno, no cuerpos.

**Si además puede jugar una carta en su turno, cuántas y a qué coste, es de [game-design.md](../game-design.md) §6**: hasta 1, y no sustituye a este ataque —lo complementa, §4.4—, aunque el propio §6 marca ese ritmo como provisional.

## 6. Fin de la batalla

| Resultado | Condición |
|---|---|
| **Victoria** | **Caen todos los héroes enemigos**, o todas las criaturas si el encuentro no lleva héroe (§2) |
| **Derrota** | **Caen todos los héroes del bando** |

**Un jugador cuyo héroe cae sigue jugando con sus unidades.** No sale de la mesa y la batalla continúa mientras quede un héroe aliado en pie. Así **el héroe deja de ser "la ficha que no puede caer" y pasa a ser "la que no te puedes permitir perder"**: sigue siendo la pieza a esconder y la pieza a alcanzar, pero ya no es un interruptor que apaga la partida.

> El estado *Derribado* de v2 —héroe a 0 rescatable por un compañero— **no hace falta**: existía para que perder al héroe no te sacara de la batalla, y eso ya lo consigue la regla de arriba. Queda como puerta: **si el jugador sin héroe se queda sin nada interesante que hacer**, es la respuesta que ya está escrita.

## 7. Terreno y obstáculos

**De dónde saldrán está decidido: del terreno del mapa.** El hexágono del [tablero de exploración](board-map.md) donde se abre la batalla decidirá la plantilla de obstáculos —bosque → maleza, montaña → crestas de roca, pantano → agua—. Da variedad sin diseñar escenarios a mano, y **le da fuente a cuatro Características que hoy no la tienen**: 🦅 Volador, 🐾 Ágil, 🌊 Anfibio y 🌲 Explorador.

**Pero el primer prototipo se juega a campo abierto**: rejilla desnuda. Primero se mide si la pelea se sostiene.

> **Lo que eso cuesta:** la resta de **cobertura** del [§4.1](../game-design.md) se queda sin fuente y vale **0**. No se retira de la fórmula, es una ranura reservada. Y **las cuatro Características de terreno no hacen nada en el prototipo de batalla** — su texto habla del mapa, así que son rasgos de exploración hasta que el campo tenga terreno.

Pendiente: el **catálogo de obstáculos**, las **plantillas por terreno**, y si un obstáculo **bloquea la línea de visión** o solo resta acierto. Esa última no es un detalle: bloquear exige un segundo sistema y abre la pregunta de qué es cobertura parcial.

## 8. Lo que sigue por definir

- **El orden de colocación entre jugadores** en la banda compartida (§3).
- **Cuánto aguanta la pantalla con quince fichas por bando.** El mecanismo está cerrado: la pantalla **es porosa en cuanto hay bajas** —no hace falta vaciar la fila, un hueco local basta—, y medida con estadísticas neutras muere algún ✨🏹 en el 100% de los combates, el primero hacia la **ronda 8**. Lo que falta es el **cuánto**, y depende de ❤️ ⚔️ 🛡️ reales, que son insumo.
- **El tope de jugadores.** Se escribe 1 a 3; el tablero aguantaría más de sitio, pero la lista de Iniciativa pasaría de 30 entradas y eso hay que jugarlo antes de prometerlo.
- **Si el tablero grande necesita un reloj o un incentivo para avanzar** (§10). Con el 🏹 quieto, el bando que cruza es el que se expone: si a los dos les conviene esperar, la batalla se puede quedar mirándose.
- **Retirada**: si se puede abandonar una batalla. Hace falta saber primero **qué cuesta huir**, y eso es del [tablero de exploración](board-map.md) y de la economía ([game-design.md](../game-design.md) §7).
- **El catálogo de obstáculos y la línea de visión** (§7).
- **Cómo llegas a la batalla**: qué dispara la transición desde el mapa.
- **Qué pasa con una unidad que muere**: si la carta se pierde o vuelve a la reserva. Es economía, pero se decide antes de poder jugar dos batallas seguidas.
- **Presentación de la ronda**: cómo se enseña una lista de hasta 30 entradas, cómo se distingue un encuentro con héroe de uno sin héroe (§2), y cómo sabe cada jugador cuáles son sus fichas.
- **PvP** (§2): falta un segundo balance, no falta tablero.

## 9. Relación con v2

De [v2/board/battle.md](../../v2/board/battle.md) se heredan **dos cosas por decisión explícita**: las **medidas del campo** que su código jugó de verdad —14×12 con bandas de 2 columnas— y el **co-op de varios héroes**, que allí era de 1 a 4 y aquí es de 1 a 3.

**Lo demás no se recupera**, y conviene tenerlo dicho para no reimportarlo: la 7×5 escrita en su §2, las fases de bando, el despliegue por distancia en el mapa, *Derribado*, *Desengancharse* y *Retirada* (eran tiradas de d20), la penalización a bocajarro, el presupuesto enemigo de *héroes-que-entran + 1*, los mercenarios y la cobertura como "+1 CA". Su **reloj de 40 turnos** tampoco se ha recuperado, y el tablero grande vuelve a plantear si hace falta (§8).

## 10. Qué hay que vigilar en el primer balance

- **Si a los dos bandos les conviene esperar, no pasa nada.** Es el riesgo propio del tablero grande con el 🏹 quieto. Primer sitio donde mirar, y el dial es un reloj o una recompensa por avanzar (§8), no el tamaño del campo.
- **La máquina no juega como una persona, y el espejo no promete dificultad.** Lo que decidirá si la pelea está igualada es **qué** trae y cómo decide sus turnos (§2).
- **El 🏹 sigue siendo la pieza anti-héroe, pero ya no decide la partida**: a 11 hexágonos no amenaza en la ronda 1, y con la derrota por caída de **todos** los héroes matar uno ya no gana. 🗣️ **Provocación** es la única respuesta escrita contra él.
- **Los empates de ⚡ Iniciativa con 30 fichas.** El desempate por 🍀 Suerte está escrito para eso, pero se pensó para diez fichas, y es el cuarto trabajo de Suerte con un tope fijado cuando hacía dos.
- **Cuánto se tarda en jugar una ronda de 30 turnos.** No es balance de números, es balance de mesa, y puede decidir que el tope sean 2 jugadores.
- **Quince fichas en 24 hexágonos** dan poco margen para desplegar en profundidad. Si la pelea resulta ser siempre el mismo choque, el dial es el **alto** del tablero, no el ancho.
