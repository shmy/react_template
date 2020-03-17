import React, {ReactElement, useEffect, useRef, useState} from 'react';
import {Layout, Menu} from "antd";
import menus, {IMenu} from "@/utils/menu";
import history from "@/utils/history";
import {UnregisterCallback} from "history";
import styles from './SideMenu.module.scss';

const getMenu = (menus: IMenu[]) => {
  const result: ReactElement[] = [];
  for (const menu of menus) {
    if (menu.children) {
      result.push(<Menu.SubMenu title={menu.name} key={menu.path}>
        {getMenu(menu.children)}
      </Menu.SubMenu>)
    } else {
      result.push(<Menu.Item onClick={() => history.push(menu.path)} key={menu.path}>{menu.name}</Menu.Item>)
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
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const unregisterCallback = useRef<UnregisterCallback>();

  useEffect(() => {
    const {pathname} = history.location;
    setSelectedKey(pathname);
    setOpenKeys(parseModule(pathname));
    unregisterCallback.current = history.listen(({pathname}) => {
      setSelectedKey(pathname);
      setOpenKeys(parseModule(pathname));
    });
    return () => {
      unregisterCallback.current && unregisterCallback.current();
    };
  }, []);
  return (
    <Layout.Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
      <Menu theme="dark" mode="inline"
            onOpenChange={setOpenKeys}
            openKeys={openKeys}
            selectedKeys={[selectedKey]}>
        <div className={styles.logo}/>
        {...getMenu(menus)}
      </Menu>
    </Layout.Sider>
  );
};

export default SideMenu;
