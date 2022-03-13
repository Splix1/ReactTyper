import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux';

function Navbar() {
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state) => {
    return !!state.auth.id;
  });

  const { username } = useSelector((state) => {
    return state.auth;
  });

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
            <div className="dropdown">
              <div style={{ color: 'white' }}>Modes</div>
              <div className="dropdown-content">
                {isLoggedIn ? (
                  <div>
                    <NavLink to="/singlesprint">SingleSprint</NavLink>
                    <NavLink to="/createsprintrace">SprintRace</NavLink>
                  </div>
                ) : (
                  <NavLink to="/singlesprint">SingleSprint</NavLink>
                )}
              </div>
            </div>
          </div>
          <div>
            <div className="userDropdown">
              {isLoggedIn ? (
                <div>
                  <div style={{ color: 'white' }}>{username}</div>
                  <div className="userDropdown-content">
                    <a
                      href="#"
                      style={{ textDecoration: 'none', color: 'white' }}
                      onClick={() => dispatch(logout())}
                    >
                      Logout
                    </a>
                  </div>
                </div>
              ) : (
                <div>
                  <NavLink
                    to="/login"
                    className={`inactive nav-button`}
                    activeClassName={'active'}
                  >
                    Login
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
