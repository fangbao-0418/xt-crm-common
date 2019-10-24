export function getH5Origin () {
  let origin = 'https://daily-myouxuan.hzxituan.com/'
  const host = window.location.host;
  if (host.indexOf('daily-xt-crmadmin') >= 0) {
    origin = 'https://daily-myouxuan.hzxituan.com/';
  } else if (host.indexOf('pre-xt-crmadmin') >= 0) {
    origin = 'https://pre-xt-myouxuan.hzxituan.com/pre/index.html';
  } else if (host.indexOf('test-crmadmin') >= 0) {
    origin = 'https://testing.hzxituan.com/';
  } else if (host.indexOf('xt-crmadmin') >= 0) {
    /** 正式 */
    origin = 'https://myouxuan.hzxituan.com/';
  }
  return origin
}

export function setPayload (name, value) {
  if (name === null && value === undefined) {
    localStorage.setItem('payload', null)
    return
  }
  const payload = getPayload() || {}
  payload[name] = value
  localStorage.setItem('payload', JSON.stringify(payload))
}

export function getPayload (name) {
  const payload = JSON.parse(localStorage.getItem('payload'))
  return name ? payload && payload[name] : payload
}