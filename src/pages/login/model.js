import { login, logout } from './api';
import * as LocalStorage from '@/util/localstorage';

function formatUrlList(arr = [], base) {
    const results = base || [];
    for (let i = 0; i < arr.length; i += 1) {
        const item = arr[i];
        if (item.subMenus.length) {
            formatUrlList(item.subMenus, results)
        }
        item.type === 0 && item.path  && results.push(item.path)
    }
    return results;
}

export default {
    namespace: 'login',
    state: {
        userInfo: {}
    },
    effects: dispatch => ({
        async login(payload, state) {
            const response = await login(payload.params) || {};
            sessionStorage.setItem('token', response.token);
            if (response && response.username) {
                LocalStorage.put('user', response);
                response.role && LocalStorage.put('role', response.role);
                dispatch.login.saveDefault({
                    userInfo: response
                });
                dispatch['layout'].getMenuList(response.role);
                // const menulist = response.role ? response.role.menus : [];
                // const urllist = response.role && Array.isArray(response.role.menus) ? formatUrlList(response.role.menus) : [];
                // console.log(urllist, response.role.menus);
                // LocalStorage.put('menulist', menulist);
                // LocalStorage.put('urllist', urllist);
                // 没有发生异常，跳转至主页
                payload.history.push('/home');
            }
        }
    })
}
