import React, {lazy, Suspense} from 'react';
import {Switch, Route} from 'react-router-dom';

const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const Login = lazy(() => import('./pages/Login/Login'));

const App: React.FC = () => {
  return (
    <Suspense fallback={<></>}>
      <Switch>
        <Route exact path="/login" component={Login}/>
        <Route path="/" component={Dashboard}/>
      </Switch>
    </Suspense>
  );
};

export default App;
