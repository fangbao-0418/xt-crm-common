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
  fn
}
module.exports = APP
