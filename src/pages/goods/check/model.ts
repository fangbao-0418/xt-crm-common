import * as api from './api'
export const namespace =  'goods.check'
export default {
  namespace,
  state: {
    list: []
  },
  reducers: {
    '@@init': () => {
      console.log('init')
      return {
        list: []
      }
    }
  },
  effects: {
    async fetchList ({cb, ...data}: any) {
      const result = await api.getGoodsCheckList(data);
      if (!result) return
      if (cb) {
        cb(result)
      }
    }
  }
}