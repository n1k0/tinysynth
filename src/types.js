/* @flow */

export type Track = {
  name: string,
  sample: string,
  vol: number,
  beats: boolean[],
};

export type ToneLoop = {
  start: () => void,
  stop: () => void,
  callback: (time: number, index: number) => void,
};
