import { login } from './api';
import * as LocalStorage from '@/util/localstorage';

export default {
  namespace: 'login',
  state: {
    userInfo: {}
  },
  effects: dispatch => ({
    async login(payload) {
      const response = (await login(payload.params)) || {};
      if (response && response.username) {
        LocalStorage.put('token', response.token);
        LocalStorage.put('user', response);
        dispatch.login.saveDefault({
          userInfo: response
        });
        payload.history.push('/home');
      }
    }
  })
};
