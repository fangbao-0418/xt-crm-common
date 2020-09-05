import { getGoodsInfo, auditGoods } from './api';

const namespace = 'shop.pop.goods.detail';
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

    async auditGoods({ productPoolId, auditStatus, auditInfo }) {
      await auditGoods({
        auditStatus,
        auditInfo,
        ids: [+productPoolId]
      });
      dispatch[namespace].getGoodsInfo({
        productPoolId
      });
    },
  })
};
