import * as api from './api';
export const namespace = 'home.setting.special';
export default {
  namespace,
  state: {
    /** 选择商品弹框显隐 */
    transferGoodsVisible: false,
    /** 活动下所有商品列表 */
    goodsListByCurrentActivity: [],
    detail: {
      list: [],
      crmCoupons: [],
    },
  },
  reducers: {
    '@@init': () => {
      return {
        /** 选择商品弹框显隐 */
        transferGoodsVisible: false,
        /** 活动下所有商品列表 */
        goodsListByCurrentActivity: [],
        detail: {
          list: [],
          crmCoupons: [],
        },
      };
    },
    changeDetail: (state, payload) => {
      return {
        ...state,
        detail: payload,
      };
    },
  },
  effects: {
    async fetchDetail({ id, cb }) {
      const result = await api.fetchSpecialDetial(id);
      if (!result) return;
      this.changeDetail(result);
      if (cb) {
        cb(result);
      }
    },
    async getGoodsListByActivityId(param) {
      const result = await api.getGoodsListByActivityId(param);
      if (result) {
        this.saveDefault({
          transferGoodsVisible: true,
          goodsListByCurrentActivity: result || [],
        });
      }
    },
  },
};
