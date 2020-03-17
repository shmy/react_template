import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {Router} from "react-router-dom";
import history from "@/utils/history";

jest.mock('react-dom', () => ({render: jest.fn()}));

describe('Test Application root', () => {
  it('should render without crashing', () => {
    const div = document.createElement('div');
    div.id = 'app';
    document.body.appendChild(div);
    require('./index.tsx');
    expect(ReactDOM.render).toHaveBeenCalledWith(<Router history={history}><App/></Router>, div);
  });
});
