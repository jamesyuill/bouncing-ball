import * as THREE from 'three';

export default class ballClass extends THREE.Mesh {
  constructor() {
    let geometry = new THREE.SphereGeometry(0.7, 36, 16);
    let material = new THREE.MeshStandardMaterial({
      color: 0xff69b4,
    });
    super(geometry, material);
    let x = Math.floor(Math.random() * (10 - -10 + 1)) + -10;
    let z = Math.floor(Math.random() * (10 - -10 + 1)) + -10;

    this.position.set(x, 0.7, z);
    this.castShadow = true;
  }
}
