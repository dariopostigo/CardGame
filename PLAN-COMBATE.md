# Motor de combate + laboratorio `/dev/combate`

> Plan de implementación, no documento de diseño — por eso vive en la raíz y no en `docs/` (que se indexa automáticamente en la wiki, `lib/docs.ts`). Bórralo o muévelo cuando ya no haga falta.

## Contexto

`docs/board/battle.md` ya tiene el diseño de la pantalla de batalla completo y "cerrado sobre el papel" (co-op 1-4 héroes, despliegue, obstáculos, mercenario, Retirada...). Pero `docs/status.md` §6 marca el siguiente paso real como uno mucho más pequeño: **"Combate (`game-design.md` §4b) contra 1 Normal, y luego el tope de 2"** — validar primero la matemática base en solitario, igual que se hizo con movimiento (bajó de 3 a 2 puntos jugando solo, y solo *después* se amplió a co-op en `/dev/movement`).

Hoy `lib/rules/combat.ts` solo tiene el presupuesto de composición (`compositionBudget`/`compositionCost`); no hay iniciativa, resolución de ataque, IA enemiga ni catálogo de enemigos en código. `lib/dev-labs.ts` ya reserva el hueco `"combate"` como `"planificado"`, con el hub apagado hasta que exista la página.

**Esta fase construye el motor mínimo jugable de principio a fin: 1 héroe contra 1-2 enemigos Normales, en un laboratorio `/dev/combate`.** Deja explícitamente fuera la riqueza de `battle.md` que depende de subsistemas que no existen todavía (co-op, mercenario, mazo "en juego" real).

## Alcance de esta ronda

- 1 héroe (cualquiera de las 4 clases de `HERO_ROSTER`) contra una composición de **1 o 2 enemigos Normales** (el tope de solo, `compositionBudget(1)` ya da 2).
- Los **5 bloques Normales** de `characters/enemies.md` §5b.2: Lobo de las lindes, Bandido merodeador, Trasgo de pantano, Esqueleto errante, Araña cavernaria.
- Iniciativa, resolución de ataque (crítico, ventaja/desventaja, resistencias por Naturaleza), IA enemiga determinista completa (§5b.6), fin de combate (victoria/derrota, sin co-op).
- Rejilla de batalla vacía (sin obstáculos) para tener adyacencia/alcance de verdad, no un 1v1 abstracto sin tablero.

## Explícitamente fuera de esta ronda

- **Co-op** (1-4 héroes, despliegue por columnas, estado Derribado/rescate) — depende de decisiones de UI de mesa que `battle.md` §1/§3/§9.1 ya fijó, pero que no tienen sentido hasta validar el 1v1.
- **Mercenario como ficha** (`cards/mercenaries.md` §1b) y **Retirada** (`battle.md` §8) — subsistemas propios, sin código todavía.
- **Obstáculos por plantilla de terreno** (`battle.md` §7) — la rejilla nace en llano.
- **Oteo de transición de cartas Batalla/Ambos** (§10) y **botín/oro real** al terminar (§11) — se conectan cuando el lab engancha el mazo "en juego" (`deck.ts`) y `loot.ts`; por ahora el combate se dispara con enemigos elegidos a mano en el lab, no desde una ficha del tablero de exploración.
- **Élite y Jefes** en código — solo los 5 Normales, que es lo que pide literalmente el punto 3 de `status.md` §6.
- Estados más allá de **Envenenado** e **Inmovilizado** (los únicos que disparan los 5 Normales); el resto de los 11 de `effects.md` se añaden cuando una carta/habilidad concreta los necesite.

## Archivos

### `lib/rules/effects.ts` (nuevo)
Tipos para **Envenenado** e **Inmovilizado** (`docs/effects.md`): duración en turnos, `applyEffect`/`tickEffects` (avanza al empezar el turno del portador), `hasEffect`. Unión discriminada extensible (`EffectId`) para no tener que reabrir el módulo entero cuando llegue Aturdido u otro.

### `lib/rules/enemy-roster.ts` (nuevo)
Mismo patrón que `lib/rules/hero-roster.ts`: los 5 bloques Normales de §5b.2 como datos (PV/CA ya derivados, ataque = dado + mod + tipo de daño, Velocidad, Detección, y el gancho de habilidad como texto + disparador que ejecuta `enemy-ai.ts`). Incluye la tabla `NATURE_RESISTANCES` de §3b (Humanoide/Bestia/No-muerto, las tres que tocan estos 5 — el resto se añade con Élite/Jefes).

### `lib/rules/combat.ts` (amplía el existente, no lo reescribe)
Se queda con `compositionBudget`/`compositionCost` tal cual. Se añade:
- `rollInitiative(rng, combatants)` — `1d20 + mod DES` por unidad (§4b.2), orden descendente, empate → mayor DES bruta, héroe gana.
- `buildBattlefield()` — rejilla **7×5** de `battle.md` §2 como un `Board` sintético (mismo tipo que usa `board-gen.ts`: `hexes`, `tiles: []`, `voids: []`, terreno Llanura en todo). Al ser el mismo tipo, `HexBoard` (`components/game/board/HexBoard.tsx`) la pinta sin ningún cambio — cero código de render nuevo.
- `resolveAttack(rng, attacker, target, weapon)` — `1d20 + mod` vs CA, crítico (nat 20 dobla dados, nat 1 falla), ventaja/desventaja vía 2d20, daño `dados + mod`, resistencia/vulnerabilidad por Naturaleza (§4b.4, §4b.10).
- `checkBattleOutcome(combat)` — victoria (enemigos a 0 PV) / derrota (héroe a 0 PV); sin Derribado, eso es co-op.

### `lib/rules/enemy-ai.ts` (nuevo — ya previsto por su propio nombre en `ARCHITECTURE.md` §4, sin construir hasta ahora)
`decideEnemyAction(enemy, context)`: el árbol de prioridades determinista completo de §5b.6 (huir si su habilidad lo ordena → habilidad lista y útil → atacar si en alcance → acercarse por la ruta más corta → sin nada útil). Función **pura**: consulta adyacencia/alcance (reutiliza `lib/rules/hex.ts`) y no tira dados ni muta nada — devuelve una acción declarativa (`{kind: "attack", targetId}` / `{kind: "move", to}` / `{kind: "flee"}`) que quien la llama ejecuta con `resolveAttack`/movimiento.

### `lib/rules/rng.ts`, `lib/rules/skill-check.ts`, `lib/rules/movement.ts`, `lib/rules/hex.ts`
Sin cambios — se reutilizan tal cual: `Rng.d20`/`Rng.roll` para las tiradas, `reachableHexes` para mover dentro de la rejilla (solo necesita `board.hexes`, no tiles/voids/distanceFromEntrance, así que funciona sobre el `Board` sintético sin tocarla), `Hex.neighbors`/`distance` para adyacencia y alcance.

### `components/dev/CombatLab.tsx` (nuevo, `"use client"`)
Mismo patrón que `MovementLab.tsx`: selector de clase de héroe (`HERO_ROSTER`) + selector de composición enemiga (1-2 Normales de `enemy-roster.ts`), pinta la rejilla con `HexBoard` reutilizando el prop `heroes` para **las dos fichas** (el héroe con `pieceId: "heroe-1"`, cada enemigo con `pieceId: "enemigo-activo"` — ya existe en `piece-art.tsx`, sin arte nuevo). Botón "Tirar iniciativa"; en el turno del héroe, clic para moverse (resalte `reachable` ya soportado por `HexBoard`) o atacar; en el turno enemigo se ejecuta `decideEnemyAction` + `resolveAttack` automáticamente. Panel lateral con PV/estados de cada combatiente y un log de eventos (texto, no componente nuevo). Banner de Victoria/Derrota con `checkBattleOutcome`.

### `app/dev/combate/page.tsx` (nuevo)
Server Component de metadata + montaje, copiando literalmente `app/dev/movement/page.tsx`.

### `lib/dev-labs.ts`
La entrada `"combate"` pasa de `status: "planificado"` a `"en-curso"` (mismo criterio que el resto: en cuanto tiene página real).

## Tests

`ARCHITECTURE.md` §12 pide al menos un test por invariante nuevo, pero no hay runner instalado (§9, decisión abierta). Para no dejarlo otra vez pendiente en el módulo más "matemático" de todos (resolución de ataque, crítico, ventaja/desventaja), propongo instalar **`node:test`** (viene con Node, cero dependencias nuevas, coherente con el minimalismo del stack) y cubrir con él `combat.ts` y `enemy-ai.ts`: crítico dobla solo los dados, ventaja/desventaja coge el 2d20 correcto, resistencia parte el daño por 2, el árbol de IA ataca si está en alcance y se acerca si no. Si prefieres no decidir el runner todavía, se deja para verificación manual por el lab y queda como decisión aparte.

## Verificación

1. `npm run build` / `npm run dev` sin errores de tipo (TypeScript `strict`, sin `any`).
2. Si se instala `node:test`: `node --test` sobre los nuevos módulos, en verde.
3. Manual en `/dev/combate`: jugar una pelea completa contra 1 Lobo (gana el héroe la mayoría de intentos, coherente con `game-design.md` §4b.12) y contra 2 Normales (más apretado), comprobando iniciativa, ataque/daño, un crítico, un estado (Envenenado del Trasgo o Inmovilizado de la Araña) y el banner de fin de combate.
