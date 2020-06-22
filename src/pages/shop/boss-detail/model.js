import { message } from 'antd'
import { getShopInfo, auditShop, getApplyList } from './api'

const namespace = 'shop.boss.detail'
export default {
  namespace,
  state: {
    detail: null,
    list: [], // 审核列表
    passModal: { // 审核不通过模态框数据
      visible: false
    }
  },
  effects: (dispatch) => ({
    async getShopInfo (data) {
      const detail = await getShopInfo(data)
      dispatch({
        type: `${namespace}/saveDefault`,
        payload: {
          detail
        }
      })
    },

    async getApplyList (data) {
      const list = await getApplyList(data)
      dispatch({
        type: `${namespace}/saveDefault`,
        payload: {
          list: list || []
        }
      })
    },

    async passShop (payload, rootState, callback) {
      // await auditShop({
      //   ...payload,
      //   auditResult: 1
      // })
      message.success('已审核通过')
      callback && callback()
    },

    async noPassShop (payload, rootState, callback) {
      await auditShop({
        ...payload,
        auditResult: 0
      })
      dispatch({
        type: `${namespace}/saveDefault`,
        payload: {
          passModal: {
            visible: false
          }
        }
      })
      message.success('已审核不通过')
      callback && callback()
    }
  })
}
