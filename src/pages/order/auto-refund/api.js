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
  // return newPost('/order/refund/auto/dispose/queryList')
}

export function checkCategory (paload) {
  return Promise.resolve({
    errorProductIds: [11, 22],
    message: '这是错误语句'
  })
  // return newPost('/product/check/category', paload)
}