import Enum from './enum'
// 订单状态
export default new Enum([
  { key: 10, val: '未付款' },
  { key: 20, val: '待发货' },
  { key: 25, val: '部分发货' },
  { key: 30, val: '已发货' },
  { key: 40, val: '已收货' },
  { key: 50, val: '完成' },
  { key: 60, val: '关闭' }
])
