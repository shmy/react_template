import React from 'react';
import {mount} from "enzyme";
import Application from "@/pages/Frames/Application/Application";

describe('Test Application', () => {
  it('should render without crashing', () => {
    mount(<Application />);
  });
});
