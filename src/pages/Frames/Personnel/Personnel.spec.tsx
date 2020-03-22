import React from 'react';
import {mount} from "enzyme";
import Personnel from "@/pages/Frames/Personnel/Personnel";

xdescribe('Test Personnel', () => {
  it('should render without crashing', () => {
    mount(<Personnel/>);
  });
});
