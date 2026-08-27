# Prompts — ⛏️ Enanos

> **Los 12 sujetos de Enanos, montados y listos para pegar.** Traducción a prompt
> de la cola de [`../sujetos.md`](../sujetos.md): allí está *quién* es cada uno y
> por qué; aquí está *lo que se pega en la IA*.

> ✅ **GENERADA, las doce, la noche del 26 de agosto de 2026.** Están en
> `public/assets/v3/races/enanos/` y `enanos/units/` con los slugs de §"Al
> terminar", y cableadas en `components/design/v3/races.ts`, así que se ven en
> **Cartas › Diseño baraja** (`/docs/v3/cards/deck`). Son **provisionales**, como
> todo el arte de V3 (`public/assets/v3/README.md`): el lienzo salió bien —las
> doce verticales, siete en 5:7 y cinco en el 2:3 que la norma autoriza— y el
> **encuadre no**, con los pies entre el 82% y el 89% cuando el tope son 72.
>
> **Se generó saltándose el orden que decía este mismo aviso**, y el aviso queda
> aquí porque su premisa se invirtió: decía «Fase 2: entra cuando Humanos esté
> cerrado» porque sin las 12 imágenes de la raza piloto no habría vara de medir
> cuánta masa es un tier 8 ni cuánto acento es «acento». Humanos sigue en 8 de 12
> y Enanos está entera, así que **la vara de medir es esta raza**: es la única con
> la progresión de ocho tiers a la vista. Los ejes **Edad** y **Belleza** de esta
> ficha eran derivación de su identidad y no diseño aprobado — se tiraron sin
> confirmar, y el resultado (doce enanos que leen mayores, anchos y sin una cara
> agraciada) es lo que hay que dar por bueno o corregir en la próxima vuelta.

## Antes de este archivo, el preámbulo

Pega primero [`preambulo.md`](preambulo.md) —prompt base, formato, encuadre y
negative prompt, comunes a las once razas— y `style-guide.md` como contexto. Aquí
solo va lo de Enanos.

---

## Identidad de raza — pegar una vez, después del preámbulo

```
IDENTIDAD DE RAZA — ENANOS, común a todos los sujetos:
Paleta: gris piedra y hierro oscuro dominantes, granate como acento (capas,
penachos, tejido) y latón cálido en lo mecánico. El granate es lo ÚNICO saturado
de la imagen. Materiales: hierro forjado sin pulir, piedra tallada, cuero grueso,
latón en lo mecánico — NADA de acero brillante, eso es de Humanos. Motivos: nudos
geométricos angulares, remaches gruesos, runas grabadas rectas. Fondo: galería de
mina, forja, arco de piedra tallada; espacios bajos y cerrados. Silueta: trapecio
invertido macizo; en los tiers altos MÁS ANCHOS QUE ALTOS.

RANGO ANATÓMICO — es un rango, NO el cuerpo de todos:
~4,5 cabezas. Bajos y anchísimos, masa en hombros y antebrazos, manos grandes.
La barba es ESTRUCTURA, no adorno: define el contorno del pecho. NINGUNO puede
ser esbelto — el rango va de macizo a enorme, y el más flaco de la raza sigue
siendo más ancho que un humano. Dentro de eso sí hay diferencia: el Minero es
fibroso y seco, el Guardia de hierro es un bloque.

REPARTO — ENANOS. Manda sobre el gusto por defecto de la IA:
EDAD: TODOS leen mayores, de 40 para arriba, incluso el tier 1. Arrugas
profundas, canas en la barba, piel curtida de forja, nudillos hinchados. Un enano
joven no se distingue de uno viejo y está bien: la edad no es el eje que separa
sus tiers.
BELLEZA: NINGUNA, y con orgullo. Narices grandes y rotas, cejas pesadas y
salientes, cicatrices de trabajo, dientes desgastados, orejas peludas. Su
dignidad viene del oficio y del porte, nunca de la cara. Nada de enanos
simpáticos de cuento ni de barbas peinadas y limpias.

REGLA DE PROGRESIÓN: la escalada de esta raza crece A LO ANCHO, no hacia arriba.
Un tier 8 enano no es más alto que un tier 1, es el doble de ancho. Y el latón
aparece con el rango: ausente abajo, mecanismo pleno arriba.
```

---

## Héroes de clase (4)

**Son individuos**: el personaje que juega el jugador. Protagonista, equipo
personal con historia, «este tiene nombre».

### 1 · ⚔️ Guerrero

```
QUÉ ES: héroe de clase. Un individuo, protagonista, con nombre propio. Equipo
personal y con historia, no de dotación.
SUJETO: Guerrero enano. Tanque de combate cuerpo a cuerpo.
CUERPO: El techo de masa de la raza junto al Guardia de hierro: tronco como un
barril, hombros más anchos que la cadera con mucho, cuello inexistente,
antebrazos enormes. Piernas cortas y muy separadas. Centro de gravedad bajísimo.
EDAD: Unos 120 años enanos — lee como un humano de 55. Veterano de galerías.
ROSTRO: Cara ancha y aplastada, nariz grande y torcida, cejas pesadas que le
tapan media mirada. Arrugas profundas, piel gris-rosácea curtida por el calor de
la forja, una ceja partida por cicatriz. BARBA GRIS ENTRECANA hasta el pecho,
trenzada y con anillas de hierro; es la mitad de su silueta. Mirada firme y
tozuda. No es agraciado y no le importa.
EQUIPO: Coraza de placas de hierro forjado sin pulir, gruesa y abollada, sobre
cota de anillas; hombreras enormes y desiguales. Capa corta granate. Hacha de
guerra a una mano de cabeza pesada y escudo cuadrado de hierro remachado con un
nudo geométrico grabado. Guanteletes de placa. Latón solo en la hebilla.
DEBE VERSE: que no se le mueve. Ancho y bajo, plantado como un yunque.
POSE: Plantado, piernas separadas, escudo adelantado y hacha baja. Quieto, no en
carrera. Cuerpo entero: se le ven las botas claveteadas sobre la piedra.
ESCENARIO: Arco de piedra tallada de una galería, forja al fondo con brasa roja.
Espacio bajo y cerrado, desenfocado.
PALETA: gris piedra e hierro oscuro dominantes, granate en la capa, latón mínimo.
```

### 2 · ⚙️ Ingeniero

```
QUÉ ES: héroe de clase. Un individuo, protagonista. NO es la unidad Ingeniero de
tier 4: este es único y se le nota en el aparato y en el desgaste.
SUJETO: Ingeniero enano. Trampas y artefactos.
CUERPO: El más ligero de los cuatro héroes, y aun así ancho: tronco compacto,
espalda cargada de acarrear peso, manos grandes y quemadas. Sin masa de combate.
EDAD: Lee como un humano de 60. El más viejo de los cuatro.
ROSTRO: Cara ancha manchada de grasa y hollín, arrugas por todas partes, nariz
bulbosa. UN OJO tapado por una lupa de latón sujeta con correa a la cabeza — el
otro entrecerrado. Barba entrecana CORTA Y CHAMUSCADA por los lados, no larga:
es un riesgo laboral y se le nota. Cejas quemadas. Expresión de estar a medias en
otra cosa.
EQUIPO: Nada de coraza: mandil de cuero grueso lleno de bolsillos, quemaduras y
herramientas colgando, sobre camisa de lana gris. Arnés de correas con viales,
llaves y muelles. Ballesta mecánica de latón y hierro con mecanismo visible en un
brazo, y una trampa de dientes plegada al cinto. Guantes de cuero desparejados.
Latón por todas partes: aquí es donde vive el acento mecánico de la raza.
DEBE VERSE: el MECANISMO. Engranaje, muelle y tubo a la vista, no una caja
cerrada. Y que no es un guerrero.
POSE: De pie, agachado ligeramente sobre una trampa que acaba de armar en el
suelo, una mano en el mecanismo y la otra con la ballesta apoyada. Cuerpo entero,
las botas y la trampa dentro del cuadro.
ESCENARIO: Banco de trabajo de forja, herramienta colgada, chispa. Subordinado.
PALETA: gris piedra e hierro oscuro dominantes, LATÓN cálido como acento
protagonista, granate mínimo en un trapo del cinto.
```

### 3 · 🪓 Berserker

```
QUÉ ES: héroe de clase. Un individuo, protagonista. Es el único enano de la lista
que va a pecho descubierto, y eso es su lectura.
SUJETO: Berserker enano. Furia y daño cuerpo a cuerpo.
CUERPO: Masa PURA y visible, porque no la tapa una coraza: tronco enorme,
pectorales y hombros como piedra, tripa sólida, antebrazos gruesos. Cubierto de
vello y de cicatrices. Es el cuerpo más expuesto de la raza.
EDAD: Lee como un humano de 45 — el más joven de los cuatro héroes, pero ya
castigado.
ROSTRO: Cara ancha congestionada y roja de furia, venas marcadas en la frente y
el cuello, dientes apretados y visibles, boca abierta gritando. Nariz partida más
de una vez. BARBA ROJIZA salvaje sin trenzar, con la punta atada; cresta de pelo
o cabeza medio afeitada con tatuajes de nudo geométrico. Cicatrices de hacha en
el pecho y en la cara. Ojos muy abiertos, inyectados. Feo y no pretende otra cosa.
EQUIPO: SIN armadura de tronco: correas de cuero grueso cruzadas al pecho
desnudo, brazales de hierro, faldón de cuero y placas colgantes, botas
claveteadas. Dos hachas de mano de FILO DENTADO Y MELLADO, una en cada mano,
manchadas. Sin escudo. Nada de latón, nada de oro.
DEBE VERSE: el FILO DENTADO de las hachas y la sangre en él, y el torso desnudo
lleno de cicatrices.
POSE: En el instante de arrancar a cargar: peso adelantado, hachas abiertas,
grito. Movimiento contenido, no en el aire — los dos pies en el suelo.
ESCENARIO: Galería con humo y brasa baja, sombras duras. Subordinado.
PALETA: gris piedra e hierro oscuro dominantes, GRANATE protagonista en la sangre
y las correas teñidas, piel rojiza. Sin latón.
```

### 4 · 🔯 Maestro de runas

```
QUÉ ES: héroe de clase. Un individuo, protagonista.
SUJETO: Maestro de runas enano. Magia rúnica.
CUERPO: El más enjuto de la raza, y aun así ancho de hombros: tronco compacto sin
masa de combate, espalda algo encorvada, manos grandes y llenas de callos de
cincel. Nada atlético.
EDAD: El MÁS VIEJO de los doce: lee como un humano de 70. El saber rúnico se mide
en décadas y eso está en el cuerpo.
ROSTRO: Cara profundamente arrugada, párpados caídos, nariz grande, pómulos
tapados por la carne y la barba. BARBA BLANCA hasta la cintura, trenzada en dos y
con anillas de piedra grabada. Cabeza calva o coronilla despoblada, con RUNAS
TATUADAS en el cráneo que brillan tenues. Mirada serena y absolutamente segura.
Muy viejo y muy feo, y es lo que le da autoridad.
EQUIPO: Sin coraza: túnica gruesa de lana gris hasta el suelo con ribete granate
y una capa de piel. Peto de placas de PIEDRA GRABADA colgado sobre el pecho, no
metal. Martillo de cantero de cabeza rúnica en una mano y un cincel al cinto —
sus armas son herramientas. Tablillas de piedra con runas encendidas colgando de
correas. Latón en las anillas.
DEBE VERSE: las RUNAS ENCENDIDAS, y que la luz es fría y está DENTRO de líneas
grabadas rectas, nunca difusa. Y que no lleva metal de guerra.
POSE: De pie, martillo apoyado en el suelo con las dos manos o una palma abierta
sobre una runa grande grabada en la pared. Solemne y quieta. Cuerpo entero, el
bajo de la túnica y las botas en el suelo.
ESCENARIO: Muro de piedra tallada cubierto de runas grabadas que dan la única luz
fría. Espacio bajo y cerrado.
PALETA: gris piedra e hierro oscuro dominantes, granate en el ribete, latón en
las anillas, y luz de runa fría muy contenida.
```

---

## Unidades (8) — progresión de tier

**Son tropa**: uno cualquiera de muchos. Equipo de dotación, repetible. Puede no
mirar al espectador: está en faena. El tier se lee en la **proporción** —y en
esta raza sobre todo en la ANCHURA—, nunca en lo grande que salga la figura
dentro del cuadro: eso es fijo en los 132.

### Tier 1 · ⛏️ Minero

```
QUÉ ES: unidad de tier 1. Tropa, no protagonista. Uno cualquiera de cincuenta. Es
el escalón más bajo de la raza y TIENE QUE VERSE POBRE: es la referencia contra la
que se mide todo lo que sube.
SUJETO: Minero enano. Infantería básica de cuerpo a cuerpo.
CUERPO: El más SECO de la raza: fibroso, nervudo, sin la masa de los demás —
aunque sigue siendo ancho de hombros para un humano. Espalda cargada, manos
desproporcionadamente grandes de picar piedra.
EDAD: Lee como un humano de 45. Aquí no hay jóvenes.
ROSTRO: Cara común, cubierta de polvo de piedra que se le mete en las arrugas.
Nariz grande, ojos entrecerrados de trabajar a oscuras, dientes desgastados.
Barba gris CORTA, mal cuidada y polvorienta. Expresión de cansancio de turno, no
de miedo ni de gloria. Nada notable: es su pobreza lo que se lee.
EQUIPO: LO MÍNIMO. Sin coraza y sin cota: camisa de lana gris remendada, mandil
de cuero gastado, rodilleras de cuero. Casco de minero de hierro simple con una
lámpara de aceite abollada, o sin casco. PICO de trabajo como arma —herramienta,
no arma de guerra— y nada más. Botas gastadas. NI LATÓN NI GRANATE en ninguna
parte: los dos acentos empiezan más arriba.
DEBE VERSE: nada especial, y que el arma es una HERRAMIENTA. No tiene ninguna
habilidad que mostrar y no hay que inventarle ninguna.
POSE: De pie, pico apoyado en el suelo o al hombro, hombros caídos, peso en una
pierna. En faena, nada épico. Cuerpo entero, botas en la roca.
ESCENARIO: Galería de mina muy desenfocada, vigas de madera, oscuridad.
PALETA: gris piedra e hierro oscuro apagados, cuero marrón sucio. Sin saturación,
sin granate y sin latón.
```

### Tier 2 · 🪓 Guerrero enano

```
QUÉ ES: unidad de tier 2. Tropa. Ligeramente por encima del Minero, pero sigue
siendo pobre.
SUJETO: Guerrero enano. Defensa y combate cuerpo a cuerpo.
CUERPO: Compacto y algo más lleno que el Minero, con masa real en hombros y
brazos. Sigue lejos del techo de la raza.
EDAD: Lee como un humano de 45.
ROSTRO: Cara ancha y corriente, curtida, nariz grande, alguna cicatriz pequeña.
Barba castaña con canas, de largo medio y trenzada al modo más simple. Expresión
disciplinada y neutra: es tropa de formación. Sin rasgos memorables.
EQUIPO: Cota de anillas sobre gambesón, peto de placas de hierro pequeño y
abollado, casco de hierro sin adorno con protector nasal. Hacha de mano y escudo
redondo de tablas con refuerzo de hierro y un nudo geométrico basto. Un cordón
granate al cinto — el primer granate de la progresión, y es solo eso. Sin latón.
DEBE VERSE: cobertura de hierro donde el Minero iba de lana, y nada más.
POSE: Firme, escudo adelantado, hacha en guardia baja. Formación, no duelo.
Cuerpo entero, botas en la piedra.
ESCENARIO: Arco de piedra tallada, muro bajo de galería. Subordinado.
PALETA: hierro oscuro y gris piedra dominantes, cuero marrón, granate mínimo.
```

### Tier 3 · 🔨 Herrero de guerra

```
QUÉ ES: unidad de tier 3. Tropa. PRIMER SALTO DE MASA de la progresión: al lado
del Minero tiene que verse el doble de ancho.
SUJETO: Herrero de guerra enano. Tanque y armas pesadas.
CUERPO: Muy ancho y muy pesado, tronco de barril, hombros y antebrazos enormes de
martillo. El salto de masa se ve aquí y tiene que ser evidente.
EDAD: Lee como un humano de 50.
ROSTRO: Cara ancha, roja del calor de la forja, sudorosa, con quemaduras
pequeñas. Nariz aplastada, cejas chamuscadas. Barba castaña espesa recogida en
una redecilla de cuero para que no se queme — detalle de oficio. Expresión
concentrada y dura.
EQUIPO: Mandil de cuero grueso reforzado con placas de hierro sobre cota de
anillas, hombrera única y enorme en el brazo del martillo, guantelete de forja
hasta el codo. Casco abierto. MARTILLO DE GUERRA a dos manos con la cabeza
erizada de PÚAS PERFORANTES, y una cuña de acero al cinto. Granate en la faja.
Latón discreto en los remaches: aquí empieza a aparecer.
DEBE VERSE: la PUNTA PERFORANTE del martillo, diseñada para atravesar placa. Y la
masa.
POSE: Firme, martillo apoyado en el hombro o descansando cabeza abajo en el
suelo. Quieto y pesado. Cuerpo entero, botas claveteadas visibles.
ESCENARIO: Forja: yunque, brasa naranja baja, herramienta colgada. Subordinado.
PALETA: hierro oscuro y gris piedra dominantes, granate en la faja, latón escaso,
brasa cálida solo en el fondo.
```

### Tier 4 · ⚙️ Ingeniero

```
QUÉ ES: unidad de tier 4. Tropa: un ingeniero de cuerpo de ejército, no el
inventor. Menos único y con MUCHO menos aparato que el héroe Ingeniero.
SUJETO: Ingeniero enano. Trampas y artefactos, daño a distancia.
CUERPO: Compacto y medio, sin masa de combate, espalda cargada. Silueta rota por
el equipo que carga, no por el cuerpo.
EDAD: Lee como un humano de 45.
ROSTRO: Cara ancha manchada de grasa, arrugas, barba corta y chamuscada por los
lados. Gafas de latón de una sola pieza subidas a la frente. Expresión distraída
y práctica. Corriente, no memorable: es tropa.
EQUIPO: Mandil de cuero con bolsillos sobre camisa de lana, peto de hierro
pequeño, sin casco o con gorro de cuero. BALLESTA MECÁNICA de latón y hierro con
el mecanismo visible, empuñada. Mochila de armazón con muelles, tubos y una
trampa plegada. Granate en un trapo. Latón en el mecanismo.
DEBE VERSE: el ARMA DE PROYECTIL en la mano —obligatorio, es su papel— y que el
mecanismo está a la vista.
POSE: Cargando o comprobando la ballesta, de tres cuartos, mirada en el
mecanismo. En faena. Cuerpo entero, botas dentro del cuadro.
ESCENARIO: Banco de trabajo o galería con andamio de madera. Subordinado.
PALETA: hierro oscuro y gris piedra dominantes, LATÓN cálido en el mecanismo,
granate mínimo.
```

### Tier 5 · 🔫 Mosquetero

```
QUÉ ES: unidad de tier 5. Tropa. El primer sujeto de la raza con arma de fuego, y
eso lo separa a la vista de los cuatro anteriores.
SUJETO: Mosquetero enano. Daño a distancia y perforación.
CUERPO: Compacto y sólido, medio de la raza. Hombros anchos, postura recta de
línea de tiro.
EDAD: Lee como un humano de 45.
ROSTRO: Cara ancha, tiznada de pólvora en la mejilla y la frente, ojos
entrecerrados, bigote y barba media recortada con más cuidado que los demás — es
tropa de línea y se nota en el aseo. Expresión serena. Sin atractivo.
EQUIPO: Casaca de lana GRANATE con vueltas de cuero sobre cota de anillas ligera
—es el sujeto donde el granate sube a dominante de su ropa— y sombrero o morrión
de hierro de ala corta. MOSQUETE largo de cañón de hierro y culata de madera
oscura con herrajes de latón. Bandolera de cartuchos, cuerno de pólvora, baqueta.
Bayoneta o daga larga al cinto.
DEBE VERSE: el ARMA DE FUEGO, grande y en la mano, y la BAYONETA o punta
perforante. Humo de pólvora si hay ocasión.
POSE: De pie, mosquete apoyado en el suelo con las dos manos o al hombro en
posición de descanso, mirada fuera de cuadro. Cuerpo entero, botas visibles.
ESCENARIO: Almena de piedra tallada, o boca de galería con humo bajo.
PALETA: GRANATE protagonista en la casaca, hierro oscuro y gris piedra de apoyo,
latón medio en los herrajes.
```

### Tier 6 · 🛡️ Guardia de hierro

```
QUÉ ES: unidad de tier 6. Tropa de élite, y la CIMA ENANA de la progresión: la
armadura más completa que lleva esta raza. Lo que venga después ya no es enano.
SUJETO: Guardia de hierro enano. Tanque extremo.
CUERPO: El techo de masa de la raza: MÁS ANCHO QUE ALTO. Un bloque. Tronco
enorme, hombreras que le sobrepasan la cabeza, piernas cortas y separadas. Al
lado del Minero tiene que parecer otra especie.
EDAD: Lee como un humano de 55. Es el más veterano de las unidades.
ROSTRO: Poco visible: yelmo cerrado de hierro con una rendija estrecha, o visera
alzada que deja ver una cara ancha, muy curtida, con cicatrices antiguas y cejas
pesadas. Barba gris espesa que sale por debajo del yelmo y le cubre el peto.
Expresión inmóvil.
EQUIPO: ARMADURA DE PLACAS COMPLETA de hierro forjado grueso, sin pulir y
abollada por el uso, con remaches enormes a la vista y nudos geométricos
grabados. Yelmo cerrado con penacho granate. Escudo de torre de hierro que le
cubre del hombro al pie, y maza o hacha corta pesada. Latón pleno en remaches,
bisagras y grabado: es el sujeto más de latón de la raza.
DEBE VERSE: la cobertura TOTAL y la anchura. Al lado del Guerrero enano de tier 2
tiene que parecer otro rango, no otro soldado.
POSE: De pie, frontal, escudo de torre plantado en el suelo delante y arma al
costado. Absolutamente quieto. Cuerpo entero: el escudo no tapa las botas.
ESCENARIO: Puerta de piedra tallada, arco bajo, estandartes granates.
PALETA: hierro oscuro dominante, gris piedra, granate en el penacho, LATÓN pleno
como acento en toda la armadura.
```

### Tier 7 · 🗿 Gólem de piedra

```
QUÉ ES: unidad de tier 7. NO ES ENANO: es un constructo de piedra que sirve al
bando enano. No le pongas anatomía enana, ni ropa, ni barba, ni cara. Se somete a
la paleta y a los motivos de la raza, no a su cuerpo.
SUJETO: Gólem de piedra. Constructo y tanque.
CUERPO: Proporción arquitectónica, no orgánica: bloques de piedra tallada
encajados, hombros como dinteles, brazos larguísimos y puños enormes, piernas
cortas y macizas. SIN CARA: placa lisa, o una hendidura con luz de runa dentro.
No hay piel, no hay músculo, no hay gesto.
EDAD Y BELLEZA: no aplican, no es un ser vivo. Lo que se lee es ANTIGÜEDAD:
piedra desconchada, grietas reparadas con grapas de hierro, musgo en las juntas,
un brazo tallado en otra piedra distinta.
EQUIPO: Ninguno. Es el arma. Grapas, zunchos de hierro y runas grabadas en el
torso y los hombros, que es lo que lo mantiene entero.
DEBE VERSE, y las dos son obligatorias: el CUERPO DE PIEDRA sin nada orgánico, y
la MASA QUE EXPLICA SU LENTITUD — que se ve pesado, que cada paso cuesta.
POSE: De pie, frontal, brazos colgando por su peso, un puño apoyado en el suelo.
Inmóvil, entre dos pasos. Cuerpo entero, los pies hundidos ligeramente en la
piedra del suelo.
ESCENARIO: Sala de piedra tallada, columnas bajas, una runa grande grabada al
fondo que da la única luz fría.
PALETA: gris piedra dominante absoluto, hierro oscuro en zunchos y grapas,
granate mínimo en una runa o un resto de pintura, luz de runa fría contenida.
```

### Tier 8 · ⛰️ Coloso de adamantita

```
QUÉ ES: unidad de tier 8, constructo legendario. NO ES ENANO. Es el techo de la
progresión: tiene que ser ENORME y aplastar en escala a los siete anteriores.
Aquí el latón y el metal de la raza dejan de ser un acento y son el cuerpo.
SUJETO: Coloso de adamantita. Constructo legendario de daño masivo.
CUERPO: Colosal y arquitectónico. Placas de adamantita —metal oscuro azulado, más
noble que el hierro— sobre una estructura de vigas y engranajes visibles en las
articulaciones. Hombros como torres, brazos desproporcionados, puños de yunque.
SIN CARA: una máscara de placas con una rendija de luz de runa. Nada humanoide en
la proporción, aunque el esquema sea bípedo.
EDAD Y BELLEZA: no aplican. Lo que se lee es PODER y factura: a diferencia del
Gólem, este está BIEN HECHO —placas ajustadas, grabado limpio, runas enteras—,
pero con marcas de combate: abolladuras profundas, una placa sustituida.
EQUIPO: Ninguno. Sus brazos acaban en armas: un puño-martillo y un ARIETE o punta
de adamantita capaz de atravesar una puerta.
DEBE VERSE, y las tres son obligatorias: la ESCALA —enorme, comparado con algo
pequeño abajo—, el CUERPO DE CONSTRUCTO con el mecanismo a la vista en las
articulaciones, y la PUNTA PERFORANTE.
POSE: De pie, frontal, erguido del todo, un brazo alzado y el otro colgando.
Solemne e inmóvil. La criatura ENTERA dentro del cuadro, con los pies apoyados en
suelo visible. La escala la da la comparación con la arquitectura, no lo cerca
que esté la cámara: aléjate.
ESCENARIO: Se abre para que quepa: gran sala de piedra tallada o boca de mina
enorme, con vigas y figuras diminutas abajo que dan la escala.
PALETA: metal oscuro azulado dominante en toda la placa —es la excepción de la
raza—, LATÓN pleno en engranajes y grabado, granate frío en un estandarte del
fondo, luz de runa en las juntas.
```

---

## Al terminar

Negative prompt, checklists y norma de archivo, en
[`preambulo.md`](preambulo.md#bloque-3--negative-prompt). El destino de esta raza:

```
public/assets/v3/races/enanos/            los 4 héroes: guerrero.webp, ingeniero.webp, berserker.webp, maestro-de-runas.webp
public/assets/v3/races/enanos/units/      las 8 unidades: minero.webp, guerrero-enano.webp, herrero-de-guerra.webp,
                                          ingeniero.webp, mosquetero.webp, guardia-de-hierro.webp, golem-de-piedra.webp,
                                          coloso-de-adamantita.webp
```

`ingeniero.webp` existe dos veces, una en cada carpeta: es una de las 25
colisiones héroe/unidad.
