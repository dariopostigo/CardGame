# CardGame — Enemigos (borrador)

Documento dedicado exclusivamente a los enemigos: tipos, cómo aparecen en el mapa, comportamiento y jefes. El resto del tablero (terreno, fichas, niebla de guerra) vive en [`board-map.md`](../board/board-map.md); el sistema de combate y estadísticas de personaje viven en [`game-design.md`](../game-design.md). Términos transversales en [`glossary.md`](../glossary.md).

**Base: bestiario de D&D** — los enemigos son variantes con nombre propio de criaturas estándar del Manual de Monstruos (lobo, bandido, trasgo/goblin, esqueleto, araña gigante, trol, etc.), no criaturas de Tolkien/Viajes. Las categorías de dificultad (§3) usan como referencia el concepto de **Nivel de Desafío (CR)** de D&D en vez de inventar una escala propia desde cero.

## 1. Cómo aparece un enemigo en el mapa

Según [`board-map.md`](../board/board-map.md) (sección de fichas del tablero), hay dos formas de encontrarse un enemigo:

- **Ficha de Amenaza** (icono rojo sin definir): ambigua, el jugador no sabe con certeza que es un enemigo hasta interactuar — podría ser otra cosa (trampa, peligro de terreno).
- **Ficha de Enemigo** (icono de enemigo): confirmada de antemano, el jugador ya sabe que va a combatir antes de entrar en el hexágono.

Esta distinción da dos sabores de encuentro: la sorpresa de la Amenaza (tensión de no saber) frente a la decisión táctica del Enemigo confirmado (el jugador puede elegir evitarlo o prepararse antes de entrar).

## 2. Comportamiento en el mapa

- **¿Estáticos o con movimiento?** → **Resuelto (`game-design.md` §4b.5):** modelo de **activación por detección** en dos estados:
  - **Latente:** anclado en su hexágono, **no patrulla**, mientras no detecte al héroe. (Se conserva la idea de "no deambula por el mapa" del prototipo.)
  - **Activo:** al detectar al héroe, se mueve hacia él por el mapa (persecución), inicia combate al quedar adyacente y se sigue moviendo dentro del combate.
- **¿Detección activa?** → **Sí, es el disparador del movimiento.** El enemigo se activa cuando el héroe entra en su **rango de detección**. Reglas concretas (resueltas junto con los bloques de combate, §5b):
  - **Rango de detección** = **2 hex base + 1 por cada +2 de modificador de Sabiduría** del enemigo (misma lógica que la visión del héroe, `game-design.md` §2.3, pero con base 2 porque el enemigo está alerta en su puesto).
  - **Reducción por terreno/sigilo:** la ocultación del terreno del héroe resta al rango (**Bosque −1**; Llanura/Camino sin reducción — `board-map.md` §3/§4). El estado **Oculto** ([`cards/effects.md`](../cards/effects.md)) hace al héroe **indetectable** hasta que actúe.
  - **Persecución (leash):** si el héroe sale del rango de detección y de la línea de visión del enemigo durante **2 turnos seguidos**, el enemigo **desiste**, vuelve a su hexágono ancla, recupera sus PV y pasa de nuevo a Latente. Esto da sentido mecánico a huir/ocultarse.
  - *(Idea futura, nota del diseñador:* enemigos/eventos "cazadores" que busquen al héroe por el mapa **antes** de detectarlo. Por ahora la activación es siempre reactiva.)
- **¿Reaparecen?** Si el jugador limpia una zona de enemigos, ¿el mapa puede generar nuevos con el tiempo (presión constante) o quedan despejados para siempre (progreso permanente)? — sigue abierta.

## 3. Categorías de enemigo (ejemplo, no oficial)

| Categoría | CR de referencia (D&D) | Dónde aparece | Notas |
|---|---|---|---|
| Común | CR 1/8 – 1 | Ficha de Amenaza/Enemigo normal, cualquier terreno | Combate rápido, loot menor |
| Élite | CR 2 – 5 | Ficha de Enemigo en una localización "Guarida" (`board-map.md` §3b), o como boss del Modo Prueba | Combate más largo/duro, loot garantizado bueno |
| Jefe de capítulo | CR 6 – 10 | Asociado a un Castillo/Fortaleza o evento narrativo concreto en Modo Campaña | Ligado a la historia de ese capítulo, no aparece en Modo Prueba |
| Jefe final de campaña | CR 11+ | Último mapa de la Campaña (`board-map.md` §2b) | Cierra el arco narrativo principal, el más elaborado de todos |

Los rangos de CR son solo una referencia de partida tomada de D&D para ordenar la dificultad relativa entre categorías, no implican usar las stats exactas del Manual de Monstruos — el sistema de combate propio (`game-design.md`) tendrá su propia forma de medir dificultad más adelante.

## 4. De la ficha al combate

Al quedar adyacente a una ficha de Amenaza (revelada como enemigo) o de Enemigo, se entra en combate usando el **sistema de combate de `game-design.md` §4b** (adyacencia, iniciativa por Destreza, recurso de acción por turno, ataque `1d20 + mod` vs Defensa) con el mazo personal y el mazo de encuentro de `board-map.md` §5 (1 carta de condición al iniciar la pelea).

## 5. Boceto de enemigos de ejemplo (nombres orientativos, no oficiales)

**Método de estadísticas:** mismas 6 estadísticas que los héroes (`heroes.md` §2b), con un array base que escala por categoría (más alto = más peligroso), repartido según el sabor de cada criatura:

| Categoría | Array base |
|---|---|
| Común | 13, 12, 11, 10, 9, 8 |
| Élite | 16, 15, 13, 12, 10, 8 |
| Jefe de capítulo | 18, 16, 16, 13, 12, 10 |
| Jefe final | 20, 18, 18, 15, 14, 12 |

**Comunes** (ficha de Amenaza/Enemigo normal):

| Enemigo | FUE | DES | CON | INT | SAB | CAR | Terreno/localización típica | Idea de gancho mecánico |
|---|---|---|---|---|---|---|---|---|
| Lobo de las lindes | 10 | 13 | 12 | 8 | 11 | 9 | Bosque | Ataca mejor en pareja/manada (bonus si hay 2+ juntos) |
| Bandido merodeador | 13 | 12 | 11 | 8 | 9 | 10 | Llanura, Camino/Sendero | Ataque básico; puede robar un objeto y huir en vez de luchar a muerte |
| Trasgo de pantano | 9 | 13 | 12 | 11 | 10 | 8 | Pantano | Bajo HP, veneno al golpear (estado negativo, no solo daño) |
| Esqueleto errante | 12 | 13 | 11 | 8 | 10 | 9 | Ruinas/Cueva, Cripta/Cementerio (`board-map.md` §3b) | No-muerto: resistente a perforante, débil a contundente |
| Araña cavernaria | 10 | 13 | 11 | 9 | 12 | 8 | Montaña, Mina | Telaraña: puede inmovilizar/atascar en vez de solo hacer daño |

**Élite** (ficha de Enemigo en localización "Guarida", o boss del Modo Prueba):

| Enemigo | FUE | DES | CON | INT | SAB | CAR | Dónde | Idea de gancho mecánico |
|---|---|---|---|---|---|---|---|---|
| Capitán bandido | 16 | 12 | 13 | 8 | 10 | 15 | Guarida en Llanura/Camino | Llega acompañado de 1-2 Comunes de refuerzo; CAR alto porque lidera |
| Trol de las minas | 16 | 13 | 15 | 8 | 12 | 10 | Guarida en Mina | Mucho HP (CON alta), golpe que ignora parte de la armadura ligera |
| Araña matriarca | 12 | 16 | 15 | 10 | 13 | 8 | Guarida en Montaña/Cueva | Versión grande de la Araña cavernaria, veneno más fuerte |

**Jefe de capítulo** (Modo Campaña, ejemplo — nombres provisionales hasta tener la historia de `board-map.md` §2b):
- *"El Heraldo Ceniciento"* — FUE 16, DES 12, CON 16, INT 10, SAB 13, **CAR 18** (comanda y corrompe, de ahí su Carisma máximo). Sirviente de rango alto del antagonista de la Campaña, controla un Castillo/Fortaleza tomado en un capítulo intermedio.

**Jefe final de campaña** (ejemplo):
- *"La Sombra que Devora"* — **CON 20** (encarna una amenaza casi imparable), FUE 18, **CAR 18** (domina/corrompe a su paso), SAB 15, DES 14, INT 12. Antagonista principal, cierra el arco narrativo en el último mapa.

## 5b. Bloques de combate

Convierte cada enemigo (sus 6 stats de §5 + categoría) en algo **jugable** en el combate de `game-design.md` §4b. Usa la **misma matemática que los héroes** (§2, §4b), para que atacar/defender funcione igual en los dos lados. Valores = **primer pase sin balancear**.

### 5b.1 Reglas de derivación

| Valor | Cómo se calcula |
|---|---|
| **PV** | `Dados de Vida × 5 + mod CON × Dados de Vida` (dado de monstruo d8, promedio 5). DV por categoría: Común **2**, Élite **5**, Jefe de capítulo **9**, Jefe final **14**. Ajustable por criatura (ej. "bajo HP" = menos DV). |
| **CA (Defensa)** | `10 + mod DES + armadura natural` (`game-design.md` §2). Armadura natural por categoría: Común +0/+1, Élite +1/+2, Jefe +3/+4. |
| **Bono de ataque** | `mod de la stat del ataque` (FUE melee, DES a distancia). **Sin bono de competencia**, igual que los héroes (§4b.4) — ver nota de balance abajo. |
| **Daño** | `dado del ataque + mod stat`, con su tipo (cortante/perforante/contundente/otros). |
| **Velocidad** | 2 hex por defecto (bestias ágiles 3; criaturas enormes/lentas pueden bajar a 1). Movimiento en combate según §4b.5. |
| **Detección** | `2 hex + 1 por cada +2 de mod SAB`, reducida por ocultación del héroe (§2). |
| **Bono de jefe** | Solo categorías Jefe: **+2 a ataque y a CA** (representa su prestancia sobrenatural), ya incluido en sus bloques. |

> **Nota de balance (accuracy):** como ni héroes ni enemigos tienen bono de competencia, la precisión sale solo de los modificadores + cartas. Si al testear la sensación de "fallo mucho" es alta, la solución es añadir un **bono de competencia global** (+2) a ambos lados — decisión aplazada al balance, no ahora.

### 5b.2 Comunes (2 DV)

| Enemigo | PV | CA | Vel | Det | Ataque | Habilidad |
|---|---|---|---|---|---|---|
| Lobo de las lindes | 12 | 12 | 3 | 2 | Mordisco +1 / 1d6+1 perforante / melee | **Cazador de manada:** ventaja al atacar si otro Lobo está adyacente al objetivo |
| Bandido merodeador | 10 | 12 | 2 | 2 | Cimitarra +1 / 1d6+1 cortante / melee | **Escurridizo:** por debajo del 50 % de PV, en su turno roba un objeto (si adyacente) o huye en vez de atacar |
| Trasgo de pantano | 6 | 12 | 2 | 2 | Daga emponzoñada +1 / 1d4+1 perforante / melee | **Veneno:** al impactar aplica Envenenado (salvación CON CD 12, [`cards/effects.md`](../cards/effects.md)) |
| Esqueleto errante | 10 | 12 | 2 | 2 | Espada mellada +1 / 1d6+1 cortante / melee | **No-muerto:** resistente a Perforante (½ daño), vulnerable a Contundente y a Radiante (Llama sagrada del Clérigo) |
| Araña cavernaria | 10 | 12 | 2 | 2 | Mordisco +1 / 1d6 perforante + Envenenado (CON CD 12) / melee · Telaraña (alcance 2) | **Telaraña:** aplica Inmovilizado (salvación DES CD 12) sin daño |

### 5b.3 Élite (5 DV)

| Enemigo | PV | CA | Vel | Det | Ataque | Habilidad |
|---|---|---|---|---|---|---|
| Capitán bandido | 30 | 14 | 2 | 2 | Espada +3 / 1d8+3 cortante / melee | **Comandante:** llega con 1-2 Comunes de refuerzo; mientras el Capitán viva, los refuerzos atacan con +1 |
| Trol de las minas | 38 | 13 | 2 | 2 | Garras +3 / 1d10+3 contundente / melee (ignora el bono de armadura ligera del objetivo) | **Regeneración:** +2 PV al inicio de su turno, salvo que recibiera daño de **fuego** ese turno (Antorcha, Bola de fuego) |
| Araña matriarca | 35 | 14 | 3 | 3 | Mordisco +3 / 1d8+3 perforante + Veneno fuerte (2d4, CON CD 14) · Telaraña (alcance 3, DES CD 14) | **Veneno potente + Telaraña** (versión dura de la cavernaria) |

### 5b.4 Jefes (con Bono de jefe +2 ya incluido)

**Jefe de capítulo — "El Heraldo Ceniciento"** (9 DV)
- **PV** 72 · **CA** 16 · **Vel** 2 · **Det** 3
- **Ataque:** Guadaña cenicienta +5 / 2d6+3 necrótico / alcance 2
- **Habilidades:** (1) *Aura de corrupción* — al empezar el combate y cada 3 turnos, el héroe salva SAB CD 14 o queda **Asustado** ([`cards/effects.md`](../cards/effects.md)); (2) *Invocar* — cada 2 turnos aparece 1 Esqueleto errante.

**Jefe final — "La Sombra que Devora"** (14 DV, **diseño multifase — boceto**)
- **PV** 120 · **CA** 18 · **Vel** 3 · **Det** 4
- **Ataque:** Zarpa devoradora +6 / 2d8+4 necrótico / alcance 2, y **Drenar** (se cura la mitad del daño infligido)
- **Habilidades:** combate **multifase** (al 66 % y al 33 % de PV gana un nuevo efecto / invoca sombras). Un jefe final merece diseño a medida cuando se escriba la Campaña — esto es solo el bloque base.

### 5b.5 Cómo se usa un bloque en combate

1. El enemigo tira **iniciativa** (1d20 + mod DES) como el héroe (§4b.2).
2. En su turno usa su **Velocidad** para acercarse (§4b.5) y **1 ataque**: `1d20 + bono de ataque` vs la **CA del héroe**; si impacta, aplica el daño y cualquier estado.
3. Sus **habilidades** modifican esto según su texto. Los estados usan [`cards/effects.md`](../cards/effects.md).
4. Al llegar a **0 PV** cae y suelta oro/loot (`game-design.md` §6b.1).

## 5c. Escala de dificultad (resuelve "hito → CR")

Como el leveling es por **hitos** (no XP; `../game-design.md` §5), no traducimos capítulo a un CR mecánico 1:1. En su lugar, "dónde está el jugador" decide **qué categorías de enemigo aparecen** (los arrays de §5 ya escalan la potencia de cada categoría; esto solo dice **cuándo** sale cada una).

**Modo Prueba — por distancia a la entrada:**

| Zona del mapa | Categorías que aparecen |
|---|---|
| Cerca de la entrada | Comunes sueltos (1-2) |
| Zona media | Comunes en grupo + algún Élite |
| Zona lejana / Guarida | Élite + el **boss** (Élite reforzado, §2c del `board-map.md`) |

**Modo Campaña — por nivel de héroe / capítulo:**

| Nivel héroe (~capítulo) | Categorías que aparecen |
|---|---|
| 1-2 (capítulos tempranos) | Comunes; 1 Élite como clímax de capítulo |
| 3-4 (capítulos medios) | Comunes duros + Élite; **Jefe de capítulo** al final |
| 5 (capítulo final) | Élite + **Jefe final** |

El balance fino (cuántos a la vez, con qué stats exactas) se ajusta al testear; esta tabla solo fija la progresión de amenaza.

## 6. Próximos pasos / preguntas abiertas

- [x] Decidir estático vs. patrulla para el prototipo — **activación por detección** (latente hasta ver al héroe, luego persigue; §2). No patrulla; los "cazadores" proactivos quedan como idea futura.
- [x] Concretar el **rango de detección del enemigo** → 2 hex base + SAB scaling (§2, §5b.1).
- [x] Concretar la **persecución (leash)** → desiste y vuelve a su ancla tras 2 turnos fuera de detección/visión (§2).
- [x] Concretar cómo la **ocultación del terreno** reduce la detección → Bosque −1; estado Oculto = indetectable (§2).
- [x] Poner stats básicas (sin balancear) a los enemigos del boceto de arriba (comunes, élite y jefes — §5).
- [x] Definir **bloques de combate jugables** (PV, CA, ataque, daño, velocidad, detección, habilidad) para los 10 enemigos de ejemplo — §5b. Falta balancear.
- [ ] Definir el enemigo élite/boss del Modo Prueba en detalle (vínculo con la localización "Guarida" de `board-map.md` §3b) — probablemente uno de los 3 Élite de arriba.
- [x] Definir cómo escala la dificultad según profundidad del mapa / nivel del personaje → §5c (qué categorías aparecen por zona en Prueba y por nivel/capítulo en Campaña). Falta balancear cantidades.
- [ ] Decidir si los nombres/historia de los jefes de capítulo y final son estos provisionales o se rediseñan al escribir la Campaña de verdad.
- [ ] Cuando quieras, ir añadiendo más enemigos al bestiario de §5 (comunes, élite, o nuevos jefes).
