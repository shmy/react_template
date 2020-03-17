import React from 'react';
import {mount} from "enzyme";
import Dashboard from "@/pages/Dashboard/Dashboard";
import {Dropdown, Menu} from "antd";
import {Router} from "react-router-dom";
import {createMemoryHistory} from "history";

describe('Test Dashboard', () => {
  const routerHistory = createMemoryHistory();
  const history: any = {
    replace: jest.fn(),
  };
  const location: any = {};
  const match: any = {};
  const ComponentWithRouter = () => <Router history={routerHistory}><Dashboard history={history} location={location} match={match} /></Router>;

  it('should render without crashing', () => {
    const wrapper = mount(<ComponentWithRouter/>);
    const overlayWrapper = mount(<>{wrapper.find(Dropdown).prop('overlay')}</>);
    overlayWrapper.find(Menu.Item).simulate('click');
    expect(history.replace).toBeCalledWith('/login');
  });

  it('should render without crashing to navigate', () => {
    routerHistory.push('/system/application');
    mount(<ComponentWithRouter/>);
    routerHistory.push('/system/personnel');
    mount(<ComponentWithRouter/>);
    routerHistory.push('/--not-found--');
    mount(<ComponentWithRouter/>);
  });
});
