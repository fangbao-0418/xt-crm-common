/*
 * @Date: 2020-04-29 10:32:59
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-15 15:26:25
 * @FilePath: /eslint-plugin-xt-react/Users/fangbao/Documents/xituan/xt-crm/src/pages/interface/recharge-config/interface.d.ts
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
  /** 优惠券码列表 */
  couponCodes: any;
  sort: number
  /** 状态-1:删除，0:下架，1：上架，2：商品池，3：待上架 */
  status: -1 | 0 | 1 | 2 | 3
}