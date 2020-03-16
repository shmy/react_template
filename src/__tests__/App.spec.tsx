import React from 'react';
import App from '../App';
import {shallow} from 'enzyme';


describe('Test App.tsx', () => {
  it('should render without crashing', () => {
    shallow(<App/>);
  });
});
