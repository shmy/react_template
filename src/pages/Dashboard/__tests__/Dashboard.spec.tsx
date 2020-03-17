import React from 'react';
import {mount} from "enzyme";
import Dashboard from "@/pages/Dashboard/Dashboard";
import {Dropdown, Menu} from "antd";
import history from "@/utils/history";
jest.mock('@/utils/history', () => {
  return {
    replace: jest.fn(),
  };
});

describe('Test Dashboard', () => {
  it('should render without crashing', () => {

    const wrapper = mount(<Dashboard />);
    const overlayWrapper = mount(<>{wrapper.find(Dropdown).prop('overlay')}</>);
    overlayWrapper.find(Menu.Item).simulate('click');
    expect(history.replace).toBeCalledWith('/login');
  });
});
