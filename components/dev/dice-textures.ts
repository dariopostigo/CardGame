// =========================================================================
// Texturas de cara de dado: un <canvas> pintado por código, no una imagen.
// El d6 lleva los puntos clásicos (calco del pen de referencia); el resto
// —d4/d8/d10/d12/d20/d100, que no tienen convención de "puntos"— llevan el
// número grande y centrado, como los dados numéricos de mesa de verdad.
//
// Colores de arte del propio dado (no son tokens de la wiki: es la piel del
// objeto 3D, igual que la paleta del pen de referencia).
// =========================================================================

import * as THREE from "three";

export const DICE_PALETTE = [
  "#EAA14D",
  "#E05A47",
  "#4D9BEA",
  "#5FB376",
  "#D869A8",
  "#F2C94C",
  "#9B51E0",
  "#FFFFFF",
] as const;

const INK_DARK = "#331e18";
const INK_ONE_AND_FOUR = "#E03E3E"; // el 1 y el 4 en rojo, como en un d6 de toda la vida
const INK_LIGHT = "#FFFFFF";

/** Luminancia relativa aproximada: decide si un color de fondo pide tinta clara u oscura. */
function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

function makeCanvas(size: number): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo crear el contexto 2D para la textura del dado");
  return { canvas, ctx };
}

/** Los 6 puntos del d6, tal cual el pen de referencia. */
export function createPipTexture(value: number, colorHex: string): THREE.CanvasTexture {
  const size = 256;
  const { canvas, ctx } = makeCanvas(size);

  ctx.fillStyle = colorHex;
  ctx.fillRect(0, 0, size, size);

  const isTraditional = colorHex === "#FFFFFF";
  let dotColor = INK_LIGHT;
  if (isTraditional) {
    dotColor = value === 1 || value === 4 ? INK_ONE_AND_FOUR : INK_DARK;
  } else if (isLightColor(colorHex)) {
    dotColor = INK_DARK;
  }
  ctx.fillStyle = dotColor;

  const dotSize = size / 5;
  const currentDotSize = isTraditional && value === 1 ? dotSize * 1.5 : dotSize;
  const center = size / 2;
  const q1 = size / 4;
  const q3 = (size * 3) / 4;

  const drawDot = (x: number, y: number) => {
    ctx.beginPath();
    ctx.arc(x, y, currentDotSize / 2, 0, Math.PI * 2);
    ctx.fill();
  };

  if (value === 1) drawDot(center, center);
  else if (value === 2) {
    drawDot(q1, q1);
    drawDot(q3, q3);
  } else if (value === 3) {
    drawDot(q1, q1);
    drawDot(center, center);
    drawDot(q3, q3);
  } else if (value === 4) {
    drawDot(q1, q1);
    drawDot(q3, q1);
    drawDot(q1, q3);
    drawDot(q3, q3);
  } else if (value === 5) {
    drawDot(q1, q1);
    drawDot(center, center);
    drawDot(q1, q3);
    drawDot(q3, q3);
    drawDot(q3, q1);
  } else if (value === 6) {
    drawDot(q1, q1);
    drawDot(q3, q1);
    drawDot(q1, center);
    drawDot(q3, center);
    drawDot(q1, q3);
    drawDot(q3, q3);
  }

  return new THREE.CanvasTexture(canvas);
}

/**
 * Número grande y centrado, para todo dado que no sea el d6. `label` ya
 * viene formateado (p. ej. "00" para la decena 0 del d100), esta función
 * solo lo dibuja.
 */
export function createNumeralTexture(
  label: string,
  colorHex: string,
  fontScale: number = 1,
): THREE.CanvasTexture {
  const size = 256;
  const { canvas, ctx } = makeCanvas(size);

  ctx.fillStyle = colorHex;
  ctx.fillRect(0, 0, size, size);

  ctx.fillStyle = isLightColor(colorHex) ? INK_DARK : INK_LIGHT;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  // Un único tamaño base para TODAS las etiquetas, sin importar cuántos
  // caracteres tengan: en un d20, por ejemplo, "1" y "20" viven en caras
  // distintas del mismo dado y tienen que leerse con el mismo peso visual.
  // Escalar el "1" para que ocupe más porque tiene menos caracteres se ve
  // como si cada cara tuviera su propia fuente. El tamaño fijo es el que ya
  // cabía de sobra para dos caracteres ("00".."90" del d100); un solo
  // carácter simplemente deja más margen alrededor, no crece para llenarlo.
  // `fontScale` es lo único que puede variar, y por dado entero (todas sus
  // caras a la vez) según lo pequeñas/estrechas que sean sus caras — nunca
  // por cuántos caracteres tenga cada etiqueta.
  const fontSize = size * 0.34 * fontScale;
  ctx.font = `800 ${fontSize}px system-ui, sans-serif`;
  ctx.fillText(label, size / 2, size / 2 + fontSize * 0.04);

  return new THREE.CanvasTexture(canvas);
}

/** "0" del d10 se lee como unidad; la misma cara en el d100 es la decena "00","10"…"90". */
export function formatDiceValueLabel(kind: "d100" | string, value: number): string {
  if (kind === "d100") return String(value).padStart(2, "0");
  return String(value);
}
