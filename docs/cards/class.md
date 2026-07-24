# CardGame — Cartas: de Clase

Catálogo de **Cartas Básicas y Especiales de Clase** (sistema en [`../game-design.md`](../game-design.md) §3.1, economía de acción de combate en §4b.3). Salen de la clase del héroe, no son cartas de equipo ni llevan Rareza (§3.3). Héroes y stats en [`../characters/heroes.md`](../characters/heroes.md). Índice de cartas en [`README.md`](README.md).

> **Roster completo (4 héroes):** Guerrero (§2), Mago (§3), Pícaro (§4) y Clérigo (§5) — los 4 arquetipos de `../characters/heroes.md`. Cada uno tiene 3 Básicas + 1 Especial de ejemplo. Los valores (dados, bonos, CD) son un punto de partida **sin balancear**.

## 1. Anatomía de una carta de clase

Cada carta se define por estos campos, enganchados a la economía de acción de combate ([`../game-design.md`](../game-design.md) §4b.3):

| Campo | Valores posibles |
|---|---|
| **Tipo** | `Acción` (la principal del turno) · `Acción rápida` (1/turno) · `Modificador` (enganchada a una tirada, ≤1 por tirada, no gasta la Acción) · `Pasiva` (siempre activa mientras esté en el mazo) |
| **Uso** | **Básica:** ilimitado (reutilizable cada turno; el límite real es la economía de acción). **Especial:** limitado — `1/combate` o `1/descanso`. |
| **Efecto** | Qué hace, con sus tiradas/dados. |

- **Por qué las Básicas son reutilizables:** no hay barajar ni robar una mano (`../game-design.md` §4), así que una carta que tienes **en juego** es una opción siempre disponible. Lo que impide spamear "Golpe firme" cada turno es que **cuesta la Acción principal**, no un límite de usos. Las Especiales sí llevan límite porque son mucho más potentes.
- **Cuentan para el Mazo y para "en juego" — decidido:** las cartas de clase **ocupan hueco** tanto en el Mazo (≤20) como en la zona **"en juego" (≤10)**, compitiendo con los items y mercenarios por esos huecos y por lo que preparas con el Oteo (ver [`README.md`](README.md) y [`../game-design.md`](../game-design.md) §4). Habrá una explicación in-fiction por desarrollar; si el límite queda demasiado ajustado al ganar Especiales por nivel, se podrá subir más adelante.

## 2. Guerrero *(Fighter — FUE 15/+2, CON 14/+2, d10, PV 14 — `../characters/heroes.md` §2b-2c)*

Rol: tanque melee fiable. Sus cartas premian **impactar con seguridad**, **aguantar** y **cerrar distancia**.

### Básicas (nivel 1)

| Carta | Tipo | Efecto |
|---|---|---|
| **Golpe firme** | Acción | Ataque cuerpo a cuerpo a un enemigo adyacente **con ventaja** (2d20, coges el mejor). El guerrero rara vez falla. |
| **Postura defensiva** | Acción rápida | Hasta tu próximo turno, **+2 a tu Defensa/CA**. No puedes combinarla con Embestida el mismo turno (te plantas, no cargas). |
| **Embestida** | Acción | Muévete hasta 2 hex hacia un enemigo y haz un ataque melee al terminar. Si te moviste ≥1 hex, **+2 al daño** (impulso de la carga). |

### Especial (ejemplo)

| Carta | Tipo | Uso | Efecto |
|---|---|---|---|
| **Segundo aliento** | Acción rápida | 1/descanso | Recuperas **1d10 + nivel** PV. (Toca también el sistema de descanso — ver checklist de `../game-design.md`.) |

## 3. Mago *(Wizard — INT 15/+2, DES 14/+2, d6, PV 8 — `../characters/heroes.md` §2b-2c)*

Rol: daño a distancia y control, el más frágil (PV 8). Sus cartas premian **pegar desde lejos**, **frenar al que se acerca** y **sobrevivir un turno más**. Encaja con la detección de enemigos (`../characters/enemies.md` §2): un mago quiere frenar al enemigo que lo ha detectado antes de que llegue a adyacencia.

### Básicas (nivel 1)

| Carta | Tipo | Efecto |
|---|---|---|
| **Descarga arcana** | Acción | Ataque a distancia (alcance **4 hex**): `1d20 + mod INT` vs Defensa; si impacta, **1d8 de daño 🔮 (arcano)**. Es el ataque a distancia fiable del mago (sus armas cuerpo a cuerpo son flojas). |
| **Escudo arcano** | Acción rápida | Hasta tu próximo turno, **+3 a tu Defensa/CA**. La red de seguridad del mago frágil. |
| **Enredo gélido** | Acción | A distancia (alcance 3 hex): si impacta (`1d20 + mod INT` vs Defensa), el enemigo queda **Inmovilizado 1 turno** (no puede usar Movimiento; `../game-design.md` §4b.9). Sin daño, control puro para hacer *kiting*. |

### Especial (ejemplo)

| Carta | Tipo | Uso | Efecto |
|---|---|---|---|
| **Bola de fuego** | Acción | 1/combate | Explosión a distancia (alcance 4 hex): daño **3d6 de fuego** al enemigo objetivo y a los adyacentes a él. Cada afectado hace una salvación de Destreza (`1d20 + mod DES` vs CD) para recibir la mitad. |

## 4. Pícaro *(Rogue — DES 15/+2, CAR 14/+2, d8, PV 11 — `../characters/heroes.md` §2b-2c)*

Rol: sigilo, daño furtivo y exploración. Sus cartas premian **atacar desde la sombra**, **reposicionarse** y **ver antes que nadie**. Es el héroe que más dialoga con la detección enemiga (`../characters/enemies.md` §2): evita el combate o lo empieza con ventaja.

### Básicas (nivel 1)

| Carta | Tipo | Efecto |
|---|---|---|
| **Ataque furtivo** | Acción | Ataque con arma ligera o a distancia. Si estás **Oculto** ([`../effects.md`](../effects.md)) o atacas con ventaja, **+2d6 de daño**. El pan de cada día del pícaro. |
| **Escabullirse** | Acción rápida | Te mueves 1 hex sin arriesgar golpe de oportunidad y ganas **+2 para evitar detección** (prueba de sigilo, [`../characters/enemies.md`](../characters/enemies.md) §2b) hasta tu próximo turno; si terminas en Bosque u otro terreno de ocultación, quedas **Oculto**. |
| **Ojo avizor** | Acción | Adelanta a **Detectado** un grupo vecino sin explorar, o **+1 a tu rango de visión** hasta tu próximo turno (`../board/board-map.md` §4, `../game-design.md` §2.3). Exploración pura, sin combate. *(En el prototipo de niebla simple solo aplica el +1 de rango de visión; la parte de "grupo Detectado" se activa con el sistema de grupos/tiles, `../board/board-map.md` §8.)* |

### Especial (ejemplo)

| Carta | Tipo | Uso | Efecto |
|---|---|---|---|
| **Desaparecer** | Acción rápida | 1/combate | Quedas **Oculto** aunque estés a la vista (los enemigos pierden tu rastro) hasta que ataques o interactúes. Prepara un Ataque furtivo demoledor o una huida. |

## 5. Clérigo *(Cleric — SAB 15/+2, CON 14/+2, d8, PV 12 — `../characters/heroes.md` §2b-2c)*

Rol: curación, soporte y algo de daño divino. Sus cartas premian **mantenerte en pie**, **proteger** y **castigar no-muertos**. (Con un solo héroe en el prototipo, la mayoría se aplican a ti mismo; los objetivos "aliado" cobran sentido con Mercenarios de `../characters/npcs.md`.)

### Básicas (nivel 1)

| Carta | Tipo | Efecto |
|---|---|---|
| **Palabra sanadora** | Acción rápida | Recuperas tú (o un aliado adyacente) **1d8 + mod SAB** PV. Curación fiable y repetible. |
| **Llama sagrada** | Acción | Ataque divino a distancia (alcance 3 hex): `1d20 + mod SAB` vs Defensa; **1d8 de daño ☀️ (radiante)**, especialmente efectivo vs no-muertos (`../characters/enemies.md` §5). |
| **Escudo de fe** | Acción rápida | Concede **Escudado +2 CA** ([`../effects.md`](../effects.md)) a ti o a un aliado adyacente hasta tu próximo turno. |

### Especial (ejemplo)

| Carta | Tipo | Uso | Efecto |
|---|---|---|---|
| **Bendición** | Acción | 1/combate | Durante 3 turnos ganas **Bendecido** ([`../effects.md`](../effects.md)): +1d4 a tus tiradas de ataque y de salvación. |

## 6. Próximos pasos / preguntas abiertas

- [x] Diseñar las Básicas de **Pícaro** (sigilo/exploración) y **Clérigo** (curación/soporte) → hechas (§4-5).
- [ ] Balancear valores (dados de daño, bonos, alcances, CD) al testear en el prototipo.
- [ ] Ampliar las Especiales de cada clase (por ahora 1 de ejemplo por héroe) y ligarlas a la progresión por nivel (`../game-design.md` §5: 1 Especial nueva por nivel).
- [ ] Cerrar la duración/CD de los estados nuevos que introducen estas cartas (Oculto, Bendecido, Escudado) en [`../effects.md`](../effects.md).
- [ ] Cuando quieras, añadir más cartas a cualquier clase.
