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

-   Proporciones heroicas.
-   Cabeza algo mayor que en anatomía realista.
-   Manos y pies ligeramente grandes.
-   Torso y hombros reforzados cuando corresponda.
-   Extremidades simplificadas.
-   Silueta muy clara.
-   Posturas expresivas.

La exageración sirve al diseño, pero no debe convertir a todos los
personajes en caricaturas infantiles.

------------------------------------------------------------------------

## 5. Rostros

Los rostros deben ser expresivos, estilizados y reconocibles.

Se permiten narices grandes, mandíbulas marcadas, cejas fuertes,
arrugas, cicatrices, dientes imperfectos y asimetrías.

La personalidad es más importante que la perfección.

Evitar rostros genéricos, belleza perfecta y realismo fotográfico.

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

**Detalle bajo:**

-   fondo lejano;
-   cielo;
-   montañas;
-   vegetación distante;
-   arquitectura secundaria.

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

------------------------------------------------------------------------

## 16. Fondos

El fondo debe ser fantástico, pero secundario.

Puede incluir bosques, montañas, castillos, ruinas, fortalezas, aldeas,
caminos, mazmorras, campos de batalla, templos, torres, puentes, niebla
y magia.

Jerarquía:

**Primer plano:** detalle medio\
**Personaje:** máximo detalle\
**Fondo medio:** detalle moderado\
**Fondo lejano:** simplificado y atmosférico

El escenario nunca debe robar protagonismo.

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

------------------------------------------------------------------------

## 18. Encuadre

Lo que es estilo: **el personaje va centrado, con aire en los cuatro bordes**, y
el fondo puede llegar hasta el filo aunque el personaje no. Nada importante
—rostro, armas, manos, escudo— pegado al borde, y menos en las esquinas: encima
va un marco que los tapa.

**Las medidas no son estilo y no viven aquí**: tamaño, ratio, sangrado,
transparencia, aire exacto y extensión están en
[`public/assets/v3/README.md`](../../../public/assets/v3/README.md#lienzo-y-formato),
porque dependen del componente que va a pintar la imagen. Están pendientes de
que V3 cierre su marco de carta.

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
> low-poly, text, logo, watermark, UI, frame

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

> **PERSONAJE:** \[descripción\]\
> **EQUIPO:** \[equipo\]\
> **PERSONALIDAD:** \[personalidad\]\
> **POSE:** \[pose\]\
> **ESCENARIO:** \[escenario\]\
> **PALETA:** \[colores\]

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
-   [ ] Silueta reconocible.
-   [ ] Rostro con personalidad.
-   [ ] Colores ricos y gráficos.
-   [ ] Sombras principalmente gráficas.
-   [ ] Pocos degradados fotográficos.
-   [ ] Detalle concentrado en zonas importantes.
-   [ ] Equipo reconocible.
-   [ ] Fondo subordinado.
-   [ ] Puede convertirse posteriormente en sprite.
-   [ ] Pertenece visualmente al mismo videojuego.
-   [ ] No hay fotorealismo.
-   [ ] No parece un render 3D.
-   [ ] No hay exceso de microdetalle.
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
