const { post, get } = APP.http

export function supplierVerify (payload: any) {
  const data = {
    goodsId: ['1', '2'].join(','),
    phones: ['3', '4'].join(','),
    supplierId: 1
  }
  return Promise.resolve(data)
  // return post('')
}

export function phonesVerify (payload: any) {
  return Promise.resolve(true)
  // return post('')
}