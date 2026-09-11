<!-- estado: a-medias -->

# Cartas de unidad — V3

> Esqueleto. Sustituye al tipo de carta "Mercenario", que queda obsoleto.

## Qué es una Unidad *(decidido)*

Cada raza tiene su **progresión de 8 unidades**, ya definidas con sus Características en [Unidades](../razas/unidades.md), y **hay una carta por cada una** — una carta, no un set.

Las unidades tienen **dos caras**: reclutable (esta carta) y hostil ([enemies.md](../characters/enemies.md)). Las dos salen de la misma ficha.

**Las ocho son la reserva, no el ejército.** Cada jugador pone cinco fichas —su héroe y hasta 4 unidades—, así que las ocho son de dónde **eliges**, y elegir cuatro es una decisión de juego: ¿el tier alto que pega, o dos baratas que hacen pantalla? Cuatro es tope, no requisito.

**Una carta pone una ficha, una criatura**, no una pila de figuras.

**No es un mercenario renombrado**: las cartas de mercenario de v2 no se migran. Cada unidad se escribe desde cero, con el sabor de su raza desde el primer borrador.

## Por definir

- **Cómo se recluta.** Que **solo se reclutan unidades de la propia raza** ya está decidido; falta el mecanismo. Fleco: qué hace el loot cuando la unidad que da no es de tu raza.
- **Si se pueden llevar dos copias de la misma unidad** al bando de cuatro. Es cosa del reclutamiento, no del tablero.
- **Qué pasa con una unidad que muere en batalla**: si la carta se pierde o vuelve a la reserva. Hace falta antes de poder jugar dos batallas seguidas.

**Ya no falta** cómo funciona en el tablero: tiene **turno propio** en la lista de ⚡ Iniciativa y **ocupa un hexágono**, que nadie atraviesa ([battle.md](../board/battle.md) §4 y §5). Ni su Rareza: sale del tier ([game-design.md §3.1](../game-design.md)). Ni la **anatomía de la carta**: son los 13 datos de [`knowledge/v3/card-concept/README.md`](../../../knowledge/v3/card-concept/README.md) §"Contra qué se juzgan" — el mismo `Character` de [La ficha](../sistemas/ficha.md) más su ilustración. Ni **las 8 unidades humanas**: existen como datos reales, leídos en vivo de `razas.md` con su ilustración (`public/assets/v3/races/humanos/units/`), en [el catálogo en datos](/docs/v3/cards/catalogo) *(8-sep-2026)*.
