# CardGame — NPCs / Personajes (borrador)

Documento dedicado a los NPCs **no hostiles** que aparecen en el mapa mediante la Ficha de Personaje ([`board-map.md`](../board/board-map.md), sección "Fichas del tablero"). Distinto de [`enemies.md`](enemies.md) (entidades hostiles) — estos no inician combate.

**Base: arquetipos clásicos de NPC de D&D** (mercader, tabernero, herrero, sabio/mago...), sin atarse a nada de Tolkien/Viajes. Términos transversales en [`glossary.md`](../glossary.md).

## 1. Cómo aparece un NPC en el mapa

- **Ficha de Personaje** (icono blanco): siempre no-hostil, el jugador sabe de antemano que va a interactuar (diálogo/tienda), no combate.
- También aparecen de forma concentrada dentro de la localización **Pueblo/Aldea** (`board-map.md` §3b), que puede tener varios NPCs a la vez en su sub-mapa.

## 2. Tipos de NPC (ejemplo, no oficial)

| NPC | Qué ofrece | Notas |
|---|---|---|
| Vendedor/Mercader | Compra/vende objetos, pociones, a veces armas/armaduras — precios por Rareza y **venta a ≈40 %** (`game-design.md` §6b.3); stock limitado/rotatorio | El más genérico; aparece tanto en Pueblo como suelto en el mapa |
| Tabernero | Ofrece el **descanso largo** (`game-design.md` §4c.3): cura total, recupera Dados de Vida, quita estados negativos; puede dar rumores/pistas. Posible coste de oro. | Ligado normalmente a Pueblo |
| Mago/Encantador | Vende hechizos, pergaminos, encanta objetos existentes | Contrapunto arcano del vendedor; encaja con la localización Torre de mago (`board-map.md` §3b) |
| Mercenario contratable | Se une temporalmente como aliado (por un tramo del mapa o hasta un descanso) | Coste en **oro** según su potencia (`game-design.md` §6b.2) a cambio de ayuda en combate |
| Informante/Guía | Revela información del mapa sin magia (ej. adelanta el estado "Detectado" de un grupo vecino) | Vía alternativa no arcana para la mecánica de exploración de `board-map.md` §4 |
| Herrero | Repara/mejora armas y armaduras existentes del mazo (subir de rareza/reforjar) por **oro** (`game-design.md` §6b.2) | Arquetipo clásico de D&D, contrapunto "físico" al Mago/Encantador (arcano) |
| Dador de misión *(solo Campaña)* | Ofrece un objetivo secundario con recompensa narrativa/mecánica | Solo tiene sentido en Modo Campaña, no en Modo Prueba |

## 3. Cómo se resuelve la interacción

- Interacción de menú/diálogo simple (no un mini-combate ni prueba de estadística obligatoria), aunque algunos NPCs puedan ofrecer una prueba opcional (ej. Carisma para conseguir mejor precio).
- No consume el mazo de encuentro de `board-map.md` §5 (eso es solo para combate/tensión de exploración) — es una interacción "de calma", coherente con que Pueblo es el "punto de respiro" definido en `board-map.md` §3b.

## 4. Próximos pasos / preguntas abiertas

- [ ] Decidir si los NPCs sueltos en el mapa general (fuera de Pueblo) son fichas fijas o generadas aleatoriamente como el resto de fichas del tablero.
- [x] Definir el sistema de precios/economía → **Oro** (`game-design.md` §6b), precios por Rareza (§6b.3). Falta balancear cifras y definir el stock/rotación concreto de cada tienda.
- [ ] Definir 2-3 NPCs de ejemplo con nombre propio para el prototipo (mínimo: un tabernero y un mercader).
- [ ] Decidir si el Mercenario contratable usa el mismo sistema de estadísticas/mazo que el jugador (más complejo) o solo aporta un efecto pasivo simple (más fácil de implementar).
- [ ] Cuando quieras, ir añadiendo más tipos de NPC a la tabla de §2.
