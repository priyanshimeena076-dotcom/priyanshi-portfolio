// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Three.js 3D Laptop Scene
const container = document.getElementById('threejs-container');
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x0b0f1a, 30, 120);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(0, 8, 32);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio || 1);
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

const ambient = new THREE.AmbientLight(0x8fb3ff, 0.6);
scene.add(ambient);

const keyLight = new THREE.DirectionalLight(0xffffff, 0.9);
keyLight.position.set(12, 18, 10);
scene.add(keyLight);

const rimLight = new THREE.PointLight(0x55d6be, 0.8, 120);
rimLight.position.set(-18, 10, 14);
scene.add(rimLight);

const laptop = new THREE.Group();

const baseMat = new THREE.MeshStandardMaterial({
    color: 0x1d2636,
    metalness: 0.6,
    roughness: 0.35
});

const base = new THREE.Mesh(new THREE.BoxGeometry(16, 0.8, 10), baseMat);
base.position.y = 0;

const baseTop = new THREE.Mesh(
    new THREE.BoxGeometry(15.4, 0.12, 9.4),
    new THREE.MeshStandardMaterial({ color: 0x0f1724, metalness: 0.3, roughness: 0.6 })
);
baseTop.position.y = 0.5;

const trackpad = new THREE.Mesh(
    new THREE.BoxGeometry(3.6, 0.08, 2.4),
    new THREE.MeshStandardMaterial({ color: 0x222c3f, metalness: 0.4, roughness: 0.5 })
);
trackpad.position.set(0, 0.55, 1.5);

const hinge = new THREE.Group();
hinge.position.set(0, 0.45, -4.8);

const screenMat = new THREE.MeshStandardMaterial({
    color: 0x0b1220,
    metalness: 0.2,
    roughness: 0.35,
    emissive: 0x0f1c2e,
    emissiveIntensity: 0.6
});

const screen = new THREE.Mesh(new THREE.BoxGeometry(15.2, 8.8, 0.6), screenMat);
screen.position.set(0, 4.4, -0.3);

const screenGlow = new THREE.Mesh(
    new THREE.PlaneGeometry(13.6, 7.2),
    new THREE.MeshBasicMaterial({ color: 0x2a9dff, transparent: true, opacity: 0.25 })
);
screenGlow.position.set(0, 4.4, 0.05);

hinge.add(screen, screenGlow);

laptop.add(base, baseTop, trackpad, hinge);
scene.add(laptop);

// Floating particles
const particles = new THREE.Group();
const particleMat = new THREE.MeshBasicMaterial({ color: 0x6aa5ff, transparent: true, opacity: 0.5 });
for (let i = 0; i < 40; i++) {
    const particle = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 12), particleMat);
    particle.position.set(
        THREE.MathUtils.randFloatSpread(50),
        THREE.MathUtils.randFloat(4, 18),
        THREE.MathUtils.randFloatSpread(40)
    );
    particles.add(particle);
}
scene.add(particles);

let openProgress = 0;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function animate() {
    requestAnimationFrame(animate);

    const time = Date.now() * 0.001;

    if (!prefersReducedMotion && openProgress < 1) {
        openProgress += 0.01;
    }

    const targetOpen = THREE.MathUtils.lerp(-Math.PI / 2.2, -0.25, openProgress);
    hinge.rotation.x = targetOpen + Math.sin(time * 0.6) * 0.03;

    laptop.rotation.y = Math.sin(time * 0.25) * 0.2;
    laptop.position.y = Math.sin(time * 0.5) * 0.3;

    particles.rotation.y += 0.0015;

    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
});

// Scroll reveal
const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.classList.add('reveal');
    observer.observe(section);
});
