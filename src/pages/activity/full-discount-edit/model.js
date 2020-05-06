import { message } from 'antd';
import * as api from './api';
export const namespace = 'activity.full-discount-edit'

export default {
  namespace,
  state: {
    discountModal: { // 优惠信息设置模态框
      visible: false,
      title: '优惠条件'
    },
    goodsModal: { // 商品选择模态框
      visible: false,
      title: '商品查询'
    },
    activityModal: {  // 活动选择模态框
      visible: false,
      title: '活动查询'
    },
    preRulesMaps: {}, // 上一次配置的优惠条件数据
    preProductRefMaps: {}, // 上一次选择的活动商品选择数据
    currentRuleIndex: -1 // 当前规则索引
  },
  effects: (dispatch) => ({
    async addFullDiscounts(payload) {
      await api.addFullDiscounts(payload);
      message.success('活动创建成功')
      APP.history.replace('/activity/full-discount')
    },

    async updateFullDiscounts(payload) {
      await api.updateFullDiscounts(payload);
      message.success('活动编辑成功')
      APP.history.replace('/activity/full-discount')
    }
  })
}