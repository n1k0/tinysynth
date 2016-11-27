import React from 'react';
import SampleSelector from './SampleSelector';
import {
  Icon,
  Slider,
  Switch
} from "react-mdl";

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

export default TrackListView;
