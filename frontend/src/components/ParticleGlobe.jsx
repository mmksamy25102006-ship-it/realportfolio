import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  LAND_MASK_BASE64,
  LAND_MASK_WIDTH,
  LAND_MASK_HEIGHT,
} from "../data/landMask";

const globeParticleVertex = `
attribute float a_size;
attribute float a_layer;

uniform float u_time;
uniform float u_pointSize;

varying float v_layer;
varying float v_face;

void main() {
  vec3 pos = position;
  float breathe = 1.0 + sin(u_time * 0.65 + a_layer * 4.0) * 0.012;
  pos *= breathe;

  vec4 worldPos = modelMatrix * vec4(pos, 1.0);
  v_face = mix(0.16, 1.0, smoothstep(-0.75, 0.55, worldPos.z));

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = u_pointSize * a_size * (1.0 / max(0.18, -mvPosition.z));
  gl_Position = projectionMatrix * mvPosition;

  v_layer = a_layer;
}
`;

const globeParticleFragment = `
precision highp float;

uniform vec3 u_coreColor;
uniform vec3 u_accentColor;

varying float v_layer;
varying float v_face;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  float alpha = smoothstep(0.5, 0.0, d);
  alpha *= alpha;

  vec3 color = mix(u_coreColor, u_accentColor, smoothstep(0.2, 1.0, v_layer));

  gl_FragColor = vec4(color, alpha * v_face);
}
`;

let cachedMask = null;

function getLandMask() {
  if (cachedMask) return cachedMask;

  const binary = atob(LAND_MASK_BASE64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  cachedMask = {
    bytes,
    width: LAND_MASK_WIDTH,
    height: LAND_MASK_HEIGHT,
  };
  return cachedMask;
}

function isLand(lat, lon, mask) {
  const u = (lon + Math.PI) / (Math.PI * 2);
  const v = (Math.PI / 2 - lat) / Math.PI;

  let x = Math.floor(u * mask.width);
  let y = Math.floor(v * mask.height);

  x = ((x % mask.width) + mask.width) % mask.width;
  if (y < 0) y = 0;
  if (y >= mask.height) y = mask.height - 1;

  const index = y * mask.width + x;
  const byte = mask.bytes[index >> 3];
  return (byte & (1 << (7 - (index & 7)))) !== 0;
}

function buildLandPoints(count, options = {}) {
  const mask = getLandMask();
  const radius = options.radius || 1.35;
  const points = [];
  let guard = count * 80;

  while (points.length < count && guard-- > 0) {
    const sinLat = Math.random() * 2 - 1;
    const lat = Math.asin(sinLat);
    const lon = Math.random() * Math.PI * 2 - Math.PI;

    if (!isLand(lat, lon, mask)) continue;

    const cosLat = Math.cos(lat);
    const r = radius * (1 + (Math.random() - 0.5) * 0.015);

    points.push({
      x: Math.cos(lon) * cosLat * r,
      y: sinLat * r,
      z: Math.sin(lon) * cosLat * r,
      size: 0.55 + Math.random() * 0.65,
      layer: Math.random(),
    });
  }

  return points;
}

function createControlState(options = {}) {
  return {
    rotX: options.tiltX ?? 0.32,
    rotY: 0,
    rotZ: options.tiltZ ?? 0.1,
    velX: 0,
    velY: 0,
    dragging: false,
    lastX: 0,
    lastY: 0,
    pointerX: 0,
    pointerY: 0,
    autoSpeed: options.rotationSpeed ?? 0.12,
  };
}

function bindPointerControls(canvas, state) {
  function handleDown(event) {
    state.dragging = true;
    state.lastX = event.clientX;
    state.lastY = event.clientY;
    state.velX = 0;
    state.velY = 0;
    try {
      canvas.setPointerCapture(event.pointerId);
    } catch {
      /* ignore */
    }
  }

  function handleMove(event) {
    if (state.dragging) {
      const dx = event.clientX - state.lastX;
      const dy = event.clientY - state.lastY;
      state.lastX = event.clientX;
      state.lastY = event.clientY;

      state.rotY += dx * 0.005;
      state.rotX += dy * 0.004;
      state.velY = dx * 0.004;
      state.velX = dy * 0.003;
    } else {
      const rect = canvas.getBoundingClientRect();
      state.pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      state.pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    }
  }

  function handleUp(event) {
    state.dragging = false;
    try {
      canvas.releasePointerCapture(event.pointerId);
    } catch {
      /* ignore */
    }
  }

  canvas.addEventListener("pointerdown", handleDown);
  canvas.addEventListener("pointermove", handleMove);
  canvas.addEventListener("pointerup", handleUp);
  canvas.addEventListener("pointercancel", handleUp);

  return () => {
    canvas.removeEventListener("pointerdown", handleDown);
    canvas.removeEventListener("pointermove", handleMove);
    canvas.removeEventListener("pointerup", handleUp);
    canvas.removeEventListener("pointercancel", handleUp);
  };
}

function stepRotation(state, reduceMotion) {
  if (!state.dragging && !reduceMotion) {
    state.rotY += state.velY + state.autoSpeed * 0.016;
    state.rotX += state.velX;
    state.velY *= 0.94;
    state.velX *= 0.94;
  }

  if (state.rotX > 0.85) state.rotX = 0.85;
  if (state.rotX < -0.85) state.rotX = -0.85;
}

function hexToColor3(hex) {
  const clean = hex.replace("#", "").trim();
  const value =
    clean.length === 3
      ? clean.split("").map((char) => char + char).join("")
      : clean;

  return new THREE.Color(
    parseInt(value.slice(0, 2), 16) / 255,
    parseInt(value.slice(2, 4), 16) / 255,
    parseInt(value.slice(4, 6), 16) / 255
  );
}

function canUseWebGL() {
  try {
    const test = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (test.getContext("webgl2") ||
        test.getContext("webgl") ||
        test.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

function initGlobeParticles(canvas, options = {}) {
  if (!canvas) return () => {};

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio || 1, options.maxDpr || 1.6)
  );
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0, options.cameraDistance || 5.6);

  const points = buildLandPoints(options.landCount || 8000, options);
  const positions = new Float32Array(points.length * 3);
  const sizes = new Float32Array(points.length);
  const layers = new Float32Array(points.length);

  points.forEach((point, i) => {
    positions[i * 3] = point.x;
    positions[i * 3 + 1] = point.y;
    positions[i * 3 + 2] = point.z;
    sizes[i] = point.size;
    layers[i] = point.layer;
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("a_size", new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute("a_layer", new THREE.BufferAttribute(layers, 1));

  const accent = options.accentColor
    ? new THREE.Color(options.accentColor)
    : hexToColor3("#ff2d2d");

  const material = new THREE.ShaderMaterial({
    vertexShader: globeParticleVertex,
    fragmentShader: globeParticleFragment,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      u_time: { value: 0 },
      u_pointSize: { value: options.pointSize || 15 },
      u_coreColor: { value: new THREE.Color(options.coreColor || 0xffe6e6) },
      u_accentColor: { value: accent },
    },
  });

  const particleSystem = new THREE.Points(geometry, material);
  scene.add(particleSystem);

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const state = createControlState(options);
  const unbind = bindPointerControls(canvas, state);
  let rafId = 0;

  function resize() {
    const width = Math.max(1, canvas.clientWidth);
    const height = Math.max(1, canvas.clientHeight);
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, options.maxDpr || 1.6)
    );
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function render(time = 0) {
    const t = time * 0.001;
    material.uniforms.u_time.value = t;

    stepRotation(state, reduceMotion);

    const breath = reduceMotion ? 0 : Math.sin(t * 0.55) * 0.02;

    particleSystem.rotation.set(
      state.rotX + state.pointerY * 0.05,
      state.rotY + state.pointerX * 0.05,
      state.rotZ
    );
    particleSystem.scale.setScalar(1 + breath);

    renderer.render(scene, camera);
    rafId = requestAnimationFrame(render);
  }

  function handleResize() {
    resize();
  }

  resize();
  render();
  window.addEventListener("resize", handleResize);

  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener("resize", handleResize);
    unbind();
    geometry.dispose();
    material.dispose();
    renderer.dispose();
  };
}

function mixColor(layer, core, accent) {
  const t = Math.max(0, Math.min(1, (layer - 0.2) / (1 - 0.2)));
  const r = Math.round(core.r + (accent.r - core.r) * t);
  const g = Math.round(core.g + (accent.g - core.g) * t);
  const b = Math.round(core.b + (accent.b - core.b) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

function initGlobeFallback(canvas, options = {}) {
  if (!canvas) return () => {};

  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  const core = { r: 255, g: 230, b: 230 };
  const accent = { r: 255, g: 45, b: 45 };
  const points = buildLandPoints(options.fallbackLandCount || 4500, options);
  const coloredPoints = points.map((point) => ({
    ...point,
    color: mixColor(point.layer, core, accent),
  }));

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const state = createControlState(options);
  const unbind = bindPointerControls(canvas, state);

  const cameraDistance = options.cameraDistance || 5.6;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let width = 1;
  let height = 1;
  let rafId = 0;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, rect.width || canvas.clientWidth);
    height = Math.max(1, rect.height || canvas.clientHeight);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function draw(time = 0) {
    const t = time * 0.001;

    stepRotation(state, reduceMotion);

    const rotX = state.rotX + state.pointerY * 0.05;
    const rotY = state.rotY + state.pointerX * 0.05;
    const rotZ = state.rotZ;
    const breath = reduceMotion ? 1 : 1 + Math.sin(t * 0.55) * 0.02;

    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    const cosZ = Math.cos(rotZ);
    const sinZ = Math.sin(rotZ);

    const cx = width / 2;
    const cy = height / 2;
    const focal = Math.min(width, height) * 1.45;

    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = "lighter";

    for (let i = 0; i < coloredPoints.length; i++) {
      const p = coloredPoints[i];

      const x0 = p.x * breath;
      const y0 = p.y * breath;
      const z0 = p.z * breath;

      const x1 = x0 * cosY + z0 * sinY;
      const z1 = -x0 * sinY + z0 * cosY;

      const y2 = y0 * cosX - z1 * sinX;
      const z2 = y0 * sinX + z1 * cosX;

      const x3 = x1 * cosZ - y2 * sinZ;
      const y3 = x1 * sinZ + y2 * cosZ;

      const face =
        0.16 +
        0.84 * Math.max(0, Math.min(1, (z2 + 0.75) / 1.3));

      const persp = focal / (cameraDistance - z2);
      const px = cx + x3 * persp;
      const py = cy - y3 * persp;
      const radius = Math.max(0.3, p.size * persp * 0.0095);

      if (
        px < -radius ||
        px > width + radius ||
        py < -radius ||
        py > height + radius
      ) {
        continue;
      }

      ctx.globalAlpha = face * 0.9;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(px, py, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";

    rafId = requestAnimationFrame(draw);
  }

  function handleResize() {
    resize();
  }

  resize();
  draw();
  window.addEventListener("resize", handleResize);

  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener("resize", handleResize);
    unbind();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
}

export default function ParticleGlobe() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const options = {
      landCount: 10000,
      fallbackLandCount: 6500,
      accentColor: "#ff2d2d",
      coreColor: 0xffe6e6,
      radius: 1.35,
      pointSize: 15,
      rotationSpeed: 0.12,
      tiltX: 0.32,
      tiltZ: 0.1,
    };

    function mountFallback() {
      const canvas = document.createElement("canvas");
      canvas.className = "particle-globe-canvas";
      container.appendChild(canvas);
      return {
        canvas,
        cleanup: initGlobeFallback(canvas, options),
      };
    }

    const webglCanvas = document.createElement("canvas");
    webglCanvas.className = "particle-globe-canvas";
    container.appendChild(webglCanvas);

    let activeCanvas = webglCanvas;
    let cleanup = () => {};

    if (canUseWebGL()) {
      try {
        cleanup = initGlobeParticles(webglCanvas, options);
      } catch {
        webglCanvas.remove();
        const fallback = mountFallback();
        activeCanvas = fallback.canvas;
        cleanup = fallback.cleanup;
      }
    } else {
      webglCanvas.remove();
      const fallback = mountFallback();
      activeCanvas = fallback.canvas;
      cleanup = fallback.cleanup;
    }

    return () => {
      cleanup();
      activeCanvas.remove();
    };
  }, []);

  return <div ref={containerRef} className="particle-globe" />;
}
