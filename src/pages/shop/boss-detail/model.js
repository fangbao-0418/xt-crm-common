import { getShopInfo, auditShop } from './api'

const namespace = 'shop.boss.detail'
export default {
  namespace,
  state: {
    detail: {},
    passModal: { // 审核不通过模态框数据
      visible: false
    }
  },
  effects: (dispatch) => ({
    async getShopInfo (data) {
      const detail = await getShopInfo(data)
      dispatch[namespace].saveDefault({ detail })
    },

    async auditShop ({ productPoolId, auditStatus, auditInfo }) {
      await auditShop({
        auditStatus,
        auditInfo,
        ids: [+productPoolId]
      })
      dispatch[namespace].getGoodsInfo({
        productPoolId
      })
    }
  })
}
