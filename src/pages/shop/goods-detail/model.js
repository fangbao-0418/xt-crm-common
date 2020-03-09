import { getGoodsInfo } from './api';

const namespace = 'shop.goods.detail';
export default {
  namespace,
  state: {
    goodsInfo: {}
  },
  effects: (dispatch) => ({
    async getGoodsInfo(data) {
      const goodsInfo = await getGoodsInfo(data);
      dispatch[namespace].saveDefault({ goodsInfo });
    }
  })
};
