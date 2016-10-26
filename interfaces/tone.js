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
    toMaster: () => {start: () => void};
  }
  declare var exports: {
    Sequence: typeof Sequence,
    MultiPlayer: typeof MultiPlayer,
    Transport: typeof Transport,
  };
}
