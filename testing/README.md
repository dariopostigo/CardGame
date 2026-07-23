# testing/ — Sandbox de diseño de carta

Prototipo visual **standalone** (HTML+CSS+JS vanilla, sin dependencias) para fijar el
aspecto de las cartas de CardGame antes de integrarlas en la app Next.js.

`index.html` es una **galería de estilos**: el mismo esqueleto de carta y los mismos datos,
con un selector de **Diseño** (pestañas) para ir comparando propuestas visuales. Se irán
añadiendo más estilos según se vayan comentando referencias.

## Cómo abrirlo

Doble clic en `index.html`, o desde la raíz del proyecto:

```powershell
Start-Process .\testing\index.html
```

No necesita servidor ni build. Todo es offline (emojis como placeholder de arte, fuentes del sistema).

## Qué muestra

- **Selector de Diseño** (pestañas), estilos disponibles:
  - **Oscuro** — neón con glow de rareza (inspirado en `public/assets/unknowgames6.png`).
  - **RPG** — look de juego de mesa: cuero oscuro, marco de bronce, serif y panel de texto tipo pergamino.
  - **Arcano** — carta oscura azul/púrpura moderna: esquinas muy redondeadas, retrato enmarcado con trama diagonal, nombre serif blanco, panel recuadrado y chips-píldora (fiel a *RPG Character Card*, Gustav-Wahlbom, `docs/links.txt`). La rareza es el color de acento.
  - **Grimorio** — mezcla: la estructura del **Arcano** con la paleta cálida del **RPG** (cuero, bronce, oro, pergamino).
- **Vista "Rejilla de rareza"**: la misma carta en los 5 colores de rareza.
- **Efectos**: tilt 3D + gloss al pasar el cursor; borde eléctrico animado en legendarias. Botón para desactivar el tilt.
- **7 cartas de ejemplo** con datos reales de los `docs/`: Clase, Arma, Armadura, Item, Maldición, Enemigo y una Legendaria.

## Modelo de datos → zonas del esqueleto

Derivado de `docs/game-design.md` §3 y `docs/cards/*`. Cada zona es una clase CSS:

| Zona (clase) | Qué es | Fuente en docs |
|---|---|---|
| `.card[data-rarity]` | Color del marco por rareza/eje | game-design.md §3.3 |
| `.card__badge` | Icono de tipo (esquina sup. izq.) | game-design.md §3.2 |
| `.card__cost` | Coste de acción (solo clase/item) | cards/class.md §1 |
| `.card__art` | Arte (placeholder emoji) | — |
| `.card__name` | Banner de nombre | — |
| `.card__text` | Texto de efecto (zona pergamino) | cards/*.md |
| `.card__footer` + `.stat` | Chips de stats según tipo | ver abajo |
| `.card__tag` | Categoría/rareza al pie | game-design.md §3.3 |

**Footer por tipo:**

- **Arma** — daño (1d12), tipo (cortante/perforante/contundente), manos (1h/2h), stat (FUE/DES) · `cards/weapons.md`
- **Armadura** — bono CA, peso (ligera/media/pesada), requisito · `cards/armor.md`
- **Item** — coste de uso, propiedad · `cards/items.md`
- **Clase** — uso (Básica/Especial) · `cards/class.md`
- **Maldición** — efecto, coste de limpieza (severidad) · `cards/curses.md`
- **Enemigo** — 6 stats FUE/DES/CON/INT/SAB/CAR, categoría · `characters/enemies.md`

### Colores de rareza (game-design.md §3.3)

Común gris · Poco común verde · Raro azul · Épico morado · Legendario dorado.
Se controlan con `data-rarity="comun|poco-comun|raro|epico|legendario"`.
Ejes sin rareza: `clase`, `maldicion` (usa severidad), `enemigo` (usa categoría).

## Técnicas CSS ↔ CodePens de referencia (`docs/links.txt`)

> Los pens no se pudieron scrapear (CodePen bloquea el acceso automatizado, 403).
> Las técnicas se reimplementaron desde cero; aquí queda el mapeo por si quieres
> abrir el original y comparar.

| Efecto en el sandbox | Técnica | CodePen de origen |
|---|---|---|
| Tilt 3D al hover (`.card--tilt` + `cards.js`) | `perspective` + `rotateX/Y` según cursor | jackrugile — *Hearthstone 3D* |
| Gloss que sigue al cursor (`.card__gloss`) | `radial-gradient` con posición variable + `mix-blend-mode` | jackrugile |
| Borde eléctrico legendaria (`.card--legendary::after`) | `conic-gradient` girando + `mask` + `drop-shadow` parpadeante | BalintFerenczy — *Electric border* |
| Estilo **Arcano** (tema, `cards.css` §6c) | carta oscura púrpura, retrato con trama, chips-píldora | Gustav-Wahlbom — *RPG Character Card* |
| (Pendiente) abanico de mano | `transform: rotate` + `translateY` escalonado | cbolson / schwiiiii — *Fanned cards* |
| (Pendiente) flip carta | `rotateY(180deg)` + `backface-visibility` | HejChristian — *Pick a card* |

## Cómo extender

- **Añadir un estilo nuevo (pestaña):** en `cards.css` §6 crea un bloque `[data-theme="<nombre>"] .card { … }` (más las zonas que quieras re-estilar) y un `body[data-theme="<nombre>"]` para el fondo; en `index.html` añade un `<button data-theme-btn="<nombre>">`. El JS ya lo conecta solo. El esqueleto (§3-4) y los efectos (§5) se comparten entre todos los estilos.
- **Añadir una carta:** copia un `<article class="card card--tilt" data-rarity="…">` en `index.html`, cambia badge/nombre/texto y los `.stat` del footer.
- **Arte real:** sustituye `.card__art .emoji` por un `<img>`; el `.card__art` ya recorta con `overflow:hidden`.
