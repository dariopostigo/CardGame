# CardGame — Documento de diseño (borrador inicial)

Mezcla de mecánicas de **D&D** (personajes, estadísticas, progresión, identidad de héroes/enemigos/NPCs — ver [`heroes.md`](heroes.md), [`enemies.md`](enemies.md), [`npcs.md`](npcs.md)) con **Viajes por la Tierra Media** como inspiración solo de la **estructura de cartas y mazo** (mazo personal, iconografía de pruebas) y del **tablero** (ver [`board-map.md`](board-map.md)) — no de la identidad de personajes/razas, que ya se fijó como D&D puro. Este documento se irá ampliando iteración a iteración.

## 1. Concepto central

Cada jugador controla un personaje con estadísticas de tipo D&D. Construye y baraja un **mazo personal** (clase + objetos equipados) que representa tanto sus capacidades como la suerte de cada turno. Las cartas de objeto (armas, armaduras, pociones, hechizos) se juegan desde la mano para modificar estadísticas propias, de aliados o de enemigos, o para aplicar ventaja/desventaja.

## 2. Personaje y estadísticas

Base D&D (6 características clásicas), sin descartar incorporar algo de Viajes si aporta:

| Estadística | Uso principal |
|---|---|
| Fuerza | Daño cuerpo a cuerpo, pruebas de fuerza bruta |
| Destreza | Iniciativa, esquiva, ataques a distancia |
| Constitución | Puntos de Vida (PV), resistencia a efectos |
| Inteligencia | Hechizos arcanos, pruebas de conocimiento |
| Sabiduría | Hechizos divinos/naturales, percepción |
| Carisma | Interacción social, hechizos de pacto/inspiración |

Cada personaje tiene: PV, Nivel, Clase, y las 6 estadísticas con su modificador (igual que D&D: `mod = (stat - 10) / 2`).

## 3. Tipos de carta

1. **Cartas Básicas de Clase** — inspiradas en las cartas "Básica 1/2/3" de Viajes. Cada clase tiene un set fijo de cartas genéricas disponibles desde el nivel 1 (p. ej. Guerrero: "Golpe firme", "Postura defensiva").
2. **Cartas Especiales de Clase** — se desbloquean por nivel/hito, igual que las subclases de D&D. Más potentes, uso limitado (una vez por combate/descanso).
3. **Cartas de Objeto**:
   - **Armas** — añaden daño y tipo de daño (cortante, perforante, contundente), pueden requerir stat mínima.
   - **Armaduras** — suman a la Defensa/CA, pueden restar Destreza si son pesadas.
   - **Pociones** — efecto de un solo uso (curación, buff temporal de stat).
   - **Hechizos** — como Objeto pero consumen un recurso de "maná/espacios de conjuro" en vez de jugarse libremente.
4. **Cartas de Efecto/Estado** — ventaja, desventaja, aturdido, envenenado; se colocan sobre un personaje (propio, aliado o enemigo) y modifican sus próximas pruebas.

Todas las cartas de Objeto/Efecto siguen el mismo patrón que viste en Viajes: **coste** (si aplica) + **texto de efecto** + **modificador de estadística o de prueba**.

## 4. Mazo y turno

- El mazo de cada jugador = cartas básicas de clase + cartas especiales desbloqueadas + objetos equipados.
- Se baraja al inicio de la partida/combate; se roba una mano fija cada turno (la "suerte" del turno).
- En el turno: jugar 1 o más cartas de la mano (según recurso de acción disponible), resolver efectos, robar para reponer mano al final.
- Pruebas de estadística: tirar 1d20 + modificador (D&D) **o** alternativamente resolver con el valor de una carta robada (estilo Viajes) — a decidir cuál encaja mejor jugando unas partidas de prueba; ambas son compatibles con el mismo mazo.

## 5. Progresión de personaje

- Subir de nivel por hitos de historia (como D&D 5e "milestone leveling"), no por XP acumulada — encaja mejor con partidas cortas de cartas.
- Cada nivel: +1 PV máx (según clase), posible mejora de estadística, y desbloqueo de 1 carta especial de clase nueva que se añade al mazo personal.
- El equipo (armas/armaduras/objetos) se consigue jugando, no por nivel — dos ejes de progresión en paralelo (personaje vs. mazo de objetos), igual que en Viajes (colección de cartas de Objeto) combinado con el nivel de personaje de D&D.

## 6. Ventajas/Desventajas y objetivo de las cartas

Las cartas de Objeto/Efecto pueden apuntar a:
- **A ti mismo**: +stat, ventaja en próxima prueba, curación.
- **A un aliado**: buff temporal, protección (redirigir daño).
- **A un enemigo**: -stat, desventaja, daño directo, estado (aturdido/envenenado).

Esto es clave para que el "deckbuilding" tenga sentido táctico: no solo mejoras tu personaje, sino que tu mazo también decide cómo afectas al resto de la mesa.

## 7. Próximos pasos / temas a documentar

### Dudas/inconsistencias detectadas al revisar contra board-map.md, enemies.md, npcs.md y heroes.md

1. **Falta el sistema de puntos de movimiento por turno.** `board-map.md` ya da por hecho que existe (§4 y §8 "Bloqueadas": "un pool de puntos de movimiento por turno, ej. 3"), pero aquí no hay ninguna sección que lo defina. Es el bloqueo principal de esa duda en `board-map.md` — hay que decidir de qué stat depende (¿Destreza? ¿fijo por clase?) y cuánto es la base.
2. **Falta el sistema de rango de visión / habilidades de exploración.** Mismo caso: `board-map.md` §4 habla de "habilidades/hechizos del personaje" que amplían la visión, y `heroes.md` ya asigna al Pícaro el rol de "buen aliado en fichas de Exploración/Amenaza", pero aquí no hay ninguna Carta Especial de Clase de exploración definida todavía.
3. **Falta un recurso de economía/moneda.** `npcs.md` necesita saber con qué paga el jugador a un Vendedor o contrata a un Mercenario — aquí no existe ningún recurso de este tipo (oro, gemas, etc.) en el personaje.
4. ~~El tracker de Miedo seguía como "candidato" pero otros documentos lo asumían adoptado~~ → **Resuelto:** se saca de la documentación activa y pasa a la sección "Ideas futuras" (abajo). `board-map.md` y `heroes.md` se actualizan para no depender de él.
5. **Posible tensión entre Nivel de Desafío (CR) de `enemies.md` y el "leveling por hitos" de aquí (§5).** El CR de D&D normalmente escala con el nivel de personaje de forma bastante mecánica; el leveling por hitos de historia no tiene esa relación 1:1. Falta decidir cómo traducir "el jugador está en el capítulo 3" a "qué CR de enemigo le toca".
6. **Falta cross-reference con el mazo de encuentro.** `board-map.md` §5 define un mazo de encuentro separado del mazo personal, específico para combates/eventos en el mapa — aquí (§4, Mazo y turno) solo se habla del mazo personal, sin mencionar que en combate sobre el mapa conviven los dos.
7. **El combate paso a paso (checklist, abajo) es un bloqueo compartido** con `board-map.md` ("cómo interactúan mapa y combate") y `enemies.md` ("de la ficha al combate") — cuando se defina aquí, hay que volver a esos dos documentos.

### Checklist

- [ ] Definir lista de clases iniciales (2-3 para el prototipo) con sus cartas básicas — ya hay un boceto de roster en [`heroes.md`](heroes.md), falta confirmarlo y diseñar las cartas.
- [ ] Definir resolución exacta de pruebas (d20 vs carta robada vs híbrido).
- [ ] Bocetar 5-10 cartas de ejemplo por categoría (arma, armadura, poción, hechizo, efecto).
- [ ] Definir combate: orden de turno, cómo se resuelve un ataque paso a paso.
- [ ] Definir condición de victoria/derrota y estructura de "descanso" (recuperar recursos).
- [ ] Definir puntos de movimiento por turno (duda 1).
- [ ] Definir las primeras habilidades/cartas de exploración (duda 2).
- [ ] Definir recurso de economía/moneda (duda 3).
- [ ] Definir cómo se traduce capítulo/hito de Campaña a CR de enemigo esperado (duda 5).

## Ideas futuras (sin implementar)

Aparcadero de ideas que no forman parte del diseño activo todavía, para no perderlas ni confundirlas con mecánicas ya decididas.

- **Tracker de Miedo**: recurso narrativo separado de los PV (efectos negativos progresivos si se acumula, sin significar muerte directa), inspirado en Viajes por la Tierra Media. Se descartó como mecánica activa por ahora — si en el futuro se retoma, hay que revisar `board-map.md` (terreno Nieve/Tundra) y `heroes.md` (§3) para volver a engancharlo ahí.

## Referencias de inspiración

- Mecánica de mazo/pruebas: `docs/links.txt` (ejemplos visuales de CSS para cartas) y `public/assets/viajesporlatierramedia_examplecards*` (cartas reales de Viajes por la Tierra Media).
- Estadísticas y progresión: reglas base de D&D 5ª edición.
