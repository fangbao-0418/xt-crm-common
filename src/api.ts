/*
 * @Author: fangbao
 * @Date: 2020-05-19 23:18:16
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-19 23:22:19
 * @FilePath: /xt-crm/src/api.ts
 */

const { get } = APP.http

/** 获取构建信息 */
export function getBuildInfo () {
  return fetch('./pub_info?v=' + new Date().getTime()).then((res) => {
    let data
    try {
      data = res.json()
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
