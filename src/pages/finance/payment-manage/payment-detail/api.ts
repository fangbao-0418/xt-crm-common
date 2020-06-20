const { post, get, newPost, newPut, del } = APP.http
import { handleApiUrl } from '@/util/app/config'
// 贷款明细列表
export const getList = (payload: any) => {
  return newPost('/mcweb/account/supplier/settlement/detail/list/v1', payload)
}

/** 终止结算 */
export const terminated = (id: number) => {
  return newPost('/mcweb/account/supplier/settlement/detail/terminated/v1', { id })
}
/** 批量终止结算 */
export const batchTerminated = (ids: any) => {
  return newPost('/mcweb/account/supplier/settlement/detail/terminated/batch/v1', { ids })
}
