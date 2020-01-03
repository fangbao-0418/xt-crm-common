import { message } from 'antd'
import * as regular from './regular'
var constant = require('./constant').default
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
  constant,
  href: function (url, target) {
    url = /^(https?|#)/.test(url) ? url : '#' + url
    let el = document.createElement('a')
    el.setAttribute('href', url)
    if (target) {
      el.setAttribute('target', target)
    }
    el.click()
    el = null
  },
  regular
})
