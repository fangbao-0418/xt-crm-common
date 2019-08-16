import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import App from './App';
import './assets/css/common.css';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { init } from '@rematch/core';
import createLoadingPlugin from '@rematch/loading';
import models from './model-store';
moment.locale('zh-cn');

const loading = createLoadingPlugin();
const store = init({
  models,
  plugins: [loading]
});

ReactDOM.render(
  <ConfigProvider locale={zh_CN}>
    <Provider store={store}>
      <HashRouter>
        <App />
      </HashRouter>
    </Provider>
  </ConfigProvider>,
  document.getElementById('root'),
);
