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
| [`prompts/`](prompts/humanos.md) | Los prompts **montados y listos para pegar** en una IA, un archivo por raza. Hoy solo [`humanos.md`](prompts/humanos.md), los 12 sujetos de la raza piloto. |

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

- **Valores numéricos de las 8 Habilidades.** El documento describe las ocho y
  no da ni una cifra. Es insumo pendiente de Dario; no se inventan.
- **Colisión de «Habilidad».** Significa a la vez una de las 8 estadísticas y
  una carta de clase. Hay que renombrar una de las dos **antes** de redactar el
  catálogo de cartas.
- **Solape de Resistencia mágica.** Tres entradas para un concepto: la Habilidad
  🔮, la Característica 🔮 *Resistencia mágica* y la Característica ✨
  *Resistente a la magia*. Hay unidades con la Característica ya asignada, así
  que fundirlas obliga a repasar sus tablas.
- **Congelación y Lentitud.** Tocan Movimiento y Velocidad respectivamente y hay
  que separar qué hace cada una sin que se pisen.
- **Alcance.** El ataque a distancia necesita un número y ninguna de las 8
  Habilidades lo es. ¿Campo aparte, novena Habilidad, o valor fijo de la
  Característica 🏹?
- **Caster.** Nada en el catálogo marca si un personaje puede lanzar magia, y
  las unidades lo necesitan tanto como los héroes.
- **Regla de facción.** ¿Se pueden reclutar unidades de razas distintas a la del
  héroe? Condiciona reclutamiento, loot e identidad de raza.
- **Escala de unidades.** Cómo se relacionan los 8 tiers con la Rareza de carta
  y con el nivel, y cómo se obtienen las unidades de tier alto.
- **Guerrero compartido.** Aparece en 4 razas con el mismo rol: ¿un set de
  cartas compartido con sabor por raza, o un set por raza?

Y dos que salieron al enumerar los sujetos para ilustrar
([`sujetos.md`](sujetos.md)), que no estaban vistas:

- **25 héroes se llaman igual que una unidad de su raza**, y pasa en las once.
  En Hombres rata y en Constructos colisionan **las cuatro clases**. Renombrar
  una de las dos caras es más barato que convivir con ello: afecta al brief de
  arte, al catálogo de cartas y a cualquier tabla que las liste juntas.
- **¿Son 10 razas u 11?** El documento dice «5 base y 6 de DLC» —que son 11— y
  tres líneas después «las 10 razas». La tabla de héroes tiene 44 filas, así que
  son **11**. El «10» está también en `docs/v3/status.md` y en
  `lib/dev-registry.ts`. O se corrige el número en los tres, o sobra una raza.

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
para las 10 razas es un primer pase de asignación de Características, no
diseño cerrado.
