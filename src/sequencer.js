/* @flow */
import type { Track, BeatNotifier } from "./types";

import Tone from "tone";


const velocities = [
  1, .5, .75, .5,
  1, .5, .75, .5,
  1, .5, .75, .5,
  1, .5, .75, .5,
];

const bassNotes = "A1,C2,D2,E2,G2,A2,C3,D3,E3,G3,A3".split(",");

export function create(tracks: Track[], beatNotifier: BeatNotifier): Tone.Sequence {
  const loop = new Tone.Sequence(
    loopProcessor(tracks, beatNotifier),
    new Array(16).fill().map((_, i) => i),
    "16n"
  );

  const bass = new Tone.MonoSynth({
    volume : -10,
    envelope : {
      attack : 0.1,
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

  // const bassPart = new Tone.Sequence(function(time, note) {
  //   bass.triggerAttackRelease(note, "32n", time);
  // }, ["A1", "G1", null, "D1",
  //     "A1", "G1", null, "A1",
  //     "G1", null, "E1", "F1",
  //     "A1", "B1", null, "A1"], "16n").start();

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
