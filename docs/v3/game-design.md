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

El tablero de batalla parte del que ya existía en v2; qué se conserva y qué cambia está por decidir en su documento.

## 3. Progresión y rareza *(decidido en lo general)*

- **El sistema de subida de nivel y el de rareza se mantienen** conceptualmente respecto a v2 — pero los valores y los diales concretos se redefinen aquí, no se heredan.
- **El héroe sube de nivel igual que las unidades**: la misma mecánica de progresión para ambos, no dos sistemas separados.

Falta definir: número de niveles, qué se gana en cada uno, cómo se relaciona la progresión de 8 unidades por raza ([razas.md](razas.md)) con la Rareza de carta, y cómo se obtienen las unidades de tier alto.

## 4. Motor de combate

*Por definir.* Es lo que bloquea escribir cualquier carta, así que va primero. Tiene que cubrir al menos:

- Anatomía de la ficha de personaje: las 8 Habilidades, la lista de Características, y el alcance.
- Cómo se resuelve un ataque: si se puede atacar, si acierta, si es crítico, cuánto daño hace.
- Qué hacen Defensa y Resistencia mágica sobre el daño recibido.
- Iniciativa y orden de actuación.
- Ataque secundario, si sigue existiendo.
- Cómo se calculan los PV máximos.

## 5. Resolución fuera de combate

*Por definir.* Pruebas de habilidad en el tablero de exploración, rango de visión y cualquier otra resolución que no sea un ataque.

## 6. Turno y economía de cartas

*Por definir.* Estructura del turno, acciones disponibles, tamaño de mazo, mano y coste de jugar una carta.

## 7. Economía y recompensas

*Por definir.* Oro, loot, tabla de recompensas y qué se puede comprar.

## 8. Balance

*Por definir.* Método de balance y objetivos numéricos. Nada de V3 está balanceado todavía.
