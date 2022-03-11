import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux';

function Navbar() {
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state) => {
    return !!state.auth.id;
  });

  // const { username, role } = useSelector((state) => {
  //   return state.auth;
  // });

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
          {isLoggedIn ? (
            <a
              href="#"
              style={{ textDecoration: 'none', color: 'white' }}
              onClick={() => dispatch(logout())}
            >
              Logout
            </a>
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
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
