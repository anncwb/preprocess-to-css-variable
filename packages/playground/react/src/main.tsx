import React from 'react';
import ReactDOM from 'react-dom';
import './index.less';
import 'antd/dist/antd.less';
import App from './App';
import { generate } from '../../../core/dist/client/index';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);

generate();
