# CardGame — Cartas: Efectos / Estados

Modificadores **temporales** aplicados durante una prueba/combate. **No ocupan hueco de mazo** (a diferencia de una Maldición, [`curses.md`](curses.md)). Sistema en [`../game-design.md`](../game-design.md) §3.2 y §4b.9. Índice de cartas en [`README.md`](README.md). Valores = **primer pase sin balancear**.

## 1. Reglas generales

- **Representación *(decidido)*:** los estados **no son cartas propias**. Son un efecto que otras cartas (de clase, item, hechizo), enemigos o el terreno **aplican** al jugarse/activarse, sobre ti, un aliado o un enemigo (`../game-design.md` §3.2 y §6). Esta ficha es su **referencia de reglas**, no un mazo.
- **CD de salvación:** **12 fijo** para todo el prototipo (a afinar; alternativa futura: `8 + mod de la stat del que aplica el efecto`). Algunas fuentes muy fuertes usan CD 14 (se indica en su bloque, ej. Araña matriarca, `../enemies.md` §5b).
- **Momento (timing):**
  - Estados de **"1 tirada"** (Ventaja/Desventaja): se consumen en la siguiente tirada aplicable.
  - Estados por **turnos**: el daño (ej. Envenenado) se aplica **al inicio** del turno del afectado; la **salvación** para terminarlos se tira **al final** de su turno.
  - **Buffs** (Escudado/Bendecido): duran lo indicado, sin salvación.
- **Acumulación:** un personaje puede tener varios estados a la vez, salvo que se diga lo contrario. Ventaja y Desventaja **se cancelan** entre sí (como en D&D: si tienes ambas, no tiras nada extra).

## 2. Catálogo de estados

| Estado | Efecto | Duración / fin | Cómo se aplica (fuentes) | Cómo se cura |
|---|---|---|---|---|
| **Ventaja** | Tiras 2d20 y coges el **mejor** | 1 tirada | Golpe firme (Guerrero), emboscada desde Bosque (`../board-map.md` §3a), atacar estando Oculto, Golpe de las sombras ([`encounter.md`](encounter.md)) | Se consume sola |
| **Desventaja** | Tiras 2d20 y coges el **peor** | 1 tirada | Terreno expuesto, Niebla ([`encounter.md`](encounter.md)), disparar a bocajarro ([`weapons.md`](weapons.md)) | Se consume sola |
| **Aturdido** | Pierdes tu turno entero (sin Acción, Acción rápida ni Movimiento) | 1 turno | Golpes fuertes de enemigos élite/jefe | Automático al pasar el turno (sin salvación) |
| **Envenenado** | 1d4 de daño al inicio de tu turno | Salvación **CON** al final de cada turno; máx. 3 turnos | Trasgo, Araña(s) (`../enemies.md` §5b), cruzar Pantano (`../board-map.md` §3a) | Salvación CON, o **Antídoto** ([`items.md`](items.md)) lo quita ya |
| **Inmovilizado** | No puedes usar Movimiento | Salvación **DES** al final del turno (o 1 turno) | Enredo gélido (Mago), Telaraña (Arañas) | Salvación DES |
| **Ralentizado** | Movimiento reducido a 1 hex | 1 turno | Terreno, Clima adverso / Terreno traicionero ([`encounter.md`](encounter.md)) | Automático, o salir de la zona |
| **Asustado** | Desventaja en tus ataques mientras la fuente esté a la vista; no puedes acercarte a ella voluntariamente | Salvación **SAB** al final del turno | Auras de jefe (ej. el Heraldo Ceniciento, `../enemies.md` §5b) | Salvación SAB, o perder de vista la fuente |
| **Oculto** | Los enemigos no te detectan aunque estés en su rango (`../enemies.md` §2) | Hasta atacar/interactuar o ser descubierto | Escabullirse / Desaparecer (Pícaro, [`class.md`](class.md)), terminar en Bosque | Se rompe al actuar |
| **Bendecido** | +1d4 a tus tiradas de ataque y de salvación | 3 turnos | Bendición (Clérigo) | Automático al expirar |
| **Escudado** | +X a la CA (según la carta) | Hasta tu próximo turno | Postura defensiva (Guerrero), Escudo arcano (Mago), Escudo de fe (Clérigo) | Automático al expirar |

## 3. Próximos pasos

- [ ] Balancear duraciones y la CD de salvación (hoy fija en 12) al testear.
- [ ] Cuando se diseñen las cartas de item/hechizo que faltan, enlazar cuáles conceden/curan cada estado (la columna "fuentes" se irá completando).
- [ ] Añadir estados nuevos **solo cuando una carta los necesite** (ej. Cegado, Marcado, Sangrado), para no inventar estados sin uso.
