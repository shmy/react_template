import React, {lazy, Suspense, useState} from 'react';
import {Avatar, Button, Dropdown, Layout, Menu, Result} from "antd";
import {HomeOutlined, LogoutOutlined} from '@ant-design/icons';
import styles from "./Dashboard.module.scss";
import {Link, Redirect, Route, RouteComponentProps, Switch} from "react-router-dom";
import SideMenu from "@/components/SideMenu/SideMenu";

const Routes: React.FC = () => {
  return (
    <Suspense fallback={<></>}>
      <Switch>
        <Route exact path="/system/application" component={lazy(() => import('../Frames/Application/Application'))}/>
        <Route exact path="/system/personnel" component={lazy(() => import('../Frames/Personnel/Personnel'))}/>
        {/*index*/}
        <Redirect exact path="/" to="/system/application"/>
        {/*404*/}
        <Route exact render={() => <Result title="页面不存在" status="404" extra={<Link component={(props) => <Button onClick={props.navigate} type="primary">{props.children}</Button>} to="/"><HomeOutlined/>点击返回首页</Link>}/>}/>
      </Switch>
    </Suspense>
  );
};


const Dashboard: React.FC<RouteComponentProps> = props => {
  const handleLogout = () => {
    props.history.replace('/login');
  };
  return (
    <Layout className={styles.dashboard}>

        <Layout.Header className={styles.header}>
          <div className={styles.headerContent}/>
          <Dropdown overlay={
            <Menu>
              <Menu.Item onClick={handleLogout}><LogoutOutlined/>退出登录</Menu.Item>
            </Menu>
          } trigger={['hover']}>
            <Avatar style={{backgroundColor: '#87d068'}}>U</Avatar>
          </Dropdown>
        </Layout.Header>
      <Layout>
        <SideMenu/>

        <Layout.Content>
          <Routes/>
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
