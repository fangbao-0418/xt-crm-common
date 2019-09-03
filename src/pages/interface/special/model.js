import * as api from './api'
export const namespace =  'home.setting.special'
export default {
  namespace,
  state: {
    detail: {
      list: []
    }
  },
  reducers: {
    changeDetail: (state, payload) => {
      return {
        ...state,
        detail: payload
      }
    }
  },
  effects: {
    async fetchDetail ({id, cb}) {
      const result = await api.fetchSpecialDetial(id)
      if (!result) return
      this.changeDetail(result)
      if (cb) {
        cb(result)
      }
    }
  }
}