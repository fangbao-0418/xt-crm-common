
import * as api from './api';

export default {
    namespace: 'finance.log',
    state: {
        tableConfig: {}
    },
    effects: dispatch => ({
        async getData(payload) {
            const tableConfig = await api.getData(payload);
            dispatch({
                type: 'finance.log/saveDefault',
                payload: {
                    tableConfig: tableConfig || {}
                }
            })
        },
        async exportFile(payload) {
            const tableConfig = await api.exportFile(payload);
            dispatch({
                type: 'finance.log/saveDefault',
                payload: {
                    tableConfig: tableConfig || {}
                }
            })
        }
    })
}