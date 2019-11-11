const { get, post, newPost, del } = APP.http

export const getList = (payload: any) => {
  return newPost('https://test01center-bi.hzxituan.com/msg/template/selectTemplateList', payload)
}

export const getDetail = (id: string) => {
  return newPost(`https://test01center-bi.hzxituan.com/msg/template/selectByTemplateId/${id}`)
}

export const deleteTemplte = (id: any) => {
  return del(`https://test01center-bi.hzxituan.com/msg/template/delete/${id}`)
}

/** 启用禁用模板 */
export const changeTemplteStatus = (payload: {
  /** 状态, 0-禁用, 1-启用 */
  status: 0 | 1
  /** 模板id */
  id: any
}) => {
  return newPost(`https://test01center-bi.hzxituan.com/msg/template/disable`, payload)
}

export const addTemplate = (payload: any) => {
  return newPost(`https://test01center-bi.hzxituan.com/msg/template/save`, payload)
}

/** 修改模板 */
export const updateTempate = (payload: any) => {
  return newPost(`https://test01center-bi.hzxituan.com/msg/template/update`, payload)
}