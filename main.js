import * as THREE from 'three';
import * as Tone from 'tone';
import './style.css';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'dat.gui';
import BallClass from './components/ballClass';
import FloorClass from './components/floorClass';
import { crusher, shift, feedbackDelay } from './components/synth';

// Camera / Scene / Renderer / Listener / Raycaster

export const scene = new THREE.Scene();
const listener = new THREE.AudioListener();
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const renderer = new THREE.WebGLRenderer({ antialias: true });

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const ballStatsDiv = document.getElementById('ball-stats-div');
const startButton = document.getElementById('startButton');
const addBallsButton = document.getElementById('add-balls-button');
const resetButton = document.getElementById('reset-button');

startButton.addEventListener('click', () => {
  Tone.start();
  startButton.classList.add('disabled');
  startButton.disabled = true;
  addBallsButton.classList.remove('disabled');
  addBallsButton.disabled = false;
  resetButton.classList.remove('disabled');
  resetButton.disabled = false;
});

resetButton.addEventListener('click', removeAllBalls);

const gui = new GUI();
const effectsFolder = gui.addFolder(`Effects`);
effectsFolder.add(feedbackDelay.wet, 'value', 0.0, 0.5).name('Delay');
effectsFolder.add(shift.frequency, 'value', -200, 200).name('Shift');
effectsFolder.add(crusher.bits, 'value', 1, 16).name('Bit-Crush');
effectsFolder.open();

let ballCount = 1;
let spacer = -6;
let newMeshArray = [];
let newFloorArray = [];
let intersects;
let chosen;

addBallsButton.addEventListener('click', () => {
  const ballExp = new BallClass();
  if (ballCount <= 1) {
    ballExp.position.x = spacer;
    ballExp.floor.position.x = spacer;
    ballExp.background.position.x = spacer;
  } else {
    ballExp.position.x = spacer + ballCount;
    ballExp.floor.position.x = spacer + ballCount;
    ballExp.background.position.x = spacer + ballCount;

    spacer++;
  }
  newMeshArray.push(ballExp);

  scene.add(ballExp);
  newFloorArray.push(ballExp.floor);
  scene.add(ballExp.floor);
  newFloorArray.push(ballExp.background);

  scene.add(ballExp.background);
  const ballFolder = gui.addFolder(`Ball ${ballCount}`);
  ballFolder.add(ballExp, 'acceleration', 100, 300).name('Acceleration');
  ballFolder.add(ballExp, 'time_step', 0.01, 0.3).name('BounceRate');

  ballFolder.open();
  ballCount++;
  if (ballCount >= 8) {
    document.getElementById('add-button-div').removeChild(addBallsButton);
  }
});

// Blunt Reset Function
function removeAllBalls() {
  location.reload();
}

// Camera

camera.add(listener);
camera.lookAt(0.0, 0.0, 0.0);
// camera.updateMatrixWorld();
camera.position.z = 10;
camera.position.y = 3;

// Renderer

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff, 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(0, 9, 6);
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
// const controls = new OrbitControls(camera, renderer.domElement);

// Floor Mesh
const bigFloor = new FloorClass();
bigFloor.scale.x = 20;
bigFloor.scale.y = 10;
bigFloor.position.y = -0.01;
bigFloor.position.z = 4;
scene.add(bigFloor);

// Window resize
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('mousemove', mouseMove, false);
function mouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function hoverBall() {
  raycaster.setFromCamera(mouse, camera);
  intersects = raycaster.intersectObjects(newFloorArray);

  for (let i = 0; i < intersects.length; i++) {
    if (intersects[i].object instanceof FloorClass) {
      chosen = newMeshArray.filter((obj) => {
        return obj.userData.id === intersects[i].object.userData.id;
      });
      chosen[0].changeBallAndFloorColour();
    }
  }
}

window.addEventListener('click', () => {
  for (let i = 0; i < intersects.length; i++) {
    if (intersects[i].object instanceof FloorClass) {
      chosen = newMeshArray.filter((obj) => {
        return obj.userData.id === intersects[i].object.userData.id;
      });
      chosen[0].displayBallStats();
    }
  }
});

// Animate Function
function animate() {
  hoverBall();

  for (let i = 0; i < newMeshArray.length; i++) {
    if (newMeshArray[i].position.y < newMeshArray[i].bottom_position_y) {
      newMeshArray[i].time_counter = 0;
    }

    newMeshArray[i].position.y =
      newMeshArray[i].bottom_position_y +
      newMeshArray[i].initial_speed * newMeshArray[i].time_counter -
      0.5 *
        newMeshArray[i].acceleration *
        newMeshArray[i].time_counter *
        newMeshArray[i].time_counter;
    // advance time
    newMeshArray[i].time_counter += newMeshArray[i].time_step;

    if (newMeshArray[i].position.y === newMeshArray[i].bottom_position_y) {
      newMeshArray[i].userData.isDown = true;
      newMeshArray[i].bounce();
      newMeshArray[i].changeFloorColorOnBounce();
    } else {
      newMeshArray[i].userData.isDown = false;

      newMeshArray[i].changeFloorColorOnBounce();
    }
  }

  // controls.update();
  renderer.render(scene, camera);

  requestAnimationFrame(animate);
}
animate();
