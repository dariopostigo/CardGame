# Modelos 3D (.glb)

> **Sin versión a propósito.** Esto es material de laboratorio, no arte del
> juego, y por eso no está ni en [`../v2/`](../v2/cards/README.md) ni en
> [`../v3/`](../v3/README.md). Cuando haya modelos propios de V3, van a
> `v3/`; ver [`../README.md`](../README.md).

Personajes en glTF binario con **esqueleto y animaciones dentro del propio
archivo**. Los consume el laboratorio `/lab/character`
(`components/lab/character-scene.ts`).

Estos dos son **modelos prestados de prueba**, no arte del juego: están aquí
para validar el pipeline (generar en una IA 3D → auto-rig → animaciones de
biblioteca → `.glb` → reproducir en el navegador) antes de encargar o generar
los personajes de verdad. Cuando haya modelos propios, estos se van.

| Archivo | Qué es | Peso | Clips |
|---|---|---|---|
| `robot-expressive.glb` | Humanoide estilizado, sin texturas (color por material) | 453 KB | 14: `Idle`, `Walking`, `Running`, `Punch`, `Death`, `Jump`, `WalkJump`, `Sitting`, `Standing`, `Dance`, `Wave`, `ThumbsUp`, `Yes`, `No` |
| `fox.glb` | Cuadrúpedo, una textura | 159 KB | 3: `Survey`, `Walk`, `Run` |

El reparto de clips del robot es casi exactamente el set que pide una ficha en
batalla (reposo / mover / atacar / morir), y el zorro cubre el caso cuadrúpedo
de `docs/v2/characters/enemies.md`. Por eso estos dos y no otros.

## Procedencia y licencias

**`robot-expressive.glb`** — «Robot Expressive» de Tomás Laulhé, **CC0 1.0**
(dominio público). Modificado por Don McCurdy. Tomado de los ejemplos de
three.js (`examples/models/gltf/RobotExpressive/`).

**`fox.glb`** — «Fox» de los glTF Sample Assets de Khronos
(`Models/Fox/glTF-Binary/`). Licencia **triple**, y la de en medio obliga:

- Malla: © 2014 PixelMannen — **CC0 1.0**.
- Rigging y animación: © 2014 tomkranis — **CC-BY 4.0** *(exige atribución)*.
- Conversión a glTF: © 2017 @AsoboStudio y @scurest — **CC-BY 4.0** *(exige atribución)*.

> Si algo de esto acabara en una build pública, el zorro necesita crédito
> visible. Es material de laboratorio: no lo muevas a `assets/v3/` sin
> resolver antes la atribución.
