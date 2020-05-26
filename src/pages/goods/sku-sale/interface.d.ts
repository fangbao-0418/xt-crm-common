/*
 * @Date: 2020-05-15 17:56:23
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-15 18:01:36
 * @FilePath: /eslint-plugin-xt-react/Users/fangbao/Documents/xituan/xt-crm/src/pages/goods/sku-sale/interface.d.ts
 */

export interface GoodProps {
  id: any
  /** 商品类型 50-话费充值 51-流量充值 */
  type: 50 | 51
  /** 商品名称 */
  productName: string
}