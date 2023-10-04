import * as THREE from 'three';
import * as Tone from 'tone';
import { player } from './audioClip';
import { synth, now } from './synth';
// const synth = new Tone.PolySynth(Tone.Synth);
// synth.set({ oscillator: { type: 'sine' } });
// const now = Tone.now();
// const feedbackDelay = new Tone.FeedbackDelay({
//   delayTime: 0.5,
//   feedback: 0.3,
//   // maxDelay:2,
//   wet: 0.3,
// });

// synth.connect(feedbackDelay);
// feedbackDelay.toDestination();

export default class ballClass extends THREE.Mesh {
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
    let x = Math.floor(Math.random() * (10 - -10 + 1)) + -10;
    let z = Math.floor(Math.random() * (10 - -10 + 1)) + -10;

    this.position.set(x, 0.7, z);
    this.castShadow = true;
    this.userData.id = Date.now();

    let notesArray = ['F4', 'G4', 'G#4', 'Bb4', 'C4', 'D4', 'E4', 'F4'];
    let randomNote = notesArray[Math.floor(Math.random() * 9)];
    this.bounce = () => {
      player.start();
      // synth.triggerAttack(randomNote, now);
      // synth.triggerRelease(randomNote);
    };
  }
}
