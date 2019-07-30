// import { dispatch } from '@rematch/core';
import * as api from './api';
import { parseQuery } from '@/util/utils';


export default {
    namespace: 'user.cdkey',
    state: {
        tableConfig: {
            records: [],
            total: 0
        }
    },
    effects: dispatch => ({
        async getData(payload = {}) {
            const tableConfig = await api.getData(payload);
            dispatch({
                type: 'user.cdkey/saveDefault',
                payload: {
                    tableConfig: tableConfig || {}
                }
            });
        },
        async updateStatus(payload, state, formParams = {}) {
            const res = await api.updateStatus(payload);
            if (res.success) {
                const params = parseQuery();
                dispatch['user.cdkey'].getData({
                    params: {
                        page: params.page || 1,
                        pageSize: params.pageSize || 10,
                        ...formParams
                    }
                })
            }
        }
    })
}
