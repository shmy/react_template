import React, {FC, useMemo} from 'react';
import styles from "./Header.module.scss";
import {Avatar, Dropdown, Layout, Menu} from "antd";
import {logout} from "@/utils/history";
import {LogoutOutlined} from '@ant-design/icons';
import {useDashboardContext} from "@/pages/Dashboard/Dashboard";
import {SERVER_STATIC_PATH} from "@/components/SingleImageUpload/SingleImageUpload";

interface HeaderProps {

}

const Header: FC<HeaderProps> = props => {
  const {user} = useDashboardContext();
  const handleLogout = () => {
    logout();
  };
  return (
    <Layout.Header className={styles.header}>
      <div className={styles.headerContent}/>
      <Dropdown overlay={
        <Menu>
          <Menu.Item onClick={handleLogout}><LogoutOutlined/>退出登录</Menu.Item>
        </Menu>
      } trigger={['hover']}>
        <Avatar src={SERVER_STATIC_PATH + (user as any).avatar_url} style={{backgroundColor: '#00aaff'}}>{(user as any).real_name || (user as any).username}</Avatar>
      </Dropdown>
    </Layout.Header>
  );
};

export default Header;
