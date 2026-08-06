// =========================================================================
// Geometría de los 7 dados de D&D — datos puros, sin Three.js "de escena"
// ni canvas: solo vértices, caras y qué valor lleva cada una.
//
// Referencia: codepen.io/Mant0uStudio/pen/ZYWywJB (dado físico d6 con
// Three.js + cannon-es). Ese pen resuelve el d6 a mano con 6 normales fijas
// (±X, ±Y, ±Z) porque un cubo no tiene otra cosa. Para generalizar a los
// demás dados hacía falta UNA receta que sirviera para cualquier poliedro:
//
//   1. Vértices + triángulos (para tallar la malla Y el sólido de física).
//   2. A qué "cara lógica" pertenece cada triángulo, y su normal canónica
//      (la dirección que se compara contra "arriba" al leer el resultado).
//   3. Qué valor lleva cada cara.
//
// d4/d8/d12/d20 salen de las geometrías de Platón que ya trae Three.js
// (Tetrahedron/Octahedron/Dodecahedron/Icosahedron): se agrupan sus
// triángulos por normal casi-idéntica para recuperar las caras lógicas
// (4/8/12/20 — verificado en Node antes de escribir esto). El d10
// (trapezoedro pentagonal) no viene de fábrica, así que sus vértices están
// a mano más abajo, con los parámetros ya probados para que el sólido sea
// realmente convexo (ver nota en buildD10Base). El d6 es el único que NO
// pasa por este camino: usa RoundedBoxGeometry (bisel) + CANNON.Box, igual
// que el pen original — no tiene sentido triangular un bisel para sacar 6
// caras que ya conocemos de sobra.
// =========================================================================

import * as THREE from "three";
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";

// El d6 (RoundedBoxGeometry, boxSize 2.5) llega con las esquinas a ~2.17 del
// centro. Las geometrías de Platón nativas de Three.js parten de radio 1 —
// la mitad de eso—, así que sin escalar se veían notablemente más pequeñas
// que el d6 de al lado. Un solo factor compartido para los 6 no-d6: más
// grandes y en la misma liga de tamaño que el d6, sin tener que ajustar cada
// uno a mano.
const POLYHEDRON_SCALE = 1.6;

export const DICE_KINDS = ["d4", "d6", "d8", "d10", "d12", "d20", "d100"] as const;
export type DiceKind = (typeof DICE_KINDS)[number];

export const DICE_LABEL: Record<DiceKind, string> = {
  d4: "D4",
  d6: "D6",
  d8: "D8",
  d10: "D10",
  d12: "D12",
  d20: "D20",
  d100: "D100 (decenas)",
};

/** Una cara "lógica" del dado: su dirección canónica y el valor que muestra. */
export type DiceFace = {
  normal: THREE.Vector3;
  /** Lo que se ve/lee en esta cara. d100 usa 0,10,20…90; el resto su número tal cual. */
  value: number;
};

/**
 * Modelo completo de un dado, listo para que dice-scene.ts monte la malla,
 * el sólido de física y lea el resultado. `shape` decide qué constructor de
 * Three.js/cannon-es hace falta; `resultRule` decide cómo leer el resultado
 * una vez el dado está parado.
 */
export type DiceModel = {
  kind: DiceKind;
  shape: "roundedBox" | "polyhedron";
  faces: DiceFace[];
  resultRule: "topFace" | "bottomFaceOppositeVertex";
  /** Radio aproximado del sólido — para separar los dados al lanzarlos y para la cámara. */
  boundingRadius: number;

  // --- Solo shape === "roundedBox" (el d6) ---
  boxSize?: number;
  boxCornerRadius?: number;

  // --- Solo shape === "polyhedron" (todos los demás) ---
  /** Vértices únicos en espacio local, centrados en el origen. */
  vertices?: THREE.Vector3[];
  /** Triángulos como índices de `vertices`; sirven para la malla Y para CANNON.ConvexPolyhedron. */
  triangles?: [number, number, number][];
  /** A qué cara lógica (índice en `faces`) pertenece cada triángulo. */
  triangleFace?: number[];
  /**
   * Solo el d4: no hay "cara de arriba" que leer (un tetraedro apoya una
   * cara entera contra la mesa y el vértice de arriba es el resultado, como
   * en un d4 físico). `faces[i].value` ya es el valor de ese vértice opuesto
   * a la cara `i`; ver resultRule.
   */
};

// -------------------------------------------------------------------------
// Utilidad compartida: agrupar los triángulos de una geometría de Three.js
// en "caras lógicas" por normal casi-idéntica, y pasarla a indexada para
// poder alimentar CANNON.ConvexPolyhedron (vértices únicos + triángulos).
// -------------------------------------------------------------------------

type GroupedPolyhedron = {
  vertices: THREE.Vector3[];
  triangles: [number, number, number][];
  triangleFace: number[];
  faceNormals: THREE.Vector3[];
};

function groupPolyhedronFaces(
  geometry: THREE.BufferGeometry,
  tolerance: number,
): GroupedPolyhedron {
  const nonIndexed = geometry.index ? geometry.toNonIndexed() : geometry;
  nonIndexed.computeVertexNormals();

  const pos = nonIndexed.attributes.position.array;
  const nrm = nonIndexed.attributes.normal.array;
  const triCount = pos.length / 9;

  // Agrupar por normal: cada triángulo de una cara plana comparte la MISMA
  // normal exacta (o casi, en el caso del d10 — ver buildD10Base).
  const faceNormals: THREE.Vector3[] = [];
  const triangleFaceRaw: number[] = new Array(triCount);
  for (let t = 0; t < triCount; t++) {
    const n = new THREE.Vector3(nrm[t * 9], nrm[t * 9 + 1], nrm[t * 9 + 2]);
    let faceIndex = faceNormals.findIndex((f) => f.dot(n) > tolerance);
    if (faceIndex === -1) {
      faceIndex = faceNormals.length;
      faceNormals.push(n);
    }
    triangleFaceRaw[t] = faceIndex;
  }

  // Pasar a indexada (three deduplica vértices coincidentes) para tener la
  // lista de vértices únicos que pide CANNON.ConvexPolyhedron. El orden de
  // los triángulos no cambia, así que triangleFaceRaw se sigue pudiendo usar
  // triángulo a triángulo tal cual.
  //
  // OJO: mergeVertices compara TODOS los atributos a la vez (posición Y
  // normal), y aquí cada triángulo tiene su propia normal de cara plana —
  // así que el mismo vértice físico, compartido por dos caras distintas,
  // tiene normales distintas y nunca se fundiría. Por eso se pasa una
  // geometría reducida a solo posición: lo único que nos interesa fundir.
  const positionOnly = new THREE.BufferGeometry();
  positionOnly.setAttribute("position", nonIndexed.attributes.position.clone());
  const indexed = mergeVertices(positionOnly, 1e-4);
  const indexArr = indexed.index!.array;
  const posArr = indexed.attributes.position.array;

  const vertices: THREE.Vector3[] = [];
  for (let i = 0; i < posArr.length; i += 3) {
    vertices.push(new THREE.Vector3(posArr[i], posArr[i + 1], posArr[i + 2]));
  }

  const triangles: [number, number, number][] = [];
  for (let t = 0; t < triCount; t++) {
    triangles.push([indexArr[t * 3], indexArr[t * 3 + 1], indexArr[t * 3 + 2]]);
  }

  return { vertices, triangles, triangleFace: triangleFaceRaw, faceNormals };
}

/**
 * Reparte valores 1..N por parejas de caras antípodas (dot ≈ −1) sumando
 * N+1 — la convención de toda la vida (d6: 1↔6, d8: 1↔8…). `startValue`
 * cambia para el d10 (0..9, suma 9) y su hermano el d100 (0,10..90).
 */
function assignAntipodalValues(faceNormals: THREE.Vector3[], startValue: number): number[] {
  const n = faceNormals.length;
  const values = new Array<number>(n).fill(-1);
  let next = startValue;
  for (let i = 0; i < n; i++) {
    if (values[i] !== -1) continue;
    const partner = faceNormals.findIndex((f, j) => j !== i && f.dot(faceNormals[i]) < -0.9);
    if (partner === -1) {
      throw new Error(`assignAntipodalValues: la cara ${i} no tiene pareja antípoda`);
    }
    values[i] = next;
    values[partner] = 2 * startValue + (n - 1) - next;
    next++;
  }
  return values;
}

// -------------------------------------------------------------------------
// d4 — tetraedro. Único caso especial: no lee la cara de arriba, lee el
// VÉRTICE de arriba (como un d4 físico, que se apoya sobre una cara entera
// y el resultado es la esquina que queda apuntando al techo). Cada cara
// lógica es opuesta a exactamente un vértice —un tetraedro no tiene caras
// antípodas—, así que `faces[i].value` es el valor de ESE vértice.
// -------------------------------------------------------------------------

function buildD4(): DiceModel {
  const geometry = new THREE.TetrahedronGeometry(POLYHEDRON_SCALE, 0);
  const grouped = groupPolyhedronFaces(geometry, 0.9999);
  // 4 vértices, 4 caras: cada cara usa 3 de los 4 vértices. El "opuesto" es
  // el único índice de vértice que no aparece en ninguno de sus triángulos.
  const oppositeVertex = grouped.faceNormals.map((_, faceIndex) => {
    const used = new Set<number>();
    grouped.triangles.forEach((tri, t) => {
      if (grouped.triangleFace[t] === faceIndex) tri.forEach((v) => used.add(v));
    });
    const opposite = [0, 1, 2, 3].find((v) => !used.has(v));
    if (opposite === undefined) throw new Error("buildD4: no se encontró el vértice opuesto");
    return opposite;
  });
  // Valor por vértice: cualquier asignación 1..4 sirve, no hay convención de
  // "suma de opuestos" en un tetraedro.
  const vertexValue = [1, 2, 3, 4];

  return {
    kind: "d4",
    shape: "polyhedron",
    resultRule: "bottomFaceOppositeVertex",
    boundingRadius: Math.sqrt(3) * 0.6 * POLYHEDRON_SCALE,
    vertices: grouped.vertices,
    triangles: grouped.triangles,
    triangleFace: grouped.triangleFace,
    faces: grouped.faceNormals.map((normal, i) => ({
      normal,
      value: vertexValue[oppositeVertex[i]],
    })),
  };
}

// -------------------------------------------------------------------------
// d6 — el del pen original. RoundedBoxGeometry para el bisel; el sólido de
// física es una caja simple (CANNON.Box), no el bisel — no hace falta un
// hull convexo fino para algo que rueda como un cubo. El orden de caras
// [+X,−X,+Y,−Y,+Z,−Z] es el de los grupos de material de BoxGeometry
// (comprobado: ver comentario en dice-scene.ts).
// -------------------------------------------------------------------------

function buildD6(): DiceModel {
  const axisNormals = [
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0, -1, 0),
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(0, 0, -1),
  ];
  const values = [1, 6, 2, 5, 3, 4]; // pares opuestos sumando 7, igual que el pen
  return {
    kind: "d6",
    shape: "roundedBox",
    resultRule: "topFace",
    boundingRadius: Math.sqrt(3) * 0.5 * 2.5,
    boxSize: 2.5,
    boxCornerRadius: 0.4,
    faces: axisNormals.map((normal, i) => ({ normal, value: values[i] })),
  };
}

// -------------------------------------------------------------------------
// d8 / d12 / d20 — geometrías de Platón nativas de Three.js. Ninguna tiene
// bisel ni caras curvas, así que agrupar por normal casi-idéntica (tolerancia
// muy estricta) recupera exactamente 8/12/20 caras lógicas — verificado en
// Node antes de escribir este módulo.
// -------------------------------------------------------------------------

function buildPlatonic(kind: DiceKind, geometry: THREE.BufferGeometry, radius: number): DiceModel {
  const grouped = groupPolyhedronFaces(geometry, 0.9999);
  const values = assignAntipodalValues(grouped.faceNormals, 1);
  return {
    kind,
    shape: "polyhedron",
    resultRule: "topFace",
    boundingRadius: radius,
    vertices: grouped.vertices,
    triangles: grouped.triangles,
    triangleFace: grouped.triangleFace,
    faces: grouped.faceNormals.map((normal, i) => ({ normal, value: values[i] })),
  };
}

// -------------------------------------------------------------------------
// d10 / d100 — trapezoedro pentagonal, no viene en Three.js. 12 vértices (2
// polos + un anillo en zigzag de 10) y 10 caras "cometa" trianguladas en 2
// cada una.
//
// Los parámetros (altura de polo 1.75, amplitud de zigzag 0.02, radio del
// anillo 1) NO son arbitrarios, y hay DOS condiciones de convexidad
// distintas que cumplir a la vez — no solo una:
//
//   1. El SÓLIDO entero es convexo por encima de cierta altura de polo para
//      cada amplitud de zigzag (por debajo, el anillo "se sale" del casco
//      convexo que forman los triángulos vecinos).
//   2. Cada CARA "cometa" (sus 2 triángulos, desplegados en 2D conservando
//      distancias reales — lo mismo que hace flattenFace en dice-scene.ts)
//      tiene que salir convexa ella sola, y no solo "técnicamente" convexa
//      sino con margen de verdad: el vértice del anillo más cercano tiene
//      que sobresalir con claridad más allá de la cuerda entre sus dos
//      vecinos lejanos. Un margen casi cero (probado con altura 1.8,
//      amplitud 0.05: convexo, pero por los pelos) se sigue viendo como un
//      dardo fino en vez de una cometa — el número dibujado encima sale
//      retorcido igual, sin que ningún arreglo de UV o de redondeado en
//      dice-scene.ts pueda compensarlo. Con amplitud de zigzag alta (se
//      probó con la 0.15 original) la condición 2 no se cumple para
//      NINGUNA altura de polo razonable: el problema es la forma en sí, no
//      cómo se pinta.
//
// Se barrió por código: cuanto más BAJO el polo (dentro de lo que la
// condición 1 permite) y más PEQUEÑO el zigzag, más sobresale ese vértice
// — pero incluso en el mejor caso (zigzag→0, altura justo en el mínimo
// convexo) el sobresaliente tiene un techo matemático de ~el 16% de la
// anchura de la cometa; no hay combinación de estos parámetros que dé un
// rombo "regordete". Con amplitud 0.02 el sólido es convexo desde altura
// ≈1.64; 1.75 deja margen y el sobresaliente queda en ~12%, suficiente para
// que la cometa se vea como cometa y no como dardo. La proporción final en
// pantalla (más corto/más ancho) se ajusta con una escala nada más
// construir la malla, en dice-scene.ts — escalar un sólido convexo no le
// quita la convexidad, y tampoco cambia si cada cara es convexa o no (es
// una propiedad de proporciones, no de tamaño).
// -------------------------------------------------------------------------

function buildD10Base(): GroupedPolyhedron {
  const APEX = 1.75 * POLYHEDRON_SCALE;
  const RING_Z = 0.02 * POLYHEDRON_SCALE;
  const RING_RADIUS = 1 * POLYHEDRON_SCALE;
  const RING_START = 2;

  const vertices: THREE.Vector3[] = [
    new THREE.Vector3(0, 0, APEX), // 0: polo norte
    new THREE.Vector3(0, 0, -APEX), // 1: polo sur
  ];
  for (let i = 0; i < 10; i++) {
    const angle = (i * Math.PI * 2) / 10;
    const z = i % 2 === 0 ? RING_Z : -RING_Z;
    vertices.push(new THREE.Vector3(RING_RADIUS * Math.cos(angle), RING_RADIUS * Math.sin(angle), z));
  }
  const ring = (i: number) => RING_START + ((i + 10) % 10);

  // 10 "cometas": la de índice k está pegada al polo más cercano de su
  // vértice "cercano" (ring[k]) y usa los dos vecinos del anillo como
  // vértices "lejanos" — ver el barrido de convexidad arriba.
  const triangles: [number, number, number][] = [];
  const triangleFace: number[] = [];
  const faceNormals: THREE.Vector3[] = [];

  for (let k = 0; k < 10; k++) {
    const pole = k % 2 === 0 ? 0 : 1;
    const near = ring(k);
    const far1 = ring(k - 1);
    const far2 = ring(k + 1);

    const kiteTriangles: [number, number, number][] = [
      [pole, far1, near],
      [pole, near, far2],
    ];

    const centroid = vertices[pole]
      .clone()
      .add(vertices[far1])
      .add(vertices[near])
      .add(vertices[far2])
      .divideScalar(4);
    // La normal canónica de la cara (para leer resultado) es la dirección
    // del centro de la cometa, no la de un triángulo suelto: los dos
    // triángulos de una misma cometa no son EXACTAMENTE coplanares (por
    // eso el resto del módulo agrupa por tolerancia relajada), y usar el
    // centro evita que ese pequeño pliegue sesgue la lectura del resultado.
    const faceNormal = centroid.clone().normalize();
    const faceIndex = faceNormals.length;
    faceNormals.push(faceNormal);

    for (const tri of kiteTriangles) {
      const [a, b, c] = tri.map((idx) => vertices[idx]);
      const triCentroid = a.clone().add(b).add(c).divideScalar(3);
      const normal = new THREE.Vector3()
        .subVectors(b, a)
        .cross(new THREE.Vector3().subVectors(c, a))
        .normalize();
      const ordered: [number, number, number] =
        normal.dot(triCentroid) < 0 ? [tri[0], tri[2], tri[1]] : tri;
      triangles.push(ordered);
      triangleFace.push(faceIndex);
    }
  }

  return { vertices, triangles, triangleFace, faceNormals };
}

function buildD10(): DiceModel {
  const base = buildD10Base();
  const values = assignAntipodalValues(base.faceNormals, 0); // 0..9, opuestas suman 9
  return {
    kind: "d10",
    shape: "polyhedron",
    resultRule: "topFace",
    boundingRadius: 1.75 * POLYHEDRON_SCALE,
    vertices: base.vertices,
    triangles: base.triangles,
    triangleFace: base.triangleFace,
    faces: base.faceNormals.map((normal, i) => ({ normal, value: values[i] })),
  };
}

function buildD100(): DiceModel {
  // Mismo sólido que el d10 (en la mesa se tira EMPAREJADO con un d10 de
  // unidades para sacar 00-99): lo único que cambia es que cada cara
  // muestra decenas (0,10,20…90) en vez de unidades.
  const d10 = buildD10();
  return {
    ...d10,
    kind: "d100",
    faces: d10.faces.map((f) => ({ normal: f.normal, value: f.value * 10 })),
  };
}

// -------------------------------------------------------------------------

export function buildDiceModel(kind: DiceKind): DiceModel {
  switch (kind) {
    case "d4":
      return buildD4();
    case "d6":
      return buildD6();
    case "d8":
      return buildPlatonic("d8", new THREE.OctahedronGeometry(POLYHEDRON_SCALE, 0), POLYHEDRON_SCALE);
    case "d10":
      return buildD10();
    case "d12":
      return buildPlatonic("d12", new THREE.DodecahedronGeometry(POLYHEDRON_SCALE, 0), POLYHEDRON_SCALE);
    case "d20":
      return buildPlatonic("d20", new THREE.IcosahedronGeometry(POLYHEDRON_SCALE, 0), POLYHEDRON_SCALE);
    case "d100":
      return buildD100();
  }
}
