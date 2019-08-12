import * as api from './api.js';
import { message } from 'antd';

export default {
  namespace: 'user.userinfo',
  state: {
    // 当前激活tab
    tab: 'userinfo',
    // 当前被编辑的用户信息
    currentData: {},
    // 用户信息
    userinfo: {},
    // 推荐的人
    recommenderConfig: {
      records: [],
      total: 100
    },
    // 我的团队
    teamConfig: {
      records: [],
      total: 100
    },
    // 收益列表
    incomeConfig: {

    },
    // 提现记录
    logConfig: {

    },
    inviteInfo: {

    },
    visible: false,
    visibleInvit: false,
  },
  effects: dispatch => ({
    async getUserInfo(payload) {
      const userinfo = await api.getUserInfo(payload);
      dispatch({
        type: 'user.userinfo/saveDefault',
        payload: {
          userinfo: userinfo || {}
        }
      });
    },
    async getRecommend(payload) {
      const recommenderConfig = await api.getRecommend(payload);
      dispatch({
        type: 'user.userinfo/saveDefault',
        payload: {
          recommenderConfig: recommenderConfig || {}
        }
      });
    },
    async getTeam(payload) {
      const teamConfig = await api.getTeam(payload);
      dispatch({
        type: 'user.userinfo/saveDefault',
        payload: {
          teamConfig: teamConfig || {}
        }
      });
    },
    async getIncome(payload) {
      const incomeConfig = await api.getIncome(payload);
      dispatch({
        type: 'user.userinfo/saveDefault',
        payload: {
          incomeConfig: incomeConfig || {}
        }
      });
    },
    async getLog(payload) {
      const logConfig = await api.getLog(payload);
      dispatch({
        type: 'user.userinfo/saveDefault',
        payload: {
          logConfig: logConfig || {}
        }
      });
    },
    async checkInvited(payload) {
      const logConfig = await api.checkInvited(payload);
      dispatch({
        type: 'user.userinfo/saveDefault',
        payload: {
          inviteInfo: logConfig || {}
        }
      });
    },
    cleanInviteInfo() {
      dispatch({
        type: 'user.userinfo/saveDefault',
        payload: {
          inviteInfo: {}
        }
      });
    },
    async updateUserInfo(payload) {
      const res = await api.updateUserInfo(payload);
      if (res) { // true为成功
        dispatch({
          type: 'user.userinfo/saveDefault',
          payload: {
            visible: false
          }
        });
        dispatch['user.userinfo'].getUserInfo({
          memberId: payload.id
        });
        message.success('编辑成功!');
      }
    },
    async updateInviteUser(payload) {
      const res = await api.updateInviteUser(payload);
      if (res) { // true为成功
        dispatch({
          type: 'user.userinfo/saveDefault',
          payload: {
            visibleInvit: false,
            inviteInfo: {}
          }
        });
        dispatch['user.userinfo'].getUserInfo({
          memberId: payload.memberId
        });
        message.success('编辑成功!');
      }
    }
  }),
}