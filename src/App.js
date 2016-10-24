/* @flow */

import React, { Component } from 'react';
import './App.css';


type Track = {name: string, sample: string, beats: boolean[]};

function initTracks(): Track[] {
  return [
    {name: "hi-hat", sample: "hihat.ogg", beats: initBeats(16)},
    {name: "snare", sample: "snare.ogg", beats: initBeats(16)},
    {name: "kick", sample: "kick.ogg", beats: initBeats(16)},
  ];
}

function initBeats(n) {
  return new Array(n).fill(false);
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
    tracks: Track[],
  };

  constructor(props: {}) {
    super(props);
    this.state = {tracks: initTracks()};
  }

  update = (name: string, beat: number) => {
    this.setState(({tracks}) => {
      return {
        tracks: tracks.map((track: Track) => {
          if (track.name !== name) {
            return track;
          } else {
            return {
              ...track,
              beats: track.beats.map((v, i) => i !== beat ? v : !v)
            };
          }
        })
      }
    });
  };

  render() {
    const {tracks} = this.state;
    return <TrackListView tracks={tracks} update={this.update} />;
  }
}

export default App;
