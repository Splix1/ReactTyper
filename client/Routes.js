import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import Home from './components/Home';
import SingleRace from './components/SingleRace';
import { me } from './redux';
import Login from './components/Login';
import Signup from './components/Signup';
import CreateSprintRace from './components/CreateSprintRace';
import SprintRace from './components/SprintRace';

const Routes = () => {
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state) => {
    return !!state.auth.id;
  });

  useEffect(() => {
    dispatch(me());
  }, []);

  return (
    <div>
      {isLoggedIn ? (
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/singlesprint" component={SingleRace} />
          <Route exact path="/createsprintrace" component={CreateSprintRace} />
          <Route exact path="/sprintrace" component={SprintRace} />
          <Route path="*" component={Home} />
        </Switch>
      ) : (
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/singlesprint" component={SingleRace} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="*" component={Home} />
        </Switch>
      )}
    </div>
  );
};

export default Routes;
