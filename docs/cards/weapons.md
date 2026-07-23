# CardGame — Cartas: Armas

Catálogo de cartas de **Arma** (tipo/icono en [`../game-design.md`](../game-design.md) §3.2, Rareza en §3.3, reglas de manos 1h/2h en §2.4). Índice de todas las cartas en [`README.md`](README.md). Los valores de abajo son un **primer pase sin balancear**, tomando D&D como base y adaptándolo al modelo de adyacencia/alcance en hexágonos (`../game-design.md` §4b).

## 1. Armas melee

| Arma | Manos | Daño | Tipo | Stat ataque | Propiedades | Rareza |
|---|---|---|---|---|---|---|
| Dagas | 1h | 1d4 | Perforante | FUE/DES (finesse) | Ligera; arrojadiza (2 hex) | Común |
| Espada | 1h | 1d8 | Cortante | FUE | — | Común |
| Espada | 2h | 1d12 | Cortante | FUE | Dos manos; requisito FUE 13 | Poco común |
| Hacha | 1h | 1d6 | Cortante | FUE | Ligera; arrojadiza (2 hex) | Común |
| Hacha | 2h | 1d12 | Cortante | FUE | Dos manos, pesada; requisito FUE 13 | Poco común |
| Lanza | 2h | 1d10 | Perforante | FUE | **Alcance** (ataca a 2 hex en línea sin estar adyacente) | Común |
| Maza | 1h | 1d6 | Contundente | FUE | Buena vs no-muertos (`../enemies.md` §5) | Común |
| Escudo | 1h | 1d4 | Contundente | FUE | **+2 CA** mientras lo llevas; combinable con cualquier armadura | Común |

## 2. Armas a distancia

| Arma | Manos | Daño | Tipo | Stat ataque | Alcance | Propiedades | Rareza |
|---|---|---|---|---|---|---|---|
| Arco | 2h | 1d8 | Perforante | DES | 4 hex | Dos manos | Común |
| Ballesta pesada | 2h | 1d10 | Perforante | DES | 5 hex | Dos manos; recarga (1 disparo/turno) | Poco común |
| Ballesta de mano | 1h | 1d6 | Perforante | DES | 3 hex | — | Común |
| Bastón de mago | 1h | 1d6 (melee) | Contundente | FUE/DES | 1 hex | **Foco arcano:** +1 a la tirada de ataque de hechizos | Poco común |

## 3. Armas de soporte

| Arma | Manos | Efecto | Rareza |
|---|---|---|---|
| Libro de hechizos | 1h | Foco arcano: necesario para preparar ciertos hechizos de Mago / +1 hechizo especial preparado. No hace daño. | Común |
| Antorcha | 1h | Melee 1d4 de fuego; **ilumina** (mejora el rango de visión en localizaciones oscuras: Cueva/Mazmorra/Mina, `../board-map.md` §3b). | Común |

## 4. Reglas transversales

- **Stat de ataque:** FUE (armas pesadas), DES (ligeras finesse y a distancia), "FUE/DES" = usa el mejor de los dos mod. Los hechizos usan INT/SAB (`../game-design.md` §2.1).
- **Finesse/Ligera:** puede usarse con Destreza — beneficia al Pícaro ([`class.md`](class.md)).
- **Arrojadiza:** un arma melee ligera puede lanzarse a un enemigo a 2 hex (gasta la Acción). Munición asumida infinita en el prototipo (ver checklist).
- **Alcance (Lanza):** ataca a un enemigo a 2 hex en línea sin estar adyacente — útil con el modelo de adyacencia (`../game-design.md` §4b.1).
- **Recarga (Ballesta pesada):** solo 1 disparo por turno (no combina con un segundo disparo de Acción rápida).
- **Requisito de FUE:** las armas de 2 manos pesadas piden FUE 13; por debajo, **desventaja** en la tirada de ataque (el Mago FUE 8 no debería blandir un mandoble).

## 5. Próximos pasos

- [ ] Balancear dados/alcances al testear en el prototipo.
- [ ] Crear variantes mágicas (ligar con [`items.md`](items.md) §3) y asignar su Rareza.
- [ ] Definir munición para armas a distancia (¿infinita en prototipo o recurso gestionado?).
- [ ] Decidir el subconjunto del prototipo (recomendado: Espada 1h, Hacha 2h, Dagas, Arco, Bastón, Maza + Escudo).
