import * as api from './api'
import { message, Modal } from 'antd'
export const namespace = 'shop.boss'

const { confirm } = Modal

export default {
  namespace,
  state: {
    bossData: {}, // 店长列表数据
    currentBoss: null, // 当前店长数据
    switchModal: { // 开启关闭模态框数据
      visible: false
    },
    passModal: { // 审核不通过模态框数据
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
    async getBossList (payload) {
      const bossData = await api.getBossList(payload)
      console.log('这里获取内容', payload)
      dispatch({
        type: 'shop.boss/saveDefault',
        payload: {
          bossData
        }
      })
    },

    // 检查用户
    async checkUser (payload) {
      const checkArr = await api.checkUser(payload)
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
      })
    },

    async createShop (payload) {
      await api.createShop(payload)
      message.success('批量开通店铺成功！')
      dispatch({
        type: 'shop.boss/saveDefault',
        payload: {
          checkModal: {
            visible: false
          }
        }
      })
      const localPayload = APP.fn.getPayload(namespace) || {}
      dispatch['shop.boss'].getBossList({
        ...localPayload,
        page: 1,
        pageSize: 10
      })
    },

    async openShop (payload, rootState) {
      await api.openShop(payload)
      const bossData = rootState['shop.boss'].bossData
      message.success('开通店铺成功！')
      const localPayload = APP.fn.getPayload(namespace) || {}
      dispatch['shop.boss'].getBossList({
        ...localPayload,
        page: bossData.current,
        pageSize: bossData.size
      })
    },

    async closeShop (payload, rootState) {
      try {
        const res = await api.closeShop(payload)
        console.log(res)
        const bossData = rootState['shop.boss'].bossData
        message.success('关闭店铺成功！')
        dispatch({
          type: 'shop.boss/saveDefault',
          payload: {
            switchModal: {
              visible: false
            }
          }
        })
        const localPayload = APP.fn.getPayload(namespace) || {}
        dispatch['shop.boss'].getBossList({
          ...localPayload,
          page: bossData.current,
          pageSize: bossData.size
        })
      } catch (error) {
        // if (error?.code === '100100') {
        //   confirm({
        //     title: '关闭店铺失败！',
        //     content: '商家有商品正在参加平台活动，请处理完成后再关店。',
        //     okText: '下载活动商品表',
        //     onOk () {
        //       console.log('OK')
        //     },
        //     onCancel () {
        //       console.log('Cancel')
        //     }
        //   })
        // }
      }
    },

    async passShop (payload, rootState) {
      await api.auditShop({
        ...payload,
        auditResult: 1
      })
      const bossData = rootState['shop.boss'].bossData
      message.success('已审核通过')
      const localPayload = APP.fn.getPayload(namespace) || {}
      dispatch['shop.boss'].getBossList({
        ...localPayload,
        page: bossData.current,
        pageSize: bossData.size
      })
    },

    async noPassShop (payload, rootState) {
      await api.auditShop({
        ...payload,
        auditResult: 0
      })
      dispatch({
        type: 'shop.boss/saveDefault',
        payload: {
          passModal: {
            visible: false
          }
        }
      })
      const bossData = rootState['shop.boss'].bossData
      message.success('已审核不通过')
      const localPayload = APP.fn.getPayload(namespace) || {}
      dispatch['shop.boss'].getBossList({
        ...localPayload,
        page: bossData.current,
        pageSize: bossData.size
      })
    }
  })
}