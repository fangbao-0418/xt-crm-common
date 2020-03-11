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

/** 获取tag列表 */
export const fetchTagList = (payload: any) => {
  return get('::ulive/live/tag/list', payload)
}

/** 删除tag */
export const deleteTag = (id: number) => {
  return newPost('::ulive/live/tag/delete', {
    id
  })
}