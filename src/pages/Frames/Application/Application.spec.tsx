import React from 'react';
import {mount} from "enzyme";
import Application from "@/pages/Frames/Application/Application";
import Frame from "@/components/Frame/Frame";
import Login from "@/pages/Login/Login";

describe('Test Application', () => {
  it('should render without crashing', () => {
    const history: any = {
      replace: jest.fn(),
    };
    const location: any = {};
    const match: any = {};
    const wrapper = mount(<Application history={history} location={location} match={match} />);
    wrapper.find(Frame).simulate('scroll');
  });
});
