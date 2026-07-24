# CardGame — Cartas: Items

Catálogo de cartas de **Item** — la categoría más amplia (tipo/icono en [`../game-design.md`](../game-design.md) §3.2, Rareza en §3.3). Incluye equipo de aventurero, herramientas, objetos mágicos, consumibles (pociones, pergaminos) y cartas de movimiento. Índice de cartas en [`README.md`](README.md).

## 1. Equipo de aventurero

Primer pase de efectos, sin balancear. La **Antorcha** ya es una carta de Arma ([`weapons.md`](weapons.md) §3) y la **Poción de vida**/**Pergamino** ya son Consumibles (§4) — no se repiten en esta tabla.

| Objeto | Efecto | Rareza |
|---|---|---|
| Mochila | **+1 hueco** en el máximo del mazo personal (`../game-design.md` §4) | Común |
| Saco / bolsa | Sin efecto mecánico — almacenamiento de sabor, se vende por poco oro | Común |
| Saco de dormir | Al jugar la Hoguera (§4b), recuperas **+1 Dado de Vida** extra | Común |
| Manta | Ignora el **−1 de movimiento** de Nieve/Tundra este turno (`../board/board-map.md` §3) | Común |
| Cuerda de cáñamo | Acción rápida: cruzas un hexágono de Río/Lago sin la penalización de nadar | Común |
| Yesca y pedernal | Enciendes la Antorcha o la Hoguera sin gastar tu Acción rápida ese turno | Común |
| Linterna (sorda o de aceite) | Como la Antorcha, pero puedes apagarla/encenderla como Acción rápida sin jugar otra carta — control de iluminación para el sigilo | Poco común |
| Odre / cantimplora | Ignora el consumo extra de recursos en Desierto/Erial (`../board/board-map.md` §3) | Común |
| Raciones de viaje | **+1 PV** al curarte en el próximo Descanso corto | Común |
| Kit de escalada | Reduce a 1 el coste de movimiento de la Montaña este turno: te permite cruzarla sin necesitar movimiento extra (`../board/board-map.md` §3a) | Común |
| Ganzúas | Acción: prueba de Destreza para abrir una cerradura sin forzarla (evita ruido/alarma) | Común |
| Espejo de acero pequeño | Acción rápida: miras el interior de un grupo vecino sin entrar (como quedar Detectado al instante). *(Grupos: **inactivo en el prototipo**, `../board/board-map.md` §2c.)* | Poco común |
| Cadena | Sin efecto mecánico — atar a un enemigo rendido/derrotado (Modo Campaña) | Común |
| Estacas de hierro | Acción rápida: bloqueas un paso; el primer enemigo que te persiga pierde 1 turno | Poco común |
| Martillo | Ventaja en pruebas de Fuerza para forzar puertas u objetos atrancados | Común |
| Pala / pico | Sin efecto propio todavía — necesaria para recolectar mineral si se activa **Minería** (`../ideas.md`) | Común |

## 2. Herramientas

Primer pase de efectos, sin balancear.

| Herramienta | Efecto | Rareza |
|---|---|---|
| Herramientas de artesano (herrero, alfarero, tejedor...) | Sin efecto propio todavía — necesarias para craftear si se activa el sistema de **Profesiones** (`../ideas.md`) | Común |
| Instrumento musical | Ventaja en pruebas de Carisma para entretener o calmar a un NPC | Común |
| Kit de disfraz | **+2** para evitar detección al cruzar una localización poblada, o ventaja en Carisma para hacerte pasar por otro | Poco común |
| Kit de falsificación | Sin efecto mecánico — documentos falsos/salvoconductos (Modo Campaña) | Común |
| Kit de venenos | Acción rápida: tu próximo impacto con arma aplica **Envenenado** ([`../effects.md`](../effects.md)) | Poco común |
| Herramientas de navegante | **+1 rango de visión** al entrar en un grupo nuevo (Partida rápida) | Común |
| Mapa del cartógrafo | Revela (*Detectado*) los grupos vecinos al usarlo. *(Requiere el sistema de grupos/tiles — **inactivo en el prototipo** de niebla simple, `../board/board-map.md` §2c y §8.)* | Poco común |
| Juego de dados / cartas | Sin efecto mecánico — sabor de Taberna, candidato a minijuego futuro | Común |
| Trampa para osos | Acción: colocas una trampa en un hex adyacente; el primer enemigo que entra queda **Inmovilizado** y recibe 1d6 contundente | Poco común |
| Grilletes | Sin efecto mecánico — capturar vivo a un enemigo derrotado en vez de matarlo (Modo Campaña) | Común |

## 3. Objetos mágicos raros/legendarios

Solo se **encuentran** (loot de Élite/Jefe, cofres de alta rareza); los Legendarios **no se venden en tienda** (`../game-design.md` §6b.3). Efectos = primer pase sin balancear. Las cartas de **arma** mágica (con nombre pero forma de arma: espadas, bastones...) viven en [`weapons.md`](weapons.md) §6 "Futuras implementaciones" en vez de aquí, para no mezclar los dos catálogos.

| Objeto | Efecto | Rareza |
|---|---|---|
| Manto de invisibilidad | Acción: quedas **Oculto** ([`../effects.md`](../effects.md)) sin necesitar terreno; 1/combate | Legendario |
| Anillo de deseo | Acción rápida: copia el efecto de una Especial que hayas visto este combate, o cúrate al máximo | Legendario |
| Orbe de dragón | Acción, 1/combate: aliento de 4d6 de fuego en un hex y sus adyacentes (salvación DES por mitad) | Legendario |
| Guantelete del ogro | +2 de Fuerza efectiva para armas y pruebas; +2 al daño cuerpo a cuerpo | Épico |
| Botas de teletransporte | Acción rápida, 1/combate: te teletransportas hasta 3 hex (ignora terreno y adyacencia) | Épico |

## 4. Consumibles

Pociones (efecto instantáneo: curación, buff temporal), Pergaminos (lanzan un hechizo concreto — sostienen el modelo de hechizos-como-cartas, sin maná, de `../game-design.md` §4b.7). Se usan normalmente como **Acción rápida** en combate (`../game-design.md` §4b.3). Como cualquier carta del mazo personal, vuelven a estar disponibles después de jugarlas (`../game-design.md` §4).

| Consumible | Coste | Efecto | Rareza |
|---|---|---|---|
| Poción de vida | Acción rápida | Recuperas PV al instante (ej. 2d4+2) | Común |
| Antídoto | Acción rápida | Retira el estado **Envenenado** ([`../effects.md`](../effects.md)) | Común |
| Pergamino (hechizo) | Acción | Lanza un hechizo concreto | Poco común |

## 4b. Recuperación / Descanso

Cartas ligadas al sistema de **Descanso y recuperación** (`../game-design.md` §4c). A diferencia de las pociones (se juegan en cualquier momento, incluido combate), la Hoguera solo se juega fuera de combate, arriesga una emboscada, y no puedes volver a jugarla hasta que ocurra algo (§4c.2).

| Carta | Coste | Efecto | Rareza |
|---|---|---|---|
| **Hoguera / Campamento** | Fuera de combate | **Descanso corto:** gastas Dados de Vida para curarte y reseteas habilidades 1/descanso. Acampar en terreno inseguro **arriesga una emboscada** (roba del [`encounter.md`](encounter.md)); Bosque es seguro. No re-acampable hasta que ocurra algo (`../game-design.md` §4c.2). | Común |

> El **descanso largo** (cura total, recupera Dados de Vida, retira estados) no es una carta: ocurre en localizaciones seguras — Pueblo/Taberna/Templo (`../board/board-map.md` §3b, `../characters/npcs.md`, `../game-design.md` §4c.3).

## 5. Cartas de movimiento

Subtipo de Item que se juega para ganar **movimiento extra** ese turno, por encima del estándar de 2 (`../game-design.md` §2.2). Se usan como Acción rápida.

| Carta | Coste | Efecto | Rareza |
|---|---|---|---|
| Bota veloz | Acción rápida | +2 de movimiento este turno | Común |
| Atajo del pícaro | Acción rápida | +1 de movimiento e ignoras el coste extra de terreno difícil (Pantano) este turno | Poco común |
| Zancada del viento | Acción rápida | +3 de movimiento este turno | Raro |

## 6. Próximos pasos

- [x] Asignar Rareza a cada item.
- [x] Definir el efecto de los objetos mágicos (§3) y de las cartas de movimiento (§5). Falta balancear.
- [x] Definir el efecto de Equipo de aventurero (§1) y Herramientas (§2). Falta balancear.
- [ ] Decidir qué subconjunto entra en el prototipo (probablemente 3-4 items básicos + 1-2 pociones/pergaminos).
- [x] Separar, si conviene, los items "de sabor/exploración" (Saco/bolsa, Cadena, Juego de dados/cartas, Grilletes...) de los que tienen efecto mecánico real (marcados como "Sin efecto mecánico" en §1/§2).
- [ ] Revisar si Manta/Saco de dormir y Cuerda/Kit de escalada se solapan demasiado una vez se testeen en el prototipo.
- [ ] Balancear Rareza de §5 ahora que ninguna carta es de un solo uso: Zancada del viento (+3, Raro) ya no se diferencia de Bota veloz (+2, Común) por ser desechable, solo por la magnitud — revisar si sigue mereciendo Raro.
