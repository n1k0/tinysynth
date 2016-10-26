/* @flow */

import type { Track, EncodedTrack } from "./types";

import Tone from "tone";

import React, { Component } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FABButton,
  Icon,
  Slider,
  Switch,
} from "react-mdl";

import "./App.css";
import "react-mdl/extra/css/material.light_blue-pink.min.css";
import "react-mdl/extra/material.js";

import * as sequencer from "./sequencer";
import * as model from "./model";
import samples from "./samples.json";


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
    const {id, onChange} = this.props;
    onChange(id, event.target.value);
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
  clearTrack,
  deleteTrack,
}) {
  return (
    <tbody>{
      tracks.map((track, i) => {
        return (
          <tr key={i}className="track">
            <th>
              <SampleSelector id={track.id} current={track.name} onChange={updateTrackSample} />
            </th>
            <td className="vol">
              <Slider min={0} max={1} step={.1} value={track.vol}
                onChange={event => setTrackVolume(track.id, parseFloat(event.target.value))} />
            </td>
            <td className="mute">
              <Switch defaultChecked={!track.muted} onChange={event => muteTrack(track.id)} />
            </td>
            {
              track.beats.map((v, beat) => {
                const beatClass = v ? "active" : beat === currentBeat ? "current" : "";
                return (
                  <td key={beat} className={`beat ${beatClass}`}>
                    <a href="" onClick={(event) => {
                      event.preventDefault();
                      toggleTrackBeat(track.id, beat);
                    }} />
                  </td>
                );
              })
            }
            <td>
              {track.beats.some(v => v) ?
                <a href="" title="Clear track" onClick={event => {
                  event.preventDefault();
                  clearTrack(track.id);
                }}><Icon name="delete"/></a> :
                <Icon className="disabled-icon" name="delete"/>}
              <a href="" title="Delete track" onClick={event => {
                event.preventDefault();
                deleteTrack(track.id);
              }}><Icon name="delete_forever"/></a>
            </td>
          </tr>
        );
      })
    }</tbody>
  );
}

function Controls({bpm, updateBPM, playing, start, stop, addTrack, share}) {
  const onChange = event => updateBPM(parseInt(event.target.value, 10));
  return (
    <tfoot className="controls">
      <tr>
        <td style={{textAlign: "right"}}>
          <FABButton mini colored onClick={addTrack} title="Add new track">
            <Icon name="add" />
          </FABButton>
        </td>
        <td />
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
        <td colSpan="2">
          <FABButton mini onClick={share} title="Share">
            <Icon name="share" />
          </FABButton>
        </td>
      </tr>
    </tfoot>
  );
}

function ShareDialog({hash, closeDialog}) {
  return (
    <Dialog open>
      <DialogTitle>Share</DialogTitle>
      <DialogContent>
        <p>Send this link to your friends so they can enjoy your piece:</p>
        <p className="share-link" style={{textAlign: "center"}}>
          <a className="mdl-button mdl-js-button mdl-button--colored"
            href={"#" + hash} onClick={event => event.preventDefault()}>Link</a>
        </p>
        <p>Right-click, <em>Copy link address</em> to copy the link.</p>
      </DialogContent>
      <DialogActions>
        <Button colored type="button" onClick={closeDialog}>close</Button>
      </DialogActions>
    </Dialog>
  );
}

class App extends Component {
  loop: Tone.Sequence;

  state: {
    bpm: number,
    currentBeat: number,
    playing: boolean,
    tracks: Track[],
    shareHash: ?string,
  };

  constructor(props: {}) {
    super(props);
    const hash = location.hash.substr(1);
    if (hash.length > 0) {
      try {
        const {bpm, tracks}: {
          bpm: number,
          tracks: EncodedTrack[],
        } = JSON.parse(atob(hash));
        this.initializeState({
          bpm,
          tracks: model.decodeTracks(tracks),
        });
      } catch(e) {
        console.warn("Unable to parse hash", hash, e);
        this.initializeState({tracks: model.initTracks()});
      } finally {
        location.hash = "";
      }
    } else {
      this.initializeState({tracks: model.initTracks()});
    }
  }

  initializeState(state: {bpm?: number, tracks: Track[]}) {
    this.state = {
      bpm: 120,
      playing: false,
      currentBeat: -1,
      shareHash: null,
      ...state,
    };
    this.loop = sequencer.create(state.tracks, this.updateCurrentBeat);
    sequencer.updateBPM(this.state.bpm);
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

  addTrack = () => {
    const {tracks} = this.state;
    this.updateTracks(model.addTrack(tracks));
  };

  clearTrack = (id: number) => {
    const {tracks} = this.state;
    this.updateTracks(model.clearTrack(tracks, id));
  };

  deleteTrack = (id: number) => {
    const {tracks} = this.state;
    this.updateTracks(model.deleteTracks(tracks, id));
  };

  toggleTrackBeat = (id: number, beat: number) => {
    const {tracks} = this.state;
    this.updateTracks(model.toggleTrackBeat(tracks, id, beat));
  };

  setTrackVolume = (id: number, vol: number) => {
    const {tracks} = this.state;
    this.updateTracks(model.setTrackVolume(tracks, id, vol));
  };

  muteTrack = (id: number) => {
    const {tracks} = this.state;
    this.updateTracks(model.muteTrack(tracks, id));
  };

  updateBPM = (newBpm: number) => {
    sequencer.updateBPM(newBpm);
    this.setState({bpm: newBpm});
  };

  updateTrackSample = (id: number, sample: string) => {
    const {tracks} = this.state;
    this.updateTracks(model.updateTrackSample(tracks, id, sample));
  };

  closeDialog = () => {
    this.setState({shareHash: null});
  };

  randomSong = () => {
    const {bpm, tracks} = model.randomSong();
    this.updateTracks(tracks);
    this.updateBPM(bpm);
  };

  share = () => {
    const {bpm, tracks} = this.state;
    const shareHash = btoa(JSON.stringify({
      bpm,
      tracks: model.encodeTracks(tracks),
    }));
    this.setState({shareHash});
  };

  render() {
    const {bpm, currentBeat, playing, shareHash, tracks} = this.state;
    const {updateBPM, start, stop, addTrack, share, randomSong, closeDialog} = this;
    return (
      <div className="app">
        <h3>tinysynth</h3>
        {shareHash ?
          <ShareDialog hash={shareHash} closeDialog={closeDialog} /> : null}
        <table>
          <tr>
            <td colSpan="19">
              <p style={{textAlign: "right"}}>
                <Button type="button" colored onClick={randomSong}>I am uninspired, get me some random tracks</Button>
              </p>
            </td>
          </tr>
          <TrackListView
            tracks={tracks}
            currentBeat={currentBeat}
            toggleTrackBeat={this.toggleTrackBeat}
            setTrackVolume={this.setTrackVolume}
            updateTrackSample={this.updateTrackSample}
            muteTrack={this.muteTrack}
            randomSong={this.randomSong}
            clearTrack={this.clearTrack}
            deleteTrack={this.deleteTrack} />
          <Controls {...{bpm, updateBPM, playing, start, stop, addTrack, share}} />
        </table>
      </div>
    );
  }
}

export default App;
