import React, {useState} from 'react';
import {Avatar, Dropdown, Layout, Menu} from "antd";
import { LogoutOutlined } from '@ant-design/icons';
import styles from "./Dashboard.module.scss";
import history from "@/utils/history";

const Dashboard: React.FC = props => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Layout className={styles.dashboard}>
      <Layout.Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <Menu theme="dark" mode="inline">
        </Menu>
      </Layout.Sider>
      <Layout>
        <Layout.Header className={styles.header}>
          <div className={styles.headerContent} />
          <Dropdown overlay={
            <Menu>
              <Menu.Item onClick={() => {
                history.replace('/login');
              }}><LogoutOutlined />退出登录</Menu.Item>
            </Menu>
          } trigger={['hover']}>
            <Avatar style={{backgroundColor: '#87d068'}}>U</Avatar>
          </Dropdown>
        </Layout.Header>
        <Layout.Content>Content</Layout.Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
