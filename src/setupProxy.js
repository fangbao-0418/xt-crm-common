const proxy = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    proxy('/mock', {
<<<<<<< HEAD
      target: 'http://mock-ued.hzxituan.com/mock/5dc2ac6048f0fe0016ffe499/crm/',
=======
      target: 'http://mock-ued.hzxituan.com/mock/5dc23c9848f0fe0016ffe3bd/daily',
>>>>>>> origin/master
      secure: false,
      changeOrigin: true,
      pathRewrite: {'^/mock' : ''}
    })
  )
};
