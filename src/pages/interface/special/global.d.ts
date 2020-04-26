/*
 * @Date: 2020-03-16 14:01:18
 * @LastEditors: fangbao
 * @LastEditTime: 2020-04-26 21:11:35
 * @FilePath: /xt-wms/Users/fangbao/Documents/xituan/xt-crm/src/pages/interface/special/global.d.ts
 */
declare module Special {
  export interface DetailContentProps {
    /** 楼层类型 1商品 2优惠券 3广告 4图片热区 */
    type: 1 | 2 | 3 | 4
    sort: number
    /** 排列样式 1=1*1，2=1*2 */
    css?: 1 | 2
    /** 商品列表 */
    products: Shop.ShopItemProps[]
    /** 广告图 */
    advertisementUrl?: string
    coupons?: Coupon.CouponItemProps[]
    /** 广告链接 */
    advertisementJumpUrl?: string
    coupons: any[]
    content?: {
      url: string,
      area: { coordinate: string, type: 1 | 2 | 3, value: any }[]
    }
  }
  export interface DetailProps {
    /** 背景颜色 */
    backgroundColor: string
    /** 关联类目 */
    categorys?: CategorysItem[]
    /** 优惠券样式 */
    couponStyle?: 1 | 2
    /** 楼层ID */
    floorId: number
    /** 专题ID */
    id: number
    /** banner图片url */
    imgUrl: any
    /** 分享标题 */
    shareTitle: string
    /** 专题名称 */
    subjectName: string
    status: 0 | 1 | undefined
    list: DetailContentProps[]
    items: string
    /** 专题类型，0：一般专题，1：类目专题 */
    type: number
    /** banner图片跳转链接 */
    jumpUrl: string
    /** 分享图片 */
    shareImgUrl: any
    /** 分享开关，1-开启，0-关闭 */
    shareOpen: 1 | 0
    /** 一般类型 楼层ID */
    floorId: number
    /** 专题优惠券*/
    subjectCoupons: SubjectCoupons[]
    crmCoupons: any[]
  }
  interface SubjectCoupons {
    /** 优惠券编号 */
    code: string
    /** 优惠券ID */
    id?: number
    /** 优惠券名称 */
    name: string
    /** 排序 */
    sort?: number
  }
  interface CategorysItem {
    /** 类目关联楼层id */
    floorId: number
    id: number
    /** 类目名称 */
    name: string
    /** 排序 */
    sort: number
  }
  export interface SearchProps {
    subjectId?: number
    title?: string
    status?: 0 | 1 | undefined
    pageNo?: number
    pageSize?: number
    newSeat?: any
    childSeat?: any
    seat?: any
  }
}