/* @flow */
import type { Track, BeatNotifier } from "./types";

import Tone from "tone";
import samples from "./samples.json";


const velocities = [
  1, .5, .75, .5,
  1, .5, .75, .5,
  1, .5, .75, .5,
  1, .5, .75, .5,
];

export function create(tracks: Track[], beatNotifier: BeatNotifier): Tone.Sequence {
  const loop = new Tone.Sequence(
    loopProcessor(tracks, beatNotifier),
    new Array(16).fill().map((_, i) => i),
    "16n"
  );

  Tone.Transport.bpm.value = 120;
  Tone.Transport.start();

  return loop;
}

export function update(loop: Tone.Sequence, tracks: Track[], beatNotifier: BeatNotifier): Tone.Sequence {
  loop.callback = loopProcessor(tracks, beatNotifier);
  return loop;
}

export function updateBPM(bpm: number): void {
  Tone.Transport.bpm.value = bpm;
}

var reverb = new Tone.Freeverb().toMaster();
reverb.dampening.value = 20;
reverb.roomSize.value = .7;
reverb.wet.value = .75;

const bass = new Tone.MonoSynth({envelope: {attack: .001}}).connect(reverb);

// const bass2 = new Tone.Sampler("./audio/C3.mp3", () => {
//   bass.triggerAttack(0);
// }).toMaster();

const drumKit = new Tone.MultiPlayer({
  urls: samples
    .reduce((acc, name) => {
      return {...acc, [name]: `./audio/${name}.wav`};
    }, {})
}).connect(reverb);

function loopProcessor(tracks, beatNotifier: BeatNotifier) {
  return (time, index) => {
    beatNotifier(index);
    tracks.forEach(({type, name, vol, muted, beats}) => {
      if (beats[index]) {
        const volume = muted ? 0 : velocities[index] * vol;
        if (type === "bass") {
          bass.triggerAttackRelease(beats[index].note, "16n", time, volume);
        } else {
          drumKit.start(name, time, 0, "1n", 0, volume);
        }
      }
    });
  };
}
