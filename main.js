import * as THREE from 'three';
import './style.css';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'dat.gui';
import ballClass from './ballClass';
const scene = new THREE.Scene();
const listener = new THREE.AudioListener();
const renderer = new THREE.WebGLRenderer();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// Audio Loader

const startButton = document.getElementById('startButton');
startButton.addEventListener('click', init);

function init(e) {
  e.stopPropagation();

  const overlay = document.getElementById('overlay');
  overlay.remove();

  const gui = new GUI();
  let ballCount = 1;
  const newMeshArray = [];
  const newButton = document.createElement('button');
  newButton.innerText = 'click to add ball';
  newButton.addEventListener('click', () => {
    const ballExp = new ballClass();
    newMeshArray.push(ballExp);
    scene.add(ballExp);
    const ballFolder = gui.addFolder(`Ball ${ballCount}`);
    ballFolder.add(ballExp, 'acceleration', 100, 200);
    ballFolder.add(ballExp, 'time_step', 0.01, 0.1);
    ballFolder.open();
    ballCount++;
  });
  document.getElementById('add-button-div').appendChild(newButton);

  // Camera

  camera.lookAt(0.0, 0.0, 0.0);
  camera.add(listener);
  camera.updateMatrixWorld();
  camera.position.z = 15;
  camera.position.y = 15;

  // Renderer

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xffffff, 1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);

  // Lighting
  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(6, 9, 0);
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

  // Animate Function
  function animate() {
    requestAnimationFrame(animate);

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
        newMeshArray[i].bounce();
      }
    }

    controls.update();

    renderer.render(scene, camera);
  }
  animate();
}
