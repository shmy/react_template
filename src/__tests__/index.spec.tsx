import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';

jest.mock('react-dom', () => ({ render: jest.fn() }));

describe('Test Application root', () => {
  it('should render without crashing', () => {
    const div = document.createElement('div');
    div.id = 'app';
    document.body.appendChild(div);
    require('../index.tsx');
    expect(ReactDOM.render).toHaveBeenCalledWith(<App/>, div);
  });
});
