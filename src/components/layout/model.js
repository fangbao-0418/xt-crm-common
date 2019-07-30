import * as api from './api';
import { arrToTree, getItemById, getAllId } from '@/util/utils';
import * as LocalStorage from '@/util/localstorage';
import { Message } from 'antd';

export default {
    namespace: 'layout',
    state: {
        tree: [],
    },
    effects: dispatch => ({
        async getMenuList(payload) {
            const id = payload.id;
            if (id) {
                const [roleList = {}, menuList = {}] = await Promise.all([
                    api.getRoleInfo({ id }),
                    api.getMenuList()
                ]);
                if (roleList.length || menuList.length) {
                    const roleId = Array.isArray(roleList) ? roleList.filter(item => item.flag).map(item => item.id) : []; // 有权限的id集合(不包含父id)0:菜单,1:按钮
                    const allId = Array.isArray(menuList) ? getAllId(menuList, roleId) : [];  // 有权限的id集合（包括parentId）
                    const filterAllId = [...new Set(allId)]; // 将重复的父id筛选掉
                    const allItemFilted = filterAllId.map(id => getItemById(menuList, id)); // 根据id找对应的item
                    const tree = arrToTree(allItemFilted); // 将数组转化为树状结构
                    dispatch['layout'].saveDefault({
                        tree,
                    });

                    // 所有可以访问的url地址集合（暂时用不着）
                    // const permissionUrlList = allItemFilted.filter(item => item.path).map(item => item.path);
                    // console.log(allItemFilted, tree, permissionUrlList, 'list')
                    // LocalStorage.put('permissionList', permissionUrlList);
                } else {
                    dispatch['layout'].saveDefault({
                        tree: []
                    }); 
                }
            }
        },
        async logout() {
            const res = await api.logout();
            if (res === '退出成功') Message.success(res);
        }
    })
}