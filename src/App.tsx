import React, {lazy, Suspense} from 'react';
import logo from "@/assets/logo.png";
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

const App: React.FC = () => {
  return (
    <Router>
      <Suspense fallback={<></>}>
        <Switch>
          <Route exact path="/" component={lazy(() => import('./pages/Dashboard'))}/>
          <Route exact path="/login" component={lazy(() => import('./pages/Login/Login'))}/>
        </Switch>
      </Suspense>
    </Router>
  );
};

export default App;
