import * as api from './api';
import { arrToTree, getItemById, getAllId } from '@/util/utils';
import { Message } from 'antd';

export default {
  namespace: 'layout',
  state: {
    tree: [],
    roleList: []
  },
  effects: dispatch => ({
    async getMenuList(payload) {
      if (payload) {
        const userRoles = await api.getUserRoles({ id: payload.id });
        if (userRoles && userRoles.length) {
          const ids = userRoles.map(item => item.id);
          const [roleList = {}, menuList = {}] = await Promise.all([api.getRoleInfo({ ids }), api.getMenuList()]);
          if (roleList.length || menuList.length) {
            const roleId = Array.isArray(roleList) ? roleList.filter(item => item.flag).map(item => item.id) : []; // 有权限的id集合(不包含父id)0:菜单,1:按钮
            const allId = Array.isArray(menuList) ? getAllId(menuList, roleId) : []; // 有权限的id集合（包括parentId）
            const filterAllId = [...new Set(allId)]; // 将重复的父id筛选掉
            const allItemFilted = filterAllId.map(id => getItemById(menuList, id)); // 根据id找对应的item
            const tree = arrToTree(allItemFilted); // 将数组转化为树状结构
            dispatch['layout'].saveDefault({
              roleList,
              tree
            });
          } else {
            dispatch['layout'].saveDefault({
              roleList: [],
              tree: []
            });
          }
        }
      }
    }
  })
};
