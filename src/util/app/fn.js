import moment from 'moment'

export function getH5Origin () {
  let origin = 'https://daily-myouxuan.hzxituan.com/'
  // const nowTime = new Date().getTime()
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

export const handleLoading = (function () {
  let ajaxCount = 0
  return (loading = 'end') => {
    if (loading === 'start') {
      ajaxCount++
    } else {
      ajaxCount--
    }
    // console.log(ajaxCount, 'ajaxCount')
    const el = document.querySelector('#loading')
    const display = getComputedStyle(el).display
    if (ajaxCount > 0 && display === 'none') {
      el.setAttribute('style','display:block')
    } 
    if (ajaxCount <= 0 && display !== 'none') {
      el.setAttribute('style','display:none')
      ajaxCount = 0
    }
  }
})()

export function fieldConvert (obj, mapper) {
  const result = {}
  for (const field in obj) {
    if (mapper[field]) {
      result[mapper[field]] = obj[field]
    } else {
      result[field] = obj[field]
    }
  }
  return result
}

export function formatDate (date, format = 'YYYY-MM-DD HH:mm:ss') {
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

export function download (url, name) {
  const el = document.createElement('a')
  el.setAttribute('download', name)
  el.setAttribute('href', url)
  el.click()
}