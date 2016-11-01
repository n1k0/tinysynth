/**
 * These typings for Tone.js are solely adapted to this project; don't use them
 * for other purpose.
 */
declare module "tone" {
  declare class AudioNode {
    connect: () => AudioNode,
    toMaster: () => AudioNode,
    triggerAttackRelease: (
      note: string | number,
      duration: number | string,
      time: ?number,
      velocity: ?number
    ) => void
  }
  declare class DuoSynth extends AudioNode {}
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
  declare class MembraneSynth extends AudioNode {}
  declare class MonoSynth extends AudioNode {}
  declare class PolySynth {
    connect: () => {
      set: (name: string, val: any) => void,
    }
  }
  declare class Sampler {
    constructor: (options: {url: string, envelope: Object}) => void,
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
    DuoSynth: typeof DuoSynth,
    Effect: typeof Effect,
    Freeverb: typeof Freeverb,
    MembraneSynth: typeof MembraneSynth,
    MonoSynth: typeof MonoSynth,
    MultiPlayer: typeof MultiPlayer,
    PolySynth: typeof PolySynth,
    Sampler: typeof Sampler,
    Sequence: typeof Sequence,
    Transport: typeof Transport,
  };
}
