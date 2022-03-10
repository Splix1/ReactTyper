import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import SingleRace from './components/SingleRace';

const Routes = () => {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/home" component={Home} />
        <Route exact path="/singlesprint" component={SingleRace} />
        <Route path="*" component={Home} />
      </Switch>
    </div>
  );
};

export default Routes;
