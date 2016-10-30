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

const bass = new Tone.MonoSynth({
  volume : 2,
  envelope : {
    attack : .001,
    decay : 0.3,
    release : 2,
  },
  filterEnvelope : {
    attack : 0.001,
    decay : 0.01,
    sustain : 0.8,
    baseFrequency : 200,
    octaves : 2.6,
  }
}).toMaster();

const drumKit = new Tone.MultiPlayer({
  urls: samples
    .reduce((acc, name) => {
      return {...acc, [name]: `./audio/${name}.wav`};
    }, {})
}).toMaster();

function loopProcessor(tracks, beatNotifier: BeatNotifier) {
  return (time, index) => {
    beatNotifier(index);
    tracks.forEach(({type, name, vol, muted, beats}) => {
      if (beats[index]) {
        try {
          const volume = muted ? 0 : velocities[index] * vol;
          if (type === "bass") {
            bass.triggerAttackRelease(beats[index].note, "64n", time, volume);
          } else {
            drumKit.start(name, time, 0, "1n", 0, volume);
          }
        } catch(e) {
          // We're most likely in a race condition where the new sample hasn't been loaded
          // just yet; silently ignore, it will resiliently catch up later.
        }
      }
    });
  };
}
