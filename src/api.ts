/*
 * @Author: fangbao
 * @Date: 2020-05-19 23:18:16
 * @LastEditors: fangbao
 * @LastEditTime: 2020-06-02 16:03:18
 * @FilePath: /eslint-plugin-xt-react/Users/fangbao/Documents/xituan/xt-crm/src/api.ts
 */

const { get } = APP.http

/** 获取构建信息 */
export function getBuildInfo () {
  return fetch('./pub_info?v=' + new Date().getTime()).then((res) => {
    let data
    try {
      data = res.json().then((val) => val, (e) => {
        console.log(e, 'eeee')
      })
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
