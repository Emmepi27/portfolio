import * as THREE from "three";

export type SceneContext = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  dispose: () => void;
};

export function initScene(options: {
  canvas: HTMLCanvasElement;
  container?: Element;
  dprCap?: number;
}): SceneContext {
  const { canvas, container, dprCap = 1.5 } = options;
  const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, dprCap);

  const scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  const dir = new THREE.DirectionalLight(0xffffff, 0.9);
  dir.position.set(2, 3, 4);
  scene.add(dir);
  const fill = new THREE.DirectionalLight(0xffffff, 0.25);
  fill.position.set(-2, 1.5, 2.5);
  scene.add(fill);

  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  // FIX DIMENSIONI GIGANTI: Indietreggiamo la telecamera per vederle tutte 
  camera.position.z = 6.5;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const setSize = (w: number, h: number) => {
    const width = Math.max(1, w);
    const height = Math.max(1, h);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  };

  const roTarget = (container ?? canvas) as Element;
  const width = roTarget === canvas ? canvas.clientWidth || 1 : (roTarget as HTMLElement).clientWidth || 1;
  const height = roTarget === canvas ? canvas.clientHeight || 1 : (roTarget as HTMLElement).clientHeight || 1;
  setSize(width, height);

  const resizeObserver = new ResizeObserver((entries) => {
    const entry = entries[0];
    if (!entry) return;
    const { width: w, height: h } = entry.contentRect;
    setSize(w, h);
  });
  resizeObserver.observe(roTarget);

  const dispose = () => {
    resizeObserver.disconnect();
    renderer.dispose();
  };

  return { scene, camera, renderer, dispose };
}

function createPlaceholderTexture(): THREE.Texture {
  const tex = new THREE.DataTexture(new Uint8Array([40, 40, 40, 255]), 1, 1);
  tex.needsUpdate = true;
  return tex;
}

export function loadTexture(
  url: string,
  onLoad?: (tex: THREE.Texture) => void
): THREE.Texture {
  const loader = new THREE.TextureLoader();
  const tex = loader.load(
    url,
    (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.needsUpdate = true;
      onLoad?.(t);
    },
    undefined,
    () => {
      const placeholder = createPlaceholderTexture();
      onLoad?.(placeholder);
    }
  );
  return tex;
}