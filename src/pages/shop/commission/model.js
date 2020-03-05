import { Message } from 'antd';
import * as api from './api';

export default {
  namespace: 'shop.commission',
  state: {
    level1List: [],
    level2List: [],
    level3List: []
  },
  effects: dispatch => ({
    async getList(payload, state) {
      const res = await api.getList(payload);
      const { level } = payload;
      const key = `level${level}List`;
      dispatch({
        type: 'shop.commission/saveDefault',
        payload: {
          [key]: Array.isArray(res.data) ? res.data : []
        }
      });
      // if (level === 1) {
      //     dispatch({
      //         type: 'shop.commission/saveDefault',
      //         payload: {
      //             level2List: [],
      //             level3List: []
      //         }
      //     });
      // }

      // if (level === 2) {
      //     dispatch({
      //         type: 'shop.commission/saveDefault',
      //         payload: {
      //             level3List: []
      //         }
      //     });
      // }
    },
    async addCategory(payload, state) {
      const res = await api.addCategory(payload);
      if (res.success) {
        Message.success('新增成功!');
        dispatch['shop.commission'].getList({
          level: payload.level,
          parentId: payload.parentId
        })
      }
    },
    async delCategory(payload, state, callback) {
      const res = await api.delCategory({
        categoryId: payload.id,

      });
      if (res.success) {
        dispatch['shop.commission'].getList({
          level: payload.level,
          parentId: payload.parentId
        });
        Message.success('删除成功!');
        callback && callback()
      }
    },
    async editCategory(payload, state, payload2) {
      const res = await api.editCategory(payload);
      if (res.success) {
        dispatch['shop.commission'].getList(payload2);
        Message.success('编辑成功');
      }
    }
  })
}