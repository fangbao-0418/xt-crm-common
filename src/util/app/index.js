import { message } from 'antd'
import * as regular from './regular'
var http = require('./http')
var fn = require('./fn')
Object.assign(APP, {
  history: {},
  success: function (text, duration = 1) {
    message.success(text, duration)
  },
  error: function (text, duration = 1) {
    message.error(text, duration)
  },
  http,
  fn,
  regular
})
