/* @flow */
import type { Track } from "./types";

import samples from "./samples.json";


export function initTracks(): Track[] {
  return [
    {id: 1, name: "hihat-reso", vol: .4, muted: false, beats: initBeats(16)},
    {id: 2, name: "hihat-plain", vol: .4, muted: false, beats: initBeats(16)},
    {id: 3, name: "snare-vinyl01", vol: .9, muted: false, beats: initBeats(16)},
    {id: 4, name: "kick-electro01", vol: .8, muted: false, beats: initBeats(16)},
  ];
}

export function initBeats(n) {
  return new Array(n).fill(false);
}

export function addTrack(tracks) {
  const id = Math.max.apply(null, tracks.map(t => t.id)) + 1;
  return [
    ...tracks, {
      id,
      name: "kick-electro01",
      vol: .8,
      muted: false,
      beats: initBeats(16),
    }
  ];
}

export function deleteTracks(tracks, id) {
  return tracks.filter((track: Track) => {
    return track.id !== id;
  });
}

export function toggleTrackBeat(tracks, id, beat) {
  return tracks.map((track: Track) => {
    if (track.id !== id) {
      return track;
    } else {
      return {
        ...track,
        beats: track.beats.map((v, i) => i !== beat ? v : !v)
      };
    }
  });
}

export function setTrackVolume(tracks, id, vol) {
  return tracks.map((track: Track) => {
    if (track.id !== id) {
      return track;
    } else {
      return {...track, vol};
    }
  });
}

export function muteTrack(tracks, id) {
  return tracks.map((track: Track) => {
    if (track.id !== id) {
      return track;
    } else {
      return {...track, muted: !track.muted};
    }
  });
}

export function updateTrackSample(tracks, id, sample) {
  return tracks.map((track: Track) => {
    if (track.id !== id) {
      return track;
    } else {
      return {...track, name: sample};
    }
  });
}

export function encodeTracks(tracks) {
  return tracks.map((track) => {
    return {...track, beats: track.beats.map(beat => beat ? 1 : 0).join("")}
  });
}

export function decodeTracks(encodedTracks) {
  return encodedTracks.map((encodedTrack) => {
    return {
      ...encodedTrack,
      beats: encodedTrack.beats.split("").map(beat => Boolean(parseInt(beat, 10))),
    }
  });
}

export function randomTracks() {
  const nT = Math.floor(3 + (Math.random() * 10));
  return new Array(nT).fill().map((_, i) => {
    return {
      id: i + 1,
      name: samples[Math.floor(Math.random() * samples.length)],
      vol: Math.random(),
      muted: false,
      beats: initBeats(16).map(_ => Math.random() > .75),
    }
  });
}

export function randomSong() {
  return {
    bpm: Math.floor(Math.random() * 75) + 75,
    tracks: randomTracks(),
  };
}
