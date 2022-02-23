import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './Home';
import SingleRace from './SingleRace';

const Routes = () => {
  return (
    <Router>
      <div>
        <nav></nav>
        <main>
          <Route exact path="/" component={Home} />
          <Route exact path="/singlerace" component={SingleRace} />
        </main>
      </div>
    </Router>
  );
};

export default Routes;
