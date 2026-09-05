<!-- estado: en-espera -->

# Maldiciones — V3

> Esqueleto. Nada decidido todavía, y desde el **5 de septiembre de 2026 en standby**: ver abajo.

## En standby — no está decidido que este tipo de carta siga *(5 de septiembre de 2026)*

**Dario dejó las maldiciones en espera porque no sabe si quitarlas.** No es una pausa de trabajo: es que la pregunta de si el tipo existe está **por encima** de todo lo que este documento pueda definir, así que hasta contestarla no se escribe nada aquí — ni anatomía, ni catálogo, ni Rareza.

Se paró exactamente ahí: estaba a punto de cerrarse **de dónde sale su Rareza**, que era la única de las cuatro cartas sin tier que se podía cerrar hoy ([README.md](README.md)). La respuesta estaba medida —la Severidad **es** el Nivel 1-5, no algo parecido a él— y lo único abierto era con qué paleta se pinta el raíl: la de Rareza (una Maléfica se leería dorada) o la de Severidad, ámbar → púrpura, que obligaría a escribir una excepción a la regla del 3 de septiembre de que el color no dice el tipo. Esa pregunta **queda congelada**, no descartada: si el tipo sigue, se retoma donde está.

**Lo que arrastra la decisión, medido**, para que se tome sabiendo qué cuesta:

- **Cuatro clases de héroe se describen por ellas** en [razas.md](../razas.md): 🧙 Brujo y 🧙 Brujo infernal (Demonios infernales) y los dos 🔮 Chamanes. Si la carta desaparece, o esas clases se redescriben o «maldición» pasa a significar otra cosa —un **estado** de [effects.md](../effects.md), que es temporal y tiene catálogo propio—, y entonces hay una colisión de vocabulario que resolver, como la que ya tuvo «Habilidad» con las cartas de clase.
- **En v2 no era una carta, era un subsistema.** Tenía fuentes propias (el Suceso «Maleficio», la «Trampa», fichas de Amenaza falladas, jefes), un NPC dedicado que cobraba por limpiarla —el Sacerdote del Templo, uno de los dos sumideros de oro del juego— y un efecto sobre el Oteo: ocupa hueco en el Mazo y no te da nada que jugar. Quitar la carta quita las cuatro cosas, y **el sumidero de oro habría que reponerlo** en la economía (`../game-design.md` §7), que aún no está escrita.
- **Quitarla no libera código.** `lib/severity.ts`, `$severity` y `SeverityChip` seguirían haciendo falta igual: los usan las tablas de v2 en la wiki, que está congelada pero se sigue sirviendo.
- **Y sí libera trabajo de arte**: la maldición es uno de los sujetos de `knowledge/v3/art-direction/illustrations.md` §"Objetos, maldiciones y escenas", con su propio encuadre —ilustra el efecto sufrido, no su causa—, y ese encuadre no tiene todavía ninguna ilustración hecha.

## Estado

Las maldiciones existen como tipo de carta, pero **el catálogo entero está pendiente de revisión** contra el sistema nuevo *(anotado en [status.md](../status.md))*.

Dependen por completo de dos cosas que aún no están definidas: el catálogo de estados ([effects.md](../effects.md)) y el motor de combate. No se escriben antes que ellos.

## Por definir

- Anatomía de la carta de maldición.
- Qué puede hacer una maldición en términos de Habilidades y estados.
- Cómo se recibe y cómo se quita.
- El catálogo.
