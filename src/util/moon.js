/*
 * @Date: 2020-03-16 14:01:18
 * @LastEditors: fangbao
 * @LastEditTime: 2020-03-23 16:23:33
 * @FilePath: /xt-new-mini/Users/fangbao/Documents/xituan/xt-crm/src/util/moon.js
 */

(function (a, b) {
  const env = process.env.PUB_ENV
  a._moon_ = {
    mid: "jw0pzj9nh",
    domain: env !== 'prod' ? 'https://test-rlcas.hzxituan.com' : 'https://rlcas.hzxituan.com',
    file: [],
    env,
    reqType: 'http',
    spa: true
  };
  var m = b.createElement("script");
  m.async = true;
  m.src = "https://cdn.hzxituan.com/npm/moon/v1.0.0/moon.js";
  var c = b.getElementsByTagName("script")[0];
  c.parentNode.insertBefore(m, c);
})(window, document);