import React from 'react';
import {mount} from "enzyme";
import Dashboard from "@/pages/Dashboard/Dashboard";
import {Dropdown, Menu} from "antd";

describe('Test Dashboard', () => {
  it('should render without crashing', () => {
    const history: any = {
      replace: jest.fn(),
    };
    const location: any = {};
    const match: any = {};
    const wrapper = mount(<Dashboard history={history} location={location} match={match} />);
    const overlayWrapper = mount(<>{wrapper.find(Dropdown).prop('overlay')}</>);
    overlayWrapper.find(Menu.Item).simulate('click');
    expect(history.replace).toBeCalledWith('/login');
  });
});
