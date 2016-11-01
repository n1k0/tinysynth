/* @flow */
import type { Track, BeatNotifier } from "./types";

import Tone from "tone";
import { drums, instruments } from "./instruments";


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

function loopProcessor(tracks, beatNotifier: BeatNotifier) {
  return (time, index) => {
    beatNotifier(index);
    tracks.forEach(({type, name, vol, muted, beats}) => {
      if (beats[index] != null) {
        const volume = muted ? 0 : velocities[index] * vol;
        if (type === "melo") {
          instruments[name].triggerAttackRelease(beats[index].note, beats[index].dur, time, volume);
        } else {
          drums.start(name, time, 0, "1n", 0, volume);
        }
      }
    });
  };
}
