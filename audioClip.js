import * as Tone from 'tone';

export const player = new Tone.Player('./sounds/beat.wav').toDestination();
