# CardGame — Ilustraciones de V3: dirección de arte

> **Esto cubre lo que se dibuja**: razas, héroes de clase, unidades, criaturas,
> objetos y escenas. Cómo se dibuja —línea, anatomía, color, materiales, luz—
> está en [`style-guide.md`](style-guide.md) y no se repite aquí.
>
> **Lo que NO cubre.** El **diseño de la carta** —marco, disposición de nombre y
> números, tipografía, Rareza— es otra disciplina, sin definir en V3; sus
> referencias están en [`../card-concept/`](../card-concept/README.md). Y las
> **medidas del archivo** son especificación de entrega y viven en
> [`public/assets/v3/README.md`](../../../public/assets/v3/README.md#lienzo-y-formato).
> Aquí la carta aparece solo como lo que es para el ilustrador: un recorte con
> los bordes tapados. El mapa de la carpeta está en [`README.md`](README.md).

## Estado: las razas ya se pueden dibujar; las cartas no

Dos ritmos distintos, y conviene no confundirlos:

- **Los sujetos existen.** [`docs/v3/razas.md`](../../../docs/v3/razas.md) tiene cerradas las razas, sus 4 clases jugables y su progresión de 8 unidades, cada una con su papel táctico. Eso es suficiente para ilustrar: sabemos quién es cada uno y qué hace.
- **Las cartas no existen.** Los cinco documentos de [`docs/v3/cards/`](../../../docs/v3/cards/README.md) son esqueletos sin tabla, y el motor de combate —del que salen los efectos— está por escribir ([`game-design.md`](../../../docs/v3/game-design.md) §4).

Por tanto: **retratos de héroe y de unidad, sí; ilustración de carta de clase,
maldición, item o encuentro, todavía no.** Una ilustración de carta sin carta
detrás decide en imagen lo que después decide el motor, y gana el motor.

**Empieza por Humanos**, la raza piloto. Cerrar sus 4 clases y sus 8 unidades
antes de tocar otra raza da algo que casi ninguna otra cosa da: una vara de
medir. Todo lo que venga después se juzga contra ese bloque.

## 1. Los sujetos, y qué pide cada uno

### Héroes de clase

Cuatro por raza. **En V3 la raza y la clase van separadas**, y eso es la
diferencia grande con v2, donde cada clase venía con su raza pegada (el
Guerrero *era* el enano). Aquí el Guerrero existe en humano, en enano, en
no-muerto y en demonio, y tiene que leerse como "el mismo puesto, otra gente".

Lo resuelve el reparto:

- **La clase se lee en el equipo, la pose y la complexión**: qué empuña, cómo lo empuña, dónde tiene el peso, cuánta masa carga. Un Guerrero planta los pies y es pesado; un Mago no hace ninguna de las dos cosas.
- **La raza se lee en el rango anatómico, los rasgos, la paleta y los materiales**: escala en cabezas, cara de especie, piel, motivos.

Si tapas la cara y sigues sabiendo la clase, y tapas el arma y sigues sabiendo
la raza, está bien resuelto.

> **El cuerpo no es solo de la raza, y confundirlo tiene consecuencias.** Este
> documento decía «la raza se lee en el cuerpo», la plantilla de prompt mandaba
> rellenar `CUERPO Y ROSTRO` con la anatomía de la raza, y la ficha de Humanos
> dice «proporción heroica»: resultado, los tres primeros héroes salieron
> jóvenes, esbeltos, musculosos y guapos —**Mago y Sacerdote incluidos**, donde
> no tiene ningún sentido—.
>
> La raza fija un **rango**; el papel elige la complexión dentro de él; el tier
> pone la edad y el desgaste. Y la **belleza es un eje de raza**: se le pide a
> los Elfos, no a los Humanos. Los tres ejes nuevos —Anatomía como rango, Edad y
> Belleza— y los valores de las 11 razas están en
> [`../races-concept/sujetos.md`](../races-concept/sujetos.md#el-reparto-quién-decide-el-cuerpo).

### Unidades

Ocho por raza, en progresión de tier — de Miliciano a Dragón dorado, de Minero
a Coloso de adamantita. **La escalada tiene que verse en la silueta**, no solo
en la calidad del equipo: cada escalón crece en masa, en altura o en amenaza
respecto al anterior.

> **Y crece en la PROPORCIÓN, no en el tamaño de la figura dentro del cuadro**
> (21 de agosto de 2026). Este párrafo pedía antes que «puestas las ocho en fila,
> el orden fuera evidente sin leer un número», y eso era incompatible con el
> encuadre de la §2: si las ocho llenan el mismo 60–70% de su carta, las ocho
> miden lo mismo. **La exigencia de la fila queda retirada**, porque además no
> describe cómo se usa una carta: se mira sola, no al lado de sus siete
> hermanas.
>
> Lo que sí se pide, y sobrevive al recorte y a mirar la carta aislada:
>
> | Se lee en | Tier bajo | Tier alto |
> |---|---|---|
> | **Cabezas** | Proporción normal de su raza | Cabeza **pequeña** respecto al cuerpo |
> | **Masa** | Hombros estrechos, miembros finos | Hombros y tronco desproporcionados |
> | **Ancho ocupado** | ~35% del ancho del cuadro | Hasta el 90% |
> | **Amenaza** | Postura recogida, defensiva | Postura que ocupa espacio |
>
> La cabeza pequeña respecto al cuerpo es lo que lee «enorme» — es el truco de
> siempre y funciona en una sola imagen. **El alto de la figura sigue siendo el
> mismo ~60% en los 132**, sin excepciones de encuadre.

Comparten familia visual con su raza —mismos materiales, misma paleta, mismos
motivos— porque son el mismo ejército.

### Criaturas

Las que no son humanoides: grifos, dragones, gólems, abominaciones, colosos.
Se dibujan con la misma línea y el mismo sombreado que todo lo demás (§3 y §8
de la biblia), y se someten a la paleta de su raza. Son las que más tientan a
salirse al realismo: no.

### Enemigos

**No hay bestiario aparte.** En V3 los enemigos son las propias razas
([`docs/v3/characters/enemies.md`](../../../docs/v3/characters/enemies.md)), así
que un enemigo es una unidad ya ilustrada vista desde el otro lado. Lo que
cambia es el encuadre y la iluminación, no el personaje.

### Objetos, maldiciones y escenas

Salen cuando exista catálogo de cartas, y cada uno pide otra cosa: el **objeto**
es un bodegón sin personaje; la **maldición** ilustra el efecto sufrido, no su
causa; el **encuentro** es el único caso donde el fondo puede subir a
protagonista.

### Cartas de clase: el caso sin resolver

Una carta de clase cubre **todas las razas**
([`class.md`](../../../docs/v3/cards/class.md)), así que su ilustración no
puede protagonizarla ninguna. O se dibuja el gesto en primer plano —manos,
arma, impacto, estela— sin rostro reconocible, o se acepta una versión por
raza. Es decisión de catálogo y está sin tomar; no la resuelvas dibujando.

## 2. Los dos encuadres

Hay **dos**, y piden cosas distintas:

- **Ilustración de carta** — **vertical**, a sangre, en **plano general**: el
  personaje completo de la coronilla a los pies, centrado en el eje horizontal y
  ocupando unos dos tercios de la altura, con aire en los cuatro bordes porque
  encima va un marco que los tapa y abajo una banda opaca con el nombre. Se
  juzga en miniatura: si no se lee al tamaño real en pantalla, da igual lo buena
  que sea a tamaño completo.
- **Retrato de héroe o unidad** — no tiene pantalla todavía, así que no tiene
  encuadre cerrado. Dibújalo con el mismo criterio y **deja margen de sobra**:
  recortar es barato, inventar el borde que faltaba no.

> **Vertical y con aire, y esto no es un matiz.** Ha costado dos tiradas:
>
> 1. La primera salió **apaisada y en plano medio** —cortada por el muslo, la
>    figura fuera del eje—, y en un marco vertical hay que tirar la mitad de la
>    anchura.
> 2. La segunda salió vertical y completa, pero **en plano entero ajustado**: la
>    figura al 90% del alto, la coronilla a un dedo del borde y los pies apoyados
>    en el filo. Y era culpa del vocabulario de estos documentos, que pedían
>    literalmente «plano entero» — que es, por definición, el plano en que el
>    cuerpo llena el cuadro.
>
> Lo que se pide es **plano general con la cámara alejada**, y se pide con
> **anclas visuales, no con porcentajes**: una cabeza de aire por encima, suelo
> visible por debajo de los pies, el hueco de un brazo a los lados. Los
> porcentajes estaban escritos y la IA los ignoró, porque no mide.
>
> Y el plano hay que pedirlo **en positivo en el prompt y en negativo en el
> negative prompt**: la IA por defecto se acerca. Un sujeto ancho (la Caballería)
> o enorme (el Dragón) se resuelve **retrocediendo la cámara**, nunca
> recortándolo.

**Las medidas no están aquí.** Tamaño, ratio, sangrado, transparencia y los
porcentajes exactos —alto de la figura, aire por borde, cuánto se come la banda
del nombre— son especificación del archivo entregado y viven en
[`public/assets/v3/README.md`](../../../public/assets/v3/README.md#encuadre-plano-entero-y-figura-centrada),
junto a las rutas y el nombre. Del retrato sigue sin haber medida, y ese aviso
está allí.

## 3. Plantilla de prompt

Cada bloque se escribe listo para pegar tal cual en la IA, en tres piezas:

1. **El prompt base universal** de [`style-guide.md`](style-guide.md#21-prompt-base-universal) §21 — idéntico en todo, es lo que mantiene la colección unida.
2. **El bloque del sujeto**, con la línea de lienzo delante — rellena las
   medidas con las vigentes de
   [`public/assets/v3/README.md`](../../../public/assets/v3/README.md#lienzo-y-formato),
   no las escribas de memoria:

   > Ilustración de \[tamaño\], ratio \[ratio\], **vertical**, a sangre, sin
   > transparencia. **Plano general, cámara alejada**: el personaje completo de
   > la coronilla a los pies **y entorno alrededor**; el cuerpo NO llena el
   > cuadro. **El personaje no toca ningún borde**: cabe otra cabeza entera de
   > aire por encima de la coronilla, se ve suelo por debajo de los pies antes
   > del borde, y a cada lado queda el hueco de un brazo. Va **centrado** en el
   > eje horizontal. El \[banda\] inferior lo cubre la banda del nombre: ahí solo
   > suelo. Cámara a la altura del pecho, lente neutra. Legible en miniatura.
   >
   > *(El \[alto\] de la figura no va en el prompt: es criterio de comprobación
   > posterior. Un modelo de imagen no mide porcentajes — el aire se pide con
   > anclas.)*
   >
   > **SUJETO:** \[raza + clase, o nombre de la unidad\]
   > **CUERPO:** \[la complexión de **este** sujeto, dentro del rango de su raza\]
   > **EDAD:** \[década concreta, o «sin edad» si su raza lo es\]
   > **ROSTRO:** \[rasgos de raza + la belleza que le toca, en positivo\]
   > **EQUIPO:** \[lo que aporta la clase o el tier\]
   > **POSE:** \[qué está haciendo, de cuerpo entero\]
   > **ESCENARIO:** \[fondo, subordinado\]
   > **PALETA:** \[la de su raza, con su acento propio\]

   Los corchetes de la primera línea se rellenan con los valores vigentes de
   `public/assets/v3/README.md`; los del bloque, con el sujeto. Dos campos no
   admiten atajo:

   - **Ninguna pose se describe de cintura para arriba.** Si `POSE` no dice dónde
     están los pies, la IA los corta.
   - **`CUERPO`, `EDAD` y `ROSTRO` no se rellenan con la ficha de la raza.** Eran
     un solo campo, se rellenaban con «la anatomía de la raza» y por eso los doce
     sujetos de Humanos salieron con el mismo cuerpo joven y musculoso. La raza
     pone el rango; aquí va lo que este sujeto tiene dentro de él. «Adulto» a
     secas se lee como veinticinco años: pon la década.

3. **El negative prompt maestro** de [`style-guide.md`](style-guide.md#20-negative-prompt-maestro) §20, si la herramienta lo admite.

Escribe los campos en español y en frases cortas. La descripción manda sobre el
adjetivo: "el impacto ya certero, sin duda en el gesto" da mejor resultado que
"épico".

**La lista de sujetos, enumerada y lista para pasar a una IA, está en
[`../races-concept/sujetos.md`](../races-concept/sujetos.md)**: los 132 —44
héroes de clase y 88 unidades—, con su papel, qué Características obligan a algo
visible y en qué orden se generan. Vive allí porque los sujetos los decide el
diseño de raza, no la dirección de arte; aquí se dice cómo se ven.

**Los bloques definitivos, montados y listos para pegar, viven en
[`../races-concept/prompts/`](../races-concept/prompts/preambulo.md)** — **las
once razas escritas, los 132 sujetos**. Son doce archivos:
[`preambulo.md`](../races-concept/prompts/preambulo.md) con lo invariante
—prompt base, formato, encuadre, negative prompt, checklists—, que se pega una
vez, y uno por raza con su identidad, su rango anatómico, su reparto de edad y
belleza, y sus 12 bloques. El preámbulo vive aparte **porque el encuadre no puede
estar once veces**: la primera vez que hubo que corregirlo, corregirlo en once
sitios habría sido garantía de dejarse uno.

No están en este documento, aunque antes se dijera que lo estarían: un bloque
necesita la identidad de su raza y la lista de sujetos, y las dos viven en
`races-concept/`.
Aquí queda el criterio; allí, el texto que se pega. El formato de v2
([`../../v2/art-direction/cards.md`](../../v2/art-direction/cards.md)) sirve
como referencia de **cómo se escribe un bloque**, nunca de contenido: sus
categorías Arma, Armadura y Mercenario no existen en V3.

## 4. Coherencia: qué se mueve por raza y qué no

V3 organiza todo por **raza**, y eso tensiona la regla de consistencia (§22 de
la biblia): cada raza debe reconocerse de un vistazo, pero todas tienen que
parecer del mismo equipo artístico.

- **Se mueve por raza**: paleta, **rango** anatómico, edad característica, belleza, materiales y motivos del equipo, arquitectura del fondo, familia de siluetas.
- **Se mueve por papel** (clase o función): la complexión dentro del rango de su raza. Es el eje que faltaba.
- **Se mueve por tier**: masa, altura, cantidad de equipo, amenaza, edad y desgaste.
- **No se mueve nunca**: grosor y lenguaje de línea, sombreado por bloques, nivel de estilización, relación personaje/fondo, tratamiento del color.

Una raza se distingue por **color y silueta**, no por dibujarse distinto.

**Los ocho ejes de raza, con sus valores para las once, están en
[`../races-concept/sujetos.md`](../races-concept/sujetos.md#identidad-de-raza).**
Dos de ellos —**Edad** y **Belleza**— son nuevos, y su ausencia era un agujero
real: sin ellos la IA los rellena sola, y siempre con lo mismo. Solo la ficha de
Humanos está aprobada; en las otras diez son derivación de lo que ya decían.

## 5. Dónde se guarda

En [`public/assets/v3/`](../../../public/assets/v3/README.md), y esa es la
fuente única: allí están la estructura de carpetas, el nombre de archivo y el
formato. No los repito aquí para que no puedan contradecirse.

## 6. Checklist de entrega

La de [`style-guide.md`](style-guide.md#24-checklist-de-aprobación) §24, más
cinco comprobaciones propias de V3:

-   [ ] **Se ve el personaje entero, pies incluidos y apoyados en el suelo.** Cortado por el muslo, se descarta.
-   [ ] **Cabe otra cabeza de aire** por encima de la coronilla, y **se ve suelo** por debajo de los pies antes del borde. Si va justo, se descarta: es plano entero ajustado, no plano general.
-   [ ] **Va centrado** en el eje horizontal, y la figura no pasa del 72% de la altura.
-   [ ] **Es vertical.** Una imagen apaisada no entra en la carta sin perder media anchura.
-   [ ] **La complexión es la de su papel**, no la de su raza: el que no debe tener masa no la tiene.
-   [ ] **La edad se lee y es la que pide su bloque.** Si todos los sujetos de la raza parecen tener treinta años, el reparto no llegó.
-   [ ] **La belleza es la de su raza**, no la que da por defecto la IA.
-   [ ] **El fondo no compite**: sin contorno, casi monocromo, nada legible detrás, y el acento de la raza solo en el personaje ([`style-guide.md`](style-guide.md#16-fondos) §16).
-   [ ] Se reconoce la **raza** con la cara tapada.
-   [ ] Se reconoce la **clase** con el arma tapada.
-   [ ] Si es unidad, su **tier** se lee en la silueta junto a sus vecinos.
-   [ ] Sigue legible al tamaño real en pantalla, no solo a tamaño completo.
-   [ ] No hay texto, número, icono ni marco dibujado dentro de la imagen — todo eso lo pone el componente.
-   [ ] Medida, formato, extensión y nombre según [`public/assets/v3/README.md`](../../../public/assets/v3/README.md#lienzo-y-formato), y guardado en la carpeta que le toca.

## 7. Qué falta

- ~~**La identidad de cada raza**~~ → **resuelta**: la §4 nombra los **ocho** ejes que se mueven por raza —paleta, rango anatómico, edad, belleza, materiales, motivos, fondo, silueta— y los valores de las **11 razas** están en [`../races-concept/sujetos.md`](../races-concept/sujetos.md). Se deciden allí y no aquí porque son diseño de raza, no de estilo. Sin ellos una tirada larga inventaba una paleta por imagen — y, como se vio con los tres primeros héroes, también un cuerpo y una cara por defecto para todos. **Queda un resto**: solo la ficha de Humanos está aprobada; Edad y Belleza de las otras diez son derivación y hay que confirmarlas cuando le toque su turno.
- **Para las cartas**: el motor de combate ([`game-design.md`](../../../docs/v3/game-design.md) §4), y después la tabla de al menos un tipo en `docs/v3/cards/`.
- ~~**Para el lienzo de carta**~~ → **cerrado**: vertical 5:7, plano general con aire y figura centrada, en [`public/assets/v3/README.md`](../../../public/assets/v3/README.md#lienzo-y-formato). Sale de la carta construida (300×420) y lo comparten los cinco bocetos, así que no depende de cuál gane. Lo que sigue pendiente es **la medida del retrato**: no hay pantalla de héroe ni ficha de unidad que la dé.
- **Para la calibración**: aprobar el primer héroe de Humanos. V3 no tiene imagen de referencia contra la que juzgar el estilo (§14 de la biblia), y esa será la primera.
- **El diseño de la carta en sí** —marco, tipografía, disposición, Rareza— sin empezar. No es este documento.
