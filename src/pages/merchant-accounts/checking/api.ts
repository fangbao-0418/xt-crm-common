const { get, newPost } = APP.http

/** 获取对账单列表 */
export const fetchCheckingList = (payload: any) => {
  return Promise.resolve({
    records: []
  })
}