import * as api from './api';

export default {
  namespace: 'shop.boss',
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
    usersInfo: {} // 查询的用户信息
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

    async checkUser(payload) {
      const usersInfo = await api.checkUser(payload);
      console.log('这里查询用户', payload)
      dispatch({
        type: 'shop.boss/saveDefault',
        payload: {
          usersInfo,
          batchModal: {
            visible: false
          },
          checkModal: {
            visible: true
          }
        }
      });
    },

    async openShop(payload) {
      await api.checkUser(payload);
      console.log('这里开通小店', payload)
    },

    async closeShop(payload) {
      await api.checkUser(payload);
      console.log('这里关闭小店', payload)
      dispatch({
        type: 'shop.boss/saveDefault',
        payload: {
          switchModal: {
            visible: false
          }
        }
      });
      dispatch['shop.boss'].getBossList({
        page: 1
      });
    }
  })
}