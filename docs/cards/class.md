# CardGame — Cartas: de Clase

Catálogo de **Cartas de Habilidad de Clase** (sistema en [`../game-design.md`](../game-design.md) §3.1, regla madre de "en juego"/Mazo en §4). Salen de la clase del héroe, no son cartas de equipo ni llevan Rareza (§3.3). Héroes y stats en [`../characters/heroes.md`](../characters/heroes.md). Índice de cartas en [`README.md`](README.md).

> **Roster completo (4 héroes):** Guerrero (§2), Mago (§3), Pícaro (§4) y Clérigo (§5) — los 4 arquetipos de `../characters/heroes.md`. Cada uno tiene **8 cartas de habilidad** de ejemplo, todas al mismo nivel *(decidido — ya no se diferencia entre "Básica" y "Especial")*: el Nivel de personaje no desbloquea cartas nuevas (`../game-design.md` §5), así que las 8 están disponibles desde el arranque y cada una sube de Nivel 1 a 5 por su cuenta pagando al Instructor (§6). Los valores (dados, bonos, CD) son un punto de partida **sin balancear**.

## 1. Anatomía de una carta de clase

Cada carta se define por estos campos:

| Campo | Valores posibles |
|---|---|
| **Tipo** | `Accion` (se usa una vez y vuelve al Mazo) · `Pasiva` (se queda en juego para siempre) · `Turnos` (se queda en juego hasta cumplir la duración que indique su propia columna **Uso**) — ciclo de vida en juego, ver regla madre abajo. El coste de activación (Movimiento/Acción/Acción rápida) es un recurso de turno aparte, [`../game-design.md`](../game-design.md) §4b.3, y no depende del Tipo de la carta. |
| **Uso** | Solo aplica a Tipo `Turnos`: cuántos turnos permanece **en juego** antes de descartarse y volver al Mazo (p. ej. `2 turnos`). Marcado "—" en `Accion` y `Pasiva`, que no tienen esta duración. No hay límite de repeticiones: cualquier carta se puede jugar tantas veces como el Oteo te la vuelva a ofrecer *(decidido — ver más abajo)*. |
| **Efecto** | Qué hace, con sus tiradas/dados. |

- **Jugar una carta Tipo Accion la saca de "en juego" *(corregido)*.** Manda la **regla madre** de [`../game-design.md`](../game-design.md) §4: al jugarla, la carta **vuelve al Mazo** y para repetirla tiene que **volver a salirte en un Oteo**. *(Este apartado decía antes que estas cartas eran "reutilizables cada turno" y que lo único que impedía spamear *Golpe firme* era su coste de Acción. Era texto anterior a que se cerrara §4 y **no es la regla**: con esa lectura, "en juego" se volvía un equipamiento fijo y el Oteo dejaba de decidir nada a partir del turno 6.)*
- **Tipo Pasiva y Tipo Turnos no vuelven al Mazo al jugarlas.** Pasiva se queda **en juego para siempre** (sacrificas ese hueco preparado a cambio de un efecto constante); Turnos se queda **en juego durante los turnos que indique su columna Uso** y, al cumplirse, se descarta y vuelve al Mazo. Es la excepción explícita a la regla madre — detalle en `../game-design.md` §4.
- **Ya no existe el tope `1/combate`/`1/descanso` *(decidido, elimina la versión anterior)*.** Cualquier carta —de clase, de item, de mercenario— se puede repetir tantas veces como el Oteo te la vuelva a ofrecer, sin excepción: el propio ritmo del Oteo (2 cartas al azar por turno, con Mazo de hasta 20 y combates de 5-6 turnos, `../game-design.md` §4b.12) ya es el único límite de repetición. *(Antes algunas cartas con efecto excepcional —impacto garantizado, área grande, mitigar la mitad del daño— llevaban ese tope para no repetirse en la misma pelea; era un mecanismo aparte del Tipo, no de Uso. Al quitarlo, cartas como Bola de fuego o Meteoro sí pueden salir dos veces en el mismo combate si el Oteo coopera — punto a vigilar al testear, §7.)*
- **Tu ataque normal no es una carta.** El ataque con el arma equipada es gratis y siempre está disponible (`../game-design.md` §4a), y desde §4b.3 tienes además un **ataque secundario** con la Acción rápida — un recurso del héroe, no ligado a ninguna carta. Las cartas de clase son lo que hace ese ataque **mejor o distinto** (ventaja, alcance, daño extra, control), no la única forma de pegar — que es lo que hace jugable el turno en el que el Oteo no te da nada.
- **Cuentan para el Mazo y para "en juego" — decidido:** las cartas de clase **ocupan hueco** tanto en el Mazo (≤20) como en la zona **"en juego"** (tope fijo de 5), compitiendo con los items y mercenarios por esos huecos y por lo que preparas con el Oteo (ver [`README.md`](README.md) y [`../game-design.md`](../game-design.md) §4). Habrá una explicación in-fiction por desarrollar; si el límite queda demasiado ajustado con el roster completo de 8 cartas por héroe desde el arranque, se podrá subir más adelante.
- **El tipo `Pasiva` se reintroduce con otro significado *(decidido)*.** El `Pasiva` viejo estaba definido como "siempre activa mientras esté **en el mazo**", lo que **se saltaba el Oteo** —el corazón del juego— y contradecía `../game-design.md` §4; ninguna carta lo usaba. El `Pasiva` de hoy es la idea que vivía aparcada en [`../ideas.md`](../ideas.md) bajo *cartas de Aura/Postura*: activa **mientras esté en juego**, pagando un hueco preparado para siempre. Así el coste es real y encaja con la economía del Oteo en vez de esquivarla. `Turnos` es la misma idea con duración limitada.
- **Tipo es un estándar compartido por todas las cartas del Mazo, no solo las de clase.** `Accion`/`Pasiva`/`Turnos` se usan igual en [`items.md`](items.md) (§1-§5), [`mercenaries.md`](mercenaries.md) (§3) y [`curses.md`](curses.md) (§2, con una salvedad de mecanismo propia de la Maldición, ver su §1). Las cartas de **Arma/Armadura** no llevan este campo: son equipo, no pasan por el Mazo/Oteo (`../game-design.md` §4a), y su columna "Tipo" en `weapons.md` significa tipo de daño, no ciclo de vida.

## 2. Guerrero *(Fighter — FUE 15/+2, CON 14/+2, d10, PV 22 — `../characters/heroes.md` §2b-2c)*

Rol: tanque melee fiable. Sus cartas premian **impactar con seguridad**, **aguantar** y **cerrar distancia**.

### Cartas de habilidad

<!-- cards: clase fichas="Guerrero" -->

| Carta | Tipo | Uso | Efecto |
|---|---|---|---|
| **Golpe firme** | Accion | — | Ataque cuerpo a cuerpo a un enemigo adyacente **con ventaja** (2d20, coges el mejor). El guerrero rara vez falla. |
| **Postura defensiva** | Turnos | 2 turnos | Ganas **Escudado +2 CA** ([`../effects.md`](../effects.md)) durante **2 turnos**. No puedes combinarla con Embestida el mismo turno (te plantas, no cargas). |
| **Embestida** | Accion | — | Muévete hasta 2 hex hacia un enemigo y haz un ataque melee al terminar. Si te moviste ≥1 hex, **+2 al daño** (impulso de la carga). |
| **Segundo aliento** | Accion | — | Recuperas **1d10 + nivel** PV. |
| **Golpe demoledor** | Accion | — | Tu próximo ataque melee **ignora la mitad de la CA** del objetivo. *(Nivel 1; tabla 1-5 en §6b.)* |
| **Grito de guerra** | Turnos | 2 turnos | Ganas **Bendecido** ([`../effects.md`](../effects.md)) durante 2 turnos. *(Nivel 1; tabla 1-5 en §6b.)* |
| **Postura inquebrantable** | Turnos | 1 turno | Durante 1 turno recibes **la mitad de todo el daño**. *(Nivel 1; tabla 1-5 en §6b.)* |
| **Golpe final** | Accion | — | Ataque con ventaja que impacta a **daño máximo** (sin tirar). *(Nivel 1; tabla 1-5 en §6b.)* |

## 3. Mago *(Wizard — INT 15/+2, DES 14/+2, d6, PV 16 — `../characters/heroes.md` §2b-2c)*

Rol: daño a distancia y control, el más frágil (PV 16). Sus cartas premian **pegar desde lejos**, **comprar turnos con control** y **sobrevivir uno más**.

> **No es un *kiter* *(precisión de diseño)*.** Este apartado decía "frenar al que se acerca… antes de que llegue a adyacencia", y con la Velocidad igualada eso **no es posible**: un enemigo mueve su Velocidad completa **y** ataca el mismo turno, así que alejarte a pie no gana distancia y encima paga una tirada de Desengancharse (`../game-design.md` §4b.5). El Mago sobrevive por **PV** (16), por **Escudado**, por poder disparar **a bocajarro** (§4b.1) y por **Inmovilizado**, no por correr más.

### Cartas de habilidad

<!-- cards: clase fichas="Mago" -->

| Carta | Tipo | Uso | Efecto |
|---|---|---|---|
| **Descarga arcana** | Accion | — | Ataque a distancia (alcance **4 hex**): `1d20 + mod INT` vs Defensa; si impacta, **1d8 + mod INT** de daño 🔮 (arcano). Es el ataque a distancia fiable del mago (sus armas cuerpo a cuerpo son flojas). |
| **Escudo arcano** | Turnos | 2 turnos | Ganas **Escudado +3 CA** ([`../effects.md`](../effects.md)) durante **2 turnos**. La red de seguridad del mago frágil. |
| **Enredo gélido** | Accion | — | A distancia (alcance 3 hex): si impacta (`1d20 + mod INT` vs Defensa), el enemigo queda **Inmovilizado** (salvación DES, [`../effects.md`](../effects.md)). Sin daño: control puro. |
| **Bola de fuego** | Accion | — | Explosión a distancia (alcance 4 hex): daño **3d6 de fuego** al enemigo objetivo y a los adyacentes a él. Cada afectado hace una salvación de Destreza (`1d20 + mod DES` vs CD) para recibir la mitad. |
| **Rayo de escarcha** | Accion | — | A distancia: **2d6 de daño frío**, el objetivo queda **Ralentizado** 2 turnos. *(Nivel 1; tabla 1-5 en §6b.)* |
| **Contrahechizo** | Turnos | — | Anula la próxima habilidad especial de un enemigo. *(Nivel 1; tabla 1-5 en §6b. Sin duración fija todavía — pendiente de cerrar, §7.)* |
| **Muro de fuerza** | Turnos | 3 turnos | Bloquea 1 hexágono a los enemigos durante 3 turnos. *(Nivel 1; tabla 1-5 en §6b.)* |
| **Meteoro** | Accion | — | **6d6 de daño de fuego** en radio 2 hex. *(Nivel 1; tabla 1-5 en §6b.)* |

## 4. Pícaro *(Rogue — DES 15/+2, CAR 14/+2, d8, PV 19 — `../characters/heroes.md` §2b-2c)*

Rol: sigilo, daño furtivo y exploración. Sus cartas premian **atacar desde la sombra**, **reposicionarse** y **ver antes que nadie**. Es el héroe que más dialoga con la detección enemiga (`../characters/enemies.md` §2): evita el combate o lo empieza con ventaja.

### Cartas de habilidad

<!-- cards: clase fichas="Pícaro" -->

| Carta | Tipo | Uso | Efecto |
|---|---|---|---|
| **Ataque furtivo** | Accion | — | Ataque con un arma de **1 mano ✋** o **a distancia** ([`weapons.md`](weapons.md)). Si estás **Oculto** ([`../effects.md`](../effects.md)) o atacas con ventaja, **+2d6 de daño**. El pan de cada día del pícaro. *(Antes decía "arma ligera": esa propiedad **no existe** en el catálogo, así que la carta no podía dispararse nunca — ver `weapons.md` §4.)* |
| **Escabullirse** | Turnos | 2 turnos | Te mueves 1 hex **desengachándote sin tirar** (éxito automático, `../game-design.md` §4b.11) y ganas **+2 para evitar detección** (prueba de sigilo, [`../characters/enemies.md`](../characters/enemies.md) §2b) durante **2 turnos**; si terminas en Bosque u otro terreno de ocultación, quedas **Oculto**. |
| **Ojo avizor** | Turnos | 2 turnos | Adelanta a **Detectado** un grupo vecino sin explorar, o **+1 a tus dos rangos de visión** (detalle y terreno) durante **2 turnos** (`../board/board-map.md` §4, `../game-design.md` §2.3). Exploración pura, sin combate. *(En el prototipo de niebla simple solo aplica el +1 de rango de visión; la parte de "grupo Detectado" se activa con el sistema de grupos/tiles, `../board/board-map.md` §8. La rama instantánea no tiene duración — Uso refleja solo la rama de visión, ver §7.)* |
| **Desaparecer** | Accion | — | Quedas **Oculto** aunque estés a la vista (los enemigos pierden tu rastro) hasta que ataques o interactúes. Prepara un Ataque furtivo demoledor o una huida. |
| **Golpe en la sombra** | Accion | — | Tu próximo Ataque furtivo suma su daño extra aunque no estés Oculto ni tengas ventaja. *(Nivel 1; tabla 1-5 en §6b.)* |
| **Reflejos felinos** | Turnos | — | Si un enemigo te ataca y falla, te desenganchas de él sin tirar. *(Nivel 1; tabla 1-5 en §6b. Sin duración fija todavía — pendiente de cerrar, §7.)* |
| **Danza de sombras** | Accion | — | Quedas Oculto y te mueves 2 hex sin gastar Movimiento. *(Nivel 1; tabla 1-5 en §6b.)* |
| **Golpe fantasma** | Accion | — | Impacto automático de Ataque furtivo contra un enemigo que no te haya detectado. *(Nivel 1; tabla 1-5 en §6b.)* |

## 5. Clérigo *(Cleric — SAB 15/+2, CON 14/+2, d8, PV 20 — `../characters/heroes.md` §2b-2c)*

Rol: curación, soporte y algo de daño divino. Sus cartas premian **mantenerte en pie**, **proteger** y **castigar no-muertos**. (Con un solo héroe en el prototipo, la mayoría se aplican a ti mismo; los objetivos "aliado" cobran sentido con Mercenarios de `../characters/npcs.md`.)

### Cartas de habilidad

<!-- cards: clase fichas="Clérigo" -->

| Carta | Tipo | Uso | Efecto |
|---|---|---|---|
| **Palabra sanadora** | Accion | — | Recuperas tú (o un aliado adyacente) **1d8 + mod SAB** PV. Curación fiable y repetible. |
| **Llama sagrada** | Accion | — | Ataque divino a distancia (alcance 3 hex): `1d20 + mod SAB` vs Defensa; **1d8 + mod SAB** de daño ☀️ (radiante), especialmente efectivo vs no-muertos (`../characters/enemies.md` §5). |
| **Escudo de fe** | Turnos | 2 turnos | Concede **Escudado +2 CA** ([`../effects.md`](../effects.md)) durante **2 turnos** a ti o a un aliado adyacente. |
| **Bendición** | Turnos | 3 turnos | Durante 3 turnos ganas **Bendecido** ([`../effects.md`](../effects.md)): +1d4 a tus tiradas de ataque y de salvación. |
| **Imposición de manos** | Accion | — | Cura instantánea de 3d8 PV a ti o a un aliado adyacente. *(Nivel 1; tabla 1-5 en §6b.)* |
| **Castigo divino** | Accion | — | Tu próxima Llama sagrada hace daño doble contra No-muertos. *(Nivel 1; tabla 1-5 en §6b.)* |
| **Círculo protector** | Turnos | 3 turnos | Tú y un aliado adyacente ganáis Escudado +3 CA durante 3 turnos. *(Nivel 1; tabla 1-5 en §6b.)* |
| **Resurrección menor** | Turnos | — | Si caes a 0 PV en este combate, te levantas una vez con la mitad de tus PV máximos. *(Nivel 1; tabla 1-5 en §6b. Sin duración fija todavía — pendiente de cerrar, §7.)* |

## 6. Progresión — reforjar con el Instructor

**Un solo mecanismo, sin distinción de categoría entre cartas** *(decidido — sustituye la versión con Básica/Especial)*: las 8 cartas de habilidad de cada héroe están disponibles desde el arranque (no hay desbloqueo por Nivel de personaje) y cada una sube de Nivel **por su cuenta**, pagando al Instructor, con la misma tabla de coste universal que el resto de categorías (21/50/125/340 oro, `../game-design.md` §6d.1) porque esa tabla nunca dependió del precio de mercado de la carta, solo del escalón.

El **Nivel de personaje** (`../game-design.md` §5, hitos) sigue existiendo pero ya no toca las cartas: solo da PV y mejora de estadística (Niveles 3 y 5). Son dos ejes totalmente independientes: el Nivel de una carta concreta y el Nivel del héroe que la lleva.

### 6a. Tablas de mejora carta a carta *(las 8 cartas de cada héroe, hecho)*

Las 8 cartas de cada héroe ya tienen su escalón 1-5 completo, mismo espíritu que la regla de derivación de `../cards/weapons.md` §5b (mismo efecto base, +1 magnitud por escalón). Las 3 que antes se llamaban "Básicas" estaban ya cerradas; las otras 5 (antes "Especiales") tienen ahora también su tabla — quedan en §6b. El **balance de las cifras nuevas** sigue pendiente de testear, igual que el resto del catálogo.

**Guerrero**

| Carta | Nivel 1 (base) | Nivel 2 | Nivel 3 | Nivel 4 | Nivel 5 |
|---|---|---|---|---|---|
| Golpe firme | Ventaja, sin daño extra | +1 al daño | +2 al daño | +3 al daño | +4 al daño; con nat 20 el objetivo también queda **Aturdido** 1 turno |
| Postura defensiva | Escudado +2 CA, 2 turnos | +2 CA, 3 turnos | +3 CA, 3 turnos | +3 CA, 3 turnos, recuperas 1d6 PV al activarla | +4 CA, 3 turnos, recuperas 2d6 PV al activarla |
| Embestida | +2 al daño si te moviste | +3 al daño | +3 al daño, el objetivo queda **Ralentizado** 1 turno | +4 al daño, Ralentizado 1 turno | +5 al daño, Ralentizado 2 turnos |

**Mago**

| Carta | Nivel 1 (base) | Nivel 2 | Nivel 3 | Nivel 4 | Nivel 5 |
|---|---|---|---|---|---|
| Descarga arcana | 1d8 + mod INT | 1d10 + mod INT | 1d10 + mod INT, +1 al ataque | 2d6 + mod INT, +1 al ataque | 2d8 + mod INT, +2 al ataque |
| Escudo arcano | Escudado +3 CA, 2 turnos | +3 CA, 3 turnos | +4 CA, 3 turnos | +4 CA, 3 turnos, refleja 1d4 de daño arcano al primer atacante que falle | +5 CA, 3 turnos, refleja 1d6 |
| Enredo gélido | Inmoviliza (salvación DES) | + 1d4 de daño frío | + 1d6 de daño frío | + 1d8 de daño frío; si salva, queda **Ralentizado** 1 turno | + 2d6 de daño frío; si salva, Ralentizado 1 turno |

**Pícaro**

| Carta | Nivel 1 (base) | Nivel 2 | Nivel 3 | Nivel 4 | Nivel 5 |
|---|---|---|---|---|---|
| Ataque furtivo | +2d6 si Oculto/ventaja | +3d6 | +3d6, +1 al ataque | +4d6, +1 al ataque | +4d6, +2 al ataque; con nat 20 el objetivo también queda **Aturdido** 1 turno |
| Escabullirse | +2 a sigilo, 2 turnos | +2 a sigilo, 3 turnos | +3 a sigilo, 3 turnos | +3 a sigilo, 3 turnos, te mueves **2 hex** al activarla | +4 a sigilo, 3 turnos, te mueves 2 hex, quedas **Oculto** aunque no haya terreno de ocultación |
| Ojo avizor | +1 a los dos rangos de visión, 2 turnos | +1 a los dos rangos, 3 turnos | +2 a los dos rangos, 3 turnos | +2 a los dos rangos, 3 turnos, ignora la reducción de Bosque | +3 a los dos rangos, 3 turnos, ignora la reducción de Bosque |

**Clérigo**

| Carta | Nivel 1 (base) | Nivel 2 | Nivel 3 | Nivel 4 | Nivel 5 |
|---|---|---|---|---|---|
| Palabra sanadora | 1d8 + mod SAB | 1d10 + mod SAB | 1d10 + mod SAB, +1d4 extra si el objetivo está por debajo del 50 % de PV | 2d6 + mod SAB, +1d4 extra si <50 % | 2d8 + mod SAB, +1d6 extra si <50 % |
| Llama sagrada | 1d8 + mod SAB | 1d10 + mod SAB | 1d10 + mod SAB, +1 al ataque | 2d6 + mod SAB, +1 al ataque | 2d8 + mod SAB, +2 al ataque |
| Escudo de fe | Escudado +2 CA, 2 turnos | +2 CA, 3 turnos | +3 CA, 3 turnos | +3 CA, 3 turnos, recuperas 1d4 PV al activarla | +4 CA, 3 turnos, recuperas 1d6 PV al activarla |

### 6b. Tablas de mejora — las 5 cartas restantes de cada héroe *(hecho, mismo pase que §6a)*

Las cartas que antes vivían como "Especial de ejemplo" o "concepto de nivel 2-5" (§2-§5) ya tienen su escalón 1-5, con el mismo espíritu que §6a: mismo efecto base, +1 magnitud/duración por escalón, con algún añadido de control o utilidad en los escalones altos. Sigue **sin balancear** — es un primer pase de cifras, a testear como el resto del catálogo.

**Guerrero**

| Carta | Nivel 1 (base) | Nivel 2 | Nivel 3 | Nivel 4 | Nivel 5 |
|---|---|---|---|---|---|
| Segundo aliento | 1d10 + nivel PV | 2d8 + nivel PV | 2d8 + nivel PV | 3d8 + nivel PV | 3d8 + nivel PV, y ganas **Escudado +2 CA** 2 turnos |
| Golpe demoledor | Ignora la mitad de la CA del objetivo | Ignora la mitad de la CA, +1 al daño | Ignora la mitad de la CA, +2 al daño | Ignora la mitad de la CA, +3 al daño; si impacta, el objetivo queda **Ralentizado** 1 turno | Ignora **toda** la CA del objetivo (impacto automático), +3 al daño |
| Grito de guerra | Ganas **Bendecido** 2 turnos | Bendecido 3 turnos | Bendecido 3 turnos; un aliado adyacente también lo gana | Bendecido 3 turnos (tú y aliado adyacente), +1 a la CA mientras dure | Bendecido 4 turnos (tú y aliado adyacente), +1 a la CA mientras dure |
| Postura inquebrantable | 1 turno recibiendo la mitad de todo el daño | 2 turnos recibiendo la mitad del daño | 2 turnos; el ataque melee que falle contra ti recibe 1d6 de daño de vuelta | 2 turnos, +Escudado +2 CA | 3 turnos, +Escudado +2 CA |
| Golpe final | Ventaja, daño máximo sin tirar | Igual, +2 al daño | Igual, +4 al daño | Igual, +4 al daño; si el objetivo cae a 0 PV, recuperas tu Acción rápida | Igual, +6 al daño; si el objetivo cae a 0 PV, recuperas también tu Acción principal |

**Mago**

| Carta | Nivel 1 (base) | Nivel 2 | Nivel 3 | Nivel 4 | Nivel 5 |
|---|---|---|---|---|---|
| Bola de fuego | 3d6 de fuego, radio 1 hex (salvación DES por mitad) | 4d6 de fuego | 4d6 de fuego, radio 2 hex | 5d6 de fuego, radio 2 hex | 6d6 de fuego, radio 2 hex; quien falle la salvación queda **Ralentizado** 1 turno |
| Rayo de escarcha | 2d6 de frío, Ralentizado 2 turnos | 3d6 de frío, Ralentizado 2 turnos | 3d6 de frío, Ralentizado 3 turnos, +1 al ataque | 4d6 de frío, Ralentizado 3 turnos, +1 al ataque | 4d6 de frío, +2 al ataque; si ya estaba Ralentizado, queda **Inmovilizado** en su lugar |
| Contrahechizo | Anula la próxima habilidad especial de un enemigo | Igual, y el enemigo pierde también su turno | Anula la próxima habilidad especial de hasta 2 enemigos | Igual, y al anular devuelves 1d6 de daño arcano | Igual, con 2d6 de daño arcano de vuelta |
| Muro de fuerza | Bloquea 1 hex a los enemigos, 3 turnos | Bloquea 1 hex, 4 turnos | Bloquea 2 hex adyacentes, 4 turnos | Igual, con Desventaja para atacarte a través del muro | Bloquea 3 hex en línea, 4 turnos, misma Desventaja |
| Meteoro | 6d6 de fuego, radio 2 hex | 7d6 de fuego, radio 2 hex | 8d6 de fuego, radio 2 hex | 8d6 de fuego, radio 3 hex | 10d6 de fuego, radio 3 hex; quien falle la salvación por el doble de la CD queda **Aturdido** 1 turno |

**Pícaro**

| Carta | Nivel 1 (base) | Nivel 2 | Nivel 3 | Nivel 4 | Nivel 5 |
|---|---|---|---|---|---|
| Desaparecer | Oculto hasta atacar o interactuar | Igual, +1d6 extra en tu próximo Ataque furtivo | Igual, y te mueves 1 hex gratis al activarla | Igual, +2d6 extra en vez de +1d6 | Igual, y te mueves 2 hex adicionales sin gastar Movimiento al activarla |
| Golpe en la sombra | Tu próximo Ataque furtivo suma su daño extra sin Oculto ni ventaja | Igual, +1d6 extra | Igual, y el ataque se hace con ventaja | Igual, +2d6 extra en vez de +1d6 | Igual, y si el objetivo cae a 0 PV, quedas Oculto automáticamente |
| Reflejos felinos | Si un enemigo falla al atacarte, te desenganchas sin tirar | Igual, y te mueves 1 hex gratis al desengancharte | Igual, y ganas ventaja en tu siguiente ataque contra ese enemigo | Igual, te mueves 2 hex en vez de 1 | Igual, y quedas Oculto si terminas en terreno de ocultación |
| Danza de sombras | Oculto, te mueves 2 hex sin gastar Movimiento | Te mueves 3 hex sin gastar Movimiento | Igual, +2 para evitar detección 2 turnos | Te mueves 4 hex, +2 para evitar detección 2 turnos | Te mueves 4 hex, +3 para evitar detección 3 turnos |
| Golpe fantasma | Impacto automático de Ataque furtivo contra un enemigo que no te detectó | Igual, +1d6 al daño | Igual, +2d6 al daño | Igual, y si cae a 0 PV no rompes tu Oculto | Igual, +3d6 al daño en vez de +2d6 |

**Clérigo**

| Carta | Nivel 1 (base) | Nivel 2 | Nivel 3 | Nivel 4 | Nivel 5 |
|---|---|---|---|---|---|
| Bendición | Bendecido 3 turnos (+1d4 ataque/salvación) | Bendecido 4 turnos | Igual, y un aliado adyacente también lo gana | Bendecido 4 turnos (tú y aliado), +1d6 en vez de +1d4 | Bendecido 5 turnos (tú y aliado), +1d6 |
| Imposición de manos | 3d8 PV a ti o aliado adyacente | 4d8 PV | Igual, y quita 1 estado negativo del objetivo | 5d8 PV, quita 1 estado negativo | 6d8 PV, quita hasta 2 estados negativos |
| Castigo divino | Tu próxima Llama sagrada hace daño doble a No-muertos | Igual, +1 al ataque de esa tirada | Igual, daño doble a cualquier enemigo | Igual, +2 al ataque | Igual, y si el objetivo muere, recuperas el uso de esta carta este combate *(perk obsoleto: dependía del tope 1/combate ya eliminado — pendiente de rediseñar, §7)* |
| Círculo protector | Tú y aliado adyacente: Escudado +3 CA, 3 turnos | +3 CA, 4 turnos | +4 CA, 4 turnos | Igual, y cura 1d4 PV cada turno a ambos | +5 CA, 4 turnos, cura 1d6 PV cada turno a ambos |
| Resurrección menor | Si caes a 0 PV, te levantas una vez con la mitad de tus PV máx. | Igual, y sin ningún estado negativo activo | Igual, y recuperas tu Acción rápida ese turno | Igual, te levantas con dos tercios de tus PV máx. | Igual, y protege también a un aliado adyacente (el que caiga primero) |

## 7. Próximos pasos / preguntas abiertas

- [x] Diseñar las cartas de habilidad de **Pícaro** (sigilo/exploración) y **Clérigo** (curación/soporte) → hechas (§4-5).
- [ ] Balancear valores (dados de daño, bonos, alcances, CD) al testear en el prototipo.
- [ ] Ampliar el roster de cada clase más allá de las 8 de ejemplo (`../game-design.md` §4, aviso de contenido).
- [x] Cerrar la duración de **Escudado** → **2 turnos** *(decidido)*, no "hasta tu próximo turno" ([`../effects.md`](../effects.md)). Con la regla madre de §4 (jugar la carta gasta su preparación), un buff de 1 turno costaba una carta preparada entera por un solo turno de +2/+3 CA y nunca merecía la pena; a 2 turnos sí.
- [ ] Cerrar la duración/CD del resto de estados que introducen estas cartas (Oculto, Bendecido) en [`../effects.md`](../effects.md).
- [x] Quitar de las cartas las referencias a cosas que no existían *(hecho en este pase)*: la propiedad **"Ligera"** (*Ataque furtivo* → arma ✋ o a distancia, [`weapons.md`](weapons.md) §4) y el **modificador que faltaba** en el daño de *Descarga arcana* y *Llama sagrada* (`../game-design.md` §4b.4).
- [ ] Cuando quieras, añadir más cartas a cualquier clase.
- [x] Definir la progresión de las cartas de clase → **§6**: un solo mecanismo (reforjar con el Instructor), sin distinción Básica/Especial. Las **8 cartas de cada héroe** ya tienen tabla 1-5 completa (§6a, §6b). Falta balancear las cifras al testear.
- [ ] **Ojo avizor** tiene efecto doble (Detectado inmediato **o** +1 visión 2 turnos) pero una sola fila de Tipo — se marcó `Turnos` por tener al menos una rama con duración, pero podría partirse en dos cartas o dejarse `Accion` si se prefiere. Decidir al testear.
- [x] **Quitar el tope `1/combate`/`1/descanso` de todo el juego** *(decidido)*: ya no existe ningún límite de repeticiones por combate/descanso, en ninguna categoría de carta — el Oteo es el único que raciona. §1 explica el porqué; ver también `../game-design.md` §4b.8 (la definición de "fin de combate" ya no depende de esto) e `items.md` (Legendarios/Épicos que llevaban la etiqueta).
- [ ] **Tres cartas Tipo `Turnos` sin duración fija todavía** — al convertir Uso en "turnos en juego" se hizo visible que **Contrahechizo** (Mago), **Reflejos felinos** (Pícaro) y **Resurrección menor** (Clérigo) nunca tuvieron un número de turnos: funcionan más como "dura hasta que se cumpla su condición o acabe el combate" que como un buff de duración fija. Falta decidir si se les pone un número (p. ej. 2-3 turnos) o se deja ese comportamiento como una tercera semántica de Uso.
- [ ] **Balance a vigilar sin el tope 1/combate**: cartas antes limitadas por él (Bola de fuego, Meteoro, Golpe final, Golpe demoledor, Golpe fantasma, Danza de sombras, Desaparecer, Golpe en la sombra, Imposición de manos, Castigo divino) ahora pueden repetirse en el mismo combate si el Oteo las reofrece — probar si algún caso rompe el ritmo calibrado en `../game-design.md` §4b.12.
- [ ] **Perk de nivel 5 de Castigo divino obsoleto** (§6b): "recuperas el uso de esta carta este combate" no tiene sentido sin el tope 1/combate — rediseñar ese escalón.
