const { get, post, newPost, del } = APP.http

export const getList = (payload: any) => {
  return newPost('::message/msg/template/selectTemplateList', payload)
}

export const getDetail = (id: string) => {
  return newPost(`::message/msg/template/selectByTemplateId/${id}`)
}

export const deleteTemplte = (id: any) => {
  return del(`::message/msg/template/delete/${id}`)
}

/** 启用禁用模板 */
export const changeTemplteStatus = (payload: {
  /** 状态, 0-禁用, 1-启用 */
  status: 0 | 1
  /** 模板id */
  id: any
}) => {
  return newPost(`::message/msg/template/disable`, payload)
}

export const addTemplate = (payload: any) => {
  return newPost(`::message/msg/template/save`, payload)
}

/** 修改模板 */
export const updateTempate = (payload: any) => {
  return newPost(`::message/msg/template/update`, payload)
}