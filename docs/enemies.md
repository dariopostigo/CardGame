# CardGame — Enemigos (borrador)

Documento dedicado exclusivamente a los enemigos: tipos, cómo aparecen en el mapa, comportamiento y jefes. El resto del tablero (terreno, fichas, niebla de guerra) vive en [`board-map.md`](board-map.md); el sistema de combate y estadísticas de personaje viven en [`game-design.md`](game-design.md).

**Base: bestiario de D&D** — los enemigos son variantes con nombre propio de criaturas estándar del Manual de Monstruos (lobo, bandido, trasgo/goblin, esqueleto, araña gigante, trol, etc.), no criaturas de Tolkien/Viajes. Las categorías de dificultad (§3) usan como referencia el concepto de **Nivel de Desafío (CR)** de D&D en vez de inventar una escala propia desde cero.

## 1. Cómo aparece un enemigo en el mapa

Según [`board-map.md`](board-map.md) (sección de fichas del tablero), hay dos formas de encontrarse un enemigo:

- **Ficha de Amenaza** (icono rojo sin definir): ambigua, el jugador no sabe con certeza que es un enemigo hasta interactuar — podría ser otra cosa (trampa, peligro de terreno).
- **Ficha de Enemigo** (icono de enemigo): confirmada de antemano, el jugador ya sabe que va a combatir antes de entrar en el hexágono.

Esta distinción da dos sabores de encuentro: la sorpresa de la Amenaza (tensión de no saber) frente a la decisión táctica del Enemigo confirmado (el jugador puede elegir evitarlo o prepararse antes de entrar).

## 2. Comportamiento en el mapa (pendiente de decidir)

Preguntas abiertas para definir cómo "viven" los enemigos en el mapa, no solo cómo aparecen:

- **¿Estáticos o con movimiento?** Un enemigo fijo en su hexágono es más simple de implementar; un enemigo que patrulla (se mueve por su grupo, o incluso entre grupos) da más tensión pero requiere una mini-IA de movimiento.
- **¿Detección activa?** Si patrulla, ¿tiene su propio "rango de detección" que puede descubrir al jugador aunque el jugador no lo haya visto todavía (emboscada al revés)?
- **¿Reaparecen?** Si el jugador limpia una zona de enemigos, ¿el mapa puede generar nuevos con el tiempo (presión constante) o quedan despejados para siempre (progreso permanente)?

## 3. Categorías de enemigo (ejemplo, no oficial)

| Categoría | CR de referencia (D&D) | Dónde aparece | Notas |
|---|---|---|---|
| Común | CR 1/8 – 1 | Ficha de Amenaza/Enemigo normal, cualquier terreno | Combate rápido, loot menor |
| Élite | CR 2 – 5 | Ficha de Enemigo en una localización "Guarida" (`board-map.md` §3b), o como boss del Modo Prueba | Combate más largo/duro, loot garantizado bueno |
| Jefe de capítulo | CR 6 – 10 | Asociado a un Castillo/Fortaleza o evento narrativo concreto en Modo Campaña | Ligado a la historia de ese capítulo, no aparece en Modo Prueba |
| Jefe final de campaña | CR 11+ | Último mapa de la Campaña (`board-map.md` §2b) | Cierra el arco narrativo principal, el más elaborado de todos |

Los rangos de CR son solo una referencia de partida tomada de D&D para ordenar la dificultad relativa entre categorías, no implican usar las stats exactas del Manual de Monstruos — el sistema de combate propio (`game-design.md`) tendrá su propia forma de medir dificultad más adelante.

## 4. De la ficha al combate

Al activar una ficha de Amenaza (revelada como enemigo) o de Enemigo, se entra en combate usando el sistema de `game-design.md` (estadísticas, mazo personal) y el mazo de encuentro de `board-map.md` §5 (cartas cortas de acción durante el combate en el mapa, tipo "Captura"/"Abatimiento").

## 5. Boceto de enemigos de ejemplo (nombres orientativos, no oficiales)

**Comunes** (ficha de Amenaza/Enemigo normal):

| Enemigo | Terreno/localización típica | Idea de gancho mecánico |
|---|---|---|
| Lobo de las lindes | Bosque | Ataca mejor en pareja/manada (bonus si hay 2+ juntos) |
| Bandido merodeador | Llanura, Camino/Sendero | Ataque básico; puede robar un objeto y huir en vez de luchar a muerte |
| Trasgo de pantano | Pantano | Bajo HP, veneno al golpear (estado negativo, no solo daño) |
| Esqueleto errante | Ruinas/Cueva, Cripta/Cementerio (`board-map.md` §3b) | No-muerto: resistente a perforante, débil a contundente |
| Araña cavernaria | Montaña, Mina | Telaraña: puede inmovilizar/atascar en vez de solo hacer daño |

**Élite** (ficha de Enemigo en localización "Guarida", o boss del Modo Prueba):

| Enemigo | Dónde | Idea de gancho mecánico |
|---|---|---|
| Capitán bandido | Guarida en Llanura/Camino | Llega acompañado de 1-2 Comunes de refuerzo |
| Trol de las minas | Guarida en Mina | Mucho HP, golpe que ignora parte de la armadura ligera |
| Araña matriarca | Guarida en Montaña/Cueva | Versión grande de la Araña cavernaria, veneno más fuerte |

**Jefe de capítulo** (Modo Campaña, ejemplo — nombres provisionales hasta tener la historia de `board-map.md` §2b):
- *"El Heraldo Ceniciento"* — sirviente de rango alto del antagonista de la Campaña, controla un Castillo/Fortaleza tomado en un capítulo intermedio.

**Jefe final de campaña** (ejemplo):
- *"La Sombra que Devora"* — antagonista principal, cierra el arco narrativo en el último mapa.

## 6. Próximos pasos / preguntas abiertas

- [ ] Decidir estático vs. patrulla para el prototipo (recomendado: estático primero, patrulla como mejora posterior).
- [ ] Poner stats básicas (sin balancear) a los 5 enemigos comunes del boceto de arriba.
- [ ] Definir el enemigo élite/boss del Modo Prueba en detalle (vínculo con la localización "Guarida" de `board-map.md` §3b) — probablemente uno de los 3 Élite de arriba.
- [ ] Definir cómo escala la dificultad de los enemigos comunes según el tamaño/profundidad del mapa o el nivel del personaje (partiendo de los rangos de CR de §3 como referencia).
- [ ] Decidir si los nombres/historia de los jefes de capítulo y final son estos provisionales o se rediseñan al escribir la Campaña de verdad.
- [ ] Cuando quieras, ir añadiendo más enemigos al bestiario de §5 (comunes, élite, o nuevos jefes).
