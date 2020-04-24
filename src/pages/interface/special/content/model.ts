/*
 * @Date: 2020-03-16 14:01:18
 * @LastEditors: fangbao
 * @LastEditTime: 2020-04-24 15:48:31
 * @FilePath: /xt-wms/Users/fangbao/Documents/xituan/xt-crm/src/pages/interface/special/content/model.ts
 */
import * as api from './api'
export const namespace = 'home.setting.specialContent'
export default {
  namespace,
  state: {
    /** 选择商品弹框显隐 */
    transferGoodsVisible: false,
    /** 活动下所有商品列表 */
    goodsListByCurrentActivity: [],
    detail: {
      list: []
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
          list: []
        },
      }
    },
    changeDetail: (state: any, payload: any) => {
      console.log(payload, 'payload')
      payload = {
        ...payload,
        list: [
          {
            type: 4
          }
        ]
      }
      return {
        ...state,
        detail: payload
      }
    },
  },
  effects: {
    async fetchDetail ({ id, cb }: any) {
      const result = await api.queryFloorDetail(id)
      if (!result) {
        return
      }
      APP.dispatch({
        type: `${namespace}/changeDetail`,
        payload: result
      })
      if (cb) {
        cb(result)
      }
    },
    async getGoodsListByActivityId(param: any) {
      const result = await api.getGoodsListByActivityId(param);
      if (result) {
        (this as any).saveDefault({
          transferGoodsVisible: true,
          goodsListByCurrentActivity: result || [],
        });
      }
    }

  },
}
