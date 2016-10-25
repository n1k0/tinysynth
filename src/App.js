/* @flow */

import type { Track, ToneLoop } from "./types";

import React, { Component } from "react";
import { FABButton, Icon, Slider, Switch } from "react-mdl";

import "./App.css";
import "react-mdl/extra/css/material.light_blue-pink.min.css";
import "react-mdl/extra/material.js";

import * as sequencer from "./sequencer";
import samples from "./samples.json";

function initTracks(): Track[] {
  return [
    {name: "hihat-reso", vol: .4, muted: false, beats: initBeats(16)},
    {name: "hihat-plain", vol: .4, muted: false, beats: initBeats(16)},
    {name: "snare-vinyl01", vol: .9, muted: false, beats: initBeats(16)},
    {name: "kick-electro01", vol: .8, muted: false, beats: initBeats(16)},
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

function _updateTrackSample(tracks, name, sample) {
  return tracks.map((track: Track) => {
    if (track.name !== name) {
      return track;
    } else {
      return {...track, name: sample};
    }
  });
}

class SampleSelector extends Component {
  state: {
    open: boolean,
  };

  constructor(props) {
    super(props);
    this.state = {open: false};
  }

  open = (event) => {
    event.preventDefault();
    this.setState({open: true});
  };

  close = () => {
    this.setState({open: false});
  };

  onChange = (event) => {
    const {current, onChange} = this.props;
    onChange(current, event.target.value);
    this.close();
  };

  render() {
    const {current} = this.props;
    const {open} = this.state;
    if (open) {
      return (
        <select autoFocus value={current} onChange={this.onChange} onBlur={this.close}>{
          samples.map((sample, i) => {
            return <option key={i}>{sample}</option>;
          })
        }</select>
      );
    } else {
      return <a href="" onClick={this.open}>{current}</a>;
    }
  }
}

function TrackListView({
  tracks,
  currentBeat,
  toggleTrackBeat,
  setTrackVolume,
  updateTrackSample,
  muteTrack,
}) {
  return (
    <tbody>{
      tracks.map((track, i) => {
        return (
          <tr key={i}className="track">
            <th>
              <SampleSelector current={track.name} onChange={updateTrackSample} />
            </th>
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
      })
    }</tbody>
  );
}

function Controls({bpm, updateBPM, playing, start, stop, share}) {
  const onChange = event => updateBPM(parseInt(event.target.value, 10));
  return (
    <tfoot className="controls">
      <tr>
        <td colSpan="2" />
        <td>
          <FABButton mini colored onClick={playing ? stop : start}>
            <Icon name={playing ? "stop" : "play_arrow"} />
          </FABButton>
        </td>
        <td colSpan="2" className="bpm">
          BPM <input type="number" value={bpm} onChange={onChange} />
        </td>
        <td colSpan="13">
          <Slider min={30} max={240} value={bpm} onChange={onChange} />
        </td>
        <td colSpan="1">
          <FABButton mini onClick={share} title="Share">
            <Icon name="share" />
          </FABButton>
        </td>
      </tr>
    </tfoot>
  );
}

class App extends Component {
  loop: ToneLoop;

  state: {
    bpm: number,
    currentBeat: number,
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
    };
    this.loop = sequencer.create(tracks, this.updateCurrentBeat);
  }

  start = () => {
    this.setState({playing: true});
    this.loop.start();
  };

  stop = () => {
    this.loop.stop();
    this.setState({currentBeat: -1, playing: false});
  };

  updateCurrentBeat = (beat: number): void => {
    this.setState({currentBeat: beat});
  };

  updateTracks = (newTracks: Track[]) => {
    this.loop = sequencer.update(this.loop, newTracks, this.updateCurrentBeat);
    this.setState({tracks: newTracks});
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
  };

  updateTrackSample = (name: string, sample: string) => {
    const {tracks} = this.state;
    this.updateTracks(_updateTrackSample(tracks, name, sample));
  };

  share = () => {
    console.log(JSON.stringify(this.state, null, 2));
  };

  render() {
    const {bpm, currentBeat, playing, tracks} = this.state;
    const {updateBPM, start, stop, share} = this;
    return (
      <div>
        <h3>tinysynth</h3>
        <table>
          <TrackListView
            tracks={tracks}
            currentBeat={currentBeat}
            toggleTrackBeat={this.toggleTrackBeat}
            setTrackVolume={this.setTrackVolume}
            updateTrackSample={this.updateTrackSample}
            muteTrack={this.muteTrack} />
          <Controls {...{bpm, updateBPM, playing, start, stop, share}} />
        </table>
      </div>
    );
  }
}

export default App;
