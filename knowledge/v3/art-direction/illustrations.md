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

- **La clase se lee en el equipo y la pose**: qué empuña, cómo lo empuña, dónde tiene el peso. Un Guerrero planta los pies; un Mago no.
- **La raza se lee en el cuerpo, la cara y la paleta**: anatomía, proporción, piel, motivos y materiales.

Si tapas la cara y sigues sabiendo la clase, y tapas el arma y sigues sabiendo
la raza, está bien resuelto.

### Unidades

Ocho por raza, en progresión de tier — de Miliciano a Dragón Dorado, de Minero
a Coloso de adamantita. **La escalada tiene que verse en la silueta**, no solo
en la calidad del equipo: cada escalón crece en masa, en altura o en amenaza
respecto al anterior. Puestas las ocho en fila, el orden debe ser evidente sin
leer un solo número.

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

- **Ilustración de carta** — apaisada, a sangre, con el personaje centrado y aire
  en los cuatro bordes, porque encima va un marco que los tapa. Se juzga en
  miniatura: si no se lee al tamaño real en pantalla, da igual lo buena que sea
  a tamaño completo.
- **Retrato de héroe o unidad** — no tiene pantalla todavía, así que no tiene
  encuadre cerrado. Dibújalo con el mismo criterio y **deja margen de sobra**:
  recortar es barato, inventar el borde que faltaba no.

**Las medidas no están aquí.** Tamaño, ratio, sangrado, transparencia, aire
exacto y extensión son especificación del archivo entregado y viven en
[`public/assets/v3/README.md`](../../../public/assets/v3/README.md#lienzo-y-formato),
junto a las rutas y el nombre. Las dos están pendientes de lo mismo —una
pantalla construida— y ese aviso está allí.

## 3. Plantilla de prompt

Cada bloque se escribe listo para pegar tal cual en la IA, en tres piezas:

1. **El prompt base universal** de [`style-guide.md`](style-guide.md#21-prompt-base-universal) §21 — idéntico en todo, es lo que mantiene la colección unida.
2. **El bloque del sujeto**, con la línea de lienzo delante — rellena las
   medidas con las vigentes de
   [`public/assets/v3/README.md`](../../../public/assets/v3/README.md#lienzo-y-formato),
   no las escribas de memoria:

   > Ilustración de \[tamaño\], ratio \[ratio\], a sangre, sin transparencia.
   > Composición centrada, legible en miniatura, con \[aire\] de aire en los
   > cuatro bordes (especialmente las esquinas) porque un marco decorativo los
   > va a tapar.
   >
   > **SUJETO:** \[raza + clase, o nombre de la unidad\]
   > **CUERPO Y ROSTRO:** \[lo que aporta la raza\]
   > **EQUIPO:** \[lo que aporta la clase o el tier\]
   > **POSE:** \[qué está haciendo\]
   > **ESCENARIO:** \[fondo, subordinado\]
   > **PALETA:** \[la de su raza, con su acento propio\]

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
[`../races-concept/prompts/`](../races-concept/prompts/humanos.md)** —un archivo
por raza, `humanos.md` escrito y las otras diez pendientes. No están en este
documento, aunque antes se dijera que lo estarían: un bloque necesita la
identidad de su raza y la lista de sujetos, y las dos viven en `races-concept/`.
Aquí queda el criterio; allí, el texto que se pega. El formato de v2
([`../../v2/art-direction/cards.md`](../../v2/art-direction/cards.md)) sirve
como referencia de **cómo se escribe un bloque**, nunca de contenido: sus
categorías Arma, Armadura y Mercenario no existen en V3.

## 4. Coherencia: qué se mueve por raza y qué no

V3 organiza todo por **raza**, y eso tensiona la regla de consistencia (§22 de
la biblia): cada raza debe reconocerse de un vistazo, pero todas tienen que
parecer del mismo equipo artístico.

- **Se mueve por raza**: paleta, anatomía característica, materiales y motivos del equipo, arquitectura del fondo, familia de siluetas.
- **Se mueve por tier**: masa, altura, cantidad de equipo, amenaza.
- **No se mueve nunca**: grosor y lenguaje de línea, sombreado por bloques, nivel de estilización, relación personaje/fondo, tratamiento del color.

Una raza se distingue por **color y silueta**, no por dibujarse distinto.

## 5. Dónde se guarda

En [`public/assets/v3/`](../../../public/assets/v3/README.md), y esa es la
fuente única: allí están la estructura de carpetas, el nombre de archivo y el
formato. No los repito aquí para que no puedan contradecirse.

## 6. Checklist de entrega

La de [`style-guide.md`](style-guide.md#24-checklist-de-aprobación) §24, más
cinco comprobaciones propias de V3:

-   [ ] Se reconoce la **raza** con la cara tapada.
-   [ ] Se reconoce la **clase** con el arma tapada.
-   [ ] Si es unidad, su **tier** se lee en la silueta junto a sus vecinos.
-   [ ] Sigue legible al tamaño real en pantalla, no solo a tamaño completo.
-   [ ] No hay texto, número, icono ni marco dibujado dentro de la imagen — todo eso lo pone el componente.
-   [ ] Medida, formato, extensión y nombre según [`public/assets/v3/README.md`](../../../public/assets/v3/README.md#lienzo-y-formato), y guardado en la carpeta que le toca.

## 7. Qué falta

- ~~**La identidad de cada raza**~~ → **resuelta**: la §4 nombra los ejes que se mueven por raza —paleta, anatomía, materiales, motivos, fondo, silueta— y los valores de las **11 razas** están en [`../races-concept/sujetos.md`](../races-concept/sujetos.md). Se deciden allí y no aquí porque son diseño de raza, no de estilo. Sin ellos una tirada larga inventaba una paleta por imagen.
- **Para las cartas**: el motor de combate ([`game-design.md`](../../../docs/v3/game-design.md) §4), y después la tabla de al menos un tipo en `docs/v3/cards/`.
- **Para el lienzo**: el marco de carta de V3 ([`../card-concept/`](../card-concept/README.md)), y una pantalla de héroe o de unidad que dé medida al retrato. Los dos pendientes están anotados donde vive la medida.
- **Para la calibración**: aprobar el primer héroe de Humanos. V3 no tiene imagen de referencia contra la que juzgar el estilo (§14 de la biblia), y esa será la primera.
- **El diseño de la carta en sí** —marco, tipografía, disposición, Rareza— sin empezar. No es este documento.
