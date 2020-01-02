const proxy = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    proxy('/mock', {
      target: 'http://192.168.20.21/mock/135/api/',
      secure: false,
      changeOrigin: true,
      pathRewrite: {'^/mock' : ''}
    })
  )
}