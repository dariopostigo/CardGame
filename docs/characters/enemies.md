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
  - **Activo:** una vez **detectado** el héroe (prueba de sigilo fallada, §2b), se mueve hacia él por el mapa (persecución), inicia combate al quedar adyacente y se sigue moviendo dentro del combate.
- **¿Detección activa?** → **Sí, es el disparador del movimiento.** Cuando el héroe entra en el **rango de detección** del enemigo se resuelve una **prueba de sigilo** (§2b): el enemigo solo pasa a Activo si la falla (o si el héroe no puede ser sigiloso). Reglas del rango (los detalles de la prueba, en §2b):
  - **Rango de detección** = **2 hex base + 1 por punto de modificador de Sabiduría** del enemigo (misma escala que la visión del héroe, `../game-design.md` §2.3, pero con base 2 frente a la base 3 del héroe: el enemigo está alerta en su puesto, pero el héroe **debe** ver primero — es el invariante de §2b).
  - **Reducción por terreno/sigilo:** la ocultación del terreno del héroe resta al rango (**Bosque −1**; Llanura/Camino sin reducción — `../board/board-map.md` §3/§4). El estado **Oculto** ([`../effects.md`](../effects.md)) hace al héroe **indetectable** hasta que actúe.
  - **Persecución (leash):** si el héroe sale del rango de detección y de la línea de visión del enemigo durante **2 turnos seguidos**, el enemigo **desiste**, vuelve a su hexágono ancla, recupera sus PV y pasa de nuevo a Latente. Esto da sentido mecánico a huir/ocultarse.
  - *(Idea futura, aún sin decidir — nota del diseñador:* enemigos o eventos "cazadores" que busquen proactivamente al héroe por el mapa **antes** de detectarlo por visión. Por ahora la activación es siempre reactiva, por detección. **No se engancha al Nivel de Amenaza** (`../game-design.md` §6c.3) — los umbrales de Amenaza no cambian el comportamiento de detección/movimiento de los enemigos, solo los hacen más peligrosos en combate y más perceptivos, ver §6c.3.)
- **¿Reaparecen?** → **No (decidido):** los enemigos **no reaparecen** con el tiempo; se **colocan al generar el mapa** y una zona limpiada queda **despejada** (progreso permanente). Su ubicación es cosa de la generación (`../board/board-map.md` §2, §2c): con el sistema de **tiles** se pintan en **agrupaciones temáticas** (un campamento en una esquina de una Llanura, salas con enemigos repartidos en una mazmorra…); en el **prototipo** se siembran **aleatoriamente** por la tabla B (`../board/board-map.md` §2c). *(En Campaña, un evento scriptado podría añadir enemigos puntualmente — idea futura, no un respawn automático.)*

## 2b. Fase de aproximación y prueba de sigilo

Formaliza cómo el héroe se acerca a un enemigo **Latente** antes de que empiece el combate, y define la **prueba de evitar detección** que ya asumían varias cartas (armadura ruidosa, *Escabullirse* del Pícaro, *Marca del cazador*, estado *Oculto*) pero que no estaba escrita.

**Los alcances en juego** (independientes: **normalmente ves al enemigo antes de que él pueda detectarte**, y eso es un invariante de balance a preservar, no una casualidad — `../game-design.md` §2.3):
- **Visión de detalle del héroe** (`3 + mod SAB`, `../game-design.md` §2.3): revela al enemigo en el mapa. En el roster actual va de **3** (Pícaro) a **5** (Clérigo).
- **Detección del enemigo** (`2 + mod SAB` del enemigo, §2), reducida por la ocultación del terreno del héroe (Bosque −1). En el bestiario actual va de **1** (Bandido) a **4** (jefe final).

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

**Por qué importa el alcance del enemigo:** contra un enemigo **a distancia**, colarte sin ser detectado te deja **pegarte a él** y negarle el kiting (§5b.6); si te detecta de lejos, abrirá fuego desde su alcance. Contra uno melee, la emboscada te da el primer golpe con ventaja.

**Fichas ambiguas (Amenaza):** esta fase solo aplica a enemigos que **ya ves** (ficha de Enemigo o ya detectados). Una ficha de **Amenaza** (`../board/board-map.md` §4) es incierta hasta interactuar: puede **sorprenderte** y arrancar el combate sin fase de aproximación previa (el mazo de encuentro puede dar *¡Emboscada!* a su favor, [`../cards/encounter.md`](../cards/encounter.md)).

## 3. Categorías de enemigo (ejemplo, no oficial)

| Categoría | CR de referencia (D&D) | Dónde aparece | Notas |
|---|---|---|---|
| Normal | CR 1/8 – 1 | Ficha de Amenaza/Enemigo normal, cualquier terreno | Combate rápido, loot menor |
| Élite | CR 2 – 5 | Ficha de Enemigo en una localización "Guarida" (`../board/board-map.md` §3b), o como boss de la **Partida rápida** | Combate más largo/duro, loot garantizado bueno |
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
| Esqueleto errante | 12 | 13 | 11 | 8 | 10 | 9 | Ruinas/Cueva, Cripta/Cementerio (`../board/board-map.md` §3b del tablero) | Naturaleza No-muerto (§3b): resistencias/vulnerabilidades por defecto |
| Araña cavernaria | 10 | 13 | 11 | 9 | 12 | 8 | Montaña, Mina | Telaraña: puede inmovilizar/atascar en vez de solo hacer daño |

**Élite** (ficha de Enemigo en localización "Guarida", o boss de la **Partida rápida**):

| Enemigo | FUE | DES | CON | INT | SAB | CAR | Dónde | Idea de gancho mecánico |
|---|---|---|---|---|---|---|---|---|
| Capitán bandido | 16 | 12 | 13 | 8 | 10 | 15 | Guarida en Llanura/Camino | Llega acompañado de 1-2 Normales de refuerzo; CAR alto porque lidera |
| Trol de las minas | 16 | 13 | 15 | 8 | 12 | 10 | Guarida en Mina | Mucho HP (CON alta), golpe que ignora parte de la armadura ligera |
| Araña matriarca | 12 | 16 | 15 | 10 | 13 | 8 | Guarida en Montaña/Cueva | Versión grande de la Araña cavernaria, veneno más fuerte |

**Jefe de capítulo** (Modo Campaña, ejemplo — nombres provisionales hasta tener la historia de `../board/board-map.md` §2b):
- *"El Heraldo Ceniciento"* — FUE 16, DES 12, CON 16, INT 10, SAB 13, **CAR 18** (comanda y corrompe, de ahí su Carisma máximo). Sirviente de rango alto del antagonista de la Campaña, controla un Castillo/Fortaleza tomado en un capítulo intermedio.

**Jefe final de campaña** (ejemplo):
- *"La Sombra que Devora"* — **CON 20** (encarna una amenaza casi imparable), FUE 18, **CAR 18** (domina/corrompe a su paso), SAB 15, DES 14, INT 12. Antagonista principal, cierra el arco narrativo en el último mapa.

## 5b. Bloques de combate

Convierte cada enemigo (sus 6 stats de §5 + categoría) en algo **jugable** en el combate de `../game-design.md` §4b. Usa la **misma matemática que los héroes** (§2, §4b), para que atacar/defender funcione igual en los dos lados. Valores = **primer pase sin balancear**.

### 5b.1 Reglas de derivación

| Valor | Cómo se calcula |
|---|---|
| **PV** | `Dados de Vida × 5 + mod CON × Dados de Vida` (dado de monstruo d8, promedio 5). DV por categoría: Normal **2**, Élite **5**, Jefe de capítulo **9**, Jefe final **14**. Ajustable por criatura (ej. "bajo HP" = menos DV). |
| **CA (Defensa)** | `10 + mod DES + armadura natural` (`../game-design.md` §2). Armadura natural por categoría: Normal +0/+1, Élite +1/+2, Jefe +3/+4. |
| **Bono de ataque** | `mod de la stat del ataque` (FUE melee; DES para ataques a distancia, armas ligeras/finesse y **ataques naturales ágiles de bestias** —mordiscos, zarpazos rápidos—). **Sin bono de competencia**, igual que los héroes (§4b.4) — ver nota de balance abajo. |
| **Daño** | `dado del ataque + mod stat`, con su tipo de daño (🗡️🏹🔨 y otros — `../game-design.md` §4b.10). |
| **Velocidad** | **2 hex para todos** (igualado al movimiento del héroe, `../game-design.md` §2.2; se personalizará por tipo más adelante —algunos más rápidos "cazadores", otros más lentos—, `../ideas.md`). Movimiento en combate según §4b.5. |
| **Detección** | `2 hex + 1 por punto de mod SAB`, reducida por ocultación del héroe (§2). Debe quedar **por debajo** de la visión de detalle del héroe (`../game-design.md` §2.3). |
| **Bono de jefe** | Solo categorías Jefe: **+2 a ataque y a CA** (representa su prestancia sobrenatural), ya incluido en sus bloques. |

> **Nota de balance (accuracy):** como ni héroes ni enemigos tienen bono de competencia, la precisión sale solo de los modificadores + cartas. Si al testear la sensación de "fallo mucho" es alta, la solución es añadir un **bono de competencia global** (+2) a ambos lados — decisión aplazada al balance, no ahora.

### 5b.2 Normales (2 DV)

| Enemigo | Naturaleza | PV | CA | Vel | Det | Ataque | Habilidad |
|---|---|---|---|---|---|---|---|
| Lobo de las lindes | Bestia | 12 | 12 | 2 | 2 | Mordisco +1 / 1d6+1 🏹 / melee | **Cazador de manada:** ventaja al atacar si otro Lobo está adyacente al objetivo |
| Bandido merodeador | Humanoide | 10 | 12 | 2 | **1** | Cimitarra +1 / 1d6+1 🗡️ / melee | **Escurridizo:** por debajo del 50 % de PV, en su turno roba un objeto (si adyacente) o **huye** (Desengancharse, §5b.6) en vez de atacar |
| Trasgo de pantano | Humanoide | 6 | 12 | 2 | 2 | Daga emponzoñada +1 / 1d4+1 🏹 / melee | **Veneno:** al impactar aplica Envenenado (salvación CON CD 12, [`../effects.md`](../effects.md)) |
| Esqueleto errante | No-muerto | 10 | 12 | 2 | 2 | Espada mellada +1 / 1d6+1 🗡️ / melee | Resistencias/vulnerabilidades de su Naturaleza (§3b): resistente a 🏹, vulnerable a 🔨 y ☀️ |
| Araña cavernaria | Bestia | 10 | 12 | 2 | **3** | Mordisco +1 / 1d6+1 🏹 + Envenenado (CON CD 12) / melee · Telaraña (alcance 2) | **Telaraña:** aplica Inmovilizado (salvación DES CD 12) sin daño |

> **Detección recalculada:** los valores de la columna Det salen de `2 + mod SAB` (§5b.1), así que varían por criatura: Bandido (SAB 9) **1**, Lobo/Trasgo/Esqueleto (SAB 10-11) **2**, Araña cavernaria (SAB 12) **3**. Antes la columna decía 2 para todos, que era la base sin aplicar el modificador.

> **Nota — Dados de Vida variables:** el Trasgo de pantano usa **1 DV** (por su gancho *bajo HP*), de ahí sus 6 PV en vez de ~12; el resto de Normales usan los 2 DV de la sección. Es la excepción "ajustable por criatura" de §5b.1.

### 5b.3 Élite (5 DV)

| Enemigo | Naturaleza | PV | CA | Vel | Det | Ataque | Habilidad |
|---|---|---|---|---|---|---|---|
| Capitán bandido | Humanoide | 30 | 13 | 2 | 2 | Espada +3 / 1d8+3 🗡️ / melee | **Comandante:** llega con 1-2 Normales de refuerzo; mientras el Capitán viva, los refuerzos atacan con +1 |
| Trol de las minas | Gigante | 35 | 13 | 2 | **3** | Garras +3 / 1d10+3 🔨 / melee (ignora el bono de armadura ligera del objetivo) | **Regeneración:** +2 PV al inicio de su turno, salvo que recibiera daño de **🔥 (fuego)** ese turno (Antorcha, Bola de fuego) — habilidad propia, no una vulnerabilidad de su Naturaleza (§3b) |
| Araña matriarca | Bestia | 35 | 14 | 2 | **3** | Mordisco +3 / 1d8+3 🏹 + Veneno fuerte (2d4, CON CD 14) · Telaraña (alcance 3, DES CD 14) | **Veneno potente + Telaraña** (versión dura de la cavernaria) |

### 5b.4 Jefes (con Bono de jefe +2 ya incluido)

**Jefe de capítulo — "El Heraldo Ceniciento"** (9 DV) — Naturaleza **No-muerto de alto rango** (§3b): resistente a 🏹, vulnerable a 🔨 y ☀️
- **PV** 72 · **CA** 16 · **Vel** 2 · **Det** 3
- **Ataque:** Guadaña cenicienta +5 / 2d6+3 💀 / alcance 2
- **Habilidades:** (1) *Aura de corrupción* — al empezar el combate y cada 3 turnos, el héroe salva SAB CD 14 o queda **Asustado** ([`../effects.md`](../effects.md)); (2) *Invocar* — cada 2 turnos aparece 1 Esqueleto errante.

**Jefe final — "La Sombra que Devora"** (14 DV, **diseño multifase — boceto**) — Naturaleza **Sombrío** (§3b): resistente a 🗡️/🏹, vulnerable a ☀️
- **PV** 140 · **CA** 18 · **Vel** 2 · **Det** 4
- **Ataque:** Zarpa devoradora +6 / 2d8+4 💀 / alcance 2, y **Drenar** (se cura la mitad del daño infligido)
- **Habilidades:** combate **multifase** (al 66 % y al 33 % de PV gana un nuevo efecto / invoca sombras). Un jefe final merece diseño a medida cuando se escriba la Campaña — esto es solo el bloque base.

### 5b.5 Cómo se usa un bloque en combate

1. El enemigo tira **iniciativa** (1d20 + mod DES) como el héroe (§4b.2).
2. En su turno usa su **Velocidad** para acercarse (§4b.5) y **1 ataque**: `1d20 + bono de ataque` vs la **CA del héroe**; si impacta, aplica el daño y cualquier estado.
3. Sus **habilidades** modifican esto según su texto. Los estados usan [`../effects.md`](../effects.md).
4. Al llegar a **0 PV** cae y suelta oro/loot (`../game-design.md` §6b.1).

> El **orden de decisiones** completo de un enemigo (cuándo mueve, ataca, usa habilidad o huye) está en §5b.6.

### 5b.6 IA de combate (patrón único del prototipo)

Cómo decide un enemigo **Activo** (§2) qué hacer en su turno. Es **determinista**: no hay tirada para decidir, se recorre una lista de prioridades y se ejecuta la primera opción aplicable — así el jugador puede anticipar al enemigo y el balance es predecible. Por ahora es **un único patrón para todos los enemigos**; los arquetipos de comportamiento (melee agresivo, kiter a distancia, soporte-invocador, escaramuzador) son una **evolución futura** ([`../ideas.md`](../ideas.md)).

**Objetivo:** el enemigo actúa siempre contra el **héroe más cercano** (en el prototipo, el único). Empate de distancia → el objetivo con menos PV. *(Con varios héroes/aliados en el futuro se afinará la selección de objetivo.)*

**Árbol de prioridades (en su turno, de arriba abajo — ejecuta la primera opción aplicable):**

0. **Inicio de turno (automático, no es una elección):** resolver lo que se dispara "al inicio de tu turno" — regeneración (Trol), daño de estados que sufra el propio enemigo (Envenenado, [`../effects.md`](../effects.md)) y avanzar contadores de habilidad (Invocar cada 2 turnos, Aura cada 3). Comprobar umbrales de PV (multifase / huida).
1. **¿Debe huir?** Si una habilidad lo ordena (ej. Bandido *Escurridizo* por debajo del 50 % de PV): intenta la **huida** (ver abajo).
2. **¿Habilidad lista y útil?** Si tiene una habilidad activa disponible cuyo disparador se cumple y mejora su situación (ej. *Invocar* del Heraldo, *Telaraña* si el héroe no está ya Inmovilizado), la usa como su **Acción**.
3. **¿Puede atacar ya?** Si el objetivo está **en alcance** (adyacente para melee; dentro de alcance para distancia, `../game-design.md` §4b.1), **ataca** (§5b.5). Un enemigo a distancia que tenga al héroe **demasiado cerca** (adyacente) primero se **aleja** hasta ≥2 hex (kiting) y luego dispara si le queda alcance.
4. **¿Acercarse?** Si el objetivo está fuera de alcance, gasta **Movimiento** para acercarse por la ruta transitable más corta (coste de terreno, `../board/board-map.md` §3a). Si tras moverse queda en alcance, ataca (paso 3).
5. **Sin nada útil** (bloqueado, sin ruta): se acerca lo máximo posible y termina el turno.

**Huida — es la regla de Desengancharse *(decidido)*:** el enemigo que huye usa la **misma** tirada enfrentada `1d20 + mod DES` que el héroe cuando huye él (`../game-design.md` §4b.11 — una sola regla para los dos sentidos, en vez de las dos distintas que había antes):
- **Gana el enemigo** → se desengancha limpio: usa su Movimiento para alejarse.
- **Gana el héroe** → el enemigo **recibe el daño del ataque básico del héroe sin tirada de ataque** y **se aleja igualmente**. *(Antes esto era "no logra soltarse y se queda"; ahora ambos bandos siguen la misma resolución: huir siempre funciona, pero puede costarte un golpe.)*
- Si el enemigo se mantiene fuera de tu detección y visión durante el **leash (2 turnos, §2)**, **escapa del combate** y **se pierde su loot** (se llevó lo robado, en el caso del Bandido).

**Disparadores de habilidad (unificados):** cada habilidad de un bloque (§5b) se cuelga de uno de estos momentos, para que la IA sepa cuándo evaluarla:

| Momento | Ejemplos del bestiario |
|---|---|
| **Inicio de turno** | Regeneración (Trol); contadores: Invocar cada 2 turnos (Heraldo), Aura cada 3 |
| **Al impactar con el ataque** | Veneno (Trasgo, Arañas), Telaraña → Inmovilizado |
| **Pasiva / condicional** | Cazador de manada (Lobo: ventaja si otro Lobo adyacente), Comandante (Capitán: +1 a refuerzos mientras viva) |
| **Al cruzar un umbral de PV** | Escurridizo (Bandido <50 % → huye), multifase (Sombra al 66 % / 33 %) |

**Varios enemigos a la vez:**
- Cada enemigo tira su **propia iniciativa** (`../game-design.md` §4b.2) y corre el árbol por su cuenta en su turno — sin coordinación táctica compleja (coherente con "determinista simple").
- **Refuerzos** (Capitán *Comandante*, carta *Refuerzos* del mazo de encuentro, [`../cards/encounter.md`](../cards/encounter.md)) entran **Activos** en el hexágono libre más cercano al combate y actúan desde el turno siguiente (tiran iniciativa al aparecer).

## 5c. Escala de dificultad (resuelve "hito → CR")

Como el leveling es por **hitos** (no XP; `../game-design.md` §5), no traducimos capítulo a un CR mecánico 1:1. En su lugar, "dónde está el jugador" decide **qué categorías de enemigo aparecen** (los arrays de §5 ya escalan la potencia de cada categoría; esto solo dice **cuándo** sale cada una).

**Partida rápida — por distancia a la entrada:**

| Zona del mapa | Categorías que aparecen |
|---|---|
| Cerca de la entrada | Normales sueltos (1-2) |
| Zona media | Normales en grupo + algún Élite |
| Zona lejana / Guarida | Élite + el **boss** (Élite reforzado, §2c del `../board/board-map.md`) |

**Modo Campaña — por nivel de héroe / capítulo:**

| Nivel héroe (~capítulo) | Categorías que aparecen |
|---|---|
| 1-2 (capítulos tempranos) | Normales; 1 Élite como clímax de capítulo |
| 3-4 (capítulos medios) | Normales duros + Élite; **Jefe de capítulo** al final |
| 5 (capítulo final) | Élite + **Jefe final** |

El balance fino (cuántos a la vez, con qué stats exactas) se ajusta al testear; esta tabla solo fija la progresión de amenaza.

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
- [ ] Decidir si los nombres/historia de los jefes de capítulo y final son estos provisionales o se rediseñan al escribir la Campaña de verdad.
- [ ] Cuando quieras, ir añadiendo más enemigos al bestiario de §5 (normales, élite, o nuevos jefes).
- [x] Formalizar el sistema de tipos de daño y resistencias → **Naturaleza de criatura** (§3b) con resistencias/vulnerabilidades por defecto; multiplicadores y lista de tipos en `../game-design.md` §4b.10. Falta balancear (¿son los multiplicadores correctos? ¿demasiados/pocos tipos?).
- [x] Naturaleza del Heraldo Ceniciento = **No-muerto de alto rango** *(decidido)*: hereda resistente 🏹 / vulnerable 🔨,☀️ (§3b, §5b.4).
- [ ] Asignar Naturaleza (§3b) a cualquier enemigo nuevo que se añada al bestiario.
