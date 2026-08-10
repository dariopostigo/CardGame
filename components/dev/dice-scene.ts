// =========================================================================
// Motor de escena de la tirada de dados: Three.js (render) + cannon-es
// (física real) montados a mano sobre un <canvas>, sin React de por medio
// —el mismo patrón imperativo que ya usa fog-wisp.ts/BoardFog.tsx para su
// lienzo 2D, aquí aplicado a WebGL. Calco funcional del pen de referencia
// (codepen.io/Mant0uStudio/pen/ZYWywJB): arrastrar agarra los dados, soltar
// los lanza, y el resultado sale de qué normal de cara mira más hacia arriba
// una vez parados — no de leer ningún píxel ni de animar un valor.
//
// Generalizado a los 7 tipos vía dice-geometry.ts: lo único que cambia por
// tipo es qué malla/sólido de física se construye (buildDieVisual) y con
// qué regla se lee el resultado (topFace o, solo el d4, la cara de ABAJO
// leyendo el valor de su vértice opuesto — ver DiceModel.resultRule).
//
// Este motor no toca lib/rules/: es un banco de pruebas de la TÉCNICA
// visual, no la fuente de verdad de ninguna tirada de partida todavía. Esa
// es una decisión de arquitectura para cuando (si) los dados sustituyan a
// lib/rules/rng.ts, no algo que este laboratorio deba resolver.
// =========================================================================

import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";
import * as CANNON from "cannon-es";
import { buildDiceModel, type DiceKind, type DiceModel } from "./dice-geometry";
import { createNumeralTexture, createPipTexture, formatDiceValueLabel, DICE_PALETTE } from "./dice-textures";

const FRUSTUM_SIZE = 15;
const TRAY_HALF_SIZE = 7;
const SAFE_LIMIT = TRAY_HALF_SIZE - 3; // margen antes de la pared, como en el pen

export type DiceRollResult = { total: number; rolls: number[] };

export type DiceSceneCallbacks = {
  onResult?: (result: DiceRollResult) => void;
  onRollStart?: () => void;
};

export type DiceSceneHandle = {
  setDice: (kind: DiceKind, count: number) => void;
  throwDice: () => void;
  destroy: () => void;
};

type DieInstance = {
  model: DiceModel;
  mesh: THREE.Mesh;
  outline: THREE.Mesh;
  shadow: THREE.Mesh;
  body: CANNON.Body;
  spinOffset: number;
  isReturning: boolean;
};

// -------------------------------------------------------------------------
// Construcción de malla + UV + redondeado — pura, sin nada de "escena" (ni
// canvas, ni cannon world): a nivel de módulo en vez de dentro de
// mountDiceScene para poder reutilizarla también desde un arnés de
// depuración (cámara mirando derecho a una sola cara) sin duplicar la
// lógica. Ver buildPolyhedronVisual/buildBoxVisual más abajo.
// -------------------------------------------------------------------------

/**
 * Despliega en 2D los triángulos de UNA cara lógica conservando sus
 * distancias 3D reales (como desplegar un papel plegado, triángulo a
 * triángulo, en vez de aplastarlo de golpe con una única proyección
 * ortogonal). Para una cara ya plana (d4/d8/d12/d20) da exactamente lo
 * mismo que proyectar; para el d10, cuya cara "cometa" son 2 triángulos
 * NO del todo coplanares (ver buildD10Base en dice-geometry.ts), evita el
 * cizallamiento que salía al forzar ambos triángulos sobre UN plano
 * único — el número queda legible en vez de verse estirado/emborronado
 * hacia el pliegue central.
 */
export function flattenFace(triIndices: [number, number, number][], vertices: THREE.Vector3[]): Map<number, [number, number]> {
  const dist = (a: number, b: number) => vertices[a].distanceTo(vertices[b]);
  const placed = new Map<number, [number, number]>();

  const [a0, b0, c0] = triIndices[0];
  placed.set(a0, [0, 0]);
  const ab = dist(a0, b0);
  placed.set(b0, [ab, 0]);
  const ac = dist(a0, c0);
  const bc = dist(b0, c0);
  const cx = (ac * ac - bc * bc + ab * ab) / (2 * ab);
  const cy = Math.sqrt(Math.max(0, ac * ac - cx * cx));
  placed.set(c0, [cx, cy]);

  const centroidSoFar = (): [number, number] => {
    const pts = [...placed.values()];
    return [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];
  };

  const pending = triIndices.slice(1);
  let guard = 0;
  while (pending.length > 0 && guard++ < 50) {
    for (let i = 0; i < pending.length; i++) {
      const tri = pending[i];
      const known = tri.filter((v) => placed.has(v));
      const unknown = tri.filter((v) => !placed.has(v));
      if (known.length !== 2 || unknown.length !== 1) continue;

      const [p, q] = known;
      const [px, py] = placed.get(p)!;
      const [qx, qy] = placed.get(q)!;
      const pq = Math.hypot(qx - px, qy - py);
      const r = unknown[0];
      const pr = dist(p, r);
      const qr = dist(q, r);
      const t = (pr * pr - qr * qr + pq * pq) / (2 * pq);
      const h = Math.sqrt(Math.max(0, pr * pr - t * t));
      const dirX = (qx - px) / pq;
      const dirY = (qy - py) / pq;
      const baseX = px + dirX * t;
      const baseY = py + dirY * t;
      const perpX = -dirY;
      const perpY = dirX;

      const candidateA: [number, number] = [baseX + perpX * h, baseY + perpY * h];
      const candidateB: [number, number] = [baseX - perpX * h, baseY - perpY * h];
      // El lado correcto es el que ALEJA la cara del centro ya trazado —
      // así el abanico de triángulos se abre hacia fuera en vez de
      // plegarse otra vez sobre sí mismo.
      const [ccx, ccy] = centroidSoFar();
      const farther =
        Math.hypot(candidateA[0] - ccx, candidateA[1] - ccy) > Math.hypot(candidateB[0] - ccx, candidateB[1] - ccy)
          ? candidateA
          : candidateB;
      placed.set(r, farther);
      pending.splice(i, 1);
      i--;
    }
  }
  return placed;
}

/**
 * Rejilla de coordenadas baricéntricas para subdividir un triángulo en
 * `divisions`² triángulos pequeños — es lo que permite redondear: sin
 * subdividir, un triángulo solo tiene información en sus 3 esquinas y no
 * hay nada que abombar entre medias.
 */
function subdivideBarycentric(divisions: number): [number, number, number][][] {
  const at = (i: number, j: number): [number, number, number] => [
    1 - i / divisions - j / divisions,
    i / divisions,
    j / divisions,
  ];
  const tris: [number, number, number][][] = [];
  for (let i = 0; i < divisions; i++) {
    for (let j = 0; j < divisions - i; j++) {
      tris.push([at(i, j), at(i + 1, j), at(i, j + 1)]);
      if (i + j + 1 < divisions) tris.push([at(i + 1, j), at(i + 1, j + 1), at(i, j + 1)]);
    }
  }
  return tris;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/**
 * Centroide de área de una cara ya desplegada en 2D (media de los
 * centroides de sus triángulos, ponderada por área). El número se dibuja
 * centrado en su textura cuadrada, así que si se centra el UV en el punto
 * medio del BOUNDING BOX en vez de en el centroide real, queda descuadrado
 * en cualquier cara que no sea simétrica en las 4 direcciones —o sea,
 * todas menos el cuadrado del d6—: un triángulo, un pentágono o la
 * "cometa" del d10 tienen su centroide bastante más abajo (o desplazado)
 * que el centro de su caja envolvente.
 */
export function faceCentroid2D(triIndices: [number, number, number][], flat: Map<number, [number, number]>): [number, number] {
  let areaSum = 0;
  let cxSum = 0;
  let cySum = 0;
  for (const [a, b, c] of triIndices) {
    const [ax, ay] = flat.get(a)!;
    const [bx, by] = flat.get(b)!;
    const [cx, cy] = flat.get(c)!;
    const area = Math.abs((bx - ax) * (cy - ay) - (cx - ax) * (by - ay)) / 2;
    areaSum += area;
    cxSum += ((ax + bx + cx) / 3) * area;
    cySum += ((ay + by + cy) / 3) * area;
  }
  return [cxSum / areaSum, cySum / areaSum];
}

/**
 * Qué aristas de cada triángulo ORIGINAL son el borde real de su cara
 * lógica y cuáles son una costura interna —dos triángulos de la MISMA
 * cara, como el pliegue central de la "cometa" del d10 o el abanico del
 * pentágono del d12—: una arista es interna si otro triángulo de la misma
 * cara comparte sus dos vértices. Redondear también hacia la costura
 * interna dejaba una cresta partiendo la cara en dos por la mitad; el
 * abombado solo debe ir hacia el contorno de verdad.
 */
export function classifyFaceEdges(triIndices: [number, number, number][]): [boolean, boolean, boolean][] {
  const key = (i: number, j: number) => (i < j ? `${i}_${j}` : `${j}_${i}`);
  const edgeCount = new Map<string, number>();
  for (const [a, b, c] of triIndices) {
    for (const [x, y] of [
      [a, b],
      [b, c],
      [c, a],
    ] as [number, number][]) {
      edgeCount.set(key(x, y), (edgeCount.get(key(x, y)) ?? 0) + 1);
    }
  }
  return triIndices.map(([a, b, c]) => [
    edgeCount.get(key(b, c)) === 1, // arista opuesta a `a`
    edgeCount.get(key(c, a)) === 1, // arista opuesta a `b`
    edgeCount.get(key(a, b)) === 1, // arista opuesta a `c`
  ]);
}

const ROUND_SUBDIVISIONS = 6;
// Cuánto se HUNDE una cara hacia el centro del dado cerca de su borde real,
// en fracción de su propio radio — no hacia una esfera común (el d10 no la
// tiene: el polo y el anillo están a distancias distintas del centro), sino
// radialmente desde el propio centro del dado, así que vale igual para
// cualquier forma. 0 en el centro de cada triángulo (la cara se queda
// PLANA ahí), máximo en sus aristas.
//
// El signo importa: un bisel de verdad (como el RoundedBoxGeometry del d6)
// deja la cara plana en el medio y RECOGE el borde hacia dentro para
// fundirse con la cara vecina — nunca lo empuja más allá del plano de la
// cara. Empujarlo hacia fuera (lo que había antes) deja el borde como un
// reborde hinchado y, en contraste, el centro de la cara —que no se toca—
// se ve hundido: la cara entera parece un cuenco en vez de un plano con
// las aristas suavizadas.
// Con ROUND_SUBDIVISIONS=6 el paso de la rejilla (1/6≈0.167) ya es mayor
// que ROUND_MARGIN (0.13): NINGÚN punto de la rejilla cae en ese rango
// intermedio, así que en la práctica esto no es un degradado sino un
// escalón — solo la fila exacta sobre el borde real (edgeDist=0) se hunde;
// el resto de la cara queda intacta (comprobado imprimiendo edgeDist por
// vértice). Por eso este valor tiene que ser pequeño: con 0.09 ese escalón
// era tan pronunciado, y las normales soldadas lo suavizaban tanto al
// iluminarlo, que las caras pequeñas (d8/d12/d20, con más aristas por
// área) dejaban de leerse como planas y el dado entero parecía una bola
// —justo el bug reportado—. Verificado a ojo en /dev/dice: por debajo de
// ~0.03 el escalón se lee como un bisel sutil sin comerse la cara.
const ROUND_BULGE = 0.025;
// A partir de qué "distancia al borde" (en baricéntricas, 0=borde,
// 1/3=centro) empieza a hundirse. Bajo a propósito: dado que el número se
// dibuja centrado y grande, el redondeo NO debe invadir esa zona o
// encogería visualmente el número — el hundido vive en el marco exterior.
const ROUND_MARGIN = 0.13;

/** Un triángulo original → sus sub-triángulos con las esquinas recogidas hacia el centro del dado cerca de los bordes reales. */
function roundedTriangle(
  corners: [THREE.Vector3, THREE.Vector3, THREE.Vector3],
  cornerUVs: [[number, number], [number, number], [number, number]],
  edgeIsBoundary: [boolean, boolean, boolean],
): { positions: number[]; uvs: number[] } {
  const positions: number[] = [];
  const uvs: number[] = [];
  for (const tri of subdivideBarycentric(ROUND_SUBDIVISIONS)) {
    for (const [b0, b1, b2] of tri) {
      const flat = corners[0]
        .clone()
        .multiplyScalar(b0)
        .add(corners[1].clone().multiplyScalar(b1))
        .add(corners[2].clone().multiplyScalar(b2));
      const bs = [b0, b1, b2];
      let edgeDist = 1;
      for (let i = 0; i < 3; i++) {
        if (edgeIsBoundary[i]) edgeDist = Math.min(edgeDist, bs[i]);
      }
      const roundAmount = 1 - smoothstep(0, ROUND_MARGIN, edgeDist);
      const rounded = flat.clone().multiplyScalar(1 - roundAmount * ROUND_BULGE);
      positions.push(rounded.x, rounded.y, rounded.z);
      uvs.push(
        cornerUVs[0][0] * b0 + cornerUVs[1][0] * b1 + cornerUVs[2][0] * b2,
        cornerUVs[0][1] * b0 + cornerUVs[1][1] * b1 + cornerUVs[2][1] * b2,
      );
    }
  }
  return { positions, uvs };
}

/**
 * Normales suavizadas por POSICIÓN, no por índice de vértice: cada cara
 * necesita su propio UV, así que ningún vértice se comparte entre
 * triángulos (ni siquiera entre los dos de la cometa del d10) y un
 * `computeVertexNormals` normal daría una normal plana por micro-triángulo
 * —efecto "tallado a facetas", no liso—. Fundiendo por posición nada más
 * (el mismo truco que ya usa groupPolyhedronFaces en dice-geometry.ts) se
 * calcula la normal suave de verdad, incluida la costura entre dos caras
 * vecinas —que coinciden en posición aunque no en UV—, y se reparte de
 * vuelta a cada vértice original sin tocar la posición ni el UV.
 */
function computeWeldedNormals(positions: number[]): Float32Array {
  const positionOnly = new THREE.BufferGeometry();
  positionOnly.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  const indexed = mergeVertices(positionOnly, 1e-4);
  indexed.computeVertexNormals();
  const normalArr = indexed.attributes.normal.array;
  const idxArr = indexed.index!.array;
  const normals = new Float32Array(positions.length);
  for (let k = 0; k < idxArr.length; k++) {
    const uniqueIndex = idxArr[k];
    normals[k * 3] = normalArr[uniqueIndex * 3];
    normals[k * 3 + 1] = normalArr[uniqueIndex * 3 + 1];
    normals[k * 3 + 2] = normalArr[uniqueIndex * 3 + 2];
  }
  return normals;
}

export function buildPolyhedronVisual(model: DiceModel, color: string) {
  const positions: number[] = [];
  const uvs: number[] = [];
  const materials: THREE.MeshStandardMaterial[] = [];
  const geometry = new THREE.BufferGeometry();

  // d20 (muchas caras pequeñas) y d10 (caras "cometa" estrechas) necesitan
  // el número más pequeño que el resto para no comerse el bisel del borde;
  // el resto de dados se queda con el tamaño base.
  const fontScale = model.kind === "d20" || model.kind === "d10" ? 0.8 : 1;

  model.faces.forEach((face, faceIndex) => {
    const triIndices = model.triangles!.filter((_, t) => model.triangleFace![t] === faceIndex);
    const flat = flattenFace(triIndices, model.vertices!);
    const edgeFlags = classifyFaceEdges(triIndices);

    const [cx, cy] = faceCentroid2D(triIndices, flat);
    const coords = [...flat.values()];
    const dxMax = Math.max(...coords.map(([x]) => Math.abs(x - cx)));
    const dyMax = Math.max(...coords.map(([, y]) => Math.abs(y - cy)));
    const span = Math.max(dxMax, dyMax) * 2 || 1;
    const margin = 0.16;
    const toUV = (vertexIndex: number): [number, number] => {
      const [x, y] = flat.get(vertexIndex)!;
      const u = 0.5 + ((x - cx) / span) * (1 - margin * 2);
      const w = 0.5 + ((y - cy) / span) * (1 - margin * 2);
      return [u, w];
    };

    const start = positions.length / 3;
    triIndices.forEach((tri, triIdx) => {
      const corners = tri.map((i) => model.vertices![i]) as [THREE.Vector3, THREE.Vector3, THREE.Vector3];
      const cornerUVs = tri.map((i) => toUV(i)) as [[number, number], [number, number], [number, number]];
      const rounded = roundedTriangle(corners, cornerUVs, edgeFlags[triIdx]);
      positions.push(...rounded.positions);
      uvs.push(...rounded.uvs);
    });
    const count = positions.length / 3 - start;
    geometry.addGroup(start, count, faceIndex);

    const label = formatDiceValueLabel(model.kind, face.value);
    materials.push(
      new THREE.MeshStandardMaterial({
        map: createNumeralTexture(label, color, fontScale),
        roughness: 0.55,
        metalness: 0.04,
      }),
    );
  });

  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(computeWeldedNormals(positions), 3));

  const cannonVertices = model.vertices!.map((v) => new CANNON.Vec3(v.x, v.y, v.z));
  const shape = new CANNON.ConvexPolyhedron({ vertices: cannonVertices, faces: model.triangles! });

  return { geometry, materials, shape };
}

export function buildBoxVisual(model: DiceModel, color: string) {
  const geometry = new RoundedBoxGeometry(model.boxSize!, model.boxSize!, model.boxSize!, 4, model.boxCornerRadius!);
  // El orden de grupos de material de BoxGeometry (de la que hereda
  // RoundedBoxGeometry) es +X,-X,+Y,-Y,+Z,-Z — el mismo orden en el que
  // dice-geometry.ts define las caras del d6.
  const materials = model.faces.map(
    (face) => new THREE.MeshStandardMaterial({ map: createPipTexture(face.value, color), roughness: 0.55, metalness: 0.04 }),
  );
  const half = model.boxSize! / 2;
  const shape = new CANNON.Box(new CANNON.Vec3(half, half, half));
  return { geometry, materials, shape };
}

export function mountDiceScene(container: HTMLDivElement, callbacks: DiceSceneCallbacks): DiceSceneHandle {
  const scene = new THREE.Scene();

  let width = container.clientWidth || 1;
  let height = container.clientHeight || 1;
  const camera = new THREE.OrthographicCamera(1, 1, 1, 1, 1, 1000);
  camera.position.set(11, 15, 11);
  camera.lookAt(0, 0, 0);

  // Sin luces, los MeshStandardMaterial de los dados se verían negros —y con
  // MeshBasicMaterial (lo que había antes) el redondeado de los bordes es
  // invisible de por sí: ese material ignora la normal por completo, así que
  // por muy abombada que esté la geometría no hay degradado de luz que lo
  // delate. La única señal de "esto es redondo" con luz es un gradiente de
  // sombra, y eso exige un material que SÍ mire la normal.
  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const keyLight = new THREE.DirectionalLight(0xffffff, 0.9);
  keyLight.position.set(6, 12, 8);
  scene.add(keyLight);
  const fillLight = new THREE.DirectionalLight(0xffffff, 0.35);
  fillLight.position.set(-8, 6, -6);
  scene.add(fillLight);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.domElement.style.touchAction = "none";
  renderer.domElement.style.userSelect = "none";
  renderer.domElement.style.display = "block";
  container.appendChild(renderer.domElement);

  function applyCameraSize() {
    const aspect = width / height;
    camera.left = (-FRUSTUM_SIZE * aspect) / 2;
    camera.right = (FRUSTUM_SIZE * aspect) / 2;
    camera.top = FRUSTUM_SIZE / 2;
    camera.bottom = -FRUSTUM_SIZE / 2;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  applyCameraSize();

  const world = new CANNON.World();
  world.gravity.set(0, -40, 0);
  world.broadphase = new CANNON.NaiveBroadphase();
  // El World nace con un GSSolver, pero el tipo base `Solver` no expone
  // `iterations` — hacen falta más que las 10 de fábrica porque los hulls
  // de muchas caras (d12, d20) necesitan más pasadas para asentar sin vibrar.
  (world.solver as CANNON.GSSolver).iterations = 30;
  world.allowSleep = true;

  const wallMaterial = new CANNON.Material();
  const diceMaterial = new CANNON.Material();
  world.addContactMaterial(
    new CANNON.ContactMaterial(wallMaterial, diceMaterial, { friction: 0.3, restitution: 0.6 }),
  );

  function addWalls() {
    const floor = new CANNON.Body({ mass: 0, material: wallMaterial });
    floor.addShape(new CANNON.Plane());
    floor.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    world.addBody(floor);

    const addWall = (x: number, z: number, rot: number) => {
      const body = new CANNON.Body({ mass: 0, material: wallMaterial });
      body.addShape(new CANNON.Plane());
      body.position.set(x, 0, z);
      body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), rot);
      world.addBody(body);
    };
    addWall(TRAY_HALF_SIZE, 0, -Math.PI / 2);
    addWall(-TRAY_HALF_SIZE, 0, Math.PI / 2);
    addWall(0, -TRAY_HALF_SIZE, 0);
    addWall(0, TRAY_HALF_SIZE, Math.PI);
  }
  addWalls();

  let dice: DieInstance[] = [];

  function disposeMesh(mesh: THREE.Mesh) {
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const m of materials) {
      (m as THREE.Material & { map?: THREE.Texture | null }).map?.dispose();
      m.dispose();
    }
    mesh.geometry.dispose();
  }

  function disposeDie(die: DieInstance) {
    scene.remove(die.mesh, die.outline, die.shadow);
    world.removeBody(die.body);
    disposeMesh(die.mesh);
    disposeMesh(die.outline);
    disposeMesh(die.shadow);
  }

  function spawnDie(model: DiceModel, index: number, total: number): DieInstance {
    const color = DICE_PALETTE[Math.floor(Math.random() * DICE_PALETTE.length)];
    const built = model.shape === "roundedBox" ? buildBoxVisual(model, color) : buildPolyhedronVisual(model, color);

    const mesh = new THREE.Mesh(built.geometry, built.materials);
    scene.add(mesh);

    const outline = new THREE.Mesh(
      built.geometry.clone(),
      new THREE.MeshBasicMaterial({ color: "#3a2a22", side: THREE.BackSide }),
    );
    outline.scale.setScalar(1.05);
    scene.add(outline);

    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(model.boundingRadius * 0.7, 24),
      new THREE.MeshBasicMaterial({ color: "#000000", transparent: true, opacity: 0.2 }),
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.01;
    scene.add(shadow);

    const startX = (index - (total - 1) / 2) * (model.boundingRadius * 2.4 + 0.6);
    const body = new CANNON.Body({
      mass: 5,
      shape: built.shape,
      position: new CANNON.Vec3(startX, model.boundingRadius * 2, 0),
      sleepSpeedLimit: 0.5,
    });
    body.quaternion.setFromEuler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    world.addBody(body);

    return { model, mesh, outline, shadow, body, spinOffset: 0, isReturning: false };
  }

  function clearDice() {
    for (const die of dice) disposeDie(die);
    dice = [];
  }

  function setDice(kind: DiceKind, count: number) {
    clearDice();
    const model = buildDiceModel(kind);
    for (let i = 0; i < count; i++) dice.push(spawnDie(model, i, count));
  }

  function applyThrowForce(body: CANNON.Body) {
    const xDist = -body.position.x;
    const zDist = -body.position.z;
    body.velocity.set(xDist * 1.5 + (Math.random() - 0.5) * 15, -15 - Math.random() * 10, zDist * 1.5 + (Math.random() - 0.5) * 15);
    body.angularVelocity.set((Math.random() - 0.5) * 35, (Math.random() - 0.5) * 35, (Math.random() - 0.5) * 35);
  }

  let needsResultCheck = false;

  function throwDice() {
    if (dice.length === 0) return;
    callbacks.onRollStart?.();
    for (const die of dice) {
      const isOutside = Math.abs(die.body.position.x) > SAFE_LIMIT || Math.abs(die.body.position.z) > SAFE_LIMIT;
      if (isOutside) {
        die.isReturning = true;
      } else {
        die.body.wakeUp();
        applyThrowForce(die.body);
      }
    }
    setTimeout(() => {
      needsResultCheck = true;
    }, 500);
  }

  function readResult(die: DieInstance): number {
    const { model, mesh } = die;
    const wantsTop = model.resultRule === "topFace";
    let picked = model.faces[0];
    let best = wantsTop ? -Infinity : Infinity;
    for (const face of model.faces) {
      const y = face.normal.clone().applyQuaternion(mesh.quaternion).y;
      if (wantsTop ? y > best : y < best) {
        best = y;
        picked = face;
      }
    }
    return picked.value;
  }

  function computeResult() {
    const rolls = dice.map(readResult);
    const total = rolls.reduce((a, b) => a + b, 0);
    needsResultCheck = false;
    callbacks.onResult?.({ total, rolls });
  }

  // --- Entrada: arrastrar agarra TODOS los dados de la bandeja, soltar los lanza ---
  const mouse = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -9);
  let isHolding = false;

  function updatePointer(e: PointerEvent) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  }

  function onPointerDown(e: PointerEvent) {
    isHolding = true;
    needsResultCheck = false;
    updatePointer(e);
    renderer.domElement.setPointerCapture(e.pointerId);
    for (const die of dice) {
      die.body.wakeUp();
      die.spinOffset = Math.random() * 100;
      die.isReturning = false;
    }
  }
  function onPointerMove(e: PointerEvent) {
    if (!isHolding) return;
    updatePointer(e);
  }
  function onPointerUp() {
    if (!isHolding) return;
    isHolding = false;
    throwDice();
  }

  renderer.domElement.addEventListener("pointerdown", onPointerDown);
  renderer.domElement.addEventListener("pointermove", onPointerMove);
  renderer.domElement.addEventListener("pointerup", onPointerUp);
  renderer.domElement.addEventListener("pointercancel", onPointerUp);

  // --- Bucle de animación ---
  let raf = 0;

  function frame() {
    raf = requestAnimationFrame(frame);
    const time = performance.now() * 0.01;

    if (isHolding) {
      raycaster.setFromCamera(mouse, camera);
      const target = new THREE.Vector3();
      const hit = raycaster.ray.intersectPlane(dragPlane, target);
      if (hit) {
        dice.forEach((die, i) => {
          const offsetX = Math.sin(time + i) * 1.0;
          const offsetZ = Math.cos(time + i * 2) * 1.0;
          die.body.position.x += (target.x + offsetX - die.body.position.x) * 0.25;
          die.body.position.y += (9 - die.body.position.y) * 0.25;
          die.body.position.z += (target.z + offsetZ - die.body.position.z) * 0.25;
          die.body.quaternion.setFromEuler(time * 2 + die.spinOffset, time * 3 + die.spinOffset, time * 1.5);
          die.body.velocity.set(0, 0, 0);
          die.body.angularVelocity.set(0, 0, 0);
          die.isReturning = false;
        });
      }
    } else {
      for (const die of dice) {
        if (die.isReturning) {
          die.body.position.x += (0 - die.body.position.x) * 0.15;
          die.body.position.z += (0 - die.body.position.z) * 0.15;
          die.body.position.y += (7 - die.body.position.y) * 0.1;
          die.body.quaternion.setFromEuler(time * 5, time * 5, 0);
          die.body.velocity.set(0, 0, 0);
          die.body.angularVelocity.set(0, 0, 0);
          if (Math.abs(die.body.position.x) < SAFE_LIMIT && Math.abs(die.body.position.z) < SAFE_LIMIT) {
            die.isReturning = false;
            die.body.wakeUp();
            applyThrowForce(die.body);
          }
        }
      }
      world.step(1 / 60);
    }

    for (const die of dice) {
      const { position, quaternion } = die.body;
      die.mesh.position.set(position.x, position.y, position.z);
      die.mesh.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
      die.outline.position.copy(die.mesh.position);
      die.outline.quaternion.copy(die.mesh.quaternion);
      die.shadow.position.x = die.body.position.x;
      die.shadow.position.z = die.body.position.z;
      const heightAbove = Math.max(0, die.body.position.y - die.model.boundingRadius);
      const scale = Math.max(0.5, 1 - heightAbove * 0.04);
      const opacity = Math.max(0, 0.2 - heightAbove * 0.01);
      die.shadow.scale.setScalar(scale);
      (die.shadow.material as THREE.MeshBasicMaterial).opacity = opacity;
    }

    if (needsResultCheck) {
      const allStopped = dice.every(
        (die) => !die.isReturning && die.body.velocity.lengthSquared() < 0.1 && die.body.angularVelocity.lengthSquared() < 0.1,
      );
      if (allStopped) computeResult();
    }

    renderer.render(scene, camera);
  }
  raf = requestAnimationFrame(frame);

  const resizeObserver = new ResizeObserver((entries) => {
    const entry = entries[0];
    if (!entry) return;
    const { width: w, height: h } = entry.contentRect;
    if (!w || !h) return;
    width = w;
    height = h;
    applyCameraSize();
  });
  resizeObserver.observe(container);

  function destroy() {
    cancelAnimationFrame(raf);
    resizeObserver.disconnect();
    renderer.domElement.removeEventListener("pointerdown", onPointerDown);
    renderer.domElement.removeEventListener("pointermove", onPointerMove);
    renderer.domElement.removeEventListener("pointerup", onPointerUp);
    renderer.domElement.removeEventListener("pointercancel", onPointerUp);
    clearDice();
    renderer.dispose();
    if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement);
  }

  return { setDice, throwDice, destroy };
}
