import * as api from './api';


export default {
    namespace: 'intercept.detail.order',
    state: {
        orderInfo: {
            records: [],
            total: 0,
            current: 1,
            size: 10
        }
    },
    effects: dispatch => ({
        async getData(payload) {
            const orderInfo = await api.getData(payload);
            dispatch({
                type: 'intercept.detail.order/saveDefault',
                payload: {
                    orderInfo: orderInfo || {}
                }
            });
        }
    })
}