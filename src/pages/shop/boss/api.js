const { get, newPost, newPut } = APP.http

// 获取店长列表数据
export function getBossList(params) {
  // const bossData = {
  //   total: 37,
  //   size: 10,
  //   current: 1,
  //   searchCount: true,
  //   pages: 4,
  //   records: [{
  //     id: 1,
  //     name: '昵称',
  //     phone: 15858275481,
  //     volume: 1,
  //     refund: 2,
  //     level: '14',
  //     saleCount: 10,
  //     violation: 7
  //   }]
  // }

  // return bossData
  return newPost('/shop/v1/managers/page', params);
}

// 查询用户
export function checkUser() {
  const res = true
  return res
}

// 开通小店
export function openShop() {
  const res = true
  return res
}

// 关闭小店
export function closeShop() {
  const res = true
  return res
}


