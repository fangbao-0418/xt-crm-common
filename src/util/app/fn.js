import moment from 'moment'

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

export function formatDate (date, format = 'YYYY-MM-DD HH:mm:ss') {
  if (/^\d+$/.test(date)) {
    date = Number(date)
  }
  return date && moment(date).format(format)
}

export function formatMoney (money = '0') {
  let str = String(money || '0')
  if (!/^\d+$/.test(parseFloat(str))) {
    str = '0'
  }
  let len = str.length
  str = len <= 2 ? '0'.repeat(3 - len) + str : str
  len = str.length
  str = [str.slice(0, len - 2).replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'), str.slice(len - 2)].join('.')
  return '¥' + str
}