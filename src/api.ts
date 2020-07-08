const { get } = APP.http

/** 获取构建信息 */
export function getBuildInfo () {
  const url = process.env.IS_LOCAL ? `${process.env.APP_ORIGIN}/pub_info` : ['/' + process.env.APP_NAME, process.env.APP_BRANCH, 'pub_info'].join('/')
  return fetch(url + '?v=' + new Date().getTime()).then((res) => {
    let data
    try {
      data = res.json().then((val) => val)
    } catch (e) {
      APP.moon.error(e)
    }
    return data
  })
}

export const getExpressList = () => {
  return get('/express/getList')
}

export const getOrderTypeList = () => {
  return get('/order/getOrderTypeList')
}
