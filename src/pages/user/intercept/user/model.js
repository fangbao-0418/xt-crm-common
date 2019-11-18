import * as api from './api';

const namespace = 'user.intercept.user';
export default {
  namespace,
  state: {
    data: {}
  },
  effects: dispatch => ({
    async getUserList(param) {
      const res = await api.getUserList(param);
      if (res) {
        dispatch[namespace]['saveDefault']({
          data: res
        });
      }
    },
    async closePrivilege(param) {
      const res = await api.closePrivilege(param);
      return res;
    },
    async openPrivilege(param) {
      const res = await api.openPrivilege(param);
      return res;
    },
    async batchOpenPrivilege(param) {
      const res = await api.batch0penPrivilege(param);
      return res;
    },
    async batchClosePrivilege(param) {
      const res = await api.batchClosePrivilege(param);
      return res;
    },
    async getPrivilegeByLevel(param) {
      const res = await api.getPrivilegeByLevel(param);
      return res;
    },
    async setPrivilegeByLevel(param) {
      const res = await api.setPrivilegeByLevel(param);
      return res;
    }
  })
};
