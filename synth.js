import * as Tone from 'tone';

export const synth = new Tone.PolySynth(Tone.Synth);
synth.set({ oscillator: { type: 'sine' } });
export const now = Tone.now();
const feedbackDelay = new Tone.FeedbackDelay({
  delayTime: 0.5,
  feedback: 0.3,
  // maxDelay:2,
  wet: 0.3,
});

synth.connect(feedbackDelay);
feedbackDelay.toDestination();
