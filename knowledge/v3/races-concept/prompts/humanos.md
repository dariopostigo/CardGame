# Prompts — 👤 Humanos

> **Los 12 sujetos de Humanos, montados y listos para pegar.** Esto es la
> traducción a prompt de la cola de [`../sujetos.md`](../sujetos.md): allí está
> *quién* es cada uno y por qué; aquí está *lo que se pega en la IA*.

## Qué le pasas a la IA

**Un solo archivo de contexto**, y luego los prompts:

| Archivo | ¿Se lo pasas? | Para qué |
|---|---|---|
| [`../../art-direction/style-guide.md`](../../art-direction/style-guide.md) | **Sí, siempre** | Es el cómo se dibuja: línea, anatomía, sombreado, materiales, luz. Sin esto no hay estilo |
| Este archivo (o solo el bloque que toque) | **Sí** | El sujeto |
| [`../sujetos.md`](../sujetos.md) | **Opcional, recomendado** | Si le pasas varios seguidos: le da la identidad de la raza y la progresión de tier, y entiende por qué el tier 8 es enorme y el tier 1 pobre |
| [`../../art-direction/illustrations.md`](../../art-direction/illustrations.md) | Opcional | Criterio de encuadre y de qué pide cada tipo de sujeto |
| [`../razas.md`](../razas.md) | **No** | Son las reglas: Habilidades, Características, tiers. Está lleno de mecánica invisible (Resistencia mágica, Inmune al miedo, Último aliento) y lo único que consigue es que la IA intente dibujarla. Lo dibujable ya está filtrado en cada bloque de aquí |

## Cómo se usa

1. Le das `style-guide.md` como contexto.
2. Pegas **el preámbulo** una vez.
3. Pegas **un bloque de sujeto**. Una imagen por bloque.
4. Si la herramienta admite negativos, pegas el **negative prompt** de abajo.

Si abres una conversación nueva para cada imagen, repite los pasos 1–2.

---

## Preámbulo — pegar una vez

> **Copia literal** del prompt base universal de
> [`style-guide.md`](../../art-direction/style-guide.md#21-prompt-base-universal)
> §21 más la línea de lienzo de
> [`public/assets/v3/README.md`](../../../../public/assets/v3/README.md#lienzo-y-formato).
> Si alguno de los dos cambia, hay que resincronizar este bloque.

```
Ilustración 2D de fantasía cartoon estilizada con estética de cómic de
videojuego. Personaje diseñado mediante dibujo y tinta, con contornos exteriores
negros gruesos y expresivos y líneas interiores visibles que definen rostro,
ropa, equipo y materiales. Anatomía heroica estilizada y ligeramente exagerada,
silueta extremadamente clara y reconocible, rostro expresivo y lleno de
personalidad. Colores ricos y saturados de forma controlada, grandes formas de
color y sombreado gráfico mediante bloques de sombra claramente definidos, con
pocos degradados suaves. Detalle selectivo: máximo detalle en rostro,
cabello/barba y elementos distintivos; menor detalle en ropa y fondo. Materiales
reconocibles mediante formas gráficas y pequeñas marcas dibujadas, evitando
microtexturas fotorealistas. Fondo de fantasía medieval estilizado y atmosférico,
subordinado al personaje. Aspecto de personaje diseñado para un videojuego de
fantasía 2D moderno, expresivo, jugable y preparado visualmente para futuras
animaciones y sprites.

FORMATO: 1536×1050 px, ratio ~1,46:1, apaisado, a sangre, sin transparencia.
Composición centrada, legible en miniatura, con ~10% de aire en los cuatro
bordes —especialmente en las esquinas— porque encima va un marco decorativo que
los tapa. Nada importante (rostro, manos, arma, escudo) pegado al filo.

IDENTIDAD DE RAZA — HUMANOS, común a todos los sujetos:
Paleta: acero azulado y azul heráldico dominantes, tierras neutras de apoyo, oro
como acento (heráldica, filos, remaches). Anatomía: proporción heroica realista,
~7 cabezas. Materiales: acero pulido con abolladuras, cuero marrón, lino y lana,
tabardo sobre la armadura. Motivos: heráldica simple y legible (sol, león),
remaches visibles, filigrana escasa. Fondo: piedra clara de castillo, campo
cultivado, estandartes. Silueta: hombros anchos y cintura marcada; el tabardo y
la capa dan la lectura a distancia.

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
CUERPO Y ROSTRO: Hombre adulto de complexión pesada, hombros muy anchos, cuello
corto. Cara curtida con alguna cicatriz vieja, mandíbula marcada, mirada firme y
directa al espectador. Pelo corto, barba corta.
EQUIPO: Coraza de acero abollada por el uso sobre cota de malla, hombreras
asimétricas, tabardo azul heráldico con un sol dorado ya desgastado. Espada
ancha de una mano y escudo de madera reforzado con hierro, con la pintura
saltada. Guanteletes de cuero y acero. Oro discreto: solo en la heráldica y el
pomo.
DEBE VERSE: que aguanta el golpe. El peso está en los pies y en los hombros.
POSE: Plantado, piernas separadas y firmes, escudo adelantado y espada baja.
Quieto, no en carrera. Ocupa el suelo.
ESCENARIO: Muro de piedra clara de castillo y un estandarte azul al viento,
desenfocados y subordinados.
PALETA: acero azulado y azul heráldico dominantes, cuero marrón, oro solo en la
heráldica.
```

### 2 · 🔮 Mago

```
QUÉ ES: héroe de clase. Un individuo, protagonista, con nombre propio.
SUJETO: Mago humano. Daño mágico y control a distancia.
CUERPO Y ROSTRO: Hombre o mujer de complexión delgada, sin masa muscular.
Rostro inteligente y algo severo, pómulos marcados, mirada concentrada. Pelo
recogido o cubierto por capucha echada atrás.
EQUIPO: Ninguna armadura. Túnica larga de lana azul profundo con ribete dorado y
capa de viaje; cinturón de cuero con bolsas y viales. Bastón de madera nudosa
con un foco arcano engastado en oro en el extremo. Botas de cuero marrón.
DEBE VERSE: que no puede recibir un golpe. La tela manda sobre el metal — no
lleva ni una placa.
POSE: Una mano alta con el foco activo, la otra trazando un gesto. En el momento
justo antes de que salga el hechizo, no después.
ESCENARIO: Interior de piedra clara, arcada, un ventanal alto que entra luz
fría. Fondo subordinado.
PALETA: azul heráldico profundo dominante, acero azulado en la luz del foco,
tierras neutras en la tela, oro en el ribete y el engaste.
```

### 3 · ✝️ Sacerdote

```
QUÉ ES: héroe de clase. Un individuo, protagonista, con nombre propio.
SUJETO: Sacerdote humano. Curación y apoyo.
CUERPO Y ROSTRO: Adulto de complexión media, postura recta y serena. Rostro
amable pero cansado, ojeras, mirada de quien ha visto morir gente. Pelo corto,
tonsura o velo según el diseño.
EQUIPO: Hábito de lino crudo y lana bajo una sobrevesta azul heráldica; media
coraza ligera de acero solo en el pecho, sin brazos. Símbolo sagrado grande de
oro colgado al cuello — el elemento más brillante de la imagen. Maza corta de
acero al cinto, más como insignia que como arma. Libro atado con correa.
DEBE VERSE: el símbolo sagrado, y que el gesto es de dar, no de golpear.
POSE: Palma abierta hacia delante o hacia arriba, en gesto de bendición. Postura
frontal y tranquila.
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
CUERPO Y ROSTRO: Adulto enjuto y fibroso, hombros y antebrazos desarrollados por
el arco. Rostro atento, ojos entrecerrados de mirar lejos, alguna marca de sol.
Pelo atado atrás.
EQUIPO: Sin coraza: gambesón de lino acolchado y jubón de cuero marrón,
capucha, capa corta. Brazal de cuero labrado en el brazo del arco. Arco de
guerra alto de madera con el asa envuelta en cuero, carcaj a la espalda con
flechas de emplumado azul, cuchillo al cinto. Detalle personal: un cordón dorado
atado al arco.
DEBE VERSE: el arco en la mano, grande y en tensión o a punto. Es lo primero que
se lee.
POSE: Flecha ya encajada, arco medio tensado, mirada fuera de cuadro siguiendo
un blanco. Cuerpo de perfil tres cuartos.
ESCENARIO: Linde de campo cultivado, empalizada baja, cielo abierto. Fondo
subordinado.
PALETA: cuero marrón y lino crudo dominantes, azul heráldico en el emplumado y
la capa, acento dorado mínimo en el cordón del arco.
```

---

## Unidades (8) — progresión de tier

**Son tropa**: uno cualquiera de muchos. Equipo de dotación, repetible. Puede no
mirar al espectador: está en faena. Puestos los ocho en fila, el orden debe ser
evidente sin leer un número.

### Tier 1 · 🗡️ Miliciano

```
QUÉ ES: unidad de tier 1. Tropa, no protagonista. Uno cualquiera de cincuenta.
Es el escalón más bajo de la raza y TIENE QUE VERSE POBRE: es la referencia
contra la que se mide todo lo que sube.
SUJETO: Miliciano humano. Infantería básica de cuerpo a cuerpo.
CUERPO Y ROSTRO: Hombre adulto joven de complexión normal, delgado, sin masa
muscular ni porte heroico. Cara común y corriente, sin cicatrices épicas: un
vecino al que han dado una lanza. Expresión de determinación cansada, algo de
miedo contenido. Pelo corto desordenado, mal afeitado.
EQUIPO: Lo mínimo. Gambesón de lino acolchado, sucio y remendado, sin coraza ni
cota de malla. Casco de hierro simple sin adorno, o ninguno. Lanza corta de
madera con punta de hierro basta. Escudo redondo de tablas de madera con
refuerzo de hierro y el azul heráldico casi borrado. Botas de cuero marrón
gastadas, calzas de lana. NADA DE ORO en ninguna parte, ni un remache: el oro
empieza más arriba en la progresión.
DEBE VERSE: nada especial. No tiene ninguna habilidad que mostrar, y no hay que
inventarle ninguna. Su lectura es su pobreza y su papel.
POSE: De guardia, no de ataque. De pie, lanza en guardia baja o apoyada en el
suelo, hombros ligeramente caídos, peso en una pierna. Nada épico.
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
CUERPO Y ROSTRO: Adulto enjuto, hombros del arco. Cara corriente, ojos
entrecerrados. Capucha calada.
EQUIPO: Gambesón de lino acolchado y jubón de cuero marrón, capucha, brazal de
cuero liso. Arco de guerra de madera sin adorno, carcaj de cuero a la cadera con
flechas de emplumado azul. Cuchillo corto. Sin coraza. Oro: ninguno.
DEBE VERSE: el arco en la mano — obligatorio, es su papel.
POSE: Tensando o comprobando una flecha, de perfil tres cuartos, mirada fuera de
cuadro. En faena.
ESCENARIO: Almena de piedra clara o linde de campo. Subordinado.
PALETA: cuero marrón y lino crudo dominantes, azul heráldico en el emplumado,
acero azulado en la punta. Sin oro.
```

### Tier 3 · 🛡️ Caballero

```
QUÉ ES: unidad de tier 3. Tropa. PRIMER SALTO DE MASA de la progresión: al lado
del Miliciano tiene que verse el doble de ancho.
SUJETO: Caballero humano. Tanque de combate cuerpo a cuerpo.
CUERPO Y ROSTRO: Adulto de complexión pesada, hombros muy anchos por la coraza.
Yelmo con visera alzada o cara visible, expresión disciplinada.
EQUIPO: Coraza de acero abollada sobre cota de malla, hombreras, faldar, yelmo.
Tabardo azul heráldico con la heráldica del sol. Espada de una mano y escudo
alargado con la divisa. Guanteletes. Oro DISCRETO: un filete en el tabardo y en
la heráldica, nada más — aquí empieza a aparecer.
DEBE VERSE: masa y cobertura. Cubierto de metal donde el Miliciano iba de lino.
POSE: Firme, escudo adelantado, espada en guardia media. Formación, no duelo.
ESCENARIO: Muro de castillo, estandartes. Subordinado.
PALETA: acero azulado dominante, azul heráldico en el tabardo, cuero marrón,
oro escaso.
```

### Tier 4 · 🔮 Mago

```
QUÉ ES: unidad de tier 4. Tropa: un mago de cuerpo de ejército, no el archimago.
Menos único que el héroe Mago.
SUJETO: Mago humano. Daño mágico y control.
CUERPO Y ROSTRO: Complexión delgada, sin masa. Rostro concentrado, capucha
echada. Adulto.
EQUIPO: Sin armadura. Túnica de lana azul profundo con ribete dorado sencillo,
capa, cinturón con viales. Bastón de madera con foco arcano engastado. Botas de
cuero.
DEBE VERSE: el foco arcano encendido y la ausencia total de metal defensivo. Su
silueta es de tela, y eso lo separa del Caballero anterior.
POSE: Foco en alto, hechizo a punto de salir. Un paso atrás respecto a la línea
de combate.
ESCENARIO: Interior de piedra clara con arcada, o campo con estandartes.
Subordinado.
PALETA: azul heráldico profundo dominante, tierras neutras, oro en el ribete y
el engaste, luz fría del foco.
```

### Tier 5 · 🐎 Caballería

```
QUÉ ES: unidad de tier 5. Tropa montada. La MONTURA amplía la silueta: es el
primer sujeto que ocupa más ancho que alto.
SUJETO: Caballería humana. Movilidad, carga, combate cuerpo a cuerpo.
CUERPO Y ROSTRO: Jinete adulto de porte recto sobre caballo de guerra pesado.
Yelmo, cara parcialmente visible, gesto de esfuerzo.
EQUIPO: Media coraza de acero y cota de malla, tabardo azul heráldico. Lanza
larga en posición de carga, escudo pequeño al brazo. El caballo con gualdrapa
azul heráldica con la divisa y arreos de cuero con herrajes dorados.
DEBE VERSE: que va montado y que la lanza está en carga, no en reposo.
POSE: Al galope o en el instante de bajar la lanza. Movimiento claro, de
izquierda a derecha o hacia el espectador.
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
CUERPO Y ROSTRO: Cuarto delantero, cabeza y alas de águila; cuartos traseros de
león. Pico curvo y garras grandes, ojos fieros. Musculatura de depredador,
plumaje en formas gráficas y pelaje en bloques.
EQUIPO: Solo un arnés ligero de cuero marrón con hebillas, que indica que está
domado y es del bando humano. Sin silla ni jinete.
DEBE VERSE: LAS ALAS, desplegadas y que sostengan su peso — es su rasgo
obligatorio. Y las garras.
POSE: Descendiendo en picado o con las alas abiertas al frenar, garras
adelantadas. En vuelo, no posado.
ESCENARIO: Cielo abierto sobre piedra clara de castillo, visto desde abajo.
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
CUERPO Y ROSTRO: Adulto imponente, la silueta más ancha y alta de los humanos de
la lista. Yelmo con penacho azul, visera alzada, rostro severo y sereno.
EQUIPO: Armadura de placas completa de acero pulido, con abolladuras finas de
uso; sobrevesta azul heráldica y capa larga. Yelmo con penacho. Martillo de
guerra a dos manos o espada larga, y escudo con la divisa del sol. ORO PLENO:
filos de las placas, heráldica, símbolo sagrado grabado en el peto, penacho
sujeto con broche dorado. Es el sujeto más dorado de la raza.
DEBE VERSE: la cobertura total y el oro. Al lado del Caballero de tier 3 tiene
que parecer otro rango, no otro soldado.
POSE: De pie, frontal, arma apoyada en el suelo con las dos manos o alzada en
alto. Solemne y quieta.
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
CUERPO Y ROSTRO: Dragón de escama dorada en placas grandes y gráficas, cuello
largo, cuernos hacia atrás, ojos incandescentes. Musculatura poderosa, garras
enormes. Nada humanoide.
EQUIPO: Ninguno. Es una criatura, no lleva equipo.
DEBE VERSE, y las tres son obligatorias: ALAS desplegadas y capaces de
sostenerlo; FUEGO — llama en las fauces o el pecho incandescente entre las
escamas; y la sensación de ESTALLIDO, de que lo que toca revienta.
POSE: Alzado sobre las patas traseras con las alas abiertas del todo, cuello
arqueado en el momento previo al aliento de fuego. Cabeza alta.
ESCENARIO: Se abre para que quepa: cielo amplio sobre piedra clara de castillo,
muy pequeño abajo para dar la escala. El fondo aquí trabaja para el tamaño.
PALETA: oro dominante en toda la escama —es la excepción de la raza—, azul
heráldico frío en el cielo de fondo para contrastar, naranja incandescente solo
en el fuego y los ojos.
```

---

## Negative prompt — si la herramienta lo admite

> Copia literal de [`style-guide.md`](../../art-direction/style-guide.md#20-negative-prompt-maestro) §20.

```
photorealistic, hyperrealistic, realistic concept art, photographic skin, skin
pores, realistic hair strands, realistic metal reflections, realistic leather
texture, cinematic photorealism, 3D render, realistic 3D character, glossy 3D
materials, realistic anatomy, overly detailed armor, excessive microdetails,
smooth airbrushed painting, oil painting, watercolor, soft photographic
gradients, no outlines, thin outlines, generic fantasy character, anime, manga,
pixel art, low-poly, text, logo, watermark, UI, frame
```

> Este negativo ya no lleva `pristine heroic armor` ni `heavy plate armor`: se
> retiraron de la §20 porque bloqueaban al **Paladín de tier 7**, que es
> justamente placa completa y reluciente. Lo que protegían se dice ahora en
> positivo en cada bloque — el Miliciano pide gambesón remendado y «nada de oro,
> ni un remache». **Pégalo tal cual, sin excepciones por sujeto.**

---

## Al terminar cada imagen

Checklist de entrega en
[`../../art-direction/illustrations.md`](../../art-direction/illustrations.md#6-checklist-de-entrega)
§6, y el de estilo en `style-guide.md` §24. Los dos en treinta segundos.

El destino y el nombre del archivo:

```
public/assets/v3/races/humanos/            los 4 héroes: guerrero.webp, mago.webp, sacerdote.webp, arquero.webp
public/assets/v3/races/humanos/units/      las 8 unidades: miliciano.webp, arquero.webp, caballero.webp, mago.webp,
                                           caballeria.webp, grifo.webp, paladin.webp, dragon-dorado.webp
```

Las carpetas separadas son lo que salva la colisión de nombres: `arquero.webp` y
`mago.webp` existen dos veces, una en cada sitio. La norma completa de nombre
está en [`public/assets/v3/README.md`](../../../../public/assets/v3/README.md).
