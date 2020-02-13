import * as api from './api';
import { message } from 'antd';
import * as LocalStorage from '@/util/localstorage';

export default {
  namespace: 'settings',
  state: {},
  effects: () => ({
    // 角色列表
    async sendCode() {
      await api.sendCode();
    },
    async changePassword(param) {
      const res = await api.changePassword(param);
      if (res) {
        LocalStorage.clear();
        APP.history.push('/login');
        message.success('密码修改成功,请重新登录');
      }
    }
  })
};
