# Biblia Visual --- Estilo Definitivo del Juego *(V3)*

> **Es la dirección de arte vigente**, la de V3, y gobierna todo lo que se
> dibuje a partir de ahora: razas, héroes, unidades, criaturas, cartas,
> sprites. Qué se dibuja en cada caso —los sujetos, el encuadre, la plantilla
> de prompt, dónde se guarda el archivo— está en
> [`illustrations.md`](illustrations.md), que se apoya en este documento y no
> lo repite. El **diseño de la carta** como objeto (marco, tipografía,
> disposición, Rareza) no es ninguno de los dos: está sin definir en V3.
>
> El estilo no cambió al cambiar el motor de reglas: **V3 se dibuja igual que
> v2, lo que cambia es a quién**. Por eso los prompts congelados de
> [`../../v2/art-direction/`](../../v2/art-direction/cards.md) siguen
> apuntando aquí: describen un catálogo muerto con un estilo que sigue vivo.
>
> **Aquí solo va el «cómo».** Las **medidas del archivo**, que estuvieron en la
> §18, dependen del componente que lo pinta y viven en
> [`public/assets/v3/README.md`](../../../public/assets/v3/README.md#lienzo-y-formato).
> Y el **concepto de calibración** (§14) está **pendiente**: V3 no tiene imagen
> de referencia, y la tendrá cuando se apruebe el primer héroe de Humanos.
> El mapa completo de la carpeta está en [`README.md`](README.md).

## 1. Identidad visual

**Nombre interno:** 2D Stylized Fantasy Comic

**Definición:** Ilustración 2D de fantasía cartoon estilizada con
estética de cómic de videojuego.

La sensación objetivo es la de un personaje de videojuego de fantasía
diseñado mediante dibujo y tinta, coloreado digitalmente con formas
gráficas y sombreado estilizado.

No debe parecer un render 3D convertido en ilustración, ni concept art
realista.

------------------------------------------------------------------------

## 2. Principio fundamental

La imagen se construye siguiendo esta jerarquía:

**Silueta → línea → forma → color → sombra → detalle**

La línea y la silueta son elementos estructurales del diseño.

------------------------------------------------------------------------

## 3. Contornos y lineart

Los contornos negros son una característica fundamental.

-   Contorno exterior negro o casi negro.
-   Líneas claramente visibles.
-   Grosor medio/grueso.
-   Variación de grosor.
-   Contornos exteriores más fuertes que las líneas interiores.
-   Líneas interiores para rostro, barba, ropa, armadura y equipo.
-   Aspecto de tinta dibujada a mano.
-   Pequeñas irregularidades naturales.

Usar líneas para definir arrugas, cicatrices, mechones, costuras,
correas, dedos, pliegues y detalles de armas.

**Evitar:** ausencia de contorno, líneas excesivamente finas, lineart
gris, vectorial demasiado perfecto.

------------------------------------------------------------------------

## 4. Anatomía

Anatomía estilizada y ligeramente exagerada:

-   Cabeza algo mayor que en anatomía realista.
-   Manos y pies ligeramente grandes.
-   Extremidades simplificadas.
-   Silueta muy clara.
-   Posturas expresivas.

La exageración sirve al diseño, pero no debe convertir a todos los
personajes en caricaturas infantiles.

**«Heroico» es el nivel de estilización, no el cuerpo de todo el mundo.** Esta
sección dice **cómo se dibuja** un cuerpo; **qué cuerpo toca** no se decide aquí
y no es global. La proporción y la masa se reparten en tres, y la lista está en
[`../races-concept/sujetos.md`](../races-concept/sujetos.md#el-reparto-quién-decide-el-cuerpo):

-   **la raza** fija el **rango** (escala en cabezas, rasgos de especie, techo y suelo de masa);
-   **el papel** —clase o tier— fija la complexión dentro de ese rango;
-   **el tier o el rango del sujeto** fija la edad y el desgaste.

Esta sección decía «proporciones heroicas» y «torso y hombros reforzados» como
norma universal, y eso fue lo que hizo salir a los tres primeros héroes de
Humanos jóvenes, esbeltos y musculosos, Mago y Sacerdote incluidos. **Un Mago no
tiene masa muscular y un Sacerdote de cincuenta años no tiene abdominales**, y
ninguna de las dos cosas es un fallo de estilización: es el reparto.

------------------------------------------------------------------------

## 5. Rostros

Los rostros deben ser expresivos, estilizados y reconocibles.

Se permiten narices grandes, mandíbulas marcadas, cejas fuertes,
arrugas, cicatrices, dientes imperfectos y asimetrías.

La personalidad es más importante que la perfección.

Evitar rostros genéricos, belleza perfecta y realismo fotográfico.

**Y la belleza es una decisión de raza, nunca el estado por defecto.** Toda IA de
imagen entrega caras jóvenes, simétricas y atractivas si no se le dice otra cosa,
y eso aplana el juego: los Elfos son la única raza a la que se le **pide** ser
hermosa —y fría, no dulce—; los Humanos son gente corriente; los Hombres rata
dan asco; los Constructos no tienen cara. El valor de cada raza está en su ficha
de [`../races-concept/sujetos.md`](../races-concept/sujetos.md#identidad-de-raza),
en el eje **Belleza**, y **se pide en positivo** en el campo `ROSTRO` de cada
sujeto. La edad va al lado, en su propio campo, con década concreta: «adulto» a
secas se lee como veinticinco años.

------------------------------------------------------------------------

## 6. Pelo y barba

No representar miles de pelos individuales.

Construir el cabello y la barba mediante:

-   grandes masas;
-   mechones definidos;
-   formas gráficas;
-   líneas de tinta;
-   grupos de detalle.

El pelo debe contribuir a la silueta del personaje.

------------------------------------------------------------------------

## 7. Cartoon adulto

El estilo es cartoon, pero **no infantil**.

La caricaturización debe aparecer principalmente en proporciones,
silueta, rostro, manos, equipo, expresiones y poses.

Los personajes pueden ser serios, oscuros, cansados o amenazantes.

**Cartoon no significa humorístico.**

------------------------------------------------------------------------

## 8. Sombreado

Sombreado gráfico y estilizado.

Estructura recomendada:

**Color base → sombra principal → sombra profunda → luz → pequeños
brillos**

Las sombras deben tener bordes relativamente definidos.

Prioridad:

**bloques de sombra \> degradados suaves**

Evitar el modelado fotorealista.

------------------------------------------------------------------------

## 9. Color

Paleta rica, profunda, saturada de forma controlada y contrastada.

Usar cuando corresponda:

-   luces cálidas + sombras frías;
-   personaje cálido + fondo frío;
-   tonos tierra + acentos saturados;
-   colores complementarios.

Cada personaje puede tener identidad cromática propia.

------------------------------------------------------------------------

## 10. Materiales

Los materiales deben reconocerse rápidamente mediante formas gráficas.

### Cuero

Grandes superficies, costuras seleccionadas, desgaste localizado y
sombras gráficas.

### Metal

Zonas claras/oscuras, brillos definidos, arañazos selectivos y reflejos
estilizados.

### Tela

Pliegues grandes y sombras gráficas.

### Madera

Textura limitada y líneas simples.

### Piedra

Grandes planos y grietas seleccionadas.

Evitar microtexturas fotográficas.

------------------------------------------------------------------------

## 11. Detalle

Regla:

> **Mucho detalle donde importa, poco donde no importa.**

**Máximo detalle:**

-   rostro;
-   ojos;
-   barba/pelo;
-   arma;
-   escudo;
-   elemento distintivo.

**Detalle medio:**

-   armadura;
-   ropa;
-   cinturón;
-   accesorios.

**Detalle NULO** —no «bajo», nulo: sin contorno y a un solo valor, según
la §16—:

-   fondo lejano;
-   cielo;
-   montañas;
-   vegetación distante;
-   arquitectura secundaria.

Esta lista decía «detalle bajo» y era demasiado suave: «bajo» le permite a una
IA dibujar un castillo entero con menos marcas, y eso sigue compitiendo con el
personaje. La escala de la §16 es la que manda.

------------------------------------------------------------------------

## 12. Silueta

Si rellenásemos al personaje completamente de negro, debería seguir
siendo reconocible.

La identidad debe depender de:

-   altura;
-   cuerpo;
-   cabeza;
-   pelo/barba;
-   arma;
-   escudo;
-   ropa;
-   accesorio característico.

Esto es especialmente importante porque los personajes deberán poder
convertirse posteriormente en sprites y animaciones RPG.

------------------------------------------------------------------------

## 13. Diseño de equipo

Las armas y armaduras deben estar diseñadas, no ser genéricas.

Cada héroe debería tener arma característica, silueta de arma propia y
elementos visuales distintivos.

Prioridad:

**legibilidad + personalidad + fantasía + funcionalidad**

No abusar del realismo histórico.

------------------------------------------------------------------------

## 14. Concepto de calibración — **pendiente**

Un concepto de calibración es la imagen contra la que se juzga si una generación
acierta el estilo. **V3 no tiene ninguna.**

La ocupará el **primer héroe de Humanos aprobado**
([`../races-concept/prompts/humanos.md`](../races-concept/prompts/humanos.md)):
es la raza piloto y lo primero que se ilustra, así que es lo primero que puede
calibrar. Hasta entonce, esta biblia se aplica sin imagen de referencia — las
§23 y §24 son lo que hace ese trabajo mientras tanto.

Cuando exista, no se escribe aquí: es un **sujeto**, y en este documento no van
sujetos.

------------------------------------------------------------------------

## 15. Poses

Preferir poses con personalidad:

-   tres cuartos;
-   cuerpo ligeramente girado;
-   peso natural;
-   arma preparada;
-   escudo protegiendo;
-   torso ligeramente inclinado;
-   sensación de movimiento contenido.

Evitar postura de maniquí, brazos pegados al cuerpo y frontalidad
rígida.

La pose se resuelve **de cuerpo entero y con los pies apoyados en el suelo**: es
lo que pide el encuadre de la §18, y una pose pensada de cintura para arriba
acaba obligando a recortar.

------------------------------------------------------------------------

## 16. Fondos

El fondo debe ser fantástico, pero secundario.

Puede incluir bosques, montañas, castillos, ruinas, fortalezas, aldeas,
caminos, mazmorras, campos de batalla, templos, torres, puentes, niebla
y magia.

### 16.1 · Tres planos, y solo tres

**«Secundario» y «no robar protagonismo» no son instrucciones, son deseos**, y
una IA los cumple a su manera: el primer Guerrero de Humanos salió con un
castillo de sillares contados, dos estandartes y una bandera con un león
legible. Eso es una segunda ilustración detrás del personaje. La jerarquía se
pide con valores, no con adjetivos:

| Plano | Línea | Saturación | Valor | Detalle |
|---|---|---|---|---|
| **Personaje** | Contorno negro grueso + líneas interiores completas | **100%** | Rango completo: su negro es el más negro y su luz la más clara de la imagen | Máximo |
| **Plano medio** | Línea **fina**, o ninguna | ~50% | Comprimido hacia el valor del fondo | Siluetas legibles, sin textura ni marcas |
| **Fondo lejano** | **SIN línea.** Solo manchas planas | ~20%, casi monocromo | **Un solo valor**, plano y claro | Ninguno |

**Lo que se pierde con la distancia es LA LÍNEA, no el foco.** Esta es la
traducción a nuestro idioma de lo que hace la pintura con el desenfoque: en un
dibujo entintado un fondo borroso se lee como un error, y además el negativo
maestro prohíbe los degradados fotográficos. Aquí la profundidad se construye
retirando el contorno y comprimiendo el valor — perspectiva aérea, no
profundidad de campo. **Nada de `bokeh`, nada de desenfoque de lente.**

### 16.2 · Cuatro prohibiciones

1. **Nada legible detrás.** Ni heráldica que se pueda identificar, ni caras, ni
   ventanas que se puedan contar, ni juntas de sillería. Si el ojo puede leer un
   objeto del fondo, ese objeto compite.
2. **El acento de la raza NO aparece en el fondo lejano.** El oro de los
   Humanos, el granate enano, el ámbar élfico, la brasa demoníaca: el acento es
   lo que distingue a la raza a 100 px
   ([`../races-concept/sujetos.md`](../races-concept/sujetos.md#identidad-de-raza)),
   y si está también detrás, deja de señalar al personaje. El fondo se queda con
   los dominantes, desaturados.
3. **Las dos esquinas de arriba van tranquilas**: valor plano y uniforme, sin
   silueta que las cruce. Encima se imprimen números
   ([`../card-concept/`](../card-concept/README.md)), y un número sobre un
   estandarte no se lee.
4. **Como mucho dos planos de fondo.** Un escenario con cinco capas de
   profundidad es un paisaje, y esto es una carta.

### 16.3 · La excepción: los colosales

Los sujetos de tier 7 y 8 usan el fondo **como vara de medir** —el castillo
minúsculo que dice que el dragón es enorme—, así que ahí el fondo lejano **sí
conserva una silueta reconocible**. Sigue sin línea, plano y desaturado: es una
silueta que da escala, no un edificio dibujado. Es la única excepción, y está
así en sus bloques de prompt.

------------------------------------------------------------------------

## 17. Iluminación

Dramática pero estilizada.

Puede utilizar:

-   luz principal cálida;
-   sombras frías;
-   rim light;
-   luz ambiental;
-   pequeños brillos;
-   contraste fuerte.

Evitar fotografía, iluminación físicamente perfecta, HDR hiperrealista y
reflejos complejos.

La luz debe parecer diseñada para una ilustración.

### 17.1 · Dos cosas que no se eligen por imagen

Lo de arriba es la paleta de recursos; estas dos son fijas, y lo son porque hay
**132 imágenes** que tienen que parecer de la misma mano:

- **La luz principal entra siempre desde ARRIBA A LA IZQUIERDA.** Da igual el
  escenario. Con la dirección libre, cada generación elige la suya y una
  cuadrícula de cartas queda incoherente aunque cada carta esté bien.
- **El contraluz no es opcional: es lo que separa la figura del fondo.** Un
  filete de luz recorriendo el contorno del personaje por el lado contrario a la
  luz principal. Con el fondo aplanado y desaturado de la §16, el contraluz es lo
  que evita que la silueta se pegue al escenario — y es el mismo recurso que usan
  las cartas de referencia para despegar al personaje de la neblina.

------------------------------------------------------------------------

## 18. Encuadre

Lo que es estilo son tres cosas, y las tres se piden en positivo porque una IA
por defecto no las da:

**1. Plano entero.** El personaje se ve **completo, de la coronilla a los pies**,
con los pies apoyados en suelo visible. Ni busto, ni plano medio, ni primer
plano: si la figura se corta por el muslo, la ilustración está mal aunque el
dibujo sea bueno. Es lo que se pinta en una carta, no un retrato.

**2. Centrado y de tamaño contenido.** El eje del cuerpo va en el centro
horizontal de la imagen, y **la figura ocupa dos tercios de la altura, no la
altura entera**. La tentación de la IA es acercarse; hay que alejarla. Un sujeto
ancho (una montura) o enorme (un dragón) se resuelve **retrocediendo la cámara**,
nunca recortándolo: una silueta pequeña y entera se lee, media silueta grande no.

**3. Aire en los cuatro bordes**, y el fondo sí puede llegar al filo aunque el
personaje no. Nada importante —rostro, manos, armas, escudo— pegado al borde, y
menos en las esquinas: encima va un marco que los tapa, y abajo una banda opaca
con el nombre.

Cámara a la altura del pecho y lente neutra. El contrapicado y el gran angular
engordan al sujeto y le comen los pies — que es justo el fallo que hay que
evitar.

**Las medidas no son estilo y no viven aquí**: tamaño, ratio, sangrado,
transparencia y los porcentajes exactos de aire, alto de figura y banda útil
están en
[`public/assets/v3/README.md`](../../../public/assets/v3/README.md#lienzo-y-formato),
porque dependen del componente que va a pintar la imagen. Lo que sí está cerrado
allí es que el lienzo es **vertical**: la carta de V3 lo es, y el arte va a
sangre dentro de ella.

------------------------------------------------------------------------

## 19. Compatibilidad con sprites

Los diseños deben funcionar en ilustración grande y en representación
pequeña.

Por ello:

-   silueta clara;
-   pocos elementos microscópicos;
-   colores identificables;
-   armas separadas visualmente del cuerpo;
-   accesorios grandes;
-   ropa diferenciable;
-   rostro reconocible;
-   proporciones consistentes.

------------------------------------------------------------------------

## 20. Negative prompt maestro

Cuando la IA permita instrucciones negativas:

> photorealistic, hyperrealistic, realistic concept art, photographic
> skin, skin pores, realistic hair strands, realistic metal reflections,
> realistic leather texture, cinematic photorealism, 3D render,
> realistic 3D character, glossy 3D materials, realistic anatomy, overly
> detailed armor, excessive microdetails, smooth airbrushed painting,
> oil painting, watercolor, soft photographic gradients, no outlines,
> thin outlines, generic fantasy character, anime, manga, pixel art,
> low-poly, text, logo, watermark, UI, frame, close-up, extreme
> close-up, portrait crop, bust shot, half body, waist-up, cowboy shot,
> cropped legs, cropped feet, cut off at the knees, feet out of frame,
> subject touching frame edge, off-center subject, landscape
> orientation, wide-angle lens, extreme low angle, fashion model,
> supermodel, cover model, glamour shot, beauty portrait, makeup,
> lipstick, airbrushed face, flawless poreless skin, perfectly
> symmetrical face, idealized beauty, sexy, cleavage, bare midriff,
> detailed background, busy background, cluttered background, competing
> background detail, readable background architecture, background
> outlines, bokeh, depth of field, lens blur, out-of-focus background,
> scenic landscape, five-layer depth

> **Añadido el bloque de fondo** (21 de agosto de 2026): de
> `detailed background` a `five-layer depth`. Tercera vez que el mismo tipo de
> fallo cuesta una tirada: la §16 decía «secundario» y «no robar protagonismo»,
> que son deseos y no instrucciones, y el primer Guerrero salió con un castillo
> de sillares contados y una bandera legible detrás. **Y fíjate en que `bokeh`,
> `depth of field` y `lens blur` están PROHIBIDOS, no pedidos**: la referencia que
> inspiró esta regla es pintura y difumina, pero aquí se dibuja a tinta y un fondo
> borroso parece un error. Lo que se retira con la distancia es la línea.

> **Añadido el bloque de encuadre** (21 de agosto de 2026): de `close-up` a
> `extreme low angle`. Los tres primeros héroes de Humanos salieron en plano
> medio, cortados por el muslo y con la figura fuera del eje, porque el encuadre
> se pedía solo en positivo y la IA por defecto se acerca. La §18 lo pide en
> positivo **y** aquí se prohíbe lo contrario: hacen falta las dos.

> **Añadido el bloque de belleza** (misma fecha): de `fashion model` a
> `bare midriff`. Mismo fallo por otro lado — los tres héroes salieron guapos,
> jóvenes y musculosos, y en el Mago y el Sacerdote eso no tiene sentido.
>
> **Ojo con lo que NO está en esa lista, y es a propósito:** ni `muscular`, ni
> `athletic build`, ni `young`, ni `handsome`, ni `beautiful`. Prohibirlos
> rompería al Guerrero, al Paladín, a los Orkos enteros, al Miliciano —que es
> joven a propósito— y a los Elfos, que **son** hermosos por diseño de raza. Es
> la misma lección que `heavy plate armor`: **al negativo solo va lo que ningún
> sujeto del juego quiere nunca**. El cuerpo, la edad y la cara que sí tocan se
> piden en positivo, sujeto a sujeto, con los ejes de raza de
> [`../races-concept/sujetos.md`](../races-concept/sujetos.md#identidad-de-raza).

> **Retiradas `pristine heroic armor` y `heavy plate armor`** (20 de agosto de
> 2026). Venían de calibrar el estilo contra un personaje de cuero gastado, y V3
> sí tiene sujetos de placa completa y reluciente: el Paladín de tier 7 de
> Humanos, el Caballero, los Constructos enteros. Con ellas puestas había que
> acordarse de retirarlas a mano en cada uno, y eso se olvida.
>
> Lo que protegían —que un tier 1 no salga heroico ni impecable— **se dice ahora
> en positivo**, sujeto a sujeto: el bloque del Miliciano pide gambesón remendado
> y «nada de oro, ni un remache». Es más fiable pedir la pobreza que prohibir la
> riqueza.

------------------------------------------------------------------------

## 21. Prompt base universal

> **Ilustración 2D de fantasía cartoon estilizada con estética de cómic
> de videojuego. Personaje diseñado mediante dibujo y tinta, con
> contornos exteriores negros gruesos y expresivos y líneas interiores
> visibles que definen rostro, ropa, equipo y materiales. Anatomía
> heroica estilizada y ligeramente exagerada, silueta extremadamente
> clara y reconocible, rostro expresivo y lleno de personalidad. Colores
> ricos y saturados de forma controlada, grandes formas de color y
> sombreado gráfico mediante bloques de sombra claramente definidos, con
> pocos degradados suaves. Detalle selectivo: máximo detalle en rostro,
> cabello/barba y elementos distintivos; menor detalle en ropa y fondo.
> Materiales reconocibles mediante formas gráficas y pequeñas marcas
> dibujadas, evitando microtexturas fotorealistas. Fondo de fantasía
> medieval estilizado y atmosférico, subordinado al personaje. Aspecto
> de personaje diseñado para un videojuego de fantasía 2D moderno,
> expresivo, jugable y preparado visualmente para futuras animaciones y
> sprites.**

Añadir después:

> **CUERPO:** \[complexión de este sujeto, dentro del rango de su raza\]\
> **EDAD:** \[década concreta, o «sin edad» si su raza lo es\]\
> **ROSTRO:** \[rasgos + la belleza que le toca a su raza, en positivo\]\
> **EQUIPO:** \[equipo\]\
> **PERSONALIDAD:** \[personalidad\]\
> **POSE:** \[pose, de cuerpo entero\]\
> **ESCENARIO:** \[escenario\]\
> **PALETA:** \[colores\]

Los tres primeros campos eran uno solo, **PERSONAJE**, y por eso se rellenaban
con la anatomía de la raza y los doce sujetos salían iguales. Separados, cada uno
obliga a una decisión: **cuánta masa**, **cuántos años** y **qué cara**. El
reparto de quién decide cada cosa está en la §4.

------------------------------------------------------------------------

## 22. Regla de consistencia

### NO cambiar entre personajes

-   lenguaje de línea;
-   grosor aproximado del contorno;
-   tratamiento del sombreado;
-   nivel general de estilización;
-   anatomía base;
-   tratamiento de materiales;
-   nivel de detalle;
-   relación personaje/fondo;
-   tratamiento general del color.

### SÍ cambiar

-   raza;
-   clase;
-   rostro;
-   cuerpo;
-   ropa;
-   armadura;
-   armas;
-   colores propios;
-   personalidad;
-   pose;
-   escenario;
-   accesorios.

La colección debe parecer creada por el mismo equipo artístico.

------------------------------------------------------------------------

## 23. Regla de oro

La imagen debe poder describirse como:

> **"Un personaje de fantasía de videojuego dibujado como un cartoon de
> cómic, con contornos negros fuertes, formas exageradas, colores ricos
> y sombras gráficas."**

Si una generación empieza a parecer fotografía, pintura realista,
concept art hiperrealista, render 3D, anime, manga, pixel art, low-poly
o cartoon infantil, está fuera del estilo.

------------------------------------------------------------------------

## 24. Checklist de aprobación

-   [ ] Contorno negro claramente visible.
-   [ ] Se percibe como dibujo 2D.
-   [ ] Anatomía estilizada.
-   [ ] **La complexión es la de su papel, no la de su raza** (§4): el que no debe tener masa, no la tiene.
-   [ ] **La edad se lee, y es la que le toca** (§4). Si todos los sujetos de la raza parecen tener treinta años, está mal.
-   [ ] **La belleza es la de su raza** (§5), no la que la IA da por defecto. Un humano corriente no es guapo; un elfo sí.
-   [ ] Silueta reconocible.
-   [ ] Rostro con personalidad.
-   [ ] Colores ricos y gráficos.
-   [ ] Sombras principalmente gráficas.
-   [ ] Pocos degradados fotográficos.
-   [ ] Detalle concentrado en zonas importantes.
-   [ ] Equipo reconocible.
-   [ ] **El fondo lejano no tiene ni una línea de contorno** (§16). Si tiene, no es fondo: es un segundo dibujo.
-   [ ] **No se puede leer ningún objeto del fondo** — ni heráldica, ni caras, ni ventanas contables (§16).
-   [ ] **El acento de color de la raza no está en el fondo**, solo en el personaje (§16).
-   [ ] **Las dos esquinas de arriba están tranquilas**, sin silueta que las cruce: ahí van números (§16).
-   [ ] **Hay contraluz** y la figura se despega del fondo (§17).
-   [ ] La luz principal viene de arriba a la izquierda (§17).
-   [ ] Puede convertirse posteriormente en sprite.
-   [ ] Pertenece visualmente al mismo videojuego.
-   [ ] No hay fotorealismo.
-   [ ] No parece un render 3D.
-   [ ] No hay exceso de microdetalle.
-   [ ] **Se ve el personaje entero, pies incluidos** (§18). Si está cortado por el muslo, se descarta sin mirar nada más.
-   [ ] **La figura va centrada** y ocupa unos dos tercios de la altura, no toda (§18).
-   [ ] Nada importante pegado al borde (§18).
-   [ ] No contiene texto, logos, marcas de agua ni interfaz.

Esto comprueba el **estilo**. Que el archivo entregado tenga la medida, el
formato y el nombre correctos se comprueba aparte:
[`illustrations.md`](illustrations.md#6-checklist-de-entrega) §6.

------------------------------------------------------------------------

## 25. Instrucción para otra IA

> **Este documento es la Biblia Visual definitiva del juego. Todas las
> imágenes futuras deben seguir sus reglas. No reinterpretar el estilo
> como realismo, concept art cinematográfico, anime, pintura realista,
> render 3D o cartoon infantil. El elemento visual más importante es el
> lenguaje de dibujo 2D: contornos negros fuertes y visibles, formas
> estilizadas, anatomía ligeramente exagerada, colores ricos y sombreado
> gráfico por bloques. Mantener la misma identidad visual entre todos
> los personajes aunque cambien sus razas, clases, armas, colores y
> escenarios.**
