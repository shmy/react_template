import React, {createContext, FC, lazy, Suspense, useContext, useState} from 'react';
import {Button, Layout, Result} from "antd";
import {HomeOutlined} from '@ant-design/icons';
import styles from "./Dashboard.module.scss";
import {Link, Redirect, Route, RouteComponentProps, Switch} from "react-router-dom";
import SideMenu from "@/components/SideMenu/SideMenu";
import {useRequest} from "@umijs/hooks";
import http, {AfterResponse} from "@/utils/http";
import Header from "@/components/Header/Header";

const Routes: FC = () => {
  const {menu} = useDashboardContext();
  return (
    <Suspense fallback={<></>}>
      <Switch>
        <Route exact path="/application" component={lazy(() => import('../Frames/Application/Application'))}/>
        <Route exact path="/application/:id" component={lazy(() => import('../Frames/Application/Detail'))}/>
        <Route exact path="/personnel" component={lazy(() => import('../Frames/Personnel/Personnel'))}/>
        <Route exact path="/log" component={lazy(() => import('../Frames/Log/Log'))}/>
        <Route exact path="/app_list" component={lazy(() => import('../Frames/AppList/AppList'))}/>
        {/*index*/}
        {menu.length > 0 ? <Redirect exact path="/" to={(menu[0] as any).path}/> : null}
        {/*404*/}
        <Route exact render={() => <Result title="页面不存在" status="404" extra={<Link
          component={(props) => <Button onClick={props.navigate} type="primary">{props.children}</Button>}
          to="/"><HomeOutlined/>点击返回首页</Link>}/>}/>
      </Switch>
    </Suspense>
  );
};
const getDefaultData = () => ({user: {}, menu: []});
export const DashboardContext = createContext(getDefaultData());
export const useDashboardContext = () => {
  const value = useContext(DashboardContext);
  return value || getDefaultData();
};
const Dashboard: FC<RouteComponentProps> = props => {
  const {loading, data} = useRequest<AfterResponse<any>>(() => http.get('/v1/initial_data'), {
    loadingDelay: 0,
    initialData: getDefaultData(),
  });
  if (loading) {
    return null;
  }
  return (
    <DashboardContext.Provider value={data}>
      <Layout className={styles.dashboard}>
        <Header/>
        <Layout>
          <SideMenu/>
          <Layout.Content>
            <Routes/>
          </Layout.Content>
        </Layout>
      </Layout>
    </DashboardContext.Provider>
  );
};

export default Dashboard;
