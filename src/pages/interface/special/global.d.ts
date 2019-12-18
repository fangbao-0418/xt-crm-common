declare module Special {
  export interface DetailContentProps {
    /** 楼层类型 1商品 2优惠券3 广告 */
    type: 1 | 2 | 3
    sort: number
    /** 排列样式 1=1*1，2=1*2 */
    css?: 1 | 2
    /** 商品列表 */
    list: Shop.ShopItemProps[]
    /** 广告图 */
    advertisementUrl?: string
    coupons?: Coupon.CouponItemProps[]
    /** 广告链接 */
    advertisementJumpUrl?: string
  }
  export interface DetailItem {
    backgroundColor: string
    imgUrl: string | {uid: string, url: string}[]
    shareTitle: string
    subjectName: string
    status: 0 | 1 | undefined
    id: number
    list: DetailContentProps[]
    items: string
    jumpUrl: string
    shareImgUrl: string | {uid: string, url: string}[]
    shareOpen: number,
    /** 一般类型 楼层ID */
    floorId: number
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