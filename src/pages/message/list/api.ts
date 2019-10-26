const { get, post } = APP.http

export const getList = (payload: any) => {
  return get('http://mock-ued.hzxituan.com/mock/5da1a097b62ce300168bb5d7/crm/demo/list#!method=get', payload)
}