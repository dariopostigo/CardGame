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
>   apaisado de tres archivos, ni el encuadre de siete. Nadie tiene que
>   regenerarlos, y sobre todo nadie tiene que *recortarlos a mano* para
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

**Ya hay arte.** Ocho archivos, todos de la raza piloto: sus **cuatro héroes** y
las **cuatro primeras unidades** de su progresión, o sea media raza dibujada.

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

*(«Pies» = dónde acaba la figura, medido sobre el alto del lienzo. La norma de
§"Encuadre" dice **72%**, para que el cuarto de abajo quede libre. Los
porcentajes están medidos a ojo sobre una hoja de guías, así que valen para
decidir, no para citar al píxel.)*

Los ocho se pintan en los bocetos de marco de **Cartas › Diseño de cartas**
(`/docs/v3/cards/design`), que es lo único que hay montado que los use.

**Ya no faltan héroes** —el 🏹 Arquero llegó el 25 de agosto de 2026 y con él la
clase se juzga entera— y desde el 26 hay **media progresión de unidades**:
Miliciano, Arquero, Caballero y Mago, los cuatro en el mismo camino, con la
misma cerca y el mismo castillo al fondo. Esa continuidad de escenario entre
unidades no estaba pedida en ningún sitio y conviene decidir si se queda: hace
que las ocho se lean como un ejército y no como ocho retratos sueltos, pero
también significa que la progresión de tier no cambia de sitio.

Con esa tanda pasaron dos cosas en el laboratorio: **se retiró el último relleno
prestado de v2** (el Arquero y el Mago unidad tiraban de las cartas de clase del
juego anterior; ya no queda ninguna imagen de v2 en un lab de V3), y las
unidades sin arte bajaron de siete a cuatro.

> **Dos cosas siguen sin cuadrar con lo que dice este mismo documento.** Con el
> arte en provisional (aviso de arriba) ninguna es urgente, pero hay que
> cerrarlas antes de que lleguen las 127 restantes y se copie el criterio:
>
> 1. ~~**La ruta.**~~ **Cerrada** el 21 de agosto de 2026: estaban en
>    `human/heroes/` con nombre en inglés y ya están en `races/humanos/` con el
>    slug español que manda §"Nombre de archivo". Se cerró con tres archivos
>    dentro porque con 132 cuesta 44 veces más.
> 2. **El formato sigue abierto, y ya pesa.** §"Nombre de archivo" pide `.webp` y
>    estos son `.png` de ~2,5 MB cada uno: con ocho archivos son **~20 MB** en el
>    repo para la primera media raza de once. A ese ritmo, las 132 no caben.
>    **No se convierten** mientras al archivo le quede una vuelta —el `.webp`
>    entra con la generación buena, no con una conversión que se tira—, pero
>    conviene ver que el argumento se está gastando: si a los ocho les queda
>    vuelta por el encuadre (punto 3), a los ocho les queda también la conversión,
>    y entonces esto no es un pendiente, es parte de la próxima tanda.
> 3. **El ENCUADRE es el pendiente de verdad, y es de casi todos** *(medido el 26
>    de agosto de 2026, tabla arriba)*. Hasta esa fecha aquí solo se hablaba del
>    lienzo, y por eso parecía un problema de tres archivos. Con las guías puestas
>    encima resulta que **siete de los ocho** ponen los pies por debajo del 72%
>    que manda §"Encuadre" —entre el 78% y el 89%—, así que la figura invade el
>    cuarto reservado al rótulo y el panel de la carta le come las piernas. Y con
>    una vuelta de tuerca desagradable: **los cinco de lienzo correcto son los
>    cinco peores de encuadre**. El único que cumple es el ✝️ Sacerdote, y cumple
>    de rebote, porque su lienzo apaisado no da de sí para una figura más alta.
>    Lo que sí está **resuelto** de las vueltas anteriores: el reparto de cuerpos
>    (el Sacerdote ya es un hombre mayor y grueso, no un joven esbelto) y la
>    jerarquía de fondo. Las normas están en §"Lienzo y formato" y §"Encuadre"
>    aquí, el reparto en
>    [`sujetos.md`](../../../knowledge/v3/races-concept/sujetos.md#identidad-de-raza)
>    y el fondo en
>    [`style-guide.md`](../../../knowledge/v3/art-direction/style-guide.md#16-fondos)
>    §16.
>
>    **Y hay una pista de por qué falla siempre por el mismo lado.** El aviso de
>    §"Encuadre" ya lo decía: un modelo de imagen no mide porcentajes, así que el
>    aire se pide con anclas visuales. Las cuatro filas de aire están en el
>    prompt, pero la de **aire abajo** dice «suelo visible por delante y por
>    detrás de los pies», y eso se cumple —hay suelo— sin que la figura suba: el
>    ancla no controla CUÁNTO suelo. La que falta es una que fije el pie, del
>    tipo «el suelo por delante de los pies ocupa la cuarta parte de abajo de la
>    imagen». Cambiar esa línea es más barato que volver a tirar ocho veces.
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
> cuando el tope son 72. La tabla de arriba lo dice de los ocho, y el resultado
> incómodo es que **los cinco «buenos» de lienzo son los peores de encuadre** —
> los apaisados aciertan más porque un lienzo más bajo no da para meter una
> figura tan alta, o sea por accidente y no por criterio.
>
> **Lo que queda entonces:** regenerar no está bloqueado por la decisión de
> marco, y tampoco es una tarea pendiente — es lo que pasará solo cuando el
> generador empiece a obedecer. El dato que se guarda de todo esto es el
> diagnóstico: el problema no era el lienzo de tres archivos, es el **encuadre de
> siete de ocho**, y el único que cae dentro de la norma es el ✝️ Sacerdote,
> que encima es apaisado. Cuando llegue la tanda buena se arreglan las dos cosas
> —lienzo y encuadre— en la misma vuelta, y con ella entra el `.webp`.

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
