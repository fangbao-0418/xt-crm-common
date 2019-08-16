var list = require('./list.json');

module.exports = function (server) {
  server.get('/api/coupon/list', function (req, res) {
    req.body = {};
    res.send({
      data: { list },
      message: null,
      success: true
    });
  });
};