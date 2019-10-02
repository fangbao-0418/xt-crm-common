/** 处理满赠详情接口返参 */
export const handleDetailReturnData = (payload: {
  userScope: string
  ruleJson: {
    loop: {
      promotionDiscountsSkuVOList: Shop.SkuProps[]
      couponListVOList: Shop.CouponProps[]
      giftSkuJson: string
    },
    rank: any
    type: 0 | 1
  }
}) => {
  // console.log(payload, 'payload')
  const data = {
    ...payload,
    strategyType: payload.ruleJson.type,
    loop: parsePresentContentData(payload.ruleJson.loop),
    rank: Object.assign({}, 
      {
        ladderRule: payload.ruleJson.rank.ladderRule,
        ruleList: payload.ruleJson.rank.ruleList.map((item: any) => parsePresentContentData(item))
      }
    ),
    userScope: payload.userScope.split(',')
  }
  console.log(data, 'data')
  return data
}
const filterinvalidData = (data: any[]) => {
  if (!(data instanceof Array)) {
    return []
  }
  return data.filter((item) => item)
}
const spuIdsExchangeObj = (source: string) => {
  const data: {[id: number]: string} = JSON.parse(source)
  const result: {[id: number]: number[]} = {}
  for (const key in data) {
    result[key] = data[key].split(',').map((val) => Number(val))
  }
  return result
}

const spuIdsExchangeJson = (source: {[spuIds: number]: number[]}) => {
  const data: {[id: number]: string} = {}
  for (const key in source) {
    data[key] = source[key].join(',')
  }
  return JSON.stringify(data)
}

/** 满赠详情入参处理 */
export const handleFormData = (payload: Marketing.FormDataProps) => {
  console.log(payload, 'payload')
  const loop = payload.loop
  // loop.couponList && loop.couponList
  const data = {
    activityDescribe: payload.activityDescribe,
    title: payload.title,
    startTime: payload.startTime * 1000,
    endTime: payload.endTime * 1000,
    id: Number(payload.id),
    productIds: '1148',
    ruleJson: {
      loop: handlePresentContentData(loop),
      rank: {
        ladderRule: payload.rank.ladderRule,
        ruleList: payload.rank.ruleList.map((item) => handlePresentContentData(item))
      },
      /** 0-循环规则，1-阶梯规则 */
      type: payload.strategyType
    }
  }
  console.log(data, 'data')
  return data
}

const handlePresentContentData = (data: Marketing.PresentContentValueProps) => {
  return {
    chooseCount: data.chooseCount || 0,
    giftSkuJson: spuIdsExchangeJson(data.spuIds),
    giftCouponIds: (data.couponList && data.couponList.map((item) => item.id) || []).join(','),
    stageCount: data.stageCount || 0,
    type: data.type || 0
  }
}

const parsePresentContentData = (data: {
  promotionDiscountsSkuVOList: any[]
  couponListVOList: any[]
  giftSkuJson: string
}) => {
  return {
    ...data,
    skuList: filterinvalidData(data.promotionDiscountsSkuVOList),
    couponList: data.couponListVOList,
    spuIds: spuIdsExchangeObj(data.giftSkuJson)
  }
}