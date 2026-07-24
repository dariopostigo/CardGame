# CardGame — Cartas: Mercenarios

Carta de **Acción** que representa a una compañía de mercenarios a tu servicio. Tiene **origen propio** (ni carta de clase ni equipo drafteado): se **recluta** superando una prueba en una ficha del tablero, o se **compra** por oro a un NPC. Sistema de cartas en [`../game-design.md`](../game-design.md) §3, economía de acción de combate en §4b.3. NPCs en [`../characters/npcs.md`](../characters/npcs.md). Índice de cartas en [`README.md`](README.md). Valores = **primer pase sin balancear**.

## 1. Concepto

- **Todo es una carta:** en vez de simular un segundo personaje con estadísticas y mazo propios, un mercenario es una **carta de tipo Acción** que va a tu mazo personal. Con un solo héroe en el prototipo ([`../characters/heroes.md`](../characters/heroes.md)), te da "acciones de aliado" sin la complejidad de un compañero completo.
- **Reutilizable, cuesta la Acción:** jugar la carta gasta tu **Acción** principal del turno ([`../game-design.md`](../game-design.md) §4b.3). Como cualquier carta del mazo personal, **no se consume** al jugarla (§4): vuelve a estar disponible. Es, en la práctica, un aliado al que "das la orden" una vez por turno.
- **Cuenta para el máximo del mazo:** ocupa un hueco del mazo personal como el equipo (`../game-design.md` §4). Se puede **vender por oro** (desagüe del exceso de mazo, §6b.4) igual que el equipo — a diferencia de una Maldición ([`curses.md`](curses.md)), que no se puede vender.
- **Usa Rareza:** (`../game-design.md` §3.3) marca su potencia; a mayor rareza, más fuerte el efecto.

## 2. Cómo se consiguen

Dos vías, con el mismo trade-off que el resto del juego (gratis-pero-arriesgado vs. seguro-pero-caro):

### 2a. Reclutar — prueba en una ficha del tablero *(vía arriesgada, gratis)*

1. Interactúas con una **ficha ambigua** (Amenaza o Exploración, [`../board/board-map.md`](../board/board-map.md) §4). El mazo de encuentro revela el Suceso **"Mercenarios"** ([`encounter.md`](encounter.md) §4).
2. Haces una prueba de **Carisma: `1d20 + mod CAR` vs CD 12** (Carisma gobierna el trato con NPCs y esta prueba de reclutamiento, `../game-design.md` §2.1). **No hay límite** de cuántos mercenarios llevas más allá del tope del mazo personal (`../game-design.md` §4).
   - **Éxito** → ganas una carta de Mercenario (rareza según lo que dicte la ficha / §3). Se añade a tu mazo.
   - **Fallo** → la negociación se tuerce y **la ficha se convierte en enemigo**: se roba 1 carta de **Combate** ([`encounter.md`](encounter.md) §3) y empieza el combate (`../game-design.md` §4b).

### 2b. Comprar — NPC *(vía segura, cuesta oro)*

- El **Capitán de mercenarios** (aparece **solo en Pueblos** — [`../characters/npcs.md`](../characters/npcs.md)) **vende cartas de Mercenario por oro** según su Rareza (`../game-design.md` §6b.3). Es el **único** NPC que las vende (el Mercader solo vende Items). Sin prueba ni riesgo: la alternativa cara y segura a reclutarlas.

## 3. Catálogo (boceto)

| Mercenario | Coste | Efecto | Rareza |
|---|---|---|---|
| Mercenarios de las Llanuras | Acción | Un mercenario ataca a un enemigo adyacente: **1d6+2 🗡️** | Común |
| Arquero a sueldo | Acción | Disparo a distancia (alcance 4 hex): **1d6 🏹** | Común |
| Bruto de taberna | Acción | Ataque melee **1d8 🔨**; **+2 de daño** si el objetivo está por debajo del 50 % de PV | Poco común |
| Curandera errante | Acción | Los mercenarios te asisten: recuperas **1d8 PV** | Poco común |
| Espadachín veterano | Acción | Ataque melee **1d10 🗡️ con ventaja** ([`../effects.md`](../effects.md)) | Raro |
| Compañía de la Grifa Negra | Acción | Dos mercenarios atacan: **2× (1d8 🗡️)** repartidos entre uno o dos enemigos | Épico |

- **El efecto escala con la Rareza** (mismo espíritu que la progresión por familia de [`weapons.md`](weapons.md) §5 / [`armor.md`](armor.md) §6): a mayor rareza, más daño/efecto.
- Los mercenarios **atacan con el valor fijo de su carta**, no con tus estadísticas — no dependen de tu FUE/DES. Cada uno lleva **su tipo de daño** (🗡️🏹🔨…) que se compara con la Naturaleza del objetivo (`../game-design.md` §4b.10, [`../characters/enemies.md`](../characters/enemies.md) §3b) como cualquier ataque.

## 4. Próximos pasos

- [ ] Balancear dados/bonos por rareza y la CD de reclutamiento (§2a).
- [ ] Decidir si los mercenarios más potentes (Épico/Legendario) pasan a uso **1/combate** en vez de reutilizable, como palanca de balance.
- [ ] Definir el NPC concreto que los vende (§2b) y su stock/rotación (`../characters/npcs.md`).
- [ ] Decidir si una ficha ofrece un mercenario de rareza fija o aleatoria.
- [ ] Cuando quieras, ampliar el catálogo (§3) con más compañías y variantes de rareza.
