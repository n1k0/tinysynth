/* @flow */

export type Track = {
  name: string,
  sample: string,
  beats: boolean[],
};

export type ToneLoop = {
  start: () => void,
  stop: () => void,
  callback: (time: number, index: number) => void,
};
