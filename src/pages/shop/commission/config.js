export const levelList = [{
  id: 1,
  name: '一级类目',
  data: [],
  currentSelectItem: null,
  parentId: 0,
  init: true // 渲染当前数据的react元素是否需要初始化
}, {
  id: 2,
  name: '二级类目',
  data: [],
  currentSelectItem: null,
  parentId: undefined,
  init: false
}, {
  id: 3,
  name: '三级类目',
  data: [],
  currentSelectItem: null,
  parentId: undefined,
  init: false
}];