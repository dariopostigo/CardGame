# CardGame — Cartas: Armaduras

Catálogo de cartas de **Armadura** (tipo/icono en [`../game-design.md`](../game-design.md) §3.2, Rareza en §3.3; solo 1 equipada a la vez, §2.4). Índice de cartas en [`README.md`](README.md). Valores = **primer pase sin balancear**, base D&D.

## 1. Fórmula de CA por peso *(decidido — resuelve la duda de `../game-design.md` §2)*

La Destreza aporta a la Defensa/CA distinto según el peso de la armadura:

| Peso | Fórmula de CA |
|---|---|
| **Ligera** | `10 + mod DES + bono` (Destreza completa) |
| **Media** | `10 + min(mod DES, +2) + bono` (Destreza limitada a +2) |
| **Pesada** | `10 + bono` (sin Destreza) |

## 2. Ligeras (Destreza completa)

| Armadura | Bono CA | Notas | Rareza |
|---|---|---|---|
| Acolchada | +1 | — | Común |
| Cuero | +1 | — | Común |
| Cuero tachonado | +2 | — | Común |

## 3. Medias (Destreza máx. +2)

| Armadura | Bono CA | Notas | Rareza |
|---|---|---|---|
| Pieles | +2 | — | Común |
| Cota de escamas | +4 | Desventaja para evitar detección (ruidosa) | Poco común |
| Media cota | +5 | Desventaja para evitar detección | Poco común |

## 4. Pesadas (sin Destreza)

| Armadura | Bono CA | Requisito | Notas | Rareza |
|---|---|---|---|---|
| Cota de anillas | +4 | — | Desventaja para evitar detección | Común |
| Coraza | +5 | — | Protege el torso; algo menos ruidosa | Poco común |
| Cota de malla | +6 | FUE 13 | Desventaja para evitar detección | Poco común |
| Placas | +8 | FUE 15 | Desventaja para evitar detección; −1 movimiento si no cumples FUE | Raro |

## 5. Reglas transversales

- Solo **1 armadura** equipada (`../game-design.md` §2.4). El **Escudo** ([`weapons.md`](weapons.md)) es aparte: +2 CA, ocupa 1 mano, combinable con cualquier armadura.
- **Evitar detección:** las armaduras ruidosas dan **desventaja** cuando intentas no ser detectado por enemigos (`../enemies.md` §2). El sigilo pesa contra el blindaje — coherente con Pícaro (ligera) vs. Guerrero (pesada, tanque que no se esconde).
- **Ejemplos de CA:** Guerrero (DES +1) con Cota de malla = `10 + 6` = **16** (+2 de escudo = **18**). Mago (DES +2) sin armadura = **12**; con Cuero = **13**.

## 6. Próximos pasos

- [ ] Balancear los bonos al testear.
- [ ] Decidir si más armaduras pesadas penalizan el movimiento.
- [ ] Crear variantes mágicas (ligar con [`items.md`](items.md) §3).
- [ ] Subconjunto del prototipo (recomendado 1 por peso: Cuero, Cota de escamas, Cota de malla).
