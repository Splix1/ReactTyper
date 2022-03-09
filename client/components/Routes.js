import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './Home';
import SingleRace from './SingleRace';
import NavBar from './NavBar';

const Routes = () => {
  return (
    <Router>
      <div id="react-typer">
        <nav>
          <NavBar />
        </nav>
        <main id="race">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/singlesprint" component={SingleRace} />
            <Route path="*" component={Home} />
          </Switch>
        </main>
      </div>
    </Router>
  );
};

export default Routes;
