declare module Shop {
  /** sku props */
  export interface SkuProps {
    productId: any
    productName: string
    /** 商品主图 */
    coverUrl: string
    /** 规格 */
    properties: string
    skuId: number
    /** 规格1 */
    propertyValue1: string
    /** 规格2 */
    propertyValue2: string
    /** 库存 */
    stock: number
    /** 成本价 */
    costPrice: number
    /** 区长价 */
    areaMemberPrice: number
    /** 团长价 */
    headPrice: number
    /** 合伙人价 */
    cityMemberPrice: number
    /** 管理员价 */
    managerMemberPrice: number
    /** 市场价 */
    marketPrice: number
  }
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
    property1: string
    property2: string
    sort?: any
    skuList: SkuProps[]
  }
  /** 优惠券属性 */
  export interface CouponProps {
    /** 编号 */
    code: string
    description: string
    /** 面值 */
    faceValue: string
    id: number
    /** 总量 */
    inventory: number
    /** 领取数 */
    receiveCount: number
    /** 使用数 */
    useCount: number
    isDelete: number
    /** 名称 */
    name: string
    overReceiveTime: number
    remark: string
    startReceiveTime: number
    /** 领取状态 0 未开始 1 进行中 2 已结束 */
    status: 0 | 1 | 2
  }
}