/** 状态(0:获取,1.使用 2过期) */
type MainType =  0 | 1 | 2

/** 0:签到,1:分享,2:逛会场,3:看直播,4:下单返现,5:0元购,6:首购,7:话费充值,8:下单返现扣除,9:0元购扣除,10:首购扣除,11:订单下单抵扣,12:抵扣撤销 13:积分过期 */
type SubType = number

/** 积分属性 */
export interface IntegralProps {
  /** 积分 */
  amount: number
  title: string
  /** 类型(0:获取,1.使用)(main_type) */
  mainType: MainType
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