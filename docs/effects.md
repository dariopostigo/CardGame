# CardGame — Efectos / Estados

Modificadores **temporales** aplicados durante una prueba/combate. **No ocupan hueco de mazo** (a diferencia de una Maldición, [`cards/curses.md`](cards/curses.md)). Sistema en [`game-design.md`](game-design.md) §3.2 y §4b.9. Referenciado desde varias cartas del catálogo de equipo ([`cards/README.md`](cards/README.md)). Valores = **primer pase sin balancear**.

## 1. Reglas generales

- **Representación *(decidido)*:** los estados **no son cartas propias**. Son un efecto que otras cartas (de clase, item, hechizo), enemigos o el terreno **aplican** al jugarse/activarse, sobre ti, un aliado o un enemigo (`game-design.md` §3.2 y §6). Esta ficha es su **referencia de reglas**, no un mazo.
- **CD de salvación:** **12 fijo** para todo el prototipo (a afinar; alternativa futura: `8 + mod de la stat del que aplica el efecto`). Algunas fuentes muy fuertes usan CD 14 (se indica en su bloque, ej. Araña matriarca, `characters/enemies.md` §5b).
- **Momento (timing):**
  - Estados de **"1 tirada"** (Ventaja/Desventaja): se consumen en la siguiente tirada aplicable.
  - Estados por **turnos**: el daño (ej. Envenenado) se aplica **al inicio** del turno del afectado; la **salvación** para terminarlos se tira **al final** de su turno.
  - **Buffs** (Escudado/Bendecido): duran lo indicado, sin salvación.
  - **Duración mínima de un buff: 2 turnos *(decidido)*.** Por la regla madre de [`game-design.md`](game-design.md) §4, jugar una carta **gasta su preparación**: un buff que durase "hasta tu próximo turno" costaba una carta preparada entera a cambio de **un solo** turno de efecto, y nunca competía con simplemente atacar. Por eso *Escudado* pasa de 1 turno a 2. Cualquier buff nuevo debe respetar ese suelo.
- **Acumulación:** un personaje puede tener varios estados a la vez, salvo que se diga lo contrario. Ventaja y Desventaja **se cancelan** entre sí (como en D&D: si tienes ambas, no tiras nada extra).

## 2. Catálogo de estados

| Estado | Efecto | Duración / fin | Cómo se aplica (fuentes) | Cómo se cura |
|---|---|---|---|---|
| **Ventaja** | Tiras 2d20 y coges el **mejor** | 1 tirada | Golpe firme (Guerrero), emboscada desde Bosque (`board/board-map.md` §3a), atacar estando Oculto, Golpe de las sombras ([`cards/encounter.md`](cards/encounter.md)) | Se consume sola |
| **Desventaja** | Tiras 2d20 y coges el **peor** | 1 tirada | Terreno expuesto, Niebla ([`cards/encounter.md`](cards/encounter.md)), **disparar a bocajarro** (ataque a distancia contra un enemigo adyacente, [`game-design.md`](game-design.md) §4b.1), armadura ruidosa en la prueba de sigilo ([`cards/armor.md`](cards/armor.md) §5) | Se consume sola |
| **Aturdido** | Pierdes tu Acción y tu Acción rápida (no atacas ni usas habilidades/objetos); **conservas el Movimiento** (puedes moverte) | 1 turno | Golpes fuertes de enemigos élite/jefe | Automático al pasar el turno (sin salvación) |
| **Envenenado** | 1d4 de daño al inicio de tu turno | Salvación **CON** al final de cada turno; máx. 3 turnos | Trasgo, Araña(s) (`characters/enemies.md` §5b), cruzar Pantano (`board/board-map.md` §3a) | Salvación CON, o **Antídoto** ([`cards/items.md`](cards/items.md)) lo quita ya |
| **Inmovilizado** | No puedes usar Movimiento | Salvación **DES** al final del turno (o 1 turno) | Enredo gélido (Mago), Telaraña (Arañas) | Salvación DES |
| **Ralentizado** | Movimiento reducido a 1 hex | 1 turno | Terreno, Clima adverso / Terreno traicionero ([`cards/encounter.md`](cards/encounter.md)) | Automático, o salir de la zona |
| **Asustado** | Desventaja en tus ataques mientras la fuente esté a la vista; no puedes acercarte a ella voluntariamente | Salvación **SAB** al final del turno | Auras de jefe (ej. el Heraldo Ceniciento, `characters/enemies.md` §5b) | Salvación SAB, o perder de vista la fuente |
| **Oculto** | Los enemigos no te detectan aunque estés en su rango (salta la prueba de sigilo, `characters/enemies.md` §2b) | Hasta atacar/interactuar o ser descubierto | Escabullirse / Desaparecer (Pícaro, [`cards/class.md`](cards/class.md)), terminar en Bosque | Se rompe al actuar |
| **Bendecido** | +1d4 a tus tiradas de ataque y de salvación | 3 turnos | Bendición (Clérigo) | Automático al expirar |
| **Escudado** | +X a la CA (según la carta) | **2 turnos** | Postura defensiva (Guerrero, +2), Escudo arcano (Mago, +3), Escudo de fe (Clérigo, +2) | Automático al expirar |
| **Miedo** | **−1d4** a tus tiradas de ataque y de salvación (el reverso de Bendecido) | Hasta el próximo **descanso largo** (no se quita con una salvación normal) | Umbrales altos del **Nivel de Amenaza** (`game-design.md` §6c.3), auras de jefe, Sucesos ([`cards/encounter.md`](cards/encounter.md)) | Descanso largo en localización segura (`game-design.md` §4c.3), o carta/habilidad de Clérigo |

> **Miedo ≠ Asustado:** *Asustado* es un susto **táctico** ligado a una fuente a la vista (desventaja mientras la veas, se cura con salvación SAB). *Miedo* es una **moral minada persistente**, sin fuente concreta, que te lastra hasta que descansas a salvo — la cara "blanda" de una Maldición, pero **sin ocupar hueco de mazo**.

## 3. Próximos pasos

- [ ] Balancear duraciones y la CD de salvación (hoy fija en 12) al testear.
- [ ] Cuando se diseñen las cartas de item/hechizo que faltan, enlazar cuáles conceden/curan cada estado (la columna "fuentes" se irá completando).
- [ ] Añadir estados nuevos **solo cuando una carta los necesite** (ej. Cegado, Marcado, Sangrado), para no inventar estados sin uso.
