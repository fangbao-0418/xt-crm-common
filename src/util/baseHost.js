let baseHost = 'https://daily-crm-test.hzxituan.com'
let h5Host = 'https://myouxuan.hzxituan.com'
let env = __ENV__

/** 获取所选环境，预发/生产不可选环境 */
if (!['pre', 'prod'].includes(env) && localStorage.getItem('env')) {
  env = localStorage.getItem('env')
}

// 日常
if (env === 'dev') {
  baseHost = 'https://daily-crm-test.hzxituan.com'
  h5Host = 'https://xtyouxuan.hzxituan.com/v0909_coupon/index.html'
}
// 测试1
else if (env === 'test') {
  baseHost = 'https://testapi-crmadmin.hzxituan.com'
  h5Host = 'https://testing.hzxituan.com/v0909_coupon/index.html'
}
// 测试2
else if (env === 'test2') {
  baseHost = 'https://test2api-crmadmin.hzxituan.com'
  h5Host = 'https://testing.hzxituan.com/v0909_coupon/index.html'
}
// 预发
else if (env === 'pre') {
  baseHost = 'https://pre-xt-crm-api.hzxituan.com'
  h5Host = 'https://pre-xt-myouxuan.hzxituan.com/v0909_coupon/index.html'
}
// 正式
else if (env === 'prod') {
  baseHost = 'https://youxuan-crm-api.hzxituan.com'
  h5Host = 'https://myouxuan.hzxituan.com'
}

export { baseHost, h5Host, env }
