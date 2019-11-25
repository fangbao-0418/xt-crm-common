import * as adapter from './adapter'
import { queryString } from '@/util/utils'
const { get, post, newPost } = APP.http
/** 查询版本列表 */
export function getList (payload: {
  startLastPublishTime: number,
  endLastPublishTime: number,
  status: number
}) {
  return get('/personal/config/get_list')
}

/** 新建版本 */
export function addConfig () {
  return post('/personal/config/add')
}

/** 新增icon */
export function addIcon (payload: My.iconApiPayload) {
  return newPost('/personal/config/icon/add', adapter.handleIconRequestParams(payload))
}

/** 编辑icon */
export function editIcon (payload: My.iconApiPayload) {
  return newPost('/personal/config/icon/update_by_id', adapter.handleIconRequestParams(payload))
}

/** 删除icon */
export function deleteIcon (payload: {id?: number}) {
  return newPost('/personal/config/icon/delete_by_id', payload)
}

/** 新建版本 */
export function addVersion () {
  return post('/personal/config/add')
}

/** 发布版本 */
export function publish (payload: {
  environmentType: string,
  id: number
}) {
  return newPost('/personal/config/publish', payload)
}

/** 复制版本 */
export function copy (payload: {id: number}) {
  return newPost('/personal/config/copy', payload)
}

/** 根据id软删除版本记录，仅支持草稿状态记录 */
export function deleteVersion (payload: {id: number}) {
  return newPost('/personal/config/delete_by_id', payload)
}

/** 根据版本号id获取版本详情 */
export async function getDetail (id: number) {
  const result = await get('/personal/config/get_by_id?id=' + id)
  return adapter.handleQueryVersionDetailResponse(result)
}

/** 获取icon列表 */
export async function getIconList (payload: {
  id: number,
  platformCode: string,
  memberType: string
}) {
  const result = await get(`/personal/config/icon/get_list${queryString(payload)}`)
  return adapter.handleQueryVersionDetailResponse(result)
}