import { adapterPostParams, adapterPostDetail } from './adapter'
const { newPost } = APP.http

interface postPayload {
  id?: number
  columnName?: string	
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
  return newPost('/mcweb/octupus/discover/column/list', { ...payload, platform: 2 }).then(res => {    
    res.records = (res.records || []).map((item: any) => adapterPostDetail(item))
    console.log('res', res)
    return res
  })
}

/** 添加栏目 */
export async function addColumn (payload: postPayload) {
  return newPost('/mcweb/octupus/discover/column/save', { ...adapterPostParams(payload), platform: 2 })
}
/** 修改栏目 */
export async function updateColumn(payload: postPayload) {
  return newPost('/mcweb/octupus/discover/column/update', adapterPostParams(payload))
}

/** 删除栏目 */
export async function deleteColumn (id: number) {
  return newPost('/mcweb/octupus/discover/column/delete', { id })
}

/**
 * id: 栏目id
 * showStatus: 显示状态 1 显示 2 隐藏
 * @param payload
 */
export function showColumn (payload: { id: number, showStatus: 1 | 2 }) {
  return newPost('/mcweb/octupus/discover/column/show', payload)
}