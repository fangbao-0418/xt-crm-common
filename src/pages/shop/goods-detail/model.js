import { getGoodsInfo } from './api';

const namespace = 'shop.goods.detail';
export default {
  namespace,
  state: {
    goodsInfo: null
  },
  effects: (dispatch) => ({
    async getGoodsInfo(data) {
      const goodsInfo = await getGoodsInfo(data);
      dispatch[namespace].saveDefault({ goodsInfo });
    }
  })
};
