import { Message } from 'antd';
import * as api from './api';


export default {
    namespace: 'user.userlist',
    state: {
        tableConfig: {
            records: [],
            total: 0
        },
        visible: false,
        currentUserInfo: {}
    },
    effects: dispatch => ({
        async getData(payload) {
            const tableConfig = await api.getData(payload);
            dispatch({
                type: 'user.userlist/saveDefault',
                payload: {
                    tableConfig: tableConfig || {}
                }
            });
        },
        async sendCode(payload) {
            const res = await api.sendCode(payload);
            if (res.success) {
                Message.success('发码成功');
                dispatch({
                    type: 'user.userlist/saveDefault',
                    payload: {
                        visible: false
                    }
                })
            }
        }
    })
}