# Arte de V3

> ## ⚠️ TODO LO QUE HAY AQUÍ ES PROVISIONAL
>
> **Decidido el 26 de agosto de 2026 por Dario.** El generador no está
> obedeciendo la especificación de abajo —sale lo que sale, tanda tras tanda—,
> así que la política mientras dure es: **se van metiendo las ilustraciones que
> vayan saliendo, tal cual, para que las cartas dejen de ser emojis y se puedan
> mirar de verdad. Ninguna es definitiva.**
>
> Lo que eso implica, y conviene tenerlo escrito porque cambia el sentido de casi
> todo lo que sigue:
>
> - **Los desajustes de la tabla NO son deuda que arreglar.** Ni el lienzo
>   apaisado de tres archivos, ni el encuadre de veintitrés de veinticuatro. Nadie tiene
>   que regenerarlos, y sobre todo nadie tiene que *recortarlos a mano* para
>   cuadrarlos. La tabla se mantiene porque es la **lista de comprobación para
>   cuando llegue la generación buena**, no una lista de tareas.
> - **La conversión a `.webp` espera a esa misma tanda.** Convertir un relleno es
>   trabajo que se tira dos veces.
> - **La especificación de abajo no se toca ni se relaja.** Que el generador no la
>   cumpla no la convierte en la norma equivocada; la norma es lo que hay que
>   pedirle. Si algo hay que cambiar es el **prompt**, no el objetivo — ver la
>   pista del ancla de suelo en el punto 3 del bloque de abajo.
> - **Y al mirar las cartas montadas, ojo con esto**: una carta que sale cortada
>   por el muslo lo está por el **archivo**, no por el marco. El marco ya está
>   decidido —**J · Orla**, 25 de agosto de 2026— y pinta el arte **a sangre**
>   dentro del octógono, con el panel del pie encima, así que hereda tal cual la
>   norma del cuarto de abajo: mientras la figura acabe al 86% y no al 72%, el
>   panel le va a comer las piernas y eso no lo arregla ningún ajuste de CSS.
>   Sirve para saber qué esperar; no es un fallo de la carta.

**Ya hay arte, y ya son dos razas enteras.** Veinticuatro archivos, doce y doce:
los **doce de 👤 Humanos** —sus cuatro héroes y sus ocho unidades, cerrada el
**31 de agosto de 2026** con el 🐉 Dragón dorado— y los **doce de ⛏️ Enanos**, que
entraron la noche del 26 de agosto de 2026 de una sola tacada. Las dos razas
completas pesan **30,1 MB cada una**, que ya no es una estimación de una muestra:
son dos.

**Con eso el orden previsto queda invertido, y hay que dejar de citarlo.**
[`prompts/enanos.md`](../../../knowledge/v3/races-concept/prompts/enanos.md) decía
«Fase 2: entra cuando Humanos esté cerrado», y el argumento era que sin las doce
imágenes de la piloto no hay vara de medir cuánta masa es un tier 8. Enanos llegó
antes y llegó completa, así que durante cinco días **la vara de medir la puso
Enanos**. Con el 🐉 Dragón dorado del **31 de agosto de 2026** eso se acaba:
Humanos también tiene sus ocho tiers a la vista, del 🗡️ Miliciano al 🐉 Dragón,
así que ahora hay **dos progresiones completas que comparar entre sí** —y son
distintas a propósito, porque una acaba en un armazón de metal y la otra en una
criatura—. Es la primera vez que se puede juzgar un salto de tier contra otra
raza y no solo contra sus propios vecinos.

**Y con eso se pierde lo único que Humanos seguía enseñando: el hueco sin
dibujar.** El emoji en el sitio de la ilustración bajó de cuatro cartas a dos con
la tanda del **27** (🐎 Caballería y 🦅 Grifo), a una con el **✝️ Paladín del 28**
y a **CERO con el dragón del 31**. En las dos razas dibujadas ya no queda ni una
carta a emoji, así que el caso de prueba de si el marco aguanta una carta sin arte
**ya no se puede mirar donde importaba**, que era la cima de una progresión. Sigue
existiendo en dos sitios y en ninguno es de estas razas: en el laboratorio de
bocetos, **en una sola carta**, el 🐉 Dragón esquelético que se pinta ahí de caso
límite y es de 💀 No-muertos; y en la baraja, en las veinticuatro cartas de
💀 No-muertos y 🔥 Demonios, que entraron enteras sin arte. La consecuencia estaba
anunciada aquí y toca cumplirla: **si el hueco vacío se quiere seguir mirando en
una raza dibujada, hay que dejar un sujeto sin arte a propósito** — y el candidato
razonable es un tier bajo, no la cima, que es lo que estos días costó tener a
emoji.

Dos columnas y no una, porque son **dos cosas distintas** y hay que poder
mirarlas por separado: el **lienzo** (la proporción del archivo) y el
**encuadre** (dónde cae la figura dentro de él). Hasta el 26 de agosto de 2026
solo se miraba el primero.

| Archivo | Sujeto | Medida | Lienzo | Encuadre (pies) |
|---|---|---|---|---|
| `races/humanos/guerrero.png` | ⚔️ Guerrero | 1060×1484 | ✅ 5:7 | ⚠️ ~86% |
| `races/humanos/mago.png` | 🔮 Mago | 1060×1484 | ✅ 5:7 | ⚠️ ~89% |
| `races/humanos/sacerdote.png` | ✝️ Sacerdote | 1477×1065 | ⚠️ Apaisado | ✅ ~72% |
| `races/humanos/arquero.png` | 🏹 Arquero | 1484×1060 | ⚠️ Apaisado | ⚠️ ~78% |
| `races/humanos/units/miliciano.png` | 🗡️ Miliciano (tier 1) | 1484×1060 | ⚠️ Apaisado | ⚠️ ~79% |
| `races/humanos/units/arquero.png` | 🏹 Arquero (tier 2) | 1060×1484 | ✅ 5:7 | ⚠️ ~86% |
| `races/humanos/units/caballero.png` | 🛡️ Caballero (tier 3) | 1060×1484 | ✅ 5:7 | ⚠️ ~86% |
| `races/humanos/units/mago.png` | 🔮 Mago (tier 4) | 1060×1484 | ✅ 5:7 | ⚠️ ~85% |
| `races/humanos/units/caballeria.png` | 🐎 Caballería (tier 5) | 1060×1484 | ✅ 5:7 | ⚠️ ~88% |
| `races/humanos/units/grifo.png` | 🦅 Grifo (tier 6) | 1060×1484 | ✅ 5:7 | ⚠️ ~77% |
| `races/humanos/units/paladin.png` | ✝️ Paladín (tier 7) | 1060×1484 | ✅ 5:7 | ⚠️ ~91% |
| `races/humanos/units/dragon-dorado.png` | 🐉 Dragón dorado (tier 8) | 1060×1484 | ✅ 5:7 | ⚠️ ~91% |
| `races/enanos/guerrero.png` | ⚔️ Guerrero | 1060×1484 | ✅ 5:7 | ⚠️ ~84% |
| `races/enanos/ingeniero.png` | ⚙️ Ingeniero | 1060×1484 | ✅ 5:7 | ⚠️ ~83% |
| `races/enanos/berserker.png` | 🪓 Berserker | 1060×1484 | ✅ 5:7 | ⚠️ ~86% |
| `races/enanos/maestro-de-runas.png` | 🔯 Maestro de runas | 1060×1484 | ✅ 5:7 | ⚠️ ~88% |
| `races/enanos/units/minero.png` | ⛏️ Minero (tier 1) | 1024×1536 | ✅ 2:3 * | ⚠️ ~85% |
| `races/enanos/units/guerrero-enano.png` | 🪓 Guerrero enano (tier 2) | 1024×1536 | ✅ 2:3 * | ⚠️ ~84% |
| `races/enanos/units/herrero-de-guerra.png` | 🔨 Herrero de guerra (tier 3) | 1024×1536 | ✅ 2:3 * | ⚠️ ~88% |
| `races/enanos/units/ingeniero.png` | ⚙️ Ingeniero (tier 4) | 1023×1537 | ✅ 2:3 * | ⚠️ ~85% |
| `races/enanos/units/mosquetero.png` | 🔫 Mosquetero (tier 5) | 1024×1536 | ✅ 2:3 * | ⚠️ ~89% |
| `races/enanos/units/guardia-de-hierro.png` | 🛡️ Guardia de hierro (tier 6) | 1060×1484 | ✅ 5:7 | ⚠️ ~84% |
| `races/enanos/units/golem-de-piedra.png` | 🗿 Gólem de piedra (tier 7) | 1060×1484 | ✅ 5:7 | ⚠️ ~82% |
| `races/enanos/units/coloso-de-adamantita.png` | ⛰️ Coloso de adamantita (tier 8) | 1060×1484 | ✅ 5:7 | ⚠️ ~89% |

*(«Pies» = dónde acaba la figura, medido sobre el alto del lienzo. La norma de
§"Encuadre" dice **72%**, para que el cuarto de abajo quede libre. Los
porcentajes están medidos a ojo sobre una hoja de guías, así que valen para
decidir, no para citar al píxel.)*

*(En el ✝️ Paladín los dos pies **no caen a la misma altura**: la bota de detrás
acaba al ~86% y la de delante al ~91%. La cifra de la tabla es la del punto más
bajo, que es la norma que sigue el resto de filas — pero conviene saber que aquí
la diferencia son cinco puntos, o sea 74 px, porque va en contrapposto y adelanta
una pierna.)*

*(En el 🐉 Dragón dorado pasa lo mismo pero peor, y por otra pieza: las garras
delanteras acaban al ~81% y las traseras al ~84%, o sea que **el sujeto sí para
antes que ningún otro de la banda**, y lo que baja al ~91% es **la cola**, que
cuelga por delante del castillo. La cifra de la tabla vuelve a ser la del punto
más bajo, pero aquí la diferencia entre el cuerpo y el punto medido son siete
puntos: es un archivo que se sale del cuarto de abajo **con un apéndice y no con
los pies**, que es un fallo distinto y pide un arreglo distinto — ver la tanda del
31 más abajo.)*

*(En el 🦅 Grifo «pies» son **las garras**, porque vuela: no hay figura apoyada
en el suelo, así que lo medido es el punto más bajo de la criatura —una zarpa
trasera— y lo que ocupa el cuarto de abajo es el castillo del fondo. Es la
primera fila de la tabla donde el número no habla de una figura de pie, y por eso
mismo es la más informativa: ver §"Lo que sigue sin cuadrar" punto 3.)*

*(**\*** El `2:3` va en verde y no en ámbar porque **no es un desajuste**:
§"Lienzo y formato" lo da como el sustituto válido cuando la herramienta no
ofrece 5:7 —«coge el ratio vertical más alto que tenga»—, y recortar de 2:3 a 5:7
es la operación barata que esa misma norma autoriza. El `1023×1537` del ⚙️
Ingeniero unidad es el mismo 2:3 con un píxel de menos, no otro lienzo.)*

**Los doce de Humanos** se pintan en dos sitios: los bocetos de marco de
**Cartas › Diseño de cartas** (`/docs/v3/cards/design`) y el marco elegido de
**Cartas › Diseño baraja** (`/docs/v3/cards/deck`). **Los doce de Enanos, solo en
la baraja**, y a propósito: el laboratorio de bocetos se queda con la raza piloto
porque nueve marcos × veinticuatro cartas no se comparan, se hojean. Así que la
página donde se ven las veinticuatro juntas es la baraja.

## 👤 Humanos — las doce, y la raza queda cerrada

**Ya no falta ninguna** *(31 de agosto de 2026)*. Los cuatro héroes desde el 25 de
agosto —el 🏹 Arquero fue el último y con él la clase se juzga entera— y las ocho
unidades en cuatro tandas: Miliciano, Arquero, Caballero y Mago el día 26,
🐎 Caballería y 🦅 Grifo el 27, ✝️ Paladín el 28 y 🐉 Dragón dorado el 31. Los
cuatro primeros van en el mismo camino, con la misma cerca y el mismo
castillo al fondo. Esa continuidad de escenario entre unidades no estaba pedida
en ningún sitio y conviene decidir si se queda: hace que las doce se lean como un
ejército y no como doce retratos sueltos, pero también significa que la
progresión de tier no cambia de sitio.

**Y Enanos contesta a esa duda, en parte.** Sus doce comparten también el
escenario —galería de mina, forja, arco de piedra tallada—, pero ahí sí estaba
pedido: es el campo `Fondo:` de la identidad de raza en `prompts/enanos.md`, o
sea que la continuidad es **de raza y a propósito**. Lo que eso deja abierto no es
si se quiere continuidad, sino cuánta: en Enanos el escenario cambia de sitio
dentro de la mina —el 🔨 Herrero está en la forja, el 🔫 Mosquetero en una almena,
el 🗿 Gólem en una sala de columnas— y aun así las doce se leen como un ejército.
La cerca y el castillo de Humanos son más literales que eso.

**Y la tanda del 27 aprieta esa duda en vez de aflojarla, justo por donde Enanos
la había dejado.** La 🐎 Caballería va por el mismo camino de tierra, con la misma
cerca de madera a la izquierda y el mismo castillo a la derecha: es el quinto
sujeto en el mismo sitio. Y el 🦅 Grifo —que por prompt tenía que estar en el
cielo— sale **sobre ese mismo castillo, visto desde arriba**, con sus estandartes
azul y oro. O sea que la continuidad de Humanos ya no es un fondo repetido: es
**un lugar**, y la progresión lo recorre (el jinete sube el camino, el grifo
sobrevuela las almenas). Es más continuidad que la de Enanos, no menos — y sigue
sin estar pedida en ninguna línea del prompt, que es lo que hay que resolver:
Enanos la tiene porque su ficha de raza la pide, y Humanos la tiene porque el
generador la repite solo.

**Y el ✝️ Paladín del 28 la cierra: son siete de siete.** Vuelve al suelo, con el
mismo castillo a la derecha —el mismo del Grifo y de la Caballería, con sus
estandartes azul y oro—, el mismo río, el mismo camino de tierra pisada y una
torre de piedra a la izquierda de la que cuelga su estandarte. Ya no hay una sola
unidad de Humanos que esté en otro sitio, y el escenario ha aguantado siete
tiers, dos tandas y un sujeto volador sin que nadie lo pidiera. A estas alturas
**la decisión ya no es si se acepta la continuidad, es si se escribe**: si es
buena, va al campo `Fondo:` de `prompts/humanos.md` como en Enanos y deja de
depender de que el generador la repita; si no, hay que romperla a mano en el
prompt de cada tier, porque sola no se va a romper.

**Y el 🐉 Dragón dorado del 31 la deja en ocho de ocho, con un dato que cambia la
pregunta.** Es el mismo castillo otra vez —estandartes azul y oro, el mismo río y
el mismo puente—, pero ahora **muy pequeño y abajo a la izquierda**, porque aquí
el castillo no es fondo: es **el ancla de escala** que el prompt pide («piedra
clara de castillo muy pequeña abajo, que es lo que da la escala»). O sea que la
única línea de estas ocho que sí menciona el escenario **pide un castillo y no
pide ESE castillo**, y el generador ha vuelto al mismo de todas formas. Eso
resuelve media duda: la continuidad no depende de que el prompt calle —aguanta
incluso cuando el prompt habla— así que escribirla en el campo `Fondo:` no es
domesticar al generador, es **dejar dicho lo que ya está pasando**. La otra media
sigue igual: si algún día se quiere romper, hay que romperla a mano.

Con la tanda del 26 pasaron dos cosas en el laboratorio: **se retiró el último
relleno prestado de v2** (el Arquero y el Mago unidad tiraban de las cartas de
clase del juego anterior; ya no queda ninguna imagen de v2 en un lab de V3), y
las unidades sin arte bajaron de siete a cuatro. Con la del 27 bajaron a dos, con
la del 28 a una y con la del 31 a **ninguna**.

### Lo que trae la tanda del 27, y son dos casos nuevos

Las dos son **1060×1484**, el 5:7 exacto, así que el lienzo vuelve a no fallar
—van cuatro tandas seguidas pidiéndose bien—. Lo que traen es otra cosa: son los
**dos primeros sujetos que no son un humano de pie**, y cada uno destapa una cara
distinta de la norma de encuadre.

1. **La 🐎 Caballería es el primer sujeto ANCHO, y ahí la norma funcionó.**
   §"Encuadre" dice que un sujeto que ocupa más ancho que alto se resuelve
   **alejando la cámara, no recortando**, y es lo que hizo: caballo y jinete
   entran completos, las cuatro patas dentro, y la figura sale más pequeña que
   los sujetos a pie — que es el precio que esa norma acepta por escrito. Es la
   primera vez que una línea del encuadre se pide y se cumple.

   Falla en dos sitios, y ninguno es el ancho. **Los cascos caen al 88%** —la
   peor cifra de Humanos hasta que llegó el ✝️ Paladín al día siguiente—, así que
   el panel de la J le come las patas — el mismo
   fallo de siempre. Y **la punta de la lanza acaba al 1% del alto**, pegada al
   filo: no está cortada, pero §"Encuadre" pide que nada importante toque el
   borde porque el marco tapa los bordes, y aquí el remate del arma se apoya
   justo ahí. Al lado de eso, un desvío del prompt que conviene anotar aunque no
   sea del encuadre: pedía **lanza en carga y galope**, y salió al paso con la
   lanza vertical y un estandarte atado — «DEBE VERSE: que la lanza está en
   carga, no en reposo» es la línea que no se cumplió.

2. **El 🦅 Grifo es el primer sujeto VOLADOR, y es el que mejor encuadre tiene de
   los veinticuatro después del ✝️ Sacerdote — pero no por mérito del prompt.** Su
   punto más bajo es una zarpa trasera al **77%**, cuando los otros veintitrés
   están entre el 78 y el 91, y el cuarto de abajo lo llena el castillo, o sea
   **fondo**, que es exactamente lo que §"Encuadre" reserva ahí. El motivo es que
   **vuela**: su prompt no pide «suelo por delante y por detrás de los pies» sino
   «cielo abierto sobre piedra clara de castillo abajo», así que el ancla pone
   algo **en** el cuarto de abajo y el sujeto queda por encima. Es la mejor pista
   que hay del arreglo que pide el punto 3 de §"Lo que sigue sin cuadrar": una
   línea que diga **qué ocupa el cuarto inferior** sí mueve la figura; una que
   pida que haya suelo, no.

   Y a cambio falla por donde su propio prompt avisaba en mayúsculas. **Las alas
   se salen del cuadro** —la derecha por arriba, la izquierda por el lado— y las
   alas eran su rasgo obligatorio: «las dos alas completas hasta la punta;
   aléjate lo que haga falta; un ala cortada por el borde arruina la lectura». O
   sea que en la misma tanda la instrucción de alejar la cámara la obedeció el
   sujeto ancho de tierra y **no** el que la tenía escrita dos veces. No hay aire
   lateral ninguno: la envergadura ocupa los 1060 px de lado a lado.

### La tanda del 28: el ✝️ Paladín, y es el peor encuadre de los veinticuatro

Un archivo solo, el tier 7, **1060×1484**: el 5:7 exacto por quinta tanda
seguida, así que del lienzo ya no hay nada que decir. De lo demás sí, y no es
bueno — pero conviene leerlo con el aviso de arriba delante: **no es deuda que
arreglar**, es lo que la tanda buena tendrá que corregir.

1. **La bota de delante cae al 91% y es la peor cifra del repo.** El techo
   anterior eran tres archivos al 89% (🔫 Mosquetero, ⛰️ Coloso y 🔯 Maestro de
   runas); este los pasa. *(El 🐉 Dragón dorado del 31 empata la cifra, pero no el
   fallo: allí lo que llega al 91% es la cola y el cuerpo para al 84%. Este sigue
   siendo el peor encuadre **de un cuerpo**.)* Y no es un pie que asoma: la figura entera va del
   **10%** —la punta del penacho— al **91,5%**, o sea que **ocupa el 81% del alto
   cuando §"Encuadre" pide un 60%**. Eso ya no es un encuadre que se pasa de la
   raya por abajo, es **otro plano**: no es plano general con la figura y su
   entorno, es plano entero con el cuerpo llenando el cuadro, que es justo lo que
   esa sección prohíbe con nombre y apellido. En la carta montada el panel del
   pie no le come las piernas, **le come las botas enteras**.

2. **Repite el fallo de borde de la 🐎 Caballería, girado 90°.** Allí era la punta
   de la lanza al 1% del alto; aquí es **la cabeza del mazo al 2% del ancho**, con
   su pincho lateral pegado al filo izquierdo. No está cortada, pero el marco tapa
   los bordes, y el mazo es el arma del sujeto. Es la segunda tanda seguida en la
   que el remate del arma se apoya en el filo, y **son las dos únicas veces que ha
   pasado**: no hay línea del prompt que hable del arma, solo la del aire lateral
   —«el hueco de un brazo a cada lado»— que aquí se cumple para el cuerpo y no
   para lo que el cuerpo lleva en la mano.

3. **Y lo que sí acertó: el aire de arriba, por primera vez de forma clara.** Del
   borde superior a la coronilla del yelmo hay un 12% del alto, y la cabeza mide
   unos 14 — o sea **casi la cabeza entera que pide §"Encuadre"**, con el penacho
   metiéndose en ese hueco pero sin llegar al filo. La imagen no está aplastada
   contra el techo; está descolgada hacia abajo. Ahí está el diagnóstico completo
   de este archivo: **la figura no es demasiado alta por arriba, es que la cámara
   está demasiado cerca**, y el sobrante se le va todo por los pies.

### La tanda del 31: el 🐉 Dragón dorado, y con él se cierra la raza piloto

Un archivo solo, el tier 8, **1060×1484**: el 5:7 exacto por sexta tanda seguida.
Es el primer sujeto que **no es humano ni humanoide** de esta raza —la 🐎
Caballería y el 🦅 Grifo eran monturas, esto es la criatura sola— y el que tenía
el bloque de prompt más exigente de las doce, porque le pedía tres cosas a la vez:
ser enorme, entrar entero y dar la escala con el fondo. **Cumple lo que su propio
bloque controla y falla lo mismo que fallan los otros veintitrés.**

1. **Lo que cumplió, y es casi todo el bloque.** Escama dorada en placas grandes,
   que es la excepción de la raza (aquí el oro deja de ser acento y es el cuerpo);
   bestia **antigua** y no joya —escamas partidas, tajos rojos entre las placas,
   cicatrices viejas—; alas desplegadas; el fuego en las fauces, saliendo en
   diagonal; la pose alzada sobre las traseras con el cuello arqueado en el
   momento previo al aliento; las cuatro garras a la vista y la cola entera dentro
   del cuadro. Y **el ancla de escala funcionó**: el castillo sale diminuto abajo,
   y al lado del dragón se lee lo que se tenía que leer, que esto aplasta a los
   siete tiers anteriores.

2. **Pero el ancla de escala cae donde el ⛰️ Coloso avisó que caería.** El castillo
   ocupa de la banda del **~70% para abajo**, o sea dentro del cuarto que
   §"Encuadre" reserva al rótulo, así que en la carta montada el panel del pie se
   come la ciudad, la muralla y el puente — que es justo donde se compara el
   tamaño. Se salva **a medias y por un motivo que conviene apuntar**: las torres
   y las agujas suben por encima del 75% y esas sí sobreviven al panel, mientras
   que las figuras diminutas del Coloso caían enteras entre el 88% y el 92% y no
   se salvaba ninguna. O sea que la receta escrita aquí el 26 de agosto —para un
   sujeto enorme, **el ancla de escala va al lado o en arquitectura alta, nunca a
   los pies**— acaba de pasar su segunda prueba, y esta vez a favor: lo que
   sobrevive del ancla es exactamente lo que es alto. Ya no es un pronóstico de un
   caso; son dos sujetos enormes y los dos dicen lo mismo.

3. **El encuadre falla por donde no había fallado nunca: por un apéndice.** Las
   garras delanteras acaban al **~81%** y las traseras al **~84%**, o sea que el
   cuerpo para **antes que el de cualquier sujeto a pie de las dos razas** (que
   caen entre el 82% y el 91%). Lo que baja al **~91%** es **la cola**, que cuelga
   por delante del castillo. Y por arriba pasa lo contrario que en el ✝️ Paladín:
   la punta del ala derecha llega al **5%** y los cuernos al **9%**, así que la
   figura entera va del **5% al 91%** y **ocupa el 86% del alto** donde la norma
   pide un 60% — más que el 81% del Paladín, o sea el nuevo techo del repo, pero
   por envergadura y cola y no por estar la cámara encima.

   Es un fallo distinto y pide un arreglo distinto, y por eso conviene no
   apuntarlo como «otro que se pasa del 72%». **Aquí el ancla de suelo del
   preámbulo hizo su trabajo**: este prompt no pide que se vea suelo, pide qué
   ocupa el cuarto de abajo —el castillo pequeño—, igual que el del 🦅 Grifo. Y los
   dos únicos archivos de las dos razas cuyo prompt reclama el cuarto inferior
   para otra cosa son **los dos mejores encuadres** que hay (Grifo al 77%, este al
   81% de garras), Sacerdote aparte, que acierta de rebote por ser apaisado. La
   línea propuesta en §"Lo que sigue sin cuadrar" punto 3 lleva ya dos pruebas a
   favor.

4. **Las alas se salen por los dos lados, y con el 🦅 Grifo son dos de dos.** El
   ala izquierda está cortada por el filo desde el ~19% al ~55% del alto y la
   derecha desde el ~17% al ~49%: no es que la envergadura llene el lienzo, es que
   **no cabe**. Y esta vez el propio bloque lo pedía con mayúsculas —«La criatura
   ENTERA dentro del cuadro —alas completas, cola, las cuatro garras—», más el
   «aléjate» de la línea de escala—, exactamente como el del Grifo lo pedía dos
   veces. **Los dos sujetos con envergadura del juego han salido con las alas
   cortadas**, mientras que el sujeto ancho de tierra (🐎 Caballería) sí obedeció
   la misma instrucción de alejar la cámara. Ya no es una anécdota de un archivo:
   es que «aléjate» funciona contra la anchura de un caballo y no contra la de un
   ala.

5. **Y con esto son tres tandas seguidas en las que lo que se sale del cuadro es
   el REMATE, no el cuerpo.** La punta de la lanza al 1% del alto (Caballería, día
   27), la cabeza del mazo al 2% del ancho (Paladín, día 28) y aquí las alas
   cortadas y la cola al 91% (día 31). Las tres veces el cuerpo está donde el
   prompt lo puso y lo que rompe el encuadre es lo que **sale** de él —arma, ala,
   cola—, y las tres veces por el mismo motivo: **el encuadre del preámbulo solo
   habla del cuerpo**. Sus cuatro filas de aire miden desde la coronilla, los pies
   y los costados de la figura, y ninguna dice que un arma o un apéndice cuenten
   como figura. Es la **tercera línea de prompt** que hay que tocar antes de la
   tercera raza, junto al ancla de suelo y al ancla de escala, y las tres son de
   `preambulo.md`.

Lo que **no** trae, otra vez: ni `.webp` ni recorte. Es un `.png` de **2,70 MB**,
y con él 👤 Humanos pesa **30,1 MB** — la misma cifra que ⛏️ Enanos, así que la
proyección de ~30 MB por raza deja de apoyarse en una sola muestra.

## ⛏️ Enanos — la primera raza dibujada entera

Doce archivos de una vez, la noche del 26 de agosto de 2026, con los slugs que ya
pedía `prompts/enanos.md` §"Al terminar". Cuatro cosas que deja esa tanda, y la
primera es la buena:

1. **El lienzo dejó de fallar.** Las doce son **verticales**: ni una apaisada,
   cuando en Humanos lo eran tres de ocho. Siete están en el 5:7 exacto
   (1060×1484) y cinco en 2:3 (1024×1536), que la norma autoriza. Es el primer
   lote donde el lienzo no es un pendiente, y es útil saber **por qué se partió en
   dos**: los tiers 1 a 5 salieron en 2:3 y los cuatro héroes y los tiers 6, 7 y 8
   en 5:7, o sea que la herramienta cambió de proporción a mitad de la sesión sin
   que cambiara el prompt.

   **Y lo que cuesta el 2:3 en la carta ya está medido, en la J montada**: el
   hueco de arte es `cover` sobre 300×420, así que un 1024×1536 se escala por la
   anchura, sale a 300×450 y se van **30px de alto, el 6,7%** — 3,3% arriba y
   3,3% abajo. Un 5:7 entra exacto y no se va nada. Comparado con el 49% de
   anchura que se llevaba un apaisado, el 2:3 es gratis; lo único que hay que
   saber es que **recorta por donde duele** (se come un poco del aire de la
   cabeza y un poco del suelo de los pies), así que empeora el encuadre en lugar
   de arreglarlo: unos pies medidos al 85% del archivo se ven al ~87% de la carta.
2. **El encuadre falló en las doce, y eso confirma el diagnóstico.** Los pies caen
   entre el **82% y el 89%** del alto cuando el tope son 72 — la misma banda que
   Humanos, en una raza distinta, con prompts distintos y en una sola sesión. Ya
   no es una tirada mala: es **el prompt pidiendo el aire de abajo con un ancla que
   no lo mide** («suelo visible por delante y por detrás de los pies», que se
   cumple con dos dedos de suelo). Lo que hace falta es lo que dice el punto 3 del
   bloque de abajo, y ahora hay veinte archivos de evidencia en vez de ocho.
3. **Los dos constructos salieron bien, y el ⛰️ Coloso destapa un fallo de la
   propia especificación.** El 🗿 Gólem no tiene cara, ni ropa, ni barba, como se
   pedía. Y el Coloso trae **figuras diminutas a sus pies** que le dan la escala:
   es el primer sujeto del juego donde el ancla de escala del prompt funciona, y el
   único donde «dónde acaban los pies» es ambiguo porque hay enanos dibujados más
   abajo que sus botas (la medida de la tabla es la del Coloso, no la de esos
   enanos).

   **Pero en la carta montada esas figuras NO SE VEN**, comprobado en la J: caen
   entre el 88% y el 92% del alto, o sea dentro del cuarto que §"Encuadre" reserva
   al rótulo, y el panel del pie se las come enteras. La carta enseña un armazón
   grande y **nada dice que sea colosal**. Eso no es un fallo de la imagen ni del
   marco: es que **dos líneas de la especificación se contradicen**. §"Encuadre"
   dice que del 75% hacia abajo solo puede haber suelo; el prompt del Coloso pide
   «figuras diminutas **abajo** que dan la escala». Para los sujetos enormes —el
   Coloso aquí, el 🐉 Dragón dorado de Humanos— el ancla de escala tiene que estar
   **al lado o en la arquitectura, nunca a los pies**. Se arregla en el prompt, y es
   la segunda línea que hay que tocar antes de la tercera raza.

   **Y el dragón del 31 de agosto lo confirma, con el matiz que faltaba** (ver la
   tanda del 31, arriba): su ancla también cae del 70% para abajo y el panel se
   come la ciudad, pero **las torres suben por encima del 75% y esas se ven**. Los
   dos sujetos enormes del juego dicen entonces lo mismo y afinan la receta: el
   problema no es que el ancla esté abajo, es que esté **a ras de suelo**. En
   arquitectura alta sobrevive.
4. **El arte distingue lo que el marco no podía.** El ⚙️ Ingeniero es héroe **y**
   unidad de tier 4 con el mismo nombre, el mismo emoji y el mismo tipo de daño
   —una de las 25 colisiones de `status.md`—, y en la carta lo único que los
   separaba era el rótulo «Héroe» contra «Tier 4». Dibujados ya no: el héroe lleva
   una **lupa de latón sobre un ojo** y está armando una trampa de dientes en el
   suelo; la unidad lleva **gafas de latón subidas a la frente** y está comprobando
   la ballesta en un banco de trabajo. **No arregla la colisión** —el catálogo
   sigue con dos cartas llamadas igual, y eso se decide en `razas.md`— pero sí
   quita el motivo por el que la colisión se veía en el marco. Conviene tenerlo
   claro antes de gastar diseño de marco en un problema que era de relleno.

Lo que **no** trae esa tanda: ni un `.webp` y ni un recorte. Los doce son `.png`
de ~2,7 MB, así que el arte provisional del repo pasó de ~20 MB a **~52 MB** —y
con las tres tandas de Humanos del 27, el 28 y el 31 va por **~60 MB de razas**
(30,1 de Humanos y 30,1 de Enanos, **dos razas completas con el mismo peso**),
que con los 26 MB de pictogramas, los 17 de estandartes y el marco son
**~106 MB** de `public/assets/v3/` entero.

## Lo que sigue sin cuadrar, de las veinticuatro

> **Dos cosas siguen sin cuadrar con lo que dice este mismo documento**, y con
> Enanos dentro una de ellas cambió de tamaño y la otra de naturaleza. Con el arte
> en provisional (aviso de arriba) ninguna es urgente, pero hay que cerrarlas
> antes de que lleguen las 110 restantes y se copie el criterio:
>
> 1. ~~**La ruta.**~~ **Cerrada** el 21 de agosto de 2026: estaban en
>    `human/heroes/` con nombre en inglés y ya están en `races/humanos/` con el
>    slug español que manda §"Nombre de archivo". Se cerró con tres archivos
>    dentro porque con 132 cuesta 44 veces más. **Enanos entró ya bien**, sin
>    tocar nada: `races/enanos/` y `races/enanos/units/` con el slug español, que
>    es lo que el archivo de prompts pedía. La norma funciona cuando se escribe
>    antes de generar.
> 2. **El formato sigue abierto, y ya no es una advertencia: son ~60 MB.**
>    §"Nombre de archivo" pide `.webp` y los veinticuatro son `.png` de ~2,4–2,7 MB.
>    Con ocho eran ~20 MB y el argumento de «no convertir lo que se va a tirar»
>    salía gratis; con veinticuatro, y a **~30 MB por raza completa** —y esto ya no
>    es una muestra, son **dos razas enteras y las dos pesan 30,1**—, las once razas
>    proyectan **~330 MB de arte provisional** en el repo, más lo que ya pesan los
>    pictogramas y los estandartes. El argumento sigue siendo válido —al archivo le
>    queda vuelta por el encuadre (punto 3), así que le queda también la
>    conversión— pero la cuenta ya no es cómoda: **la decisión que hay que tomar es
>    en la tercera raza, no en la undécima**, y es si el provisional entra en
>    `.webp` desde ya aunque se tire.
> 3. **El ENCUADRE es el pendiente de verdad, y con Enanos pasó de ser «de casi
>    todos» a ser el patrón** *(medido el 26 de agosto de 2026, tabla arriba)*.
>    Hasta esa fecha aquí solo se hablaba del lienzo, y por eso parecía un problema
>    de tres archivos. Con las guías puestas encima resulta que **veintitrés de los
>    veinticuatro** ponen los pies por debajo del 72% que manda §"Encuadre" —entre el
>    77% y el 91%—, así que la figura invade el cuarto reservado al rótulo y el
>    panel de la carta le come las piernas. **El único que cumple sigue siendo el
>    ✝️ Sacerdote**, y cumple de rebote, porque su lienzo apaisado no da de sí para
>    una figura más alta: o sea que en veinticuatro archivos **no hay ni uno que
>    acierte el encuadre a propósito**.
>
>    **Y el 28 de agosto de 2026 la banda se abrió por arriba en vez de cerrarse.**
>    El ✝️ Paladín pone la bota de delante en el **91%** y la figura entera en el
>    **81% del alto**, así que el tope ya no es el 89% de tres archivos: es un
>    archivo que no se pasa de la norma de encuadre, **se sale del plano** que esa
>    norma nombra. Es útil porque descarta la última lectura optimista que quedaba
>    —que esto era una banda estrecha alrededor del 85% y bastaba con empujarla
>    trece puntos—: sin una línea que fije el pie, cada tanda cae donde le toca.
>
>    **Y el 31 de agosto la banda no se movió, pero apareció una avería nueva.** El
>    🐉 Dragón dorado marca **91%** como el Paladín, y sin embargo su cuerpo para
>    mucho antes: las garras acaban al 81–84%, mejor que cualquier sujeto a pie de
>    las dos razas, y lo que baja al 91% es **la cola**. O sea que hay dos fallos
>    distintos debajo de la misma cifra —la cámara demasiado cerca (Paladín) y el
>    apéndice que nadie encuadra (dragón)— y solo uno lo arregla el ancla de suelo.
>    Ver §"La tanda del 31" punto 5: van tres tandas seguidas en las que lo que se
>    sale del cuadro es el **remate** y no el cuerpo.
>
>    **Y el 27 de agosto de 2026 apareció el primero que casi acierta, y dice por
>    qué.** El 🦅 Grifo se queda en el **77%** —el mejor de los veintitrés que
>    fallan, y el único cuyo cuarto de abajo es fondo y no cuerpo— porque **vuela**:
>    su prompt cambia el ancla de suelo por «cielo abierto sobre piedra clara de
>    castillo **abajo**», o sea que en vez de pedir que haya suelo, dice **qué
>    ocupa el cuarto inferior**. Eso es, casi con las mismas palabras, la línea que
>    aquí abajo se propone para `preambulo.md`, y ahora hay una imagen que enseña
>    que funciona. No sirve tal cual —un sujeto de tierra no puede flotar— pero sí
>    confirma la forma del arreglo: **el ancla tiene que reclamar el cuarto de
>    abajo para otra cosa, no pedir que se vea suelo**.
>
>    Y con Enanos se cae la lectura que se hacía de esto. Con ocho archivos parecía
>    haber una relación perversa —«los cinco de lienzo correcto son los cinco
>    peores de encuadre»—, y con veinticuatro se ve que **no hay ninguna relación**:
>    Enanos tiene doce lienzos correctos y los doce fallan igual, en la misma banda
>    del 82 al 89%, con lienzo 5:7 y con lienzo 2:3 sin diferencia. El lienzo y el
>    encuadre no se compensan; simplemente uno ya se pide bien y el otro no.
>
>    Lo que sí está **resuelto** de las vueltas anteriores: el reparto de cuerpos
>    (el Sacerdote ya es un hombre mayor y grueso, no un joven esbelto; y los doce
>    enanos leen mayores, anchos y feos, que es lo que su ficha pedía) y la
>    jerarquía de fondo. Las normas están en §"Lienzo y formato" y §"Encuadre"
>    aquí, el reparto en
>    [`sujetos.md`](../../../knowledge/v3/races-concept/sujetos.md#identidad-de-raza)
>    y el fondo en
>    [`style-guide.md`](../../../knowledge/v3/art-direction/style-guide.md#16-fondos)
>    §16.
>
>    **Y la pista de por qué falla siempre por el mismo lado ya no es una pista.**
>    El aviso de §"Encuadre" lo decía: un modelo de imagen no mide porcentajes, así
>    que el aire se pide con anclas visuales. Las cuatro filas de aire están en el
>    prompt, pero la de **aire abajo** dice «suelo visible por delante y por detrás
>    de los pies», y eso se cumple —hay suelo— sin que la figura suba: el ancla no
>    controla CUÁNTO suelo. Enanos lo demuestra, porque son doce imágenes nuevas,
>    de otra raza, con otros prompts y en una sola sesión, y las doce caen en la
>    misma banda: **no es la tirada, es la línea**. La que falta es una que fije el
>    pie, del tipo «el suelo por delante de los pies ocupa la cuarta parte de abajo
>    de la imagen». Cambiar esa línea en
>    [`preambulo.md`](../../../knowledge/v3/races-concept/prompts/preambulo.md), que
>    es donde vive el encuadre común a las once razas, es más barato que volver a
>    tirar veinticuatro veces — y sobre todo es lo que hay que hacer **antes** de la
>    tercera raza, no después. **El 🦅 Grifo es la prueba de que esa línea
>    funciona**, y desde el 31 de agosto no está solo: los **dos** archivos cuyo
>    prompt dice qué ocupa el cuarto de abajo en vez de pedir que haya suelo —el
>    Grifo con su cielo sobre el castillo y el 🐉 Dragón dorado con su castillo
>    diminuto— son los dos mejores encuadres de las dos razas, 77% y 81% de garras,
>    contra la banda del 82 al 91% de todos los demás. Y el ✝️ Paladín del 28 es la
>    prueba de lo contrario, con el mismo prompt de suelo y el peor resultado del
>    repo: **la línea sin cambiar sigue devolviendo lo que devolvía, y ya van
>    veintitrés veces**.
>
>    **Lo que el dragón añade es que esa línea no basta**, porque arregla el cuerpo
>    y no el resto: con las garras al 81% el archivo sigue marcando 91% por la
>    cola. Hacen falta las dos cosas — la que reclama el cuarto de abajo y la que
>    diga que **el arma, el ala y la cola cuentan como figura**.
>
> **No se recortan a mano.** Recortar un apaisado a 5:7 tira justo el aire
> lateral que pide §"Encuadre", y dejarlos como están tiene un uso: en el lab,
> pasar del Guerrero vertical al Sacerdote apaisado enseña la diferencia de un
> vistazo. Mientras tanto los apaisados sirven para juzgar el marco, no el arte.
>
> **Y ya se ve en la carta montada, que es la prueba que faltaba** *(25 de agosto
> de 2026, medido en el lab)*. El hueco de arte es `cover` sobre 300×420, así que
> un 1484×1060 se escala por el lado corto: sale a **588×420** y se van **144px
> por cada lado, el 49% de la anchura**. La imagen no se sale de la carta —la
> caja del `<img>` mide exactamente lo que la carta, comprobado— pero la FIGURA
> sale al doble del tamaño que supone §"Encuadre", y entonces el cuarto de abajo
> que esa norma reserva para el rótulo deja de ser aire y pasa a ser piernas: el
> Miliciano queda cortado por el muslo y el Arquero por la cintura. **Con los
> héroes verticales no se veía** porque el Guerrero y el Mago entran sin recortar
> nada. Dato de paso para la decisión de marco, no del arte: el panel de la G y
> la H se come más ilustración que la placa de la E, y en un apaisado la
> diferencia se nota a simple vista.
>
> ⚠️ **Y esa misma tarde apareció un motivo aparente para NO regenerarlas
> todavía, que al día siguiente resultó ser falso. Se deja escrito con la
> corrección detrás, porque el error es instructivo.** Lo que se anotó fue: el
> boceto **I · Retablo** mete el arte en una **ventana de 252×220**, o sea
> apaisada, y ahí un vertical 5:7 pierde el **38% del alto** contra el **18% del
> ancho** que pierde un apaisado — luego, si ganaba ese boceto, los tres archivos
> «mal encuadrados» pasaban a ser los buenos y había que esperar a elegir marco
> antes de regenerar.
>
> **El 38% es correcto; la conclusión no.** Lo que faltaba era mirar QUÉ 38% se
> tira. Echada la cuenta, la ventana de la I enseña la banda que va del **9,8% al
> 72,1%** del alto de la fuente — y eso es, punto por punto, la banda que
> §"Encuadre" reserva para la figura (12% → 72%). **La ventana de la I no pelea
> con la norma: la ventana de la I ES la norma.** Con un archivo que la cumpla, la
> I enseña la figura entera con un dedo de aire y la H la enseña con aire de
> sobra: **el mismo 5:7 vertical vale para los dos bocetos**.
>
> Si el Guerrero y el Mago salen cortados en la I no es por el boceto, es porque
> **esos dos archivos tampoco cumplen la norma**: ponen los pies al 86% y al 89%
> cuando el tope son 72. La tabla de arriba lo dice de los veinticuatro.
>
> Aquí había además una explicación de consuelo —«los cinco “buenos” de lienzo son
> los peores de encuadre, los apaisados aciertan más porque un lienzo más bajo no
> da para meter una figura tan alta»— y **con Enanos deja de sostenerse**: doce
> lienzos verticales correctos, doce encuadres fuera, y sin diferencia entre el 5:7
> y el 2:3. El lienzo no estaba tapando el encuadre. Eran dos cosas sueltas, y una
> ya se pide bien.
>
> **Lo que queda entonces:** regenerar no está bloqueado por la decisión de
> marco, y tampoco es una tarea pendiente — es lo que pasará solo cuando el
> generador empiece a obedecer. El dato que se guarda de todo esto es el
> diagnóstico, y Enanos lo ha afinado: el problema **nunca fue el lienzo** —tres
> apaisados de veinticuatro, y en las cuatro tandas nuevas ninguno—, es el
> **encuadre de veintitrés de veinticuatro**, y el único que cae dentro de la norma es el
> ✝️ Sacerdote, que encima es apaisado y acierta de rebote. Cuando llegue la tanda
> buena se arreglan las dos cosas —lienzo y encuadre— en la misma vuelta, y con
> ella entra el `.webp`.

Qué generar y con qué especificación (sujetos, encuadre, plantilla de prompt):
[`../../../knowledge/v3/art-direction/illustrations.md`](../../../knowledge/v3/art-direction/illustrations.md),
y la biblia visual que gobierna todo el arte del juego,
[`../../../knowledge/v3/art-direction/style-guide.md`](../../../knowledge/v3/art-direction/style-guide.md).

## Qué va aquí

Lo que se sirva al jugador en la URL `/assets/v3/…`: ilustraciones de carta,
retratos, sprites, modelos propios. **No** los moodboards ni las referencias
—eso vive en [`../../concepts/`](../../concepts/)— ni los modelos prestados de
prueba, que se quedan con la versión anterior en
[`../v2/models/`](../v2/models/README.md) hasta que haya propios.

**Ni las láminas de comparación de un concepto**, aunque enseñen piezas que
algún día sí se sirvan. Las dos de iconos —la dirección elegida y la Opción 3—
entraron aquí sueltas el 26 de agosto de 2026 y salieron el mismo día a
[`knowledge/v3/icon-concept/imgs/`](../../../knowledge/v3/icon-concept/README.md),
junto a su análisis: es la misma excepción que ya tienen los conceptos de marco
en `knowledge/v3/card-concept/imgs/`. La regla corta: **si no tiene una URL que
el juego pida, no vive aquí.**

### `icons/` — los pictogramas, y su norma no es la de las ilustraciones

Los 47 pictogramas —36 siluetas base de Habilidad y Característica, más 11
emblemas de raza— tienen desde el **26 de agosto de 2026** dirección de dibujo
cerrada (relieve de metal dorado, monocromo:
[`knowledge/v3/icon-concept/icons.md`](../../../knowledge/v3/icon-concept/icons.md)
§5) y **21 de los 47 entregados** en dos tandas: los diez primeros el mismo 26
de agosto —las ocho Habilidades y dos Tipos de daño—, y **los once emblemas de
raza el 27 de agosto de 2026**. Lo que falta es el grueso de Características,
que sigue bloqueado por el aro del medallón.

| Carpeta | Qué lleva | Hoy |
|---|---|---|
| `icons/abilities/` | Las 8 Habilidades | **Las 8** — `vida`, `ataque`, `defensa`, `resistencia-magica`, `precision`, `suerte`, `iniciativa`, `movimiento` |
| `icons/damage/` | Los 3 Tipos de daño, que ocupan el sitio del icono de Ataque | **2 de 3** — `a-distancia` y `magico`. **Falta `cuerpo-a-cuerpo`**, y mientras tanto el laboratorio pinta `abilities/ataque.png` en su hueco (suplente, ver abajo) |
| `icons/traits/` | Las 41 Características | Vacía, sin crear |
| `icons/races/` | Los 11 emblemas de raza | **Los 11** — `humanos`, `enanos`, `no-muertos`, `demonios-infernales`, `elfos`, `orkos`, `feericos`, `draconidos`, `hombres-rata`, `constructos`, `abisales`. Entregados el 27 de agosto de 2026; **tres se sustituyeron el 29** —`humanos`, `no-muertos` y `hombres-rata`—, con dos avisos abajo |
| `icons/races/old/` | Los tres emblemas **descartados** | `humanos` (gonfalón), `no-muertos` (costillar) y `hombres-rata` (vial), los del 27. **No se sirven**: nada los referencia y no cuentan en el peso de `icons/` |

**Van en subcarpeta y no sueltos por el mismo motivo que `races/<raza>/units/`:
hay colisiones de nombre.** `defensa` es una Habilidad *y* —como *Resistente al
daño físico*— una Característica; `fuego` es Característica *y* emblema de raza.
Aplanarlas obligaría a inventar sufijos.

**El 🗡️ Cuerpo a cuerpo lleva suplente, y el suplente no cierra el hueco.** Por
decisión de Dario el laboratorio pinta `abilities/ataque.png` donde iría
`damage/cuerpo-a-cuerpo.png`, para que la fila de ocho se vea entera de oro
mientras se juzga — es el tipo de daño de **70 de las 132 fichas**, así que en
emoji ensuciaba la mayoría de las cartas. Pero es **otro dibujo** (espada ancha
contra la daga que pedía el concepto) y mientras esté ahí la carta dice «Ataque»
donde tiene que decir «Cuerpo a cuerpo». El archivo sigue faltando y sigue
contado como pendiente.

**La extensión es `.png`, no `.webp`, y no es descuido.** La tabla de *Lienzo y
formato* de más abajo manda `.webp` para **ilustración**: a sangre, sin
transparencia, una foto. Un pictograma es lo contrario —transparencia, aristas
limpias, plano de color— y su norma se decide aquí por separado el día que se
mire; hasta entonces entran como llegan.

**Lo que sí está medido de la primera tanda**, y son tres cosas que hay que
arreglar antes de que estos archivos entren en una carta:

1. **Pesan doce megas.** Diez PNG de 1254×1254 px, entre 0,65 y 1,8 MB cada uno,
   para dibujos que se pintan **a 30px**. Es el mismo problema que ya tienen los
   `.png` de las razas, pero peor de proporción: allí el archivo grande al menos
   guarda detalle que la carta usa.
2. **El encuadre no está normalizado.** Ninguno está recortado en el filo —eso
   se comprobó—, pero la caja del glifo ocupa entre el **84 % y el 97 %** del
   lienzo y no va centrada: 🏹 *A distancia* deja 150px de aire a la izquierda y
   26 a la derecha, ⚡ *Iniciativa* 79 arriba y 102 abajo. A 30px eso son dos o
   tres píxeles de salto **en una fila de ocho que se mira entera**. Hace falta
   una pasada de recorte y relleno a caja común antes de montarlos.
3. **El contraste va aceptable en los dos fondos y bien en ninguno.** Medido
   sobre la luminancia media del relleno —orientativo para un pictograma, que se
   lee por el canto y no como texto—, el cuerpo del glifo se queda entre **2,4 y
   4,6** contra vitela clara y contra metal oscuro, sin fallar en ninguno de los
   dos. Los extremos son ❤️ *Vida* y ⚡ *Iniciativa*, los más claros, que flojean
   sobre vitela; y 🔮 *Res. mágica* y 🏹 *A distancia*, los más oscuros, que
   flojean sobre metal. Es el precio conocido de un solo dorado medio para los
   dos fondos, y **lo que los salva en el fondo claro es el contorno oscuro, no
   el relleno** — que es justo lo que la regla pedía por construcción.

**Y lo medido de la segunda tanda, los once emblemas de raza del 27 de agosto.**
Los tres problemas de arriba se repiten y aparece uno nuevo:

1. **Pesan 15 MB los once**, así que la carpeta `icons/` entera va por **26 MB en
   21 archivos**. La cuenta a 47 ya no es una molestia teórica, y sigue sin haber
   norma de extensión.
2. **Tampoco están recortados en el filo, pero el encuadre va peor.** La caja del
   glifo se mueve entre el **84 % y el 98 %** del lienzo —antes 84–97— y en cinco
   de los once el alto pasa del 95 %, o sea que casi no queda aire arriba y abajo.
   La pasada de recorte y relleno a caja común es ahora de 21 archivos, y es la
   receta que se aplicará a las 41 Características: conviene fijarla ya.
3. **Dos se salían del «un solo metal»** que manda `icons.md` §5: la venda de
   `no-muertos` salió en hueso pálido y la cola de `hombres-rata` en cobre
   rosado. **Resuelto el 29 de agosto al regenerar esos dos** — ver abajo. Los
   archivos que lo tenían están en `icons/races/old/`.
4. **`feericos` es el único calado del set.** Sus alas son nervadura fina sobre
   hueco mientras los otros diez son masa, así que es el candidato a empastarse a
   los 42px de la cuadrícula de once. Se juzga montando los once juntos a ese
   tamaño, no mirando el archivo.

**Y tres se sustituyeron el 29 de agosto de 2026**, por la decisión de Dario que
`icon-concept/icons.md` §4 anotó el 28: 👤 Humanos deja el gonfalón y se queda con
**el sol solo**, 💀 No-muertos pasa a **calavera rota** y 🐀 Hombres rata a
**cabeza de rata de frente**. Mismo formato que el resto —PNG RGBA de
1254×1254—, así que el sitio donde van no cambia ni hay nada que ajustar en el
CSS. Los tres viejos se guardan en `icons/races/old/`, que es la única carpeta
del set con dos versiones del mismo dibujo. Lo que mueven de lo de arriba:

- **El punto 3 se cierra a favor del prompt.** Los dos dibujos que tenían un
  segundo tono lo perdieron: la venda de la calavera pasa del 31 % al 5 % de
  glifo fuera del latón y la cola de la rata del 56 % al 16 %, medido igual en
  los dos casos. La calavera nueva es hoy el emblema **más monocromo de los
  once**, y la rata cae dentro de la banda de los ocho que no se tocaron
  (13–41 %). El rasgo 1 de §5 no hace falta relajarlo.
- **El punto 2 empeora un poco, y conviene saberlo antes de la pasada de
  recorte.** La caja del glifo iba del 84 % al 98 % del lienzo; con los tres
  nuevos el techo no se mueve —🐉 Dracónidos sigue arriba— pero **el suelo baja**:
  💀 No-muertos pasa a ser el más pequeño del set (caja al 79 % contra el 87 %
  del costillar) y además el más descentrado, con 9,7 % de aire a la izquierda
  contra 16,7 % a la derecha, o sea 88px de diferencia. 👤 Humanos, al revés,
  gana ancho al soltar el asta (del 82 % al 91 %). Ninguno de los dos es un
  problema del dibujo: son exactamente la dispersión que la pasada a caja común
  tiene que borrar, y ahora hay un punto más de recorrido que absorber.

### `frames/` — las piezas del marco, que no son ni ilustración ni pictograma

Trozos de **moldura de carta** dibujados como archivo en vez de con CSS. No son
lo mismo que `icons/`: un pictograma *dice un dato* —una Habilidad, un tipo de
daño, una raza— y un marco no dice nada, es el metal donde el dato se apoya. Por
eso van aparte y por eso los pinta el SCSS del boceto que los usa, con
`background-image`, en vez de un `<img>` puesto por el componente.

| Archivo | Qué es | Dónde se pinta |
|---|---|---|
| `frames/tier.png` | El medallón del **Tier**: anillo de oro con cuatro puntas en cruz sobre cara de piedra oscura | El disco de la esquina, bocetos **J · Orla** ([`_orla.scss`](../../../styles/components/card-sketch/_orla.scss)) y **K · Moldura** ([`_moldura.scss`](../../../styles/components/card-sketch/_moldura.scss)) |
| `frames/card/<raíl>.png` | **La moldura entera de la carta**, con la gema de Rareza tallada en el canto de arriba. **Seis**, una por raíl de color | La capa `.sketch__frame` del boceto **K · Moldura** ([`_moldura.scss`](../../../styles/components/card-sketch/_moldura.scss)) |

**Entró el 26 de agosto de 2026 para la J, y desde el 1 de septiembre lo usa
también la K.** Hasta entonces ese disco
era CSS puro —círculo, borde de metal, aro de oro y degradado de cara oscura, en
`_cuerpo.scss`—, y mientras vivieron, la G y la H **se quedaron con el de
CSS**: eran bocetos ya juzgados, y cambiarles una pieza por debajo habría
reescrito la comparación que decidió el marco. Borradas las dos el 1 de
septiembre de 2026, el círculo de CSS sigue en el parcial del cuerpo como el
suelo del que salieron las medidas, pero no lo pinta ya ninguna carta. La K sí lo hereda porque nace después: es el disco vigente, y
un boceto cuyo argumento es «la moldura se dibuja fuera» sería raro que montara
el medallón de CSS.

**El lienzo se recortó al llegar, y esa es la norma de la carpeta.** El archivo
salió del generador a 1254×1254 px y 1,9 MB, con la pieza descentrada y sombra
horneada en el alfa. Aquí vive **cuadrado, centrado en la pieza y a 256 px**
(93 KB, un 5% del original), que es lo que necesita un dibujo que se pinta a
60 px. Sin la sombra: la pone el CSS con un `drop-shadow`, que sigue la silueta
recortada en vez de un rectángulo. Una pieza de marco **no entra sin esa pasada**
— es la queja que los `icons/` tienen abierta desde su primera tanda, y no vale
la pena repetirla en una carpeta que nace hoy.

**Las medidas de `tier.png`, en fracción del lado**, porque el CSS las necesita
para colocarlo y no se sacan a ojo: **0,782** el anillo de oro (medido en la
diagonal, que es donde el medallón es un círculo limpio), **0,726** el hueco
oscuro de dentro, **0,976** las cuatro puntas. De ahí sale el tamaño con el que
se pinta: 60 px de caja dejan el anillo en 47 —el mismo círculo que dibujaba el
CSS— y el hueco en 43, así que lo único que crece es lo que sobresale.

Extensión `.png` por lo mismo que los pictogramas: transparencia y aristas
limpias, que es lo contrario de lo que pide la tabla de *Lienzo y formato*.

#### `frames/card/` — la moldura entera, seis archivos

**Entraron el 1 de septiembre de 2026** y son un salto de escala dentro de esta
carpeta: `tier.png` es una pieza *del* marco y esto es **el marco**. Con ellos el
boceto **K · Moldura** no dibuja metal, lo coloca — y por primera vez hay una
carta en el laboratorio a la que la probeta de aleación no le hace nada.

| | Norma |
|---|---|
| **Cuántos** | **6**, uno por raíl de color: `comun`, `poco-comun`, `raro`, `epico`, `legendario` y `heroe`. Son las claves de `$rarity` ([`styles/settings/_colors.scss`](../../../styles/settings/_colors.scss)) que hoy usa la baraja, no las nueve del mapa |
| **Lienzo** | **600 × 840 px**, o sea el 5:7 de la carta al doble de como se pinta (300 × 420). El archivo es la carta ENTERA, no un recorte del canto |
| **Aire de arriba** | **0,0357 del alto** (y 0 → y 30) por encima del canto exterior del raíl. Es la única asimetría, y no es un recorte mal hecho: ahí asoma la mitad de la gema. Por los lados y por abajo la moldura llega a sangre del lienzo |
| **Banda** | **0,0517 del ancho** y **0,0369 del alto** — 15,5 px sobre la carta, la misma banda que dibuja el filete vectorial de la G y la H (`$sketch-band`, 15 px) |
| **Ventana** | El hueco interior: **0,0726** por arriba, **0,0517** por los lados, **0,038** por abajo |
| **Radios** | **0,117 del ancho** el exterior (35 px en la carta) y **0,081** el interior (24 px). El exterior manda sobre el radio de la CARTA, o el fondo asoma por fuera del oro |
| **Gema** | Rombo tallado a caballo del canto de arriba, **en el eje exacto del lienzo** y a la misma altura en los seis. Es la pieza que sustituye al `.sketch__gem` de CSS de la G/H/J |
| **Fondo** | Transparente, ventana incluida: el arte va detrás y la moldura encima |
| **Extensión** | `.png`, por lo de siempre — transparencia y aristas limpias |

**La exigencia es la de los estandartes, y por el mismo motivo: las seis tienen
que ser intercambiables.** La carta las apila en un hueco fijo, así que lo que
puede variar es el color y el ornamento, nunca dónde cae el raíl. Medidas las
seis al entregarlas, se cumple con holgura:

| | Medido sobre las seis | Norma |
|---|---|---|
| Ventana, canto izquierdo | 0,0500 … 0,0533 — **0,3 puntos** | 0,0517 |
| Ventana, canto de arriba | 0,0714 … 0,0738 — **0,2 puntos** | 0,0726 |
| Eje de la gema | **300 de 600 en las seis** | 300 |

Dos se descuelgan por el pie y está anotado en vez de retocado: **`poco-comun` y
`heroe` traen el raíl de abajo cortado por el lienzo** (arranca a 0,0083 y 0,0036
del canto en vez de a 0), así que en la carta se les ve una hebra de fondo por
debajo del oro. Es de la generación, no del montaje.

**Y el peso sigue siendo el pendiente de siempre**: 1,1 MB entre las seis, de
173 a 197 KB cada una, ya recortadas del 1060 × 1484 con el que salieron. Es la
misma cuenta abierta que `icons/` (14 MB) y `banners/` (17 MB), con la
diferencia de que aquí la pasada de reencuadre no hace falta — salieron de una
tacada y el registro ya cuadra.

**Lo que cuesta el formato, dicho antes de que alguien lo descubra montando.**
Un marco vectorial tiene once raíles de color gratis, porque el color es una
variable; aquí cada raíl es un archivo. Eso cierra la escala en seis y convierte
«añadir una rareza» en «generar un PNG». Es el precio que el boceto K está
puesto a la página para cobrar, no un defecto de la entrega.

### `banners/` — los estandartes de raza, uno por raza

**Las once, entregadas el 27 de agosto de 2026** y de una sola tacada, que es lo
que las hace comparables. El concepto está en
[`knowledge/v3/card-concept/banners.md`](../../../knowledge/v3/card-concept/banners.md)
y los prompts en [`prompts/banners.md`](../../../knowledge/v3/card-concept/prompts/banners.md).
Las medidas del archivo se fijan aquí y se fijan **antes de dibujar**, que es lo
que la primera versión del concepto hizo mal: dimensionó la pieza contra los
34 × 78 px que ocupa en la carta, y esa es su lectura más pequeña, no su tamaño.

**Se tratan igual que los pictogramas de `icons/`**: un archivo por raza,
dibujado grande, usado al tamaño que cada sitio pida. Un emblema de 1254 px se ve
a 27 en la carta; un estandarte de 1254 se ve a 34 × 78. Lo que hace que la pieza
valga fuera de la carta —una cabecera de raza, una pantalla de reclutamiento— es
justamente que el archivo no está dibujado para el hueco donde se ve más pequeña.

**Y son la bandera vacía, no la bandera con su emblema.** Esta ficha decía lo
contrario el 27 de agosto y hubo que corregirlo el mismo día, después de que una
IA generara la primera tanda con el logotipo horneado dentro: el emblema ya
existe en `icons/races/`, ya está aprobado y ya se usa en otros tres sitios, así
que hornearlo aquí serían dos dibujos del mismo objeto que pueden separarse. El
campo es un archivo y la carga es otro. Los prompts, corregidos, están en
[`knowledge/v3/card-concept/prompts/banners.md`](../../../knowledge/v3/card-concept/prompts/banners.md).

**Carpeta aparte, y por una regla y no por gusto.** No van en `icons/` porque esa
carpeta es **monocroma dorada** por norma (`icon-concept/icons.md` §5) y un
estandarte lleva el color de su raza; no van en `frames/` porque ahí solo entra
lo que *no dice nada*, y un estandarte dice la raza. Es la tercera clase de
archivo del catálogo, así que tiene la suya.

| | Norma |
|---|---|
| **Cuántos** | **11**, uno por raza, con el slug de siempre (`humanos`, `no-muertos`, `hombres-rata`…) |
| **Lienzo** | **1000 × 1760 px** |
| **Paño** | **700 px de ancho, centrado** (x 150 → 850), del **y 105 al y 1715**. Son 1610 de alto: **el PAÑO es 1 : 2,3**, no el lienzo |
| **Corte** | Arranca en **y 1393** — el 80 % del paño, no del lienzo |
| **Asta** | Sobresale por los lados del paño y cabe dentro del lienzo, en el 6 % superior. Es lo que obliga a que el lienzo sea más ancho que la tela |
| **Registro** | **Plano y gráfico**, tipo emblema de interfaz: un panel de color liso. **No** una tela pintada con realismo — sin pliegues, sin trama, sin costuras, sin desgaste |
| **Contenido** | La bandera **VACÍA**: color liso y el corte del pie, nada más. **Sin emblema, sin sello, sin símbolo, sin logotipo dentro** — el emblema se pone encima y sale de `icons/races/` |
| **Color** | **Un solo tono** por raza (la tabla del §5 del concepto), con un oscurecimiento muy suave hacia los bordes. Ningún otro color dentro del paño, y ahí **nada de oro**: es el material del emblema que va encima |
| **Filete y asta** | El **contorno de oro** y el **travesaño con remates** sí van, y son lo único dorado. En la carta el travesaño queda entero tapado por el disco del Tier — están por los tamaños grandes, que es para lo que existe el archivo |
| **Fondo** | Transparente. Sin sombra horneada: la pone el CSS con `drop-shadow`, que sigue la silueta |
| **Extensión** | `.png`, por lo mismo que los pictogramas: transparencia y aristas limpias |

**La proporción es del PAÑO y no del lienzo, y eso hubo que aprenderlo montando
la primera** *(27-ago-2026)*. Esta ficha decía «1 : 2,3» a secas, el generador lo
aplicó al **lienzo**, y como el asta se lleva el 30 % del ancho la tela salió a
**1 : 3,0**: en la carta se veía un estandarte demasiado largo. De ahí las cinco
cotas de la tabla en vez de una — el paño en píxeles y no en proporción, para que
no se pueda volver a interpretar sobre otra cosa.

Y de paso subió el ancho de la pieza en la carta: `$sketch-banner` pasó de 34 a
**38 px**, porque con el paño de CSS la proporción se aguantaba y con una bandera
de verdad se veía estrecha. Ahí se acabó el margen: en el boceto G la bandera
arranca ya a 1 px del raíl del filete.

**Y una exigencia que un pictograma no tiene: las once tienen que ser
intercambiables.** Esta pieza **cuelga de un punto** —en la carta se mete en un
hueco fijo debajo del disco del Tier— así que el paño tiene que ocupar lo mismo
en los once archivos: mismo ancho, mismo canto de arriba, mismo sitio del
emblema. Lo que varía es lo que hay dentro, no dónde está.

Es el mismo problema que `icons/` tiene abierto desde la segunda tanda, con la
caja del glifo entre el 84 % y el 98 % del lienzo — **pero aquí no se dio**, y
conviene saber por qué antes de meter los estandartes en esa pasada. Medidos los
once al entregarlos, el paño cae siempre en el mismo sitio:

| | Medido sobre los once | Norma |
|---|---|---|
| Lienzo | **945 × 1663** en los once (1 : 1,760) | 1000 × 1760 (1 : 1,760) ✔ |
| Paño, canto izquierdo | x 132 … 135 — **3 px de dispersión** | x 150 |
| Paño, ancho | 677 … 680 — **3 px** | 700 |
| Paño, canto de arriba | y 101 … 104 — **3 px** | y 105 |
| Paño, proporción | **1 : 2,12 … 1 : 2,28** | 1 : 2,3 |

Tres píxeles de dispersión sobre 945 es medio punto porcentual: son
intercambiables tal cual, y **no hace falta reencuadrarlos**. La diferencia con
`icons/` es que los once salieron de una tacada con el mismo prompt, y los
pictogramas no.

Los ~18 px de más en el ancho (677 medidos contra los 661 que serían 700 de
1000) son el **filete de oro**, que se dibuja por fuera de la tela. Por eso el
CSS usa 717/1000 y no 700: la norma le habla al generador del paño, y el CSS
necesita la pieza visible. Están explicados en
`styles/components/card-sketch/_cuerpo.scss`, y **no son un error que haya
que arreglar igualando una cifra a la otra**.

Lo que sí queda pendiente es el **peso**: 17 MB entre los once, de 1,3 a 1,8 MB
cada uno, para una pieza que en la carta se pinta a 38 × 87 px. Es el mismo
pendiente que tiene `icons/` (14 MB más) y la misma receta que ya se aplicó en
`frames/`, donde `tier.png` vive a 256 px y 93 KB.

## La estructura, cuando toque

Espejo de `docs/v3/`, misma norma que siguió v2: una carpeta por documento del
catálogo, con el mismo nombre.

| Carpeta | Corresponde a |
|---|---|
| `cards/class/<clase>/` | [`docs/v3/cards/class.md`](../../../docs/v3/cards/class.md) |
| `cards/units/` | [`docs/v3/cards/units.md`](../../../docs/v3/cards/units.md) |
| `cards/items/` | [`docs/v3/cards/items.md`](../../../docs/v3/cards/items.md) |
| `cards/curses/` | [`docs/v3/cards/curses.md`](../../../docs/v3/cards/curses.md) |
| `cards/encounter/` | [`docs/v3/cards/encounter.md`](../../../docs/v3/cards/encounter.md) |
| `races/<raza>/` | [`docs/v3/razas.md`](../../../docs/v3/razas.md) — los 4 héroes de clase de esa raza |
| `races/<raza>/units/` | [`docs/v3/razas.md`](../../../docs/v3/razas.md) — sus 8 unidades de progresión |

No crees ninguna hasta que su documento tenga contenido: una carpeta vacía
promete un catálogo que aún no existe.

## Nombre de archivo

El mismo criterio de v2 (slug del nombre español, sin acentos ni paréntesis;
la norma completa, con ejemplos, en
[`../v2/cards/README.md`](../v2/cards/README.md#nombre-de-archivo)) —
salvo que V3 decida otra cosa. Extensión `.webp`.

## Lienzo y formato

**Esta sección es la fuente única.** La dirección de arte
([`knowledge/v3/art-direction/`](../../../knowledge/v3/art-direction/README.md))
dice cómo se dibuja y qué se dibuja; la medida del archivo que acaba aquí se
decide aquí, porque depende del componente que lo va a pintar y no del estilo.

| | Ilustración de carta | Retrato de héroe o unidad |
|---|---|---|
| Tamaño | **1080 × 1512 px** | Sin decidir |
| Ratio | **5:7 (0,714), vertical** | Sin decidir |
| Sangrado | A sangre | A sangre |
| Transparencia | Ninguna | Ninguna |
| Extensión | `.webp` | `.webp` |

**Vertical, no apaisado.** El 5:7 es el de la carta ya construida
—`$sketch-width: 300px` × `$sketch-height: 420px` en
[`styles/settings/_card.scss`](../../../styles/settings/_card.scss)— y los cinco
bocetos de `/docs/v3/cards/design` lo comparten: gane el que gane, el arte se
pinta **a sangre en 300×420**. El 1536×1050 apaisado que decía antes esta tabla
venía de v2 y **queda retirado**: obligaba a tirar la mitad de la anchura para
que la imagen entrara en un marco vertical, y ese recorte era exactamente lo que
hacía salir al personaje enorme y descentrado.

Si la herramienta no ofrece 5:7, coge el ratio vertical más alto que tenga (2:3)
y deja el aire de sobra arriba y abajo: recortar hasta 5:7 es barato, inventar el
borde que faltaba no.

### Encuadre: plano general, con aire, y figura centrada

Esto no es estética, es lo que decide si la carta se lee. Los tres primeros
héroes se generaron sin esta tabla y salieron en **plano medio**, cortados por el
muslo y con la figura fuera del eje.

| | Norma |
|---|---|
| Plano | **General**, cámara alejada. La figura completa **y entorno alrededor**. No «plano entero», que es el plano en que el cuerpo llena el cuadro. Nunca busto, plano medio ni primer plano |
| Aire arriba | **Otra cabeza entera** por encima de la coronilla, como mínimo |
| Aire abajo | **Suelo visible** por delante y por detrás de los pies antes del borde. Los pies no se apoyan en el filo |
| Aire lateral | El hueco de **un brazo** a cada lado |
| Eje horizontal | El cuerpo **centrado**: su eje a ±5% del centro del lienzo |
| Alto de la figura | **~60%** del alto del lienzo, entre el **12%** y el **72%** de la altura |
| Cámara | A la altura del pecho, lente neutra. Sin contrapicado ni gran angular: agrandan al sujeto y le comen los pies |

> **Las cuatro filas de aire van en el prompt; la del alto de la figura, no.** Un
> modelo de imagen no mide porcentajes —el «60–70%» estuvo escrito y devolvió un
> 90%—, así que el aire se pide con **anclas visuales** (una cabeza, un brazo, un
> trozo de suelo) y el número se guarda para **comprobar** el resultado.

**El cuarto inferior no es tuyo.** Del 75% hacia abajo va la banda opaca del
nombre, que se pinta encima. Ahí solo puede haber suelo: ni pies, ni punta de
arma, ni nada que se quiera ver. Y arriba y a los lados manda lo mismo por otro
motivo — **el marco tapa los bordes**, así que nada importante (rostro, manos,
arma, escudo, el elemento distintivo) pegado al filo, y menos en las esquinas.

**Los sujetos anchos o enormes se resuelven alejando la cámara, no recortando.**
La Caballería ocupa más ancho que alto y el Dragón dorado tiene que aplastar en
escala; en los dos, la silueta completa entra en la banda aunque quede más
pequeña. Una silueta pequeña y entera se lee; media silueta grande, no.

> **La medida del retrato sigue sin decidir**, y por el mismo motivo que antes:
> no existe pantalla de selección de héroe ni ficha de unidad. Mientras tanto usa
> este mismo ratio y este mismo encuadre por consistencia, y deja margen de
> sobra.

> **Antes de generar nada**, mira si el documento de `docs/v3/` que le
> corresponde ya tiene su tabla. Sin tabla no hay a qué pegar el arte.
>
> Hoy eso deja **`races/` abierto** —[`docs/v3/razas.md`](../../../docs/v3/razas.md)
> tiene cerradas las razas, sus clases y sus unidades— y **`cards/` cerrado**:
> los documentos de `docs/v3/cards/` siguen siendo esqueletos.
