const { post, newPost, newPut, newDel } = APP.http

interface ListPayload {

}

/** 获取积分商品列表 */
export const fetchList = (payload: ListPayload) => {
  return post('/product/list', {
    ...payload,
    enableExchange: 1,
    isFilter: 0
  })
}

/** 添加商品积分比例 */
export const addExchange = (ids: any[]) => {
  return newPost('/mcweb/product/exchange/batch/add', {
    productIds: ids,
  })
}

/** 修改商品积分比例 */
export const updateExchange = (payload: {
  id: any
  exchangeRate: number
}) => {
  return newPut('/mcweb/product/exchange/update', {
    productId: payload.id,
    exchangeRate: payload.exchangeRate
  })
}

/** 删除积分商品 */
export const toDelete = (ids: any[]) => {
  return newDel('/mcweb/product/exchange/batch/delete', {
    productIds: ids
  })
}