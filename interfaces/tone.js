/**
 * These typings for Tone.js are solely adapted to this project; don't use them
 * for other purpose.
 */
declare module "tone" {
  declare class Effect {
    toMaster: () => {}
  }
  declare class Freeverb {
    toMaster: () => {
      dampening: {value: number},
      roomSize: {value: number},
      wet: {value: number},
    }
  }
  declare class MultiPlayer {
    connect: () => {
      start: () => void
    }
  }
  declare class MembraneSynth {
    connect: () => {
      triggerAttackRelease: (
        note: string | number,
        duration: number | string,
        time: ?number,
        velocity: ?number
      ) => void
    }
  }
  declare class MonoSynth {
    connect: () => {
      triggerAttackRelease: (
        note: string | number,
        duration: number | string,
        time: ?number,
        velocity: ?number
      ) => void
    }
  }
  declare class Sampler {
    constructor: (options: {url: string, envelope: Object}) => void,
    toMaster: () => {
      triggerAttackRelease: (pitch: number, duration: string, time: number, volume: number) => void,
    }
  }
  declare class Sequence {
    start: () => void,
    stop: () => void,
    callback: (time: number, index: number) => void,
  }
  declare var Transport: {
    bpm: {value: number},
    start: () => void,
  };
  declare var exports: {
    Effect: typeof Effect,
    Freeverb: typeof Freeverb,
    MembraneSynth: typeof MembraneSynth,
    MonoSynth: typeof MonoSynth,
    MultiPlayer: typeof MultiPlayer,
    Sampler: typeof Sampler,
    Sequence: typeof Sequence,
    Transport: typeof Transport,
  };
}
