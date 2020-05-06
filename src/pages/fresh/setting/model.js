import * as api from './api'
import { message } from 'antd'

export default {
  namespace: 'fresh.settings',
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
    async setSetting (param) {
      const setting = await api.setSetting(param)
      if (setting) {
        this.updateVal({ value: param.productStyle })
      }
    }
  })
}
