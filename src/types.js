/* @flow */

export type BeatNotifier =
  (beat: number) => void;

export type ToneLoop = {
  start: () => void,
  stop: () => void,
  callback: (time: number, index: number) => void,
};

export type Track = {
  name: string,
  sample: string,
  vol: number,
  muted: boolean,
  beats: boolean[],
};
