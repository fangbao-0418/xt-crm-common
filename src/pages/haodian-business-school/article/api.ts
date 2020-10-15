import { newPost } from "@/util/fetch";


/** 查询文章列表 */
export function getArticleList (payload: {
  title?: string,
  columnId?: number,
  id?: number,
  status?: number,
  page: number,
  pageSize: number
}) {
  // 平台渠道: 1优选/2好店
  return newPost('/mcweb/octupus/discover/article/list', { ...payload, platform: 2 })
}

interface Payload {
  id?: number
  title: string
  coverImage: string
  columnId: number
  columnName: string
  releaseStatus: 10 | 20 | 30 | 40
  topStatus: 1 | 2
  context: string
  contextType: 1 | 2
  releaseTime: number
  memberLimit: 1 | 2 | 3 | 4
  virtualRead: number
  productIds: number[]
  resourceUrl: string
  fileSize: number
  resourceType: number
  createUid: number
}

/**
 * 发布文章
 * @param payload
 */
export function saveDiscoverArticle (payload: Payload) {
  return newPost('/mcweb/octupus/discover/article/save', payload)
}

/**
 * 更新文章内容
 */
export function modifyDiscoverArticle (payload: Payload) {
  return newPost('/mcweb/octupus/discover/article/modify', payload)
}

/**
 * 查询所有栏目
 * 平台渠道: 1优选/2好店
 */
export function getAllColumn () {
  return newPost('/mcweb/octupus/discover/column/all?platform=2').then((res: any) => {
    return res.map((item: any) => ({ label: item.columnName, value: item.id }))
  })
}

/**
 * 获取商品列表
 */
export function getProductList () {
  return newPost('/mcweb/product/list')
}

