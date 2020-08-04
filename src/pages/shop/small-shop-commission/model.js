import { Message } from 'antd';
import * as api from './api';
import { levelList } from './config';

export default {
  namespace: 'shop.smallshopcommission',
  state: {
    levelList,
    currentCategory: null, // 当前选中编辑的类目
    configModal: {
      visible: false
    }
  },
  effects: dispatch => ({
    // 获取类目列表
    async getList(payload, rootState) {
      const list = await api.getList(payload);

      const { level, parentCategoryId, name } = payload;
      const { levelList } = rootState['shop.smallshopcommission']
      const curentLevel = levelList.find(levelItem => levelItem.id === level)

      if (!curentLevel) return

      curentLevel.data = Array.isArray(list) ? list : []
      curentLevel.parentId = parentCategoryId;
      curentLevel.name = name;
      curentLevel.init = true;

      dispatch({
        type: 'shop.smallshopcommission/saveDefault',
        payload: {
          levelList: [...levelList]
        }
      });
    },

    // 获取类目详情
    async getDetai(payload) {
      const res = await api.getDetai(payload);
      dispatch({
        type: 'shop.smallshopcommission/saveDefault',
        payload: {
          currentCategory: res,
          configModal: {
            visible: true
          }
        }
      });
    },

    // 编辑类目
    async updateCategory(payload, rootState) {
      const res = await api.editCategory(payload);
      if (res) {
        const { levelList } = rootState['shop.smallshopcommission']
        const curentLevel = levelList.find(levelItem => levelItem.id === payload.level)
        if (!curentLevel) return
        dispatch({
          type: 'shop.smallshopcommission/saveDefault',
          payload: {
            currentCategory: null,
            configModal: {
              visible: false
            }
          }
        });
        dispatch['shop.smallshopcommission'].getList({
          level: curentLevel.id,
          name: curentLevel.name,
          parentCategoryId: curentLevel.parentId
        });
        Message.success('编辑成功');
      }
    }
  })
}