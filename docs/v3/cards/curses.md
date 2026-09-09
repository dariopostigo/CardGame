<!-- estado: en-espera -->

# Maldiciones — V3

> **En standby: no está decidido que este tipo de carta siga existiendo.** Hasta contestar eso no se escribe nada aquí — ni anatomía, ni catálogo, ni Rareza.

Se paró justo antes de cerrar **de dónde sale su Rareza**, que era la única de las cuatro cartas sin tier que se podía cerrar: la Severidad **es** el Nivel 1-5, el mismo eje leído al revés. Lo único abierto era con qué paleta se pinta el raíl. Esa pregunta **queda congelada, no descartada**.

## Lo que arrastra la decisión, medido

Para que se tome sabiendo qué cuesta:

- **Cuatro fichas se describen por ellas**: los héroes 🧙 **Brujo** (Demonios infernales) y 🔮 **Chamán** (Orkos), y las unidades 🧙 **Brujo infernal** y 🔮 **Chamán**. Si la carta desaparece, o se redescriben o «maldición» pasa a significar un **estado** ([effects.md](../sistemas/effects.md)) — y entonces hay una colisión de vocabulario que resolver, como la que ya tuvo «Habilidad».
- **En v2 no era una carta, era un subsistema**: tenía fuentes propias (Maleficio, Trampa, Amenaza fallada, jefes), un NPC que cobraba por limpiarla —**uno de los dos sumideros de oro del juego**— y un efecto sobre el Oteo. Quitar la carta quita las cuatro cosas, y **el sumidero de oro habría que reponerlo** en la economía ([game-design.md](../game-design.md) §7).
- **Quitarla no libera código**: `lib/severity.ts`, `$severity` y `SeverityChip` los usan las tablas de v2 en la wiki.
- **Sí libera trabajo de arte**: es uno de los sujetos de `knowledge/v3/art-direction/illustrations.md`, con su propio encuadre —ilustra el efecto sufrido, no su causa— y ninguna ilustración hecha.

## Por definir

Todo, y por detrás de la decisión de arriba: anatomía, qué puede hacer una maldición en términos de Habilidades y estados, cómo se recibe, cómo se quita y el catálogo.
