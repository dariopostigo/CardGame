# Concepto de razas — V3

> Aquí se **define** el sistema de razas; en [`docs/v3/razas.md`](../../../docs/v3/razas.md)
> se **publica**. Son dos archivos con el mismo contenido de partida y dos
> papeles distintos: el de `docs/` lo lee la wiki y las fichas de `/dev`, así
> que se queda quieto hasta que lo de aquí esté cerrado. Todo el trabajo sucio
> —renombrar, fundir rasgos que se solapan, meter números, reordenar— pasa
> primero en esta carpeta.
>
> Es la misma división que ya usa [`../card-concept/`](../card-concept/) para el
> marco de carta, y sigue la norma de [`AGENTS.md`](../../../AGENTS.md): lo que
> vive en `knowledge/` es base de conocimiento, lo que vive en `docs/v3/` es
> diseño vigente.

## Qué hay

| Archivo | Qué es |
|---|---|
| [`razas.md`](razas.md) | El documento de trabajo. Copia de `docs/v3/razas.md` del 20 de agosto de 2026, con los enlaces reapuntados. **Este es el que se edita.** |
| [`sujetos.md`](sujetos.md) | La cola de generación de arte: los **132 sujetos** de `razas.md` enumerados, más la **identidad visual de las 11 razas**. Derivado de `razas.md` — si cambia un nombre allí, cambia aquí. |
| [`prompts/`](prompts/preambulo.md) | Los prompts **montados y listos para pegar** en una IA. **Las once razas escritas, los 132 sujetos.** [`preambulo.md`](prompts/preambulo.md) es lo invariante —prompt base, formato, encuadre, negative prompt— y se pega una vez; cada archivo de raza lleva su identidad y sus 12 bloques. |

Las imágenes de referencia de razas, héroes y unidades —si hacen falta para
decidir— van aquí junto al texto, como en `card-concept/`. La referencia visual
que se cita desde el código sigue viviendo en
[`public/concepts/`](../../../public/concepts/), y **cómo** se dibuja cada raza
ya está resuelto en [`../art-direction/`](../art-direction/): esta carpeta es de
reglas, no de estilo.

## El flujo

1. Se discute y se edita `razas.md` **de esta carpeta**.
2. Cuando un bloque queda cerrado, se reescribe el bloque equivalente de
   `docs/v3/razas.md` y se actualiza [`docs/v3/status.md`](../../../docs/v3/status.md).
3. La wiki se sirve de `docs/` en vivo, así que se actualiza sola. Las fichas de
   `/dev` ([`lib/dev-registry.ts`](../../../lib/dev-registry.ts)) apuntan a
   `/docs/v3/razas` y no hay que tocarlas.

No se hace en el otro orden. Si `docs/v3/razas.md` se edita a mano, los dos
archivos divergen y este deja de servir de nada.

## Qué falta decidir

Recogido de [`docs/v3/status.md`](../../../docs/v3/status.md) §preguntas
abiertas, que es donde estaban anotadas. Estas son las que este documento tiene
que responder:

- **Valores numéricos de las 8 Habilidades.** Siguen siendo insumo de Dario; no
  se inventan. **Una ya está puesta** *(31-ago-2026)*: **👢 Movimiento, 🗡️ 3 ·
  ✨ 2 · 🏹 1**, banda por tipo de daño y no valor por ficha, decidida sobre el
  duelo del arquero medido en el laboratorio del tablero. Quedan siete. Lo que
  **ya no falta** es la escala *(23-ago-2026)*: rangos, topes
  y curva por tier están en [`razas.md`](razas.md#-la-escala-23-de-agosto-de-2026)
  —Vida 2–3 cifras, Ataque 1–2, mitigaciones topadas en 75, Precisión 65–95,
  Suerte 25, y solo Vida y Ataque crecen con el tier, ×10 de tier 1 a tier 8—.
- ~~**Colisión de «Habilidad».**~~ **Resuelto** (24-ago-2026): la palabra se queda
  con **las 8 estadísticas** y las cartas son «de clase» y nada más, que es como ya
  se llamaban. Lo que la carta concede es un **efecto**. Renombrar las ocho habría
  costado las 132 fichas, el motor, los estados y la wiki entera.
- ~~**Solape de Resistencia mágica.**~~ **Resuelto** (22-ago-2026): las dos
  Características eran redundantes con la Habilidad y se retiraron; en su hueco
  entró el marcador que faltaba, ✨ *Ataque mágico*. 32 fichas repasadas.
- ~~**Congelación y Lentitud.**~~ **Resuelto** (22-ago-2026): 🐌 Lentitud reduce
  Movimiento, y 🧊 Congelación pasó a ser el **estado** que aplica la fuente
  🧊 *Hielo*. Comparten eje pero se distinguen por fuente y severidad, como
  Quemadura y Envenenamiento comparten el del daño por turno.
- ~~**Alcance.**~~ **Resuelto** (23-ago-2026): **valor fijo por tipo de daño**
  —🗡️ 1 hexágono, ✨ 2, 🏹 4—, sin campo por ficha ni novena Habilidad, y a
  bocajarro sin penalización. **Confirmado** (24-ago-2026): el tablero de batalla
  ya existe y ha confirmado la geometría, así que los tres números dejan de ser
  provisionales. Está en [`razas.md`](razas.md#-tipo-de-daño).
- ~~**⚔️ Ataque como "daño físico".**~~ **Resuelto** (23-ago-2026): ⚔️ Ataque
  pasa a ser el daño a secas y de qué clase es lo dice el campo nuevo **Tipo de
  daño** —🗡️ Cuerpo a cuerpo · 🏹 A distancia · ✨ Mágico—, obligatorio en las
  132 fichas y dibujado en el sitio del icono del Ataque. ✨ *Ataque mágico* y
  🏹 *Ataque a distancia* salen del catálogo de Características: eran este campo
  disfrazado de rasgo. Reparto: 70 · 21 · 41.
- ~~**Caster.**~~ **Resuelto** (22-ago-2026): lo marca la Característica
  ✨ *Ataque mágico*. El ataque básico es físico por defecto y mágico solo con
  ese rasgo, que es el mismo vocabulario para héroes y unidades.
- ~~**Regla de facción.**~~ **Resuelto** (23-ago-2026): **no se puede.** Un héroe
  recluta solo unidades de su propia raza, así que las ocho de cada raza son *su*
  progresión y no un catálogo común de 88. Es la regla de partida, no una puerta
  cerrada: si algún día hace falta mezclar, entra como excepción con nombre.
- ~~**Escala de unidades.**~~ **Resuelto** (24-ago-2026): **un solo eje.** El tier es
  el de las unidades —una unidad no sube, es *otra* unidad— y la **Rareza sale del
  tier** (`rarityForTier`, que ya existe). **V3 no tiene progresión de personaje**, ni
  de héroe ni de unidad: queda fuera de alcance. Sigue abierto cómo se obtienen las
  unidades de tier alto, que es economía y no progresión.
- ~~**Guerrero compartido.**~~ **Resuelto** (24-ago-2026): **un set por raza**, y no
  había problema que resolver — cada raza tiene su Guerrero con los números que le
  tocan, igual que su Mago. Queda solo una nota de catálogo: cuatro cartas se llaman
  «⚔️ Guerrero», así que en las listas la raza va en la identidad, como ya hacen las
  unidades («Asesino élfico»).

Y dos que salieron al enumerar los sujetos para ilustrar
([`sujetos.md`](sujetos.md)), que no estaban vistas:

- **25 héroes se llaman igual que una unidad de su raza**, y pasa en las once.
  En Hombres rata y en Constructos colisionan **las cuatro clases**. **Decidido
  qué cara se renombra** (24-ago-2026): **la unidad.** Los cuatro nombres de clase
  son vocabulario fijo de las once razas y dan nombre al tipo de carta, mientras que
  una unidad de la progresión de ocho acepta un nombre propio sin perder nada.
  **Queda el trabajo, que no es poco**: 25 nombres nuevos que inventar y que hay que
  cambiar en los dos `razas.md`, en [`sujetos.md`](sujetos.md) y en los archivos de
  [`prompts/`](prompts/preambulo.md) de las razas afectadas — el sujeto de arte
  cambia de nombre con la unidad.
- ~~**¿Son 10 razas u 11?**~~ **Resuelto** (23-ago-2026): **son 11** —cinco base
  y seis de DLC, y la tabla de héroes tiene 44 filas—. El «10» estaba en
  `razas.md` (los dos), `docs/v3/README.md`, `docs/v3/status.md` y
  `lib/dev-registry.ts`, y está corregido en los cinco.

**Ya resuelto (20 de agosto de 2026): la identidad visual de las 11 razas.**
Paleta, anatomía, materiales, motivos, fondo y silueta de cada una, en
[`sujetos.md`](sujetos.md). No estaba escrita en ninguna parte y bloqueaba toda
la generación de arte: `art-direction/illustrations.md` §4 nombraba los ejes y
dejaba los valores en blanco. Se decidió aquí, y no en `art-direction/`, porque
es **diseño de raza y no de estilo** — la biblia visual solo fija lo que no
cambia entre razas.

## Alcance

**Raza piloto: Humanos.** Se cierra entera antes de tocar las otras, y los tres
DLC (Orkos + Feéricos, Dracónidos + Hombres rata, Constructos + Abisales) quedan
fuera hasta que las 5 razas base estén jugables. Lo que ya está en `razas.md`
para las 11 razas es un primer pase de asignación de Características, no
diseño cerrado.
