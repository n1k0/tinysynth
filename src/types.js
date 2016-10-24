/* @flow */

export type Track = {
  name: string,
  sample: string,
  vol: number,
  muted: boolean,
  beats: boolean[],
};

export type ToneLoop = {
  start: () => void,
  stop: () => void,
  callback: (time: number, index: number) => void,
};
