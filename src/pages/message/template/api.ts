const { get, post, del } = APP.http

export const getList = (payload: any) => {
  return get('http://mock-ued.hzxituan.com/mock/5da1a097b62ce300168bb5d7/crm/demo/list#!method=get', payload)
}

export const deleteTemplte = (id: any) => {
  return del(`http://mock-ued.hzxituan.com/mock/5d9f1b54b62ce300168bb5a8/example/msg/template/delete/${id}`)
}