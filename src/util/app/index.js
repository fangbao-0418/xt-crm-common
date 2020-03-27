/*
 * @Date: 2020-03-16 14:01:18
 * @LastEditors: fangbao
 * @LastEditTime: 2020-03-25 16:44:53
 * @FilePath: /xt-new-mini/Users/fangbao/Documents/xituan/xt-crm/src/util/app/index.js
 */
import { message } from 'antd'
import * as regular from './regular'
var constant = require('./constant').default
var http = require('./http')
var fn = require('./fn')

function getUser () {
  var userStr = localStorage.getItem('user')
  var user = {}
  try {
    user = JSON.parse(userStr) || {}
  } catch (e) {
    console.log(e)
  }
  console.log(user, 'user')
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
    url = String(url || '').trim()
    url = /^(https?|#)/.test(url) ? url : '#' + url
    console.log(url, 'url')
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
