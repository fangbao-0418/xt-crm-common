/*
 * @Author: fangbao
 * @Date: 2020-03-27 19:49:47
 * @LastEditors: fangbao
 * @LastEditTime: 2020-04-22 17:35:26
 * @FilePath: /xt-wms/Users/fangbao/Documents/xituan/xt-crm/src/util/moon.js
 */
(function (a, b) {
  const env = process.env.PUB_ENV
  a._moon_ = {
    mid: 'jw0pzj9nh',
    domain: env !== 'prod' ? 'https://test-rlcas.hzxituan.com' : 'https://rlcas.hzxituan.com',
    file: [],
    env,
    reqType: 'http',
    spa: true
  }
  const m = b.createElement('script')
  m.async = true
  m.onload = function () {
  }
  m.src = 'https://cdn.hzxituan.com/npm/moon/v1.0.3/moon.js'
  const c = b.getElementsByTagName('script')[0]
  c.parentNode.insertBefore(m, c)
})(window, document)