declare module "tone" {
  declare var Transport: {
    bpm: {value: number},
    start: () => void,
  };
  declare class Sequence {
    start: () => void,
    stop: () => void,
    callback: (time: number, index: number) => void,
  }
  declare class MultiPlayer {
    toMaster: () => {
      start: () => void
    }
  }
  declare class MonoSynth {
    toMaster: () => {
      triggerAttackRelease: (
        note: string | number,
        duration: number | string,
        time: ?number,
        velocity: ?number
      ) => void
    }
  }
  declare var exports: {
    MonoSynth: typeof MonoSynth,
    MultiPlayer: typeof MultiPlayer,
    Sequence: typeof Sequence,
    Transport: typeof Transport,
  };
}
