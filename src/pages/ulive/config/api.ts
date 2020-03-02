const { post, get, newPost, newPut } = APP.http
/** 添加/修改直播标签 */
export const saveTag = (payload: {
  /** id存在即修改 */
  id?: number
  sort?: number
  title: string
}) => {
  return newPost('::ulive/live/tag/save', payload)
}
