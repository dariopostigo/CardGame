# Prompts — 👤 Humanos

> **Los 12 sujetos de Humanos, montados y listos para pegar.** Esto es la
> traducción a prompt de la cola de [`../sujetos.md`](../sujetos.md): allí está
> *quién* es cada uno y por qué; aquí está *lo que se pega en la IA*.

> **Corregido el encuadre (21 de agosto de 2026).** La primera tirada —Guerrero,
> Mago y Sacerdote, en `public/assets/v3/races/humanos/`— salió **apaisada y en
> plano medio**: personajes cortados por el muslo, fuera del eje y demasiado
> grandes para un marco vertical. El preámbulo pedía composición centrada pero
> no pedía **el plano**, y ninguna IA lo da por defecto. Ahora el bloque
> ENCUADRE lo exige en positivo, el negativo lo prohíbe y cada POSE dice dónde
> están los pies. **Los tres héroes existentes se regeneran**; valen como
> referencia de estilo, no de encuadre.
>
> **Al 25 de agosto de 2026 va a medias, y el fallo que queda es de proporción,
> no de plano.** ⚔️ Guerrero y 🔮 Mago están regenerados y correctos: 5:7
> vertical, plano general, figura entera y centrada. ✝️ Sacerdote, 🏹 Arquero y
> 🗡️ Miliciano ya salen en **plano general con aire** —el bloque ENCUADRE
> funciona— pero en **lienzo apaisado**: 1484×1060, que es el 1060×1484 bueno
> girado. Es decir, lo que no se está respetando es la **relación de aspecto de
> la herramienta**, que se elige antes de pegar el prompt y no viaja en él.
> Antes de la siguiente tirada, fija el formato vertical en la interfaz.

> **Corregido también el reparto de cuerpos (misma fecha).** La misma tirada
> salió con los tres personajes **jóvenes, esbeltos, musculosos y guapos**, que en
> el Mago y el Sacerdote no tiene ningún sentido. La causa era estructural: el
> preámbulo pegaba «proporción heroica realista» —la anatomía de la raza— a los
> doce sujetos por igual, así que el «sin masa muscular» de cada bloque llegaba
> ya contradicho. Ahora la raza fija un **RANGO** y cada sujeto tiene sus propios
> campos **CUERPO**, **EDAD** y **ROSTRO**, con década concreta y con la cara que
> le toca. Y hay un eje **BELLEZA** por raza: los Humanos son gente corriente, y
> la belleza se le pide a los Elfos, que es donde es un rasgo de especie. Los
> ocho ejes están en [`../sujetos.md`](../sujetos.md#identidad-de-raza).

## Antes de este archivo, el preámbulo

Pega primero [`preambulo.md`](preambulo.md) —prompt base, formato, encuadre y
negative prompt, comunes a las once razas— y `style-guide.md` como contexto. Allí
está también qué archivos se le pasan a la IA y qué archivos **no**. Aquí solo
va lo de Humanos.

---

## Identidad de raza — pegar una vez, después del preámbulo

```
IDENTIDAD DE RAZA — HUMANOS, común a todos los sujetos:
Paleta: acero azulado y azul heráldico dominantes, tierras neutras de apoyo, oro
como acento (heráldica, filos, remaches). Materiales: acero pulido con
abolladuras, cuero marrón, lino y lana, tabardo sobre la armadura. Motivos:
heráldica simple y legible (sol, león), remaches visibles, filigrana escasa.
Fondo: piedra clara de castillo, campo cultivado, estandartes. Silueta: hombros
anchos y cintura marcada; el tabardo y la capa dan la lectura a distancia.

RANGO ANATÓMICO — es un rango, NO el cuerpo de todos:
~7 cabezas, proporción realista. Dentro de esa escala cabe de flaco a macizo, y
lo elige cada sujeto en su campo CUERPO. NO aplique «proporción heroica» ni
«torso y hombros reforzados» a todo el mundo: el Guerrero es pesado, el Mago no
tiene un gramo de masa muscular y el Miliciano está delgado de comer mal.

REPARTO — HUMANOS. Manda sobre el gusto por defecto de la IA:
EDAD: las unidades son adultos de 30 a 50, y el tier 1 puede ser joven, de
veinti-pocos. Los HÉROES son mayores, y los dos que no pelean con las manos son
ANCIANOS DE VERDAD: el Mago tiene entre 75 y 85 años y el Sacerdote entre 65 y
75. En esta raza la autoridad la da la edad, no el músculo. «Adulto» a secas no
vale: cada bloque dice su década y hay que respetarla.
BELLEZA: NINGUNA. Los humanos son la gente corriente de este mundo — caras
comunes, narices normales o grandes, dientes imperfectos, asimetría, piel con
marcas. Ni un solo sujeto es guapo, ni esbelto por defecto, ni está musculado si
su papel no lo pide; y ninguno es monstruoso. Si una cara podría salir en un
anuncio, está mal y se vuelve a tirar. La belleza es rasgo de otras razas (los
Elfos), no de esta.

REGLA DE PROGRESIÓN: el oro es un marcador de rango. Ausente en los tiers bajos,
discreto en los medios, pleno en los altos. No lo reparta por igual.
```

---

## Héroes de clase (4)

**Son individuos**: el personaje que juega el jugador. Protagonista, equipo
personal con historia, «este tiene nombre».

### 1 · ⚔️ Guerrero

```
QUÉ ES: héroe de clase. Un individuo, protagonista, con nombre propio. Equipo
personal y con historia, no de dotación.
SUJETO: Guerrero humano. Tanque de combate cuerpo a cuerpo.
CUERPO: Complexión PESADA, de peón de guerra: hombros muy anchos, cuello corto,
tronco grueso y algo de barriga sólida bajo la coraza. Fuerte por oficio, no
gimnasio: sin cintura estrecha y sin abdominales marcados.
EDAD: Unos 45 años, y se le notan. Veterano de muchas campañas.
ROSTRO: Cara curtida y ancha, muy poco agraciada. Piel castigada por el sol y el
frío, arrugas profundas en la frente y alrededor de los ojos, nariz grande y
torcida de una rotura vieja, una cicatriz antigua en la mejilla o la ceja,
mandíbula pesada. Pelo corto con canas en las sienes, barba corta y desigual.
Mirada firme y directa al espectador, cansada pero sin miedo. NO es guapo y no
tiene que serlo.
EQUIPO: Coraza de acero abollada por el uso sobre cota de malla, hombreras
asimétricas, tabardo azul heráldico con un sol dorado ya desgastado. Espada
ancha de una mano y escudo de madera reforzado con hierro, con la pintura
saltada. Guanteletes de cuero y acero. Oro discreto: solo en la heráldica y el
pomo.
DEBE VERSE: que aguanta el golpe. El peso está en los pies y en los hombros.
POSE: Plantado, piernas separadas y firmes, escudo adelantado y espada baja.
Quieto, no en carrera. Ocupa el suelo. Cuerpo entero: se le ven las dos piernas
completas y las botas apoyadas en el empedrado.
ESCENARIO: Muro de piedra clara de castillo y un estandarte azul al viento,
desenfocados y subordinados.
PALETA: acero azulado y azul heráldico dominantes, cuero marrón, oro solo en la
heráldica.
```

### 2 · 🔮 Mago

```
QUÉ ES: héroe de clase. Un individuo, protagonista, con nombre propio.
SUJETO: Mago humano. Daño mágico y control a distancia.
CUERPO: ANCIANO y consumido. Delgadísimo, sin una sola pizca de masa muscular:
hombros estrechos y muy caídos, cuello fino y tendinoso, clavículas marcadas,
espalda ENCORVADA de décadas sobre los libros. Manos huesudas y nudosas, con los
nudillos hinchados y los dedos algo torcidos por la edad. Se sostiene en el
bastón porque le hace falta, no por pose. Es lo contrario del Guerrero y tiene
que verse a la primera.
EDAD: Entre 75 y 85 años. Es el sujeto MÁS VIEJO de las once razas, y tiene que
leerse como un anciano de verdad — no como un adulto mayor.
ROSTRO: Muy avejentado. Enjuto y severo, cráneo estrecho, pómulos y sienes
hundidos, mejillas comidas, piel fina, translúcida y pálida de interior, con
manchas de la edad en la frente y las manos. Arrugas PROFUNDAS por toda la cara,
párpados caídos, bolsas y ojeras marcadas, cejas blancas y desordenadas. Barba
blanca rala y descuidada, pelo blanco escaso recogido o capucha echada atrás,
con la línea del pelo muy retirada y el cuero cabelludo a la vista. Mirada
concentrada, lúcida e impaciente — el cuerpo está viejo, la cabeza no. Nada de
mago apuesto de mediana edad: es un viejo flaco y arrugado.
EQUIPO: Ninguna armadura. Túnica larga de lana azul profundo con ribete dorado y
capa de viaje; cinturón de cuero con bolsas y viales. Bastón de madera nudosa
con un foco arcano engastado en oro en el extremo. Botas de cuero marrón.
DEBE VERSE: que no puede recibir un golpe. La tela manda sobre el metal — no
lleva ni una placa.
POSE: Una mano alta con el foco activo, la otra trazando un gesto. En el momento
justo antes de que salga el hechizo, no después. Cuerpo entero: la túnica cae
hasta el suelo y se le ven las botas y el bajo completo.
ESCENARIO: Interior de piedra clara, arcada, un ventanal alto que entra luz
fría. Fondo subordinado.
PALETA: azul heráldico profundo dominante, acero azulado en la luz del foco,
tierras neutras en la tela, oro en el ribete y el engaste.
```

### 3 · ✝️ Sacerdote

```
QUÉ ES: héroe de clase. Un individuo, protagonista, con nombre propio.
SUJETO: Sacerdote humano. Curación y apoyo.
CUERPO: MAYOR, de complexión media y algo blanda, de persona que no pelea: sin
masa muscular visible, hombros estrechos y algo caídos, cierta pesadez en el
tronco bajo el hábito. Espalda levemente encorvada por la edad, aunque mantiene
la postura recta a propósito: es un hombre mayor que se esfuerza en estar
derecho. Manos con las venas marcadas.
EDAD: Entre 65 y 75 años. Anciano, aunque menos consumido que el Mago —a este la
edad le ha puesto peso y cansancio, no lo ha secado.
ROSTRO: Cara común y pesada, muy arrugada, mejillas descolgadas, papada, párpados
caídos. Manchas de la edad en las sienes y el dorso de las manos. Ojeras
profundas: la mirada de quien ha visto morir a mucha gente y sigue viniendo. Pelo
blanco corto y ralo, tonsura o velo según el diseño; sin barba o muy corta y
blanca. Expresión amable, no dulce. NO es un sacerdote joven y apuesto: es un
anciano agotado que aún se levanta.
EQUIPO: Hábito de lino crudo y lana bajo una sobrevesta azul heráldica; media
coraza ligera de acero solo en el pecho, sin brazos. Símbolo sagrado grande de
oro colgado al cuello — el elemento más brillante de la imagen. Maza corta de
acero al cinto, más como insignia que como arma. Libro atado con correa.
DEBE VERSE: el símbolo sagrado, y que el gesto es de dar, no de golpear.
POSE: Palma abierta hacia delante o hacia arriba, en gesto de bendición. Postura
frontal y tranquila. Cuerpo entero: el hábito llega al suelo y se ven los pies
sobre la losa.
ESCENARIO: Nave de piedra clara, luz alta y cálida entrando desde arriba,
estandartes. Subordinado.
PALETA: lino crudo y azul heráldico dominantes, acero azulado en la coraza, oro
concentrado en el símbolo sagrado.
```

### 4 · 🏹 Arquero

```
QUÉ ES: héroe de clase. Un individuo, protagonista, con nombre propio. NO es la
unidad Arquero de tier 2: este es único y se le nota.
SUJETO: Arquero humano. Daño a distancia.
CUERPO: Enjuto y FIBROSO, delgado de verdad. Solo dos zonas desarrolladas y de
forma asimétrica —el hombro y el antebrazo del brazo que tensa—, el resto seco y
sin volumen. Nada de torso ancho ni pecho de guerrero.
EDAD: Unos 40 años.
ROSTRO: Curtido y anguloso, muy tostado y agrietado por el sol, con arrugas de
entrecerrar los ojos y labios secos. Nariz afilada, pómulos marcados por
delgadez, no por belleza. Barba de días, pelo castigado atado atrás con canas
sueltas. Mirada atenta y calculadora, ojos entrecerrados de mirar lejos. Cara de
alguien que vive a la intemperie, no de galán.
EQUIPO: Sin coraza: gambesón de lino acolchado y jubón de cuero marrón,
capucha, capa corta. Brazal de cuero labrado en el brazo del arco. Arco de
guerra alto de madera con el asa envuelta en cuero, carcaj a la espalda con
flechas de emplumado azul, cuchillo al cinto. Detalle personal: un cordón dorado
atado al arco.
DEBE VERSE: el arco en la mano, grande y en tensión o a punto. Es lo primero que
se lee.
POSE: Flecha ya encajada, arco medio tensado, mirada fuera de cuadro siguiendo
un blanco. Cuerpo de perfil tres cuartos. Cuerpo entero, con las dos piernas y
las botas dentro del cuadro, y el arco completo —las dos puntas— sin salirse.
ESCENARIO: Linde de campo cultivado, empalizada baja, cielo abierto. Fondo
subordinado.
PALETA: cuero marrón y lino crudo dominantes, azul heráldico en el emplumado y
la capa, acento dorado mínimo en el cordón del arco.
```

---

## Unidades (8) — progresión de tier

**Son tropa**: uno cualquiera de muchos. Equipo de dotación, repetible. Puede no
mirar al espectador: está en faena. El tier se lee en la **proporción** —cabeza
pequeña respecto al cuerpo, masa, cuánto ancho ocupa—, nunca en lo grande que
salga la figura dentro del cuadro: eso es fijo en los 132.

### Tier 1 · 🗡️ Miliciano

```
QUÉ ES: unidad de tier 1. Tropa, no protagonista. Uno cualquiera de cincuenta.
Es el escalón más bajo de la raza y TIENE QUE VERSE POBRE: es la referencia
contra la que se mide todo lo que sube.
SUJETO: Miliciano humano. Infantería básica de cuerpo a cuerpo.
CUERPO: Delgado y FLOJO — no de entrenar, de comer poco. Hombros estrechos,
brazos finos, pecho hundido, algo de cargazón de espalda. Ni masa muscular ni
porte heroico: es el cuerpo de un campesino, no de un soldado.
EDAD: Unos 22 años. Es el más JOVEN de la raza, y eso es parte de la lectura:
carne nueva a la que han dado una lanza esta mañana.
ROSTRO: Cara del todo común y corriente, olvidable, sin un solo rasgo notable ni
cicatriz épica: literalmente un vecino. Piel con acné o manchas, orejas
despegadas, dientes irregulares, barba de adolescente rala y mal afeitada, pelo
corto desordenado y sucio. Expresión de determinación cansada con miedo
contenido, ojeras de no dormir. NADA atractivo — es el suelo de la raza también
en la cara.
EQUIPO: Lo mínimo. Gambesón de lino acolchado, sucio y remendado, sin coraza ni
cota de malla. Casco de hierro simple sin adorno, o ninguno. Lanza corta de
madera con punta de hierro basta. Escudo redondo de tablas de madera con
refuerzo de hierro y el azul heráldico casi borrado. Botas de cuero marrón
gastadas, calzas de lana. NADA DE ORO en ninguna parte, ni un remache: el oro
empieza más arriba en la progresión.
DEBE VERSE: nada especial. No tiene ninguna habilidad que mostrar, y no hay que
inventarle ninguna. Su lectura es su pobreza y su papel.
POSE: De guardia, no de ataque. De pie, lanza en guardia baja o apoyada en el
suelo, hombros ligeramente caídos, peso en una pierna. Nada épico. Cuerpo
entero: se ven las calzas, las botas gastadas y el suelo bajo los pies.
ESCENARIO: Muro de piedra clara de castillo o empalizada de madera detrás, muy
desenfocado. Cielo neutro y plano. Fondo claramente subordinado.
PALETA: lino crudo sucio y cuero marrón dominantes, acero azulado apagado en la
punta y el casco, azul heráldico desvaído y descascarillado en el escudo. Sin
saturación y sin oro.
```

### Tier 2 · 🏹 Arquero

```
QUÉ ES: unidad de tier 2. Tropa. Ligeramente por encima del Miliciano, pero
sigue siendo pobre.
SUJETO: Arquero humano. Daño a distancia.
CUERPO: Enjuto y seco, un poco más entero que el Miliciano pero igual de
delgado. Solo el hombro y el antebrazo del arco tienen algo de músculo.
EDAD: Unos 30 años.
ROSTRO: Corriente y anguloso, piel tostada y algo agrietada, ojos entrecerrados,
barba de días. Capucha calada que le come media cara. Sin rasgos memorables: es
tropa, no un individuo. No es guapo.
EQUIPO: Gambesón de lino acolchado y jubón de cuero marrón, capucha, brazal de
cuero liso. Arco de guerra de madera sin adorno, carcaj de cuero a la cadera con
flechas de emplumado azul. Cuchillo corto. Sin coraza. Oro: ninguno.
DEBE VERSE: el arco en la mano — obligatorio, es su papel.
POSE: Tensando o comprobando una flecha, de perfil tres cuartos, mirada fuera de
cuadro. En faena. Cuerpo entero, piernas y botas dentro del cuadro, arco
completo.
ESCENARIO: Almena de piedra clara o linde de campo. Subordinado.
PALETA: cuero marrón y lino crudo dominantes, azul heráldico en el emplumado,
acero azulado en la punta. Sin oro.
```

### Tier 3 · 🛡️ Caballero

```
QUÉ ES: unidad de tier 3. Tropa. PRIMER SALTO DE MASA de la progresión: al lado
del Miliciano tiene que verse el doble de ancho.
SUJETO: Caballero humano. Tanque de combate cuerpo a cuerpo.
CUERPO: Complexión PESADA y ancha, tronco grueso, cuello corto; los hombros los
ensancha además la coraza. Fuerza de oficio, sin cintura estrecha.
EDAD: Unos 40 años.
ROSTRO: Cara común y dura, curtida, con arrugas de intemperie y alguna marca de
combate. Nariz ancha, mandíbula pesada, barba corta y descuidada con canas.
Expresión disciplinada y neutra, sin gesto: es un soldado de formación. Yelmo con
visera alzada o cara visible. Nada de caballero apuesto de portada.
EQUIPO: Coraza de acero abollada sobre cota de malla, hombreras, faldar, yelmo.
Tabardo azul heráldico con la heráldica del sol. Espada de una mano y escudo
alargado con la divisa. Guanteletes. Oro DISCRETO: un filete en el tabardo y en
la heráldica, nada más — aquí empieza a aparecer.
DEBE VERSE: masa y cobertura. Cubierto de metal donde el Miliciano iba de lino.
POSE: Firme, escudo adelantado, espada en guardia media. Formación, no duelo.
Cuerpo entero: faldar, quijotes, grebas y botas de acero, todo dentro del cuadro
y los pies en el suelo.
ESCENARIO: Muro de castillo, estandartes. Subordinado.
PALETA: acero azulado dominante, azul heráldico en el tabardo, cuero marrón,
oro escaso.
```

### Tier 4 · 🔮 Mago

```
QUÉ ES: unidad de tier 4. Tropa: un mago de cuerpo de ejército, no el archimago.
Menos único que el héroe Mago.
SUJETO: Mago humano. Daño mágico y control.
CUERPO: Delgado, sin masa ninguna, hombros estrechos y manos finas. Silueta de
tela, no de cuerpo.
EDAD: Unos 45 años. Más joven que el héroe Mago —no ha llegado a archimago— pero
ya entrado en años, no un aprendiz.
ROSTRO: Enjuto y pálido de interior, ojeras, entrecejo marcado, pelo ralo con
canas bajo la capucha echada. Cara corriente y algo agria, concentrada. No es
guapo ni joven.
EQUIPO: Sin armadura. Túnica de lana azul profundo con ribete dorado sencillo,
capa, cinturón con viales. Bastón de madera con foco arcano engastado. Botas de
cuero.
DEBE VERSE: el foco arcano encendido y la ausencia total de metal defensivo. Su
silueta es de tela, y eso lo separa del Caballero anterior.
POSE: Foco en alto, hechizo a punto de salir. Un paso atrás respecto a la línea
de combate. Cuerpo entero: túnica hasta el suelo, botas visibles.
ESCENARIO: Interior de piedra clara con arcada, o campo con estandartes.
Subordinado.
PALETA: azul heráldico profundo dominante, tierras neutras, oro en el ribete y
el engaste, luz fría del foco.
```

### Tier 5 · 🐎 Caballería

```
QUÉ ES: unidad de tier 5. Tropa montada. La MONTURA amplía la silueta a lo
ancho, y el lienzo es vertical: eso se resuelve ALEJANDO LA CÁMARA hasta que
caballo y jinete entren completos, no recortando el caballo. Queda más pequeño
que los sujetos a pie, y está bien.
SUJETO: Caballería humana. Movilidad, carga, combate cuerpo a cuerpo.
CUERPO: Jinete de complexión media-fuerte y porte recto, piernas desarrolladas de
montar, tronco normal. Menos masa que el Caballero: la fuerza aquí la pone el
caballo. Montura de guerra pesada y ancha de pecho.
EDAD: Unos 35 años.
ROSTRO: Cara común y tostada, parcialmente tapada por el yelmo, gesto de esfuerzo
y dientes apretados. Barba corta. Sin rasgos memorables ni atractivo: es tropa.
EQUIPO: Media coraza de acero y cota de malla, tabardo azul heráldico. Lanza
larga en posición de carga, escudo pequeño al brazo. El caballo con gualdrapa
azul heráldica con la divisa y arreos de cuero con herrajes dorados.
DEBE VERSE: que va montado y que la lanza está en carga, no en reposo.
POSE: Al galope o en el instante de bajar la lanza. Movimiento claro, de
izquierda a derecha o hacia el espectador. El conjunto entero dentro del cuadro:
la cabeza del jinete, las cuatro patas del caballo y las dos puntas de la lanza.
Vista de tres cuartos, no de perfil puro, para que quepa a lo ancho.
ESCENARIO: Campo cultivado abierto, polvo levantado, estandartes al fondo.
PALETA: acero azulado y azul heráldico dominantes, cuero marrón en los arreos,
oro medio en los herrajes.
```

### Tier 6 · 🦅 Grifo

```
QUÉ ES: unidad de tier 6. NO ES HUMANO: es una criatura del bando humano, un
grifo. No le pongas anatomía humana ni ropa. Se somete a la paleta de la raza,
pero no a su cuerpo.
SUJETO: Grifo. Criatura voladora de ataque.
CUERPO: Cuarto delantero, cabeza y alas de águila; cuartos traseros de león.
Pico curvo y garras grandes, ojos fieros. Musculatura de depredador —aquí sí,
porque es un animal de caza—, plumaje en formas gráficas y pelaje en bloques.
EDAD Y BELLEZA: no aplican como en un humano. Es un animal adulto en plenitud:
ni cachorro ni decrépito. Plumaje real y algo desordenado, con cicatrices y
plumas partidas; NO es una criatura noble e impecable de estampa.
EQUIPO: Solo un arnés ligero de cuero marrón con hebillas, que indica que está
domado y es del bando humano. Sin silla ni jinete.
DEBE VERSE: LAS ALAS, desplegadas y que sostengan su peso — es su rasgo
obligatorio. Y las garras.
POSE: Descendiendo en picado o con las alas abiertas al frenar, garras
adelantadas. En vuelo, no posado. La criatura entera dentro del cuadro: las dos
alas completas hasta la punta, la cola y las cuatro garras. Aléjate lo que haga
falta; un ala cortada por el borde arruina la lectura.
ESCENARIO: Cielo abierto sobre piedra clara de castillo abajo, que da la altura.
PALETA: plumaje pardo con tornasol azulado y pelaje leonado, acento dorado
pálido en el pico y las garras. Se reconoce como humano por el azul y el oro,
no por el cuerpo.
```

### Tier 7 · ✝️ Paladín

```
QUÉ ES: unidad de tier 7. Tropa de élite, y la CIMA HUMANA de la progresión: la
armadura más completa que lleva esta raza. Todo lo que venga después ya no es
humano.
SUJETO: Paladín humano. Tanque, apoyo y daño sagrado.
CUERPO: Imponente y MACIZO, la silueta más ancha y alta de los humanos de la
lista: tronco enorme, hombros y espalda muy anchos, cuello grueso. Peso real, no
figura atlética — este es el techo de masa de la raza.
EDAD: Entre 50 y 55 años. Es el más veterano de las unidades, y el rango se lee
en la cara tanto como en el oro.
ROSTRO: Severo y sereno, cara ancha y muy curtida, arrugas profundas, cicatrices
antiguas bien visibles, cejas pesadas. Pelo y barba corta con canas abundantes o
ya blancos. Visera alzada bajo el yelmo con penacho azul. Rostro de autoridad
por edad y desgaste, NO por belleza: nada de paladín joven y radiante.
EQUIPO: Armadura de placas completa de acero pulido, con abolladuras finas de
uso; sobrevesta azul heráldica y capa larga. Yelmo con penacho. Martillo de
guerra a dos manos o espada larga, y escudo con la divisa del sol. ORO PLENO:
filos de las placas, heráldica, símbolo sagrado grabado en el peto, penacho
sujeto con broche dorado. Es el sujeto más dorado de la raza.
DEBE VERSE: la cobertura total y el oro. Al lado del Caballero de tier 3 tiene
que parecer otro rango, no otro soldado.
POSE: De pie, frontal, arma apoyada en el suelo con las dos manos o alzada en
alto. Solemne y quieta. Cuerpo entero: la capa cae hasta el suelo, se ven las
grebas y las botas de acero, y el penacho no toca el borde de arriba.
ESCENARIO: Nave de piedra clara con luz alta, o muro de castillo con
estandartes. Subordinado.
PALETA: acero azulado brillante y azul heráldico dominantes, oro pleno como
acento en toda la armadura.
```

### Tier 8 · 🐉 Dragón dorado

```
QUÉ ES: unidad de tier 8, criatura legendaria. NO ES HUMANO. Es el techo de la
progresión: tiene que ser ENORME y aplastar en escala a los siete anteriores.
Aquí el acento dorado de la raza deja de ser un detalle y se convierte en el
cuerpo entero.
SUJETO: Dragón dorado. Criatura legendaria de daño masivo.
CUERPO: Dragón de escama dorada en placas grandes y gráficas, cuello largo,
cuernos hacia atrás, ojos incandescentes. Musculatura poderosa, garras enormes.
Nada humanoide.
EDAD Y BELLEZA: no aplican como en un humano, pero tampoco es una joya. Es una
bestia ANTIGUA: escamas partidas o levantadas, cicatrices viejas, un cuerno
mellado. Imponente por escala y por daño acumulado, no por ser bonita.
EQUIPO: Ninguno. Es una criatura, no lleva equipo.
DEBE VERSE, y las tres son obligatorias: ALAS desplegadas y capaces de
sostenerlo; FUEGO — llama en las fauces o el pecho incandescente entre las
escamas; y la sensación de ESTALLIDO, de que lo que toca revienta.
POSE: Alzado sobre las patas traseras con las alas abiertas del todo, cuello
arqueado en el momento previo al aliento de fuego. Cabeza alta. La criatura
ENTERA dentro del cuadro —alas completas, cola, las cuatro garras—, y las patas
apoyadas en suelo visible. El tamaño lo da la comparación con el castillo, no lo
cerca que esté la cámara: aléjate.
ESCENARIO: Se abre para que quepa: cielo amplio y piedra clara de castillo muy
pequeña abajo, que es lo que da la escala. El fondo aquí trabaja para el tamaño.
PALETA: oro dominante en toda la escama —es la excepción de la raza—, azul
heráldico frío en el cielo de fondo para contrastar, naranja incandescente solo
en el fuego y los ojos.
```

---

## Al terminar

Negative prompt, checklists y norma de archivo, en
[`preambulo.md`](preambulo.md#bloque-3--negative-prompt). El destino de esta raza:

```
public/assets/v3/races/humanos/            los 4 héroes: guerrero.webp, mago.webp, sacerdote.webp, arquero.webp
public/assets/v3/races/humanos/units/      las 8 unidades: miliciano.webp, arquero.webp, caballero.webp, mago.webp,
                                           caballeria.webp, grifo.webp, paladin.webp, dragon-dorado.webp
```

`arquero.webp` y `mago.webp` existen dos veces, una en cada carpeta: son dos de
las 25 colisiones héroe/unidad.
