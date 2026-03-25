
// Three.js particle field
const canvas = document.getElementById('canvas-bg');
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 30;

// Create grid of particles
const geo = new THREE.BufferGeometry();
const count = 3000;
const pos = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (let i = 0; i < count; i++) {
  pos[i * 3] = (Math.random() - 0.5) * 120;
  pos[i * 3 + 1] = (Math.random() - 0.5) * 120;
  pos[i * 3 + 2] = (Math.random() - 0.5) * 80;
  const t = Math.random();
  if (t < 0.5) {
    colors[i * 3] = 0; colors[i * 3 + 1] = 0.96; colors[i * 3 + 2] = 1;
  } else {
    colors[i * 3] = 0.48; colors[i * 3 + 1] = 0.18; colors[i * 3 + 2] = 1;
  }
}

geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const mat = new THREE.PointsMaterial({ size: 0.18, vertexColors: true, transparent: true, opacity: 0.7 });
const particles = new THREE.Points(geo, mat);
scene.add(particles);

// Floating wireframe spheres
function addSphere(x, y, z, r, color) {
  const sg = new THREE.SphereGeometry(r, 12, 12);
  const sm = new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.06 });
  const mesh = new THREE.Mesh(sg, sm);
  mesh.position.set(x, y, z);
  scene.add(mesh);
  return mesh;
}

const sphere1 = addSphere(-15, 10, -10, 8, 0x00f5ff);
const sphere2 = addSphere(18, -8, -15, 6, 0x7b2fff);
const sphere3 = addSphere(5, -14, -5, 4, 0x00f5ff);

// Mouse parallax
let mx = 0, my = 0;
document.addEventListener('mousemove', e => {
  mx = (e.clientX / window.innerWidth - 0.5) * 2;
  my = -(e.clientY / window.innerHeight - 0.5) * 2;
});

let t = 0;
function animate() {
  requestAnimationFrame(animate);
  t += 0.003;
  particles.rotation.y = t * 0.05 + mx * 0.03;
  particles.rotation.x = t * 0.02 + my * 0.02;
  sphere1.rotation.y = t * 0.3;
  sphere1.rotation.x = t * 0.2;
  sphere2.rotation.y = -t * 0.25;
  sphere2.rotation.z = t * 0.15;
  sphere3.rotation.x = t * 0.35;
  camera.position.x += (mx * 2 - camera.position.x) * 0.02;
  camera.position.y += (my * 1.5 - camera.position.y) * 0.02;
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.15 });
reveals.forEach(el => observer.observe(el));

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(a.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
  });
});