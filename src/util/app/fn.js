import moment from 'moment';

export function getH5Origin() {
  let origin = 'https://daily-myouxuan.hzxituan.com/';
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
  return origin;
}

export function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
  date = date || 0
  if (/^\d+$/.test(date)) {
    date = Number(date)
    date = String(date).length === 10 ? date * 1000 : date
  }
  return date && moment(date).format(format);
}

export function formatMoney(money = '0') {
  let str = String(money || '0');
  if (!/^\d+$/.test(parseFloat(str))) {
    str = '0';
  }
  let len = str.length;
  str = len <= 2 ? '0'.repeat(3 - len) + str : str;
  len = str.length;
  str = [str.slice(0, len - 2).replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'), str.slice(len - 2)].join('.');
  return '¥' + str;
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


export const handleLoading = (function() {
  let ajaxCount = 0;
  return (loading = 'end') => {
    const el = document.querySelector('#loading');
    if (loading === 'start') {
      ajaxCount++;
      console.log(ajaxCount, 'start');
      const display = getComputedStyle(el).display;
      if (ajaxCount > 0 && display === 'none') {
        el.setAttribute('style', 'display:block');
      }
    } else {
      setTimeout(() => {
        ajaxCount--;
        console.log(ajaxCount, 'end');
        if (ajaxCount <= 0) {
          const display = getComputedStyle(el).display;
          if (display !== 'none') {
            el.setAttribute('style', 'display:none');
          }
          ajaxCount = 0;
        }
      }, 16 * 3);
    }
  };
})();

export function fieldConvert(obj, mapper) {
  const result = {};
  for (const field in obj) {
    if (mapper[field]) {
      result[mapper[field]] = obj[field];
    } else {
      result[field] = obj[field];
    }
  }
  return result;
}

export function download(url, name) {
  const el = document.createElement('a');
  el.setAttribute('href', url);
  el.setAttribute('download', name);
  el.setAttribute('target', '__blank');
  el.click();
}

/**
 * 多个集合合并
 * examp1 params ([1, 2], [3, 4]) => [[1, 3], [2, 3], [2, 3], [2, 4]]
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
