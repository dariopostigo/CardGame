# Sujetos a ilustrar — cola de generación

> **Para qué es esto.** La lista completa de todo lo que hay que dibujar de
> [`razas.md`](razas.md), enumerado y listo para pasar a una IA que ya tenga
> cargada la biblia visual
> ([`../art-direction/style-guide.md`](../art-direction/style-guide.md)).
>
> Aquí **no hay estilo**: la IA lo trae de la biblia. Aquí está *quién* es cada
> sujeto y qué tiene que verse en él. El criterio de encuadre y la plantilla de
> prompt están en
> [`../art-direction/illustrations.md`](../art-direction/illustrations.md); las
> medidas del archivo, en
> [`public/assets/v3/README.md`](../../../public/assets/v3/README.md#lienzo-y-formato).

**132 sujetos**: 11 razas × (4 héroes de clase + 8 unidades) = 44 + 88.

> **¿Buscas el texto que se pega en la IA?** No es este documento: está en
> [`prompts/`](prompts/humanos.md), un archivo por raza, con los bloques ya
> montados. Aquí está *quién* es cada sujeto y por qué; allí, *qué se pega*.
> Escrito: [`prompts/humanos.md`](prompts/humanos.md) (los 12 de la raza piloto).

---

## Antes de generar: lo que hay que tener resuelto

### 1. La identidad de raza — **resuelta aquí, en este documento**

`illustrations.md` §4 dice que **se mueve por raza** «paleta, anatomía
característica, materiales y motivos del equipo, arquitectura del fondo, familia
de siluetas», y la plantilla de prompt pide `PALETA: [la de su raza]`. Los
valores no estaban escritos en ninguna parte: eran huecos.

Sin ellos, pasar 132 sujetos a una IA significa **132 paletas inventadas** y once
razas que no se parecen a nada ni entre sí ni dentro de sí. Es el fallo que la
§22 de la biblia intenta evitar, pero la biblia solo puede fijar lo que **no**
cambia; lo que cambia por raza hay que decidirlo.

**Ya están definidas las once**, abajo. Se escribe una vez por raza y se repite
literal en sus 12 prompts — **con una excepción**: el eje **Anatomía** es un
*rango*, no un cuerpo, y no se copia como valor. Ver §"El reparto".

> **Y son ocho ejes, no seis** (21 de agosto de 2026). Se añadieron **Edad** y
> **Belleza** porque faltaban y su ausencia se vio en cuanto salió arte real: la
> IA los rellenaba sola, y siempre con lo mismo —joven, esbelto y guapo—. Solo la
> ficha de 👤 Humanos está **aprobada**; en las otras diez los dos ejes nuevos
> están **derivados de lo que ya decía cada ficha** (una raza «sin un solo tono de
> piel sana» no puede ser hermosa) y hay que confirmarlos raza por raza cuando le
> toque su turno en la cola. No hay arte de ninguna todavía, así que no corre
> prisa.

### 2. Veinticinco héroes se llaman igual que una unidad de su raza — **abierto**

Es el hallazgo gordo, y no es una errata suelta: pasa en **las once razas**.

| Raza | Colisiones exactas |
|---|---|
| 👤 Humanos | Arquero · Mago |
| ⛏️ Enanos | Ingeniero |
| 💀 No-muertos | Nigromante · Vampiro |
| 🔥 Demonios | Señor demoníaco |
| 🧝 Elfos | Druida |
| 🧌 Orkos | Bárbaro · Chamán |
| 🧚 Feéricos | Hada · Danzante de hojas · Ilusionista |
| 🐉 Dracónidos | Piromante · Dracoguerrero |
| 🐀 Hombres rata | **los 4**: Asaltante · Alquimista · Señor de la plaga · Maquinista |
| 🤖 Constructos | **los 4**: Autómata de guerra · Cañonero · Ingeniero arcano · Gólem rúnico |
| 🧜 Abisales | Invocador abisal · Brujo de las mareas · Devoramentes |

Y encima hay casi-colisiones (Guerrero / Guerrero enano, Brujo / Brujo infernal,
Hechicero / Hechicero élfico, Caballero dragón / Caballero dracónido…).

Las carpetas de destino los separan —`races/<raza>/` contra
`races/<raza>/units/`—, así que **no se sobrescriben archivos**. El problema es
el *brief*: si a la IA le llegan «Mago» y «Mago» en la misma tanda, devuelve dos
imágenes intercambiables y ya no sabes cuál es cuál.

**La regla que lo resuelve, y que hay que meter en cada prompt:**

|  | Héroe de clase | Unidad |
|---|---|---|
| Qué es | **Un individuo**: el personaje que juega el jugador | **Tropa**: uno cualquiera de muchos |
| Encuadre | Protagonista, mira al espectador o a cámara alta | Puede no mirar; está en faena |
| Equipo | Personal, con historia, algo único suyo | De dotación, repetible, uniforme |
| Sensación | «Este tiene nombre» | «De estos hay cincuenta» |

Es la misma distinción que hace `illustrations.md` §1 cuando dice que un héroe se
lee por *puesto* y una unidad por *escalón*. Sin ella, 25 pares de imágenes
salen indistinguibles.

> **Lo suyo sería renombrar** una de las dos caras en `razas.md` antes de
> generar nada — es más barato cambiar 25 nombres que regenerar 50 imágenes.
> Está anotado como pendiente en [`README.md`](README.md).

---

## Identidad de raza

Los **ocho** ejes a fijar por raza. **Se escribe una vez y se repite literal en
los 12 prompts de esa raza** — es lo único que garantiza que se reconozcan como
familia.

| Eje | Qué fija |
|---|---|
| **Paleta** | 2 dominantes + 1 acento. El acento es lo que la distingue a 100 px |
| **Anatomía** | El **rango** de proporción, altura y rasgos faciales de raza. Un rango, no un cuerpo |
| **Edad** | En qué década leen sus adultos, y si la raza envejece visiblemente |
| **Belleza** | Si esta raza es guapa, fea o ajena a la escala. **Es rasgo de raza, no un ajuste por defecto** |
| **Materiales** | Qué se elige por defecto de la §10 de la biblia (cuero, metal, tela, madera, piedra) |
| **Motivos** | El ornamento repetido: heráldica, runas, huesos, engranajes, conchas |
| **Fondo** | Arquitectura o paisaje del que salen |
| **Silueta** | Qué forma tienen en común los doce |

### El reparto: quién decide el cuerpo

**Los ejes seis, siete y ocho son nuevos** (21 de agosto de 2026) y arreglan un
fallo real: la primera tirada de Humanos salió con los doce sujetos jóvenes,
esbeltos, musculosos y guapos. Y era culpa de este documento, no de la IA. La
plantilla mandaba rellenar `CUERPO Y ROSTRO` con «la anatomía de la raza», la
ficha de Humanos decía «proporción heroica» y eso se pegaba literal doce veces —
así que el Mago flaco y el Sacerdote cansado que pedía su bloque llegaban
contradichos desde arriba.

La anatomía **no es un valor, es un rango**, y se reparte en tres:

| Lo decide | Qué aporta |
|---|---|
| **La raza** | El **rango**: escala en cabezas, rasgos de especie, techo y suelo de masa. Un enano no puede ser esbelto ni un elfo macizo |
| **El papel** (clase o tier) | La **complexión dentro de ese rango**. Un Guerrero es pesado; un Mago no tiene masa; un Miliciano es flaco de comer mal, no de entrenar |
| **El tier o el rango del sujeto** | La **edad y el desgaste**. Un tier 1 es joven porque es carne nueva; un Paladín o un héroe llevan años encima |

**Y la belleza es una decisión, nunca el defecto.** Toda IA de imagen tira a
guapo, joven y simétrico si no se le dice lo contrario, y eso borra media
identidad del juego: un Sacerdote humano de cuarenta y muchos con ojeras y un
elfo deliberadamente hermoso **no pueden salir de la misma plantilla**. Por eso
la belleza sube a eje de raza: en Elfos es un rasgo que se pide, en Humanos es
gente corriente, en Hombres rata da asco, y en Constructos no aplica porque no
hay cara.

> **Se dice en positivo, sujeto a sujeto.** Es la misma doctrina que la §20 de la
> biblia aprendió con `heavy plate armor`: prohibir «musculoso» en el negativo
> rompería al Guerrero, al Paladín y a los Orkos enteros. Lo que va al negativo
> es solo lo que **ningún** sujeto del juego quiere nunca —foto de moda,
> maquillaje, cara de portada—; el resto se pide describiendo el cuerpo que sí
> toca.

### El sistema, antes de las once fichas

Las paletas no se eligieron una a una: se repartieron para que **ninguna pareja
dominante + acento** coincida con otra. Esa es la regla que hace que once razas
sigan distinguiéndose a 100 px.

| Raza | Dominantes | Acento |
|---|---|---|
| 👤 Humanos | Acero azulado · azul heráldico | **Oro** |
| ⛏️ Enanos | Gris piedra · hierro oscuro | **Granate** |
| 💀 No-muertos | Marfil hueso · verdín gris | **Verde espectral frío** |
| 🔥 Demonios | Negro carbón · rojo sangre | **Brasa naranja** |
| 🧝 Elfos | Verdes fríos (salvia, teal) · plata | **Ámbar pálido** |
| 🧌 Orkos | Verde oliva sucio · óxido | **Bermellón mate** |
| 🧚 Feéricos | Lila · menta · rosa pálidos | **Nácar iridiscente** |
| 🐉 Dracónidos | Púrpura profundo · negro escama | **Bronce cálido** |
| 🐀 Hombres rata | Marrón enfermo · gris rata | **Amarillo-verde ácido** |
| 🤖 Constructos | Gris hierro · piedra pálida | **Azul runa encendida** |
| 🧜 Abisales | Azul tinta profundo · negro | **Turquesa bioluminiscente** |

**Tres parejas se acercan, y se separan por otra vía.** Esto importa más que las
paletas en sí, porque es donde una tirada larga se confunde:

| Riesgo | Cómo se separan |
|---|---|
| Verde de **Elfos** vs verde de **Orkos** | Elfos, verde **frío** (azulado, salvia, teal) sobre plata; Orkos, verde **cálido y sucio** (oliva, amarillento) sobre óxido. Y la silueta lo remata: vertical y estrecha contra encorvada y ancha |
| Verde de **No-muertos** vs de **Hombres rata** | No-muertos, verde **pálido, frío y espectral** (luz que no calienta); Hombres rata, verde **ácido y bilioso** (líquido, no luz) |
| Brillo de **Constructos** vs de **Abisales** | El mismo azul-cian, distinta **forma**: en Constructos es **geométrico**, dentro de líneas grabadas; en Abisales es **orgánico**, en manchas y flecos. La forma del brillo distingue más que su color |

Y el recordatorio de `illustrations.md` §4: **una raza se distingue por color y
silueta**, no por dibujarse distinto. La paleta sola no sostiene once razas — por
eso cada ficha cierra con su familia de siluetas.

---

### 👤 Humanos — **aprobada**

La vara de medir: las otras diez se desvían respecto a esta.

| Eje | Definición |
|---|---|
| **Paleta** | Acero azulado y azul heráldico dominantes, tierras neutras de apoyo, **oro** como acento (heráldica, filos, remaches) |
| **Anatomía** | **Rango: ~7 cabezas**, proporción realista. Es la escala de referencia del juego. Dentro de ella cabe **de flaco a macizo**, y lo decide el papel: el Guerrero es pesado, el Mago no tiene un gramo de masa, el Miliciano es delgado de comer mal |
| **Edad** | Adultos de **30 a 50** como norma. El tier 1 puede ser joven (veinti-pocos, carne nueva); los tiers altos y los cuatro héroes son **veteranos**, con arrugas, canas y piel curtida |
| **Belleza** | **Gente corriente.** Es la raza-espejo del jugador: caras comunes, narices normales o grandes, dientes imperfectos, asimetría. Ni un solo sujeto es guapo, y ninguno es monstruoso. Si una cara podría salir en un anuncio, está mal |
| **Materiales** | Acero pulido con abolladuras y cuero marrón; lino y lana en la ropa; tabardo sobre la armadura |
| **Motivos** | Heráldica simple y legible (sol, león), remaches visibles, filigrana escasa |
| **Fondo** | Piedra clara de castillo, campo cultivado, estandartes |
| **Silueta** | Hombros anchos y cintura marcada; el tabardo y la capa dan la lectura a distancia |

### ⛏️ Enanos

| Eje | Definición |
|---|---|
| **Paleta** | Gris piedra y hierro oscuro dominantes, **granate** como acento (capas, penachos, tejido), con latón cálido en la herrería. El granate es lo único saturado de la imagen |
| **Anatomía** | **Rango: ~4,5 cabezas**, bajos y anchísimos, masa en hombros y antebrazos, manos grandes. La barba es estructura, no adorno — define el contorno del pecho. **Ninguno puede ser esbelto**: el rango va de macizo a enorme, y el flaco de la raza sigue siendo más ancho que un humano |
| **Edad** | **Todos leen mayores**, 40 para arriba incluso el tier 1: arrugas profundas, canas en la barba, piel curtida de forja. Un enano joven no se distingue de uno viejo, y está bien — la edad no es el eje que separa sus tiers |
| **Belleza** | **Ninguna, y con orgullo.** Narices grandes y rotas, cejas pesadas, cicatrices de trabajo, dientes desgastados. Su dignidad viene del oficio y del porte, nunca de la cara |
| **Materiales** | Hierro forjado sin pulir, piedra tallada, cuero grueso, latón en lo mecánico. Nada de acero brillante: eso es de Humanos |
| **Motivos** | Nudos geométricos angulares, remaches gruesos, runas grabadas rectas |
| **Fondo** | Galería de mina, forja, arco de piedra tallada. Espacios bajos y cerrados |
| **Silueta** | Trapecio invertido macizo. En los tiers altos **más anchos que altos** — la escalada de tier crece a lo ancho, no hacia arriba |

### 💀 No-muertos

| Eje | Definición |
|---|---|
| **Paleta** | Marfil hueso y verdín gris dominantes, **verde espectral frío** como acento — luz que no calienta: cuencas, magia, vapor. Sin un solo tono de piel sana |
| **Anatomía** | **Rango: proporción humana pero descarnada**, enjuta, hueso visible como estructura. Cuanto más alto el tier, **menos carne**, no más músculo. Es la única raza cuyo rango va hacia el vacío en vez de hacia la masa |
| **Edad** | **Sin edad.** No envejecen, se deterioran. Lo que marca el tier no son años, es **cuánta carne queda** — y en los tiers altos ya no queda ninguna |
| **Belleza** | **Fuera de la escala**: no hay belleza ni fealdad, hay ausencia. Sin tono de piel sana, sin gesto facial, sin mirada. Cuidado con el error clásico de la IA aquí — un no-muerto guapo y pálido es un vampiro de novela juvenil, y esto no es eso |
| **Materiales** | Hueso, armadura oxidada y abollada, sudario podrido, madera astillada, cadena |
| **Motivos** | Costillares, calaveras, vendas sueltas, cadenas, tierra adherida |
| **Fondo** | Cripta, niebla baja a la altura de la rodilla, tierra removida, lápidas |
| **Silueta** | **Rota y asimétrica**: siempre falta algo — un brazo, media coraza, la mandíbula. Es la única raza cuyo contorno está incompleto a propósito |

### 🔥 Demonios infernales

| Eje | Definición |
|---|---|
| **Paleta** | Negro carbón y rojo sangre dominantes, **brasa naranja** como acento e **única fuente de luz** de la imagen: grietas de la piel, filos, ojos |
| **Anatomía** | **Rango: exagerado hacia arriba** — torso enorme, cadera estrecha, piernas digitígradas. Los **cuernos amplían la silueta** y son lo primero que se lee. El rango va de retorcido y flaco (tiers bajos) a colosal (tiers altos), nunca de guapo a feo |
| **Edad** | **Sin edad**, y no se les pone. Lo que crece con el tier es la escala y el daño acumulado —cuernos partidos, quemaduras, cicatrices—, no los años |
| **Belleza** | **Amenaza, no belleza.** En los tiers bajos, deforme y retorcido; en los altos aparece un **porte de depredador** —simetría, aplomo, mirada fija— que impone sin ser atractivo. La tentación de la IA aquí es el demonio sensual de portada: no |
| **Materiales** | Hierro negro al rojo, piel curtida, cadena, obsidiana. Metal que parece recién sacado de la forja |
| **Motivos** | Cuernos, púas, sellos infernales grabados, grietas incandescentes |
| **Fondo** | Roca volcánica, brasas al aire, cielo rojo bajo |
| **Silueta** | **Coronada y asimétrica**: se reconoce por el perfil de la cabeza antes que por el cuerpo. Ningún par de cuernos igual al anterior |

### 🧝 Elfos

| Eje | Definición |
|---|---|
| **Paleta** | Verdes **fríos** (salvia, teal, musgo azulado) y plata dominantes, **ámbar pálido** como acento (gemas, luz filtrada, cuerda de arco). Frío con un punto cálido, nunca al revés |
| **Anatomía** | **Rango: ~8 cabezas**, la más esbelta. Cuello, dedos y extremidades largos, rasgos angulosos, orejas. **Ninguno tiene masa muscular**: el rango va de delgado a fibroso, y ahí se acaba. Un elfo tanque es más alto y mejor armado, nunca más ancho |
| **Edad** | **Sin edad aparente.** Todos leen entre 25 y 40 aunque tengan siglos: sin arrugas, sin canas, sin desgaste de piel. La veteranía se lee en el **equipo y la mirada**, jamás en la cara. Es la única raza a la que la juventud le corresponde |
| **Belleza** | **Sí, y es la única a la que se le pide** — es rasgo de raza, no capricho de la IA. Rasgos finos y simétricos, piel sin marcas, pómulos altos, expresión distante y algo severa. **Belleza fría**, la de una espada bien hecha: nada de dulzura, nada de coquetería, nada de foto de moda. Si sonríe, está mal |
| **Materiales** | Plata trabajada fina, cuero delgado, seda, hoja y madera viva. La armadura se ajusta al cuerpo, no lo engorda |
| **Motivos** | Hoja, enredadera, arco creciente, filigrana **curva** — es la contraria a la enana |
| **Fondo** | Bosque de troncos como columnas, luz filtrada en haces verticales |
| **Silueta** | Alta y estrecha, dominada por **verticales**: telas largas, arcos, cabello. Ocupa poco ancho aunque el tier suba |

### 🧌 Orkos

| Eje | Definición |
|---|---|
| **Paleta** | Verde oliva **sucio** y óxido dominantes, **bermellón mate** como acento — pintura de guerra, aplicada a mano y mal. Todo mate: nada brilla en un orko |
| **Anatomía** | **Rango: masiva y hacia delante** — hombros por encima de la línea del cuello, brazos más largos de lo humano, mandíbula y colmillos adelantados. Va de fibroso y nervudo (tiers bajos) a montañoso; **ninguno es esbelto ni elegante** |
| **Edad** | **Adultos imposibles de datar**, y no importa: los tiers altos son más grandes, no más viejos. Piel curtida y dañada en todos, desde el primero |
| **Belleza** | **Fea, y le da exactamente igual** — eso es parte del personaje. Dientes rotos y desparejados, cicatrices mal curadas, orejas partidas, asimetría facial marcada, piel con costras. Es la raza en la que hay que empujar más fuerte contra el defecto de la IA |
| **Materiales** | Hierro tosco remachado en frío, cuero crudo, hueso y trofeo, cuerda. Equipo **remendado**, nunca fabricado entero |
| **Motivos** | Pintura de guerra, trofeos atados, remiendos, dientes, calaveras ajenas |
| **Fondo** | Campamento con estacas, tierra pisada, humo bajo, empalizada |
| **Silueta** | **Encorvada hacia delante y asimétrica**: un arma o un trofeo desproporcionado rompe el contorno por un lado |

### 🧚 Feéricos

| Eje | Definición |
|---|---|
| **Paleta** | Lila, menta y rosa **pálidos** dominantes, **nácar iridiscente** como acento. La única raza de valores claros: donde las demás oscurecen, esta ilumina |
| **Anatomía** | **Rango: menuda y grácil**, ~6 cabezas pero delgada — pequeña sin ser infantil. Alas de insecto cuando el sujeto las lleva. El rango es estrecho: **ninguno gana masa**, los tiers altos crecen en envergadura de alas y en aparato, no en músculo |
| **Edad** | **Sin edad, de apariencia joven** — y aquí hay una línea que no se cruza: joven **no** es niño. Cuerpo y cara de adulto pequeño, nunca de infante. Es el error que más va a intentar la IA en esta raza |
| **Belleza** | **Bonita e inquietante a la vez.** Rasgos limpios y grandes, ojos **demasiado** grandes para la cara, piel pálida sin marcas. Encanto raro, no sensualidad ni ternura: se mira dos veces porque algo no cuadra, no porque guste |
| **Materiales** | Pétalo, telaraña, hoja, cristal, madera clara. **Translucidez**: se ve algo a través de casi todo |
| **Motivos** | Alas, espirales, luciérnagas, flores, polen suspendido |
| **Fondo** | Claro nocturno, setas, luz de luna, partículas en el aire |
| **Silueta** | **Recortada y ligera**: apéndices finos —alas, velos, cintas— rompen el contorno. La única que no se lee como una masa sólida |

### 🐉 Dracónidos

| Eje | Definición |
|---|---|
| **Paleta** | Púrpura profundo y negro escama dominantes, **bronce cálido** como acento (crestas, garras, herrajes). Joya oscura, no fuego — el fuego es de Demonios |
| **Anatomía** | **Rango: humanoide robusta con cola y hocico** — escama en placas, cresta, garras. Hombros altos y cabeza adelantada. Va de ágil y seco a masivo; **ninguno es delgado**, la escama ya da volumen |
| **Edad** | **Adultos maduros**, sin marcadores humanos de edad: no hay arrugas ni canas en una cara de escama. Lo que envejece es la **escama misma** — mate, partida, con cicatrices de muda en los tiers altos |
| **Belleza** | **Fuera de la escala humana.** Se juzgan como se juzga un animal: por porte, imponencia y simetría de la cresta, no por si la cara es agradable. Nada de hocicos amables ni ojos grandes y expresivos — eso los vuelve mascotas |
| **Materiales** | Escama natural como armadura, bronce martillado, cuero de placa, garra y cuerno |
| **Motivos** | Escama superpuesta, ala, cuerno, cresta dorsal |
| **Fondo** | Acantilado, ruina alta, cielo abierto. La única raza que se dibuja **en altura** |
| **Silueta** | **Ampliada por cola y cresta**: el contorno sale del cuerpo por detrás y por arriba, aunque no haya alas |

### 🐀 Hombres rata

| Eje | Definición |
|---|---|
| **Paleta** | Marrón enfermo y gris rata dominantes, **amarillo-verde ácido** como acento — líquido, no luz: viales, filos manchados, vapor. Enfermo, nunca mágico |
| **Anatomía** | **Rango: encorvada y enjuta**, cola larga siempre visible, hocico, orejas grandes. Rápida y nerviosa, **nunca imponente**. El rango es el más estrecho del juego: todos escuálidos, y el tier alto es más grande sin dejar de estar mal alimentado |
| **Edad** | **Sin edad, siempre adultos escuálidos.** No viven para envejecer. Ni crías ni ancianos: es un ejército de adultos consumidos |
| **Belleza** | **Repulsiva, y es la única que busca dar asco físico.** Dientes incisivos amarillos, calvas de sarna, ojos pequeños y húmedos, pelo pegado. Nada de ratas simpáticas de dibujos: si da ternura, está mal |
| **Materiales** | Trapo cosido, metal **robado y desparejado**, vidrio de vial, cuerda, tubo. Nada hace juego con nada |
| **Motivos** | Viales, remiendos, tuberías, mordidas, la cola como remate |
| **Fondo** | Alcantarilla, tubería, agua sucia, madriguera. Espacios estrechos y húmedos |
| **Silueta** | Baja y encorvada; **la cola cierra la lectura** y es lo que la distingue de un orko pequeño |

### 🤖 Constructos

| Eje | Definición |
|---|---|
| **Paleta** | Gris hierro y piedra pálida dominantes, **azul runa encendida** como acento, y **solo dentro de líneas grabadas** — brillo geométrico, nunca difuso |
| **Anatomía** | **Rango: ninguna orgánica** — proporción arquitectónica, articulaciones visibles, **sin cara** (placa lisa o máscara). No hay piel, no hay músculo, no hay gesto facial. El rango va de esbelto-mecánico a colosal, y es puro volumen construido |
| **Edad** | **Sin edad**: lo que envejece es el material. Un tier bajo va oxidado y desconchado, un tier alto pulido y con la runa entera. Antigüedad, no años |
| **Belleza** | **No aplica: no hay cara.** La única lectura posible es proporción y acabado — burdo y remachado abajo, preciso y grabado arriba. No le pongas ojos humanos ni una máscara con expresión |
| **Materiales** | Hierro fundido, piedra pálida, latón en el engranaje, cristal de runa |
| **Motivos** | Runa grabada en línea recta, engranaje, junta, placa remachada |
| **Fondo** | Taller arcano, sala geométrica, andamio. Arquitectura, no paisaje |
| **Silueta** | **Geométrica y simétrica** — la única raza simétrica del juego, y eso *es* su lectura. Donde las demás tienen asimetría, esta tiene eje |

### 🧜 Abisales

| Eje | Definición |
|---|---|
| **Paleta** | Azul tinta profundo y negro dominantes, **turquesa bioluminiscente** como acento en **manchas y flecos orgánicos** — nunca en líneas: eso es de Constructos |
| **Anatomía** | **Rango: humanoide-pez** — membranas entre los dedos, branquias, ojos grandes **sin párpado**, cuello y torso alargados. Va de larguirucho a masivo-inflado; el volumen viene de aletas y membranas, no de músculo |
| **Edad** | **Sin edad.** Piel lisa y húmeda en todos, sin arrugas: lo que sube con el tier son las **incrustaciones** —percebes, coral, sal— y las cicatrices de arpón. Se envejece por encima, no por dentro |
| **Belleza** | **Ajena e incómoda**, y es su rasgo. Proporción y simetría correctas con **los rasgos equivocados**: ojos fijos sin párpado, boca sin labio, ninguna expresión legible. Ni guapa ni fea — inquietante porque casi funciona. Nada de sirenas |
| **Materiales** | Concha, coral, nácar, arpón de hueso, red. Metal poco y siempre corroído por sal |
| **Motivos** | Espiral de concha, tentáculo, escama de pez, red anudada |
| **Fondo** | Ruina sumergida, columna de agua, luz que entra desde arriba |
| **Silueta** | **Ondulada, nunca recta**: aletas y membranas amplían el contorno y ningún borde es una línea limpia |

---

## Cómo se arma cada prompt

Tres piezas, en este orden:

1. **El prompt base universal** — [`style-guide.md`](../art-direction/style-guide.md#21-prompt-base-universal) §21, literal, sin tocar.
2. **La línea de lienzo** — medidas de [`public/assets/v3/README.md`](../../../public/assets/v3/README.md#lienzo-y-formato). No de memoria.
3. **El bloque del sujeto** — la fila de este documento, más la identidad de su raza:

   > **QUÉ ES:** héroe de clase *(individuo, protagonista)* · unidad de tier N *(tropa)*
   > **SUJETO:** \[nombre\]
   > **CUERPO:** \[**la complexión de ESTE sujeto**, dentro del rango de su raza — no el rango otra vez\]
   > **EDAD:** \[década concreta o «sin edad», según la ficha de su raza y su tier\]
   > **ROSTRO:** \[rasgos de raza + qué NO es: la belleza de la ficha, dicha en positivo\]
   > **EQUIPO:** \[lo que pide su papel + materiales de la raza\]
   > **DEBE VERSE:** \[las Características visibles de su fila\]
   > **POSE:** \[qué está haciendo, de cuerpo entero y con los pies apoyados\]
   > **ESCENARIO:** \[fondo de la raza, subordinado\]
   > **PALETA:** \[la de la raza, con su acento\]

   **`CUERPO Y ROSTRO` se partió en tres campos** (21 de agosto de 2026), y esa
   es la corrección importante. Antes era un solo campo que decía «anatomía de la
   raza», así que los doce sujetos recibían la misma frase y salían todos igual
   de jóvenes, guapos y musculosos. Ahora el **rango** lo pone la raza una vez, y
   **el cuerpo, la edad y la cara** los pone cada sujeto. Si al rellenar `CUERPO`
   estás copiando la ficha de la raza, lo estás haciendo mal.

4. **El negative prompt maestro** — [`style-guide.md`](../art-direction/style-guide.md#20-negative-prompt-maestro) §20, si la herramienta lo admite.

### Qué Características se dibujan y cuáles no

La columna *Características* de las tablas de abajo viene de `razas.md`, pero
**la mitad no es dibujable**. Separarlas evita que la IA intente ilustrar una
resistencia.

| Obligan a algo visible | Qué se ve |
|---|---|
| 🦅 Volador | Alas, y que sostengan el peso |
| 🤖 Constructo | Cuerpo mecánico, articulaciones, sin piel |
| 💀 No-muerto | Hueso expuesto, carne ausente o seca |
| 😈 Demonio | Cuernos, piel infernal, brasa |
| 🌊 Anfibio | Branquias, aletas, membranas |
| 🔥 Fuego / 🔥 Inmune al fuego | Llama en el arma, el cuerpo o la estela |
| ☠️ Veneno | Verdes enfermos, viales, filo manchado |
| 🧊 Congelación | Escarcha, hielo, vaho |
| 🏹 Ataque a distancia | Arma de proyectil en mano |
| 🗡️ Perforante | Punta o filo diseñado para atravesar |
| 💣 Explosivo | Carga, bomba, o el gesto de lanzarla |
| 🐺 Bestia | Rasgo animal real, no un adorno |
| 👑 Líder | Insignia de mando, estandarte |
| 🩸 Robo de vida / 🩸 Hemorragia | Filo dentado, sangre, sed |
| 🐌 Lentitud | Masa que explica la lentitud |

**No se dibujan** (son mecánica invisible, y forzarlas ensucia la imagen):
🔮 Resistencia mágica · 🛡️ Resistente al daño físico · ✨ Resistente a la magia ·
🔥/☠️/🧊 Resistente a… · 😱 Inmune al miedo · 🧪 Inmune a estados alterados ·
🌀 Inmune a la magia · 💥 Golpe crítico · 🎯 Provocación · 🍀 Suerte ·
🛡️ Último aliento · 💚 Regeneración · ☠️ Inmortal · 👻 Resurrección ·
👁️ Percepción · 🐾 Ágil · 🌲 Explorador · ⚡ Aturdimiento · 🌀 Confusión ·
🌑 Ceguera · 🕸️ Inmovilización · 😱 Miedo

Con una excepción de criterio: **si un sujeto se queda sin ninguna
Característica visible** —el Miliciano no tiene ninguna—, no le añadas nada. Su
lectura es su papel y su tier, y un tier 1 debe verse pobre.

---

## Orden de la cola

No es arbitrario: es el orden de dependencia del proyecto
([`docs/v3/status.md`](../../../docs/v3/status.md)).

| Fase | Qué | Cuántos | Estado |
|---|---|---|---|
| **1** | 👤 Humanos completos | 12 | **Listo para generar** |
| **2** | Enanos, No-muertos, Demonios, Elfos | 48 | Identidad definida y **prompts escritos**; entran cuando Humanos esté cerrado y sirva de vara de medir |
| **3** | Los 6 DLC (Orkos, Feéricos, Dracónidos, Hombres rata, Constructos, Abisales) | 72 | Identidad definida y **prompts escritos**, pero **fuera de alcance** hasta que las 5 base estén jugables |

> **Los 132 prompts están montados** (21 de agosto de 2026) en
> [`prompts/`](prompts/preambulo.md), las once razas. Que estén escritos **no
> cambia el orden**: sirven para que el criterio no se pierda y para que las
> decisiones de reparto se tomen con las once delante —así se vio, por ejemplo,
> que el brillo de Constructos y el de Abisales había que separarlos por forma, y
> que Elfos y Feéricos son las dos únicas razas con belleza y de dos clases
> distintas—. Se sigue generando de una en una, y Humanos primero.

Humanos primero no es capricho: son los únicos que dan **vara de medir**. Sus 12
imágenes fijan cuánta masa es «tier 8», cuánto detalle lleva un tier 1 y cuánto
oro es «acento». Todo lo demás se juzga contra ese bloque.

---

# Fase 1 — 👤 Humanos

## Héroes de clase (4)

Individuos. Protagonistas. Cada uno con algo suyo.

| # | Héroe | Papel | Debe verse | Invisible (no dibujar) |
|---|---|---|---|---|
| 1 | ⚔️ **Guerrero** | Tanque / cuerpo a cuerpo | Planta los pies, peso bajo | Resistente al daño físico · Inmune al miedo · Último aliento |
| 2 | 🔮 **Mago** | Daño mágico / control | Sin armadura, foco arcano en mano | Resistencia mágica · Resistente al frío |
| 3 | ✝️ **Sacerdote** | Curación / apoyo | Símbolo sagrado, gesto de bendición | Resistencia mágica · Inmune al miedo |
| 4 | 🏹 **Arquero** | Daño a distancia | **Arco en mano** (🏹) | Percepción · Golpe crítico |

> ⚠️ **Arquero** y **Mago** vuelven como unidades (#6 y #8). Aplica la regla de
> arriba: aquí son *individuos con nombre*, allí son *tropa*.

## Unidades (8) — progresión de tier

La escalada tiene que leerse **en la silueta**, no en la calidad del equipo — y
concretamente en la **proporción**: cabeza pequeña respecto al cuerpo, masa,
cuánto ancho del cuadro ocupa. **No en el tamaño de la figura dentro de la
carta**, que es el mismo 60–70% en los 132 por la regla de encuadre. El detalle
está en [`../art-direction/illustrations.md`](../art-direction/illustrations.md#1-los-sujetos-y-qué-pide-cada-uno)
§1, y allí queda anotado por qué se retiró la exigencia de que «puestas las ocho
en fila el orden fuera evidente»: era incompatible con el encuadre, y una carta
se mira sola.

| Tier | Unidad | Papel | Debe verse | Invisible |
|---|---|---|---|---|
| 1 | 🗡️ **Miliciano** | Infantería básica | *Nada.* Es el suelo: equipo pobre, poca masa, sin adorno | — |
| 2 | 🏹 **Arquero** | Daño a distancia | **Arco** (🏹) | — |
| 3 | 🛡️ **Caballero** | Tanque / cuerpo a cuerpo | Masa y coraza sobre el Miliciano | Resistente al daño físico |
| 4 | 🔮 **Mago** | Daño mágico / control | Foco arcano, sin armadura | Resistencia mágica |
| 5 | 🐎 **Caballería** | Movilidad / carga | **Montado**, lanza en carga | Ágil · Golpe crítico |
| 6 | 🦅 **Grifo** | Criatura voladora | **Alas** (🪽) — no es humano, es criatura aliada | Golpe crítico · Ágil |
| 7 | ✝️ **Paladín** | Tanque / apoyo / sagrado | Cima humana: la armadura más completa de la raza | Resistente al daño físico · Inmune al miedo · Resistencia mágica |
| 8 | 🐉 **Dragón dorado** | Legendaria / daño masivo | **Alas** (🪽) + **fuego** (🔥) + **estallido** (💣). Enorme; el oro de la raza aquí es literal | Inmune al fuego |

> Dos de las ocho —**Grifo** y **Dragón dorado**— no son humanos. Son criaturas
> del bando humano: se someten a la paleta de la raza (§ criaturas de
> `illustrations.md`), pero no llevan su anatomía.

---

# Fase 2 — las otras cuatro razas base

48 sujetos, con su identidad ya definida arriba. Entran **cuando Humanos esté
cerrado**: sin esa vara de medir no hay contra qué juzgar cuánta masa es un tier
8 ni cuánto acento es «acento».

## ⛏️ Enanos

**Héroes:** ⚔️ Guerrero *(tanque)* · ⚙️ Ingeniero *(trampas y artefactos)* ·
🪓 Berserker *(furia; debe verse el filo dentado de 🩸)* · 🔯 Maestro de runas
*(magia rúnica)*
· ⚠️ colisión: **Ingeniero** es también la unidad de tier 4.

| Tier | Unidad | Papel | Debe verse |
|---|---|---|---|
| 1 | ⛏️ Minero | Infantería básica | Herramienta como arma |
| 2 | 🪓 Guerrero enano | Defensa / melé | — |
| 3 | 🔨 Herrero de guerra | Tanque / armas pesadas | Punta perforante (🗡️) |
| 4 | ⚙️ Ingeniero | Trampas / artefactos | Proyectil (🏹) |
| 5 | 🔫 Mosquetero | Distancia / perforación | Arma de fuego (🏹 🗡️) |
| 6 | 🛡️ Guardia de hierro | Tanque extremo | — |
| 7 | 🗿 Gólem de piedra | Constructo / tanque | Cuerpo de piedra (🤖), masa lenta (🐌) |
| 8 | ⛰️ Coloso de adamantita | Legendaria | Constructo (🤖) colosal, perforante (🗡️) |

## 💀 No-muertos

**Héroes:** ⚔️ Guerrero · 💀 Nigromante · 🩸 Vampiro *(sed, 🩸)* · ☠️ Liche.
**Todos llevan 💀 No-muerto: hueso expuesto o carne seca, sin excepción.**
· ⚠️ colisiones: **Nigromante** (tier 5) y **Vampiro** (tier 6).

| Tier | Unidad | Papel | Debe verse |
|---|---|---|---|
| 1 | 🦴 Esqueleto | Infantería básica | Hueso (💀) |
| 2 | 🏹 Arquero esqueleto | Distancia | Hueso + arco (🏹) |
| 3 | 🧟 Necrófago | Movilidad / melé | Carne podrida (💀) |
| 4 | 💀 Guerrero esquelético | Defensa | Hueso + coraza |
| 5 | 🧙 Nigromante | Invocación / control | Muerto que conserva ropa y rango |
| 6 | 🧛 Vampiro | Movilidad / robo de vida | Sed, sangre (🩸) |
| 7 | ☠️ Abominación | Daño masivo | Carne cosida, filo sangrante (🩸) |
| 8 | 🐉 Dragón esquelético | Legendaria | Hueso (💀) + alas (🪽) + escarcha (🧊) |

## 🔥 Demonios infernales

**Héroes:** ⚔️ Guerrero · 🧙 Brujo · 🔥 Inquisidor infernal · 👹 Señor demoníaco.
**Todos llevan 😈 Demonio: cuernos, piel infernal, brasa.**
· ⚠️ colisión: **Señor demoníaco** (tier 7).

| Tier | Unidad | Papel | Debe verse |
|---|---|---|---|
| 1 | 👿 Diablillo | Hostigamiento | Demonio (😈) pequeño |
| 2 | 🗡️ Guerrero infernal | Melé | Demonio (😈) |
| 3 | 🔥 Sabueso infernal | Movilidad / fuego | Bestia + llama (🔥) |
| 4 | 😈 Demonio de batalla | Melé / resistencia | Demonio (😈) con masa |
| 5 | 🧙 Brujo infernal | Maldiciones | Demonio + fuego en la magia (🔥) |
| 6 | 🔥 Demonio de fuego | Elemental / área | Cuerpo **hecho** de fuego (🔥) |
| 7 | 👹 Señor demoníaco | Élite | Demonio con mando |
| 8 | 😈 Balor | Legendaria | Fuego (🔥) + estallido (💣), colosal |

## 🧝 Elfos

**Héroes:** 🏹 Guardabosques *(arco, 🏹)* · 🌿 Druida · ✨ Hechicero · 🗡️ Asesino
*(filo dentado, 🩸)*
· ⚠️ colisión: **Druida** (tier 4); casi: Hechicero, Asesino.

| Tier | Unidad | Papel | Debe verse |
|---|---|---|---|
| 1 | 🏹 Explorador | Exploración / distancia | Arco (🏹) |
| 2 | 🗡️ Guerrero élfico | Melé / velocidad | — |
| 3 | 🏹 Arquero élfico | Distancia / precisión | Arco (🏹) |
| 4 | 🌿 Druida | Curación / naturaleza | — |
| 5 | 🗡️ Asesino élfico | Crítico / movilidad | Filo dentado (🩸) |
| 6 | 🧙 Hechicero élfico | Magia elemental | — |
| 7 | 🦄 Unicornio | Criatura mágica | Criatura, no élfico |
| 8 | 🌳 Ent ancestral | Legendaria | Árbol vivo, masa lenta (🐌) |

> El tier 1 se llama **Explorador** y existe una Característica 🌲 *Explorador*.
> No son lo mismo. Otro nombre que conviene cambiar.

---

# Fase 3 — los seis DLC (fuera de alcance)

72 sujetos. **No se generan** hasta que las 5 razas base estén jugables y con
primer pase de balance. Van aquí para que la lista esté completa, no para
encargarlos.

## 🧌 Orkos
**Héroes:** 🪓 Bárbaro · 🛡️ Jefe de guerra *(👑 insignia de mando)* · 🔮 Chamán · 🏹 Cazador *(🏹 arco, 🐺 rasgo bestial)*. ⚠️ **Bárbaro**, **Chamán**.
**Unidades:** 1 🪓 Guerrero orko *(🩸)* · 2 🏹 Cazador orko *(🏹)* · 3 🪓 Bárbaro *(🩸)* · 4 🐗 Jinete de jabalí *(montado)* · 5 🔮 Chamán · 6 🩸 Carnicero *(🩸 ejecución)* · 7 🧌 Troll de guerra *(💚 regenera)* · 8 👹 Gigante orko *(🩸, colosal)*

## 🧚 Feéricos
**Héroes:** 🪄 Hechicero feérico · 🦋 Ilusionista · 🧚 Hada *(🪽 alas)* · 🗡️ Danzante de hojas *(🩸)*. ⚠️ **Hada**, **Ilusionista**, **Danzante de hojas**.
**Unidades:** 1 🧚 Duende feérico · 2 🏹 Arquero feérico *(🏹)* · 3 🧚 Hada *(🪽)* · 4 🗡️ Danzante de hojas *(🩸)* · 5 🦋 Ilusionista · 6 🌙 Encantador · 7 🦌 Ciervo feérico *(criatura)* · 8 🐲 Dragón feérico *(🪽)*

## 🐉 Dracónidos
**Héroes:** 🐲 Caballero dragón · 🔥 Piromante *(🔥)* · 🪽 Dracoguerrero *(🪽)* · ✨ Oráculo dracónico. ⚠️ **Piromante**, **Dracoguerrero**.
**Unidades:** 1 🗡️ Guerrero dracónido · 2 🏹 Cazador dracónido *(🏹)* · 3 🛡️ Caballero dracónido · 4 🔥 Piromante *(🔥)* · 5 🪽 Dracoguerrero *(🪽)* · 6 🐲 Dracónido ancestral · 7 🐉 Joven dragón *(🪽 🔥)* · 8 🐲 Dragón ancestral *(🪽 🔥 💣, colosal)*

## 🐀 Hombres rata
**Héroes:** 🗡️ Asaltante · ☠️ Alquimista *(☠️ viales)* · 🐀 Señor de la plaga *(☠️)* · ⚙️ Maquinista *(🏹)*. ⚠️ **los cuatro colisionan.**
**Unidades:** 1 🐀 Rata de alcantarilla · 2 🗡️ Asaltante · 3 🏹 Tirador de plaga *(🏹 ☠️)* · 4 ☠️ Alquimista *(☠️ 🏹)* · 5 ⚙️ Maquinista *(🏹 💣)* · 6 🐀 Señor de la plaga *(☠️)* · 7 🐀 Rata ogro *(🩸)* · 8 🧪 Abominación de plaga *(☠️ 🩸, colosal)*

## 🤖 Constructos
**Héroes:** ⚔️ Autómata de guerra · 🏹 Cañonero *(🏹 🗡️)* · ⚙️ Ingeniero arcano · 🔮 Gólem rúnico. ⚠️ **los cuatro colisionan.**
**Todos llevan 🤖 Constructo: cuerpo mecánico, sin piel. Ninguno tiene cara humana.**
**Unidades:** 1 ⚙️ Autómata · 2 🛡️ Guardián mecánico · 3 🏹 Cañonero *(🏹 🗡️)* · 4 ⚙️ Ingeniero arcano · 5 🗡️ Autómata de guerra *(🗡️)* · 6 🔮 Gólem rúnico · 7 🗿 Gólem de guerra *(🐌)* · 8 ⚙️ Coloso mecánico *(🗡️, colosal)*

## 🧜 Abisales
**Héroes:** 🔱 Guardián de las profundidades · 🐙 Invocador abisal · 🌊 Brujo de las mareas · 🧠 Devoramentes. ⚠️ **Invocador abisal**, **Brujo de las mareas**, **Devoramentes**.
**Todos llevan 🌊 Anfibio: branquias, aletas, membranas.**
**Unidades:** 1 🐟 Merodeador abisal · 2 🔱 Guerrero de las profundidades · 3 🏹 Cazador abisal *(🏹 arpón)* · 4 🌊 Brujo de las mareas *(🧊)* · 5 🐙 Invocador abisal · 6 🧠 Devoramentes · 7 🦑 Horror de las profundidades *(tentáculos, 🧊)* · 8 🐙 Kraken ancestral *(tentáculos, 🧊, colosal)*

---

## Contabilidad

| | Héroes | Unidades | Total |
|---|---|---|---|
| Fase 1 — Humanos | 4 | 8 | **12** |
| Fase 2 — 4 razas base | 16 | 32 | **48** |
| Fase 3 — 6 razas DLC | 24 | 48 | **72** |
| | **44** | **88** | **132** |

> **Son 11 razas, no 10.** Cinco base (Humanos, Enanos, No-muertos, Demonios,
> Elfos) y **seis** de DLC (Orkos, Feéricos, Dracónidos, Hombres rata,
> Constructos, Abisales). `razas.md` dice «5 razas base y 6 de DLC» —correcto— y
> tres líneas después «las 10 razas»; el mismo «10» está en
> [`docs/v3/status.md`](../../../docs/v3/status.md) y en
> [`lib/dev-registry.ts`](../../../lib/dev-registry.ts). La tabla de héroes tiene
> 44 filas, que confirma 11. Hay que corregir el número, o quitar una raza.
