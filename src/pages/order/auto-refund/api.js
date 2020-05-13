const { post } = APP.http

export function getCategoryList () {
  return post('/category/treeCategory')
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