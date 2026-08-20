# CardGame — Ilustraciones de V3: dirección de arte

> **Esto cubre lo que se dibuja**: razas, héroes de clase, unidades, criaturas,
> objetos y escenas. Cómo se dibuja —línea, anatomía, color, materiales, luz—
> está en [`style-guide.md`](style-guide.md) y no se repite aquí.
>
> **Lo que NO cubre: el diseño de la carta.** El marco, la disposición de
> nombre, coste y texto, la tipografía y el tratamiento de la Rareza son otra
> disciplina y **todavía no están definidos en V3**. Cuando se definan, será su
> propio documento. Aquí la carta aparece solo como lo que es para el
> ilustrador: un recorte de un tamaño concreto con los bordes tapados.

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

## 2. Lienzo y encuadre

Hay dos encuadres, y solo uno tiene medida heredada.

| | Ilustración de carta | Retrato de héroe o unidad |
|---|---|---|
| Tamaño | **1536 × 1050 px** *(heredado, ver aviso)* | Sin decidir |
| Ratio | ~1,46:1, apaisado | Sin decidir |
| Sangrado | A sangre | A sangre |
| Transparencia | Ninguna | Ninguna |
| Aire | **≥10% en los cuatro bordes** | El que pida su pantalla |

El aire de la carta no es estética: **la ilustración va debajo de un marco que
tapa los bordes**. Nada importante —rostro, manos, arma, escudo, el elemento
distintivo— puede quedar pegado al filo.

> **Las dos medidas están pendientes de lo mismo: una pantalla construida.** El
> 1536×1050 viene de v2 y de la §18 de la biblia; V3 no ha decidido su marco de
> carta, así que es la medida heredada, no una tomada del componente que la va
> a pintar. Y no existe pantalla de selección de héroe ni ficha de unidad, así
> que el retrato no tiene medida en absoluto. Mientras tanto, usa el mismo
> ratio por consistencia y **deja margen de sobra**: recortar es barato,
> inventar el borde que faltaba no.

## 3. Plantilla de prompt

Cada bloque se escribe listo para pegar tal cual en la IA, en tres piezas:

1. **El prompt base universal** de [`style-guide.md`](style-guide.md#21-prompt-base-universal) §21 — idéntico en todo, es lo que mantiene la colección unida.
2. **El bloque del sujeto**, con la línea de lienzo delante:

   > Ilustración de 1536×1050px, ratio ~1,46:1, a sangre, sin transparencia.
   > Composición centrada, legible en miniatura, con ~10% de aire en los
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

Los bloques definitivos, sujeto a sujeto, se escriben en este mismo documento
—una sección por raza— según se vayan cerrando. El formato de v2
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

En [`../../../public/assets/v3/`](../../../public/assets/v3/README.md):

```
public/assets/v3/races/<raza>/            retratos de las 4 clases
public/assets/v3/races/<raza>/units/      las 8 unidades de su progresión
public/assets/v3/cards/<tipo>/            ilustraciones de carta, cuando haya cartas
```

Nombre de archivo: slug del nombre español, en minúsculas y sin acentos — la
norma completa, con ejemplos, en
[`../../../public/assets/v2/cards/README.md`](../../../public/assets/v2/cards/README.md#nombre-de-archivo).
Extensión `.webp`.

No crees una carpeta antes de tener la primera imagen dentro: una carpeta vacía
promete un catálogo que aún no existe.

## 6. Checklist de entrega

La de [`style-guide.md`](style-guide.md#24-checklist-de-aprobación) §24, más
cinco comprobaciones propias de V3:

-   [ ] Se reconoce la **raza** con la cara tapada.
-   [ ] Se reconoce la **clase** con el arma tapada.
-   [ ] Si es unidad, su **tier** se lee en la silueta junto a sus vecinos.
-   [ ] Respeta el ≥10% de aire en los cuatro bordes, y sigue legible al tamaño real en pantalla.
-   [ ] No hay texto, número, icono ni marco dibujado dentro de la imagen — todo eso lo pone el componente.

## 7. Qué falta

- **Para las cartas**: el motor de combate ([`game-design.md`](../../../docs/v3/game-design.md) §4), y después la tabla de al menos un tipo en `docs/v3/cards/`.
- **Para el lienzo**: el marco de carta de V3, y una pantalla de héroe o de unidad que dé medida al retrato.
- **Para la calibración**: un concepto de personaje de V3 aprobado que sustituya al Enano Guerrero de v2 en la §14 de la biblia.
- **El diseño de la carta en sí** —marco, tipografía, disposición, Rareza— sin empezar. No es este documento.
