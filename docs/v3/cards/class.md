<!-- estado: a-medias -->

# Cartas de clase — V3

> El motor de combate ya no bloquea —está escrito en [game-design.md](../game-design.md) §4 con sus diales fijados—, así que un efecto ya se puede redactar en términos de Habilidades, umbrales y estados. Anatomía y vocabulario del efecto ya están cerrados para el piloto; falta redactar las cartas.

## Alcance *(decidido)*

Hay cartas de clase **para las 44 clases** de [Razas](../razas/), aunque la v1 solo necesita las **8** de las dos razas piloto —Humanos y Enanos (`status.md` §4)—: es el catálogo más grande del juego, y por eso se cierran esas dos enteras antes de tocar ninguna otra.

**Un set por raza, no compartido.** Cada raza tiene su Guerrero con los números que le tocan, igual que tiene su Mago. Compartir habría ahorrado 3 sets de 44 —"Guerrero" es el único nombre que repite— a cambio de que ninguna raza pudiera protagonizar la ilustración.

De ahí una nota de catálogo: **cuatro cartas se van a llamar "⚔️ Guerrero"**, así que en cualquier lista que las junte la raza va en la identidad, como ya hacen las unidades ("Asesino élfico"). En la carta no hace falta: el medallón lleva el emblema de la raza.

**Cinco cartas por clase para el piloto** *(8-sep-2026)*: 40 cartas entre las 8 clases de Humanos y Enanos, no una por clase. **Se acepta que crezca**: si más adelante una clase necesita una sexta carta, no rompe nada de lo decidido aquí — el número de cartas de una clase es el punto de partida del piloto, no un tope del sistema.

## Vocabulario *(resuelto)*

En v2 estas cartas se llamaban "cartas de habilidad", y en V3 **"Habilidad" queda reservada para las 8 estadísticas**. Estas son "cartas de clase" y nada más — una palabra prohibida al redactar, no algo que renombrar.

**Lo que la carta concede se llama "efecto".** No se confunde con nada: un **estado** ([effects.md](../sistemas/effects.md)) es temporal y tiene catálogo propio; una **Característica** ([Características](../sistemas/caracteristicas.md)) es un rasgo permanente de la ficha.

## Anatomía de la carta *(decidido para el piloto, 8-sep-2026)*

| Campo | Qué lleva |
|---|---|
| **Nombre** | Texto libre de la carta (p.ej. "Estocada") — no el de la clase: eso ya lo dice el medallón. |
| **Clase** | Una de las 4 por raza: Guerrero, Mago, Sacerdote, Arquero. |
| **Tipo** | Acción, Pasiva o Turnos ([game-design.md §6.5](../game-design.md)) — decide qué le pasa a la carta al jugarla, no es cosa de aquí. |
| **Objetivo** | Uno mismo, un aliado, un enemigo o un área (§"Objetivo" más abajo). |
| **Efecto** | Uno o más de: modificar una Habilidad, aplicar o quitar un Estado, infligir daño o curar (§"Cómo se expresa un efecto"). |

**Sin tier ni Rareza**: un héroe no entra en esa escala ([game-design.md §3](../game-design.md)), y estas cartas son solo de héroe.

## Cómo se expresa un efecto *(decidido para el piloto, 8-sep-2026)*

**Solo con lo que ya existe — nada de vocabulario nuevo por carta**, para este primer piloto. El efecto de una carta compone una o varias de estas tres piezas:

1. **Modificar una Habilidad.** Sube o baja una de las 8 en una cantidad fija, durante los turnos que declare la carta (o mientras dure, si el Tipo es Turnos). P.ej. "+15 🎯 Precisión, 2 turnos".
2. **Aplicar o quitar un Estado.** Uno de los 9 de [effects.md](../sistemas/effects.md), con su duración de catálogo — la carta no reescribe cuánto dura Aturdido, solo decide que lo aplica (o que lo quita: la única salida de un Estado fuera del motor, [effects.md §6.1](../sistemas/effects.md)).
3. **Infligir daño o curar, en un número fijo escrito en la carta.** No una fórmula sobre el ⚔️ Ataque o la ❤️ Vida de quien la juega (a diferencia del daño por turno de los Estados, [effects.md §3](../sistemas/effects.md)): cada carta lleva su propia cifra, como una unidad más de catálogo que balancear. Si el efecto es daño, declara su tipo (🗡️ 🏹 ✨), obligatorio igual que en una ficha ([game-design.md §4.3](../game-design.md)); una curación no lleva tipo.

**Abierto a crecer**: puede que haga falta una cuarta pieza, u otra acción que hoy no está aquí, cuando se redacten las 40 cartas del piloto y alguna no quepa en estas tres. No se cierra la lista, se empieza por ella.

### Objetivo

Las cuatro formas: **uno mismo, un aliado, un enemigo o un área.** Con eso una carta puede ser un buff propio, una curación a un compañero, un debuff o control a un rival, o un daño en área (como el rasgo 💣 Explosivo, pero de carta).

**Por definir**: el alcance numérico de un área —cuántos hexágonos, si puede tocar a la vez a la banda propia y a la enemiga— no tiene número todavía; no es de este documento, es del [tablero de batalla](../board/battle.md).

## Por definir

- **El texto de las 40 cartas del piloto** (5 × 8 clases): con la anatomía y el vocabulario ya cerrados, esto es redactar, no diseñar.
- **El alcance numérico de un área** (§"Objetivo"), en [board/battle.md](../board/battle.md).
- **Si las tres piezas del efecto bastan**, o hace falta una cuarta al escribir las 40 — ver "abierto a crecer" más arriba.
