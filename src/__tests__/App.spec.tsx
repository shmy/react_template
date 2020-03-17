import React from 'react';
import App from '../App';
import {mount} from 'enzyme';
import {createMemoryHistory} from 'history'
import {Router} from "react-router-dom";

const history = createMemoryHistory();
const ComponentWithRouter = () => <Router history={history}><App/></Router>;

describe('Test App.tsx', () => {
  it('should render without crashing', () => {
    mount(<ComponentWithRouter />);
  });
  it('should render without crashing to login', () => {
    history.push('/login');
    mount(<ComponentWithRouter />);
  });
});
