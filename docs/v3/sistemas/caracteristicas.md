<!-- estado: a-medias -->

# Características — V3

> El catálogo de **rasgos con nombre fijo** que se reparten entre las fichas. Una Característica es la excepción —lo que hace rara a esta ficha—, no lo que todas comparten: eso son las [Habilidades](habilidades.md) y el [tipo de daño](dano.md).

**Nombre fijo y reutilizable**: la misma Característica significa lo mismo la lleve quien la lleve, y **lleva una sola cifra para todo el juego** — 🩸 Hemorragia dura lo mismo en un ⛏️ Minero que en un ⛰️ Coloso. Por eso la ficha solo dice **si la tiene**, y la carta la imprime como un glifo sin número.

Quién lleva cuáles está en los catálogos: los héroes en [Héroes](../characters/heroes.md), las unidades en [Unidades](../razas/unidades.md). **Cuántas caben** en cada ficha lo dice [La ficha](ficha.md), y está topado por tier.

Lo que falta: **las 41 cifras** de los rasgos y **tres redundancias** por resolver *(ver [status.md](../status.md))*. El catálogo en sí está cerrado y medido — `lib/v3/traits-catalog.ts` es su espejo en código.

## El catálogo

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

> **Lo que no es una Característica.** El canal —🏹 *a distancia*, ✨ *mágico*— es
> [Tipo de daño](dano.md), campo de ficha. Y "reduce el daño mágico recibido" ya lo
> dice la Habilidad 🔮, así que no hay Característica de resistencia mágica: 🧿
> *Inmune a la magia* se queda solo porque la Habilidad está topada y la inmunidad
> total es algo que un porcentaje no puede expresar.

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

