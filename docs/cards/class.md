# CardGame — Cartas: de Clase

Catálogo de **Cartas Básicas y Especiales de Clase** (sistema en [`../game-design.md`](../game-design.md) §3.1, economía de acción de combate en §4b.3). Salen de la clase del héroe, no son cartas de equipo ni llevan Rareza (§3.3). Héroes y stats en [`../characters/heroes.md`](../characters/heroes.md). Índice de cartas en [`README.md`](README.md).

> **Roster completo (4 héroes):** Guerrero (§2), Mago (§3), Pícaro (§4) y Clérigo (§5) — los 4 arquetipos de `../characters/heroes.md`. Cada uno tiene 3 Básicas + 1 Especial de ejemplo. Los valores (dados, bonos, CD) son un punto de partida **sin balancear**.

## 1. Anatomía de una carta de clase

Cada carta se define por estos campos, enganchados a la economía de acción de combate ([`../game-design.md`](../game-design.md) §4b.3):

| Campo | Valores posibles |
|---|---|
| **Tipo** | `Acción` (la principal del turno) · `Acción rápida` (1/turno) · `Modificador` (enganchada a una tirada, ≤1 por tirada, no gasta la Acción) |
| **Uso** | **Básica:** sin tope de veces por combate — pero **cada uso gasta la preparación** (ver abajo). **Especial:** limitado además a `1/combate` o `1/descanso`. |
| **Efecto** | Qué hace, con sus tiradas/dados. |

- **Jugar una carta la saca de "en juego" *(corregido)*.** Manda la **regla madre** de [`../game-design.md`](../game-design.md) §4: al jugarla, la carta **vuelve al Mazo** y para repetirla tiene que **volver a salirte en un Oteo**. *(Este apartado decía antes que las Básicas eran "reutilizables cada turno" y que lo único que impedía spamear *Golpe firme* era su coste de Acción. Era texto anterior a que se cerrara §4 y **no es la regla**: con esa lectura, "en juego" se volvía un equipamiento fijo y el Oteo dejaba de decidir nada a partir del turno 6.)*
- **Qué significa entonces "ilimitado" en una Básica:** que **no lleva contador propio** — puedes jugarla tantas veces como el Oteo te la vuelva a ofrecer. Las Especiales sí llevan contador (`1/combate`, `1/descanso`) **encima** de eso: aunque el Oteo te devuelva *Bola de fuego* en el mismo combate, no puedes lanzarla dos veces.
- **Tu ataque normal no es una carta.** El ataque con el arma equipada es gratis y siempre está disponible (`../game-design.md` §4a), y desde §4b.3 tienes además un **ataque secundario** con la Acción rápida. Las cartas de clase son lo que hace ese ataque **mejor o distinto** (ventaja, alcance, daño extra, control), no la única forma de pegar — que es lo que hace jugable el turno en el que el Oteo no te da nada.
- **Cuentan para el Mazo y para "en juego" — decidido:** las cartas de clase **ocupan hueco** tanto en el Mazo (≤20) como en la zona **"en juego"** (tope elástico `techo(Mazo ÷ 2)`, entre 3 y 10), compitiendo con los items y mercenarios por esos huecos y por lo que preparas con el Oteo (ver [`README.md`](README.md) y [`../game-design.md`](../game-design.md) §4). Habrá una explicación in-fiction por desarrollar; si el límite queda demasiado ajustado al ganar Especiales por nivel, se podrá subir más adelante.
- **El tipo `Pasiva` se retira de la v1 *(decidido)*.** Estaba definido como "siempre activa mientras esté **en el mazo**", lo que **se salta el Oteo** —el corazón del juego— y contradice `../game-design.md` §4. Ninguna carta lo usaba, así que quitarlo ahora no cuesta nada. El concepto reformulado (efecto permanente **mientras esté en juego**, pagando un hueco preparado) vive como idea futura en [`../ideas.md`](../ideas.md) bajo *cartas de Aura/Postura* — así el coste es real y encaja con la economía del Oteo en vez de esquivarla.

## 2. Guerrero *(Fighter — FUE 15/+2, CON 14/+2, d10, PV 22 — `../characters/heroes.md` §2b-2c)*

Rol: tanque melee fiable. Sus cartas premian **impactar con seguridad**, **aguantar** y **cerrar distancia**.

### Básicas (nivel 1)

<!-- cards: clase fichas="Guerrero,Básica" -->

| Carta | Tipo | Efecto |
|---|---|---|
| **Golpe firme** | Acción | Ataque cuerpo a cuerpo a un enemigo adyacente **con ventaja** (2d20, coges el mejor). El guerrero rara vez falla. |
| **Postura defensiva** | Acción rápida | Ganas **Escudado +2 CA** ([`../effects.md`](../effects.md)) durante **2 turnos**. No puedes combinarla con Embestida el mismo turno (te plantas, no cargas). |
| **Embestida** | Acción | Muévete hasta 2 hex hacia un enemigo y haz un ataque melee al terminar. Si te moviste ≥1 hex, **+2 al daño** (impulso de la carga). |

### Especial (ejemplo)

<!-- cards: clase fichas="Guerrero" -->

| Carta | Tipo | Uso | Efecto |
|---|---|---|---|
| **Segundo aliento** | Acción rápida | 1/descanso | Recuperas **1d10 + nivel** PV. (Toca también el sistema de descanso — ver checklist de `../game-design.md`.) |

## 3. Mago *(Wizard — INT 15/+2, DES 14/+2, d6, PV 16 — `../characters/heroes.md` §2b-2c)*

Rol: daño a distancia y control, el más frágil (PV 16). Sus cartas premian **pegar desde lejos**, **comprar turnos con control** y **sobrevivir uno más**.

> **No es un *kiter* *(precisión de diseño)*.** Este apartado decía "frenar al que se acerca… antes de que llegue a adyacencia", y con la Velocidad igualada eso **no es posible**: un enemigo mueve su Velocidad completa **y** ataca el mismo turno, así que alejarte a pie no gana distancia y encima paga una tirada de Desengancharse (`../game-design.md` §4b.5). El Mago sobrevive por **PV** (16), por **Escudado**, por poder disparar **a bocajarro** (§4b.1) y por **Inmovilizado**, no por correr más.

### Básicas (nivel 1)

<!-- cards: clase fichas="Mago,Básica" -->

| Carta | Tipo | Efecto |
|---|---|---|
| **Descarga arcana** | Acción | Ataque a distancia (alcance **4 hex**): `1d20 + mod INT` vs Defensa; si impacta, **1d8 + mod INT** de daño 🔮 (arcano). Es el ataque a distancia fiable del mago (sus armas cuerpo a cuerpo son flojas). |
| **Escudo arcano** | Acción rápida | Ganas **Escudado +3 CA** ([`../effects.md`](../effects.md)) durante **2 turnos**. La red de seguridad del mago frágil. |
| **Enredo gélido** | **Acción rápida** | A distancia (alcance 3 hex): si impacta (`1d20 + mod INT` vs Defensa), el enemigo queda **Inmovilizado** (salvación DES, [`../effects.md`](../effects.md)). Sin daño: control puro. **Acción rápida a propósito** — mientras costaba la Acción, frenar a un enemigo salía igual de caro que matarlo y jamás compensaba (`../game-design.md` §4b.5). |

### Especial (ejemplo)

<!-- cards: clase fichas="Mago" -->

| Carta | Tipo | Uso | Efecto |
|---|---|---|---|
| **Bola de fuego** | Acción | 1/combate | Explosión a distancia (alcance 4 hex): daño **3d6 de fuego** al enemigo objetivo y a los adyacentes a él. Cada afectado hace una salvación de Destreza (`1d20 + mod DES` vs CD) para recibir la mitad. |

## 4. Pícaro *(Rogue — DES 15/+2, CAR 14/+2, d8, PV 19 — `../characters/heroes.md` §2b-2c)*

Rol: sigilo, daño furtivo y exploración. Sus cartas premian **atacar desde la sombra**, **reposicionarse** y **ver antes que nadie**. Es el héroe que más dialoga con la detección enemiga (`../characters/enemies.md` §2): evita el combate o lo empieza con ventaja.

### Básicas (nivel 1)

<!-- cards: clase fichas="Pícaro,Básica" -->

| Carta | Tipo | Efecto |
|---|---|---|
| **Ataque furtivo** | Acción | Ataque con un arma de **1 mano ✋** o **a distancia** ([`weapons.md`](weapons.md)). Si estás **Oculto** ([`../effects.md`](../effects.md)) o atacas con ventaja, **+2d6 de daño**. El pan de cada día del pícaro. *(Antes decía "arma ligera": esa propiedad **no existe** en el catálogo, así que la carta no podía dispararse nunca — ver `weapons.md` §4.)* |
| **Escabullirse** | Acción rápida | Te mueves 1 hex **desengachándote sin tirar** (éxito automático, `../game-design.md` §4b.11) y ganas **+2 para evitar detección** (prueba de sigilo, [`../characters/enemies.md`](../characters/enemies.md) §2b) durante **2 turnos**; si terminas en Bosque u otro terreno de ocultación, quedas **Oculto**. |
| **Ojo avizor** | Acción | Adelanta a **Detectado** un grupo vecino sin explorar, o **+1 a tus dos rangos de visión** (detalle y terreno) durante **2 turnos** (`../board/board-map.md` §4, `../game-design.md` §2.3). Exploración pura, sin combate. *(En el prototipo de niebla simple solo aplica el +1 de rango de visión; la parte de "grupo Detectado" se activa con el sistema de grupos/tiles, `../board/board-map.md` §8.)* |

### Especial (ejemplo)

<!-- cards: clase fichas="Pícaro" -->

| Carta | Tipo | Uso | Efecto |
|---|---|---|---|
| **Desaparecer** | Acción rápida | 1/combate | Quedas **Oculto** aunque estés a la vista (los enemigos pierden tu rastro) hasta que ataques o interactúes. Prepara un Ataque furtivo demoledor o una huida. |

## 5. Clérigo *(Cleric — SAB 15/+2, CON 14/+2, d8, PV 20 — `../characters/heroes.md` §2b-2c)*

Rol: curación, soporte y algo de daño divino. Sus cartas premian **mantenerte en pie**, **proteger** y **castigar no-muertos**. (Con un solo héroe en el prototipo, la mayoría se aplican a ti mismo; los objetivos "aliado" cobran sentido con Mercenarios de `../characters/npcs.md`.)

### Básicas (nivel 1)

<!-- cards: clase fichas="Clérigo,Básica" -->

| Carta | Tipo | Efecto |
|---|---|---|
| **Palabra sanadora** | Acción rápida | Recuperas tú (o un aliado adyacente) **1d8 + mod SAB** PV. Curación fiable y repetible. |
| **Llama sagrada** | Acción | Ataque divino a distancia (alcance 3 hex): `1d20 + mod SAB` vs Defensa; **1d8 + mod SAB** de daño ☀️ (radiante), especialmente efectivo vs no-muertos (`../characters/enemies.md` §5). |
| **Escudo de fe** | Acción rápida | Concede **Escudado +2 CA** ([`../effects.md`](../effects.md)) durante **2 turnos** a ti o a un aliado adyacente. |

### Especial (ejemplo)

<!-- cards: clase fichas="Clérigo" -->

| Carta | Tipo | Uso | Efecto |
|---|---|---|---|
| **Bendición** | Acción | 1/combate | Durante 3 turnos ganas **Bendecido** ([`../effects.md`](../effects.md)): +1d4 a tus tiradas de ataque y de salvación. |

## 6. Próximos pasos / preguntas abiertas

- [x] Diseñar las Básicas de **Pícaro** (sigilo/exploración) y **Clérigo** (curación/soporte) → hechas (§4-5).
- [ ] Balancear valores (dados de daño, bonos, alcances, CD) al testear en el prototipo.
- [ ] Ampliar las Especiales de cada clase (por ahora 1 de ejemplo por héroe) y ligarlas a la progresión por nivel (`../game-design.md` §5: 1 Especial nueva por nivel).
- [x] Cerrar la duración de **Escudado** → **2 turnos** *(decidido)*, no "hasta tu próximo turno" ([`../effects.md`](../effects.md)). Con la regla madre de §4 (jugar la carta gasta su preparación), un buff de 1 turno costaba una carta preparada entera por un solo turno de +2/+3 CA y nunca merecía la pena; a 2 turnos sí.
- [ ] Cerrar la duración/CD del resto de estados que introducen estas cartas (Oculto, Bendecido) en [`../effects.md`](../effects.md).
- [x] Quitar de las cartas las referencias a cosas que no existían *(hecho en este pase)*: la propiedad **"Ligera"** (*Ataque furtivo* → arma ✋ o a distancia, [`weapons.md`](weapons.md) §4) y el **modificador que faltaba** en el daño de *Descarga arcana* y *Llama sagrada* (`../game-design.md` §4b.4).
- [ ] Cuando quieras, añadir más cartas a cualquier clase.
