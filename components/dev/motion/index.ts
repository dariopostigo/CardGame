// =========================================================================
// El movimiento de V3, por piezas — la puerta única
//
// Un archivo por SECUENCIA, y esa es toda la organización: soltar una carta,
// ofrecer el terreno, andarlo, respirar, pegar y caer. Antes era un archivo solo
// (deploy-motion.ts) más 560 líneas dentro de AnimationBench.tsx, y la
// consecuencia no era estética: no se podía mirar una sola animación sin montar
// la pantalla entera, así que no podía existir un banco por animación.
//
// El catálogo que dice cuáles hay y qué diales mueve cada una vive en
// lib/v3/anim.ts (`ANIMATIONS`), no aquí: es dato, no código de dibujo.
//
//   core     las primitivas: transform, run, sombras, coger, temblar
//   offer    el terreno que se levanta cuando puedes soltar ahí
//   deploy   la carta que vuela, se convierte en ficha y cae
//   step     andar de hexágono en hexágono, con su saltito y su pisada
//   idle     el aliento, y lo que dice que una ficha ya ha andado
//   attack   la embestida y sus tres desenlaces, y la baja
// =========================================================================

export * from "./core";
export * from "./offer";
export * from "./deploy";
export * from "./step";
export * from "./idle";
export * from "./attack";
