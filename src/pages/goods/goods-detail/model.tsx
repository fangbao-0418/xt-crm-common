import { getGoodsInfo } from './api';

const namespace = 'goods.goodsDetail';
export default {
  namespace,
  state: {
    goodsInfo: {}
  },
  effects: (dispatch: any) => ({
    async getGoodsInfo(data: any = {}) {
      const goodsInfo = await getGoodsInfo(data);
      dispatch[namespace].saveDefault({ goodsInfo });
    }
  })
};
