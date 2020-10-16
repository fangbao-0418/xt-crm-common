import { adpaterFormParams } from './adapter'
const { get, newPost } = APP.http

interface postPayload {
  id?: number
  columnName: string	
  describe?: string	
  platform: 1 | 2
  sort?: number
  showStatus?: 1 | 2
}
/**
 * 查询栏目信息
 * 平台渠道: 1优选/2好店
 */
export function getColumnList (payload: { page: number, pageSize: number }) {
  return newPost('/mcweb/octupus/discover/column/list', { ...payload, platform: 1 })
}

/** 添加栏目 */
export async function addColumn (payload: postPayload) {
  return newPost('/mcweb/octupus/discover/column/save', { ...adpaterFormParams(payload), platform: 1 })
}
/** 修改栏目 */
export async function updateColumn(payload: postPayload) {
  return newPost('/mcweb/octupus/discover/column/update', adpaterFormParams(payload))
}

/** 删除栏目 */
export async function deleteColumn (id: number) {
  return newPost('/mcweb/octupus/discover/column/update', { id, isDelete: 1 })
}