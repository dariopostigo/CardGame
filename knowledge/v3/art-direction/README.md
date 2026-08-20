# Dirección de arte — V3

> **Qué es esta carpeta: el concepto de arte de todas las ilustraciones del
> juego.** Cómo se dibuja y qué se dibuja. Nada más — ni medidas de archivo, ni
> rutas, ni diseño de carta, ni personajes concretos. Si algo de eso aparece
> aquí, está en el sitio equivocado y hay que sacarlo.
>
> El estilo **no está partido en v2 y v3** como el resto del repo: no cambió al
> cambiar el motor de reglas. **V3 se dibuja igual que v2, lo que cambia es a
> quién.** Por eso hay una sola biblia y vive aquí, y por eso los prompts
> congelados de [`../../v2/art-direction/`](../../v2/art-direction/cards.md)
> siguen apuntando a ella: describen un catálogo muerto con un estilo vivo.

## Los dos documentos

| Documento | Responde a | Cambia cuando |
|---|---|---|
| [`style-guide.md`](style-guide.md) | **Cómo se dibuja** cualquier cosa: línea, anatomía, rostros, sombreado, color, materiales, silueta, luz, prompt base y negative prompt | Cambia el aspecto del juego — casi nunca |
| [`illustrations.md`](illustrations.md) | **Qué se dibuja**: los sujetos (héroes de clase, unidades, criaturas, enemigos, objetos), qué pide cada uno, encuadre, plantilla de prompt | Cambian las razas, las unidades o el catálogo de cartas |

La dependencia va en un solo sentido: `illustrations.md` **se apoya en**
`style-guide.md` y no repite nada suyo — enlaza al prompt base (§21), al
negative prompt (§20), a la regla de consistencia (§22) y al checklist (§24). Al
generar una ilustración se usan los dos a la vez.

Ese reparto es lo que hizo que el salto v2→v3 costara poco: hubo que reescribir
`illustrations.md` entero y `style-guide.md` no se tocó.

## Qué NO está aquí, y dónde está

Cuatro cosas que suenan a dirección de arte y no lo son:

| Qué | Dónde vive | Por qué no aquí |
|---|---|---|
| Tamaño, ratio, sangrado, transparencia, aire, extensión | [`public/assets/v3/README.md`](../../../public/assets/v3/README.md#lienzo-y-formato) | Depende del componente que pinta la imagen, no del estilo |
| Estructura de carpetas y nombre de archivo | [`public/assets/v3/README.md`](../../../public/assets/v3/README.md) | Es pipeline, y ya lo definía esa carpeta |
| Marco, tipografía, disposición, Rareza | [`../card-concept/`](../card-concept/README.md) | Es diseño gráfico de un objeto de interfaz, no ilustración. Sin definir en V3 |
| El concepto de calibración, cuando exista | Con su raza, en [`../races-concept/prompts/`](../races-concept/prompts/humanos.md) | Es un **sujeto**. Aquí no van personajes concretos. Hoy V3 no tiene ninguno: la §14 de la biblia está pendiente |

Y los **sujetos en sí** —qué razas, qué clases, qué unidades y con qué papel
táctico— no se deciden aquí: salen del diseño de juego
([`docs/v3/razas.md`](../../../docs/v3/razas.md), hoy en redefinición en
[`../races-concept/`](../races-concept/README.md)). `illustrations.md` los recoge
para decir cómo se ven; no los inventa.

## Estado

**Las razas ya se pueden ilustrar; las cartas no.** Los sujetos existen —razas,
4 clases y 8 unidades cada una, con su papel—, así que retratos de héroe y de
unidad, sí. Ilustración de carta de clase, maldición, objeto o encuentro,
todavía no: los documentos de [`docs/v3/cards/`](../../../docs/v3/cards/README.md)
son esqueletos y el motor de combate está por escribir. Una ilustración de carta
sin carta detrás decide en imagen lo que después decide el motor, y gana el
motor.

**Empieza por Humanos**, la raza piloto. Cerrar sus 4 clases y sus 8 unidades
antes de tocar otra raza da una vara de medir para todo lo que venga.

Los pendientes, con su bloqueo, en [`illustrations.md`](illustrations.md#7-qué-falta) §7.
