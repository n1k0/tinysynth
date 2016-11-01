/* @flow */

export type Beat = {
  note: string,
  vol: number,
  dur: string,
}

export type Beats =  Array<?Beat>;

export type BeatNotifier =
  (beat: number) => void;

export type Track = {
  id: number,
  type: "melo" | "drum",
  name: string,
  vol: number,
  muted: boolean,
  beats: Beats
};

export type EncodedTrack = {
  id: number,
  name: string,
  vol: number,
  muted: boolean,
  beats: string,
};

export type Sample = {
  path: string,
  poly: boolean,
};
