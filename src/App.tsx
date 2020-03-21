import React, {FC, lazy, Suspense} from 'react';
import {Switch, Route} from 'react-router-dom';
// import zhCN from 'antd/es/locale/zh_CN';
// import {ConfigProvider} from "antd";

const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const Login = lazy(() => import('./pages/Login/Login'));

const App: FC = () => {
  return (
    // <ConfigProvider locale={zhCN}>
      <Suspense fallback={<></>}>
        <Switch>
          <Route exact path="/login" component={Login}/>
          <Route path="/" component={Dashboard}/>
        </Switch>
      </Suspense>
    // </ConfigProvider>
  );
};

export default App;
