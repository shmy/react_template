import React, {lazy, Suspense, useState} from 'react';
import {Avatar, Dropdown, Layout, Menu} from "antd";
import {LogoutOutlined} from '@ant-design/icons';
import styles from "./Dashboard.module.scss";
import {Route, RouteComponentProps, Switch} from "react-router-dom";

const Routes: React.FC = () => {
  return (
    <Suspense fallback={<></>}>
      <Switch>
        <Route exact path="/application" component={lazy(() => import('../Frames/Application/Application'))}/>
        <Route exact path="/personnel" component={lazy(() => import('../Frames/Personnel/Personnel'))}/>
      </Switch>
    </Suspense>
  );
};

const SideMenu: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Layout.Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
      <Menu theme="dark" mode="inline">
      </Menu>
    </Layout.Sider>
  );
};

const Dashboard: React.FC<RouteComponentProps> = props => {
  const handleLogout = () => {
    props.history.replace('/login');
  };
  return (
    <Layout className={styles.dashboard}>
      <SideMenu/>
      <Layout>
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
        <Layout.Content>
          <Routes/>
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
