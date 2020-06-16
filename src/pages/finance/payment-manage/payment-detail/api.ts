const { post, get, newPost, newPut, del } = APP.http
import { handleApiUrl } from '@/util/app/config'
// 贷款明细列表
export const getList = (payload: any) => {
  return post('/store/settlement/detail/list/v1', payload)
}

/** 终止结算 */
export const terminated = (id: number) => {
  return post(`/store/settlement/detail/terminated/v1?id=${id}`)
}
