/* @flow */
import type { Track, BeatNotifier } from "./types";

import Tone from "tone";


const velocities = [
  1, .5, .75, .5,
  1, .5, .75, .5,
  1, .5, .75, .5,
  1, .5, .75, .5,
];

export function create(tracks: Track[], beatNotifier: BeatNotifier): Tone.Sequence {
  const loop = new Tone.Sequence(
    loopProcessor(tracks, beatNotifier),
    new Array(16).fill(0).map((_, i) => i),
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
  // XXX this may be now totally unnecessary as we can infer the sample url
  // directly from the name
  const urls = tracks.reduce((acc, {name}) => {
    return {...acc, [name]: `audio/${name}.wav`};
  }, {});

  const keys = new Tone.MultiPlayer({urls}).toMaster();

  return (time, index) => {
    beatNotifier(index);
    tracks.forEach(({name, vol, muted, beats}) => {
      if (beats[index]) {
        try {
          // XXX "1n" should be set via some "resolution" track prop
          keys.start(name, time, 0, "1n", 0, muted ? 0 : velocities[index] * vol);
        } catch(e) {
          // We're most likely in a race condition where the new sample hasn't been loaded
          // just yet; silently ignore, it will resiliently catch up later.
        }
      }
    });
  };
}
