import React from 'react';
import {mount} from 'enzyme';
import Login from '../Login';
import {Button, Form, Input} from "antd";

const wait = (time = 1000) => new Promise((resolve) => {
  setTimeout(resolve, time);
});
describe('Test Login', () => {
  it('should render without crashing', () => {
    const wrapper = mount(<Login/>);
    expect(wrapper.find(Form)).toHaveLength(1);
    expect(wrapper.find('h3').text()).toBe('欢迎登录');
    expect(wrapper.find(Input)).toHaveLength(2);
    expect(wrapper.find(Button)).toHaveLength(1);
  });

  it('should validate success to submit', () => {
    const wrapper = mount(<Login/>);
    const inputs = wrapper.find(Input);
    inputs.at(0).find('input').simulate('change', {target: {value: 'test'}});
    inputs.at(1).find('input').simulate('change', {target: {value: 'test'}});
    wrapper.find(Form).simulate('submit');
  });
});
