/* @flow */
import Tone from "tone";

import samples from "./samples.json";


// General reverb for everything
const reverb = new Tone.Freeverb().toMaster();
reverb.dampening.value = 20;
reverb.roomSize.value = .7;
reverb.wet.value = .75;

// Drums
export const drums = new Tone.MultiPlayer({
  urls: samples
    .reduce((acc, name) => {
      return {...acc, [name]: `./audio/drums/${name}.wav`};
    }, {})
}).connect(reverb);

// Melodic instruments
const sine = new Tone.MonoSynth({
  oscillator: {type: "sine"},
  envelope: {attack: .01},
}).connect(reverb);

const percuboo = new Tone.MembraneSynth({
  oscillator: {type: "square"},
  envelope: {attack: .01},
}).connect(reverb);

export const instruments = {
  sine,
  percuboo,
};
