/*
 * @Date: 2019-11-12 11:03:51
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-15 15:40:27
 * @FilePath: /eslint-plugin-xt-react/Users/fangbao/Documents/xituan/xt-crm/src/types/Shop.d.ts
 */
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
    propertyValue: string
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
    /** 状态 0:下架，1：上架，2：商品池，3：待上架 -1 删除 */
    status: -1 | 0 | 1 | 2 | 3
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
    /** 状态 0:下架，1：上架，2：商品池，3：待上架 */
    status: 0 | 1 | 2 | 3
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
    /** 日限领数 */
    dailyRestrict: number
    /** 总限领数 */
    restrictNum: number
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
    /** 使用时间类型(0: 指定时间段, 1: 领券当日起几天内可用) */
    useTimeType: 0 | 1
    /** 使用时间值(例:useTimeType-0:1567267200000,1567612800000 或 useTimeType-1:5) */
    useTimeValue: string
  }
}