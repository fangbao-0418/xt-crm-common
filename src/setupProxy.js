const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    proxy('/crm', {
      target:
        // 'http://192.168.0.154:8080',
        //  'http://jkwd.coseast.com',
        // 'http://112.124.38.147:8080',
        // 'http://47.99.188.25:8082',
        'http://daily-crm-test.hzxituan.com',
        // "http://192.168.10.44:8080",
        // "http://192.168.10.60:8080",

      secure: false,
      changeOrigin: true,
      pathRewrite: {
        '^/crm': '/',
      },
    }),
  );
};
