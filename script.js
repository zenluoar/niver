import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

// Konfigurasi
const CFG = {
  name1: "Sayangku",
  name2: "Cintaku",
  years: 6,
  startDate: new Date("2025-11-22T00:00:00"),
  targetDate: new Date("2026-5-22T00:00:00"), 
  message: `
    Happy Anniversary yang ke-<strong>6 bulan</strong>, sayang 🎉<br><br>
    ngga kerasa yaa udah 6 bulan hhe —<br>
    orang lain mah kyknya tiap tahun ngerayainnya :p<br>
    ini kita malah tiap bulan T_T<br><br>
    Makasih udah dateng dihidupku, makasih udah pilih aku<br>
    Sama aku terus yaa Meng :D<br><br>
    <em>I love you more than words can say.</em>
  `,
  photoUrls: [
    'https://i.pinimg.com/736x/4e/7a/1e/4e7a1edb2b5830208fd3084edd755d1e.jpg',
    'https://i.pinimg.com/736x/75/b6/6a/75b66a0621ae8e4e0e12da92bd40569c.jpg',
    'https://i.pinimg.com/736x/0c/85/55/0c85550beb728d479b0d023b95b86943.jpg',
    'https://i.pinimg.com/736x/6d/e3/50/6de350e3b58f8bd712a48bc57a3b5018.jpg'
  ]
};

// UI Setup
document.getElementById('msgTitle').textContent = `${CFG.name1} & ${CFG.name2}`;
document.getElementById('msgBody').innerHTML = CFG.message;

function pad(n, w) { return String(n).padStart(w, '0'); }

// Countup
function updateCountup() {
  const now = new Date();
  const start = CFG.startDate;
  const diff = now - start;
  
  if (diff < 0) {
    document.getElementById('cd-d').textContent = "000";
    document.getElementById('cd-h').textContent = "00";
    document.getElementById('cd-m').textContent = "00";
    document.getElementById('cd-s').textContent = "00";
    return;
  }
  
  // Hitung total detik
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  document.getElementById('cd-d').textContent = pad(days, 3);
  document.getElementById('cd-h').textContent = pad(hours, 2);
  document.getElementById('cd-m').textContent = pad(minutes, 2);
  document.getElementById('cd-s').textContent = pad(seconds, 2);
  
  // Cek apakah sudah mencapai target
  if (now >= CFG.targetDate) {
    document.getElementById('headerTitle').textContent = `Happy Anniversary ke-${CFG.years}`;
    document.getElementById('msgSub').textContent = `✦ ${CFG.years} Tahun yang Indah ✦`;
  } else {
    // Tampilkan tahun yang sudah berlalu (dalam desimal)
    const yearsElapsed = (diff / (1000 * 60 * 60 * 24 * 365)).toFixed(1);
    document.getElementById('headerTitle').textContent = ` Happy Anniversary ke-6 Bulan`;
    document.getElementById('msgSub').textContent = `✦ Menuju ${CFG.years} Bulan ✦`;
  }
}
updateCountup();
setInterval(updateCountup, 1000);

// Modal
const msgModal = document.getElementById('msgModal');
document.getElementById('ctaBtn').onclick = () => {
  msgModal.classList.add('open');
  launchFireworks(2);
};
document.getElementById('msgClose').onclick = () => msgModal.classList.remove('open');
msgModal.addEventListener('click', e => {
  if (e.target === msgModal) msgModal.classList.remove('open');
});

// Lightbox
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
function openLightbox(url) {
  lbImg.src = url;
  lightbox.classList.add('open');
}
lightbox.onclick = () => lightbox.classList.remove('open');

// Floating symbols
const symPool = ['♥', '✿', '❀', '♡', '✦', '·'];
const symColors = ['#ff8fa3', '#c084fc', '#ffd6e0', '#ff4d6d', '#f9a8d4'];
const floatLayer = document.getElementById('floatLayer');

function spawnSym() {
  const el = document.createElement('span');
  el.className = 'fsym';
  el.textContent = symPool[Math.floor(Math.random() * symPool.length)];
  const sz = 0.6 + Math.random() * 1.2;
  el.style.cssText = `left:${Math.random() * 100}vw;font-size:${sz}rem;color:${symColors[Math.floor(Math.random() * symColors.length)]};animation-duration:${12 + Math.random() * 12}s;animation-delay:${Math.random() * 2}s;`;
  floatLayer.appendChild(el);
  setTimeout(() => el.remove(), 25000);
}
for (let i = 0; i < 10; i++) spawnSym();
setInterval(spawnSym, 1200);

// ========== THREE.JS SCENE ==========
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0d0008);
scene.fog = new THREE.FogExp2(0x0d0008, 0.005);

const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 1000);
camera.position.set(7, 5, 10);
camera.lookAt(0, 1.5, 0);

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('canvas3d'),
  antialias: true,
  powerPreference: "high-performance"
});
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;

const labelRen = new CSS2DRenderer();
labelRen.setSize(innerWidth, innerHeight);
labelRen.domElement.style.position = 'absolute';
labelRen.domElement.style.top = '0px';
labelRen.domElement.style.left = '0px';
labelRen.domElement.style.pointerEvents = 'none';
document.body.appendChild(labelRen.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.2;
controls.enableZoom = true;
controls.enablePan = true;
controls.target.set(0, 1.5, 0);
controls.minDistance = 3.5;
controls.maxDistance = 18;
controls.touchRotate = true;
controls.rotateSpeed = 0.8;

// ========== LIGHTS ==========
scene.add(new THREE.AmbientLight(0x3a1228, 0.85));
const sun = new THREE.DirectionalLight(0xffeedd, 1);
sun.position.set(4, 7, 3);
sun.castShadow = true;
sun.shadow.mapSize.width = 512;
sun.shadow.mapSize.height = 512;
scene.add(sun);
scene.add(new THREE.PointLight(0xff6688, 0.45).position.set(-2, 2, -3));
scene.add(new THREE.PointLight(0x88ffaa, 0.2).position.set(0, -1, 0));
const magicLight = new THREE.PointLight(0xff4488, 0.55);
magicLight.position.set(0, 2, 0);
scene.add(magicLight);

// ========== GROUND ==========
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(16, 16),
  new THREE.MeshStandardMaterial({ color: 0x2d5a24, roughness: 0.92, metalness: 0.03 })
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.55;
ground.receiveShadow = true;
ground.userData.isGround = true;
scene.add(ground);

const grid = new THREE.GridHelper(16, 18, 0x88aa88, 0x446644);
grid.position.y = -0.52;
grid.material.transparent = true;
grid.material.opacity = 0.15;
scene.add(grid);

// ========== STARS ==========
const starCount = 350;
const starPos = new Float32Array(starCount * 3);
const starCol = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i++) {
  starPos[i * 3] = (Math.random() - 0.5) * 180;
  starPos[i * 3 + 1] = (Math.random() - 0.5) * 70;
  starPos[i * 3 + 2] = (Math.random() - 0.5) * 90 - 40;
  const c = new THREE.Color().setHSL(0.95 + Math.random() * 0.05, 0.5, 0.7 + Math.random() * 0.3);
  starCol[i * 3] = c.r;
  starCol[i * 3 + 1] = c.g;
  starCol[i * 3 + 2] = c.b;
}
const starGeo = new THREE.BufferGeometry();
starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
starGeo.setAttribute('color', new THREE.BufferAttribute(starCol, 3));
const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ size: 0.08, vertexColors: true, sizeAttenuation: true }));
scene.add(stars);

// ========== HEART (Love) ==========
const loveGroup = new THREE.Group();

const heartShape = new THREE.Shape();
heartShape.moveTo(0, -0.8);
heartShape.bezierCurveTo(-0.3, -0.6, -0.8, -0.2, -0.8, 0.2);
heartShape.bezierCurveTo(-0.8, 0.6, -0.4, 0.9, 0, 0.5);
heartShape.bezierCurveTo(0.4, 0.9, 0.8, 0.6, 0.8, 0.2);
heartShape.bezierCurveTo(0.8, -0.2, 0.3, -0.6, 0, -0.8);

const extrudeOpts = { steps: 1, depth: 0.28, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.04, bevelSegments: 8 };
const heartGeo = new THREE.ExtrudeGeometry(heartShape, extrudeOpts);
heartGeo.computeVertexNormals();
heartGeo.center();

const heartMat = new THREE.MeshStandardMaterial({ color: 0xff3366, emissive: 0x550022, roughness: 0.15, metalness: 0.7 });
const heart = new THREE.Mesh(heartGeo, heartMat);
heart.castShadow = true;
heart.scale.setScalar(0.92);
heart.rotation.x = -0.08;
heart.rotation.z = 0.04;
loveGroup.add(heart);

const innerHeart = new THREE.Mesh(heartGeo, new THREE.MeshStandardMaterial({ color: 0xff7799, emissive: 0x661133, roughness: 0.1, metalness: 0.4, transparent: true, opacity: 0.55 }));
innerHeart.scale.setScalar(0.62);
innerHeart.position.z = 0.1;
loveGroup.add(innerHeart);

const ringMat = new THREE.MeshStandardMaterial({ color: 0xff88aa, emissive: 0xcc3366 });
const ringGeoBig = new THREE.TorusGeometry(1.08, 0.04, 48, 100);
const ring1 = new THREE.Mesh(ringGeoBig, ringMat);
ring1.rotation.x = Math.PI / 2;
ring1.rotation.z = Math.PI / 4;
loveGroup.add(ring1);

const ring2 = new THREE.Mesh(ringGeoBig, ringMat.clone());
ring2.rotation.x = Math.PI / 3;
ring2.rotation.z = Math.PI / 3;
ring2.scale.setScalar(1.12);
loveGroup.add(ring2);

// Small orbiting hearts
const smallHeartShape = new THREE.Shape();
smallHeartShape.moveTo(0, -0.15);
smallHeartShape.bezierCurveTo(-0.06, -0.1, -0.15, -0.03, -0.15, 0.05);
smallHeartShape.bezierCurveTo(-0.15, 0.12, -0.08, 0.18, 0, 0.1);
smallHeartShape.bezierCurveTo(0.08, 0.18, 0.15, 0.12, 0.15, 0.05);
smallHeartShape.bezierCurveTo(0.15, -0.03, 0.06, -0.1, 0, -0.15);
const smallHeartGeo = new THREE.ExtrudeGeometry(smallHeartShape, { steps: 1, depth: 0.05, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.01 });
smallHeartGeo.computeVertexNormals();
smallHeartGeo.center();

const loveParticles = [];
for (let i = 0; i < 28; i++) {
  const particleMat = new THREE.MeshStandardMaterial({ color: 0xff88aa, emissive: 0xff4466 });
  const particle = new THREE.Mesh(smallHeartGeo, particleMat);
  const angle = Math.random() * Math.PI * 2;
  const radius = 1.3 + Math.random() * 0.45;
  particle.position.x = Math.cos(angle) * radius;
  particle.position.z = Math.sin(angle) * radius;
  particle.position.y = 0.2 + (Math.random() - 0.5) * 0.8;
  particle.scale.setScalar(0.35);
  particle.userData = { angle, radius, speed: 0.005 + Math.random() * 0.008, rotSpeed: 0.008 + Math.random() * 0.01 };
  scene.add(particle);
  loveParticles.push(particle);
}

loveGroup.position.y = 0.85;
scene.add(loveGroup);

// Label nama di hati
const nameDiv = document.createElement('div');
nameDiv.innerHTML = `<span style="font-family:'Great Vibes',cursive;font-size:14px;color:#ffb3c1;text-shadow:0 0 10px rgba(255,77,109,0.6);white-space:nowrap;">💗 ${CFG.name1} &amp; ${CFG.name2} 💗</span>`;
const nameLabel = new CSS2DObject(nameDiv);
nameLabel.position.set(0, 1.3, 0);
loveGroup.add(nameLabel);

// ========== FLOWER CLASSES ==========
class BaseFlower {
  constructor(x, z) {
    this.group = new THREE.Group();
    this.group.position.set(x, 0, z);
    this.parts = [];
    this.progress = 0;
    scene.add(this.group);
  }
  addPart(mesh) {
    mesh.castShadow = true;
    this.group.add(mesh);
    this.parts.push(mesh);
    return mesh;
  }
  stem(h, color = 0x4a8c3f) {
    const stemMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.075, h, 5), new THREE.MeshStandardMaterial({ color }));
    stemMesh.position.y = -h / 2;
    return this.addPart(stemMesh);
  }
  update(dt) {
    this.progress = Math.min(1, this.progress + dt * 1.2);
    this.parts.forEach(p => p.scale.setScalar(this.progress));
    return this.progress >= 1;
  }
}

class Rose extends BaseFlower {
  constructor(x, z) {
    super(x, z);
    this.stem(0.85);
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x5cad3f });
    const leafGeo = new THREE.SphereGeometry(0.1, 6, 6);
    const leafL = new THREE.Mesh(leafGeo, leafMat);
    leafL.scale.set(0.5, 0.12, 0.35);
    leafL.position.set(-0.18, -0.05, 0);
    this.addPart(leafL);
    const leafR = new THREE.Mesh(leafGeo, leafMat);
    leafR.scale.set(0.5, 0.12, 0.35);
    leafR.position.set(0.18, -0.05, 0);
    this.addPart(leafR);
    const petalMat = new THREE.MeshStandardMaterial({ color: 0xff5577, roughness: 0.2 });
    for (let i = 0; i < 5; i++) {
      const angle = i * 72 * Math.PI / 180;
      const petal = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 10), petalMat);
      petal.position.set(Math.cos(angle) * 0.16, 0.1, Math.sin(angle) * 0.16);
      petal.scale.set(0.7, 0.25, 0.6);
      this.addPart(petal);
    }
    const center = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), new THREE.MeshStandardMaterial({ color: 0xffdd44 }));
    center.position.y = 0.13;
    this.addPart(center);
    this.parts.forEach(p => p.scale.setScalar(0));
  }
}

class Tulip extends BaseFlower {
  constructor(x, z, color = 0xff88aa) {
    super(x, z);
    this.stem(0.65);
    const petalMat = new THREE.MeshStandardMaterial({ color, roughness: 0.25 });
    for (let i = 0; i < 6; i++) {
      const angle = i * 60 * Math.PI / 180;
      const petal = new THREE.Mesh(new THREE.ConeGeometry(0.095, 0.2, 6), petalMat);
      petal.position.set(Math.cos(angle) * 0.08, 0.05, Math.sin(angle) * 0.08);
      this.addPart(petal);
    }
    const center = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 6), new THREE.MeshStandardMaterial({ color: 0xffee66 }));
    center.position.y = 0.11;
    this.addPart(center);
    this.parts.forEach(p => p.scale.setScalar(0));
  }
}

class Edelweiss extends BaseFlower {
  constructor(x, z) {
    super(x, z);
    this.stem(0.65, 0x5a9e4a);
    const petalMat = new THREE.MeshStandardMaterial({ color: 0xfff8f0, roughness: 0.4 });
    for (let i = 0; i < 10; i++) {
      const angle = i * 36 * Math.PI / 180;
      const petal = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.2, 5), petalMat);
      petal.position.set(Math.cos(angle) * 0.21, 0.05, Math.sin(angle) * 0.21);
      petal.rotation.z = angle;
      this.addPart(petal);
    }
    const center = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), new THREE.MeshStandardMaterial({ color: 0xddcc66 }));
    center.position.y = 0.09;
    this.addPart(center);
    this.parts.forEach(p => p.scale.setScalar(0));
  }
}

// ========== FLOWER MANAGEMENT ==========
const TULIP_COLORS = [0xff88aa, 0xffaacc, 0xffbb99, 0xff99cc];
const INIT_FLOWERS = [
  { x: -2.2, z: -1.8, T: 'rose' }, { x: 2.5, z: -1.5, T: 'rose' },
  { x: -1.5, z: -2.2, T: 'tulip', c: 0xffaa88 }, { x: 1.8, z: -2, T: 'tulip', c: 0xff88aa },
  { x: -2.5, z: 0.5, T: 'edelweiss' }, { x: 2.8, z: 0.3, T: 'edelweiss' },
  { x: -1, z: -2.8, T: 'rose' }, { x: 1.2, z: -2.5, T: 'rose' },
  { x: -2, z: 1.8, T: 'tulip', c: 0xff99cc }, { x: 2.2, z: 1.5, T: 'tulip', c: 0xffaacc }
];

let flowers = [];
function makeFlower(x, z, type, color) {
  if (type === 'rose') flowers.push(new Rose(x, z));
  else if (type === 'tulip') flowers.push(new Tulip(x, z, color));
  else flowers.push(new Edelweiss(x, z));
}
INIT_FLOWERS.forEach(f => makeFlower(f.x, f.z, f.T, f.c));

document.getElementById('resetBtn').onclick = () => {
  flowers.forEach(f => scene.remove(f.group));
  flowers = [];
  INIT_FLOWERS.forEach(f => makeFlower(f.x, f.z, f.T, f.c));
};

// ========== ENVELOPE ==========
const envGroup = new THREE.Group();
envGroup.position.set(1.6, 0.18, 2.3);
const envBody = new THREE.Mesh(
  new THREE.BoxGeometry(0.75, 0.12, 0.56),
  new THREE.MeshStandardMaterial({ color: 0xcc8866, roughness: 0.3 })
);
envBody.castShadow = true;
envGroup.add(envBody);
const lid = new THREE.Mesh(new THREE.ConeGeometry(0.46, 0.19, 4), new THREE.MeshStandardMaterial({ color: 0xdd9977 }));
lid.rotation.y = Math.PI / 4;
lid.position.y = 0.1;
envGroup.add(lid);
scene.add(envGroup);

const envLabelDiv = document.createElement('div');
envLabelDiv.textContent = '💌 Klik Surat 💌';
envLabelDiv.style.cssText = 'color:#ffccaa;font-size:10px;font-family:Cormorant Garamond,serif;background:rgba(0,0,0,0.45);padding:3px 8px;border-radius:20px;white-space:nowrap;';
const envLabel = new CSS2DObject(envLabelDiv);
envLabel.position.set(0, 0.55, 0);
envGroup.add(envLabel);

let letterOpen = false;
let letterLabel = null;
function openLetter() {
  if (letterOpen) return;
  letterOpen = true;
  lid.rotation.x = -0.45;
  const msgDiv = document.createElement('div');
  msgDiv.innerHTML = '💌 <b>Surat Cinta</b><br><br>Untuk Fiaaku Mengku MBGku :p,<br>Setiap hari bersamamu<br>adalah keajaiban terindah.<br><br>❤️ <em>Forever Yours</em> ❤️';
  msgDiv.style.cssText = 'background:rgba(255,240,230,0.95);color:#8b1a4a;padding:14px 16px;border-radius:14px;font-family:Cormorant Garamond,serif;font-size:11px;text-align:center;border:1px solid #ff99aa;max-width:160px;line-height:1.6;';
  letterLabel = new CSS2DObject(msgDiv);
  letterLabel.position.set(0, 0.95, 0.45);
  envGroup.add(letterLabel);
  setTimeout(() => { lid.rotation.x = 0; }, 350);
}

// ========== PHOTO FRAMES ==========
const photoUrls = CFG.photoUrls;
const photoPos = [[-2.3, 1.5, 2.6], [2.4, 1.3, 2.3], [-1.9, 1.8, -2.4], [2.1, 1.6, -2.1]];
const photoObjs = [];
photoUrls.forEach((url, i) => {
  const img = document.createElement('img');
  img.src = url;
  img.style.cssText = 'width:70px;height:70px;object-fit:cover;border-radius:12px;border:2.5px solid #ff99aa;cursor:pointer;box-shadow:0 0 10px rgba(255,100,100,0.3);';
  img.onclick = (e) => { e.stopPropagation(); openLightbox(url); };
  const obj = new CSS2DObject(img);
  obj.position.set(...photoPos[i]);
  scene.add(obj);
  photoObjs.push({ obj, startY: photoPos[i][1] });
});

// ========== FIREWORKS ==========
class Firework {
  constructor() {
    this.particles = [];
    this.active = true;
    const cols = [0xff4466, 0xff6688, 0xffaa88, 0xffdd44];
    const px = (Math.random() - 0.5) * 5;
    const pz = (Math.random() - 0.5) * 4;
    const py = 1.5 + Math.random() * 2.5;
    for (let i = 0; i < 35; i++) {
      const mat = new THREE.MeshStandardMaterial({ color: cols[Math.floor(Math.random() * cols.length)], emissive: 0x330011 });
      const p = new THREE.Mesh(new THREE.SphereGeometry(0.05, 5, 5), mat);
      const angle = Math.random() * Math.PI * 2;
      const spd = 0.04 + Math.random() * 0.07;
      p.userData = {
        vx: Math.cos(angle) * spd * (0.2 + Math.random() * 0.6),
        vz: Math.sin(angle) * spd * (0.2 + Math.random() * 0.6),
        vy: Math.random() * spd * 0.5,
        life: 1,
        g: 0.006
      };
      p.position.set(px, py, pz);
      p.material.transparent = true;
      scene.add(p);
      this.particles.push(p);
    }
  }
  update() {
    let alive = false;
    this.particles.forEach(p => {
      if (p.userData.life > 0) {
        alive = true;
        p.userData.life -= 0.025;
        p.userData.vy -= p.userData.g;
        p.position.x += p.userData.vx;
        p.position.y += p.userData.vy;
        p.position.z += p.userData.vz;
        p.material.opacity = Math.max(0, p.userData.life);
        if (p.userData.life <= 0) scene.remove(p);
      }
    });
    this.active = alive;
    return alive;
  }
}
let fireworks = [];
function launchFireworks(n = 1) {
  for (let i = 0; i < n; i++) setTimeout(() => { if (fireworks.length < 4) fireworks.push(new Firework()); }, i * 150);
}
document.getElementById('fireworkBtn').onclick = () => launchFireworks(2);
setInterval(() => launchFireworks(1), 25000);

// ========== SHOOTING STARS ==========
class ShootingStar {
  constructor() {
    this.particles = [];
    this.active = true;
    const sx = (Math.random() - 0.5) * 14;
    const sy = 3.5 + Math.random() * 2;
    const sz = (Math.random() - 0.5) * 10 - 4;
    for (let i = 0; i < 8; i++) {
      const p = new THREE.Mesh(new THREE.SphereGeometry(0.04, 4, 4), new THREE.MeshStandardMaterial({ color: 0xffd080, emissive: 0xff8844, transparent: true }));
      p.position.set(sx, sy, sz);
      p.userData = { vx: -0.08 + Math.random() * 0.04, vy: -0.08 - Math.random() * 0.05, vz: (Math.random() - 0.5) * 0.06, life: 1 };
      scene.add(p);
      this.particles.push(p);
    }
  }
  update() {
    let alive = false;
    this.particles.forEach(p => {
      if (p.userData.life > 0) {
        alive = true;
        p.userData.life -= 0.04;
        p.position.x += p.userData.vx;
        p.position.y += p.userData.vy;
        p.position.z += p.userData.vz;
        p.material.opacity = Math.max(0, p.userData.life);
        p.scale.setScalar(p.userData.life);
        if (p.userData.life <= 0) scene.remove(p);
      }
    });
    this.active = alive;
    return alive;
  }
}
let shootingStars = [];
setInterval(() => { if (shootingStars.length < 2) shootingStars.push(new ShootingStar()); }, 15000);

// ========== RAYCASTER ==========
const raycaster = new THREE.Raycaster();
renderer.domElement.addEventListener('click', (e) => {
  const mouse = new THREE.Vector2(
    (e.clientX / renderer.domElement.clientWidth) * 2 - 1,
    -(e.clientY / renderer.domElement.clientHeight) * 2 + 1
  );
  raycaster.setFromCamera(mouse, camera);

  const envHit = raycaster.intersectObject(envGroup, true);
  if (envHit.length) { openLetter(); return; }

  const groundHit = raycaster.intersectObject(ground);
  if (groundHit.length) {
    const pt = groundHit[0].point;
    if (Math.abs(pt.x) < 6 && Math.abs(pt.z) < 6) {
      const r = Math.random();
      const randColor = TULIP_COLORS[Math.floor(Math.random() * TULIP_COLORS.length)];
      if (r < 0.4) makeFlower(pt.x, pt.z, 'rose');
      else if (r < 0.7) makeFlower(pt.x, pt.z, 'tulip', randColor);
      else makeFlower(pt.x, pt.z, 'edelweiss');

      for (let i = 0; i < 6; i++) {
        const spark = new THREE.Mesh(new THREE.SphereGeometry(0.03, 4, 4), new THREE.MeshStandardMaterial({ color: 0x88ff88, transparent: true }));
        spark.position.copy(pt);
        spark.position.y += 0.1;
        spark.userData = { vy: 0.04 + Math.random() * 0.07, life: 1 };
        scene.add(spark);
        setTimeout(() => scene.remove(spark), 500);
      }
    }
  }
});

// ========== ANIMATION LOOP ==========
let time = 0, lastTime = performance.now();
function animate() {
  const now = performance.now();
  let dt = Math.min(0.033, (now - lastTime) / 1000);
  lastTime = now;
  time += dt;

  loveGroup.position.y = 0.85 + Math.sin(time * 1.1) * 0.03;
  loveGroup.rotation.y = Math.sin(time * 0.45) * 0.1;
  ring1.rotation.z += 0.008;
  ring2.rotation.x += 0.005;
  heart.material.emissiveIntensity = 0.5 + Math.sin(time * 2) * 0.2;

  loveParticles.forEach(p => {
    p.userData.angle += p.userData.speed;
    p.position.x = Math.cos(p.userData.angle) * p.userData.radius;
    p.position.z = Math.sin(p.userData.angle) * p.userData.radius;
    p.rotation.z += p.userData.rotSpeed;
  });

  flowers.forEach(f => f.update(dt));

  photoObjs.forEach(({ obj, startY }, idx) => {
    obj.position.y = startY + Math.sin(time * 0.9 + idx) * 0.07;
  });

  envGroup.position.y = 0.18 + Math.sin(time * 1.3) * 0.02;
  magicLight.intensity = 0.55 + Math.sin(time * 2) * 0.2;
  stars.rotation.y += 0.0002;

  fireworks = fireworks.filter(f => f.update());
  shootingStars = shootingStars.filter(s => s.update());

  controls.update();
  renderer.render(scene, camera);
  labelRen.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  labelRen.setSize(innerWidth, innerHeight);
});

setTimeout(() => launchFireworks(2), 1000);