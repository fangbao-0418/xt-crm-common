import * as api from './api';
import { message } from 'antd';
export const namespace = 'shop.boss'

export default {
  namespace,
  state: {
    bossData: {}, // 店长列表数据
    currentBoss: null, // 当前店长数据
    switchModal: { // 开启关闭模态框数据
      visible: false
    },
    batchModal: { // 批量输入手机号表单模态框
      visible: false
    },
    checkModal: { // 查询用户信息模态框
      visible: false
    },
    checkArr: [], // 查询的用户信息
    phones: ''
  },
  effects: dispatch => ({
    // 获取boss列表
    async getBossList(payload) {
      const bossData = await api.getBossList(payload);
      console.log('这里获取内容', payload)
      dispatch({
        type: 'shop.boss/saveDefault',
        payload: {
          bossData
        }
      });
    },

    // 检查用户
    async checkUser(payload) {
      const checkArr = await api.checkUser(payload);
      dispatch({
        type: 'shop.boss/saveDefault',
        payload: {
          checkArr,
          batchModal: {
            visible: false
          },
          checkModal: {
            visible: true
          },
          phones: payload.phones
        }
      });
    },

    async createShop(payload) {
      await api.createShop(payload);
      message.success('批量开通小店成功！')
      dispatch['shop.boss'].getBossList({
        page: 1,
        pageSize: 10
      });
    },

    async openShop(payload) {
      await api.openShop(payload);
      message.success('开通小店成功！')
      dispatch['shop.boss'].getBossList({
        page: 1,
        pageSize: 10
      });
    },

    async closeShop(payload) {
      await api.closeShop(payload);
      message.success('关闭小店成功！')
      dispatch({
        type: 'shop.boss/saveDefault',
        payload: {
          switchModal: {
            visible: false
          }
        }
      });
      dispatch['shop.boss'].getBossList({
        page: 1,
        pageSize: 10
      });
    }
  })
}