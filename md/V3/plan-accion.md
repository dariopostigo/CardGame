# Plan de acción — rediseño de razas

> Plan de trabajo, no documento de diseño cerrado — por eso vive aquí junto a [`conceptV3.md`](conceptV3.md) y no en `docs/` (que se indexa automáticamente en la wiki, mismo motivo que [`PLAN-COMBATE.md`](../../PLAN-COMBATE.md) en la raíz). Se ajusta a mano conforme avanzamos; cuando una fase se cierra de verdad, lo que decida pasa a los documentos de `docs/` que correspondan (`characters/heroes.md`, `cards/class.md`, etc.), igual que ya pasó con todo lo demás.
>
> **Nada de esto está ejecutado todavía.** Es la hoja de ruta que se va a ajustar antes de tocar ningún fichero del juego.

## Contexto

El diseño actual es "D&D genérico": 4 clases fijas (Guerrero/Mago/Pícaro/Clérigo), bestiario de Manual de Monstruos, armas/armaduras por manos ✋/🤲 y peso — completo en papel para la Partida rápida ([`docs/status.md`](../../docs/status.md) §5) tras varias tandas de corrección de balance.

[`conceptV3.md`](conceptV3.md) propone sustituirlo por **razas** al estilo Heroes of Might & Magic / Magic the Gathering: cada raza con sus propias clases jugables y su propia progresión de 8 unidades (básica → legendaria), más un catálogo transversal de Habilidades base y Características (rasgos) que se les asigna. Da más identidad de facción, estructura los DLC de forma natural, y activa ideas que ya estaban aparcadas en [`docs/ideas.md`](../../docs/ideas.md) (mazo de mercenarios por razas, sistema de debilidades dinámico, arquetipos de IA).

Es un cambio de **contenido e identidad**, no de arquitectura: el motor de reglas (`lib/rules/`) y el pipeline docs→catálogo ([`ARCHITECTURE.md`](../../ARCHITECTURE.md) §4, §7) no distinguen "Mago" de "Hechicero feérico". Lo que cambia es el catálogo (`docs/cards/`, `docs/characters/`) y, ahora que las 6 estadísticas D&D desaparecen del todo (confirmado 2026-08-12, ver "Decisiones ya tomadas"), una parte real del motor de reglas también: todo lo que hoy deriva de FUE/DES/CON/INT/SAB/CAR en `lib/rules/combat.ts` (y donde sea que se calcule el modificador de característica) pasa a derivar de las 8 Habilidades en su lugar — ya no es "un par de sitios concretos", es el sustrato de personaje entero. El tipo de carta "mercenario" (`lib/card-table.ts`, `lib/card-catalog.ts`) sigue siendo el otro cambio de código pendiente, el día que lo sustituya "Unidad".

## Decisiones ya tomadas

- **Las Habilidades y Características SÍ sustituyen del todo a las 6 estadísticas D&D (FUE/DES/CON/INT/SAB/CAR) — confirmado 2026-08-12, corrige la decisión anterior de este mismo punto.** No solo la matemática de combate: también las pruebas fuera de combate (sigilo, atletismo, persuasión), el rango de visión (hoy `2 + mod SAB`) y las salvaciones de estado (`effects.md`). Las 8 Habilidades (Vida/Ataque/Defensa/Resistencia mágica/Precisión/Suerte/Velocidad/Movimiento) + Características pasan a ser el **único** bloque de estadísticas de cualquier personaje, héroe o Unidad. **La asignación de Características ya está — para las 10 razas, héroes y unidades** (`conceptV3.md`, tablas "Tabla de características de héroes" y "Características de todas las unidades"; **confirmado cerrado del todo 2026-08-13** — deja de ser borrador en edición, ya se puede formalizar sobre ella sin más verificación). **Los valores numéricos de Habilidades todavía no** — sigue siendo insumo externo pendiente, este plan no los inventa. La asignación de Características llegó de golpe para las 10 razas porque es un catálogo transversal — **no adelanta la Fase 2**: cartas, balance y arte siguen siendo solo-Humanos hasta cerrar esa fase.
- **Gap real que abre esto — atletismo/persuasión, rango de visión y salvaciones se quedan sin mecanismo** (sigilo ya no aplica — retirado del todo, ver el punto de arriba). Ninguna de las 8 Habilidades es sustituto obvio de "cuánto se te da bien forzar una puerta" o "cuánto resistes un veneno" — conceptV3 punto 1 solo habla de "acciones de combate". Propuesta de Claude (2026-08-12, pendiente de confirmar):
  - **Rango de visión:** base fija igual para todos (sustituye `2 + mod SAB`), con la Característica 👁️ Percepción dando un bonus a quien la tenga — ya asignada a varios héroes/unidades en las tablas nuevas. Ya sin relación con detección (retirada): es solo cuánto revela el mapa.
  - **Pruebas fuera de combate** (atletismo, persuasión, conocimiento...): mismo modelo sin dado que el combate — probabilidad base modificada por Suerte, no `1d20+Suerte` (corregido 2026-08-12, se había quedado con dado por descuido). Características puntuales dan ventaja en casos concretos (ej. 🐾 Ágil en pruebas de movilidad).
  - **Salvaciones de estado — ya no hace falta mecanismo, resuelto 2026-08-12.** De los 3 estados que usaban salvación (Envenenado, Inmovilizado, Asustado), los 3 cayeron en la revisión de "Estados negativos" (abajo). Ningún estado superviviente (Ventaja, Desventaja, Ralentizado, Bendecido, Escudado) usa salvación — el mecanismo entero queda innecesario, nada que repartir entre Defensa/Resistencia mágica.
- **"Guerrero" es una clase compartida entre razas** (aparece en Humanos/Enanos/No-muertos/Demonios infernales con descripción casi idéntica): mismo set de cartas base nuevo, reutilizado entre esas 4 razas — **no heredado del Guerrero D&D actual**, ver "Sustitución total" más abajo —, la raza aporta 1-2 rasgos/arte propios. De las 4 clases de cada raza, normalmente solo hace falta escribir 3 nuevas además de esta.
- **Raza piloto: Humanos.** Se construye de principio a fin (clases + unidades + rasgos + balance) antes de tocar ninguna otra raza — mismo criterio que ya se usó con Guerrero+Mago antes de Pícaro+Clérigo.
- **Unidad reclutable = el mismo sistema de Mercenario-como-ficha-con-turno-propio** ([`docs/cards/mercenaries.md`](../../docs/cards/mercenaries.md) §1b, presupuesto de composición), repartido por raza. El catálogo de 15 mercenarios actual **se descarta**: cada Unidad se escribe desde cero, con sabor de su raza desde el primer borrador.
- **"(NO)" en un rasgo = no se implementa por ahora**, decisión firme y consciente. Afecta en particular a Sigilo.
- **Sustitución total, sin rastro de la versión antigua — confirmado 2026-08-13.** Los héroes actuales (Guerrero/Mago/Pícaro/Clérigo, con Pícaro de raza Mediano) se eliminan del todo — ninguno migra ni de nombre ni de mecánica — y los sustituyen los héroes nuevos por raza. Aplica más allá de las clases: **cualquier carta del catálogo** (arma, armadura, item, mercenario, maldición, encuentro...) que no tenga cabida en V3 se elimina, sin necesidad de un sustituto inmediato. **El calendario lo marca Dario, no las fases de este plan**: revisará personalmente el catálogo completo carta a carta y avisará cuándo generar cada una nueva — sustituye a la idea anterior de "se resuelve al llegar a esa fase/carta" como regla por defecto.

## Abiertos que no bloquean el arranque

- **Enemigos = razas (conceptV3 punto 7), todavía no recogido en este plan.** El propio documento lo dice sin ambigüedad: "los enemigos van a ser las propias razas... una raza como Boss final". Eso significa que las 8 Unidades de cada raza no son solo fichas reclutables ([`docs/cards/mercenaries.md`](../../docs/cards/mercenaries.md) §1b) — cuando esa raza aparece hostil necesitan **también** un bloque de combate al estilo [`docs/characters/enemies.md`](../../docs/characters/enemies.md) §5b, con sus 8 tiers repartidos entre Normal/Élite/Jefe de capítulo/Jefe final (y su coste en el presupuesto de composición, §5b.6) y una entrada de resistencias — **confirmado, ya no hace falta tabla de Naturaleza aparte (§3b):** conceptV3 ya asigna 💀 No-muerto/😈 Demonio/🤖 Constructo/🌊 Anfibio (y el resto de rasgos) directamente a cada unidad y héroe de las 10 razas en su tabla de Características, sin ninguna tabla de tipo intermedia. **Humanos ya tiene precedente hostil hoy** (Bandido merodeador, Capitán bandido — Naturaleza Humanoide), así que no es descartable que el propio piloto necesite las dos caras desde el principio. **Arquetipo de IA por raza — resuelto 2026-08-13: sí, cada raza tendrá el suyo** ([`docs/ideas.md`](../../docs/ideas.md)), pero no desde el piloto — se define en Fase 2, con una segunda raza ya jugable para poder diferenciarlas de verdad; Humanos usa mientras tanto el patrón único de hoy (`enemies.md` §5b.6).
- **Motor de combate — sin ningún dado, resuelto 2026-08-12.** Ni tirada de impacto ni dado de daño: alcance + porcentaje + número fijo.
  - **¿Puedo atacar?** Pura posición, sin tirada: adyacente al objetivo si eres melee, dentro de tu rango si eres a distancia. Sin esto no hay ataque (hay que moverte para entrar en alcance).
  - **¿Acierto?** Todo personaje tiene una probabilidad base de **fallar**; **Precisión** la reduce (nunca a 0 — siempre existe alguna posibilidad de fallar). Se resuelve por porcentaje, no por d20 — sin "tirada", sin "natural 20/1".
  - **¿Crítico?** Todo personaje tiene una probabilidad base de **crítico**; **Suerte** la incrementa. Crítico dobla el daño (mismo espíritu que "nat 20 dobla dados" hoy, sin el dado).
  - **Daño:** número **fijo** de la clase/Unidad + **Ataque** — ni siquiera un "dado fijo": un número.
  - **Defensa:** reduce el daño recibido, no el acierto (eso es solo cosa de la Precisión del atacante). Cuatro Habilidades, cuatro trabajos sin solaparse: Ataque = cuánto pego, Defensa = cuánto absorbo, Precisión = cuánto fallo, Suerte = cuánto critico.
  - **Resistencia mágica:** reduce el daño mágico/elemental recibido, capa extra sobre las resistencias por Naturaleza que ya existen (`game-design.md` §4b.10).
  - **Iniciativa:** el combate ya juega por fases de bando (`game-design.md` §4b.2, `board/battle.md` — todos los aliados, luego todos los enemigos, decidido 2026-08-11), así que Velocidad sustituye al `1d20+mod DES` de hoy en sus dos usos, siempre sin tirar nada:
    - **Orden dentro de una fase** (varios héroes/mercenarios, o varios enemigos): se compara **Velocidad** de cada ficha — la más alta actúa primero dentro de su bando. **Empate — resuelto 2026-08-13:** desempata el **Ataque** más alto.
    - **Qué bando abre la ronda 1** (queda fijo toda la pelea): **resuelto 2026-08-13 — los aliados abren siempre**, regla fija, sin comparar nada entre bandos.
  - **Ataque secundario** (Acción rápida, §4b.3): sigue existiendo como concepto (gastas tu Acción rápida en un segundo intento) — mismo modelo de arriba, número fijo más bajo, sin sumar Ataque completo.
  - **PV máximos:** **Vida** sustituye a `dado de vida + mod CON` — número fijo, tampoco se tira aquí.
  - **Foco de hechizos** (§4b.7): se retira como objeto equipable, pasa a Característica de la clase de caster.
  - **Alcance de "eliminar dados" — aclarado, no toca el resto del azar del juego.** Esto es la mecánica D&D de dados en combate (1d20 de impacto, dado de daño, "natural 20", "2d20 ventaja/desventaja") — **no** toca el Oteo (roba 2 cartas al azar), la rareza del loot ni la generación de mapa: eso ya era elección aleatoria ponderada, no "tirar un dado".
- **Sigilo/detección, retirado del todo — confirmado 2026-08-12, ya no es "esperar a Elfos", es un "no" para todas las razas.** Caen juntos: el invariante "visión de detalle > detección enemiga", la fase de aproximación entera (`enemies.md` §2, §2b, el modelo Latente/Activo), la prueba de sigilo, el estado **Oculto** (sin detección que evitar, se queda sin nada de lo que "ocultarse") y la **emboscada** (dependía por completo del estado Latente/Activo que también cae). El combate empieza siempre "a las claras": el enemigo pasa de Ficha a combate al interactuar/quedar adyacente, sin fase previa. Huérfanos directos: **6 de las 8 cartas del Pícaro** ([`docs/cards/class.md`](../../docs/cards/class.md) §4), [`docs/board/battle.md`](../../docs/board/battle.md) §6/§8 (cita *Escabullirse*/*Botas de teletransporte* por nombre), y el **Asesino élfico** se queda sin el gancho de su propio nombre — solo crítico/movilidad, coherente con que "sigilo" tampoco aparece en su fila de Características (`conceptV3.md`).
- **Estados negativos: revisión exploración vs. batalla — resuelto 2026-08-12.** Criterio de Dario: un estado negativo solo tiene sentido si aplica en el tablero de **exploración**; los que solo aplicaban en la pantalla de **batalla** se quitan. Resultado final de los 7 estados negativos de [`docs/effects.md`](../../docs/effects.md) (fuera Ventaja/Bendecido/Escudado, que son buffs, y Oculto, ya muerto por retirar sigilo):

  | Estado | Perfil | Resultado |
  |---|---|---|
  | Aturdido | Solo batalla | **Cae** |
  | Inmovilizado | Solo batalla | **Cae** |
  | Asustado | Solo batalla | **Cae** |
  | Envenenado | Mixto | **Cae del todo** — también se retira su pata de exploración (cruzar Pantano) |
  | Miedo | Mixto, base exploración | **Cae del todo** — también se retira su pata de exploración (Nivel de Amenaza) |
  | Ralentizado | Mixto | **Sobrevive, solo por terreno/exploración** |
  | Desventaja | Mixto | **El mecanismo sobrevive** (Golpe firme, terreno expuesto/Niebla); **cae** la regla específica de disparar a bocajarro |

  **Catálogo final de `effects.md`: de 11 estados quedan 5** — Ventaja, Desventaja, Ralentizado (solo terreno), Bendecido, Escudado. Ningún estado negativo que dependa de un ataque en combate sobrevive: el combate se queda con daño directo y Ventaja/Desventaja como modificador de tirada, sin capa de control/debuff.

  **Huérfanos con efecto muerto, no solo nombre a cambiar:**
  - *Enredo gélido* (Mago) y *Telaraña* (Araña) — aplicaban Inmovilizado
  - *Aura de corrupción* (Heraldo Ceniciento) — aplicaba Asustado
  - Ataques con veneno de Trasgo/Araña — aplicaban Envenenado
  - *Rayo de escarcha* (Mago) — aplicaba Ralentizado, que ya no vale en combate
  - Golpe firme, mejora de Nivel 5 (Guerrero) — "nat 20 también aplica Aturdido"
  - `docs/board/battle.md` §2 — se retira la regla de disparar a bocajarro con Desventaja
  - `docs/game-design.md` §6c.3 — el umbral del 75 % de Amenaza ("aplica Ralentizado/Envenenado leve/Miedo") tiene 2 de 3 resultados muertos y el tercero ya no vale en combate; necesita reescritura completa
  - `docs/game-design.md` §6c.2 — "fallar sigilo → +2 Amenaza", huérfano por retirar sigilo (no por esta ronda), mismo pendiente
  - Efecto de terreno Pantano (`docs/board/board-map.md` §3a) — perdía Envenenado al cruzarlo; se queda sin penalización especial o necesita una nueva

  **Resuelto 2026-08-13** — ver "Sustitución total, sin rastro de la versión antigua" en "Decisiones ya tomadas": no hay calendario por fase. Esta lista deja de ser una decisión pendiente y pasa a ser solo el inventario de qué repasar; Dario revisa el catálogo completo carta a carta y avisa cuándo generar cada una nueva.

- **Pregunta abierta importante: ¿el criterio "sin estados negativos de batalla" también aplica hacia delante, a las Características nuevas?** La sección "Elementales y estados alterados" del catálogo de `conceptV3.md` (🔥 Fuego, ☠️ Veneno, 🧊 Congelación, 🌑 Ceguera, 🕸️ Inmovilización, 🐌 Lentitud, 🌀 Confusión, 😵 Aturdido, 😱 Miedo, 🩸 Hemorragia) son, por definición, efectos que aplica un **ataque** — solo existen en batalla, igual que los estados recién retirados. Si el mismo criterio sigue vivo para el sistema nuevo, **esa sección entera de Características se queda sin nada jugable que hacer**, y ya hay unidades con esos rasgos asignados en las tablas de `conceptV3.md` (ej. 🐉 Dragón dorado y 🔥 Sabueso infernal, los dos con 🔥 Fuego). **Resuelto 2026-08-12: solo para `effects.md`.** La sección "Elementales y estados alterados" de Características funciona con normalidad — es la base del combate del sistema nuevo, no un resto de D&D que limpiar.
- **El Pícaro actual es Mediano — resuelto 2026-08-13.** Ver "Sustitución total, sin rastro de la versión antigua" en "Decisiones ya tomadas": se elimina del todo, sin raza Mediano ni sustituto dedicado, mismo trato que el resto de héroes D&D. Se lleva por delante la carta de item "Atajo del pícaro" ([`docs/cards/items.md`](../../docs/cards/items.md)), huérfana ahora sin héroe que la use.
- **Nombre nuevo del NPC de mercenarios — resuelto 2026-08-13: "Capataz de reclutas".** Queda solo el ajuste de coherencia: revisar el trasfondo del **Instructor** ([`docs/characters/npcs.md`](../../docs/characters/npcs.md)), que hoy se presenta como "capitán mercenario retirado" — ajustar esa frase al nuevo nombre cuando se toque el documento.
- **El día que "Mercenario" se retire como tipo de carta, hay código además de docs.** `lib/card-table.ts` (unión de tipos y su label) y `lib/card-catalog.ts` (`DOC_ORDER`) tienen `"mercenario"`/`"mercenaries"` como literal. No bloquea la Fase 1 — las cartas de clase no pasan por ese pipeline (`cards/class.md` §1) — es solo el recordatorio para cuando se redacte el catálogo de Unidad de verdad.

## Cómo cambia la estructura de las cartas

Dos capas de cambio distintas, para no mezclarlas al redactar:

**1. Ficha de personaje (héroe o Unidad) — anatomía nueva.** Cada héroe y cada Unidad necesita un bloque con las **8 Habilidades numéricas** (Vida/Ataque/Defensa/Resistencia mágica/Precisión/Suerte/Velocidad/Movimiento — números todavía pendientes de Dario) y su lista de **Características** (ya asignadas en `conceptV3.md`, ej. Dragón dorado: Volador · Inmune al fuego · Fuego · Explosivo). Es el mismo tipo de tabla que ya existe para enemigos ([`docs/characters/enemies.md`](../../docs/characters/enemies.md) §5b: PV/CA/Vel/Det/Ataque/Habilidad) o mercenarios por Rareza ([`docs/cards/mercenaries.md`](../../docs/cards/mercenaries.md) §1b), pero con los nombres nuevos de Habilidad y, **eso sí es nuevo de verdad**, una lista de Características estructurada — hoy el "Habilidad" de un enemigo o el "Efecto" de un mercenario es prosa libre, no una lista de rasgos con nombre fijo que se pueda repetir/comparar entre cartas.

- **Unidad = 1 carta, no 8** (conceptV3 punto 5: "una carta de unidad por cada una de ellas") — a diferencia del héroe (8 cartas de habilidad por clase, `docs/cards/class.md`), cada Unidad es una sola carta con su bloque de Habilidades+Características, del mismo tamaño de contenido que un Mercenario hoy, no que una clase.
- Las 8 cartas de habilidad de cada **clase de héroe** probablemente **mantienen su anatomía actual** (Carta | Tipo | Uso | Efecto) — lo que cambia es el texto del Efecto: en vez de referenciar CA/arma equipada/mod FUE-DES, referencia las Habilidades propias del héroe ("ignora la mitad de tu Defensa objetivo" en vez de "ignora la mitad de la CA"; el ataque básico sale de tu Ataque, no de arma+mod).

**2. Las Características de conceptV3 chocan con — y amplían — el catálogo de Efectos/Estados existente ([`docs/effects.md`](../../docs/effects.md)), término a término:**

| Característica (conceptV3) | Relación con `docs/effects.md` |
|---|---|
| Veneno, Inmovilización | **Mismo estado ya existente** (Envenenado, Inmovilizado) — reusar sin tocar nada |
| Aturdimiento *(rasgo ofensivo)* | **Aturdido cayó (confirmado, "Estados negativos" arriba)** — esta Característica necesita un efecto de batalla nuevo, ya no puede disparar un estado que no existe |
| Miedo | **El choque de nombre se resolvió solo:** el "Miedo" de `effects.md` cayó del todo en la revisión de "Estados negativos" (arriba) — ya no queda nadie con quien confundirse. El "Miedo" de conceptV3 (parálisis puntual al cruzar el 50 % de Vida) queda libre para usar ese nombre sin ambigüedad |
| Lentitud | **Parecido pero no igual:** reduce la nueva Habilidad Velocidad (iniciativa); `Ralentizado` de hoy reduce Movimiento (hex). Son ejes distintos desde que Velocidad y Movimiento son dos Habilidades separadas — no fundirlos sin decidirlo |
| Quemadura, Confusión, Ceguera, Congelación | **Estados nuevos, no existen hoy.** Ceguera en concreto solo tiene sentido ahora que existe Precisión como Habilidad propia (antes no había nada que "reducir") |
| Hemorragia | **Estado nuevo** (sangrado físico por turnos) — `effects.md` §3 ya lo tenía anotado como candidato futuro ("Sangrado") "cuando una carta lo necesite"; ya hay cartas que lo necesitan |

El resto de Características (Golpe crítico, Robo de vida, Volador, Ágil, Percepción, Líder, Constructo, No-muerto, Demonio, Resistente/Inmune-a-X, Regeneración, Resurrección, Último aliento…) **no son estados temporales**: son **rasgos permanentes** del personaje, y por eso viven en el bloque de ficha (punto 1), no en `effects.md`.

## Fase 0 — Higiene rápida

- [x] Anotado en [`docs/ideas.md`](../../docs/ideas.md) que Sigilo queda fuera de alcance por ahora, decisión consciente — verificado que no aparece en el catálogo de Características final ni en la fila del Asesino élfico. *(El resto de la lista original de este punto —Silencio, Potenciador mágico, Afinidad elemental, Absorción elemental, Escalador, Visión nocturna— no se pudo verificar contra la versión actual de `conceptV3.md`; queda fuera hasta confirmarla.)*

## Fase 1 — Humanos (raza piloto)

**Arranque no-numérico autorizado 2026-08-13**: todo lo de abajo puede empezar a escribirse ya, excepto los valores numéricos de Habilidades (siguen pendientes de Dario).

- [ ] **Ficha de raza**: identidad/sabor, medio párrafo, tono de [`docs/characters/heroes.md`](../../docs/characters/heroes.md) §1b.
- [ ] **Clase Guerrero** (compartida): escrita desde cero bajo Habilidades/Características — sin heredar texto ni mecánica del Guerrero actual (política de sustitución total, 2026-08-13). El rol de tanque sí se mantiene como punto de partida creativo, el contenido no.
- [ ] **Clase Mago** (compartida): mismo criterio que Guerrero — escrita desde cero, sin heredar del Mago actual.
- [ ] **Clase Sacerdote**: mismo criterio — escrita desde cero, no un cambio de nombre sobre el Clérigo actual, aunque ya sea de sabor humano.
- [ ] **Clase Arquero** (nueva): el hueco de "daño a distancia" sin el sigilo del Pícaro. 8 cartas nuevas, formato de [`docs/cards/class.md`](../../docs/cards/class.md).
- [ ] **8 unidades** (Miliciano → Dragón Dorado): formalizar en tabla de bloque de combate (formato de [`docs/characters/enemies.md`](../../docs/characters/enemies.md) §5b) en cuanto lleguen los valores numéricos de Habilidades de Dario. Cubrir **las dos caras, confirmado** — reclutable (formato `mercenaries.md` §1b) y hostil (formato `enemies.md` §5b, ver "Abiertos" arriba) —, reutilizando el mismo dial de Nivel 1-5 que ya usan enemigos (`enemies.md` §5d) y héroes (`game-design.md` §5), no uno nuevo. Usa el motor de combate sin dados (ver "Abiertos" arriba), no la matemática D&D antigua.
- [x] **Sustituto del motor de daño sostenido** — resuelto del todo, ver "Motor de combate — sin ningún dado" en "Abiertos" arriba (incluidos los dos desempates de iniciativa, cerrados 2026-08-13).
- [ ] **Redactar cartas** de las 4 clases y las 8 unidades (formato de carta de Unidad, nuevo — análogo al de Mercenario que se retira).
- [ ] **Primer pase de balance**: mismo método que ya usa el proyecto ([`docs/game-design.md`](../../docs/game-design.md) §4b.12 — daño/turno × 5-6 ≈ PV objetivo).
- [ ] **Fichas de héroe para selección** (historia + fuertes/débiles) de las 4 clases humanas.
- [ ] Actualizar `characters/npcs.md` solo lo mínimo para no bloquear el piloto (Herrero/Instructor pueden esperar a Fase 3).

No se toca ninguna otra raza hasta que esta esté jugada y balanceada en primer pase.

## Fase 2 — Resto de razas base

Enanos → No-muertos → Demonios infernales → Elfos (Elfos al final: ahí se resuelve Sigilo/Asesino élfico; Pícaro ya no depende de este orden, se cerró el 2026-08-13). Una detrás de otra, no en paralelo. Por cada una: plantilla validada en Fase 1, solo las clases que no sean "Guerrero" compartido, 8 unidades propias, mismo balance §4b.12, y **desde aquí se define también el arquetipo de IA propio de la raza** ([`docs/ideas.md`](../../docs/ideas.md)), ya con 2+ razas jugables para poder diferenciarlas.

## Fase 3 — Sistemas transversales

- [ ] **Tabla de loot** ([`docs/game-design.md`](../../docs/game-design.md) §6b.6): si arma/armadura/mercenario desaparecen como tipo, se rehace con "Unidad" en su lugar.
- [ ] **NPCs restantes**: Herrero (`cards/weapons.md`/`armor.md` obsoletos, ¿qué vende ahora?), Instructor (reforja cartas de clase compartidas entre razas).
- [ ] **Items, maldiciones y mazo de encuentro**: pasada de coherencia con el nuevo sistema (lo pide el propio punto 12 de conceptV3).
- [ ] **Arte**: prompts de ilustración por clase/unidad, formato de [`md/art-direction/heroes.md`](../art-direction/heroes.md) y `enemies.md`.

## Fase 4 — DLC

Orkos+Feéricos, Dracónidos+Hombres rata, Constructos+Abisales. Fuera de alcance hasta que las 5 razas base estén jugables y con primer pase de balance — conceptV3 ya los enmarca como contenido posterior.

## Método de trabajo

Igual que el resto del proyecto: Dario aporta la idea/narrativa y las decisiones de sabor o asignación, se formaliza en tablas con el mismo formato que ya usan `heroes.md`/`enemies.md`/`cards/class.md`, cada decisión marcada "(decidido, fecha)" con su motivo, y "Falta balancear" donde corresponda — el mismo patrón que sostiene todo `docs/status.md`. Para el catálogo de cartas en general (más allá de Humanos), el ritmo lo marca Dario carta a carta, no un barrido automático por fase (confirmado 2026-08-13, ver "Sustitución total" en "Decisiones ya tomadas").
