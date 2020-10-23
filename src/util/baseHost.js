let baseHost = 'https://daily-crm-test.hzxituan.com'
let h5Host = 'https://myouxuan.hzxituan.com'
let env = __ENV__

// 日常
if (env === 'dev') {
  baseHost = 'https://daily-crm-test.hzxituan.com'
  h5Host = 'https://daily-myouxuan.hzxituan.com'
}
// 测试1
else if (env === 'test') {
  baseHost = 'https://testapi-crmadmin.hzxituan.com'
  h5Host = 'https://testing.hzxituan.com'
}
// 测试2
else if (env === 'test2') {
  baseHost = 'https://test2api-crmadmin.hzxituan.com'
  h5Host = 'https://testing.hzxituan.com'
}
// 预发
else if (env === 'pre') {
  baseHost = 'https://pre-xt-crm-api.hzxituan.com'
  h5Host = 'https://pre-xt-myouxuan.hzxituan.com'
}
// 正式
else if (env === 'prod') {
  baseHost = 'https://youxuan-crm-api.hzxituan.com'
  h5Host = 'https://myouxuan.hzxituan.com'
}

function getEnv () {
  /** 获取所选环境，预发/生产不可选环境 */
  if (!['pre', 'prod'].includes(env) && localStorage.getItem('env')) {
    env = localStorage.getItem('env')
  }
  return env
}

export {
  getEnv,
  baseHost,
  h5Host
}
