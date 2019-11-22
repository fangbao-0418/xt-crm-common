import { Message } from 'antd';
import { arrToTree } from '@/util/utils';
import * as api from './api';

export default {
  namespace: 'auth.role',
  state: {
    visible: false,
    roleConfig: [],
    menuList: [],
    currentRoleInfo: {}, //当前被编辑的角色
  },
  effects: dispatch => ({
    async getMenuList(_, state) {
      const res = await api.getMenuList();
      dispatch({
        type: 'auth.role/saveDefault',
        payload: {
          menuList: Array.isArray(res) ? arrToTree(res) : [],
        },
      });
    },
    async getRoleList(payload) {
      const roleConfig = await api.getRoleList(payload);
      dispatch({
        type: 'auth.role/saveDefault',
        payload: {
          roleConfig,
        },
      });
    },
    async getRoleInfo(payload, state, callback) {
      const data = await api.getRoleInfo({ id: payload.id });
      const currentRoleInfo = {
        ...payload,
        data: Array.isArray(data) ? data : [],
      };
      if (callback) callback(currentRoleInfo);
    },
    // 增加角色
    async addRole(payload, state) {
      const params = {
        // roleDesc: payload.roleDesc,
        roleName: payload.roleName,
      };
      const res = await api.addRole(params);
      if (res.id) {
        const res2 = await api.addPermisson({
          roleId: res.id,
          menuIds: payload.menuIds,
        });
        if (res2 === true) {
          Message.success('新增成功!');
          dispatch['auth.role'].getRoleList({
            page: 1,
            pageSize: 10,
          });
        }
      }
    },
    // 编辑角色
    async editRole(payload, state) {
      const params = {
        // roleDesc: payload.roleDesc,
        roleName: payload.roleName,
        id: payload.id,
      };
      const res = await api.editRole(params);
      if (res) {
        const res2 = await api.addPermisson({
          roleId: payload.id,
          menuIds: payload.menuIds,
        });
        if (res2 === true) {
          Message.success('更新成功!');
          dispatch['auth.role'].getRoleList({
            page: 1,
            pageSize: 10,
          });
        }
      }
    },
  }),
};
