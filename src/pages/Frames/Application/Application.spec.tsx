import React from 'react';
import {mount} from "enzyme";
import Application from "@/pages/Frames/Application/Application";
import Frame from "@/components/Frame/Frame";

describe('Test Application', () => {
  it('should render without crashing', () => {
    const wrapper = mount(<Application />);
    wrapper.find(Frame).simulate('scroll');
  });
});
