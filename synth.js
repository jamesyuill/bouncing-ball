import * as Tone from 'tone';

export const synth = new Tone.PolySynth(Tone.Synth);
synth.set({ oscillator: { type: 'sine' } });
export const now = Tone.now();
export const feedbackDelay = new Tone.FeedbackDelay({
  delayTime: 0.5,
  feedback: 0.3,
  // maxDelay:2,
  wet: 0.3,
});

export const shift = new Tone.FrequencyShifter(0);

export const crusher = new Tone.BitCrusher(16);
synth.connect(shift);
shift.connect(crusher);
crusher.connect(feedbackDelay);
feedbackDelay.toDestination();
