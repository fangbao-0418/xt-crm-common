
import * as api from './api';

export default {
    namespace: 'finance.order',
    state: {
        tableConfig: {}
    },
    effects: dispatch => ({
        async exportFile(payload) {
            await api.exportFile(payload);
        }
    })
}