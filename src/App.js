/* @flow */

import type { Track, ToneLoop } from "./types";

import React, { Component } from "react";
import "./App.css";

import * as sequencer from "./sequencer";


function initTracks(): Track[] {
  return [
    {name: "hi-hat (open)", sample: "audio/hihato.wav", vol: .4, muted: false, beats: initBeats(16)},
    {name: "hi-hat (close)", sample: "audio/hihatc.wav", vol: .4, muted: false, beats: initBeats(16)},
    {name: "snare", sample: "audio/snare.wav", vol: .9, muted: false, beats: initBeats(16)},
    {name: "kick", sample: "audio/kick.wav", vol: .8, muted: false, beats: initBeats(16)},
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

function TrackView({
  track,
  currentBeat,
  toggleTrackBeat,
  setTrackVolume,
  muteTrack,
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
        track.beats.map((v, beat) => {
          const beatClass = v ? "active" : beat === currentBeat ? "current" : "";
          return (
            <td key={beat} className={`beat ${beatClass}`}>
              <a href="" onClick={(event) => {
                event.preventDefault();
                toggleTrackBeat(track.name, beat);
              }} />
            </td>
          );
        })
      }
    </tr>
  );
}

function TrackListView({
  tracks,
  currentBeat,
  toggleTrackBeat,
  setTrackVolume,
  muteTrack,
}) {
  return (
    <table>
      <tbody>{
        tracks.map((track, i) => {
          return (
            <TrackView key={i}
              track={track}
              currentBeat={currentBeat}
              toggleTrackBeat={toggleTrackBeat}
              setTrackVolume={setTrackVolume}
              muteTrack={muteTrack} />
            );
        })
      }</tbody>
    </table>
  );
}

function Controls({bpm, updateBPM, start, stop}) {
  const onChange = event => updateBPM(parseInt(event.target.value, 10));
  return (
    <div className="controls">
      <button className="btn btn-start" onClick={start}>Play</button>
      <button className="btn btn-stop" onClick={stop}>Stop</button>
      <div className="bpm">
        <label>
          BPM
          <input type="range" min="30" max="240" value={bpm} onChange={onChange}/>
          <input type="number" value={bpm} onChange={onChange} />
        </label>
      </div>
    </div>
  );
}

class App extends Component {
  state: {
    bpm: number,
    currentBeat: number,
    loop: ToneLoop,
    tracks: Track[],
  };

  constructor(props: {}) {
    super(props);
    const tracks = initTracks();
    this.state = {
      bpm: 120,
      currentBeat: -1,
      tracks, loop:
      sequencer.create(tracks, this.updateCurrentBeat),
    };
  }

  start = () => {
    this.state.loop.start();
  };

  stop = () => {
    this.state.loop.stop();
    this.setState({currentBeat: -1});
  };

  updateCurrentBeat = (beat: number): void => {
    this.setState({currentBeat: beat});
  };

  updateTracks = (newTracks: Track[]) => {
    const {loop} = this.state;
    this.setState({
      tracks: newTracks,
      loop: sequencer.update(loop, newTracks, this.updateCurrentBeat),
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
    this.updateTracks(_muteTrack(tracks, name));
  };

  updateBPM = (newBpm: number) => {
    const {bpm} = this.state;
    sequencer.updateBPM(bpm);
    this.setState({bpm: newBpm});
  }

  render() {
    const {bpm, currentBeat, tracks} = this.state;
    const {updateBPM, start, stop} = this;
    return (
      <div>
        <h3>tinysynth</h3>
        <TrackListView
          tracks={tracks}
          currentBeat={currentBeat}
          toggleTrackBeat={this.toggleTrackBeat}
          setTrackVolume={this.setTrackVolume}
          muteTrack={this.muteTrack} />
        <Controls {...{bpm, updateBPM, start, stop}} />
      </div>
    );
  }
}

export default App;
