declare module Shop {
  export interface ShopItemProps {
    id: nubmer
    productName: string
    /** 商品主图 */
    coverUrl: string
    /** 成本价 */
    costPrice: number
    /** 销售价 */
    salePrice: number
    /** 市场价 */
    marketPrice: number
    /** 供应商 */
    storeName: string
    /** 库存 */
    stock: number
    createTime: number
    modifyTime: number
    sort?: any
  }
}