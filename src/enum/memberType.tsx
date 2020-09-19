import Enum from './enum'

export default new Enum([
  { key: 0, val: '非会员' },
  { key: 10, val: '团长' },
  { key: 20, val: '区长' },
  { key: 30, val: '合伙人' },
  { key: 40, val: '管理员' },
  { key: 50, val: '公司' }
])

/** 好店用户等级枚举 */
export const HDMemberType = new Enum([
  { key: 0, val: '普通会员' },
  { key: 10, val: '正式店主' },
  { key: 20, val: '高级店主' },
  { key: 30, val: '服务商' },
  { key: 40, val: '管理员' },
  { key: 50, val: '公司' }
])