const { get, post } = APP.http

export const getList = (payload: any) => {
  // /msg/group/queryList
  // http://mock-ued.hzxituan.com/mock/5da1a097b62ce300168bb5d7/crm/demo/list#!method=get
  return post('http://192.168.4.200:1002/msg/group/queryList', payload)
}

export const fetchDetail = (id: any) => {
  return post(`http://mock-ued.hzxituan.com/mock/5da1a097b62ce300168bb5d7/crm/msg/group/selectById/${id}`)
}

export const saveMessage = (payload: Message.ItemProps) => {
  return post(`/msg/group/save`, payload)
}
