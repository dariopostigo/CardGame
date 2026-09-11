# Estado del diseño — V3

Qué está decidido, qué falta y qué falta balancear. Es el documento que se mira primero para saber por dónde va el trabajo.

**Arranque de V3: 20 de agosto de 2026**, cuando el árbol se partió en [v2](../v2/) (congelado) y v3 (vigente).

## 1. Estado general

| Bloque | Estado |
|---|---|
| Razas, clases y unidades | **Definido** — 11 razas, 4 clases y 8 unidades cada una ([razas/](razas/)) |
| Las 8 Habilidades | **Cerradas** *(8-sep)* — sin fórmula, por escalones a ojo. Las tres cifras del sistema puestas: ❤️ 20 · ⚔️ 5 · héroe tier 5 ([habilidades.md](sistemas/habilidades.md)). Lo que falta es de cada ficha, no del sistema |
| Catálogo de Características | **Definido** — 41 rasgos, asignados ya a las 132 fichas |
| Motor de combate | **Escrito y sin huecos** ([game-design.md](game-design.md) §4). Diales fijados: banda 65–95, mitigación 75, Suerte 25, Perforante 15. Ya pelea 1 contra 1 con fichas reales de Humanos ([/dev/combate](/dev/combate), 8-sep) |
| Progresión y rareza | **Definida** — un solo eje, el tier, con la Rareza derivada de él ([game-design.md](game-design.md) §3) |
| Tipo de daño | **Definido** — 🗡️ · 🏹 · ✨, con su alcance y su 👢 ([dano.md](sistemas/dano.md)) |
| Estados y efectos | **Escrito** — 9 estados con daño, duración y acumulación ([effects.md](sistemas/effects.md)). Sin balancear |
| Tablero de batalla | **Escrito** y corregido con lo medido en [/dev/tablero](/dev/tablero) ([battle.md](board/battle.md)) |
| Cartas | **A medias** — unidad de Humanos y Enanos construida ([el catálogo en datos](/docs/v3/cards/catalogo)); clase, item, maldición y encuentro por definir (clase, en StandBy) |
| Mazo y Oteo | **Diseño escrito, provisional** ([game-design.md](game-design.md) §6). La mecánica —barajar, otear, la mano, arrastrar hasta el tablero— ya tiene un prototipo de código ([/dev/baraja](/dev/baraja), 9-sep), con cartas de unidad de relleno: las de clase reales esperan a salir del StandBy |
| Tablero de exploración | **Por definir** — esqueleto |
| Balance | **Nada balanceado** |

## 2. Lo que bloquea

Por orden. Cada uno depende del anterior:

1. ~~**Motor de combate**~~ — escrito *(22-ago)*.
2. ~~**Catálogo de estados**~~ — escrito *(22-ago)*.
3. ~~**Los valores del sistema de Habilidades**~~ — puestos *(8-sep)*: ❤️ 20 · ⚔️ 5 · héroe tier 5, y la lista de "por medir" vacía.
4. **Los escalones de las doce fichas de Humanos** — 🛡️ 🔮 🎯 🍀 ⚡ a ojo, arrancando en *Normal* y escribiendo solo lo que se sale. No son del sistema: van con su catálogo, los héroes en [heroes.md](characters/heroes.md) y las unidades en [unidades.md](razas/unidades.md).
5. ~~**Cartas de unidad de las dos razas piloto**: las 16~~ — construidas *(8-sep)*, [el catálogo en datos](/docs/v3/cards/catalogo). **Cartas de clase, las 8** (Guerrero, Mago, Sacerdote, Arquero × Humanos y Enanos) — anatomía y vocabulario del efecto ya cerrados ([cards/class.md](cards/class.md)); falta redactar las 40 cartas del piloto (5 por clase).
6. **Primer pase de balance.**

## 3. Decisiones abiertas

- **Sub-facciones dentro de las razas** *(3-sep)*. Nada escrito: ni cuántas, ni si las once las tienen, ni qué cambian. **Ya ha cobrado una consecuencia**: la carta conserva sus dos huecos de raza —el emblema y la versalita al pie— en vez de borrar uno, porque con dos taxonomías dejan de decir lo mismo.
- **Si las maldiciones siguen siendo un tipo de carta** *(5-sep)*. No falta escribir el documento: no está decidido que el tipo exista. Lo que arrastra, medido, en [cards/curses.md](cards/curses.md).
- **La Rareza de las cartas que no son unidades.** Clase, item, maldición y encuentro no tienen tier del que derivarla, y **no pueden pintarse por tipo** — el raíl dice la Rareza y nada más. De las cuatro, la maldición es la única con respuesta, y está congelada con su tipo de carta; las otras tres **no las bloquea una decisión, las bloquea su catálogo vacío** ([cards/README.md](cards/README.md)).
- **El orden de colocación entre jugadores** en la banda compartida ([battle.md](board/battle.md) §3): a la vez, por turnos o por Iniciativa cambia quién ve el despliegue de quién.
- **Si el tablero grande necesita un reloj** ([battle.md](board/battle.md) §8 y §10). Cruzar te expone y esperar no cuesta: si a los dos bandos les conviene esperar, la batalla se queda mirándose. v2 tenía 40 turnos y V3 no lo ha recuperado.

### Aplazadas con motivo escrito

No es lo mismo que abiertas: cada una espera algo concreto.

- **Catálogo de obstáculos y línea de visión** — el primer prototipo se juega a campo abierto: primero se mide si la pelea se sostiene ([battle.md](board/battle.md) §7).
- **Retirada** de una batalla — espera saber qué cuesta huir, que es economía y exploración.
- **Qué pasa con una unidad que muere** — si la carta se pierde o vuelve a la reserva. Hace falta antes de jugar dos batallas seguidas.
- **PvP** — no falta tablero, falta un **segundo balance** y sus reglas de victoria y recompensa.
- **El tope de jugadores** — se escribe 1 a 3; pasar de 30 entradas de Iniciativa hay que jugarlo antes de prometerlo.

### Medido, no elegido

Lo que salió de jugarlo en el laboratorio en vez de decidirlo:

- **👢 Movimiento 🗡️ 3 · ✨ 2 · 🏹 1** *(31-ago)* — del duelo del arquero. Primera cifra escrita de las 8 Habilidades.
- **Límite de 👢 de ✨: mínimo 2, sin máximo** *(7-sep)* — el mismo duelo con ✨ de perseguidor.
- **El orden de turno no pesa** *(7-sep)* — 100.000 combates por condición: 🗡️ gana el 41,3% tanto si abre como si cierra. Las tres cifras de ⚡ no compensan nada.
- **La pantalla es porosa en cuanto hay bajas** *(7-sep)* — con quince fichas por bando muere algún ✨🏹 en el 100% de los combates, el primero hacia la ronda 8. El cuánto depende de ❤️ ⚔️ 🛡️ reales.
- **El tier del héroe NO era una medida** *(7-sep)* — se intentó jugarlo y la respuesta salía determinada por las cifras que se inventaran. Es insumo, como las demás.

### Resueltas

- **Las tres cifras del sistema de Habilidades** *(8-sep)* — **❤️ 20 · ⚔️ 5** de base de tier 1 de Humanos, y **un héroe equivale al tier 5**. Humanos como estándar de las once, ⚔️ en el centro de 1–9 para que quepan brutos y frágiles, y el héroe como líder y no como campeón: sus tres unidades más altas le superan, y el tier 5 es el que cuadra con su tope de 3 Características. La tercera cifra de ❤️ aparece en el tier 6, así que solo los tres tiers altos piden gema de tres cifras en el disco.
- **Fuera la fórmula de las Habilidades** *(8-sep)* — 🛡️ 🔮 🎯 🍀 ⚡ se asignan **a ojo, por escalones con nombre** (Nada · Poco · Normal · Mucho · Bestial), ficha a ficha y solo escribiendo lo que se sale de *Normal*. Se caen las 12 bases por tipo de daño, los 4 pasos por tier, los 16 desvíos de rol, el ±X de la firma de raza y las 3 de ⚡: **35 de las 39 cifras eran de la máquina de generar el juego, no del juego**. El rol y la raza siguen existiendo como descripción —te dicen qué escalón elegir— y por eso decae la regla de "dos clases de la misma raza no pueden compartir tipo de daño y rol", que solo existía porque la fórmula las sacaba idénticas. Se quedan la curva ×10 de ❤️/⚔️ (hace que el tier signifique algo) y los topes (son la barandilla).
- **Función de tier a Rareza** *(5-sep)* — 1-2 Común · 3-4-5 Poco común · 6 Raro · 7 Épico · 8 Legendario. Los cortes salieron del reparto de Características del roster ([game-design.md §3.1](game-design.md), `lib/v3/rarity.ts`).
- **Tope de Características** *(5-sep)* — no es un número: es un techo por tier, y 3 para los héroes ([ficha.md](sistemas/ficha.md)). Ratifica las 132 sin cambiar ninguna. *(Destapó algo que no es del tope: **tres fichas llevan un rasgo que otro suyo ya implica** —☠️ Alquimista, ☠️ Abominación y 🐉 Dragón esquelético—, y el Dragón gasta en repetirse la quinta plaza de su tope. Es asignación, y va con el repaso de las 132.)*
- **Presupuesto del bando enemigo** *(28-ago)* — **el espejo**: la máquina trae lo mismo que la mesa. Lo que queda no es presupuesto, es dificultad.
- **Alcance** *(23 y 24-ago)* — valor fijo por tipo de daño, y a bocajarro sin penalización.
- **Regla de facción** *(23-ago)* — un héroe recluta solo unidades de su propia raza.
- **Escala de unidades** *(24-ago)* — un solo eje; no hay progresión de personaje.
- **Guerrero compartido** *(24-ago)* — un set por raza.
- **Colisión de "Habilidad"** *(24-ago)* — la palabra se queda con las 8 estadísticas.
- **El diseño de la carta** *(3-sep)* — **L · Lámina**, elegida entre doce bocetos. Lo único abierto no se contesta en pantalla: si los 2px del canto de Rareza aguantan impresos a 63mm. El razonamiento de cada boceto, en `knowledge/v3/card-concept/README.md`.
- **Los 25 nombres duplicados héroe/unidad** *(24-ago)* — se renombra **la unidad**. Ya no es decisión, es trabajo.

## 4. Alcance y orden de trabajo

**Razas piloto: Humanos y Enanos** *(8-sep-2026)*. Las dos se construyen enteras —clases, unidades, cartas y balance— antes de tocar ninguna otra: es lo que hace falta para jugar una primera versión (héroe y unidades de una raza contra la otra), y las dos ya tienen su arte cerrado (`public/assets/v3/README.md`).

**El resto queda en StandBy**: No-muertos, Demonios infernales, Elfos y los tres DLC (Orkos + Feéricos, Dracónidos + Hombres rata, Constructos + Abisales) no se tocan hasta tener una primera versión completa y jugable con estas dos. No es orden de cola —"les toca después"—, es alcance: **la v1 se juega con 2 razas, no con 5.**

## 5. Fuera de alcance

- **Campañas.** Necesitan historia antes que mecánica.
- **Progresión de personaje** —subir de nivel, héroe o unidades— *(24-ago)*. v2 la tenía y **no se hereda**. No es un pendiente aplazado: queda fuera de V3 y no se vuelve a plantear hasta que el juego esté lo bastante desarrollado para saber si hace falta.

## 6. Pendientes anotados

- **El documento de trabajo de las razas sigue entero** y su destino ya son seis *(6-sep)*: `knowledge/v3/races-concept/razas.md` es el que se edita y lo parsean `traits-catalog.ts` y `parseRoster`, así que partirlo en mitad de la redefinición cuesta tres rutas de código sin ganar nada. La tabla de a cuál va cada sección está en su [README](../../knowledge/v3/races-concept/README.md).
- **Items, maldiciones y mazo de encuentro** necesitan una pasada de coherencia con el sistema nuevo.
- **Retirada de "Mercenario"**: además de los documentos hay código — `lib/card-table.ts` y `lib/card-catalog.ts` tienen `"mercenario"` y `"mercenaries"` como literales.
- **`CARDS_ROOT`** sigue apuntando a `docs/v2/cards` para que el laboratorio de cartas no se quede vacío. El día que `docs/v3/cards/` tenga su primera tabla hay que mover tres cosas a la vez: `CARDS_ROOT`, `DESIGN_LAB_VERSION` en `lib/docs.ts` y la carpeta de la ruta.
- **Motor de reglas en código**: el de v2 sigue entero en `lib/v2/rules/`. `lib/v3/` tiene ya la geometría, la arena, el despliegue, los alcances, el ritmo de la ronda y un banco de combate (`battle.ts`) que desde el 8-sep ya no corre solo con valores inventados: `fighters.ts` `fighterOf()` le pasa un `Character` real de Humanos, y `/dev/combate` lo enfrenta 1 contra 1.
- **El arte: dos razas dibujadas enteras** *(👤 Humanos y ⛏️ Enanos, 24 archivos)*. Tres cosas siguen pendientes y **tocan antes de la tercera raza**, no en la undécima:
  - **Tres líneas del prompt de encuadre.** El pie se sale en 23 de los 24 —los pies caen entre el 77% y el 91% del alto cuando el tope son 72—, el ancla de escala de los sujetos enormes queda tapada por el panel del pie, y **el remate** (un arma, un ala, una cola) no cuenta como figura en ninguna línea. Los dos mejores encuadres son los únicos dos cuyo prompt **reclama el cuarto de abajo para otra cosa**, que es la forma del arreglo.
  - **La extensión de los archivos.** 30,1 MB por raza completa proyectan **~330 MB** en las once. No se convierten mientras al encuadre le quede vuelta.
  - **Volver a ver una carta sin arte.** En las dos razas dibujadas ya no queda ningún hueco donde mirar cómo aguanta el marco: si se quiere, hay que dejar un sujeto sin ilustrar a propósito, y mejor un tier bajo que la cima.

  Las medidas archivo por archivo están en `public/assets/v3/README.md`, que es la fuente única; la dirección de arte, en `knowledge/v3/art-direction/`; los 132 prompts, montados en `knowledge/v3/races-concept/prompts/`.
