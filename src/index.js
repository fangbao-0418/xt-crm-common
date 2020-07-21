/*
 * @Date: 2020-03-27 11:00:32
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-18 17:33:26
 * @FilePath: /eslint-plugin-xt-react/Users/fangbao/Documents/xituan/xt-crm/src/index.js
 */
import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ConfigProvider } from 'antd'
import 'url-search-params-polyfill'
import App from './App'
import './assets/css/common.css'
import 'viewerjs/dist/viewer.css'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'
import { init } from '@rematch/core'
import createLoadingPlugin from '@rematch/loading'
import models from './model-store'
import ErrorBoundary from '@/components/error-boundary'
moment.locale('zh-cn')

const loading = createLoadingPlugin()
const store = init({
  models,
  plugins: [loading]
})

ReactDOM.render(
  <ErrorBoundary>
    <ConfigProvider
      locale={zh_CN}
      /*
       * getPopupContainer={node => {
       *   if (node) {
       *     return node.parentNode;
       *   }
       *   return document.body;
       * }}
       */
    >
      <Provider store={store}>
        <HashRouter>
          <App />
        </HashRouter>
      </Provider>
    </ConfigProvider>
  </ErrorBoundary>,
  document.getElementById('root')
)
