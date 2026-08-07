# CardGame — Cartas: Mercenarios

Carta de **Acción** que **invoca una ficha** de mercenario al tablero de batalla. Tiene **origen propio** (ni carta de clase ni equipo conseguido jugando): se **recluta** superando una prueba en una ficha del tablero, o se **compra** por oro a un NPC. Sistema de cartas en [`../game-design.md`](../game-design.md) §3, ficha y turno propio en [`../board/battle.md`](../board/battle.md) §5. NPCs en [`../characters/npcs.md`](../characters/npcs.md). Índice de cartas en [`README.md`](README.md). Valores = **primer pase sin balancear**.

## 1. Concepto

> **El mercenario es una ficha del tablero de batalla, no una carta de efecto** *(decidido 2026-08-06, revierte la versión anterior de este documento)*. Con el juego pasado a co-op de 1-4 héroes (`../characters/heroes.md` §4), la infraestructura de "una unidad más con estadísticas y turno propio" ya se paga igual para los héroes y para el bando enemigo (`../characters/enemies.md` §5b), así que el motivo original del descarte —"evitar la complejidad de un compañero completo"— dejó de aplicar.

- **La carta invoca, no ataca directamente:** jugarla gasta tu **Acción** principal del turno ([`../game-design.md`](../game-design.md) §4b.3) y, por la **regla madre** de §4, **vuelve al Mazo al invocar** (no al terminar la batalla) — el mercenario ya está en el tablero como ficha propia, así que no hace falta un tipo de carta nuevo para representarlo.
- **Ficha con bloque de combate derivado de su Rareza** (§1b): PV, CA, Movimiento, Iniciativa, Ataque y Figuras (número de ataques por turno) según la tabla de §1b — no un bloque escrito carta por carta.
- **Tope: 1 unidad de mercenario por jugador en el campo a la vez.**
- **Cuenta para el presupuesto de composición enemiga** (`../characters/enemies.md` §5b.6): invocar un mercenario suma **+1** al presupuesto del bando enemigo, igual que si entrara un jugador más a la batalla — sin esto, un jugador solo con mercenario dobla su poder sin que el enemigo escale.
- **Son ráfaga, no un aliado permanente en el sentido de "siempre disponible":** un mercenario de rareza alta **puede pegar más fuerte que un héroe** sin romper nada (ver tabla de §1b). Pagas esa potencia con un hueco de Mazo, un hueco de "en juego", la suerte del Oteo, **y con subir el presupuesto enemigo** — eso ya lo raciona, sin necesitar ningún tope propio de repetición (`class.md` §1).
- **Cuenta para el máximo del mazo:** ocupa un hueco del mazo personal como cualquier carta del Mazo (`../game-design.md` §4). Se puede **vender por oro al Capitán de mercenarios**, el mismo NPC que las vende (regla "cada NPC compra lo que vende", `../game-design.md` §6b.4) — a diferencia de una Maldición ([`curses.md`](curses.md)), que no se puede vender.
- **Usa Rareza:** (`../game-design.md` §3.3) marca su potencia; a mayor rareza, más fuerte su bloque.

### 1b. Ficha con bloque de combate por Rareza *(decidido 2026-08-06)*

Tabla única derivada de la Rareza — sin escribir un bloque de combate por carta, igual que hacen los enemigos con su Categoría (`../characters/enemies.md` §5b.1):

| Rareza | PV | CA | Mov | Ini | Ataque | Figuras* |
|---|---|---|---|---|---|---|
| Común | 10 | 12 | 2 | +1 | +2, 1d6+2 | 1 |
| Poco común | 14 | 13 | 2 | +1 | +3, 1d8+2 | 1 |
| Raro | 18 | 13 | 2 | +2 | +4, 1d10+2 | 1 |
| Épico | 24 | 14 | 2 | +2 | +4, 1d8+3 | 2 |
| Legendario | 30 | 15 | 2 | +3 | +5, 1d10+3 | 3 |

\* "Figuras" = cuántos ataques hace por turno, no cuántas vidas tiene — ya es lo que decían las cartas Épico/Legendario de §3 ("2 ataques a +4", "3 ataques a +5"); aquí se formaliza como columna de ficha.

Reglas de la ficha:
- **Tiran ataque como todo lo demás:** `1d20 + bono de la tabla` vs la **CA** del objetivo (`../game-design.md` §4b.4), con crítico simétrico (nat 20 dobla dados).
- **Alcance medido desde la ficha, no desde el héroe** *(cambia la versión anterior de §1b, consecuencia directa de tener ficha propia)*: melee exige adyacencia a **su** ficha; a distancia se mide en hexágonos **desde su posición** en el tablero de batalla.
- **1 ataque por turno, sin Acción rápida** (como los enemigos, `../characters/enemies.md` §5b.5).
- Familia **Soporte** (Aprendiz de sanador, Curandera errante, Chamán, Guardia de honor, Círculo de sanadores — §3): cura al **entrar**, eligiendo como objetivo **cualquier ficha aliada del tablero de batalla** (un héroe o un mercenario, de cualquier jugador — no solo el que lo invocó) con los valores ya escritos en §3; en las rondas siguientes su Acción es *Ayudar* (Ventaja al próximo ataque de un aliado a la misma elección libre) — si curara cada ronda valdría 5-6 veces lo que vale hoy y el combate sería imposible de perder.
- **Selección de objetivo, sin alcance para Soporte** *(decidido 2026-08-06)*: a diferencia de la fila de Ataque (adyacencia a **su** ficha, arriba), Soporte elige su objetivo entre **todas** las fichas aliadas visibles en el tablero, sin medir hexágonos — misma mecánica de "elegir objetivo al jugar la carta" que ya usan *Palabra sanadora* o *Escudo de fe* del Clérigo (`class.md` §5), sin el límite de "adyacente" que llevan esas dos.
- **Muerte:** a 0 PV la ficha cae; nada se pierde (la carta ya volvió al Mazo al invocar).

Motivo del cambio respecto a la tirada plana anterior: antes hacían **daño automático sin tirada** con un bono fijo por Rareza; eso seguía valiendo como aproximación de la tirada de ataque, pero ahora la ficha además **existe** en el tablero de batalla (puede ser objetivo de la IA, ocupa espacio, se mueve) — es una unidad más, no un efecto que se resuelve y desaparece.

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
| Mercenarios de las Llanuras | Accion | Melee | Un mercenario ataca a un enemigo adyacente a **su ficha**: **+2** al ataque, **1d6+2 🗡️** | Común |
| Arquero a sueldo | Accion | 4 hex | Disparo a distancia: **+2** al ataque, **1d6 🏹** | Común |
| Aprendiz de sanador | Accion | — | Cura a un aliado a elección en el tablero (héroe o mercenario, sin tirada, no es un ataque): recupera **1d4 PV** | Común |
| Bruto de taberna | Accion | Melee | **+3** al ataque, **1d8 🔨**; **+2 de daño** si el objetivo está por debajo del 50 % de PV | Poco común |
| Ballestero mercenario | Accion | 4 hex | Disparo a distancia: **+3** al ataque, **1d8 🏹** | Poco común |
| Curandera errante | Accion | — | Cura a un aliado a elección en el tablero: recupera **1d8 PV** (sin tirada, no es un ataque) | Poco común |
| Espadachín veterano | Accion | Melee | **+4** al ataque **con ventaja** ([`../effects.md`](../effects.md)), **1d10 🗡️** | Raro |
| Francotirador de las brumas | Accion | 5 hex | Disparo a distancia: **+4** al ataque **con ventaja** si el objetivo no te ha detectado (`../characters/enemies.md` §2b), **1d8 🏹** | Raro |
| Chamán de la tribu | Accion | — | Cura a un aliado a elección en el tablero: recupera **2d8 PV** y retira un estado negativo leve (Envenenado o Ralentizado, [`../effects.md`](../effects.md)) | Raro |
| Compañía de la Grifa Negra | Accion | Melee | Dos mercenarios atacan: **2 ataques a +4**, **1d8 🗡️** cada uno, repartidos entre uno o dos enemigos adyacentes a **su ficha** | Épico |
| Compañía de arqueros del alba | Accion | 5 hex | Dos mercenarios disparan: **2 ataques a +4**, **1d8 🏹** cada uno, repartidos entre uno o dos enemigos | Épico |
| Guardia de honor | Accion | — | Cura a un aliado a elección en el tablero: recupera **2d8 PV** y gana **Escudado +2 CA** ([`../effects.md`](../effects.md)) durante 2 turnos | Épico |
| La Legión del Ocaso | Accion | Melee | Tres mercenarios atacan: **3 ataques a +5**, **1d10 🗡️** cada uno, repartidos entre uno o dos enemigos adyacentes a **su ficha** | Legendario |
| La Horda de flechas incesantes | Accion | 6 hex | Tres mercenarios disparan: **3 ataques a +5**, **1d10 🏹** cada uno, repartidos entre uno o dos enemigos | Legendario |
| Círculo de sanadores ancestral | Accion | — | Cura a un aliado a elección en el tablero: recupera **4d8 PV**, retira todos los estados negativos y gana **Escudado +3 CA** durante 2 turnos | Legendario |

- **El efecto escala con la Rareza** (mismo espíritu que la progresión por familia de [`weapons.md`](weapons.md) §5 / [`armor.md`](armor.md) §6): a mayor rareza, más daño, mejor bono de ataque y más efecto.
- Los mercenarios **usan los valores fijos de su bloque** (§1b), no tus estadísticas — no dependen de tu FUE/DES ni se benefician de tus armas. Cada uno lleva **su tipo de daño** (🗡️🏹🔨…) que se compara con la Naturaleza del objetivo (`../game-design.md` §4b.10, [`../characters/enemies.md`](../characters/enemies.md) §3b) como cualquier ataque.
- **Su alcance se mide desde su ficha** *(corregido — antes decía "desde tu hexágono"; §1b)*: la columna Alcance de esta tabla sigue diciendo qué familia es (melee / N hex / soporte sin objetivo), pero ahora se mide desde donde está la ficha del mercenario en el tablero de batalla, no desde el héroe que lo invocó.
- **Familia Soporte, sin fila de Ataque en §1b:** usa PV/CA/Mov/Ini de su Rareza igual que las demás (existe como ficha, puede ser objetivo de la IA), pero su Acción no es atacar: es la curación/asistencia que ya dice esta tabla.
- **Discrepancia pendiente de reconciliar (no inventada aquí, dejada para el pase de balance):** la tabla de §1b da el mismo `Ataque` a melee y a distancia dentro de la misma Rareza; este catálogo, escrito antes, sigue dando **menos dado y sin el mod de daño** a las filas de distancia (ej. Común: melee `+2, 1d6+2` vs distancia `+2, 1d6`). Las filas Épico/Legendario (2-3 ataques) ya casan con la columna Figuras de §1b. Se deja la discrepancia visible en vez de igualarla a ojo — se cierra jugando, como el resto de cifras de este documento.

## 3b. Familias por alcance — reforjar *(ver `../game-design.md` §6d)*

Para que el Capitán de mercenarios pueda **reforjar** una carta (subirla un escalón de Rareza pagando oro, sin más requisito — `../game-design.md` §6d), el catálogo de §3 se agrupa en familias por alcance, igual que Arma/Armadura se agrupan por familia de pieza. Las **tres familias cubren ya los 5 escalones de punta a punta**:

| Rareza | Melee | Distancia | Soporte |
|---|---|---|---|
| Común | Mercenarios de las Llanuras | Arquero a sueldo | Aprendiz de sanador |
| Poco común | Bruto de taberna | Ballestero mercenario | Curandera errante |
| Raro | Espadachín veterano | Francotirador de las brumas | Chamán de la tribu |
| Épico | Compañía de la Grifa Negra | Compañía de arqueros del alba | Guardia de honor |
| Legendario | La Legión del Ocaso | La Horda de flechas incesantes | Círculo de sanadores ancestral |

## 4. Próximos pasos

- [x] Definir **alcance** (melee / a distancia, medido desde su ficha) y si tiran ataque → §1b: **sí tiran**, `1d20 + bono por rareza` vs CA. Falta balancear.
- [x] **¿El mercenario es carta de efecto o ficha del tablero?** *(reabierto y resuelto 2026-08-06)* → **ficha**, con bloque de combate por Rareza (§1b), invocada por la carta (que vuelve al Mazo al invocar). Cuenta +1 al presupuesto de composición enemiga (`../characters/enemies.md` §5b.6).
- [ ] Balancear dados/bonos por rareza y la CD de reclutamiento (§2a).
- [x] Decidir si los mercenarios más potentes (Épico/Legendario) pasan a uso **1/combate** → **no hace falta** *(decidido)*: la regla madre de `../game-design.md` §4 (jugar la carta gasta la preparación) ya los raciona al ritmo del Oteo, así que su potencia por encima del ataque del héroe es intencionada y no acumulable (§1). *(El tope `1/combate` en sí se eliminó después de todo el juego — `class.md` §1 — así que esta decisión queda superada por esa más general: ningún mercenario lo lleva ni falta hace.)*
- [x] Definir el NPC concreto que los vende (§2b) y su stock/rotación → **Capitán de mercenarios**, **2 cartas** sorteadas al empezar el capítulo y fijas hasta el siguiente (`../characters/npcs.md` §3).
- [x] **Objetivo de la familia Soporte** *(decidido 2026-08-06)* → §1b: cualquier ficha aliada del tablero (héroe o mercenario, de cualquier jugador), sin restricción de adyacencia — antes solo curaba "a ti" (el invocador), texto que no se había actualizado tras el paso a ficha propia.
- [ ] Decidir si una ficha ofrece un mercenario de rareza fija o aleatoria.
- [ ] Cuando quieras, ampliar el catálogo (§3) con más compañías y variantes de rareza.
- [x] Enganchar el catálogo con el **reforjado** *(decidido)* → §3b: las tres familias (Melee, Distancia, Soporte) cubren ya los 5 escalones de punta a punta (`../game-design.md` §6d.4).
