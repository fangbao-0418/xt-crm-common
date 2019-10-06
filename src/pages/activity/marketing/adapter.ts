/** 处理活动列表数据 */
export const handleListData = (data: any[]) => {
  data.map((item) => {
    let statusText = '已关闭'
    let canClose = true
    let canShow = false
    let canEdit = true
    const now = new Date().getTime()
    if (item.status !== 0) {
      statusText = '未开始'
      if (item.startTime >= now) {
        statusText = '进行中'
        canShow = true
      }
      if (item.endTime > now) {
        canClose = false
        statusText = '已结束'
        canEdit = false
      }
    } else {
      canClose = false
      canShow = true
      canEdit = false
    }
    item.statusText = statusText
    item.canShow = canShow
    item.canClose = canClose
    item.canEdit = canEdit
    return item
  })
  return data
}

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
  },
  promotionDiscountsSpuVOS: any[]
}) => {
  const data = {
    ...payload,
    product: getProductData(payload.promotionDiscountsSpuVOS),
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

/** 过滤无效数据 */
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
  const product = payload.product || {
    spuIds: {}
  }
  const data = {
    activityDescribe: payload.activityDescribe,
    title: payload.title,
    startTime: payload.startTime * 1000,
    endTime: payload.endTime * 1000,
    id: payload.id !== undefined ? Number(payload.id) : '',
    productIds: Object.keys(product.spuIds).join(','),
    ruleJson: {
      loop: handlePresentContentData(loop),
      rank: {
        ladderRule: payload.rank.ladderRule,
        ruleList: payload.rank.ruleList.map((item) => handlePresentContentData(item))
      },
      /** 0-循环规则，1-阶梯规则 */
      type: payload.strategyType
    },
    userScope: payload.userScope && payload.userScope.join(',')
  }
  return data
}

/** 处理赠品内容数据 */
const handlePresentContentData = (data: Marketing.PresentContentValueProps) => {
  data = Object.assign({
    chooseCount: 0,
    couponList: [],
    stageCount: 0,
    type: 0
  }, data)
  return {
    chooseCount: data.chooseCount || 0,
    giftSkuJson: spuIdsExchangeJson(data.spuIds),
    giftCouponIds: (data.couponList && data.couponList.map((item) => item.id) || []).join(','),
    stageCount: data.stageCount || 0,
    type: data.type || 0
  }
}

/** 解析接口返回赠品内容数据 */
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