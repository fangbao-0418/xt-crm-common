/*
 * @Date: 2020-03-16 14:01:18
 * @LastEditors: fangbao
 * @LastEditTime: 2020-03-17 19:47:41
 * @FilePath: /xt-new-mini/Users/fangbao/Documents/xituan/xt-crm/src/pages/ulive/config/interface.d.ts
 */
/** 直播标签 */
export interface TagItem {
  id: number
  /** 删除状态(0-不删除，1-删除, 2-删除中) */
  isDelete: 0 | 1
  /** 直播中的场次 */
  livingTatol: number
  sort: number
  /** 标签名称 */
  title: string
  /** 预告中的场次 */
  trailerTatol: number
}

/** 直播轮播 */
export interface CarouselItem {
  id: number
  /** 直播是否轮播 0 不是 1 是 */
  isCarousel: 0 | 1
  /** 直播状态 */
  liveStatus: any
  liveTitle: string
  /** 置顶状态 */
  liveTop: any
  carouselSort: number
}