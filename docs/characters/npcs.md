# CardGame — NPCs / Personajes (borrador)

Documento dedicado a los NPCs **no hostiles** que aparecen en el mapa mediante la Ficha de Personaje ([`board-map.md`](../board/board-map.md), sección "Fichas del tablero"). Distinto de [`enemies.md`](enemies.md) (entidades hostiles) — estos no inician combate.

**Base: arquetipos clásicos de NPC de D&D** (mercader, tabernero, herrero, sabio/mago...), sin atarse a nada de Tolkien/Viajes. Términos transversales en [`glossary.md`](../glossary.md).

## 1. Cómo aparece un NPC en el mapa

- **Ficha de Personaje** (icono blanco): siempre no-hostil, el jugador sabe de antemano que va a interactuar (diálogo/tienda), no combate.
- También aparecen de forma concentrada dentro de la localización **Pueblo/Aldea** (`board-map.md` §3b), que puede tener varios NPCs a la vez en su sub-mapa.

## 2. Tipos de NPC (ejemplo, no oficial)

| NPC | Qué ofrece | Notas |
|---|---|---|
| Vendedor/Mercader | Compra/vende **Items** (objetos de aventurero, pociones, pergaminos — [`../cards/items.md`](../cards/items.md)); **no** vende armas ni armaduras (eso es el Herrero) — precios por Rareza y **venta a ≈40 %** (`game-design.md` §6b.3); stock limitado/rotatorio | El más genérico; aparece tanto en Pueblo como suelto en el mapa |
| Tabernero | Ofrece el **descanso largo** (`game-design.md` §4c.3): cura total, recupera Dados de Vida, quita estados negativos; puede dar rumores/pistas. Posible coste de oro. | Aparece en el Pueblo o en una **posada** suelta en mitad de un camino |
| Sacerdote/Sanador | **Limpia Maldiciones** ([`../cards/curses.md`](../cards/curses.md) §4) pagando su coste de limpieza, o mediante la prueba gratuita arriesgada; puede ofrecer curación/bendición menor | Hace de **Templo del prototipo** (`../board/board-map.md` §3b, §8); vive en el Pueblo. Sumidero de oro (`game-design.md` §6b.2) |
| Mago/Encantador | Vende hechizos, pergaminos, encanta objetos existentes | Contrapunto arcano del vendedor; encaja con la localización Torre de mago (`board-map.md` §3b) |
| Capitán de mercenarios | **Vende cartas de Mercenario** por oro ([`../cards/mercenaries.md`](../cards/mercenaries.md) §2b) — la vía **segura**. Reclutarlas gratis (con riesgo de combate) es un **encuentro** en una ficha ambigua (`../cards/mercenaries.md` §2a), no este NPC | Cartas de tipo Acción que van a tu mazo; coste por Rareza (`game-design.md` §6b.3). **Solo aparece en Pueblos** |
| Informante/Guía | Revela información del mapa sin magia (ej. adelanta el estado "Detectado" de un grupo vecino) | Vía alternativa no arcana para la mecánica de exploración de `board-map.md` §4 |
| Herrero | **Vende cartas de Arma y Armadura** ([`../cards/weapons.md`](../cards/weapons.md), [`../cards/armor.md`](../cards/armor.md)) por oro, precios por Rareza (`game-design.md` §6b.3) | Es quien cubre armas/armaduras (el Mercader solo vende Items). *(La reparación/mejora de equipo queda como idea futura, [`../ideas.md`](../ideas.md).)* |
| Dador de misión *(solo Campaña)* | NPC con **historia propia**: da misiones ligadas al arco de la Campaña o **secundarias opcionales** (decides si aceptarlas o no), con recompensa narrativa/mecánica | Solo tiene sentido en Modo Campaña (necesita narrativa); ficha con mucho recorrido a futuro |

> **Subconjunto del prototipo:** entran **todos** estos tipos salvo el *Dador de misión* (solo Campaña). El **Sacerdote/Sanador** hace de Templo del prototipo (limpia Maldiciones), ya que el Pueblo absorbe esa función (`../board/board-map.md` §8).

## 3. Cómo se resuelve la interacción

- Interacción de menú/diálogo simple (no un mini-combate ni prueba de estadística obligatoria), aunque algunos NPCs puedan ofrecer una prueba opcional (ej. Carisma para conseguir mejor precio).
- No consume el mazo de encuentro de `board-map.md` §5 (eso es solo para combate/tensión de exploración) — es una interacción "de calma", coherente con que Pueblo es el "punto de respiro" definido en `board-map.md` §3b.

## 4. Próximos pasos / preguntas abiertas

- [ ] **Colocación en el mapa** — mezcla ya perfilada: el **Capitán de mercenarios** solo en Pueblos; el **Tabernero** en Pueblo o en una posada suelta de camino; el **Informante/Guía** y el **Mercader** pueden salir sueltos; Sacerdote/Herrero/Mago tienden al Pueblo. El reparto fino se concreta al revisar la generación de fichas (`../board/board-map.md` §2c).
- [x] Definir el sistema de precios/economía → **Oro** (`game-design.md` §6b), precios por Rareza (§6b.3). Falta balancear cifras y definir el stock/rotación concreto de cada tienda.
- [x] Subconjunto del prototipo → **los 7 tipos** de §2 entran en el prototipo (incluido el nuevo Sacerdote/Sanador); solo el Dador de misión queda para Campaña.
- [ ] Definir 2-3 NPCs de ejemplo con nombre propio para el prototipo (mínimo: un tabernero y un mercader).
- [x] Decidir si el Mercenario usa stats/mazo propio o efecto pasivo simple → **ninguno de los dos**: es una **carta de Acción** que va a tu mazo, reclutada con una prueba de Carisma en una ficha ambigua o comprada por oro ([`../cards/mercenaries.md`](../cards/mercenaries.md)).
- [ ] Cuando quieras, ir añadiendo más tipos de NPC a la tabla de §2.
