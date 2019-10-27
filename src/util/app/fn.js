export function getH5Origin () {
  let origin = 'https://daily-myouxuan.hzxituan.com/'
  const nowTime = new Date().getTime()
  const host = window.location.host;
  if (host.indexOf('daily-xt-crmadmin') >= 0) {
    origin = 'https://daily-myouxuan.hzxituan.com/';
  } else if (host.indexOf('pre-xt-crmadmin') >= 0) {
    origin = 'https://pre-xt-myouxuan.hzxituan.com/pre/';
  } else if (host.indexOf('test-crmadmin') >= 0) {
    origin = 'https://testing.hzxituan.com/';
  } else if (host.indexOf('test2-crmadmin') >= 0) {
    origin = 'https://testing2.hzxituan.com/';
  } else if (host.indexOf('xt-crmadmin') >= 0) {
    /** 正式 */
    origin = 'https://myouxuan.hzxituan.com/';
  }
  return origin + `index.html?v=${nowTime}/`
}