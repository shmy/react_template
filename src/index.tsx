import React from 'react';
import ReactDOM from 'react-dom';
import {Router} from "react-router-dom";
import App from '@/App';
import history from "@/utils/history";
import '@/assets/style.scss';

ReactDOM.render(<Router history={history}><App/></Router>, document.getElementById('app'));
