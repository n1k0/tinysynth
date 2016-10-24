/* @flow */

import React, { Component } from 'react';
import './App.css';


type Track = {name: string, sample: string, beats: boolean[]};

function prevent(fn) {
  return event => {
    event.preventDefault();
    fn();
  }
}

function TrackView({track, update}: {
  track: Track,
  update: (name: string, beat: number) => void
}) {
  return <div className="track">{
    track.beats.map((v, beat) => (
      <a key={beat} href="" className={`beat ${v ? "active" : ""}`}
         onClick={prevent(() => update(track.name, beat))} />
    ))
  }</div>;
}

function TrackListView({tracks, update}) {
  return (
    <div>
      <h3>Let's there be rock</h3>
      <div>{
        tracks.map((track, i) => <TrackView key={i} track={track} update={update} />)
      }</div>
    </div>
  );
}

class App extends Component {
  props: {
    tracks: Track[],
  };

  state: {
    tracks: Track[],
  };

  static defaultProps = {
    tracks: [
      {name: "snare", sample: "snare.ogg", beats: new Array(12).fill(false)},
      {name: "kick", sample: "kick.ogg", beats: new Array(12).fill(false)},
    ]
  };

  constructor(props: Object) {
    super(props);
    const {tracks} = props;
    this.state = {tracks};
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
