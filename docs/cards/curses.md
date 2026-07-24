# CardGame — Cartas: Maldiciones

Carta de **efecto negativo persistente** que **ocupa un hueco del mazo personal** (a diferencia de un Efecto/Estado temporal de combate, [`../effects.md`](../effects.md)). Sistema en [`../game-design.md`](../game-design.md) §3.2. Índice de cartas en [`README.md`](README.md). Valores = **primer pase sin balancear**.

## 1. Concepto

- **Penaliza doble:** aplica su efecto negativo **y** te roba un hueco del mazo.
- **No se puede descartar ni vender** voluntariamente (a diferencia del equipo): hay que **limpiarla** (§4).
- **Presión sobre el máximo del mazo:** una Maldición se añade aunque estés en el máximo (`../game-design.md` §4), empujándote **por encima del tope**. Mientras estés por encima **no puedes draftear ni comprar cartas nuevas** — así la Maldición no solo estorba, congela tu progreso hasta que la limpies (o vendas equipo para hacer hueco a tu crecimiento futuro, pero el hueco maldito solo se libera limpiándola).
- **Severidad, no Rareza:** las Maldiciones **no** usan el sistema de Rareza de las cartas buenas (`../game-design.md` §3.3). Usan **severidad**, que determina lo dañinas que son y lo caro/difícil que es quitarlas — coste de limpieza **por defecto** según severidad (cada Maldición puede tener su propio coste individual, §2):

  | Severidad | Coste de limpieza por defecto (Templo) | Prueba alternativa (gratis, arriesgada) |
  |---|---|---|
  | **Leve** | 30 oro | 1d20 + mod SAB o CON vs CD 12 |
  | **Grave** | 60 oro | 1d20 + mod SAB o CON vs CD 14 |

  *(Una tercera categoría "Nefasta", ligada a jefes, queda como posible ampliación futura.)*

## 2. Catálogo (boceto)

| Maldición | Efecto | Coste de limpieza | Severidad |
|---|---|---|---|
| Peso maldito | −1 Movimiento por turno | 30 oro | Leve |
| Herida infectada | 1 de daño al inicio de tu turno cada 2 turnos en combate | 30 oro | Leve |
| Velo de sombras | Oteas solo 1 carta en vez de 2 en el drafting (`../game-design.md` §4) | 30 oro | Leve |
| Mano temblorosa | **Desventaja** ([`../effects.md`](../effects.md)) en tu primera tirada de cada combate | 30 oro | Leve |
| Marca del cazador | Los enemigos te detectan +1 hex más lejos (`../characters/enemies.md` §2) → más combates | 60 oro | Grave |
| Sangre lenta | Toda curación que recibes se reduce a la mitad (pociones, acampar, Palabra sanadora) | 60 oro | Grave |
| Fatiga eterna | Tienes **1 Dado de Vida menos** disponible (`../game-design.md` §4c.4) hasta limpiarla | 60 oro | Grave |
| Susurros | Al inicio de cada combate, salvación SAB CD 12 o quedas **Asustado** 1 turno ([`../effects.md`](../effects.md)) | 60 oro | Grave |

## 3. De dónde salen (fuentes)

- **Mal presagio** — carta de Suceso del mazo de encuentro ([`encounter.md`](encounter.md)): impone una Leve.
- **Trampa** — la carta de Suceso "Trampa" puede imponer una Leve en vez de daño.
- **Fichas ambiguas falladas** — una ficha de Amenaza/Terreno resuelta mal (`../board-map.md` §4).
- **Habilidades de enemigo/jefe** — algunos jefes imponen una **Grave** al golpear con cierta habilidad (por definir en sus bloques, `../characters/enemies.md`).
- **Eventos narrativos de Campaña** — Graves temáticas ligadas a la historia.

## 4. Cómo se limpian *(decidido)*

- **Templo/Santuario** (`../board-map.md` §3b), atendido por el **Sacerdote/Sanador** ([`../characters/npcs.md`](../characters/npcs.md)): pagas el coste de limpieza de la Maldición (§2, por defecto según severidad, §1) → eliminación **garantizada**. Es el uso principal del Templo y un sumidero de oro (`../game-design.md` §6b.2).
- **Prueba gratuita pero arriesgada:** 1d20 + mod SAB/CON vs la CD de su severidad (§1). Éxito = la quitas; fallo = sigue puesta (y, opcional, pierdes el intento hasta el próximo descanso).
- **Futuro:** una carta/habilidad especial de Clérigo o el **Sacerdote/Sanador** ([`../characters/npcs.md`](../characters/npcs.md)) podría retirarlas sin coste de oro.

## 5. Próximos pasos

- [ ] Balancear costes de limpieza y frecuencia con la que aparecen.
- [ ] Definir qué jefes/enemigos concretos imponen qué Maldición Grave (enlazar con sus bloques en `../characters/enemies.md`).
- [ ] Decidir si existe la categoría "Nefasta" (§1) y para qué jefes.
- [ ] Cuando quieras, ampliar el catálogo de §2.
- [x] Convertir la agrupación Leves/Graves del catálogo en columna **Severidad** explícita, igual que Rareza en las demás cartas.
- [x] Plegar §Severidad dentro de §1 Concepto, y añadir columna **Coste de limpieza** por maldición (§2) para poder personalizarlo por carta en el futuro.
