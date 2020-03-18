import React, {ReactElement} from 'react';
import {HomeOutlined} from '@ant-design/icons';

export interface IMenu {
  name: string;
  path: string;
  icon: ReactElement;
  children?: IMenu[];
}
const menus: IMenu[] = [
  {
    path: '/system',
    name: '系统管理',
    icon: <HomeOutlined/>,
    children: [
      {
        path: '/system/application',
        name: '应用管理',
        icon: <HomeOutlined/>,
      },

    ]
  },
  {
    path: '/system/personnel',
    name: '人员管理',
    icon: <HomeOutlined/>
  }
];
export default menus;
