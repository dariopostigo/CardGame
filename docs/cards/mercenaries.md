# CardGame — Cartas: Mercenarios

Carta de **Acción** que representa a una compañía de mercenarios a tu servicio. Tiene **origen propio** (ni carta de clase ni equipo conseguido jugando): se **recluta** superando una prueba en una ficha del tablero, o se **compra** por oro a un NPC. Sistema de cartas en [`../game-design.md`](../game-design.md) §3, economía de acción de combate en §4b.3. NPCs en [`../characters/npcs.md`](../characters/npcs.md). Índice de cartas en [`README.md`](README.md). Valores = **primer pase sin balancear**.

## 1. Concepto

- **Todo es una carta:** en vez de simular un segundo personaje con estadísticas y mazo propios, un mercenario es una **carta de tipo Acción** que va a tu mazo personal. Con un solo héroe en el prototipo ([`../characters/heroes.md`](../characters/heroes.md)), te da "acciones de aliado" sin la complejidad de un compañero completo.
- **Cuesta la Acción y gasta la preparación:** dar la orden gasta tu **Acción** principal del turno ([`../game-design.md`](../game-design.md) §4b.3) y, por la **regla madre** de §4, la carta **vuelve al Mazo**: para volver a llamarlos tiene que **salirte otra vez en un Oteo**. *(Este punto decía antes "un aliado al que das la orden una vez por turno" — era texto anterior a que se cerrara §4 y **no es la regla**.)*
- **Son ráfaga, no un aliado permanente *(consecuencia buscada)*:** por eso un mercenario de rareza alta **puede pegar más fuerte que tú** sin romper nada (la Compañía de la Grifa Negra hace ~5,4 de daño por turno frente a los ~5,9 del Guerrero **cada** turno). Pagas esa potencia con un hueco de Mazo, un hueco de "en juego" y la suerte del Oteo. Esto también responde a la duda de §4 de si los Épicos deberían pasar a `1/combate`: **no hace falta**, el propio Oteo ya los raciona.
- **Cuenta para el máximo del mazo:** ocupa un hueco del mazo personal como cualquier carta del Mazo (`../game-design.md` §4). Se puede **vender por oro al Capitán de mercenarios**, el mismo NPC que las vende (regla "cada NPC compra lo que vende", `../game-design.md` §6b.4) — a diferencia de una Maldición ([`curses.md`](curses.md)), que no se puede vender.
- **Usa Rareza:** (`../game-design.md` §3.3) marca su potencia; a mayor rareza, más fuerte el efecto.

### 1b. Alcance: el mercenario no es una ficha del tablero *(decidido)*

Un mercenario **no ocupa un hexágono** ni se mueve por el mapa: es una carta de acción, igual que una carta de clase. Por tanto **su alcance se mide desde tu hexágono**, exactamente como si atacaras tú.

| Alcance | Requisito | Ejemplos |
|---|---|---|
| **Melee** | Enemigo **adyacente a ti** (mismo requisito que tu propio ataque cuerpo a cuerpo, `../game-design.md` §4b.1) | Mercenarios de las Llanuras, Bruto, Espadachín, Grifa Negra |
| **A distancia (N hex)** | Enemigo dentro de N hexágonos **desde tu posición**, con el mínimo de 2 hex de todo ataque a distancia (§4b.1) | Arquero a sueldo (4 hex) |
| **—** | Sin objetivo enemigo: te afecta a ti o a un aliado | Curandera errante |

**Tiran ataque como todo lo demás *(decidido)*:** `1d20 + bono fijo` vs la **CA** del objetivo (`../game-design.md` §4b.4), con el bono según Rareza:

| Rareza | Bono de ataque |
|---|---|
| Común | +2 |
| Poco común | +3 |
| Raro / Épico | +4 |

Motivo: antes hacían **daño automático sin tirada**, y como jugar la carta cuesta la **misma Acción** que atacar tú —que sí puedes fallar—, el mercenario era estrictamente mejor que tu propio ataque en todos los casos. Con tirada quedan dentro de la misma matemática que héroes y enemigos. *(Si al balancear se prefiere volver al daño garantizado, la compensación sería bajarles el dado un escalón para pagar la certeza.)*

## 2. Cómo se consiguen

Dos vías, con el mismo trade-off que el resto del juego (gratis-pero-arriesgado vs. seguro-pero-caro):

### 2a. Reclutar — prueba en una ficha del tablero *(vía arriesgada, gratis)*

1. Interactúas con una **ficha ambigua** (Amenaza o Exploración, [`../board/board-map.md`](../board/board-map.md) §4). El mazo de encuentro revela el Suceso **"Mercenarios"** ([`encounter.md`](encounter.md) §4).
2. Haces una prueba de **Carisma: `1d20 + mod CAR` vs CD 12** (Carisma gobierna el trato con NPCs y esta prueba de reclutamiento, `../game-design.md` §2.1). **No hay límite** de cuántos mercenarios llevas más allá del tope del mazo personal (`../game-design.md` §4).
   - **Éxito** → ganas una carta de Mercenario (rareza según lo que dicte la ficha / §3). Se añade a tu mazo.
   - **Fallo** → la negociación se tuerce y **la ficha se convierte en enemigo**: se roba 1 carta de **Combate** ([`encounter.md`](encounter.md) §3) y empieza el combate (`../game-design.md` §4b).

### 2b. Comprar — NPC *(vía segura, cuesta oro)*

- El **Capitán de mercenarios** (aparece **solo en Pueblos** — [`../characters/npcs.md`](../characters/npcs.md)) **compra y vende cartas de Mercenario por oro** según su Rareza (`../game-design.md` §6b.3-6b.4). Es el **único** NPC que las trata (el Mercader solo lleva Items). Sin prueba ni riesgo: la alternativa cara y segura a reclutarlas.

## 3. Catálogo (boceto)

<!-- cards: mercenario -->

| Mercenario | Tipo | Alcance | Efecto | Rareza |
|---|---|---|---|---|
| Mercenarios de las Llanuras | Acción | Melee | Un mercenario ataca a un enemigo adyacente a ti: **+2** al ataque, **1d6+2 🗡️** | Común |
| Arquero a sueldo | Acción | 4 hex | Disparo a distancia: **+2** al ataque, **1d6 🏹** | Común |
| Bruto de taberna | Acción | Melee | **+3** al ataque, **1d8 🔨**; **+2 de daño** si el objetivo está por debajo del 50 % de PV | Poco común |
| Curandera errante | Acción | — | Los mercenarios te asisten: recuperas **1d8 PV** (sin tirada, no es un ataque) | Poco común |
| Espadachín veterano | Acción | Melee | **+4** al ataque **con ventaja** ([`../effects.md`](../effects.md)), **1d10 🗡️** | Raro |
| Compañía de la Grifa Negra | Acción | Melee | Dos mercenarios atacan: **2 ataques a +4**, **1d8 🗡️** cada uno, repartidos entre uno o dos enemigos adyacentes a ti | Épico |

- **El efecto escala con la Rareza** (mismo espíritu que la progresión por familia de [`weapons.md`](weapons.md) §5 / [`armor.md`](armor.md) §6): a mayor rareza, más daño, mejor bono de ataque y más efecto.
- Los mercenarios **usan los valores fijos de su carta**, no tus estadísticas — no dependen de tu FUE/DES ni se benefician de tus armas. Cada uno lleva **su tipo de daño** (🗡️🏹🔨…) que se compara con la Naturaleza del objetivo (`../game-design.md` §4b.10, [`../characters/enemies.md`](../characters/enemies.md) §3b) como cualquier ataque.
- **Su alcance se mide desde tu hexágono** (§1b): no hay ficha de mercenario en el tablero que posicionar.

## 4. Próximos pasos

- [x] Definir **alcance** (melee / a distancia, medido desde tu hexágono) y si tiran ataque → §1b: **sí tiran**, `1d20 + bono por rareza` vs CA. Falta balancear.
- [ ] Balancear dados/bonos por rareza y la CD de reclutamiento (§2a).
- [x] Decidir si los mercenarios más potentes (Épico/Legendario) pasan a uso **1/combate** → **no hace falta** *(decidido)*: la regla madre de `../game-design.md` §4 (jugar la carta gasta la preparación) ya los raciona al ritmo del Oteo, así que su potencia por encima del ataque del héroe es intencionada y no acumulable (§1).
- [x] Definir el NPC concreto que los vende (§2b) y su stock/rotación → **Capitán de mercenarios**, **2 cartas** sorteadas al empezar el capítulo y fijas hasta el siguiente (`../characters/npcs.md` §3).
- [ ] Decidir si una ficha ofrece un mercenario de rareza fija o aleatoria.
- [ ] Cuando quieras, ampliar el catálogo (§3) con más compañías y variantes de rareza.
