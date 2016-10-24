/* @flow */

import type { Track, ToneLoop } from "./types";

import React, { Component } from 'react';
import './App.css';

import * as sequencer from "./sequencer";


function initTracks(): Track[] {
  return [
    {name: "hi-hat (open)", sample: "audio/hihato.wav", vol: .8, muted: false, beats: initBeats(16)},
    {name: "hi-hat (close)", sample: "audio/hihatc.wav", vol: .8, muted: false, beats: initBeats(16)},
    {name: "snare", sample: "audio/snare.wav", vol: 1, muted: false, beats: initBeats(16)},
    {name: "kick", sample: "audio/kick.wav", vol: 1, muted: false, beats: initBeats(16)},
  ];
}

function initBeats(n) {
  return new Array(n).fill(false);
}

function _toggleTrackBeat(tracks, name, beat) {
  return tracks.map((track: Track) => {
    if (track.name !== name) {
      return track;
    } else {
      return {
        ...track,
        beats: track.beats.map((v, i) => i !== beat ? v : !v)
      };
    }
  });
}

function _setTrackVolume(tracks, name, vol) {
  return tracks.map((track: Track) => {
    if (track.name !== name) {
      return track;
    } else {
      return {...track, vol};
    }
  });
}

function _muteTrack(tracks, name) {
  return tracks.map((track: Track) => {
    if (track.name !== name) {
      return track;
    } else {
      return {...track, muted: !track.muted};
    }
  });
}

function TrackView({track, toggleTrackBeat, setTrackVolume, muteTrack}: {
  track: Track,
  toggleTrackBeat: (name: string, beat: number) => void,
  setTrackVolume: (name: string, vol: number) => void,
  muteTrack: (name: string) => void,
}) {
  return (
    <tr className="track">
      <th>{track.name}</th>
      <td>
        <input type="range" min="0" max="1" step=".1" value={track.vol}
          onChange={event => setTrackVolume(track.name, parseFloat(event.target.value))} /></td>
      <td>
        <input type="checkbox" checked={!track.muted}
          onChange={event => muteTrack(track.name)} /></td>
      {
        track.beats.map((v, beat) => (
          <td key={beat} className={`beat ${v ? "active" : ""}`}>
            <a href="" onClick={(event) => {
              event.preventDefault();
              toggleTrackBeat(track.name, beat);
            }} />
          </td>
        ))
      }
    </tr>
  );
}

function TrackListView({tracks, toggleTrackBeat, setTrackVolume, muteTrack}) {
  return (
    <div>
      <h3>tinysynth</h3>
      <table>
        <tbody>{
          tracks.map((track, i) => {
            return (
              <TrackView key={i}
                track={track}
                toggleTrackBeat={toggleTrackBeat}
                setTrackVolume={setTrackVolume}
                muteTrack={muteTrack} />
              );
          })
        }</tbody>
      </table>
    </div>
  );
}

class App extends Component {
  state: {
    loop: ToneLoop,
    tracks: Track[],
  };

  constructor(props: {}) {
    super(props);
    const tracks = initTracks();
    this.state = {tracks, loop: sequencer.create(tracks)};
  }

  start = () => {
    this.state.loop.start();
  };

  stop = () => {
    this.state.loop.stop();
  };

  updateTracks = (newTracks: Track[]) => {
    const {loop} = this.state;
    this.setState({
      tracks: newTracks,
      loop: sequencer.update(loop, newTracks),
    });
  };

  toggleTrackBeat = (name: string, beat: number) => {
    const {tracks} = this.state;
    this.updateTracks(_toggleTrackBeat(tracks, name, beat));
  };

  setTrackVolume = (name: string, vol: number) => {
    const {tracks} = this.state;
    this.updateTracks(_setTrackVolume(tracks, name, vol));
  };

  muteTrack = (name: string) => {
    const {tracks} = this.state;
    this.updateTracks( _muteTrack(tracks, name));
  };

  render() {
    const {tracks} = this.state;
    return (
      <div>
        <TrackListView
          tracks={tracks}
          toggleTrackBeat={this.toggleTrackBeat}
          setTrackVolume={this.setTrackVolume}
          muteTrack={this.muteTrack} />
        <button onClick={this.start}>start</button>
        <button onClick={this.stop}>stop</button>
      </div>
    );
  }
}

export default App;
