import { Message } from 'antd';
import { refundOperate, refundDetail } from '../api'

export default {
  namespace: 'refund.model',
  state: {},
  effects: dispatch => ({
    getDetail: async (payload = {}) => {
      const res = await refundDetail(payload)
      dispatch({
        type: 'refund.model/saveDefault',
        payload: { data: res.data || {} },
      })
    },
    // 售后审核
    auditOperate: async (payload = {}) => {
      const res = await refundOperate(payload);
      if (res.success) {
        Message.info('审核成功');
      } else {
        Message.info('审核失败');
      }
      dispatch({
        type: 'refund.model/getDetail',
        payload: {id: payload.id},
      })
    }
  })
}