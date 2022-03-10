import React from 'react';
import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <div id="race">
      <div id="react-typer">
        <nav>
          <div>
            <NavLink
              exact
              to="/home"
              className={`inactive nav-button`}
              activeClassName={'active'}
            >
              Home
            </NavLink>
          </div>
          <div>
            <NavLink
              exact
              to="/singlesprint"
              className={`inactive nav-button`}
              activeClassName={'active'}
            >
              Single Sprint
            </NavLink>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
