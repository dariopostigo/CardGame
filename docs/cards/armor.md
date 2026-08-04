# CardGame — Cartas: Armaduras

Catálogo de cartas de **Armadura** (tipo/icono en [`../game-design.md`](../game-design.md) §3.2, Rareza en §3.3; solo 1 equipada a la vez, §2.4; peso 🥼/👕/🧥, significado de todos los iconos en [`../glossary.md`](../glossary.md)). Índice de cartas en [`README.md`](README.md). Valores = **primer pase sin balancear**, base D&D. Las armaduras son **equipo** (1 equipada a la vez), **aparte del Mazo** y sin límite de colección (`../game-design.md` §4a).

## 1. Fórmula de CA por peso *(decidido — resuelve la duda de `../game-design.md` §2)*

La Destreza aporta a la Defensa/CA distinto según el peso de la armadura:

| Peso | Fórmula de CA |
|---|---|
| 🥼 Ligera | `10 + mod DES + bono` (Destreza completa) |
| 👕 Media | `10 + min(mod DES, +2) + bono` (Destreza limitada a +2) |
| 🧥 Pesada | `10 + bono` (sin Destreza) |

## 2. Ligeras 🥼 (Destreza completa)

<!-- cards: armadura peso=ligera -->

| Armadura | Bono CA | Notas | Rareza |
|---|---|---|---|
| Acolchada | +1 | — | Común |
| Cuero | +1 | — | Común |
| Cuero tachonado | +2 | — | Común |

## 3. Medias 👕 (Destreza máx. +2)

<!-- cards: armadura peso=media -->

| Armadura | Bono CA | Notas | Rareza |
|---|---|---|---|
| Pieles | +2 | — | Común |
| Cota de escamas | +4 | Desventaja para evitar detección (ruidosa) | Común |
| Media cota | +5 | Desventaja para evitar detección | Común |

## 4. Pesadas 🧥 (sin Destreza)

<!-- cards: armadura peso=pesada -->

| Armadura | Bono CA | Requisito | Notas | Rareza |
|---|---|---|---|---|
| Cota de anillas | +4 | — | Desventaja para evitar detección | Común |
| Coraza | +5 | — | Protege el torso; algo menos ruidosa | Común |
| Cota de malla | +6 | FUE 13 | Desventaja para evitar detección | Común |
| Placas | +8 | FUE 15 | Desventaja para evitar detección; −1 movimiento si no cumples FUE | Común |

## 5. Reglas transversales

- Solo **1 armadura** equipada (`../game-design.md` §2.4). El **Escudo** ([`weapons.md`](weapons.md)) es aparte: +2 CA, ocupa 1 mano, combinable con cualquier armadura.
- **Evitar detección:** las armaduras ruidosas dan **desventaja** en la prueba de sigilo cuando intentas no ser detectado por enemigos (`../characters/enemies.md` §2b). El sigilo pesa contra el blindaje — coherente con Pícaro (ligera) vs. Guerrero (pesada, tanque que no se esconde).
- **Ejemplos de CA:** Guerrero (DES +1) con Cota de malla = `10 + 6` = **16** (+2 de escudo = **18**). Mago (DES +2) sin armadura = **12**; con Cuero = **13**.
- **No interactúa con el tipo de daño:** el bono de CA de la armadura es agnóstico al tipo de ataque que recibe (a diferencia de las resistencias/vulnerabilidades por Naturaleza de criatura, que sí distinguen tipo de daño — `../game-design.md` §4b.10, `../characters/enemies.md` §3b). Si en el futuro se quiere una armadura que resista un tipo concreto, sería un efecto especial de esa carta, no parte de la fórmula general de este documento.

## 6. Progresión de rareza por familia *(política a futuro, decidido)*

Todas las armaduras del catálogo actual son **Común** — no hay todavía ninguna Poco común/Rara/Épica/Legendaria (igual que en [`weapons.md`](weapons.md) §5). A medida que se añadan más armaduras, la vía preferida **no** es meter armaduras nuevas sueltas, sino ampliar cada familia existente con variantes de rareza creciente y nombre propio en los tramos altos. Ejemplo ilustrativo (Coraza):

| Rareza | Nombre |
|---|---|
| Común | Coraza |
| Poco común | Coraza de acero templado |
| Épica | Coraza del vigía eterno |
| Legendaria | Égida del alba |

Aplica igual a Arma/Armadura/Item (Rareza general en `../game-design.md` §3.3, progresión de Arma en `weapons.md` §5).

### 6b. Escalones del prototipo *(decidido)*

**Regla de derivación** — mismo peso y misma fórmula de CA que su familia (§1), y por escalón:

| Rareza | Qué gana sobre la Común |
|---|---|
| **Poco común** | **+1 al bono de CA** |
| **Raro** | **+1 al bono de CA** y, si la tenía, **pierde la desventaja de sigilo** |
| **Épico** | **+1 al bono de CA** más una **resistencia a un tipo de daño** propia de familia (`../game-design.md` §4b.10) |
| **Legendario** | **+2 al bono de CA** (el doble del Raro) y la resistencia de Épico **ampliada** a un segundo tipo |

**Ligeras 🥼** (familia: Cuero tachonado)

<!-- cards: armadura peso=ligera -->

| Armadura | Bono CA | Notas | Rareza |
|---|---|---|---|
| Cuero endurecido | +3 | — | Poco común |
| Piel de sombra | +4 | **+2** a la prueba de sigilo (`../characters/enemies.md` §2b) | Raro |
| Cuero de dragón curtido | +5 | +2 a sigilo · resistente a 🏹 Perforante | Épico |
| Manto del cazador eterno | +6 | +2 a sigilo · resistente a 🏹 Perforante y 🗡️ Cortante | Legendario |

**Medias 👕** (familia: Cota de escamas)

<!-- cards: armadura peso=media -->

| Armadura | Bono CA | Notas | Rareza |
|---|---|---|---|
| Escamas de wyvern | +5 | Desventaja para evitar detección | Poco común |
| Escamas silentes | +5 | **Sin** desventaja de sigilo — este escalón gasta su mejora en silenciarla en vez de en CA | Raro |
| Escamas del dragón joven | +6 | Sin desventaja de sigilo · resistente a 🔥 Fuego | Épico |
| Escamas del dragón ancestral | +7 | Sin desventaja de sigilo · resistente a 🔥 Fuego y ☀️ Radiante | Legendario |

**Pesadas 🧥** (familia: Cota de malla)

<!-- cards: armadura peso=pesada -->

| Armadura | Bono CA | Requisito | Notas | Rareza |
|---|---|---|---|---|
| Malla enana | +7 | FUE 13 | Desventaja para evitar detección | Poco común |
| Égida del centinela | +8 | FUE 13 | Desventaja para evitar detección | Raro |
| Coraza del último bastión | +9 | FUE 13 | Desventaja para evitar detección · resistente a 🗡️ Cortante | Épico |
| Muralla viviente | +10 | FUE 13 | Desventaja para evitar detección · resistente a 🗡️ Cortante y 🏹 Perforante | Legendario |

**Por qué existe esta tabla.** Todas las armaduras del catálogo eran **Común**, así que no había armadura que *encontrar* — y la CA es la palanca de supervivencia más directa que tiene el héroe. La **tabla de loot** (`../game-design.md` §7) necesita este contenido. Techo intencionado: la Égida del centinela deja al Guerrero en **CA 20** con escudo, contra la que un Élite (ataque +3) acierta 1 de cada 5 — es premio de final de partida, no de zona media (`../characters/enemies.md` §5c).

**Subir un escalón sin encontrarlo/comprarlo — reforjar en el Herrero:** además de salir como loot o compra, tu armadura concreta puede subir un escalón de esta misma tabla pagando al Herrero (`../game-design.md` §6d) — sin más requisito que el oro.

## 7. Próximos pasos

- [ ] Balancear los bonos al testear.
- [ ] Decidir si más armaduras pesadas penalizan el movimiento.
- [ ] Crear variantes mágicas (ligar con [`items.md`](items.md) §3) y asignar su Rareza.
- [x] Subconjunto del prototipo *(decidido)*: **Acolchada, Cuero, Cuero tachonado** (🥼), **Cota de escamas** (👕) y **Cota de malla** (🧥) — las de los kits iniciales (`../characters/heroes.md` §2d) más las tres familias con escalón de rareza en §6b.
- [x] Ampliar cada familia con variantes de rareza siguiendo la progresión de §6 → **§6b**: Cuero tachonado, Cota de escamas y Cota de malla cubren ya los 5 escalones (Épico/Legendario añaden resistencia a un tipo de daño por familia).
- [x] Enganchar la escalera de rareza con el **reforjado** *(decidido)* → §6b: el Herrero sube un escalón de esta tabla pagando oro, sin uso ni loot nuevo (`../game-design.md` §6d).
