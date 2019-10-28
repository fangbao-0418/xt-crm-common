import { message } from 'antd';
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
            if (res && res.success) {
                message.destroy();
                message.success('设置成功');
                dispatch['order.intercept.config']['saveDefault']({
                    switchOn: res.data === -1 ? false : true,
                    rule: res.data
                })
            }
        },
        async setConfig(payload) {
            const res = await api.setConfig({ disposeRule: payload });
            if (res) {
                message.destroy();
                message.success('设置成功');
                dispatch['order.intercept.config']['saveDefault']({
                    switchOn: payload === -1 ? false : true,
                    rule: payload
                })
            }
        }
    })
}