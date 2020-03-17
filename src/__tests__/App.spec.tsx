import React from 'react';
import App from '../App';
import {mount} from 'enzyme';
import {createMemoryHistory} from 'history'
import {Router} from "react-router-dom";

const history = createMemoryHistory();
const MockRouter = (props) => <Router history={history}>{props.children}</Router>


describe('Test App.tsx', () => {
  it('should render without crashing', () => {
    mount(<MockRouter><App/></MockRouter>);
  });
  it('should render without crashing to login', () => {
    history.push('/login');
    mount(<MockRouter><App/></MockRouter>);
  });
});
