// =========================================================================
// Figura 3D sobre el tablero de batalla — motor de escena
//
// Pone UN personaje animado (.glb) de pie sobre un hexágono del tablero de
// /dev/combate, encima del SVG, mientras el resto de fichas siguen siendo el
// disco cenital de siempre (board-map.md §4c). Esa mezcla es el experimento:
// tener las dos cosas en la misma pantalla es la única forma honesta de
// decidir si el personaje animado puede ser la ficha del tablero o tiene que
// vivir en una pantalla aparte.
//
// -------------------------------------------------------------------------
// LO ÚNICO DIFÍCIL DE ESTE ARCHIVO: casar la cámara con un tablero que no es 3D
// -------------------------------------------------------------------------
// El tablero está dibujado en SVG con una inclinación FALSA: `Hex.toPixel`
// comprime el eje vertical por `tilt` (BOARD_TILT = 0,85) y ya está. No hay
// cámara, no hay perspectiva, no hay profundidad. Para que la figura se pose
// sobre su hexágono y no flote a un palmo, la cámara 3D tiene que producir
// exactamente esa misma proyección — no una parecida.
//
// Sale con una cámara ORTOGRÁFICA (nunca en perspectiva: la perspectiva
// escala con la distancia y el SVG no) mirando el plano del suelo desde una
// elevación α tal que `sin α = tilt`. Con esa elevación y mirando a lo largo
// del eje Z:
//
//     pantalla_x = mundo_x
//     pantalla_y = mundo_z · sin α  −  mundo_y · cos α
//
// El primer término, para un punto del suelo (mundo_y = 0), es literalmente
// `Hex.toPixel().y`: el suelo cae clavado sobre el tablero. El segundo es lo
// que el SVG no tiene y es justo lo que se quería: la ALTURA de la figura, que
// sube en pantalla con cos α. Un disco pintado en el suelo y un personaje de
// pie comparten así el mismo hexágono sin trucar nada.
//
// De ahí que la escena trabaje en UNIDADES DEL TABLERO (las del viewBox) y no
// en metros: un hexágono mide `hexSize` aquí igual que allí, y no hay ninguna
// conversión que mantener sincronizada. La `z` del mundo es la `y` del tablero
// SIN la compresión (by / tilt) — la compresión ya la vuelve a poner la cámara.
//
// El zoom y el arrastre del tablero (use-board-view.ts) se replican moviendo
// el frustum, no escalando el lienzo: escalar rasterizaría la figura a la
// escala anterior y saldría borrosa al acercar.
// =========================================================================

import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import type { BoardProjection } from "@/components/game/board/HexBoard";

/**
 * Las poses que el combate sabe pedir. NO son los clips del archivo: son los
 * momentos que el motor de combate ya produce hoy (esperar, moverse, atacar,
 * encajar un golpe, caer). Cada .glb cubrirá unas y otras no, y saber cuáles
 * faltan es parte de lo que se viene a medir aquí.
 */
export type FigurePose = "idle" | "walk" | "attack" | "hit" | "die";

/**
 * Cómo se busca el clip de cada pose dentro del .glb, por orden de
 * preferencia y sin distinguir mayúsculas. Es una lista de candidatos y no un
 * nombre fijo a propósito: un modelo de Mixamo, uno de Meshy y uno hecho a
 * mano llaman de tres maneras distintas a la misma animación, y el día que se
 * genere un personaje propio esto es lo que evita tener que renombrar clips a
 * mano en cada exportación.
 */
const POSE_CANDIDATES: Readonly<Record<FigurePose, readonly string[]>> = {
  idle: ["idle", "reposo", "stand", "standing", "breathing"],
  walk: ["walking", "walk", "andar", "run", "running", "jog"],
  attack: ["punch", "attack", "atacar", "slash", "swing", "kick"],
  hit: ["hit", "hurt", "damage", "impact", "recoil", "flinch"],
  die: ["death", "die", "dying", "dead", "muerte"],
};

/** Todas las poses, en orden de importancia para el informe del laboratorio. */
export const FIGURE_POSES: readonly FigurePose[] = ["idle", "walk", "attack", "hit", "die"];

/**
 * Altura de la figura en RADIOS DE HEXÁGONO. 1 sería un personaje tan alto
 * como ancho es el radio de su casilla — demasiado bajo para leerse de pie.
 * Es el número que este laboratorio existe para ajustar a ojo, así que sale
 * como mando y esto es solo el arranque.
 */
export const DEFAULT_FIGURE_HEIGHT = 2;

/** Lo que tarda la figura en recorrer un hexágono, en segundos. */
const STEP_SECONDS = 0.45;

const FADE_SECONDS = 0.2;

/** Lo que el .glb resulta traer, en términos de lo que el combate necesita. */
export type FigureInfo = {
  /** Los nombres tal cual vienen en el archivo. */
  readonly clips: readonly string[];
  /** Qué clip ha quedado asignado a cada pose; `null` si el archivo no trae ninguno. */
  readonly poses: Readonly<Record<FigurePose, string | null>>;
  readonly triangles: number;
  readonly bones: number;
};

export type BattleFigureHandle = {
  load: (url: string) => Promise<FigureInfo>;
  /** Coloca la figura en un hexágono, sin transición. */
  placeAt: (boardX: number, boardY: number) => void;
  /** La lleva andando hasta otro hexágono; la promesa resuelve al llegar. */
  walkTo: (boardX: number, boardY: number) => Promise<void>;
  /** La gira hacia un punto del tablero sin moverla (para atacar). */
  facePoint: (boardX: number, boardY: number) => void;
  /** Reproduce una pose. Las de un solo uso (attack/hit) vuelven solas a idle. */
  play: (pose: FigurePose) => void;
  setHeight: (hexRadii: number) => void;
  setVisible: (visible: boolean) => void;
  /** Se llama en cada render del tablero: zoom, arrastre o cambio de tamaño. */
  setProjection: (projection: BoardProjection) => void;
  destroy: () => void;
};

/** Igual que `visibleRect` de use-board-view.ts, reducido a lo que hace falta
 *  aquí: cuántas unidades de tablero se ven por el marco. Las bandas que deja
 *  `preserveAspectRatio` cuentan como tablero visible, así que el rectángulo
 *  de verdad es mayor que el viewBox y hay que contarlo, o la figura se
 *  desplazaría respecto al SVG en cuanto el marco no tuviera su proporción. */
function visibleSpan(width: number, height: number, box: BoardProjection["viewBox"]) {
  const scale = Math.min(width / box.width, height / box.height) || 1;
  return { width: width / scale, height: height / scale };
}

function disposeObject(root: THREE.Object3D) {
  root.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    const material = mesh.material;
    if (!material) return;
    for (const mat of Array.isArray(material) ? material : [material]) {
      for (const value of Object.values(mat)) {
        if (value instanceof THREE.Texture) value.dispose();
      }
      mat.dispose();
    }
  });
}

function countTriangles(root: THREE.Object3D): number {
  let total = 0;
  root.traverse((child) => {
    const geometry = (child as THREE.Mesh).geometry as THREE.BufferGeometry | undefined;
    if (!geometry) return;
    total += geometry.index ? geometry.index.count / 3 : (geometry.attributes.position?.count ?? 0) / 3;
  });
  return Math.round(total);
}

/** Empareja cada pose con un clip del archivo, por la lista de candidatos. */
function matchPoses(clipNames: readonly string[]): Record<FigurePose, string | null> {
  const out = {} as Record<FigurePose, string | null>;
  for (const pose of FIGURE_POSES) {
    const found = POSE_CANDIDATES[pose]
      .map((candidate) => clipNames.find((name) => name.toLowerCase().includes(candidate)))
      .find((name): name is string => name !== undefined);
    out[pose] = found ?? null;
  }
  return out;
}

export function mountBattleFigure(container: HTMLDivElement): BattleFigureHandle {
  const scene = new THREE.Scene();

  // Ortográfica y no en perspectiva: el tablero SVG no tiene punto de fuga, así
  // que cualquier perspectiva desalinearía la figura del hexágono en cuanto se
  // alejara del centro. El frustum lo fija setProjection().
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 20000);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.domElement.style.display = "block";
  container.appendChild(renderer.domElement);

  // Mismo esquema que el resto de escenas de la casa (ambiente + clave +
  // relleno): los materiales de un .glb son MeshStandardMaterial y sin luz
  // salen negros. La clave viene de arriba y de la izquierda, como la sombra
  // proyectada del tablero (_board.scss), para que la figura no parezca
  // iluminada por otro sol distinto al de las losetas.
  scene.add(new THREE.AmbientLight(0xffffff, 0.85));
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.15);
  keyLight.position.set(-4, 8, 5);
  scene.add(keyLight);
  const fillLight = new THREE.DirectionalLight(0xffffff, 0.35);
  fillLight.position.set(5, 3, -4);
  scene.add(fillLight);

  // El pivote es lo que se coloca y se gira; el modelo va dentro, ya escalado y
  // con los pies en y=0. Separarlos evita que la normalización del .glb (que
  // toca escala y posición) pelee con la colocación en el tablero.
  const pivot = new THREE.Group();
  pivot.visible = false;
  scene.add(pivot);

  let projection: BoardProjection | null = null;
  let figureHeight = DEFAULT_FIGURE_HEIGHT;
  /** Alto del modelo tal como vino, para poder reescalarlo sin recargarlo. */
  let modelRawHeight = 1;
  let model: THREE.Object3D | null = null;
  let mixer: THREE.AnimationMixer | null = null;
  let actions = new Map<string, THREE.AnimationAction>();
  let poseClips: Record<FigurePose, string | null> = matchPoses([]);
  let currentAction: THREE.AnimationAction | null = null;
  let currentPose: FigurePose | null = null;
  let loadToken = 0;

  // Paseo en curso: de dónde a dónde y cuánto lleva. En unidades de tablero.
  let walk: {
    from: THREE.Vector3;
    to: THREE.Vector3;
    elapsed: number;
    duration: number;
    resolve: () => void;
  } | null = null;

  /** Vuelta automática a idle tras una pose de un solo uso, en segundos. */
  let returnToIdleIn = 0;

  /** (x, y) del tablero → punto del mundo. La `y` del tablero ya trae la
   *  compresión de `tilt` metida por Hex.toPixel, y la cámara se la vuelve a
   *  aplicar, así que aquí se le quita: si no, el tablero iría comprimido dos
   *  veces y la figura se separaría de su casilla según bajara por el mapa. */
  function toWorld(boardX: number, boardY: number): THREE.Vector3 {
    const tilt = projection?.tilt ?? 1;
    return new THREE.Vector3(boardX, 0, boardY / tilt);
  }

  function applyScale() {
    if (!model || !projection) return;
    // La altura se pide en radios de hexágono, así que el tamaño en pantalla
    // sigue al tablero: cambiar `hexSize` no descoloca la figura.
    const target = figureHeight * projection.hexSize;
    model.scale.setScalar(modelRawHeight > 0 ? target / modelRawHeight : 1);
  }

  function setProjection(next: BoardProjection) {
    const first = projection === null;
    projection = next;

    const width = container.clientWidth || 1;
    const height = container.clientHeight || 1;
    renderer.setSize(width, height, false);

    const { viewBox: box, camera: cam, tilt } = next;
    const span = visibleSpan(width, height, box);

    // El frustum es lo que se ve del tablero, en unidades de tablero, dividido
    // por el zoom. Así una unidad de mundo ocupa en el lienzo los mismos
    // píxeles que una unidad de viewBox en el SVG.
    const halfW = span.width / (2 * cam.k);
    const halfH = span.height / (2 * cam.k);
    camera.left = -halfW;
    camera.right = halfW;
    camera.top = halfH;
    camera.bottom = -halfH;

    // El punto del tablero que cae en el centro del marco. El SVG transforma
    // con `translate(t) scale(k)`, así que se deshace al revés. Las bandas de
    // `preserveAspectRatio` son simétricas y se cancelan, por eso aquí solo
    // entran el viewBox y la cámara y no el tamaño del marco.
    const centerX = (box.minX + box.width / 2 - cam.tx) / cam.k;
    const centerY = (box.minY + box.height / 2 - cam.ty) / cam.k;

    // Elevación con sin α = tilt: es la que reproduce la compresión del SVG.
    const sinA = tilt;
    const cosA = Math.sqrt(Math.max(0, 1 - sinA * sinA));
    // Distancia arbitraria: en ortográfica no cambia el tamaño, solo tiene que
    // dejar el tablero entero dentro de near/far.
    const distance = 5000;
    const target = new THREE.Vector3(centerX, 0, centerY / tilt);
    camera.position.set(target.x, target.y + sinA * distance, target.z + cosA * distance);
    camera.up.set(0, 1, 0);
    camera.lookAt(target);
    camera.updateProjectionMatrix();

    if (first) applyScale();
  }

  function clearModel() {
    if (mixer) {
      mixer.stopAllAction();
      mixer.uncacheRoot(mixer.getRoot() as THREE.Object3D);
      mixer = null;
    }
    if (model) {
      pivot.remove(model);
      disposeObject(model);
      model = null;
    }
    actions = new Map();
    poseClips = matchPoses([]);
    currentAction = null;
    currentPose = null;
  }

  function play(pose: FigurePose) {
    const clipName = poseClips[pose];
    // Sin clip para esa pose no se inventa nada: se queda como está. Que una
    // pose no exista es un dato del archivo, no un fallo que haya que tapar
    // con la animación de al lado.
    if (!clipName) return;
    const next = actions.get(clipName);
    if (!next) return;

    // Las de un solo uso se dejan clavadas en el último fotograma y se
    // programa la vuelta a idle; las continuas van en bucle.
    const once = pose === "attack" || pose === "hit" || pose === "die";
    next.setLoop(once ? THREE.LoopOnce : THREE.LoopRepeat, once ? 1 : Infinity);
    next.clampWhenFinished = once;

    if (next === currentAction) {
      // Repetir la MISMA pose de un solo uso (dos golpes seguidos) tiene que
      // reiniciarla: sin esto el segundo ataque no se vería.
      if (once) next.reset().play();
    } else {
      next.reset().setEffectiveWeight(1).play();
      if (currentAction) currentAction.crossFadeTo(next, FADE_SECONDS, false);
      currentAction = next;
    }
    currentPose = pose;

    // "die" no vuelve: se queda en el suelo.
    returnToIdleIn = once && pose !== "die" ? next.getClip().duration + 0.1 : 0;
  }

  function facePoint(boardX: number, boardY: number) {
    const to = toWorld(boardX, boardY);
    const dx = to.x - pivot.position.x;
    const dz = to.z - pivot.position.z;
    if (dx === 0 && dz === 0) return;
    // atan2(x, z) y no (z, x): el "delante" de un .glb es +Z por convención de
    // glTF, así que un giro de 0 tiene que mirar hacia +Z.
    pivot.rotation.y = Math.atan2(dx, dz);
  }

  function placeAt(boardX: number, boardY: number) {
    walk?.resolve();
    walk = null;
    pivot.position.copy(toWorld(boardX, boardY));
  }

  function walkTo(boardX: number, boardY: number): Promise<void> {
    const to = toWorld(boardX, boardY);
    const from = pivot.position.clone();
    const distance = from.distanceTo(to);
    if (distance < 0.001) return Promise.resolve();

    facePoint(boardX, boardY);
    play("walk");

    return new Promise<void>((resolve) => {
      walk?.resolve(); // el paseo anterior se da por terminado, no se encola
      walk = {
        from,
        to,
        elapsed: 0,
        // Proporcional a la distancia: dos hexágonos tardan el doble que uno,
        // que es lo que hace que el paso se lea como paso y no como patinada.
        duration: (distance / Math.max(1, projection?.hexSize ?? 30)) * STEP_SECONDS,
        resolve,
      };
    });
  }

  function load(url: string): Promise<FigureInfo> {
    const token = ++loadToken;
    return new Promise((resolve, reject) => {
      new GLTFLoader().load(
        url,
        (gltf) => {
          if (token !== loadToken) return; // llegó tarde: ya se pidió otro
          clearModel();

          const loaded = gltf.scene;
          // Se mide y se recentra: un .glb puede venir en metros, en
          // centímetros o descentrado. Los pies al 0 y el centro en el eje,
          // que es lo que deja al personaje de pie SOBRE el hexágono.
          const box = new THREE.Box3().setFromObject(loaded);
          const size = new THREE.Vector3();
          const center = new THREE.Vector3();
          box.getSize(size);
          box.getCenter(center);
          modelRawHeight = size.y || 1;
          // El recentrado va en unidades del modelo sin escalar, porque quien
          // escala es `model.scale` justo después (applyScale).
          loaded.position.set(-center.x, -box.min.y, -center.z);

          const holder = new THREE.Group();
          holder.add(loaded);
          pivot.add(holder);
          model = holder;
          applyScale();

          mixer = new THREE.AnimationMixer(holder);
          actions = new Map(gltf.animations.map((clip) => [clip.name, mixer!.clipAction(clip)]));
          const clips = gltf.animations.map((clip) => clip.name);
          poseClips = matchPoses(clips);

          let bones = 0;
          holder.traverse((child) => {
            if ((child as THREE.Bone).isBone) bones++;
          });

          play("idle");

          resolve({ clips, poses: { ...poseClips }, triangles: countTriangles(holder), bones });
        },
        undefined,
        (error) => {
          if (token === loadToken) reject(error);
        },
      );
    });
  }

  // --- Bucle ---
  const clock = new THREE.Clock();
  let raf = 0;

  function frame() {
    raf = requestAnimationFrame(frame);
    const delta = clock.getDelta();

    if (walk) {
      walk.elapsed += delta;
      const t = Math.min(1, walk.elapsed / walk.duration);
      pivot.position.lerpVectors(walk.from, walk.to, t);
      if (t >= 1) {
        const done = walk.resolve;
        walk = null;
        play("idle");
        done();
      }
    }

    if (returnToIdleIn > 0) {
      returnToIdleIn -= delta;
      if (returnToIdleIn <= 0) {
        returnToIdleIn = 0;
        if (currentPose !== "die") play("idle");
      }
    }

    mixer?.update(delta);
    if (projection) renderer.render(scene, camera);
  }
  raf = requestAnimationFrame(frame);

  // El marco cambia de tamaño con la ventana, y el frustum se calcula a partir
  // de él: sin esto, la figura se despegaría del hexágono al redimensionar.
  const resizeObserver = new ResizeObserver(() => {
    if (projection) setProjection(projection);
  });
  resizeObserver.observe(container);

  return {
    load,
    placeAt,
    walkTo,
    facePoint,
    play,
    setHeight: (hexRadii) => {
      figureHeight = hexRadii;
      applyScale();
    },
    setVisible: (visible) => {
      pivot.visible = visible;
    },
    setProjection,
    destroy: () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      walk?.resolve();
      walk = null;
      clearModel();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement);
    },
  };
}
