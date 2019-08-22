var list = require('./list.json');
var taskList = require('./taskList.json');
module.exports = function (server) {
  server.get('/api/coupon/list', function (req, res) {
    req.body = {};
    res.send({
      data: { list },
      message: null,
      success: true
    });
  });
  server.get('/api/coupon/tasklist', function (req, res) {
    req.body = {};
    res.send({
      data: { list: taskList },
      message: null,
      success: true
    });
  })
};