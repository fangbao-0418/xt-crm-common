import { message } from 'antd'
import * as regular from './regular'
var constant = require('./constant').default
var http = require('./http')
var fn = require('./fn')

function getUser () {
  var userStr = localStorage.getItem('user')
  var user = {}
  try {
    user = JSON.parse(userStr)
  } catch (e) {
    console.log(e)
  }
  user.menuGathers = user.menuGathers || []
  return user
}

Object.assign(APP, {
  history: {},
  user: getUser(),
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
