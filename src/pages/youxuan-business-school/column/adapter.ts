export function adapterPostParams (req: any) {
  // 是否加入喜团情报站 1 否 2 是
  req.addStation = req.addStation ? 2 : 1
  return req
}

export function adapterPostDetail (res: any) {
  res.addStation = res.addStation === 2
  return res
}