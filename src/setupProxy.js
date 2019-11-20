const proxy = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    proxy('/mock', {
      target: 'http://mock-ued.hzxituan.com/mock/5dc2ac6048f0fe0016ffe499/crm/',
      secure: false,
      changeOrigin: true,
      pathRewrite: {'^/mock' : ''}
    })
  )
};
