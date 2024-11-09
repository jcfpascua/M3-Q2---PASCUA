const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  10,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
let cubeMesh = new THREE.Mesh();
let stars, starGeo;

lighting();
cube();
particles();

function particles() {
  const points = [];

  for (let i = 0; i < 6000; i++) {
    let star = new THREE.Vector3(
      Math.random() * 600 - 300,
      Math.random() * 600 - 300,
      Math.random() * 600 - 300
    );
    points.push(star);
  }

  starGeo = new THREE.BufferGeometry().setFromPoints(points);

  let sprite = new THREE.TextureLoader().load("assets/images/star.png");
  starMaterial = new THREE.PointsMaterial({
    color: 0xffb6c1,
    size: 0.7,
    map: sprite,
  });

  stars = new THREE.Points(starGeo, starMaterial);
  scene.add(stars);

  // Start color-changing interval
  changeParticleColor();
}

function changeParticleColor() {
  const colors = [0xffb6c1, 0xffd700, 0x00ffff, 0xadd8e6, 0xff69b4];
  let colorIndex = 0;

  setInterval(() => {
    colorIndex = (colorIndex + 1) % colors.length;
    starMaterial.color.setHex(colors[colorIndex]);
  }, 3000); // 3 seconds
}


function animateParticles() {
  stars.geometry.attributes.position.array.forEach((value, index) => {
    // Only move every third item in the array (y-coordinates)
    if ((index + 1) % 3 === 2) {
      stars.geometry.attributes.position.array[index] -= 0.9;

      // Reset the star to the top when it goes out of view
      if (stars.geometry.attributes.position.array[index] < -300) {
        stars.geometry.attributes.position.array[index] = 300;
      }
    }
  });

  stars.geometry.attributes.position.needsUpdate = true;
}

function createNameTexture(name) {
  const canvas = document.createElement("canvas");
  const size = 256; 
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext("2d");
  context.fillStyle = "black";  
  context.fillRect(0, 0, size, size);

  context.font = "bold 48px Arial";
  context.fillStyle = "white";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(name, size / 2, size / 2);

  return new THREE.CanvasTexture(canvas);
}

function cube() {
  const nameTexture = createNameTexture("Jericho"); 
  const cubeMaterial = new THREE.MeshBasicMaterial({ map: nameTexture });
  const cubeGeometry = new THREE.BoxGeometry(10, 5, 5, 5);
  cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);

  cubeMesh.position.z = -5;
  camera.position.z = 15;

  scene.add(cubeMesh);
}

function lighting() {
  const light = new THREE.HemisphereLight(0x780a44, 0x1c3020, 1);
  scene.add(light);

  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(0, 0, 15);
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  spotLight.shadow.camera.near = 500;
  spotLight.shadow.camera.far = 4000;
  spotLight.shadow.camera.fov = 30;
  scene.add(spotLight);
}

function animate() {
  requestAnimationFrame(animate);

  animateParticles();

  cubeMesh.rotation.x += 0.008;
  cubeMesh.rotation.y += 0.008;
  renderer.render(scene, camera);
}

animate();
