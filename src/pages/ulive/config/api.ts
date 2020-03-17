/*
 * @Date: 2020-03-16 14:01:18
 * @LastEditors: fangbao
 * @LastEditTime: 2020-03-17 19:50:34
 * @FilePath: /xt-new-mini/Users/fangbao/Documents/xituan/xt-crm/src/pages/ulive/config/api.ts
 */

const { post, get, newPost, newPut } = APP.http

export const fetchCarouselList = (payload: any) => {
  return get('::ulive/live/carousel/list', payload)
}

/** 添加/修改直播轮播 */
export const saveCarousel = (payload: {
  /** id存在即修改 */
  id?: number
  carouselSort?: number
}) => {
  return newPost('::ulive/live/carousel/add', payload)
}

/** 添加/修改直播标签 */
export const saveTag = (payload: {
  /** id存在即修改 */
  id?: number
  sort?: number
  title: string
}) => {
  return newPost('::ulive/live/tag/save', payload)
}

/** 获取tag列表 */
export const fetchTagList = (payload?: any) => {
  return get('::ulive/live/tag/list', payload)
}

/** 删除tag */
export const deleteTag = (id: number) => {
  return newPost('::ulive/live/tag/delete', {
    id
  })
}