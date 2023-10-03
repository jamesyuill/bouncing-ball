import * as THREE from 'three';
import * as Tone from 'tone';

const synth = new Tone.PolySynth(Tone.Synth).toDestination();
synth.set({ oscillator: { type: 'sine' } });
const now = Tone.now();

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

    let notesArray = ['F4', 'G4', 'Ab4', 'Bb4', 'C4', 'D4', 'E4', 'F4'];
    let randomNote = notesArray[Math.floor(Math.random() * 9)];

    this.bounce = () => {
      synth.triggerAttack(randomNote, now);
      synth.triggerRelease(randomNote);
    };
  }
}
