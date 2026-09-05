<!-- estado: por-escribir -->

# Tablero (técnico) — V3

> Esqueleto. Contrapartida técnica de [board-map.md](board-map.md): formato de datos, generación y lo que necesita el código.

## Por definir

Todo. Este documento no se escribe hasta que [board-map.md](board-map.md) fije el diseño, porque describe cómo se implementa, no qué se implementa.

## Relación con v2 y con el código

El equivalente de v2 está en [v2/board/board-map-dev.md](../../v2/board/board-map-dev.md), y su implementación sigue viva y funcionando en `lib/v2/rules/` (geometría hexagonal, generación de tablero, biblioteca de tiles). Esa parte del código no tiene nada de D&D dentro, así que es candidata a reutilizarse tal cual — pero la decisión de si se comparte, se copia o se reescribe se toma cuando `lib/v3/` necesite geometría de verdad, no antes.
