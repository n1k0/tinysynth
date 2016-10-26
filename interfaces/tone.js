declare module "tone" {
  declare var Transport: {
    bpm: {value: number},
    start: () => void,
  };
  declare class Sequence {
    callback: Function,
    start: () => void,
    stop: () => void,
  }
  declare class MultiPlayer {
    toMaster: () => {start: () => void};
  }
  declare var exports: {
    Sequence: typeof Sequence,
    MultiPlayer: typeof MultiPlayer,
    Transport: typeof Transport,
  };
}
