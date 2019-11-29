import { message } from 'antd';
import * as api from './api';

export default {
  namespace: 'auth.intercept',
  state: {
    switchOn: false,
    rule: -1
  },
  effects: dispatch => ({
    async getConfig() {
      const res = await api.getConfig();
      if (res && res.success) {
        dispatch['auth.intercept']['saveDefault']({
          switchOn: res.data === -1 ? false : true,
          rule: res.data
        });
      }
    },
    async setConfig(payload) {
      const res = await api.setConfig({ disposeRule: payload });
      if (res) {
        message.destroy();
        message.success('设置成功');
        dispatch['auth.intercept']['saveDefault']({
          switchOn: payload === -1 ? false : true,
          rule: payload
        });
      }
    }
  })
};
