# Efectos y estados — V3

> Esqueleto. **Nada decidido todavía**: este documento se escribe cuando el motor de combate ([game-design.md](game-design.md) §4) fije cómo se resuelve un ataque.

## Por qué no se hereda nada de v2

El catálogo de estados de [v2/effects.md](../v2/effects.md) está definido en términos que en V3 no existen: "tiras 2d20 y coges el mejor", "+1d4 a tus tiradas de ataque y de salvación", "+X a la CA", "salvación SAB al final del turno". No hay traducción mecánica posible; los estados de V3 se definen de nuevo sobre el motor nuevo.

## Qué tiene que cubrir

1. **Qué estados existen** y qué hace cada uno, en términos de Habilidades (Ataque, Defensa, Precisión, Velocidad, Movimiento…), no de dados.
2. **Cómo se aplican y cómo se quitan**: duración, acumulación, si algo permite librarse de ellos.
3. **Ámbito**: si el estado vive en el tablero de batalla, en el de exploración, o en los dos.
4. **Relación con las Características**. Varias Características de [razas.md](razas.md) aplican estados al golpear —🔥 Fuego, ☠️ Veneno, 🧊 Congelación, 🌑 Ceguera, 🕸️ Inmovilización, 🐌 Lentitud, 🌀 Confusión, 😵 Aturdido, 😱 Miedo, 🩸 Hemorragia—. Ese es el punto de partida natural del catálogo: son los estados que el sistema ya necesita.

## Distinción que hay que mantener

Las Características **no son estados**. Un rasgo permanente de la ficha (Volador, No-muerto, Robo de vida, Líder) vive en [razas.md](razas.md); un efecto temporal que se aplica y se quita vive aquí.
