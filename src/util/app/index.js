var http = require('./http')
var { message } = require('antd')
var fn = require('./fn')
const APP = {
  history: {},
  success: function (text, duration = 1) {
    message.success(text, duration)
  },
  error: function (text, duration = 1) {
    message.error(text, duration)
  },
  http,
  fn,
  href: function (url, target) {
    url = /^(https?|#)/.test(url) ? url : '#' + url
    let el = document.createElement('a')
    el.setAttribute('href', url)
    if (target) {
      el.setAttribute('target', target)
    }
    el.click()
    el = null
  }
}
module.exports = APP
