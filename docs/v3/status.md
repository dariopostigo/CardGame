# Estado del diseño — V3

Qué está decidido, qué falta y qué falta balancear. Es el documento que se mira primero para saber por dónde va el trabajo.

**Fecha de arranque de V3: 20 de agosto de 2026**, cuando el árbol se partió en [v2](../v2/) (congelado) y v3 (vigente).

## 1. Estado general

| Bloque | Estado |
|---|---|
| Razas, clases y unidades | **Definido** en [razas.md](razas.md) — 10 razas, 4 clases cada una, 8 unidades cada una |
| Las 8 Habilidades | **Nombradas y descritas**; sin valores numéricos |
| Catálogo de Características | **Definido** — ~40 rasgos, asignados ya a héroes y unidades de las 10 razas |
| Motor de combate | **Por definir** — bloquea todo el catálogo de cartas |
| Estados y efectos | **Por definir** — depende del motor |
| Cartas | **Por definir** — ningún catálogo escrito |
| Tableros | **Por definir** — solo está decidido que son dos |
| Balance | **Nada balanceado** |

## 2. Lo que bloquea

Por orden. Cada uno depende del anterior:

1. **Motor de combate** ([game-design.md](game-design.md) §4). Sin él, cualquier carta que se escriba habrá que reescribirla.
2. **Catálogo de estados** ([effects.md](effects.md)). Sale del motor y de las Características que aplican estados.
3. **Valores numéricos de las 8 Habilidades**. Insumo pendiente de Dario; no se inventan.
4. **Cartas de la raza piloto** (Humanos): 4 clases y 8 unidades.
5. **Primer pase de balance.**

## 3. Decisiones abiertas

Preguntas concretas que hay que responder, ninguna resuelta:

- **Alcance.** El ataque a distancia necesita un número de alcance, y ninguna de las 8 Habilidades lo es. ¿Campo aparte en la ficha, novena Habilidad, o valor fijo de la Característica 🏹?
- **Caster.** Si un personaje puede lanzar magia, ¿de dónde sale? No hay Característica en el catálogo que lo marque, y las unidades la necesitan tanto como los héroes.
- **Regla de facción.** ¿Se pueden reclutar unidades de razas distintas a la del héroe? Condiciona el reclutamiento, el loot y la identidad de cada raza.
- **Escala de unidades.** Cómo se relacionan los 8 tiers de progresión con la Rareza de carta y con el nivel, y cómo se obtienen las unidades de tier alto.
- **Guerrero compartido.** Aparece en 4 razas con el mismo rol: ¿un set de cartas compartido con sabor por raza, o un set por raza?
- **Colisión de "Habilidad".** Significa a la vez una de las 8 estadísticas y una carta de clase. Hay que renombrar una de las dos antes de redactar el catálogo.
- **Solapes en el catálogo de Características.** Resistencia mágica aparece como Habilidad y como Característica; Congelación y Lentitud tocan Movimiento y Velocidad y hay que separarlas bien. Ver [razas.md](razas.md).

## 4. Alcance y orden de trabajo

**Raza piloto: Humanos.** Se construye entera —clases, unidades, cartas y balance— antes de tocar ninguna otra.

**Después, una detrás de otra, no en paralelo:** Enanos, No-muertos, Demonios infernales y Elfos.

**Los tres DLC** (Orkos + Feéricos, Dracónidos + Hombres rata, Constructos + Abisales) quedan fuera de alcance hasta que las 5 razas base estén jugables y con primer pase de balance.

## 5. Fuera de alcance

- **Campañas.** Siguen sin definirse: necesitan historia antes que mecánica *(decidido)*.

## 6. Pendientes anotados

- **Items, maldiciones y mazo de encuentro** necesitan una pasada de coherencia con el sistema nuevo, buscando incoherencias y efectos que ya no tengan sentido *(decidido)*. Anotado en cada uno de los tres documentos.
- **Retirada de "Mercenario" como tipo de carta**: además de los documentos, hay código. `lib/card-table.ts` y `lib/card-catalog.ts` tienen `"mercenario"` y `"mercenaries"` como literales.
- **`CARDS_ROOT`** (`lib/card-catalog.ts`) sigue apuntando a `docs/v2/cards` para que el laboratorio de diseño de cartas no se quede vacío durante la migración. El día que `docs/v3/cards/` tenga su primera tabla hay que mover tres cosas a la vez: `CARDS_ROOT`, `DESIGN_LAB_VERSION` en `lib/docs.ts`, y la carpeta de la ruta (`app/docs/v2/cards/design/` → `app/docs/v3/cards/design/`).
- **Motor de reglas en código**: sigue entero en `lib/v2/rules/`, sobre las 6 estadísticas D&D y el d20. `lib/v3/` está vacío. El reparto entre infraestructura compartida y reglas por versión se decide cuando V3 tenga motor escrito.
- **El arte de V3 tiene carpeta y está vacía**: `public/assets/v3/` (se sirve en `/assets/v3/…`), en espejo de `public/assets/v2/`, que queda congelado con el arte del juego anterior. No se genera nada hasta que el documento de `docs/v3/` que le corresponda tenga su tabla: sin catálogo, el arte no tiene a qué pegarse. Los moodboards siguen sin versión en `public/concepts/`.
- **La dirección de arte de V3 está escrita**: `md/v3/art-direction/style-guide.md` (la biblia visual, que gobierna todo el arte del juego y no cambió al cambiar el motor) e `md/v3/art-direction/illustrations.md` (qué se dibuja: razas, héroes de clase, unidades y criaturas, con encuadre y plantilla de prompt). Con `razas.md` cerrado **ya se pueden ilustrar héroes y unidades** —empezando por Humanos, la raza piloto—; las ilustraciones de carta no, porque dependen del catálogo. Cuatro cosas colgando: el **lienzo** (1536×1050 es la medida heredada de v2, por confirmar contra el marco que construya V3), el **retrato**, que no tiene medida porque no hay pantalla de héroe ni ficha de unidad, el **concepto de calibración** (§14 de la biblia sigue siendo el Enano Guerrero de v2) y las **cartas de clase**, que al cubrir todas las razas no pueden protagonizarlas ninguna.
- **El diseño de la carta como objeto —marco, tipografía, disposición del nombre y el coste, tratamiento de la Rareza— no está definido.** No es lo mismo que la ilustración que va dentro, y no lo cubre ningún documento de `md/v3/art-direction/`. Mientras siga sin decidirse, el lienzo de las ilustraciones arrastra la medida heredada de v2.
- **Dónde se construye V3**: en la sección `/dev` de la aplicación, con su registro de módulos en `lib/dev-registry.ts`. Hoy está entera en "planificado" — es la hoja de ruta, en el mismo orden de dependencia que la §2 de este documento. Los laboratorios del motor anterior se movieron a `/lab`.

## 7. Qué falta balancear

**Todo.** V3 no tiene ningún número validado. El balance de la Partida rápida de v2 no migra: se hizo sobre otro motor y otras estadísticas.
