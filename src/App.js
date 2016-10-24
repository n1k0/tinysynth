/* @flow */

import type { Track, ToneLoop } from "./types";

import React, { Component } from 'react';
import './App.css';

import * as sequencer from "./sequencer";


function initTracks(): Track[] {
  return [
    {name: "hi-hat (open)", sample: "audio/hihato.wav", beats: initBeats(16)},
    {name: "hi-hat (close)", sample: "audio/hihatc.wav", beats: initBeats(16)},
    {name: "snare", sample: "audio/snare.wav", beats: initBeats(16)},
    {name: "kick", sample: "audio/kick.wav", beats: initBeats(16)},
  ];
}

function initBeats(n) {
  return new Array(n).fill(false);
}

function updateTracks(tracks, name, beat) {
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

function TrackView({track, update}: {
  track: Track,
  update: (name: string, beat: number) => void
}) {
  return (
    <tr className="track">
      <td>{track.name}</td>
      {
        track.beats.map((v, beat) => (
          <td key={beat} className={`beat ${v ? "active" : ""}`}>
            <a href="" onClick={(event) => {
              event.preventDefault();
              update(track.name, beat);
            }} />
          </td>
        ))
      }
    </tr>
  );
}

function TrackListView({tracks, update}) {
  return (
    <div>
      <h3>tinysynth</h3>
      <table>
        <tbody>{
          tracks.map((track, i) => {
            return <TrackView key={i} track={track} update={update} />;
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

  update = (name: string, beat: number) => {
    const {tracks, loop} = this.state;
    const newTracks = updateTracks(tracks, name, beat);
    this.setState({
      tracks: newTracks,
      loop: sequencer.update(loop, newTracks),
    });
  };

  render() {
    const {tracks} = this.state;
    return (
      <div>
        <TrackListView tracks={tracks} update={this.update} />
        <button onClick={this.start}>start</button>
        <button onClick={this.stop}>stop</button>
      </div>
    );
  }
}

export default App;
