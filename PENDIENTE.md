# CardGame — Pendiente / Punto de continuación

> Foto de **qué queda por hacer** para poder retomar el proyecto en otro equipo.
> Última actualización: **2026-07-24**. Rama de trabajo: **`develop`**.
> El detalle fino de cada sistema vive en [`docs/`](docs/); el dashboard vivo es [`docs/status.md`](docs/status.md). Este archivo es solo el "por dónde íbamos".

---

## 1. Dónde estamos

- **Diseño sobre papel de la _Partida rápida_: prácticamente completo.** Todo el bucle (mover → explorar → detectar → combatir → recuperarse → comprar/vender) tiene reglas jugables. Ver [`docs/status.md`](docs/status.md).
- **Última sesión de trabajo:**
  1. **Revisión de consistencia** de toda la documentación (24 correcciones: contradicciones, referencias obsoletas, conceptos huérfanos, citas de ruta normalizadas).
  2. **Arranque de balance**, con estos cambios ya aplicados:
     - **Mazo con dos topes (idea inicial):** 20 cartas construidas antes del capítulo + 10 drafteadas acumulables durante el capítulo ([`docs/game-design.md`](docs/game-design.md) §4).
     - **B1 — velocidad enemiga estandarizada a 2** (igual que el héroe); se personalizará por tipo más adelante.
     - **B2 — +2 PV base a todos los héroes** (Guerrero 14 · Clérigo 12 · Pícaro 11 · Mago 8).
- **Código: nada todavía.** El diseño está listo para empezar a construir el prototipo.

---

## 2. Decisiones abiertas (necesitan tu decisión antes de cerrar el balance)

| Ref | Tema | Qué falta decidir |
|---|---|---|
| **B3** | Precisión de ataque (~55 %, sin bono de competencia) | ¿Activar un **+2 global** al ataque en ambos lados, o esperar a testear? |
| **B4** | Reloj de Amenaza (~20 turnos) vs. mapa 12×12 | ¿Subir el tope a 150 (=30 turnos), bajar el mapa a 10×10, o mover umbrales a 30/55/80? |
| **B5** | Economía + **oro inicial (sin definir)** | Fijar el oro con el que empiezas y si en Partida rápida se compra de verdad (más ingresos) o el oro es secundario al drafteo. |
| **#15** | Hechizos en la v1 | Definir la mecánica de "preparar hechizos" / focos (Libro de hechizos, Símbolo sagrado) y los tipos de magia. **Lo dejaste para antes de la v1.** |
| — | Interpretación del **mazo 20+10** | Confirmar: ¿las 10 drafteadas van **aparte** de las 20 construidas (~30 en juego), o **dentro** de las 20? |
| — | **Roster del prototipo** | ¿Arrancar con 2-3 héroes o con los 4? ([`docs/characters/heroes.md`](docs/characters/heroes.md) §4). |

_Checklists granulares (naturaleza del Heraldo, carta Especial de exploración "Vista lejana", etc.) al final de cada documento de [`docs/`](docs/)._

---

## 3. Balance por afinar (todas las cifras son "primer pase")

- Combate: precisión, PV, daño, CD de salvación (hoy fija en 12).
- Reloj de Amenaza, economía/precios, frecuencias del mazo de encuentro, costes de limpieza de Maldiciones.
- **Residual del kiting (de B1):** con enemigos a velocidad 2, las armas de **alcance 4** (Arco, Descarga arcana, Ballesta) todavía permiten kitear a enemigos melee. Se resolverá al **personalizar velocidades** (p. ej. un enemigo "cazador" a velocidad 3).
- Rareza de las cartas de movimiento (Zancada del viento, etc.).
- Solo se cierra **jugando el prototipo**.

---

## 4. Aparcado a propósito (no urgente)

- **Progresión más allá de nivel 1** — aparcada por decisión de diseño.
- **Contenido narrativo de la Campaña** (capítulos, jefes, historia) — fase posterior al prototipo.
- **Sistema de _tiles_/grupos + niebla de 3 estados** — post-prototipo; al llegar, **desbloquea las cartas de exploración hoy inactivas** (Ojo avizor parcial, Mapa del cartógrafo, Espejo de acero, Informante — ver [`docs/board/board-map.md`](docs/board/board-map.md) §8).
- **Ideas futuras** (profesiones/crafteo, orientación/flanqueo, arquetipos de IA, desgaste de equipo) en [`docs/ideas.md`](docs/ideas.md).
- **Arte / UI** — fase de arte (IA generativa de imágenes).

---

## 5. Construir el prototipo (código — nada hecho aún)

Objetivo del primer prototipo = **Partida rápida jugable** para empezar a balancear:

- Mapa hexagonal hex-por-hex con pesos ([`docs/board/board-map.md`](docs/board/board-map.md) §2c).
- Un puñado de enemigos con sus bloques ([`docs/characters/enemies.md`](docs/characters/enemies.md) §5b).
- 1-2 héroes con sus cartas ([`docs/cards/class.md`](docs/cards/class.md)).
- Bucle de combate por adyacencia ([`docs/game-design.md`](docs/game-design.md) §4b).
- Modelo de datos de referencia en [`docs/board/board-map-dev.md`](docs/board/board-map-dev.md).

> ⚠️ **Antes de escribir código:** este proyecto usa una versión de **Next.js con breaking changes** (ver [`AGENTS.md`](AGENTS.md)). Hay que leer la guía en `node_modules/next/dist/docs/` antes de programar.

---

## 6. Mapa de la documentación (`docs/`)

| Archivo | Contenido |
|---|---|
| [`docs/status.md`](docs/status.md) | **Dashboard**: qué está definido / parcial / abierto |
| [`docs/game-design.md`](docs/game-design.md) | Documento central: stats, movimiento, cartas, combate, descanso, economía, Nivel de Amenaza |
| [`docs/glossary.md`](docs/glossary.md) | Diccionario de términos transversales |
| [`docs/ideas.md`](docs/ideas.md) | Ideas futuras aparcadas |
| [`docs/effects.md`](docs/effects.md) | Estados/Efectos temporales |
| [`docs/board/`](docs/board/) | Tablero/mapa (`board-map.md`) + notas de implementación (`board-map-dev.md`) |
| [`docs/characters/`](docs/characters/) | Héroes, enemigos y NPCs |
| [`docs/cards/`](docs/cards/) | Catálogo por tipo: clase, armas, armaduras, items, mercenarios, maldiciones, mazo de encuentro |

---

## 7. Cómo continuar en otro PC (git)

**Estado ahora mismo:** rama `develop` con cambios **sin commitear** (revisión + balance de esta sesión) + este archivo.

**Subir desde este PC:**
```bash
git add -A
git commit -m "docs: revisión de consistencia + primer pase de balance + pendiente"
git push origin develop
```

**Retomar en el otro PC:**
```bash
# Si aún no está clonado:
git clone git@github.com:dariopostigo/CardGame.git   # o https://github.com/dariopostigo/CardGame.git
cd CardGame
git checkout develop

# Si ya está clonado:
git checkout develop
git pull origin develop
```

> El remoto de este equipo usa un alias SSH (`git@github-dariopostigo:dariopostigo/CardGame.git`). En otro PC, usa la URL normal de GitHub de arriba (SSH con tu clave, o HTTPS).
> Al abrirlo en el otro equipo, **empieza por este archivo y por [`docs/status.md`](docs/status.md)**.
