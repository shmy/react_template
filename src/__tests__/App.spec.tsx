import React from 'react';
import App from '../App';
import {shallow} from 'enzyme';


describe('Test App.tsx', () => {
  it('should render without crashing', () => {
    const renderer = shallow(<App/>);
    expect(renderer.text()).toContain('Hello React');
  });
});
