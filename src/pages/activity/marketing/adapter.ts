/** 处理满赠活动列表数据 */
export const handleMarketingListData = (data: any[]) => {
  enum statusEnum {
    关闭 = 0,
    未开始 = 1,
    进行中 = 2,
    已结束 = 3
  }
  data.map((item) => {
    item.statusText = statusEnum[item.discountsStatus]
    return item
  })
  return data
}

/** 处理活动列表数据 */
export const handleActivityListData = (data: Marketing.ItemProps[]) => {
  enum activityTypeEnum {
    限时秒杀 = 1,
    今日拼团 = 2,
    礼包 = 3,
    激活码 = 4,
    地推专区= 5,
    体验团长专区 = 6,
    采购专区 = 7,
    买赠 = 8
  }
  data.map((item) => {
    item.activityTypeName = activityTypeEnum[item.type]
    return item
  })
  return data
}

/** 处理满赠详情接口返参 */
export const handleDetailReturnData = (payload: {
  userScope: string
  ruleJson: {
    loop: Marketing.PresentContentValueProps,
    rank: {
      ruleList: Marketing.PresentContentValueProps[],
      ladderRule: 0 | 1
    }
  },
  /** 赠品策略类型 0-阶梯规则, 1-循环规则 */
  ruleType: 0 | 1
  /** 活动 */
  referencePromotionVO: Marketing.ItemProps
  promotionDiscountsSpuVOS: Shop.ShopItemProps[]
}) => {
  const userScope = payload.userScope.split(',')
  if (userScopeIsAll(userScope)) {
    userScope.unshift('all')
  }
  const data = {
    ...payload,
    product: getProductData(payload.promotionDiscountsSpuVOS),
    activity: getActivityData(payload.referencePromotionVO),
    strategyType: payload.ruleType,
    loop: parsePresentContentData(payload.ruleJson.loop),
    rank: Object.assign({}, 
      {
        sort: 0,
        ladderRule: Number(payload.ruleJson.rank.ladderRule) || 0,
        ruleList: payload.ruleJson.rank.ruleList.map((item) => parsePresentContentData(item))
      }
    ),
    userScope
  }
  return data
}
/** 目标用户是否全选 */
const userScopeIsAll = (data: string[]) => {
  const all = ['40', '30', '20', '10', '2', '1']
  const result = all.every((item) => {
    return data.indexOf(item) > -1
  })
  return result
}
/** 选择商品数据转换 */
const getProductData = (data: Shop.ShopItemProps[]) => {
  data = data || []
  const spuIds: {[spuId: number]: number[]} = {}
  data.map((item) => {
    item.skuList = item.skuList || []
    spuIds[item.id] = []
  })
  return {
    spuList: data,
    spuIds
  }
}

/** 选择活动数据转换 */
const getActivityData = (data: Marketing.ItemProps) => {
  return {
    activityList: handleActivityListData(data ? [data] : [])
  }
}

/** 过滤无效数据 */
const filterinvalidData = (data: any[]) => {
  if (!(data instanceof Array)) {
    return []
  }
  return data.filter((item) => item)
}
const spuIdsExchangeObj = (source: string) => {
  const data: {[id: number]: string} = JSON.parse(source || '{}')
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
  const product = payload.product || {
    spuIds: {}
  }
  const activity = payload.activity
  const data = {
    activityDescribe: payload.activityDescribe,
    title: payload.title,
    startTime: payload.startTime * 1000,
    endTime: payload.endTime * 1000,
    id: payload.id !== undefined ? Number(payload.id) : '',
    referencePromotionId: (activity && activity.activityList || []).map((item) => item.id).join(','),
    // productIds: Object.keys(product.spuIds).join(','),
    ruleJson: {
      loop: handlePresentContentData(loop),
      rank: {
        ladderRule: payload.rank.ladderRule,
        ruleList: payload.rank.ruleList.map((item, index) => handlePresentContentData(item))
      }
    },
    ruleType: payload.strategyType,
    userScope: payload.userScope && payload.userScope.filter((code) => code !== 'all').join(','),
    sort: 0
  }
  return data
}

/** 处理赠品内容数据 */
const handlePresentContentData = (data: Marketing.PresentContentValueProps) => {
  data = Object.assign({
    chooseCount: 0,
    couponList: [],
    activityList: [],
    stageCount: 0,
    type: 0
  }, data)
  return {
    chooseCount: data.chooseCount || 0,
    giftSkuJson: spuIdsExchangeJson(data.spuIds),
    giftPromotionId: data.activityList.map(item => item.id).join(','),
    giftCouponIds: (data.couponList && data.couponList.map((item) => item.id) || []).join(','),
    stageCount: data.stageCount || 0,
    type: data.type || 0
  }
}

/** 解析接口返回赠品内容数据 */
const parsePresentContentData = (data: Marketing.PresentContentValueProps) => {
  return {
    ...data,
    skuList: filterinvalidData(data.promotionDiscountsSkuVOList),
    couponList: data.couponListVOList,
    activityList: handleActivityListData(data.promotionVO ? [data.promotionVO] : []),
    spuIds: spuIdsExchangeObj(data.giftSkuJson)
  }
}