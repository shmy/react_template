import React, {ReactElement, useEffect, useMemo, useRef, useState} from 'react';
import {Layout, Menu} from "antd";
import menus, {IMenu} from "@/utils/menu";
import history from "@/utils/history";
import {UnregisterCallback} from "history";
import styles from './SideMenu.module.scss';

const getMenu = (menus: IMenu[]) => {
  const result: ReactElement[] = [];
  for (const menu of menus) {
    if (menu.children) {
      result.push(<Menu.SubMenu title={<>{menu.icon}<span>{menu.name}</span></>} key={menu.path}>
        {getMenu(menu.children)}
      </Menu.SubMenu>)
    } else {
      result.push(<Menu.Item onClick={() => history.push(menu.path)} key={menu.path}>{menu.icon}<span>{menu.name}</span></Menu.Item>)
    }
  }
  return result;
};
const parseModule = (pathname: string) => {
  const paths = pathname.split('/');
  if (paths.length < 3) {
    return [];
  }
  return ['/' + paths[1]];
};

const SideMenu: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('');
  const unregisterCallback = useRef<UnregisterCallback>();
  const defaultOpenKeys = useMemo(() => {
    return parseModule(history.location.pathname);
  }, [history.location.pathname]);
  useEffect(() => {
    setSelectedKey(history.location.pathname);
    unregisterCallback.current = history.listen(({pathname}) => {
      setSelectedKey(pathname);
    });
    return () => {
      unregisterCallback.current && unregisterCallback.current();
    };
  }, []);
  return (
    <Layout.Sider className={styles.scroller} collapsible collapsed={collapsed} onCollapse={setCollapsed}>
      <Menu theme="dark" mode="inline"
            defaultOpenKeys={defaultOpenKeys}
            selectedKeys={[selectedKey]}>
        {...getMenu(menus)}
      </Menu>
    </Layout.Sider>
  );
};

export default SideMenu;