let baseHost = 'http://daily-crm-test.hzxituan.com';
let h5Host = 'https://myouxuan.hzxituan.com';
const host = window.location.host;
// 日常
if (host.indexOf('daily-xt-crmadmin') >= 0) {
  baseHost = 'http://daily-crm-test.hzxituan.com';
  h5Host = 'https://daily-myouxuan.hzxituan.com';
}
// 预发
else if (host.indexOf('pre-xt-crmadmin') >= 0) {
  baseHost = 'https://pre-xt-crm-api.hzxituan.com';
  h5Host = 'https://pre-xt-myouxuan.hzxituan.com/pre/index.html';
}
// 测试
else if (host.indexOf('test-crmadmin') >= 0) {
  baseHost = 'https://testapi-crmadmin.hzxituan.com';
  h5Host = 'https://testing.hzxituan.com';
}
// 正式
else if (host.indexOf('xt-crmadmin') >= 0) {
  baseHost = 'https://youxuan-crm-api.hzxituan.com';
  h5Host = 'https://myouxuan.hzxituan.com';
}

// baseHost = 'http://192.168.10.114:8080';
baseHost = 'http://192.168.10.52:8081';
export { baseHost, h5Host };