export function recommend(res: any) {
  res.relationGoods = res.productRecommendSpuVOList
  res.relationShop = res.productRecommendShopVOList
  return res
}