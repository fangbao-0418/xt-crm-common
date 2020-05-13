const { newPost } = APP.http

export function getCategoryList () {
  return newPost('/category/treeCategory')
}

export function getRefundAutoList () {
  return Promise.resolve({
    current: 1,
    pages: 1,
    size: 10,
    total: 10,
    records: [...new Array(10)].map((item, i) => ({
      disposeId: i,
      disposeName: new Date + i,
      oneLevelId: 1,
      oneLevelName: 1,
      twoLevelId: 2,
      twoLevelName: 2,
      threeLevelId: 3,
      threeLevelName: 3
    }))
  })
  // return post('/order/refund/auto/dispose/queryList')
}

export function checkCategory (paload) {
  return newPost('http://192.168.14.49:8082/product/check/category', paload)
}