var login = require('./login/login');
var coupon = require('./coupon/coupon')
module.exports = function (server) {
  login(server);
  coupon(server);
};