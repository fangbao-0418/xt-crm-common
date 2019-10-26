import Enum from './enum'
// 订单状态
export default new Enum([
  { key: -1, val: '售后' },
  { key: 10, val: '关闭' },
  { key: 20, val: '完成' },
  { key: 30, val: '已发货' },
  { key: 40, val: '已收货' },
  { key: 50, val: '待发货' },
  { key: 60, val: '待付款' }
])