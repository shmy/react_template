import React from 'react';
import {mount} from 'enzyme';
import {default as Frame} from './Frame';
describe('Test Frame', () => {
    it('should render without crashing', () => {
        const wrapper = mount(<Frame />);
    });
});
