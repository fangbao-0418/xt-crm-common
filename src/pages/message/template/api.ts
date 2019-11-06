const { get, post, newPost, del } = APP.http

export const getList = (payload: any) => {
  return newPost('http://192.168.20.16:39003/msg/template/selectTemplateList', payload)
}

export const getDetail = (id: string) => {
  return newPost(`http://192.168.20.16:39003/msg/template/selectByTemplateId/${id}`)
}

export const deleteTemplte = (id: any) => {
  return del(`http://192.168.20.16:39003/msg/template/delete/${id}`)
}

/** 启用禁用模板 */
export const changeTemplteStatus = (payload: {
  /** 状态, 0-禁用, 1-启用 */
  status: 0 | 1
  /** 模板id */
  id: any
}) => {
  return newPost(`http://192.168.20.16:39003/msg/template/disable`, payload)
}

export const addTemplate = (payload: any) => {
  return newPost(`http://192.168.20.16:39003/msg/template/save`, payload)
}

/** 修改模板 */
export const updateTempate = (payload: any) => {
  return newPost(`http://192.168.20.16:39003/msg/template/update`, payload)
}