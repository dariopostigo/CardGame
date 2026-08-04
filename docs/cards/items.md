# CardGame — Cartas: Items

Catálogo de cartas de **Item** — la categoría más amplia (tipo/icono en [`../game-design.md`](../game-design.md) §3.2, Rareza en §3.3). Incluye equipo de aventurero, herramientas, objetos mágicos, consumibles (pociones, pergaminos) y cartas de movimiento. Índice de cartas en [`README.md`](README.md).

## 1. Equipo de aventurero

Primer pase de efectos, sin balancear. La **Antorcha** ya es una carta de Arma ([`weapons.md`](weapons.md) §3) y la **Poción de vida**/**Pergamino** ya son Consumibles (§4) — no se repiten en esta tabla.

<!-- cards: item -->

| Objeto | Tipo | Efecto | Rareza |
|---|---|---|---|
| Catalejo | Pasiva | Mientras esté **en juego**, al **Otear** revelas **3 cartas y eliges 2** (en vez de 2 y 1): preparas cartas el doble de rápido (`../game-design.md` §4). Si "en juego" está **lleno**, cada carta que te quedes sustituye a una que ya tuvieras (2 sustituciones, misma regla 1-por-1 de §4) | Poco común |
| Saco / bolsa | — | Sin efecto mecánico — almacenamiento de sabor, se vende por poco oro | Común |
| Saco de dormir | Pasiva | Al jugar la Hoguera (§4b), recuperas **+1 Dado de Vida** extra. *(En el prototipo no hay Dados de Vida —la Hoguera cura fijo, `../game-design.md` §4c.4—, así que de momento vale **+2 PV** al acampar.)* | Común |
| Manta | Accion | Ignora el **−1 de movimiento** de Nieve/Tundra este turno (`../board/board-map.md` §3) | Común |
| Cuerda de cáñamo | Accion | Cruzas un hexágono de Río/Lago sin la penalización de nadar | Común |
| Yesca y pedernal | Accion | Enciendes la Antorcha o la Hoguera sin gastar tu Acción rápida ese turno *(texto pendiente de revisar, §6)* | Común |
| Linterna (sorda o de aceite) | Pasiva | Como la Antorcha, pero puedes apagarla/encenderla como Acción rápida sin jugar otra carta — control de iluminación para el sigilo *(texto pendiente de revisar, §6)* | Poco común |
| Odre / cantimplora | Pasiva | Ignora el consumo extra de recursos en Desierto/Erial (`../board/board-map.md` §3) | Común |
| Raciones de viaje | Accion | **+1 PV** al curarte en el próximo Descanso corto | Común |
| Kit de escalada | Accion | Reduce a 1 el coste de movimiento de la Montaña este turno: te permite cruzarla sin necesitar movimiento extra (`../board/board-map.md` §3a) | Común |
| Ganzúas | Accion | Prueba de Destreza para abrir una cerradura sin forzarla (evita ruido/alarma) | Común |
| Espejo de acero pequeño | Accion | Miras el interior de un grupo vecino sin entrar (como quedar Detectado al instante). *(Grupos: **inactivo en el prototipo**, `../board/board-map.md` §2c.)* | Poco común |
| Cadena | — | Sin efecto mecánico — atar a un enemigo rendido/derrotado (Modo Campaña) | Común |
| Estacas de hierro | Accion | Bloqueas un paso; el primer enemigo que te persiga pierde 1 turno | Poco común |
| Martillo | Pasiva | Ventaja en pruebas de Fuerza para forzar puertas u objetos atrancados | Común |
| Pala / pico | — | Sin efecto propio todavía — necesaria para recolectar mineral si se activa **Minería** (`../ideas.md`) | Común |

> **Mochila — deshabilitada *(decidido)*.** Su efecto era "**+1 hueco** en el máximo del mazo personal", pero la carta **ocupa ella misma un hueco del Mazo** para darte uno: neto **0**, no hacía nada. Retirada del catálogo (y por tanto de la vista de cartas) hasta que tenga un efecto que funcione de verdad — candidatos: **+2 huecos**, o que el hueco extra sea **solo para items**, o convertirla en equipo fuera del Mazo como las armas (`../game-design.md` §4a).

> **Raciones de viaje, Martillo y Ganzúas** son también la base de sendas familias completas (Poco común → Legendario en §5b), reforjables en el Mercader.

## 2. Herramientas

Primer pase de efectos, sin balancear.

<!-- cards: item -->

| Herramienta | Tipo | Efecto | Rareza |
|---|---|---|---|
| Herramientas de artesano (herrero, alfarero, tejedor...) | — | Sin efecto propio todavía — necesarias para craftear si se activa el sistema de **Profesiones** (`../ideas.md`) | Común |
| Instrumento musical | Pasiva | Ventaja en pruebas de Carisma para entretener o calmar a un NPC | Común |
| Kit de disfraz | Pasiva | **+2** para evitar detección al cruzar una localización poblada, o ventaja en Carisma para hacerte pasar por otro | Poco común |
| Kit de falsificación | — | Sin efecto mecánico — documentos falsos/salvoconductos (Modo Campaña) | Común |
| Kit de venenos | Accion | Tu próximo impacto con arma aplica **Envenenado** ([`../effects.md`](../effects.md)) | Poco común |
| Herramientas de navegante | Pasiva | **+1 rango de visión** al entrar en un grupo nuevo (Partida rápida) | Común |
| Mapa del cartógrafo | Accion | Revela (*Detectado*) los grupos vecinos al usarlo. *(Requiere el sistema de grupos/tiles — **inactivo en el prototipo** de niebla simple, `../board/board-map.md` §2c y §8.)* | Poco común |
| Juego de dados / cartas | — | Sin efecto mecánico — sabor de Taberna, candidato a minijuego futuro | Común |
| Trampa para osos | Accion | Colocas una trampa en un hex adyacente; el primer enemigo que entra queda **Inmovilizado** y recibe 1d6 contundente | Poco común |
| Grilletes | — | Sin efecto mecánico — capturar vivo a un enemigo derrotado en vez de matarlo (Modo Campaña) | Común |

## 3. Objetos mágicos raros/legendarios

Se **encuentran** (loot de Élite/Jefe, cofres de alta rareza) y, de momento, también pueden **salir en la oferta del Mercader** — no hay tope de rareza en tienda (`../game-design.md` §6b.3, `../characters/npcs.md` §3). Efectos = primer pase sin balancear. Las cartas de **arma** mágica (con nombre pero forma de arma: espadas, bastones...) viven en [`weapons.md`](weapons.md) §6 "Futuras implementaciones" en vez de aquí, para no mezclar los dos catálogos.

<!-- cards: item -->

| Objeto | Tipo | Efecto | Rareza |
|---|---|---|---|
| Manto de invisibilidad | Accion | Quedas **Oculto** ([`../effects.md`](../effects.md)) sin necesitar terreno | Legendario |
| Anillo de deseo | Accion | Copia el efecto de una carta de habilidad de clase que hayas visto este combate, o cúrate al máximo | Legendario |
| Orbe de dragón | Accion | Aliento de 4d6 de fuego en un hex y sus adyacentes (salvación DES por mitad) | Legendario |
| Guantelete del ogro | Pasiva | +2 de Fuerza efectiva para armas y pruebas; +2 al daño cuerpo a cuerpo | Épico |
| Botas de teletransporte | Accion | Te teletransportas hasta 3 hex (ignora terreno y adyacencia) | Épico |

## 4. Consumibles

Pociones (efecto instantáneo: curación, buff temporal), Pergaminos (lanzan un hechizo concreto — sostienen el modelo de hechizos-como-cartas, sin maná, de `../game-design.md` §4b.7). Todos son Tipo Accion: se juegan gastando tu Acción principal (`../game-design.md` §4b.3).

> **Un consumible es un uso por preparación, no un grifo abierto.** Por la **regla madre** de `../game-design.md` §4, beber la Poción la **saca de "en juego"** y la devuelve al Mazo: para volver a beberla tiene que **salirte otra vez en un Oteo**. Ahí está su límite natural — ya no hace falta ninguna etiqueta de tope aparte (§3.1 de `class.md`): el techo sostenible de curación es el ritmo del Oteo (~1 carta por turno), y gastar tu Acción en curarte es renunciar a tu ataque normal ese turno. *(Punto a vigilar al testear: un Clérigo que dedique cada Oteo a **Palabra sanadora** en vez de atacar puede superar el daño entrante de un Élite a cambio de todo su ritmo ofensivo. Es una estrategia legítima de desgaste, la paga en turnos y en Nivel de Amenaza — pero si al jugar convierte los combates en una eternidad, la palanca es bajar la curación de esa carta, no tocar la regla.)*

<!-- cards: item -->

| Consumible | Tipo | Efecto | Rareza |
|---|---|---|---|
| Poción de vida | Accion | Recuperas PV al instante (ej. 2d4+2) | Común |
| Antídoto | Accion | Retira el estado **Envenenado** ([`../effects.md`](../effects.md)) | Común |
| Pergamino (hechizo) | Accion | Lanza un hechizo concreto: `1d20+3` de tirada, CD 13 | Poco común |

> Poción de vida, Antídoto y Pergamino son la base de sendas **familias con escalera de Rareza completa** (§5b) — reforjables en el Mercader (`../game-design.md` §6d).

## 4b. Recuperación / Descanso

Cartas ligadas al sistema de **Descanso y recuperación** (`../game-design.md` §4c). A diferencia de las pociones (se juegan en cualquier momento, incluido combate), la Hoguera solo se juega fuera de combate, arriesga una emboscada, y no puedes volver a jugarla hasta que ocurra algo (§4c.2).

<!-- cards: item -->

| Carta | Tipo | Efecto | Rareza |
|---|---|---|---|
| **Hoguera / Campamento** | Accion | **Solo fuera de combate.** **Descanso corto:** recuperas **la mitad de tus PV máximos** (redondeo arriba). Acampar en terreno inseguro **arriesga una emboscada** (roba del [`encounter.md`](encounter.md)); Bosque es seguro. No re-acampable hasta que ocurra algo (`../game-design.md` §4c.2). *(Cura fija en el prototipo; con la progresión de nivel pasa a gastar Dados de Vida, §4c.4.)* | Común |

> También es la base de una familia completa (Poco común → Legendario en §5b): más curación y, a partir de Raro, quita el riesgo de emboscada al acampar.

> El **descanso largo** (cura total, recupera Dados de Vida, retira estados) no es una carta: ocurre en localizaciones seguras — Pueblo/Taberna/Templo (`../board/board-map.md` §3b, `../characters/npcs.md`, `../game-design.md` §4c.3).

## 5. Cartas de movimiento

Subtipo de Item que se juega para ganar **movimiento extra** ese turno, por encima del estándar de 2 (`../game-design.md` §2.2). Tipo Accion: se juegan gastando la Acción principal.

Son también, las tres, el **premio fijo por acertar la prueba de la Ficha de Terreno** (`../board/board-map.md` §4b, `../game-design.md` §6b.6): una carta por escalón de rareza, así que la tirada de rareza de esa ficha ya elige cuál de las tres cae.

<!-- cards: item -->

| Carta | Tipo | Efecto | Rareza |
|---|---|---|---|
| Bota veloz | Accion | +2 de movimiento este turno | Común |
| Atajo del pícaro | Accion | +1 de movimiento e ignoras el coste extra de terreno difícil (Pantano) este turno | Poco común |
| Zancada del viento | Accion | +3 de movimiento este turno | Raro |
| Botas del viento norteño | Accion | +4 de movimiento este turno e ignoras el coste extra de cualquier terreno difícil | Épico |
| Alas de Mercurio | Accion | +6 de movimiento este turno e ignoras el coste extra de cualquier terreno difícil | Legendario |

- **Épico y Legendario no salen todavía de la Ficha de Terreno** (`../board/board-map.md` §4b, `../game-design.md` §6b.6): esa ficha sigue repartiendo solo entre las tres primeras (45/40/15 %). Las dos nuevas se consiguen como loot general o **reforjando** una de las tres básicas en el Mercader (`../game-design.md` §6d).

## 5b. Progresión por familia — reforjar

A diferencia de Arma/Armadura ([`weapons.md`](weapons.md) §5b, [`armor.md`](armor.md) §6b), el catálogo de Items no tenía el patrón "misma familia, más potencia por escalón": cada item era una carta única con una sola Rareza. Dos familias ya lo tienen (más la de movimiento en §5); el resto del catálogo del prototipo queda pendiente.

<!-- cards: item -->

| Item | Familia | Efecto | Rareza |
|---|---|---|---|
| Poción de vida mejorada | Poción de vida | Recuperas **3d4+2** PV | Poco común |
| Poción de vida superior | Poción de vida | Recuperas **4d4+4** PV, además retira un estado negativo leve | Raro |
| Poción de vida mayor | Poción de vida | Recuperas **6d4+6** PV, además retira cualquier estado negativo | Épico |
| Elixir de vida eterna | Poción de vida | Recuperas **todos** tus PV y retiras cualquier estado negativo | Legendario |
| Antídoto mejorado | Antídoto | Retira **Envenenado** y recuperas **1d4** PV | Poco común |
| Antídoto puro | Antídoto | Retira **Envenenado** y cualquier otro estado negativo leve | Raro |
| Elixir purificador | Antídoto | Retira cualquier estado negativo (incluidos los graves) y recuperas **2d4** PV | Épico |
| Panacea universal | Antídoto | Retira **todos** los estados negativos, recuperas **4d4** PV y ganas inmunidad a Envenenado durante 3 turnos | Legendario |
| Hoguera abrigada | Hoguera / Campamento | Cura mitad de PV máx (redondeo arriba) **+1d6** extra | Poco común |
| Campamento fortificado | Hoguera / Campamento | Cura mitad de PV máx **+2d6** extra, **sin riesgo de emboscada** en terreno inseguro (§4b.2) | Raro |
| Santuario portátil | Hoguera / Campamento | Cura mitad de PV máx **+3d6** extra, sin riesgo de emboscada, además retira un estado negativo leve | Épico |
| Círculo de los ancestros | Hoguera / Campamento | Recuperas **todos** tus PV, sin riesgo de emboscada, retira cualquier estado negativo | Legendario |
| Raciones abundantes | Raciones de viaje | **+2 PV** al curarte en el próximo Descanso corto | Poco común |
| Raciones del explorador | Raciones de viaje | **+3 PV** al próximo Descanso corto, además la mitad de riesgo de emboscada al acampar (§4b.2) | Raro |
| Provisiones del gremio | Raciones de viaje | **+4 PV** al próximo Descanso corto, sin riesgo de emboscada al acampar | Épico |
| Banquete de campaña | Raciones de viaje | **+6 PV** al próximo Descanso corto, sin riesgo de emboscada, además retira un estado negativo leve | Legendario |
| Martillo reforzado | Martillo | Ventaja en pruebas de Fuerza para forzar, **+2** a esa tirada | Poco común |
| Mazo del picapedrero | Martillo | Ventaja **+3**; además rompe sin tirada cualquier mecanismo u objeto simple atrancado | Raro |
| Machacador de puertas | Martillo | Ventaja **+4**; rompe sin tirada cualquier cerradura o mecanismo, simple o complejo | Épico |
| Voluntad inquebrantable | Martillo | Ventaja **+5**; rompe sin tirada cualquier obstáculo físico, incluidos los reforzados con magia menor | Legendario |
| Ganzúas finas | Ganzúas | **+2** a la prueba de Destreza para abrir cerraduras sin forzarlas | Poco común |
| Ganzúas de maestro | Ganzúas | **+4** a la prueba; éxito automático contra cualquier cerradura simple | Raro |
| Llave maestra improvisada | Ganzúas | Éxito automático contra cualquier cerradura no mágica | Épico |
| Susurro de cerrojos | Ganzúas | Éxito automático contra cualquier cerradura, incluida la protegida con magia menor | Legendario |
| Pergamino menor | Pergamino | Lanza un hechizo sencillo: `1d20+2` de tirada, CD 12 | Común |
| Pergamino mayor | Pergamino | `1d20+4` de tirada, CD 14, y si el hechizo ataca lo hace **con ventaja** | Raro |
| Pergamino arcano superior | Pergamino | `1d20+5` de tirada, CD 15, con ventaja | Épico |
| Pergamino del archimago | Pergamino | `1d20+6` de tirada, CD 16, con ventaja; si falla, puedes reintentarlo una vez gratis ese mismo turno | Legendario |

El Pergamino base del §4 (Poco común, `1d20+3`, CD 13) queda como su Nivel 2 — necesitaba un escalón Común por debajo, **Pergamino menor**, para completar la familia igual que el resto.

**Los 9 items del kit inicial** (`../characters/heroes.md` §2d) ya pertenecen a una familia completa de 5 escalones: Poción de vida, Hoguera, Pergamino, Antídoto, Raciones de viaje, Martillo y Ganzúas aquí arriba, más Bota veloz/Atajo del pícaro en la familia de movimiento (§5). **Pendiente:** el resto del catálogo (Catalejo, Kit de venenos, objetos mágicos de §3...), que no bloquea nada — solo amplía qué se puede reforjar más allá del set mínimo.

## 6. Próximos pasos

- [x] Asignar Rareza a cada item.
- [x] Definir el efecto de los objetos mágicos (§3) y de las cartas de movimiento (§5). Falta balancear.
- [x] Definir el efecto de Equipo de aventurero (§1) y Herramientas (§2). Falta balancear.
- [x] Decidir qué subconjunto entra en el prototipo → los **kits iniciales** de `../characters/heroes.md` §2d fijan el set mínimo: Poción de vida, Hoguera, Pergamino, Antídoto, Raciones de viaje, Martillo, Ganzúas, Bota veloz y Atajo del pícaro. El resto del catálogo entra como botín/tienda.
- [x] **Mochila deshabilitada** *(decidido)*: su efecto era neto 0 (§1). Pendiente rediseñarla si se quiere recuperar.
- [x] Separar, si conviene, los items "de sabor/exploración" (Saco/bolsa, Cadena, Juego de dados/cartas, Grilletes...) de los que tienen efecto mecánico real (marcados como "Sin efecto mecánico" en §1/§2).
- [ ] Revisar si Manta/Saco de dormir y Cuerda/Kit de escalada se solapan demasiado una vez se testeen en el prototipo.
- [ ] Balancear Rareza de §5 ahora que ninguna carta es de un solo uso: Zancada del viento (+3, Raro) ya no se diferencia de Bota veloz (+2, Común) por ser desechable, solo por la magnitud — revisar si sigue mereciendo Raro.
- [x] **§1, §2 y §3 llevan ya columna Tipo** *(decidido)*: los tres se habían quedado fuera del pase que migró §4/§4b/§5 a Accion/Pasiva/Turnos; ya está hecho y los prefijos de coste sueltos ("Acción rápida:", "Acción:") se han retirado del Efecto.
- [ ] **Yesca y pedernal** y **Linterna** (§1) describen ahorrarte un coste de *Acción rápida por ítem* al encender algo — ese coste ya no existe (Acción rápida es solo el ataque secundario, `../game-design.md` §4b.3). Llevan Tipo asignado (Accion/Pasiva) pero su texto de Efecto necesita reescribirse cuando se testee.
- [x] Escribir la escalera de rareza por familia (§5b) → **hecho para los 9 items del kit inicial** (Poción de vida, Hoguera, Pergamino, Antídoto, Raciones de viaje, Martillo, Ganzúas y la familia de movimiento del §5). Pendiente el resto del catálogo, ya sin bloquear al Mercader — el patrón está fijado (`../game-design.md` §6d.3).
