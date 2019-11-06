const proxy = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    proxy('/mock', {
      target: 'http://mock-ued.hzxituan.com/mock/5dc23c9848f0fe0016ffe3bd/daily',
      secure: false,
      changeOrigin: true,
      pathRewrite: {'^/mock' : ''}
    })
  )
};
