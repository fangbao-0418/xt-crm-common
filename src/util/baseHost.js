let baseHost = 'https://daily-crm-test.hzxituan.com'
let h5Host = 'https://myouxuan.hzxituan.com'
let env = 'local'
const host = window.location.host
// 日常
if (host.indexOf('daily-xt-crmadmin') >= 0) {
  baseHost = 'https://daily-crm-test.hzxituan.com'
  h5Host = 'https://xtyouxuan.hzxituan.com/v0909_coupon/index.html'
  env = 'dev'
}
// 预发
else if (host.indexOf('pre-xt-crmadmin') >= 0) {
  baseHost = 'https://pre-xt-crm-api.hzxituan.com'
  h5Host = 'https://pre-xt-myouxuan.hzxituan.com/v0909_coupon/index.html'
  env = 'pre'
}
// 测试1
else if (host.indexOf('test-crmadmin') >= 0) {
  baseHost = 'https://testapi-crmadmin.hzxituan.com'
  h5Host = 'https://testing.hzxituan.com/v0909_coupon/index.html'
  env = 'test'
}
// 测试2
else if (host.indexOf('test2-crmadmin') >= 0) {
  baseHost = 'https://test2api-crmadmin.hzxituan.com'
  h5Host = 'https://testing.hzxituan.com/v0909_coupon/index.html'
  env = 'test2'
}
// 正式
else if (host.indexOf('xt-crmadmin') >= 0) {
  baseHost = 'https://youxuan-crm-api.hzxituan.com'
  h5Host = 'https://myouxuan.hzxituan.com'
  env = 'prod'
}

export { baseHost, h5Host, env }
