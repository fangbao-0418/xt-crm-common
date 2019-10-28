const proxy = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    proxy('/mock', {
      target: 'http://mock-ued.hzxituan.com/mock/5da1a097b62ce300168bb5d7/crm',
      secure: false,
      changeOrigin: true,
      pathRewrite: {'^/mock' : ''}
    })
  )
};
