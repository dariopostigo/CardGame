# CardGame — Cartas: Maldiciones

Carta de **efecto negativo persistente** que **ocupa un hueco del mazo personal** (a diferencia de un Efecto/Estado temporal de combate, [`effects.md`](effects.md)). Sistema en [`../game-design.md`](../game-design.md) §3.2. Índice de cartas en [`README.md`](README.md). Valores = **primer pase sin balancear**.

## 1. Concepto

- **Penaliza doble:** aplica su efecto negativo **y** te roba un hueco del mazo.
- **No se puede descartar ni vender** voluntariamente (a diferencia del equipo): hay que **limpiarla** (§5).
- **Presión sobre el máximo del mazo:** una Maldición se añade aunque estés en el máximo (`../game-design.md` §4), empujándote **por encima del tope**. Mientras estés por encima **no puedes draftear ni comprar cartas nuevas** — así la Maldición no solo estorba, congela tu progreso hasta que la limpies (o vendas equipo para hacer hueco a tu crecimiento futuro, pero el hueco maldito solo se libera limpiándola).

## 2. Severidad *(no usan Rareza)*

Las Maldiciones **no** usan el sistema de Rareza de las cartas buenas (§3.3). Usan **severidad**, que determina lo dañinas que son y lo caro/difícil que es quitarlas:

| Severidad | Coste de limpieza (Templo) | Prueba alternativa (gratis, arriesgada) |
|---|---|---|
| **Leve** | 30 oro | 1d20 + mod SAB o CON vs CD 12 |
| **Grave** | 60 oro | 1d20 + mod SAB o CON vs CD 14 |

*(Una tercera categoría "Nefasta", ligada a jefes, queda como posible ampliación futura.)*

## 3. Catálogo (boceto)

### Leves

| Maldición | Efecto |
|---|---|
| Peso maldito | −1 Movimiento por turno |
| Herida infectada | 1 de daño al inicio de tu turno cada 2 turnos en combate |
| Velo de sombras | Oteas solo 1 carta en vez de 2 en el drafting (`../game-design.md` §4) |
| Mano temblorosa | **Desventaja** ([`effects.md`](effects.md)) en tu primera tirada de cada combate |

### Graves

| Maldición | Efecto |
|---|---|
| Marca del cazador | Los enemigos te detectan +1 hex más lejos (`../enemies.md` §2) → más combates |
| Sangre lenta | Toda curación que recibes se reduce a la mitad (pociones, acampar, Palabra sanadora) |
| Fatiga eterna | Tienes **1 Dado de Vida menos** disponible (`../game-design.md` §4c.4) hasta limpiarla |
| Susurros | Al inicio de cada combate, salvación SAB CD 12 o quedas **Asustado** 1 turno ([`effects.md`](effects.md)) |

## 4. De dónde salen (fuentes)

- **Mal presagio** — carta de Suceso del mazo de encuentro ([`encounter.md`](encounter.md)): impone una Leve.
- **Trampa** — la carta de Suceso "Trampa" puede imponer una Leve en vez de daño.
- **Fichas ambiguas falladas** — una ficha de Amenaza/Terreno resuelta mal (`../board-map.md` §4).
- **Habilidades de enemigo/jefe** — algunos jefes imponen una **Grave** al golpear con cierta habilidad (por definir en sus bloques, `../enemies.md`).
- **Eventos narrativos de Campaña** — Graves temáticas ligadas a la historia.

## 5. Cómo se limpian *(decidido)*

- **Templo/Santuario** (`../board-map.md` §3b): pagas oro según severidad (§2) → eliminación **garantizada**. Es el uso principal del Templo y un sumidero de oro (`../game-design.md` §6b.2).
- **Prueba gratuita pero arriesgada:** 1d20 + mod SAB/CON vs la CD de su severidad (§2). Éxito = la quitas; fallo = sigue puesta (y, opcional, pierdes el intento hasta el próximo descanso).
- **Futuro:** una carta/habilidad especial de Clérigo o un NPC (Tabernero/Clérigo, `../npcs.md`) podría retirarlas sin coste de oro.

## 6. Próximos pasos

- [ ] Balancear costes de limpieza y frecuencia con la que aparecen.
- [ ] Definir qué jefes/enemigos concretos imponen qué Maldición Grave (enlazar con sus bloques en `../enemies.md`).
- [ ] Decidir si existe la categoría "Nefasta" (§2) y para qué jefes.
- [ ] Cuando quieras, ampliar el catálogo de §3.
