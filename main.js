import * as THREE from 'three';
import './style.css';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import ballClass from './ballClass';
const scene = new THREE.Scene();
const listener = new THREE.AudioListener();
const sound = new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader();

// Audio Loader
audioLoader.load('sounds/basketball.mp3', function (buffer) {
  sound.setBuffer(buffer);
  sound.setVolume(0.7);
});

const startButton = document.getElementById('startButton');
startButton.addEventListener('click', init);

function init(e) {
  e.stopPropagation();

  const overlay = document.getElementById('overlay');
  overlay.remove();

  const newButton = document.createElement('button');
  newButton.innerText = 'click to add ball';
  newButton.addEventListener('click', () => {
    const ballExp = new ballClass();
    scene.add(ballExp);
  });
  document.getElementById('add-button-div').appendChild(newButton);

  // Camera
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.lookAt(0.0, 0.0, 0.0);
  camera.add(listener);
  camera.updateMatrixWorld();
  camera.position.z = 15;
  camera.position.y = 15;

  // Renderer
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xffffff, 1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);

  // Lighting
  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(5, 8, 0);
  // const helper = new THREE.DirectionalLightHelper(light, 10, 0xffffff);
  light.castShadow = true;
  scene.add(light);
  light.shadow.mapSize.width = 1024; // default
  light.shadow.mapSize.height = 1024; // default
  light.shadow.camera.near = 0.1; // default
  light.shadow.camera.far = 300;
  light.shadow.camera.right = 20;
  light.shadow.camera.left = -20;
  light.shadow.camera.top = 20;
  light.shadow.camera.bottom = -20;

  // Orbit Controls
  const controls = new OrbitControls(camera, renderer.domElement);

  //Test Ball
  const sphereGeo = new THREE.SphereGeometry(0.7, 36, 16);
  const sphereMat = new THREE.MeshStandardMaterial({
    color: 0xff69b4,
  });
  const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);

  sphereMesh.castShadow = true;
  sphereMesh.position.y = 1;
  scene.add(sphereMesh);

  // Floor Mesh
  const planeGeo = new THREE.PlaneGeometry(30, 30, 10, 10);
  const planeMat = new THREE.MeshStandardMaterial({
    color: 0x818181,
    side: THREE.DoubleSide,
  });
  const planeMesh = new THREE.Mesh(planeGeo, planeMat);
  planeMesh.receiveShadow = true;
  scene.add(planeMesh);
  planeMesh.position.y = 0;
  planeMesh.rotation.x = Math.PI / 2;

  // const options = {
  //   acc: acceleration,
  //   velx: 0,
  //   vely: 0,
  //   camera: {
  //     speed: 0.0001,
  //   },
  //   stop: function () {
  //     this.velx = 0;
  //     this.vely = 0;
  //   },
  //   reset: function () {
  //     this.velx = 0.1;
  //     this.vely = 0.1;
  //     camera.position.z = 75;
  //     camera.position.x = 0;
  //     camera.position.y = 0;
  //     cube.scale.x = 1;
  //     cube.scale.y = 1;
  //     cube.scale.z = 1;
  //     cube.material.wireframe = true;
  //   },
  // };

  // DAT.GUI Related Stuff

  var gui = new dat.GUI();

  // var cam = gui.addFolder('Camera');
  // cam.add(options.camera, 'speed', 0, 0.0010).listen();
  // cam.add(camera.position, 'y', 0, 100).listen();
  // cam.open();

  // var velocity = gui.addFolder('Velocity');
  // velocity.add(options, 'velx', -0.2, 0.2).name('X').listen();
  // velocity.add(options, 'vely', -0.2, 0.2).name('Y').listen();
  // velocity.open();

  const ball = gui.addFolder('Ball');
  // ball.add(cube.scale, 'x', 0, 3).name('Width').listen();
  // ball.add(cube.scale, 'y', 0, 3).name('Height').listen();
  // ball.add(cube.scale, 'z', 0, 3).name('Length').listen();
  // ball.add(options, 'acc', 0, 150).name('BPM').listen();
  ball.add(sphereMesh.material, 'wireframe').listen();
  // box.open();

  // gui.add(options, 'stop');
  // gui.add(options, 'reset');

  //Ball Acc Settings
  let acceleration = 100; //bpm?
  let bounce_distance = 6;
  let bottom_position_y = 1;
  let time_step = 0.02;
  let time_counter = Math.sqrt((bounce_distance * 2) / acceleration);
  let initial_speed = acceleration * time_counter;

  // Animate Function
  function animate() {
    requestAnimationFrame(animate);
    if (sphereMesh.position.y < bottom_position_y) {
      time_counter = 0;
    }

    sphereMesh.position.y =
      bottom_position_y +
      initial_speed * time_counter -
      0.5 * acceleration * time_counter * time_counter;
    // advance time
    time_counter += time_step;

    if (sphereMesh.position.y === bottom_position_y) {
      sound.play();
    }

    if (sphereMesh.position.y === bottom_position_y && sound.isPlaying) {
      sound.stop();
      sound.play();
    }

    controls.update();
    renderer.render(scene, camera);
  }
  animate();
}
