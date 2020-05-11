/*
 * @Date: 2020-04-29 10:32:59
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-11 14:18:12
 * @FilePath: /xt-crm/src/pages/interface/recharge-config/interface.d.ts
 */
export interface RecordProps {
  productId: any
  /** 商品名称 */
  productName: string
  /** 商品主图 */
  coverImage: string
  skuId: any
  property: string
  /** 成本价 */
  costPrice: number
  /** 销售价 */
  salePrice: number
  sort: number
}