import * as THREE from 'three';
import FloorClass from './floorClass';
import { scene } from './main';
// import { player } from './audioClip';
import { synth, now } from './synth';

export default class BallClass extends THREE.Mesh {
  constructor() {
    let geometry = new THREE.SphereGeometry(0.7, 36, 16);
    let material = new THREE.MeshStandardMaterial({});
    super(geometry, material);
    this.material.color.set(0xff0000);
    this.acceleration = 100;
    this.bounce_distance = 6;
    this.bottom_position_y = 1;
    this.time_step = 0.02;
    this.time_counter = Math.sqrt(
      (this.bounce_distance * 2) / this.acceleration
    );
    this.initial_speed = this.acceleration * this.time_counter;
    let x = 0;
    let z = 0;

    this.position.set(x, 0.7, z);
    this.castShadow = true;
    this.userData.id = Date.now();
    this.userData.isDown = false;

    let notesArray = ['F4', 'G4', 'G#4', 'Bb4', 'C4', 'D4', 'E4', 'F4'];
    let randomNote = notesArray[Math.floor(Math.random() * 8)];

    this.bounce = () => {
      // player.start();

      synth.triggerAttack(randomNote, now);
      synth.triggerRelease(randomNote);
    };

    this.floor = new FloorClass();
    this.floor.scale.y = 10;
    this.floor.position.z = 4;
    scene.add(this.floor);

    this.changeFloorColor = () => {
      if (this.userData.isDown) {
        this.floor.material.color.setHex(0xff0000);
        setTimeout(() => {
          this.floor.material.color.setHex(0xffffff);
        }, 100);
      }
    };
  }
}
