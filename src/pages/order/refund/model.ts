import { message } from 'antd';
import { refundOperate, refundDetail, againRefund, closeOrder } from '../api'
export const namespace = 'refund.model';
export default {
  namespace: 'refund.model',
  state: {},
  effects: (dispatch: APP.DispatchProps) => ({
    getDetail: async (payload = {}) => {
      const res = await refundDetail(payload)
      dispatch({
        type: 'refund.model/saveDefault',
        payload: { data: res.data || {} },
      })
    },
    // 售后审核
    auditOperate: async (payload: any = {}) => {
      const res: any = await refundOperate(payload);
      if (res && res.success) {
        message.info('审核成功');
      }
      dispatch({
        type: 'refund.model/getDetail',
        payload: {id: payload.id},
      })
    },
    // 重新付款
    againRefund: async (payload: any = {}) => {
      const res = await againRefund(payload.id, payload.info);
      if (res && res.success) {
        message.success('退款完成')
      }
      dispatch({
        type: 'refund.model/getDetail',
        payload: {id: payload.id},
      })
    },
    // 关闭订单
    closeOrder: async (payload: any = {}) => {
      const res = await closeOrder(payload.id, payload.info);
      if (res.succuss) {
        message.success('退款完成')
      }
      dispatch({
        type: 'refund.model/getDetail',
        payload: {id: payload.id},
      })
    }
  })
}