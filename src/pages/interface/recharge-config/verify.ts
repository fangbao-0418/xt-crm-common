/*
 * @Author: fangbao
 * @Date: 2020-05-16 22:28:11
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-19 14:35:52
 * @FilePath: /eslint-plugin-xt-react/Users/fangbao/Documents/xituan/xt-crm/src/pages/interface/recharge-config/verify.ts
 */

import { RecordProps } from './interface'

export function verifyConfigData (dataSource: RecordProps[]) {
  if (dataSource.length < 3) {
    APP.error('商品数量至少3个')
    return false
  }
  const temp: any = {}
  console.log(dataSource, 'dataSource')
  const sortIsDuplicate = dataSource.find((item) => {
    const sort = item.sort || 0
    if (temp[sort] === undefined) {
      temp[sort] = sort
    } else {
      return true
    }
  })
  if (sortIsDuplicate) {
    APP.error('存在相同的排序')
    return false
  }
  return true
}