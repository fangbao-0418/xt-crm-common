import { message } from 'antd';
import * as api from './api';

export default {
  namespace: 'auth.member',
  state: {
    visible: false,
    roleConfig: {},
    userConfig: {},
    currentUserInfo: {},
    permissionVisible: false,
    selectedRowKeys: []
  },
  effects: dispatch => ({
    // 角色列表
    async getRoleList(payload) {
      const roleConfig = await api.getRoleList(payload);
      dispatch({
        type: 'auth.member/saveDefault',
        payload: {
          roleConfig
        }
      });
    },

    // 用户列表
    async getUserList(payload) {
      const userConfig = await api.getUserList(payload);
      dispatch({
        type: 'auth.member/saveDefault',
        payload: {
          userConfig
        }
      });
    },
    // 添加用户
    async addUser(base) {
      const res = (await api.addUser(base)) || {};
      if (res.id) {
        message.success('新增成功!');
        dispatch['auth.member'].getUserList({
          page: 1,
          pageSize: 10
        });
      }
    },
    // 获取用户详情
    async getUserInfo(payload, state, callback) {
      const currentUserInfo = await api.getUserInfo(payload);
      if (callback) callback(currentUserInfo);
    },
    // 编辑用户
    async editUser(payload) {
      const res = await api.editUser(payload);
      if (res) {
        message.success('更新成功!');
        dispatch['auth.member'].getUserList({
          page: 1,
          pageSize: 10
        });
      }
    },
    // 保存用户角色组
    async saveRolesToUser(payload, state) {
      const res = await api.addPermission({
        userIds: state['auth.member'].currentUserInfo.id,
        roleIds: state['auth.member'].selectedRowKeys
      });
      if (res) {
        message.success('权限保存成功!');
        dispatch['auth.member'].saveDefault({
          permissionVisible: false
        });
      }
    },

    async getUserRoles(payload) {
      const res = await api.getUserRoles({
        id: payload.id
      });
      if (res && res.length) {
        dispatch['auth.member'].saveDefault({
          selectedRowKeys: res.map(item => item.id)
        });
      }
    }
  })
};
