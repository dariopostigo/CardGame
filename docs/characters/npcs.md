# CardGame — NPCs / Personajes (borrador)

Documento dedicado a los NPCs **no hostiles** que aparecen en el mapa mediante la Ficha de Personaje ([`../board/board-map.md`](../board/board-map.md), sección "Fichas del tablero"). Distinto de [`enemies.md`](enemies.md) (entidades hostiles) — estos no inician combate.

**Base: arquetipos clásicos de NPC de D&D** (mercader, tabernero, herrero, sabio/mago...), sin atarse a nada de Tolkien/Viajes. Términos transversales en [`../glossary.md`](../glossary.md).

## 1. Cómo aparece un NPC en el mapa

- **Ficha de Personaje** (icono blanco): siempre no-hostil, el jugador sabe de antemano que va a interactuar (diálogo/tienda), no combate.
- También aparecen de forma concentrada dentro de la localización **Pueblo/Aldea** (`../board/board-map.md` §3b), que puede tener varios NPCs a la vez en su sub-mapa.
- **Quién es cada NPC de Pueblo se decide en generación, no al interactuar** *(decidido)*: cada instancia de Pueblo da un tope de NPC según su tamaño (1-2 hexágonos → uno, 4 → dos) y nunca repite oficio dentro de la misma instancia. Posada/Iglesia/Torre de mago fijan su oficio (Tabernero/Sacerdote/Mago); Poblado pequeño/grande sortean entre el resto del catálogo de §2, sin repetir (`../board/board-map.md` §2c, `board-gen.ts` `seedVillageNpcs`). Los NPC sueltos del resto del mapa (fuera de Pueblo) siguen sin tipo concreto asignado.

## 2. Tipos de NPC (ejemplo, no oficial)

| NPC | Qué ofrece | Notas |
|---|---|---|
| Vendedor/Mercader | Compra/vende **Items** (objetos de aventurero, pociones, pergaminos — [`../cards/items.md`](../cards/items.md)); **no** vende armas ni armaduras (eso es el Herrero) — precios por Rareza y **venta a ≈40 %** (`../game-design.md` §6b.3); stock limitado/rotatorio | El más genérico; aparece tanto en Pueblo como suelto en el mapa |
| Tabernero | Ofrece el **descanso largo** (`../game-design.md` §4c.3): cura total, recupera Dados de Vida, quita estados negativos; puede dar rumores/pistas. Posible coste de oro. **Además**, pagando **50 oro** puede **reducir en 25 el Nivel de Amenaza** (`../game-design.md` §6c.2) — acción usable **1 vez por partida/capítulo** | Aparece en el Pueblo o en una **posada** suelta en mitad de un camino |
| Sacerdote/Sanador | **Limpia Maldiciones** ([`../cards/curses.md`](../cards/curses.md) §4) pagando su coste de limpieza, o mediante la prueba gratuita arriesgada; puede ofrecer curación/bendición menor | Hace de **Templo del prototipo** (`../board/board-map.md` §3b, §8); vive en el Pueblo. Sumidero de oro (`../game-design.md` §6b.2) |
| Mago/Encantador | Vende hechizos, pergaminos, encanta objetos existentes | Contrapunto arcano del vendedor; encaja con la localización Torre de mago (`../board/board-map.md` §3b) |
| Capitán de mercenarios | **Vende cartas de Mercenario** por oro ([`../cards/mercenaries.md`](../cards/mercenaries.md) §2b) — la vía **segura**. Reclutarlas gratis (con riesgo de combate) es un **encuentro** en una ficha ambigua (`../cards/mercenaries.md` §2a), no este NPC | Cartas de tipo Acción que van a tu mazo; coste por Rareza (`../game-design.md` §6b.3). **Solo aparece en Pueblos** |
| Informante/Guía | Revela información del mapa sin magia (ej. adelanta el estado "Detectado" de un grupo vecino) | Vía alternativa no arcana para la mecánica de exploración de `../board/board-map.md` §4 |
| Herrero | **Compra y vende cartas de Arma y Armadura** ([`../cards/weapons.md`](../cards/weapons.md), [`../cards/armor.md`](../cards/armor.md)) por oro, precios por Rareza (`../game-design.md` §6b.3, §2b) | Es quien cubre armas/armaduras (el Mercader solo lleva Items). **Es tu única salida para liquidar el equipo obsoleto**, que es la fuente de oro más regular. *(La reparación/mejora de equipo queda como idea futura, [`../ideas.md`](../ideas.md).)* |
| Dador de misión *(solo Campaña)* | NPC con **historia propia**: da misiones ligadas al arco de la Campaña o **secundarias opcionales** (decides si aceptarlas o no), con recompensa narrativa/mecánica | Solo tiene sentido en Modo Campaña (necesita narrativa); ficha con mucho recorrido a futuro |

> **Subconjunto del prototipo:** entran **todos** estos tipos salvo el *Dador de misión* (solo Campaña). El **Sacerdote/Sanador** hace de Templo del prototipo (limpia Maldiciones), ya que el Pueblo absorbe esa función (`../board/board-map.md` §8).

## 2b. Comprar y vender: cada NPC compra lo que vende *(decidido)*

No hay comprador universal. **El NPC que vende una categoría de carta también te la compra**, al ≈40 % de su precio (`../game-design.md` §6b.3-6b.4):

| NPC | Vende y compra |
|---|---|
| Vendedor/Mercader | Items ([`../cards/items.md`](../cards/items.md)) |
| Herrero | Armas y armaduras ([`../cards/weapons.md`](../cards/weapons.md), [`../cards/armor.md`](../cards/armor.md)) |
| Capitán de mercenarios | Mercenarios ([`../cards/mercenaries.md`](../cards/mercenaries.md)) |
| Mago/Encantador | Pergaminos y hechizos |
| Tabernero · Sacerdote/Sanador · Informante/Guía · Dador de misión | **Nada** — solo servicios |

- Las **Maldiciones no se venden** ([`../cards/curses.md`](../cards/curses.md)): se limpian pagando al Sacerdote/Sanador o con la prueba arriesgada.
- **Vender armas/armaduras es la fuente de oro más estable** del juego: su colección es ilimitada y no ocupa Mazo (`../game-design.md` §4a), así que el equipo obsoleto se acumula sin coste y siempre hay algo que liquidar.
- Por eso la generación de mapa garantiza **1 Pueblo** (`../board/board-map.md` §2c): es donde se concentran estos NPCs. Sin él no habría dónde vender, ni descanso largo, ni limpieza de Maldiciones.

## 3. Stock: cuántas cartas ofrece cada NPC

### 3a. Cuándo se genera y cuánto dura

- **Se sortea al empezar el capítulo:** al entrar en un capítulo, cada NPC del mapa recibe de golpe su oferta, elegida **aleatoriamente** del catálogo que le corresponde.
- **Es fija durante todo el capítulo:** no rota, no se reinicia ni cambia a mitad. Salir del Pueblo y volver **no** genera una oferta nueva — lo que viste es lo que hay, así que no existe el "reroll" por entrar y salir.
- **Lo que compras se agota:** la carta comprada desaparece de esa oferta para el resto del capítulo (el stock no se repone).
- **Cambio de capítulo (Campaña):** al pasar al siguiente capítulo se sortea una **oferta nueva y distinta**. Es la única forma de renovar el stock.
- **Partida rápida:** al ser un único mapa/capítulo (`../board/board-map.md` §2b), la oferta inicial es la de toda la partida.

Consecuencia de diseño: la decisión de compra es "¿me lo llevo ahora o ahorro?", no "¿vuelvo más tarde a ver si ha cambiado?".

### 3b. Cuántas cartas

| NPC | Cartas en oferta | De qué catálogo |
|---|---|---|
| Vendedor/Mercader | **4** | Items ([`../cards/items.md`](../cards/items.md)) |
| Herrero | **3** | Armas + Armaduras ([`../cards/weapons.md`](../cards/weapons.md), [`../cards/armor.md`](../cards/armor.md)), mezcla libre |
| Mago/Encantador | **3** | Hechizos y pergaminos |
| Capitán de mercenarios | **2** | Mercenarios ([`../cards/mercenaries.md`](../cards/mercenaries.md) §3) |

- **Sin tope de rareza (de momento):** cualquier carta del catálogo puede salir en la oferta, **incluidos los Legendarios**, con su precio de `../game-design.md` §6b.3. Limitar el mercado por rareza queda como palanca de balance para más adelante ([`../ideas.md`](../ideas.md)).
- El resto de NPCs (Tabernero, Sacerdote/Sanador, Informante) **no venden cartas**: ofrecen servicios (§2), así que no tienen stock.

## 4. Cómo se resuelve la interacción

- Interacción de menú/diálogo simple (no un mini-combate ni prueba de estadística obligatoria), aunque algunos NPCs puedan ofrecer una prueba opcional (ej. Carisma para conseguir mejor precio).
- No consume el mazo de encuentro de `../board/board-map.md` §5 (eso es solo para combate/tensión de exploración) — es una interacción "de calma", coherente con que Pueblo es el "punto de respiro" definido en `../board/board-map.md` §3b.

## 5. Próximos pasos / preguntas abiertas

- [x] **Colocación dentro de un Pueblo** → **decidido**: tope de NPC por tamaño de la instancia (1-2 hex→1, 4 hex→2) sin repetir oficio; Posada/Iglesia/Torre de mago fijan el suyo (Tabernero/Sacerdote/Mago); Poblado pequeño/grande sortean el resto sin repetir (§1, `../board/board-map.md` §2c). Sigue abierto qué NPC concreto puede salir **suelto** fuera de Pueblo — mezcla perfilada pero no implementada: el **Capitán de mercenarios** solo en Pueblos; el **Tabernero** también en una posada suelta de camino; el **Informante/Guía** y el **Mercader** pueden salir sueltos; Sacerdote/Herrero/Mago tienden al Pueblo.
- [x] Definir el sistema de precios/economía → **Oro** (`../game-design.md` §6b), precios por Rareza (§6b.3). Falta balancear cifras.
- [x] Definir **quién compra** las cartas que te sobran → §2b: cada NPC compra lo que vende.
- [x] Definir el stock/rotación concreto de cada tienda → **§3**: oferta aleatoria fijada al empezar el capítulo, sin rotación intracapítulo, renovada al cambiar de capítulo; 4/3/3/2 cartas y sin tope de rareza por ahora. Falta balancear si esas cantidades dan demasiada o poca elección.
- [x] Subconjunto del prototipo → **7 de los 8 tipos** de §2 entran en el prototipo (incluido el nuevo Sacerdote/Sanador); solo el Dador de misión queda para Campaña.
- [ ] Definir 2-3 NPCs de ejemplo con nombre propio para el prototipo (mínimo: un tabernero y un mercader).
- [x] Decidir si el Mercenario usa stats/mazo propio o efecto pasivo simple → **ninguno de los dos**: es una **carta de Acción** que va a tu mazo, reclutada con una prueba de Carisma en una ficha ambigua o comprada por oro ([`../cards/mercenaries.md`](../cards/mercenaries.md)).
- [ ] Cuando quieras, ir añadiendo más tipos de NPC a la tabla de §2.
