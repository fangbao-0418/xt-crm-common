import moment from 'moment'
import Decimal from 'decimal.js'
export function getH5Origin () {
  let origin = 'https://daily-myouxuan.hzxituan.com/';
  // const nowTime = new Date().getTime()
  const host = window.location.host
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
  date = date || 0
  if (/^\d+$/.test(date)) {
    date = Number(date)
    date = String(date).length === 10 ? date * 1000 : date
  }
  return (date && moment(date).format(format)) || '';
}

export function formatMoney (money = '0') {
  let str = String(money || '0');
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
    localStorage.setItem('payload', '""')
    return
  }
  const payload = getPayload() || {}
  payload[name] = value
  try {
    localStorage.setItem('payload', JSON.stringify(payload))
  } catch (e) {
    localStorage.setItem('payload', JSON.stringify({
      [name]: value
    }))
  }
}

export function getPayload (name) {
  const jsonString = localStorage.getItem('payload') || '""'
  let payload = undefined
  try {
    payload = JSON.parse(jsonString)
  } catch (e) {
    //
  }
  return name ? payload && payload[name] : payload
}

export const handleLoading = (function () {
  let ajaxCount = 0
  return (loading = 'end') => {
    const el = document.querySelector('#loading')
    if (loading === 'start') {
      ajaxCount++
      // console.log(ajaxCount, 'start');
      const display = getComputedStyle(el).display
      if (ajaxCount > 0 && display === 'none') {
        el.setAttribute('style', 'display:block')
      }
    } else {
      setTimeout(() => {
        ajaxCount--
        // console.log(ajaxCount, 'end');
        if (ajaxCount <= 0) {
          const display = getComputedStyle(el).display
          if (display !== 'none') {
            el.setAttribute('style', 'display:none')
          }
          ajaxCount = 0
        }
      }, 16 * 3)
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

export function download (url, filename) {
  getBlob(url).then(blob => {
    saveAs(blob, filename)
  })
}

/**
 * 获取 blob
 * @param  {String} url 目标文件地址
 * @return {Promise}
 */
function getBlob (url) {
  return new Promise(resolve => {
    const xhr = new XMLHttpRequest()

    xhr.open('GET', url, true)
    xhr.responseType = 'blob'
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.response)
      }
    }
    xhr.send()
  })
}

/**
 * 保存
 * @param  {Blob} blob
 * @param  {String} filename 想要保存的文件名称
 */
function saveAs (blob, filename) {
  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob, filename)
  } else {
    const link = document.createElement('a')
    const body = document.querySelector('body')

    link.href = window.URL.createObjectURL(blob)
    link.download = filename

    // fix Firefox
    link.style.display = 'none'
    body.appendChild(link)
    link.click()
    body.removeChild(link)
    window.URL.revokeObjectURL(link.href)
  }
}

/**
 * 多个集合合并
 * examp1 params ([1, 2], [3, 4]) => [[1, 3], [1, 4], [2, 3], [2, 4]]
 * examp2 params ([1, 2], []) => [[1, undefined], [2, undefined]]
 * examp3 params ([], []) => [[undefined, undefined]]
 * examp4 params ([]) => [[]]
 * examp5 params ([1]) => [[1]]
 * examp6 params ([1, 2]) => [[1], [2]]
 * */
export const mutilCollectionCombine = (...collection) => {
  if (collection instanceof Array === false) {
    return collection
  }
  const len = collection.length
  if (len === 0) {
    return []
  }
  if (len === 1) {
    return collection[0].map((item) => {
      return [item]
    })
  }
  const result = []
  let children = []
  function loop (arr, index) {
    if (arr.length === 0) {
      arr = [undefined]
    }
    arr.map((item) => {
      if (index === 0) {
        children = []
      }
      children = children.concat([item])
      const nextIndex = index + 1
      if (nextIndex >= len) {
        result.push(children)
      } else if (nextIndex < len) {
        const nextCollection = collection[nextIndex]
        loop(nextCollection, nextIndex)
      }
      children = children.slice(0, -1)
    })
  }
  loop([...collection[0]], 0)
  return result
}

/**
 * 后端金额转换
 * @param {number} money - 金额
 * @param {('u2m' | 'm2u')} type - u2m 元转分；m2u 分转元；default u2m
 */
export function formatMoneyNumber (money, type = 'u2m') {
  money = money || 0
  if (type === 'u2m') {
    return new Decimal(money).mul(100).round().toNumber()
  } else if (type === 'm2u') {
    return new Decimal(money).round().div(100).toNumber()
  } else {
    return money
  }
}

/**
 * 4舍5入保留小数位置
 * @param {number} num - 原数值
 * @param {number} precision - 精度 默认0
 */
export function round (num, precision = 0) {
  const base = Math.pow(10, precision)
  return Math.round(num * base) / base
}