# Razas

Las razas son el eje del diseño de V3: cada una aporta sus clases jugables, su progresión de unidades y su identidad. De ellas cuelga todo lo demás.

Este documento define cinco cosas, en este orden:

1. **Las razas y sus clases** — 5 razas base y 6 de DLC, con 4 clases cada una.
2. **Las 8 Habilidades** — las estadísticas numéricas de cualquier personaje, sea héroe, unidad o enemigo.
3. **El tipo de daño** — el campo obligatorio que llevan las 132 fichas.
4. **El catálogo de Características** — los rasgos con nombre fijo que se reparten entre las fichas.
5. **Las unidades** — la progresión de 8 por raza, con su tipo de daño y sus Características.

> **Los valores numéricos de las Habilidades no están aquí**: siguen pendientes. Lo que sí está cerrado es la asignación de Características, tanto para héroes como para unidades, de las 11 razas — y, desde el 23 de agosto de 2026, **la escala** en la que van los números y **la curva por tier** (ver [La escala](#-la-escala-23-de-agosto-de-2026)).

Las decisiones de rumbo que enmarcan este documento —los dos tableros, qué tipos de carta desaparecen, cómo funciona la progresión— viven en [game-design.md](game-design.md). Lo que falta por decidir está en [status.md](status.md).

## 🧙‍♂️ Razas y clases

### 👤 Humanos
- ⚔️ **Guerrero** — Tanque / combate cuerpo a cuerpo
- 🔮 **Mago** — Daño mágico / control
- ✝️ **Sacerdote** — Curación / apoyo
- 🏹 **Arquero** — Daño a distancia

### ⛏️ Enanos
- ⚔️ **Guerrero** — Tanque / combate cuerpo a cuerpo
- ⚙️ **Ingeniero** — Trampas / armas / artefactos
- 🪓 **Berserker** — Daño cuerpo a cuerpo / furia
- 🔯 **Maestro de runas** — Magia rúnica / mejoras / protección

### 💀 No-muertos
- ⚔️ **Guerrero** — Tanque / resistencia
- 💀 **Nigromante** — Invocación / control
- 🩸 **Vampiro** — Robo de vida / movilidad
- ☠️ **Liche** — Magia oscura / daño mágico

### 🔥 Demonios infernales
- ⚔️ **Guerrero** — Tanque / daño cuerpo a cuerpo
- 🧙 **Brujo** — Maldiciones / daño mágico
- 🔥 **Inquisidor infernal** — Debuffs / tortura / control
- 👹 **Señor demoníaco** — Fuego / daño masivo

### 🧝 Elfos
- 🏹 **Guardabosques** — Daño a distancia / naturaleza
- 🌿 **Druida** — Curación / transformación / naturaleza
- ✨ **Hechicero** — Magia elemental / control
- 🗡️ **Asesino** — Movilidad / crítico

## 📦 Primer DLC — Orkos & Feéricos

### 🧟 Orkos
- 🪓 **Bárbaro** — Daño cuerpo a cuerpo / furia / cuanto menos Vida, más peligroso
- 🛡️ **Jefe de guerra** — Tanque / liderazgo / bonificaciones a aliados
- 🔮 **Chamán** — Magia espiritual / maldiciones / apoyo
- 🏹 **Cazador** — Daño a distancia / trampas / rastreo

### 🧚 Feéricos
- 💫 **Hechicero feérico** — Magia / control / ilusiones
- 🦋 **Ilusionista** — Clones / confusión / engaño
- 🧚 **Hada** — Volador / apoyo / evasión / magia
- 🗡️ **Danzante de hojas** — Movilidad / críticos / ataques rápidos

## 📦 Segundo DLC — Dracónidos & Hombres rata

### 🐉 Dracónidos
- 🐲 **Caballero dragón** — Tanque / combate cuerpo a cuerpo / resistencia elemental
- 🔥 **Piromante** — Daño de fuego / daño de área / Quemadura
- 🐲 **Dracoguerrero** — Movilidad / Volador / ataques físicos
- 🌟 **Oráculo dracónico** — Magia / apoyo / control

### 🐀 Hombres rata
- 🗡️ **Asaltante** — Movilidad / emboscadas / crítico
- ☠️ **Alquimista** — Veneno / pociones / daño de área
- 🐀 **Señor de la plaga** — Enfermedades / debilitaciones / control
- ⚙️ **Maquinista** — Trampas / artefactos / armas experimentales

## 📦 Tercer DLC — Constructos & Abisales

### 🤖 Constructos
- ⚔️ **Autómata de guerra** — Tanque / combate cuerpo a cuerpo / resistencia
- 🏹 **Cañonero** — Daño a distancia / ataques pesados / perforación
- ⚙️ **Ingeniero arcano** — Artefactos / mejoras / reparación
- 🔮 **Gólem rúnico** — Magia rúnica / defensa / control

### 🧜 Abisales
- 🔱 **Guardián de las profundidades** — Tanque / resistencia / combate cuerpo a cuerpo
- 🐙 **Invocador abisal** — Invocación / tentáculos / control
- 🌊 **Brujo de las mareas** — Magia de agua / control / daño de área
- 🧠 **Devoramentes** — Control mental / debilitaciones / robo de habilidades

## Habilidades de los personajes

- ❤️ **Vida (HP)** — Cuánto daño puede recibir.
- ⚔️ **Ataque** — **Cuánto daño inflige.** No dice de qué tipo: eso lo dice el campo [Tipo de daño](#-tipo-de-daño), y de él depende qué lo reduce.
- 🛡️ **Defensa** — Reduce el daño físico recibido (🗡️ y 🏹).
- 🔮 **Resistencia mágica** — Reduce el daño mágico recibido (✨).
- 🎯 **Precisión** — Probabilidad de acertar ataques.
- 🍀 **Suerte** — Probabilidad de golpes críticos, de librarse de un estado antes de tiempo, y **desempate de ⚡ Iniciativa**.
- ⚡ **Iniciativa** — Determina el orden de actuación; los empates los rompe 🍀 Suerte.
- 👢 **Movimiento** — Determina la distancia de recorrido en el mapa.

### 📏 La escala *(23 de agosto de 2026)*

**Las ocho no viven en la misma escala**, y eso no es un descuido: cuatro son
umbrales o porcentajes que el motor ya acota, y solo dos son cantidades libres.

| Habilidad | Qué es el número | Rango |
|---|---|---|
| ❤️ **Vida** | Los PV máximos, sin derivar de nada | **2–3 cifras** |
| ⚔️ **Ataque** | Daño por golpe | **1–2 cifras** |
| 🛡️ **Defensa** | % que reduce | 0 – **75** |
| 🔮 **Resistencia mágica** | % que reduce | 0 – **75** |
| 🎯 **Precisión** | Umbral de acierto sobre 1..100 | **65 – 95** |
| 🍀 **Suerte** | Umbral de crítico sobre 1..100 | 0 – **25**, y nunca por encima de 🎯 Precisión |
| ⚡ **Iniciativa** | Orden de actuación | Sin escala propia: solo se compara |
| 👢 **Movimiento** | Hexágonos por turno | Entero pequeño, **en tres bandas según el tipo de daño** *(27-ago-2026)*: 🗡️ la más alta, ✨ media, 🏹 la más baja — es lo que rompe el bucle del arquero que dispara y retrocede ([battle.md](board/battle.md) §1.2) |

**Solo ❤️ Vida y ⚔️ Ataque crecen con el tier**, y crecen **×10 de tier 1 a
tier 8** — unos **×1,4 por escalón**:

| Tier | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| **× la base** | 1 | 1,4 | 1,9 | 2,7 | 3,7 | 5,2 | 7,2 | **10** |

Las otras seis están topadas o no escalan, así que un tier 8 no es un tier 1
multiplicado: pega y aguanta diez veces más, pero **no acierta diez veces
mejor**. Eso es lo que deja que un tier 1 siga arañando a un tier 8 sin ningún
caso especial —la mitigación es porcentual y nunca da cero
([game-design.md](game-design.md) §4.2)— y lo que hace que la mayoría de los
números de las 132 fichas se muevan en márgenes estrechos y comparables.

**Y el tier es el único eje de las unidades** *(24 de agosto de 2026)*: una unidad
no sube —es más fuerte porque es *otra* unidad—, y la **Rareza de su carta
sale del tier** en vez de ser un dato aparte. Los ocho escalones de esta tabla son,
por tanto, **toda la curva de potencia que tiene una raza**: no hay ningún otro eje
que suba a nadie ([game-design.md](game-design.md) §3).

> **Los valores concretos siguen siendo insumo pendiente.** Lo que está cerrado
> es la escala en la que van, no las 1.056 cifras.

## 🎲 Tipo de daño

**Campo obligatorio de toda ficha, uno y solo uno.** Las 8 Habilidades dicen
*cuánto* daño hace un personaje; este campo dice **de qué clase es**, que es lo
que decide contra qué número se resta.

| Valor | Qué significa | Alcance | Qué lo reduce |
|---|---|---|---|
| 🗡️ **Cuerpo a cuerpo** | Golpea con un arma de contacto | **1** — el hexágono contiguo | 🛡️ Defensa |
| 🏹 **A distancia** | Dispara un proyectil | **4** hexágonos | 🛡️ Defensa |
| ✨ **Mágico** | Su ataque básico es magia | **2** hexágonos | 🔮 Resistencia mágica |

**El alcance es fijo por tipo** *(23 de agosto de 2026)*: ni un número por ficha
ni una novena Habilidad. Lo dice el tipo y no hay nada más que consultar. Se mide
en hexágonos del tablero de batalla, y **es un máximo, no un mínimo** — se puede
disparar o lanzar magia contra un enemigo pegado a ti, sin penalización. Fijo no
es intocable: una carta o una Característica puede sumarle. Lo que hacen en
combate está en [game-design.md](game-design.md) §4.3.

**Y los tres números ya no son provisionales** *(24 de agosto de 2026)*: estaban
puestos sobre la geometría heredada, a la espera de que el
[tablero de batalla](board/battle.md) la confirmara o la moviera. **La movió, y
aguantaron** *(27 de agosto de 2026)*: el tablero pasó a ser grande —mínimo
14×12, frentes a 11 hexágonos en vez de a 4— y los tres alcances **se quedaron
igual**, porque 🗡️ es 1 por definición y son 70 de las 132 fichas: escalar el
alcance solo escala a quien ya llegaba. Lo que se adaptó es **👢 Movimiento**, en
tres bandas por tipo de daño (ver la escala). Y con el campo grande el 🏹 cambia
de trabajo: ya no abre la batalla en la ronda 1, la espera quieto.

**No es una Característica, es un campo.** Las Características son la excepción
—lo que hace rara a esta ficha— y en la carta se dibujan como una fila de glifos
sin texto; un rasgo que llevan las 132 no informa de nada ahí y gastaría un hueco
de los cinco. Por eso el tipo de daño **se dibuja en el sitio del icono ⚔️ del
Ataque**: el glifo que acompaña al número es 🗡️, 🏹 o ✨ según el caso. Cero
espacio nuevo en el marco, y el jugador lee de un golpe cuánto pega y de qué
manera.

De ahí que **✨ *Ataque mágico* y 🏹 *Ataque a distancia* dejen de ser
Características** y salgan del catálogo: eran este campo disfrazado de rasgo.

**Lo elemental no es un cuarto valor.** 🔥 Fuego, ☠️ Veneno y 🧊 Hielo siguen
siendo Características, y montan *encima* del tipo que tenga la ficha: un
🐉 Dragón dorado es 🗡️ Cuerpo a cuerpo y además quema.

**Reparto actual: 70 🗡️ · 21 🏹 · 41 ✨.**

> **Lo que este campo no puede decir, y se acepta:** un ataque cuerpo a cuerpo
> que haga daño mágico —un paladín que golpea con daño sagrado, un dracónido que
> muerde con fuego arcano—. Al ser un valor único, alcance y canal viajan juntos:
> ✨ implica que llega de lejos —y ahora, además, a exactamente 2 hexágonos—. Si
> algún día una ficha lo necesita de verdad, la salida es partir el campo en dos
> (alcance × canal), no añadir un cuarto valor.

## ✨ Características de los personajes

### ⚔️ Ofensivas
- 💥 **Golpe crítico** — Tiene una probabilidad de infligir daño aumentado al atacar.
- 🩸 **Hemorragia** — Los ataques aplican Sangrado, que inflige daño físico adicional al final de cada turno durante X turnos.
- 💫 **Aturdimiento** — Los ataques tienen una probabilidad de impedir que el objetivo actúe durante 1 turno.
- 🗡️ **Perforante** — Ignora una parte de la Defensa del enemigo.
- 💣 **Explosivo** — Al impactar, inflige parte del daño a los enemigos cercanos.
- 🧛 **Robo de vida** — Recupera un porcentaje del daño infligido como Vida.

### 🌪️ Elementales y estados alterados
- 🔥 **Fuego** — El daño elemental aplica Quemadura, que inflige daño adicional al final de cada turno durante X turnos.
- ☠️ **Veneno** — El daño elemental aplica Envenenamiento, que inflige daño adicional al final de cada turno durante X turnos.
- 🧊 **Hielo** — El daño elemental aplica Congelación, que reduce el Movimiento y, al acumularse, impide que el objetivo actúe.
- 🌑 **Ceguera** — Reduce considerablemente la Precisión del objetivo.
- 🕸️ **Inmovilización** — Impide utilizar Movimiento durante X turnos, pero el objetivo sigue pudiendo actuar desde donde está.
- 🐌 **Lentitud** — Reduce el Movimiento del objetivo.
- 🌀 **Confusión** — Existe una probabilidad de que el personaje no pueda controlar correctamente su acción.
- 😵 **Aturdido** — El personaje pierde su próximo turno.
- 😱 **Miedo** — Cuando el objetivo pierde por primera vez la mitad de su Vida, tiene una probabilidad de quedar Aturdido durante 1 turno.

### 🛡️ Resistencias e inmunidades
- 🛡️ **Resistente al daño físico** — Reduce el daño recibido de ataques físicos.
- 💨 **Evasivo** — Es difícil de golpear: resta Precisión a quien lo ataca.
- 🔥 **Resistente al fuego** — Recibe una cantidad reducida de daño de fuego y tiene mayor resistencia a Quemadura.
- ☠️ **Resistente al veneno** — Recibe una cantidad reducida de daño de veneno y tiene mayor resistencia a Envenenamiento.
- 🧊 **Resistente al frío** — Recibe una cantidad reducida de daño de frío y tiene mayor resistencia a Congelación.
- 😱 **Inmune al miedo** — No puede verse afectado por Miedo.
- 🔥 **Inmune al fuego** — No recibe daño ni efectos de Quemadura.
- ☠️ **Inmune al veneno** — No recibe daño ni efectos de Envenenamiento.
- 🧊 **Inmune al frío** — No recibe daño ni efectos de Congelación.
- 🧪 **Inmune a estados alterados** — No puede sufrir los estados de **control** (Ceguera, Lentitud, Inmovilización, Aturdido, Confusión). Los elementales —Quemadura, Envenenamiento, Congelación— y Sangrado **sí le entran**: para esos están los rasgos *Inmune al fuego / al veneno / al frío*.
- 🧿 **Inmune a la magia** — No puede verse afectado por determinados hechizos o efectos mágicos.

### 💚 Supervivencia
- 💚 **Regeneración** — Recupera una cantidad de Vida al final de cada turno.
- 🕯️ **Inmortal** — Al recibir daño letal, sobrevive con 1 de Vida una vez por combate.
- 👻 **Resurrección** — Puede regresar a la vida después de morir una sola vez.
- 😤 **Último aliento** — Al quedar por debajo de un porcentaje de Vida, obtiene temporalmente una bonificación de daño.

> **El canal ya no vive aquí.** Este apartado tuvo un bloque «🔮 Magia» con un
> solo rasgo, ✨ *Ataque mágico*, que duró un día: era el [Tipo de
> daño](#-tipo-de-daño) disfrazado de Característica, y desde el 23 de agosto de
> 2026 es campo de ficha. Lo mismo con 🏹 *Ataque a distancia*, que estaba en
> Ofensivas.
>
> Antes de eso hubo **tres entradas para un concepto**: 🔮 Resistencia mágica como
> Habilidad, 🔮 Resistencia mágica como Característica, y ✨ *Resistente a la
> magia*. Las dos Características eran redundantes —si todo el mundo tiene un
> número de Resistencia mágica, "reduce el daño mágico recibido" ya lo dice ese
> número— y se retiraron. El catálogo estaba usando un rasgo **defensivo** como
> taquigrafía de "este personaje es mágico": el 🔮 Mago tenía por rol *"daño
> mágico / control"* y sus dos únicas Características decían que *resiste* la
> magia. Le pasaba a ~25 fichas.
>
> 🧿 *Inmune a la magia* **sí se queda**, y por un motivo mecánico: la Habilidad
> está topada, así que la inmunidad total es algo que el porcentaje no puede
> expresar.

### 🦅 Movimiento y terreno
- 🦅 **Volador** — Ignora obstáculos del mapa durante el movimiento, pero no puede atravesar enemigos.
- 🐾 **Ágil** — Puede atravesar determinadas casillas u obstáculos que otras criaturas no pueden.
- 🌊 **Anfibio** — Puede desplazarse por agua sin penalización.
- 🌲 **Explorador** — No recibe penalizaciones de determinados terrenos.

### 🧠 Percepción y comportamiento
- 👁️ **Percepción** — Tiene mayor facilidad para detectar enemigos ocultos, trampas y elementos ocultos.
- 🗣️ **Provocación** — Puede obligar a determinados enemigos a atacarlo.
- 👑 **Líder** — Proporciona una bonificación a determinados aliados cercanos.
- 🐺 **Bestia** — Puede interactuar con determinadas habilidades, efectos o terrenos relacionados con criaturas.
- 🤖 **Constructo** — No se ve afectado por determinados estados mentales o biológicos.
- 💀 **No-muerto** — Es inmune al miedo y puede tener interacciones especiales con efectos de curación, veneno y habilidades sagradas.
- 😈 **Demonio** — Tiene interacciones especiales con fuego, magia infernal y habilidades sagradas.

## 🦸 Tabla de características de héroes

| Raza | Héroe | Tipo de daño | Características |
|---|---|---|---|
| 👤 Humanos | ⚔️ Guerrero | 🗡️ Cuerpo a cuerpo | 🛡️ Resistente al daño físico · 😱 Inmune al miedo · 😤 Último aliento |
| 👤 Humanos | 🔮 Mago | ✨ Mágico | 🧊 Resistente al frío |
| 👤 Humanos | ✝️ Sacerdote | ✨ Mágico | 😱 Inmune al miedo |
| 👤 Humanos | 🏹 Arquero | 🏹 A distancia | 👁️ Percepción · 💥 Golpe crítico |
| ⛏️ Enanos | ⚔️ Guerrero | 🗡️ Cuerpo a cuerpo | 🛡️ Resistente al daño físico · 😤 Último aliento |
| ⛏️ Enanos | ⚙️ Ingeniero | 🏹 A distancia | 👁️ Percepción · 🤖 Constructo |
| ⛏️ Enanos | 🪓 Berserker | 🗡️ Cuerpo a cuerpo | 💥 Golpe crítico · 🩸 Hemorragia · 😤 Último aliento |
| ⛏️ Enanos | 🔯 Maestro de runas | ✨ Mágico | 🛡️ Resistente al daño físico |
| 💀 No-muertos | ⚔️ Guerrero | 🗡️ Cuerpo a cuerpo | 💀 No-muerto · 🛡️ Resistente al daño físico · ☠️ Inmune al veneno |
| 💀 No-muertos | 💀 Nigromante | ✨ Mágico | 💀 No-muerto |
| 💀 No-muertos | 🩸 Vampiro | 🗡️ Cuerpo a cuerpo | 💀 No-muerto · 🧛 Robo de vida · 🐾 Ágil |
| 💀 No-muertos | ☠️ Liche | ✨ Mágico | 💀 No-muerto · ☠️ Inmune al veneno |
| 🔥 Demonios infernales | ⚔️ Guerrero | 🗡️ Cuerpo a cuerpo | 😈 Demonio · 🔥 Resistente al fuego · 🛡️ Resistente al daño físico |
| 🔥 Demonios infernales | 🧙 Brujo | ✨ Mágico | 😈 Demonio · 🔥 Resistente al fuego |
| 🔥 Demonios infernales | 🔥 Inquisidor infernal | ✨ Mágico | 😈 Demonio · 🔥 Resistente al fuego · 😱 Inmune al miedo |
| 🔥 Demonios infernales | 👹 Señor demoníaco | 🗡️ Cuerpo a cuerpo | 😈 Demonio · 🔥 Fuego · 🔥 Inmune al fuego |
| 🧝 Elfos | 🌲 Guardabosques | 🏹 A distancia | 👁️ Percepción · 🌲 Explorador |
| 🧝 Elfos | 🌿 Druida | ✨ Mágico | 🌲 Explorador · 🧪 Inmune a estados alterados |
| 🧝 Elfos | ✨ Hechicero | ✨ Mágico | 🐾 Ágil |
| 🧝 Elfos | 🗡️ Asesino | 🗡️ Cuerpo a cuerpo | 🐾 Ágil · 💥 Golpe crítico · 🩸 Hemorragia |
| 🧟 Orkos | 🪓 Bárbaro | 🗡️ Cuerpo a cuerpo | 💥 Golpe crítico · 🩸 Hemorragia · 😤 Último aliento |
| 🧟 Orkos | 🛡️ Jefe de guerra | 🗡️ Cuerpo a cuerpo | 🛡️ Resistente al daño físico · 😱 Inmune al miedo · 👑 Líder |
| 🧟 Orkos | 🔮 Chamán | ✨ Mágico | 😱 Inmune al miedo |
| 🧟 Orkos | 🏹 Cazador | 🏹 A distancia | 👁️ Percepción · 🐺 Bestia |
| 🧚 Feéricos | 💫 Hechicero feérico | ✨ Mágico | 🐾 Ágil · 🌀 Confusión |
| 🧚 Feéricos | 🦋 Ilusionista | ✨ Mágico | 🐾 Ágil · 🌀 Confusión · 👁️ Percepción |
| 🧚 Feéricos | 🧚 Hada | ✨ Mágico | 🦅 Volador · 🐾 Ágil · 🧪 Inmune a estados alterados |
| 🧚 Feéricos | 🗡️ Danzante de hojas | 🗡️ Cuerpo a cuerpo | 🐾 Ágil · 💥 Golpe crítico · 🩸 Hemorragia |
| 🐉 Dracónidos | 🐲 Caballero dragón | 🗡️ Cuerpo a cuerpo | 🛡️ Resistente al daño físico · 🔥 Resistente al fuego · 😱 Inmune al miedo |
| 🐉 Dracónidos | 🔥 Piromante | ✨ Mágico | 🔥 Fuego · 🔥 Resistente al fuego |
| 🐉 Dracónidos | 🐲 Dracoguerrero | 🗡️ Cuerpo a cuerpo | 🦅 Volador · 🔥 Resistente al fuego · 🛡️ Resistente al daño físico |
| 🐉 Dracónidos | 🌟 Oráculo dracónico | ✨ Mágico | 🔥 Resistente al fuego · 😱 Inmune al miedo |
| 🐀 Hombres rata | 🗡️ Asaltante | 🗡️ Cuerpo a cuerpo | 🐾 Ágil · 💥 Golpe crítico · 🩸 Hemorragia |
| 🐀 Hombres rata | ☠️ Alquimista | 🏹 A distancia | ☠️ Resistente al veneno · ☠️ Inmune al veneno |
| 🐀 Hombres rata | 🐀 Señor de la plaga | ✨ Mágico | ☠️ Inmune al veneno · 🧪 Inmune a estados alterados · 🩸 Hemorragia |
| 🐀 Hombres rata | ⚙️ Maquinista | 🏹 A distancia | 👁️ Percepción · 🐾 Ágil |
| 🤖 Constructos | ⚔️ Autómata de guerra | 🗡️ Cuerpo a cuerpo | 🤖 Constructo · 🛡️ Resistente al daño físico · 🧪 Inmune a estados alterados |
| 🤖 Constructos | 🏹 Cañonero | 🏹 A distancia | 🤖 Constructo · 🗡️ Perforante |
| 🤖 Constructos | ⚙️ Ingeniero arcano | ✨ Mágico | 🤖 Constructo · 👁️ Percepción |
| 🤖 Constructos | 🔮 Gólem rúnico | ✨ Mágico | 🤖 Constructo · 🧪 Inmune a estados alterados |
| 🧜 Abisales | 🔱 Guardián de las profundidades | 🗡️ Cuerpo a cuerpo | 🛡️ Resistente al daño físico · 🌊 Anfibio · 🧊 Resistente al frío |
| 🧜 Abisales | 🐙 Invocador abisal | ✨ Mágico | 🌊 Anfibio · 🧪 Inmune a estados alterados |
| 🧜 Abisales | 🌊 Brujo de las mareas | ✨ Mágico | 🌊 Anfibio · 🐾 Ágil |
| 🧜 Abisales | 🧠 Devoramentes | ✨ Mágico | 🌊 Anfibio · 🌀 Confusión · 💫 Aturdimiento |

## Unidades

### 👤 Humanos — Progresión de unidades
- 🗡️ **Miliciano** — Infantería básica / cuerpo a cuerpo
- 🏹 **Arquero** — Daño a distancia
- 🛡️ **Caballero** — Tanque / combate cuerpo a cuerpo
- 🔮 **Mago** — Daño mágico / control
- 🐎 **Caballería** — Movilidad / carga / combate cuerpo a cuerpo
- 🦅 **Grifo** — Criatura voladora / ataque
- ✝️ **Paladín** — Tanque / apoyo / daño sagrado
- 🐉 **Dragón dorado** — Criatura legendaria / daño masivo

### ⛏️ Enanos — Progresión de unidades
- ⛏️ **Minero** — Infantería básica / combate cuerpo a cuerpo
- 🪓 **Guerrero enano** — Defensa / combate cuerpo a cuerpo
- 🔨 **Herrero de guerra** — Tanque / armas pesadas
- ⚙️ **Ingeniero** — Trampas / armas / artefactos
- 🔫 **Mosquetero** — Daño a distancia / perforación
- 🛡️ **Guardia de hierro** — Tanque / resistencia extrema
- 🗿 **Gólem de piedra** — Criatura constructo / tanque / resistencia
- ⛰️ **Coloso de adamantita** — Criatura legendaria / daño masivo / resistencia extrema

### 💀 No-muertos — Progresión de unidades
- 🦴 **Esqueleto** — Infantería básica / cuerpo a cuerpo
- 🏹 **Arquero esqueleto** — Daño a distancia
- 🧟 **Necrófago** — Movilidad / ataque cuerpo a cuerpo
- 💀 **Guerrero esquelético** — Defensa / resistencia
- 🧙 **Nigromante** — Invocación / control
- 🧛 **Vampiro** — Movilidad / robo de vida
- ☠️ **Abominación** — Criatura no-muerta / daño masivo / resistencia
- 🐉 **Dragón esquelético** — Criatura legendaria / volador / daño masivo

### 🔥 Demonios infernales — Progresión de unidades
- 👿 **Diablillo** — Hostigamiento / magia menor
- 🗡️ **Guerrero infernal** — Combate cuerpo a cuerpo / daño
- 🔥 **Sabueso infernal** — Movilidad / fuego / persecución
- 😈 **Demonio de batalla** — Daño cuerpo a cuerpo / resistencia
- 🧙 **Brujo infernal** — Maldiciones / magia oscura
- 🔥 **Demonio de fuego** — Daño elemental / Quemadura / área
- 👹 **Señor demoníaco** — Élite / daño masivo / control
- 😈 **Balor** — Criatura legendaria / fuego / daño masivo

### 🧝 Elfos — Progresión de unidades
- 🏹 **Explorador** — Exploración / ataque a distancia
- 🗡️ **Guerrero élfico** — Combate cuerpo a cuerpo / velocidad
- 🏹 **Arquero élfico** — Daño a distancia / precisión
- 🌿 **Druida** — Curación / naturaleza / apoyo
- 🗡️ **Asesino élfico** — Crítico / movilidad
- 🧙 **Hechicero élfico** — Magia elemental / control
- 🦄 **Unicornio** — Criatura mágica / movilidad / apoyo
- 🌳 **Ent ancestral** — Criatura legendaria / naturaleza / resistencia

### 🧟 Orkos — Progresión de unidades
- 🪓 **Guerrero orko** — Infantería básica / cuerpo a cuerpo
- 🏹 **Cazador orko** — Daño a distancia / rastreo
- 🪓 **Bárbaro** — Daño cuerpo a cuerpo / furia
- 🐗 **Jinete de jabalí** — Movilidad / carga / combate cuerpo a cuerpo
- 🔮 **Chamán** — Magia espiritual / maldiciones / apoyo
- 🩸 **Carnicero** — Daño masivo / hemorragia / ejecución
- 🗿 **Troll de guerra** — Criatura / regeneración / resistencia
- 👹 **Gigante orko** — Criatura legendaria / daño masivo / resistencia

### 🧚 Feéricos — Progresión de unidades
- 🍄 **Duende feérico** — Hostigamiento / movilidad / engaño
- 🏹 **Arquero feérico** — Daño a distancia / precisión
- 🧚 **Hada** — Volador / apoyo / evasión
- 🗡️ **Danzante de hojas** — Movilidad / críticos / ataques rápidos
- 🦋 **Ilusionista** — Clones / confusión / engaño
- 🌙 **Encantador** — Control mental / sueño / debilitaciones
- 🦌 **Ciervo feérico** — Criatura mágica / movilidad / naturaleza
- 🐉 **Dragón feérico** — Criatura legendaria / volador / magia / ilusiones

### 🐉 Dracónidos — Progresión de unidades
- 🗡️ **Guerrero dracónido** — Combate cuerpo a cuerpo / resistencia
- 🏹 **Cazador dracónido** — Daño a distancia / precisión
- 🛡️ **Caballero dracónido** — Tanque / resistencia elemental
- 🔥 **Piromante** — Magia de fuego / Quemadura / área
- 🐲 **Dracoguerrero** — Movilidad / combate aéreo / daño físico
- 🐲 **Dracónido ancestral** — Élite / magia elemental / resistencia
- 🐉 **Joven dragón** — Criatura / volador / elemento
- 🐉 **Dragón ancestral** — Criatura legendaria / daño masivo / resistencia elemental

### 🐀 Hombres rata — Progresión de unidades
- 🐀 **Rata de alcantarilla** — Infantería básica / hostigamiento
- 🗡️ **Asaltante** — Movilidad / emboscadas / crítico
- 🏹 **Tirador de plaga** — Daño a distancia / veneno
- ☠️ **Alquimista** — Veneno / pociones / daño de área
- ⚙️ **Maquinista** — Trampas / artefactos / armas experimentales
- 🐀 **Señor de la plaga** — Enfermedades / debilitaciones / control
- 🐀 **Rata ogro** — Criatura / fuerza / resistencia
- 🧪 **Abominación de plaga** — Criatura legendaria / veneno / daño de área

### 🤖 Constructos — Progresión de unidades
- ⚙️ **Autómata** — Infantería básica / combate cuerpo a cuerpo
- 🛡️ **Guardián mecánico** — Defensa / protección
- 🏹 **Cañonero** — Daño a distancia / ataques pesados
- ⚙️ **Ingeniero arcano** — Artefactos / mejoras / reparación
- 🗡️ **Autómata de guerra** — Combate cuerpo a cuerpo / perforación
- 🔮 **Gólem rúnico** — Magia rúnica / defensa / control
- 🗿 **Gólem de guerra** — Criatura constructo / tanque / resistencia
- ⚙️ **Coloso mecánico** — Criatura legendaria / daño masivo / resistencia extrema

### 🧜 Abisales — Progresión de unidades
- 🐟 **Merodeador abisal** — Hostigamiento / combate cuerpo a cuerpo
- 🔱 **Guerrero de las profundidades** — Combate cuerpo a cuerpo / resistencia
- 🏹 **Cazador abisal** — Daño a distancia / arpón / control
- 🌊 **Brujo de las mareas** — Magia de agua / control / área
- 🐙 **Invocador abisal** — Invocación / tentáculos / control
- 🧠 **Devoramentes** — Control mental / debilitaciones
- 🦑 **Horror de las profundidades** — Criatura / tentáculos / control
- 🐙 **Kraken ancestral** — Criatura legendaria / daño masivo / control

## ⚔️ Características de todas las unidades

### 👤 Humanos

| Unidad | Tipo de daño | Características |
|---|---|---|
| 🗡️ Miliciano | 🗡️ Cuerpo a cuerpo | — |
| 🏹 Arquero | 🏹 A distancia | — |
| 🛡️ Caballero | 🗡️ Cuerpo a cuerpo | 🛡️ Resistente al daño físico |
| 🔮 Mago | ✨ Mágico | — |
| 🐎 Caballería | 🗡️ Cuerpo a cuerpo | 🐾 Ágil · 💥 Golpe crítico |
| 🦅 Grifo | 🗡️ Cuerpo a cuerpo | 🦅 Volador · 💥 Golpe crítico · 🐾 Ágil |
| ✝️ Paladín | 🗡️ Cuerpo a cuerpo | 🛡️ Resistente al daño físico · 😱 Inmune al miedo |
| 🐉 Dragón dorado | 🗡️ Cuerpo a cuerpo | 🦅 Volador · 🔥 Inmune al fuego · 🔥 Fuego · 💣 Explosivo |

### ⛏️ Enanos

| Unidad | Tipo de daño | Características |
|---|---|---|
| ⛏️ Minero | 🗡️ Cuerpo a cuerpo | 🛡️ Resistente al daño físico |
| 🪓 Guerrero enano | 🗡️ Cuerpo a cuerpo | 🛡️ Resistente al daño físico |
| 🔨 Herrero de guerra | 🗡️ Cuerpo a cuerpo | 🛡️ Resistente al daño físico · 🗡️ Perforante |
| ⚙️ Ingeniero | 🏹 A distancia | 👁️ Percepción |
| 🔫 Mosquetero | 🏹 A distancia | 🗡️ Perforante |
| 🛡️ Guardia de hierro | 🗡️ Cuerpo a cuerpo | 🛡️ Resistente al daño físico · 🧪 Inmune a estados alterados |
| 🗿 Gólem de piedra | 🗡️ Cuerpo a cuerpo | 🤖 Constructo · 🛡️ Resistente al daño físico · 🐌 Lentitud |
| ⛰️ Coloso de adamantita | 🗡️ Cuerpo a cuerpo | 🤖 Constructo · 🛡️ Resistente al daño físico · 🧪 Inmune a estados alterados · 🗡️ Perforante |

### 💀 No-muertos

| Unidad | Tipo de daño | Características |
|---|---|---|
| 🦴 Esqueleto | 🗡️ Cuerpo a cuerpo | 💀 No-muerto |
| 🏹 Arquero esqueleto | 🏹 A distancia | 💀 No-muerto |
| 🧟 Necrófago | 🗡️ Cuerpo a cuerpo | 💀 No-muerto · 🐾 Ágil |
| 💀 Guerrero esquelético | 🗡️ Cuerpo a cuerpo | 💀 No-muerto · 🛡️ Resistente al daño físico |
| 🧙 Nigromante | ✨ Mágico | 💀 No-muerto |
| 🧛 Vampiro | 🗡️ Cuerpo a cuerpo | 💀 No-muerto · 🧛 Robo de vida · 🐾 Ágil |
| ☠️ Abominación | 🗡️ Cuerpo a cuerpo | 💀 No-muerto · 🛡️ Resistente al daño físico · 🩸 Hemorragia · 😱 Inmune al miedo |
| 🐉 Dragón esquelético | 🗡️ Cuerpo a cuerpo | 💀 No-muerto · 🦅 Volador · 🧊 Hielo · 😱 Inmune al miedo · 🧪 Inmune a estados alterados |

### 🔥 Demonios infernales

| Unidad | Tipo de daño | Características |
|---|---|---|
| 👿 Diablillo | ✨ Mágico | 😈 Demonio · 🐾 Ágil |
| 🗡️ Guerrero infernal | 🗡️ Cuerpo a cuerpo | 😈 Demonio · 🔥 Resistente al fuego |
| 🔥 Sabueso infernal | 🗡️ Cuerpo a cuerpo | 😈 Demonio · 🔥 Fuego · 🐾 Ágil |
| 😈 Demonio de batalla | 🗡️ Cuerpo a cuerpo | 😈 Demonio · 🔥 Resistente al fuego · 😱 Inmune al miedo |
| 🧙 Brujo infernal | ✨ Mágico | 😈 Demonio · 🔥 Fuego |
| 🔥 Demonio de fuego | ✨ Mágico | 😈 Demonio · 🔥 Inmune al fuego · 🔥 Fuego · 🛡️ Resistente al daño físico |
| 👹 Señor demoníaco | 🗡️ Cuerpo a cuerpo | 😈 Demonio · 🔥 Fuego · 🔥 Inmune al fuego · 😱 Inmune al miedo |
| 👹 Balor | 🗡️ Cuerpo a cuerpo | 😈 Demonio · 🔥 Inmune al fuego · 🔥 Fuego · 💣 Explosivo · 😱 Inmune al miedo |

### 🧝 Elfos

| Unidad | Tipo de daño | Características |
|---|---|---|
| 🏹 Explorador | 🏹 A distancia | 👁️ Percepción · 🌲 Explorador |
| 🗡️ Guerrero élfico | 🗡️ Cuerpo a cuerpo | 🐾 Ágil |
| 🏹 Arquero élfico | 🏹 A distancia | 👁️ Percepción · 💥 Golpe crítico |
| 🌿 Druida | ✨ Mágico | 🌲 Explorador · 🧪 Inmune a estados alterados |
| 🗡️ Asesino élfico | 🗡️ Cuerpo a cuerpo | 🐾 Ágil · 💥 Golpe crítico · 🩸 Hemorragia |
| 🧙 Hechicero élfico | ✨ Mágico | 🐾 Ágil |
| 🦄 Unicornio | 🗡️ Cuerpo a cuerpo | 🐾 Ágil · 🌲 Explorador · 🧪 Inmune a estados alterados |
| 🌳 Ent ancestral | 🗡️ Cuerpo a cuerpo | 🛡️ Resistente al daño físico · 🌲 Explorador · 🧪 Inmune a estados alterados · 🐌 Lentitud |

### 🧟 Orkos

| Unidad | Tipo de daño | Características |
|---|---|---|
| 🪓 Guerrero orko | 🗡️ Cuerpo a cuerpo | 🩸 Hemorragia |
| 🏹 Cazador orko | 🏹 A distancia | 👁️ Percepción |
| 🪓 Bárbaro | 🗡️ Cuerpo a cuerpo | 💥 Golpe crítico · 🩸 Hemorragia · 😤 Último aliento |
| 🐗 Jinete de jabalí | 🗡️ Cuerpo a cuerpo | 🐾 Ágil · 💥 Golpe crítico |
| 🔮 Chamán | ✨ Mágico | 😱 Inmune al miedo |
| 🩸 Carnicero | 🗡️ Cuerpo a cuerpo | 🩸 Hemorragia · 💥 Golpe crítico · 😤 Último aliento |
| 🗿 Troll de guerra | 🗡️ Cuerpo a cuerpo | 🛡️ Resistente al daño físico · 💚 Regeneración · 😱 Inmune al miedo |
| 👹 Gigante orko | 🗡️ Cuerpo a cuerpo | 🛡️ Resistente al daño físico · 💚 Regeneración · 🩸 Hemorragia · 😱 Inmune al miedo |

### 🧚 Feéricos

| Unidad | Tipo de daño | Características |
|---|---|---|
| 🍄 Duende feérico | 🗡️ Cuerpo a cuerpo | 🐾 Ágil |
| 🏹 Arquero feérico | 🏹 A distancia | 🐾 Ágil |
| 🧚 Hada | ✨ Mágico | 🦅 Volador · 🐾 Ágil |
| 🗡️ Danzante de hojas | 🗡️ Cuerpo a cuerpo | 🐾 Ágil · 💥 Golpe crítico · 🩸 Hemorragia |
| 🦋 Ilusionista | ✨ Mágico | 🐾 Ágil · 🌀 Confusión |
| 🌙 Encantador | ✨ Mágico | 🌀 Confusión · 🧪 Inmune a estados alterados |
| 🦌 Ciervo feérico | 🗡️ Cuerpo a cuerpo | 🐾 Ágil · 🌲 Explorador · 🧪 Inmune a estados alterados |
| 🐉 Dragón feérico | ✨ Mágico | 🦅 Volador · 🐾 Ágil · 🌀 Confusión |

### 🐉 Dracónidos

| Unidad | Tipo de daño | Características |
|---|---|---|
| 🗡️ Guerrero dracónido | 🗡️ Cuerpo a cuerpo | 🔥 Resistente al fuego |
| 🏹 Cazador dracónido | 🏹 A distancia | 🔥 Resistente al fuego |
| 🛡️ Caballero dracónido | 🗡️ Cuerpo a cuerpo | 🛡️ Resistente al daño físico · 🔥 Resistente al fuego |
| 🔥 Piromante | ✨ Mágico | 🔥 Fuego · 🔥 Resistente al fuego |
| 🐲 Dracoguerrero | 🗡️ Cuerpo a cuerpo | 🦅 Volador · 🔥 Resistente al fuego · 💥 Golpe crítico |
| 🐲 Dracónido ancestral | ✨ Mágico | 🔥 Resistente al fuego · 😱 Inmune al miedo |
| 🐉 Joven dragón | 🗡️ Cuerpo a cuerpo | 🦅 Volador · 🔥 Fuego · 🔥 Resistente al fuego |
| 🐉 Dragón ancestral | 🗡️ Cuerpo a cuerpo | 🦅 Volador · 🔥 Inmune al fuego · 🔥 Fuego · 💣 Explosivo · 😱 Inmune al miedo |

### 🐀 Hombres rata

| Unidad | Tipo de daño | Características |
|---|---|---|
| 🐀 Rata de alcantarilla | 🗡️ Cuerpo a cuerpo | 🐾 Ágil |
| 🗡️ Asaltante | 🗡️ Cuerpo a cuerpo | 🐾 Ágil · 💥 Golpe crítico |
| 🏹 Tirador de plaga | 🏹 A distancia | ☠️ Veneno |
| ☠️ Alquimista | 🏹 A distancia | ☠️ Veneno · ☠️ Resistente al veneno |
| ⚙️ Maquinista | 🏹 A distancia | 👁️ Percepción · 💣 Explosivo |
| 🐀 Señor de la plaga | ✨ Mágico | ☠️ Inmune al veneno · 🧪 Inmune a estados alterados · ☠️ Veneno |
| 🐀 Rata ogro | 🗡️ Cuerpo a cuerpo | 🛡️ Resistente al daño físico · 🩸 Hemorragia · 😱 Inmune al miedo |
| 🧪 Abominación de plaga | 🗡️ Cuerpo a cuerpo | ☠️ Inmune al veneno · ☠️ Veneno · 🛡️ Resistente al daño físico · 🩸 Hemorragia · 🧪 Inmune a estados alterados |

### 🤖 Constructos

| Unidad | Tipo de daño | Características |
|---|---|---|
| ⚙️ Autómata | 🗡️ Cuerpo a cuerpo | 🤖 Constructo |
| 🛡️ Guardián mecánico | 🗡️ Cuerpo a cuerpo | 🤖 Constructo · 🛡️ Resistente al daño físico |
| 🏹 Cañonero | 🏹 A distancia | 🤖 Constructo · 🗡️ Perforante |
| ⚙️ Ingeniero arcano | ✨ Mágico | 🤖 Constructo · 👁️ Percepción |
| 🗡️ Autómata de guerra | 🗡️ Cuerpo a cuerpo | 🤖 Constructo · 🛡️ Resistente al daño físico · 🗡️ Perforante |
| 🔮 Gólem rúnico | ✨ Mágico | 🤖 Constructo · 🧪 Inmune a estados alterados |
| 🗿 Gólem de guerra | 🗡️ Cuerpo a cuerpo | 🤖 Constructo · 🛡️ Resistente al daño físico · 🧪 Inmune a estados alterados · 🐌 Lentitud |
| ⚙️ Coloso mecánico | 🗡️ Cuerpo a cuerpo | 🤖 Constructo · 🛡️ Resistente al daño físico · 🧪 Inmune a estados alterados · 🗡️ Perforante |

### 🧜 Abisales

| Unidad | Tipo de daño | Características |
|---|---|---|
| 🐟 Merodeador abisal | 🗡️ Cuerpo a cuerpo | 🌊 Anfibio · 🐾 Ágil |
| 🔱 Guerrero de las profundidades | 🗡️ Cuerpo a cuerpo | 🌊 Anfibio · 🛡️ Resistente al daño físico |
| 🏹 Cazador abisal | 🏹 A distancia | 🌊 Anfibio · 🐾 Ágil |
| 🌊 Brujo de las mareas | ✨ Mágico | 🌊 Anfibio · 🧊 Hielo |
| 🐙 Invocador abisal | ✨ Mágico | 🌊 Anfibio · 🌀 Confusión |
| 🧠 Devoramentes | ✨ Mágico | 🌊 Anfibio · 🌀 Confusión · 💫 Aturdimiento |
| 🦑 Horror de las profundidades | 🗡️ Cuerpo a cuerpo | 🌊 Anfibio · 🛡️ Resistente al daño físico · 🕸️ Inmovilización · 🧊 Hielo |
| 🐙 Kraken ancestral | 🗡️ Cuerpo a cuerpo | 🌊 Anfibio · 🛡️ Resistente al daño físico · 🕸️ Inmovilización · 🧊 Hielo · 🧪 Inmune a estados alterados |
