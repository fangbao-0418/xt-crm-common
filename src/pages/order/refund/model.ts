import { message } from 'antd';
import { refundOperate, refundDetail, againRefund, closeOrder, confirmReceipt, cancelRefund } from '../api'
export const namespace: string = 'refund.model';
export default {
  namespace,
  state: {
    refundReason: {}
  },
  effects: (dispatch: APP.DispatchProps) => ({
    /**
     * 获取售后单详情
     */
    getDetail: async (payload: any = {}) => {
      const res = await refundDetail(payload)
      dispatch({
        type: `${namespace}/saveDefault`,
        payload: { data: res.data || {} },
      })
    },
    /**
     * 售后审核
     */
    auditOperate: async (payload: any = {}) => {
      const res: any = await refundOperate(payload);
      if (res) {
        message.info('操作成功');
      }
      dispatch({
        type: `${namespace}/getDetail`,
        payload: {id: payload.id},
      })
    },
    /**
     * 重新退款
     */
    againRefund: async (payload: any = {}) => {
      const res = await againRefund(payload.id, payload.info);
      if (res && res.success) {
        message.success('退款完成')
      }
      dispatch({
        type: `${namespace}/getDetail`,
        payload: {id: payload.id},
      })
    },
    /**
     * 线下退款
     */
    closeOrder: async (payload: any = {}) => {
      const res = await closeOrder(payload.id, payload.info);
      if (res) {
        message.success('退款完成')
      }
      dispatch({
        type: `${namespace}/getDetail`,
        payload: {id: payload.id},
      })
    },
    /**
     * 换货、确认收货
     */
    confirmReceipt: async (payload: any = {}) => {
      const res = await confirmReceipt(payload.id);
      if (res) {
        message.success('完成售后成功');
      }
      dispatch({
        type: `${namespace}/getDetail`,
        payload: {id: payload.id},
      })
    },
    /**
     * 取消售后
     */
    cancelRefund: async (payload: any = {}) => {
      const res = await cancelRefund(payload.id);
      if (res) {
        message.success('取消售后成功');
      }
      dispatch({
        type: `${namespace}/getDetail`,
        payload: {id: payload.id},
      })
    }
  })
}