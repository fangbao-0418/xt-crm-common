import { Message } from 'antd'
import * as api from './api'
export const namespace = 'user.userlist'

export default {
  namespace,
  state: {
    tableConfig: {
      records: [],
      total: 0
    },
    visible: false,
    excelDialogVisible: false,
    currentUserInfo: {}
  },
  effects: dispatch => ({
    async getData (payload) {
      const tableConfig = await api.getData(payload)
      dispatch({
        type: `${namespace}/saveDefault`,
        payload: {
          tableConfig: tableConfig || {}
        }
      })
    },
    async sendCode (payload) {
      const res = await api.sendCode(payload)
      if (res.success) {
        Message.success('发码成功')
        dispatch({
          type: `${namespace}/saveDefault`,
          payload: {
            visible: false
          }
        })
      }
    }
  })
}