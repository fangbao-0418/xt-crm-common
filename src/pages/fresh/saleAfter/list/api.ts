const { post, get, newPost, newPut } = APP.http
export const fetcOrderList = (payload?: any) => {
  // 幽灵bug，偶先丢失pageSize
  payload.pageSize = payload.pageSize || 10
  return newPost('/order/list', payload)
}
export const getCateGory = () => {
  return post('/category/treeCategory')
}

export const fetchList = (payload: any) => {
  return get('/product/shop/list', payload)
  // return http('http://mock-ued.hzxituan.com/mock/5da1a097b62ce300168bb5d7/crm/productPool/list#!method=post', 'POST', payload)
}

/** 自提点模糊搜索 */
export const searchPoints = (keyWords: string) => {
  return get(`/order/points?keyWords=${keyWords}`).then((res) => {
    return res.map((v: { name: string, id: string }) => ({ text: v.name, value: v.id }))
  })
}