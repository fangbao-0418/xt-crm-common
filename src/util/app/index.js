/*
 * @Date: 2020-03-16 14:01:18
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-12 15:47:39
 * @FilePath: /eslint-plugin-xt-react/Users/fangbao/Documents/xituan/xt-crm/src/util/app/index.js
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
  moon: {
    oper: function () {
      if (window.Moon) {
        try {
          // console.log(arguments[0], 'app moon oper')
          window.Moon.oper.apply(null, arguments)
        } catch (e) {
          var response = arguments[0]
          var message = ' response is '
          try {
            message += JSON.stringify(response)
          } catch (e2) {
            message += response
          }
          if (e && e instanceof Error) {
            e.name = 'Oper Error'
            e.message += ',' + (message || e.message)
          }
          APP.moon.error(e)
        }
      }
    },
    error: function (err) {
      /** 注意参数是否是Error类型 */
      // console.log(err, 'app moon error')
      if (window.Moon) {
        if (err instanceof Error) {
          window.Moon.error(err)
          return
        }
        try {
          var tempError = new Error('')
          var message = err
          if (err instanceof Object) {
            message = JSON.stringify(err)
          }
          tempError.name = 'Self Error'
          tempError.message = message
          console.log(tempError, 'tempError')
          window.Moon.error(err)
        } catch (e) {
          if (e && e instanceof Error) {
            e.name = 'error catch'
            window.Moon.error(e)
          }
        }
      }
    }
  },
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
  open: function (url) {
    url = String(url || '').trim()
    url = (/^(https?|#)/).test(url) ? url : '#' + url
    window.open(url)
  },
  href: function (url, target) {
    url = String(url || '').trim()
    url = (/^(https?|#)/).test(url) ? url : '#' + url
    if (target === '__blank') {
      APP.open(url)
      return
    }
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
