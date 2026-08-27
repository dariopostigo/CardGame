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
>   apaisado de tres archivos, ni el encuadre de diecinueve de veinte. Nadie tiene
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

**Ya hay arte, y ya no es de una sola raza.** Veinte archivos: los **ocho de
👤 Humanos** —sus cuatro héroes y las cuatro primeras unidades de su progresión—
y los **doce de ⛏️ Enanos**, que entraron la noche del 26 de agosto de 2026 y son
la **raza entera**: cuatro héroes y las ocho unidades.

**Con eso el orden previsto queda invertido, y hay que dejar de citarlo.**
[`prompts/enanos.md`](../../../knowledge/v3/races-concept/prompts/enanos.md) decía
«Fase 2: entra cuando Humanos esté cerrado», y el argumento era que sin las doce
imágenes de la piloto no hay vara de medir cuánta masa es un tier 8. Enanos llegó
antes y llegó completa, así que **la vara de medir la pone ahora Enanos**: es la
única raza con una progresión de ocho tiers a la vista, de ⛏️ Minero a ⛰️ Coloso,
y es contra ella contra la que se juzga si un salto de tier se lee. A cambio,
Humanos se queda con lo único que Enanos ya no puede enseñar: **el hueco sin
dibujar**. Sus cuatro unidades altas —🐎 Caballería, 🦅 Grifo, ✝️ Paladín y
🐉 Dragón dorado— caen todavía al emoji, y son las cuatro últimas cartas que
sirven para ver si el marco aguanta una sin ilustración.

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

*(**\*** El `2:3` va en verde y no en ámbar porque **no es un desajuste**:
§"Lienzo y formato" lo da como el sustituto válido cuando la herramienta no
ofrece 5:7 —«coge el ratio vertical más alto que tenga»—, y recortar de 2:3 a 5:7
es la operación barata que esa misma norma autoriza. El `1023×1537` del ⚙️
Ingeniero unidad es el mismo 2:3 con un píxel de menos, no otro lienzo.)*

**Los ocho de Humanos** se pintan en dos sitios: los bocetos de marco de
**Cartas › Diseño de cartas** (`/docs/v3/cards/design`) y el marco elegido de
**Cartas › Diseño baraja** (`/docs/v3/cards/deck`). **Los doce de Enanos, solo en
la baraja**, y a propósito: el laboratorio de bocetos se queda con la raza piloto
porque nueve marcos × veinticuatro cartas no se comparan, se hojean. Así que la
página donde se ven las veinte juntas es la baraja.

## 👤 Humanos — las ocho de la piloto

**Ya no faltan héroes** —el 🏹 Arquero llegó el 25 de agosto de 2026 y con él la
clase se juzga entera— y desde el 26 hay **media progresión de unidades**:
Miliciano, Arquero, Caballero y Mago, los cuatro en el mismo camino, con la
misma cerca y el mismo castillo al fondo. Esa continuidad de escenario entre
unidades no estaba pedida en ningún sitio y conviene decidir si se queda: hace
que las ocho se lean como un ejército y no como ocho retratos sueltos, pero
también significa que la progresión de tier no cambia de sitio.

**Y Enanos contesta a esa duda, en parte.** Sus doce comparten también el
escenario —galería de mina, forja, arco de piedra tallada—, pero ahí sí estaba
pedido: es el campo `Fondo:` de la identidad de raza en `prompts/enanos.md`, o
sea que la continuidad es **de raza y a propósito**. Lo que eso deja abierto no es
si se quiere continuidad, sino cuánta: en Enanos el escenario cambia de sitio
dentro de la mina —el 🔨 Herrero está en la forja, el 🔫 Mosquetero en una almena,
el 🗿 Gólem en una sala de columnas— y aun así las doce se leen como un ejército.
La cerca y el castillo de Humanos son más literales que eso.

Con esa tanda pasaron dos cosas en el laboratorio: **se retiró el último relleno
prestado de v2** (el Arquero y el Mago unidad tiraban de las cartas de clase del
juego anterior; ya no queda ninguna imagen de v2 en un lab de V3), y las
unidades sin arte bajaron de siete a cuatro.

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
   Coloso aquí, el 🐉 Dragón dorado de Humanos cuando llegue— el ancla de escala
   tiene que estar **al lado o en la arquitectura, nunca a los pies**. Se arregla en
   el prompt, y es la segunda línea que hay que tocar antes de la tercera raza.
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

Lo que **no** trae esta tanda: ni un `.webp` y ni un recorte. Los doce son `.png`
de ~2,7 MB, así que el arte provisional del repo pasa de ~20 MB a **~52 MB**.

## Lo que sigue sin cuadrar, de las veinte

> **Dos cosas siguen sin cuadrar con lo que dice este mismo documento**, y con
> Enanos dentro una de ellas cambió de tamaño y la otra de naturaleza. Con el arte
> en provisional (aviso de arriba) ninguna es urgente, pero hay que cerrarlas
> antes de que lleguen las 112 restantes y se copie el criterio:
>
> 1. ~~**La ruta.**~~ **Cerrada** el 21 de agosto de 2026: estaban en
>    `human/heroes/` con nombre en inglés y ya están en `races/humanos/` con el
>    slug español que manda §"Nombre de archivo". Se cerró con tres archivos
>    dentro porque con 132 cuesta 44 veces más. **Enanos entró ya bien**, sin
>    tocar nada: `races/enanos/` y `races/enanos/units/` con el slug español, que
>    es lo que el archivo de prompts pedía. La norma funciona cuando se escribe
>    antes de generar.
> 2. **El formato sigue abierto, y ya no es una advertencia: son ~52 MB.**
>    §"Nombre de archivo" pide `.webp` y los veinte son `.png` de ~2,5–2,7 MB. Con
>    ocho eran ~20 MB y el argumento de «no convertir lo que se va a tirar» salía
>    gratis; con veinte, y a **~32 MB por raza completa**, las once razas
>    proyectan **~350 MB de arte provisional** en el repo. El argumento sigue
>    siendo válido —al archivo le queda vuelta por el encuadre (punto 3), así que
>    le queda también la conversión— pero la cuenta ya no es cómoda: **la decisión
>    que hay que tomar es en la tercera raza, no en la undécima**, y es si el
>    provisional entra en `.webp` desde ya aunque se tire.
> 3. **El ENCUADRE es el pendiente de verdad, y con Enanos pasó de ser «de casi
>    todos» a ser el patrón** *(medido el 26 de agosto de 2026, tabla arriba)*.
>    Hasta esa fecha aquí solo se hablaba del lienzo, y por eso parecía un problema
>    de tres archivos. Con las guías puestas encima resulta que **diecinueve de los
>    veinte** ponen los pies por debajo del 72% que manda §"Encuadre" —entre el 78%
>    y el 89%—, así que la figura invade el cuarto reservado al rótulo y el panel
>    de la carta le come las piernas. **El único que cumple sigue siendo el
>    ✝️ Sacerdote**, y cumple de rebote, porque su lienzo apaisado no da de sí para
>    una figura más alta: o sea que en veinte archivos **no hay ni uno que acierte
>    el encuadre a propósito**.
>
>    Y con Enanos se cae la lectura que se hacía de esto. Con ocho archivos parecía
>    haber una relación perversa —«los cinco de lienzo correcto son los cinco
>    peores de encuadre»—, y con veinte se ve que **no hay ninguna relación**:
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
>    tirar veinte veces — y sobre todo es lo que hay que hacer **antes** de la
>    tercera raza, no después.
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
> cuando el tope son 72. La tabla de arriba lo dice de los veinte.
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
> apaisados de veinte, y en la tanda nueva ninguno—, es el **encuadre de
> diecinueve de veinte**, y el único que cae dentro de la norma es el
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
§5) y **los diez primeros archivos entregados**, que es lo que abre esta
carpeta.

| Carpeta | Qué lleva | Hoy |
|---|---|---|
| `icons/abilities/` | Las 8 Habilidades | **Las 8** — `vida`, `ataque`, `defensa`, `resistencia-magica`, `precision`, `suerte`, `iniciativa`, `movimiento` |
| `icons/damage/` | Los 3 Tipos de daño, que ocupan el sitio del icono de Ataque | **2 de 3** — `a-distancia` y `magico`. **Falta `cuerpo-a-cuerpo`**, y mientras tanto el laboratorio pinta `abilities/ataque.png` en su hueco (suplente, ver abajo) |
| `icons/traits/` | Las 41 Características | Vacía, sin crear |
| `icons/races/` | Los 11 emblemas de raza | Vacía, sin crear |

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

### `frames/` — las piezas del marco, que no son ni ilustración ni pictograma

Trozos de **moldura de carta** dibujados como archivo en vez de con CSS. No son
lo mismo que `icons/`: un pictograma *dice un dato* —una Habilidad, un tipo de
daño, una raza— y un marco no dice nada, es el metal donde el dato se apoya. Por
eso van aparte y por eso los pinta el SCSS del boceto que los usa, con
`background-image`, en vez de un `<img>` puesto por el componente.

| Archivo | Qué es | Dónde se pinta |
|---|---|---|
| `frames/tier.png` | El medallón del **Tier**: anillo de oro con cuatro puntas en cruz sobre cara de piedra oscura | El disco de la esquina de la carta elegida, boceto **J · Orla** ([`styles/components/card-sketch/_orla.scss`](../../../styles/components/card-sketch/_orla.scss)) |

**Entró el 26 de agosto de 2026 y solo lo usa la J.** Hasta entonces ese disco
era CSS puro —círculo, borde de metal, aro de oro y degradado de cara oscura, en
`_estandarte.scss`—, y la G y la H **se quedan con el de CSS**: son bocetos ya
juzgados, y cambiarles una pieza por debajo reescribiría la comparación que
decidió el marco.

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
