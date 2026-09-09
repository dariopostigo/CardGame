<!-- estado: escrito -->

# Tipo de daño — V3

> El **campo obligatorio** que lleva toda ficha: decide qué reduce su daño y a qué distancia alcanza.

Las 8 Habilidades dicen *cuánto* daño hace un personaje; este campo dice **de qué clase es**. Cómo se aplica en combate, en [game-design.md](../game-design.md) §4.3.

## El campo

**Uno y solo uno por ficha.** Trae el **alcance puesto**, así que ninguna ficha tiene campo de alcance.

| Valor | Qué significa | Alcance | Qué lo reduce | 👢 |
|---|---|---|---|---|
| 🗡️ **Cuerpo a cuerpo** | Golpea con un arma de contacto | **1** — el hexágono contiguo | 🛡️ Defensa | 3 |
| 🏹 **A distancia** | Dispara un proyectil | **4** hexágonos | 🛡️ Defensa | 1 |
| ✨ **Mágico** | Su ataque básico es magia | **2** hexágonos | 🔮 Resistencia mágica | 2 |

**Reparto actual: 70 🗡️ · 21 🏹 · 41 ✨.**

- **El alcance es fijo por tipo**: ni un número por ficha ni una novena Habilidad. Se mide en hexágonos, y **es un máximo, no un mínimo** — se puede disparar o lanzar magia contra un enemigo pegado, sin penalización. Fijo no es intocable: una carta o una Característica puede sumarle.
- **Lo que se adapta al tamaño del campo es 👢 Movimiento**, no el alcance: 🗡️ es 1 por definición y son 70 de las 132 fichas, así que escalar el alcance solo escala a quien ya llegaba ([battle.md](../board/battle.md) §1.1).
- **No es una Característica, es un campo.** Un rasgo que llevan las 132 no informa de nada en la fila de glifos y gastaría un hueco. Por eso **se dibuja en el sitio del icono ⚔️ del Ataque**: el glifo que acompaña al número es 🗡️, 🏹 o ✨. Cero espacio nuevo en el marco.
- **Lo elemental no es un cuarto valor.** 🔥 Fuego, ☠️ Veneno y 🧊 Hielo son Características y montan *encima* del tipo: un 🐉 Dragón dorado es 🗡️ Cuerpo a cuerpo y además quema.

> **Lo que este campo no puede decir, y se acepta:** un ataque cuerpo a cuerpo que haga daño mágico —un paladín con daño sagrado—. Al ser un valor único, **alcance y canal viajan juntos**. Si algún día una ficha lo necesita de verdad, la salida es partir el campo en dos (alcance × canal), no añadir un cuarto valor.
