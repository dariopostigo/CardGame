# CardGame — Cartas: Maldiciones

Carta de **efecto negativo persistente** que **ocupa un hueco del mazo personal** (a diferencia de un Efecto/Estado temporal de combate, [`../effects.md`](../effects.md)). Sistema en [`../game-design.md`](../game-design.md) §3.2. Índice de cartas en [`README.md`](README.md). Valores = **primer pase sin balancear**.

## 1. Concepto

- **Penaliza doble:** aplica su efecto negativo **y** te roba un hueco del mazo.
- **No se puede descartar ni vender** voluntariamente (a diferencia del equipo): hay que **limpiarla** (§4).
- **Presión sobre el máximo del mazo:** una Maldición se añade aunque estés en el máximo (`../game-design.md` §4), empujándote **por encima del tope**. Mientras estés por encima **no puedes incorporar ni comprar cartas nuevas para el Mazo** — así la Maldición no solo estorba, congela tu progreso hasta que la limpies (o vendas equipo para hacer hueco a tu crecimiento futuro, pero el hueco maldito solo se libera limpiándola).
- **Severidad = Nivel, 5 escalones *(decidido, sustituye Leve/Grave)*.** Igual que el resto de cartas (`../game-design.md` §3.3) una Maldición tiene un **Nivel de 1 a 5 con sus estrellas**, pero **leído al revés**: cuanto más alto, peor.

  | Nivel | Severidad | Coste para bajar 1 escalón (Sacerdote) | CD de la prueba gratuita |
  |---|---|---|---|
  | ★ | Leve | 15 oro *(cura del todo)* | 12 |
  | ★★ | Molesta | 21 oro | 13 |
  | ★★★ | Grave | 50 oro | 14 |
  | ★★★★ | Severa | 125 oro | 15 |
  | ★★★★★ | Maléfica | 340 oro | 16 |

  El coste **es la misma tabla universal de reforjar** (`../game-design.md` §6d.1) leída al revés: cruzar el escalón 4-5 cuesta 340 oro subiendo o bajando, cruzar el 1-2 cuesta 21. No hay coste individual por Maldición — a diferencia de la versión anterior, donde cada carta podía llevar su propio precio.
- **Tipo `Pasiva`, pero sin pasar por el Oteo *(decidido)*.** Toda Maldición es Tipo `Pasiva` (ciclo de vida compartido con [`class.md`](class.md) §1, [`items.md`](items.md), [`mercenaries.md`](mercenaries.md)): ninguna caduca sola a los N turnos, todas duran **hasta que la limpies** (§4). La diferencia es el mecanismo de activación: una carta Pasiva de clase/item necesita que la Otees y la juegues para que ocupe su hueco de "en juego"; una Maldición está activa **desde que entra al Mazo**, sin Otearla ni jugarla — por eso robarla en el Oteo **no te da nada que jugar** (de ahí que "diluya" el Oteo, `../game-design.md` línea ~535). Mismo campo, mismo significado de fondo (se queda activa sin volver nunca al Mazo), mecanismo de entrada distinto.

## 2. Catálogo (boceto)

<!-- cards: maldicion -->

| Maldición | Tipo | Efecto | Nivel |
|---|---|---|---|
| Peso maldito | Pasiva | −1 Movimiento por turno | ★ Leve |
| Herida infectada | Pasiva | 1 de daño al inicio de tu turno cada 2 turnos en combate | ★ Leve |
| Velo de sombras | Pasiva | −1 al rango de visión en el mapa (`../game-design.md` §2.3) | ★ Leve |
| Mano temblorosa | Pasiva | **Desventaja** ([`../effects.md`](../effects.md)) en tu primera tirada de cada combate | ★★ Molesta |
| Diarrea tóxica | Pasiva | Al inicio de cada uno de tus turnos, tira 1d6: con 1-2, pierdes tu **Acción rápida** ese turno | ★★ Molesta |
| Marca del cazador | Pasiva | Los enemigos te detectan +1 hex más lejos (`../characters/enemies.md` §2b) → más combates | ★★★ Grave |
| Sangre lenta | Pasiva | Toda curación que recibes se reduce a la mitad (pociones, acampar, Palabra sanadora) | ★★★★ Severa |
| Fatiga eterna | Pasiva | Tienes **1 Dado de Vida menos** disponible (`../game-design.md` §4c.4) hasta limpiarla | ★★★★ Severa |
| Susurros | Pasiva | Al inicio de cada combate, salvación SAB CD 12 o quedas **Asustado** 1 turno ([`../effects.md`](../effects.md)) | ★★★★★ Maléfica |

## 3. De dónde salen (fuentes)

- **Maleficio** — carta de Suceso del mazo de encuentro ([`encounter.md`](encounter.md)): impone una Leve.
- **Trampa** — la carta de Suceso "Trampa" puede imponer una Leve en vez de daño.
- **Fichas ambiguas falladas** — una ficha de Amenaza/Terreno resuelta mal (`../board/board-map.md` §4).
- **Habilidades de enemigo/jefe** — algunos jefes imponen una **Grave** al golpear con cierta habilidad (por definir en sus bloques, `../characters/enemies.md`).
- **Eventos narrativos de Campaña** — Graves temáticas ligadas a la historia.

## 4. Cómo se limpian *(decidido, sustituye la eliminación en un solo pago)*

- **Templo/Santuario** (`../board/board-map.md` §3b), atendido por el **Sacerdote/Sanador** ([`../characters/npcs.md`](../characters/npcs.md)): paga el coste de su Nivel actual (§1) para **bajarla 1 escalón**, garantizado. Una Maléfica (★★★★★) necesita hasta **4 visitas** para curarse del todo (340+125+50+21 = 536 oro) — igual que subir de Nivel una carta buena de 1 a 5 (`../game-design.md` §6d.1), en espejo. Es el uso principal del Templo y un sumidero de oro (`../game-design.md` §6b.2).
- **Prueba gratuita pero arriesgada:** 1d20 + mod SAB/CON vs la CD de su Nivel (§1). Éxito = **baja 1 escalón** (mismo efecto que pagar, gratis); fallo = sigue igual (y, opcional, pierdes el intento hasta el próximo descanso). Igual que el pago, hace falta repetirla una vez por escalón para curarla del todo.
- **Sin vía gratuita pasiva** *(decidido, retira el reloj de desgaste anterior)*: antes aguantar una Maldición la debilitaba sola con el tiempo, sin pagar ni tirar nada. Con la regla general de "solo NPC + oro" para las cinco categorías de carta (`../game-design.md` §6d.1), esa vía queda retirada — una Maldición se queda en su Nivel para siempre hasta que la pagas o superas la prueba.
- **Futuro:** una carta/habilidad especial de Clérigo podría bajar un escalón sin pasar por el Sacerdote.

## 5. Próximos pasos

- [ ] Balancear costes de limpieza y frecuencia con la que aparecen.
- [ ] Definir qué jefes/enemigos concretos imponen qué Maldición y de qué Nivel (enlazar con sus bloques en `../characters/enemies.md`).
- [x] **Severidad ampliada de 2 a 5 escalones** *(decidido, sustituye Leve/Grave)* → §1: mismo eje 1-5 con estrellas que el resto de cartas (`../game-design.md` §3.3), leído al revés. Los 9 curses del catálogo (§2) redistribuidos entre los 5.
- [ ] Cuando quieras, ampliar el catálogo de §2.
- [x] Convertir la agrupación del catálogo en columna **Nivel** explícita (★ a ★★★★★), igual que Rareza en las demás cartas — sustituye la columna "Coste de limpieza" por carta, ya no hace falta (el coste sale del Nivel, §1).
- [x] Definir si las Maldiciones entran en el sistema de reforjado *(decidido)* → **§1, §4**: sí, invertido — el Sacerdote (o la prueba gratuita) baja 1 Nivel por pago/éxito, misma tabla universal de `../game-design.md` §6d.1 leída al revés. Se retira el reloj de desgaste gratuito anterior: ya no baja sola con el tiempo.
