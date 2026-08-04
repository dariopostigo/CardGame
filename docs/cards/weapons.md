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
| Antorcha | ✋ | **Ilumina:** mejora el rango de visión en sitios oscuros (el terreno **Mazmorra**, `../board/board-map.md` §3a; y la Mina cuando llegue, §3b). No hace daño. | Común |
| Escudo | ✋ | **+2 a la Defensa/CA** mientras lo empuñas; ocupa 1 mano, combinable con cualquier armadura ([`armor.md`](armor.md) §5). No hace daño. | Común |

## 4. Reglas transversales

- **Stat de ataque:** FUE (armas pesadas), DES (finesse y a distancia), "FUE/DES" = usa el mejor de los dos mod. Los hechizos usan INT/SAB (`../game-design.md` §2.1).
- **No existe la propiedad "Ligera" *(decidido)*.** La columna **Manos ✋/🤲** hace ese trabajo, y la columna *Propiedades* sigue vacía a propósito (§1). Había **dos reglas** colgando de una propiedad que no estaba en ninguna tabla —el segundo ataque de dual-wield (`../game-design.md` §4b.3) y *Ataque furtivo* del Pícaro ([`class.md`](class.md) §4)—, así que **ninguna de las dos podía dispararse nunca**. Las dos se reescribieron para leer ✋/🤲 o "a distancia".
- **Ataque secundario (`../game-design.md` §4b.3):** con la Acción rápida puedes atacar otra vez con lo que lleves puesto. Con **dos armas ✋** (una por mano) el segundo ataque usa la otra arma **y suma el mod de la stat**; con **una sola arma** (✋ con escudo o mano libre, o 🤲) es un segundo golpe con la misma arma **sin el mod**. Así el **escudo** (+2 CA, §3) y las **dos armas** son elecciones distintas y no una sola óptima.
- **A bocajarro (`../game-design.md` §4b.1):** las armas a distancia **sí** pueden atacar a un enemigo adyacente, con **Desventaja** ([`../effects.md`](../effects.md)). El alcance mínimo de 2 hex de §2 es el alcance *eficaz*, no una prohibición — importa sobre todo para el **Bastón de mago** (alcance 2), que sin esta regla dejaba al Mago sin ningún ataque posible en melee.
- **Bastón de mago — daño físico en v1:** de momento hace daño 🔨 contundente, no 🔮 arcano. Los tipos de daño mágico se reservan para los hechizos de clase; cuando se desarrollen las subclases de mago y las debilidades elementales de los enemigos, el bastón podrá volver a un tipo de daño mágico.
- **Finesse/Ligera:** puede usarse con Destreza — beneficia al Pícaro ([`class.md`](class.md)).
- **Ninguna arma melee es arrojadiza** *(decidido)*: el hueco de "atacar sin estar adyacente" ya lo cubren las armas a distancia (§2); no se duplica con dagas/hachas lanzables.
- **Munición — infinita *(decidido)*:** las armas a distancia **no** gestionan munición; disparas sin límite. (Revisable si el balance pidiera introducir munición como recurso más adelante.)
- **Alcance (Lanza):** ataca a un enemigo a 2 hex en línea sin estar adyacente — útil con el modelo de adyacencia (`../game-design.md` §4b.1).
- **Recarga (Ballesta pesada):** solo 1 disparo por turno — es la **única excepción** al ataque secundario (`../game-design.md` §4b.3). Es su precio por ser el arma de más daño a distancia (1d10, 5 hex).
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

### 5b. Escalones del prototipo *(decidido)*

**Regla de derivación** — cada escalón de rareza mantiene el dado y las manos de su familia y añade:

| Rareza | Qué gana sobre la Común |
|---|---|
| **Poco común** | **+1 al daño** |
| **Raro** | **+1 al ataque y +1 al daño** |
| **Épico** | Lo del Raro **más una propiedad propia de familia** (tabla de abajo) |
| **Legendario** | **+2 al ataque y +2 al daño** (el doble del Raro) **más la propiedad de Épico, ampliada** |

Cada pieza hereda **manos, dado, tipo de daño y stat de ataque** de su familia de §1-§2; aquí solo se listan las mejoras.

<!-- cards: arma -->

| Arma | Familia | Manos | Daño | Tipo | Mejora | Rareza |
|---|---|---|---|---|---|---|
| Espada de acero enano | Espada | ✋ | 1d8 | 🗡️ | +1 al daño | Poco común |
| Filo del juramento | Espada | ✋ | 1d8 | 🗡️ | +1 al ataque y +1 al daño | Raro |
| Hoja de hielo eterno | Espada | ✋ | 1d8 | 🗡️ | +1 al ataque y +1 al daño · al impactar, el objetivo pierde 1 de Movimiento ese turno (frío que entumece) | Épico |
| Excalibur | Espada | ✋ | 1d8 | 🗡️ | +2 al ataque y +2 al daño · crítico también con natural **19-20** (`../game-design.md` §4b.4) | Legendario |
| Hacha de guerra orlada | Hacha | 🤲 | 1d12 | 🗡️ | +1 al daño | Poco común |
| Hendedora de cráneos | Hacha | 🤲 | 1d12 | 🗡️ | +1 al ataque y +1 al daño | Raro |
| Furia del berserker | Hacha | 🤲 | 1d12 | 🗡️ | +1 al ataque y +1 al daño · por debajo del 50 % de tus PV, **+1d6** de daño extra | Épico |
| Fin de todas las cosas | Hacha | 🤲 | 1d12 | 🗡️ | +2 al ataque y +2 al daño · crítico también con natural **19-20** | Legendario |
| Dagas del alba | Dagas | ✋ | 1d4 | 🏹 | +1 al daño | Poco común |
| Colmillos gemelos | Dagas | ✋ | 1d4 | 🏹 | +1 al ataque y +1 al daño | Raro |
| Colmillos del asesino silencioso | Dagas | ✋ | 1d4 | 🏹 | +1 al ataque y +1 al daño · **ventaja** en el primer ataque de cada combate | Épico |
| Susurro de la muerte | Dagas | ✋ | 1d4 | 🏹 | +2 al ataque y +2 al daño · crítico también con natural **19-20** | Legendario |
| Maza estrellada | Maza | ✋ | 1d6 | 🔨 | +1 al daño | Poco común |
| Yugo del penitente | Maza | ✋ | 1d6 | 🔨 | +1 al ataque y +1 al daño | Raro |
| Martillo del juicio final | Maza | ✋ | 1d6 | 🔨/☀️ | +1 al ataque y +1 al daño · contra Naturaleza No-muerto (`../characters/enemies.md` §3b), el daño pasa a ☀️ radiante | Épico |
| Voluntad divina | Maza | ✋ | 1d6 | 🔨 | +2 al ataque y +2 al daño · crítico también con natural **19-20** | Legendario |
| Arco largo de tejo | Arco | 🤲 | 1d8 | 🏹 | +1 al daño · alcance 4 hex | Poco común |
| Susurro del bosque | Arco | 🤲 | 1d8 | 🏹 | +1 al ataque y +1 al daño · alcance **5 hex** | Raro |
| Arco del viento cortante | Arco | 🤲 | 1d8 | 🏹 | +1 al ataque y +1 al daño · alcance **6 hex** | Épico |
| Lluvia de flechas eternas | Arco | 🤲 | 1d8 | 🏹 | +2 al ataque y +2 al daño · alcance **7 hex** · el ataque secundario (`../game-design.md` §4b.3) conserva el mod de la stat | Legendario |
| Ballesta de gatillo fino | Ballesta de mano | ✋ | 1d6 | 🏹 | +1 al daño · alcance 3 hex | Poco común |
| Aguijón de bolsillo | Ballesta de mano | ✋ | 1d6 | 🏹 | +1 al ataque y +1 al daño · alcance **4 hex** | Raro |
| Colmillo de víbora | Ballesta de mano | ✋ | 1d6 | 🏹 | +1 al ataque y +1 al daño · alcance **5 hex** · el impacto aplica **Envenenado** leve (`../effects.md`) | Épico |
| Beso de la reina araña | Ballesta de mano | ✋ | 1d6 | 🏹 | +2 al ataque y +2 al daño · alcance **6 hex** · el impacto aplica **Envenenado** (salvación CON CD 14) | Legendario |
| Bastón nudoso | Bastón de mago | ✋ | 1d6 | 🔨 | +1 al daño · alcance 2 hex | Poco común |
| Bastón de las mareas | Bastón de mago | ✋ | 1d6 | 🔨 | +1 al ataque y +1 al daño · alcance 2 hex · foco arcano **+1** (§3) | Raro |
| Bastón del poder | Bastón de mago | ✋ | 1d6 | 🔨 | +1 al ataque y +1 al daño · alcance 2 hex · foco arcano **+1** y **+1 CA** mientras lo empuñas | Épico |
| Cetro de la tormenta arcana | Bastón de mago | ✋ | 1d6 | 🔨 | +2 al ataque y +2 al daño · alcance 2 hex · foco arcano **+2** y **+1 CA** | Legendario |

**Por qué existe esta tabla.** Todo el catálogo anterior era **Común**, así que la premisa de los kits iniciales —*"el equipo bueno es la recompensa de explorar"* ([`../characters/heroes.md`](../characters/heroes.md) §2d)— **no tenía nada a lo que aspirar**: la única mejora real de daño era pasar a un arma 🤲 y perder el escudo. La **tabla de loot** (pendiente en `../game-design.md` §7) necesita este contenido para poder apuntar a algo; con la regla de derivación, sortear botín es elegir **familia + rareza**.

Efecto medido: el Guerrero con *Filo del juramento* pasa de ~5,9 a ~7,8 de daño por turno (**+32 %**) — un premio que se nota sin romper la ventana de 5-6 turnos del boss (`../characters/enemies.md` §5b.3).

**Subir un escalón sin encontrarlo/comprarlo — reforjar en el Herrero:** además de salir como loot o compra, tu arma concreta puede subir un escalón de esta misma tabla pagando al Herrero (`../game-design.md` §6d) — sin más requisito que el oro.

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
- [x] Subconjunto del prototipo *(decidido)*: **Espada ✋, Hacha 🤲, Dagas ✋, Arco 🤲, Ballesta de mano ✋, Bastón ✋, Maza ✋ + Escudo**, más los focos (Libro, Símbolo) y la Antorcha — las 7 familias con escalón de rareza en §5b, que son también las que salen en los kits iniciales (`../characters/heroes.md` §2d).
- [x] Ampliar cada familia con variantes de rareza siguiendo la progresión de §5 → **§5b**: las 7 familias del prototipo cubren ya los 5 escalones (Poco común +1 daño, Raro +1 ataque y daño, Épico propiedad de familia, Legendario +2/+2 y la propiedad ampliada).
- [x] Retirar la propiedad **"Ligera"**, que no existía y de la que colgaban dos reglas *(decidido)* → §4.
- [x] Enganchar la escalera de rareza con el **reforjado** *(decidido)* → §5b: el Herrero sube un escalón de esta tabla pagando oro, sin uso ni loot nuevo (`../game-design.md` §6d).
- [ ] Revisar §6 de vez en cuando y decidir si alguna de esas armas pasa ya a la v1.
