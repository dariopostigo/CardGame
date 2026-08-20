// =========================================================================
// Motor de escena del personaje 3D: Three.js montado a mano sobre un
// <canvas>, sin React de por medio — el mismo patrón imperativo de
// dice-scene.ts (mount → handle → destroy), aquí sin física porque no hay
// nada que simular: la animación viene DENTRO del .glb.
//
// La idea que prueba este laboratorio: un personaje animado no se hornea a
// lámina de sprites. El .glb trae malla + esqueleto + clips, y el navegador
// reproduce el que toque con un AnimationMixer. Eso significa que animar NO
// escala con el número de personajes — los clips se aplican a un esqueleto,
// así que el personaje nº 12 cuesta generarlo y riggearlo, no animarlo.
//
// Consecuencia práctica que hay que MEDIR aquí antes de comprometerse:
// cuánto pesa cada .glb y cuántos triángulos entran en pantalla, porque a
// diferencia de un PNG esto se descarga y se dibuja cada frame. De ahí que
// el handle devuelva estadísticas y no solo "va bien".
// =========================================================================

import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

/** Altura a la que se normaliza cualquier modelo, en unidades de escena.
 *  Sin esto, comparar el robot con el zorro sería comparar dos escalas de
 *  exportación arbitrarias en vez de dos personajes. */
const TARGET_HEIGHT = 2;

const FADE_SECONDS = 0.25;

export type CameraView = "tablero" | "retrato";
export type LoopMode = "bucle" | "una-vez";

/** Lo que el .glb resulta traer dentro: es el informe del laboratorio. */
export type CharacterInfo = {
  clips: string[];
  triangles: number;
  bones: number;
  materials: number;
};

export type CharacterSceneCallbacks = {
  onStats?: (stats: { fps: number; calls: number }) => void;
};

export type CharacterSceneHandle = {
  load: (url: string) => Promise<CharacterInfo>;
  playClip: (name: string) => void;
  replay: () => void;
  setSpeed: (speed: number) => void;
  setLoopMode: (mode: LoopMode) => void;
  setView: (view: CameraView) => void;
  destroy: () => void;
};

// Posición de cámara y punto de mira por vista. "tablero" es el ángulo al que
// se vería la ficha sobre el hexágono (picado de ~35°, como el tablero);
// "retrato" es de frente y cerca, para juzgar la cara y el arma.
const VIEWS: Record<CameraView, { position: [number, number, number]; target: [number, number, number] }> = {
  tablero: { position: [2.6, 2.9, 3.4], target: [0, 0.9, 0] },
  retrato: { position: [0, 1.3, 3.6], target: [0, 1.1, 0] },
};

/** Disco de sombra de contacto: un degradado radial pintado en canvas 2D y
 *  tumbado en el suelo. No es una sombra real (proyectarla exigiría
 *  shadowMap y un plano receptor); es el mismo truco que ya usan los dados,
 *  y basta para que el personaje no parezca flotar. */
function createContactShadow(): THREE.Mesh {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(0,0,0,0.45)");
  gradient.addColorStop(0.6, "rgba(0,0,0,0.12)");
  gradient.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2.6, 2.6),
    new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false }),
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = 0.005;
  return mesh;
}

/** Libera geometrías, materiales y texturas de una rama del grafo. Sin esto,
 *  cambiar de modelo diez veces deja diez modelos en memoria de GPU: el
 *  recolector de JS no sabe nada de los búferes de WebGL. */
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

/** Cuenta triángulos recorriendo el grafo. renderer.info los daría también,
 *  pero solo DESPUÉS de pintar un frame, y esto se quiere al terminar la
 *  carga para poder enseñarlo junto al peso del archivo. */
function countTriangles(root: THREE.Object3D): number {
  let total = 0;
  root.traverse((child) => {
    const geometry = (child as THREE.Mesh).geometry as THREE.BufferGeometry | undefined;
    if (!geometry) return;
    // Sin índice, cada 3 vértices son un triángulo; con índice, cada 3 índices.
    total += geometry.index ? geometry.index.count / 3 : (geometry.attributes.position?.count ?? 0) / 3;
  });
  return Math.round(total);
}

export function mountCharacterScene(
  container: HTMLDivElement,
  callbacks: CharacterSceneCallbacks = {},
): CharacterSceneHandle {
  const scene = new THREE.Scene();

  let width = container.clientWidth || 1;
  let height = container.clientHeight || 1;

  const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.domElement.style.touchAction = "none";
  renderer.domElement.style.userSelect = "none";
  renderer.domElement.style.display = "block";
  container.appendChild(renderer.domElement);

  // Mismo esquema de luces que la bandeja de dados (ambiente + clave + relleno):
  // los materiales de un .glb son MeshStandardMaterial y sin luz salen negros.
  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
  keyLight.position.set(4, 8, 6);
  scene.add(keyLight);
  const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
  fillLight.position.set(-6, 4, -4);
  scene.add(fillLight);

  scene.add(createContactShadow());

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.minDistance = 1.5;
  controls.maxDistance = 12;
  // Por debajo del suelo no hay nada que ver, y pasarse deja al personaje
  // colgado del techo: se corta el orbitado justo antes de la horizontal.
  controls.maxPolarAngle = Math.PI / 2 - 0.05;

  function setView(view: CameraView) {
    const { position, target } = VIEWS[view];
    camera.position.set(...position);
    controls.target.set(...target);
    controls.update();
  }
  setView("tablero");

  function applySize() {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  applySize();

  // --- Modelo y animación ---
  const loader = new GLTFLoader();
  const clock = new THREE.Clock();

  let current: THREE.Object3D | null = null;
  let mixer: THREE.AnimationMixer | null = null;
  let actions = new Map<string, THREE.AnimationAction>();
  let currentAction: THREE.AnimationAction | null = null;
  let speed = 1;
  let loopMode: LoopMode = "bucle";
  // Cada carga se numera: si el usuario cambia de modelo mientras el anterior
  // aún viaja por la red, la respuesta tardía se descarta en vez de pisar al
  // modelo que ya está en pantalla.
  let loadToken = 0;

  function clearModel() {
    if (mixer) {
      mixer.stopAllAction();
      mixer.uncacheRoot(mixer.getRoot() as THREE.Object3D);
      mixer = null;
    }
    if (current) {
      scene.remove(current);
      disposeObject(current);
      current = null;
    }
    actions = new Map();
    currentAction = null;
  }

  function applyLoopMode(action: THREE.AnimationAction) {
    if (loopMode === "una-vez") {
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
    } else {
      action.setLoop(THREE.LoopRepeat, Infinity);
      action.clampWhenFinished = false;
    }
  }

  function playClip(name: string) {
    const next = actions.get(name);
    if (!next || next === currentAction) return;
    applyLoopMode(next);
    next.reset().setEffectiveTimeScale(speed).setEffectiveWeight(1).play();
    // El fundido va del saliente al entrante: sin él, cambiar de clip da un
    // salto de pose (el pie que estaba atrás aparece delante de un frame al
    // siguiente). 0,25 s es lo que tarda en leerse como transición y no como
    // retardo.
    if (currentAction) currentAction.crossFadeTo(next, FADE_SECONDS, false);
    currentAction = next;
  }

  function replay() {
    if (!currentAction) return;
    applyLoopMode(currentAction);
    currentAction.reset().setEffectiveTimeScale(speed).play();
  }

  function load(url: string): Promise<CharacterInfo> {
    const token = ++loadToken;
    return new Promise((resolve, reject) => {
      loader.load(
        url,
        (gltf) => {
          if (token !== loadToken) return; // llegó tarde: ya hay otro modelo
          clearModel();

          const model = gltf.scene;

          // Normalizado: se mide la caja envolvente, se escala a una altura
          // fija y se recoloca para que los pies toquen el suelo y el centro
          // caiga en el origen. Un .glb puede venir en metros, en centímetros
          // o descentrado, y sin esto cada modelo aparecería a un tamaño y en
          // un sitio distintos.
          const box = new THREE.Box3().setFromObject(model);
          const size = new THREE.Vector3();
          const center = new THREE.Vector3();
          box.getSize(size);
          box.getCenter(center);
          const scale = size.y > 0 ? TARGET_HEIGHT / size.y : 1;
          model.scale.setScalar(scale);
          model.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale);

          scene.add(model);
          current = model;

          mixer = new THREE.AnimationMixer(model);
          actions = new Map(gltf.animations.map((clip) => [clip.name, mixer!.clipAction(clip)]));

          let bones = 0;
          const materials = new Set<THREE.Material>();
          model.traverse((child) => {
            if ((child as THREE.Bone).isBone) bones++;
            const mat = (child as THREE.Mesh).material;
            if (mat) for (const m of Array.isArray(mat) ? mat : [mat]) materials.add(m);
          });

          resolve({
            clips: gltf.animations.map((clip) => clip.name),
            triangles: countTriangles(model),
            bones,
            materials: materials.size,
          });
        },
        undefined,
        (error) => {
          if (token === loadToken) reject(error);
        },
      );
    });
  }

  // --- Bucle de animación ---
  let raf = 0;
  let frames = 0;
  let lastReport = performance.now();

  function frame() {
    raf = requestAnimationFrame(frame);
    // getDelta() y no un contador propio: el mixer avanza en segundos reales,
    // así que la animación va a la misma velocidad en una pantalla de 60 Hz
    // que en una de 144.
    const delta = clock.getDelta();
    mixer?.update(delta);
    controls.update();
    renderer.render(scene, camera);

    frames++;
    const now = performance.now();
    if (now - lastReport >= 500) {
      callbacks.onStats?.({
        fps: Math.round((frames * 1000) / (now - lastReport)),
        calls: renderer.info.render.calls,
      });
      frames = 0;
      lastReport = now;
    }
  }
  raf = requestAnimationFrame(frame);

  const resizeObserver = new ResizeObserver((entries) => {
    const entry = entries[0];
    if (!entry) return;
    const { width: w, height: h } = entry.contentRect;
    if (!w || !h) return;
    width = w;
    height = h;
    applySize();
  });
  resizeObserver.observe(container);

  function destroy() {
    cancelAnimationFrame(raf);
    resizeObserver.disconnect();
    controls.dispose();
    clearModel();
    renderer.dispose();
    if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement);
  }

  return {
    load,
    playClip,
    replay,
    setSpeed: (value) => {
      speed = value;
      currentAction?.setEffectiveTimeScale(value);
    },
    setLoopMode: (mode) => {
      loopMode = mode;
      if (currentAction) {
        applyLoopMode(currentAction);
        currentAction.reset().play();
      }
    },
    setView,
    destroy,
  };
}
