import React, { useEffect, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';

export default function Home() {
  const history = useHistory();
  const [roomID, setRoomID] = useState(1);

  useEffect(() => {
    history.push('/');
  }, []);

  function createRoom(evt) {
    evt.preventDefault();
    history.push(`/sprintrace?rid=${roomID}`);
  }

  return (
    <main id="home-game-options">
      <div id="single-sprint-option">
        <NavLink to="/singlesprint">
          <h1>30 Second Solo Sprint</h1>
        </NavLink>
      </div>
      <div id="sprint-race-option">
        <NavLink to="/sprintrace">
          <h1>30 Second Multiplayer Sprint</h1>
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
    </main>
  );
}
