import * as api from './api'
import { message } from 'antd'
const namespace='fresh.settings'

export default {
  namespace,
  state: {
    value: 1
  },
  reducers: {
    updateVal (prev, data) {
      return { ...prev, ...data }
    }
  },
  effects: () => ({
    async getSetting () {
      const setting = await api.getSetting()
      if (setting) {
        this.updateVal({ value: setting.productStyle })
      }
    },
    async setSetting (param, state) {
      const { value }=state[namespace]
      const setting = await api.setSetting({ productStyle: value })
      if (setting) {
        message.success('保存成功')
      }
    }
  })
}
