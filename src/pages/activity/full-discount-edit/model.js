export const namespace = 'activity.full-discount-edit'

export default {
  namespace,
  state: {
    discountModal: {
      visible: false,
      title: '优惠条件'
    },
    goodsModal: {
      visible: false,
      title: '商品查询'
    },
    activityModal: {
      visible: false,
      title: '活动查询'
    },
    currentRuleIndex: -1 // 当前规则索引
  },
  effects: {}
}