const { message } = require('antd')
const APP = {
  history: {},
  success: (text, duration = 1) => {
    message.success(text, duration)
  },
  error: (text, duration = 1) => {
    message.error(text, duration)
  }
}
module.exports = APP
