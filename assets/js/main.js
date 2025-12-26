const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Stars
const starsGeometry = new THREE.BufferGeometry();
const starCount = 2000;
const starPositions = [];
for (let i=0;i<starCount;i++){
  starPositions.push((Math.random()-0.5)*300,(Math.random()-0.5)*300);
}
starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions,3));
const stars = new THREE.Points(starsGeometry, new THREE.PointsMaterial({color:0xffffff,size:0.5}));
scene.add(stars);

// Core
const core = new THREE.Mesh(
  new THREE.SphereGeometry(1.2,32,32),
  new THREE.MeshBasicMaterial({color:0xffd700, wireframe:true})
);
scene.add(core);

// Glow
const glow = new THREE.Mesh(
  new THREE.SphereGeometry(2.2,64,64),
  new THREE.MeshBasicMaterial({color:0xffc800, transparent:true, opacity:0.15})
);
scene.add(glow);

// Rings
const rings = [];
function ring(radius, rx, ry){
  const curve = new THREE.EllipseCurve(0,0,radius,radius*1.4,0,Math.PI*2);
  const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(200));
  const mat = new THREE.LineBasicMaterial({color:0xffd700, opacity:0.7, transparent:true});
  const r = new THREE.Line(geo, mat);
  r.rotation.x = rx; r.rotation.y = ry;
  scene.add(r); rings.push(r);
}
 
ring(2,-0.5,0.8);
ring(2.5,0.9,-0.6);

const light = new THREE.PointLight(0xffd700,1.2);
light.position.set(10,0,2);
scene.add(light);

let t=0;
function animate(){
  requestAnimationFrame(animate);
  t+=0.01;
  core.rotation.y+=0.01;
  glow.scale.setScalar(1+Math.sin(t)*0.05);
  rings.forEach((r,i)=>r.rotation.z+=0.02+i*0.002);
  stars.rotation.y+=0.0001;
  renderer.render(scene,camera);
}
animate();

window.addEventListener('resize',()=>{
  camera.aspect=window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});