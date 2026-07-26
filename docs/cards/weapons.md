# CardGame — Cartas: Armas

Catálogo de cartas de **Arma** (tipo/icono en [`../game-design.md`](../game-design.md) §3.2, Rareza en §3.3, reglas de manos ✋/🤲 en §2.4, tipos de daño 🗡️/🏹/🔨 en §4b.10, significado de todos los iconos en [`../glossary.md`](../glossary.md)). Índice de todas las cartas en [`README.md`](README.md). Los valores de abajo son un **primer pase sin balancear**, tomando D&D como base y adaptándolo al modelo de adyacencia/alcance en hexágonos (`../game-design.md` §4b). Las armas **no van en el Mazo**: son **equipo** que se equipa (llenan tus 2 manos, §2.4), con **colección ilimitada**, aparte del sistema de Mazo/Oteo (`../game-design.md` §4a).

## 1. Armas melee

*Columna Propiedades vacía a propósito — aparcada hasta que se revise el sistema de combate (§4b), ver checklist §6.*

<!-- cards: arma -->

| Arma | Manos | Daño | Tipo | Stat ataque | Propiedades | Rareza |
|---|---|---|---|---|---|---|
| Dagas | ✋ | 1d4 | 🏹 | FUE/DES (finesse) | — | Común |
| Espada | ✋ | 1d8 | 🗡️ | FUE | — | Común |
| Espada | 🤲 | 1d12 | 🗡️ | FUE | — | Común |
| Hacha | ✋ | 1d6 | 🗡️ | FUE | — | Común |
| Hacha | 🤲 | 1d12 | 🗡️ | FUE | — | Común |
| Lanza | 🤲 | 1d10 | 🏹 | FUE | — | Común |
| Maza | ✋ | 1d6 | 🔨 | FUE | — | Común |
| Maza bendita | ✋ | 1d6 | 🔨 | FUE/SAB | — | Común |

## 2. Armas a distancia

Alcance mínimo 2 hex — ninguna arma a distancia puede tener alcance 1, ese hueco ya es cuerpo a cuerpo (`../game-design.md` §4b.1). *Columna Propiedades vacía a propósito, ver nota de §1.*

<!-- cards: arma -->

| Arma | Manos | Daño | Tipo | Stat ataque | Alcance | Propiedades | Rareza |
|---|---|---|---|---|---|---|---|
| Arco | 🤲 | 1d8 | 🏹 | DES | 4 hex | — | Común |
| Ballesta pesada | 🤲 | 1d10 | 🏹 | DES | 5 hex | — | Común |
| Ballesta de mano | ✋ | 1d6 | 🏹 | DES | 3 hex | — | Común |
| Bastón de mago | ✋ | 1d6 | 🔨 | INT | 2 hex | — | Común |

## 3. Armas de soporte

<!-- cards: arma -->

| Arma | Manos | Efecto | Rareza |
|---|---|---|---|
| Libro de hechizos | ✋ | Foco arcano: **+1 a las tiradas y CD de tus hechizos** mientras lo empuñas (`../game-design.md` §4b.7). No hace daño. | Común |
| Símbolo sagrado | ✋ | Foco divino: **+1 a las tiradas y CD de tus hechizos** mientras lo empuñas (`../game-design.md` §4b.7). No hace daño. | Común |
| Antorcha | ✋ | **Ilumina:** mejora el rango de visión en localizaciones oscuras (Cueva/Mazmorra/Mina, `../board/board-map.md` §3b). No hace daño. | Común |
| Escudo | ✋ | **+2 a la Defensa/CA** mientras lo empuñas; ocupa 1 mano, combinable con cualquier armadura ([`armor.md`](armor.md) §5). No hace daño. | Común |

## 4. Reglas transversales

- **Stat de ataque:** FUE (armas pesadas), DES (ligeras finesse y a distancia), "FUE/DES" = usa el mejor de los dos mod. Los hechizos usan INT/SAB (`../game-design.md` §2.1).
- **Bastón de mago — daño físico en v1:** de momento hace daño 🔨 contundente, no 🔮 arcano. Los tipos de daño mágico se reservan para los hechizos de clase; cuando se desarrollen las subclases de mago y las debilidades elementales de los enemigos, el bastón podrá volver a un tipo de daño mágico.
- **Finesse/Ligera:** puede usarse con Destreza — beneficia al Pícaro ([`class.md`](class.md)).
- **Ninguna arma melee es arrojadiza** *(decidido)*: el hueco de "atacar sin estar adyacente" ya lo cubren las armas a distancia (§2); no se duplica con dagas/hachas lanzables.
- **Munición — infinita *(decidido)*:** las armas a distancia **no** gestionan munición; disparas sin límite. (Revisable si el balance pidiera introducir munición como recurso más adelante.)
- **Alcance (Lanza):** ataca a un enemigo a 2 hex en línea sin estar adyacente — útil con el modelo de adyacencia (`../game-design.md` §4b.1).
- **Recarga (Ballesta pesada):** solo 1 disparo por turno (no combina con un segundo disparo de Acción rápida).
- **Requisito de FUE:** las armas de 2 manos pesadas piden FUE 13; por debajo, **desventaja** en la tirada de ataque (el Mago FUE 8 no debería blandir un mandoble).

## 5. Progresión de rareza por familia *(política a futuro, decidido)*

Todas las armas del catálogo actual son **Común** — no hay todavía ninguna Poco común/Rara/Épica/Legendaria. A medida que se añadan más armas, la vía preferida **no** es meter armas nuevas sueltas, sino ampliar cada familia existente con variantes de rareza creciente y nombre propio en los tramos altos — mismo arma base, más potencia y más historia cuanto más rara. Ejemplo ilustrativo (Espada):

| Rareza | Nombre |
|---|---|
| Común | Espada |
| Poco común | Gran espada de acero |
| Épica | Hoja de hielo eterno |
| Legendaria | Excalibur |

Esto da progresión de loot dentro de un mismo arquetipo de arma en vez de una lista plana de armas todas parecidas. Aplica igual a Arma/Armadura/Item (Rareza general en `../game-design.md` §3.3).

## 6. Futuras implementaciones (fuera de la v1)

Aparcadero de cartas de **arma** concretas que se nos van ocurriendo pero que no entran en la primera versión del prototipo — mismo espíritu que [`../ideas.md`](../ideas.md), pero solo para cartas de arma ya bastante definidas (con nombre y efecto) en vez de ideas de sistema más abiertas. Se amplía esta tabla conforme surgen más, sin comprometerse a meterlas en la v1 todavía.

<!-- cards: arma -->

| Arma | Efecto | Rareza |
|---|---|---|
| Espada vorpal | Arma 🤲, 2d8 🗡️; con crítico (nat 20) **decapita**: muerte instantánea a enemigos no-jefe, daño masivo a jefes | Legendario |
| Bastón del poder | Foco arcano: +1 a tiradas y CD de hechizos y **+1 CA**; potencia las cartas de Mago | Épico |

## 7. Próximos pasos

- [ ] Balancear dados/alcances al testear en el prototipo.
- [x] Munición **infinita** *(decidido)*: sin recurso de munición en la v1 (§4).
- [ ] Decidir el subconjunto del prototipo (recomendado: Espada ✋, Hacha 🤲, Dagas, Arco, Bastón, Maza + Escudo).
- [ ] Ampliar cada familia de arma con variantes Poco común/Rara/Épica/Legendaria siguiendo la progresión de §5.
- [ ] Revisar §6 de vez en cuando y decidir si alguna de esas armas pasa ya a la v1.
