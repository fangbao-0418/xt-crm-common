import { getGoodsInfo, auditGoods } from './api';

export const namespace = 'shop.pop.goods.detail';
export default {
  namespace,
  state: {
    goodsInfo: null
  },
  effects: (dispatch) => ({
    async getGoodsInfo(data) {
      const goodsInfo = await getGoodsInfo(data);
      dispatch[namespace].saveDefault({ goodsInfo });
    },

    async auditGoods({ productPoolId, channel, auditStatus, auditInfo }) {
      await auditGoods({
        auditStatus,
        auditInfo,
        channel,
        ids: [+productPoolId]
      });
      dispatch[namespace].getGoodsInfo({
        productPoolId
      });
    },
  })
};
