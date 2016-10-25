/* @flow */

import type { Track, ToneLoop } from "./types";

import React, { Component } from "react";
import "./App.css";
// import "react-mdl/extra/material.css";
import "react-mdl/extra/css/material.light_blue-pink.min.css";
import "react-mdl/extra/material.js";

import { FABButton, Icon, Slider, Switch } from "react-mdl";

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
      <td className="vol">
        <Slider min={0} max={1} step={.1} value={track.vol}
          onChange={event => setTrackVolume(track.name, parseFloat(event.target.value))} />
      </td>
      <td className="mute">
        <Switch defaultChecked={!track.muted} onChange={event => muteTrack(track.name)} />
      </td>
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
  );
}

function Controls({bpm, updateBPM, playing, start, stop}) {
  const onChange = event => updateBPM(parseInt(event.target.value, 10));
  return (
    <tfoot className="controls">
      <tr>
        <td colSpan="2"></td>
        <td>
          <FABButton mini colored onClick={playing ? stop : start}>
            <Icon name={playing ? "stop" : "play_arrow"} />
          </FABButton>
        </td>
        <td colSpan="2" className="bpm">
          BPM <input type="number" value={bpm} onChange={onChange} />
        </td>
        <td colSpan="14">
          <Slider min={30} max={240} value={bpm} onChange={onChange} />
        </td>
      </tr>
    </tfoot>
  );
}

class App extends Component {
  state: {
    bpm: number,
    currentBeat: number,
    loop: ToneLoop,
    playing: boolean,
    tracks: Track[],
  };

  constructor(props: {}) {
    super(props);
    const tracks = initTracks();
    this.state = {
      bpm: 120,
      currentBeat: -1,
      playing: false,
      tracks,
      loop: sequencer.create(tracks, this.updateCurrentBeat),
    };
  }

  start = () => {
    this.setState({playing: true});
    this.state.loop.start();
  };

  stop = () => {
    this.state.loop.stop();
    this.setState({currentBeat: -1, playing: false});
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
    const {bpm, currentBeat, playing, tracks} = this.state;
    const {updateBPM, start, stop} = this;
    return (
      <div>
        <h3>tinysynth</h3>
        <table>
          <TrackListView
            tracks={tracks}
            currentBeat={currentBeat}
            toggleTrackBeat={this.toggleTrackBeat}
            setTrackVolume={this.setTrackVolume}
            muteTrack={this.muteTrack} />
          <Controls {...{bpm, updateBPM, playing, start, stop}} />
        </table>
      </div>
    );
  }
}

export default App;
