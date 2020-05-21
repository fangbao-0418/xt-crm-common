/*
 * @Date: 2020-05-15 14:40:12
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-15 14:44:07
 * @FilePath: /eslint-plugin-xt-react/Users/fangbao/Documents/xituan/xt-crm/src/pages/fresh/goods/sku-sale/interface.d.ts
 */

export interface GoodsSpuItem {
  /** 是否置顶 1-置顶；0未置顶 */
  top: 0 | 1
  /** 供应商名称 */
  storeName: string
  /** 供应商ID */
  storeId: any
  /** 实时库存 */
  stock: number
  /** 上下架状态(1-下架，0-上架) */
  status: 1 | 0
  /** 销售价(单位分) */
  salePrice: number
  /** 累计销量 */
  saleCount: number
  /** 可售区域名称 */
  saleAreaName: string
  productName: string
  id: any
  /** 一级类目名称 */
  firstCategoryName: string
  /** 主图 */
  coverUrl: string
  /** 成本价(单位分) */
  costPrice: number
  /** 审核状态(0-待提交,1-待审核,2-审核通过,3-审核不通过) */
  auditStatus: 0 | 1 | 2 | 3
}