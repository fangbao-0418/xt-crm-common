const http = require('./http')
const { message } = require('antd')
const APP = {
  history: {},
  success: function (text, duration = 1) {
    message.success(text, duration)
  },
  error: function (text, duration = 1) {
    message.error(text, duration)
  },
  http
}
module.exports = APP
