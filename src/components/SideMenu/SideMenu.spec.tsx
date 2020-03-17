import React from 'react';
import {mount} from "enzyme";
import SideMenu from "@/components/SideMenu/SideMenu";
import history from "@/utils/history";
import {Menu} from "antd";
import {act} from "react-dom/test-utils";

describe('Test SideMenu', () => {
  it('should render without crashing', () => {
    const wrapper = mount(<SideMenu/>);
    act(() => {
      history.push('/system/personnel');
      wrapper.unmount();
    });
  });
  it('menu-item should be click', () => {
    history.push('/system/personnel');
    const wrapper = mount(<SideMenu/>);
    act(() => {
      wrapper.find(Menu.Item).at(0).simulate('click');
    });
  });
});
