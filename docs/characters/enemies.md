# CardGame — Enemigos (borrador)

Documento dedicado exclusivamente a los enemigos: tipos, cómo aparecen en el mapa, comportamiento y jefes. El resto del tablero (terreno, fichas, niebla de guerra) vive en [`../board/board-map.md`](../board/board-map.md); el sistema de combate y estadísticas de personaje viven en [`../game-design.md`](../game-design.md). Términos transversales en [`../glossary.md`](../glossary.md).

**Base: bestiario de D&D** — los enemigos son variantes con nombre propio de criaturas estándar del Manual de Monstruos (lobo, bandido, trasgo/goblin, esqueleto, araña gigante, trol, etc.), no criaturas de Tolkien/Viajes. Las categorías de dificultad (§3) usan como referencia el concepto de **Nivel de Desafío (CR)** de D&D en vez de inventar una escala propia desde cero.

## 1. Cómo aparece un enemigo en el mapa

Según [`../board/board-map.md`](../board/board-map.md) (sección de fichas del tablero), hay dos formas de encontrarse un enemigo:

- **Ficha de Amenaza** (icono rojo sin definir): ambigua, el jugador no sabe con certeza que es un enemigo hasta interactuar — podría ser otra cosa (trampa, peligro de terreno).
- **Ficha de Enemigo** (icono de enemigo): confirmada de antemano, el jugador ya sabe que va a combatir antes de entrar en el hexágono.

Esta distinción da dos sabores de encuentro: la sorpresa de la Amenaza (tensión de no saber) frente a la decisión táctica del Enemigo confirmado (el jugador puede elegir evitarlo o prepararse antes de entrar).

## 2. Comportamiento en el mapa

- **¿Estáticos o con movimiento?** → **Resuelto (`../game-design.md` §4b.5):** modelo de **activación por detección** en dos estados:
  - **Latente:** anclado en su hexágono, **no patrulla**, mientras no detecte al héroe. (Se conserva la idea de "no deambula por el mapa" del prototipo.)
  - **Activo:** una vez **detectado** el héroe (prueba de sigilo fallada, §2b), se mueve hacia él por el mapa (persecución) hasta que se abre la **pantalla de batalla** (`../board/battle.md`, decisión raíz #1) — a partir de ahí, el movimiento y el combate ocurren ya en esa pantalla, no en este mapa.
- **¿Detección activa?** → **Sí, es el disparador del movimiento.** Cuando el héroe entra en el **rango de detección** del enemigo se resuelve una **prueba de sigilo** (§2b): el enemigo solo pasa a Activo si la falla (o si el héroe no puede ser sigiloso). Reglas del rango (los detalles de la prueba, en §2b):
  - **Rango de detección** = **2 hex base + 1 por punto de modificador de Sabiduría** del enemigo (misma escala que la visión del héroe, `../game-design.md` §2.3, con la misma base 2 que la visión de detalle del héroe desde el reescalado del 2026-08-05 — el invariante `detalle > detección` de §2b se sostiene ya no por la base, sino por el modificador de Sabiduría de cada bando).
  - **Reducción por terreno/sigilo:** la ocultación del terreno del héroe resta al rango (**Bosque −1**; Llanura/Camino sin reducción — `../board/board-map.md` §3/§4). El estado **Oculto** ([`../effects.md`](../effects.md)) hace al héroe **indetectable** hasta que actúe.
  - **Persecución (leash):** si el héroe sale del rango de detección y de la línea de visión del enemigo durante **2 turnos seguidos**, el enemigo **desiste**, vuelve a su hexágono ancla y pasa de nuevo a Latente. **Ya no recupera los PV de golpe** *(corregido — `../board/battle.md` §9 ya lo señalaba sin que se hubiera aplicado aquí)*: las bajas de una composición son permanentes, y las supervivientes recuperan PV poco a poco, ligado al mismo +1 que sube el reloj de Amenaza al huir de una batalla — así curarse rápido es siempre contra un enemigo más entero. Esto da sentido mecánico a huir/ocultarse.
  - *(Idea futura, aún sin decidir — nota del diseñador:* enemigos o eventos "cazadores" que busquen proactivamente al héroe por el mapa **antes** de detectarlo por visión. Por ahora la activación es siempre reactiva, por detección. **No se engancha al Nivel de Amenaza** (`../game-design.md` §6c.3) — los umbrales de Amenaza no cambian el comportamiento de detección/movimiento de los enemigos, solo los hacen más peligrosos en combate y más perceptivos, ver §6c.3.)
- **¿Reaparecen?** → **No (decidido):** los enemigos **no reaparecen** con el tiempo; se **colocan al generar el mapa** y una zona limpiada queda **despejada** (progreso permanente). Su ubicación es cosa de la generación (`../board/board-map.md` §2, §2c): con el sistema de **tiles** se pintan en **agrupaciones temáticas** (un campamento en una esquina de una Llanura, salas con enemigos repartidos en una mazmorra…); en el **prototipo** se siembran **aleatoriamente** por la tabla B (`../board/board-map.md` §2c). *(En Campaña, un evento scriptado podría añadir enemigos puntualmente — idea futura, no un respawn automático.)*

## 2b. Fase de aproximación y prueba de sigilo

Formaliza cómo el héroe se acerca a un enemigo **Latente** antes de que empiece el combate, y define la **prueba de evitar detección** que ya asumían varias cartas (armadura ruidosa, *Escabullirse* del Pícaro, *Marca del cazador*, estado *Oculto*) pero que no estaba escrita.

**Los alcances en juego** (independientes: **normalmente ves al enemigo antes de que él pueda detectarte**, y eso es un invariante de balance a preservar, no una casualidad — `../game-design.md` §2.3):
- **Visión de detalle del héroe** (`2 + mod SAB`, `../game-design.md` §2.3): revela al enemigo en el mapa. En el roster actual va de **2** (Pícaro) a **4** (Clérigo).
- **Detección del enemigo** (`2 + mod SAB` del enemigo, §2), reducida por la ocultación del terreno del héroe (Bosque −1). En el bestiario actual va de **1** (Bandido) a **4** (jefe final).

> Con la base de detalle bajada de 3 a 2 (`../game-design.md` §2.3, 2026-08-05), el Pícaro empata en vez de superar al Lobo, Trasgo y Esqueleto (detección 2 los tres): el invariante ya solo se cumple estricto contra el Bandido. No es un descuido, es la perilla que se movió para acortar cuánto veía el héroe; si el sigilo del Pícaro se siente injusto contra esos tres, la corrección va aquí, no en el mapa.

> Con los radios anteriores (visión del héroe 1 vs. detección enemiga 2) pasaba **exactamente lo contrario**: el enemigo te detectaba antes de que tú lo vieras, así que la fase de aproximación de abajo casi nunca podía dispararse y todo el sistema de sigilo quedaba muerto sobre el papel. Arreglado en `../game-design.md` §2.3.

**Fases al acercarte a un enemigo que ya ves** (ficha de Enemigo, o ya detectado):

1. **Fuera de su detección:** el enemigo sigue Latente; te acercas (o lo rodeas) sin tirar nada.
2. **Entras en su rango de detección → Prueba de sigilo:**
   - **Tirada:** `1d20 + mod DES` del héroe **vs CD = 10 + mod SAB del enemigo**.
   - **Modificadores:** ventaja/desventaja y bonos de cartas/terreno se aplican aquí — armadura ruidosa = **desventaja** ([`../cards/armor.md`](../cards/armor.md) §5), *Escabullirse* del Pícaro = **+2** ([`../cards/class.md`](../cards/class.md)), *Marca del cazador* ([`../cards/curses.md`](../cards/curses.md)) hace que entres en su detección **1 hex antes**. El estado **Oculto** ([`../effects.md`](../effects.md)) **salta la prueba** (indetectable hasta que actúes).
   - **Cuándo se tira:** al **entrar** en el rango, y de nuevo **cada turno que te muevas** dentro. Si te quedas quieto no haces ruido y **no re-tiras**.
   - **Éxito** → el enemigo sigue **Latente**; puedes seguir acercándote o retirarte.
   - **Fallo** → el enemigo pasa a **Activo** (§2): te ha detectado, arranca la persecución/combate (§5b.6).
3. **Ataque desde el sigilo = emboscada:** si llegas a adyacencia (melee) o abres fuego (a distancia) **sin haber sido detectado**, es una **emboscada**: atacas **con ventaja** y **actúas primero** (ignoras la iniciativa el primer turno) — coherente con la emboscada de Bosque (`../board/board-map.md` §3a) y *Golpe de las sombras* ([`../cards/encounter.md`](../cards/encounter.md)).

**Por qué importa el alcance del enemigo:** contra un enemigo **a distancia**, colarte sin ser detectado te deja **pegarte a él**, y desde ahí solo puede dispararte **a bocajarro, con Desventaja** (§5b.6 paso 3, `../board/battle.md` §2); si te detecta de lejos, abrirá fuego desde su alcance con la tirada limpia. Contra uno melee, la emboscada te da el primer golpe con ventaja.

**Fichas ambiguas (Amenaza):** esta fase solo aplica a enemigos que **ya ves** (ficha de Enemigo o ya detectados). Una ficha de **Amenaza** (`../board/board-map.md` §4) es incierta hasta interactuar: puede **sorprenderte** y arrancar el combate sin fase de aproximación previa (el mazo de encuentro puede dar *¡Emboscada!* a su favor, [`../cards/encounter.md`](../cards/encounter.md)).

## 3. Categorías de enemigo (ejemplo, no oficial)

| Categoría | CR de referencia (D&D) | Dónde aparece | Notas |
|---|---|---|---|
| Normal | CR 1/8 – 1 | Ficha de Amenaza/Enemigo normal, cualquier terreno | Combate rápido, loot menor |
| Élite | CR 2 – 5 | Ficha de Enemigo en la **Guarida** (`../board/board-map.md` §3b-bis) o en un hexágono de **Mazmorra** (§3a), y como boss de la **Partida rápida** | Combate más largo/duro, loot garantizado bueno |
| Jefe de capítulo | CR 6 – 10 | Asociado a un Castillo/Fortaleza o evento narrativo concreto en Modo Campaña | Ligado a la historia de ese capítulo, no aparece en **Partida rápida** |
| Jefe final de campaña | CR 11+ | Último mapa de la Campaña (`../board/board-map.md` §2b) | Cierra el arco narrativo principal, el más elaborado de todos |

Los rangos de CR son solo una referencia de partida tomada de D&D para ordenar la dificultad relativa entre categorías, no implican usar las stats exactas del Manual de Monstruos — el sistema de combate propio (`../game-design.md`) tendrá su propia forma de medir dificultad más adelante.

> **Nota:** la categoría más baja se llama **Normal** (no "Común") a propósito, para no confundirla con la **Rareza** "Común" de las cartas (`../game-design.md` §3.3), que en la wiki se pinta como una mini-carta gris.

## 3b. Naturaleza de criatura y resistencias

Eje **independiente** de la Categoría (§3, que mide dificultad/CR): la **Naturaleza** clasifica de qué está hecha la criatura y de ahí saca sus resistencias/vulnerabilidades **por defecto** a los tipos de daño (`../game-design.md` §4b.10). Un enemigo concreto puede tener además una excepción propia como **habilidad especial** sin que eso cambie su Naturaleza (ej. el Trol de las minas y el fuego, §5b.3, no es una resistencia/vulnerabilidad de daño sino una interrupción de su Regeneración).

| Naturaleza | Resistente a | Vulnerable a | Ejemplos del bestiario |
|---|---|---|---|
| Humanoide | — | — | Bandido merodeador, Trasgo de pantano, Capitán bandido |
| Bestia | — | — | Lobo de las lindes, Araña cavernaria, Araña matriarca |
| Gigante | — | — | Trol de las minas *(su interacción con el 🔥 es habilidad, no resistencia — §5b.3)* |
| No-muerto | 🏹 | 🔨, ☀️ | Esqueleto errante |
| Sombrío *(entidad de oscuridad/corrupción, no un cadáver animado)* | 🗡️, 🏹 | ☀️ | Sombra que Devora (jefe final, §5b.4) |

- **Resistente** = mitad de daño; **Vulnerable** = daño doble; **Inmune** (0 daño) queda reservado, sin uso todavía (`../game-design.md` §4b.10).
- **Heraldo Ceniciento *(decidido)*:** es un **No-muerto de alto rango** (jefe de capítulo, §5b.4): invoca No-muertos y usa daño 💀 (Necrótico). Como No-muerto hereda las resistencias/vulnerabilidades por defecto (resistente a 🏹, **vulnerable a 🔨 y ☀️**) — su vulnerabilidad radiante le da un papel claro al Clérigo.
- Naturalezas nuevas (Elemental, Constructo...) se añaden a esta tabla conforme el bestiario las necesite — no hace falta agotar la lista de antemano.

## 4. De la ficha al combate

Al quedar adyacente a una ficha de Amenaza (revelada como enemigo) o de Enemigo, se entra en combate usando el **sistema de combate de `../game-design.md` §4b** (adyacencia, iniciativa por Destreza, recurso de acción por turno, ataque `1d20 + mod` vs Defensa) con el mazo personal y el mazo de encuentro de `../board/board-map.md` §5 (1 carta de condición al iniciar la pelea).

## 5. Boceto de enemigos de ejemplo (nombres orientativos, no oficiales)

**Método de estadísticas:** mismas 6 estadísticas que los héroes (`heroes.md` §2b), con un array base que escala por categoría (más alto = más peligroso), repartido según el sabor de cada criatura:

| Categoría | Array base |
|---|---|
| Normal | 13, 12, 11, 10, 9, 8 |
| Élite | 16, 15, 13, 12, 10, 8 |
| Jefe de capítulo | 18, 16, 16, 13, 12, 10 |
| Jefe final | 20, 18, 18, 15, 14, 12 |

**Normales** (ficha de Amenaza/Enemigo normal):

| Enemigo | FUE | DES | CON | INT | SAB | CAR | Terreno/localización típica | Idea de gancho mecánico |
|---|---|---|---|---|---|---|---|---|
| Lobo de las lindes | 10 | 13 | 12 | 8 | 11 | 9 | Bosque | Ataca mejor en pareja/manada (bonus si hay 2+ juntos) |
| Bandido merodeador | 13 | 12 | 11 | 8 | 9 | 10 | Llanura, Camino/Sendero | Ataque básico; puede robar un objeto y huir en vez de luchar a muerte |
| Trasgo de pantano | 9 | 13 | 12 | 11 | 10 | 8 | Pantano | Bajo HP, veneno al golpear (estado negativo, no solo daño) |
| Esqueleto errante | 12 | 13 | 11 | 8 | 10 | 9 | Ruinas/Mazmorra, Cripta/Cementerio (`../board/board-map.md` §3a y §3b del tablero) | Naturaleza No-muerto (§3b): resistencias/vulnerabilidades por defecto |
| Araña cavernaria | 10 | 13 | 11 | 9 | 12 | 8 | Montaña, Mina | Telaraña: puede inmovilizar/atascar en vez de solo hacer daño |

**Élite** (ficha de Enemigo en la **Guarida** o en un hexágono de **Mazmorra**, y boss de la **Partida rápida**):

| Enemigo | FUE | DES | CON | INT | SAB | CAR | Dónde | Idea de gancho mecánico |
|---|---|---|---|---|---|---|---|---|
| Capitán bandido | 16 | 12 | 13 | 8 | 10 | 15 | Guarida en Llanura/Camino | Llega acompañado de **1** Normal de refuerzo (cuesta 1 del presupuesto de composición, §5b.6); CAR alto porque lidera |
| Trol de las minas | 16 | 13 | 15 | 8 | 12 | 10 | Guarida en Mina | Mucho HP (CON alta), golpe que ignora parte de la armadura ligera |
| Araña matriarca | 12 | 16 | 15 | 10 | 13 | 8 | Guarida en Montaña/Mazmorra | Versión grande de la Araña cavernaria, veneno más fuerte |

**Jefe de capítulo** (Modo Campaña, ejemplo — nombres provisionales hasta tener la historia de `../board/board-map.md` §2b):
- *"El Heraldo Ceniciento"* — FUE 16, DES 12, CON 16, INT 10, SAB 13, **CAR 18** (comanda y corrompe, de ahí su Carisma máximo). Sirviente de rango alto del antagonista de la Campaña, controla un Castillo/Fortaleza tomado en un capítulo intermedio.

**Jefe final de campaña** (ejemplo):
- *"La Sombra que Devora"* — **CON 20** (encarna una amenaza casi imparable), FUE 18, **CAR 18** (domina/corrompe a su paso), SAB 15, DES 14, INT 12. Antagonista principal, cierra el arco narrativo en el último mapa.

## 5b. Bloques de combate

Convierte cada enemigo (sus 6 stats de §5 + categoría) en algo **jugable** en el combate de `../game-design.md` §4b. Usa la **misma matemática que los héroes** (§2, §4b), para que atacar/defender funcione igual en los dos lados. Valores = **primer pase sin balancear**.

### 5b.1 Reglas de derivación

| Valor | Cómo se calcula |
|---|---|
| **PV** | `Dados de Vida × 5 + mod CON × Dados de Vida` (dado de monstruo d8, promedio 5). DV por categoría: Normal **2**, Élite **4**, Jefe de capítulo **9**, Jefe final **14**. Ajustable por criatura (ej. "bajo HP" = menos DV). |
| **CA (Defensa)** | `10 + mod DES + armadura natural` (`../game-design.md` §2). Armadura natural por categoría: Normal +0/+1, Élite +1/+2, Jefe +3/+4. |
| **Bono de ataque** | `mod de la stat del ataque` (FUE melee; DES para ataques a distancia, armas ligeras/finesse y **ataques naturales ágiles de bestias** —mordiscos, zarpazos rápidos—). **Sin bono de competencia**, igual que los héroes (§4b.4) — ver nota de balance abajo. |
| **Daño** | `dado del ataque + mod stat`, con su tipo de daño (🗡️🏹🔨 y otros — `../game-design.md` §4b.10). |
| **Velocidad** | **2 hex de base**, con **3 para los cazadores ágiles** *(decidido)*: Lobo, Araña matriarca y la Sombra que Devora. Movimiento en combate según `../game-design.md` §4b.5. |
| **Detección** | `2 hex + 1 por punto de mod SAB`, reducida por ocultación del héroe (§2). Debe quedar **por debajo** de la visión de detalle del héroe (`../game-design.md` §2.3). |
| **Crítico** | **Igual que el héroe** *(decidido)*: nat 20 = impacto automático y **dados de daño doblados** (no el modificador); nat 1 = fallo automático (`../game-design.md` §4b.4 paso 5). No estaba escrito para los enemigos y ahora sí: es la misma matemática en los dos bandos. |
| **Bono de jefe** | Solo categorías Jefe: **+2 a ataque y a CA** (representa su prestancia sobrenatural), ya incluido en sus bloques. |

> **Nota de balance (accuracy):** como ni héroes ni enemigos tienen bono de competencia, la precisión sale solo de los modificadores + cartas. Si al testear la sensación de "fallo mucho" es alta, la solución es añadir un **bono de competencia global** (+2) a ambos lados — decisión aplazada al balance, no ahora.

> **Velocidad diferenciada — qué arregla y qué no *(decidido)*.** Los 3 hex del Lobo y de la Matriarca son **textura**, no la solución al posicionamiento: como un enemigo mueve su Velocidad completa **y** ataca el mismo turno (§5b.6, paso 4), el *kiting* a pie **no funciona a ninguna velocidad** y no se pretende que funcione (`../game-design.md` §4b.5). Lo que hace la Velocidad 3 es que a esas tres criaturas **no puedas elegir la distancia** ni cortarles la carga con terreno: te alcanzan desde 3 hex. Crear distancia de verdad es cosa del **control** (Inmovilizado / Ralentizado / Oculto, [`../effects.md`](../effects.md)).
>
> **Deliberadamente no se usa Velocidad 1.** Un enemigo más lento que el héroe se vuelve *gratis* para cualquiera que ataque a distancia: te alejas 2, él avanza 1, y lo mueles sin que te toque nunca. El **Trol se queda en 2** por eso, aunque temáticamente pediría ser lento; su peso se expresa en PV y daño, no en velocidad. Esto cierra la personalización que §5b.1 tenía apuntada como futura en `../ideas.md`.

### 5b.2 Normales (2 DV)

| Enemigo | Naturaleza | PV | CA | Vel | Det | Ataque | Habilidad |
|---|---|---|---|---|---|---|---|
| Lobo de las lindes | Bestia | 12 | 12 | **3** | 2 | Mordisco +1 / 1d6+1 🏹 / melee | **Cazador de manada:** ventaja al atacar si otro Lobo está adyacente al objetivo |
| Bandido merodeador | Humanoide | 10 | 12 | 2 | **1** | Cimitarra +1 / 1d6+1 🗡️ / melee | **Escurridizo:** por debajo del 50 % de PV, en su turno roba un objeto (si adyacente) o **huye** (Desengancharse, §5b.6) en vez de atacar |
| Trasgo de pantano | Humanoide | 6 | 12 | 2 | 2 | Daga emponzoñada +1 / 1d4+1 🏹 / melee | **Veneno:** al impactar aplica Envenenado (salvación CON CD 12, [`../effects.md`](../effects.md)) |
| Esqueleto errante | No-muerto | 10 | 12 | 2 | 2 | Espada mellada +1 / 1d6+1 🗡️ / melee | Resistencias/vulnerabilidades de su Naturaleza (§3b): resistente a 🏹, vulnerable a 🔨 y ☀️ |
| Araña cavernaria | Bestia | 10 | 12 | 2 | **3** | Mordisco +1 / 1d6+1 🏹 + Envenenado (CON CD 12) / melee · Telaraña (alcance 2) | **Telaraña:** aplica Inmovilizado (salvación DES CD 12) sin daño |

> **Detección recalculada:** los valores de la columna Det salen de `2 + mod SAB` (§5b.1), así que varían por criatura: Bandido (SAB 9) **1**, Lobo/Trasgo/Esqueleto (SAB 10-11) **2**, Araña cavernaria (SAB 12) **3**. Antes la columna decía 2 para todos, que era la base sin aplicar el modificador.

> **Nota — Dados de Vida variables:** el Trasgo de pantano usa **1 DV** (por su gancho *bajo HP*), de ahí sus 6 PV en vez de ~12; el resto de Normales usan los 2 DV de la sección. Es la excepción "ajustable por criatura" de §5b.1.

### 5b.3 Élite (4 DV)

| Enemigo | Naturaleza | PV | CA | Vel | Det | Ataque | Habilidad |
|---|---|---|---|---|---|---|---|
| Capitán bandido | Humanoide | **24** | 13 | 2 | 2 | Espada +3 / 1d8+3 🗡️ / melee | **Comandante:** llega con **1** Normal de refuerzo; mientras el Capitán viva, el refuerzo ataca con +1 |
| Trol de las minas | Gigante | **28** | 13 | 2 | **3** | Garras +3 / 1d10+3 🔨 / melee (ignora el bono de armadura ligera del objetivo) | **Regeneración:** **+1 PV** al inicio de su turno, salvo que recibiera daño de **🔥 (fuego)** ese turno (Antorcha, Bola de fuego) — habilidad propia, no una vulnerabilidad de su Naturaleza (§3b) |
| Araña matriarca | Bestia | **28** | 14 | **3** | **3** | Mordisco +3 / 1d8+3 🏹 + Veneno fuerte (2d4, CON CD 14) · Telaraña (alcance 3, DES CD 14) | **Veneno potente + Telaraña** (versión dura de la cavernaria) |

> **Los Élite bajan de 5 DV a 4 *(decidido)*, y la regeneración del Trol de +2 a +1.** Uno de estos tres es el **boss de la Partida rápida** (§6), elegido al azar, y con los valores anteriores (30/35/35 PV, regen +2) **los tres ganaban a los cuatro héroes**: el Guerrero tardaba 8,6 turnos en matar al Capitán y moría en 2, y contra el Trol tardaba **23 turnos** porque la regeneración de +2 se comía el 57 % de su daño. Con estas cifras, más los PV de protagonista (`../game-design.md` §2) y el ataque secundario (§4b.3), el boss se pelea a **5-6 turnos por bando**: se puede ganar, pero jugando bien.
>
> **Aviso concreto sobre el Trol:** su habilidad exige una respuesta de **fuego** y **ningún kit inicial lleva una** (`heroes.md` §2d) — la Antorcha necesita una mano libre y el Guerrero va con Espada + Escudo. Con regen +1 el Trol es ganable sin fuego (5,7 turnos), pero **encontrar una Antorcha o llevar al Mago sigue siendo la jugada**. Si al testear se quiere volver a subirle la regeneración, primero hay que darle al héroe una fuente de fuego accesible.

### 5b.4 Jefes (con Bono de jefe +2 ya incluido)

**Jefe de capítulo — "El Heraldo Ceniciento"** (9 DV) — Naturaleza **No-muerto de alto rango** (§3b): resistente a 🏹, vulnerable a 🔨 y ☀️
- **PV** 72 · **CA** 16 · **Vel** 2 · **Det** 3
- **Ataque:** Guadaña cenicienta +5 / 2d6+3 💀 / alcance 2
- **Habilidades:** (1) *Aura de corrupción* — al empezar el combate y cada 3 turnos, el héroe salva SAB CD 14 o queda **Asustado** ([`../effects.md`](../effects.md)); (2) *Invocar* — cada 2 turnos aparece 1 Esqueleto errante.

**Jefe final — "La Sombra que Devora"** (14 DV, **diseño multifase — boceto**) — Naturaleza **Sombrío** (§3b): resistente a 🗡️/🏹, vulnerable a ☀️
- **PV** 140 · **CA** 18 · **Vel 3** · **Det** 4
- **Ataque:** Zarpa devoradora +6 / 2d8+4 💀 / alcance 2, y **Drenar** (se cura la mitad del daño infligido)
- **Habilidades:** combate **multifase** (al 66 % y al 33 % de PV gana un nuevo efecto / invoca sombras). Un jefe final merece diseño a medida cuando se escriba la Campaña — esto es solo el bloque base.

### 5b.5 Cómo se usa un bloque en combate

1. El enemigo tira **iniciativa** (1d20 + mod DES) como el héroe (§4b.2).
2. En su turno usa su **Velocidad** para acercarse (§4b.5) y **1 ataque**: `1d20 + bono de ataque` vs la **CA del héroe**; si impacta, aplica el daño y cualquier estado. **Nat 20 = crítico** (dados de daño doblados), **nat 1 = fallo** — igual que el héroe (§5b.1, `../game-design.md` §4b.4).
   - *Un enemigo tiene **1 ataque por turno**: no existe el ataque secundario de la Acción rápida, que es exclusivo del héroe (`../game-design.md` §4b.3). Es la compensación por que el héroe pelee solo contra varios.*
3. Sus **habilidades** modifican esto según su texto. Los estados usan [`../effects.md`](../effects.md).
4. Al llegar a **0 PV** cae y suelta oro/loot (`../game-design.md` §6b.1).

> El **orden de decisiones** completo de un enemigo (cuándo mueve, ataca, usa habilidad o huye) está en §5b.6.

### 5b.6 IA de combate (patrón único del prototipo)

Cómo decide un enemigo **Activo** (§2) qué hacer en su turno. Es **determinista**: no hay tirada para decidir, se recorre una lista de prioridades y se ejecuta la primera opción aplicable — así el jugador puede anticipar al enemigo y el balance es predecible. Por ahora es **un único patrón para todos los enemigos**; los arquetipos de comportamiento (melee agresivo, kiter a distancia, soporte-invocador, escaramuzador) son una **evolución futura** ([`../ideas.md`](../ideas.md)).

**Objetivo:** el enemigo actúa siempre contra la **ficha aliada más cercana** — héroe o mercenario invocado (`../cards/mercenaries.md` §1b), sin distinción entre los dos: el mercenario cuenta como objetivo válido igual que un héroe *(decidido 2026-08-06, para el prototipo del co-op de 1-4 héroes, `heroes.md` §4)*. Empate de distancia → el objetivo con menos PV.

> **Refinamiento diferido a Fase 2, no del primer pase:** un tope de 2 criaturas enemigas por objetivo/ronda con desempate por rol de Naturaleza (Soporte/Invocador antes que Tanque) queda escrito como mejora futura de este mismo árbol — sustituiría el simple "menos PV" de arriba cuando varias criaturas deterministas convergen sobre el mismo objetivo. No bloquea el prototipo: se construye cuando se rediseñe la IA de verdad.

**Árbol de prioridades (en su turno, de arriba abajo — ejecuta la primera opción aplicable):**

0. **Inicio de turno (automático, no es una elección):** resolver lo que se dispara "al inicio de tu turno" — regeneración (Trol), daño de estados que sufra el propio enemigo (Envenenado, [`../effects.md`](../effects.md)) y avanzar contadores de habilidad (Invocar cada 2 turnos, Aura cada 3). Comprobar umbrales de PV (multifase / huida).
1. **¿Debe huir?** Si una habilidad lo ordena (ej. Bandido *Escurridizo* por debajo del 50 % de PV): intenta la **huida** (ver abajo).
2. **¿Habilidad lista y útil?** Si tiene una habilidad activa disponible cuyo disparador se cumple y mejora su situación (ej. *Invocar* del Heraldo, *Telaraña* si el héroe no está ya Inmovilizado), la usa como su **Acción**.
3. **¿Puede atacar ya?** Si el objetivo está **en alcance** (adyacente para melee; dentro de alcance para distancia, `../board/battle.md` §2), **ataca** (§5b.5).
   - **Enemigo a distancia con el héroe encima *(precisado)*:** dispara **a bocajarro con Desventaja** (`../board/battle.md` §2) — **no** se aleja. Antes este paso decía que primero retrocedía hasta ≥2 hex ("kiting"), y eso era imposible de resolver: salir de tu adyacencia le obliga a **Desengancharse** (§4b.11) y, con la Velocidad igualada, el héroe se le vuelve a pegar en su turno. El enemigo pagaba un golpe gratis cada turno para no ganar nada. Disparar con Desventaja es la opción determinista y además simétrica con lo que puede hacer el héroe.
4. **¿Acercarse?** Si el objetivo está fuera de alcance, gasta **Movimiento** para acercarse por la ruta transitable más corta (coste de terreno, `../board/board-map.md` §3a). Si tras moverse queda en alcance, ataca (paso 3).
5. **Sin nada útil** (bloqueado, sin ruta): se acerca lo máximo posible y termina el turno.

**Huida — es la regla de Desengancharse, pero ya no sale de la pantalla de batalla *(corregido 2026-08-07)*:** el enemigo que huye usa la **misma** tirada enfrentada `1d20 + mod DES` que el héroe cuando huye él (`../game-design.md` §4b.11 — una sola regla para los dos sentidos, en vez de las dos distintas que había antes):
- **Gana el enemigo** → se desengancha limpio: usa su Movimiento para alejarse dentro del tablero de batalla.
- **Gana el héroe** → el enemigo **recibe el daño del ataque básico del héroe sin tirada de ataque** y **se aleja igualmente**. *(Antes esto era "no logra soltarse y se queda"; ahora ambos bandos siguen la misma resolución: huir siempre funciona, pero puede costarte un golpe.)*
- **Los enemigos no salen del tablero de batalla — de momento solo lo hacen héroes y jugadores, vía Retirada** (`../board/battle.md` §8) *(decidido 2026-08-07)*. Un enemigo "que huye" se reposiciona con Desengancharse dentro de la rejilla, pero sigue en la pelea hasta caer a 0 PV o hasta que el combate termine por alguna de las condiciones de `../board/battle.md` §9. **Retirado el viejo mecanismo de leash-escape** (2 turnos sin detección/visión → escapa y se pierde el loot), pensado para cuando combate y exploración compartían el mismo mapa grande — en una rejilla de 35 hex no hay a dónde perderse.

**Disparadores de habilidad (unificados):** cada habilidad de un bloque (§5b) se cuelga de uno de estos momentos, para que la IA sepa cuándo evaluarla:

| Momento | Ejemplos del bestiario |
|---|---|
| **Inicio de turno** | Regeneración (Trol); contadores: Invocar cada 2 turnos (Heraldo), Aura cada 3 |
| **Al impactar con el ataque** | Veneno (Trasgo, Arañas), Telaraña → Inmovilizado |
| **Pasiva / condicional** | Cazador de manada (Lobo: ventaja si otro Lobo adyacente), Comandante (Capitán: +1 a refuerzos mientras viva) |
| **Al cruzar un umbral de PV** | Escurridizo (Bandido <50 % → huye), multifase (Sombra al 66 % / 33 %) |

**Varios enemigos a la vez:**
- Cada enemigo tira su **propia iniciativa** (`../game-design.md` §4b.2) y corre el árbol por su cuenta en su turno — sin coordinación táctica compleja (coherente con "determinista simple").
- **Refuerzos** (habilidad propia del Jefe *Capitán Comandante* — ya no depende de la carta *Refuerzos* del mazo de encuentro, retirada por no encajar con el presupuesto de composición, [`../cards/encounter.md`](../cards/encounter.md)) entran **Activos** en el hexágono libre más cercano al combate y actúan desde el turno siguiente (tiran iniciativa al aparecer); cuenta contra el mismo presupuesto de composición de abajo, nunca por encima del tope 6.
- **El tope fijo de 2 enemigos simultáneos se sustituye por un presupuesto de composición ligado al tamaño del bando aliado** *(decidido 2026-08-06, ver también [`../board/battle.md`](../board/battle.md) §4)*. Con el juego pasado a co-op de 1-4 héroes (`heroes.md` §4) y el combate movido a su propia pantalla (E2), una cifra fija dejó de tener sentido: **presupuesto = héroes que entran a la batalla + 1** (tope 6), con coste por categoría Normal 1 / Élite 2 / Jefe 3, y **+1 más si alguien invoca un mercenario** (`../cards/mercenaries.md` §1b) — una ficha aliada con turno propio sube el presupuesto enemigo igual que si fuera un jugador más.

  | Héroes que entran | Presupuesto | Ejemplo de composición |
  |---|---|---|
  | 1 (solo) | 2 | 2 Normales, o 1 Élite — **es el tope de hoy, sin cambios** |
  | 2 | 3 | 3 Normales, o 1 Élite + 1 Normal |
  | 3 | 4 | 2 Lobos + 2 Esqueletos, o 1 Élite + 2 Normales |
  | 4 | 5-6 | 2 Lobos + 2 Esqueletos + 1 Lobo alfa (Élite, cuesta 2) = 6 |

  > **Por qué el tope de 1 existía y qué conserva la fórmula.** El héroe tenía **1 turno**; N enemigos tenían **N turnos**. Con 3 Normales el daño entrante era ~4,7 por turno y el héroe necesitaba 9,5 turnos para limpiarlos: matemáticamente imposible, y no por los valores de cada bloque sino por la **economía de acción**. El presupuesto de arriba es la traducción literal de ese mismo motivo a un bando de tamaño variable: con 1 héroe da exactamente el tope de 2 que ya había, y escala junto con la economía de acción real de la mesa (más héroes con Acción rápida cada uno = más presupuesto enemigo), en vez de congelarse en una cifra pensada para un único atacante.
  >
  > **El dial de dificultad extra sigue siendo el Nivel (1-5, §5d), no más fichas nuevas.** Un "Lobo alfa" no necesita bloque propio: es un Lobo de las lindes en **Nivel 3-4** (mismo gancho de *Cazador de manada*, más PV y mejor ataque/CA por la fórmula de §5d) — así no se rompe "2 Élite distintos como máximo por partida" (§5c) al llenar presupuestos de 5-6.
  >
  > La composición de una ficha concreta (mezcla de Normales/Élite disponible en esa zona) sigue viniendo de §5c; lo que cambia es **cuánto** de esa mezcla entra a pelear, decidido en el momento de abrir la batalla según cuántos héroes (y mercenarios) se presentan, no al generar el mapa.

## 5c. Escala de dificultad (resuelve "hito → CR")

Como el leveling es por **hitos** (no XP; `../game-design.md` §5), no traducimos capítulo a un CR mecánico 1:1. En su lugar, "dónde está el jugador" decide **qué categorías de enemigo aparecen** (los arrays de §5 ya escalan la potencia de cada categoría; esto solo dice **cuándo** sale cada una).

**Partida rápida — por distancia a la entrada:**

| Zona del mapa | Categorías disponibles en esa ficha |
|---|---|
| Cerca de la entrada | Normales |
| Zona media | Normales, o 1 Élite suelto |
| Zona lejana / Guarida | Élite, y el **boss** en la Guarida (§2c del `../board/board-map.md`) |

**Esta tabla ya no fija la cantidad exacta, solo qué categorías puede tener esa ficha** *(corregido 2026-08-06 — antes decía "2 Normales", "1 Élite (+1 Normal)")*: cuántas criaturas entran realmente a pelear lo decide el **presupuesto de composición** de §5b.6 en el momento de abrir la batalla, según cuántos héroes (y mercenarios) se presenten — con 1 héroe solo, el resultado sigue siendo el mismo tope de 2 que había antes de esta revisión.

**Los tres Élite en una misma partida *(decidido)*.** Se reparten así, para que no se repita ninguno:

| Sitio | Qué Élite |
|---|---|
| **Guarida** (garantizada) | El **boss**: 1 de los 3, al azar |
| **Mazmorra** (1 hex reforzado — `../board/board-map.md` §3b-bis) | 1 de los **2 restantes**, al azar. Ya no es opcional por dado: sale si el encaje de losetas ha puesto Mazmorra en la mitad lejana del tablero, o sea en el **29 %** de las partidas |
| Ficha de Enemigo en zona lejana | El que sobre, o ninguno según densidad |

Así una partida completa te enfrenta a **2 Élite distintos como máximo**, y el que te toque de boss cambia la partida entera: el Trol pide fuego (§5b.3), la Matriarca control contra su Telaraña y el Capitán aguantar a dos a la vez.

**Modo Campaña — por nivel de héroe / capítulo:**

| Nivel héroe (~capítulo) | Categorías que aparecen |
|---|---|
| 1-2 (capítulos tempranos) | Normales; 1 Élite como clímax de capítulo |
| 3-4 (capítulos medios) | Normales duros + Élite; **Jefe de capítulo** al final |
| 5 (capítulo final) | Élite + **Jefe final** |

El balance fino (cuántos a la vez, con qué stats exactas) se ajusta al testear; esta tabla solo fija la progresión de amenaza.

## 5d. Nivel de enemigo — dial de dificultad, aparte de Categoría *(decidido)*

Un enemigo tiene, además de su **Categoría** (§3 — qué criatura es, con sus Dados de Vida base y su gancho mecánico), un **Nivel de 1 a 5** — mismo rango y mismas estrellas que héroes y cartas (`../game-design.md` §3.3, §5). Son **dos ejes independientes**:

- **Categoría** decide **qué es** (un Lobo, un Trol, un jefe) y **dónde puede aparecer** (§5c).
- **Nivel** escala **esa misma criatura** hacia arriba sin cambiar lo que es: un Lobo de las lindes Nivel 3 sigue siendo un Lobo — misma IA (§5b.6), mismo gancho (*Cazador de manada*), solo más resistente y más certero. No sustituye a la Categoría ni la duplica: un Élite Nivel 1 sigue siendo más peligroso que un Normal Nivel 5 en términos absolutos, el Nivel solo ajusta dentro de su propia Categoría.

**Por qué un eje aparte y no una quinta Categoría.** Las 4 Categorías ya hacen un trabajo real (variedad de bestiario, dónde aparece cada una, el coste por Categoría dentro del presupuesto de composición, §5b.6) que no hay que tocar. Lo que faltaba era un mando de precisión para subir la dificultad de una criatura concreta sin escribir un bloque nuevo — sobre todo para Modo Campaña, donde §5c ya liga nivel de héroe a qué Categorías aparecen; ahora también puede subir el **Nivel** de esas mismas Categorías en capítulos avanzados en vez de solo cambiar cuál sale.

**Fórmula — mismo espíritu que la progresión de personaje (`../game-design.md` §5):**

- **Nivel 1** = el bloque tal cual está escrito en §5b, sin cambios.
- **Por cada nivel por encima de 1:** +1 Dado de Vida a la fórmula de PV de §5b.1 (`Dados de Vida × 5 + mod CON × Dados de Vida`).
- **En los Niveles 3 y 5** (mismos hitos que los héroes, `../game-design.md` §5): +1 al bono de ataque y +1 a la CA.

**Ejemplo — Lobo de las lindes (Normal, 2 DV base, CON 12/+1, PV 12/CA 12/Mordisco +1) a Nivel 3:**

| Nivel | DV efectivos | PV | Ataque | CA |
|---|---|---|---|---|
| 1 (base, §5b.2) | 2 | 12 | +1 | 12 |
| 2 | 3 | 18 | +1 | 12 |
| 3 | 4 | 24 | +2 | 13 |

Sin escribir un bloque nuevo, un Lobo Nivel 3 pasa de 12 a 24 PV y de +1 a +2 de ataque/13 de CA — un knob de dificultad que cualquier encuentro (o el generador de mapa) puede girar sin tocar el bestiario.

## 6. Próximos pasos / preguntas abiertas

- [x] Decidir estático vs. patrulla para el prototipo — **activación por detección** (latente hasta ver al héroe, luego persigue; §2). No patrulla; los "cazadores" proactivos quedan como idea futura.
- [x] Concretar el **rango de detección del enemigo** → `2 hex + 1 por punto de mod SAB` (§2, §5b.1), con la columna Det de los bloques recalculada por criatura (1-4). Debe quedar **por debajo** de la visión de detalle del héroe (`../game-design.md` §2.3).
- [x] Concretar la **persecución (leash)** → desiste y vuelve a su ancla tras 2 turnos fuera de detección/visión (§2).
- [x] Concretar cómo la **ocultación del terreno** reduce la detección → Bosque −1; estado Oculto = indetectable (§2).
- [x] Definir la **fase de aproximación y la prueba de sigilo** (evitar detección) → §2b: `1d20 + mod DES` vs `10 + mod SAB` del enemigo, re-tirada al moverte dentro del rango, y **emboscada** (ventaja + iniciativa) si te cuelas sin ser visto.
- [x] Poner stats básicas (sin balancear) a los enemigos del boceto de arriba (normales, élite y jefes — §5).
- [x] Definir **bloques de combate jugables** (PV, CA, ataque, daño, velocidad, detección, habilidad) para los 10 enemigos de ejemplo — §5b. Falta balancear.
- [x] Definir la **IA de combate** (bucle de decisión turno a turno) → §5b.6: árbol de prioridades **determinista**, patrón único, huida por prueba enfrentada de DES, disparadores de habilidad unificados. Los arquetipos de comportamiento quedan como evolución futura (`../ideas.md`).
- [x] Boss de la **Partida rápida** = **uno de los 3 Élite, elegido al azar** al generar el mapa *(decidido)*; habita la Guarida y derrotarlo cierra la partida (`../board/board-map.md` §2b, §3b). Pendiente (balance): si el Élite-boss recibe algún refuerzo extra sobre su bloque normal (§5b).
- [x] Definir cómo escala la dificultad según profundidad del mapa / nivel del personaje → §5c (qué categorías aparecen por zona en **Partida rápida** y por nivel/capítulo en Campaña). Falta balancear cantidades.
- [x] **Personalizar la Velocidad por criatura** *(decidido)*: base 2, **3** para Lobo / Araña matriarca / Sombra que Devora, **ningún enemigo a 1** (§5b.1). Cierra lo que estaba apuntado como futuro en `../ideas.md`.
- [x] **Escribir los críticos de los enemigos** *(decidido)*: simétricos con el héroe, nat 20 dobla dados (§5b.1, §5b.5). No estaban definidos.
- [x] **Tope de 2 enemigos simultáneos** *(decidido, luego superado)* — era un límite de **economía de acción** (el héroe tiene 1 turno, N enemigos tienen N), no de balance de bloques. **Sustituido 2026-08-06** por el **presupuesto de composición** (§5b.6, arriba), que generaliza ese mismo motivo a 1-4 héroes: con 1 solo, el resultado sigue siendo 2, sin cambios.
- [x] **Rebajar los Élite** *(decidido)*: 5 DV → **4** (24/28/28 PV) y regeneración del Trol +2 → **+1** (§5b.3). Con los valores anteriores los tres ganaban a los cuatro héroes.
- [x] Resolver el paso 3 de la IA para enemigos a distancia con el héroe adyacente → **disparan a bocajarro con Desventaja**, no retroceden (§5b.6). El "kiting" anterior era irresoluble con la Velocidad igualada.
- [ ] Decidir si los nombres/historia de los jefes de capítulo y final son estos provisionales o se rediseñan al escribir la Campaña de verdad.
- [ ] Al testear: revisar si el **Bandido** (Det 1) es *demasiado* fácil de emboscar, ahora que la visión de detalle del héroe va de 3 a 5 (§2b).
- [ ] Cuando quieras, ir añadiendo más enemigos al bestiario de §5 (normales, élite, o nuevos jefes).
- [x] Formalizar el sistema de tipos de daño y resistencias → **Naturaleza de criatura** (§3b) con resistencias/vulnerabilidades por defecto; multiplicadores y lista de tipos en `../game-design.md` §4b.10. Falta balancear (¿son los multiplicadores correctos? ¿demasiados/pocos tipos?).
- [x] Naturaleza del Heraldo Ceniciento = **No-muerto de alto rango** *(decidido)*: hereda resistente 🏹 / vulnerable 🔨,☀️ (§3b, §5b.4).
- [x] Definir el **Nivel de enemigo** (1-5, eje aparte de Categoría) → §5d: +1 Dado de Vida por nivel, +1 ataque/CA en Niveles 3 y 5, mismo rango que héroes y cartas. Falta decidir qué Nivel trae cada aparición concreta en Campaña (§5c) y balancear.
- [ ] Asignar Naturaleza (§3b) a cualquier enemigo nuevo que se añada al bestiario.
- [x] Diseñar la ficha visual de **Jefe de capítulo** y **Jefe final de campaña** → corona (👑), la misma para las dos categorías, distinta de la ficha genérica de Enemigo (`../board/board-map.md` §4c). Se prueba en `/dev/pieces`. Vive en Modo Campaña, que todavía no tiene motor de generación.
