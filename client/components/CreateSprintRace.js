import React, { useEffect, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';

export default function CreateSprintRace() {
  const history = useHistory();
  const [roomID, setRoomID] = useState(1);

  function createRoom(e) {
    e.preventDefault();
    history.push(`/sprintrace?rid=${roomID}`);
  }

  return (
    <div id="sprintrace">
      <div id="sprint-race-option">
        <NavLink to="/sprintrace" style={{ textDecoration: 'none' }}>
          <h1 style={{ color: '#c0c0c0' }}>30 Second Multiplayer Sprint</h1>
        </NavLink>
        <div id="create-sprint">
          <h3>Create a room for your friends</h3>
          <input
            type="number"
            min={1}
            placeholder="Choose a number"
            value={roomID}
            onChange={(evt) => setRoomID(evt.target.value)}
          ></input>
          <button onClick={createRoom}>Create room</button>
        </div>
      </div>
    </div>
  );
}
