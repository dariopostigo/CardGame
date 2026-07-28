# CardGame — Tablero y mapa (borrador)

Documento dedicado exclusivamente al tablero/mapa. El resto de sistemas (personaje, cartas, progresión) vive en [`../game-design.md`](../game-design.md), con los héroes jugables en [`../characters/heroes.md`](../characters/heroes.md). Los detalles técnicos de implementación (modelo de datos, algoritmos) viven aparte en [`board-map-dev.md`](board-map-dev.md). Todo lo relativo a enemigos (tipos, comportamiento, jefes) vive en [`../characters/enemies.md`](../characters/enemies.md), y los NPCs no hostiles en [`../characters/npcs.md`](../characters/npcs.md). Términos transversales en [`../glossary.md`](../glossary.md).

> Referencia visual confirmada: `public/assets/viajesporlatierramedia_tablero.jpg` (tablero real de *Journeys in Middle-earth*). Detalles que se ven en la imagen y que ya están incorporados a este documento: fichas modulares formadas por **varios hexágonos agrupados** (no hexágonos sueltos), terrenos claramente diferenciados por color/arte (bosque oscuro vs. pradera con caminos y aldeas), una pieza de río serpenteante independiente, **fichas circulares de amenaza/evento** colocadas sobre hexágonos concretos, monstruos/estructuras grandes (mûmak, torre de asedio) que ocupan varios hexágonos a la vez, y un mazo de **cartas de encuentro** ("Captura", "Abatimiento") separado del mazo de objetos/loot.

## 1. Concepto central

Mapa de **hexágonos**, inspirado en los tableros modulares de juegos de mesa de El Señor de los Anillos (tipo *Viajes por la Tierra Media* / *War of the Ring*). Cada hexágono es una casilla de terreno que afecta movimiento, defensa y ocultación. El mapa se genera **proceduralmente** al empezar la partida, con **tamaño configurable** (ancho x alto en número de hexágonos, o un preset pequeño/mediano/grande).

## 2. Generación del mapa

- **Por "tiles" (recomendado, como el tablero real):** en vez de generar hexágono a hexágono, se generan **grupos pre-diseñados de varios hexágonos** ("tiles" de 4-8 hexágonos con un terreno y arte coherente, igual que las piezas de la foto de referencia) y se van encajando aleatoriamente hasta cubrir el tamaño de mapa elegido, garantizando que los bordes de cada tile conecten bien con el vecino (como piezas de puzle). Esto da variedad visual real y evita mapas "ruido" hexágono-por-hexágono.
- **Agrupaciones temáticas dentro de un tile (con el sistema de tiles):** un tile puede reservar **sub-zonas** donde se concentran fichas con lógica espacial, en vez de sembrarlas sueltas — p. ej. un **campamento enemigo** en una esquina de una Llanura (varias fichas de Enemigo + alguna de Amenaza), **salas** con enemigos repartidos dentro de una mazmorra, o una ficha de Exploración en un Pueblo que resulta ser un borracho hostil. Es la vía natural para colocar los enemigos (que **no reaparecen**, `../characters/enemies.md` §2): se ubican al generar el mapa. Las proporciones concretas se diseñan con el set de tiles.
- **Aleatorio hexágono-a-hexágono (alternativa más simple):** se define tamaño → se rellena con terrenos por peso/probabilidad (ej. más llanos que pantanos) → se garantiza conectividad (ningún hexágono aislado sin camino) → se colocan puntos de interés con una densidad configurable. Más fácil de programar al inicio, pero visualmente menos rico que el sistema de tiles.
- **Preset/histórico (futuro):** mapas fijos diseñados a mano, con eventos y narrativa scriptada (una "campaña" o escenario concreto), igual que los escenarios de un juego de tablero tipo LOTR.
- Parámetros configurables antes de empezar: tamaño del mapa, densidad de fichas de evento, densidad de enemigos ocultos, semilla aleatoria (para poder repetir/compartir un mapa concreto).

**Los huecos cerrados son parte del mapa** *(decidido)*. Al encajar losetas por sus anclas, dos piezas se tocan pared contra pared y a veces dejan un rincón de vacío **rodeado de tablero por todos lados**. Son permanentes —la loseta más pequeña son 3 hexágonos y aun así tendría que encajar ancla contra ancla, así que ahí ya no entra nada— y se quedan **como terreno intransitable**: una sima, una laguna, un derrumbe. No son hexágonos del tablero: no tienen terreno, ni ficha, ni niebla, y no se puede entrar en ellos; son el negativo del mapa.

Por qué se aceptan en vez de prohibirlos al colocar: son lo que hace que la silueta no parezca una rejilla, y prohibirlos costaría encajes válidos a cambio de un tablero más macizo y más aburrido. Medido sobre 300 tableros: aparecen en el **51 %**, con **1,6 hexágonos** de vacío por tablero. Casi siempre son de **1 ó 2 hexágonos**, y de vez en cuando sale una cuenca de verdad —la mayor medida, 18 hexágonos—. Las piezas grandes dejan más hueco que las pequeñas, así que la cifra sube con cada loseta Grande que entra en la bolsa. El generador los localiza al terminar (`Board.voids`) y `/dev/tablero` los cuenta.

Consecuencia en la biblioteca: una **loseta con un agujero dentro** (un anillo) es válida por la misma razón, y no hay que avisar de ella.

## 2b. Modos de juego: Partida rápida vs. Campaña

Con esto queda **validada la generación de mapa** para los dos modos que necesitamos:

### Partida rápida *(nombre de diseño anterior: "Modo Prueba")* (sandbox/skirmish)
- Mapa **100% aleatorio** (por tiles o hexágono-a-hexágono, sección 2), sin narrativa ni eventos escritos a mano.
- Configuración mínima: tamaño de mapa. **Siempre se coloca un boss** (enemigo élite/jefe) al generar el mapa, en el punto más alejado del punto de entrada o en una zona marcada como "guarida" — derrotarlo es la condición de victoria (obligatorio, no opcional).
- **Condición de victoria:** derrotar al **boss élite de la Guarida**. **Derrota:** si el héroe cae (0 PV, `../game-design.md` §4b.8), o si el **Nivel de Amenaza** llega a su tope antes — **40, o sea el turno 40** (`../game-design.md` §6c.1) → fin de partida (reinicias el mapa). Esa es la duración de una Partida rápida, y la travesía hasta la Guarida son ~15-20 turnos: te sobra para desviarte, pero no para todo. Sin **bonus de eficiencia** al ganar (`../game-design.md` §6c.4) — al ser una partida suelta de un solo mapa, no hay "siguiente capítulo" que premiar.
- Objetivo de este modo: jugar partidas rápidas y sueltas para probar equilibrio de combate, progresión de mazo y sensación general de exploración, sin depender de tener contenido narrativo terminado.
- Es el modo que se implementa primero — desbloquea poder testear todo lo demás (personaje, cartas, combate) sin escribir ni una línea de historia.

### Modo Campaña

> **Varias historias, no un único arco *(decidido)*.** El Modo Campaña es un **contenedor de historias seleccionables**: al elegirlo, el jugador escoge cuál jugar (`../game-design.md` §1b, paso 1), y se irán añadiendo con el tiempo. Todo lo de abajo describe **cómo se estructura una** de esas historias — así que "Jefe final de campaña" (`../characters/enemies.md` §3) significa el jefe final **de esa historia**, no uno único del juego.

- Secuencia de **N mapas predeterminados** (diseñados a mano, no random), cada uno = un "capítulo" con su propia mini-historia, eventos y fichas específicas de esa parte de la trama.
- Los mapas se completan **en orden**: terminar el objetivo de un mapa (que puede incluir o no un jefe de capítulo) desbloquea el siguiente, como un recorrido — igual que ir de escenario en escenario en la trilogía de El Señor de los Anillos (Bolsón Cerrado → Bree → Rivendel → Moria → ... → destino final), sin que tenga que ser literalmente esos lugares, solo la misma sensación de "viaje con arcos narrativos encadenados".
- El **último mapa de la campaña** cierra el arco principal (el "gran final"), con su propio jefe/evento climático, más grande o narrativamente relevante que los de capítulos intermedios.
- **Condición de victoria de la campaña:** completar el objetivo del **último capítulo** (derrotar al **Jefe final**, `../characters/enemies.md` §5b). Cada capítulo intermedio se "gana" al cumplir su objetivo, lo que desbloquea el siguiente.
- **Reloj de Amenaza por capítulo:** cada capítulo tiene su propio **Nivel de Amenaza** (`../game-design.md` §6c); si llega al 100 % pierdes ese capítulo (lo reintentas). Mete prisa para que la campaña no se eternice y premia dejar la barra baja al ganar.
- El personaje y el mazo del jugador **persisten entre mapas** de una misma campaña (no se resetea nivel ni cartas conseguidas al pasar de capítulo), reforzando la sensación de progreso continuo a lo largo del viaje.
- Este modo depende de la **Partida rápida** para poder testear mecánicas antes de invertir tiempo en escribir/diseñar los capítulos — por eso se plantea como fase posterior.
- El tamaño de mapa afecta directamente la duración de partida: mapas pequeños para la **Partida rápida** (partidas rápidas y sueltas), mapas grandes o varios capítulos encadenados para el Modo Campaña (partidas tipo "campaña corta").

## 2c. Generación del prototipo (decidido)

Para el **primer prototipo**, generación **hexágono-a-hexágono con pesos** (la alternativa simple de §2), **no** por tiles: es lo mínimo para tener mapa jugable sin diseñar aún el set de tiles ni sus reglas de borde. El sistema de **tiles/grupos sigue siendo el objetivo** de la versión rica (§2), solo se pospone.

- **Consecuencia en la niebla — dos capas por hexágono *(decidido)*:** sin grupos, el prototipo aplica la niebla **hex a hex**, pero en **dos capas**, siguiendo los dos radios de visión de `../game-design.md` §2.3:
  - dentro de la **visión de terreno** → se revela el **tipo de terreno** del hex (la silueta del mapa);
  - dentro de la **visión de detalle** → se revela además su **contenido** (fichas, localizaciones);
  - fuera de ambas → oculto del todo.

  Esto da el mismo escalón conceptual que los 3 estados de niebla por grupo (§4) —intuyes antes de saber— **sin necesitar el sistema de tiles**. La niebla por grupo llega con los tiles y sustituirá a esto.

**Algoritmo mínimo:**
0. Elegir el **hex de entrada**: **una esquina del mapa** *(decidido)* — la "puerta" por la que se accede al mapa completo. Puede caer en cualquier terreno transitable (entras a una llanura, a un bosque, directamente a unas ruinas…), lo que ya da variedad de arranque sin lógica extra. Colocar el héroe ahí. *(Adaptado al sistema de losetas: la silueta es irregular y no tiene esquinas, así que la entrada se elige dentro de la **primera** loseta —el borde por el que empezó a crecer el tablero— y con preferencia por la **boca de su camino**: un camino cruza su loseta de lado a lado y se ancla por sus bocas, así que ya está mirando afuera, y entrar al mapa por el camino es lo natural. Sale así en el 48 % de los tableros, los que siembran con una loseta que trae sendero; en el resto, el hexágono transitable más alejado del centro. **Nunca en Montaña ni en Cueva**.)*
1. Elegir tamaño (ej. 12×12 para partidas cortas) y semilla.
2. Rellenar cada hex por **peso de terreno** (tabla A). *(Superado por el sistema de losetas: ver la nota bajo la tabla A.)*
3. Garantizar **conectividad**: debe existir camino transitable de la entrada al resto. La Montaña ya es transitable aunque muy costosa (§3a); aun así conviene que no encierre zonas tras un coste casi prohibitivo. *(Con losetas es el **único** paso que puede repintar terreno maquetado, así que se hace con el mínimo daño: de todas las bolsas incomunicadas se abre primero la que cuesta menos roca, y por la ruta que menos roca cruza —no la más corta—. Y el aviso de maquetado que salta cuando la roca de una variante parte su propio terreno transitable dejó el número donde debe estar: **0 hexágonos abiertos en 300 tableros**. `/dev/tablero` lo enseña como «Maquetado roto» por si vuelve a subir.)*
4. Colocar las **localizaciones especiales garantizadas** *(decidido)*:
   - **1 Guarida** (§3b) con el **boss élite** —**uno de los 3 Élite elegido al azar** (`../characters/enemies.md` §5b)— en el hex transitable **más lejano** a la entrada. Con entrada en esquina, eso lo pone en la esquina opuesta: la travesía máxima del mapa.
   - **1 Pueblo** (§3b), en la **mitad cercana** a la entrada. **Garantizado, no opcional:** el Pueblo concentra los NPCs de tienda, el descanso largo y la limpieza de Maldiciones (`../characters/npcs.md`), así que si la generación no lo coloca, **tres sistemas enteros quedan inaccesibles** en esa partida — y con oro inicial 0 tampoco habría forma de gastar el oro que ganas. Se asienta **en el camino** si hay alguno a mano (91 % de los tableros) y **nunca dentro de una Cueva**; las dos son preferencias, no requisitos: antes pueblo raro que tablero sin pueblo.
   - **1 Mazmorra opcional** (§3b), según densidad — en el prototipo, **un solo hexágono reforzado, sin sub-mapa** (§3b). Si la mitad lejana tiene una **Cueva**, se entra por ahí (~20 % de las mazmorras): es la contrapartida del Pueblo en el camino, y le da a la Cueva algo que hacer además de su tabla de fichas.
5. Sembrar **fichas** según densidad y distribución (tabla B).

**Tabla A — Pesos de terreno (prototipo):**

| Llanura | Camino | Bosque | Pantano | Montaña |
|---|---|---|---|---|
| 40 % | 20 % | 20 % | 10 % | 10 % |

**La tabla A ya no se sortea: es un OBJETIVO** *(decidido)*. Con el sistema de losetas implementado, **todo hexágono de una loseta lleva terreno obligatoriamente** —no existe "este lo decide el tablero"—, así que el paso 2 no se ejecuta: cada hexágono llega pintado por la pieza que lo trae. La tabla A pasa a ser el reparto de terreno **al que apunta el maquetado de la biblioteca**, y el laboratorio (`/dev/losetas`) enseña el que sale medido al lado de la cuota.

Por qué: si el terreno de un hexágono se sortea al colocar la pieza, lo que se ve al maquetarla no es lo que sale en la partida, y una loseta deja de ser una decisión de diseño para ser una plantilla. La variedad entre partidas la dan las **variantes** de cada tipo (el mismo sitio dibujado de varias maneras) y el giro, no el azar hexágono a hexágono.

La **Cueva** es la única que no tiene cuota en la tabla A: es terreno de **lugar** (§3a) y aparece donde el maquetado la ponga.

**Dónde se cumple la tabla A y dónde no.** El peso de cada tipo de loseta se ajusta para que **la bolsa** dé en la cuota, y ahí da: Llanura 39,2 · Bosque 20,0 · Camino 19,8 · Pantano 9,8 · Montaña 9,8 (Cueva 1,4, sin cuota). Lo que sale **medido en el tablero** sobre 300 partidas se separa un poco: Llanura 41,3 · Bosque 20,6 · Camino 16,7 · Pantano 11,1 · Montaña 8,9 · Cueva 1,5.

La diferencia no es de maquetado, es de **encaje**, y afecta justo a los dos terrenos con anclas restringidas: una pieza de camino solo se une por la boca de su camino, y en la roca no se ancla nunca (§2). Al tener menos sitios donde encajar, Camino y Montaña pierden presencia en el tablero respecto a la bolsa, y Bosque y Llanura la ganan. Se corrige subiendo pesos (mentiría la bolsa) o dando preferencia al ancla de camino al colocar (cambiaría la regla de encaje): **pendiente de decidir**.

**Tabla B — Distribución de fichas por terreno** (pesos relativos; ~15-20 % de los hexes transitables llevan ficha, densidad configurable). Montaña no lleva ficha:

| Terreno | Enemigo | Amenaza | Tesoro | Exploración | Terreno (prueba) | Personaje |
|---|---|---|---|---|---|---|
| Llanura | 2 | 2 | 1 | 1 | 0 | 2 |
| Bosque | 1 | 3 | 2 | 2 | **1** | 1 |
| Pantano | 2 | 3 | 1 | 0 | 2 | 0 |
| Camino | 1 | 2 | 1 | 0 | 0 | 3 |
| Cueva | 2 | 1 | **3** | **3** | 0 | 0 |

Con estos pesos, un mapa 12×12 lleva **~23 fichas** repartidas así: ~4,5 Enemigo · ~6,7 Amenaza · ~3,5 Tesoro · ~5,3 Personaje · ~2,4 Exploración · ~1,2 Terreno. Es el reparto sobre el que están calibradas la **tabla de loot** y la **duración de 40 turnos** (`../game-design.md` §6b.6, §6c.1), así que tocar esta tabla obliga a revisar los dos.

Las **localizaciones especiales** (§3b) colocan sus propias fichas (ej. Pueblo → solo Personaje; Guarida → boss). Parámetros configurables (recap de §2): tamaño, densidad de fichas, densidad de enemigos, semilla.

## 3. Tipos de terreno

> **Los 6 terrenos del prototipo ya tienen mecánicas oficiales** (§3a). La tabla grande de más abajo pasa a ser la referencia **ilustrativa** de los terrenos futuros (Colinas, Río/Lago, Nieve/Tundra, Desierto/Erial), aún sin cerrar.
>
> El rango de visión base lo gobierna la Sabiduría (`../game-design.md` §2.3); las mecánicas de terreno de abajo son bonus/penalizaciones encima de eso.
>
> **Set confirmado para el prototipo (6 terrenos):** Llanura, Bosque, Pantano, Montaña, Camino/Sendero y **Cueva**.

### 3a. Mecánicas oficiales de los 6 terrenos del prototipo

Cada terreno toca los sistemas que ya diseñamos: movimiento (`../game-design.md` §2.2), detección enemiga (`../characters/enemies.md` §2), combate (`../game-design.md` §4b) y descanso (`../game-design.md` §4c). Valores = primer pase, sin balancear.

| Terreno | Movimiento | Visión / Detección | Combate | Acampar (§4c.2) | Peligro | Peso gen. |
|---|---|---|---|---|---|---|
| **Llanura** | Coste 1 (base) | Sin ocultación; el enemigo te detecta a rango normal | — | **Inseguro** (expuesto) | — | Alto |
| **Bosque** | Coste 1 | **Ocultación:** detección enemiga **−1**; pero **tu visión −1** (no ves lejos entre árboles) | **Cobertura:** +1 CA contra ataques a distancia; atacar sin haber sido detectado = **emboscada (ventaja)** | **Seguro** (riesgo mínimo) | — | Medio |
| **Pantano** | Coste 2 (difícil) | Normal | — | Inseguro | Al cruzar: salvación CON CD 12 o **Envenenado** ([`../effects.md`](../effects.md)) | Bajo |
| **Montaña** | **Transitable pero muy difícil:** coste **3** (con el pool base de 2 necesitas movimiento extra —Camino, carta de movimiento o Kit de escalada, [`../cards/items.md`](../cards/items.md)— para entrar) | Bloquea línea de visión | — | Inseguro (expuesto) | — | Bajo (relieve, semi-barrera) |
| **Camino/Sendero** | Coste 1, y **+1 de movimiento** el turno que te desplazas por camino | Expuesto (como Llanura) | — | Inseguro | — | Medio (conecta puntos; candidato a hexágono conector §4) |
| **Cueva** | Coste 2 (entrar a oscuras) | **A oscuras:** tu visión **−2** (el terreno que más ciega); detección enemiga **−1** (dentro no te ven llegar) | **Cobertura:** +1 CA contra ataques a distancia; permite **emboscada** | **Seguro** (refugio a cubierto) | — | **Sin cuota** (§2c) |

**Notas:**
- **Cueva** es un **lugar, no ambiente**: como el Camino, cruza o perfora el fondo del mapa en vez de ser el fondo, y es la única sin cuota en la tabla A —sale donde el maquetado la ponga (`lib/rules/tile-library.ts`)—. Por eso puede permitirse ser generosa en la tabla B —es el único terreno donde el Tesoro pesa más que la Amenaza— sin desbalancear el reparto: hay pocas y hay que ir a buscarlas. Sus dos cifras fuertes van en sentidos contrarios a propósito: se acampa seguro, pero ciega.
- **Bosque** es el terreno clave del sigilo: te esconde de los enemigos (detección −1, emboscada) pero también te ciega (visión −1) y te da cobertura a distancia. Es el contrapunto natural a Llanura/Camino (rápidos pero expuestos).
- **Montaña (coste alto)** actúa como relieve/semi-barrera para dar forma al mapa; ya no es un muro absoluto (se puede cruzar con movimiento extra).
- El estado **Oculto** ([`../effects.md`](../effects.md)) del Pícaro se apila sobre la ocultación de Bosque (indetectable hasta actuar).

**Terrenos futuros (aún ilustrativos, no oficiales)** — se cerrarán en pases de contenido posteriores, igual que se hizo con los 5 del prototipo en §3a:

| Terreno | Efecto de ejemplo (no oficial) | Notas |
|---|---|---|
| Colinas | +Alcance de visión (ves más hexágonos alrededor) | Bueno para explorar, malo para ocultarte |
| Ruinas | Punto de interés especial: alta probabilidad de ficha de evento (tesoro o enemigo oculto) | Entrada a "mini-mazmorra" opcional. La otra mitad de esta fila, la **Cueva**, ya es terreno oficial (§3a) |
| Río/Lago | Intransitable salvo puente/vado, o -2 movimiento si se cruza a nado | Puede generarse como "línea" que conecta varios hexágonos, no solo una casilla suelta |
| Nieve/Tundra | -1 movimiento | Zona de clima extremo; un posible efecto de frío acumulativo que aplique el estado **Miedo** ([`../effects.md`](../effects.md)) queda como idea futura |
| Desierto/Erial | -1 movimiento, recursos (agua/pociones) se consumen más rápido | Tensión de supervivencia |

## 3b. Localizaciones especiales (edificaciones)

Al ser un mapa hexagonal, estas localizaciones se pueden **predefinir sin problema** como hexágonos concretos (no aleatorios como el terreno base) que, al entrar en ellos, dan acceso a un sub-mapa o pantalla propia — mismo patrón que la Cueva (§3a), pero llevado más lejos con más variedad e identidad propia.

**Confirmado: no hay "sistema aparte" para estos sub-mapas.** Todo el juego usa el mismo sistema hexagonal descrito en este documento (grupos, niebla, fichas de evento); una Mazmorra o una Mina son simplemente un mapa hexagonal más pequeño con su propio conjunto de grupos/hexágonos, no una pantalla con reglas distintas. El tamaño varía libremente según la localización, pero la arquitectura es una sola. El diseño visual/UI de cada tipo de localización (cómo se ve un Pueblo vs. una Mazmorra) queda pendiente como tarea de arte más adelante (probablemente con ayuda de una IA generativa de imágenes), no es una decisión de arquitectura.

| Localización | Qué se hace al entrar (ejemplo, no oficial) | Notas |
|---|---|---|
| Pueblo/Aldea | Zona segura: tienda, **descanso largo** (`../game-design.md` §4c.3), NPCs con misiones | Punto de respiro entre exploración; no hay combate salvo que la historia lo dicte |
| Castillo/Fortaleza | Hub de misiones importantes, o guarida de un enemigo relevante (mini-jefe de capítulo) | Puede estar controlado por aliados o por el enemigo según la historia |
| Mazmorra | Sub-mapa de combate denso, alta probabilidad de loot bueno | Igual concepto que la Cueva (§3a) pero más grande y con varias salas/encuentros encadenados. **En el prototipo: 1 hexágono reforzado, sin sub-mapa — ver §3b-bis** |
| Mina | Sub-mapa de recolección de materiales/recursos (para crafteo futuro) + posible peligro (derrumbe, criaturas de cueva) | Buena vía para introducir un sistema de crafteo más adelante sin comprometernos ya a ello |
| Templo/Santuario *(añadido, sabor D&D)* | Bendición temporal, curación, o misión de fe/moralidad | Encaja con Sabiduría/Carisma del personaje |
| Torre de mago *(añadido, sabor D&D)* | Tienda arcana (hechizos, pergaminos), posible prueba de Inteligencia | Contrapunto arcano al pueblo/tienda genérica |
| Campamento (enemigo o aliado) *(añadido, sabor D&D)* | Encuentro de combate si es enemigo, o refuerzos/aliados temporales si es amistoso | Se decide al generarlo o al revelarlo, dando variedad |
| Cripta/Cementerio *(añadido, sabor D&D)* | Entrada temática a mazmorra con enemigos no-muertos | Reutiliza la Mazmorra con set de enemigos propio (en el prototipo, su hexágono reforzado — §3b-bis) |
| Torre de vigilancia *(añadido, sabor D&D)* | Al capturarla/visitarla, pasa a "Detectado" uno o más grupos de hexágonos vecinos, incluso sin conexión directa (ver sección 4) | Recompensa de exploración pura, sin combate obligatorio |
| Guarida *(añadido, sabor D&D)* | Combate directo contra un enemigo elite/jefe | Es la versión "salvaje" del Castillo — sin narrativa de por medio, ideal también para la **Partida rápida** |

Estas localizaciones no sustituyen el terreno base: **se colocan sobre/en vez de un hexágono de terreno normal** durante la generación (por tiles o manualmente en Campaña), igual que un pueblo real se asienta sobre una pradera o un valle.

> El **Nivel de Amenaza** del capítulo (`../game-design.md` §6c) **no se pausa** al entrar en el sub-mapa de una de estas localizaciones (Mazmorra, Mina...) — sigue corriendo igual que en el mapa principal.

### 3b-bis. La Mazmorra del prototipo: un hexágono reforzado, sin sub-mapa *(decidido)*

En el **prototipo** la Mazmorra **no genera un mapa interior**. Se resuelve entera en su hexágono:

- **Combate:** al quedar adyacente, peleas contra **1 Élite distinto al boss de la Guarida** (se sortea entre los 2 que sobran, `../characters/enemies.md` §5b.3). Sigue valiendo el tope de 2 enemigos simultáneos (§5b.6).
- **Recompensa al ganar:** **2 cartas** tirando en la fila de Élite de la tabla de loot (`../game-design.md` §6b.6) — es el mejor botín del mapa después del boss, que es lo que la hacía atractiva.
- **La oscuridad importa *(y por fin le da uso a la Antorcha)*:** si entras **sin una fuente de luz equipada** (Antorcha o Linterna, [`../cards/weapons.md`](../cards/weapons.md) §3, [`../cards/items.md`](../cards/items.md) §1), el Élite **te embosca**: actúa primero e ignora la iniciativa el primer turno (`../game-design.md` §4b.2). Con luz, iniciativa normal.
- **Sigue siendo opcional:** puedes ignorarla y ganar la partida sin entrar. Con el reloj a 40 turnos (`../game-design.md` §6c.1), meterse es una apuesta de tiempo real.

> **Por qué se recorta.** El sub-mapa es la versión buena y sigue siendo el objetivo (§3b), pero para el primer prototipo exige un **segundo generador entero** —con sus propias reglas de niebla, entrada/salida, fichas y conectividad— y **no añade ninguna mecánica** que no puedas probar en el mapa principal: combate duro y loot bueno ya los tienes. Guarida + Pueblo cubren boss y tiendas/descanso. Era la única pieza del prototipo que multiplicaba el trabajo sin ampliar el sistema.
>
> Aplica igual a la **Mina** y a la **Cripta/Cementerio** si se activan: en el prototipo, hexágono reforzado con su propio set de enemigos, no sub-mapa. Lo mismo vale para el **Templo** y la **Torre de mago** (interacción de NPC en su hexágono, sin interior).

Todos los terrenos deben tener como mínimo: **coste de movimiento**, **modificador de ocultación/defensa** (puede ser 0), y **probabilidad de aparición** en la generación aleatoria.

## 4. Fichas de evento y niebla de guerra

> **En espera, a propósito** *(decidido)*. Las losetas ya existen, así que la niebla por grupo **se podría** construir ya (§2c dice que sustituirá a la de dos capas por hexágono). Se aparca hasta que estén listas las losetas, el lote de semillas y **las fichas de personaje**: lo que decide si la niebla por grupo es la buena es cómo interactúa la ficha del héroe con el entorno —qué ve al entrar, qué le obliga a asomarse—, y eso no se puede juzgar sin fichas en el tablero. Mientras tanto sigue la niebla de dos capas por hexágono, que ya funciona.

### Niebla de guerra a nivel de grupo (tile), no hexágono a hexágono

Como el mapa se construye a partir de **grupos de hexágonos** (tiles — ej. un bosque de 20 hexágonos conectado a una llanura de 6, que a su vez conecta arriba con otra llanura y a la derecha con un castillo), la niebla de guerra tiene más sentido aplicada **por grupo completo**, no hexágono suelto:

- Un grupo (tile) puede estar en 3 estados: **Sin explorar** (oculto del todo, ni siquiera se intuye el tipo de terreno), **Detectado** (se ve que existe y su tipo de terreno/localización, porque conecta con un grupo ya explorado, pero su contenido interior —fichas de evento, enemigos— sigue oculto) o **Explorado** (el personaje ya puso al menos un pie dentro de ese grupo).
- **"Explorado" no revela todo el contenido del grupo de golpe.** Es la condición mínima para que el rango de visión empiece a aplicar dentro de ese grupo — hace falta haber entrado físicamente en, como mínimo, un hexágono del grupo; no vale con estar cerca desde el grupo anterior. A partir de ahí, lo que realmente se ve (fichas de evento, enemigos) lo decide el rango de visión del personaje según su posición exacta (sección "Rango de visión" más abajo), no la exploración del grupo en sí.
- Al entrar el personaje en un grupo (pasa a "Explorado"), los grupos **vecinos conectados** a él pasan de "Sin explorar" a "Detectado" — el jugador ya sabe que están ahí y qué tipo de terreno son, aunque no sepa qué hay dentro todavía.

### Hexágonos de conexión siempre indicados

- Los hexágonos concretos por donde un grupo conecta con otro (ej. el borde entre el bosque y la llanura) están **siempre marcados/visibles**, incluso si alguno de los dos grupos sigue "Sin explorar". Esto asegura que el jugador siempre sepa **por dónde puede avanzar** para pasar de un grupo a otro, sin tener que adivinar rutas.
- Un grupo puede tener varias conexiones (norte, sur, este, oeste, etc., según cómo se hayan encajado los tiles) — cada una se representa como un hexágono "puerta" en el borde compartido.

### Rango de visión como habilidad del personaje

- El rango de visión son **dos radios** (terreno y detalle, `../game-design.md` §2.3) y aplican **siempre según la posición exacta del personaje**, incluso dentro de un grupo ya "Explorado" — moverse por el interior de un grupo grande (ej. el bosque de 20 hexágonos) va revelando su contenido progresivamente, no todo de golpe al entrar.
- Se amplía mediante **habilidades/hechizos del personaje**, no por el terreno en sí (a diferencia del efecto de ejemplo de "Colinas" en la sección 3, que puede quedar como un bonus adicional, no la fuente principal).
- Ejemplo: un hechizo de exploración que permita "ver el tipo de terreno de un grupo Detectado sin necesidad de entrar en él", o directamente adelantar el estado de un grupo vecino a "Detectado" desde más lejos de lo normal.
- Esto da una razón mecánica clara para elegir ciertas clases/hechizos orientados a exploración, aparte de combate.

### Fichas del tablero (tokens)

Ciertos hexágonos (dentro de un grupo ya "Explorado") tienen una **ficha** visible sobre ellos. El icono de la ficha ya indica **qué tipo** de cosa es, aunque el contenido exacto dentro de ese tipo siga siendo una sorpresa hasta interactuar:

| Ficha | Icono (ejemplo) | Qué representa |
|---|---|---|
| Exploración | Ojo blanco | Comodín: al interactuar puede resultar en cualquier cosa (tesoro, prueba, mercenarios reclutables ([`../cards/mercenaries.md`](../cards/mercenaries.md)), evento narrativo, o incluso vacío) — es la más ambigua de todas |
| Amenaza | Icono rojo sin definir | Peligro ambiguo: normalmente se resuelve como un enemigo, pero no se sabe con certeza hasta interactuar (podría ser una trampa, un peligro de terreno, etc.) |
| Tesoro | Icono de cofre amarillo | Confirmado que da recompensa: carta(s) para el mazo (objeto, poción, arma, armadura) **y/o oro** (`../game-design.md` §6b.1) — el contenido concreto es aleatorio, pero la categoría "tesoro" se sabe de antemano; los cofres de mayor rareza pueden dar ambos |
| Terreno | Icono de montaña verde | Prueba ligada al terreno: puede dar un beneficio o ser un obstáculo (ej. una prueba de movimiento/agilidad para cruzar, especialmente relevante en capítulos de Campaña con un tramo difícil concreto) |
| Personaje (NPC) | Icono de personaje blanco | NPC con el que interactuar: mercenario para contratar, tabernero para curarte, mago/vendedor que te vende objetos, etc. — no implica combate. Detalles de tipos de NPC en [`../characters/npcs.md`](../characters/npcs.md) |
| Enemigo | Icono de enemigo | Ya se sabe con certeza que es un enemigo antes de interactuar (a diferencia de "Amenaza"); el combate se inicia al quedar en un hexágono **adyacente** al suyo, no entrando en su hexágono (héroe y enemigo nunca comparten hex — ver `../game-design.md` §4b.1). Detalles de tipos de enemigo, comportamiento y jefes en [`../characters/enemies.md`](../characters/enemies.md) |

- Las fichas pueden tener una distribución ponderada distinta según el tipo de terreno/localización (ej. ruinas → más probabilidad de Amenaza o Enemigo que una llanura; Pueblo → solo fichas de Personaje).
- El terreno puede afectar el encuentro al activar una ficha de Amenaza/Enemigo: emboscada con ventaja si el jugador está en bosque y el enemigo no lo ha detectado; desventaja si el jugador cruza una llanura o camino a la vista.

### 4b. La prueba de la ficha de Terreno *(decidido)*

Era la única de las 6 fichas **sin ninguna regla**: decía "puede dar un beneficio o ser un obstáculo" y ahí acababa, sin estadística, sin CD y sin qué pasa al fallar.

**Qué es:** un **atajo arriesgado**. La ficha marca un paso difícil —un vado, una grieta, un tramo de maleza cerrada— que **puedes rodear siempre**: no bloquea el camino, solo lo acorta si te atreves. Ahí está la decisión, y encaja con el reloj de Amenaza (`../game-design.md` §6c): ahorrar 2 turnos o no arriesgar.

- **Prueba:** `1d20 + mod de FUE o DES` (**la mejor de las dos**, según si fuerzas el paso o lo esquivas) vs **CD 12**.
- **Éxito:** cruzas el hex **sin pagar su coste de movimiento** y ganas **+1 de movimiento** ese turno (has dado con el paso bueno). La ficha **se retira**.
- **Fallo:** **pierdes el movimiento que te quedara** ese turno y sufres el **peligro del terreno** del hex (§3a — ej. Pantano: salvación CON o Envenenado; si el terreno no tiene peligro propio, **1d6 contundente**). La ficha **se queda**: puedes reintentarlo otro turno o rodearla.
- **Las cartas de equipo se enganchan aquí**, que es lo que les da uso fuera de combate: *Kit de escalada*, *Cuerda de cáñamo*, *Manta*, *Atajo del pícaro* y *Bota veloz* ([`../cards/items.md`](../cards/items.md)) dan **ventaja** en esta prueba o directamente evitan el coste.
- El mazo de encuentro **no** se roba en el caso normal (corrige [`../cards/encounter.md`](../cards/encounter.md) §5, que decía "a veces"): el resultado ya está en la propia prueba. Solo se roba un Suceso si la ficha estaba en un hex con **localización especial**.

> **Ojo, aparece poco:** con la tabla B de §2c esta ficha solo salía en Pantano, o sea **~0,6 veces por mapa**. Se le añade peso **1 en Bosque** (maleza cerrada) para que llegue a ~1,2 por partida. Sigue siendo la ficha más rara de las 6 a propósito —es sabor de exploración, no un sistema central—, así que **es la última que hay que implementar** del generador.

## 5. Mazo de encuentro (aparte del mazo de objetos)

La referencia muestra cartas cortas de acción durante la exploración/combate en el mapa ("Captura", "Abatimiento") distintas de las cartas de loot. Propuesta:
- **Mazo de encuentro/exploración**: cartas cortas que se roban al activar una ficha de evento o al entrar en combate sobre el mapa, con efectos puntuales de esa situación concreta (ej. "el enemigo intenta huir", "emboscada", "terreno se derrumba").
- Distinto del **mazo personal** de `../game-design.md` (clase + items + mercenarios), que el jugador construye y controla. El mazo de encuentro es "del mapa/la partida", compartido o gestionado por el sistema, no por el jugador.

## 6. Recompensas ligadas al mapa

Explorar el mapa es una vía adicional (aparte de combate/clase) para conseguir cartas de mazo: ítems, pociones, armas, armaduras. Esto conecta directamente con la sección de progresión de `../game-design.md` — dos ejes de progresión (nivel de personaje + colección de cartas) más un tercero: **exploración del mapa**.

## 7. Notas de implementación

Los apuntes técnicos (sistema de coordenadas, modelo de datos, algoritmos) se movieron a [`board-map-dev.md`](board-map-dev.md), para separar el diseño del juego de los detalles de cómo se programa. Si cambia algo aquí que afecte a la implementación, actualizar también ese documento.

## 8. Próximos pasos / preguntas abiertas

**Generación de mapa y modos de juego: validado (sección 2b)** — Partida rápida (random + boss elite opcional) primero, Modo Campaña (mapas fijos encadenados con historia propia) después.

### Dudas/contradicciones detectadas al revisar todo el documento

**Resueltas:**
1. ~~Contradicción en §4 sobre si explorar un grupo revela todo de golpe~~ → **Resuelto:** "Explorado" solo exige haber entrado en al menos 1 hexágono del grupo (no vale estar cerca desde el grupo anterior); a partir de ahí el rango de visión del personaje decide qué contenido se ve según su posición exacta, revelándose progresivamente al moverse por dentro del grupo.
2. ~~Si el sub-mapa de las localizaciones especiales (3b) usa el mismo sistema hexagonal~~ → **Resuelto:** sí, todo el juego (mapa principal y localizaciones como Mazmorra/Mina/Pueblo) usa la misma arquitectura hexagonal, solo cambia el tamaño. El diseño visual/UI de cada localización queda como tarea de arte aparte (pendiente encontrar herramienta de IA generativa de imágenes), no afecta a la arquitectura.
3. ~~§5 (Enemigos ocultos en el mapa) desactualizada~~ → **Resuelto:** se reemplazó por una taxonomía de 6 fichas del tablero (Exploración, Amenaza, Tesoro, Terreno, Personaje, Enemigo — sección "Fichas del tablero") y se creó [`../characters/enemies.md`](../characters/enemies.md) como documento dedicado a tipos de enemigo, comportamiento en el mapa y jefes.
4. ~~Duplicado entre "Ruinas/Cueva" (§3) y "Construcción/Ruina genérica" (§3b)~~ → **Resuelto:** se mantiene como terreno en §3 y se quitó "Construcción/Ruina genérica" de §3b para no tener el mismo concepto dos veces. La **Cueva** se separó después de esa fila y ya es terreno oficial con mecánicas propias (§3a); "Ruinas" sigue en la tabla ilustrativa.
5. ~~Número de terrenos para el prototipo~~ → **Resuelto:** set confirmado de 5 — Llanura, Bosque, Pantano, Montaña, Camino/Sendero (marcados en la tabla de §3). El resto queda para pases de contenido posteriores.

**Resueltas (desbloqueadas por game-design.md):**
6. ~~Tensión entre §3 y §4 (terreno vs. habilidad de visión)~~ → **Resuelto:** el rango de visión lo gobierna Sabiduría, en **dos radios** (`../game-design.md` §2.3: detalle `3 + mod SAB`, terreno `+2` más, +1 por punto de modificador). El efecto de ejemplo de Colinas (§3) puede quedar como bonus adicional de terreno encima de eso; la **ocultación de Bosque** ya tiene mecánica: reduce el rango de detección de los enemigos (`../game-design.md` §4b.5, `../characters/enemies.md` §2) — evitar/emboscar en vez de pelear.
7. ~~Coste de cruzar un grupo entero~~ → **Resuelto:** cada hexágono cuesta 1 punto de movimiento de un pool por turno **fijo de 2 movimientos para todos los personajes** (`../game-design.md` §2.2: estándar único, sin variación por raza ni por estadística; los extras vienen de fichas/cartas de movimiento/cartas de clase). El terreno de cada hexágono modifica ese coste como ya estaba descrito.

**Abiertas:**
1. ~~El "boss final" de la **Partida rápida**~~ → **Resuelto:** se coloca un Élite en una **Guarida** (§3b) en el hex más lejano a la entrada (§2c, paso 4); derrotarlo es la condición de victoria de la **Partida rápida** (§2b). Bloques de enemigos en [`../characters/enemies.md`](../characters/enemies.md) §5b.
2. **Comportamiento de los enemigos en el mapa** → resuelto en [`../characters/enemies.md`](../characters/enemies.md) §2 (latente→activo por detección), §2b (aproximación/sigilo) y §5b (bloques). **Reaparición resuelta:** los enemigos **no reaparecen**; se colocan al generar el mapa y una zona limpiada queda despejada (`../characters/enemies.md` §2). Con el sistema de tiles se ubican en **agrupaciones temáticas** (campamentos, salas — §2).

### Pendiente de concretar (checklist, para cuando toque implementar)
- [x] **Reglas de la ficha de Terreno** *(decidido)* → §4b: atajo arriesgado, `1d20 + FUE/DES` vs CD 12; éxito = cruzas gratis y +1 movimiento, fallo = pierdes el movimiento y sufres el peligro del hex. Era la única de las 6 fichas sin ninguna regla. Peso 1 en Bosque añadido para que aparezca más de 0,6 veces por mapa.
- [x] **Mazmorra del prototipo** *(decidido)* → §3b-bis: **1 hexágono reforzado, sin sub-mapa** (1 Élite distinto al boss + 2 cartas de loot de Élite; sin luz, te embosca). El sub-mapa sigue siendo el objetivo, pero exigía un segundo generador entero sin añadir mecánica nueva.
- [ ] Diseñar el set inicial de "tiles" (grupos de hexágonos) para el sistema de generación por piezas, con sus reglas de conexión de bordes, cubriendo los 6 terrenos del prototipo, **y sus agrupaciones temáticas de fichas** (campamentos, salas — §2).
- [x] Definir tabla de probabilidades de generación por terreno y por tipo de ficha → §2c (tabla A pesos de terreno, tabla B distribución de fichas). Falta balancear.
- [x] Definir rango de visión base del personaje y cómo lo modifican clase/objetos/terreno → **dos radios** (`../game-design.md` §2.3): detalle `3 + mod SAB` (fichas) y terreno `detalle + 2` (silueta); −1 a ambos en Bosque (§3a), Montaña bloquea la línea de visión, +1 con Ojo avizor/habilidades de exploración (abajo). Falta afinar las cifras contra el tablero real.
- [x] Definir el **hex de entrada** y las localizaciones garantizadas → §2c pasos 0 y 4: entrada en **una esquina**, con **1 Guarida** (boss, esquina opuesta) y **1 Pueblo** (mitad cercana) siempre presentes.
- [x] Definir cómo interactúan mapa y combate → **Resuelto (`../game-design.md` §4b):** todo ocurre sobre el mismo tablero hex (sin pantalla aparte); se actúa por **adyacencia** (objetivo en hexágono contiguo, nunca en el propio).
- [x] Definir contenido inicial del mazo de encuentro y cómo se combina con las fichas → [`cards/encounter.md`](../cards/encounter.md) (10 cartas de Combate + 10 de Suceso, cruce con las 6 fichas, mazo único base). Falta balancear frecuencias.
- [ ] Definir número de capítulos del arco principal de la Campaña y el gancho narrativo propio y original (no LOTR literal) de cada uno.
- [x] Definir mecánicas reales de movimiento/ocultación/visión de los **5 terrenos del prototipo** → §3a (movimiento, detección, combate, descanso, peligro, peso). Los terrenos futuros siguen ilustrativos.
- [x] Decidir qué localizaciones especiales (3b) entran en el prototipo inicial → **Pueblo** (hub seguro: tienda, descanso largo, limpiar maldiciones), **Mazmorra** (sub-mapa de combate/loot) y **Guarida** (boss élite de la **Partida rápida**, §2c). El resto se añade después.
- [x] Listar las primeras habilidades/hechizos de exploración para el prototipo → set inicial:
  - **Ojo avizor** (Pícaro, [`../cards/class.md`](../cards/class.md)): adelanta *Detectado* un grupo vecino o +1 rango de visión.
  - **Mapa del cartógrafo** (Item, [`../cards/items.md`](../cards/items.md)): revela los grupos vecinos al usarlo.
  - **Antorcha** (arma soporte, [`../cards/weapons.md`](../cards/weapons.md)): +visión en localizaciones oscuras (Cueva/Mazmorra/Mina).
  - **Informante/Guía** (NPC, [`../characters/npcs.md`](../characters/npcs.md)): adelanta *Detectado* sin magia.
  - *(Futuro)* **Vista lejana** (hechizo de Mago): revela el terreno/contenido de un grupo *Detectado* sin entrar.

  > **Nota (prototipo) — cartas que se desbloquean con el sistema de grupos:** la niebla del prototipo es **por hexágono en dos capas** (terreno/detalle), sin grupos ni tiles (§2c). Por eso, todo efecto que manipule el estado *Detectado* de un **grupo vecino** (la mitad de *Ojo avizor*, *Mapa del cartógrafo*, *Espejo de acero*, el *Informante/Guía*, *Vista lejana*) queda **inactivo hasta que llegue el sistema de tiles/grupos** (§2). Lo que **sí** funciona ya en el prototipo: el **+1 de rango de visión** (*Ojo avizor*, *Herramientas de navegante*) y la **iluminación** en localizaciones oscuras (*Antorcha*). Es un caso de "carta presente en el catálogo pero desactivada hasta desbloquear su sistema".
  >
  > Con las dos capas de niebla, esos efectos tienen además una **traducción natural al prototipo** cuando se quiera activarlos antes de los tiles: "adelantar a *Detectado* un grupo vecino" ≈ "revelar el **contenido** de los hexes que ya tienes en visión de terreno" (es decir, aplicar la capa de detalle sobre la de terreno). No es la regla oficial todavía, pero deja la puerta abierta sin esperar a los tiles.
