/* @flow */
import type { Track, ToneLoop, BeatNotifier } from "./types";

import Tone from "tone";


const velocities = [
  1, .5, .75, .5,
  1, .5, .75, .5,
  1, .5, .75, .5,
  1, .5, .75, .5,
];

export function create(tracks: Track[], beatNotifier: BeatNotifier): ToneLoop {
  const loop = new Tone.Sequence(
    loopProcessor(tracks, beatNotifier),
    new Array(16).fill(0).map((_, i) => i),
    "16n"
  );

  Tone.Transport.bpm.value = 120;
  Tone.Transport.start();

  return loop;
}

export function update(loop: ToneLoop, tracks: Track[], beatNotifier: BeatNotifier): ToneLoop {
  loop.callback = loopProcessor(tracks, beatNotifier);
  return loop;
}

export function updateBPM(bpm: number): void {
  Tone.Transport.bpm.value = bpm;
}

function loopProcessor(tracks, beatNotifier: BeatNotifier) {
  const urls = tracks.reduce((acc, {name, sample}) => {
    return {...acc, [name]: sample};
  }, {});

  const keys = new Tone.MultiPlayer({urls}).toMaster();

  return (time, index) => {
    beatNotifier(index);
    tracks.forEach(({name, vol, muted, beats}) => {
      if (beats[index]) {
        // XXX "1n" should be set via some "resolution" track prop
        keys.start(name, time, 0, "1n", 0, muted ? 0 : velocities[index] * vol);
      }
    });
  };
}
