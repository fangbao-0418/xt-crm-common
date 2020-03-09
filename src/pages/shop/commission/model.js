import { Message } from 'antd';
import * as api from './api';
import { levelList } from './config';

export default {
  namespace: 'shop.commission',
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
      const res = await api.getList(payload);

      const { level, parentCategoryId } = payload;
      const { levelList } = rootState['shop.commission']
      const curentLevel = levelList.find(levelItem => levelItem.id === level)

      if (!curentLevel) return

      curentLevel.data = Array.isArray(res.data) ? res.data : []
      curentLevel.parentId = parentCategoryId;
      curentLevel.init = true;

      dispatch({
        type: 'shop.commission/saveDefault',
        payload: {
          levelList: [...levelList]
        }
      });
    },

    // 获取类目详情
    async getDetai(payload) {
      const res = await api.getDetai(payload);
      console.log(res)
      dispatch({
        type: 'shop.commission/saveDefault',
        payload: {
          currentCategory: res,
          configModal: {
            visible: true
          }
        }
      });
    },

    // 编辑类目
    async updateCategory(payload, state) {
      const res = await api.editCategory(payload);
      if (res.success) {
        dispatch['shop.commission'].getList();
        Message.success('编辑成功');
      }
    }
  })
}