/*
 * @Date: 2020-03-16 14:01:18
 * @LastEditors: fangbao
 * @LastEditTime: 2020-04-16 20:17:50
 * @FilePath: /xt-wms/Users/fangbao/Documents/xituan/xt-crm/src/components/money-render/index.js
 */
export default function (money) {
  money = money || ''
  if (money === '') {
    return '￥0.00'
  }
  return `￥${(money / 100).toFixed(2)}`
}
