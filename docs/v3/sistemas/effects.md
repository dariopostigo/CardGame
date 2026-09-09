<!-- estado: escrito -->

# Efectos y estados — V3

> Los **9 estados** que una ficha puede sufrir en combate. Los porcentajes y duraciones son diales de primera pasada: **nada está balanceado**.

Un **estado** es un efecto temporal que se aplica y se quita. No confundir con una **Característica**, que es un rasgo permanente de la ficha y vive en [caracteristicas.md](caracteristicas.md): 🔥 *Fuego* es la Característica que aplica **Quemadura**, y Quemadura es el estado.

## 1. Cómo entra un estado

Lo fija el motor ([game-design.md](../game-design.md) §4.5):

- **Elementales — siempre.** Si el golpe impacta, el estado entra.
- **De control — los aplica el crítico**, y el umbral es **🍀 Suerte**.

No hay tirada aparte ni umbral propio por rasgo: **la tirada es la del ataque y los umbrales son los dos que ya había.**

## 2. Duración y expiración

Cada estado tiene una **duración base fija en turnos**, y encima 🍀 Suerte da una salida temprana:

```
Al final del turno del afectado:
    R = tirada oculta 1..100
    R ≤ 🍀 Suerte  → el estado se cae YA
    si no          → contador − 1
```

En los estados de 1 turno la tirada no hace nada, y está bien: cuando llega el final de tu turno, Aturdido ya se cobró.

> **Consecuencia a vigilar:** esta tirada castiga las duraciones largas, porque son más oportunidades de librarse. Con Suerte 15 un estado de 5 turnos dura 3,7 de media; con Suerte 25, 3,0. **Cualquier dial de duración hay que leerlo con eso puesto.**

## 3. Daño por turno

```
daño = % del ⚔️ Ataque de QUIEN LO APLICÓ
       reducido por lo mismo que el golpe que lo puso (§4.3)
```

Cuelga del Ataque del que lo aplicó para que **ningún estado necesite su propia tabla de balance por tier**: la Quemadura de un dragón pega como un dragón sin escribir un número más.

Y arrastra la mitigación del golpe: Quemadura, Envenenamiento y Congelación los frena **🔮 Resistencia mágica**; Sangrado, que es físico, lo frena **🛡️ Defensa**.

## 4. Acumulación

| Familia | Al reaplicarse |
|---|---|
| Estados de daño | **No acumulan**: refrescan la duración a tope |
| Estados de control | **No acumulan**: estás o no estás |
| 🧊 **Congelación** | **Acumula pilas.** A pila llena, el objetivo no actúa |

Congelación es la única que apila, porque es la única cuyo texto lo pedía.

## 5. El catálogo

**Nueve estados.** 😱 Miedo no está en la lista porque no es un estado: es un **disparador** de Aturdido (§5.1).

| Estado | Qué hace | Daño/turno | Duración | Acumula | Lo aplica |
|---|---|---|---|---|---|
| 🔥 **Quemadura** | daño al final de cada turno | 25% | 3 | no | 🔥 Fuego |
| ☠️ **Envenenamiento** | daño al final de cada turno | 20% | **5** | no | ☠️ Veneno |
| 🧊 **Congelación** | daño, y Movimiento a la mitad; **a 3 pilas, no actúa** | 10% | 3 | **sí (3)** | 🧊 Hielo |
| 🩸 **Sangrado** | daño al final de cada turno, **físico** | 20% | 3 | no | 🩸 Hemorragia |
| 🌑 **Ceguera** | −30 a 🎯 Precisión | — | 2 | no | 🌑 Ceguera |
| 🐌 **Lentitud** | 👢 Movimiento a la mitad, redondeando abajo, **mínimo 1** | — | 2 | no | 🐌 Lentitud |
| 🕸️ **Inmovilización** | 👢 Movimiento a 0, **pero sigue pudiendo actuar** | — | 2 | no | 🕸️ Inmovilización |
| 😵 **Aturdido** | pierde su próximo turno | — | 1 | no | 💫 Aturdimiento · 😱 Miedo |
| 🌀 **Confusión** | su acción va a un objetivo válido **al azar**, no al elegido | — | 1 | no | 🌀 Confusión |

- **"A la mitad" nunca llega a cero.** Con el mínimo en 1, **🕸️ Inmovilización sigue siendo la única que clava a alguien en el sitio**.
- **El veneno se distingue por durar, no por picar más fuerte**: 5 turnos al 20% suman el 100% del Ataque frente al 75% del fuego, y cada tic suyo sigue siendo más flojo. Quien quiera matar ya, quema; quien pueda esperar, envenena.
- **🩸 Sangrado es el único estado de daño físico**: esa es su identidad frente a los tres elementales.

### 5.1 El nudo de "no puede actuar"

Dos entradas producen el efecto, y se distinguen:

- 😵 **Aturdido** — pierde el turno. Le llegan **dos disparadores**: 💫 *Aturdimiento* (al golpear, por crítico) y 😱 *Miedo* (la primera vez que baja de media Vida, una vez por combate). Es un estado con dos puertas, no dos estados.
- 🧊 **Congelación** a pila llena — también impide actuar, pero **además clava el Movimiento y viene acumulando**.

😱 *Inmune al miedo* cierra **el disparador**, no el estado: un personaje inmune al miedo puede quedar Aturdido por un mazazo.

## 6. Inmunidades y resistencias

- **🧪 Inmune a estados alterados cubre solo los de control** —Ceguera, Lentitud, Inmovilización, Aturdido y Confusión— y **no los elementales**. Si cubriera lo elemental, 🔥/☠️/🧊 *Inmune a…* serían redundantes, y lo llevan **21 fichas** de tier alto.
- **Los rasgos *Resistente a…* recortan la duración, no el daño.** El daño ya lo recortan al restar sobre la mitigación elemental (§4.3): el rasgo baja el **daño del golpe** allí y la **duración** aquí.
- **Los rasgos *Inmune a…* impiden la entrada**, no acortan nada.

## 6.1 Quitar un estado antes de tiempo

**Solo hay dos salidas del motor** —que expire, y la tirada de 🍀 Suerte del §2— **y una tercera que vive fuera: las cartas.**

Ninguna Habilidad limpia. En concreto **curar no limpia**: el ✝️ Sacerdote sube Vida y punto, y quitarte un veneno cuesta una carta. La limpieza es una decisión de mazo, con su coste y su momento.

> Lo que deja pendiente es de las cartas: **que exista al menos una carta de limpieza en cada raza**, o el control encadenado no tiene respuesta. Anotado en [cards/README.md](../cards/README.md).

## 7. Ámbito

**Los estados son del tablero de batalla y se limpian al cerrar el combate.** La duración se mide en turnos, y un turno solo significa algo donde hay rondas.

Si algún día se quiere desgaste entre peleas, es una decisión de economía ([game-design.md](../game-design.md) §7): haría falta decir en qué unidad se mide el tiempo en exploración.

## 8. Por definir

- **Todos los números de la §5.** Son primera pasada, sin una sola partida detrás.
- **Si la separación fuego/veneno aguanta.** La tirada de Suerte se come buena parte de la ventaja de durar: 64% contra 74% a Suerte 15, y 58% contra 61% a Suerte 25. Si no basta, la siguiente palanca es **bajar el fuego a 2 turnos**, no volver a subir el veneno.
