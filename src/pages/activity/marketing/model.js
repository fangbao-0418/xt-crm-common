// import * as api from './api'
export const namespace =  'activity.marketing'
export default {
  namespace,
  state: {
    detail: {
      list: [],
      crmCoupons: []
    }
  },
  reducers: {
    '@@init': () => {
      console.log('init')
      return {
        detail: {
          list: [],
          crmCoupons: []
        }
      }
    },
    changeDetail: (state, payload) => {
      return {
        ...state,
        detail: payload
      }
    }
  },
  effects: {
    async fetchDetail ({id, cb}) {
      // const result = await api.fetchSpecialDetial(id)
      // if (!result) return
      // this.changeDetail(result)
      // if (cb) {
      //   cb(result)
      // }
    }
  }
}