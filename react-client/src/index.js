import React from 'react';
import ReactDOM from 'react-dom';
import {ConnectedRouter} from 'connected-react-router';
import {Provider} from 'react-redux'
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {initializeIcons} from '@uifabric/icons';
import axios from 'axios';
import {history, store} from "./store";

initializeIcons();


axios.defaults.baseURL = 'http://10.0.1.142:8000/';

ReactDOM.render((
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App/>
    </ConnectedRouter>
  </Provider>
), document.getElementById('root'));
registerServiceWorker();
