import * as THREE from 'three';
import { renderer, camera, scene, sound, audioLoader, listener } from './main';

export default class ballClass extends THREE.Mesh {
  constructor() {
    let geometry = new THREE.SphereGeometry(0.7, 36, 16);
    let material = new THREE.MeshStandardMaterial({
      color: 0xff69b4,
    });
    super(geometry, material);

    this.acceleration = 100;
    this.bounce_distance = 6;
    this.bottom_position_y = 1;
    this.time_step = 0.02;
    this.time_counter = Math.sqrt(
      (this.bounce_distance * 2) / this.acceleration
    );
    this.initial_speed = this.acceleration * this.time_counter;
    let x = Math.floor(Math.random() * (10 - -10 + 1)) + -10;
    let z = Math.floor(Math.random() * (10 - -10 + 1)) + -10;

    this.position.set(x, 0.7, z);
    this.castShadow = true;
    this.userData.id = Date.now();

    audioLoader.load('sounds/basketball.mp3', function (buffer) {
      sound.setBuffer(buffer);
      sound.setVolume(0.7);
    });

    this.bounce = () => {
      sound.stop();
      sound.play();
    };

    // if (this.position.y === this.bottom_position_y) {
    //   sound.play();
    // }
  }
}
