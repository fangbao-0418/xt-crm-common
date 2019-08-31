let baseHost = 'http://daily-crm-test.hzxituan.com';
const host = window.location.host;
if (host.indexOf('daily-xt-crmadmin') >= 0) {
  baseHost = 'http://daily-crm-test.hzxituan.com';
} else if (host.indexOf('pre-xt-crmadmin') >= 0) {
  baseHost = 'https://pre-xt-crm-api.hzxituan.com';
} else if (host.indexOf('test-crmadmin') >= 0) {
  baseHost = 'https://testapi-crmadmin.hzxituan.com';
} else if (host.indexOf('xt-crmadmin') >= 0) {
  baseHost = 'https://youxuan-crm-api.hzxituan.com';
}

// baseHost = 'http://192.168.10.52:8081';

export default baseHost;