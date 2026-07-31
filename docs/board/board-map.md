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

Por qué se aceptan en vez de prohibirlos al colocar: son lo que hace que la silueta no parezca una rejilla, y prohibirlos costaría encajes válidos a cambio de un tablero más macizo y más aburrido. Medido sobre 300 tableros **de 9 losetas** —el mínimo de hoy son 12, así que las dos cifras suben y están sin remedir—: aparecen en el **51 %**, con **1,6 hexágonos** de vacío por tablero. Casi siempre son de **1 ó 2 hexágonos**, y de vez en cuando sale una cuenca de verdad —la mayor medida, 18 hexágonos—. Las piezas grandes dejan más hueco que las pequeñas, así que la cifra sube con cada loseta Grande que entra en la bolsa. El generador los localiza al terminar (`Board.voids`) y `/dev/tablero` los cuenta.

Consecuencia en la biblioteca: una **loseta con un agujero dentro** (un anillo) es válida por la misma razón, y no hay que avisar de ella.

## 2b. Modos de juego: Partida rápida vs. Campaña

Con esto queda **validada la generación de mapa** para los dos modos que necesitamos:

### Partida rápida *(nombre de diseño anterior: "Modo Prueba")* (sandbox/skirmish)
- Mapa **100% aleatorio** (por tiles o hexágono-a-hexágono, sección 2), sin narrativa ni eventos escritos a mano.
- Configuración mínima: tamaño de mapa. **Siempre se coloca un boss** (enemigo élite/jefe) al generar el mapa, en el punto más alejado del punto de entrada — la "Guarida", que es una marca invisible del motor y no una ficha (§3b-bis) — derrotarlo es la condición de victoria (obligatorio, no opcional).
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
  - dentro de la **visión de detalle** → se revela además su **contenido** (las fichas);
  - fuera de ambas → oculto del todo.

  Esto da el mismo escalón conceptual que los 3 estados de niebla por grupo (§4) —intuyes antes de saber— **sin necesitar el sistema de tiles**. La niebla por grupo llega con los tiles y sustituirá a esto.

**Algoritmo mínimo:**
0. Elegir el **hex de entrada**: **una esquina del mapa** *(decidido)* — la "puerta" por la que se accede al mapa completo. Puede caer en cualquier terreno transitable (entras a una llanura, a un bosque, directamente a unas ruinas…), lo que ya da variedad de arranque sin lógica extra. Colocar el héroe ahí. *(Adaptado al sistema de losetas: la silueta es irregular y no tiene esquinas, así que la entrada se elige dentro de la **primera** loseta —el borde por el que empezó a crecer el tablero— y con preferencia por la **boca de su camino**: un camino cruza su loseta de lado a lado y se ancla por sus bocas, así que ya está mirando afuera, y entrar al mapa por el camino es lo natural. Sale así en el 48 % de los tableros, los que siembran con una loseta que trae sendero; en el resto, el hexágono transitable más alejado del centro. **Nunca en Montaña, ni en Mazmorra, ni en Pueblo** — la entrada es el borde del mundo conocido, no un sitio con nombre.)*
1. Elegir tamaño (ej. 12×12 para partidas cortas) y semilla. *(Adaptado al sistema de losetas: el tamaño no se pide en ancho × alto —la silueta es irregular— sino en **número de losetas**, y son **12, 15 ó 18** con 12 de mínimo; ver la nota «El tablero se mide en losetas» más abajo.)*
2. Rellenar cada hex por **peso de terreno** (tabla A). *(Superado por el sistema de losetas: ver la nota bajo la tabla A.)*
3. Garantizar **conectividad**: debe existir camino transitable de la entrada al resto. La Montaña ya es transitable aunque muy costosa (§3a); aun así conviene que no encierre zonas tras un coste casi prohibitivo. *(Con losetas este paso ya no garantiza nada: **mide**. Abría la Montaña que encerraba una bolsa, y se le ha quitado el permiso —la generación no repinta maquetado, punto (§2c nota «un tablero que no se corrige»)—, así que ahora cuenta los hexágonos incomunicados y los deja como están. Se puede porque el encaje de losetas da un tablero conexo por construcción: una bolsa aislada solo puede venir de una variante cuya roca parta su propio terreno, y de eso avisa el maquetado antes de guardarla. Medido: **0 hexágonos incomunicados en 300 tableros**, y `/dev/tablero` lo enseña como «Incomunicado» por si algún día sube.)*
4. Colocar el **boss** y asegurar los **sitios** de la partida *(decidido)*:
   - **1 Guarida** con el **boss élite** —**uno de los 3 Élite elegido al azar** (`../characters/enemies.md` §5b)— en el hex transitable **más lejano** a la entrada. Con entrada en esquina, eso lo pone en la esquina opuesta: la travesía máxima del mapa. La Guarida es la **única localización que queda** (§3b-bis) y **no se ve**: no tiene ficha ni marca en el suelo, solo le dice al motor dónde espera el boss. Lo que el jugador encuentra al llegar es la ficha de Enemigo del propio boss.
   - **1 Pueblo si el encaje lo trae, y ya NO garantizado** *(decidido, cambia lo anterior)*. El Pueblo es **terreno** (§3a) y lo trae maquetado una **loseta de Pueblo** —Poblado pequeño o grande, Posada, Iglesia, Torre de mago (§3b)—. Antes, cuando el encaje no sacaba ninguna, la generación **fundaba uno** repintando un hexágono; eso se ha quitado. El motivo por el que el Pueblo estaba garantizado sigue siendo verdad —concentra los NPCs de tienda, el descanso largo y la limpieza de Maldiciones (`../characters/npcs.md`), así que sin él **tres sistemas quedan inaccesibles** esa partida, y con oro inicial 0 no hay dónde gastar lo que ganes—, pero fundarlo a mano no lo arreglaba: **tapaba** un problema de la bolsa con un hexágono repintado que no correspondía a ninguna pieza del catálogo, y quien mirara el tablero veía una casa sola en medio del bosque sin loseta que la explicara. Un tablero que se corrige a sí mismo esconde el problema en vez de enseñarlo. Así que la cobertura del Pueblo pasa a ser **cosa del peso de sus tipos en la bolsa**, que es donde se decide cuánta gente vive en el mundo, y `/dev/tablero` la canta en cada tablero («Pueblo: ninguno» cuando no sale).
   - **1 Élite de Mazmorra, si el tablero lo trae.** Ya no lo decide un dado: la Mazmorra también es **terreno**, así que el segundo Élite va en un hexágono de Mazmorra de la **mitad lejana** —el más hondo, y nunca pegado a la Guarida—. Si el encaje no ha sacado ninguna loseta de Mazmorra allí, esta partida no lleva segundo Élite: salía en el **29 % de los tableros** de 9 losetas, y con 12-18 sube (sin remedir). Es la consecuencia buscada de que el sitio lo ponga la pieza y no el generador; para que salga más, lo que se sube es el peso del tipo Mazmorra en la bolsa.
5. Sembrar **fichas** según densidad y distribución (tabla B).

> **El tablero se mide en losetas: 12, 15 ó 18, y 12 es el mínimo** *(decidido)*. Con piezas de tamaño desigual —la bolsa va de 4 a 37 hexágonos, media 8,6 por peso— pedir "12×12" no significa nada, así que el mando es cuántas piezas se colocan. Los tres tamaños dan **~103, ~129 y ~155 hexágonos**, y por debajo de 12 el mapa se queda en un puñado de piezas: no da para una travesía, y con losetas Grandes en la bolsa dos piezas podían comerse medio tablero. El `tileCount` por defecto es **12** (`lib/rules/board-gen.ts`), y `/dev/tablero` ofrece los tres.
>
> Dos consecuencias, y las dos están **sin remedir**: el reloj de Amenaza —**40 turnos**— está calibrado contra una travesía de **22 hexágonos** (`../game-design.md` §6c.1), y un tablero de 18 losetas es más largo que eso, así que hay que medir la travesía máxima de los tres tamaños antes de dar el reloj por bueno. La segunda es buena: más losetas, más probable que el encaje saque Pueblo y Mazmorra (§3b).
>
> Y una tercera, esta ya resuelta: con 103-155 hexágonos el tablero **no cabe en pantalla** a un tamaño en el que se lea. Así que se mira por una **ventana** de alto fijo y se recorre —rueda para acercar, arrastre para moverse, flechas si no hay ratón (`components/game/board/use-board-view.ts`)—: «ver el mapa entero» y «leer un hexágono» dejaron de ser la misma vista. El encuadre encajado sigue siendo el estado neutro y el zoom un desvío medido contra él, que es lo que hace que volver a encajarlo no tenga que recalcular nada.
>
> **La mesa** *(decidido)*. El fondo de la ventana es **la mesa del juego**, no el lienzo de la wiki: marrón casi negro con viñeta —el centro es donde cae la luz y el borde la penumbra que empuja la mirada hacia el tablero—, el mismo en el laboratorio y en la partida y el mismo en skin claro y oscuro (`$board-table`, referencia `public/assets/viajesTierraMedia/map1.webp`).
>
> Encima llevó un tiempo **niebla de atmósfera** generada con ruido fractal, y **se ha retirado entera**: no se parecía a lo que se buscaba y cada ajuste la alejaba más. El efecto se rehará con una referencia delante. Lo único que conviene guardar del intento, porque volverá a hacer falta, son las dos cosas que se midieron: que una niebla se vea moverse depende de lo que recorre cada jirón **en relación con su tamaño** (manchas de 250 px a 11 px/s son un 4 % por segundo y no se ven; de 80 px, un 13 % y sí) y de **dónde** se mueve (sobre la mesa oscura cambia el píxel 3 niveles de 255 por segundo; por delante del mapa, sobre hexágonos de color, con la mitad de opacidad cambia el triple).
>
> Y cuidado con el nombre cuando se retome, porque hay **dos nieblas** y no son la misma: la de atmósfera no esconde nada y va *fuera* del tablero (no la mueve la cámara); la de **exploración** —la del §4, la que tapa lo que el héroe no ha visto— va por hexágono, está sin construir y cuando llegue irá *dentro*.
>
> **Un tablero que no se corrige** *(decidido)*. La generación **no repinta ni un hexágono**: el tablero de la partida son las losetas del catálogo tal y como se dibujaron, y lo que se ve en `/dev/losetas` es exactamente lo que sale al jugar. Tenía tres permisos para retocar —abrir la Montaña que encerraba una bolsa (paso 3), mover la entrada si caía en roca (paso 0) y fundar un Pueblo si el encaje no sacaba ninguno (paso 4)— y se le han quitado los tres.
>
> El motivo es el mismo en los tres casos: ninguno era el arreglo del problema, sino su tapadera. La bolsa incomunicada viene de una loseta cuya roca parte su propio terreno, y abrirla dejaba un hexágono de Llanura en medio de la sierra que no correspondía a ninguna pieza. El pueblo fundado venía de una bolsa con pocos pueblos, y ponía una casa sola en medio del bosque sin loseta que la explicara. **Un tablero que se corrige a sí mismo esconde el problema en vez de enseñarlo**, y el problema siempre está en la biblioteca: en un dibujo o en un peso. Así que ahora los dos primeros se **miden** y se informan (`GeneratedBoard.stranded`, que `/dev/tablero` enseña como «Incomunicado»; con la biblioteca de hoy, 0 en 300 tableros) y el tercero se acepta: hay tableros sin Pueblo (§3b).

**Tabla A — Pesos de terreno (prototipo):**

| Llanura | Camino | Bosque | Pantano | Montaña |
|---|---|---|---|---|
| 40 % | 20 % | 20 % | 10 % | 10 % |

**La tabla A ya no se sortea: es un OBJETIVO** *(decidido)*. Con el sistema de losetas implementado, **todo hexágono de una loseta lleva terreno obligatoriamente** —no existe "este lo decide el tablero"—, así que el paso 2 no se ejecuta: cada hexágono llega pintado por la pieza que lo trae. La tabla A pasa a ser el reparto de terreno **al que apunta el maquetado de la biblioteca**, y el laboratorio (`/dev/losetas`) enseña el que sale medido al lado de la cuota.

Por qué: si el terreno de un hexágono se sortea al colocar la pieza, lo que se ve al maquetarla no es lo que sale en la partida, y una loseta deja de ser una decisión de diseño para ser una plantilla. La variedad entre partidas la dan las **variantes** de cada tipo (el mismo sitio dibujado de varias maneras) y el giro, no el azar hexágono a hexágono.

La **Mazmorra** y el **Pueblo** son los dos que no tienen cuota en la tabla A: son terreno de **lugar** (§3a) y aparecen donde el maquetado los ponga.

**Ojo con leer la tabla A como si sumara 100.** Ya no lo hace: entre Pueblo (2,9 %) y Mazmorra (1,9 %) los dos terrenos de lugar se llevan un **4,8 %** del tablero sin cuota que cumplir, así que a los cinco de ambiente les queda el **95,2 %** para repartir. La cuota contra la que hay que comparar es la de la tabla **escalada a ese 95,2 %** — 38,1 / 19,0 / 19,0 / 9,5 / 9,5. Perseguir el 40 redondo sería quitarle sitio al Pueblo.

**Dónde se cumple la tabla A y dónde no.** El peso de cada tipo de loseta se ajusta para que **la bolsa** dé en la cuota, y ahí da, dentro de 0,4 puntos: Llanura 38,4 · Bosque 18,7 · Camino 18,9 · Pantano 9,4 · Montaña 9,7 (Pueblo 2,9 y Mazmorra 1,9, sin cuota). Lo que sale **medido en el tablero** sobre 300 partidas se separa un poco: Llanura 40,7 · Bosque 20,2 · Camino 15,2 · Pantano 9,8 · Montaña 8,7 · Pueblo 3,4 · Mazmorra 2,0.

La diferencia no es de maquetado, es de **encaje**, y afecta justo a los dos terrenos con anclas restringidas: una pieza de camino solo se une por la boca de su camino, y en la roca no se ancla nunca (§2). Al tener menos sitios donde encajar, Camino y Montaña pierden presencia en el tablero respecto a la bolsa, y Bosque y Llanura la ganan. Se corrige subiendo pesos (mentiría la bolsa) o dando preferencia al ancla de camino al colocar (cambiaría la regla de encaje): **pendiente de decidir**.

**Tabla B — Distribución de fichas por terreno** (pesos relativos; ~15-20 % de los hexes transitables llevan ficha, densidad configurable). Montaña no lleva ficha:

| Terreno | Enemigo | Amenaza | Tesoro | Exploración | Terreno (prueba) | Personaje |
|---|---|---|---|---|---|---|
| Llanura | 2 | 2 | 1 | 1 | 0 | 2 |
| Bosque | 1 | 3 | 2 | 2 | **2** | 1 |
| Pantano | 2 | 3 | 1 | 0 | 3 | 0 |
| Camino | 1 | 2 | 1 | 0 | 0 | 3 |
| Mazmorra | 2 | 1 | **3** | **3** | 0 | 0 |
| Pueblo | — | — | — | — | — | **siempre** |

Con estos pesos, un mapa 12×12 lleva **~23 fichas** repartidas así: ~4,5 Enemigo · ~6,7 Amenaza · ~3,5 Tesoro · ~5,3 Personaje · ~2,4 Exploración · **~1,8 Terreno** (subido desde peso Bosque 1/Pantano 2, que daba ~1,2 — §4b). Es el reparto sobre el que están calibradas la **tabla de loot** y la **duración de 40 turnos** (`../game-design.md` §6b.6, §6c.1), así que tocar esta tabla obliga a revisar los dos; la subida de Terreno le quita una fracción pequeña a Amenaza y Enemigo en Bosque y Pantano, que son las de más peso en esos dos terrenos. Estimado a mano, pendiente de remedir con el lote de semillas (`../status.md` §6), igual que el resto de esta tabla. Medido sobre 300 tableros de losetas, la ficha de Personaje sale **5,22 veces por partida**, que es justo la cifra de la que se partía.

**El Pueblo no se sortea: se llena.** Es la única fila de la tabla que no es una tabla, y a propósito — un pueblo no es un sitio donde *puede* haber algo, es donde vive la gente, así que **cada hexágono de Pueblo lleva una ficha de Personaje** y ninguna otra. Ahí está el trabajo que hacen los cinco tipos de loseta de Pueblo (§3b): el tipo decide cuántos hexágonos de Pueblo trae la pieza, y con eso cuánta gente sale — una **Posada** dibuja uno, y es un tabernero y se acabó; un **Poblado pequeño** dos, un tabernero y un vendedor, o un mago; un **Poblado grande** cuatro, que ya son oficios para elegir. *Quién* es cada uno lo decide la interacción (`../characters/npcs.md` §1); cuando exista ese subsistema, el tipo de loseta será lo que sesgue el sorteo — el mago de la **Torre de mago**, el sacerdote de la **Iglesia**.

La **Guarida** (§3b-bis) tampoco lleva ficha de la tabla B: aloja al boss. Parámetros configurables (recap de §2): tamaño, densidad de fichas, densidad de enemigos, semilla.

## 3. Tipos de terreno

> **Los 7 terrenos del prototipo ya tienen mecánicas oficiales** (§3a). La tabla grande de más abajo pasa a ser la referencia **ilustrativa** de los terrenos futuros (Colinas, Río/Lago, Nieve/Tundra, Desierto/Erial), aún sin cerrar.
>
> El rango de visión base lo gobierna la Sabiduría (`../game-design.md` §2.3); las mecánicas de terreno de abajo son bonus/penalizaciones encima de eso.
>
> **Set confirmado para el prototipo (7 terrenos):** Llanura, Bosque, Pantano, Montaña, Camino/Sendero, **Mazmorra** y **Pueblo**.
>
> La **Mazmorra** se llamaba **Cueva** y es lo mismo con otro nombre: el mismo agujero en la roca, las mismas cifras. Se renombró para que el terreno y el sitio al que da acceso se llamen igual —la Mazmorra del prototipo (§3b-bis) se resuelve **en** su hexágono, así que tener dos palabras para una cosa solo despistaba—.

### 3a. Mecánicas oficiales de los 7 terrenos del prototipo

Cada terreno toca los sistemas que ya diseñamos: movimiento (`../game-design.md` §2.2), detección enemiga (`../characters/enemies.md` §2), combate (`../game-design.md` §4b) y descanso (`../game-design.md` §4c). Valores = primer pase, sin balancear.

| Terreno | Movimiento | Visión / Detección | Combate | Acampar (§4c.2) | Peligro | Peso gen. |
|---|---|---|---|---|---|---|
| **Llanura** | Coste 1 (base) | Sin ocultación; el enemigo te detecta a rango normal | — | **Inseguro** (expuesto) | — | Alto |
| **Bosque** | Coste 1 | **Ocultación:** detección enemiga **−1**; pero **tu visión −1** (no ves lejos entre árboles) | **Cobertura:** +1 CA contra ataques a distancia; atacar sin haber sido detectado = **emboscada (ventaja)** | **Seguro** (riesgo mínimo) | — | Medio |
| **Pantano** | Coste 2 (difícil) | Normal | — | Inseguro | Al cruzar: salvación CON CD 12 o **Envenenado** ([`../effects.md`](../effects.md)) | Bajo |
| **Montaña** | **Transitable pero muy difícil:** coste **3** (con el pool base de 2 necesitas movimiento extra —Camino, carta de movimiento o Kit de escalada, [`../cards/items.md`](../cards/items.md)— para entrar) | Bloquea línea de visión | — | Inseguro (expuesto) | — | Bajo (relieve, semi-barrera) |
| **Camino/Sendero** | Coste 1, y **+1 de movimiento** el turno que te desplazas por camino | Expuesto (como Llanura) | — | Inseguro | — | Medio (conecta puntos; candidato a hexágono conector §4) |
| **Mazmorra** | Coste 2 (entrar a oscuras) | **A oscuras:** tu visión **−2** (el terreno que más ciega); detección enemiga **−1** (dentro no te ven llegar) | **Cobertura:** +1 CA contra ataques a distancia; permite **emboscada** | **Seguro** (refugio a cubierto) | — | **Sin cuota** (§2c) |
| **Pueblo** | Coste 1 (calle hecha) | Expuesto: no te esconde y tampoco te ciega | Ni cobertura ni emboscada — no hay dónde esconderse en una plaza | **Seguro** (bajo techo) | — | **Sin cuota** (§2c) |

**Notas:**
- **Mazmorra** es un **lugar, no ambiente**: como el Camino, cruza o perfora el fondo del mapa en vez de ser el fondo, y no tiene cuota en la tabla A —sale donde el maquetado la ponga (`lib/rules/tile-library.ts`)—. Por eso puede permitirse ser generosa en la tabla B —es el único terreno donde el Tesoro pesa más que la Amenaza— sin desbalancear el reparto: hay pocas y hay que ir a buscarlas. Sus dos cifras fuertes van en sentidos contrarios a propósito: se acampa seguro, pero ciega.
- **Pueblo** es el **contrario exacto de la Mazmorra**, y por eso sus cifras van todas al otro lado: se anda por calle hecha, se duerme bajo techo y no hay dónde esconderse —ni cobertura, ni emboscada, y el enemigo te ve venir igual que tú a él—. También es terreno de lugar y también sin cuota. Lo que hace de verdad al Pueblo **no es el terreno sino lo que se maqueta encima**: sus hexágonos llevan siempre ficha de Personaje (tabla B), y el **tipo de loseta** —Posada, Poblado, Iglesia, Torre de mago (§3b)— decide cuántos y de qué clase.
- **Bosque** es el terreno clave del sigilo: te esconde de los enemigos (detección −1, emboscada) pero también te ciega (visión −1) y te da cobertura a distancia. Es el contrapunto natural a Llanura/Camino (rápidos pero expuestos).
- **Montaña (coste alto)** actúa como relieve/semi-barrera para dar forma al mapa; ya no es un muro absoluto (se puede cruzar con movimiento extra).
- El estado **Oculto** ([`../effects.md`](../effects.md)) del Pícaro se apila sobre la ocultación de Bosque (indetectable hasta actuar).

**Terrenos futuros (aún ilustrativos, no oficiales)** — se cerrarán en pases de contenido posteriores, igual que se hizo con los 5 del prototipo en §3a:

| Terreno | Efecto de ejemplo (no oficial) | Notas |
|---|---|---|
| Colinas | +Alcance de visión (ves más hexágonos alrededor) | Bueno para explorar, malo para ocultarte |
| Ruinas | Punto de interés especial: alta probabilidad de ficha de evento (tesoro o enemigo oculto) | Entrada a "mini-mazmorra" opcional. La otra mitad de esta fila, la **Mazmorra**, ya es terreno oficial (§3a) |
| Río/Lago | Intransitable salvo puente/vado, o -2 movimiento si se cruza a nado | Puede generarse como "línea" que conecta varios hexágonos, no solo una casilla suelta |
| Nieve/Tundra | -1 movimiento | Zona de clima extremo; un posible efecto de frío acumulativo que aplique el estado **Miedo** ([`../effects.md`](../effects.md)) queda como idea futura |
| Desierto/Erial | -1 movimiento, recursos (agua/pociones) se consumen más rápido | Tensión de supervivencia |

## 3b. Localizaciones especiales (edificaciones)

> **Las dos que entraron en el prototipo ya no son localizaciones: son TERRENO** *(decidido)*. El Pueblo y la Mazmorra los trae **maquetados la loseta** (§2, §3a), así que un hexágono no lleva un sello de "aquí hay un pueblo" encima de una pradera: el hexágono **es** pueblo, con su coste, su acampada y su tabla de fichas, igual que un bosque es bosque. Lo que decide el contenido es el **tipo de loseta**, y de ahí salen los cinco tipos de Pueblo de la tabla de abajo.
>
> Por qué el cambio: la placa de localización decía lo mismo que el terreno de debajo y no aportaba nada que el terreno no pudiera aportar mejor —el terreno además llega con mecánicas, y la placa no—. Y sobre todo, un tipo de loseta puede **decidir qué sale dentro**: una Posada trae un tabernero, un Poblado grande trae oficios para elegir, una Torre de mago trae un mago. Eso con un sello encima de un hexágono no se podía decir.
>
> La única que sobrevive como localización es la **Guarida**, y es invisible (§3b-bis): no es un sitio del mundo que se pueda maquetar, es "dónde ha salido el boss esta partida", y eso solo lo sabe la generación. La ficha de Guarida y su placa **se retiraron**.

Al ser un mapa hexagonal, las localizaciones que **sigan** siendo localización se pueden **predefinir sin problema** como hexágonos concretos (no aleatorios como el terreno base) que, al entrar en ellos, dan acceso a un sub-mapa o pantalla propia — mismo patrón que la Mazmorra (§3a), pero llevado más lejos con más variedad e identidad propia.

**Confirmado: no hay "sistema aparte" para estos sub-mapas.** Todo el juego usa el mismo sistema hexagonal descrito en este documento (grupos, niebla, fichas de evento); una Mina es simplemente un mapa hexagonal más pequeño con su propio conjunto de grupos/hexágonos, no una pantalla con reglas distintas. El tamaño varía libremente, pero la arquitectura es una sola. El diseño visual/UI queda pendiente como tarea de arte más adelante (probablemente con ayuda de una IA generativa de imágenes), no es una decisión de arquitectura.

### Los 5 tipos de loseta de Pueblo *(decidido)*

El Pueblo es un terreno, pero **no todos los pueblos son el mismo pueblo**, y eso es lo que fijan los cinco tipos de loseta: cuántos hexágonos de Pueblo trae la pieza —y por tanto **cuánta gente sale**, porque cada hexágono de Pueblo lleva una ficha de Personaje (tabla B, §2c)— y de qué clase. *Quién* es cada NPC lo resuelve la interacción (`../characters/npcs.md` §1); el tipo de loseta es lo que sesgará ese sorteo cuando exista el subsistema.

| Tipo de loseta | Hexágonos de Pueblo | Quién vive ahí | Variantes |
|---|---|---|---|
| **Poblado pequeño** | 1-2 | Un tabernero y un vendedor, o un mago | *Poblado pequeño* (en el llano, con arboleda) · *Poblado del camino* (el sendero le hace de calle) |
| **Poblado grande** | 3-4 | Ya son oficios para elegir: tabernero, vendedor, herrero, capitán de mercenarios | *Poblado grande* (villa abierta) · *Poblado grande del camino* (asentado en la calle mayor) |
| **Posada** | 1 | Un **tabernero** y se acabó: descanso largo y rumores, en mitad de la nada | *Posada* (al pie del camino recto) · *Posada del cruce* (en un cruce de tres caminos) |
| **Iglesia** | 1 | Un **sacerdote/sanador**: limpia Maldiciones ([`../cards/curses.md`](../cards/curses.md) §4) | *Iglesia* (ermita en el llano) · *Iglesia del bosque* (hay que atravesar la espesura) |
| **Torre de mago** | 1 | Un **mago/encantador**: hechizos, pergaminos, encantar objetos | *Torre de mago* (al pie del macizo) · *Torre del páramo* (sola en campo abierto) |

- **La Posada existe para que un camino largo no sea un pasillo vacío.** Es la más común de las cinco junto al Poblado pequeño, y a propósito: te pilla **de paso**, sin desviarte. La Iglesia es lo contrario —hay que ir a buscarla—, y ahí está la diferencia entre las dos.
- **La Torre de mago está lejos a propósito:** al fondo de un valle de roca o sola en el páramo. Llegar es parte del precio de la tienda arcana.
- **Peso en la bolsa:** los cinco tipos suman 11 de 71, o sea el **15,5 % de la bolsa**. Medido sobre 300 tableros **de 9 losetas**, eso daba Pueblo en el **81 %**; el resto se queda **sin Pueblo**, desde que la generación ya no funda ninguno (§2c paso 4).
- **El tamaño del tablero ya arregla media pregunta.** La probabilidad de no sacar ninguna es `(1 − p)ⁿ` con `p` = cuota de Pueblo en la bolsa y `n` = losetas, así que subir el mínimo a 12 sube la cobertura sin tocar un peso: **~87 % con 12 losetas, ~92 % con 15 y ~95 % con 18** (aritmética, **sin remedir** — la medida de 300 tableros es de cuando el tablero eran 9; con 9 la misma cuenta daba 78 % y lo medido fue 81 %, porque las losetas no se sacan de una bolsa independiente, se encajan).
- **Cuánto costaría garantizarlo por peso, que es la pregunta abierta.** Con 12 losetas, bajar el fallo al 5 % pide subir el Pueblo del **15,5 % al 22 % de la bolsa** (~2,6 losetas de Pueblo por tablero) — más barato que con 9, donde hacían falta el 28 %, pero sigue siendo casi el doble de pueblos. Las tres salidas, y hay que elegir una: **(a)** dejarlo así y aceptar que ~1 de cada 7 partidas de 12 losetas se juega sin tienda ni descanso largo —lo que la convierte en una variante más dura, no en una partida rota—, sabiendo que en las de 18 ya baja a 1 de cada 20; **(b)** subir el peso a medias (Pueblo al 19 %, ~2,3 losetas por tablero) y quedarse en ~92 % con 12 losetas; **(c)** garantizarlo **en el encaje y no repintando**: si al llegar a las dos últimas losetas no ha salido ningún Pueblo, la bolsa se filtra a losetas de Pueblo mientras alguna encaje. La (c) mantiene el tablero 100 % catálogo —el pueblo que sale es una pieza de verdad, con su dibujo y su nota— y no infla la bolsa; es la que se propone. **Pendiente de decidir.**

### Localizaciones futuras (referencia, no oficial)

| Localización | Qué se hace al entrar (ejemplo, no oficial) | Notas |
|---|---|---|
| Castillo/Fortaleza | Hub de misiones importantes, o guarida de un enemigo relevante (mini-jefe de capítulo) | Puede estar controlado por aliados o por el enemigo según la historia |
| Mina | Sub-mapa de recolección de materiales/recursos (para crafteo futuro) + posible peligro (derrumbe, criaturas subterráneas) | Buena vía para introducir un sistema de crafteo más adelante sin comprometernos ya a ello |
| Campamento (enemigo o aliado) *(añadido, sabor D&D)* | Encuentro de combate si es enemigo, o refuerzos/aliados temporales si es amistoso | Se decide al generarlo o al revelarlo, dando variedad |
| Cripta/Cementerio *(añadido, sabor D&D)* | Entrada temática a mazmorra con enemigos no-muertos | Reutiliza el terreno **Mazmorra** (§3a) con set de enemigos propio |
| Torre de vigilancia *(añadido, sabor D&D)* | Al capturarla/visitarla, pasa a "Detectado" uno o más grupos de hexágonos vecinos, incluso sin conexión directa (ver sección 4) | Recompensa de exploración pura, sin combate obligatorio |

Las que sigan siendo localización no sustituyen el terreno base: **se colocan sobre/en vez de un hexágono de terreno normal** durante la generación. Las que ya son terreno (Pueblo, Mazmorra) no se colocan: **se maquetan**, y el generador ni las ve.

> Tres filas de esta tabla se fueron a la de arriba, convertidas en tipos de loseta de Pueblo: **Pueblo/Aldea** (los dos Poblados), **Templo/Santuario** (la Iglesia) y **Torre de mago**. La cuarta, **Mazmorra**, es ahora terreno (§3a) y se resuelve en su hexágono (§3b-bis).

> El **Nivel de Amenaza** del capítulo (`../game-design.md` §6c) **no se pausa** al entrar en el sub-mapa de una de estas localizaciones (Mina...) — sigue corriendo igual que en el mapa principal.

### 3b-bis. La Mazmorra del prototipo: un hexágono reforzado, sin sub-mapa *(decidido)*

En el **prototipo** la Mazmorra **no genera un mapa interior**. Se resuelve entera en su hexágono, que es además el motivo por el que la Cueva se renombró a Mazmorra (§3): había dos palabras —el terreno y el sitio— para una sola cosa.

- **Dónde cae:** en un hexágono de terreno **Mazmorra** de la mitad lejana del tablero, el más hondo y nunca pegado a la Guarida. Lo trae maquetado la loseta, así que **si el encaje no saca Mazmorra allí, esta partida no lleva Élite de Mazmorra** — pasa en el 71 % de los tableros (§2c paso 4).
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

- Un grupo (tile) puede estar en 3 estados: **Sin explorar** (oculto del todo, ni siquiera se intuye el tipo de terreno), **Detectado** (se ve que existe y su tipo de terreno, porque conecta con un grupo ya explorado, pero su contenido interior —fichas de evento, enemigos— sigue oculto) o **Explorado** (el personaje ya puso al menos un pie dentro de ese grupo).
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

> El **diseño visual** de estas seis fichas —forma, color, glifo y estados— está en §4c, junto con las 2 de personaje, y se trabaja en `/dev/pieces`. La columna "Icono" de abajo es la que se construyó.

| Ficha | Icono | Qué representa |
|---|---|---|
| Exploración | Ojo (emoji), en disco **hueso** (el único de cara clara) | Comodín: al interactuar puede resultar en cualquier cosa (tesoro, prueba, mercenarios reclutables ([`../cards/mercenaries.md`](../cards/mercenaries.md)), evento narrativo, o incluso vacío) — es la más ambigua de todas |
| Amenaza | Exclamación, en disco **rojo** | Peligro ambiguo: normalmente se resuelve como un enemigo, pero no se sabe con certeza hasta interactuar (podría ser una trampa, un peligro de terreno, etc.) |
| Tesoro | Cofre (emoji), en disco **oro claro** | Confirmado que da recompensa: carta(s) para el mazo (objeto, poción, arma, armadura) **y/o oro** (`../game-design.md` §6b.1) — el contenido concreto es aleatorio, pero la categoría "tesoro" se sabe de antemano; los cofres de mayor rareza pueden dar ambos |
| Terreno | Montaña (⛰︎), en disco **violeta** | Prueba ligada al terreno: puede dar un beneficio o ser un obstáculo (ej. una prueba de movimiento/agilidad para cruzar, especialmente relevante en capítulos de Campaña con un tramo difícil concreto) |
| Personaje (NPC) | Elfo (emoji), en disco **azul** | NPC con el que interactuar: mercenario para contratar, tabernero para curarte, mago/vendedor que te vende objetos, etc. — no implica combate. Detalles de tipos de NPC en [`../characters/npcs.md`](../characters/npcs.md) |
| Enemigo | Calavera con cuernos, en disco **granate** | Ya se sabe con certeza que es un enemigo antes de interactuar (a diferencia de "Amenaza"); el combate se inicia al quedar en un hexágono **adyacente** al suyo, no entrando en su hexágono (héroe y enemigo nunca comparten hex — ver `../game-design.md` §4b.1). Detalles de tipos de enemigo, comportamiento y jefes en [`../characters/enemies.md`](../characters/enemies.md) |

- Las fichas pueden tener una distribución ponderada distinta según el tipo de terreno (ej. ruinas → más probabilidad de Amenaza o Enemigo que una llanura; Pueblo → **siempre** ficha de Personaje, §2c).
- El terreno puede afectar el encuentro al activar una ficha de Amenaza/Enemigo: emboscada con ventaja si el jugador está en bosque y el enemigo no lo ha detectado; desventaja si el jugador cruza una llanura o camino a la vista.

### 4b. La prueba de la ficha de Terreno *(decidido)*

Era la única de las 6 fichas **sin ninguna regla**: decía "puede dar un beneficio o ser un obstáculo" y ahí acababa, sin estadística, sin CD y sin qué pasa al fallar.

**Qué es:** un **atajo arriesgado**. La ficha marca un paso difícil —un vado, una grieta, un tramo de maleza cerrada— que **puedes rodear siempre**: no bloquea el camino, solo lo acorta si te atreves. Ahí está la decisión, y encaja con el reloj de Amenaza (`../game-design.md` §6c): ahorrar 2 turnos o no arriesgar.

- **Prueba:** `1d20 + mod de FUE o DES` (**la mejor de las dos**, según si fuerzas el paso o lo esquivas) vs **CD 12**.
- **Éxito:** cruzas el hex **sin pagar su coste de movimiento** (has dado con el paso bueno) y **recibes 1 carta de movimiento** ([`../cards/items.md`](../cards/items.md) §5: Bota veloz, Atajo del pícaro o Zancada del viento), sorteada por rareza con la misma tabla que la Ficha de Tesoro —**45 % Común / 40 % Poco común / 15 % Raro** (`../game-design.md` §6b.6)—, que cuadra exacto con que hay una carta de movimiento por cada uno de esos tres escalones. La ficha **se retira**. *(Sustituye al antiguo +1 de movimiento ese turno: dar el bonus Y la carta duplicaba el premio de movimiento por el mismo acierto.)*
- **Fallo:** **pierdes el movimiento que te quedara** ese turno y sufres el **peligro del terreno** del hex (§3a — ej. Pantano: salvación CON o Envenenado; si el terreno no tiene peligro propio, **1d6 contundente**). La ficha **se queda**: puedes reintentarlo otro turno o rodearla.
- **Las cartas de equipo se enganchan aquí**, que es lo que les da uso fuera de combate: *Kit de escalada*, *Cuerda de cáñamo*, *Manta*, *Atajo del pícaro* y *Bota veloz* ([`../cards/items.md`](../cards/items.md)) dan **ventaja** en esta prueba o directamente evitan el coste — y dos de ellas, encima, son también el premio por acertarla.
- El mazo de encuentro **no** se roba en el caso normal (corrige [`../cards/encounter.md`](../cards/encounter.md) §5, que decía "a veces"): el resultado ya está en la propia prueba. Solo se roba un Suceso si la ficha estaba en un hex de terreno de **lugar** (Mazmorra o Pueblo, §3a).

> **Ojo, aparece poco (a propósito, pero un poco menos que antes).** Con la tabla B original (Pantano 2, Bosque 1) salía **~1,2 veces por mapa**. Se sube a **Pantano 3, Bosque 2** para llegar a **~1,8 por partida** — sigue siendo, con diferencia, la ficha más rara de las 6 (es sabor de exploración, no un sistema central, así que **es la última que hay que implementar** del generador), pero ahora que también reparte carta merece aparecer un poco más. La subida le quita un pellizco pequeño al resto de fichas de Bosque y Pantano (sobre todo Amenaza y Enemigo, que son las de más peso ahí); las cifras exactas hay que remedirlas con el lote de semillas de `/dev/tablero` (`../status.md` §6), igual que el resto de la tabla.

## 4c. Diseño de las fichas: dos familias, una sola forma *(decidido)*

Cómo se ven las fichas sobre la loseta. Se trabaja en `/dev/pieces` y el arte definitivo sigue diferido (`../status.md` §4), pero la **forma** y los estados ya están decididos: son una consecuencia de la **proyección inclinada** del tablero (compresión vertical de 0,85, constante `BOARD_TILT` en `components/game/board/HexBoard.tsx`), no una cuestión de gusto.

**La regla, y de ella sale todo lo demás:**

> **Toda ficha va tumbada en la loseta · todas son el mismo disco.**

| Familia | Qué es | Cómo se ve |
|---|---|---|
| **Ficha de contenido** (las 6 de §4) | Lo que hay **en** el hexágono: se resuelve y se retira | **Disco tumbado**, comprimido por la misma inclinación que el hexágono, con dos filetes propios, **relieve** (canto abajo, brillo arriba) y la **sombra corta** de la capa de fichas |
| **Ficha de personaje** (héroe y enemigo activo) | Quien **anda** por el tablero | El mismo disco, exactamente. Lo que las separa del resto es el dibujo y el color, no la forma |

- **Eran tres familias.** Se retiraron las otras dos, y las dos por el mismo motivo: la forma decía algo que ya decía otra cosa mejor.
  - La **placa de localización** —tumbada, más grande, sin sombra ni filete claro— se fue con las localizaciones: el Pueblo y la Mazmorra son **terreno** (§3a, §3b), así que los pinta el mapa, y la Guarida no se ve. La placa acabó siendo un sello encima de un hexágono que ya decía lo mismo.
  - La **peana de personaje** —la única figura de pie, más alta que cualquier disco, con cuernos y base ancha para distinguir bando— se fue porque de pie **tapa el hexágono de detrás y baila entre dos casillas**. Es el mismo problema que ya había descartado poner los discos de pie, y no había razón para que los personajes fueran la excepción: con la inclinación en 0,85 el glifo tumbado solo pierde un 15 % de altura y se lee igual. De paso desaparece la única pieza que sobresalía de su casilla, que era lo que obligaba a pintar el tablero ordenado por profundidad.
- **El volumen sale de la geometría**, nunca pintado en el dibujo: compresión por la inclinación y una sombra corta y apretada en la capa de fichas (una ficha se levanta milímetros de la loseta, no centímetros de la mesa). Misma regla que sostiene el canto de la loseta, y por lo mismo: así el arte definitivo puede seguir siendo cenital.
- **El enemigo latente se resuelve con el COLOR, no con la forma:** el disco de Enemigo es lo que ves desde lejos, y cuando te detecta y pasa a **Activo** ([`../characters/enemies.md`](../characters/enemies.md) §2) sigue siendo el mismo disco, con la misma calavera con cuernos, en **otra cara**. Antes se levantaba; ahora cambia de color. Sin inventar un icono nuevo, que es lo que importaba de aquella solución.
- **Las fichas de personaje son ahora tres, y dos de ellas chocan con una hermana** (validado en `/dev/pieces` *(aceptado para el prototipo)*):
  - El **Héroe** lleva el emoji del **mago** (🧙🏻‍♂️) y la ficha de Personaje el del **elfo**: dos humanoides con capucha, y a tamaño de partida el glifo no los separa. Lo hace la cara — azul **pálido** el héroe contra el azul medio del Personaje (contraste de luminancia 4,15:1, medido contra `$piece`) — y basta. Es la tercera cara clara del tablero, con Tesoro y Exploración.
  - El **Enemigo activo** no podía ser un tercer rojo: entre el granate del latente y el ladrillo de la Amenaza no queda hueco que se lea. Va en **negro con la tinta al rojo vivo**, la única cara oscura del juego, y su caso peor es sobre **Mazmorra** —el terreno más oscuro—, donde el disco casi se funde con el terreno (1,59:1) y lo sostiene la tinta roja (4,13:1) y el filete claro. Válido para el prototipo; no es arte definitivo, así que no se afina más ahora.
  - **Jefe** *(añadido)*: la corona (👑) que marca al **Jefe de capítulo** y al **Jefe final de campaña** (`../characters/enemies.md` §3) con la misma ficha — capítulo y final comparten glifo, lo que importa es "es un jefe", no cuál de los dos. Va en **morado**, deliberadamente fuera de la familia de rojo de Amenaza/Enemigo: aquí sí importa la categoría de peligro, no solo la certeza. Vive en **Modo Campaña** (§2b), que todavía no tiene motor propio — `board-gen.ts` no la coloca en ningún tablero de Partida rápida, es diseño por delante del sistema para tenerla ya probada en `/dev/pieces`.

**Cuatro estados de un hexágono con ficha.** Los tres primeros son las dos capas de niebla de §2c; el cuarto es nuevo:

1. **Sin explorar** — fuera de los dos radios: no se ve nada.
2. **Terreno visible** — dentro de la visión de terreno: se ve el terreno y **no se sabe que hay ficha**.
3. **Ficha revelada** — dentro de la visión de detalle: aparece el disco.
4. **Resuelta** — la ficha **se retira** y deja una **huella grabada** en el terreno: anillo a trazos, sin relieve y sin sombra. No es una ficha apagada que se pueda volver a activar: es la marca de "aquí ya estuve", para no caminar dos veces hasta un cofre vacío.

**La paleta se elige contra el terreno, no por gusto.** El tablero es verde (Llanura y Bosque, ~60 %), gris (Pantano, Montaña) y arena (Camino), así que las fichas van a colores que ahí no existen y **ninguna es verde**. Dos consecuencias que corrigen la tabla de §4:

- La ficha de **Terreno no es la "montaña verde"**: sobre Bosque y Llanura desaparecía. Va en violeta.
- **Personaje no es blanco, es azul.** Había dos fichas blancas (con Exploración) y a tamaño de partida no se distinguían. **Exploración se queda como la única de cara clara**, y a propósito: es el comodín, el único cuyo contenido no se sabe, así que no tener color es su significado.
- **Amenaza y Enemigo comparten familia de rojo** (rojo y granate) porque una Amenaza casi siempre resulta ser un enemigo: lo que las separa es la certeza, no la categoría.

**Cada disco tiene relieve, y también sale de la geometría:** el **canto** del cartón asoma por debajo de la cara (la misma elipse, desplazada hacia abajo y en oscuro) y un **brillo** neutro ocupa la mitad de arriba, porque la luz del tablero viene de arriba —es la que tira la sombra de la loseta hacia abajo—. Los dos son neutros, así que valen igual para las nueve fichas y el relieve no se ajusta color a color.

**El dibujo mezcla rutas y emoji, y hay que saberlo.** Las fichas eran todas emoji, que se pintan como mapa de bits distinto en cada sistema, no aceptan ni color ni filete y por debajo de 16 px se vuelven una mancha; por eso necesitaban un halo claro detrás para verse. Se redibujaron como rutas propias —con dos filetes por disco, el oscuro de fuera para el Bosque y la Mazmorra y el claro de la cara para el Camino y la Llanura, que es lo que las hace legibles sobre los siete terrenos— y después **seis volvieron a emoji por decisión de diseño**: Tesoro (cofre), Exploración (ojo), Personaje (elfo), Héroe (mago), Terreno (montaña ⛰︎, al mejorar su mecánica) y Jefe (corona 👑, añadida directamente como emoji). Consecuencias, porque un emoji trae sus propios colores y no obedece a la tinta de su ficha:

- La **cara de esas seis tiene que hacer de papel**, no de tinta: por eso el oro de Tesoro es **claro** y no el oro saturado del primer pase.
- **Dependen de la fuente del sistema.** El cofre es `U+1FA8E` (Unicode 17), así que en una fuente vieja sale el rectángulo de carácter desconocido; el elfo es una secuencia ZWJ de cuatro puntos de código, y una fuente incompleta la parte en dos glifos.
- La baraja queda **partida en dos estilos** —tres siluetas planas y seis dibujos con sombreado propio—. **Decidido: se queda así.** Unificar (redibujar las tres rutas como emoji, o las seis emoji como rutas) no es un bloqueante y se revisa en el pase de arte profesional, no antes.

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
2. ~~Si el sub-mapa de las localizaciones especiales (3b) usa el mismo sistema hexagonal~~ → **Resuelto y luego superado:** sí, todo el juego usaría la misma arquitectura hexagonal. Pero las dos del prototipo ya no son localizaciones sino **terreno** (§3b), así que no hay sub-mapa que arquitecturar: la Mazmorra se resuelve en su hexágono (§3b-bis) y el Pueblo también. La duda sigue viva solo para la Mina y lo que venga después.
3. ~~§5 (Enemigos ocultos en el mapa) desactualizada~~ → **Resuelto:** se reemplazó por una taxonomía de 6 fichas del tablero (Exploración, Amenaza, Tesoro, Terreno, Personaje, Enemigo — sección "Fichas del tablero") y se creó [`../characters/enemies.md`](../characters/enemies.md) como documento dedicado a tipos de enemigo, comportamiento en el mapa y jefes.
4. ~~Duplicado entre "Ruinas/Cueva" (§3) y "Construcción/Ruina genérica" (§3b)~~ → **Resuelto:** se mantiene como terreno en §3 y se quitó "Construcción/Ruina genérica" de §3b para no tener el mismo concepto dos veces. La Cueva se separó después de esa fila, ya es terreno oficial con mecánicas propias (§3a) y desde entonces se llama **Mazmorra**; "Ruinas" sigue en la tabla ilustrativa.
5. ~~Número de terrenos para el prototipo~~ → **Resuelto:** set confirmado de 5 — Llanura, Bosque, Pantano, Montaña, Camino/Sendero (marcados en la tabla de §3). El resto queda para pases de contenido posteriores.

**Resueltas (desbloqueadas por game-design.md):**
6. ~~Tensión entre §3 y §4 (terreno vs. habilidad de visión)~~ → **Resuelto:** el rango de visión lo gobierna Sabiduría, en **dos radios** (`../game-design.md` §2.3: detalle `3 + mod SAB`, terreno `+2` más, +1 por punto de modificador). El efecto de ejemplo de Colinas (§3) puede quedar como bonus adicional de terreno encima de eso; la **ocultación de Bosque** ya tiene mecánica: reduce el rango de detección de los enemigos (`../game-design.md` §4b.5, `../characters/enemies.md` §2) — evitar/emboscar en vez de pelear.
7. ~~Coste de cruzar un grupo entero~~ → **Resuelto:** cada hexágono cuesta 1 punto de movimiento de un pool por turno **fijo de 2 movimientos para todos los personajes** (`../game-design.md` §2.2: estándar único, sin variación por raza ni por estadística; los extras vienen de fichas/cartas de movimiento/cartas de clase). El terreno de cada hexágono modifica ese coste como ya estaba descrito.

**Abiertas:**
1. ~~El "boss final" de la **Partida rápida**~~ → **Resuelto:** se coloca un Élite en una **Guarida** en el hex más lejano a la entrada (§2c, paso 4); derrotarlo es la condición de victoria de la **Partida rápida** (§2b). La Guarida es hoy la única localización que queda, y es invisible (§3b-bis). Bloques de enemigos en [`../characters/enemies.md`](../characters/enemies.md) §5b.
2. **Comportamiento de los enemigos en el mapa** → resuelto en [`../characters/enemies.md`](../characters/enemies.md) §2 (latente→activo por detección), §2b (aproximación/sigilo) y §5b (bloques). **Reaparición resuelta:** los enemigos **no reaparecen**; se colocan al generar el mapa y una zona limpiada queda despejada (`../characters/enemies.md` §2). Con el sistema de tiles se ubican en **agrupaciones temáticas** (campamentos, salas — §2).

### Pendiente de concretar (checklist, para cuando toque implementar)
- [x] **Diseño visual de las 6 fichas y las 2 de personaje** *(decidido, válido para el prototipo)* → §4c: **un solo disco tumbado** para las dos familias —la placa de localización y la figura de pie sobre peana se retiraron—, cuatro estados con la huella de la ficha resuelta, y paleta elegida contra el terreno (Terreno pasa de verde a violeta, Personaje de blanco a azul, Enemigo activo a negro con tinta al rojo). Validado en `/dev/pieces`: la mezcla de rutas y emoji se queda tal cual (Terreno pasó de ruta a emoji de montaña ⛰︎ al mejorar su mecánica, §4b), y los dos pares de riesgo (Héroe/Personaje, Enemigo activo sobre Mazmorra) se comprobaron y aguantan. El **arte** definitivo sigue diferido; lo decidido es la forma, no el dibujo final.
- [x] **Ficha de Jefe** *(decidido, ver §4c)* → una tercera ficha de personaje, la corona (👑), compartida por el Jefe de capítulo y el Jefe final de campaña (`../characters/enemies.md` §3): no distinguía ninguna de las dos categorías de jefe hasta ahora, que reutilizaban la ficha genérica de Enemigo. Va en morado, fuera de la familia de rojo de Amenaza/Enemigo, y vive en Modo Campaña — `board-gen.ts` no la coloca todavía, es diseño por delante del motor.
- [x] **Reglas de la ficha de Terreno** *(decidido)* → §4b: atajo arriesgado, `1d20 + FUE/DES` vs CD 12; éxito = cruzas gratis y **recibes una carta de movimiento** (`../cards/items.md` §5, sorteada por rareza vía `../game-design.md` §6b.6), fallo = pierdes el movimiento y sufres el peligro del hex. Era la única de las 6 fichas sin ninguna regla. Peso subido en Bosque y Pantano para que pase de ~1,2 a ~1,8 veces por mapa.
- [x] **Mazmorra del prototipo** *(decidido)* → §3b-bis: **1 hexágono reforzado, sin sub-mapa** (1 Élite distinto al boss + 2 cartas de loot de Élite; sin luz, te embosca). El sub-mapa sigue siendo el objetivo, pero exigía un segundo generador entero sin añadir mecánica nueva.
- [ ] Diseñar el set inicial de "tiles" (grupos de hexágonos) para el sistema de generación por piezas, con sus reglas de conexión de bordes, cubriendo los 6 terrenos del prototipo, **y sus agrupaciones temáticas de fichas** (campamentos, salas — §2).
- [x] Definir tabla de probabilidades de generación por terreno y por tipo de ficha → §2c (tabla A pesos de terreno, tabla B distribución de fichas). Falta balancear.
- [x] Definir rango de visión base del personaje y cómo lo modifican clase/objetos/terreno → **dos radios** (`../game-design.md` §2.3): detalle `3 + mod SAB` (fichas) y terreno `detalle + 2` (silueta); −1 a ambos en Bosque (§3a), Montaña bloquea la línea de visión, +1 con Ojo avizor/habilidades de exploración (abajo). Falta afinar las cifras contra el tablero real.
- [x] Definir el **hex de entrada** y lo garantizado → §2c pasos 0 y 4: entrada en **una esquina**, con **1 Guarida** invisible (boss, esquina opuesta) y **1 Pueblo** (mitad cercana) siempre presentes. El Pueblo lo trae la loseta en el 81 % de los tableros, y en el resto **no hay Pueblo**: la generación ya no funda ninguno, y garantizarlo sin repintar está pendiente de decidir (§3b).
- [x] Definir cómo interactúan mapa y combate → **Resuelto (`../game-design.md` §4b):** todo ocurre sobre el mismo tablero hex (sin pantalla aparte); se actúa por **adyacencia** (objetivo en hexágono contiguo, nunca en el propio).
- [x] Definir contenido inicial del mazo de encuentro y cómo se combina con las fichas → [`cards/encounter.md`](../cards/encounter.md) (10 cartas de Combate + 10 de Suceso, cruce con las 6 fichas, mazo único base). Falta balancear frecuencias.
- [ ] Definir número de capítulos del arco principal de la Campaña y el gancho narrativo propio y original (no LOTR literal) de cada uno.
- [x] Definir mecánicas reales de movimiento/ocultación/visión de los **5 terrenos del prototipo** → §3a (movimiento, detección, combate, descanso, peligro, peso). Los terrenos futuros siguen ilustrativos.
- [x] Decidir qué localizaciones especiales (3b) entran en el prototipo inicial → **Pueblo** (hub seguro: tienda, descanso largo, limpiar maldiciones), **Mazmorra** (combate/loot) y **Guarida** (boss élite de la **Partida rápida**, §2c). El resto se añade después. *(Superado: las dos primeras son hoy **terreno** y llegan maquetadas en la loseta, con cinco tipos de Pueblo — §3b. Solo la Guarida sigue siendo localización, y ya no se ve.)*
- [x] Listar las primeras habilidades/hechizos de exploración para el prototipo → set inicial:
  - **Ojo avizor** (Pícaro, [`../cards/class.md`](../cards/class.md)): adelanta *Detectado* un grupo vecino o +1 rango de visión.
  - **Mapa del cartógrafo** (Item, [`../cards/items.md`](../cards/items.md)): revela los grupos vecinos al usarlo.
  - **Antorcha** (arma soporte, [`../cards/weapons.md`](../cards/weapons.md)): +visión en sitios oscuros (Mazmorra, y la Mina cuando llegue).
  - **Informante/Guía** (NPC, [`../characters/npcs.md`](../characters/npcs.md)): adelanta *Detectado* sin magia.
  - *(Futuro)* **Vista lejana** (hechizo de Mago): revela el terreno/contenido de un grupo *Detectado* sin entrar.

  > **Nota (prototipo) — cartas que se desbloquean con el sistema de grupos:** la niebla del prototipo es **por hexágono en dos capas** (terreno/detalle), sin grupos ni tiles (§2c). Por eso, todo efecto que manipule el estado *Detectado* de un **grupo vecino** (la mitad de *Ojo avizor*, *Mapa del cartógrafo*, *Espejo de acero*, el *Informante/Guía*, *Vista lejana*) queda **inactivo hasta que llegue el sistema de tiles/grupos** (§2). Lo que **sí** funciona ya en el prototipo: el **+1 de rango de visión** (*Ojo avizor*, *Herramientas de navegante*) y la **iluminación** en sitios oscuros (*Antorcha*). Es un caso de "carta presente en el catálogo pero desactivada hasta desbloquear su sistema".
  >
  > Con las dos capas de niebla, esos efectos tienen además una **traducción natural al prototipo** cuando se quiera activarlos antes de los tiles: "adelantar a *Detectado* un grupo vecino" ≈ "revelar el **contenido** de los hexes que ya tienes en visión de terreno" (es decir, aplicar la capa de detalle sobre la de terreno). No es la regla oficial todavía, pero deja la puerta abierta sin esperar a los tiles.
