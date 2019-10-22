import { Message } from 'antd';
import * as api from './api';

export default {
    namespace: 'order.intercept.config',
    state: {
        switchOn: false,
        rule: -1
    },
    effects: dispatch => ({
        async getConfig() {
            const res = await api.getConfig();
            return res;
        },
        async setConfig(payload) {
            await api.setConfig({ disposeRule: payload }).then((res) => {
                if (res) {
                    dispatch['order.intercept.config']['saveDefault']({
                        switchOn: payload === -1 ? false : true,
                        rule: payload
                    })
                }
            });
        }
    })
}