/* @flow */

import type { Track, ToneLoop } from "./types";

import React, { Component } from 'react';
import './App.css';

import * as sequencer from "./sequencer";


function initTracks(): Track[] {
  return [
    {name: "hi-hat (open)", sample: "audio/hihato.wav", vol: .8, beats: initBeats(16)},
    {name: "hi-hat (close)", sample: "audio/hihatc.wav", vol: .8, beats: initBeats(16)},
    {name: "snare", sample: "audio/snare.wav", vol: 1, beats: initBeats(16)},
    {name: "kick", sample: "audio/kick.wav", vol: 1, beats: initBeats(16)},
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

function TrackView({track, toggleTrackBeat, setTrackVolume}: {
  track: Track,
  toggleTrackBeat: (name: string, beat: number) => void,
  setTrackVolume: (name: string, vol: number) => void
}) {
  return (
    <tr className="track">
      <td>{track.name}</td>
      <td>
        <input type="range" min="0" max="1" step=".1" value={track.vol}
          onChange={event => setTrackVolume(track.name, parseFloat(event.target.value))} /></td>
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

function TrackListView({tracks, toggleTrackBeat, setTrackVolume}) {
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
                setTrackVolume={setTrackVolume} />
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

  toggleTrackBeat = (name: string, beat: number) => {
    const {tracks, loop} = this.state;
    const newTracks = _toggleTrackBeat(tracks, name, beat);
    this.setState({
      tracks: newTracks,
      loop: sequencer.update(loop, newTracks),
    });
  };

  setTrackVolume = (name: string, vol: number) => {
    const {tracks, loop} = this.state;
    const newTracks = _setTrackVolume(tracks, name, vol);
    this.setState({
      tracks: newTracks,
      loop: sequencer.update(loop, newTracks),
    });
  };

  render() {
    const {tracks} = this.state;
    return (
      <div>
        <TrackListView
          tracks={tracks}
          toggleTrackBeat={this.toggleTrackBeat}
          setTrackVolume={this.setTrackVolume} />
        <button onClick={this.start}>start</button>
        <button onClick={this.stop}>stop</button>
      </div>
    );
  }
}

export default App;
