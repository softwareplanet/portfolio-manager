import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { initializeIcons } from '@uifabric/icons';
import axios from 'axios';

initializeIcons();


axios.defaults.baseURL = 'http://10.0.1.142:8000/';

ReactDOM.render((
  <BrowserRouter>
    <App />
  </BrowserRouter>
), document.getElementById('root'));
registerServiceWorker();
