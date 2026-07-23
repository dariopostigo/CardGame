# CardGame — Cartas: Items

Catálogo de cartas de **Item** — la categoría más amplia (tipo/icono en [`../game-design.md`](../game-design.md) §3.2, Rareza en §3.3). Incluye equipo de aventurero, herramientas, objetos mágicos, consumibles (pociones, pergaminos) y cartas de movimiento. Índice de cartas en [`README.md`](README.md).

## 1. Equipo de aventurero

Mochila, Saco/bolsa, Saco de dormir, Cuerda de cáñamo, Antorcha, Yesca y pedernal, Linterna (sorda o de aceite), Odre/cantimplora, Raciones de viaje, Kit de escalada, Ganzúas, Espejo de acero pequeño, Manta, Cadena, Estacas de hierro, Martillo, Pala/pico, Poción de vida, Pergamino.

## 2. Herramientas

Herramientas de artesano (herrero, alfarero, tejedor, etc.), Instrumento musical, Kit de disfraz, Kit de falsificación, Kit de venenos, Herramientas de navegante, Herramientas de cartógrafo, Juego de dados/cartas, Trampa para osos, Grilletes.

## 3. Objetos mágicos raros/legendarios

Solo se **encuentran** (loot de Élite/Jefe, cofres de alta rareza); los Legendarios **no se venden en tienda** (`../game-design.md` §6b.3). Efectos = primer pase sin balancear.

| Objeto | Rareza | Efecto |
|---|---|---|
| Espada vorpal | Legendario | Arma 2h, 2d8 cortante; con crítico (nat 20) **decapita**: muerte instantánea a enemigos no-jefe, daño masivo a jefes |
| Manto de invisibilidad | Legendario | Acción: quedas **Oculto** ([`effects.md`](effects.md)) sin necesitar terreno; 1/combate |
| Bastón del poder | Épico | Foco arcano: +1 a tiradas y CD de hechizos y **+1 CA**; potencia las cartas de Mago |
| Anillo de deseo | Legendario | **1 uso** (se consume): copia el efecto de una Especial que hayas visto este combate, o cúrate al máximo |
| Orbe de dragón | Legendario | Acción, 1/combate: aliento de 4d6 de fuego en un hex y sus adyacentes (salvación DES por mitad) |
| Guantelete del ogro | Épico | +2 de Fuerza efectiva para armas y pruebas; +2 al daño cuerpo a cuerpo |
| Botas de teletransporte | Épico | Acción rápida, 1/combate: te teletransportas hasta 3 hex (ignora terreno y adyacencia) |

## 4. Consumibles

Pociones (efecto de un solo uso: curación, buff temporal), Pergaminos (hechizo de un solo uso — sostienen el modelo sin-maná de `../game-design.md` §4b.7). Se usan normalmente como **Acción rápida** en combate (`../game-design.md` §4b.3).

| Consumible | Coste | Efecto | Rareza |
|---|---|---|---|
| Poción de vida | Acción rápida | Recuperas PV al instante (ej. 2d4+2), un uso | Común |
| Antídoto | Acción rápida | Retira el estado **Envenenado** ([`effects.md`](effects.md)), un uso | Común |
| Pergamino (hechizo) | Acción | Lanza un hechizo concreto una vez y se consume | Poco común+ |

## 4b. Recuperación / Descanso

Cartas ligadas al sistema de **Descanso y recuperación** (`../game-design.md` §4c). A diferencia de las pociones (instantáneas, un uso), la Hoguera es reutilizable pero solo fuera de combate y con riesgo.

| Carta | Coste | Efecto | Rareza |
|---|---|---|---|
| **Hoguera / Campamento** | Fuera de combate | **Descanso corto:** gastas Dados de Vida para curarte y reseteas habilidades 1/descanso. Acampar en terreno inseguro **arriesga una emboscada** (roba del [`encounter.md`](encounter.md)); Bosque es seguro. No re-acampable hasta que ocurra algo (`../game-design.md` §4c.2). | Común |

> El **descanso largo** (cura total, recupera Dados de Vida, retira estados) no es una carta: ocurre en localizaciones seguras — Pueblo/Taberna/Templo (`../board-map.md` §3b, `../npcs.md`, `../game-design.md` §4c.3).

## 5. Cartas de movimiento

Subtipo de Item que se juega para ganar **movimiento extra** ese turno, por encima del estándar de 2 (`../game-design.md` §2.2). Se usan como Acción rápida.

| Carta | Coste | Efecto | Rareza |
|---|---|---|---|
| Bota veloz | Acción rápida | +2 de movimiento este turno | Común |
| Atajo del pícaro | Acción rápida | +1 de movimiento e ignoras el coste extra de terreno difícil (Pantano) este turno | Poco común |
| Zancada del viento | Acción rápida | +3 de movimiento este turno; un uso (se consume) | Raro |

## 6. Próximos pasos

- [ ] Asignar Rareza a cada item.
- [x] Definir el efecto de los objetos mágicos (§3) y de las cartas de movimiento (§5). Falta balancear.
- [ ] Decidir qué subconjunto entra en el prototipo (probablemente 3-4 items básicos + 1-2 pociones/pergaminos).
- [ ] Separar, si conviene, los items "de sabor/exploración" (mochila, manta) de los que tienen efecto mecánico real en combate.
