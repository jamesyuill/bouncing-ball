import * as THREE from 'three';

export default class FloorClass extends THREE.Mesh {
  constructor() {
    let geometry = new THREE.PlaneGeometry(1, 1, 10, 10);
    let material = new THREE.MeshStandardMaterial({
      color: 0x000000,
      side: THREE.DoubleSide,
    });
    super(geometry, material);

    this.receiveShadow = true;

    this.position.y = 0;
    this.rotation.x = Math.PI / 2;
  }
}
