import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { XMarkIcon } from './icons/Icons';

interface Belotin3DModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

interface FaceDefinition {
  name: string;
  symbol: string;
  color: string;
  // Euler rotation (x, y, z) that places this face facing top-front towards the camera
  landingRotation: [number, number, number];
}

const FACES: FaceDefinition[] = [
  { name: 'Carreau', symbol: '♦', color: '#dc2626', landingRotation: [0.35, -Math.PI / 2 + 0.25, 0] },     // +X
  { name: 'Pique', symbol: '♠', color: '#1e293b', landingRotation: [0.35, Math.PI / 2 + 0.25, 0] },        // -X
  { name: 'Cœur', symbol: '♥', color: '#dc2626', landingRotation: [Math.PI / 2 + 0.35, 0, 0.25] },         // +Y
  { name: 'Trèfle', symbol: '♣', color: '#1e293b', landingRotation: [-Math.PI / 2 + 0.35, 0, 0.25] },      // -Y
  { name: 'Sans Atout', symbol: 'SA', color: '#4338ca', landingRotation: [0.35, 0.25, 0] },                 // +Z
  { name: 'Tout Atout', symbol: 'TA', color: '#4338ca', landingRotation: [0.35, Math.PI + 0.25, 0] },      // -Z
];

// Procedural sound effect for wooden dice bouncing
const playWoodKnock = (volume = 0.25) => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120 + Math.random() * 40, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.07);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch {
    // Ignore audio autoplay restrictions
  }
};

// Procedural realistic beech wood texture generator with card symbols
function createDiceFaceTexture(faceIndex: number): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // 1. Base light beech/oak wood color
  ctx.fillStyle = '#edd8bd';
  ctx.fillRect(0, 0, size, size);

  // 2. Natural wood grain lines
  ctx.lineWidth = 1.5;
  for (let y = 0; y < size; y += 4) {
    const wave = Math.sin(y * 0.03 + faceIndex) * 12 + Math.cos(y * 0.07) * 6;
    const alpha = 0.04 + Math.random() * 0.09;
    ctx.strokeStyle = `rgba(146, 96, 50, ${alpha})`;
    ctx.beginPath();
    ctx.moveTo(0, y + wave);
    ctx.bezierCurveTo(
      size * 0.33, y + wave + (Math.random() - 0.5) * 8,
      size * 0.66, y + wave + (Math.random() - 0.5) * 8,
      size, y + wave
    );
    ctx.stroke();
  }

  // 3. Fine wood pores & fiber flecks
  ctx.fillStyle = 'rgba(110, 70, 35, 0.12)';
  for (let i = 0; i < 350; i++) {
    const px = Math.random() * size;
    const py = Math.random() * size;
    ctx.fillRect(px, py, 1.5 + Math.random() * 3, 1 + Math.random());
  }

  // 4. Subtle bevel edge vignette
  const vignette = ctx.createRadialGradient(size / 2, size / 2, size * 0.35, size / 2, size / 2, size * 0.7);
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vignette.addColorStop(1, 'rgba(120, 80, 40, 0.22)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, size, size);

  // 5. Draw Card Symbol according to face index
  const cx = size / 2;
  const cy = size / 2;

  switch (faceIndex) {
    case 0: // +X: Carreau (♦)
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.moveTo(cx, cy - 110);
      ctx.lineTo(cx + 80, cy);
      ctx.lineTo(cx, cy + 110);
      ctx.lineTo(cx - 80, cy);
      ctx.closePath();
      ctx.fill();
      break;

    case 1: // -X: Pique (♠)
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(cx, cy - 110);
      ctx.bezierCurveTo(cx - 15, cy - 60, cx - 95, cy - 20, cx - 95, cy + 30);
      ctx.bezierCurveTo(cx - 95, cy + 70, cx - 45, cy + 80, cx, cy + 45);
      ctx.bezierCurveTo(cx + 45, cy + 80, cx + 95, cy + 70, cx + 95, cy + 30);
      ctx.bezierCurveTo(cx + 95, cy - 20, cx + 15, cy - 60, cx, cy - 110);
      ctx.fill();
      // Stem
      ctx.beginPath();
      ctx.moveTo(cx - 15, cy + 40);
      ctx.lineTo(cx - 35, cy + 105);
      ctx.lineTo(cx + 35, cy + 105);
      ctx.lineTo(cx + 15, cy + 40);
      ctx.closePath();
      ctx.fill();
      break;

    case 2: // +Y: Cœur (♥)
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.moveTo(cx, cy + 95);
      ctx.bezierCurveTo(cx - 10, cy + 60, cx - 95, cy + 10, cx - 95, cy - 40);
      ctx.bezierCurveTo(cx - 95, cy - 95, cx - 30, cy - 95, cx, cy - 45);
      ctx.bezierCurveTo(cx + 30, cy - 95, cx + 95, cy - 95, cx + 95, cy - 40);
      ctx.bezierCurveTo(cx + 95, cy + 10, cx + 10, cy + 60, cx, cy + 95);
      ctx.fill();
      break;

    case 3: // -Y: Trèfle (♣)
      ctx.fillStyle = '#1e293b';
      // 3 circles
      ctx.beginPath();
      ctx.arc(cx, cy - 45, 50, 0, Math.PI * 2);
      ctx.arc(cx - 50, cy + 20, 50, 0, Math.PI * 2);
      ctx.arc(cx + 50, cy + 20, 50, 0, Math.PI * 2);
      ctx.fill();
      // Stem
      ctx.beginPath();
      ctx.moveTo(cx - 15, cy + 20);
      ctx.lineTo(cx - 35, cy + 105);
      ctx.lineTo(cx + 35, cy + 105);
      ctx.lineTo(cx + 15, cy + 20);
      ctx.closePath();
      ctx.fill();
      break;

    case 4: // +Z: Sans Atout (SA)
      ctx.strokeStyle = '#4338ca';
      ctx.lineWidth = 10;
      ctx.strokeRect(cx - 100, cy - 100, 200, 200);
      ctx.fillStyle = '#312e81';
      ctx.font = '900 88px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('SA', cx, cy - 10);
      ctx.font = '700 22px system-ui, sans-serif';
      ctx.fillStyle = '#4f46e5';
      ctx.fillText('SANS ATOUT', cx, cy + 55);
      break;

    case 5: // -Z: Tout Atout (TA)
      ctx.strokeStyle = '#4338ca';
      ctx.lineWidth = 10;
      ctx.strokeRect(cx - 100, cy - 100, 200, 200);
      ctx.fillStyle = '#312e81';
      ctx.font = '900 88px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('TA', cx, cy - 10);
      ctx.font = '700 22px system-ui, sans-serif';
      ctx.fillStyle = '#4f46e5';
      ctx.fillText('TOUT ATOUT', cx, cy + 55);
      break;
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export const Belotin3DModal: React.FC<Belotin3DModalProps> = ({ isOpen, onClose, title = 'Tirage du Belotin' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [resultFace, setResultFace] = useState<FaceDefinition | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  // Mutable refs to control 3D animation loop without re-creating scene
  const animStateRef = useRef({
    targetRotation: new THREE.Euler(),
    currentRotation: new THREE.Euler(),
    posY: 2.2,
    velocityY: 0,
    startTime: 0,
    isRolling: false,
    bouncesLeft: 3,
    triggerRoll: () => {},
  });

  const rollDice = useCallback(() => {
    // Choose random face outcome
    const chosenIndex = Math.floor(Math.random() * FACES.length);
    const chosen = FACES[chosenIndex];

    const state = animStateRef.current;
    state.isRolling = true;
    state.startTime = performance.now();
    state.posY = 2.4;
    state.velocityY = 0;
    state.bouncesLeft = 3;

    // Multiple full revolutions (e.g. 2 to 4 full spins) before settling on target Euler
    const fullSpinsX = (Math.floor(Math.random() * 2) + 2) * Math.PI * 2;
    const fullSpinsY = (Math.floor(Math.random() * 3) + 2) * Math.PI * 2;
    const fullSpinsZ = (Math.floor(Math.random() * 2) + 1) * Math.PI * 2;

    state.targetRotation.set(
      chosen.landingRotation[0] + fullSpinsX,
      chosen.landingRotation[1] + fullSpinsY,
      chosen.landingRotation[2] + fullSpinsZ
    );

    setIsRolling(true);
    setResultFace(null);

    // After deceleration (~2.2s), announce the result
    setTimeout(() => {
      setResultFace(chosen);
      setIsRolling(false);
      state.isRolling = false;
    }, 2200);
  }, []);

  useEffect(() => {
    animStateRef.current.triggerRoll = rollDice;
  }, [rollDice]);

  useEffect(() => {
    if (!isOpen || !mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth || 380;
    const height = container.clientHeight || 340;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = null; // transparent canvas

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 2.1, 4.3);
    camera.lookAt(0, 0.2, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 2. Room Environment Reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 3. Lighting: Warm Key Light + Cool Hemisphere Fill
    const keyLight = new THREE.DirectionalLight('#fff5ea', 2.8);
    keyLight.position.set(2.5, 4.5, 3.5);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight('#67e8f9', '#1e293b', 1.0);
    scene.add(hemiLight);

    const fillLight = new THREE.DirectionalLight('#c7d2fe', 1.2);
    fillLight.position.set(-3, 2, 2);
    scene.add(fillLight);

    // 4. Contact Shadow Plane underneath the die
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sctx = shadowCanvas.getContext('2d')!;
    const grad = sctx.createRadialGradient(128, 128, 10, 128, 128, 110);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
    grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.25)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sctx.fillStyle = grad;
    sctx.fillRect(0, 0, 256, 256);

    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(3.6, 3.6);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -0.78;
    scene.add(shadowMesh);

    // 5. Belotin Die Geometry & Materials
    const textures = [0, 1, 2, 3, 4, 5].map((i) => {
      const tex = createDiceFaceTexture(i);
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      return tex;
    });

    const materials = textures.map(
      (map) =>
        new THREE.MeshStandardMaterial({
          map,
          roughness: 0.58,
          metalness: 0.04,
        })
    );

    // Rounded box die with smooth beveled corners - enlarged size
    const diceSize = 1.55;
    const bevelRadius = 0.24;
    const dieGeometry = new RoundedBoxGeometry(diceSize, diceSize, diceSize, 8, bevelRadius);
    const dieMesh = new THREE.Mesh(dieGeometry, materials);
    dieMesh.castShadow = !isSoftwareGl;
    dieMesh.receiveShadow = !isSoftwareGl;

    const diceGroup = new THREE.Group();
    diceGroup.add(dieMesh);
    scene.add(diceGroup);

    // Initial state
    const state = animStateRef.current;
    state.currentRotation.set(0.5, 0.6, 0.2);
    diceGroup.rotation.copy(state.currentRotation);
    diceGroup.position.y = state.posY;

    // Trigger initial roll immediately
    rollDice();

    // 6. Animation Loop with Physics & Smooth Damping
    let frameId = 0;
    let lastTime = performance.now();

    const animate = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      if (state.isRolling) {
        // Physical vertical bounce
        state.velocityY -= 14.0 * delta; // gravity
        state.posY += state.velocityY * delta;

        // Ground collision
        const groundY = 0;
        if (state.posY <= groundY) {
          state.posY = groundY;
          if (state.bouncesLeft > 0) {
            state.velocityY = -state.velocityY * 0.45; // bounce restitution
            playWoodKnock(0.2 + state.bouncesLeft * 0.08);
            state.bouncesLeft--;
          } else {
            state.velocityY = 0;
          }
        }

        // Tumble rotation towards target landing angle with easing
        const progress = Math.min((time - state.startTime) / 2000, 1.0);
        // Ease-out cubic
        const factor = 1 - Math.pow(1 - progress, 3);

        diceGroup.rotation.x = THREE.MathUtils.lerp(diceGroup.rotation.x, state.targetRotation.x, factor * 0.12 + 0.02);
        diceGroup.rotation.y = THREE.MathUtils.lerp(diceGroup.rotation.y, state.targetRotation.y, factor * 0.12 + 0.02);
        diceGroup.rotation.z = THREE.MathUtils.lerp(diceGroup.rotation.z, state.targetRotation.z, factor * 0.12 + 0.02);
      } else {
        // Idle gentle float and settle
        diceGroup.position.y = THREE.MathUtils.damp(diceGroup.position.y, 0, 8, delta);
        diceGroup.rotation.x = THREE.MathUtils.damp(diceGroup.rotation.x, state.targetRotation.x, 6, delta);
        diceGroup.rotation.y = THREE.MathUtils.damp(diceGroup.rotation.y, state.targetRotation.y, 6, delta);
        diceGroup.rotation.z = THREE.MathUtils.damp(diceGroup.rotation.z, state.targetRotation.z, 6, delta);
      }

      diceGroup.position.y = state.posY;

      // Scale shadow with dice height
      const shadowScale = THREE.MathUtils.lerp(1.2, 0.6, Math.min(state.posY / 2.5, 1));
      shadowMesh.scale.set(shadowScale, shadowScale, 1);
      shadowMat.opacity = THREE.MathUtils.lerp(0.75, 0.25, Math.min(state.posY / 2.5, 1));

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      dieGeometry.dispose();
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
      shadowGeo.dispose();
      shadowMat.dispose();
      shadowTexture.dispose();
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isOpen, rollDice]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in-fast"
      role="dialog"
      aria-modal="true"
      aria-labelledby="belotin-title"
    >
      <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-700/80 overflow-hidden relative flex flex-col items-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700 transition z-10"
          aria-label="Fermer"
        >
          <XMarkIcon />
        </button>

        {/* Header with Title */}
        <div className="w-full pt-5 px-10 pb-1 flex flex-col items-center justify-center text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-gray-300 text-lg">♠</span>
            <span className="text-red-500 text-lg">♥</span>
            <span className="text-red-500 text-lg">♦</span>
            <span className="text-gray-300 text-lg">♣</span>
          </div>
          <h1 
            id="belotin-title"
            className="text-[20px] font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-300 to-amber-300 drop-shadow-[0_0_14px_rgba(239,68,68,0.5)] animate-pulse inline-block hover:scale-[1.03] transition-all duration-300 cursor-default"
          >
            Belotin Compteur pour Coinche
          </h1>
        </div>

        {/* 3D WebGL Canvas Viewport */}
        <div
          ref={mountRef}
          onClick={!isRolling ? rollDice : undefined}
          title={!isRolling ? 'Cliquez pour relancer le dé !' : ''}
          className="w-full h-80 sm:h-96 flex items-center justify-center cursor-pointer relative"
        >
          {/* Subtle felt table surface under the die */}
          <div className="absolute inset-x-8 bottom-6 h-12 bg-emerald-950/40 rounded-full blur-xl -z-10 pointer-events-none" />
        </div>

        {/* Action button: Continuer */}
        <div className="w-full px-6 pb-5 pt-2 text-center flex flex-col items-center gap-2">
          <button
            onClick={onClose}
            className="w-full sm:w-auto min-w-[200px] px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-base rounded-xl shadow-xl transition active:scale-95"
          >
            Continuer
          </button>
          <span className="text-[11px] font-medium text-slate-500 tracking-wider">
            ©JuraBrain
          </span>
        </div>
      </div>
    </div>
  );
};
