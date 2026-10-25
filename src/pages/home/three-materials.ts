import * as THREE from 'three';

export function detectSoftwareGl(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

function finalizeCanvasTexture(
  canvas: HTMLCanvasElement,
  maxAnisotropy: number
): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  tex.needsUpdate = true;
  return tex;
}

export function createNadiLogoTexture(maxAnisotropy = 4): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 192;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#FAF6EE';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = '800 116px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#18181B';
  ctx.textBaseline = 'middle';
  ctx.fillText('nadi', 95, 100);

  // Orange dot
  ctx.fillStyle = '#E8612C';
  ctx.beginPath();
  ctx.arc(378, 124, 16, 0, Math.PI * 2);
  ctx.fill();

  return finalizeCanvasTexture(canvas, maxAnisotropy);
}

export function createOrangeBannerTexture(
  maxAnisotropy = 4
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#E8612C';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(46, 56, 18, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 32px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Rawat', 34, 125);
  ctx.fillText('Pulih', 34, 168);
  ctx.fillText('Bahagia', 34, 211);

  return finalizeCanvasTexture(canvas, maxAnisotropy);
}

export function createEmergencyCanopyTexture(
  maxAnisotropy = 4
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#FAF6EE';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Green emergency cross circle
  ctx.fillStyle = '#10B981';
  ctx.beginPath();
  ctx.arc(64, 64, 34, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(56, 42, 16, 44);
  ctx.fillRect(42, 56, 44, 16);

  ctx.fillStyle = '#18181B';
  ctx.font = '800 34px "Plus Jakarta Sans", sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText('Gawat Darurat 24 Jam', 118, 66);

  return finalizeCanvasTexture(canvas, maxAnisotropy);
}

export function createRoomSignTexture(
  label: string,
  bgColor = '#E8612C',
  textColor = '#FFFFFF',
  hasPlus = true,
  maxAnisotropy = 4
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let startX = 36;
  if (hasPlus) {
    ctx.fillStyle = textColor;
    ctx.fillRect(44, 42, 12, 44);
    ctx.fillRect(28, 58, 44, 12);
    startX = 92;
  }

  ctx.fillStyle = textColor;
  ctx.font = '800 40px "Plus Jakarta Sans", sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, startX, 66);

  return finalizeCanvasTexture(canvas, maxAnisotropy);
}

export function createQueueScreenTexture(
  queueCode = 'A-012',
  loket = '2',
  maxAnisotropy = 4
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#18181B';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#A1A1AA';
  ctx.font = '700 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('NOMOR ANTREAN', 34, 58);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 84px "JetBrains Mono", monospace';
  ctx.fillText(queueCode, 34, 152);

  ctx.fillStyle = '#E8612C';
  ctx.beginPath();
  ctx.roundRect(350, 48, 128, 156, 20);
  ctx.fill();

  ctx.fillStyle = '#FFE4D6';
  ctx.font = '700 20px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('LOKET', 414, 92);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 68px "JetBrains Mono", monospace';
  ctx.fillText(loket, 414, 166);

  return finalizeCanvasTexture(canvas, maxAnisotropy);
}

export function createVitalsTagTexture(maxAnisotropy = 4): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#18181B';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#10B981';
  ctx.font = '700 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('TENSI NORMAL', 24, 42);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 48px "JetBrains Mono", monospace';
  ctx.fillText('118/76', 24, 98);

  return finalizeCanvasTexture(canvas, maxAnisotropy);
}

export function createFloatingInfoBadgeTexture(
  label: string,
  category: 'health-tip' | 'directory',
  maxAnisotropy = 4
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 144;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const isTip = category === 'health-tip';
  const accentColor = isTip ? '#10B981' : '#E8612C';

  // Pill background
  ctx.fillStyle = '#18181B';
  ctx.beginPath();
  ctx.roundRect(8, 12, 496, 120, 60);
  ctx.fill();

  // Accent border
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.roundRect(11, 15, 490, 114, 57);
  ctx.stroke();

  // Left circular icon badge
  ctx.fillStyle = accentColor;
  ctx.beginPath();
  ctx.arc(72, 72, 40, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  if (isTip) {
    // Medical cross icon for Health Tip
    ctx.fillRect(64, 48, 16, 48);
    ctx.fillRect(48, 64, 48, 16);
  } else {
    // 'i' info icon for Directory
    ctx.beginPath();
    ctx.arc(72, 50, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(65, 64, 14, 34);
  }

  // Category kicker
  ctx.fillStyle = isTip ? '#6EE7B7' : '#FDBA74';
  ctx.font = '800 18px "Plus Jakarta Sans", sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText(isTip ? 'KLIK · TIPS KESEHATAN' : 'KLIK · DIREKTORI RS', 132, 50);

  // Main label
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 28px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(label, 132, 90);

  return finalizeCanvasTexture(canvas, maxAnisotropy);
}

export interface HospitalMaterialSet {
  creamWall: THREE.MeshStandardMaterial;
  warmFloor: THREE.MeshStandardMaterial;
  peachBorder: THREE.MeshStandardMaterial;
  terracotta: THREE.MeshStandardMaterial;
  darkCharcoal: THREE.MeshStandardMaterial;
  windowGlass: THREE.MeshPhysicalMaterial;
  warmWindowGlow: THREE.MeshStandardMaterial;
  woodDesk: THREE.MeshStandardMaterial;
  whiteCoat: THREE.MeshStandardMaterial;
  emeraldAccent: THREE.MeshStandardMaterial;
  asphaltRoad: THREE.MeshStandardMaterial;
  roadStripe: THREE.MeshStandardMaterial;
  foliageGreen: THREE.MeshStandardMaterial;
  foliageLight: THREE.MeshStandardMaterial;
  treeBark: THREE.MeshStandardMaterial;
  pathOrange: THREE.MeshStandardMaterial;
  metalChrome: THREE.MeshStandardMaterial;
  contactShadowMat: THREE.MeshBasicMaterial;
}

export function createHospitalMaterials(
  isSoftwareGl: boolean
): HospitalMaterialSet {
  // Soft radial shadow texture
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 128;
  shadowCanvas.height = 128;
  const sctx = shadowCanvas.getContext('2d')!;
  const grad = sctx.createRadialGradient(64, 64, 8, 64, 64, 60);
  grad.addColorStop(0, 'rgba(24, 20, 16, 0.36)');
  grad.addColorStop(0.6, 'rgba(24, 20, 16, 0.14)');
  grad.addColorStop(1, 'rgba(24, 20, 16, 0)');
  sctx.fillStyle = grad;
  sctx.fillRect(0, 0, 128, 128);
  const shadowTex = new THREE.CanvasTexture(shadowCanvas);

  return {
    creamWall: new THREE.MeshStandardMaterial({
      color: 0xf7f2e7,
      roughness: 0.72,
      metalness: 0.04,
    }),
    warmFloor: new THREE.MeshStandardMaterial({
      color: 0xf5dfc8,
      roughness: 0.62,
      metalness: 0.05,
    }),
    peachBorder: new THREE.MeshStandardMaterial({
      color: 0xe87a48,
      roughness: 0.48,
      metalness: 0.08,
    }),
    terracotta: new THREE.MeshStandardMaterial({
      color: 0xe8612c,
      roughness: 0.48,
      metalness: 0.08,
    }),
    darkCharcoal: new THREE.MeshStandardMaterial({
      color: 0x202024,
      roughness: 0.35,
      metalness: 0.25,
    }),
    windowGlass: new THREE.MeshPhysicalMaterial({
      color: 0x384148,
      roughness: 0.15,
      metalness: 0.15,
      clearcoat: isSoftwareGl ? 0 : 0.8,
      transparent: true,
      opacity: 0.88,
    }),
    warmWindowGlow: new THREE.MeshStandardMaterial({
      color: 0xfff3d6,
      emissive: 0xffd599,
      emissiveIntensity: 0.35,
      roughness: 0.3,
    }),
    woodDesk: new THREE.MeshStandardMaterial({
      color: 0xd9a16c,
      roughness: 0.55,
      metalness: 0.06,
    }),
    whiteCoat: new THREE.MeshStandardMaterial({
      color: 0xfaf8f5,
      roughness: 0.6,
      metalness: 0.05,
    }),
    emeraldAccent: new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.4,
      metalness: 0.1,
    }),
    asphaltRoad: new THREE.MeshStandardMaterial({
      color: 0x272523,
      roughness: 0.85,
      metalness: 0.05,
    }),
    roadStripe: new THREE.MeshStandardMaterial({
      color: 0xfaf7f0,
      roughness: 0.5,
      metalness: 0.0,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    }),
    foliageGreen: new THREE.MeshStandardMaterial({
      color: 0x3f6e43,
      roughness: 0.75,
      metalness: 0.02,
    }),
    foliageLight: new THREE.MeshStandardMaterial({
      color: 0x5c8d57,
      roughness: 0.7,
      metalness: 0.02,
    }),
    treeBark: new THREE.MeshStandardMaterial({
      color: 0x6e4f3a,
      roughness: 0.85,
      metalness: 0.02,
    }),
    pathOrange: new THREE.MeshStandardMaterial({
      color: 0xe8612c,
      emissive: 0xe8612c,
      emissiveIntensity: 0.22,
      roughness: 0.35,
      metalness: 0.05,
    }),
    metalChrome: new THREE.MeshStandardMaterial({
      color: 0xd4d4d8,
      roughness: 0.25,
      metalness: 0.75,
    }),
    contactShadowMat: new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.85,
    }),
  };
}
