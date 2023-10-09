import * as THREE from 'three';
import FloorClass from './floorClass';
import { scene } from '../main';
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
    let z = 1;

    this.position.set(x, 0.7, z);
    // this.castShadow = true;
    let ball_id = Date.now();
    this.userData.id = ball_id;
    this.userData.isDown = false;

    let notesArray = ['C4', 'Eb4', 'G4', 'Bb4', 'D4', 'F4', 'Ab4'];
    let randomNote = notesArray[Math.floor(Math.random() * 7)];
    this.userData.notePlaying = randomNote;
    this.bounce = () => {
      // player.start();

      synth.triggerAttack(randomNote, now);
      synth.triggerRelease(randomNote);
    };

    this.floor = new FloorClass();
    this.floor.scale.y = 10;
    this.floor.position.z = 4;
    this.floor.userData.id = ball_id;
    // scene.add(this.floor);

    this.background = new FloorClass();
    this.background.scale.y = 9;
    this.background.rotation.x = 3.15;
    this.background.position.y = 4;
    this.background.position.z = -1;
    this.background.userData.id = ball_id;

    this.background.material.color.set(0x818181);

    this.changeFloorColorOnBounce = () => {
      if (this.userData.isDown) {
        this.floor.material.color.setHex(0xff0000);
        this.material.color.setHex(0xff0000);
        this.background.material.color.setHex(0x818181);

        setTimeout(() => {
          this.floor.material.color.setHex(0xffffff);
          this.material.color.setHex(0xff0000);
          this.background.material.color.setHex(0x818181);
        }, 50);
      }
    };

    this.changeBallAndFloorColour = () => {
      this.material.color.setHex(0x00ff00);
      this.floor.material.color.setHex(0x00ff00);
      this.background.material.color.setHex(0x00ff00);
    };

    this.newNote = (note) => {
      synth.triggerAttack(note, now);
      synth.triggerRelease(note);
    };
  }
}
