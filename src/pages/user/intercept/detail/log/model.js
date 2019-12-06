import * as api from './api';
const namespace = 'intercept.detail.log';
export default {
  namespace,
  state: {
    sourceData: {}
  },
  reducers: {},
  effects: dispatch => ({
    async getData(payload) {
      const result = await api.getLogByMemberId(payload);
      dispatch({
        type: `${namespace}/saveDefault`,
        payload: {
          sourceData: result || {}
        }
      });
    }
  })
};
