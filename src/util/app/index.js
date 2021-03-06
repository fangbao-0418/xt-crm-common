import { message } from 'antd'
import '@/util/moon'
import Moon from '@xt/rlcas-moon/dist/h5-moon';
import * as regular from './regular'
const constant = require('./constant').default
const http = require('./http')
const fn = require('./fn')

function getUser () {
  const userStr = localStorage.getItem('user')
  let user = {}
  try {
    user = JSON.parse(userStr) || {}
  } catch (e) {
    console.log(e)
  }
  user.menuGathers = user.menuGathers || []
  return user
}

Object.assign(APP, {
  history: {},
  moon: {
    logApi: function (obj) {
      try {
        obj = obj || {}
        if (!obj?.config) {
          if (typeof obj !== 'object') {
            obj = {}
          }
          obj.config = {}
        }
        return this.logger({
          url: obj.config.url,
          header: obj.config.headers,
          data: obj.config.data,
          params: obj.config.params,
          res: obj.data
        })
      } catch (e) {
        //
      }
    },
    logger: function (data, label) {
      if (Moon) {
        try {
          Moon.logger({
            t: 'all',
            data: {
              label,
              ...data
            }
          })
        } catch (e) {
          //
        }
      }
    },
    oper: function () {
      if (Moon) {
        try {
          Moon.oper.apply(null, arguments)
        } catch (e) {
          const response = arguments[0]
          let message = ' response is '
          try {
            message += JSON.stringify(response)
          } catch (e2) {
            message += response
          }
          if (e && e instanceof Error) {
            e.name = 'Oper Error'
            e.message += ',' + (message || e.message)
          }
          APP.moon.error(e)
        }
      }
    },
    error: function (err) {
      /** 注意参数是否是Error类型 */
      // console.log(err, 'app moon error')
      if (Moon) {
        if (err instanceof Error) {
          Moon.error(err)
          return
        }
        try {
          const tempError = new Error('')
          let message = err
          if (err instanceof Object) {
            message = JSON.stringify(err)
          }
          tempError.name = 'Self Error'
          tempError.message = message
          console.log(tempError, 'tempError')
          Moon.error(err)
        } catch (e) {
          if (e && e instanceof Error) {
            e.name = 'error catch'
            Moon.error(e)
          }
        }
      }
    }
  },
  user: getUser(),
  success: function (text, duration = 1) {
    message.success(text, duration)
  },
  error: function (text, duration = 1) {
    message.error(text, duration)
  },
  http,
  fn,
  constant,
  open: function (url) {
    url = String(url || '').trim()
    const unix = new Date().getTime()
    function fillUnix (p) {
      return !(/\?/).test(p) ? p + `?t=${unix}` : p + `&t=${unix}`
    }
    if (!(/^(https)/).test(url)) {
      // 1 /abc#/efg
      // 2 /abc/efg
      // 3 /abc/efg?abc=123
      // 4 /abc?a=123#/abc
      // 5 /#/abc
      const paths = url.split('#')
      if (paths.length === 1) { // 不存在hash
        const pathname = location.pathname
        const search = location.search || `?t=${unix}`
        url = `${pathname}${search}#` + url
      } else { // 存在hash hash前部分为路径添加时间戳
        url = fillUnix(paths[0]) + '#' + paths.slice(1).join('#')
      }
    }
    window.open(url)
  },
  href: function (url, target) {
    url = String(url || '').trim()
    url = (/^(https?|#)/).test(url) ? url : '#' + url
    if (target === '__blank') {
      APP.open(url)
      return
    }
    let el = document.createElement('a')
    el.setAttribute('href', url)
    if (target) {
      el.setAttribute('target', target)
    }
    el.click()
    el = null
  },
  regular
})

Object.defineProperty(APP, 'token', {
  get () {
    return JSON.parse(localStorage.getItem('token') || '')
  },
  set (val) {
    localStorage.setItem('token', val)
  }
})

Object.defineProperty(APP, 'user', {
  get () {
    return getUser()
  },
  set (val) {
    localStorage.setItem('user', JSON.stringify(val))
  }
})
