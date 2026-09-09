<!-- estado: a-medias -->

# Diseño del juego — V3

> Las reglas generales del juego. Solo lo decidido; los apartados abiertos están marcados. El por qué de cada decisión y su fecha están en [status.md](status.md).

## 1. Rumbo y referencias *(decidido)*

El juego se sitúa entre **Heroes of Might & Magic: Olden Era** y **Magic the Gathering**. **Sustituye** al diseño de raíz D&D de [v2](../v2/), no lo extiende.

Tres piezas lo sostienen todo, y van antes que nada:

1. **Las razas** — cada una con sus clases jugables y su progresión de unidades. En [Razas](razas/).
2. **Las Habilidades** — las 8 estadísticas numéricas. En [Habilidades](sistemas/habilidades.md).
3. **Las Características** — rasgos con nombre fijo, reutilizables entre fichas. En [Características](sistemas/caracteristicas.md).

"Personaje" incluye por igual a héroes, enemigos y unidades: las tres cosas son **fichas**, y sus campos están en [La ficha](sistemas/ficha.md).

## 2. Los dos tableros *(decidido)*

- **Tablero de batalla** — [board/battle.md](board/battle.md). **Escrito.** Co-op de **1 a 3 jugadores**, arena grande (mínimo 14×12), **un héroe y hasta 4 unidades por jugador** (15 fichas por bando), una sola lista de Iniciativa con los dos bandos entrelazados, bando enemigo **en espejo** y derrota cuando caen **todos** los héroes del bando.
- **Tablero de exploración** — [board/board-map.md](board/board-map.md). **Esqueleto.**

## 3. Progresión y rareza

**Un solo eje de potencia: el tier.**

- **Una unidad no sube: es más fuerte porque es *otra* unidad.** Los ocho escalones por raza ([razas/unidades.md](razas/unidades.md)) son toda su curva, y los recorren ❤️ Vida y ⚔️ Ataque con el ×10 de [Habilidades](sistemas/habilidades.md) §2.
- **La Rareza no es un segundo eje: sale del tier** (`rarityForTier`, en `lib/v3/rarity.ts`). Así no hay 88 rarezas que asignar a mano, y una carta no puede decir dos cosas sobre lo fuerte que es.
- **No hay progresión de personaje.** Ni el héroe ni las unidades suben de nivel: queda **fuera de alcance** ([status.md](status.md) §5).

Falta definir **cómo se obtienen las unidades de tier alto**, que es economía y no progresión (§7).

### 3.1 De tier a Rareza

| Tier | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| **Rareza** | Común | Común | Poco común | Poco común | Poco común | Raro | Épico | Legendario |

Los cuatro cortes salieron del **reparto de Características** del roster real, no de la potencia —que es una geométrica pura y no da ninguno—:

| Tier | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Media de Características | 1,18 | 1,27 | 2,00 | 1,91 | 2,00 | 2,55 | 3,27 | 4,36 |
| Salto | — | +0,09 | **+0,73** | −0,09 | +0,09 | **+0,55** | **+0,73** | **+1,09** |

Cuatro saltos de ≥0,55 y tres llanos de ≤0,09: el roster ya había partido los tiers en **{1,2} {3,4,5} {6} {7} {8}**.

**Lo que cuesta, dicho:** por raza salen 2 comunes, 3 poco comunes, 1 rara, 1 épica y 1 legendaria — **no es una pirámide de colección**, y se acepta: aquí la Rareza dice de qué clase de carta se trata, y con qué frecuencia aparece una unidad es economía (§7).

**Un héroe no entra en la escala**: no tiene tier del que derivarla. Lleva raíl propio (`HERO_RAIL`).

## 4. Motor de combate *(decidido en lo esencial)*

**"Sin dados" significa rechazar el d20 de [v2](../v2/), no rechazar el azar.** Hay azar, y es **porcentual y oculto**: nunca se muestra un dado. Es lo que le da palanca a una carta modificadora — un "+3 al daño" vale siempre 3, un "+3 al acierto" solo vale cuando la tirada está en el filo.

### 4.1 Una sola tirada por ataque

```
R = tirada oculta 1..100

acierto = 🎯 Precisión del atacante
          − 💨 Evasivo del defensor (si lo lleva)
          − cobertura del terreno
          ± modificadores de carta

R >  acierto      → FALLO
R ≤  acierto      → IMPACTO
   R ≤ 🍀 Suerte  → CRÍTICO
```

Una tirada y dos umbrales: no hay tirada de crítico aparte ni de estado aparte (§4.5), así que **un solo número explica todo lo que pasó**.

- **Banda de acierto 65–95.** Nunca acierto garantizado, nunca un 40% que se sienta roto. Esos treinta puntos se reparten entre los 8 tiers, la cobertura, 💨 Evasivo y las cartas.
- **🍀 Suerte tope 25, y nunca por encima de 🎯 Precisión.** El crítico no solo dobla el daño: también aplica los estados de control (§4.5).
- **La evasión no es una Habilidad, es la Característica 💨 Evasivo.** Así no hay novena Habilidad, y ser difícil de golpear se decide ficha a ficha.
- **La cobertura es una ranura reservada que hoy vale 0**: el primer prototipo se juega a campo abierto ([battle.md](board/battle.md) §7). El día que el campo tenga obstáculos, entra ahí sin tocar el motor.

### 4.2 Daño

```
daño = ⚔️ Ataque × (1 − mitigación / 100)
crítico → daño × 2

mitigación = 🛡️ Defensa            si el tipo de daño es 🗡️ o 🏹
             🔮 Resistencia mágica  si el tipo de daño es ✨
```

- **⚔️ Ataque es el daño a secas**, no "daño físico": de qué clase es lo dice el [tipo de daño](sistemas/dano.md) de la ficha, y de eso depende cuál de los dos números lo frena. Una sola fórmula para los tres tipos.
- **La mitigación es el porcentaje que reduce.** Defensa 30 = "recibo un 30% menos". **Tope 75**: a 100 habría inmunidad, y la inmunidad tiene que ser un rasgo, no un número.
- **🗡️ Perforante resta 15 puntos** de Defensa antes de dividir. Es fijo pero se comporta como anti-tanque: contra Defensa 20 apenas mueve el daño (×1,19), contra 75 lo sube a ×1,60.
- **Porcentual y no `Ataque − Defensa`**, que con 8 tiers se rompe en los dos extremos. Así **nunca da cero ni infinito** sin ningún caso especial.
- **El daño no lleva rango.** El azar ya está en el acierto y el crítico, y ⚔️ Ataque se queda como un solo número que la carta puede dibujar.
- **Se resta de ❤️ Vida directamente**: los PV máximos son el valor de la ficha, sin derivar de nada. Lo que pone, es.

### 4.3 Los tres tipos de daño

Toda ficha lleva **uno y solo uno**, obligatorio y sin defecto. El catálogo, en [sistemas/dano.md](sistemas/dano.md).

| Tipo | Alcance | Qué lo reduce | 👢 Movimiento |
|---|---|---|---|
| 🗡️ **Cuerpo a cuerpo** | **1** — el hexágono contiguo | 🛡️ Defensa | **3** |
| 🏹 **A distancia** | **4** hexágonos | 🛡️ Defensa | **1** |
| ✨ **Mágico** | **2** hexágonos | 🔮 Resistencia mágica | **2** |

- **El alcance es fijo por tipo, y es un máximo, no un mínimo.** No hay número de alcance en la ficha: el tipo ya lo dice. **Se puede disparar o lanzar magia contra un enemigo pegado, sin penalización** — meterse encima de un tirador no lo desarma.
- **Lo que se adapta al tamaño del campo es 👢 Movimiento**, no el alcance ([battle.md](board/battle.md) §1.2). De ahí el reparto de la columna: el 🗡️ cruza el campo, el ✨ avanza a media rienda y el 🏹 espera, porque avanzar para disparar es ponerse a tiro del que corre.
- **Lo elemental no es un cuarto tipo**: 🔥 Fuego, ☠️ Veneno y 🧊 Hielo montan encima del tipo que tenga la ficha, pasan por 🔮 Resistencia mágica y el rasgo específico resta encima.
- **Una carta que haga daño también declara su tipo**, y también obligatorio.
- **Una ficha, un ataque: no hay ataque secundario.** Cualquier otra cosa la hace una **carta**. El precio se acepta: un golpe cuerpo a cuerpo que haga daño mágico —el ✝️ Paladín— no se puede expresar en la ficha, porque alcance y canal viajan juntos. Lo resuelve una carta.

### 4.4 Quién tira para acertar

La línea se traza **por origen, no por tipo de daño**:

| Origen | ¿Tira? |
|---|---|
| **Hechizo** — lo que viene de una carta | **No.** Siempre entra; solo lo reduce 🔮 Resistencia mágica |
| **Ataque básico** — la acción de tablero | **Sí**, siempre, sea 🗡️, 🏹 o ✨ |

El ataque básico es gratis, así que puede permitirse fallar; un hechizo cuesta una carta, y perderla a un fallo en seco es la peor sensación que el juego puede dar. Cortar por origen y no por tipo es además lo que mantiene a 🎯 Precisión valiendo para las 132.

Asimetría deliberada: **el ataque básico es barato y variable, el hechizo es caro y fiable.**

### 4.5 Estados

Los aplica el impacto, y no todos entran igual:

- **Elementales: siempre.** 🔥 Fuego, ☠️ Veneno y 🧊 Hielo aplican al impactar, sin probabilidad. Un dragón que a veces no quema se sentiría roto.
- **Control: lo aplica el crítico**, y su probabilidad **es 🍀 Suerte**. No hay tercer umbral ni número nuevo por rasgo: si llevas 💫 Aturdimiento o 🌀 Confusión, tu crítico además controla.
- **😱 Miedo es la excepción**: no cuelga de la tirada, sino de bajar de media Vida por primera vez en el combate. Es un disparador, no un efecto del golpe.

Qué hace cada estado, su duración y su acumulación, en [effects.md](sistemas/effects.md).

### 4.6 Iniciativa

```
orden = ⚡ Iniciativa, de mayor a menor
        empate → 🍀 Suerte, de mayor a menor
        empate → azar
```

⚡ Iniciativa determina el orden y nada más. **Es propiedad fija de la ficha: ningún estado la altera.**

El doble desempate hace falta porque ⚡ es un entero pequeño y en el tablero hay **hasta treinta fichas en una sola lista** ([battle.md](board/battle.md) §4): los empates son el caso normal, no el raro.

> **🍀 Suerte hace cuatro cosas** —umbral de crítico (§4.1), entrada de los estados de control (§4.5), salida temprana de un estado ([effects.md](sistemas/effects.md) §2) y desempate—, y su tope de 25 se fijó cuando hacía dos. **Si al balancear resulta que Suerte es la Habilidad que más pesa, este es el sitio donde mirar primero.**

### 4.7 Lo que sigue por definir

**Del motor, nada.** Lo que le falta para poder jugarse son los valores de las 132 fichas, que son catálogo: [Habilidades](sistemas/habilidades.md) cerró el sistema *(8-sep)*, y 🛡️ 🔮 🎯 🍀 ⚡ se eligen ficha a ficha en su documento —los héroes en [heroes.md](characters/heroes.md), las unidades en [unidades.md](razas/unidades.md)—. Con valores en la mano toca el **primer pase de balance** (§8), y el primer sitio donde mirar es el aviso de 🍀 Suerte del §4.6.

## 5. Resolución fuera de combate

*Por definir.* Pruebas de habilidad en el tablero de exploración, rango de visión y cualquier resolución que no sea un ataque.

## 6. Turno y economía de cartas *(heredado de v2, provisional)*

**No está cerrado del todo** *(8-sep-2026)*: sin progresión de personaje (§3), lo que crece en una campaña no es el héroe, es su colección de cartas, y ese matiz no estaba en v2. Con eso dicho, **el modelo se copia de [v2](../v2/game-design.md) §4 tal cual**, adaptado a lo que V3 ya tiene decidido en otro sitio (nada de armas/armaduras ni de mercenarios-carta, §4.4 del ataque básico). Se marca **provisional** y no definitivo porque no se ha mirado con valores reales en la mano.

**Solo el héroe tiene Mazo**, uno por jugador. Las unidades no llevan carta propia: se reclutan como ficha entera ([razas/unidades.md](razas/unidades.md), [cards/units.md](cards/units.md)) y no pasan por el Oteo.

### 6.1 El Mazo

- **De qué se compone**: cartas de clase ([cards/class.md](cards/class.md)) + items ([cards/items.md](cards/items.md)) + las maldiciones que le caigan, si ese tipo sigue en pie ([cards/curses.md](cards/curses.md), hoy en espera). **No entran**: unidades (se reclutan aparte, no se otean), armas y armaduras (obsoletas en V3, [cards/README.md](cards/README.md)) ni el mazo de encuentro (es del escenario, no del jugador).
- **Tope — hasta 20 cartas**, el número de v2 sin tocar. Es un punto de partida, no un balance: se revisa cuando el catálogo de clase e item de V3 exista de verdad.
- **Cómo crece**: con botín, compra y recompensas (§7, todavía sin escribir) — **nunca con el Oteo**. Al llegar al tope, una carta nueva obliga a **cambiar una por otra** (swap 1-por-1).

### 6.2 En juego

- **Tope fijo: 5 cartas preparadas**, las únicas que se pueden jugar. Se llena poco a poco con el Oteo; el kit inicial de cada héroe (con cuántas arranca) depende de §7.
- Clase e item **compiten por esos 5 huecos**: llevar más de un tipo preparado deja menos sitio para el otro.

### 6.3 Otear

- **Al empezar tu turno**, antes de mover: revelas **2 cartas al azar de tu Mazo** y eliges **1** (o ninguna) para pasarla a "en juego"; la que no eliges vuelve al Mazo.
- **Con menos de 2 cartas en el Mazo**: si queda 1, el Oteo revela esa; si está vacío, no hay Oteo ese turno.
- **El Mazo entero se puede consultar siempre**: lo aleatorio es el orden en que sale, no la identidad de las cartas — es tu propia baraja, no hay información oculta que proteger.

### 6.4 Jugar una carta

- **No sustituye al ataque básico, lo complementa — y esto no es un préstamo de v2, ya estaba decidido** (§4.4): el ataque básico de la ficha es gratis y siempre tira; un hechizo viene de una carta, nunca tira y siempre entra, solo lo reduce 🔮 Resistencia mágica. Son dos cosas distintas del turno, no una elección entre ellas — a diferencia de v2, donde competían por la misma Acción.
- **Hasta 1 carta por turno** *(provisional, sin confirmar)*: es el ritmo que en v2 fijaba el propio Oteo (~1 carta nueva por turno); aquí hay que decidirlo aparte porque el ataque ya no comparte hueco con la carta. Sin este tope, "en juego" se podría vaciar entero en un solo turno.
- **Qué le pasa a la carta al jugarla**: por defecto vuelve al Mazo, salvo que su Tipo diga lo contrario (§6.5). Nada se pierde al jugarla, puede volver a salir en un Oteo posterior.

### 6.5 Tipo de carta y su hueco

La mecánica del hueco, heredada de v2 — el texto de cada carta (qué Tipo es, qué efecto tiene) sigue siendo trabajo de [cards/class.md](cards/class.md) y [cards/items.md](cards/items.md), no de aquí:

| Tipo | Al jugarla |
|---|---|
| **Acción** | Sale de "en juego" y vuelve al Mazo. Para repetirla, tiene que volver a salir en un Oteo. |
| **Pasiva** | Se queda ocupando su hueco para siempre, hasta que la sustituyas en un Oteo posterior. |
| **Turnos** | Ocupa su hueco mientras dure su efecto; al acabar, vuelve sola al Mazo. |

### 6.6 Lo que sigue por definir

- El kit inicial de cada héroe — cuántas cartas trae el Mazo y "en juego" al empezar una campaña. Depende de §7.
- Si **1 carta por turno** (§6.4) es el ritmo correcto, o hay que revisarlo con valores reales en la mano.
- Si maldición sobrevive como tipo de carta ([cards/curses.md](cards/curses.md)): si no, se retira de §6.1 sin tocar el resto.
- El texto de cada carta de clase e item: qué Tipo es cada una, qué efecto tiene.

## 7. Economía y recompensas

*Por definir.* Oro, loot, tabla de recompensas y qué se puede comprar.

## 8. Balance

*Por definir.* Método de balance y objetivos numéricos. Nada de V3 está balanceado todavía.
