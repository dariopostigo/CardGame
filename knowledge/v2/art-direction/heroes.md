# CardGame — Héroes: prompts de ilustración *(v2)*

> **Son las 4 clases D&D del juego anterior** (Guerrero enano, Mago elfo,
> Pícaro mediano, Clérigo humano), con la raza pegada a la clase. V3 separa
> raza y clase, así que estos cuatro retratos no le sirven: cuando haya
> personajes de V3 se escriben de nuevo en
> [`../../v3/art-direction/illustrations.md`](../../v3/art-direction/illustrations.md).
> La [guía de
> estilo](../../v3/art-direction/style-guide.md) sí sigue vigente, y vive ya
> con V3.

Un bloque por héroe, listo para copiar y pegar tal cual en una IA de generación de imagen. Estilo base de toda ilustración: [`../../v3/art-direction/style-guide.md`](../../v3/art-direction/style-guide.md). Ficha narrativa completa (historia, fuertes/débiles, kit) en [`../../../docs/v2/characters/heroes.md`](../../../docs/v2/characters/heroes.md) §1b y §2d. Guarda el resultado en `../../../public/assets/v2/heroes/` (crea la carpeta al guardar la primera imagen) — **no** en `public/assets/v2/cards/class/<heroe>/`, esa carpeta es para las 8 cartas de habilidad de cada héroe, no para su retrato.

No existe todavía ningún componente de pantalla de selección de héroe en el código (`app/play/new-game/quick/page.tsx` es un stub: "Selección de héroe: próximamente"), así que el lienzo de abajo es una propuesta razonable, no una medida real tomada de un contenedor — mismo ratio que las cartas por consistencia, a falta de una pantalla construida que diga lo contrario.

### Guerrero

Ilustración de 1536×1050px, ratio ~1,46:1, a sangre, sin transparencia, tono D&D-lite crudo y desgastado. Retrato de cuerpo entero o tres cuartos de un enano corpulento y curtido, de mediana edad, expresión seria y cansada — el único superviviente de una guarnición caída, no un veterano orgulloso. Barba y pelo recogidos sin cuidado, alguna cicatriz visible en brazos o rostro. Viste una armadura de cuero tachonado desgastada (nunca la pesada reluciente — esa es recompensa de explorar, no punto de partida) y lleva espada y escudo, ambos con marcas de uso real. Postura firme y plantada, como quien ya no tiene prisa por demostrar nada. Composición centrada, con ~10% de aire en los cuatro bordes por si una interfaz futura recorta el encuadre.

### Mago

Ilustración de 1536×1050px, ratio ~1,46:1, a sangre, sin transparencia, tono D&D-lite crudo y desgastado. Retrato de cuerpo entero o tres cuartos de un elfo delgado, de aspecto más estudioso que combatiente, ojos cansados por la lectura y el viaje más que por la batalla. Viste una armadura acolchada ligera y una capa o túnica sencilla, algo raída en los bordes. Lleva un bastón de mago en una mano y un libro de hechizos grueso y gastado en la otra — sin antorcha, así que su entorno inmediato puede estar en penumbra. Postura reservada, algo encorvada sobre sí mismo, la de alguien acostumbrado a mantenerse a distancia del peligro. Composición centrada, con ~10% de aire en los cuatro bordes por si una interfaz futura recorta el encuadre.

### Pícaro

Ilustración de 1536×1050px, ratio ~1,46:1, a sangre, sin transparencia, tono D&D-lite crudo y desgastado. Retrato de cuerpo entero o tres cuartos de un mediano de complexión pequeña y ágil, sonrisa ladina o expresión alerta, más cómodo entre sombras que a plena luz. Viste cuero ligero ajustado al cuerpo, sin nada que haga ruido al moverse. Lleva un par de dagas al cinto y una ballesta de mano colgada al hombro. Postura relajada pero lista para moverse, medio agazapada, como quien ya está calculando la salida antes de que haga falta usarla. Composición centrada, con ~10% de aire en los cuatro bordes por si una interfaz futura recorta el encuadre.

### Clérigo

Ilustración de 1536×1050px, ratio ~1,46:1, a sangre, sin transparencia, tono D&D-lite crudo y desgastado. Retrato de cuerpo entero o tres cuartos de un humano de gesto severo y poco dado a sonreír, con el aire de un exorcista errante más que de un sacerdote de templo. Viste una armadura de cota de escamas visiblemente usada y lleva una maza bendita en una mano y un símbolo sagrado sencillo, sin ostentación, en la otra. Postura erguida y firme, la mirada de alguien que ha visto cosas que preferiría no haber visto y sigue caminando de todas formas. Composición centrada, con ~10% de aire en los cuatro bordes por si una interfaz futura recorta el encuadre.
