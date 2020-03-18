import React from 'react';
import {mount} from 'enzyme';
import Frame from './Frame';
// Frame.spec
describe('Test Frame', () => {
    it('should render without crashing', () => {
        const wrapper = mount(<Frame />);
    });
});
