const { get, post, newPost, del } = APP.http
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
  return post('/personal/config/icon/add', payload)
}

/** 编辑icon */
export function editIcon (payload: My.iconApiPayload) {
  return post('/personal/config/icon/update_by_id', payload)
}

/** 发布版本 */
export function publish () {
  return post('/personal/config/publish')
}

/** 复制版本 */
export function copy (payload: {id: number}) {
  return post('/personal/config/copy', payload)
}

/** 根据id软删除版本记录，仅支持草稿状态记录 */
export function deleteVersion (payload: {id: number}) {
  return post('/personal/config/delete_by_id', payload)
}

/** 根据版本号id获取版本详情 */
export function getDetail () {
  return get('/personal/config/get_by_id')
}