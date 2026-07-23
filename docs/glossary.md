# CardGame — Diccionario

Términos transversales usados en todos los documentos de `docs/`. Se amplía conforme surgen términos ambiguos o repetidos.

| Término | Significado |
|---|---|
| D&D | Referencia al juego *Dungeons & Dragons* (base de estadísticas, razas, clases y bestiario — ver `game-design.md`, `heroes.md`, `enemies.md`) |
| Personajes | Hace referencia principalmente a héroes y/o enemigos; en algunos conceptos también incluye a los NPCs (`npcs.md`) |
| Viajes / Viajes por la Tierra Media | Juego de mesa *Journeys in Middle-earth*, usado **solo** como inspiración de la estructura de mazo/cartas y del tablero, no de la identidad de personajes (`game-design.md`, `board-map.md`) |
| Hexágono | Casilla unidad del mapa. 1 movimiento = 1 hexágono cruzado (`board-map.md` §1, `game-design.md` §2.2) |
| Grupo / Tile | Conjunto pre-diseñado de varios hexágonos con terreno y arte coherentes, unidad de la generación por piezas y de la niebla de guerra (`board-map.md` §2, §4) |
| Hexágono de conexión ("puerta") | Hexágono del borde por donde un grupo conecta con otro; siempre visible aunque el grupo esté sin explorar (`board-map.md` §4) |
| Niebla de guerra | Ocultación del mapa aplicada por grupo, en 3 estados: Sin explorar / Detectado / Explorado (`board-map.md` §4) |
| Detectado | Estado de niebla: se conoce que el grupo existe y su tipo de terreno, pero no su contenido interior (`board-map.md` §4) |
| Explorado | Estado de niebla: el personaje ha entrado en al menos 1 hexágono del grupo; a partir de ahí el rango de visión revela el contenido según su posición (`board-map.md` §4) |
| Rango de visión | Cuántos hexágonos ve el personaje desde su posición; base gobernada por Sabiduría, +1 por cada +2 de modificador (`game-design.md` §2.3) |
| Ficha (token) | Marcador visible sobre un hexágono. 6 tipos: Exploración, Amenaza, Tesoro, Terreno, Personaje, Enemigo (`board-map.md` §4) |
| Otear / Draft | Mecanismo de construcción del mazo de equipo: cada turno se muestran 2 cartas de equipo y el jugador elige 1 para añadirla de forma permanente (`game-design.md` §4) |
| Mazo personal | Mazo del jugador: cartas de clase + equipo obtenido. No se baraja ni se roba mano; se juega cualquier carta que ya se tenga (`game-design.md` §4) |
| Mazo de encuentro | Mazo gestionado por el sistema (no por el jugador), con cartas cortas de acción que se roban al activar una ficha o entrar en combate (`board-map.md` §5) |
| Maldición | Carta de efecto negativo persistente que **ocupa un hueco del mazo personal** (distinta de un Estado temporal de combate) (`game-design.md` §3.2) |
| Estado / Efecto | Modificador temporal aplicado durante una prueba/combate (ventaja, desventaja, aturdido, envenenado); no ocupa hueco de mazo (`game-design.md` §3.2) |
| CR (Nivel de Desafío) | Escala de dificultad de D&D usada como referencia para ordenar las categorías de enemigo (`enemies.md` §3) |
| Modo Prueba | Modo sandbox con mapa aleatorio y boss elite opcional; se implementa primero (`board-map.md` §2b) |
| Modo Campaña | Secuencia de mapas fijos encadenados con historia propia; el personaje y el mazo persisten entre capítulos (`board-map.md` §2b) |
| Prueba (chequeo) | Resolución de una acción incierta mediante **1d20 + modificador**, con cartas que aplican bonus/ventaja/desventaja (`game-design.md` §4) |
| Oro | Moneda única del juego, contador en la hoja de personaje; precios ligados a la Rareza (`game-design.md` §6b) |
| Dados de Vida (DV) | Dados = nivel del héroe, del tamaño de su dado de clase; se gastan al acampar para curarse y se recuperan en el descanso largo (`game-design.md` §4c.4) |
| Descanso corto | Acampar fuera de combate con la carta Hoguera: cura (gasta DV) y resetea habilidades 1/descanso, con riesgo de emboscada en terreno inseguro (`game-design.md` §4c.2) |
| Descanso largo | Recuperación total en localización segura (Pueblo/Taberna/Templo): PV, DV, estados; sin riesgo (`game-design.md` §4c.3) |
| Detección (enemigo) | Rango de visión del enemigo que, al alcanzar al héroe, lo activa (persigue e inicia combate); reducido por la ocultación del terreno (`enemies.md` §2) |
