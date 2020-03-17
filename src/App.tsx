import React, {lazy, Suspense} from 'react';
import {Switch, Route} from 'react-router-dom';

const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const Login = lazy(() => import('./pages/Login/Login'));

const App: React.FC = () => {
  return (
    <Suspense fallback={<></>}>
      <Switch>
        <Route exact path="/" component={Dashboard}/>
        <Route exact path="/login" component={Login}/>
      </Switch>
    </Suspense>
  );
};

export default App;
