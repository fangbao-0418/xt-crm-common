export interface GoodsProps {
  id: any
  coverUrl: string
  productName: string
  /** 状态 0:下架，1：上架，2：商品池，3：待上架 */
  status: 0 | 1 | 2 | 3
  storeName: string
  /** 积分比例 */
  exchangeRate: number
}