/** 状态(0:获取,1.使用 2过期) */
type MainType =  0 | 1 | 2

/** 类型(0:获取,1:下单获取,2:签到获取)(sub_type) */
type SubType = 0 | 1 | 2

/** 积分属性 */
export interface IntegralProps {
  /** 积分 */
  amount: number
  title: string
  /** 类型(0:获取,1.使用)(main_type) */
  mainType: MainType
  /** 类型(0:获取,1:下单获取,2:签到获取)(sub_type) */
  subType: SubType
  /** 场景文案 */
  subTypeDesc: string
  /** 过期时间(effective_time) */
  effectiveTime: number
  /** 创建时间(create_time) */
  createTime: number
  /** 修改时间(modify_time) */
  modifyTime: number
  /** 积分余额 */
  currentAmount: number
  /** 订单号(order_code) */
  orderCode: string
}

/** 积分列表搜索参数 */
interface IntegralListPayloadProps {
  memberId: number
  orderCode: string
  mainType: MainType
  createStartTime: number
  createEndTime: number
  page: number
  pageSize: number
}