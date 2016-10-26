/* @flow */

export type BeatNotifier =
  (beat: number) => void;

export type Track = {
  id: number,
  name: string,
  vol: number,
  muted: boolean,
  beats: boolean[],
};

export type EncodedTrack = {
  id: number,
  name: string,
  vol: number,
  muted: boolean,
  beats: string,
};
