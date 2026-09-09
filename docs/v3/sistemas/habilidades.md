<!-- estado: escrito -->

# Habilidades — V3

> Las **8 estadísticas** que lleva cualquier ficha del juego: héroe, unidad o enemigo. Son del sistema, no de las razas — la raza solo les pone el valor.

Quién tiene cada valor es catálogo y vive en otro sitio: los 44 héroes en [Héroes](../characters/heroes.md), las 88 unidades en [Unidades](../razas/unidades.md).

**Estado:** cerrado *(8-sep)*. El sistema tenía tres cifras propias y están puestas *(§4)*; lo que quede por rellenar es de cada ficha, no de aquí. Cómo se llegó hasta esto está en [status.md](../status.md).

## 1. Las ocho

| | Qué mide | Escala |
|---|---|---|
| ❤️ **Vida** | El daño que aguanta | 2–3 cifras |
| ⚔️ **Ataque** | El daño que inflige. De qué **tipo** lo dice [Tipo de daño](dano.md) | 1–2 cifras |
| 🛡️ **Defensa** | % que reduce del daño físico (🗡️ 🏹) | 0 – **75** |
| 🔮 **Resistencia mágica** | % que reduce del daño mágico (✨) | 0 – **75** |
| 🎯 **Precisión** | Umbral de acierto sobre 1..100 | **65 – 95** |
| 🍀 **Suerte** | Umbral de crítico; también libra de estados y desempata ⚡ | 0 – **25**, nunca por encima de 🎯 |
| ⚡ **Iniciativa** | El orden de actuación; los empates los rompe 🍀 | Sin escala: solo se compara |
| 👢 **Movimiento** | Hexágonos por turno | ✅ **🗡️ 3 · ✨ 2 · 🏹 1** *(31-ago)* |

## 2. La curva de tier

**Solo ❤️ y ⚔️ crecen con el tier**, y crecen **×10 del tier 1 al 8**:

| Tier | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| **× la base** | 1 | 1,4 | 1,9 | 2,7 | 3,7 | 5,2 | 7,2 | **10** |

Las otras seis están topadas o no escalan: un tier 8 pega y aguanta diez veces más, pero **no acierta diez veces mejor**. Por eso un tier 1 puede arañar a un tier 8 sin ningún caso especial.

Y el tier es **el único eje**: una unidad no sube de nivel — es más fuerte porque es *otra* unidad ([game-design.md](../game-design.md) §3).

## 3. De dónde sale cada número

| Habilidad | Sale de |
|---|---|
| ❤️ ⚔️ | Una **base de tier 1 por raza**; la curva da los otros siete escalones |
| 🛡️ 🔮 🎯 🍀 ⚡ | **Un escalón, elegido a ojo, ficha a ficha** |
| 👢 | Banda por tipo de daño ✅ |

**No hay fórmula.** Cinco de las ocho se asignan porque tienen sentido, no porque las calcule nada: un enano lleva 🛡️ *Mucho* y ⚡ *Lento* **porque es un enano**. Los topes de §1 no dicen qué poner, solo si te has pasado.

### Los escalones

| | Nada | Poco | Normal | Mucho | Bestial |
|---|---|---|---|---|---|
| 🛡️ **Defensa** | 0 | 20 | 40 | 60 | 75 |
| 🔮 **Resistencia mágica** | 0 | 20 | 40 | 60 | 75 |
| 🎯 **Precisión** | 65 | 72 | 80 | 88 | 95 |
| 🍀 **Suerte** | 0 | 6 | 12 | 18 | 25 |
| ⚡ **Iniciativa** | — | lento | normal | rápido | — |

**Cada ficha empieza en *Normal* y solo se escribe lo que se sale.** Una ficha corriente no lleva ninguna decisión; la que la lleva se lee de un golpe. 🎯 no baja de *Nada* ni sube de *Bestial* porque esos son los bordes de su banda: la cobertura y 💨 Evasivo se mueven dentro de esos mismos 30 puntos.

### 🎭 El rol y la raza no suman nada

Los cuatro héroes de una raza llevan un **rol** —🛡️ tanque, ⚔️ daño, 🌀 control, ✨ apoyo—, descrito uno por uno en [Razas](../razas/README.md). Es **lo que te dice qué escalón elegir**, no un número que se suma. Y una raza se nota igual: si los enanos son duros y lentos, sus doce fichas llevan 🛡️ arriba y ⚡ abajo, y con eso está dicho.

Lo único que **sí** entra en el número por su cuenta son las [Características](caracteristicas.md), porque las lleva escritas la ficha.

## 4. Las cifras del sistema

**Tres, y están puestas** *(8-sep)*:

| | Valor | Por qué ese |
|---|---|---|
| ❤️ **Vida** base de tier 1 de 👤 Humanos | ✅ **20** | Los humanos son el estándar de las once: bajo y redondo. Deja a las demás entre 15 y 28 |
| ⚔️ **Ataque** base de tier 1 de 👤 Humanos | ✅ **5** | En medio de 1–9, para que quepan arriba los brutos y abajo los frágiles |
| El **tier al que equivale un héroe** | ✅ **5** | El héroe es el líder, no el campeón: sus tres unidades más altas le superan en ❤️ y ⚔️. Y cuadra con su tope de 3 Características, el mismo que los tiers 3, 4 y 5 ([ficha.md](ficha.md)) |

Con eso la curva escribe las dos que escalan, para las doce fichas de Humanos y para el héroe:

| Tier | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| ❤️ **Vida** | 20 | 28 | 38 | 54 | 74 | 104 | 144 | 200 |
| ⚔️ **Ataque** | 5 | 7 | 10 | 14 | 19 | 26 | 36 | 50 |

**La tercera cifra de ❤️ aparece en el tier 6**, así que los tres tiers altos piden una gema de tres cifras en el disco del tablero y los otros cinco no.

Las demás razas ponen su par de ❤️/⚔️ cuando se escriban, mirando a esta. **No son Habilidades pendientes, son razas pendientes** — igual que los escalones de 🛡️ 🔮 🎯 🍀 ⚡, que son de cada ficha y van con su catálogo: los héroes en [Héroes](../characters/heroes.md), las unidades en [Unidades](../razas/unidades.md).

## 5. Lo que no se elige

- **⚔️ base ≤ 9 y ❤️ base 10–99**: los impone la curva ×10 contra el tope de cifras del tier 8.
- **Dónde caiga la base de ❤️ decide en qué tier aparece la tercera cifra**, y esa es la que tiene que caber en la gema de la ficha del tablero.
- **Un héroe vale un tier fijo**, el mismo para los 44, y sigue sin tier impreso en la carta: es una equivalencia interna.
- **Límites de 👢, medidos en duelo**: ninguna 🏹 por encima de 2, ninguna 🗡️ por debajo de 3, ninguna ✨ por debajo de 2.
- **El orden de turno no pesa**: medido en 100.000 combates, quién abre no mueve quién gana. Por eso ⚡ se pone a ojo sin miedo: no compensa nada.
- **Cada Característica lleva una sola cifra para todo el juego**: la ficha solo dice **si la tiene**.
