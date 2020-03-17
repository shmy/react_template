import React from 'react';
import {mount} from "enzyme";
import Dashboard from "@/pages/Dashboard/Dashboard";

describe('Test Dashboard', () => {
  it('should render without crashing', () => {
    mount(<Dashboard />);
  });
});
