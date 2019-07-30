import * as api from './api';

const menuList = [
    {
        "id": 1,
        "name": "商品管理",
        "permission": "",
        "subMenus": [
            {
                "id": 2,
                "name": "在售商品",
                "permission": "",
                "subMenus": [
                    {
                        "id": 8,
                        "name": "修改备注",
                        "permission": "desc:add",
                        "subMenus": [],
                        "icon": "shangp",
                        "component": null,
                        "sort": 1,
                        "type": 1,
                        "keepAlive": 0,
                        "path": "",
                        "flag": false
                    }, {
                        "id": 81,
                        "name": "修改备注2",
                        "permission": "desc:add",
                        "subMenus": [],
                        "icon": "shangp",
                        "component": null,
                        "sort": 1,
                        "type": 1,
                        "keepAlive": 0,
                        "path": "",
                        "flag": false
                    }
                ],
                "icon": "shangp",
                "component": null,
                "sort": 1,
                "type": 0,
                "keepAlive": 0,
                "path": "",
                "flag": false
            }
        ],
        "icon": "shangp",
        "component": null,
        "sort": 1,
        "type": 0,
        "keepAlive": 0,
        "path": "",
        "flag": false
    }, {
        "id": 1,
        "name": "商品管理",
        "permission": "",
        "subMenus": [
            {
                "id": 2,
                "name": "在售商品",
                "permission": "",
                "subMenus": [
                    {
                        "id": 8,
                        "name": "修改备注",
                        "permission": "desc:add",
                        "subMenus": [],
                        "icon": "shangp",
                        "component": null,
                        "sort": 1,
                        "type": 1,
                        "keepAlive": 0,
                        "path": "",
                        "flag": false
                    }, {
                        "id": 81,
                        "name": "修改备注2",
                        "permission": "desc:add",
                        "subMenus": [],
                        "icon": "shangp",
                        "component": null,
                        "sort": 1,
                        "type": 1,
                        "keepAlive": 0,
                        "path": "",
                        "flag": false
                    }
                ],
                "icon": "shangp",
                "component": null,
                "sort": 1,
                "type": 0,
                "keepAlive": 0,
                "path": "",
                "flag": false
            }
        ],
        "icon": "shangp",
        "component": null,
        "sort": 1,
        "type": 0,
        "keepAlive": 0,
        "path": "",
        "flag": false
    }
];

export default {
    namespace: 'auth.config',
    state: {
        menuList: [],
        parentList: [],
        visible: false,
        allList: [],
        currentMenuInfo: {}
    },
    effects: dispatch => ({
        async getList(payload, state, key) {
            const data = await api.getList(payload);
            dispatch({
                type: 'auth.config/saveDefault',
                payload: {
                    [key]: Array.isArray(data) ? data : []
                }
            })
        },
        async addMenu(payload) {
            const res = await api.addMenu(payload);
            dispatch['auth.config'].getList({}, 'menuList')
        },
        async updateMenu(payload) {
            const res = await api.updateMenu(payload);
            dispatch['auth.config'].getList({}, 'menuList')
        },
        async delMenu(payload) {
            const res = await api.delMenu(payload);
            dispatch['auth.config'].getList({}, 'menuList')
        },
        async getMenuInfo(payload) {
            const currentMenuInfo = await api.getMenuInfo(payload);
            dispatch['auth.config'].saveDefault({
                currentMenuInfo: currentMenuInfo || {}
            })
        },
    })
}