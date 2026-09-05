<!-- estado: a-medias -->

# Diseño del juego — V3

> Esqueleto. Solo contiene lo que ya está decidido; el resto son apartados abiertos que hay que escribir.

## 1. Rumbo y referencias *(decidido)*

El juego se sitúa entre **Heroes of Might & Magic: Olden Era** y **Magic the Gathering**, con el modo de juego adaptado. Las tres piezas que sostienen todo lo demás y que hay que definir antes que nada:

1. **Las razas**, cada una con sus clases jugables y su progresión propia de unidades.
2. **Las Habilidades de los personajes** — las estadísticas numéricas. "Personaje" incluye por igual a héroes, enemigos y unidades.
3. **Las Características de los personajes** — rasgos con nombre fijo, reutilizables entre fichas (Robo de vida, No-muerto, Volador…).

Sobre esas tres piezas se construyen las acciones de combate. Las tres viven en [razas.md](razas.md).

Este rumbo **sustituye** al diseño de raíz D&D archivado en [v2](../v2/), no lo extiende.

## 2. Los dos tableros *(decidido)*

El juego se reparte en dos tableros distintos, ya no en uno solo:

- **Tablero de exploración** — [board/board-map.md](board/board-map.md)
- **Tablero de batalla** — [board/battle.md](board/battle.md)

El **tablero de batalla está escrito** *(24 de agosto de 2026)* y **rehecho** *(27 de agosto de 2026)*, cuando el juego se fijó como **co-op de uno a tres jugadores**: arena **grande** —mínimo 14×12, y no se ata al formato—, **cada jugador con su héroe y hasta 4 unidades** (hasta 15 fichas por bando), una sola lista de Iniciativa con los dos bandos entrelazados, y **derrota cuando caen todos los héroes del bando** —el jugador que pierde el suyo sigue jugando con sus unidades—. La **aproximación larga es la intención**, y para sostenerla 👢 Movimiento pasa a depender del tipo de daño (§4.3). El **bando enemigo es el espejo del de la mesa** *(28 de agosto de 2026)* —un héroe y hasta 4 unidades por jugador, y la victoria se lee igual por los dos lados—. Lo que se hereda y lo que se descarta de v2 está tabulado en su documento. El **tablero de exploración** sigue siendo un esqueleto.

## 3. Progresión y rareza

**Un solo eje de potencia** *(decidido el 24 de agosto de 2026)*:

- **El tier es el eje de las unidades.** Una unidad es más fuerte porque es *otra* unidad, no porque haya subido. La progresión de ocho por raza ([razas.md](razas.md)) es toda su curva, y los números que la recorren son ❤️ Vida y ⚔️ Ataque con el ×10 de [La escala](razas.md#-la-escala-23-de-agosto-de-2026).
- **La Rareza no es un segundo eje: sale del tier.** Los 8 tiers se reparten en las 5 Rarezas con una función (`rarityForTier`, en `lib/v3/rarity.ts`). Así no hay 88 rarezas que asignar y balancear a mano, y una carta no puede decir dos cosas distintas sobre lo fuerte que es.

**V3 no tiene progresión de personaje.** Ni el héroe ni las unidades suben de nivel: la mecánica que v2 tenía no se hereda, y queda **fuera de alcance** ([status.md](status.md) §5) hasta que el juego esté lo bastante desarrollado para saber si hace falta. Un héroe es *quién* es —su clase, sus Características y su tipo de daño—, y una unidad, cuál es. El sistema de rareza sí se mantiene conceptualmente respecto a v2; sus diales se redefinen aquí.

Falta definir: **cómo se obtienen las unidades de tier alto**, que es economía y no progresión (§7).

### 3.1 La función de tier a Rareza *(decidida el 5 de septiembre de 2026)*

| Tier | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| **Rareza** | Común | Común | Poco común | Poco común | Poco común | Raro | Épico | Legendario |

**Las fronteras no se eligieron: estaban puestas.** Ocho tiers en cinco Rarezas piden cuatro cortes, y se buscaron en las dos curvas que recorren la progresión, sobre las 88 unidades reales:

- **La potencia no da ninguno.** El ×10 de [La escala](razas.md#-la-escala-23-de-agosto-de-2026) sube con pasos de ×1,357 a ×1,421 — una geométrica pura. Ningún escalón destaca, así que cortar ahí habría sido elegir, no medir.
- **El reparto de Características da exactamente cuatro.** Media de Características por tier, con su salto respecto al anterior:

  | Tier | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
  |---|---|---|---|---|---|---|---|---|
  | Media | 1,18 | 1,27 | 2,00 | 1,91 | 2,00 | 2,55 | 3,27 | 4,36 |
  | Salto | — | +0,09 | **+0,73** | −0,09 | +0,09 | **+0,55** | **+0,73** | **+1,09** |

  Cuatro saltos de ≥0,55 y tres llanos de ≤0,09: seis veces de diferencia y ningún caso dudoso. El roster ya había partido los ocho tiers en cinco grupos —{1,2} {3,4,5} {6} {7} {8}— antes de que nadie preguntara.

**Lo que cuesta, dicho:** el reparto **no es una pirámide de colección**. Por raza salen 2 comunes, 3 poco comunes, 1 rara, 1 épica y 1 legendaria (22 · 33 · 11 · 11 · 11 en las 88), así que la banda gorda está en el segundo escalón y no en el primero. Se acepta a sabiendas: aquí la Rareza dice **de qué clase de carta se trata**, y con qué frecuencia aparece una unidad es economía (§7), que no está escrita. Si la economía pide algún día una pirámide, se cambia la función con el motivo escrito — no se asignan rarezas a mano, que es lo que el eje único vino a evitar.

**Y los tres tiers de arriba van solos**, cada uno en su escalón, porque es lo que dice el roster: 2,55 → 3,27 → 4,36, separándose más en cada paso. Un tier 8 no es «un tier 7 grande».

**Un héroe no entra en la escala**: no tiene tier del que derivar Rareza, y prestarle un escalón diría que un Sacerdote es «más legendario» que un Guerrero. Lleva raíl propio (`HERO_RAIL`), el rojo de la identidad de la interfaz.

> **Una corrección de este mismo apartado.** Hasta hoy aquí ponía que hay «cinco escalones para ocho tiers, **así que** dos tiers comparten rareza en tres de los cinco». Ese «así que» no era aritmética: 8 en 5 admite muchas formas, y esa era simplemente la del reparto provisional que corría en el código (1-2 · 3-4 · 5-6 · 7 · 8, escrito en `components/design/v3/sample.ts` para que los bocetos enseñaran los cinco raíles). La forma medida es **2 · 3 · 1 · 1 · 1**, con un solo par compartido. La provisional fallaba en los dos sentidos: juntaba el 5 con el 6 cruzando un salto de +0,55 y separaba el 4 del 5, que van a +0,09 uno de otro.

## 4. Motor de combate *(decidido en lo esencial, 22 de agosto de 2026)*

**"Sin dados" significa rechazar el d20 de [v2](../v2/), no rechazar el azar.** Hay azar, y es **porcentual y oculto**: nunca se muestra un dado. El motivo de que lo haya es propio de un juego de cartas — la incertidumbre es lo que le da palanca a una carta modificadora. Una carta de "+3 al daño" vale siempre exactamente 3, así que no hay decisión; una de "+3 al acierto" solo vale cuando la tirada está en el filo, y reconocer ese momento *es* la habilidad del jugador.

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

Una tirada y dos umbrales: no hay tirada de crítico aparte ni tirada de estado aparte (§4.5). Es monótona —mejor tirada, mejor resultado—, así que **un solo número explica todo lo que pasó**, que es lo que permite depurar un desequilibrio en vez de adivinarlo.

**La banda de acierto es 65–95** *(fijada el 23 de agosto de 2026)*: nunca acierto garantizado, y nunca un 40% que se sienta roto. Treinta puntos de margen que hay que repartir entre los 8 tiers, la cobertura del terreno, 💨 Evasivo y los modificadores de carta — es estrecha a propósito, porque es lo que aguanta el spread de tier 1 contra tier 8 sin que el cruce sea absurdo.

**🍀 Suerte tiene tope 25, y nunca puede pasar de 🎯 Precisión** *(misma fecha)*. El tope existe porque el crítico no solo dobla el daño: también es el que aplica los estados de control (§4.5). Sin techo, crítico y control se desbocan juntos y el objetivo deja de jugar, que es la peor forma de perder. A 25, la ficha más afortunada del juego critica uno de cada cuatro golpes.

**La evasión no es una Habilidad, es la Característica 💨 Evasivo.** Así no hay novena Habilidad ni se toca la fila de ocho del marco de carta, y ser difícil de golpear se decide ficha a ficha en vez de salir de un número que las 132 tienen que llevar y balancear. La cobertura del terreno usa la misma ranura: resta acierto.

**Y la cobertura es hoy una ranura reservada que vale 0** *(24 de agosto de 2026)*: el [tablero de batalla](board/battle.md) §7 decidió que el primer prototipo se juega **a campo abierto**, sin obstáculos, así que no hay nada que la alimente todavía. Se queda en la fórmula a propósito — el día que el campo tenga maleza y rocas, entra ahí sin tocar el motor.

### 4.2 Daño

```
daño = ⚔️ Ataque × (1 − mitigación / 100)
crítico → daño × 2

mitigación = 🛡️ Defensa            si el tipo de daño es 🗡️ o 🏹
             🔮 Resistencia mágica  si el tipo de daño es ✨
```

**⚔️ Ataque es el daño a secas**, no "daño físico" *(cambiado el 23 de agosto de 2026)*. De qué clase es lo dice el [tipo de daño](razas.md#-tipo-de-daño) de la ficha, y de eso depende cuál de los dos números lo frena. Una sola fórmula para los tres tipos: lo único que cambia es el divisor.

**La mitigación es directamente el porcentaje que reduce**: Defensa 30 = "recibo un 30% menos", calculable de cabeza por el jugador y por quien balancea. **Tope 75** *(fijado el 23 de agosto de 2026)* — el muro más duro del juego recibe una cuarta parte; a 100 habría inmunidad, y la inmunidad tiene que ser un rasgo, no un número.

**🗡️ *Perforante* resta 15 puntos** de Defensa antes de dividir *(misma fecha)*. Es un número fijo pero se comporta como anti-tanque solo: contra Defensa 20 apenas mueve el daño (×1,19), contra el tope de 75 lo sube a más de vez y media (×1,60). No hizo falta hacerlo proporcional para eso.

Por qué no `Ataque − Defensa`: con 8 tiers se rompe en los dos extremos —un tier 1 contra un tier 8 da cero o negativo y necesita un parche de "mínimo 1", y el cruce inverso borra— mientras que la versión porcentual **nunca da cero ni infinito** sin ningún caso especial.

**El daño no lleva rango**, a propósito. El azar ya está en el acierto y en el crítico; un tercer punto es el que menos aporta —nadie recuerda haber hecho 11 en vez de 13, pero sí recuerda haber fallado— y así ⚔️ Ataque se queda como **un solo número** en la ficha, que es lo que la carta puede dibujar.

**Y el daño se resta de ❤️ Vida directamente: los PV máximos son el valor de la ficha, sin derivar de nada** *(decidido el 24 de agosto de 2026)*. Se descartó darle una base que el juego multiplicara: eso metería una segunda tabla que balancear encima del ×10 por tier que ya lleva [La escala](razas.md#-la-escala-23-de-agosto-de-2026), y sobre todo haría que el número impreso en la carta no fuera el número de la unidad. Lo que pone, es.

### 4.3 Los tres tipos de daño

Toda ficha lleva **uno y solo uno**, obligatorio y sin defecto. El catálogo está en [razas.md](razas.md#-tipo-de-daño); aquí va lo que hace en combate.

| Tipo | Alcance | Qué lo reduce |
|---|---|---|
| 🗡️ **Cuerpo a cuerpo** | **1** — el hexágono contiguo | 🛡️ Defensa |
| 🏹 **A distancia** | **4** hexágonos | 🛡️ Defensa |
| ✨ **Mágico** | **2** hexágonos | 🔮 Resistencia mágica |

**El alcance es fijo por tipo y es un máximo, no un mínimo** *(23 de agosto de 2026)*. No hay número de alcance en la ficha ni novena Habilidad: el tipo de daño ya lo dice, así que una carta no tiene que imprimirlo. Y **se puede disparar o lanzar magia contra un enemigo pegado, sin penalización** — el alcance limita hasta dónde llegas, no desde dónde; meterse encima de un tirador no lo desarma. *(En [v2](../v2/board/battle.md) sí penalizaba, con "Desventaja"; ese mecanismo ya no existe y no se recupera.)*

**Los tres números dejan de ser provisionales** *(24 de agosto de 2026)*: estaban puestos sobre la geometría heredada a la espera de que el [tablero de batalla](board/battle.md) la confirmara o la moviera. **Y aguantaron que la moviera** *(27 de agosto de 2026)*: el tablero creció a un mínimo de 14×12 —frentes a **11** hexágonos en vez de a 4— y los tres alcances **se quedaron igual**. El motivo es de catálogo y no de tablero: 🗡️ es 1 por definición y las fichas 🗡️ son 70 de las 132, así que escalar el alcance con el ancho del campo solo escala a quien ya llegaba. **Lo que se adapta al tablero es 👢 Movimiento**, y pasa a depender del tipo de daño ([battle.md](board/battle.md) §1.1).

Lo que sale de esos tres números **en un tablero grande**: el 🗡️ cruza el campo y por eso es el que corre; el ✨ avanza a media rienda; y el 🏹 **ya no abre fuego en la ronda 1 sino que espera**, porque avanzar para disparar es ponerse a tiro del que corre. Los dos hexágonos de diferencia entre 🏹 y ✨ siguen siendo deliberados: el canal mágico ya pega contra 🔮 Resistencia mágica, que menos fichas se compran, y son 41 fichas contra 21 — el alcance es lo que le queda al arquero para existir.

> **Y le da un segundo trabajo a 👢 Movimiento, que ya tiene números** *(31 de agosto de 2026)*: **🗡️ 3 · ✨ 2 · 🏹 1**, banda por tipo de daño y primera cifra escrita de las 8 Habilidades ([battle.md](board/battle.md) §1.2, [razas.md](razas.md#-la-escala-23-de-agosto-de-2026)). Con el mismo 👢 para todos el 🏹 dispara y retrocede dando la vuelta al campo, y el 🗡️ tarda **16 rondas comiendo 11 disparos**; con 3 contra 1 son cuatro rondas y un disparo. El reparto es **un requisito de la escala**, no una preferencia — y su argumento se corrigió dos veces antes de quedarse quieto, que está contado en el §1.2 de aquel documento.

**Lo elemental no es un cuarto tipo**: los rasgos 🔥 Fuego, ☠️ Veneno y 🧊 Hielo montan encima del tipo que tenga la ficha. Su daño pasa por 🔮 Resistencia mágica como base, y el rasgo específico —*Resistente al fuego / al veneno / al frío*— resta encima.

**Una carta que haga daño también declara su tipo**, y también obligatorio: ahí el reparto es mitad y mitad, y un hechizo al que se le olvide la marca se convertiría en físico sin que nadie lo note leyendo la carta.

Antes de esto el ⚔️ Ataque era daño *físico* por definición y el mágico lo traía siempre la carta *(retirado el 23 de agosto de 2026)*. Se caía por su propio peso: el 🔮 Mago tenía un número de Ataque que, leído al pie de la letra, era daño físico. Ahora el número es el daño y el tipo dice por dónde entra.

**Una ficha, un ataque: no hay ataque secundario** *(decidido el 24 de agosto de 2026)*. En [v2](../v2/characters/enemies.md) una ficha podía llevar dos opciones —la Araña matriarca tenía mordisco *y* telaraña a alcance 3—; aquí el ataque básico es uno y cualquier otra cosa la hace una **carta**. Dos motivos, y ninguno es de gusto: el motor se queda con una sola fórmula sin ramas, y la carta no necesita un segundo bloque de ataque, que es sitio que el pie no tiene. **El precio se acepta y es el mismo que ya estaba anotado**: un golpe cuerpo a cuerpo que haga daño mágico —el ✝️ Paladín, el 🐲 Dracónido ancestral— no se puede expresar en la ficha, porque el alcance y el canal viajan juntos en un valor único. Lo resuelve una carta, y si algún día resulta que no basta, la salida sigue siendo partir el campo en dos ejes y no añadirle un segundo ataque a las 132.

### 4.4 El hechizo no tira para acertar; el ataque básico sí, siempre

**La línea se traza por origen, no por tipo de daño** *(precisado el 23 de agosto de 2026)*:

| Origen | ¿Tira? |
|---|---|
| **Hechizo** — lo que viene de una carta | **No.** Siempre entra; solo lo reduce 🔮 Resistencia mágica |
| **Ataque básico** — la acción de tablero | **Sí**, siempre, sea 🗡️, 🏹 o ✨ |

El motivo es el del §4.1 aplicado al revés: el ataque básico es gratis, así que puede permitirse fallar; un hechizo cuesta una **carta**, y perder una carta a un fallo en seco es la peor sensación que el juego puede dar.

Cortar por origen y no por tipo es lo que mantiene sano el reparto de fichas: si el ataque básico ✨ no tirase, las **41 fichas mágicas** dejarían de usar 🎯 Precisión y serían gratis mejores que las 21 de 🏹, que hacen lo mismo y sí fallan. Así 🎯 Precisión vale para las 132 y el §4.1 no tiene excepciones.

Queda una asimetría deliberada: **el ataque básico es barato y variable, el hechizo es caro y fiable.**

### 4.5 Estados

Los aplica el impacto, y **no todos entran igual** — porque el catálogo de [razas.md](razas.md) ya distinguía los dos casos sin decirlo:

- **Elementales: siempre.** 🔥 Fuego, ☠️ Veneno y 🧊 Hielo dicen *"el daño elemental aplica X"*, sin probabilidad ninguna. Al impactar, aplican. Un dragón que a veces no quema se sentiría roto.
- **Control: lo aplica el crítico.** 💫 Aturdimiento y 🌀 Confusión dicen *"tiene una probabilidad de"*, y esa probabilidad **es 🍀 Suerte** *(fijado el 23 de agosto de 2026)*. No hay tercer umbral ni número nuevo por rasgo: si llevas el rasgo, tu crítico además controla. Es literalmente lo que ya decía este apartado —*un golpe sólido es el que aturde*— pero sin maquinaria detrás, y por eso 🍀 Suerte tiene ahora tope 25 (§4.1).

  😱 **Miedo es la excepción, y no por capricho**: no cuelga de la tirada, sino de bajar de media Vida por primera vez en el combate. Es un disparador de estado, no un efecto del golpe.

El catálogo de estados en sí —qué hace cada uno, duración, acumulación, cómo se quitan— vive en [effects.md](effects.md). El pendiente que heredaba de aquí —**tres entradas diciendo "no puede actuar"** (😵 Aturdido, 🧊 Congelación a pila llena y 😱 Miedo)— quedó **deshecho** en [effects.md §5.1](effects.md): 😱 Miedo no es un estado sino el segundo disparador de 😵 Aturdido, y 🧊 Congelación se distingue porque además clava el Movimiento y viene acumulando.

### 4.6 Iniciativa

⚡ Iniciativa determina el orden de actuación y nada más — no tiene nada que ver con esquivar. **Es propiedad fija de la ficha: ningún estado la altera** *(decidido)*. Si algún día pide uno, se añade entonces; hoy no tendría sentido.

**Los empates los rompe 🍀 Suerte, y si también empata, azar** *(decidido el 24 de agosto de 2026)*:

```
orden = ⚡ Iniciativa, de mayor a menor
        empate → 🍀 Suerte, de mayor a menor
        empate → azar
```

Hacían falta: ⚡ Iniciativa es un entero pequeño y en el tablero hay **cinco fichas por jugador** —su héroe y hasta 4 unidades, [battle.md](board/battle.md) §2—, así que con tres jugadores son **quince por bando y treinta en total**, todas en **una sola lista entrelazada** (§4 de ese documento). Los empates no son el caso raro sino el normal, y con treinta fichas son casi todos. Se resuelve con una Habilidad que ya existe —*quien tiene más suerte actúa antes* se explica solo— y así **no entra ningún número nuevo en la ficha ni en el marco**. El azar del final es la red: con 🍀 Suerte topada en 25, los empates dobles también van a pasar.

Y hay que decirlo: **🍀 Suerte pasa a hacer cuatro cosas** —umbral de crítico (§4.1), entrada de los estados de control (§4.5), salida temprana de un estado ([effects.md](effects.md) §2) y ahora desempate—. Las cuatro son la misma idea *(la tirada te sonríe)*, pero su tope de 25 se fijó cuando hacía dos: **si al balancear resulta que Suerte es la Habilidad que más pesa, este es el sitio donde mirar primero**. El desempate es el uso más barato de los cuatro, porque es una comparación y no una probabilidad.

### 4.7 Lo que sigue por definir

- **Los valores numéricos de las 8 Habilidades.** Insumo pendiente; no se inventan. La escala en la que van sí está cerrada ([razas.md](razas.md#-la-escala-23-de-agosto-de-2026)).

## 5. Resolución fuera de combate

*Por definir.* Pruebas de habilidad en el tablero de exploración, rango de visión y cualquier otra resolución que no sea un ataque.

## 6. Turno y economía de cartas

*Por definir.* Estructura del turno, acciones disponibles, tamaño de mazo, mano y coste de jugar una carta.

## 7. Economía y recompensas

*Por definir.* Oro, loot, tabla de recompensas y qué se puede comprar.

## 8. Balance

*Por definir.* Método de balance y objetivos numéricos. Nada de V3 está balanceado todavía.
