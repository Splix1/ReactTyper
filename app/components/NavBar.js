import React from 'react';
import { NavLink } from 'react-router-dom';

function NavBar() {
  return (
    <div>
      <div>
        <NavLink
          exact
          to="/"
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
    </div>
  );
}

export default NavBar;
