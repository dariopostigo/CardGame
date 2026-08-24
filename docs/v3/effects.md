# Efectos y estados — V3

> **Escrito el 22 de agosto de 2026**, sobre el motor de [game-design.md](game-design.md) §4. Los porcentajes y duraciones son diales de primera pasada: **nada está balanceado todavía**.

Un **estado** es un efecto temporal que se aplica y se quita. No confundir con una **Característica**, que es un rasgo permanente de la ficha y vive en [razas.md](razas.md): 🔥 *Fuego* es la Característica que aplica **Quemadura**, y Quemadura es el estado.

Nada se hereda de [v2](../v2/): su catálogo estaba escrito en términos que aquí no existen ("salvación SAB", "+1d4 a la tirada", "+X a la CA"). No hay traducción mecánica posible.

## 1. Cómo entra un estado

Lo fija el motor ([game-design.md](game-design.md) §4.5) y depende de la familia:

- **Elementales — siempre.** Si el golpe impacta, el estado entra. Un dragón que a veces no quema se sentiría roto.
- **De control — los aplica el crítico** *(fijado el 23 de agosto de 2026)*. El umbral es 🍀 Suerte, el que ya existe: si llevas 💫 Aturdimiento o 🌀 Confusión, tu crítico además controla. Un golpe sólido es el que aturde, ahora también en la letra.

No hay tirada aparte para aplicar un estado, ni umbral propio por rasgo. **La tirada es la del ataque y los umbrales son los dos que ya había.** Por eso 🍀 Suerte tiene tope 25 ([game-design.md](game-design.md) §4.1): controla dos cosas a la vez y sin techo se desbocarían juntas.

## 2. Duración y expiración

Cada estado tiene una **duración base fija**, en turnos. Y encima, 🍀 Suerte da una salida temprana:

```
Al final del turno del afectado:
    R = tirada oculta 1..100
    R ≤ 🍀 Suerte  → el estado se cae YA
    si no          → contador − 1
```

**Por qué Suerte.** Está definida en [razas.md](razas.md) como *"probabilidad de golpes críticos o efectos favorables"*, y esa segunda mitad no se usaba en ninguna parte. Esto es lo que era. No rompe el principio de *una Habilidad, un trabajo* (§4.1): Suerte es "la tirada te sonríe", en ataque y en defensa — la misma cosa desde los dos lados.

**En los estados de 1 turno la tirada no hace nada, y está bien**: cuando llega el final de tu turno, Aturdido ya se cobró. No hace falta excepción.

**Consecuencia a vigilar:** esta tirada castiga las duraciones largas más de lo que parece, porque son más oportunidades de librarse. Con Suerte 15, un estado de 5 turnos dura 3,7 de media, uno de 4 dura 3,2 y uno de 3 dura 2,6. Cualquier dial de duración hay que leerlo con eso puesto.

**Y se aprieta según sube 🍀 Suerte, que ahora llega hasta 25.** Contra una ficha de Suerte 25, ese estado de 5 turnos dura 3,0 y el de 3 dura 2,3 — las duraciones largas pierden casi toda su ventaja justo contra los objetivos afortunados. **Es lo primero que hay que medir en el primer balance:** el reparto fuego/veneno se decidió sobre los totales nominales (75% contra 100%), pero los reales son 64% contra 74% a Suerte 15, y 58% contra 61% a Suerte 25. La separación existe, pero es más fina de lo que dicen los números de la tabla.

## 3. Daño por turno

Los estados que hacen daño lo aplican **al final de cada turno del afectado**:

```
daño = % del ⚔️ Ataque de QUIEN LO APLICÓ
       reducido por lo mismo que el golpe que lo puso (§4.3)
```

**Por qué cuelga del Ataque del que lo aplicó** y no de un valor fijo ni de la Vida de la víctima: el §4.2 dejó solo dos Habilidades creciendo con el tier (Vida y Ataque). Si el daño del estado cuelga del Ataque, **ningún estado necesita su propia tabla de balance por tier** — la Quemadura de un dragón pega como un dragón sin que nadie escriba un número más. Con 132 fichas eso no es elegancia, es viabilidad.

**Y arrastra la mitigación del golpe**, lo que significa que Quemadura, Envenenamiento y Congelación los frena 🔮 Resistencia mágica —lo elemental pasa por ahí, sea cual sea el [tipo de daño](razas.md#-tipo-de-daño) de la ficha—, mientras que Sangrado, que es físico, lo frena 🛡️ Defensa.

## 4. Acumulación

Tres reglas, y solo una excepción:

| Familia | Al reaplicarse |
|---|---|
| Estados de daño | **No acumulan**: refrescan la duración a tope |
| Estados de control | **No acumulan**: estás o no estás |
| 🧊 **Congelación** | **Acumula pilas.** A pila llena, el objetivo no actúa |

Congelación es la única que apila porque es la única cuyo texto lo pedía (*"al acumularse, impide que el objetivo actúe"*). Un sistema general de pilas para diez estados sería mucho más maquinaria de la que el juego necesita.

## 5. El catálogo

**Nueve estados.** 😱 Miedo no está en la lista porque no es un estado: es un **disparador** de Aturdido (ver §5.1).

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

**"A la mitad" nunca llega a cero** *(23 de agosto de 2026)*. 👢 Movimiento es un entero pequeño, así que la mitad de 1 sería 0 y tanto 🐌 Lentitud como 🧊 Congelación se convertirían en una 🕸️ Inmovilización encubierta contra cualquier ficha lenta. Con el mínimo en 1, **🕸️ Inmovilización sigue siendo la única que clava a alguien en el sitio** y cada estado conserva su trabajo.

**El veneno dura 5 turnos, no 4** *(misma fecha)*. Con 4 turnos, 🔥 Quemadura (25%×3 = 75%) y ☠️ Envenenamiento (20%×4 = 80%) hacían prácticamente lo mismo, y el fuego lo cobraba antes, que en combate es mejor: el veneno no tenía ninguna razón para existir. A 5 turnos suma **100% del Ataque** frente al 75% del fuego, y los dos quedan separados por lo que de verdad los distingue —**el veneno se distingue por durar, no por picar más fuerte**; cada tic suyo sigue siendo más flojo—. Quien quiera matar ya, quema; quien pueda esperar, envenena. Y no es gratis: cinco turnos es tiempo de sobra para que el combate acabe antes de cobrarlos todos.

**🩸 Sangrado es nombre nuevo.** La Característica 🩸 *Hemorragia* era la única del catálogo que aplicaba un efecto sin nombre; ahora sigue el patrón de las otras (🔥 Fuego→Quemadura, 💫 Aturdimiento→Aturdido). Y es el **único estado de daño físico**: esa es su identidad frente a los tres elementales.

### 5.1 El nudo de "no puede actuar", deshecho

Había **tres** entradas produciendo el mismo efecto. Quedan dos, y se distinguen:

- 😵 **Aturdido** — pierde el turno. Le llegan **dos disparadores**: ⚡ *Aturdimiento* (al golpear, con umbral) y 😱 *Miedo* (la primera vez que baja de media Vida, una vez por combate). Los textos decían lo mismo —*"pierde su próximo turno"* y *"quedar paralizado durante 1 turno"*—, así que es un estado con dos puertas, no dos estados.
- 🧊 **Congelación** a pila llena — también impide actuar, pero **además clava el Movimiento y viene acumulando**. Eso la hace distinta de verdad, no un sinónimo.

😱 *Inmune al miedo* sigue significando algo preciso: cierra **el disparador de Miedo**, no el estado. Un personaje inmune al miedo puede quedar Aturdido por un mazazo.

## 6. Inmunidades y resistencias

**🧪 Inmune a estados alterados cubre solo los de control** — Ceguera, Lentitud, Inmovilización, Aturdido y Confusión — y **no los elementales**: Quemadura, Envenenamiento, Congelación y Sangrado sí le entran.

El motivo no es de gusto. Ya existen 🔥 *Inmune al fuego*, ☠️ *Inmune al veneno* y 🧊 *Inmune al frío* como rasgos propios; si el genérico cubriera también lo elemental, esos tres serían redundantes. Y **lo llevan 21 fichas**, casi todas de tier alto: en la versión amplia, el ⚙️ Coloso mecánico y el 🐙 Kraken ancestral serían inmunes a media mitad del juego.

**Los rasgos *Resistente a…* recortan la duración, no el daño.** El daño ya lo recortan al restar sobre la mitigación elemental (§4.3), así que si además tocaran el tic estarían reduciendo dos veces lo mismo. Reparto: el rasgo baja el **daño del golpe** allí, y baja la **duración del estado** aquí.

**Los rasgos *Inmune a…* impiden la entrada**, no acortan nada.

## 6.1 Quitar un estado antes de tiempo

**Solo hay dos salidas del motor —que expire, y la tirada de 🍀 Suerte del §2— y una tercera que vive fuera: las cartas** *(decidido el 23 de agosto de 2026)*.

Ninguna Habilidad limpia. En concreto, **curar no limpia**: el ✝️ Sacerdote sube Vida y punto, y quitarte un veneno cuesta una carta. Se descartó atarlo a la curación —que le habría dado a la clase de apoyo un segundo trabajo— para no meter una regla nueva en el motor por algo que la economía de cartas ya sabe hacer: la limpieza es una decisión de mazo, con su coste y su momento, y no un efecto secundario gratis de algo que ya ibas a hacer.

Lo que esto deja pendiente no es de este documento sino de las cartas: **que exista al menos una carta de limpieza** en cada raza, o el control encadenado no tiene respuesta. Anotado en [cards/README.md](cards/README.md).

## 7. Ámbito

**Los estados son del tablero de batalla y se limpian al cerrar el combate.** La duración se mide en turnos, y un turno solo significa algo donde hay rondas de combate.

Si el diseño acaba queriendo desgaste entre peleas —salir de una batalla envenenado—, eso es una decisión de economía ([game-design.md](game-design.md) §7), no de este documento: haría falta decir en qué unidad se mide el tiempo en exploración.

## 8. Por definir

- **Todos los números de la §5.** Son primera pasada, sin una sola partida detrás.
- **Si la separación fuego/veneno aguanta.** El dial se movió el 23 de agosto —el veneno pasó a 5 turnos— pero la tirada de Suerte se come buena parte de la ventaja de durar (§2): 64% contra 74% a Suerte 15, y 58% contra 61% a Suerte 25. Si al medirlo resulta que no basta, la siguiente palanca es bajar el fuego a 2 turnos, no volver a subir el veneno.
