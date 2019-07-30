import { Message } from 'antd';
import * as api from './api';

export default {
    namespace: 'auth.member',
    state: {
        visible: false,
        roleConfig: {},
        userConfig: {},
        currentUserInfo: {},
    },
    effects: dispatch => ({
        // 角色列表
        async getRoleList(payload) {
            const roleConfig = await api.getRoleList(payload);
            dispatch({
                type: 'auth.member/saveDefault',
                payload: {
                    roleConfig
                }
            })
        },

        // 用户列表
        async getUserList(payload) {
            const userConfig = await api.getUserList(payload);
            dispatch({
                type: 'auth.member/saveDefault',
                payload: {
                    userConfig
                }
            })
        },
        // 添加用户
        async addUser(base, state, roleId) {
            const res = await api.addUser(base) || {};
            if (res.id) {
                const params = {
                    userIds: [res.id],
                    ...roleId
                };
                const res2 = await api.addPermission(params);
                if (res2) {
                   Message.success('新增成功!');
                   dispatch['auth.member'].getUserList({
                        page: 1,
                        pageSize: 10
                    });
                }
            }
        },
        // 获取用户详情
        async getUserInfo(payload, state, callback) {
            const currentUserInfo = await api.getUserInfo(payload);
            // dispatch['auth.member'].saveDefault({
            //     currentUserInfo
            // });
            if(callback) callback(currentUserInfo);
        },
        // 编辑用户
        async editUser(payload, state, roleId = {}) {
            const res = await api.editUser(payload);
            let res2 = '';
            if (res && roleId.roleId) {
               res2 = await api.addPermission({
                userIds: [payload.id],
                ...roleId
               });
            }
            if (res2 === true || res === true) {
                Message.success('更新成功!');
                dispatch['auth.member'].getUserList({
                    page: 1,
                    pageSize: 10
                });
            }
        }
    })
}