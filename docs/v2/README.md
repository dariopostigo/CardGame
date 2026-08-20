# v2 — Base de conocimiento (congelada)

> **Este árbol no es el diseño vigente.** Describe la versión anterior del juego —la de raíz D&D— y se conserva solo como material de consulta. El diseño en curso vive en [V3](../v3/).
>
> **No se edita.** Si algo de aquí sirve para V3, se reescribe en el documento V3 que corresponda, no se enlaza ni se copia sin más.

## Qué sistema describe

La versión que estuvo en desarrollo hasta el **20 de agosto de 2026**, construida sobre convenciones de D&D:

- **6 estadísticas** de personaje: FUE, DES, CON, INT, SAB, CAR, con su modificador.
- **Resolución por d20**: tirada de impacto contra CA, dado de daño, natural 20 / natural 1, ventaja y desventaja como 2d20.
- **4 clases fijas** sin razas: Guerrero, Mago, Pícaro (Mediano) y Clérigo.
- **Armas y armaduras** como cartas equipables, clasificadas por manos y peso.
- **Mercenarios** como tipo de carta propio, con bloque de combate derivado de la Rareza.
- **Sigilo y detección**: fase de aproximación, estados Latente/Activo, emboscada.
- **11 estados** en `effects.md`, la mayoría dependientes de salvaciones por característica.

Estaba **completo en papel para la Partida rápida** y balanceado tras varias tandas de corrección (ver [status.md](status.md) §5). Ese balance **no migra a V3**: el motor nuevo resuelve sin dados y con otras estadísticas, así que hay que rehacerlo entero.

## Qué sigue siendo válido

Nada por decreto. V3 se escribe de cero y toma de aquí lo que decida tomar, caso por caso y por decisión explícita.

Dicho eso, lo que con más probabilidad se recupere no es contenido sino método y subsistemas que nunca dependieron de las 6 estadísticas: el criterio de balance de [game-design.md](game-design.md) §4b.12, la generación de mapa y los terrenos de [board/board-map.md](board/board-map.md), y el hábito de marcar cada decisión con su fecha y su motivo.

## Estado del código

El motor de reglas de esta versión sigue vivo y funcionando en `lib/v2/rules/`. Es lo que ejecutan hoy los laboratorios de **[`/lab`](/lab)** y la partida de `/play`. Se congelará —o se retirará— cuando `lib/v3/` tenga motor propio.

> **Las rutas cambiaron después de congelar este árbol.** Los documentos de abajo citan por su nombre antiguo cosas que hoy están en otro sitio, y no se han reescrito porque v2 no se edita. La equivalencia:
>
> | Dice | Es hoy |
> |---|---|
> | `/dev/tiles`, `/dev/board`, `/dev/pieces`, `/dev/movement`… | `/lab/…` — los laboratorios se movieron cuando `/dev` pasó a ser la construcción de V3 |
> | `lib/rules/…` | `lib/v2/rules/…` |
> | `components/dev/…` | `components/lab/…` |
> | `public/assets/cards/…`, `public/assets/sprites/…` | `public/assets/v2/…` — el arte también se partió por versión |
> | `public/assets/UI/`, `public/assets/viajesTierraMedia/`… (moodboards) | `public/concepts/…` |
> | rutas de documento sin versión (`board/board-map.md`) | siguen siendo correctas: son relativas dentro de este mismo árbol |
