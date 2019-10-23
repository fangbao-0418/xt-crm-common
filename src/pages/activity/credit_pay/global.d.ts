namespace CreditPay {
  interface PayloadProps {
    page?: number
    pageSize?: number
    /** 商品ID */
    productId?: number
    /** 上下架状态0-上架，1-下架 */
    status?: 0 | 1
    /** 供货商名称 */
    storeName?: string
    productName?: string
    /** 最大分期期数-1：否，3：3期，6：3期、6期，12：3期、6期、12期 */
    maxFqNum?: 1 | 3 | 6 | 12
    /** 最大免息期数-1：否，3：3期，6：3期、6期，12：3期、6期、12期 */
    maxFqSellerPercent?: 1 | 3 | 6 | 12
    /** 是否允许花呗 1: 花呗， 0: 不支持花呗，undefined代表全部 */
    enableHb?: 0 | 1
    /** false: 禁用status，true：启用status条件 */
    enableStatus?: 0 | 1
  }
  interface SkuProps {
    /** 商品编码 */
    skuCode: string
    skuId: number
    /** 发货方式 1-仓库发货, 2-供货商发货, 3-其他 */
    deliveryMode: 1 | 2 | 3
    /** 成本价 */
    costPrice: number
    /** 市场价 */
    marketPrice: number
    /** 销售价 */
    salePrice: number
    /** 团长价 */
    headPrice: number
    /** 社区管理员价 */
    areaMemberPrice: number
    /** 城市合伙人价 */
    cityMemberPrice: number
    /** 公司管理员价 */
    managerMemberPrice: number
    /** 库存 */
    stock: number
    /** 警戒库存 */
    stockAlert?: number
    propertyValue1?: any
    propertyValue2?: any
    /** 最大分期数 -1：否，3：3期，6：3期、6期，12：3期、6期、12期 */
    maxHbFqNum: -1 | 3 | 6 | 12
    /** 最大免息分期数 -1：否，3：3期，6：3期、6期，12：3期、6期、12期 */
    maxFqSellerPercent: -1 | 3 | 6 | 12
  }
  /** 花呗分期 */
  interface ItemProps {
    /** 商品id */
    id: number
    /** 商品id 同id */
    productId: number
    productName: string
    /** 商品主图 */
    coverUrl: string
    /** 供应商 */
    storeName: string
    /** 上下架状态0-上架，1-下架 */
    status: 0 | 1
    /** 销售价 */
    salePrice: number
    /** 最大分期期数-1：否，3：3期，6：3期、6期，12：3期、6期、12期 */
    maxFqNum: -1 | 3 | 6 | 12
    /** 最大免息期数-1：否，3：3期，6：3期、6期，12：3期、6期、12期 */
    maxFqSellerPercent: -1 | 3 | 6 | 12
    /** 是否允许花呗 1: 花呗， 0: 不支持花呗，undefined代表全部 */
    enableHb: 0 | 1
    skuList?: SkuProps[]
    property1: string
    property2: string
  }
}