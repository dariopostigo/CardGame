# El estandarte de raza — concepto

> Concepto de **una pieza**: la bandera que sostiene el emblema de raza. Ni
> dirección de arte —[`../art-direction/`](../art-direction/README.md) decide
> cómo se dibuja una **ilustración**, y esto no lo es— ni iconografía —
> [`../icon-concept/icons.md`](../icon-concept/icons.md) §4 ya cerró el
> **emblema** que va encima—. Nace en el marco de la carta, así que vive aquí,
> al lado del [`README.md`](README.md) donde se comparan los bocetos y del que
> salió la carta elegida (la J · Orla el 25 de agosto de 2026, y la **L · Lámina**
> el 3 de septiembre). El cambio no le afecta: el estandarte cuelga del disco del
> Tier, que es del cuerpo y no del borde, así que cae donde caía.
>
> Escrito el **27 de agosto de 2026**, después de montar los once emblemas en la
> carta y de tener que subirlos de 22 a 27px para que se leyeran. La pregunta que
> lo abre es de Dario: *¿banderas personalizadas por raza, o por otra cosa?*
>
> **Corregido el mismo día, y la corrección es la que ordena el documento.** La
> primera versión ató todo al tamaño que la bandera tiene **en la carta**, 34 × 78
> px, y eso estaba mal: la bandera es una pieza del juego, no un adorno de una
> carta, y va a usarse en más sitios y más grande. **Se trata igual que un
> pictograma**: un archivo por raza, dibujado a 1254 px, que en la carta se ve a
> 34 × 78 igual que un emblema de 1254 se ve a 27. Ver §3 para los tamaños de uso
> y §10 para el archivo.

## 1. Qué es hoy

Tela oscura con la punta cortada al 80 % de su alto, colgada por debajo del disco
del Tier, con el emblema de raza en oro encima. Vive en
[`_cuerpo.scss`](../../../styles/components/card-sketch/_cuerpo.scss)
(`.sketch__banner`), la pintan los bocetos **G**, **H** y **J**, y sus medidas
salen de `$sketch-banner` y `$sketch-disc` en
[`_card.scss`](../../../styles/settings/_card.scss).

**En la carta se ve a 38 × 87 px.** Ese es su tamaño de uso más pequeño, no su
tamaño: es donde la pieza está más apretada y por eso es el que manda sobre lo
que puede *decir*, pero no sobre cómo se dibuja ni cómo se guarda.

> **Al día 27 de agosto de 2026 este párrafo ya es historia.** Lo que sigue
> describe la bandera de CSS —la misma en las once razas—, y ese era el problema
> que este documento venía a resolver. **Las once están dibujadas y montadas**
> (`public/assets/v3/banners/`, mapa en `components/design/v3/sample.ts`), así que
> lo que se ve en la carta ya es un archivo por raza, con su tinte y su corte. El
> paño de CSS sigue en su parcial como red para una raza que entre sin archivo.

Antes **era la misma bandera en las once razas**: mismo corte, misma tela, mismo
degradado de `game("surface-2")` a `card-sketch("void")`. Lo único que cambiaba
de una carta a otra era el emblema de oro que se sienta encima.

Y así **no decía nada que la carta no dijera ya**: la raza está escrita en
versalitas al pie, dibujada en el emblema y contada por la ilustración entera. Es
el cabo suelto que el [`README.md`](README.md) §"Qué falta decidir" tiene abierto
como *«si la carta puede decir la raza dos veces»* — y sigue abierto, porque lo
que el tinte añade es **indexar**, no informar.

## 2. Por qué raza, y qué se descartó

La bandera es **una pieza y puede decir una cosa**. Estos son los candidatos:

| Podría decir | Por qué no |
|---|---|
| **Tier** | Lo dice el disco, en número, **tres píxeles por encima**. La peor redundancia posible |
| **Rareza** | La dice la veta encendida del filete, y el §"Dónde vive la Rareza" del README ya cerró que va **en el metal y no en una ficha** |
| **Facción / bando** | V3 no tiene facciones. Está escrito en el propio parcial: *«en la referencia ahí va el banderín de la facción, y V3 no tiene facción»* |
| **Clase o Característica** | Las Características tienen su raíl de medallones al otro lado de la carta |
| **Unidad / héroe** | Ya lo dice el disco, que cambia el número por una corona. Ver §7 |
| **Raza** ✅ | Es la **única taxonomía del juego** y la única que la bandera no repetiría de una pieza vecina — la repite del *texto* al pie, y eso es lo que hay que resolver |

> **Y la fila de «Facción / bando» tiene fecha de caducidad** *(3-sep-2026)*.
> Dario abre **sub-facciones dentro de las razas**, todavía sin definir
> ([`../races-concept/README.md`](../races-concept/README.md) §"Qué falta
> decidir"). El día que existan, esa fila deja de decir «V3 no tiene facciones»
> y pasa a ser la **candidata más fuerte del cuadro**, con un argumento que
> ninguna otra tiene: sería lo único que la bandera puede decir **sin repetir a
> una pieza vecina**, porque la raza ya la dicen el emblema de encima y la
> versalita al pie — y son justamente los dos huecos que la carta acaba de
> decidir conservar por esto mismo ([`README.md`](README.md) §"Qué falta
> decidir"). La tabla no se toca: es el análisis del 27 de agosto y era correcto
> ese día.

Y hay un motivo de más peso que la carta, que es justamente el de la corrección:
**la raza es lo único de esta lista que existe fuera de la carta.** Un Tier o una
Rareza no significan nada en una pantalla de reclutamiento; una raza sí, y ahí es
donde la bandera se usa grande (§3).

## 3. La escalera de tamaños

La bandera **no se dibuja para la carta**. Se dibuja una vez, grande, y cada
sitio la usa al tamaño que le toca:

| Escalón | Dónde | Qué se ve a ese tamaño |
|---|---|---|
| **~16 px** | Filtros de raza de [`/docs/v3/cards/design`](../../../components/design/v3/CardDesign.tsx) (hoy solo el emblema) | El **tinte**, y prácticamente nada más: a este tamaño la bandera *es* una mancha de color |
| **34 × 78 px** | La carta — hoy la L, y antes los bocetos G, H y J | Tinte + **canto de abajo** + el emblema encima |
| **~100 px** | Cabecera de raza en `/dev/razas` (planificado, [`lib/dev-registry.ts`](../../../lib/dev-registry.ts)) y fichas de la wiki | Aparecen la trama del paño, el fleco, el asta o la anilla de la que cuelga; el remiendo de Hombres rata deja de ser una mancha y se ve que es un remiendo |
| **~350 px** | Ficha de raza o pantalla de reclutamiento, el día que existan | Aparecen el bordado del dobladillo, el desgaste, las costuras, la translucidez real de la membrana |

Dos reglas salen de la escalera, y son las que gobiernan todo lo demás:

**1. Cada escalón AÑADE, ninguno contradice.** Es la jerarquía que
[`icons.md`](../icon-concept/icons.md) §6 ya toma prestada de la biblia visual
—*silueta → línea → forma → color → sombra → detalle*— pero aquí hay que aplicarla
de verdad a varios tamaños, porque los pictogramas se ven a 27 y a 42 y esta
pieza se va a ver de 16 a 350. Si el bordado del dobladillo cambia la silueta que
se ve a 34px, el bordado está mal puesto.

**2. El escalón más pequeño manda sobre lo que la pieza DICE; el más grande,
sobre cómo se dibuja.** A 34px un color macizo se lee y una silueta no —la
diferencia entre una punta y una cola bifurcada son ~8px de muesca sobre una
ilustración con detalle, y es la misma lección que ya se pagó dos veces en este
proyecto: el medallón de Característica nació octógono y se volvió redondo porque
*«a 30px el chaflán son dos píxeles y no se leía»*, y el rombo de Rareza tuvo que
crecer a 20px para que su tallado existiera—. Así que **el dato va en el tinte**,
que sobrevive hasta 16px. Pero eso **no** significa dibujar un rectángulo de
color: significa que el dibujo que se le ponga encima tiene que ser lo primero
que desaparece, no lo que hay que entender.

Es exactamente lo que ya pasa con los pictogramas: la calavera de `no-muertos`
tiene la sien agrietada y la venda contada en el archivo, y en la carta es una
silueta de calavera. Ninguna de las dos lecturas es la equivocada.

## 4. El modelo es la heráldica, y eso no es una metáfora

La pieza ya *es* un gonfalón con una carga de metal encima. La heráldica reparte
esa pieza en dos y le da a cada parte un trabajo distinto:

- **El campo** lleva un *color* (gules, azur, sinople, sable, púrpura): plano,
  mate, teñido.
- **La carga** va en *metal* (oro o plata): encendida, con brillo.

Y trae una regla, la **ley del esmalte**: metal no se pone sobre metal ni color
sobre color. La carga de oro necesita un campo de **color**.

Esa regla es exactamente el fallo que se arregló el 27 de agosto. Las tres piezas
que llevan el emblema tenían la cara clara —del **mismo latón** que el glifo—
porque estaban dibujadas para un emoji oscuro, y con el pictograma de oro el
emblema **se veía como un relieve sin dibujo**
([`icons.md`](../icon-concept/icons.md) §4). Se resolvió a mano, poniéndolas
oscuras. La heráldica lo tenía escrito desde el siglo XIII.

Con lo cual el tinte no es un adorno que se le añade a la bandera: es **lo que la
pieza necesitaba para funcionar**, y de paso lleva un dato.

Y hay sitio para ese color porque la carta dejó esa mitad libre a propósito. La
apuesta de la E, que heredaron la J y la L, dice literal: **«la carta no está
teñida, está encendida»**
([`sketch-cards.tsx`](../../../components/design/v3/sketch-cards.tsx)). El metal
renunció al tinte para quedarse con la luz. El tinte quedó vacante, y la única
pieza de la carta que no es metal es esta.

> **Y con la carta sin marco *(3-sep-2026)* el argumento se refuerza en vez de
> caerse**, aunque haya que releerlo: ya no hay metal del que hablar —se fue el
> filete y con él la veta y la piedra—, así que las señales de Rareza son un baño
> de luz, un halo y **una línea de 2px** en el canto del hueco de arte. Sigue
> siendo luz contra tinte, y el estandarte sigue siendo lo único teñido de la
> carta. La pieza no se mueve: cuelga del disco del Tier, que es del cuerpo.

## 5. Los once tintes

No hay que inventarlos:
[`../races-concept/sujetos.md`](../races-concept/sujetos.md) §"Identidad de raza"
ya fija la paleta de cada raza —2 dominantes + 1 acento— y además dice para qué
sirve el acento: **«es lo que la distingue a 100 px»**. Que es, palabra por
palabra, el trabajo de esta pieza.

**Pero el acento es el eje equivocado, y esto es el hallazgo del documento.** Al
pasar los once por la ley del esmalte y por la paleta de `$rarity`, siete fallan:

- **Cuatro acentos son metales**, no colores: el **oro** de Humanos, el **ámbar
  pálido** de Elfos, el **bronce** de Dracónidos y el **nácar** de Feéricos. Un
  emblema de oro sobre un campo de oro es el bug del 27 de agosto otra vez, con
  la ley del esmalte explicando por qué.
- **Tres colisionan con la escala de rareza**: el azul runa de Constructos con
  `raro` (#3b82f6), el verde espectral de No-muertos y el ácido de Hombres rata
  con `poco-comun` (#3fae5a).

Así que el campo toma **el tono más saturado que la raza tenga y que no sea un
metal** — que unas veces es un dominante y otras el acento:

| Raza | Campo | Hex | Sale de | Materia (§6) |
|---|---|---|---|---|
| 👤 Humanos | Azul heráldico | `#2f4f82` | dominante | tela |
| ⛏️ Enanos | Granate | `#6d1f2b` | acento — *«lo único saturado de la imagen»* | tela |
| 💀 No-muertos | Verdín gris | `#4a5a4a` | dominante | sudario |
| 🔥 Demonios infernales | Rojo sangre | `#7d1616` | dominante | piel |
| 🧝 Elfos | Verde frío | `#1f4a45` | dominante | tela |
| 🧟 Orkos | Oliva sucio | `#4f4a22` | dominante | harapo |
| 🧚 Feéricos | Lila | `#8f74bd` | dominante, **subido de valor** ⚠ | membrana |
| 🐉 Dracónidos | Púrpura profundo | `#3b1c4e` | dominante | tela |
| 🐀 Hombres rata | Marrón enfermo **+ un remiendo ácido** `#a8b820` | `#5a4326` | dominante + acento | harapo |
| 🤖 Constructos | Piedra pálida **+ runa encendida** `#4a7fd4` ⚠ | `#8d8b83` | dominantes + acento | placa |
| 🧜 Abisales | Azul tinta | `#12293f` | dominante | membrana |

**Hombres rata y Constructos son los dos que no llevan un solo tono**, y no por
capricho: el eje *Materiales* de la primera dice *«metal robado y desparejado,
nada hace juego con nada»* —así que su bandera es un remiendo con una pieza que
no pega— y el de la segunda *«brillo geométrico, solo dentro de líneas
grabadas»*.

### Los tres pares que se acercan, y qué los separa

Puestos los once juntos, hay tres parejas a menos de un salto de tono:

| Par | Separados por |
|---|---|
| No-muertos `#4a5a4a` / Orkos `#4f4a22` | El **canto**: sudario deshilachado contra harapo remendado |
| Feéricos `#8f74bd` / Dracónidos `#3b1c4e` | El **valor**: es el único par claro-oscuro de la tabla, y el más fácil de leer |
| Humanos `#2f4f82` / Abisales `#12293f` | El **valor** y el canto: dobladillo recto contra membrana ondulada |

O sea: **el tinte indexa y la materia desempata.** Ninguno de los tres pares
depende del tono para distinguirse, que es lo que hace que once entradas quepan
en una escala de color sin volverse un arcoíris.

### ⚠ Los dos casos que no cierran solos

- **Feéricos** es la única raza de valores claros —*«donde las demás oscurecen,
  esta ilumina»*—, así que su campo debería ser lila **pálido**, y un emblema de
  oro sobre un campo pálido vuelve a ser oro sobre casi-metal. La tabla propone
  subirle el valor (`#8f74bd`) con el argumento de que la regla de los valores
  claros es de la **ilustración** y esta es una pieza de marco. La alternativa es
  dejarlo pálido y darle a ese emblema **plata en vez de oro** — que es la
  excepción al «un solo metal» que [`icons.md`](../icon-concept/icons.md) §7
  tiene abierta. Ver §9.
- **Constructos** es la única cuyo campo lleva una **línea encendida**, y en esta
  carta una línea encendida significa Rareza. Es la colisión de registro más
  fuerte de las once (§8).

### Lo que salió, medido *(27-ago-2026)*

Las once están dibujadas, así que los hex dejan de ser una propuesta. Muestreados
en el centro del paño —algo más oscuros y saturados que la tabla, porque el
archivo lleva el oscurecimiento suave hacia los bordes— salieron **los once
donde tenían que salir**, sin ninguna sorpresa de tono.

La sorpresa está en otro sitio: en el **contraste contra el emblema**, que es lo
que de verdad decide si la pieza funciona. Midiendo el campo contra el oro medio
del emblema que lleva encima:

| | Contraste campo / emblema |
|---|---|
| Dracónidos, Elfos | **2,9 – 3,0** — los mejores |
| Abisales, Enanos | 2,4 – 2,7 |
| Humanos, Demonios, Orkos, Hombres rata, No-muertos | 1,7 – 2,1 — la banda normal |
| ⚠ **Constructos** | **1,30** |
| ⚠ **Feéricos** | **1,06** — el oro y el campo tienen prácticamente la misma luminosidad |

**Son exactamente los dos que este documento había marcado**, y ahora con un
número en vez de con un argumento. El 1,06 de Feéricos es el peor caso posible:
no es que se lea mal, es que el emblema y el campo pesan lo mismo, y encima la
mariposa es el emblema de trazo más fino de los once, así que es el que menos
aguanta perder el borde. Con esto, la disyuntiva del §9 —campo subido de valor
con oro, o campo pálido con plata— **ya no se puede dejar abierta indefinidamente
alegando que quizá se vea bien**: no se ve bien.

Y un tercer dato que no se pidió: **Constructos volvió sin la runa encendida**.
El generador leyó el «un solo tono» y dejó fuera el `#4a7fd4`. No es una decisión
tomada —es una que se saltó—, pero deja ver cómo queda esa raza sin su segundo
color: gris sobre gris, que es justo el 1,30.

## 6. El corte de abajo: seis remates para once banderas

Aquí había un sistema de **seis materias** —tela, piel, harapo, sudario,
membrana, placa— descrito como simulación de material: grano de cuero, hilos
sueltos, nervadura de membrana, trama de lino. **Se cae el 27 de agosto de
2026**, y lo tira una referencia
([`imgs/faction-banners.png`](imgs/faction-banners.png), estandartes de facción
tipo Heroes of Might & Magic): ahí una bandera es un **panel de color liso** con
el emblema dorado encima, y no tiene ni un pliegue. Al pedir material realista,
la IA devolvió banderas cargadas de costuras, herrajes y desgaste — correctas
según el documento y malas según la carta, porque a 34 px todo eso es ruido.

Lo que sobrevive de la idea es lo que se puede dibujar **en plano**: el **corte
del pie**. Sigue habiendo seis remates y siguen saliendo del eje *Materiales* de
cada raza, pero ahora son una forma y no una textura:

| Remate | Cómo se corta el pie | Razas |
|---|---|---|
| **punta** | Punta limpia y simétrica | Humanos |
| **punta roma** | Ancha y maciza, casi trapecio | Enanos |
| **punta aguda** | Larga y estrecha | Elfos |
| **escalonada** | Punta con dos escalones a cada lado, como escamas | Dracónidos |
| **V asimétrica** | Corte duro, un lado más bajo que el otro | Demonios infernales |
| **deshilachada** | Cuatro o cinco lengüetas estrechas y desiguales | No-muertos |
| **rota** | Corte basto e irregular, como arrancado | Orkos, Hombres rata |
| **ondulada** | Ondas suaves y simétricas (Feéricos) o irregulares (Abisales) | Feéricos, Abisales |
| **recta** | Sin punta: horizontal y limpio, porque es una placa rígida | Constructos |

Cuatro de las once —Demonios, No-muertos, Constructos, Abisales— **no tienen tela
en su eje de Materiales**, y eso se sigue leyendo: el corte de una placa de
piedra no puede ser el de un paño. Lo que cambia es que se dice con la silueta y
no con la superficie.

**Y el corte vive en el 20 % inferior de la pieza.** Por encima de esa línea las
once son idénticas salvo el color, que es lo que las hace intercambiables (§7,
§10). Es también lo que hace que el remate se lea a cualquier tamaño: es el único
borde de la bandera que no está pegado a otra cosa.

**Los once remates salieron los que pedía la tabla** *(27-ago-2026)*, uno por uno
y sin ninguna confusión entre los parecidos —la punta roma de Enanos no se
confundió con la limpia de Humanos, ni la ondulada suave de Feéricos con la
irregular de Abisales—. Lo que sí se movió es **cuánto** ocupa cada remate: el
«20 % inferior» es un promedio y en la práctica va del 0 % (Constructos) al 35 %
(Elfos). Ver §10, *«Lo que esto cambia en la carta»*.

## 7. El corte no varía, y esto es una decisión

Lo que **no** varía es la **caja**: anchura, punto de cuelgue y proporción son
las mismas en las once razas. No es un ahorro de dibujo, es lo que sostiene la
geometría del marco — `$banner-left`, `$banner-top` y el acolchado del emblema
salen todos de esas medidas, y en la J además hay una cuenta propia porque el
disco es un PNG que sobresale. Once cajas serían once juegos de geometría, y por
eso §10 pide que las once sean intercambiables dentro del mismo lienzo.

Lo que **sí** varía es el corte del pie (§6), y vive en el **20 % inferior**:
por encima de esa línea las once banderas son el mismo rectángulo. Es lo que
permite meterlas todas en el mismo hueco sin tocar la geometría del marco.

Se descarta, en cambio, variar el corte por **unidad / héroe** —gallardete contra
cola bifurcada—: el disco ya lo dice, cambiando el número por una corona, en la
pieza más pesada y más alta de la carta. Que la bandera lo repitiera sería gastar
su único registro de forma en un dato ya dicho en la mejor posición, mientras la
raza —que no está dicha en ninguna otra pieza que no sea texto— se queda sin él.
**Una pieza, un dato.**

## 8. Lo que cuesta: un segundo eje de color en la carta

Hay que decirlo sin adornos. Hoy la carta tiene **un** eje de color, la Rareza en
la veta. Esto añade el segundo, la Raza en el paño.

Lo que los mantiene separados no es el tono —no cabrían once tintes y cinco
rarezas en una rueda sin chocar— sino **el material y la luz**:

| | Rareza | Raza |
|---|---|---|
| Soporte | Metal | Tela |
| Naturaleza | **Luz emitida**: brillo, saturación alta, halo | **Tinte**: mate, profundo, sin brillo |
| Sitio | El canal del filete, dando la vuelta a la carta | Una ficha en una esquina |

Es la frase de la E puesta a trabajar: *la carta no está teñida, está encendida* —
y ahora hay exactamente una pieza teñida, la que no es metal. **La regla
operativa: el tinte de raza nunca emite luz, y la veta de Rareza nunca es mate.**

**Las dos cartas que hay que montar para saber si aguanta:**

- **Un héroe demonio.** El raíl de héroe es rojo (`rarity("heroe")`, `#d9422c`) y
  el campo de Demonios es rojo sangre. Veta roja encendida y paño rojo mate en la
  misma esquina: es el peor caso del sistema entero.
- **Un Constructo de rareza rara.** Línea azul encendida en el paño y veta azul
  encendida en el filete (`raro` es `#3b82f6`, la runa `#4a7fd4`). Aquí el paño
  habla en el registro de la Rareza.

Si esas dos se leen, las otras cuarenta y seis se leen.

## 9. Qué desatasca de lo que estaba abierto

- **«Si la carta puede decir la raza dos veces»** ([`README.md`](README.md)
  §"Qué falta decidir"). Estaba empatada porque el emblema solo y el texto solo
  dicen lo mismo con la misma fuerza. Un campo teñido rompe el empate en favor
  del emblema: **tinte + emblema se leen a distancia de mesa y la versalita al
  pie no.** No lo decide este documento, pero le da con qué decidirse.

  > **Decidido el 3 de septiembre de 2026, y no hacia donde apuntaba esto: se
  > quedan las dos.** El argumento de arriba sigue siendo cierto —a distancia de
  > mesa el tinte gana a la versalita— pero deja de ser el que decide, porque
  > llegan **sub-facciones** (§2) y con dos taxonomías que decir los dos huecos
  > dejan de pisarse. Lo que este documento aporta no se cae, se revaloriza:
  > **el tinte indexa y la materia desempata** (§5) es exactamente la mecánica
  > que hace falta para meter una segunda taxonomía en una pieza de 34 px sin
  > convertirla en un arcoíris. Y sube el listón del §11: si el paño acaba
  > diciendo la sub-facción, los once tintes dejan de ser once.
- **La excepción al «un solo metal»** ([`icons.md`](../icon-concept/icons.md)
  §7). Era una pregunta sin caso de uso. Feéricos le da uno: si el único campo
  pálido del set lleva emblema de **plata**, el segundo metal deja de ser una
  grieta y pasa a ser la otra mitad de una regla heráldica.

## 10. Producción: un archivo por raza, como los pictogramas

**La norma es la de `icons/` y no una nueva.** Los once emblemas son PNG grandes
que en la carta se ven a 27 px; los once estandartes son PNG grandes que en la
carta se ven a 38 × 87. Mismo trato, mismo sitio — y es lo que permite que la
pieza salga de la carta (§3) sin volver a dibujarla.

**Entregados los once el 27 de agosto de 2026**, y de una sola tacada. Eso último
no es un detalle de calendario: es lo que hace que el paño caiga en el mismo sitio
en los once archivos (**3 px de dispersión sobre 945**, medidos), y por tanto que
**no necesiten la pasada de recorte a caja común** que `icons/` sí tiene abierta.
Las medidas están en
[`public/assets/v3/README.md`](../../../public/assets/v3/README.md) §`banners/`.
Lo que sí queda pendiente de esa pasada es el **peso**: 17 MB entre los once.

**El archivo es la bandera VACÍA: paño, tinte, materia y herraje de cuelgue, y
NADA dibujado dentro.** Sin emblema, sin sello, sin símbolo, sin logotipo. El
emblema se pone encima, y sale de donde ya está: los once PNG de
`icons/races/`, que es lo que la carta hace hoy.

Esto se escribió al revés la primera vez —«la pieza entera, con el emblema
encima»— y una IA lo entendió como lo que decía: banderas con el logo horneado
dentro. La corrección deja el reparto donde la heráldica lo tenía (§4): **el
campo es un objeto y la carga es otro**. Y tiene tres consecuencias buenas:

- **El emblema no se dibuja dos veces.** Ya existe, ya está aprobado y ya se usa
  en otros tres sitios (el medallón de la E, la línea de tipo de la I, los
  filtros de la baraja). Horneado también aquí, serían dos dibujos del mismo
  objeto que pueden separarse.
- **Regenerar un paño no toca su emblema**, y al revés.
- **La bandera vacía sigue diciendo la raza.** El tinte y la materia son por raza
  (§5, §6): un estandarte granate con el dobladillo bordado de nudos angulares es
  enano antes de que le pongas el yunque.

### La zona limpia, que es lo que el archivo tiene que reservar

Al no llevar emblema, el archivo tiene que dejarle sitio, y el sitio está medido
sobre la carta de hoy: el emblema ocupa **del 25 % al 70 % del alto**, centrado,
con el 85 % del ancho. Ahí el paño puede tener trama y caída, pero **no
ornamento**: ni bordado, ni remiendo, ni pliegue duro, ni un roto. Lo que se
ponga ahí compite con un glifo de oro y pierde la pieza entera.

El ornamento vive en los dos extremos: **el herraje de arriba** —asta, anilla,
cordón: el 22 % superior, que en la carta queda **tapado por el disco del Tier**
pero se ve entero en cualquier otro sitio, y por eso no puede estar vacío— y **el
canto de abajo**, que es donde habla la materia.

| | Norma |
|---|---|
| **Cuántos** | **11**, uno por raza |
| **Lienzo** | **1000 × 1760 px** |
| **Paño** | **700 de ancho, centrado**, del y 105 al y 1715. **La proporción 1 : 2,3 es de la TELA, no del lienzo** — el asta sobresale y se lleva el 30 % del ancho |
| **Corte** | Arranca en **y 1393**: el 80 % del paño |
| **Fondo** | Transparente, y sin sombra horneada: la pone el CSS con `drop-shadow`, que sigue la silueta |
| **Extensión** | `.png`, por lo mismo que los pictogramas: transparencia y aristas limpias |

**Y la proporción se aprendió montando la primera** *(27-ago-2026)*. El spec
decía «1 : 2,3» a secas, el generador lo aplicó al **lienzo**, y como el asta se
lleva el 30 % del ancho la tela salió a **1 : 3,0**: en la carta, un estandarte
demasiado largo. Por eso el paño va ahora **en píxeles y no en proporción** — un
número que no se puede aplicar a otra cosa. En la misma pasada el ancho de la
pieza en la carta subió de 34 a **38 px** (`$sketch-banner`): con el paño de CSS
la proporción se aguantaba y con una bandera de verdad se veía estrecha. Ahí se
acabó el margen — en el boceto G la bandera arranca ya a 1 px del filete.

Las medidas de archivo viven, como siempre, en
[`public/assets/v3/README.md`](../../../public/assets/v3/README.md), que es la
fuente única. Aquí solo se dice **qué** se dibuja, y los prompts montados están
en [`prompts/banners.md`](prompts/banners.md).

### Las once tienen que ser intercambiables

Es la única exigencia que un estandarte añade sobre un pictograma, y sale de que
esta pieza **cuelga de un punto**: en la carta se mete en un hueco fijo, debajo
del disco del Tier, y las once tienen que caer igual. Así que el lienzo se
comparte y **el paño ocupa lo mismo en los once**: mismo ancho, mismo canto de
arriba, mismo sitio del emblema. Lo que varía es lo que hay dentro, no dónde
está.

Es el mismo requisito que los pictogramas tienen abierto —la segunda tanda volvió
con la caja del glifo entre el 84 % y el 98 % del lienzo, y `icons.md` §7 tiene
pendiente una pasada de recorte a caja común—, **pero con los estandartes no
llegó a darse**. Medidos los once al entregarlos: el canto izquierdo del paño cae
entre x 132 y x 135, el ancho entre 677 y 680, el canto de arriba entre y 101 e
y 104. **Tres píxeles de dispersión sobre 945**, medio punto porcentual. Son
intercambiables tal cual.

La diferencia con `icons/` es de método y conviene anotarla, porque es lo que hay
que repetir: los once salieron **de una tacada y del mismo prompt**, y los
pictogramas no.

### Lo que esto cambia en la carta

Poco, y esa es la señal de que el reparto es el bueno. Hoy el estandarte son dos
cosas: el paño dibujado en CSS (`.sketch__banner` y su `::before`) y el emblema
puesto encima con un `<img>`. Lo único que cambia es **la primera**: el paño de
CSS pasa a ser una imagen, igual que el disco del Tier de la J dejó de ser CSS y
pasó a ser `frames/tier.png`. El emblema sigue exactamente donde está.

Dos cosas que se van con el paño de CSS y pasan a estar dibujadas en el archivo:
el `clip-path` de la punta y el degradado de la tela. **El corte empieza al 80 %
del alto**, y por encima de esa línea los once archivos son idénticos salvo el
color; del 80 % para abajo, cada raza remata a su manera (§6) — incluida
Constructos, que no remata en punta sino recto.

**Y el 80 % resultó ser un promedio, no una línea.** Medidos los once, el corte
arranca entre el **65 %** del paño (Elfos, que es la punta más larga) y el
**100 %** (Constructos, cortado a escuadra). Es coherente con §6 —el remate *es*
la variable de raza— pero obliga a que el CSS no dé por hecho ningún 80 %: lo
único que tiene que cumplirse es que el emblema quede por encima del corte más
alto, y el peor caso es Elfos, al que le sobra **1 px**. Está anotado en
`_cuerpo.scss`, junto a las fracciones.

## 11. Qué falta decidir

- **Si el tinte entra.** Es la decisión de fondo, la del §8: si la carta admite
  un segundo eje de color. Todo lo demás cuelga de esta.
- ⚠ **Feéricos: campo subido de valor con oro, o campo pálido con plata** (§5, §9).
  La única de las once que no se resuelve dentro de este documento — y desde que
  está dibujada, **la más urgente**: mide 1,06 de contraste contra su emblema.
  Salió con el campo subido de valor y con oro, que era una de las dos ramas, y
  esa rama no funciona. Quedan dos salidas y las dos cuestan un dibujo: bajarle
  el valor al campo (barato, no toca ninguna norma) o darle plata al emblema
  (caro: abre la excepción al «un solo metal» de `icons.md` §7 y toca `icons/`,
  no `banners/`).
- ⚠ **Constructos: si su línea encendida puede convivir con la veta** (§8), o si
  esa raza renuncia al brillo de runa en la bandera y se queda solo con la
  piedra. **Salió sin runa, pero por omisión y no por decisión**, y con 1,30 de
  contraste es la segunda peor. Aquí la runa no era solo carácter: era lo que
  le daba a ese gris algo con lo que contrastar.
- **Si la materia entra a la vez que el tinte o después.** El tinte solo ya indexa
  las once; la materia arregla los tres pares del §5, da carácter y es lo que
  llena los escalones grandes de §3. Se puede montar en dos pasadas.
- ~~**Los once hex son una propuesta, no una medida.**~~ **Resuelto el 27 de
  agosto de 2026**: están dibujados y muestreados (§5). Lo que sigue abierto de
  ese punto es la otra mitad —**verlos sobre las ilustraciones reales**—, que no
  se puede hacer todavía porque solo cuatro razas tienen cartas en la baraja de
  muestra. Ahí es donde un campo mate puede desaparecer contra un fondo del mismo
  tono, y eso no lo dice ninguna medida de contraste contra el emblema.
- **Los sitios grandes de §3 no existen todavía.** `/dev/razas` está planificado
  y bloqueado por la ficha de personaje, y la pantalla de reclutamiento no está
  escrita. Que el archivo se dibuje a 1254 px es precisamente lo que hace que eso
  no importe: la pieza está lista antes de que exista el sitio, igual que los
  pictogramas.
- **El tinte va horneado en el archivo, así que revisarlo es regenerar.** Es la
  contrapartida de que la pieza sea una imagen acabada y no una composición:
  cambiar un tono de la tabla del §5 no es tocar un token, son once dibujos otra
  vez. Por eso conviene mirar los once hex sobre las ilustraciones reales
  **antes** de generar, y no después.
